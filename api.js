const userDbSvc = require('./userDbSvc');
const profileDbSvc = require('./profileDbSvc');
var Db = require('./userDbSvc');
var User = require('./user');
var Profile = require('./profile');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var http = require('http');
var cors = require('cors');

const { request } = require('express');
const { stringify } = require('querystring');
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

router.route('/profiles').delete((request,response)=>{
    
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

