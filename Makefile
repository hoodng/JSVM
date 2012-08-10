
MAKE = make

PRJ_PATH=.
JAR = jar

war: build jsvm
	$(JAR) -cf webos.war Makefile WEB-INF/ app/test/*.html jsvm/ styles/

build:
	cd WEB-INF && $(MAKE) build

jsvm:
	cd jsvm/bin && $(MAKE) pack

