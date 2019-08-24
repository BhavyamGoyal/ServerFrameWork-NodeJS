var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

var expires = new Date();

const generateKey = () => {
    var key = '';
    //Generate 16 digit key
    for (var i = 0; i < 16; ++i) {
        key += chars[Math.round(Math.random() * (chars.length - 1))];
    }

    //TODO: Replace this with TTL when MySQL database is setup
    //Create expiration date
    expires.setHours(expires.getHours() + 6); //expires 6 hours after current time
    return {key, expires}
}

module.exports = { generateKey }