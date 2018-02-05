/*\
created: 20180205162715434
modified: 20180205163131597
type: application/javascript
title: $:/plugins/TheDiveO/ThirdFlow/ui/MoreSideBar/templates/new/command.js
tags:
module-type: command
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* Gives a name to our command and tells TiddlyWiki whether to run it
 * synchronously or asynchronously. The latter use a callback to signal
 * finish or failure (see below).
 */
exports.info = {
  name: "foobarbaz",
  synchronous: true
};

/* Creates a new command instance. Please note that asynchronous commands will
 * receive a third "callback" parameter, which we should store for later use;
 * see below how to use it.
 */
var Command = function(params, commander /*, callback */) {
  this.params = params;
  this.commander = commander;
  this.logger = new $tw.utils.Logger("--" + exports.info.name);
  /* this.callback = callback; */
};

/* Executes our command. For synchronous commands return either null (success)
 * or an error string. For asynchronous commands use the callback instead which
 * we'd receive in the constructor call.
 */
Command.prototype.execute = function() {
  /* check your command parameters, which you will find in this.params */
  if (this.params.length < 1) {
    return "Missing foo parameter";
  }

  /* ... */

  return null; /* no error. */
  /* this.callback(); // for async commands */
};

exports.Command = Command;

})();
