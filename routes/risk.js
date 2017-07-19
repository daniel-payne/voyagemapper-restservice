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
  res.send('{ data: "risk", serverTime: "' + (new Date()).toISOString().slice(0, 19) + '"}');
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/match/incidents', urlencodedParser, function (req, res) {

  sqlCommands.processQuery('Risk.MatchIncidents', [

    { name: 'CountryNo',        value: req.query.countryNo               },
    { name: 'LookBackInMonths', value: req.query.lookBackInMonths  || 3  }

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/list/incidents', urlencodedParser, function (req, res) {

  sqlCommands.processQuery('Risk.ListIncidents', [

    { name: 'List',        value: req.query.list              } 

  ]).then(returnData.bind(res), returnError.bind(res))

});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.routes = routes;

