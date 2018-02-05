/*\
created: 20180205162715434
modified: 20180205163131597
type: application/javascript
title: $:/plugins/TheDiveO/ThirdFlow/ui/MoreSideBar/templates/new/isfilter.js
module-type: isfilteroperator
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* Gives a name to and exports our [is[XXX]] filter operator function. Such
 * is-filter operators filter tiddlers by a certain "category". The parameters
 * to this is-operator function are as follows; they slightly differ from the
 * "generic" filter operators:
 *
 * source: a tiddler iterator that represents the results of the previous
 *    filter step, which we now need to filter.
 * prefix: an optional "!" if the all-filter is to be negated (if supported).
 * options:
 *    .wiki: wiki object reference.
 *    .widget: an optional widget node object reference.
 *
 * It's possible to return either an array of titles or a tiddler iterator,
 * depending on your needs.
 */
exports.foo = function(source, prefix, options) {
  var results = [];

  if (prefix !== "!") {
    source(function(tiddler, title) {
      if(["foo", "bar", "baz"].indexOf(title) >= 0) {
        results.push(title);
      }
    });
  } else {
    source(function(tiddler, title) {
      if(["foo", "bar", "baz"].indexOf(title) < 0) {
        results.push(title);
      }
    });
  }

  return results;
};

})();
