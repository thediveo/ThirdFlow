/*\
created: 20180212171824929
type: application/javascript
title: $:/plugins/TheDiveO/ThirdFlow/commands/releaseplugins.js
tags:
modified: 20180212172043868
module-type: command
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* Exports our --releaseplugins command, which packages all plugins marked for
 * release in this wiki, and then writes them to the local filesystem.
 */
exports.info = {
  name: "releaseplugins",
  synchronous: true
};


var RELEASE_CONFIG_TIDDLERS_PREFIX = "$:/config/ThirdFlow/plugins";
var RELEASE_CONFIG_FILTER = "[prefix[" + RELEASE_CONFIG_TIDDLERS_PREFIX + "/]]";


var thirdflow = require("$:/plugins/TheDiveO/ThirdFlow/libs/thirdflow.js");


/* Creates a new command instance. */
var Command = function(params, commander) {
  this.params = params;
  this.commander = commander;
  this.logger = new $tw.utils.Logger("--" + exports.info.name);
};


/* Executes our command. */
Command.prototype.execute = function() {
  var self = this;
  /* check your command parameters, which you will find in this.params */
  if (self.params.length) {
    self.logger.log("ignoring command parameter(s)");
  }

  // Retrieve the release configuration tiddlers, then iterate over them
  // and package and render those plugins for which release is enabled.
  var releaseConfigs = $tw.wiki.filterTiddlers(RELEASE_CONFIG_FILTER);
  self.logger.log("release config tiddlers found:", releaseConfigs.length);
  $tw.utils.each(releaseConfigs, function(title) {
    var pluginTitle = title.substr(RELEASE_CONFIG_TIDDLERS_PREFIX.length + 1);
    var config = $tw.wiki.getTiddler(title);
    if (config) {
      var release = config.fields["release"] || "";
      var releaseName = config.fields.text;
      if (!releaseName || release !== "yes") {
        self.logger.log("!!! skipping:", pluginTitle);
      } else {
        self.logger.log("packaging:", pluginTitle);
        thirdflow.packagePlugin($tw.wiki, pluginTitle);
        self.logger.log("writing to:", releaseName);
      }
    }
  });

  return null; /* no error. */
};


exports.Command = Command;

})();
