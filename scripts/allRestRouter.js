const express = require('express');
const MONGODBURL = 'mongodb://localhost:27017/';
const DBNAME = 'maindb';
const restApiRouter = require("./restRouter.js");
const allRestRouter = express.Router();
const userRouter    = new restApiRouter(MONGODBURL,DBNAME,'users','login',['password'],{projection:{login:1, password:1, _id:0}}).getRouter();
const paymentRouter = new restApiRouter(MONGODBURL,DBNAME,'payments','id',[],{projection:{_id:0}}).getRouter();
const contestRouter = new restApiRouter(MONGODBURL,DBNAME,'contests','id',['title','industry','services','targetcustomer','preferences','files','data'],{projection:{_id:0}}).getRouter();
const entriesRouter = new restApiRouter(MONGODBURL,DBNAME,'entries','id',['status'],{projection:{_id:0}}).getRouter();
const filesRouter   = new restApiRouter(MONGODBURL,DBNAME,'files','id',[],{projection:{_id:0}}).getRouter();

allRestRouter.use('/users', userRouter);
allRestRouter.use('/payments', paymentRouter);
allRestRouter.use('/contests', contestRouter);
allRestRouter.use('/entries', entriesRouter);
allRestRouter.use('/files', filesRouter);

module.exports = allRestRouter;