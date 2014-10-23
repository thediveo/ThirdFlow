@echo off
rem release.cmd
rem
rem generates release files:
rem   editions\release\output\thirdflow.html -- the plugin demo wiki
rem   editions\release\output\thirdflow.tid -- the plugin tiddler
rem
call tiddlywiki ^
	editions\release ^
	--verbose ^
	--build release ^
	|| exit 1
