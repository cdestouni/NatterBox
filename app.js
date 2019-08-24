var fs = require('fs');
var http = require('http');
var app = http.createServer(function (req, res) {
	var file = "";
	
	if (req.url === "/") {
		file = __dirname + '/index.html';
	} else {
		file = __dirname + req.url;
	}
	
	fs.readFile(file, function(err, content) {
		
		if (err) {
			res.writeHead(404);
			return res.end('Page or file not found');
		}
		
		res.writeHead(200);
		res.end(content);
	});
});
var io = require('socket.io')(app);

function getCurrentDate() {
	
    var currentDate = new Date();
    var day = (currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate();
    var month = ((currentDate.getMonth() + 1) < 10 ? '0' : '') + (currentDate.getMonth() + 1);
    var year = currentDate.getFullYear().toString().substr(-2);
    var hour = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
    var minute = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
    var second = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();
    return day + "-" + month + "-" + year + " " + hour + ":" + minute + ":" + second;  
}


io.on("connection", function(socket) {
	
    socket.on("send message", function(data, callback) {
        var sent_msg = "["+ data.username + "][ " + getCurrentDate() + " ]: " + data.message;
        io.sockets.emit("update messages", sent_msg);
        if(callback){
        	callback();
        }
    });
    
});

app.listen(3000, function(){
	console.log("App running...");
});
