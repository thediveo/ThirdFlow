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

var cfg = {
	"Module": "modules",
	"Filter": "filters",
	"is Filter Operand": "filters/is"
};

exports.tag = function(title, options) {
	if( !options.draft ) {
		var tags = options.tiddler.fields.tags;
		if ($tw.utils.isArray(tags)) {
			this.logger.log("Tags: "+tags.toString());
			for (var i=0; i<tags.length; ++i) {
				if (cfg.hasOwnProperty(tags[i])) {
					options.subfolder = cfg[tags[i]] + this.subfoldersFromTitle(title);
					options.name = this.leafFromTitle(title);
					return true;
				}
			}
		}
	}
	return false;
};
	
})();
