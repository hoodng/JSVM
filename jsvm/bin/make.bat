set CMD=java -cp js.jar;tools.jar org.jsvm.javascript.Compiler

%CMD% -pack pkg.lst -verbose
%CMD% -O 9 -s ../src -d ../classes -gzip
%CMD% -O 9 -s ../lib -d ../lib -gzip
%CMD% -pkg ../ -gzip -verbose

