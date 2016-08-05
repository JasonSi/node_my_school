var mailer = require('./mailer')
var parser  = require('./parser')

function Score(account) {
  this.account = account

  this.init()
}

Score.prototype = {
  constructor: Score,

  init: function() {
    parser(this.account, function(creditScore, guideScore) {
      this.creditScore = creditScore
      this.guideScore = guideScore
      this._mergeScores(function(){

      })
    })
  },
  _mergeScores: function(callback) {
    this.scores = creditScore
    this._calculatePoint()
    callback()
  },
  _calculatePoint: function() {
    for(var course in this.scores){
      console.log(course);
    }
  }
}


module.exports = function(account){
  return new Score(account)
}
