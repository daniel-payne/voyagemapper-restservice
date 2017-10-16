
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var router     = express.Router();

var geographicRoutes = require('./routes/geographic').routes;
var riskRoutes       = require('./routes/risk').routes;
var itineraryRoutes  = require('./routes/itinerary').routes;

var allowCrossDomain = function (req, res, next) {

    res.header('Access-Control-Allow-Origin',  '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Session, Authorization');

    next();
}

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text())

app.use('/geographic', geographicRoutes)
app.use('/risk',       riskRoutes      )
app.use('/itinerary',  itineraryRoutes )

app.get('/', function (req, res) {
  res.send('{serverTime: "' + (new Date()).toISOString().slice(0, 19) + '"}');
});


var port = process.env.port || 1337;

var server = app.listen(port, function () {

    console.log('http://localhost:' + port);

});


