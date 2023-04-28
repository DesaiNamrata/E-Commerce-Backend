const express = require('express');
const cors = require("cors");
require('./db/config');
const User = require("./db/User");
const product = require("./db/Product");
const Product = require('./db/Product');
const app = express();

app.use(express.json());
app.use(cors());


// -----------------------SignUp---------------------------

app.post("/register", async (req,resp)=>{
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    resp.send(result);
});

// ---------------------------Login--------------------------------

app.post("/login", async (req,resp)=>{
    let user = await User.findOne(req.body).select("-password");

    if(req.body.password && req.body.email){
        if(user)
        {
            resp.send(user)
        }else{
            resp.send({result:'No User Found'})
        }
    }
    else {
        resp.send({result : 'User Not Available'})
    }
  
});


// ---------------------Add Product--------------------------

app.post("/add-product", async(req, resp)=>{
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result)
});

// ---------------------Get ProductList--------------------------------------

app.get("/products",async(req,resp)=>{
    let products = await Product.find();
    if(products.length > 0)
    {
        resp.send(products)
    }
    else{
        resp.send({result:"No Products found"})
    }
});

// ------------------Delete Product----------------------------

app.delete("/product/:id",async (req,resp)=>{
    // resp.send(req.params)
    const result = await Product.deleteOne({_id:req.params.id})
    resp.send(result);
});


// ----------------Get single Product----------------------------

app.get("/product/:id", async (req,resp)=>{
    let result = await Product.findOne({_id:req.params.id});
    if(result)
    {
        resp.send(result)
    }else{
        resp.send({result:"No result found"})
    }
})


// -------------------Edit Product-------------------------------

app.put("/product/:id", async(req,resp)=>{
    let result = await Product.updateOne(
        {_id:req.params.id},
        {
            $set : req.body
        }
    )
    resp.send(result)
});


app.listen(5000)