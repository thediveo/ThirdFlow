@echo off
rem release-all.cmd
rem
rem runs a release phase and then copies the files to be released
rem over into associated places.
rem
tiddlywiki ^
	editions/release ^
	--verbose ^
	--build release ^
	|| exit 1
copy editions\release\output\thirdflow.tid skeleton\src\tiddlers\system\plugins\TheDiveO
copy editions\release\output\thirdflow.* ..\ThirdFlow.github.io\output
