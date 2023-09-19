// const Person = require('./person');

// const person1 = new Person('kishore',22);

// person1.greeting();



const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req,res) => {
    if(req.url==='/'){
        fs.readFile(path.join(__dirname, 'public', 'index.html'),(err,content)=>{
            if(err) throw err;
            res.writeHead(200,{'content-Type': 'text/html'});
            res.end(content)
        })
    }
    if(req.url==='/about'){
        fs.readFile(path.join(__dirname, 'public', 'about.html'),(err,content)=>{
            if(err) throw err;
            res.writeHead(200,{'content-Type': 'text/html'});
            res.end(content)
        })
    }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT,() => console.log(`server is running on ${PORT}`));