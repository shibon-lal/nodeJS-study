'use strict';
const Event = require('../models/event');
const fs = require('fs');
module.exports = function (_, commonfunction, eventValidation) {
	return {
		SetRouting: function (upload, router) {
			router.get('/event/add', commonfunction.loginCheck, this.addAction);
			router.get('/event', commonfunction.loginCheck, this.listAction);
			router.get('/event/:id', commonfunction.loginCheck, this.getAction);
			router.get('/event/:id/delete', commonfunction.loginCheck, this.deleteAction);

			router.post('/event/details', commonfunction.loginCheck, this.listDetails);
			router.post('/event/postAdd', eventValidation.eventValidation, this.postAddAction)
			router.post('/event/postEdit', eventValidation.eventValidation, this.postEditAction)
		},
		//upload.single('event_img1')
		addAction: function (req, res) {
			const errors = req.flash('addEdvent-error');
			const formData = req.flash('formdata-event');
			return res.render('events/add', {
				errors: errors,
				formData: formData,
				hasErrors: errors.length > 0,
				formDatas: formData.length > 0
			});
		},

		getAction: function (req, res) {
			var id = req.params.id;
			Event.findOne({ _id: id }, function (err, event) {
				if (err) throw err;

				const errors = req.flash('addEdvent-error');
				const formData = req.flash('formdata-event');
				return res.render('events/edit', {
					errors: errors,
					formData: formData,
					hasErrors: errors.length > 0,
					formDatas: formData.length > 0,
					eventData: event,
					removeWhitespace: true
				});
			});
		},

		postAddAction: function (req, res) {
			const newEvent = new Event();
			newEvent.name = req.body.name;
			newEvent.description = req.body.description;
			newEvent.date = req.body.date;
			if (req.body.event_img_enc) {
				var img = req.body.event_img_enc;
				var ext = img.split(';')[0].match(/jpeg|png|gif/)[0];
				var data = img.replace(/^data:image\/\w+;base64,/, "");
				var buf = new Buffer(data, 'base64');
				var imgname = newEvent._id + '.' + ext;
				fs.writeFile('public/events/' + imgname, buf);
				newEvent.image = imgname;
			}
			newEvent.save((err) => {
				console.log('event added');
				req.flash('message', 'Event added');
				return res.redirect('/event');
			});
		},

		postEditAction: function (req, res) {
			Event.findById(req.body.edit, function (err, evnt) {
				if (err) throw err;
				evnt.name = req.body.name;
				evnt.description = req.body.description;
				evnt.date = req.body.date;
				if (req.body.event_img_enc) {
					var img = req.body.event_img_enc;
					var ext = img.split(';')[0].match(/jpeg|png|gif/)[0];
					var data = img.replace(/^data:image\/\w+;base64,/, "");
					var buf = new Buffer(data, 'base64');
					var imgname = evnt._id + '.' + ext;
					fs.writeFile('public/events/' + imgname, buf);
					evnt.image = imgname;
				}
				evnt.save(function (err) {
					if (err) throw err;

					req.flash('message', 'Event updated');
					return res.redirect('/event');
				});

			});
		},

		listAction: function (req, res) {
			return res.render('events/list', { message: req.flash('message') });
		},

		listDetails: function (req, res) {
			Event.dataTables({
				limit: req.body.length,
				skip: req.body.start,
				order: req.body.order,
				columns: req.body.columns,
				search: {
					value: req.body.search.value,
					fields: ['name', 'date']
				},
				sort: {
					created: 1
				},
				formatter: function (evt) {
					return {
						check: '<input type="checkbox"/>',
						name: evt.name,
						date: evt.date,
						description: evt.description,
						options: '<a href="/event/' + evt._id + '"><em class="fa fa-pencil color-blue"> </em></a> <span>&nbsp;&nbsp;</span> <a href="/event/' + evt._id + '/delete"><em class="fa fa-trash-o color-blue"></em></a>'
					}
				}
			}).then(function (table) {
				res.json({
					data: table.data,
					recordsFiltered: table.total,
					recordsTotal: table.total
				});
			});
		},

		deleteAction: function (req, res) {
			Event.findByIdAndRemove(req.params.id, function (err) {
				if (err) throw err;

				req.flash('message', 'Event deleted');
				return res.redirect('/event');
			});
		},
	}
}