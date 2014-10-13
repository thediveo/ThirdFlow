/*\
created: 20141012162151347
modified: 20141012163255922
module-type: folderusher
title: $:/plugins/TheDiveO/ThirdFlow/folderushers/tag.js
type: application/javascript

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

exports.tag = function(title, options) {
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
