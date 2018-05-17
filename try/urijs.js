const l = // console.log.bind(console)
var urijs = require('urijs');
let U = 'http://www.sodu.cc'
let uri = new urijs(U)

let I = '134234/1234234/'

l(uri.segment(I))
l(uri.segment('/'))


// let I = ['/1234/' ,'/1234.html' ,'/books/1243/2134' ,'books/1243//2134' ,'1243//2134']




// // I.map(x =>{
// //     x = x.trimStr('/')

    
// //     l(uri.segmentCoded(x).href())
// //     uri.directory("/bar")
// //     l(uri.href())
// //     uri.directory("")
    
    
// // })
// l()
// var U2 = new urijs("http://example.org/#!/foo/bar/baz.html");

// var furi = U2.fragment(true);
// l(furi.pathname())
// l(furi.pathname() === "/foo/bar/baz.html");

// l(furi.pathname("/hello.html").href());

// U2.fragmentPrefix = '?'
// l(furi)

// l(urijs.fragmentPrefix = "?");
// l()
// var U3 = new urijs("http://example.org/foo/bar/baz.xml")

// l(U3.suffix('html').href())

// l()
// var U4 = new urijs("http://example.org/foo/bar/baz")

// l(U4.filename())

// l()
// var U5 = new urijs("http://example.org/foo/bar/baz/index_3")

// l(U5.suffix())

// l()
// var U6 = new urijs("http://example.org/foo/bar/baz/index_3")

// l(U6.suffix('html').href())

// l()
// var U7 = new urijs("http://example.org/foo/bar/baz/index_3")

// l(U7.origin())