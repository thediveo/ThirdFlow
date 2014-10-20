/*\
created: 20141020111845057
title: $:/plugins/TheDiveO/ThirdFlow/macros/sanitizedfoldername.js
type: application/javascript
modified: 20141020111852925
module-type: macro

Macro to sanitize a tiddler title for use as, e.g. a folder name.
Also converts the title to lowercase.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
*/

exports.name = "sanitizedfoldername";

exports.params = [
	{name: "title"}
];

/*
Run the macro
*/
exports.run = function(title) {
	return title.replace(/\<|\>|\:|\"|\/|\\|\||\?|\*|\^/g,"_").toLowerCase();
};

})();
