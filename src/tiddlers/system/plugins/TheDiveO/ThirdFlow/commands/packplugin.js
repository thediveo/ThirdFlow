/*\
created: 20140927171850335
modified: 20141003155657361
title: $:/plugins/TheDiveO/ThirdFlow/commands/packplugin.js
type: application/javascript
module-type: command

The packplugin command packages source tiddlers (ordinary
tiddlers) into a plugin tiddler:
--packplugin <plugin title>

Please note that the plugin tiddler must be correctly set
up in that it is of type "application/json" and also
the plugin-type is set.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.info = {
	name: "packplugin",
	synchronous: true
};

var thirdflow = require("$:/plugins/TheDiveO/ThirdFlow/libs/thirdflow.js");

var Command = function(params,commander) {
	this.params = params;
	this.commander = commander;
	this.logger = new $tw.utils.Logger("--" + exports.info.name);
};

Command.prototype.execute = function() {
	if(this.params.length < 1) {
		return "Missing plugin title";
	}
	var pluginTitle = this.params[0];
	var filter = this.params[1];

	// Get the plug-in self-description tiddler. If it doesn't exist,
	// bail out as the plugin developer needs to provide a plugin tiddler
	// with the required self-description.
	this.logger.log("making plugin", pluginTitle);
	this.logger.log("using filter for packing", filter);
	return thirdflow.packagePlugin(pluginTitle, filter);
};

exports.Command = Command;

})();
