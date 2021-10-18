const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const PORT = 3000
const APP = express();

const httpServer = http.createServer(APP);
const SIO = new socketio.Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: [
            "GET", "POST"
        ],
        allowedHeaders: ["sio-header"],
        credentials: false
    }
    /* options */
});

async function usersInRoom() {
    const sockets = await SIO.fetchSockets();
    let userlist = [];
    for (const sock of sockets) {
        userlist.push(sock.id);
        // console.log('userInRoom:' + sock);
    }
    return userlist;
}

// socket-io server handler
SIO.on("connection", (socket) => {
    console.log(socket.id); // ojIckSD2jqNzOqIrAGzL

    usersInRoom().then(t => {
        SIO.emit("user-list", {
            aryUser: t,
        });
    });
    
    socket.on("disconnect", (reason) => {

        SIO.emit("user-action", {
            "sockid": socket.id,
            "action": "2"
        });

        console.log(`Disconnect from user ${reason}, socketid=${socket.id}`);
    });
    socket.on("error", (error) => {
        console.log(`Error occur from user ${error}`);
    });


    SIO.emit("user-action", {
            "sockid": socket.id,
            "action": "1"
    });
    
    socket.on("Hello", (msg, callback) => {
        
        SIO.emit("room-msg", msg);
        // socket.emit("Hello", msg);
        // console.log("Hello event fired!" + msg);
        callback({
            txmsg: msg,
            status: "ok"
        });
        
    });
});

// Test express router
APP.get('/look', (req, res) => {
    console.log('Handle by express framework');
    res.send("Handle by express framework2");
});

// Static Serving
APP.use('/html', express.static(path.basename('../static')));

httpServer.listen(PORT);