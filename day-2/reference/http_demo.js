const http = require('http');

http.createServer((req,res) => {
    //write response
    res.write('hello world');
    res.end();
}).listen(5000, ()=> console.log('server running....'));