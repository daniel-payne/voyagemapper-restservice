
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var router     = express.Router();

var searchRoutes = require('./searchRoutes').routes;

var allowCrossDomain = function (req, res, next) {

    res.header('Access-Control-Allow-Origin',  '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text())

app.use('/search', searchRoutes)

app.get('/', function (req, res) {
  res.send('{serverTime: "' + (new Date()).toISOString().slice(0, 19) + '"}');
});


var port = process.env.port || 1337;

var server = app.listen(port, function () {

    console.log('http://localhost:' + port);

});


