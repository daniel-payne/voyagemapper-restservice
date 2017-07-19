var express          = require('express');
var router           = express.Router();

var bodyParser       = require('body-parser')

var sqlCommands      = require('./sqlCommands.js')

var jsonParser       = bodyParser.json();
var rawParser        = bodyParser.raw();
var textParser       = bodyParser.text();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

function returnData(data) {
  this.header("Content-Type", "application/json");
  this.send(data)
}

function returnError(error) {
  this.statusCode = 500;
  this.send(error)
}

var routes = express.Router();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/', function (req, res) {
  res.send('{ data: "geographic", serverTime: "' + (new Date()).toISOString().slice(0, 19) + '"}');
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/new/sessions', urlencodedParser, function (req, res) {

  const ipAddress = req.connection.remoteAddress

  sqlCommands.processQuery('Security.GetSessionForNewUser', [

    { name: 'EMailAddress ', value: req.query.email          },
    { name: 'Password',      value: req.query.password       },
    { name: 'IPAddress',     value: ipAddress                },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/existing/sessions', urlencodedParser, function (req, res) {

  const ipAddress = req.connection.remoteAddress

  sqlCommands.processQuery('Security.GetSessionForExistingUser', [

    { name: 'EMail',         value: req.query.email          },
    { name: 'Password',      value: req.query.password       },
    { name: 'IPAddress',     value: ipAddress                },

  ]).then(returnData.bind(res), returnError.bind(res))

});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/revoke/sessions', urlencodedParser, function (req, res) {

  const ipAddress = req.connection.remoteAddress

  sqlCommands.processQuery('Security.GetRevocationForSession', [

    { name: 'SessionGUID',   value: req.query.sessionCode    }, 
    { name: 'IPAddress',     value: ipAddress                },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.routes = routes;

