const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TaskSchema = new Schema({  
  title: {
    type: String,
  },
  assignedTo:{
    type:String
  },
  assignedBy:{
    type:String
  },
  deadline: {
    type: Date  },
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

