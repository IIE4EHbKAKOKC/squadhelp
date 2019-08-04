const express = require('express');
const app = express();
const restApiRouter = require("./restRouter.js");
const userRouter = new restApiRouter('mongodb://localhost:27017/','maindb','users','login','password',{projection:{login:1, password:1, _id:0}}).getRouter();
//const contestRouter = new restApiRouter('mongodb://localhost:27017/','maindb','contests',)

app.use('/rest/users', userRouter);

console.log(22);

app.listen(3000);
