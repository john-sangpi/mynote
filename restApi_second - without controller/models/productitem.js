const mongoose = require('mongoose');

//create schema
const product = new mongoose.Schema({
    name:{
        type: String,
        required :[true, 'Name field is required']
    },
    price:{
        type:Number,
        required :[true, 'Price field is required']
    },
    productImage: {type: String, required: true}
});

module.exports = mongoose.model("Product",product);