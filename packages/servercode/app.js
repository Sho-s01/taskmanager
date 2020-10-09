const express = require('express')
const path = require('path')
const app = express()
const jwt = require('./util/jwt')
const cors = require('cors')
var { graphql, buildSchema } = require('graphql');
const graphqlHttp = require('express-graphql').graphqlHTTP;
var mongoose = require('mongoose')
const bodyParser = require('body-parser');
const schema = require('./graphql/schema')
const resolver = require('./graphql/resolvers')
app.use(express.static(path.join(__dirname, '../clientcode/build')))
app.get('/ping', (req, res) => {
  return res.send('pong')
})

app.use(bodyParser.json())
app.options('*', cors());
app.use(cors())
app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(schema
    ),
    rootValue: resolver,
    graphiql: true
  })
);

app.use((req, res, next) => {
  let token = req.headers.authorization && req.headers.authorization.split(' ')
  if (token && token[1] && token[1] != "null") {
    jwt.verifyToken(token[1]).then((data) => {
      return next();
    }).catch((err) => {
      if (err.name == "TokenExpiredError") {
        res.status(403)
          .json({ msg: "Token expired" })
      }
      else {
        // AuthenticationError
        console.log('Unauthorized request222 ---', err)
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


// app.use('/login',require('./routes/login'))
mongoose.connect("mongodb://localhost:27017/taskmanager", { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log('Connected to Mongodb')
  });
app.listen(5000)


