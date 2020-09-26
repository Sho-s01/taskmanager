// var { graphql, buildSchema } = require('graphql');

// // Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// // The root provides a resolver function for each API endpoint
// var root = {
//   hello: () => {
//     return 'Hello world!';
//   },
// };

// // Run the GraphQL query '{ hello }' and print out the response
// graphql(schema, '{ hello }', root).then((response) => {
//   console.log(response);
// });



var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser = require('body-parser')
var mc_scheduler = require('./routes/SchedulerTasks');
var fs = require('fs');
var app = express();
var common = require('./util/Common/common')
var https = require('https');
var session = require('express-session');
var config = require('./config').get(process.env.NODE_ENV);
// app.use(express.json());
const Log=require('../server/routes/logger')

app.use(bodyParser.json({ limit: '100mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
// console.log('body parser limit',bodyparser.limit)
// app.use(logger('dev'));
// app.use(bodyParser.urlencoded({
//   extended: true,
//   limit: '50mb'
// }))
// app.use(bodyParser.json({ limit: '50mb' }))

var sessionOptions = {
  secret: "secret",
  resave: true,
  saveUninitialized: false
};

app.use(session(sessionOptions));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));
app.options('*', cors());
app.use(cors())

app.use((req, res, next) => {
  let token = req.headers.authorization && req.headers.authorization.split(' ')
  if (token && token[1] && token[1] != "null") {
    common.verifyToken(token[1]).then((data) => {
      return next();
    }).catch((err) => {
      Log.logger.error('Unauthorized request ---'+ err,{'stacktrace': Log.formatLogArguments()})
      if (err.name == "TokenExpiredError") {

        res.status(403)
          .json({ msg: "Token expired" })
      }
      else {
        // AuthenticationError
        res.status(401)
          .json({ msg: "Authentication error" })

      }
    })
  }
  else {
    return next()
  }
})

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-HeJsonWebaders", "*");
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/role', require('./routes/RoleManagement'));
app.use('/employee', require('./routes/employee'));
app.use('/branch', require('./routes/branch'));
app.use('/product', require('./routes/productmanagement/productroute'));
app.use('/preprocess', require('./util/Preprocess'));
app.use('/clientOperations',require('./routes/clientOperations'))
app.use('/clientTypes', require('./routes/ClientManagement/ClientTypes'));
app.use('/clientAttr', require('./routes/ClientManagement/ClientAttributesMoral'));
app.use('/clientEmp', require('./routes/ClientManagement/ClientEmploymentTypes'));
app.use('/clientQuality', require('./routes/ClientManagement/ClientQuality'));
app.use('/ekycDoc', require('./routes/ClientManagement/EkycDocTypes'));
app.use('/global', require('./routes/global'));
app.use('/login', require('./routes/login'));
app.use('/changepassword', require('./routes/userProfile/changepassword'));
app.use('/forgotpassword', require('./routes/userProfile/forgotpassword'));
app.use('/resetpassword', require('./routes/userProfile/resetpassword'));
// app.use('/changepassword',require('./routes/userProfile/changepassword'));
app.use('/clientIndustry', require('./routes/ClientManagement/ClientIndustryType'));
app.use('/clientSubIndustry', require('./routes/ClientManagement/ClientSubIndustryType'));
app.use('/clientEmployer', require('./routes/ClientManagement/ClientEmployerType'));
app.use('/loanTypes', require('./routes/LoanTypeManagement'));
app.use('/referrals', require('./routes/ReferralManagement'));
app.use('/loanTab', require('./routes/productmanagement/LoanTab'))
app.use('/productsgeneral', require('./routes/productmanagement/generaltab'))
app.use('/main', require('./routes/productmanagement/main'));
app.use('/client', require('./routes/client'));
app.use('/manage', require('./routes/ClientApproval'));
app.use('/groupApproval', require('./routes/GroupClientApproval'));
app.use('/smbApproval', require('./routes/SmbClientApproval'));
app.use('/savingsApproval', require('./routes/SavingsAccountApproval'));
app.use('/group', require('./routes/group'));
app.use('/savingsTransactions', require('./routes/savingsWithdrawDeposit'))
app.use('/loanAccount', require('./routes/LoanAccount/Loan'));
app.use('/loanAccountApproval', require('./routes/LoanAccount/LoanApproval'));
app.use('/simulator', require('./routes/simulator'));
app.use('/revert', require('./routes/reverttransaction'));





app.use('/closeAccount', require('./routes/closeAccount'))
app.use('/saving', require('./routes/saving'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/interbranchCash', require('./routes/interbranchCash'));



app.use('/voucher', require('./routes/voucher'));
app.use('/replenishment', require('./routes/replenishment'));
app.use('/cashopen', require('./routes/cashopen'));


app.use('/accountMaster', require('./routes/accountMaster'));
app.use('/createMasterAccount', require('./routes/masterAccountCreation'));
app.use('/report', require('./routes/report'));
app.use('/smb', require('./routes/smb'));
app.use('/cash', require('./routes/cash'));
app.use('/tontineAccount', require('./routes/tontineAccount'));
app.use('/excelToJson', require('./routes/ExcelToJson'));
app.use('/clientmigration', require('./routes/migrateClients'));
app.use('/makeTransactions',require('./routes/makeTransactions'));
app.use('/cashregister',require('./routes/cashregister'));
app.use('/payfees',require('./routes/payfees'));
app.use('/businessOperations',require('./routes/businessoperations'))
app.use('/operations',require('./routes/operations'))
app.use('/accountsearch',require('./routes/accountsearch'))
app.use('/accountingTransaction',require('./routes/accountingTransactions'))
app.use('/developerDashboard',require('./routes/developerDashboard'));
app.use('/reimbursement',require('./routes/reimbursement-withdraw'));

app.get('/ping', function (req, res) {
 Log.logger.info('Application in up and running',{'stacktrace': Log.formatLogArguments()})
  res.json({status:1});
}),err=>{
 Log.logger.error('Error in ping',{'stacktrace': Log.formatLogArguments()})
}
// catch 404 and forward to error handlers
app.use(function (req, res, next) 	{

 Log.logger.info('url is'+req&&req.url,{'stacktrace': Log.formatLogArguments()});
		Log.logger.info('Response'+res,{'stacktrace': Log.formatLogArguments()});
  next(createError(404));
});




app.get('/', function (req, res) {
  res.sendFile(__dirname + 'index.html');
})
var port = config.PORT;

const sslOptions = {
  key: fs.readFileSync(config.SSL_KEY),
  cert: fs.readFileSync(config.SSL_CERT),
  ca: [
    fs.readFileSync(config.SSL_BUNDLE)
  ]
};
https.createServer(sslOptions,app).listen(port, () => {
 Log.logger.debug('App listening at port number:'+port,{'stacktrace': Log.formatLogArguments()})
//  {'stacktrace': Log.formatLogArguments()});
  // mc_scheduler.mc_scheduler('EOD_JOB', 'runEODJob');
  // mc_scheduler.mc_scheduler('AUTO_EMI_JOB', 'autoEMIPayment');
})

module.exports = app;


