const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://Gopal:Gd12345@cluster0.vmikbki.mongodb.net/inotebook";
// mongodb+srv://Gopal:Gd12345@cluster0.vmikbki.mongodb.net/test"

mongoose.set('strictQuery', true);
const connectToMongo =()=>{
    mongoose.connect(mongoURI, ()=>{
      
    });
};

module.exports = connectToMongo;