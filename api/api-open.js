const express = require("express");
const cors = require('cors');
const {generateFile} = require("./gen_file")
var bodyParser = require('body-parser');
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json());
const mongoose = require('mongoose');
app.use(cors());
const { addJobToQueue } = require("../job_queue");
const Job = require('../schema/jobs');

const url = require("dotenv").config().parsed.url;
mongoose.connect(url)
    .then(() => {
        console.log("open route connected");
    })
    .catch((err) => {
        console.log("Some issue while connecting to the database", err);
    });

app.post("/compile",async (req,res)=>{
    const {language, code} = req.body;
    if(code == undefined){
        return res.status(404).json({success:false,error:"Empty Code"});
    }
    const filepath = await generateFile(language,code);
    const job = await new Job({ language, filepath }).save();
    const jobId = job["_id"];
    addJobToQueue(jobId);
    res.status(201).json({ jobId });
})
module.exports = app;