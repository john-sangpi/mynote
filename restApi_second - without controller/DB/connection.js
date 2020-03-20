const mongoose = require('mongoose');
 const URI = 'mongodb+srv://sangpi:sangpi@cluster0-lumyt.mongodb.net/test?retryWrites=true&w=majority';
 mongoose.set('useCreateIndex', true);
 const dbconnection = async ()=>{
    await mongoose.connect(URI,
        { 
            useUnifiedTopology: true, useNewUrlParser: true
        } );
    console.log('db connected...');
 };



 module.exports = dbconnection;