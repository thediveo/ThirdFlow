/*\
created: 20180430151214562
type: application/javascript
title: $:/plugins/TheDiveO/ThirdFlow/widgets/action-ensurefield.js
tags:
modified: 20180430152406113
module-type: widget
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* We cannot inherit from <action-setfield> here, as its constructor
 * isn't aware of inheritance. Grmpf.
 */
var Widget = require("$:/core/modules/widgets/widget.js").widget;

/* Creates a new <action-ensurefield> widget: it works similar to the
 * existing <action-setfield> widget, but sets the field only if it is
 * missing or empty.
 */
var EnsureFieldWidget = function(parseTreeNode, options) {
  if (arguments.length > 0) {
    this.initialise(parseTreeNode, options);
  }
};

/* "Inherits" from the widget base "class".
 */
EnsureFieldWidget.prototype = new Widget();

/*
 * Vanilla widget rendering method.
 */
EnsureFieldWidget.prototype.render = function(parent,nextSibling) {
 	this.computeAttributes();
 	this.execute();
};

/*
 * Internal state computation taken from CreateTiddlerWidget.
 */
EnsureFieldWidget.prototype.execute = function() {
  this.actionTiddler = this.getAttribute("$tiddler", this.getVariable("currentTiddler"));
	this.actionField = this.getAttribute("$field");
	this.actionValue = this.getAttribute("$value");
	this.actionTimestamp = this.getAttribute("$timestamp", "yes") === "yes";
};

/*
 * Refreshing the widget taken from CreateTiddlerWidget.
 */
EnsureFieldWidget.prototype.refresh = function(changedTiddlers) {
  var changedAttributes = this.computeAttributes();
	if (changedAttributes["$tiddler"] || changedAttributes["$field"] || changedAttributes["$value"]) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

/* Only sets field(s) if do(es)n't exist yet or is/are left empty.
 */
EnsureFieldWidget.prototype.invokeAction = function(triggeringWidget, event) {
  var self = this,
  		options = {};
	options.suppressTimestamp = !this.actionTimestamp;
  var tiddler = this.wiki.getTiddler(this.actionTiddler);

  // Process (legacy) parameters...
  if ((typeof this.actionField == "string") || (typeof this.actionValue == "string")) {
    if (!tiddler || !$tw.utils.hop(tiddler.fields, this.actionField) || tiddler.getFieldString(this.actionField).length === 0)
		this.wiki.setText(this.actionTiddler, this.actionField, undefined, this.actionValue, options);
	}

  // Process all other attributes as field=value...
	$tw.utils.each(this.attributes, function(value, name) {
		if (name.charAt(0) !== "$") {
      if (!tiddler || !$tw.utils.hop(tiddler.fields, name) || tiddler.getFieldString(name).length === 0) {
        self.wiki.setText(self.actionTiddler, name, undefined, value, options);
      }
		}
	});
	return true; // Action was invoked
};

/* Finally exports the widget constructor. */
exports["action-ensurefield"] = EnsureFieldWidget;

})();
