const mongoose=require('mongoose');
const chat=require("./models/chat.js");

main()
.then(()=>{
    console.log("connection sucessful to database")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');

}

const chatsAll = [
    {
        from: "guddi",
        to: "vam",
        msg: "hi how r u",
        createdAt: new Date()
    },
    {
        from: "ayush",
        to: "dhanush",
        msg: "where are you",
        createdAt: new Date()
    },
    {
        from: "maya",
        to: "raj",
        msg: "Are we still on for the meeting?",
        createdAt: new Date()
    },
    {
        from: "rohit",
        to: "sita",
        msg: "Don't forget to bring the documents!",
        createdAt: new Date()
    },
    {
        from: "nikki",
        to: "peter",
        msg: "Can you send me the files?",
        createdAt: new Date()
    },
    {
        from: "anjali",
        to: "kiran",
        msg: "Let's grab lunch tomorrow!",
        createdAt: new Date()
    },
    {
        from: "rahul",
        to: "neha",
        msg: "What time is the event?",
        createdAt: new Date()
    },
    {
        from: "sanjay",
        to: "isha",
        msg: "Have you seen my keys?",
        createdAt: new Date()
    },
    {
        from: "vani",
        to: "krish",
        msg: "Check out this new restaurant!",
        createdAt: new Date()
    },
    {
        from: "tanvi",
        to: "dev",
        msg: "How was your weekend?",
        createdAt: new Date()
    }
];

chat.insertMany(chatsAll);


