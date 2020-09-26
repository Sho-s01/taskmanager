const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/taskmanager";
const mongoose = require('mongoose');
var Schema = mongoose.Schema

var dbs = {};

let connect = (url, dbName) => {

    return new Promise((resolve, reject) => {
        MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
            if (err) { console.log('errrrr',err)
        reject(err) }
          else{
            let db = client.db('taskmanager');
          
            db.collection('users').find({},(err,rr)=>{
                console.log('rrrrrrrrr',rr)
                resolve(client.db('taskmanager'))
            });
          }
          })
        // if(dbs[dbName]){

        //     console.log('Database already available.....', dbName)
        //     resolve(dbs[dbName].db(dbName));
        // }else{            
        //     // MongoClient.connect("mongodb://localhost:27017",(err,dbase)=>{
        //         MongoClient.connect('mongodb://localhost:27017/', (err, dbase) => {
        //         if(!err){  
        //             console.log('Connection established for DB,');
        //             resolve(dbase.db('taskmanager'));
        //         }
        //         else{
        //             console.log('Error occurred while connecting...', dbName, err);
        //             reject(err);
        //         }
        //         // .then((res) => {                    
        //         //     dbs[dbName] = res;
        //         //     console.log('Connection established for DB,', res.collection);
        //         //     resolve(dbs[dbName].db(dbName));
        //         // })
        //         // .catch((rej)=>{
                    
        //         //     console.log('Error occurred while connecting...', dbName, rej);
        //         //     reject(rej);
        //     });
        // }
    });
}

let connectDB = (dbName) => {
    return new Promise((resolve, reject) => {
    //     MongoClient.connect(url)
    //         .then((res) => {            
    //             console.log('Connection established for DB, ', 'Taskmanager----');
    //             resolve(res.db('taskmanager'));
    //         })
    //         .catch((rej)=>{
                
    //             console.log('Error occurred while connecting...', dbName, rej);
    //             reject(rej);
    //         });
    mongoose.connect(url,{ useNewUrlParser: true,useUnifiedTopology: true })
    .then((res)=>{
        console.log('resssss',res.model)
        resolve(res)
    });
        // mongoose.connect(url)
        //     .then((res) => {
        // //        console.log('ress',res)
        // //        resolve(res);
        // // })
        //     .catch(err => {
        //         console.log('Error in connecting database',err);
        //         reject(err)
        //     });
})
}

let disconnectDB = (dbName) => {

    return new Promise((resolve, reject) => {
        if(dbs[dbName]){

            dbs[dbName].close()
            .then((res) => {

                console.log(dbName, 'Closed successfully')
                dbs[dbName] = null
                resolve(res);
            })
            .catch((rej) => {

                console.log('Failed while closing the', dbName);
            });
        }else{

            console.log(dbName, 'DB doesn\'t exist');
            resolve('DB doesn\'t exist');
        }
    });
}

let disconnectAllDB = ()=>{

    var promises = [];
    for(let db of Object.keys(dbs)){
        console.log(`Disconnecting DB: ${db}...`);
        promises.push(disconnectDB(db));
    }
    return promises;
}


module.exports = {

    connectDB: connectDB,
    disconnectDB: disconnectDB,
    disconnectAllDB: disconnectAllDB
}