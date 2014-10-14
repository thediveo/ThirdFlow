/*\
created: 20141012162151347
modified: 20141012163255922
module-type: folderpolicy
title: $:/plugins/TheDiveO/ThirdFlow/folderpolicies/tag.js
type: application/javascript
priority: 100

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var configTiddler = $tw.wiki.getTiddler("$:/config/FileStorage/tag");
var tagFolders = {};
if ( configTiddler ) {
	tagFolders = JSON.parse(configTiddler.fields.text);
}

exports.folderpolicy = function(title, options) {
	if( !options.draft ) {
		var tags = options.tiddler.fields.tags;
		if ($tw.utils.isArray(tags)) {
			this.logger.log("Tags: "+tags.toString());
			for (var i=0; i<tags.length; ++i) {
				if (tagFolders.hasOwnProperty(tags[i])) {
					var subfolder = tagFolders[tags[i]];
					if ( subfolder.substr(-1) === "+" ) {
						options.subfolder = subfolder.substr(0, subfolder.length - 1) + "/" + this.subfoldersFromTitle(title);
						options.name = this.leafFromTitle(title);
					} else {
						options.subfolder = subfolder;
						options.title = title;
					}
					return true;
				}
			}
		}
	}
	return false;
};
	
})();
