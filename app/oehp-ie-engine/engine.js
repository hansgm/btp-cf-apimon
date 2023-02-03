'use strict';
/*global require, module,  console */

var _ = require("underscore");
// var http = require("http");

var engine = {};

engine.configuration = {};
engine.statistics = {};
engine.listeners = [];



// TODO store statistics periodiek naar mongo oid (met server ID toe te voegen)
function StatRecord(iMessageId) {
	this.messageId = iMessageId;
	this.timeStamp = new Date();
	this.stepsizeMillis = 1000 * 60 * 15;
	this.key = "P" + Math.floor(this.timeStamp.valueOf() / this.stepsizeMillis) * this.stepsizeMillis;
	if (engine.statistics[this.key] === undefined) {
		engine.statistics[this.key] = {
			"stepsizeMillis": this.stepsizeMillis,
			"messages": {}
		};
	}

	if (engine.statistics[this.key].messages[this.messageId] === undefined) {
		engine.statistics[this.key].messages[this.messageId] = {
			scheduled: 0,
			ok: 0,
			error: 0,
			minTimeMillis: Number.MAX_SAFE_INTEGER,
			maxTimeMillis: 0,
			avgTimeMillis: 0
		};
	}

	this.statistic = engine.statistics[this.key].messages[this.messageId];
	this.statistic.scheduled++;

}

StatRecord.prototype.error = function() {
	this.statistic.error++;
	this.statistic.scheduled--;
};

StatRecord.prototype.ok = function() {
	this.timeStampResponse = new Date();

	this.statistic.scheduled--;
	this.statistic.ok++;

	this.elapseMillis = Number(this.timeStampResponse.valueOf()) - Number(this.timeStamp.valueOf());

	if (this.statistic.maxTimeMillis < this.elapseMillis) {
		this.statistic.maxTimeMillis = this.elapseMillis;
	}

	if (this.statistic.minTimeMillis > this.elapseMillis) {
		this.statistic.minTimeMillis = this.elapseMillis;
	}

	// avg = ( ( values * count - 1 ) + value ) / count 
	// Only Ok counts

	this.statistic.avgTimeMillis =
		((this.statistic.avgTimeMillis *
				(this.statistic.ok - 1)) +
			this.elapseMillis) /
		this.statistic.ok;
};

engine.getMessageOptions = function(message, requestMethod) {
	//  TODO Add exception handling 
	var bs = _.find(engine.configuration.businessSystems, function(ibs) {
		return (ibs.id === message.receiverID);
	});

	//  TODO Add exception handling 
	var ep = _.find(bs.ReceiverEndpoints, function(ibs) {
		return (ibs.id === message.receiverEndpoint);
	});

	//  TODO Add exception handling, keep headers, different content types etc.	
	var httpOptions = {
		"host": ep.host,
		"port": ep.port,
		"path": message.receiverPath || message.senderPath,
		"method": message.receiverReqMethod || requestMethod,
		"headers": message.requestHeaders || {
			"Content-Type": "application/json"
		}
	};

	return {
		messageId: message.id,
		bs: bs,
		ep: ep,
		httpOptions: httpOptions,
		listeners: message.listeners || []
	};
};

engine.httpRequest = function(options, request, iResponse) {
	//	TODO check if performant. 
	//  TODO onderscheid call en error (is nu alleen call)
	//  TODO Normale logging: Nr of hits, errorcount, avg time, mintime, maxtime
	//  TODO andere encoding dan UTF-8
	//  TODO andere content-types

	_.each(options.listeners, function(listener) {
		listener.send("fire::" + options.messageId);
		console.log(messageid);
	});

	iResponse.status(200).send("Ok")

	/*
	var statRecord = new StatRecord(options.messageId);

	var req = http.request(options.httpOptions, function(res) {
		res.setEncoding('utf8');

		// TODO Check response op juiste content type, keep headers etc. Iets als message.responseHeaders
		res.on('data', function(data) {
			statRecord.ok();
			iResponse.setHeader("Content-Type", "application/json");
			iResponse.status(200).send(data);
		});
	});
	

	if (request.body) {
		req.write(JSON.stringify(request.body));
	// 	req.write("Ok");
	}

	req.on('error', function(e) {
		_.each(options.listeners, function(listener) {
			listener.send("error::" + options.messageId);
		});

		statRecord.error();

		iResponse.status(500).json({
			errorText: "problem with request",
			code: 1000,
			error: e,
			messageId: options.messageId,
			httpOptions: options.httpOptions
		});
	});
	req.end();

	*/
};

engine.rcvPUT = function(message, app) {
	app.put(message.senderPath, function rcvPUT(req, res) {
		engine.httpRequest(engine.getMessageOptions(message, "PUT"),
			req,
			res);
	});
};

engine.rcvPOST = function(message, app) {
	app.post(message.senderPath, function rcvPOST(req, res) {
		engine.httpRequest(engine.getMessageOptions(message, "POST"),
			req,
			res);
	});
};

engine.rcvGET = function(message, app) {
	app.get(message.senderPath, function rcvGET(req, res) {
		engine.httpRequest(engine.getMessageOptions(message, "GET"),
			req,
			res);
	});
};

engine.start = function(iConf, app) {
	engine.configuration = iConf;
	_.each(iConf.messages, function(message) {
		console.log("initializing: ",
			message.id,
			message.senderReqMethod,
			message.senderPath,
			" >> ",
			message.receiverReqMethod,
			message.receiverPath);
		engine['rcv' + message.senderReqMethod](message, app);
	});
};

engine.registerMonitor = function(wsConnection, messageId) {
	console.log("Register")
    console.log(messageId)
	
	var messageToRegister = _.find(engine.configuration.messages, function(message) {
		return (message.id === messageId);
	});

	if (messageToRegister !== undefined) {
		if (messageToRegister.listeners === undefined) {
			messageToRegister.listeners = [];
		}
		messageToRegister.listeners.push(wsConnection);
		console.log("Message registered:", messageId);
	}
};

engine.deregisterMonitor = function(wsConnection) {
	console.log("deregister");
	_.each(engine.configuration.messages, function(message) {
		message.listeners = _.without(message.listeners, wsConnection);
	});
};

module.exports = engine;