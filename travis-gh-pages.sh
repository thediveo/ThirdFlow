#!/bin/bash
git clone --branch gh-pages --single-branch --depth 1 https://github.com/$TRAVIS_REPO_SLUG gh-pages
cp $OUTPUT_DIR/thirdflow.html $GH_PAGES_OUTPUT_DIR
cp $OUTPUT_DIR/thirdflow.tid $GH_PAGES_OUTPUT_DIR
