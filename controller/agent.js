var loginUrl = 'http://202.119.113.135/loginAction.do'
var vcodeUrl = 'http://202.119.113.135/validateCodeAction.do?random=0.4281'
var gradeUrl = 'http://202.119.113.135/gradeLnAllAction.do?type=ln&oper=fainfo&fajhh=1903'
var guideUrl = 'http://202.119.113.135/gradeLnAllAction.do?type=ln&oper=lnFajhKcCjInfo'

var request  = require('superagent')
var charset  = require('superagent-charset')
var cheerio  = require('cheerio')
var ocr      = require('./ocr')
var fs       = require("fs")

charset(request)

/**
 * Agent for crawling score pages
 * @param account {object}
 * @param vcodePath {string}
 * @constructor
 */
function Agent(account) {
  this.account = account
  this.vcodePath = "temp/" + this.account.number + "-vcode.jpg"

  this.headers = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
    DNT: 1,
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.8',
    cookie: ''
  }
  this.download()
}

Agent.prototype = {
  constructor: Agent,
  download: function() {
    this._downloadCaptcha(this._login)
    // 决定保持实例，第一次带cookie直接访问成绩，失败了再重新登陆
  },
  _login: function(self) {
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
        if(res.text.match(/你输入的验证码错误/)) {
          self._downloadCaptcha(self._login)
        } else {
          self._downloadScore()
        }
      })
  },
  _downloadCaptcha: function(callback){
    var self = this
    request
      .get(vcodeUrl)
      .set(self.headers)
      .end(function(err, res) {
        if(res.headers['set-cookie']){
          self.headers.cookie = res.headers['set-cookie'][0].split(';')[0]
        }

        fs.writeFile(self.vcodePath, res.body,function(e) {
          if(e){
            return console.error(e)
          } else {
            self._identify(function(code) {
              self.vcode = code
              console.log(code);
              if(code.length != 4){
                self._downloadCaptcha(self._login)
              } else {
                callback(self)
              }
            })
          }
        })
      })
  },
  _downloadScore: function() {
    var self = this
    request
      .get(guideUrl)
      .set(self.headers)
      .charset('gbk')
      .end(function(err, res) {
        var $ = cheerio.load(res.text)
        console.log(res.text);
      })
  },
  _identify: function(callback) {
    ocr(this.vcodePath, callback)
  }
}


module.exports = function(account) {
  return new Agent(account)
}
