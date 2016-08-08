var mailer = require('./mailer')
var parser = require('./parser')

function Score(account) {
  this.account = account
  this.init()
}

Score.prototype = {
  constructor: Score,

  init: function() {
    var self = this
    parser(self.account, function(creditScore, guideScore) {
      self.creditScore = creditScore
      self.guideScore = guideScore
      self.nestScore = []
      self.gpa = []

      self._mergeScores()
      self._calculatePoint()
      self._nestWithDate()
      self._calculateGPA()

      console.log(self.nestScore);
      console.log(self.gpa);
    })
  },
  _mergeScores: function() {
    for (let g in this.guideScore) {
      for (let c in this.creditScore) {
        if (this.guideScore[g].name === this.creditScore[c].name) {
          this.guideScore[g].credit = this.creditScore[c].credit
          this.creditScore.splice(c, 1)
          break
        }
      }
    }
  },
  _calculatePoint: function() {
    for (let g in this.guideScore) {
      this.guideScore[g].point = this._convertPoint(this.guideScore[g].grade)
    }
  },
  _convertPoint: function(grade) {
    var result = parseInt((grade - 60) / 5) * 0.5 + 2.0
    if (result < 2) {
      return 0
    } else if (result > 5) {
      return 5.0
    } else {
      return result
    }
  },
  _nestWithDate: function() {
    var res = []
    var z = 0
    var flag = false
    for (let i in this.guideScore) {
      z += 1
      let date = parseInt(this.guideScore[i].date.slice(4))
      if (flag != (date > 500 && date < 1100)) {
        res.push(z - 1)
      }
      flag = (date > 500 && date < 1100)
    }
    res.push(z)
    for (let i in res) {
      this.nestScore.push(this.guideScore.slice((i == 0 ? 0 : res[i - 1]), res[i]))
    }
  },
  _calculateGPA: function() {
    for (let n in this.nestScore) {
      var sumPoint = 0
      var sumCredit = 0
      for (let i in this.nestScore[n]) {
        if (this.nestScore[n][i].prop === "选修") continue
        sumPoint += this.nestScore[n][i].point * this.nestScore[n][i].credit
        sumCredit += this.nestScore[n][i].credit
      }
      this.gpa.push({
        credit: sumCredit,
        point: (sumCredit == 0 ? 0 : (sumPoint / sumCredit).toFixed(3))
      })
    }
  }
}


module.exports = function(account) {
  return new Score(account)
}
