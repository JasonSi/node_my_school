# Node My School

## Description
This is a refactoring followed the [hack_my_school](http://github.com/JasonSi/hack_my_school) by using Node.js instead of Ruby.

Because of the fucking error "too many connection resets" of Mechanize in Ruby, I decide to rewrite a crawler with Node.js, and practice JavaScript programming by the way.

[Why I Gave up Mechanize](http://www.jasonsi.com/2016/08/04/19/)

## TODO

- [x] Simulate logging in the education administration system of our school.
- [x] Recognize the captcha automatically with Tesseract-OCR.
- [x] Parse the HTML to achieve scores, and beautify them into a proper data structure.
- [ ] Design an algorithm to judge whether there are updated scores.
- [ ] Send email if scores updated.
- [ ] Use asynchronous method to support more subscribers.
- [ ] Bold the new scores in the email.
