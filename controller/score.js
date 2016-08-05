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
    // this.scores = creditScore
    for(let g in this.guideScore){
      for(let c in this.creditScore){
        if(this.guideScore[g].name === this.creditScore[c].name){
          this.guideScore[g].credit = this.creditScore[c].credit
          this.creditScore.splice(c,1)
          break
        }
      }
    }
    this._calculatePoint()
    callback()
  },
  _calculatePoint: function() {
    for(let g in this.guideScores){
      this.guideScores[g].point = this._convertPoint(this.guideScores[g].grade)
    }
  },
  _convertPoint: function(grade) {
    var result = ((parseInt(grade) - 60) / 5) * 0.5 + 2.0
    if(result < 2){
      return 0
    } else if(result > 5){
      return 5.0
    } else {
      return result
    }
  }
}


module.exports = function(account){
  return new Score(account)
}
