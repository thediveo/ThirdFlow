/*\
created: 20180217143029574
type: application/javascript
title: $:/plugins/TheDiveO/ThirdFlow/commands/releasedemowiki.js
tags:
modified: 20180217143211351
module-type: command
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";


exports.info = {
  name: "releasedemowiki",
  synchronous: true
};


var RELEASE_CONFIG_TIDDLER = "$:/config/ThirdFlow/demowiki";
var DEFAULT_DEMOWIKI_TEMPLATE = "$:/plugins/TheDiveO/ThirdFlow/templates/save-all-wo-plugin-sources";


/* Creates a new command instance to release a demo wiki. */
var Command = function(params, commander) {
  this.params = params;
  this.commander = commander;
  this.logger = new $tw.utils.Logger("--" + exports.info.name);
};


/* Releases this wiki as a plugin-demo wiki. */
Command.prototype.execute = function() {
  var self = this;
  if (self.params.length) {
    self.logger.log("ignoring command parameter(s)");
  }

  var path = require("path");
  var fs = require("fs");

  var config = $tw.wiki.getTiddler(RELEASE_CONFIG_TIDDLER);
  if (!config) {
    self.logger.log("!!! skipping demowiki");
  } else {
    var release = config.fields["release"] || "";
    var releaseName = config.fields.text.replace(/\r?\n|\r/g, "");
    var template = config.fields["template"] || DEFAULT_DEMOWIKI_TEMPLATE;

    if (!releaseName || release !== "yes") {
      self.logger.log("!!! skipping demowiki");
    } else {
      var filename = path.resolve(self.commander.outputPath, releaseName);
      self.logger.log("writing demowiki to:", filename);
      var content = $tw.wiki.renderTiddler("text/plain", template);
      var err = $tw.utils.createFileDirectories(filename);
      if (typeof err === "string") {
        self.logger.alert("cannot create file directories");
        return err;
      }
      fs.writeFileSync(filename, content, { encoding: "utf8" });
    }
  }

  return null; /* no error. */
};


exports.Command = Command;

})();
