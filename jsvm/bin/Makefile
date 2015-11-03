
CMD = java -cp js.jar:tools.jar org.jsvm.javascript.Compiler

package: pack compile
	$(CMD) -pkg ../ -gzip -verbose
	 
pack:
	$(CMD) -pack pkg.lst -verbose
    
compile:
	$(CMD) -O 9 -s ../src -d ../classes -gzip
	$(CMD) -O -1 -s ../lib -d ../lib -gzip
