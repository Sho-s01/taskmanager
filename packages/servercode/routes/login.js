var express = require('express')
var router = express.Router()
var jwt = require('../util/jwt')
var mongoClient = require('../model/MongoClient')
var crypt = require('../util/cryptify')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

mongoClient.connectDB('taskmanager')
    .then((dbase) => {
        // dbase.collection('users').find({email:req.headers.user_code}).toArray((err, resp) => {   
        // if(req.headers.password==crypt.decrypt(resp[0]['password'])){
        //     jwt.generateLoginAuthToken(req.headers.user_code).then((data) => {
        //         console.log('JWT generatated token',data)
        //         res.json({userData:resp,jwt:data})
        //     })
        // }
        // else{
        //     res.json({status:-1})
        // }
        // }) 
        var MyModel = dbase.model('users', new Schema({ name: String }));
        MyModel.findOne(function (error, result) { console.log('res', result) });
    })

module.exports = router