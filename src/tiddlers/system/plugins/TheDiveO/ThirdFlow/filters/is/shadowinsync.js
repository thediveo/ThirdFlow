/*\
title: $:/plugins/TheDiveO/ThirdFlow/filters/is/shadowinsync.js
type: application/javascript
module-type: isfilteroperator

Filter function for [is[shadowinsync]]
  a tiddler is "shadowinsync" (synchronized with its shadow) when...
	- it is	an ordinary tiddler,
	- AND it has a shadow tiddler,
	- AND that shadow tiddler is equal to this ordinary tiddler.

  In all other cases, it is not in sync, especially when there's no shadow
	or the ordinary tiddler doesn't matches its shadow (because the shadow has
  been overridden with a different "version").

  The rationale for this filter is that we need to filter out (development/
	source) tiddlers that have been packed into a plugin, so they have an
	"identical" shadow. We don't want these development/source tiddlers to show
	up again in release files, but instead only the shadows inside their plugins.
	Yet me must not drop any tiddlers that are correctly overriding their shadows.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";


//var insynclog = new $tw.utils.Logger("is[shadowinsync]", {colour: "green"});
//var notinsynclog = new $tw.utils.Logger("is[shadowinsync]", {colour: "red"});


exports.shadowinsync = function(source, prefix, options) {
	var results = [];
	var invert = prefix === "!";
	var logged = false;

	source(function(tiddler, title) {
		var match = invert;
		// Titles without any shadow won't ever match...
		var pluginTitle = options.wiki.getShadowSource(title);
		if (pluginTitle) {
			// There's a shadow, so let's see what this shadow actually contains;
			// for this we need to directly access the shadow "tiddler" inside its
			// plugin. The "pluginInfo" is the plugin text content deserialized as
			// JSON. Now remember that plugins have their shadows stored as a
			// "tiddlers" property containing an array of tiddler data structures.
			// Now, we need to be careful: we have the tiddler in question as a real
			// $tw.Tiddler object, but the shadow is just a deserialized JSON object.
			// Wait, there's another trap: tiddler.isEqual() can compare only fields
			// that are either strings or arrays. But NOT Date objects!
			var shadow = options.wiki.getPluginInfo(pluginTitle).tiddlers[title];
			var shadowTiddler = new $tw.Tiddler(shadow, {title: title});
			// So we need to compare Date objects ... taking care that they MAY exist
			// (that's "exist", not "exit") or MAY NOT exist. For comparing two
			// Date()s to be equal, we simply compare the famous seconds since the
			// "UTC Epoch", so having not to worry about leap seconds, timezones,
			// TARDIS,...
			var datesMismatch =
				typeof(tiddler.fields.created) !== typeof(shadowTiddler.fields.created)
				|| !!tiddler.fields.created && !!(tiddler.fields.created.getTime() - shadowTiddler.fields.created.getTime())
				|| typeof(tiddler.fields.modified) !== typeof(shadowTiddler).fields.modified
				|| !!tiddler.fields.modified && !!(tiddler.fields.modified.getTime() - shadowTiddler.fields.modified.getTime())
				;
			if (!datesMismatch && tiddler.isEqual(shadowTiddler, ["created", "modified"])) {
				//insynclog.log(title, "in", pluginTitle);
				match = !match;
			} else {
				//notinsynclog.log("!", title, "from", pluginTitle);
			}
		}
		if (match) {
			results.push(title);
		}
	});
	return results;
};

})();
