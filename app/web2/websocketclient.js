"use strict";

var ws = null;

var registerWebsocket = function() {

	if (ws === null) {
		console.log("OpenSocket");
		ws = new WebSocket("ws://localhost:3001", "oe-esb");

		ws.onopen = function() {
			ws.send(canvas.getPlotListMessages());
		};

		ws.onmessage = function(data) {
			var dataSplit = data.data.split('::');
			if (dataSplit.length < 2) {
				return;
			} else if (dataSplit[0] === "fire") {
				canvas.fireMessageByID(dataSplit[1]);
			} else if (dataSplit[0] === "error") {
				canvas.errorMessageByID(dataSplit[1]);
			}
		};

		ws.onclose = function() {
			ws = null;
		};

	} else {
		console.log("CloseSocket");
		ws.close();
	}
};