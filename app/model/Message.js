//including a module
var mongoose = require('mongoose');

 //declare schema object
var Schema 	 = mongoose.Schema;

var msgs = new Schema({
	
	message : String,
    sender  : String,
    reciever: String,
    date    : Date
});
mongoose.model('Message',msgs);