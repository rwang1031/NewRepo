var config = require('./dbconfig');
const sql = require('mssql');

sql.on('error', err => {
    // ... error handler
})

 function createProfile(firstName,lastName,location,userId){
    try{       
        var cp = new sql.ConnectionPool(config)
        console.log("createProfile:+++");
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('UserId',userId)
            .input('FirstName',firstName)
            .input('LastName',lastName)
            .input('LocationId',location)
            .execute('[dbo].[spProfileCreate]')           
        }); 
        return pool; 
    }
    catch(err){
        console.log(err);
    }           
}

function updateProfile(id,firstName,lastName,location){
    try{       
        var cp = new sql.ConnectionPool(config)
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('FirstName',firstName)
            .input('LastName',lastName)
            .input('LocationId',location)
            .input('Id',id)
            .execute('[dbo].[spProfileUpdate]')           
        }); 
        return pool; 
    }
    catch(err){
        console.log(err);
    }           
}

function getProfile(id){
    try{
        var cp = new sql.ConnectionPool(config)
        console.log("getProfile:+++");
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('Id',id) 
            .execute('[dbo].[spProfileGet]')           
        }); 
        return pool;
    }
    catch(err){
        console.log(err);
    }          
}

function getProfilesByUserId(userId){
    try{
        var cp = new sql.ConnectionPool(config)
        console.log("getProfilebyuserid:+++");
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('UserId',userId) 
            .execute('[dbo].[spProfilesGetByUserId]')           
        }); 
        return pool;
    }
    catch(err){
        console.log(err);
    }          
}

module.exports = {
    createProfile: createProfile,
    getProfile:getProfile,
    updateProfile:updateProfile,
    getProfilesByUserId:getProfilesByUserId
}