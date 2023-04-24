const mysql = require('mysql');

//Create Connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    port:'33065',
    database: 'ecommerce'
});

//Connection
db.connect(err => {
    if(err) throw err;
    console.log('Connected to MySQL');
});

module.exports = db;
