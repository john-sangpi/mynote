const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');
const dbConnection = require('./DB/connection');
const userRoute = require('./routes/user');
const mongoose = require('mongoose');


dbConnection();
mongoose.Promise = global.Promise; 
app.use(morgan('dev'));
app.use('/img', express.static('uploads'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
// handle cors errors
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method ==='OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

// reuest handler 
app.use('/product',productRoute);
app.use('/order', orderRoute);
app.use('/user', userRoute);


// error handler 
app.use((req,res,next)=>{
    const error = new Error('Not fount');// default 
    error.status= 404;
    next(error);
});
app.use((error,req,res,next)=>{
    res.status(error.status || 500).json({
        error:{
            message:error.message,
            status_code : error.status
        }
    });
});

module.exports = app;

