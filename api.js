const userDbSvc = require('./userDbSvc');
const profileDbSvc = require('./profileDbSvc');
var Db = require('./userDbSvc');
var User = require('./models/user');
var Profile = require('./models/profile');
var InitObj = require('./models/initObj');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var http = require('http');
var cors = require('cors');

const { request } = require('express');
const { stringify } = require('querystring');
const { profile } = require('console');
const { parse } = require('path');
//var cors = require('cors');
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

app.use(jwtCheck);

app.use('/api',router);


router.use((request,response,next)=>{
    console.log('middleware')
    next();
})

router.route('/users').post((request,response)=>{
    
    let user = request.body;
     userDbSvc.createUser(
        user.firstName,
        user.lastName,
        user.email,
        user.authToken,
        user.address1,
        user.address2,
        user.day_phone,
        user.eve_phone,
        user.postal_code,
        user.country,
        user.province,
        user.city
     ).then((result)=>{     
         response.json(mapUserFromDB(result.recordset));    
     }) 
})

router.route('/users').put((request,response)=>{
    
    let user = request.body;
     userDbSvc.updateUser(
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.address1,
        user.address2,
        user.day_phone,
        user.eve_phone,
        user.postal_code,
        user.country,
        user.province,
        user.city
     ).then((result)=>{     
         response.json(mapUserFromDB(result.recordset));    
     }) 
})

router.route('/users/:authToken').get((request,response)=>{   
    let authToken = request.params.authToken;
    console.log("getuser");
    console.log(request.params);
     userDbSvc.getUserByAuthToken(
        authToken
     ).then((result)=>{
         console.log("get user final result:"+stringify(result));        
         response.json(mapUserFromDB(result.recordset));    
     }) 

})

router.route('/users/init/:authToken').get((request,response)=>{   
    let authToken = request.params.authToken;
    console.log("getuser");
    console.log(request.params);
     userDbSvc.getInitUserAndProfileByAuthToken(
        authToken
     ).then((result)=>{
         
         var user = mapUserFromDB(result.recordsets[0]);
         var profiles = [];
        result.recordsets[1].forEach(item=>{
           var profile = mapProfileFromDB(item)
           profiles.push(profile);
        }) 
        
        var availableMenuItemsDataSet = result.recordsets[2][0];
        var key = Object.keys(availableMenuItemsDataSet)[0];
        var availableMenuItems = JSON.parse(availableMenuItemsDataSet[key]);        
  
        var orderMealItemsDataSet = result.recordsets[3][0];
            key = Object.keys(orderMealItemsDataSet)[0];
        var orderMealItems = JSON.parse(orderMealItemsDataSet[key]);
        
        var refCondimentDataSet = result.recordsets[4][0];
            key = Object.keys(refCondimentDataSet)[0];
        var refCondiment = JSON.parse(refCondimentDataSet[key]);

        var refCountryDataSet = result.recordsets[5][0];
        key = Object.keys(refCountryDataSet)[0];
        var refCountry = JSON.parse(refCountryDataSet[key]);

        var refDrinkDataSet = result.recordsets[6][0];
        key = Object.keys(refDrinkDataSet)[0];
        var refDrink = JSON.parse(refDrinkDataSet[key]);

        var refJuiceDataSet = result.recordsets[7][0];
        key = Object.keys(refJuiceDataSet)[0];
        var refJuice = JSON.parse(refJuiceDataSet[key]);

        var refMaterialResDataSet = result.recordsets[8][0];
        key = Object.keys(refMaterialResDataSet)[0];
        var refMaterialRes = JSON.parse(refMaterialResDataSet[key]);

        var refMenuItemTypeDataSet = result.recordsets[9][0];
        key = Object.keys(refMenuItemTypeDataSet)[0];
        var refMenuItemType = JSON.parse(refMenuItemTypeDataSet[key]);

        var refMenuItemSubTypeDataSet = result.recordsets[10][0];
        key = Object.keys(refMenuItemSubTypeDataSet)[0];
        var refMenuItemSubType = JSON.parse(refMenuItemSubTypeDataSet[key]);

              
        var initObject = new InitObj(user,profiles,availableMenuItems,orderMealItems,
            refCondiment,refCountry,refDrink,refJuice,refMaterialRes,refMenuItemType,refMenuItemSubType);         
        response.json(initObject);

     }) 
})

router.route('/test').get((request,response)=>{   

    userDbSvc.getJsonTest(
    ).then((result)=>{
        var jsonResult;
        for(var key in result.recordset[0]){
           jsonResult = result.recordset[0][key]
        }
        console.log(JSON.parse(jsonResult)[0]);
        response.json(JSON.parse(jsonResult)[0]);    
    }) 
})

var mapUserFromDB = function(recordset){

    if(recordset==null | recordset.length==0)
        return null;
    return new User(
    recordset[0].fldUserId,
    recordset[0].fldFirstName,
    recordset[0].fldLastName,
    recordset[0].fldEmail,
    recordset[0].fldAuthId,
    recordset[0].fldAddress,
    recordset[0].fldAddressLine2,
    recordset[0].fldDayPhone,
    recordset[0].fldEvePhone,
    recordset[0].fldPostalCode,
    recordset[0].fldCountry,
    recordset[0].fldCountryProvinceMappingId,
    recordset[0].fldCity);
}

router.route('/profiles').post((request,response)=>{
    
    let profile = request.body;
     profileDbSvc.createProfile(
        profile.firstName,
        profile.lastName,
        profile.location,
        profile.userId,
        profile.dayOfBirth
     ).then((result)=>{  
         console.log("profile created:")
         console.log(result);   
         response.json(mapProfileFromDB(result.recordset[0]));    
     }) 
})

router.route('/profiles').put((request,response)=>{
    
    let profile = request.body;
    profileDbSvc.updateProfile(
        profile.id,
        profile.firstName,
        profile.lastName,
        profile.location,
        profile.dayOfBirth      
     ).then((result)=>{     
         response.json(mapProfileFromDB(result.recordset));    
     }) 
})

router.route('/profiles/:id').delete((request,response)=>{
    
    var id = request.params.id;
    profileDbSvc.removeProfile(
        id  
     ).then((result)=>{     
         response.json(mapProfileFromDB(result.recordset));    
     }) 
})


router.route('/profiles/:id').get((request,response)=>{   
    let id = Number(request.params.id);
     profileDbSvc.getProfile(
        id
     ).then((result)=>{
         console.log("get profile final result:");
         console.log(result);

         response.json(mapProfileFromDB(result.recordset[0]));    
     }) 

})

router.route('/profiles/byUser/:userId').get((request,response)=>{   
    let userId = request.params.userId;
     profileDbSvc.getProfilesByUserId(
        userId
     ).then((result)=>{
         console.log(result.recordset);   
        
        var profiles = [];

        result.recordset.forEach(item=>{
           var profile = mapProfileFromDB(item)
           profiles.push(profile);
        })    
         response.json(profiles);    
     }) 
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

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

var port = process.env.port || 443;

app.set('port',port);

var server = http.createServer(app);

server.listen(port);

console.log('order api is running at' + port);

