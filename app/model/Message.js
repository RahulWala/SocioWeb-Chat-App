//including a module
var mongoose = require('mongoose');

 //declare schema object
var Schema 	 = mongoose.Schema;

var msgs = new Schema({
	
	message 	: {type:String,default:"",required:true},
    sender  	: {type:String,default:"",required:true},
    reciever	: {type:String,default:"",required:true},
    room		: [],
    date    	: {type:Date,default:Date.now}
});
mongoose.model('Message',msgs);