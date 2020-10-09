var users = require('../model/users')
const task = require('../model/task');
var ObjectID = require('mongodb').ObjectID;
var crypt = require('../util/cryptify')
var jwt = require('../util/jwt');

module.exports = {
  getUser: (args) => {
    return users.find({ email: args.email })
      .then(events => {
        return events.map(event => {
          if (args.password == crypt.decrypt(event.password)) {
            return jwt.generateLoginAuthToken(args.email).then((data) => {
              return {
                ...event._doc, _id: event.id, isValidUser: true,
                jwtToken: data
              }
            });
          }
          else {
            return { isValidUser: false }
          }
        });
      })
      .catch(err => {
        throw err;
      });
  },
  getTask: () => {
    // return task.find({})
    return task.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "user"
        }
      }, {
        $unwind: "$user"
      }
      , {

        $project: { "user.email": 0, "user.password": 0, "user.id": 0 }
      }
    ])
      .then(events => {
        return events.map(event => {
          return { ...event, mappedName: event.user.name, _id: event._id, task: event['Task-record'] };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  fetchWorkerList: () => {
    return users.find({ role: 'worker' })
      .then(users => {
        return users.map(event => {
          return { ...event._doc, _id: event.id };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  getManagerTask: (args) => {
    return task.aggregate([
      {
        $match: { assignedBy: new ObjectID(args.id) }
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "user"
        }
      }, {
        $unwind: "$user"
      }
      , {

        $project: { "user.email": 0, "user.password": 0, "user.id": 0 }
      }
    ])
      .then(task => {
        return task.map(event => {
          return { ...event, mappedName: event.user.name, _id: event._id, task: event['Task-record'] };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  getWorkerTask: (args) => {
    return task.aggregate([
      {
        $match: { assignedTo: new ObjectID(args.id) }
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedBy",
          foreignField: "_id",
          as: "user"
        }
      }, {
        $unwind: "$user"
      }
      , {

        $project: { "user.email": 0, "user.password": 0, "user.id": 0 }
      }
    ])
      // return task.find({assignedTo:new ObjectID(args.id)})
      .then(task => {
        return task.map(event => {
          return { ...event, mappedName: event.user.name, _id: event._id, task: event['Task-record'] };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  createUser: (args) => {
    const event = new users({
      name: args.name,
      email: args.email,
      password: crypt.encrypt(args.password),
      role: args.role
    });
    return event
      .save()
      .then(result => {
        console.log('result-----------', result);
        return { ...result._doc, _id: result._doc._id.toString() };
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  createTask: (args) => {
    // console.log('args',args)
    const taskData = new task({
      title: args.input.title,
      assignedTo: args.input.assignedTo,
      desc: args.input.desc,
      assignedBy: args.input.assignedBy,
      deadline: args.input.deadline,
      createdBy: args.input.createdBy,
      'Task-record': args.input.task
    });
    return taskData
      .save()
      .then(result => {
        return { ...result._doc, _id: result._doc._id.toString() };
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  managerTaskApproval: (args) => {
    return task.updateOne({ "_id": new ObjectID(args.taskId) },
      { 'Task-record.approvalStatus': args.input.approvalStatus, 'Task-record.evaluationRemarks': args.input.evaluationRemarks })
      .then(result => {
        return true
        // return result
      })
      .catch(err => {
        console.log(err);
        return false
        // throw err;
      });

  },
  workerTaskUpload: (args) => {
    return task.updateOne({ "_id": new ObjectID(args.taskId) },
      {
        'Task-record.taskStatus': args.input.taskStatus, 'Task-record.work': args.input.work,
        'Task-record.submittedOn': new Date()
      })
      .then(result => {
        return true
        // return result
      })
      .catch(err => {
        console.log(err);
        return false
        // throw err;
      });
  }

}
// exports.resolver=resolver;

