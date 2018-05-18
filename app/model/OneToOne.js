//including a module
var mongoose = require('mongoose');

 //declare schema object
var Schema 	 = mongoose.Schema;

var oneToOne = new Schema({
	user1 : {type:String,default:"",required:true},
	user2 : {type:String,default:"",required:true},
	totalPpl : [],
	createdOn : {type:String,default:Date.now}
});
mongoose.model('OneToOne',oneToOne);