const express = require('express');
const path = require('path');
const allPageRouter = express.Router();
const pageSenderClass = require('./pageSender.js');
const pageSender = new pageSenderClass(path.join(__dirname,'../pages'));
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});

//TODO: Можно перенести след строки в отдельный userPageRouter
allPageRouter.get('/login',(req,res)=>{
    pageSender.send(res,'login.html');
});

allPageRouter.post('/login',urlencodedParser,(req,res)=>{
    res.send(req.body);
});

allPageRouter.get('/signup',(req,res)=>{
    pageSender.send(res,'signup.html');
});

allPageRouter.post('/signup',urlencodedParser,(req,res)=>{
    res.send(req.body);
});

module.exports = allPageRouter;