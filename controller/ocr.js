var tesseract = require('node-tesseract')

module.exports = function(image, callback) {
  var options = {
    l: 'eng',
    psm: 7,
    config: '-c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz'
  }

  tesseract.process(image, options, function(err, text) {
    if (err) {
      console.error(err)
    } else {
      callback(text.replace(/\s/g, ''))
    }
  });
}
