/*\
created: 20141012162041927
modified: 20141012163305588
module-type: folderpolicy
title: $:/plugins/TheDiveO/ThirdFlow/folderpolicies/draft.js
type: application/javascript
priority: 200

This folder usher places draft tiddlers flat into their own separate drafts folder.
The exact name of the drafts folder is configurable.
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var configTiddler = $tw.wiki.getTiddler("$:/config/HFS/draftfolder");
var draftFolderName = "drafts";
if ( configTiddler ) {
	draftFolderName = configTiddler.fields.text.replace(new RegExp("\r?\n", "mg"), "");
}

exports.folderpolicy = function(title, options) {
	if(options.draft) {
		options.subfolder = draftFolderName;
		return true;
	}
	return false;
};

})();
