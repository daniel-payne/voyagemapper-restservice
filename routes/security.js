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
  res.send('{ data: "security", serverTime: "' + (new Date()).toISOString().slice(0, 19) + '"}');
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/new/session', urlencodedParser, function (req, res) {

  const ipAddress         = req.connection.remoteAddress
  const b64Authorization  = req.headers.authorization
  const authorization     = Buffer.from(b64Authorization.replace('Basic ',''), 'base64').toString("ascii") 
  const authorizations    = authorization.split(':') 
  const email             = authorizations[0]
  const password          = authorizations[1]

  sqlCommands.processQuery('Security.GetSessionForNewUser', [

    { name: 'EMailAddress ', value: email          },
    { name: 'Password',      value: password       },
    { name: 'IPAddress',     value: ipAddress      },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/existing/session', urlencodedParser, function (req, res) {

  const ipAddress         = req.connection.remoteAddress
  const b64Authorization  = req.headers.authorization
  const authorization     = Buffer.from(b64Authorization.replace('Basic ',''), 'base64').toString("ascii") 
  const authorizations    = authorization.split(':') 
  const email             = authorizations[0]
  const password          = authorizations[1]

  sqlCommands.processQuery('Security.GetSessionForExistingUser', [

    { name: 'EMail',         value: email                    },
    { name: 'Password',      value: password                 },
    { name: 'IPAddress',     value: ipAddress                },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/revoke/session', urlencodedParser, function (req, res) {

  const ipAddress = req.connection.remoteAddress

  sqlCommands.processQuery('Security.GetRevocationForSession', [

    { name: 'SessionGUID',   value: req.headers.session        }, 
    { name: 'IPAddress',     value: ipAddress                  },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/refresh/session', urlencodedParser, function (req, res) {

  const ipAddress = req.connection.remoteAddress

  sqlCommands.processQuery('Security.GetRefreshForSession', [

    { name: 'SessionGUID',   value: req.headers.session        }, 
    { name: 'IPAddress',     value: ipAddress                  },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.routes = routes;

