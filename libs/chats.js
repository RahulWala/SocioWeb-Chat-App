var mongoose	= require('mongoose');
var events 		= require('events');
// var socketIo	= require('socket.io');

require('../app/model/Group.js');
require('../app/model/Single_User.js');
require('../app/model/Message.js');
require('../app/model/OnlineUser.js');

var sGroup 		= mongoose.model('Group');
var sUser  		= mongoose.model('Single_User');
var msg  		= mongoose.model('Message');
var oUser		= mongoose.model('OnlineUser');

var events  	= require('events');

var eventEmitter = new events.EventEmitter();


module.exports = function(server){

	// console.log(server);
	io = require('socket.io')(server);

	var ioChat = io.of('/chat');

	ioChat.on('connection',function(socket){
		// console.log('In connection function');

		// Loading Previous Messages
		msg.find().limit(10).exec(function(err,chatMsgs){
				if(err){
					console.log('error');
				}else{
					for(i in chatMsgs){
						// console.log(chatMsgs[i].message);
						ioChat.emit('chat message',chatMsgs[i].message);
					}
					// ioChat.emit('chat message',chatMsgs.message);
				}
		});

		socket.broadcast.emit('onOff',{ info : ' Client Connected!'});

		// For Showing Current Messages
		socket.on('chat message',function(msg){

			eventEmitter.emit('saveMsg',msg);
			ioChat.emit('chat message',msg);
		});

	});

	// Saving messages in mongodb
	eventEmitter.on('saveMsg',function(data){
		
		var msgSaving = new msg({
			message : data
		});

		msgSaving.save(function(error,result){
			if(error){
				console.log('error');
			}
			else if(result == null || result == undefined){
				console.log('error is : ',error);
			}
			else{
				console.log('data saved ',msgSaving);
			}
		});
	});
	
}