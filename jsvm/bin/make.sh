#!/bin/sh
$JAVA_HOME/bin/java  -cp js.jar:tools.jar Compiler -gzip -O 9 -s ../src -d ../classes -pack pkg.lst
