const net = require('net');
var readlineSync = require('readline-sync');

const client = net.createConnection({host:'localhost', port: 8124 }, () => {
    return new Promise(() => { 
        console.log('connected to server!');
        client.on('data', (data) => {
            console.log(data.toString());
        });
        
        client.on('end', () => {
            console.log('disconnected from server');
        });
        readlineTsk(client);
    })
});




function readlineTsk(c) {
    var line = readlineSync.question('send: ');

    if (line == 'c' ) {
        return;
    } else {
        c.write(line);
    }

    setTimeout(()=>readlineTsk(c), 10)
}

