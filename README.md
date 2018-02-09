# ThirdFlow Plugin Development Support Plugin

![Third Flow emblem](third-flow.png)

The Third Flow plugin brings to you another way to develop customizations for TiddlyWiki 5. It is not enforcing
a specific development flow, it simply tries to help you. Otherwise, it tries to stay out of your way.

* You can **develop your plugin directly from within your browser**. A server-based
TiddlyWiki instance running on Node.js ensures that all your source tiddlers are neatly stored in a clean and
hierarchically organized folder structure.

* **Source code management is done as usual** using your favorite source code management tool, such as git and others.
As the Third Flow plugin structures your tiddler source files you get a well-organized repository structure at
no price.

* For **packaging your plugin** you finally simply run a shell script which packs the plugin tiddler and saves it
to disk. Additionally, a demonstration TiddlyWiki is also created that guides your future plugin users through
the process of deploying your new plugin.

Of course, the Third Flow has been developed using the same process it supports. We actually eat our own dog food.

## In Simple Pictures

From the «a single figure lies more than a thousands words» department...

### Development Phase

<img src="art/ThirdFlow%20Architecture%20Development%20Phase.jpg" width="40%" align="right">

(1) Development:
   * You simply develop your plugin in the well-known TiddlyWiki 5 environment.
     * Edit the tiddlers belonging to your plugin directly inside a TiddlyWiki, and get live, immediate feedback...
     * ...inside a standard TiddlyWiki 5...
     * ...inside a standard HMTL5 web browser. Turtles, anyone?
   * Your TiddlyWiki synchronizes with a computer-local TiddlyWiki 5 server, running on top of Node.js. This TiddlyWiki server is running in (interactive) "development" mode.
     * Inside this server is a special sync plugin HierarchicalFilesystemAdaptor that...
     * ...stores your tiddlers persistently inside a hierarchical folder structure on your disk.

(2) Source Code Control:
   * Use your favorite source code control system (and cloud service) to manage your plugin tiddlers conveniently. For example, git and GitHub.

### Release Phase

<img src="art/ThirdFlow%20Architecture%20Release%20Phase.jpg" width="52%" align="right">

(3) Release:
   * You can easily release your plugin as a single plugin .tid file for easy import, and you can also release it as part of a demonstration TiddlyWiki, too.
     * The export runs as a TiddlyWiki server command...
     * ...inside a Node.js environment.
   * Your plugin tiddlers get loaded as usual from the file system. This time it's all in read-only mode, because we don't want to change tiddlers. We only want to export.
   * Plugin export is controlled using a templated tiddler renderer.
   * Demo TiddlyWiki export is done using a special save template.

## In-TW Development Aid

### Plugin Sources View

<img src="art/ThirdFlow%20Plugin%20Sources%20View.jpg" width="40%" align="right" style="clear:both;">

While working on the source tiddlers of a plugin from within a web browser, the
ThirdFlow plugin lends you a helping hand.

For instance, there's a new tab called "Plugin Sources". It lives inside the
sidebar's "More" tab, and it shows you all your plugin source tiddlers neatly
listed in order. But more importantly, this additional view is much more
concise than the existing "System" and "Shadows" views. The latters are fine
when you need to see _everything_. But they are unwieldy while focusing on your
_own_ plugin(s)s. That's exactly what the additional "Plugin Sources" view is
about.

### Creating New Plugins

Creating a new plugin is now also now easier than before. Simply go to the
"Plugin Sources" tab in the sidebar. Then click on "+ new plugin", which you'll
find right at the top of the view.

<img src="art/ThirdFlow%20Create%20New%20Plugin.jpg" width="25%">

With the new plugin tiddler being shown for editing, simply fill in the fields.
Make sure to replace _PublisherName_ and _PluginName_ with something more
sensible. You should notice how the Plugin Meta Data fields update accordingly.

<img src="art/ThirdFlow%20Editing%20Plugin%20Metadata.jpg" width="60%">

And then you're done. Well, for the plugin itself. Now you can start populating
your new plugin with cool new tiddlers.


## Installation

```
git clone https://github.com/TheDiveO/ThirdFlow.git
cd ThirdFlow
npm install tiddlywiki
```

Then make sure, that your PATH variable is set to find the tiddlywiki binary at: `./node_modules/.bin` or you can install TW globally with:  `npm install -g tiddlywiki`

For Windows users the PATH variable is well hidden, so just [ask the search engine :)](https://www.google.at/search?q=How+to+set+the+path+and+environment+variables+in+Windows)

## Creating Your New Plugin

Simply copy the contents inside the `skeleton` folder to a new folder. Then start the develop phase as described next and edit and rename the plugin tiddlers as suitable for your new plugin creation. After that, simply enter the release phase. These two phases are described next. And if you need to see a full blown life demonstration then simply look at the *Third Flow* plugin itself. Enjoy!

## Starting the Server

```
develop [[username] [password]] [IP]
```

and open [localhost:8080](http://localhost:8080)

## Creating the Release Files

```
release
```

The release files will be created in the `editons/release` folder.

## License

The Third Flow plugin is covered by the following licenses:

* The **Third Flow plugin** is licensed under the [MIT license](http://opensource.org/licenses/MIT).

* The **hierarchical file system adapter** is licensed under the
[TiddlyWiki 5 license](https://raw.githubusercontent.com/Jermolene/TiddlyWiki5/master/licenses/copyright.md)
(links to GitHub TW5 repository). It bases on filesystemadaptor.js and brings in storing tiddlers into hierarchical
folder structures according to their titles.

* **Other content** of this TiddlyWiki which is not part of the plugin or TiddlyWiki 5 is covered by the
[CC BY 3.0](http://creativecommons.org/licenses/by/3.0/) license.

## Author

[TheDiveO on GitHub](https://github.com/TheDiveO)
