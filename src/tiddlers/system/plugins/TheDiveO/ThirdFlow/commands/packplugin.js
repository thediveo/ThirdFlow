/*\
created: 20140927171850335
title: $:/plugins/TheDiveO/ThirdFlow/commands/packplugin.js
type: application/javascript
modified: 20140927172039138
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

var Command = function(params,commander) {
	this.params = params;
	this.commander = commander;
	this.logger = new $tw.utils.Logger("--" + exports.info.name);
};

Command.prototype.execute = function() {
	if(this.params.length < 1) {
		return "Missing plugin title";
	}
	var wiki = this.commander.wiki,
		self = this,
		fs = require("fs"),
		path = require("path"),
		pluginTitle = this.params[0],
		filter = this.params[1] ||
			"[prefix["+this.params[0]+"/]]";
//			"[field:title/"+this.params[0].replace(/\$/g, "\\$").replace(/\//g, "\\/")+"\\//]";
		
	// Get the plug-in self-description tiddler. If it doesn't exist,
	// bail out as the plugin developer needs to provide a plugin tiddler
	// with the required self-description.
	this.logger.log("making plugin", pluginTitle);
	this.logger.log("using filter for packing", filter);
	var pluginTiddler = $tw.wiki.getTiddler(pluginTitle);
	if (!pluginTiddler) {
		return "missing plugin tiddler: " + pluginTitle;
	}
	// Sanity checks first...
	if(pluginTiddler.fields.type !== "application/json" || !pluginTiddler.hasField("plugin-type")) {
		return "not a plugin skeleton: " + pluginTitle;
	}
	// Update the plugin content to contain all the tiddlers that match
	// the filter expression.
	var tiddlers = $tw.wiki.filterTiddlers(filter),
	    pluginTiddlers = {};
	$tw.utils.each(tiddlers, function(title) {
		var tiddler = $tw.wiki.getTiddler(title),
		    fields = {};
		self.logger.log("adding " + title);
		$tw.utils.each(tiddler.fields, function(value, name) {
			fields[name] = tiddler.getFieldString(name);
		});
		pluginTiddlers[title] = fields;
	});
	this.logger.log("packed", tiddlers.length, "tiddlers");
	var plugin = new $tw.Tiddler(pluginTiddler, { text: JSON.stringify({tiddlers: pluginTiddlers}) });
	$tw.wiki.addTiddler(plugin);
	// We need to update the plugin info that TW had built up during boot...
	$tw.wiki.readPluginInfo();
	// ...and we need to re-unpack the plugins into their shadow tiddlers in
	// order to make [is[shadow]] work correctly.
	$tw.wiki.unpackPluginTiddlers();
	
	return null; // done & okay
};

exports.Command = Command;

})();
