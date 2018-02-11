//including a module
var mongoose = require('mongoose');

 //declare schema object
var Schema 	 = mongoose.Schema;

var onlineUser = new Schema({
	handle:String,
    connection_id:String
});
mongoose.model('OnlineUser',onlineUser);