const http = require("http");

http.createServer((req,res)=>{
    res.writeHead(200,{"content-type": "text/html"})
    res.write("Welcome to server");
    res.end();
},    console.log("file running..")
).listen(3000);





