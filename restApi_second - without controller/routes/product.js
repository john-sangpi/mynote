const express = require('express');
const route = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null ,'./uploads/');
    },
    filename: function(req,file,cb){
        
        const now = new Date().toISOString(); 
        const date = now.replace(/:/g, '-'); cb(null, date + file.originalname);
    }
});
const fileFilter = (req,file, cb) =>{
    if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/png'){
        cb(null,true); // allow file
    }else{
        cb(null, false); // reject a file
    }
}
const upload = multer({
    storage: storage, limits :{
        fileSize: 2024 * 1024 * 5
    },
    fileFilter
});
const Product = require('../models/productitem');

route.get('/',(req,res,next)=>{
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(doc =>{
            const response = {
                count: doc.length,
                product: doc.map(item=>{
                    return{
                        name: item.name,
                        price :item.price,
                        _id: item._id,
                        image: item.productImage,
                        request:{
                            type:"GET",
                            url: "http://localhost:4000/product/"+item._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

route.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({
                message: "No Valid entry found by Id"
            });
        }
    })
    .catch(err => res.status(500).json({error: err}));
});

// post method 
route.post('/', checkAuth, upload.single('productImage'),(req,res,next)=>{
    console.log(req.file)
    const pro_item = new Product({
        name:req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    pro_item.save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            _id: result._id,
            name: result.name,
            price: result.price,
            image: result.productImage,
            reqest :{
                type:"GET",
                Url :"http://localhost:4000/product/"+ result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
    
});

route.patch('/:productId',checkAuth, (req,res,next)=>{
    const id = req.params.productId;
    const updateOps = {};
    for( const ops of req.body){
        console.log(ops);
        updateOps[ops.proName] = ops.value;
    }
    Product.update({_id:id},{$set: updateOps})
        .exec()
        .then(doc =>{
            console.log(doc);
            res.status(200).json({
                message: "product updated",
                request:{
                    type: 'GET',
                    url:'http://localhost:4000/product/'+id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
    
});

route.delete('/:productId',checkAuth, (req,res,next)=>{
    const id = req.params.productId;
    Product.deleteOne({_id: id})
        .exec()
        .then(doc =>{
            
            res.status(200).json({
                message:'product deleted',
                request:{
                    type:'POST',
                    url :'http://localhost:4000/product',
                    body:{name:'String',price:'Number'}
                }
            });    
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        });
});




module.exports = route;