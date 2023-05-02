const { PassThrough, Writable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
var readline = require('readline');

const preprocessors = [
    async function* (source, { signal }) {
        for await (const chunk of source) { 
            yield "Preprocessed> "+chunk
        }
    }, 
]


async function run() {
    
    await pipeline(
        readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        }),
        ...preprocessors, 
        process.stdout
    )
}
run().catch(console.error);