/*\
created: 20141020111918405
title: $:/plugins/TheDiveO/ThirdFlow/widgets/ensuretiddler.js
type: application/javascript
modified: 20141020111927394
module-type: widget

Default widget: if a particular tiddler is not present,
then it gets created using the default values specified.
In contrast to the new tiddler creation message, we don't
use a static template but instead accept the default values
in form of a JSON string that may be the result of some
macro invokation.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var EnsureTiddlerWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
EnsureTiddlerWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
EnsureTiddlerWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
EnsureTiddlerWidget.prototype.execute = function() {
	// Get our parameters
	this.ensureTitle = this.getAttribute("title","currentTiddler");
	this.ensureDefault = this.getAttribute("default");

    var tiddler = this.wiki.getTiddler(this.ensureTitle);
    if(!tiddler) {
        var defaults;
        try {
            defaults = JSON.parse(this.ensureDefault);
        } catch(ex) {
            defaults = {};
        }
        defaults["title"] = this.ensureTitle;
        var mods = this.wiki.getModificationFields();
        this.wiki.addTiddler(new $tw.Tiddler(defaults,mods));
    }
    
    // Construct the child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
EnsureTiddlerWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.title || changedAttributes.default) {
		this.refreshSelf();
		return true;
	} else {
		return this.refreshChildren(changedTiddlers);		
	}
};

exports.ensuretiddler = EnsureTiddlerWidget;

})();
