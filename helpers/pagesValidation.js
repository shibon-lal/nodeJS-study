'use strict';
const path = require('path');
module.exports = function () {
	return {
		pageValidation: (req, res, next) => {
			const messages = {};
			req.checkBody('name', 'Title is required').notEmpty();
			req.getValidationResult().then((result) => {
				const errors = result.array();
				if (errors.length == 0 && !messages['file']) {
					return next();
				}

				errors.forEach((error) => {
					messages[error.param] = error.msg;
				});
				req.flash('addPage-error', messages);
				req.flash('formdata-page', req.body);
				if (req.body.edit) {
					res.redirect('/page/' + req.body.edit);
				} else {
					res.redirect('/page/add');
				}
			}).catch((err) => {
				console.log(err);
				console.log('passed error mesage');
				return next();
			})
		}
	}
}
