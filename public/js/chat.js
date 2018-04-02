$(function(){
	var socket = io.connect('/chat');

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

	//To show client is on or off
	socket.on('onOff',function(conn){
		$(".showClient").append($('<li>').text(conn.info));
	});

	socket.on('offOn',function(conn){
		$('.totalClient').append(('<h3>').text(conn.info));
	})
});