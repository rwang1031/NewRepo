var User = require('../models/user');
var InitObj = require('../models/initObj');

function init(router,userDbSvc,mapProfileFromDB){

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
    
    router.route('/users/init/:authToken').get((request,response)=>{   
        let authToken = request.params.authToken;
        console.log("getuser");
        console.log(request.params);
         userDbSvc.getInitUserAndProfileByAuthToken(
            authToken
         ).then((result)=>{
             
             var user = mapUserFromDB(result.recordsets[0]);
             var profiles = [];
            result.recordsets[1].forEach(item=>{
               var profile = mapProfileFromDB(item)
               profiles.push(profile);
            }) 
            
            var orderMealItemsDataSet = result.recordsets[2][0];
                key = Object.keys(orderMealItemsDataSet)[0];
    
            var orderMealItems = orderMealItemsDataSet[key]!=''? JSON.parse(orderMealItemsDataSet[key]): null;
            console.log('init orders retrieved:');
            console.log(orderMealItems);
            var initObject = new InitObj(user,profiles,orderMealItems);         
            response.json(initObject);
    
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
        recordset[0].fldCity,
        recordset[0].fldCountryName,
        recordset[0].fldProvinceName       
        );
    }
  
};

module.exports = {
    init:init
}
