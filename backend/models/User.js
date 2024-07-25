const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  address: {
    type: String,
  },
  date_of_birth: {
    type: Date,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  items:[{
    itemId: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    date: {
      type: String,
      default: Date.now,
    },
  }],
  
});

const User = mongoose.model("User", userSchema);

module.exports = User;
