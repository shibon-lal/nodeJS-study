const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const dataTables = require('mongoose-datatables');
const flash = require('connect-flash');
const passport = require('passport');
const container = require('./container');
const multer = require('multer');
var path = require('path');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		
	console.log('file upload');
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		let extArray = file.mimetype.split("/");
		let extension = extArray[extArray.length - 1];
		cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
	}
});

const upload = multer({
	fileFilter: function (req, file, cb) {
		console.log(req);
		var filetypes = /jpeg|jpg/;
		var mimetype = filetypes.test(file.mimetype);
		var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
		if (mimetype && extname) {
			return cb(null, true);
		}
		console.log('file upload error');
		return cb(true, true);
		//return cb(new Error('I don\'t have a clue!'));
	},
	storage: storage
});
container.resolve(function (users, dashboard, eventsController,pagesController, _) {

	mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://localhost:27017/myproject');

	const app = SetupExpress();

	function SetupExpress() {
		const app = express();
		const server = http.createServer(app);
		server.listen(3000, function () {
			console.log('listening on port 3000');
		});
		ConfigureExpress(app);
		//router
		const router = require('express-promise-router')();
		users.SetRouting(router);
		dashboard.SetRouting(router);
		eventsController.SetRouting(upload, router);
		pagesController.SetRouting(router);
		app.use(router);
	}


	function ConfigureExpress(app) {

		require('./passport/passport-local');

		app.use(express.static('public'));
		app.use(cookieParser());
		app.set('view engine', 'ejs');
		app.use(bodyParser.json({limit: '50mb', extended: true}));
		app.use(bodyParser.urlencoded({
			limit: '50mb',
			extended: true
		}));
		app.use(validator());
		app.use(session({
			secret: 'thisismykey',
			resave: true,
			saveinitialized: true,
			cookie: { maxAge: 600000 },
			store: new MongoStore({
				mongooseConnection: mongoose.connection
			})
		}));
		app.use(flash());
		
		app.use(passport.initialize());
		app.use(passport.session());

		app.locals._ = _;

	}
});
