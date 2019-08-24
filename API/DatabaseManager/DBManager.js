var mysql = require('mysql');
var serverSettings = require('../Strings/ServerSettings');
//local mysql db connection
var con = mysql.createConnection({
    host: serverSettings.host,
    user: serverSettings.user,
    password: serverSettings.password,
   
});

var setupSQLDatabase = function setupSQLDatabase() {
    con.connect(function (err) {
        
        if (err) {
            console.log("[DBmanager]*****Database error accored***** : " + err);
        } else {
            con.query("CREATE DATABASE IF NOT EXISTS ??", [serverSettings.database], function (err, result) {
                if (err) { console.log("[DBmanager]*****Database error accored***** : " + err); };
                console.log("[DBManager] Database connected");
                SetupTables();
            });
        }
    });
}

var pool = mysql.createPool({
    connectionLimit: 10,
    host: serverSettings.host,
    user: serverSettings.user,
    password: serverSettings.password,
    database: serverSettings.database
});

function SetupTables() {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("[DBmanager] error error release" + err);
            //connection.release();
            //res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }
        connection.query("CREATE TABLE IF NOT EXISTS ??.`users_table` ( `id` INT NOT NULL AUTO_INCREMENT, `verification_status` INT NOT NULL DEFAULT 0, `last_name` VARCHAR(50) NOT NULL, `first_name` VARCHAR(50) NOT NULL, `email_id` VARCHAR(100) NOT NULL, `contact_number` VARCHAR(15) NOT NULL, PRIMARY KEY (`id`), UNIQUE INDEX `id_UNIQUE` (`id` ASC), UNIQUE INDEX `email_id_UNIQUE` (`email_id`),  UNIQUE INDEX `contact_number_UNIQUE` (`contact_number`) );", [serverSettings.database], function (err, result) {
            if (err) throw err;
            console.log("[DBmanager]users table created/verified");
        });
        connection.release();
    });

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("[DBmanager]error error release" + err);
            //connection.release();
            //res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }
        connection.query("CREATE TABLE IF NOT EXISTS ??.`verification_table` ( `id` INT , `verification_string` VARCHAR(100) NOT NULL,  PRIMARY KEY (`id`));", [serverSettings.database], function (err, result) {
            if (err) throw err;
            console.log("[DBmanager]verification_table created/verified");
        });
        connection.release();
    });
    console.log("[DBManager]Tables Setup");
}

module.exports = {
    setupSQLDatabase,
    pool
}


