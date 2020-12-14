var config = require('../dbconfig');
const sql = require('mssql');

sql.on('error', err => {
    // ... error handler
})

 function createProfile(firstName,lastName,location,userId,dayOfBirth){
    try{       
        var cp = new sql.ConnectionPool(config)
        console.log("createProfile:+++");
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('UserId',userId)
            .input('FirstName',firstName)
            .input('LastName',lastName)
            .input('LocationId',location)
            .input('DayOfBirth',dayOfBirth)
            .execute('[dbo].[spProfileCreate]')           
        }); 
        return pool; 
    }
    catch(err){
        console.log(err);
    }           
}

function updateProfile(id,firstName,lastName,location,dayOfBirth){
    try{       
        var cp = new sql.ConnectionPool(config)
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('FirstName',firstName)
            .input('LastName',lastName)
            .input('LocationId',location)
            .input('DayOfBirth',dayOfBirth)
            .input('Id',id)
            .execute('[dbo].[spProfileUpdate]')           
        }); 
        return pool; 
    }
    catch(err){
        console.log(err);
    }           
}

function removeProfile(id){
    try{       
        var cp = new sql.ConnectionPool(config)
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('Id',id)
            .execute('[dbo].[spProfileDelete]')           
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
    removeProfile:removeProfile,
    getProfilesByUserId:getProfilesByUserId
}