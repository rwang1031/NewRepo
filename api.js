const dboperations = require('./dboperations');
var Db = require('./dboperations');
var Order = require('./order');

var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var http = require('http');
const { request } = require('express');
//var cors = require('cors');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-ub3msj1r.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://api11.azurewebsites.net/api/orders',
  issuer: 'https://dev-ub3msj1r.us.auth0.com/',
  algorithms: ['RS256']
});

app.use(jwtCheck);

app.use('/api',router);


router.use((request,response,next)=>{
    console.log('middleware')
    next();
})

router.route('/orders').get((request,response)=>{
    dboperations.getOrders().then(result=>{
        response.json(result.recordset);    
    }) 

})

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

var port = process.env.port || 443;

app.set('port',port);

var server = http.createServer(app);

server.listen(port);

console.log('order api is running at' + port);

