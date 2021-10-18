const  io = require("socket.io-client");

const URL = "ws://localhost:3000";


const socket = io(URL, {
    withCredentials: false,
    extraHeaders: {
      "sio-header": "300mm"
    }
  });

socket.on("connect", () => {
  console.log('server connected');
  
  socket.emit("Hello", (response) => {

    console.log(response.status); // ok
  });
});



  socket.on("disconnect", (reason) => {
      console.log(`disconnect due to ${reason}`);
      socket.close();
  });


  // socket.connect();
