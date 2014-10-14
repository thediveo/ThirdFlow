/*\
created: 20141012162041927
modified: 20141012163305588
module-type: folderpolicy
title: $:/plugins/TheDiveO/ThirdFlow/folderpolicies/default.js
type: application/javascript
priority: 0

This folder usher places draft tiddlers flat into their own separate drafts folder.
The exact name of the drafts folder is configurable.
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var configTiddler = $tw.wiki.getTiddler("$:/config/FileStorage/defaultHierarchy");
var defaultHierarchy = true;
if ( configTiddler ) {
	defaultHierarchy = configTiddler.fields.text === "yes";
}

exports.folderpolicy = function(title, options) {
	if(!options.draft && defaultHierarchy) {
		options.subfolder = this.subfoldersFromTitle(title);
		options.name = this.leafFromTitle(title);
		return true;
	}
	return false;
};

})();
