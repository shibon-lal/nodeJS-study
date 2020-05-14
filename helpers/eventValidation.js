'use strict';
const path = require('path');
module.exports = function () {
	return {
		eventValidation: (req, res, next) => {
			const messages = {};
			req.checkBody('name', 'Event name is required').notEmpty();
			req.checkBody('date', 'Event date is Required').notEmpty();
			req.getValidationResult().then((result) => {
				const errors = result.array();
				if (errors.length == 0 && !messages['file']) {
					return next();
				}

				errors.forEach((error) => {
					messages[error.param] = error.msg;
				});
				req.flash('addEdvent-error', messages);
				req.flash('formdata-event', req.body);
				if (req.body.edit) {
					res.redirect('/event/' + req.body.edit);
				} else {
					res.redirect('/event/add');
				}
			}).catch((err) => {
				console.log(err);
				console.log('passed error mesage');
				return next();
			})
		}
	}
}
