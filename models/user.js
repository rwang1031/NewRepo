class User{
    constructor(id,firstName,lastName,email,authToken,address1,address2,day_phone,eve_phone,postal_code,country,province,city,countryName,provinceName,orgnizationId,orgnizationName){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.authToken = authToken;
        this.address1 = address1;     
        this.address2 = address2;
        this.postal_code = postal_code;
        this.day_phone = day_phone;
        this.eve_phone = eve_phone;
        this.country = country;
        this.province = province;
        this.city = city;
        this.countryName = countryName;
        this.provinceName = provinceName;
        this.orgnizationId = orgnizationId;
        this.orgnizationName = orgnizationName;
    }

}

module.exports = User;