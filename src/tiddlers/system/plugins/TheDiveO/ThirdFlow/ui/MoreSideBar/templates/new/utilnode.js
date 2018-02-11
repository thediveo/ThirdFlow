/*\
created: 20180211153526427
type: application/javascript
title: $:/plugins/TheDiveO/ThirdFlow/ui/MoreSideBar/templates/new/utilnode.js
modified: 20180211153817740
tags: 
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* Only when running inside a Node.js-based TiddlyWiki server,
 * this creates a new Foo tool, which can be used as in:
 * var fool = new $tw.utils.Foo();
 * You don't need to export a constructor function, instead
 * you can also export an ordinary utility function which just
 * does something and may return something else. Such as in:
 * $tw.utils.doSomething(false);
 */
var Fooooo = function() {
  /* ... */
};
  
/* Add methods as necessary */
Fooooo.prototype.bar = function() {
  /* ... */
};

/* Exports the (constructor) function */
exports.Fooooo = Fooooo;
  
})();