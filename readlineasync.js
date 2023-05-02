exports.subscribe = async function ({input, output}) {
    const { PassThrough, Writable } = require('node:stream');

    const pass = new PassThrough();

    var readline = require('readline');
    var rl = readline.createInterface({
        input,
        output,
        terminal: false
    });

    return rl
}

