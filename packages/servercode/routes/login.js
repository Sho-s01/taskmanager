var express = require('express')
var router = express.Router()
var jwt = require('../util/jwt')
var mongoClient = require('../model/MongoClient')
var crypt = require('../util/cryptify')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

mongoClient.connectDB('taskmanager')
    .then((dbase) => {
        var MyModel = dbase.model('users', new Schema({ name: String }));
        MyModel.findOne(function (error, result) { console.log('res', result) });
    })

module.exports = router