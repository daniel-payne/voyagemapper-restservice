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

    { name: 'SessionGUID ',      value: req.query.session         },
    { name: 'Type ',             value: 'USER-' + req.body.type   },
    { name: 'ID',                value: req.body.id               },
    { name: 'FullName',          value: req.body.fullName         },
    { name: 'ContextReference',  value: req.body.contextReference },
    { name: 'Latitude',          value: req.body.latitude         },
    { name: 'Longitude',         value: req.body.longitude        },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/match/points', urlencodedParser, function (req, res) {

  const ipAddress = req.connection.remoteAddress

  sqlCommands.processQuery('Itinerary.MatchPoints', [

    { name: 'SessionGUID ',      value: req.query.session         },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.routes = routes;

