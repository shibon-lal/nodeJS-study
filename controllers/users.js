'use strict';

module.exports = function (_, passport, userValidation) {

	return {
		SetRouting: function (router) {
			router.get('/', this.indexPage);
			router.get('/login', this.login);
			router.get('/signup', this.signUp);

			router.post('/postlogin', userValidation.loginValidation, this.postLogin)
			router.post('/postsignup', userValidation.signUpValidation, this.postSignUp)
		},

		indexPage: function (req, res) {
			return res.render('index', {
				demo: 'this is a test ha ha heey hey'
			});
		},

		login: function (req, res) {
			var date = new Date();
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTime = hours + ':' + minutes + ' ' + ampm;
			const errors = req.flash('login-error');
			return res.render('login', {
				timenow: strTime,
				messages: errors,
				hasErrors: errors.length > 0
			});
		},
		
		signUp: function (req, res) {
			const errors = req.flash('signup-error');
			return res.render('signup', {
				title: 'Login',
				messages: errors,
				hasErrors: errors.length > 0
			});
		},
		
		postSignUp: passport.authenticate('local.signup', {
			successRedirect: '/login',
			failureRedirect: '/signup',
			failureFlash: true
		}),
		
		postLogin: passport.authenticate('local.login', {
			successRedirect: '/home',
			failureRedirect: '/login',
			failureFlash: true
		})
	}
}
