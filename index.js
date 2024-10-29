const express=require('express');
const mongoose=require('mongoose');
let app=express();
const port=8080;
const path=require('path');
const chat=require("./models/chat.js");
const methodOverride=require("method-override")

// setting path to views 
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// connection to data base
main()
.then(()=>{
    console.log("connection sucessful to database")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');

}

// let chat1=new chat({
//     from:"neha",
//     to:"priya",
//     msg:"send me your exam sheet",
//     createdAt:new Date() //time is set accg to UTC
// });

// chat1.save().then((res)=>{
//     console.log(res)
// });

app.get("/",(req,res)=>{
    res.send("working")
});

app.get("/chats",async (req,res)=>{
    let chats=await chat.find();
    // console.log(chats);

    res.render("index.ejs",{chats})
});

app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");

})
app.post("/chats",(req,res)=>{
    let {from,to,msg}=req.body;
    let newChat= new chat({
        from:from,
        to:to,
        msg:msg,
        createdAt:new Date(),
    });



newChat
    .save()
    .then((res)=>{
        console.log("chat was saved")
    }).catch((er)=>{
        console.log(err);
    })
    res.redirect("/chats");
});
app.get("/chats/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let chats=await chat.findById(id)
    res.render("edit.ejs",{chats})
});

app.put("/chats/:id",async (req,res)=>{
    let {id} = req.params;
    let{msg:newMsg}= req.body
    let updatedChat=await chat.findByIdAndUpdate(id,{msg:newMsg},
        {runValidators:true,new:true});
    console.log(updatedChat)
    res.redirect("/chats")

})
app.delete("/chats/:id",async (req,res)=>{
    let {id} = req.params;
    let chatDeleted= await  chat.findOneAndDelete(id);
    console.log(chatDeleted);
    res.redirect("/chats")

})
app.listen(port,()=>{
    console.log("app is listening")
});