const connection = require('./config/connection')

const {firstPrompt} = require('./lib/util')



// const sql = require("./sql");


// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  firstPrompt();
});



