/*\
created: 20140927173349128
title: $:/plugins/TheDiveO/ThirdFlow/filters/is/shadowinsync.js
type: application/javascript
modified: 20140927173409192
module-type: isfilteroperator

Filter function for [is[shadowinsync]]
  a tiddler is shadowsynced when an ordinary tiddler also has
  a shadow tiddler *AND* the shadow tiddler is the same as the
  real tiddler. This is decided on the basis of type, and the
  creation and modification dates.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.shadowinsync = function(source,prefix,options) {
	var results = [];
	var invert = prefix === "!";
	source(function(tiddler,title) {
		var match = invert;
		var pluginTitle = options.wiki.getShadowSource(title);
		if(pluginTitle) {
			var pluginInfo = options.wiki.getPluginInfo(pluginTitle),
				shadow = pluginInfo.tiddlers[title];
			if ( (tiddler.fields.type == shadow.type)
			     && (tiddler.getFieldString("created") === shadow.created)
				 && (tiddler.getFieldString("modified") === shadow.modified) ) {
				match = !match;
			}
		}
		if ( match ) {
			results.push(title);
		}
	});
	return results;
};

})();
