/*\
created: 20180203175030065
type: application/javascript
title: $:/plugins/TheDiveO/ThirdFlow/ui/MoreSideBar/templates/new/jsmacro.js
modified: 20180204195221746
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