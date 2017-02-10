var ConnectionPool = require('tedious-connection-pool');
var Connection     = require('tedious').Connection;
var Request        = require('tedious').Request;
var TYPES          = require('tedious').TYPES

var poolConfig = {
  min: 2,
  max: 100,
  log: false
};

var connectionConfig = {
    userName: 'eatandoData',
    password: '123ABC',
    server:   'WS030',
    database: 'EatAndDoNew',

    options: {

        connectTimeout:  15000,
        requestTimeout: 480000,

        camelCaseColumns:                 true,
        rowCollectionOnDone:              true,
        rowCollectionOnRequestCompletion: true,
        encrypt:                          true
    }
};

var pool = new ConnectionPool(poolConfig, connectionConfig);

pool.on('error', function (err) {
  console.error(err);
});

function convertRowsToJSON(rows) {

  var result = [];

  rows.forEach(function (row) {

    var rowResult = {};

    row.forEach(function (item) {

      if (item.value !== null) {
        rowResult[item.metadata.colName] = item.value.toString().replace(/\"/g, '"');
      }

    });

    result.push(rowResult);
  });

  return JSON.stringify(result);
}

exports.processQuery = function processQuery(procedureName, parameterValues){

  return new Promise(function (resolve, reject) {

    pool.acquire(function (poolError, connection) {

      if (poolError) {
        reject(JSON.stringify(poolError));
      }

      request = new Request(procedureName, function (requestError, rowCount, rows) {

        if (requestError) {

          console.log(requestError);

          reject(JSON.stringify(requestError));

        } else {

          resolve(convertRowsToJSON(rows));

        }

        connection.release();
      });

      parameterValues.forEach(function (parameter) {
        request.addParameter(parameter.name, TYPES.VarChar, parameter.value);
      })

      connection.callProcedure(request);

    });

  });

}


