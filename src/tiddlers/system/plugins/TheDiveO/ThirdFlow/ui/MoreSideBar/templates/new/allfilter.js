/*\
created: 20180205162715434
type: application/javascript
title: $:/plugins/TheDiveO/ThirdFlow/ui/MoreSideBar/templates/new/allfilter.js
tags: 
modified: 20180207103459780
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* Gives a name to and exports our [all[XXX]] filter operator function. Such
 * all-filter operators return all tiddlers of a certain "category". The parameters
 * to this all-operator function are as follows; they slightly differ from the
 * "generic" filter operators:
 *
 * source: a tiddler iterator that represents the results of the previous
 *    filter step. Not of much use here, ignore it for most usecases.
 * prefix: an optional "!" if the all-filter is to be negated (if supported).
 * options:
 *    .wiki: wiki object reference.
 *    .widget: an optional widget node object reference.
 *
 * It's possible to return either an array of titles or a tiddler iterator,
 * depending on your needs.
 */
exports.foos = function(source, prefix, options) {
  return ["foo", "bar", "baz"];
};

})();
