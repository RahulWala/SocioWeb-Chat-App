var express = require('express');
var app 	= express();

var server = require('http').Server(app);

var logger 		 = 	require('morgan');
var bodyParser 	 = 	require('body-parser');
var cookieParser = 	require('cookie-parser');
var session 	 = 	require('express-session');
var mongoose 	 =  require('mongoose');
var fs 			 =  require('fs');
var methodOverride = require('method-override')
var flash 		 =  require('express-flash');

//used to get the path of our view files in our system
var path 		 = require('path');

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser('_method'));
app.use(bodyParser.json());
app.use(flash());

app.use(session({
	name	: 	'myFirstCookie',
	secret	: 	'R@W@1209348756',
	resave	: 	 true,
	httpOnly: 	 true,
	saveUninitialized : true,
	cookie 	: 	{ secure : false}
}));

app.use(methodOverride(function(req,res){
	if(req.body && typeof req.body == 'object' && '_method' in req.body){
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}));

	//loading sockets
	require('./libs/chats.js')(server);

	app.use('/users/chat',express.static(path.join(__dirname, 'public')));

	//set the view folder
	app.set('views',path.join(__dirname+'/app/views'));

	//setting the templating engine
	app.set("view engine",'ejs');



	

	//it will log or keep track of all the request that are made to the app
	app.use(logger('dev'));




	//defining configuration of mongodb or at eCart it will create db
	var dbPath = "mongodb://localhost/socioWebs";


	//telling mongo db to connect at dbPath or connect database
	db = mongoose.connect(dbPath);

	//checking connection is open or not
	mongoose.connection.once('open',function(){
		console.log("Database Connection is open....");
	});


	/*****************************************/
	/*			Model And View files  		*/
	/***************************************/
	fs.readdirSync('./app/model').forEach(function(file){
		if(file.indexOf('.js'))
			require('./app/model/'+file);
	});

	fs.readdirSync('./app/controllers').forEach(function(file){
		if(file.indexOf('.js')){
			var control = require('./app/controllers/'+file);

			control.controllerFunction(app);
		}
	});


	/*****************************************/
	/*	Auth File toCheck Authentication	*/
	/***************************************/
	var auth = require('./middlewares/auth');
	app.use(auth.loggedInUser);


	/*****************************************/
	/*				Error Route		 		*/
	/***************************************/
	app.get('*',function(request,response,next){
		response.status = 404 ;
		//similar to next(err) i.e calling error
		next("Error in path");
	});


	/*****************************************/
	/*		Error Handling Middlware  		*/
	/***************************************/
	app.use(function(err,req,res,next){
		// console.log("Custom Error handler used");
		if(res.status == 404){
			req.flash('error','Oops ! Entered Wrong Route');
			res.render('login');
		}
		else{
			res.render('login');
		}
	}); 


	

	/*****************************************/
	/*			Listening Ports		  		*/
	/***************************************/
	server.listen(8000,function(){
		console.log("App started listening on port 8000.....");
	});
