var mailer = require('./mailer')
var parser  = require('./parser')
var agent   = require('./agent')

function Score(account) {
  this.account = account

  this.init()
}

Score.prototype = {
  constructor: Score,

  init: function() {
    agent(this.account)
    this.scores = parser(this.account)
  }
}


module.exports = function(account){
  return new Score(account)
}
