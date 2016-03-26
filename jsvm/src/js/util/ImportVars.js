$package("js.util");
js.util.ImportVars=function(){
	var Class=js.lang.Class,NS=arguments.callee;if(NS.__defined__){if(this instanceof NS){
	this.initialize.apply(this,arguments);}else{if(NS.$){return NS.$.apply(this,arguments);}
	else{throw new Error();}}return;}NS["#"]="js.util.ImportVars";NS.__defined__=true;
	////------CLASS Definition BEGIN---------------------------
	var Import=Class.forName("jrs.script.Import");
	
	var excludeKey=function(key){
		return key.indexOf("$")==0||key.indexOf("_")==0||key.indexOf("#")==0||key.indexOf(".")==0;
	};
	
	var re=/(^.*)\.(\w+|\*)$/;

	NS.$=function(oClassName){
		switch(typeof oClassName){
			case "string":
				var className=oClassName;
				if("*"==className.replace(re,"$2")){
					className=className.replace(re,"$1");
				}
				Class.forName(className);
			break;
		}
		return Import.Vars(oClassName,excludeKey);
	};

	////------CLASS Definition END---------------------------
	return NS;
}();



