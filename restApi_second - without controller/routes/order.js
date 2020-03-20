const express = require('express');
const route  = express.Router();
const mongoose = require('mongoose');
const orderModel = require('../models/orderModel');
const checkAuth = require('../middleware/check-auth');

route.get('/',checkAuth, (req,res,next)=>{
   orderModel.find()
   .select('_id quantity product')
   .populate('product','name')
   .exec()
   .then(docs =>{
       res.status(200).json({
           count : docs.length,
           order: docs.map(doc=>{
               return {
                   _id : doc._id,
                   quantity: doc.quantity,
                   productId : doc.product,
                   request : {
                       type: "GET",
                       url : "http://localhost:4000/order/"+ doc._id
                   }
               }
           })
       })
   })
   .catch(err=>{})
})

route.get('/:orderId',checkAuth, (req,res,next)=>{
    const id = req.params.orderId;
    orderModel.findById(id)
    .exec()
    .then(order =>{
        console.log(order);
        res.status(200).json({
            id : order._id,
            prodcut: order.product,
            quantity: order.quantity
        });
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
})

route.post('/',checkAuth, (req,res,next)=>{
    const order = new orderModel({
        product :req.body.productId,
        quantity : req.body.quantity
    });
    order.save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message:"order created successfully",
            orderItem :{
                _id: result._id,
                productId : result.product,
                quantity: result.quantity
            },
            request:{
                type:"GET",
                url:"http://localhost:4000/order/"+ result._id
            }

        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err})
    });
});

module.exports = route;