#!/bin/sh
$JAVA_HOME/bin/java  -cp js.jar:tools.jar Compiler -O 9 -s ../src -d ../classes -pack pkg.lst
echo "Copy jsre-ui.js"
cp ../lib/jsre-ui.js ../
