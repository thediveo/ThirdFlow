/*\
created: 20141012162151347
modified: 20141012163255922
module-type: folderusher
title: $:/plugins/TheDiveO/ThirdFlow/folderushers/system.js
type: application/javascript

This folder usher handles system tiddlers and places them into their
own separate system folder.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.system = function(title, options) {
	if( !options.draft && title.substr(0, 3) === "$:/") {
		var posTitle = title.lastIndexOf("/");
		options.subfolder = "system" + title.substr(2, posTitle - 2);
		options.name = title.substr(posTitle + 1);
		return true;
	}
	return false;
};
	
})();
