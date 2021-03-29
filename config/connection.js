const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "bootcamp1234",
    database: "employeedb"
  });

  

  module.exports = connection;