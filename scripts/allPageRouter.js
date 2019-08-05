const express = require('express');
const path = require('path');
const allPageRouter = express.Router();
const pageSenderClass = require('./pageSender.js');
const pageSender = new pageSenderClass(path.join(__dirname,'../pages'));
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const fetch = require('node-fetch');


// Можно перенести след строки в отдельный userPageRouter
allPageRouter.get('/login',(req,res)=>{
    pageSender.send(res,'login.html');
});

allPageRouter.post('/login',urlencodedParser,(req,res)=>{
    var fullUrl = req.protocol + '://' + req.get('host') + '/rest/users/' + req.body.login;
    fetch(fullUrl,{method:'GET'})
        .then((resp)=>{
            return resp.json();
        })
        .then((myJson)=>{
            console.log(myJson);
            if (myJson === null) {
                res.send("login is not true");
                return;
            }
            if (myJson.password === req.body.password)
                res.send("authendificated");
            else 
                res.send("password is not true");
        });
});

allPageRouter.get('/signup',(req,res)=>{
    pageSender.send(res,'signup.html');
});

allPageRouter.post('/signup',urlencodedParser,(req,res)=>{
    res.send(req.body);
});

module.exports = allPageRouter;