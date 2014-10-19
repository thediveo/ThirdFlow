/*\
title: $:/plugins/TheDiveO/ThirdFlow/widgets/listmangler.js
type: application/javascript
module-type: widget

The list mangler widget -- mangles the list field of a
tiddler. It supports the following parameters:
* tiddler: the tiddler to work on, default is currentTiddler.
* field: the field to mangle as a list, default is the list field.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

// The list mangler widget understands the following events:
// * tm-add-list-element
// * tm-remove-list-element
// * tm-back-list-element
// * tm-forward-list-element
var ListManglerWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	this.addEventListeners([
		{type: "tm-add-list-element", handler: "handleAddListElementEvent"},
		{type: "tm-remove-list-element", handler: "handleRemoveListElementEvent"},
		{type: "tm-shift-forward-list-element", handler: "handleShiftForwardListElementEvent"},
		{type: "tm-shift-back-list-element", handler: "handleShiftBackListElementEvent"}
	]);
};

// Inherit from the base widget class
ListManglerWidget.prototype = new Widget();

// Render this widget into the DOM
ListManglerWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};


// Compute the internal state of the widget
ListManglerWidget.prototype.execute = function() {
	// Get our parameters
	this.mangleTitle = this.getAttribute("tiddler",this.getVariable("currentTiddler"));
    this.mangleField = this.getAttribute("field","list");
	// Construct the child widgets
	this.makeChildWidgets();
};

// Selectively refreshes the widget if needed. Returns true if the widget
// or any of its children needed re-rendering
ListManglerWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.tiddler || changedAttributes.field) {
		this.refreshSelf();
		return true;
	} else {
		return this.refreshChildren(changedTiddlers);		
	}
};

// Appends a new element to the list field (or other anspecified field) of
// the given tiddler. Ensures that the same element never gets added twice.
// If the tiddler doesn't exist yet, it will be created.
ListManglerWidget.prototype.handleAddListElementEvent = function(event) {
	var tiddler = this.wiki.getTiddler(this.mangleTitle) || new $tw.Tiddler({title: this.mangleTitle});
    var addElement = event.param;
    var list = $tw.utils.parseStringArray(tiddler.fields[this.mangleField] || "").slice(0);
    var where = list.indexOf(addElement);
    if(where<0) {
        list.push(addElement);
        var mods = this.wiki.getModificationFields();
        mods[this.mangleField] = list;
        this.wiki.addTiddler(new $tw.Tiddler(tiddler,mods));
    }
    return true;
};

// Removes an existing element from the list field (or another specified field)
// of the given tiddler.
ListManglerWidget.prototype.handleRemoveListElementEvent = function(event) {
	var tiddler = this.wiki.getTiddler(this.mangleTitle);
    if(tiddler) {
        var remElement = event.param;
        var list = $tw.utils.parseStringArray(tiddler.fields[this.mangleField] || "").slice(0);
        var where = list.indexOf(remElement);
        if(where>=0) {
            list.splice(where,1);
            var mods = this.wiki.getModificationFields();
            mods[this.mangleField] = list;
            this.wiki.addTiddler(new $tw.Tiddler(tiddler,mods));
        }
    }
    return true;
};

// Moves an existing element from the list field (or another specified field)
// one position forward towards the end of the list of the given tiddler.
ListManglerWidget.prototype.handleShiftForwardListElementEvent = function(event) {
	var tiddler = this.wiki.getTiddler(this.mangleTitle);
    if(tiddler) {
        var shiftElement = event.param;
        var list = $tw.utils.parseStringArray(tiddler.fields[this.mangleField] || "").slice(0);
        var where = list.indexOf(shiftElement);
        if((where>=0) && (where<list.length-1)) {
            var swapElement = list[where+1];
            list.splice(where,2,swapElement,shiftElement);
            var mods = this.wiki.getModificationFields();
            mods[this.mangleField] = list;
            this.wiki.addTiddler(new $tw.Tiddler(tiddler,mods));
        }
    }
    return true;
};

// Moves an existing element from the list field (or another specified field)
// one position backwards towards the beginning of the list of the given tiddler.
ListManglerWidget.prototype.handleShiftBackListElementEvent = function(event) {
	var tiddler = this.wiki.getTiddler(this.mangleTitle);
    if(tiddler) {
        var shiftElement = event.param;
        var list = $tw.utils.parseStringArray(tiddler.fields[this.mangleField] || "").slice(0);
        var where = list.indexOf(shiftElement);
        if(where>=1) {
            var swapElement = list[where-1];
            list.splice(where-1,2,shiftElement,swapElement);
            var mods = this.wiki.getModificationFields();
            mods[this.mangleField] = list;
            this.wiki.addTiddler(new $tw.Tiddler(tiddler,mods));
        }
    }
    return true;
};

exports.listmangler = ListManglerWidget;

})();
