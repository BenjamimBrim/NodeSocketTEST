const net = require('net');
var readlineSync = require('readline-sync');


const socket = net.connect(8124, "localhost", (event)=>{
    console.log("connected", event)

})

