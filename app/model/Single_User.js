//including a module
var mongoose = require('mongoose');

 //declare schema object
var Schema 	 = mongoose.Schema;

var sUser = new Schema({
	
	userName		: 	{type:String, default:'', required:true},
	email			: 	{type: String, required:true},
	mobileNumber	: 	{type:Number, default:''},
	password		: 	{type:String, default:'', required:true},
	resetPasswordToken		: {type:String},
  	resetPasswordExpires	: {type:Date,default:Date.now}
});
mongoose.model('Single_User',sUser);