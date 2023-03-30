const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require('bcrypt');

const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dbConnect();

// Middleware to parse JSON request bodies
app.use(express.json());

app.post("/register" , (req,res)=>{
    bcrypt.hash(req.body.password,10).
    then((hashedPassword)=>{
        const user = new User({
            email: req.body.email,
            password : hashedPassword   ,
            userName : req.body.userName
        });
        user.save().
        then((result)=>{
            res.status(201).send({
                message : "User Created Succefully !!",
                result
            })
        }).catch((e)=>{
            res.status(500).send({
                message : "Error when creating user !",
                e
            })
        })
    }).
    catch((e) =>{
        res.status(500).send({
            message : "password have been not hashed!!",
            e
        })
    })
})

// Start listening for incoming HTTP requests
app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
