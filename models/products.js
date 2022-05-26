//Require Mongoose
const mongoose = require("mongoose");
//Define the Schema
const storeSchema = new mongoose.Schema({
  name:{type:String, required: true},
  description:{type:String},
  img:{type:String},
  price:{type:Number, min:0},
  qty:{type:Number, min:0}
});
//Declare model variable
const Store = mongoose.model("Store", storeSchema);

module.exports = Store;

