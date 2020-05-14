'use strict';

module.exports = function () {
	return {
		signUpValidation: (req, res, next) => {
			req.checkBody('username', 'Username is required').notEmpty();
			req.checkBody('username', 'Username must not be less than 5 character').isLength({
				min: 5
			});
			req.checkBody('email', 'Email is Required').notEmpty();
			req.checkBody('email', 'Email is Invalid').isEmail();
			req.checkBody('password', 'Passowrd is required').notEmpty();
			req.checkBody('password', 'Passowrd must not be less than 5 character').isLength({
				min: 5
			});


			req.getValidationResult().then((result) => {
				const errors = result.array();
				const messages = [];
				const signup = [];
				errors.forEach((error) => {
					messages.push(error.msg);
				});
				req.flash('signup-error', messages);
				res.redirect('/signup');
			}).catch((err) => {
				return next();
			})
		},
		
		
		loginValidation: (req, res, next) => {			
			req.checkBody('email', 'Email is Required').notEmpty();
			req.checkBody('password', 'Passowrd is required').notEmpty();
			req.getValidationResult().then((result) => {
				const errors = result.array();
				const messages = [];
				const signup = [];
				errors.forEach((error) => {
					messages.push(error.msg);
				});
				req.flash('login-error', messages);
				res.redirect('/login');
			}).catch((err) => {
				return next();
			})
		}
	}
}
