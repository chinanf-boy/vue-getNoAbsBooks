var urijs = require('urijs');
let U = 'http://www.sodu.cc'
let uri = new urijs(U)
String.prototype.trimStr = function (str) {
    return this.replace(new RegExp(`^[${str}]+|[${str}]+$/g`), '');
  };

let I = ['/1234' ,'/1234.html' ,'/books/1243/2134' ,'books/1243//2134' ,'1243//2134']

const l = console.log.bind(console)



I.map(x =>{
    x = x.trimStr('/')

    
    l(uri.segmentCoded(x).href())
    uri.directory("/bar")
    l(uri.href())
    uri.directory("")
    
    
})