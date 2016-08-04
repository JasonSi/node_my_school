var accounts = require('./config').accounts
var score = require('./controller/score')

var s = score(accounts[0])
