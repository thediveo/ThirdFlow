/*\
created: 20180205162715434
type: application/javascript
title: $:/plugins/TheDiveO/ThirdFlow/ui/MoreSideBar/templates/new/filter.js
modified: 20180207103213628
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* Gives a name to and and exports our filter operator function. The parameters
 * to operator functions are as follows:
 *
 * source: a tiddler iterator that represents the resoluts of the previous
 *    filter step.
 * operator: the arguments to this filter operator...
 *    .operator: name of the filter operator.
 *    .operand: the operand as a string; text references and variable names
 *       have already been resolved at this point.
 *    .prefix: an optional "!" if the filter is to be negated.
 *    .suffix: an optional string containing an additional filter argument.
 * options:
 *    .wiki: wiki object reference.
 *    .widget: an optional widget node object reference.
 *
 * It's allowed to return either an array of titles or a tiddler iterator,
 * depending on your needs.
 */
exports.dofoo = function(source, operator, options) {
	var results = [];
	source(function(tiddler, title) {
		results.push("foo" + title);
	});
	return results;
};

})();
