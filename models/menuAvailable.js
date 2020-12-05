class MenuAvailable{
    constructor(id,typeId,subTypeId){
        this.id = id;
        this.typeId = typeId;
        this.subTypeId = subTypeId;
        this.selectableSides = [1,2];
        this.sideAllowMultiple = false;
        this.selectableDrinks = [2,3];
        this.drinkAllowMultiple = false;
        this.selecableJuices = [1,2];
        this.juiceAllowMultiple = false;
        this.selectableCondiments = [1,2];
        this.condimentAllowMultiple = true;       
    }
}
module.exports = MenuAvailable;