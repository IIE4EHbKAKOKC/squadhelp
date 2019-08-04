const express = require('express');
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const MongoClient = require("mongodb").MongoClient;
const md5 = require("./md5.js");
class restApiRouter {
  constructor (url,db,collection,setKeys,updateKeys,dbreqParams) {
    //заменить сетКейс и апдейтКейс на массивы доступных ключей для создания и обновления
    this.router = express.Router();
    this.setKeys = setKeys;
    this.updateKeys = updateKeys;
    this.dbreqParams = dbreqParams;
    const mongoClient = new MongoClient (url, {useNewUrlParser : true});
    mongoClient.connect((err,client)=>{
      if (err) return console.log(err);

      this.db = client.db(db);
      this.collection = this.db.collection(collection);

      this.createAllListeners();

    });
  }
  getRouter () {
    return this.router;
  }
  createAllListeners () {
    this.createGetListeners();
    this.createPostListeners();
    this.createPutListeners();
    this.createDeleteListeners();
  }
  createGetListeners () {
    this.router.get("/",(req,res)=>{
      console.log("Get all");
      this.collection.find({},this.dbreqParams).toArray((err, data)=>{
        if (err) return console.log(err);
        res.send(data);
      });
    });

    this.router.get("/:id",(req,res)=>{
      const id = req.params.id;
      console.log(`Id ${id}`);
      const filter = new Object();
      filter[this.setKeys] = id;
      this.collection.findOne(filter,this.dbreqParams,(err, data)=>{
        res.send(data);
      });
    });
  }
  createPostListeners () {
    this.router.post("/",urlencodedParser,(req,res)=>{
      if (!req.body) return res.sendStatus(400);
      console.log(req.body);
      console.log("Adding one");
      const user = {};
      user.login = "login";
      user.password = md5("password");
      this.collection.insertOne(user,(err, results)=>{
        if (err) return console.log(err);

        console.log(results.result.ok);
        res.send(results.result.ok.toString());
      });
    });
  }
  createPutListeners () {
    this.router.put("/:id",(req,res)=>{
      const id = req.params.id;
      res.send(`Updating ${id}`);
    });
  }
  createDeleteListeners () {
    this.router.delete("/:id",(req,res)=>{
      const id = req.params.id;
      console.log(`Delete ${id}`);
      const filter = new Object();
      filter[this.setKeys] = id;
      this.collection.deleteOne(filter, (err, results)=>{
        //console.log(data);
        res.send(results.result.ok.toString());
      });
    });
  }
}

module.exports = restApiRouter;
