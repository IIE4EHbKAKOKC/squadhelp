const express = require('express');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const MongoClient = require("mongodb").MongoClient;
// eslint-disable-next-line no-unused-vars
const md5 = require("./md5.js");
class restApiRouter {
  constructor (url,db,collection,setKey,updateKeys,dbreqParams) {
    //заменить сетКейс и апдейтКейс на массивы доступных ключей для создания и обновления
    this.router = express.Router();
    this.setKey = setKey;
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
        if (err) {
          console.log(err);
          res.statusCode = 500;
          res.send('Server error');
          return;
        }
        res.send(data);
      });
    });

    this.router.get("/:id",(req,res)=>{
      const id = req.params.id;
      const filter = new Object();
      filter[this.setKey] = id;
      this.collection.findOne(filter,this.dbreqParams,(err, data)=>{
        if (err) {
          console.log(err);
          res.statusCode = 500;
          res.send('Server error');
          return;
        }
        res.send(JSON.stringify(data));
      });
    });
  }
  createPostListeners () {
    const index = {};
    index[this.setKey] = 1;
    this.collection.createIndex(index,{"unique":true});
    this.router.post("/",jsonParser,(req,res)=>{
      if (!req.body) return res.sendStatus(400);
      console.log("Adding one");
      const data = req.body;
      this.collection.insertOne(data,(err, results)=>{
        if (err) {
          console.log(err);
          res.statusCode = 500;
          res.send('Server error');
          return;
        }
        res.send(results.result.ok.toString());
      });
    });
  }
  createPutListeners () {
    this.router.put("/:id/:valueName/:value",(req,res)=>{
      const uniqueId = req.params.id;
      const valueName = req.params.valueName;
      const value = req.params.value;
      if (this.updateKeys.indexOf(valueName)>-1)
        res.send(`Updating id=${uniqueId} set(${valueName})=${value}`);
    });
  }
  createDeleteListeners () {
    this.router.delete("/:id",(req,res)=>{
      const id = req.params.id;
      console.log(`Delete ${id}`);
      const filter = new Object();
      filter[this.setKey] = id;
      this.collection.deleteOne(filter, (err, results)=>{
        //console.log(data);
        res.send(results.result.ok.toString());
      });
    });
  }
}

module.exports = restApiRouter;
