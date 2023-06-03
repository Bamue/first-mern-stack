import http from 'http'
import gfname from "./new.js";
import {gfname2,gfname3} from "./new.js";
import fs from "fs";
import path from "path";
import {lovefor} from "./new.js"; 
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose.connect("mongodb://127.0.0.1:27017/backend")
.then(()=>{console.log("connected database")})
.catch((e)=>console.log(e)); 

const usersSchema=new mongoose.Schema({name:String,email:String,password:String});

const User=mongoose.model("User",usersSchema);


//basic server 
import express, { application } from "express";
const app=express();
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(path.resolve(),"./public")));
app.use(cookieParser());
//setting up view engine
app.set("view engine","ejs"); 


const isAuthenticate=async(req,res,next)=>{ 
    const {token}=req.cookies;
    if(token){
        const decode=jwt.verify(token,"djcndjcnjcmxd"); 
        console.log(decode);
        req.user=await User.findById(decode._id);
        next();
    }else{
        res.redirect("login");
    }

}; 
app.get("/",isAuthenticate,(req,res)=>{
    //const pathlocation=path.resolve();
    //console.log(path.join(pathlocation,"view/index.html"));
    //res.sendFile(path.join(pathlocation,"view/index.html")); 
    console.log(req.user);
    res.render("logout",{name:req.user.name});
  
}); 

app.post("/register",async(req,res)=>{ 
    let {name,email,password}=req.body; 
    let user=await User.findOne({email});
    if(user){
        return res.render("/login");
    }

    const hashedPassword=await bcrypt.hash(password,10);
    user=await User.create({
        name,
        email,
        password:hashedPassword
    
    }); 
    const token=jwt.sign({_id:user._id},"djcndjcnjcmxd");
    res.cookie("token",token,{httpOnly:true,
    expires:new Date(Date.now()+60*10000)
    });
    res.redirect("/");
}); 

app.get("/register",(req,res)=>{

    res.render("register");

});

app.get("/login",(req,res)=>{
    res.render('login');
}) 

app.post("/login",async(req,res)=>{ 
    const {email,password}=req.body;
    let user=await User.findOne({email});
    if(!user){
        return res.render("register");
    } 
    const isMatched=await bcrypt.compare(password,user.password); 
    if(!isMatched) {
        return res.render("login",{email,message:"incorrect password"});
    }
    const token=jwt.sign({_id:user._id},"djcndjcnjcmxd");
    res.cookie("token",token,{httpOnly:true,
    expires:new Date(Date.now()+60*10000)
    });
    res.redirect("/");
}); 

app.get("/logout",(req,res)=>{
    res.cookie("token",null,{httpOnly:true,
        expires:new Date(Date.now())
    });
    res.redirect("/");
}); 
app.listen(3000,()=>{
    console.log("SERVER IS RUNNING DUDE");
});


/*const home=fs.readFileSync("./index.html",()=>{
    console.log('file read');
}); 
console.log(home);
console.log(lovefor());
console.log(gfname2);
console.log(gfname3);
console.log(gfname);
const server=http.createServer((req,res)=>{
    if(req.url === "/about"){
        res.end("<h1>About page</h1>")
    } 
    else if(req.url === "/"){
        res.end(home);
    }
    else if(req.url === "/contact"){
        res.end("<h1>Contact page</h1>")
    }
    else{
        res.end('<h1>Page not found</h1>')
    }
});*/

/*let text=fs.readFileSync("maisha.txt",'utf-8');
text=text.replace("honey",'bitch');
console.log("content of the file is");
console.log(text);
console.log('creating new file....'); 
fs.writeFileSync("jahura.txt",text);*/




