var config = require('./dbconfig');
const sql = require('mssql');

sql.on('error', err => {
    // ... error handler
})

 function createMenuItem(userId,profileId,menuItemId,intentedDeliverDate,sides,drinks,juices,condiments){
    try{       
        var cp = new sql.ConnectionPool(config)
        console.log("createMenuItem:+++");
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('UserId',userId)
            .input('ProfileId',profileId)
            .input('MenuItemId',menuItemId)
            .input('IntentedDeliverDate',intentedDeliverDate)
            .input('Sides',sides)
            .input('Drinks',drinks)
            .input('Juices',juices)
            .input('Condiments',condiments)
            .execute('[dbo].[spMenuItemCreate]')           
        }); 
        return pool; 
    }
    catch(err){
        console.log(err);
    }           
}

function createMenuItems(userId,profileId,intentedDeliverDate,mealItemsJson){
    try{       
        var cp = new sql.ConnectionPool(config)
        console.log("Clear currentDay and createMenuItems:+++");
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

function updateMenuItem(id,firstName,lastName,location,dayOfBirth){
    try{       
        var cp = new sql.ConnectionPool(config)
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('FirstName',firstName)
            .input('LastName',lastName)
            .input('LocationId',location)
            .input('DayOfBirth',dayOfBirth)
            .input('Id',id)
            .execute('[dbo].[spMenuItemUpdate]')           
        }); 
        return pool; 
    }
    catch(err){
        console.log(err);
    }           
}

function removeMenuItem(id){
    try{       
        var cp = new sql.ConnectionPool(config)
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('Id',id)
            .execute('[dbo].[spMenuItemDelete]')           
        }); 
        return pool; 
    }
    catch(err){
        console.log(err);
    }           
}

function getMenuItem(id){
    try{
        var cp = new sql.ConnectionPool(config)
        console.log("getMenuItem:+++");
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('Id',id) 
            .execute('[dbo].[spMenuItemGet]')           
        }); 
        return pool;
    }
    catch(err){
        console.log(err);
    }          
}

function getMenuItemsByUserId(userId){
    try{
        var cp = new sql.ConnectionPool(config)
        console.log("getMenuItembyuserid:+++");
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('UserId',userId) 
            .execute('[dbo].[spMenuItemsGetByUserId]')           
        }); 
        return pool;
    }
    catch(err){
        console.log(err);
    }          
}

module.exports = {
    createMenuItem: createMenuItem,
    createMenuItems:createMenuItems,
    getMenuItem:getMenuItem,
    updateMenuItem:updateMenuItem,
    removeMenuItem:removeMenuItem,
    getMenuItemsByUserId:getMenuItemsByUserId
}