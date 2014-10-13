/*\
created: 20141012162151347
modified: 20141012163255922
module-type: folderusher
title: $:/plugins/TheDiveO/ThirdFlow/folderushers/system.js
type: application/javascript

This folder usher handles system tiddlers and places them into their
own separate system folder and then into hierarchical subfolders according
to their title. The exact name of the system folder is configurable.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var configTiddler = $tw.wiki.getTiddler("$:/config/FileStorage/systemfolder");
var systemFolderName = "system";
if ( configTiddler ) {
	systemFolderName = configTiddler.fields.text.replace(new RegExp("\r?\n", "mg"), "");
}

exports.system = function(title, options) {
	if( !options.draft && title.substr(0, 3) === "$:/") {
		var posTitle = title.lastIndexOf("/");
		options.subfolder = systemFolderName + title.substr(2, posTitle - 2);
		options.name = title.substr(posTitle + 1);
		return true;
	}
	return false;
};
	
})();
