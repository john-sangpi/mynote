const htttp = require('http');
const route = require('./app');


const port = process.env.PORT || 4000;
const server = htttp.createServer(route);
server.listen(port, function(){
    console.log("server is listening to port number",port);
})