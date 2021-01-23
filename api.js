const userDbSvc = require('./dbServices/userDbSvc');
const profileDbSvc = require('./dbServices/profileDbSvc');
var Db = require('./dbServices/userDbSvc');
var Profile = require('./models/profile');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var http = require('http');
var cors = require('cors');
const { request } = require('express');
const { stringify } = require('querystring');
const InitRefs = require('./models/initRefs');
const orderDbSvc = require('./dbServices/orderDbSvc');
var app = express();
app.use(cors());

var router = express.Router();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const audience = process.env.AUTH0_AUDIENCE;
const issuer = process.env.AUTH0_ISSUER;

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${issuer}/.well-known/jwks.json`
  }),
  audience: audience,
  issuer: `https://${issuer}/`,
  algorithms: ['RS256']
});

//app.use(jwtCheck);

app.use('/api',router);


router.use((request,response,next)=>{
    console.log('middleware')
    next();
})


var mapProfileFromDB = function(record){
    
    if(record==null | record.length==0)
        return null;
    return new Profile(
    record.fldId,
    record.fldFirstName,
    record.fldLastName,
    record.fldLocationId,
    record.fldDayOfBirth,
    record.fldUserId);
}

router.route('/orgnization/:code').get((request,response)=>{   
    let code = request.params.code;
    
     userDbSvc.getOrgnizationByCode (
        code
     ).then((result)=>{
         console.log("get orgnization final result:"+stringify(result));        
         var orgnizationDataSet = result.recordsets[0][0];
         console.log("orgnizationDataSet");
         console.log(orgnizationDataSet);
         key = Object.keys(orgnizationDataSet)[0];
         var orgnization = orgnizationDataSet[key]==''? null: JSON.parse(orgnizationDataSet[key])[0];
         response.json(orgnization);    
     }) 
})


router.route('/repo/Provinces/:countryId').get((request,response)=>{   
    let countryId = request.params.countryId;
    
     userDbSvc.getRefProvincesByCountryId(
        countryId
     ).then((result)=>{
         console.log("get ref provinces final result:"+stringify(result));
         
         var refProvincesDataSet = result.recordsets[0][0];

         console.log("getProvines");
         console.log(refProvincesDataSet);

         key = Object.keys(refProvincesDataSet)[0];
         var refProvinces = JSON.parse(refProvincesDataSet[key]);

         response.json(refProvinces);    
     }) 
})


router.route('/repo/refData').get((request,response)=>{   

    userDbSvc.getRefData(
    ).then((result)=>{


        var availableMenuItemsDataSet = result.recordsets[0][0];
        var key = Object.keys(availableMenuItemsDataSet)[0];
        var availableMenuItems = JSON.parse(availableMenuItemsDataSet[key]);  
        
        var refCondimentDataSet = result.recordsets[1][0];
            key = Object.keys(refCondimentDataSet)[0];
        var refCondiment = JSON.parse(refCondimentDataSet[key]);

        var refCountryDataSet = result.recordsets[2][0];
        key = Object.keys(refCountryDataSet)[0];
        var refCountry = JSON.parse(refCountryDataSet[key]);

        var refDrinkDataSet = result.recordsets[3][0];
        key = Object.keys(refDrinkDataSet)[0];
        var refDrink = JSON.parse(refDrinkDataSet[key]);

        var refJuiceDataSet = result.recordsets[4][0];
        key = Object.keys(refJuiceDataSet)[0];
        var refJuice = JSON.parse(refJuiceDataSet[key]);

        var refSideDataSet = result.recordsets[5][0];
        key = Object.keys(refSideDataSet)[0];
        var refSide = JSON.parse(refSideDataSet[key]);

        var refMaterialResDataSet = result.recordsets[6][0];
        key = Object.keys(refMaterialResDataSet)[0];
        var refMaterialRes = JSON.parse(refMaterialResDataSet[key]);

        var refMenuItemTypeDataSet = result.recordsets[7][0];
        key = Object.keys(refMenuItemTypeDataSet)[0];
        var refMenuItemType = JSON.parse(refMenuItemTypeDataSet[key]);

        var refMenuItemSubTypeDataSet = result.recordsets[8][0];
        key = Object.keys(refMenuItemSubTypeDataSet)[0];
        var refMenuItemSubType = JSON.parse(refMenuItemSubTypeDataSet[key]);

        var refLocationDataSet = result.recordsets[9][0];
        key = Object.keys(refLocationDataSet)[0];
        var refLocation = JSON.parse(refLocationDataSet[key]);

        var initRefs = new InitRefs(availableMenuItems,
            refCondiment,refCountry,refDrink,refJuice,refSide,refMaterialRes,refMenuItemType,refMenuItemSubType,refLocation); 
        response.json(initRefs);    
    }) 
})

var userApi = require('./apis/user');

userApi.init(router,userDbSvc,mapProfileFromDB);

var profileApi = require('./apis/profile');

profileApi.init(router,profileDbSvc,mapProfileFromDB);

var orderApi = require('./apis/order');

orderApi.init(router,orderDbSvc);

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

var port = process.env.port || 443;

app.set('port',port);

var server = http.createServer(app);

server.on('connection',function(socket){
    console.log("a new conneciton is made by a client");

});

server.listen(port);

console.log('order api is running at' + port);
