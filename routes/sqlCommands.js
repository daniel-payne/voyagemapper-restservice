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
    
    userName:  process.env.USER_NAME     ?  process.env.USER_NAME.trim()     : 'rest.client',
    password:  process.env.USER_PASSWORD ?  process.env.USER_PASSWORD.trim() : '35vnbvASXX#575345dm7',
    server:    process.env.SERVER_NAME   ?  process.env.SERVER_NAME.trim()   : 'WS030',

    options: {

        database: process.env.DATABASE_NAME ?  process.env.DATABASE_NAME.trim()   :   'VoyageMapper',

        connectTimeout:  15000,
        requestTimeout: 480000,

        camelCaseColumns:                 true,
        rowCollectionOnDone:              true,
        rowCollectionOnRequestCompletion: true,
        encrypt:                          true
    }
}; 

var pool = new ConnectionPool(poolConfig, connectionConfig);

let errors = {}

pool.on('error', function (err) {
  console.error(err);
  errors.latest = err;
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

exports.errors = errors;


