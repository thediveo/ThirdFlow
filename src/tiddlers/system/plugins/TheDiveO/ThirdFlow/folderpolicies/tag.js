/*\
created: 20141012162151347
modified: 20141012163255922
module-type: folderpolicy
title: $:/plugins/TheDiveO/ThirdFlow/folderpolicies/tag.js
type: application/javascript
priority: 50

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var configTiddler = "$:/config/FileStorage/tagfolders";
var tagFolders;

// The configuration tiddler to monitor for changes
exports.watch = "[field:title[" + configTiddler + "]]";

// We get notified when our configuration tiddler was changed. Please
// note that title is undefined during inital configuration call.
exports.reconfig = function() {
	var self = this;
	tagFolders = $tw.wiki.getTiddlerData(configTiddler, {});
	$tw.utils.each(tagFolders, function(folder, tag) {
		self.logger.log("folder policy config: tag: \"" + tag + "\" tag subfolder is: " + folder);
	});
};

// We are asked to apply our folder policy...
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
