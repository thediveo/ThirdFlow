/*\
created: 20180205162715434
type: application/javascript
title: $:/plugins/TheDiveO/ThirdFlow/ui/MoreSideBar/templates/new/jsmacro.js
modified: 20180207100549039
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* Tells TiddlyWiki the name of our macro through the export mechanism. */
exports.name = "foObAr";

/* Lists of macro parameters; leave this array empty if you need none, or
 * want all supplied macro call parameters to be passed to the run() method.
 */
exports.params = [
  { name: "foo" }, /* 1st parameter name */
  { name: "bar", default: "bar" }
];

/* Executes (runs) our macro when it requires evaluation; returns a string
 * value.
 */
exports.run = function(foo, bar) {
  return foo + bar;
};

})();
