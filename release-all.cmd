@echo off
rem release-all.cmd
rem
rem runs a release phase and then copies the files to be released
rem over into associated places.
rem
call tiddlywiki ^
	editions/release ^
	--verbose ^
	--build release ^
    || exit 1
echo Copying files: plugin into skeleton
copy editions\release\output\thirdflow.tid skeleton\src\tiddlers\system\plugins\TheDiveO
if exist ..\ThirdFlow.github.io\index.html (
    echo Copying files: updating micro web site release files
    copy editions\release\output\thirdflow.* ..\ThirdFlow.github.io\output
)
if exist ..\TW5FontAwesome\README.md (
    echo Copying files: updating FontAwesome with plugin
    copy editions\release\output\thirdflow.tid ..\TW5FontAwesome\src\tiddlers\system\plugins\TheDiveO
)
if exist ..\IETF-RFC\README.md (
    echo Copying files: updating IETF-RFC with plugin
    copy editions\release\output\thirdflow.tid ..\IETF-RFC\src\tiddlers\system\plugins\TheDiveO
)