/*\
created: 20140927173011680
title: $:/plugins/TheDiveO/ThirdFlow/commands/rendertemplatedtiddler.js
type: application/javascript
modified: 20140927173032181
module-type: command

Command to render a single tiddler using a template.
--rendertemplatedtiddler <title> <template> <file>

Command to render a single tiddler using a template to a specific file.
In comparism to --rendertiddler this command variant accepts a template
but only works on a single tiddler. This allows us to avoid having specific
template tiddlers including the filter set.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";


exports.info = {
	name: "rendertemplatedtiddler",
	synchronous: true
};


var Command = function(params,commander) {
	this.params = params;
	this.commander = commander;
  this.logger = new $tw.utils.Logger("--" + exports.info.name);
};


Command.prototype.execute = function() {
	if (this.params.length < 3) {
		return "Missing template or filename";
	}
	var thirdflow = require("$:/plugins/TheDiveO/ThirdFlow/libs/thirdflow.js");
	var path = require("path");
	var title = this.params[0];
	var template = this.params[1];
	var filename = path.resolve(this.commander.outputPath, this.params[2]);
	// Save the tiddler as a self contained templated file
  thirdflow.renderTiddlerWithTemplate(
		this.commander.wiki,
		title,
		template,
		filename
	);
  this.logger.log("rendered tiddler", title, "to", filename);
	return null; // done fine
};


exports.Command = Command;

})();
