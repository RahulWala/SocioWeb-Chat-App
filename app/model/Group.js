//including a module
var mongoose = require('mongoose');

 //declare schema object
var Schema 	 = mongoose.Schema;

var sGroup = new Schema({
	
	userName		: 	{type:String, default:'', required:true},
	firstName		: 	{type:String, required:true},
	lastName		: 	{type:String, required:true},
	mobileNumber	: 	{type:Number, default:''},
	password		: 	{type:String, default:'', required:true},
	resetPasswordToken		: {type:String},
  	resetPasswordExpires	: Date
});

mongoose.model('Group',sGroup);