const { response } = require('express');
const orderDbSvc = require('../dbServices/orderDbSvc');

const stripe = require('stripe')('sk_test_51HyTMoHnG7zQB5MVMqBBpCy3UzI0RiizGyfQonpcNTfVYlYNSVUEnYOmpigi46AoWzUC9gXuA5PvB9dHtn5OyavX00V2ZmjIHe');

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
    
    router.route('/order/pay').post((request,response)=>{
        create(request,response);
    });

};

function create(req,res,next){
    const stripeToken = req.body.stripeToken;
    //const price = Helper.getPrice(req.body.order);
    const priceInPence = 5 * 100;
    var orderId = req.body.orderId;
    var userId = req.body.userId;

    stripe.charges.create({
            amount: priceInPence,
            currency: 'cad',
            source: stripeToken,
            capture: false,
        }).then(chargeObj=>{
            console.log(chargeObj);
            orderDbSvc.payOrder(
                userId,
                orderId
             ).then((result)=>{        
                 var currentOrderDataSet = result.recordsets[0][0];
                 var key = Object.keys(currentOrderDataSet)[0];
                 var currentOrder = currentOrderDataSet[key]!=''? JSON.parse(currentOrderDataSet[key]): null;          
                 console.log(currentOrder); 
                 res.json(currentOrder).end();
                 stripe.charges.capture(chargeObj.id)
                    .then(res=>res)
                    .catch(err=>err)    
             }) 

        }).catch(error=>{
            console.log(error);
        })

}


module.exports = {
    init:init
}
