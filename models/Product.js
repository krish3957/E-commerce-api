const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    //Add local image toh the database
    img: { type: String, required: true },
    extraImg: { type: Array },
    categories:{type:Array},
    size:{type:Array},
    color:{type:Array},
    price:{type:Number,required:true},
    inStock:{type:Boolean,default:true}
},
    {timestamps:true}
);

module.exports = mongoose.model("Product",productSchema);

