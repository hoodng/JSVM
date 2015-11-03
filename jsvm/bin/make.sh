#!/bin/sh

CMD="$JAVA_HOME/bin/java -cp js.jar:tools.jar org.jsvm.javascript.Compiler"

$CMD -pack pkg.lst -verbose
$CMD -O 9 -s ../src -d ../classes -gzip
$CMD -O -1 -s ../lib -d ../lib -gzip
$CMD -pkg ../ -gzip -verbose

