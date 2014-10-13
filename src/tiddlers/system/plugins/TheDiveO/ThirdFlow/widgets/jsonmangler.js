/*\
title: $:/plugins/TheDiveO/ThirdFlow/widgets/jsonmangler.js
type: application/javascript
module-type: widget

JSON mangler widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var JsonManglerWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	this.addEventListeners([
		{type: "tm-add-json-index", handler: "handleAddJsonIndexEvent"},
		{type: "tm-remove-json-index", handler: "handleRemoveJsonIndexEvent"}
	]);
};

/*
Inherit from the base widget class
*/
JsonManglerWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
JsonManglerWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
JsonManglerWidget.prototype.execute = function() {
	// Get our parameters
	this.mangleTitle = this.getAttribute("tiddler",this.getVariable("currentTiddler"));
	// Construct the child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
JsonManglerWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.tiddler) {
		this.refreshSelf();
		return true;
	} else {
		return this.refreshChildren(changedTiddlers);		
	}
};

JsonManglerWidget.prototype.handleRemoveJsonIndexEvent = function(event) {
	var tiddler = this.wiki.getTiddler(this.mangleTitle);
	if ( tiddler && tiddler.fields.type == "application/json" && typeof event.param === "string" ) {
		var json = JSON.parse(tiddler.fields.text);
		delete json[event.param];
		this.wiki.addTiddler(new $tw.Tiddler(tiddler, {text: JSON.stringify(json)}));
	}
	return true;
};

JsonManglerWidget.prototype.handleAddJsonIndexEvent = function(event) {
	var tiddler = this.wiki.getTiddler(this.mangleTitle);
	if ( tiddler && tiddler.fields.type == "application/json" && typeof event.param === "string" ) {
		var json = JSON.parse(tiddler.fields.text);
		json[event.param] = "";
		this.wiki.addTiddler(new $tw.Tiddler(tiddler, {text: JSON.stringify(json)}));
	}
	return true;
};

exports.jsonmangler = JsonManglerWidget;

})();
