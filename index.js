const connection = require('./config/connection')

const {mainPrompt} = require('./lib/util')


// CONNECTION TO DATABASE
connection.connect(function (err) {
  if (err) throw err;
  // RUNNING USER COMMAND LINE PROMPT
  mainPrompt();
});



