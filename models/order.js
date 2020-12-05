class Order{
    constructor(id,userId,orderDate,paymentRefId){
        this.id = id;
        this.userId = userId;
        this.orderDate = orderDate;
        this.paymentRefId = paymentRefId;
        this.orderItems = [new orderItem(), new orderItem(), new orderItem()]
    }
}
module.exports = Order;