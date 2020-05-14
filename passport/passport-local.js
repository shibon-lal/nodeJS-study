'use strict';

const passport = require('passport');
const User = require('../models/user');
const localStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

passport.use('local.signup', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, (req, email, password, done) => {

	User.findOne({
		'email': email
	}, (err, user) => {
		if (err) {
			return done(err);
		}

		if (user) {
			return done(null, false, req.flash('signup-error', 'User with email already exist'));
		}

		const newUser = new User();
		newUser.username = req.body.username;
		newUser.fullname = req.body.username;
		newUser.email = req.body.email;
		newUser.password = newUser.encryptPassword(req.body.password);
		newUser.save((err) => {
		done(null, newUser);
			
		});
	});
}));


passport.use('local.login', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, (req, email, password, done) => {
	User.findOne({
		'email': email
	}, (err, user) => {
		if (err) {
			return done(err);
		}
		const message = [];
		if (!user || !user.validUserPassword(password)) {
			message.push('Email does not exists or Password is Invalid');
			
			return done(null, false, req.flash('login-error', message));
		}
		var sess = req.session;
		sess.email= user.email;
		console.log(sess.email);
		return done(null, user);

	});
}));
