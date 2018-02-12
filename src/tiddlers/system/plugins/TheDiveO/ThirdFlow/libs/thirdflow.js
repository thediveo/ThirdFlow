/*\
created: 20180212163414709
type: application/javascript
title: $:/plugins/TheDiveO/ThirdFlow/libs/thirdflow.js
modified: 20180212163710081
tags:
module-type: library

A library of (reusable) ThirdFlow plugin tiddler functions. These
functions can be used, for instance, through TW server commands.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";


/* Packages a plugin tiddler from its constituent individual tiddlers that exist
 * inside the title sub-namespace of the plugin tiddler.
 *
 * Parameters:
 *   wiki: TW instance.
 *   pluginTitle: the plugin tiddler to be packed; this must be a valid
 *       plugin tiddler which has its plugin-type correctly set, as well
 *       as a type of "application/json".
 *   filterExpression: optional TW filter expression to be used to decide
 *       which tiddlers need to be packed into the plugin. If left unspecified,
 *       it defaults to all sub-tiddlers of the plugin title.
 *
 * Result:
 *   returns undefined when the plugin tiddler specified in pluginTitle has
 *   been packed without issues. Otherwise an error string detailing what
 *   went wrong.
 */
exports.packagePlugin = function(wiki, pluginTitle, filterExpression) {
  // Prepare input parameters...
  if (pluginTitle.substr(-1) === "/") {
    pluginTitle = pluginTitle.substr(0, pluginTitle.length - 1);
  }
  filterExpression = filterExpression || "[prefix[" + pluginTitle + "/]]";
  // Plugin tiddler sanity checks...
  var pluginTiddler = wiki.getTiddler(pluginTitle);
	if (!pluginTiddler) {
		return "missing plugin tiddler: " + pluginTitle;
	}
	if (pluginTiddler.fields.type !== "application/json"
      || !pluginTiddler.hasField("plugin-type")) {
		return "not a plugin (skeleton) tiddler: " + pluginTitle;
	}
	// Update the plugin content to contain all the tiddlers that match
	// the filter expression.
	var filteredTiddlers = wiki.filterTiddlers(filterExpression);
	var pluginTiddlers = {};
	$tw.utils.each(filteredTiddlers, function(title) {
		var tiddler = wiki.getTiddler(title);
		var fields = {};
		$tw.utils.each(tiddler.fields, function(value, fieldname) {
			fields[fieldname] = tiddler.getFieldString(fieldname);
		});
		pluginTiddlers[title] = fields;
	});
	var plugin = new $tw.Tiddler(
    pluginTiddler,
    {
      "text": JSON.stringify({ "tiddlers": pluginTiddlers })
    });
	wiki.addTiddler(plugin);
	// We need to update the plugin info that TW had built up during boot...
	wiki.readPluginInfo();
	// ...and we need to re-unpack the plugins into their shadow tiddlers in
	// order to make [is[shadow]] work correctly. Yes, that causes the plugin
  // tiddlers to exist two times: the original source tiddler, as well as
  // a corresponding shadow tiddler. However, this is just during release,
  // but never in a development wiki nor in a user wiki deploying this plugin.
	wiki.unpackPluginTiddlers();
  return;
};


/*
 *
 */
exports.renderTiddlerWithTemplate = function() {
};


})();
