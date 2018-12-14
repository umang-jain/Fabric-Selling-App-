var express = require("express"),
    app=express(),
    mongoose=require("mongoose"),
    bodyparser=require("body-parser"),
    methodoverride=require("method-override"),
    expresssanitizer= require("express-sanitizer");

app.use(expresssanitizer());
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodoverride("_method"));

mongoose.connect("mongodb://admin:admin123@ds125302.mlab.com:25302/cloth");

var clothSchema = new mongoose.Schema({
    name:String,
    image:String,
    price:Number,
    seller:String,
    fabric:String,
    description:String
});
var Cloth = mongoose.model("Cloth",clothSchema);

app.get("/",function(req,res){
   res.render("home");
});
app.get("/cloth/about",function(req,res){
    res.render("about");
})
app.get("/cloth",function(req,res){
    Cloth.find({},function(err,clothes){
       if(err){
           console.log(err);
       }else{
           res.render("index",{clothes:clothes});
       }
    });
});
app.post("/cloth",function(req,res){
    req.body.cloth.description=req.sanitize(req.body.cloth.description);
    Cloth.create(req.body.cloth,function(err,cloth){
       if(err){
           res.render("new");
       }else{
           res.redirect("/slj");
       }
    });
});
app.get("/cloth/new",function(req,res){
   res.render("new");
});
app.get("/cloth/:id",function(req,res){
    Cloth.findById(req.params.id,function(err,foundcloth){
       if(err){
           console.log(err);
       } else{
           res.render("show",{cloth:foundcloth});
       }
    });
});
app.put("/cloth/:id",function(req,res){
    req.body.cloth.description=req.sanitize(req.body.cloth.description);
    Cloth.findByIdAndUpdate(req.params.id,req.body.cloth,function(err,foundcloth){
        if(err){
            res.redirect("/slj");
        } else{
            res.redirect("/slj/"+req.params.id)
        }
    });
});
app.get("/cloth/:id/edit",function(req,res){
    Cloth.findById(req.params.id,function(err,foundcloth){
        if(err){
            console.log(err);
        } else{
            res.render("edit",{cloth:foundcloth});
        }
    });
});
app.delete("/cloth/:id",function(req,res){
    Cloth.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/slj");
        } else{
            res.redirect("/slj");
        }
    });
});

app.listen("3000",function(req,res){
   console.log("Starting Server on port 3000");
});
