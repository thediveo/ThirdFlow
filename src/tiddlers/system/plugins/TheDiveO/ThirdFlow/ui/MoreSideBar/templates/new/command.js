/*\
created: 20180204195302478
title: $:/plugins/TheDiveO/ThirdFlow/ui/MoreSideBar/templates/new/command.js
tags: 
modified: 20180204200118789
type: application/javascript
module-type: command
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* name of command and whether it is run synchronously or asynchronously */
exports.info = {
  name: "FooBarBaz",
  synchronous: true
};

/* Create a new command instance. Please note that asynchronous commands will
 * receive a third "callback" parameter, which you should store for later use;
 * see below.
 */
var Command = function(params, commander /*, callback */) {
  this.params = params;
  this.commander = commander;
  this.logger = new $tw.utils.Logger("--" + exports.info.name);
  /* this.callback = callback; */
};

/* Execute a command.
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