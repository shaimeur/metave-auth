const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');


app.use(cors({
    origin: 'http://localhost:5173'
}));

const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dbConnect();

// Middleware to parse JSON request bodies
app.use(express.json());


// the register endpoint
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
            console.log('e',e);
            res.status(500).send({
                message : "Error when creating user !",
                e
            })
        })
    }).
    catch((e) =>{
        console.log('e',e);
        res.status(500).send({
            message : "password have been not hashed!!",
            e
        })
    })
})

// the login endpoint

app.post("/login",(req,res)=>{
        // cheking the email if it's exists
        User.findOne({email: req.body.email}).

        // if email exists
        then((user)=>{
            // compare the password  entred and the hashed password found
            bcrypt.compare(req.body.password, user.password)

            //if the password match
            .then((passwordCheck)=>{
                // check if password matches
                if(!passwordCheck){
                    return res.status(400).send({
                        message : "Password doesn't match !!",
                        error,
                    })
                }
                // create token
                const token = jwt.sign(
                    {
                        userId : user._id,
                        userEmail : user.email ,
                    },
                    "RANDOM-TOKEN",
                    {expiresIn : "24h"}
                );

                // return success response !!
                res.status(200).send({
                    message :" Login Successuful ",
                    email : user.email ,
                    token
                })
            })
            //catch error if password doesn't match
            .catch((e)=>{
                logger.log('e',e);
                res.status(400).send({
                    message : "Password doesn't match ",
                    e ,
                })
            })
        })
        .catch((e) =>{  //          catch error if email  doesn't exist
            res.status(404).send({
                message : "Email not found",
                e
            });
        });
})

// Start listening for incoming HTTP requests
app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
