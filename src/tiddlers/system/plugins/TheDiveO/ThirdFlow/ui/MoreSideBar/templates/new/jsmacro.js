/*\
created: 20180203175030065
title: $:/plugins/TheDiveO/ThirdFlow/ui/MoreSideBar/templates/new/jsmacro
modified: 20180203180023460
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* macro name as seen in TW5 */
exports.name = "foObAr";

/* list of macro parameters; leave array empty if you need none or want
 * all supplied macro call parameters to be passed to the run() method.
 */
exports.params = [
  { name: "foo" }, /* 1st parameter name */
  { name: "bar", default: "bar" }
];

/* macro code to run when macro requires evaluation; return string value. */
exports.run = function(foo, bar) {
  return foo + bar;
};

})();