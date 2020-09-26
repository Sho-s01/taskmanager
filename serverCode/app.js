const express = require('express')
const path = require('path')
const app = express()
const jwt=require('./util/jwt')
const cors=require('cors')
var { graphql, buildSchema } = require('graphql');
const graphqlHttp = require('express-graphql').graphqlHTTP;
var mongoose=require('mongoose')
var Schema = mongoose.Schema
const bodyParser = require('body-parser');
var users=require('./model/users')
const task=require('./model/task')
const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} =require('graphql-iso-date');
app.use(express.static(path.join(__dirname, '../clientcode/build')))
app.get('/ping', (req, res) => {
  return res.send('pong')
})

var schema = buildSchema(`
  type RootQuery {
    hello: String
  }
  schema {
  query: RootQuery
  }
`);
var rootValue = {
  hello: () => {
    return 'Hello world!';
  }
};
app.use(bodyParser.json())
app.options('*', cors());
app.use(cors())
app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
        type User {
         email:String
         name:String
         password:String
         isValidUser:Boolean
        }
        input UserInput {
         email:String!
         name:String!
         password:String!         
        }
        input taskInput{
          title:String
          assignedTo:String
          desc:String
          assignedBy:String
          deadline:String
          createdBy:String
          task:taskRecordInput
        }
        type taskrecord{
          approvalStatus:String
          taskStatus:String
          work:String
          evaluationRemarks:String
        }
        input taskRecordInput{
          approvalStatus:String
          taskStatus:String
          work:String
          evaluationRemarks:String
        }
        type task {   
          title:String      
          deadline:String
          createdBy:String
          desc:String
          task:taskrecord
        }
        type RootQuery {
            getUser(email:String,password:String):[User]
            getTask: [task!]!
        }
        type RootMutation {
            createUser(email:String,password:String,name:String): User
            createTask(input:taskInput):task 
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      getUser: (args) => {
        console.log('Argss-->',args)
        return users.find({email:args.email})
          .then(events => {            
            return events.map(event => {
              // if(args.password==event.password)              
              console.log('Mapped event--->',event)
              if(args.password==event.password)
                return { ...event._doc, _id: event.id,isValidUser:true};
              else{
                return {isValidUser:false}
              }
            });
          })
          .catch(err => {
            throw err;
          });
      },
      getTask: () => {
          return task.find({})
            .then(events => {
              return events.map(event => {
                return { ...event._doc, _id: event.id,task:event['Task-record']  };
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
          password: args.password         
        });
        return event
          .save()
          .then(result => {
            console.log('result-----------',result);
            return { ...result._doc, _id: result._doc._id.toString() };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
      createTask:(args)=>{
        console.log('args',args)
        const taskData = new task({
          title: args.input.title,
          assignedTo: args.input.assignedTo,
          desc: args.input.desc,
          assignedBy:args.input.assignedBy,
          deadline:args.input.deadline,
          createdBy:args.input.createdBy,
          'Task-record':args.input.task
        });        
        return taskData
          .save()
          .then(result => {
            console.log('result-----------',result);
            return { ...result._doc, _id: result._doc._id.toString() };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      }

    },
    graphiql: true
  })
);

app.use((req, res, next) => {
  let token = req.headers.authorization && req.headers.authorization.split(' ')
  // console.log('token--------',req.headers.authorization)
  if (token && token[1] && token[1] != "null") {
    jwt.verifyToken(token[1]).then((data) => {
      console.log('DATA',data)
      return next();
    }).catch((err) => {
      // Log.logger.error('Unauthorized request ---'+ err,{'stacktrace': Log.formatLogArguments()})
      console.log('Unauthorized request ---',err)
      if (err.name == "TokenExpiredError") {
        res.status(403)
          .json({ msg: "Token expired" })
      }
      else {
        // AuthenticationError
        console.log('Unauthorized request222 ---',err)
        res.status(401)
          .json({ msg: "Authentication error" })

      }
    })
  }
  else {
    return next()
  }
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../clientcode/build', 'index.html'))
})

app.use('/login',require('./routes/login'))

app.listen(8080)


