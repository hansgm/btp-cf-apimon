'use strict';

/*global require, module,  console */

var express = require("express");
var conf = require("./oe-configuration"); // MOCK!!!
var engine = require("./engine");

console.log("ie started");

var app = function(app) {
	engine.start(conf, app);
	// console.log(JSON.stringify(conf));
};

console.log("ie initialized");

module.exports.app = app;
module.exports.configuration = conf;
module.exports.engine = engine;