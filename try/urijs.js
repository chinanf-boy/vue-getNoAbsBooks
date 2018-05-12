var urijs = require('urijs');
let U = 'http://www.sodu.cc/books/fooo'
let uri = new urijs(U)

uri.directory("/bar")

let I = ['/1234' ,'/1234.html' ,'/books/1243/2134' ,'books/1243//2134' ,'1243//2134']

const l = console.log.bind(console)



I.map(x =>{
    x = x.trim('/')
    l(uri.segmentCoded(x).href())
})