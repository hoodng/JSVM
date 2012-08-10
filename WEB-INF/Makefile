PRJ_PATH=.

JAVAC = javac
JAR = jar
JAVASRC_PATH=${PRJ_PATH}/src
JAVADES_PATH=${PRJ_PATH}/classes
JAVAJAR_PATH=${PRJ_PATH}/lib/js.jar
JAVA_OPTIONS=-encoding UTF-8
JVM=1.6
MAKETOOLS=$(JAR) -cf ${PRJ_PATH}/../jsvm/bin/tools.jar -C $(JAVADES_PATH)/ .

build: source
	$(JAVAC) $(JAVA_OPTIONS) -classpath $(JAVAJAR_PATH):$(JAVADES_PATH):$(JAVASRC_PATH): \
	-d $(JAVADES_PATH) @$(PRJ_PATH)/source.list -target $(JVM) -source $(JVM)
	rm -f $(PRJ_PATH)/source.list

source:
	find $(JAVASRC_PATH) -name *.java >$(PRJ_PATH)/source.list

clean:
	rm -rf $(JAVADES_PATH)/*

