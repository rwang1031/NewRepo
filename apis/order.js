function init(router,orderDbSvc){

    router.route('/order').post((request,response)=>{
        let order = request.body;
        console.log("order param:")
        console.log(order);
         orderDbSvc.createMealItems(
            order.userId,
            order.profileId,
            order.intendedDeliverDate,
            order.mealItems,
         ).then((result)=>{  
             console.log("menuItems created:")
              
             var currentOrderDataSet = result.recordsets[0][0];
             var key = Object.keys(currentOrderDataSet)[0];
             var currentOrder = currentOrderDataSet[key]!=''? JSON.parse(currentOrderDataSet[key]): null;          
             console.log(currentOrder); 
             response.json(currentOrder);    
         }) 
    })
    
    router.route('/order/:userId').delete((request,response)=>{
        let userId = request.params.userId;
    
         orderDbSvc.removeOrderByUserId(
            userId
         ).then((result)=>{  
             console.log("order deleted:")          
             var currentOrderDataSet = result.recordsets[0][0];
             var key = Object.keys(currentOrderDataSet)[0];
             var currentOrder = currentOrderDataSet[key]!=''? JSON.parse(currentOrderDataSet[key]): null;          
             console.log(currentOrder); 
             response.json(currentOrder);    
         }) 
    })
    
    router.route('/order/menuItems/:profileId/:intendeddeliverDate').delete((request,response)=>{
        let profileId = request.params.profileId;
        let intendeddeliverDate = request.params.intendeddeliverDate;
    
         orderDbSvc.removeMealItemsByProfileIdAndDeliverDate(
            profileId,
            intendeddeliverDate
         ).then((result)=>{  
             console.log("menuItems deleted:")          
             var currentOrderDataSet = result.recordsets[0][0];
             var key = Object.keys(currentOrderDataSet)[0];
             var currentOrder = currentOrderDataSet[key]!=''? JSON.parse(currentOrderDataSet[key]): null;          
             console.log(currentOrder); 
             response.json(currentOrder);    
         }) 
    })
    
    router.route('/order/:userId').get((request,response)=>{
        let userId = request.params.userId;
        console.log("order param:")
         orderDbSvc.getOrderMealItemsByUserId(
            userId
         ).then((result)=>{        
             var currentOrderDataSet = result.recordsets[0][0];
             var key = Object.keys(currentOrderDataSet)[0];
             var currentOrder = currentOrderDataSet[key]!=''? JSON.parse(currentOrderDataSet[key]): null;          
             console.log(currentOrder); 
             response.json(currentOrder);    
         }) 
    })
    
    router.route('/order/pay/:orderId/:userId').get((request,response)=>{
        let userId = request.params.userId;
        let orderId = request.params.orderId;
        console.log("order param:")
         orderDbSvc.payOrder(
            orderId,
            userId
         ).then((result)=>{        
             var currentOrderDataSet = result.recordsets[0][0];
             var key = Object.keys(currentOrderDataSet)[0];
             var currentOrder = currentOrderDataSet[key]!=''? JSON.parse(currentOrderDataSet[key]): null;          
             console.log(currentOrder); 
             response.json(currentOrder);    
         }) 
    })     
};


module.exports = {
    init:init
}
