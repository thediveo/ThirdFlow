/*\
created: 20180203193341374
type: application/javascript
title: $:/plugins/TheDiveO/ThirdFlow/macros/typedplugintiddlertitle.js
modified: 20180205195741652
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "typedplugintiddlertitle";

exports.params = [
  { name: "pluginroot" }, /* such as: "$:/plugins/publisher/plugin" */
  { name: "configtiddler" }, /* title of config infix tiddler (may be missing) */
  { name: "defaulttiddler" }, /* title of default infix tiddler (may be missing too, but should not ;) */
  { name: "title" }  /* title (suffix) */
];

exports.run = function(pluginroot, configtiddler, defaulttiddler, title) {
  /* Start with the plugin root part, and add a trailing slash, if not already given */
  var t = pluginroot;
  if (t.length && t.substr(-1) !== "/") {
    t += "/";
  }

  /* Either add a configured infix, or a default infix; handle "" config correctly. */
  var cfgtiddler = this.wiki.getTiddler(configtiddler);
  if (cfgtiddler) {
    t += cfgtiddler.fields.text; /* "" will be just fine! */
  } else {
    var deftiddler = this.wiki.getTiddler(defaulttiddler);
    if (deftiddler) {
      t += deftiddler.fields.text;
    }
  }
  if (t.length && t.substr(-1) !== "/") {
    t += "/";
  }

  /* End with the (suffix) title element. */
  t += title;
  
  /* Grmpf: ensure that the full title returned is unique. */
  return this.wiki.generateNewTitle(t);
};

})();