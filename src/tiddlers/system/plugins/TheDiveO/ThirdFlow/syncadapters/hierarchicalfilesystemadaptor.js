/*\
title: $:/plugins/TheDiveO/ThirdFlow/syncadapters/hierarchicalfilesystemadaptor.js
type: application/javascript
module-type: syncadaptor

A sync adaptor module for synchronising with the local filesystem via node.js APIs
...in contrast to filesystemadaptor.js this variant understands forward slashes "/"
in tiddler titles and stores tiddlers appropriately in the file system by mapping
the hierarchy in the title to a (sub) directory structure.

In addition, this sync adaptor understands the concept of system tiddlers (starting
their titles with "$:/") and stores them inside a "special" system branch.

Moreover, this sync adaptor also understands the concept of draft tiddlers (based
on the presence of the "draft.of" field) and stores all draft tiddlers in a flat
single ".draft" folder. The makes cleanup and (git) repository syncing easier to do.

The code for this sync adaptor comes from filesystemadaptor.js and has been enhanced
to support hierarchical tiddler storage.
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Get a reference to the file system
var fs = !$tw.browser ? require("fs") : null,
	path = !$tw.browser ? require("path") : null;

function HierarchicalFileSystemAdaptor(options) {
	var self = this;
	this.wiki = options.wiki;
	this.logger = new $tw.utils.Logger("HierarchicalFileSystem");
	// Create the <wiki>/tiddlers folder if it doesn't exist
	$tw.utils.createDirectory($tw.boot.wikiTiddlersPath);
	
	this.config = {
		disabled: false
	};
	
	// retrieve all folder usher modules
	this.folderUshers = $tw.modules.applyMethods("folderusher");
	this.folderUsherNames = Object.keys(this.folderUshers).sort();
	
	if($tw.boot.wikiInfo.config["disable-hfs"]) {
		this.config.disabled = true;
		this.logger.log("plugin disabled; no saving and deleting");
	}
}

// TODO: may we have modularized plugin config options in the boot kernel?
// The file system folder immediately below the <wiki>/tiddlers root used
// to store system tiddlers that have titles starting with "$:/". Default
// is "system" (please note: no trailing separator slash!).
HierarchicalFileSystemAdaptor.prototype.SYSTEM_FOLDER = "system"; //FIXME
// The draft folder immediately below the <wiki>/tiddlers root used
// to store system tiddlers that have their draft.of field set. Default
// is "drafts" (please note: no trailing separator slash!).
HierarchicalFileSystemAdaptor.prototype.DRAFT_FOLDER = "drafts"; //FIXME

HierarchicalFileSystemAdaptor.prototype.getTiddlerInfo = function(tiddler) {
	return {};
};

// Nota Bene: this needs to mirror the file extension information as established
// in function $tw.boot.startup (boot.js). Otherwise, the sync adaptor will use
// another encoding than expected by the boot process.
$tw.config.typeInfo = {
	"text/vnd.tiddlywiki": {
		fileType: "application/x-tiddler",
		extension: ".tid"
	},
	"image/jpeg" : {
		hasMetaFile: true,
		encoding: "base64"
	},
	"image/png" : {
		hasMetaFile: true,
		encoding: "base64"
	}
};

$tw.config.typeTemplates = {
	"application/x-tiddler": "$:/core/templates/tid-tiddler"
};

HierarchicalFileSystemAdaptor.prototype.getTiddlerFileInfo = function(tiddler,callback) {
	// See if we've already got information about this file
	var self = this,
		title = tiddler.fields.title,
		fileInfo = $tw.boot.files[title],
		draftOf = tiddler.fields["draft.of"];
	// Get information about how to save tiddlers of this type
	var type = tiddler.fields.type || "text/vnd.tiddlywiki",
		typeInfo = $tw.config.typeInfo[type];
	if(!typeInfo) {
		typeInfo = $tw.config.typeInfo["text/vnd.tiddlywiki"];
	}
	var extension = typeInfo.extension || "";
	if(!fileInfo) {
		// If not, we'll need to generate it
		var paf = self.generateTiddlerPathAndFilename(tiddler, title, draftOf);
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
}

HierarchicalFileSystemAdaptor.prototype.leafFromTitle = function(title) {
	var lastSlash = title.lastIndexOf("/");
	if (lastSlash<0) {
		return title;
	} else {
		return title.substr(lastSlash+1);
	}
}

HierarchicalFileSystemAdaptor.prototype.generateTiddlerPathAndFilename = function(tiddler, title, draftOf) {
	var options = {
		draft: !!draftOf,
		subfolder: "",
		name: title,
		tiddler: tiddler
	};
	
	for (var i=0; i<this.folderUsherNames.length; ++i) {
		if (this.folderUshers[this.folderUsherNames[i]].call(this, title, options)) {
			this.logger.log("usher hit: "+this.folderUsherNames[i]);
			break;
		}
		this.logger.log("usher miss: "+this.folderUsherNames[i]);
	}
	
	// Sanitize the filename as well as the subfolder name(s)...
	// This more or less comes down to removing those characters that are illegal in
	// Windows file names. Oh, and we also hammer out any hierarchy slashes inside
	// the filename, thereby flattening it.
	options.name = options.name.replace(/\<|\>|\:|\"|\/|\\|\||\?|\*|\^/g,"_");
	// For the subfolder path we are converting hierarchy slashes into the proper
	// platform-specific separators.
	options.subfolder = options.subfolder.replace(/\<|\>|\:|\"|\\|\||\?|\*|\^/g,"_").replace(/\//g, path.sep);
	
	this.logger.log("subfolder: " + options.subfolder);
	this.logger.log("name: " + options.name);
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
	if(this.config.disabled) {
		this.logger.log("saving disabled");
		return callback(null, {}, 0);
	}
	
	var self = this;
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
			var typeInfo = $tw.config.typeInfo[fileInfo.type],
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
					callback(null);
				});
			} else {
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
