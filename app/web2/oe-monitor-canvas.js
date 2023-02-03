"use strict";

function Canvas(canvasId) {
	var me = this;
	this.globalStyle = {
		globalAlpha: 0.2,
		font: "12px Arial",
		fontColor: "white",
		canvasBackground: ""
	};
	this.canvas = document.getElementById(canvasId);
	this.controller = this.canvas.getContext("2d");
	this.controller.font = this.globalStyle.font;
	this.canvas.style.backgroundColor = "#505050";

	// this.controller.globalAlpha = this.canvasStyle.globalAlpha;

	this.endPointStyle = {
		captionColor: "#FFFFFF",
		opacity: 0,
		size: 13,
		strokeStyle: "#C0C0C0",
		fillStyle: "#5070E0"
	};
	this.graphStyle = {
		strokeStyle: "#C0C0C0",
		fillStyle: "blue",
		bezierConstant: 250,
		bezierLineLenFactor: 0.0003
	};

	this.plotList = {
		endPoints: [],
		messages: []
	};

	this.addEndPoint = function(ID, x, y, caption) {
		var newEndPoint = new EndPoint(this, ID, x, y, caption);
		this.plotList.endPoints.push(newEndPoint);
		newEndPoint.replot();
		return newEndPoint;
	};

	this.drawPoint = function(ID, x, y, caption) {
		var newPoint = new Point(this, ID, x, y, caption);
		newPoint.replot();
	};

	this.addMessageToHotList = function(iMessage) {
		if (_.find(me.hotList, function(msg) {
				return (msg.ID === iMessage.ID);
			}) === undefined) {
			me.hotList.push(iMessage);
		}
	};

	this.fireMessageByID = function(iID) {
		var msg = this.findMessageByID(iID);
		if (msg instanceof Graph) {
			msg.hitLevel = (msg.hitLevel > 4) ? 4 : ++msg.hitLevel;
			msg.to.hitLevel = (msg.to.hitLevel > 4) ? 4 : ++msg.to.hitLevel;
			this.addMessageToHotList(msg);
		}

		if (!me.decaying) {
			me.decay();
		}
	};

	this.errorMessageByID = function(iID) {
		var msg = this.findMessageByID(iID);
		if (msg instanceof Graph) {
			msg.hitLevel = 5;
			msg.to.hitLevel = 5;
			this.addMessageToHotList(msg);
		}

		if (!me.decaying) {
			me.decay();
		}
	};

	this.hotList = [];
	this.decaying = false;
	this.decay = function() {
		me.decaying = true;
		_.each(me.hotList, function(msg) {
			msg.replot(false);
			msg.to.replot(false);
		});

		me.hotList = _.filter(me.hotList, function(msg) {
			if (msg.hitLevel <= 0) {
				msg.hitLevel = 0;
				return false;
			} else {
				msg.hitLevel--;
				msg.to.hitLevel--;
				msg.to.hitLevel = (msg.to.hitLevel < 0) ? 0 : msg.to.hitLevel;
				return true;
			}
		});

		if (me.hotList.length > 0) {
			setTimeout(me.decay, 80);
		} else {
			me.decaying = false;
		}
	};

	this.getPlotListMessages = function() {
		var commaSeparatedList = "";
		_.each(this.plotList.messages, function concatID(msg) {
			commaSeparatedList += "," + msg.ID;
		});
		return commaSeparatedList;
	};

	this.findMessageByID = function(iID) {
		return _.find(this.plotList.messages, function(msg) {
			return (msg.ID === iID);
		});
	};

	this.findEndPointByID = function(iID) {
		return _.find(this.plotList.endPoints, function(ep) {
			return (ep.ID === iID);
		});
	};

	this.findEndPoint = function(endpoint) {
		if (EndPoint instanceof EndPoint) {
			return endpoint;
		} else {
			return this.findEndPointByID(endpoint);
		}
	};

	this.addMessage = function(iID, iFromEndPoint, iToEndPoint, iCaption, iCaptionPosition) {
		var fromEndPoint = this.findEndPoint(iFromEndPoint);
		var toEndPoint = this.findEndPoint(iToEndPoint);
		if (!((fromEndPoint instanceof EndPoint) && (toEndPoint instanceof EndPoint))) {
			throw ("Addmessage: No correct endpoints");
		}

		var message = this.findMessageByID(iID);
		if (message !== undefined) {
			return message;
		}

		var newMessage = new Graph(this, iID, fromEndPoint, toEndPoint, iCaption, iCaptionPosition);
		this.plotList.messages.push(newMessage);
		newMessage.replot();
		return newMessage;
	};

	this.replot = function() {
		this.controller.clearRect(0, 0, this.canvas.width, this.canvas.height);
		_.each(this.plotList.endPoints, function(ep) {
			_.each(ep.outGraphs, function(gr) {
				gr.replot();
			});
		});
		_.each(this.plotList.endPoints, function(ep) {
			ep.replot();
		});
	};

	this.drag = false;
	this.dragObject = null;

	this.mouseDownListener = function(iCanvas) {
		me.drag = true;
		var eur = Math.pow(me.endPointStyle.size, 2);

		me.dragObject = null;
		me.dragObject = _.find(me.plotList.endPoints, function(ep) {
			var eux = Math.pow(ep.x - iCanvas.offsetX, 2);
			var euy = Math.pow(ep.y - iCanvas.offsetY, 2);
			if (eux + euy <= eur) {
				return true;
			} else {
				return false;
			}
		});
	};

	this.mouseUpListener = function() {
		me.drag = false;
		me.dragObject = null;
	};

	this.mouseMoveListener = function(iCanvas) {
		if (me.drag === true && me.dragObject instanceof EndPoint) {
			me.dragObject.x = iCanvas.offsetX;
			me.dragObject.y = iCanvas.offsetY;
			me.replot();
		}
	};

	this.canvas.addEventListener("mousedown", this.mouseDownListener, false);
	this.canvas.addEventListener("mouseup", this.mouseUpListener, false);
	this.canvas.addEventListener("mousemove", this.mouseMoveListener, false);

}

function calcBezierPointFromEndPoints(from, to, count) {
	var vectorRadian = Math.atan2(to.x - from.x, to.y - from.y);
	var lineLenFactor = ((Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2))) *
		from.canvas.graphStyle.bezierLineLenFactor);

	var distance = 0;
	if (count === undefined) {
		distance = from.numberGraphsTo(to) * from.canvas.graphStyle.bezierConstant;
	} else {
		distance = count * from.canvas.graphStyle.bezierConstant;
	}

	return {
		x1: from.x + (Math.cos(vectorRadian) * distance * lineLenFactor),
		y1: from.y - (Math.sin(vectorRadian) * distance * lineLenFactor),
		x2: to.x + (Math.cos(vectorRadian) * distance * lineLenFactor),
		y2: to.y - (Math.sin(vectorRadian) * distance * lineLenFactor)
	};
}

var graphHitLevel = ["#C0C0C0", "#339933", "#99ff33", "#ff9933", "#ff3300", "#ff4400"];
var endPointHitLevel = ["#5070E0", "#339966", "#767600", "#909011", "#A6A322", "#ff2211"];

function Graph(iCanvas, iID, iFrom, iTo, iCaption, iCaptionPosition) {
	this.canvas = iCanvas;
	this.ID = iID;
	this.ctx = iCanvas.controller;
	this.from = iFrom;
	this.hitLevel = 0;
	this.to = iTo;
	this.caption = iCaption;
	this.captionPosition = iCaptionPosition;
	this.strokeStyle = iCanvas.graphStyle.strokeStyle;
	this.offsetCount = iFrom.numberGraphsTo(iTo) + 1;
	iFrom.addOutGraph(this);
	iTo.addInGraph(this);
}

Graph.prototype.replot = function(noCaption) {
	this.ctx.beginPath();
	this.ctx.moveTo(this.from.x, this.from.y);
	this.bp = calcBezierPointFromEndPoints(this.from, this.to, this.offsetCount);
	this.ctx.bezierCurveTo(this.bp.x1, this.bp.y1, this.bp.x2, this.bp.y2, this.to.x, this.to.y);
	this.ctx.fillStyle = this.fillStyle;
	this.ctx.strokeStyle = graphHitLevel[this.hitLevel];
	this.ctx.stroke();

	if (noCaption === undefined || noCaption === true) {
		this.writeCaption();
	}
};

Graph.prototype.writeCaption = function() {
	this.ctx.fillStyle = this.canvas.globalStyle.fontColor;
	this.ctx.fillText(this.caption, (this.bp.x1 + this.bp.x2) / 2, (this.bp.y1 + this.bp.y2) / 2);
};

function Point(iCanvas, iID, ix, iy, iCaption) {
	this.ID = iID;
	this.ctx = iCanvas.controller;
	this.size = 1;
	this.x = ix;
	this.y = iy;
	this.Caption = iCaption;
	this.strokeStyle = iCanvas.graphStyle.strokeStyle;
}

function EndPoint(iCanvas, iID, ix, iy, iCaption) {
	this.canvas = iCanvas;
	this.ID = iID;
	this.hitLevel = 0;
	this.ctx = iCanvas.controller;
	this.size = iCanvas.endPointStyle.size;
	this.x = ix + this.size + 1;
	this.y = iy + this.size + 1;
	this.caption = iCaption;
	this.strokeStyle = iCanvas.endPointStyle.strokeStyle;
	this.fillStyle = iCanvas.endPointStyle.fillStyle;
	this.outGraphs = [];
	this.inGraphs = [];

	this.addOutGraph = function(iGraph) {
		this.outGraphs.push(iGraph);
	};

	this.addInGraph = function(iGraph) {
		this.inGraphs.push(iGraph);
	};

	this.graphsTo = function(toEndPoint) {
		return (_.filter(this.outGraphs, function hasMessageTo(iGraph) {
			return (iGraph.to === toEndPoint);
		}));
	};

	this.graphsFrom = function(fromEndPoint) {
		return (_.filter(this.inGraphs, function hasMessageFrom(iGraph) {
			return (iGraph.to === fromEndPoint);
		}));
	};

	this.numberGraphsTo = function(toEndPoint) {
		return this.graphsTo(toEndPoint).length;
	};

	this.numberGraphsFrom = function(fromEndPoint) {
		return this.graphsFrom(fromEndPoint).length;
	};
}

EndPoint.prototype.writeCaption = function() {
	this.ctx.fillStyle = this.canvas.globalStyle.fontColor;
	this.ctx.fillText(this.caption, this.x + 13, this.y - 5);
};

EndPoint.prototype.replot = function(noCaption) {
	this.ctx.beginPath();
	this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
	this.ctx.fillStyle = endPointHitLevel[this.hitLevel];
	this.ctx.stroke();
	this.ctx.fill();
	if (noCaption === undefined || noCaption === true) {
		this.writeCaption();
	}
};