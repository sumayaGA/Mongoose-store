//Require Dependencies
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");

//Import Model
const Store = require("./models/products");

//Database Connection 
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// Database Connection Error/Success
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

//MIDDLEWARE & BODY PARSER
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//ROUTES

//SEED ROUTE
// app.get("/store/seed", (req,res)=>{
//     Store.deleteMany({}, (error, allProducts)=>{});
//     Store.create(
// [
//     {
//       name: 'Beans',
//       description: 'A small pile of beans. Buy more beans for a big pile of beans.',
//       img: 'https://imgur.com/a/bA48PbA.png',
//       price: 5,
//       qty: 99
//     }, {
//       name: 'Bones',
//       description: "It's just a bag of bones.",
//       img: 'https://imgur.com/dalOqwk.png',
//       price: 25,
//       qty: 0
//     }, {
//       name: 'Bins',
//       description: 'A stack of colorful bins for your beans and bones.',
//       img: 'https://imgur.com/ptWDPO1.png',
//       price: 7000,
//       qty: 1
//     },
//   ],
//   (error, data) => {
//       res.redirect("/store");
//   });  
// });

//INDEX
app.get("/store", (req,res)=>{
    Store.find({}, (err, allProducts)=>{
        res.render("index.ejs", {products: allProducts});
    });
});

//NEW
app.get("/store/new", (req,res)=>{
    res.render("new.ejs");
});

//DELETE
app.delete("/store/:id", (req,res)=>{
    Store.findByIdAndRemove(req.params.id, (err,deletedStore)=>{
        res.redirect("/store");
    });

});

//UPDATE
app.put("/store/:id", (req, res) => {
    if (req.body.completed === "on") {
      req.body.completed = true;
    } else {
      req.body.completed = false;
    }
    Store.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        },
        (error, updatedStore) => {
          res.redirect(`/store/${req.params.id}`)
        });
  });
//CREATE
app.post("/store", (req,res)=>{
    Store.create(req.body, (err,createdStore)=>{
        if (err) console.log (err);
        res.redirect("/store");
    });
});

//BUY
app.post("/store/:id/buy", (req,res)=>{
    Store.findById(req.params.id, (err, data)=>{
        if(data.qty > 0){
            data.qty --
            data.save(()=>{
                res.redirect(`/store/${data.id}`);
            });
        } else {
            res.redirect(`/store/${data.id}`);
        }
    });
});
//EDIT
app.get("/store/:id/edit", (req, res) => {
    Store.findById(req.params.id, (error, foundStore) => {
      res.render("edit.ejs", {
        product: foundStore,
      });
    });
  });



//SHOW
app.get("/store/:id", (req,res)=> {
    Store.findById(req.params.id, (err, foundStore)=>{
        res.render("show.ejs", {
            product:foundStore
        });
    });
});


//LISTENER
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log("The server is listening on port", PORT);
});


