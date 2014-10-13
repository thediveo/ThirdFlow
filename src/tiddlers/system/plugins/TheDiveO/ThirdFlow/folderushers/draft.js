/*\
created: 20141012162041927
modified: 20141012163305588
module-type: folderusher
title: $:/plugins/TheDiveO/ThirdFlow/folderushers/draft.js
type: application/javascript

This folder usher handles draft tiddlers. It is used by the file system sync adaptor
to decide where (subdir) to store tiddlers.
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// A folder usher needs to decide whether it is responsible; if not, it has to return false.
// The following parameters get handed to folder ushers:
// title: the title of the tiddler in question
// options: further in/out information, i.e.
//   options.draft: true, if the tiddler is a draft tiddler
//   options.subfolder: the sub directory where to store the tiddler; still OS-independent.
//   options.name: the file name of the tiddler; still OS-independent.
exports.draft = function(title, options) {
	if(options.draft) {
		options.subfolder = "drafts";
		return true;
	}
	return false;
};

})();
