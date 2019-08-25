var mysql = require('mysql');
var serverSettings = require('../API/Strings/ServerSettings');
//local mysql db connection
var dbinstance = null;
class FW_DBManager {
    constructor() {

        this.connection = mysql.createConnection({
            host: serverSettings.host,
            user: serverSettings.user,
            password: serverSettings.password,
        });

        this.connectionPool = mysql.createPool({
            connectionLimit: 10,
            host: serverSettings.host,
            user: serverSettings.user,
            password: serverSettings.password,
            database: serverSettings.database
        });

    }
    CreateDatabase() {
        this.connection.connect(function (err) {
            if (err) {
                console.log("[FW_DBmanager]*****Database error accored***** : " + err);
            } else {
                con.query("CREATE DATABASE IF NOT EXISTS ??", [serverSettings.database], function (err, result) {
                    if (err) {
                        console.log("[FW_DBmanager]*****Database error accored***** : " + err);
                    }
                    else {
                        console.log("[FW_DBManager] Database connected");
                    }
                    SetupTables();
                });
            }
        });
    }

    SetTable(query) {
        var q = query;
        this.connectionPool.getConnection(function (err, connection) {
            if (err) {
                console.log("[FW_DBmanager] error while connecting to pool connection" + err);
                return;
            } else {
                connection.query(q, function (err, result) {
                    if (err) {
                        console.log("[FW_DBmanager] error in Create Table Query " + q + " error: " + err);
                    } else
                        console.log("[FW_DBmanager] Table created");
                });
            }
            connection.release();
        });
    }

    SetupTables(createTableQueries) {
        var createQueries = createTableQueries;
        var i = 0;
        // createTableQueries is an array of strings and strings are queries to create table
        for (i = 0; i < createTableQueries.length; i++) {
            this.SetTable(createTableQueries[i]);
        }
    }

    RunQuery(query) {
        // data should be null if its not an insert query not using for now
        // function should be called with async await and will return the result from the query event id it is error
        // a function calling this function like this
        /*
            async f1(){
                var result=await thiscalssobj.RunQuery(query);
            }
        */
        var q = query;
        var cb = resultCB;
        return new Promise(resolve => {
            this.connectionPool.getConnection(function (err, connection) {
                if (err) {
                    console.log("[FW_DBmanager] error while connecting to pool connection" + err);
                    resolve(err);
                    return;
                } else {
                    connection.query(q, function (err, result) {
                        if (err) {
                            console.log("[FW_DBmanager] error in Create Table Query " + q + " error: " + err);
                        } else
                            console.log("[FW_DBmanager] Got some result");
                        resolve(result);
                    });
                }
                connection.release();
            });
        });
    }
}

if (dbinstance == null) {
    dbinstance = new FW_DBManager();
}
module.exports = dbinstance;