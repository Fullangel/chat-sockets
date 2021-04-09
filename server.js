// Hecho por fullangel como una practica y proyecto en nodejs 

const { Server } = require("net");

const host = '0.0.0.0';
const END = 'END';

// 127.0.0.1:8000 -> 'fullangel'
// 127.0.0.1:8000 -> 'test'
const connections = new Map();

const error = (message) => {
    console.log(message);
    process.exit(1);
};

const sendMessage = (message, origin) => {
    for(const socket of connections.keys()){
        if(socket !== origin){
            socket.write(message);
        }
    }
};

const listen = (port) => {
    const server = new Server();

    server.on('connection', (socket) => {
        const remoteSocket = `${socket.remoteAddress} : ${ socket.remotePort }`;
        console.log(`New connection from ${remoteSocket}`);
        socket.setEncoding('utf-8');

        socket.on('data', (message) => {
            if(!connections.has(socket)){
                console.log(`Username ${ message } set for connection ${ remoteSocket }`);
                connections.set(socket, message);
            }
            else if(message === END){;
                console.log(`Connection with ${ remoteSocket } closed`);
                connections.delete(socket);
                socket.end();
            } else {
                const fullMessage = `[${ connections.get(socket) }]: ${ message }`;
                console.log(`${ remoteSocket } -> ${ fullMessage }`);
                sendMessage(fullMessage, socket);
            }
        });

        socket.on('error', (err) => error(err.message));
    
        socket.on('close', () => {
            console.log(`Connection with ${ remoteSocket } closed `);
        });
    });
    
    server.listen({ port, host }, () => {
        console.log(`Listening Server on port: ${ port }`);
    });

    server.on('error', (err) => error(err.message));
};

const main = () => {
    if(process.argv.length !== 3){
        error(`Usage: node ${ __filename } port`);
    }
    let port = process.argv[2];
    if(isNaN(port)){
        error(`Invalid port ${ port }`);
    }
    port = Number(port);

    listen(port);
};

if(require.main === module){
    main();
}


