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
  res.send('{ data: "itinerary", serverTime: "' + (new Date()).toISOString().slice(0, 19) + '"}');
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/open/session', function (req, res) {

  const b64Authorization  = req.query.authorization
  const authorization     = Buffer.from(b64Authorization.replace('Basic ',''), 'base64').toString("ascii") 
  const authorizations    = authorization.split(':') 
  const email             = authorizations[0]
  const password          = authorizations[1]

  sqlCommands.processQuery('Itinerary.OpenSession', [

    { name: 'EMail',         value: email          },
    { name: 'Password',      value: password       },

  ]).then(returnData.bind(res), returnError.bind(res))
  
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/refresh/session', function (req, res) {

  sqlCommands.processQuery('Itinerary.RefreshSession', [

    { name: 'SessionGUID',   value: req.headers.session        }, 

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/close/session', function (req, res) {

  sqlCommands.processQuery('Itinerary.CloseSession', [
    
    { name: 'SessionGUID',   value: req.query.code        }, 

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/regiester/person', function (req, res) {

  const b64Authorization  = req.headers.authorization
  const authorization     = Buffer.from(b64Authorization.replace('Basic ',''), 'base64').toString("ascii") 
  const authorizations    = authorization.split(':') 
  const email             = authorizations[0]
  const password          = authorizations[1]

  sqlCommands.processQuery('Itinerary.RegiesterPerson', [

    { name: 'EMailAddress ', value: email          },
    { name: 'Password',      value: password       },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.post('/update/context', function (req, res) {

  sqlCommands.processQuery('Itinerary.UpdateContext', [
    
    { name: 'SessionGUID',   value: req.query.code             }, 
    { name: 'ContextID',     value: req.query.context          }, 

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.post('/add/point', urlencodedParser, function (req, res) {

  const ipAddress = req.connection.remoteAddress

  sqlCommands.processQuery('Itinerary.AddPoint', [

    { name: 'Session',           value: req.headers.session        },

    { name: 'PointType',         value: req.body.pointType         },
    { name: 'FullName',          value: req.body.fullName          },
    { name: 'ContextReference',  value: req.body.contextReference  },
    { name: 'Latitude',          value: req.body.latitude          },
    { name: 'Longitude',         value: req.body.longitude         },

    { name: 'GroupName',         value: req.body.groupName         },
    { name: 'DateAtPoint',       value: req.body.dateAtPoint       },
    { name: 'DaysAtPoint',       value: req.body.daysAtPoint       },
    { name: 'TravelReference',   value: req.body.travelReference   },
    { name: 'BookingReference',  value: req.body.bookingReference  },
    { name: 'AdditionalDetails', value: req.body.additionalDetails },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/match/points', urlencodedParser, function (req, res) {

  const ipAddress = req.connection.remoteAddress

  sqlCommands.processQuery('Itinerary.MatchPoints', [

    { name: 'SessionGUID ',      value: req.headers.session       },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/list/points', urlencodedParser, function (req, res) {

  const ipAddress = req.connection.remoteAddress

  sqlCommands.processQuery('Itinerary.ListPoints', [

    { name: 'SessionGUID ',      value: req.headers.session         },

    { name: 'List ',             value: req.query.list              }  

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.routes = routes;

