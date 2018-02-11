var mongoose	= require('mongoose');
// var socketIo	= require('socket.io');

require('../app/model/Group.js');
require('../app/model/Single_User.js');
require('../app/model/Message.js');
require('../app/model/OnlineUser.js');

var sGroup 		= mongoose.model('Group');
var sUser  		= mongoose.model('Single_User');
var msg  		= mongoose.model('Message');
var oUser		= mongoose.model('OnlineUser');

module.exports = function(server){

	console.log(server);
	io = require('socket.io')(server);

	var ioChat = io.of('/users/chat');
	
	ioChat.on('connection',function(socket){

		console.log('In connection function');

		socket.on('chat message',function(msg){
			ioChat.emit('chat message',msg);
		})
	});
}