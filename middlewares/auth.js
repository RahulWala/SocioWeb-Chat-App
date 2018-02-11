var mongoose = require('mongoose');
var userModel = mongoose.model('Single_User');
var groupModel = mongoose.model('Group');
var responseGenerator	= require('./../libs/responseGenerator');

module.exports.loggedInUser = function(req,res,next){
	if(req.session.user){
		
		userModel.findOne({$and:[{'userName' : req.session.user.userName},{'password' : req.session.user.password}]},function(err,user){
			if(user){
				// console.log(user);
				req.session.user = user;
				delete req.session.user.password;
				next();
			}else{
				//do nothing
			}
		});
	} else{
		next();
	}
}

module.exports.isLoggedIn = function(req,res,next){
	
	//showing some user info after setting null also
	// console.log(req.session.user);

	if(req.session.user == null){
		// console.log("iiiiiiiiiiiiifffffffffff");
		// res.send("clear");
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        // console.log("Hiiiiiiiiiiiii");
		res.redirect('/users/index');
	}else{
		// console.log("Yooooooooo");
		next();
	}
}