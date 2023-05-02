// 192.168.10.111
const net = require("net");

const { PassThrough, Writable } = require('node:stream');

const { pipeline } = require('node:stream/promises');



const clientsStream = PassThrough()

clientsStream.on("close", () => { 
  console.log("clients stream closed")
})

const server = net.createServer((client) => {
  console.log("client connected");
  client.write("bem vindo!");
  client.on("data", (data) => { 
    clientsStream.write(data)
  })
  client.on("end", () => { console.log("client disconnected") })
  clientsStream.pipe(client)
});

server.on("error", (err) => {
  throw err;
});

server.listen(8124, () => {
  console.log("server bound");
});

async function logger() {

  await pipeline(
    clientsStream,
    ... [
      async function* (source, { signal }) {
        for await (const chunk of source) {
          yield "client> " + chunk
        }
      }
    ],
    process.stdout
  ).catch(err => {    
    console.error(err)
  })
}

Promise.all([logger()]).catch(console.err)

