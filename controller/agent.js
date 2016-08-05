var loginUrl = 'http://202.119.113.135/loginAction.do'
var vcodeUrl = 'http://202.119.113.135/validateCodeAction.do?random=0.4281'
var creditUrl= 'http://202.119.113.135/gradeLnAllAction.do?type=ln&oper=fainfo&fajhh=1903'
var guideUrl = 'http://202.119.113.135/gradeLnAllAction.do?type=ln&oper=lnFajhKcCjInfo'

var request  = require('superagent')
var charset  = require('superagent-charset')
var ocr      = require('./ocr')
var fs       = require("fs")

charset(request)

/**
 * Agent for crawling score pages
 * @param account {object}
 * @param vcodePath {string}
 * @constructor
 */
function Agent(account, callback) {
  this.account = account
  this.vcodePath = "temp/" + this.account.number + "-vcode.jpg"

  this.headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
    'DNT': 1,
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.8',
    'Cookie': 'JSESSIONID=bcfVY4k2IRfWOhRAbCwzv'
  }
  this.download(callback)
}

Agent.prototype = {
  constructor: Agent,
  download: function(callback) {
    this._downloadScore(callback)
  },
  _login: function(callback) {
    var self = this
    self._downloadCaptcha(function() {
      request
      .post(loginUrl)
      .type('form')
      .send({
        zjh: self.account.number,
        mm: self.account.password,
        v_yzm: self.vcode
      })
      .set(self.headers)
      .charset('gbk')
      .end(function(err, res) {
        if(res.headers['set-cookie']){
          self.headers['Cookie'] = res.headers['set-cookie'][0].split(';')[0]
        }
        if(res.text.match(/验证码错误/)) {
          self._login(callback)
        } else {
          callback()
        }
      })
    })
  },
  _downloadCaptcha: function(callback){
    var self = this
    request
      .get(vcodeUrl)
      .set(self.headers)
      .end(function(err, res) {
        if(res.headers['set-cookie']){
          self.headers['Cookie'] = res.headers['set-cookie'][0].split(';')[0]
        }

        fs.writeFile(self.vcodePath, res.body,function(e) {
          if(e){
            return console.error(e)
          } else {
            self._identify(function(code) {
              self.vcode = code
              console.log(code);
              if(code.length != 4){
                self._downloadCaptcha(callback)
              } else {
                callback()
              }
            })
          }
        })
      })
  },
  _downloadScore: function(callback) {
    var self = this
    self._login(function() {
      request
        .get(creditUrl)
        .set(self.headers)
        .charset('gbk')
        .end(function(CreditError, creditResult) {
          if(creditResult.headers['set-cookie']){
            self.headers['Cookie'] = creditResult.headers['set-cookie'][0].split(';')[0]
          }
          // TODO: For now I don't know how to assign two variable after two async function, so made it sync
          request
            .get(guideUrl)
            .set(self.headers)
            .charset('gbk')
            .end(function(guideError, guideResult) {
              callback(creditResult.text, guideResult.text)
            })
        })
    })
  },
  _identify: function(callback) {
    ocr(this.vcodePath, callback)
  }
}


module.exports = function(account, callback) {
  return new Agent(account, callback)
}
