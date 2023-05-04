// 192.168.10.111
const net = require("net");
const crypto = require("crypto");

const { PassThrough, Writable } = require('node:stream');

const { pipeline } = require('node:stream/promises');
const
  HOSTNAME = "0.0.0.0",
  HOST_PORT =  5561



const clientsStream = PassThrough()

clientsStream.on("close", () => { 
  console.log("clients stream closed")
})
var count = 0;

const server = net.createServer((client) => {
  client.setEncoding("utf-8")

  const connectionId = crypto.randomUUID()
  const clientIdentification = `${connectionId}:${client.remoteAddress}`;  

  console.log("client connected> ", clientIdentification);
  
  client.write(JSON.stringify({
    type: "message",
    data: "wellcome!",
    from: "server"
  }));
  
  client.on("data", (data) => {
    const parsed = JSON.parse(data);
    console.log(`${clientIdentification}> `, parsed)
    if (parsed["type"] === "message") {
      clientsStream.write(
        JSON.stringify(
          {
            ...parsed,
            from: clientIdentification
          }
        )
      )
    }
  })
  
  client.on("end", () => { console.log("disconnected> " + clientIdentification) })
  

  clientsStream.on("data", (data) => {  
    const parsed = JSON.parse(data);
    if (parsed["type"] === "message") {
      if (parsed["from"] != clientIdentification) {
        client.write(data)
      }
    }
  })
});

server.on("error", (err) => {
  throw err;
});

server.listen(HOST_PORT, HOSTNAME, () => {
  console.log(`server bound at ${HOSTNAME}:${HOST_PORT}`);
});
