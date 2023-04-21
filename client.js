const net = require('net');


const socket = net.connect(8124, "192.168.10.111", (event)=>{
    console.log("connected")
})


