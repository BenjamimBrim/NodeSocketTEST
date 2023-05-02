var readlineSync = require("readline-sync");

// 192.168.10.111
const net = require("net");

const server = net.createServer((c) => {
  return new Promise(() => {
    console.log("client connected");
    c.on("end", () => {
      console.log("client disconnected");
    });

    c.on("data", (data) => {
      console.log("client: ", data.toString());
    });

    c.write("bem vindo!");

    readlineTsk(c);
  });
});

server.on("error", (err) => {
  throw err;
});

server.listen(8124, () => {
  console.log("server bound");
});

function readlineTsk(c) {
  return new Promise(() => {
    // var line = readlineSync.question('send: ');
    for (let index = 0; index < array.length; index++) {
      c.write(index);
    }
    // if (line == "c") {
    //   return;
    // } else {
    //   c.write(line);
    // }

    setTimeout(() => readlineTsk(c), 1000);
  });
}
