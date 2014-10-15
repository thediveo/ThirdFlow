/*\
title: $:/plugins/TheDiveO/ThirdFlow/widgets/jsonmangler.js
type: application/javascript
module-type: widget

JSON mangler widget -- similar to the fieldmangler widget,
but for mangling JSON data in a data tiddler instead of
mangling the fields of a tiddler.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

// The JSON mangler widget understands the following events:
// * tm-add-json-index: add a new index to a JSON data tiddler, the
//   index name to add is in the event param parameter.
// * tm-remove-json-index: remove an existing index from a JSON data
//   tiddler, as specified in the event param parameter.
var JsonManglerWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	this.addEventListeners([
		{type: "tm-add-json-index", handler: "handleAddJsonIndexEvent"},
		{type: "tm-remove-json-index", handler: "handleRemoveJsonIndexEvent"}
	]);
};

// Inherit from the base widget class
JsonManglerWidget.prototype = new Widget();

// Render this widget into the DOM
JsonManglerWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};


// Compute the internal state of the widget
JsonManglerWidget.prototype.execute = function() {
	// Get our parameters
	this.mangleTitle = this.getAttribute("tiddler",this.getVariable("currentTiddler"));
	// Construct the child widgets
	this.makeChildWidgets();
};

// Selectively refreshes the widget if needed. Returns true if the widget
// or any of its children needed re-rendering
JsonManglerWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.tiddler) {
		this.refreshSelf();
		return true;
	} else {
		return this.refreshChildren(changedTiddlers);		
	}
};

// Add a new index (as specified in the event param parameter) to a JSON
// data tiddler (specified in the widget title parameter). It is also possible
// to specify a default value; the event param parameter then needs to be a hashmap
// with the elements "index" (name of index) and "default" (default value).
JsonManglerWidget.prototype.handleAddJsonIndexEvent = function(event) {
	var tiddler = this.wiki.getTiddler(this.mangleTitle);
	var index = (typeof event.param === "string") ? event.param : event.param["index"];
	var def = (typeof event.param === "string") ? "" : event.param["default"];
	if ( index ) {
		var data = tiddler ? this.wiki.getTiddlerData(tiddler, {}) : {};
		data[index] = "";
		this.wiki.setTiddlerData(this.mangleTitle, data, tiddler);
	}
	return true;
};

// Remove an existing index (as specified in the event param parameter) from a JSON
// data tiddler (specified in the widget title parameter).
JsonManglerWidget.prototype.handleRemoveJsonIndexEvent = function(event) {
	var tiddler = this.wiki.getTiddler(this.mangleTitle);
	var index = (typeof event.param === "string") ? event.param : event.param["index"];
	if ( tiddler && index ) {
		var data = this.wiki.getTiddlerData(tiddler, {});
		delete data[index];
		this.wiki.setTiddlerData(this.mangleTitle, data, tiddler);
	}
	return true;
};

exports.jsonmangler = JsonManglerWidget;

})();
