// import { io } from "socket.io-client";
// const URL = "ws://localhost:5000";
const URL = "https://300mm.top";
var socket = new io(URL, {
    withCredentials: false,
    extraHeaders: {
        "sio-header": "300mm"
    },
    path: "/a2",
    // transports: ["websocket"],
    debug: true
});

socket.on("connect", () => {
    //console.log('server connected'); console.log(socket.id);

    socket.on("user-list", (data) => {

        for (const sock of data.aryUser) {
            console.log(sock);
            sock == socket.id
                ? addUserlist(sock, 1)
                : addUserlist(sock);

        }

    });

    socket.on("room-msg", (data) => appendRoomMSG(data));
    socket.on("user-action", (data) => {
        //if (!userList.find(ele => ele===data.sockid)) {
        if (data.action === "1") { // enter room
            //userList.push(data.sockid);
            data.sockid == socket.id
                ? addUserlist(data.sockid, 1)
                : addUserlist(data.sockid);
        }
        if (data.action === "2") { // leave room
            let userNode = document.getElementById(data.sockid);
            objUsrList.removeChild(userNode);
        }
        //}
    });

});

// page interaction code
const objMsgList = document.getElementById("msglist_room");
const objMsgView = document.getElementById("msg_content");
const objUsrList = document.getElementById('ulist_online');

function addUserlist(sockID, self = 0, objUserlist = objUsrList) {
    if (!document.getElementById(sockID)) {

        let newUser = document.createElement("li");
        newUser.id = sockID;
        newUser.innerText = sockID.substring(0,4);

        if (self) {
            newUser.className = "list-group-item bg-primary text-white";
        } else {
            newUser.className = "list-group-item bg-secondary text-white";
        }
        objUserlist.appendChild(newUser);
    }
}

function appendRoomMSG(msg, objMsg = objMsgList, objView = objMsgView) {
    let newMsg = document.createElement("li");
    newMsg.innerText = msg.usr.substring(0,4) + ": " + msg.msg //msg;
      
    newMsg.className = "list-group-item";

    objMsg.appendChild(newMsg);
    objView.scrollTop = objMsgView.scrollHeight;
}

document
    .getElementById("sendMsg")
    .addEventListener("click", () => {

        let msgSend = document
            .getElementById("txtMsg")
            .value;

        // socket.emit("Hello", msgSend);

      socket.emit("Hello", {
        msg: msgSend,
        usr: socket.id
      }, (data) => {

	document.getElementById("txtMsg").value = "";
	 });

    });

document.getElementById("txtMsg").addEventListener("keydown", (ev) => {
  if (ev.code === "Enter") {
    document.getElementById("sendMsg").click();
  }
});
