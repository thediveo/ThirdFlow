/*\
created: 20180211154125055
type: application/javascript
title: $:/plugins/TheDiveO/ThirdFlow/ui/MoreSideBar/templates/new/widget.js
modified: 20180211154857371
tags: 
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

/* Creates a new <$foo> widget. */
var FooWidget = function(parseTreeNode, options) {
  this.initialise(parseTreeNode, options);
};
  
/* "Inherits" from the Widget base "class" in order to get all
 * the basic widget functionality.
 */
FooWidget.prototype = new Widget();

/* Renders this widget into the DOM. */
FooWidget.prototype.render = function(parent,nextSibling) {
  this.parentDomNode = parent;
  this.computeAttributes();
  this.execute();
  /* ... */
};

/* Computes the internal state of this widget. */
FooWidget.prototype.execute = function() {
  /* ... */
  this.makeChildWidgets();
};  
  
/* Selectively refreshes this widget if needed and returns
 * true if either this widget itself or one of its children
 * needs to be re-rendered.
 */
FooWidget.prototype.refresh = function(changedTiddlers) {
  var changedAttributes = this.computeAttributes(),
      hasChangedAttributes = $tw.utils.count(changedAttributes) > 0;
  if (hasChangedAttributes) {
      /* ... */
  }
  return this.refreshChildren(changedTiddlers) || hasChangedAttributes;
};

/* Finally exports the widget constructor. */
exports.foo = FooWidget;

})();