const mongoose = require("mongoose");

const redeemSchema = new mongoose.Schema({
   name:{
         type:String,
   },
    points:{
            type:Number,
    },
    description:{
            type:String,
    },
    image:{
            type:String,
    },
    category:{
            type:String,
    },
    date:{
            type:Date,
            default:Date.now,
    },
});

const Redeem = mongoose.model("Redeem", redeemSchema);

module.exports = Redeem;