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

routes.get('/retrieve/points', urlencodedParser, function (req, res) {

  const ipAddress = req.connection.remoteAddress

  sqlCommands.processQuery('Itinerary.RetrievePoints', [

    { name: 'SessionGUID ',      value: req.headers.session       },

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

