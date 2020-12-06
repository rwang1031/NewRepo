class InitObj{
    constructor(user,profiles,availableMenuItems,orderMealItems,
        refCondiment,refCountry,refDrink,refJuice,refMaterialRes,refMenuItemType,refMenuItemSubType){
        this.user = user;
        this.profiles = profiles;
        this.availableMenuItems = availableMenuItems;
        this.orderMealItems = orderMealItems;
        this.refCondiment = refCondiment;
        this.refCountry = refCountry;
        this.refDrink = refDrink;
        this.refJuice = refJuice;
        this.refMaterialRes = refMaterialRes;
        this.refMenuItemType = refMenuItemType;
        this.refMenuItemSubType = refMenuItemSubType
    }
}

module.exports = InitObj;