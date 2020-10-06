const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const Schema = mongoose.Schema;
const TaskSchema = new Schema({  
  title: {
    type: String,
  },
  assignedTo:{
    type:ObjectID
  },
  assignedBy:{
    type:ObjectID
  },
  deadline: {
    type: Date  
  },
  createdBy:{
    type:String
  },
  desc:{
    type:String
  },
  'Task-record':{
    type:Object
  }
});

module.exports = mongoose.model('tasks', TaskSchema,'task');

