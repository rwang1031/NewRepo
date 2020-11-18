var config = require('./dbconfig');
const sql = require('mssql');

sql.on('error', err => {
    // ... error handler
})

function getOrders(){

    try{
        var cp = new sql.ConnectionPool(config)

        
        var pool = cp.connect().then(p=>{

        return p.request().query("SELECT top 5 * from occasions.tblOrders");
            
        });

        return pool; 
    }
    catch(err){
        console.log(err);
    }
           
}

module.exports = {
    getOrders: getOrders
}