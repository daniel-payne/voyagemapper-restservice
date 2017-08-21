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

routes.get('/find/context', urlencodedParser, function (req, res) {

  sqlCommands.processQuery('Geographic.FindContext', [

    { name: 'Latitude ', value: req.query.latitude   },
    { name: 'Longitude', value: req.query.longitude  },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/list/contexts', urlencodedParser, function (req, res) {

  sqlCommands.processQuery('Geographic.ListContexts', [

    { name: 'List ', value: req.query.list   },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/list/countries', urlencodedParser, function (req, res) {

  sqlCommands.processQuery('Geographic.ListCountries', [

    { name: 'List ', value: req.query.list   },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/match/locations', urlencodedParser, function (req, res) {

  let text = req.query.base64Text ?
               Buffer.from(req.query.base64Text, 'base64') :
               req.query.text.replace(/%20/g, ' ') 

  sqlCommands.processQuery('Geographic.MatchLocations', [

    { name: 'Text ',     value: text                      },
    { name: 'Take',      value: req.query.take   || 10    },
    { name: 'Types',     value: req.query.types  || 'ALL' },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/list/airports', urlencodedParser, function (req, res) {

  sqlCommands.processQuery('Geographic.ListAirports', [

    { name: 'List ',   value: req.query.list              },
    { name: 'Take',    value: req.query.take   || 10      } 

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/match/airports', urlencodedParser, function (req, res) {

  let text = req.query.base64Text ?
               Buffer.from(req.query.base64Text, 'base64') :
               req.query.text.replace(/%20/g, ' ') 

  sqlCommands.processQuery('Geographic.MatchAirports', [

    { name: 'Text ',     value: text                      },
    { name: 'Take',      value: req.query.take   || 0     },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/list/conurbations', urlencodedParser, function (req, res) {

  sqlCommands.processQuery('Geographic.ListConurbations', [

    { name: 'List ',   value: req.query.list              },
    { name: 'Take',    value: req.query.take   || 10      } 

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/match/conurbations', urlencodedParser, function (req, res) {

  let text = req.query.base64Text ?
               Buffer.from(req.query.base64Text, 'base64') :
               req.query.text.replace(/%20/g, ' ') 

  sqlCommands.processQuery('Geographic.MatchConurbations', [

    { name: 'Text ',     value: text                      },
    { name: 'Take',      value: req.query.take   || 0     },

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/list/settlements', urlencodedParser, function (req, res) {

  sqlCommands.processQuery('Geographic.ListSettlements', [

    { name: 'List ',   value: req.query.list              },
    { name: 'Take',    value: req.query.take   || 10      } 

  ]).then(returnData.bind(res), returnError.bind(res))

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/match/settlements', urlencodedParser, function (req, res) {

  let text = req.query.base64Text ?
               Buffer.from(req.query.base64Text, 'base64') :
               req.query.text.replace(/%20/g, ' ') 

  sqlCommands.processQuery('Geographic.MatchSettlements', [

    { name: 'Text ',     value: text                      },
    { name: 'Take',      value: req.query.take   || 0     },

  ]).then(returnData.bind(res), returnError.bind(res))

}); 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

routes.get('/match/accommodations', urlencodedParser, function (req, res) {

  let text = req.query.base64Text ?
               Buffer.from(req.query.base64Text, 'base64') :
               req.query.text.replace(/%20/g, ' ') 

  sqlCommands.processQuery('Geographic.MatchAccommodationsInContext', [

    { name: 'Text ',                 value: text                      },
    { name: 'ContextReference ',     value: req.query.context         },
    { name: 'Take',                  value: req.query.take   || 0     },

  ]).then(returnData.bind(res), returnError.bind(res))

}); 

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.routes = routes;

