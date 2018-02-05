/*\
created: 20180205162715434
modified: 20180205163131597
type: application/javascript
title: $:/plugins/TheDiveO/ThirdFlow/ui/MoreSideBar/templates/new/parser.js
module-type: parser
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* Parses blocks of source text into a parse tree. The parameters to the
 * constructor are as follows:
 *
 * type: the (mime type) of the text to parse.
 * text: the text to parse.
 * options:
 *    .wiki: TiddlyWiki object reference.
 *    ._canonical_uri: ...
 */
var Parser = function(type, text, options) {
  this.tree = [{
    "type": "element", "tag": "code", "children": [{
      "type": "text", "text": text
    }]
  }];
};

/* Declares the (document) mime types this parser is able to handle; multiple
 * export declarations are supported.
 */
exports["application/x-foo-ducument"] = Parser;

})();
