require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const adminRoutes = require('./routes/adminRoutes');
const port = process.env.PORT || 3000;
const cors = require('cors');
const morgan = require('morgan');
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/billing-salon')
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
 
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan('dev'));
app.use('/api/admin', adminRoutes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
