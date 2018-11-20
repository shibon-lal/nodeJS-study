'use strict';

module.exports = function (_, commonfunction) {

	return {
		SetRouting: function (router) {
			router.get('/home',commonfunction.loginCheck, this.homeAction)
		},
		
		homeAction: function (req, res) {
			return res.render('dashboard/index', {
				demo: 'this is a test ha ha heey hey'
			});
		},
	}
}