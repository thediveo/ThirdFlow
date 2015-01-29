/*\
created: 20141015190317579
title: $:/plugins/TheDiveO/ThirdFlow/syncadapters/hierarchicalfilesystemadaptor.js
type: application/javascript
modified: 20141015190324904
module-type: syncadaptor

A sync adaptor module for synchronising with the local filesystem via node.js APIs
...in contrast to filesystemadaptor.js this variant understands forward slashes "/"
in tiddler titles and stores tiddlers appropriately in the file system by mapping
the hierarchy in the title to a (sub) directory structure.

In addition, this sync adaptor understands the concept of system tiddlers (starting
their titles with "$:/") and stores them inside a "special" system branch.

Moreover, this sync adaptor also understands the concept of draft tiddlers (based
on the presence of the "draft.of" field) and stores all draft tiddlers in a flat
single "drafts" folder. The makes cleanup and (git) repository syncing easier to do.

In order to realize good modularity and to allow this sync adaptor to be enhanced
at any time later in an easy manner, it supports so-called folder policy modules.
These are module tiddlers with a module-type of "folderpolicy". Folder policy modules
need to export a method named "folderpolicy". In addition, folder policy modules
can be assigned a priority value. Normally, the priority of a folder policy should
be between 199 and 1, inclusively. Priority 200 is currently used for the draft
tiddler policy. Priority 0 is assigned to the default policy.

The code for this sync adaptor comes from filesystemadaptor.js and has been enhanced
to support hierarchical tiddler storage as well as folder policies.
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Get a reference to the file system and path tools
var fs = $tw.node ? require("fs") : null,
	path = $tw.node ? require("path") : null;

function HierarchicalFileSystemAdaptor(options) {
	var self = this;
	this.wiki = options.wiki;
	this.logger = new $tw.utils.Logger("HierarchicalFileSystem");
	// Create the <wiki>/tiddlers folder if it doesn't exist
	$tw.utils.createDirectory($tw.boot.wikiTiddlersPath);
	
	this.config = {
		disabled: false
	};
	
	// retrieve all folder policy modules and sort them according
	// to their priority, with higher priority values sorted towards
	// the beginning of our folder policy modules list. Policy modules
	// more to the beginning are getting an earlier chance of applying
	// their policy.
	var fpModules = [];
	var fpcWatching = [];
	$tw.modules.forEachModuleOfType("folderpolicy", function(title, exports) {
		// prepare folder policy information for later sorting and calling
		fpModules.push({
			title: title, // just for logging
			priority: options.wiki.getTiddler(title).fields.priority || 100,
			policy: exports.folderpolicy || function() { return false; }
		});
		// get the information to monitor for configuration changes
		if ( exports.watch && exports.reconfig ) {
			fpcWatching.push({
				filter: self.wiki.compileFilter(exports.watch),
				reconfig: exports.reconfig
			});
		}
		// initial configuration call
		if ( exports.reconfig ) {
			exports.reconfig.call(self);
		}
	});
	this.fpcWatching = fpcWatching;
	fpModules.sort(function(policyA, policyB) {
		return policyB.priority - policyA.priority;
	});
	this.logger.log(fpModules.length + " folder policies active");
	this.policyModules = fpModules;
	
	if($tw.boot.wikiInfo.config["disable-hfs"]) {
		this.config.disabled = true;
		this.logger.log("plugin disabled; no saving and deleting");
	}
}

HierarchicalFileSystemAdaptor.prototype.getTiddlerInfo = function(tiddler) {
	return {};
};

//
// file type-specific templates
//
$tw.config.typeTemplates = {
	"application/x-tiddler": "$:/core/templates/tid-tiddler",
	"application/javascript": "$:/plugins/TheDiveO/ThirdFlow/templates/javascript-tiddler"
};

HierarchicalFileSystemAdaptor.prototype.getTiddlerFileInfo = function(tiddler,callback) {
	// See if we've already got information about this file
	var self = this,
		title = tiddler.fields.title,
		fileInfo = $tw.boot.files[title],
		draftOf = tiddler.fields["draft.of"];
	// Get information about how to save tiddlers of this type
	var type = tiddler.fields.type || "text/vnd.tiddlywiki",
		typeInfo = $tw.config.contentTypeInfo[type];
	if(!typeInfo) {
        typeInfo = $tw.config.contentTypeInfo["text/vnd.tiddlywiki"];
	}
	if (!($tw.config.typeTemplates[typeInfo.fileType || tiddler.fields.type])) {
        typeInfo = $tw.config.contentTypeInfo["text/vnd.tiddlywiki"];
		typeInfo.fileType = "application/x-tiddler";
	}
	var extension = typeInfo.extension || "";
	if(!fileInfo) {
		// If not, we'll need to generate it
        // Handle case where the title already ends in the file extension:
        // in this case we remove the extension from the suggested title.
        var suggestedName = title;
        if(suggestedName.substr(-extension.length) === extension) {
            suggestedName = suggestedName.substr(0,suggestedName.length - extension.length);
        }
		var paf = self.generateTiddlerPathAndFilename(tiddler, suggestedName, draftOf);
		var folder = $tw.boot.wikiTiddlersPath+path.sep+paf.subfolder;
		$tw.utils.createDirectory(folder);
		// Start by getting a list of the existing files in the directory
		fs.readdir(folder,function(err,files) {
			if(err) {
				return callback(err);
			}
			// Assemble the new fileInfo
			fileInfo = {};
			
			fileInfo.filepath = folder + path.sep + self.generateUniqueTiddlerFilename(paf.name,draftOf,extension,files);
			fileInfo.type = typeInfo.fileType || tiddler.fields.type;
			fileInfo.hasMetaFile = typeInfo.hasMetaFile;
			// Save the newly created fileInfo
			$tw.boot.files[title] = fileInfo;
			// Pass it to the callback
			callback(null,fileInfo);
		});
	} else {
		// Otherwise just invoke the callback
		callback(null,fileInfo);
	}
};

HierarchicalFileSystemAdaptor.prototype.subfoldersFromTitle = function(title) {
	var lastSlash = title.lastIndexOf("/");
	if (lastSlash<=0) {
		return "";
	} else {
		return title.substr(0,lastSlash+1);
	}
};

HierarchicalFileSystemAdaptor.prototype.leafFromTitle = function(title) {
	var lastSlash = title.lastIndexOf("/");
	if (lastSlash<0) {
		return title;
	} else {
		return title.substr(lastSlash+1);
	}
};

HierarchicalFileSystemAdaptor.prototype.generateTiddlerPathAndFilename = function(tiddler, suggestedTitle, draftOf) {
	// set up the policy method options such that if in a rare circumstance no policy
	// should fire, then we fall back to plain old flat storage in the main wiki folder.
	var options = {
		tiddler: tiddler, // in: tiddler object we're trying a policy to find for
		draft: !!draftOf, // in: is this a draft tiddler?
		subfolder: "", // in/out: folder into which to place the tiddler file
		name: suggestedTitle // in/out: name of tiddler file
	};
	
	// run through our ordered list of folder policies and wait for one of them
	// to return true because its folder policy should be applied.
	for (var i=0; i<this.policyModules.length; ++i) {
		if (this.policyModules[i].policy.call(this, suggestedTitle, options)) {
			break;
		}
	}
	
	// Sanitize the filename as well as the subfolder(s) name(s)...
	// This more or less comes down to removing those characters that are illegal in
	// Windows file names. Oh, and we also hammer out any hierarchy slashes inside
	// the filename, thereby flattening it.
	options.name = options.name.replace(/\<|\>|\:|\"|\/|\\|\||\?|\*|\^/g,"_");
	// For the subfolder path we are converting hierarchy slashes into the proper
	// platform-specific separators.
	options.subfolder = options.subfolder.replace(/\<|\>|\:|\"|\\|\||\?|\*|\^/g,"_").replace(/\//g, path.sep);

	return options;
};

/*
Given a tiddler title and an array of existing filenames, generate a new legal filename for the title, case insensitively avoiding the array of existing filenames
*/
HierarchicalFileSystemAdaptor.prototype.generateUniqueTiddlerFilename = function(baseFilename,draftOf,extension,existingFilenames) {
	// Truncate the filename if it is too long
	if(baseFilename.length > 200) {
		baseFilename = baseFilename.substr(0,200);
	}
	// Start with the base filename plus the extension
	var filename = baseFilename + extension,
		count = 1;
	// Add a discriminator if we're clashing with an existing filename
	while(existingFilenames.indexOf(filename) !== -1) {
		filename = baseFilename + " " + (count++) + extension;
	}
	return filename;
};

/*
Save a tiddler and invoke the callback with (err,adaptorInfo,revision)
*/
HierarchicalFileSystemAdaptor.prototype.saveTiddler = function(tiddler,callback) {
	var self = this;

	// Monitor for configuration changes and then trigger the folder
	// policy modules affected from configuration changes.
	$tw.utils.each(this.fpcWatching, function(watch, title, obj) {
		var changes = watch.filter.call(self.wiki, function(filterCallback) {
			filterCallback(tiddler, tiddler.fields.title);
		});
		if ( changes.length > 0 ) {
			watch.reconfig.call(self, tiddler.fields.title);
		}
	});
	
	// Proceed with saving the tiddler
	if(this.config.disabled) {
		this.logger.log("saving disabled");
		return callback(null, {}, 0);
	}
	
	this.getTiddlerFileInfo(tiddler,function(err,fileInfo) {
		var template, content, encoding;
		function _finish() {
			callback(null, {}, 0);
		}
		if(err) {
			return callback(err);
		}
		if(fileInfo.hasMetaFile) {
			// Save the tiddler as a separate body and meta file
			var typeInfo = $tw.config.contentTypeInfo[fileInfo.type],
				encoding = typeInfo.encoding || "base64"; // makes sense for TW
			self.logger.log("saving type", fileInfo.type, "with meta file and encoding", encoding);
			fs.writeFile(fileInfo.filepath,tiddler.fields.text,{encoding: encoding},function(err) {
				if(err) {
					return callback(err);
				}
				content = self.wiki.renderTiddler("text/plain","$:/core/templates/tiddler-metadata",{variables: {currentTiddler: tiddler.fields.title}});
				fs.writeFile(fileInfo.filepath + ".meta",content,{encoding: "utf8"},function (err) {
					if(err) {
						return callback(err);
					}
					self.logger.log("Saved file",fileInfo.filepath);
					_finish();
				});
			});
		} else {
			// Save the tiddler as a self contained templated file
			template = $tw.config.typeTemplates[fileInfo.type];
			content = self.wiki.renderTiddler("text/plain",template,{variables: {currentTiddler: tiddler.fields.title}});
			fs.writeFile(fileInfo.filepath,content,{encoding: "utf8"},function (err) {
				if(err) {
					return callback(err);
				}
				self.logger.log("Saved file",fileInfo.filepath);
				_finish();
			});
		}
	});
};

/*
Load a tiddler and invoke the callback with (err,tiddlerFields)

We don't need to implement loading for the file system adaptor, because all the tiddler files will have been loaded during the boot process.
*/
HierarchicalFileSystemAdaptor.prototype.loadTiddler = function(title,callback) {
	callback(null,null);
};

/*
Delete a tiddler and invoke the callback with (err)
*/
HierarchicalFileSystemAdaptor.prototype.deleteTiddler = function(title,callback,options) {
	if(this.config.disabled) {
		this.logger.log("deleting disabled");
		return callback(null);
	}

	var self = this,
		fileInfo = $tw.boot.files[title];
	// Only delete the tiddler if we have writable information for the file
	if(fileInfo) {
		// Delete the file
		fs.unlink(fileInfo.filepath,function(err) {
			if(err) {
				return callback(err);
			}
			self.logger.log("Deleted file",fileInfo.filepath);
			// Delete the metafile if present
			if(fileInfo.hasMetaFile) {
				fs.unlink(fileInfo.filepath + ".meta",function(err) {
					if(err) {
						return callback(err);
					}
					delete $tw.boot.files[title];
					callback(null);
				});
			} else {
				delete $tw.boot.files[title];
				callback(null);
			}
		});
	} else {
		callback(null);
	}
};

if(fs) {
	exports.adaptorClass = HierarchicalFileSystemAdaptor;
}

})();
