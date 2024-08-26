const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const app = express();
const cors = require('cors');
var bodyParser = require('body-parser')
const url = "mongodb+srv://arnav:Arnav1417@cluster0.wkhwuh1.mongodb.net/Project_BEE";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json())
// mongo DB
mongoose.connect(url)
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("Some issue while connecting to the database", err);
    });
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 
// api routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login',cors(),async function(req,res){
    try{
    var Email = req.body.email;
    var Password = req.body.password;

    const user = await db.collection('Users').findOne({email:Email});
    if(user){
        const Pmatch = await bcrypt.compare(Password, user.password);
        if(Pmatch){
            res.send("True");
        }
        else{res.send("False");
        }
    }
    else{
        res.send("SIGN UP!")
    }
}
catch(err){
    console.log(err)
}
    // res.send("Hello World");
})

// Handle form submission
app.post('/signup',cors(),async (req, res)=> {
    try {
        var Name =req.body.name;
        var Email = req.body.email;
        var Password = req.body.password;
        const saltRounds = 10;
        
        const hash_password = await bcrypt.hash(Password, saltRounds)

        const data_user = {
            "name": Name,
            "email": Email,
            "password": hash_password
        }
        const user = await db.collection('Users').findOne({email:Email});
        if(!user){
        db.collection('Users').insertOne(data_user,function(err, collection){ 
            if (err) throw err; 
            console.log("Record inserted Successfully"); 
            console.log(data_user);   
        });
   res.send("Hello World") // Make sure you have a success.html file in your public directory
    }
        else{
            res.send("User already found");
        }
        // Redirect to a success page or send a success response
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to insert record' });
    }
});

// get data;

app.get('/data',cors(),(req,res)=>{
    res.status(201).json({ 'message':"Hello" });
})
app.listen(80, () => {
    console.log("Server is running on port 80");
});