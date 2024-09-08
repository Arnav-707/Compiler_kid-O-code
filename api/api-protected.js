const express = require("express");
const cors = require('cors');
const bcrypt = require("bcrypt");
const verifyToken = require('./auth');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
let dotenv = require('dotenv').config();
const url = dotenv.parsed.url;

//Database connection
mongoose.connect(url)
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("Some issue while connecting to the database", err);
    });
var db = mongoose.connection;

// Express Initialization
const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json());

const secretkey = "ThisisnutsIcan'tevenfathomhowdidIgettohere,butyeahitwork"
//Routes
app.post("/signup",async (req,res)=>{
    try{
        const {name,email,password}= req.body;
        const user = await db.collection('Users').findOne({email:Email});
        const saltRounds = 10;
        
        const hash_password = await bcrypt.hash(password, saltRounds)

        const data_user = {
            "name": name,
            "email": email,
            "password": hash_password
        }
        if(!user){
            db.collection('Users').insertOne(data_user,function(err, collection){ 
                if (err) throw err; 
                console.log("Record inserted Successfully"); 
                console.log(data_user);   
            });
            token = jwt.sign({email},secretkey,{expiresIn:'1h'})
    res.json({token}); 
        }
            else{
            }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to insert record' });
    }
})

app.post('/login',async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await db.collection('Users').findOne({email:email});
        if(user){
            const pword_check = await bcrypt.compare(password, user.password);
            if(pword_check){
                token = jwt.sign({email},secretkey,{expiresIn:'1h'});
                // console.log(token);
                res.json({token});
            }
            else{
                res.json({'message':"Invalid User"}); 
            }
        }
    }
    catch(err){
        console.log(err);
    }
})
app.post('/protected', verifyToken,async (req,res)=>{
    try{
        const {token} = JSON.stringify(req.token);
        console.log(typeof(token))
        const auth = verifyToken(token);
        if(auth){
            res.json({"Auth":true})
        }
        else {
            res.json({"Auth":false});
        }
    }
    catch(err){
        console.log(err);
    }
})

module.exports = app;