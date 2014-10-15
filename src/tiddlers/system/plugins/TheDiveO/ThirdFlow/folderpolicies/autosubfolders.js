/*\
created: 20141012162041927
modified: 20141012163305588
module-type: folderpolicy
title: $:/plugins/TheDiveO/ThirdFlow/folderpolicies/autosubfolders.js
type: application/javascript
priority: 0

This folder usher places draft tiddlers flat into their own separate drafts folder.
The exact name of the drafts folder is configurable.
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var configTiddler = "$:/config/FileStorage/enableautomaticsubfolders";
var automaticSubfoldersEnabled;

// The configuration tiddler to monitor for changes
exports.watch = "[field:title[" + configTiddler + "]]";

// We get notified when our configuration tiddler was changed. Please
// note that title is undefined during inital configuration call.
exports.reconfig = function() {
	automaticSubfoldersEnabled = $tw.wiki.getTiddlerText(configTiddler, "yes") === "yes";
	this.logger.log("folder policy config: default: hierarchical subfolders are " + (automaticSubfoldersEnabled ? "enabled" : "disabled"));
};

exports.folderpolicy = function(title, options) {
	if(!options.draft && automaticSubfoldersEnabled) {
		options.subfolder = this.subfoldersFromTitle(title);
		options.name = this.leafFromTitle(title);
		return true;
	}
	return false;
};

})();
