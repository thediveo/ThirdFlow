/*\
title: $:/plugins/TheDiveO/ThirdFlow/macros/hashify.js
type: application/javascript
module-type: macro

Macro to hash a tiddler title into a (mostly) unique number.
This avoids problems when using titles (from tags, et cetera)
as path elements of a system tiddler title.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
*/

exports.name = "hashify";

exports.params = [
	{name: "title"}
];

/*
Run the macro
*/
exports.run = function(title) {
    console.log("hashify" + title + ":" + $tw.utils.hashString(title));
	return "hash-" + $tw.utils.hashString(title);
};

})();
