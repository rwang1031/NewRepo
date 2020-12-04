const { user } = require("../dbconfig");

class Order{
    constructor(id,userId,orderDate,reqDeliverDate,deliveredDate,paymentRefId,cartId){
        this.id = id;
        this.userId = userId;
        this.orderDate = orderDate;
        this.reqDeliverDate = reqDeliverDate;
        this.deliveredDate = deliveredDate;
        this.paymentRefId = paymentRefId;
        this.cartId = cartId;
    }
}
module.exports = Order;