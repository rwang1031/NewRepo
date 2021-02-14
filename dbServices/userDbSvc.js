var config = require('../dbconfig');
const sql = require('mssql');

sql.on('error', err => {
    // ... error handler
})

 function createUser(firstName,lastName,email,authToken,address1,address2,day_phone,eve_phone,postal_code,country,province,city,orgnizationId){
    try{       
        var cp = new sql.ConnectionPool(config)
        console.log("authId:+++"+ authToken);
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('FirstName',firstName)
            .input('LastName',lastName)
            .input('Email',email)
            .input('AuthId',authToken)
            .input('Address',address1)
            .input('AddressLine2',address2)
            .input('PostalCode',postal_code)
            .input('DayPhone',day_phone)
            .input('EvePhone',eve_phone)
            .input('Country',country)
            .input('CountryProvinceMappingId',province)
            .input('City',city)
            .input('OrganizationId',orgnizationId)
            .execute('[dbo].[spUserCreate]')           
        }); 
        return pool; 
    }
    catch(err){
        console.log(err);
    }           
}

function updateUser(id,firstName,lastName,email,address1,address2,day_phone,eve_phone,postal_code,country,province,city){
    try{       
        var cp = new sql.ConnectionPool(config)
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('UserId',id)
            .input('FirstName',firstName)
            .input('LastName',lastName)
            .input('Email',email)
            .input('Address',address1)
            .input('AddressLine2',address2)
            .input('DayPhone',day_phone)
            .input('EvePhone',eve_phone)
            .input('PostalCode',postal_code)
            .input('Country',country)
            .input('CountryProvinceMappingId',province)
            .input('City',city)
            .execute('[dbo].[spUserUpdate]')           
        }); 
        return pool; 
    }
    catch(err){
        console.log(err);
    }           
}

function getUserByAuthToken(authToken){
    try{
        var cp = new sql.ConnectionPool(config)
        console.log("authId:+++DB"+ authToken);
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('AuthToken',authToken) 
            .execute('[dbo].[spUserGetByAuthToken]')           
        }); 
        return pool;
  
    }
    catch(err){
        console.log(err);
    }          
}

function getInitUserAndProfileByAuthToken(authToken){
    try{
        var cp = new sql.ConnectionPool(config)
        console.log("authId:for init --DB"+ authToken);
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('AuthToken',authToken) 
            .execute('[dbo].[spGetInitUserAndProfileByAuthToken]')           
        }); 
        return pool;
  
    }
    catch(err){
        console.log(err);
    }          
}

function getRefProvincesByCountryId(countryId){
    try{
        var cp = new sql.ConnectionPool(config)
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('CountryId',countryId) 
            .execute('[dbo].[spGetRefProvinceByCountry]')           
        }); 
        return pool;  
    }
    catch(err){
        console.log(err);
    }          
}

function getOrgnizationByCode(code){
    try{
        var cp = new sql.ConnectionPool(config)
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('Code',code) 
            .execute('[dbo].[spOrgnizationGetByCode]')           
        }); 
        return pool;  
    }
    catch(err){
        console.log(err);
    }          
}

function updateUserOrgnization(userId,orgId){
    try{
        var cp = new sql.ConnectionPool(config)
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('UserId',userId)
            .input('OrgnizationId',orgId)  
            .execute('[dbo].[spUserUpdateOrgnization]')           
        }); 
        return pool;  
    }
    catch(err){
        console.log(err);
    }          
}




function getRefData(userId){
    try{
        var cp = new sql.ConnectionPool(config)
        var pool = cp.connect().then(function(conn){
            return conn.request()
            .input('UserId',userId)
            .execute('[dbo].[spGetRefAll]')           
        }); 
        return pool;
  
    }
    catch(err){
        console.log(err);
    }          
}

module.exports = {
    createUser: createUser,
    getUserByAuthToken:getUserByAuthToken,
    updateUser:updateUser,
    getInitUserAndProfileByAuthToken:getInitUserAndProfileByAuthToken,
    getRefData:getRefData,
    getRefProvincesByCountryId:getRefProvincesByCountryId,
    getOrgnizationByCode:getOrgnizationByCode,
    updateUserOrgnization:updateUserOrgnization
}