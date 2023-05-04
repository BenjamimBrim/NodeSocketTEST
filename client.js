const net = require('net');
const { pipeline } = require('node:stream/promises');
const { PassThrough, Writable } = require('node:stream');
const { EventEmitter } = require('node:events');

class MyEmitter extends EventEmitter {}

const events = new MyEmitter();





events.on("message", data => {
    console.log(`${data.from}> ${data.data}`); 
})

const
    HOSTNAME = "localhost",
    HOST_PORT = 5561;

var reconnection = null;
var retry = true;
var retryTimeout = 1000


async function createConnection() {
    const client = net.connect({host: HOSTNAME, port: HOST_PORT});    
        client.on("close", () => { 
            console.log("connection closed");
            if (retry) {
                async function retry() {
                    console.log("retrying connection...");
                    setTimeout(() => {
                        createConnection().catch(console.error);
                    }, retryTimeout);
                }
                retry().catch(console.error)
            }
        })

        client.on('end', () => {
            console.log('disconnected from server');
            client.pause()
        });
        async function serverListener() {
            console.log("starting server stream...");
            const logstream = new PassThrough()
            logstream.on("data", (data) => process.stdout.write(data));
        
            await pipeline(
                client,
                ... [
                    async function* (source, { signal }) {
                        for await (const chunk of source) { 
                            const parsed = JSON.parse(chunk);
                            
                            if (parsed["type"] === 'message') {
                                events.emit("message", parsed)
                                // yield "received> " + chunk + "\r\n";
                            }
                        }
                    }
                ], 
                logstream
            )
        }
        
        async function readline(){
            console.log("Starting input stream...")
        
            await pipeline(
                process.stdin,
                ...[
                    async function* (source, { signal }) {
                        for await (const chunk of source) {
                            const message = {
                                data: String(chunk).substring(0, chunk.length-1),
                                type: "message"
                            }
                            yield JSON.stringify(message)
                        }
                    }
                ], 
                client
            )
            
        }
        client.on('error', console.error)
        client.on('connect', () => {
            console.log('connected to server!');    
            reconnection = null
            Promise.all([serverListener(), readline()]).catch(console.error);
        })
    
    
        
        
        
        
    
}



createConnection().catch(console.error)


