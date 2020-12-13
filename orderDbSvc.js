var config = require('./dbconfig');
const sql = require('mssql');

sql.on('error', err => {
    // ... error handler
})


function createMealItems(userId,profileId,intentedDeliverDate,mealItemsJson){
    try{       
        var cp = new sql.ConnectionPool(config)
        console.log("Clear currentDay and createMealItems:+++");
        console.log(mealItemsJson);
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('UserId',userId)
            .input('ProfileId',profileId)
            .input('IntentedDeliverDate',intentedDeliverDate)
            .input('MealItems',JSON.stringify(mealItemsJson))
            .execute('[dbo].[spMealItemsClearCurrentDayAndReCreate]')           
        }); 
        return pool; 
    }
    catch(err){
        console.log(err);
    }           
}

function removeOrderByUserId(userId){
    try{       
        var cp = new sql.ConnectionPool(config)
        console.log("Clear removeOrderByUserId:+++");
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('UserId',userId)
            .execute('[dbo].[spOrderDeleteByUserId]')           
        }); 
        return pool; 
    }
    catch(err){
        console.log(err);
    }           
}

function removeMealItemsByProfileIdAndDeliverDate(profileId,intendedDeliverDate){
    try{       
        var cp = new sql.ConnectionPool(config)
        console.log("Clear removeOrderByUserId:+++");
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('ProfileId',profileId)
            .input('IntentedDeliverDate',intendedDeliverDate)
            .execute('[dbo].[spMealItemsDeleteByDeliverDateAndProfileId]')           
        }); 
        return pool; 
    }
    catch(err){
        console.log(err);
    }           
}


function getOrderMealItemsByUserId(userId){
    try{
        var cp = new sql.ConnectionPool(config)
        console.log("getOrderMealItemsByUserId:+++");
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('UserId',userId) 
            .execute('[dbo].[spOrderMealItemsGetByUserId]')           
        }); 
        return pool;
    }
    catch(err){
        console.log(err);
    }          
}

module.exports = {
    createMealItems:createMealItems,
    removeOrderByUserId:removeOrderByUserId,
    removeMealItemsByProfileIdAndDeliverDate:removeMealItemsByProfileIdAndDeliverDate,
    getOrderMealItemsByUserId:getOrderMealItemsByUserId
}