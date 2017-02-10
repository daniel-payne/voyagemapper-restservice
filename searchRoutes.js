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
  res.send('{ data: "search", serverTime: "' + (new Date()).toISOString().slice(0, 19) + '"}');
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/foodNames', urlencodedParser, function (req, res) {

  sqlCommands.processQuery('search.GetMatchingFoodNames', [

    { name: 'Search', value: req.query.search },
    { name: 'Sources', value: req.query.sources || 'cofid phe ead' },
    { name: 'MaxResults', value: req.query.count || 10 }

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/foods', urlencodedParser, function (req, res) {

  sqlCommands.processQuery('search.GetFoods', [

    { name: 'IDs', value: req.query.ids }

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/units', urlencodedParser, function (req, res) {

  sqlCommands.processQuery('search.GetUnits', [

    { name: 'ShowFullDetails', value: req.query.showFullDetails || '1' }

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/foodCalculations', urlencodedParser, function (req, res) {

  sqlCommands.processQuery('search.GetFoodEntryCalculation', [

      { name: 'FoodID',   value: req.query.foodID   },
      { name: 'Amount',   value: req.query.amount   },
      { name: 'UnitName', value: req.query.unitName }

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//routes.post('/analiseSignal', urlencodedParser, function (req, res) {

//    var text    = req.body.signal;

//    sqlCommands.getMatchingFoodNames(text, function (rows) {

//        var result = {};

//        rows[0].forEach(function (item) {
//            result[item.metadata.colName] = item.value;
//        });

//        res.send(JSON.stringify(result));
//    });

//});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.routes = routes;

