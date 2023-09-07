const app = require('express')();
const server = require('http').createServer(app);;
const io = require('socket.io')(server,{
    cors : {
        origin : "*"
        // methods : ["GET","POST","PUT","DELETE"],
        // allowedHeaders : ["my-custom-header"],
        // credentials: true
    }
});

// const cors = require('cors');




io.on('connection', (socket) => {
      console.log("what is socket : " , socket);
      console.log("socket is active to be connected");
            //   anyname , anyname for packet
      socket.on("chat", (payload) => {
           console.log("what is payload : " , payload);
           io.emit('chat', payload);
      })
});



server.listen(5000, () => {
  console.log('Server is running on port 5000...');
});
