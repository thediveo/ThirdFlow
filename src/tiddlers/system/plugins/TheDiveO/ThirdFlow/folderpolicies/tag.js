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

var configTiddlerBase = "$:/config/FileStorage/tagfolders";
var tagFolders;
var tagList;

// The configuration tiddlers to monitor for changes
exports.watch = "[field:title[" + configTiddlerBase + "]] [prefix[" + configTiddlerBase + "/]]";

// We get notified when our configuration tiddler was changed. Please
// note that title is undefined during inital configuration call.
exports.reconfig = function() {
	var self = this;
    
    var cfgTiddler = $tw.wiki.getTiddler(configTiddlerBase);
    tagList = $tw.utils.parseStringArray(cfgTiddler.fields.list || "");
    var cfgTags = $tw.wiki.filterTiddlers("[prefix[" + configTiddlerBase + "/]]");
    tagFolders = {};
    
    $tw.utils.each(tagList, function(tag) {
        tagFolders[tag] = {folderName: "", folderMode: "flat"};
    });
    $tw.utils.each(cfgTags, function(tagCfg) {
        var tiddler = $tw.wiki.getTiddler(tagCfg);
        var tag = tiddler.fields["tag-name"];
        var folderName = tiddler.fields["folder-name"] || "";
        var folderMode = tiddler.fields["folder-mode"] || "flat";
        self.logger.log("folder policy config: tag: for:", "\"" + tag + "\"", "folder:", "\"" + folderName + "\"", "mode:", folderMode);
        if(tag && tagFolders[tag]) {
            tagFolders[tag].folderName = folderName;
            tagFolders[tag].folderMode = folderMode;
        }
    });
};

// We are asked to apply our folder policy...
exports.folderpolicy = function(title, options) {
	if( !options.draft ) {
		var tags = options.tiddler.fields.tags;
		if ($tw.utils.isArray(tags)) {
			this.logger.log("Tags: "+tags.toString());
            for (var t=0; t<tagList.length; ++t) {
                if (tags.indexOf(tagList[t]) >= 0) {
                    var info = tagFolders[tagList[t]];
                    var subfolder = info.folderName;
                    if(info.folderMode !== "flat") {
                        options.subfolder = subfolder + "/" + this.subfoldersFromTitle(title);
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
