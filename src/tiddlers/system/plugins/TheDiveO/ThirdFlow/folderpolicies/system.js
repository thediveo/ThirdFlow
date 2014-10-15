/*\
created: 20141012162151347
modified: 20141012163255922
module-type: folderpolicy
title: $:/plugins/TheDiveO/ThirdFlow/folderpolicies/system.js
type: application/javascript
priority: 100

This folder usher handles system tiddlers and places them into their
own separate system folder and then into hierarchical subfolders according
to their title. The exact name of the system folder is configurable.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var configTiddler = "$:/config/FileStorage/systemfoldername";
var systemFolderName;

// The configuration tiddler to monitor for changes
exports.watch = "[field:title[" + configTiddler + "]]";

// We get notified when our configuration tiddler was changed. Please
// note that title is undefined during inital configuration call.
exports.reconfig = function() {
	systemFolderName = $tw.wiki.getTiddlerText(configTiddler, "system").replace(new RegExp("\r?\n", "mg"), "");
	this.logger.log("folder policy config: system: system subfolder is: " + systemFolderName);
};

exports.folderpolicy = function(title, options) {
	if( !options.draft && title.substr(0, 3) === "$:/") {
		var posTitle = title.lastIndexOf("/");
		options.subfolder = systemFolderName + title.substr(2, posTitle - 2);
		options.name = title.substr(posTitle + 1);
		return true;
	}
	return false;
};
	
})();
