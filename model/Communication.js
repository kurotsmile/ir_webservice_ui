// const io = require('socket.io-client');
// const socket = io('http://your-pi4-address:port');

// function routine07(socket) {
//     // Create an array of 4 bytes
//     const cmd = [0x07, 0x00, 0x07, 0x00];

//     // Create a dictionary
//     const cmdInfo = { "routine07": cmd, "resplen": 508 };

//     // Send cmdInfo via socket.io to PI4
//     socket.emit('routine07', cmdInfo);
// }

// function routine0E(socket) {
//     // Create an array of 4 bytes
//     const cmd = [0x0E, 0x00, 0x0E, 0x00];

//     // Create a dictionary
//     const cmdInfo = { "routine0E": cmd, "resplen": 248 };

//     // Send cmdInfo via socket.io to PI4
//     socket.emit('routine0E', cmdInfo);
// }

function sendCmds(socket, cmd) {
    socket.send(cmd)
}

export {sendCmds };

