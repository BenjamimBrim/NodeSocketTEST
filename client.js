const net = require('net');
const { pipeline } = require('node:stream/promises');


const client = net.createConnection({host:'localhost', port: 8124 }, () => {
    console.log('connected to server!');    
    
    // client.on('data', (data) => {
    //     // console.log(data.toString());
    // });
    
    client.on('end', () => {
        console.log('disconnected from server');
    });
});

async function connect() {
    console.log("starting server stream...");
    
    await pipeline(
        client,
        ...[
            async function* (source, { signal }) {
                for await (const chunk of source) { 
                    yield "server> "+chunk+"\r\n";
                }
            }
        ], 
        process.stdout
    )
}

async function readline(){
    console.log("Starting input stream...")

    // var rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    //     terminal: false
    // });
    // rl.on('line', (line) => {
    //     client.write(line)
    // })

    await pipeline(
        process.stdin,
        ...[
            async function* (source, { signal }) {
                for await (const chunk of source) { 
                    yield chunk
                }
            }
        ], 
        client
    )
    
}

Promise.all([connect(), readline()]).catch(console.error);






