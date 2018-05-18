var mongoose 	= require('mongoose');
var express 	= require('express');
var app 		= express();
var async 		= require("async");
var nodemailer	= require('nodemailer');
var crypto		= require('crypto');
var find 		= require('find');
var events  	= require('events');

var eventEmitter = new events.EventEmitter();


//express router used to define route
var appRouter 	= express.Router();

// var server = require('http').Server(app);
var io = require('socket.io');

// Loading Models
// var sGroup 		= mongoose.model('Group');
var sUser  		= mongoose.model('Single_User');
var msg  		= mongoose.model('Message');
var oUser		= mongoose.model('OneToOne');

// Authorization flow
var responseGenerator	= require('./../../libs/responseGenerator');
var auth 				= require('./../../middlewares/auth');
var crypto 				= require('./../../libs/crypto');
var key 				= 'Crypto-Key'

module.exports.controllerFunction = function(app){

	// ========== ERROR SCREEN ROUTE ==========//
	appRouter.get('/error',auth.isLoggedIn,function(req,res){
		res.render('error');
	});

	appRouter.get('/login',function(req,res){
		res.render('login');
	});

	appRouter.get('/signup',function(req,res){
		res.render('signup');
	});


	//========== SIGNUP ===============//
	appRouter.post('/signup',function(req,res){
		if(req.body.userName != undefined || req.body.userName == "" && req.body.email != undefined || req.body.email == "" && req.body.password != undefined || req.body.password == ""){

			sUser.findOne({'email':req.body.email},function(err,user){
				if(err){
					req.flash('error','Something Went Wrong');
					res.render('login');
				}else if(user && user!= null){
					req.flash('error','Email Already Exists');
					res.render('signup');
				} else{
					var newUser			= new sUser({
						userName		: 	req.body.userName,
						email			: 	req.body.email,
						mobileNumber	: 	req.body.mobile,
						password		: 	req.body.password
					});
					// console.log("data added");
					newUser.password = crypto.encrypt(key,req.body.password);

					newUser.save(function(error,result){
						if(error){
							req.flash('info',"Something is missing");
							res.render('error');
						}else if(result.email == null || result.email == "" || result.password == null || result.password == "" && result.userName == null || result.userName == ""){
							req.flash('error',"Some field is missing");
							res.render('signup');
						}
						else{
							console.log('user registered');
							req.session.user = newUser;
							// console.log("sessioned user ",req.session.user);
							delete req.session.user.password;
							req.flash('success',"Successfully Signed Up");
							res.render('login');
						}
					});//end newUser save
				}
			});
			
		}
		else{
			// console.log("error in first else");
			req.flash('error',"Some Fields are mssing");
			res.render('signup');
		}
	});


	// ================ LOGIN ============= //
	appRouter.post('/login',auth.loggedInUser,function(req,res){
		var pass = crypto.encrypt(key,req.body.password);
		// console.log("encrypted password ",pass);
		sUser.findOne({$and:[{'email':req.body.email},{'password':pass}]}).exec(function(err,foundUser){
			// console.log(foundUser+"came in login function");
			if(err){
				// console.log("error in starting");
				// var myResponse = responseGenerator.generate(true,"Serious error",404,null);
				// res.send(myResponse);
				req.flash('error','There is some error');
				res.render('error');
			}else if(foundUser == null || foundUser == undefined || foundUser.email == undefined || foundUser.password == null){
				console.log("error due to user info : ",foundUser);
				// var myResponse = responseGenerator.generate(true,"Check your Email Id and Password",404,null);
				// res.send(myResponse);
				req.flash('error','Invalid Username or Password');
				res.render('login');
			}else{
				// var myResponse = responseGenerator.generate(false,"Successfully logged in",200,myResponse);
				// res.send(myResponse);
				// console.log(foundUser);
				req.flash('success','Successfully logged in. Enjoy Shopping!!');
				req.session.user = foundUser;
				res.redirect('/users/chat');
			}
		});
	});

	appRouter.get('/chat',auth.isLoggedIn,function(req,res){
		// res.render('chat');
		msg.find().sort({msessage: -1}).limit(500).exec(function(err,msgChat){
			if(err){
				res.render('error');
			}
			else{
				// console.log(req.session.user);
				res.render('chat',{
					user:req.session.user
				});
				// eventEmitter.emit('sendChat',msgChat.message);
			}
		});
	});

	// ============ LOGOUT ============ //
	appRouter.get('/logout',function(req,res){
		req.session.user = null;
		res.end();
		res.redirect('/users/login');
	});

 	// ============ SETTING DEFAULT ROUTE =============//
	app.use('/users',appRouter);
}