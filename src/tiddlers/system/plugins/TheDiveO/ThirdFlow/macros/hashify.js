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
	{name: "title"},
    {name: "prefix"}
];

/*
Run the macro
*/
exports.run = function(title,prefix) {
	return (prefix || "") + $tw.utils.hashString(title);
};

})();
