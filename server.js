var express = require('express');  
var app = express();  
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//待储存所有玩家


app.use(express.static(__dirname + '/public'));
//redirect / to our index.html file
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});  

//when a client connects, do this
io.on('connection', function(socket) {
    console.log(socket.id)
    socket.on('dir',(dir)=>{
        // console.log(x,y,frame)
        socket.broadcast.emit('g-dir',dir)
    })
    socket.on('disconnect', function(){
		
		socket.broadcast.emit('delPlayer');
	});
});

	
//start our web server and socket.io server listening
server.listen(3000, function(){
 	console.log('listening on *:3000');
});

