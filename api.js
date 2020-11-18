const dboperations = require('./dboperations');
var Db = require('./dboperations');
var Order = require('./order');

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
const { request } = require('express');
//var cors = require('cors');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api',router);


router.use((request,response,next)=>{
    console.log('middleware')
    next();
})

router.route('/orders').get((request,response)=>{
    //dboperations.getOrders().then(result=>{
        //response.json(result.recordset);    
    //})
    response.json("12345");

})

var port = process.env.port || 443;

app.set('port',port);

var server = http.createServer(app);

server.listen(port);

console.log('order api is running at' + port);

