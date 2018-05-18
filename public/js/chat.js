$(function(){
	var socket = io.connect('/chat');

	var user_info = $('#showClient').val();
	var oldInitDone = 0; //it is 0 when old-chat is not executed and 1 if executed.
	var roomId;  		 // for setting room.
	var toUser;


	// TO show user is logged on or off
	socket.on('connect',function(){

		socket.emit('user-info',user_info);

		// To show client is on or off
		socket.on('onOff',function(conn){
			$(".totalClient").append($('<p>').text(conn.conn));
		});
	});

	//receiving onlineState
	socket.on('onlineState',function(state){
		$('#groupMsg').empty();
		$('#groupMsg').append($('<li>').append($('<button id="ubtn" class="btn btn-danger btn-block btn-lg"></button>').text("Group").css({"font-size":"18px"})));
		var totalOnline = 0;
		for (var user in state){
			//setting txt1. shows users button.
			if(user == user_info){
				var txt1 = $('<button class="boxF disabled"> </button>').text(user).css({"font-size":"18px"});
			}
			else{
				var txt1 = $('<button id="ubtn" class="btn btn-success  btn-md">').text(user).css({"font-size":"18px"});
			}
			//setting txt2. shows online status.
			if(state[user] == "Online"){
				var txt2 = $('<span class="badge"></span>').text("*"+state[user]).css({"float":"right","color":"#009933","font-size":"18px"});
				totalOnline++;

			}
			else{
				var txt2 = $('<span class="badge"></span>').text(state[user]).css({"float":"right","color":"#a6a6a6","font-size":"18px"});
			}
			//listing all users.
			$('#groupMsg').append($('<li>').append(txt1,txt2));
			$('#totalOnline').text(totalOnline);
			}//end of for.
		$('#scrl1').scrollTop($('#scrl1').prop("scrollHeight"));
	});
	
	//on button click function.
	$(document).on("click","#ubtn",function(){

		//empty messages.
		$('#messages').empty();
		$('#typing').text("");
		oldInitDone = 0;

		//assigning friends name to whom messages will send,(in case of group its value is Group).
		toUser = $(this).text();

		//showing and hiding relevant information.
		$('#frndName').text(toUser);
		$('#initMsg').hide();
		$('#chatForm').show(); //showing chat form.

		//assigning two names for room. which helps in one-to-one and also group chat.
		if(toUser == "Group"){
		  var currentRoom = "Group-Group";
		  var reverseRoom = "Group-Group";
		}
		else{
		  var currentRoom = user_info+"-"+toUser;
		  var reverseRoom = toUser+"-"+user_info;
		}

		//event to set room and join.
		socket.emit('room-info',{user1:currentRoom,user2:reverseRoom});
	});



	//event for setting roomId.
	socket.on('room-info',function(room){
		//empty messages.
		$('#messages').empty();
		$('#typing').text("");
		oldInitDone = 0;
		//assigning room id to roomId variable. which helps in one-to-one and group chat.
		roomId = room;
		// console.log("roomId : "+roomId);
		//event to get chat history on button click or as room is set.
		socket.emit('old-chats',{room:roomId,userName:user_info,msgCount:msgCount});
	});



	//listening old-chats event.
	socket.on('old-chats-info',function(data){

		if(data.room == roomId){
		  oldInitDone = 1; //setting value to implies that old-chats first event is done.
		  if(data.result.length != 0){
		    $('#noChat').hide(); //hiding no more chats message.
		    for (var i = 0;i < data.result.length;i++) {
		      //styling of chat message.
		      var chatDate = moment(data.result[i].createdOn).format("MMMM Do YYYY, hh:mm:ss a");
		      var txt1 = $('<span></span>').text(data.result[i].msgFrom+" : ").css({"color":"#006080"});
		      var txt2 = $('<span></span>').text(chatDate).css({"float":"right","color":"#a6a6a6","font-size":"16px"});
		      var txt3 = $('<p></p>').append(txt1,txt2);
		      var txt4 = $('<p></p>').text(data.result[i].msg).css({"color":"#000000"});
		      //showing chat in chat box.
		      $('#messages').prepend($('<li>').append(txt3,txt4));
		      msgCount++;

		    }//end of for.
		    console.log(msgCount);
		  }
		  else {
		    $('#noChat').show(); //displaying no more chats message.
		    noChat = 1; //to prevent unnecessary scroll event.
		  }
		  //hiding loading bar.
		  $('#loading').hide();

		  //setting scrollbar position while first 5 chats loads.
		  if(msgCount <= 5){
		    $('#scrl2').scrollTop($('#scrl2').prop("scrollHeight"));
		  }
		}//end of outer if.
	});


	//receiving typing message.
	socket.on('typing',function(msg){
		var setTime;
		//clearing previous setTimeout function.
		clearTimeout(setTime);
		//showing typing message.
		$('#typing').text(msg);
		//showing typing message only for few seconds.
		setTime = setTimeout(function(){
		  $('#typing').text("");
		},3500);
	});


	$('form').submit(function(){
		// console.log('Came here 1');
		socket.emit('chat message',$('#m').val());
		$('#m').val('');
		return false;
	});

	socket.on('chat message', function(msg){
		// console.log('came here 2');
		$('.groupMsg').append($('<li>').text(msg));
	});

	//passing data on connection.
	socket.on('disconnect',function(){
		$('#typing').text("");
		$('#frndName').text("Disconnected..");
		$('#loading').hide();
		$('#noChat').hide();
		$('#initMsg').show().text("...Please, Refresh Your Page...");
		$('#chatForm').hide();
	});

});