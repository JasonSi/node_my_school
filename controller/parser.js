var agent   = require('./agent')
var cheerio  = require('cheerio')

module.exports = function(account, callback) {
  agent(account, function(creditPage, guidePage) {
    var credits = cheerio.load(creditPage)('tr.odd')
    var guides = cheerio.load(guidePage)('tr.odd')

    var creditScore = []
    var guideScore = []

    credits.each(function() {
      creditScore.push({
        name: this.children[5].children[0].data.trim(),
        credit: this.children[9].children[0].data.trim()
      })
    })
    guides.each(function() {
      // Maybe something useless, so just skip it.
      if(typeof this.children[9] === 'undefined' || this.children[9].children[0].data.trim().length != 8) {
        return
      }
      guideScore.push({
        cno: this.children[1].children[0].data.trim(),
        name: this.children[3].children[0].data.trim(),
        prop: this.children[5].children[0].data.trim(),
        grade: this.children[7].children[0].data.trim(),
        date: this.children[9].children[0].data.trim()
      })
    })

    callback(creditScore, guideScore)
  })
}
