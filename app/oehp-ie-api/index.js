'use strict';

/*global require, module,  console */

var _ = require("underscore");

console.log("api started");

var api = function(app, configuration, engine) {
	console.log("init");

	app.get("/api/statistics", function getStatistics(req, res) {
		res.send(engine.statistics);
	});

	app.get("/api/trigger/:id", function trigger(req, res) {
		console.log(req.params.id)
		res.send("Ok");
	});	

	app.get("/api/bs", function getBusinessSystems(req, res) {
		res.send(configuration.businessSystems);
	});

	app.get("/api/bs/:id", function getBusinessSystemByID(req, res) {
		res.send(_.find(configuration.businessSystems, function(bs) {
			return (bs.id === req.params.id);
		}));
	});

	app.get("/api/messages", function getMessages(req, res) {
		res.send(
			_.map(configuration.messages, function(message) {
				return {
					"id": message.id,
					"description": message.description,
					"senderID": message.senderID,
					"senderReqMethod": message.senderReqMethod,
					"senderPath": message.senderPath,
					"receiverID": message.receiverID
				};
			}));
	});

	app.get("/api/messages/:id", function getMessageByID(req, res) {
		res.send(_.find(configuration.messages, function(msg) {
			return (msg.id === req.params.id);
		}));
	});

	app.post("/api/subscribe", function subscribeMessages(req, res) {
		// TODO nog gebruikt ???
		res.send(configuration.messages);
	});
};

console.log("api initialized");

module.exports.api = api;