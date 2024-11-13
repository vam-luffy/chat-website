const express = require('express');
const mongoose = require('mongoose');
let app = express();
const port = 8080;
const path = require('path');
const Chat = require('./models/chat'); // Only import Chat (capitalized)
const methodOverride = require('method-override');
const ExpressError = require('./ExpressError');
const { ObjectId } = mongoose.Types;

// setting path to views 
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// connection to database
main()
    .then(() => {
        console.log("connection successful to database");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

// Home route
app.get("/", (req, res) => {
    res.send("working");
});

// List all chats
app.get("/chats", async (req, res) => {
    let chats = await Chat.find(); // Use Chat model consistently
    res.render("index.ejs", { chats });
});

// New chat route
app.get("/chats/new", (req, res) => {
    throw new ExpressError(404, "page not found");
    // Uncomment the next line after fixing the error handling
    // res.render("new.ejs");
});

// Create new chat
app.post("/chats", (req, res) => {
    let { from, to, msg } = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        createdAt: new Date(),
    });

    newChat
        .save()
        .then(() => {
            console.log("chat was saved");
        })
        .catch((err) => {
            console.log(err);
        });
    res.redirect("/chats");
});

// Edit chat by ID
app.get("/chats/:id", async (req, res, next) => {
    let { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return next(new ExpressError(400, "Invalid ID format"));
    }

    let chat = await Chat.findById(id); // Use Chat model consistently
    if (!chat) {
        return next(new ExpressError(404, "Chat not found"));
    }

    res.render("edit.ejs", { chat });
});

// Edit chat form (GET)
app.get("/chats/:id/edit", async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id); // Use Chat model consistently
    if (!chat) {
        throw new ExpressError(404, "Chat not found");
    }

    res.render("edit.ejs", { chat });
});

// Update chat
app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(id, { msg: newMsg }, { runValidators: true, new: true });
    console.log(updatedChat);
    res.redirect("/chats");
});

// Delete chat
app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let chatDeleted = await Chat.findByIdAndDelete(id); // Use Chat model consistently
    console.log(chatDeleted);
    res.redirect("/chats");
});

// Error handling
app.use((err, req, res, next) => {
    let { status = 500, message = "some error" } = err;
    res.status(status).send(message);
});

// Start the server
app.listen(port, () => {
    console.log("app is listening");
});
