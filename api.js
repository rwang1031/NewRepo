const dboperations = require('./dboperations');
var Db = require('./dboperations');
var Order = require('./order');

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
const { request } = require('express');
//var cors = require('cors');
var app = express();
//var router = express.Router();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api',router);


/* router.use((request,response,next)=>{
    console.log('middleware')
    next();
})

router.route('/orders').get((request,response)=>{
    dboperations.getOrders().then(result=>{
        response.json(result.recordset);    
    }) 

})
 */
const { auth } = require('express-openid-connect');

const config = {
  authRequired: true,
  auth0Logout: true,
  secret: process.env.Auth0Secret,
  baseURL: 'https://api11.azurewebsites.net/',
  clientID: 'bAzoU1hYJfvpPJ7N5deAFKFzb0A7BwYO',
  issuerBaseURL: 'https://dev-ub3msj1r.us.auth0.com'
};


const { requiresAuth } = require('express-openid-connect');


// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

app.get('/api/orders', requiresAuth(), (req, res) => {
    dboperations.getOrders().then(result=>{
        res.json(result.recordset);    
    }) 
});

var port = process.env.port || 443;

app.set('port',port);

var server = http.createServer(app);

server.listen(port);

console.log('order api is running at' + port);

