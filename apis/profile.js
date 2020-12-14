
function init(router,profileDbSvc, mapProfileFromDB){

    router.route('/profiles').post((request,response)=>{
    
        let profile = request.body;
         profileDbSvc.createProfile(
            profile.firstName,
            profile.lastName,
            profile.location,
            profile.userId,
            profile.dayOfBirth
         ).then((result)=>{  
             console.log("profile created:")
             console.log(result);   
             response.json(mapProfileFromDB(result.recordset[0]));    
         }) 
    })
    
    router.route('/profiles').put((request,response)=>{
        
        let profile = request.body;
        profileDbSvc.updateProfile(
            profile.id,
            profile.firstName,
            profile.lastName,
            profile.location,
            profile.dayOfBirth      
         ).then((result)=>{     
             response.json(mapProfileFromDB(result.recordset));    
         }) 
    })
    
    router.route('/profiles/:id').delete((request,response)=>{
        
        var id = request.params.id;
        profileDbSvc.removeProfile(
            id  
         ).then((result)=>{     
             response.json(mapProfileFromDB(result.recordset));    
         }) 
    })
    
    
    router.route('/profiles/:id').get((request,response)=>{   
        let id = Number(request.params.id);
         profileDbSvc.getProfile(
            id
         ).then((result)=>{
             console.log("get profile final result:");
             console.log(result);
    
             response.json(mapProfileFromDB(result.recordset[0]));    
         }) 
    
    })
    
    router.route('/profiles/byUser/:userId').get((request,response)=>{   
        let userId = request.params.userId;
         profileDbSvc.getProfilesByUserId(
            userId
         ).then((result)=>{
             console.log(result.recordset);   
            
            var profiles = [];
    
            result.recordset.forEach(item=>{
               var profile = mapProfileFromDB(item)
               profiles.push(profile);
            })    
             response.json(profiles);    
         }) 
    })

 

}


module.exports = {
    init:init
}