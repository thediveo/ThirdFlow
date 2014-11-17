/*\
created: 20141117182000659
modified: 20141117182932515
module-type: filteroperator
title: $:/plugins/TheDiveO/ThirdFlow/filters/titlecomponents.js
type: application/javascript

Filter operator for splitting a title containing slashes as separators
into its components.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.titlecomponents = function(source,operator,options) {
	var results = [];
	source(function(tiddler,title) {
        console.log("Title: ", title);
        var components = title.split("/");
        var idx;
        var l = components.length;
        for ( idx = 0; idx < l; idx++ ) {
            results.push(components[idx]);
        }
	});
	return results;
};

})();
