var mongoose	= require('mongoose');
var events 		= require('events');
// var socketIo	= require('socket.io');

require('../app/model/Single_User.js');
require('../app/model/Message.js');
require('../app/model/OneToOne.js');

// var sGroup 		= mongoose.model('Group');
var sUser  		= mongoose.model('Single_User');
var msg  		= mongoose.model('Message');
var oUser		= mongoose.model('OneToOne');

var events  	= require('events');

var eventEmitter = new events.EventEmitter();


module.exports = function(server){

	// console.log(server);
	io = require('socket.io')(server);

	var ioChat = io.of('/chat');
	var userInfo = {}; 
	var preChat,sendUserState, roomInfo;
	var socketUser ={};
	
	ioChat.on('connection',function(socket){
		// console.log('In connection function');


		// To show username
		socket.on('user-info',function(uName){
			// console.log('UserName is coming ',uName);

			//storing name tosee online or offline
			socket.username = username;
      		socketUser[socket.username] = socket.id;

			socket.broadcast.emit('onOff',{ conn : uName + ' Logged in'});


			// To get all user list
			eventEmitter.emit('all-user');

			sendUserState = function(){
				for(i in socketUser){
					for(j in userInfo){
						if(j == i){
							userInfo[j] = 'Online';
						}
					}
				}

				//for aowing other user connection message.
        		ioChat.emit('onlineState', userInfo);
			}
		});

	    //setting room.
	    socket.on('room-info', function(room) {

	      // leaving room.
	      socket.leave(socket.room);

	      // getting single room data.
	      eventEmitter.emit('room-data', room);

	      // setting room and join.
	      roomInfo = function(roomId) {
				socket.room = roomId;
				// console.log("getting roomId : " + socket.room);
				socket.join(socket.room);
				ioChat.to(socketUser[socket.username]).emit('room-info', socket.room);
	    	};
	    });

	    //emits event to read old-chats-init from database.
	    socket.on('old-chats', function(data) {
	      eventEmitter.emit('old-chat-read', data);
	    });

	    //emits event to read old chats from database.
	    socket.on('old-chats-info', function(data) {
	      eventEmitter.emit('old-chat-read', data);
	    });

	    //sending old chats to client.
	    preChats = function(result, username, room) {
	      ioChat.to(socketUser[username]).emit('old-chats-info', {
	        result: result,
	        room: room
	      });
	    }


	    // Typing Function.
	    socket.on('typing', function() {
	      socket.to(socket.room).broadcast.emit('typing', socket.username + " : is typing...");
	    });


	    //for showing chats.
	    socket.on('chat-msg', function(data) {

	      //emits event to save chat to database.
	      eventEmitter.emit('save-chat', {
	        sender: socket.username,
	        receiver: data.receiver,
	        message: data.message,
	        room: socket.room,
	        date: data.date
	      });

	      //emits event to send chat msg to all clients.
	      ioChat.to(socket.room).emit('chat-msg', {
	        sender: socket.username,
	        message: data.message,
	        date: data.date
	      });
	    });


	    //for popping disconnection message.
		socket.on('disconnect', function() {

		  // console.log('Logout function : '+socket.username);
		  socket.broadcast.emit('onOff',{ conn: socket.username + ' Logged out'});

		  // console.log("User disconnected.");

		  _.unset(socketUser, socket.username);
		  userInfo[socket.username] = "Offline";

		  ioChat.emit('onlineState', userStack);
		});



		// Loading Previous Messages
		msg.find().limit(10).sort({_id : -1}).exec(function(err,chatMsgs){
				if(err){
					console.log('error');
				}else{
					for(i in chatMsgs){
						console.log(chatMsgs[i].message);
						// ioChat.emit('chat message',chatMsgs[i].message);
					}
					// ioChat.emit('chat message',chatMsgs.message);
				}
		});


		// For Showing Current Messages
		socket.on('chat message',function(msg){

			eventEmitter.emit('saveMsg',msg);
			ioChat.emit('chat message',msg);
		});

	});

	//saving msgs to mongodb
	eventEmitter.on('saveMsg', function(data) {

	var msgSaving = new msg({
	  sender 	: data.sender,
	  receiver 	: data.receiver,
	  message 	: data.message,
	  room 		: data.room,
	  createdOn : data.date
	});

	msgSaving.save(function(err, result) {
	  if (err) {
	    // console.log("Error : " + err);
	  } else if (result == undefined || result == null || result == "") {
	    console.log("Chat Is Not Saved.");
	  } else {
	    console.log("Chat has been Saved.");
	    //console.log(result);
	  }
	});
	});

	//reading msgs from database.
	eventEmitter.on('old-chat-read', function(data) {

	msg.find({})
	  .where('room').equals(data.room)
	  .sort('-createdOn')
	  .skip(data.msgCount)
	  .lean()
	  .limit(10)
	  .exec(function(err, result) {
	    if (err) {
	      console.log("Error : " + err);
	    } else {
	      //calling function which emits event to client to show chats.
	      preChats(result, data.username, data.room);
	    }
	  });
	});
	

	//listening for get-all-users event. creating list of all users.
	eventEmitter.on('all-user', function() {
	sUser.find({})
	  .select('username')
	  .exec(function(err, result) {
	    if (err) {
	      console.log("Error : " + err);
	    } else {
	      //console.log(result);
	      for (var i = 0; i < result.length; i++) {
	        stackUser[result[i].username] = "Offline";
	      }
	      //console.log("stack "+Object.keys(userStack));
	      sendUserState();
	    }
	  });
	});


	//listening get-room-data event.
	eventEmitter.on('room-data', function(room) {
	oUser.find({
		  $or: [{
		    user1: room.user1
		  }, {
		    user1: room.user2
		  }, {
		    user2: room.user1
		  }, {
		    user2: room.user2
		  }]
		}, function(err, result) {
		if (err) {
		    console.log("Error : " + err);
		} else {
		    if (result == "" || result == undefined || result == null) {

		      var today = Date.now();

		      newRoom = new oUser({
		        user1: room.user1,
		        user2: room.user2,
		        createdOn: today
		      });

		    newRoom.save(function(err, newResult) {
		        if (err) {
		          console.log("Error : " + err);
		        } else if (newResult == "" || newResult == undefined || newResult == null) {
		          console.log("Error Occured During Room Creation");
		        } else {
		          roomInfo(newResult._id); //calling setRoom function
		        }
		    });
		    } else {
		      var jresult = JSON.parse(JSON.stringify(result));
		      roomInfo(jresult[0]._id); //calling setRoom function
		    }
		  } //end of else.
		}); //end of find room.
	});
}