var pool = require('./DBmanager').pool;

var createVerificationEntry = function (userId, verificationString)
{
obj= {id : userId, verification_string : verificationString};
      pool.getConnection(function (err, connection) {
        if (err) {
            console.log("[VerificationQueries]error error release" + err);
            //connection.release();
            //res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }
        connection.query("INSERT INTO verification_table set ? ", obj, function (err, res) {
            if (err) {
                console.log("[VerificationQueries]error: ", err);
            }
            else {
                console.log("[VerificationQueries]"+res.insertId);
            }
        });
        connection.release();
    });
  }



var fetchUser = function (verificationString, cb){

       var flag=0;
        pool.getConnection(function (err, connection) {
        if (err) {
            console.log("[VerificationQueries]error error release" + err);
            //connection.release();
            //res.json({ "code": 100, "status": "Error in connection database" });
        return ;
        }

        //console.log ("Select id from verification_table where verification_string = " + verificationString);
        connection.query("Select id from verification_table where verification_string = ?" , verificationString , function (err, res) {
            if (err) {
                console.log("[VerificationQueries]error: ", err);
            }
            else {
                if (res.length>0)
                {
                console.log("[VerificationQueries]Fetched user id: " + res[0].id);
                updateUserVerificationStatus(res[0].id, 1);
                flag=1;
               }
               else
               {
                console.log ("[VerificationQueries]No user found with this verification string");
                
               }
            }

             cb (flag);
             connection.release();
        });
        
    });
}

var updateUserVerificationStatus = function (userId, statusValue, result) {
    
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("[VerificationQueries]error error release" + err);
            //connection.release();
            //res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }
        connection.query("[VerificationQueries]UPDATE users_table SET verification_status  = ? WHERE id = ?", [statusValue, userId], function (err, res) {
            if (err) {
                console.log("[VerificationQueries]error: ", err);
                result(err, null);
            }
            else {
                console.log ("[VerificationQueries]"+res);
                //result(null, res);

            }
        });
        connection.release();
    });
}; 

module.exports = { createVerificationEntry, fetchUser}
