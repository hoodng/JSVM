/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * @File: Application.js
 * @Create: 2014/01/20
 * @Author: dong.hu@china.jinfonet.com
 */

$package("com.jinfonet");

$import("com.jinfonet.Action");
$import("com.jinfonet.HeartBeat");

/**
 * Attention:
 * According to the implementation of the "_onmessage()" function 
 * in System.js, the application can't listen messages from the 
 * current application itself.
 */
com.jinfonet.ServiceProxy = function(def, Runtime){
	var CLASS = com.jinfonet.ServiceProxy, thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
        this._init.apply(this, arguments);        
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, 
	    System = J$VM.System, MQ = J$VM.MQ;

	/**
	 * Returns a new Action object
	 */
	thi$.getAction = function(module, action){
        module = module || "webos";
        action = action.endsWith("Action") ? action : action+"Action";

		return new (Class.forName("com.jinfonet.Action"))(
			this.postEntry(), module, action);
	};

	/**
	 * Runtime doSyncAction entry
	 */
	thi$.doSyncAction = function(func, params, module) {
		var action = this.getAction(module, func), http, ret;
		http = action.doSyncAction(params);
		ret = http.responseJSON();
		http.close();
		return ret;
	};

	var _browserInfo = function(){
		this.doSyncAction(
            "ClientInfoAction",
			{jrd_objdef:{
				platform: navigator.platform,
				userAgent: navigator.userAgent,
				logicalXDPI: J$VM.supports.logicalXDPI,
				logicalYDPI: J$VM.supports.logicalYDPI 
			}},
			"webos");
	};

	/**
	 * Runtime doAction entry
	 */
	thi$.doAction = function(func, params, module, callback) {
		var Rt = this.Runtime(), actionName = func + "Action",
		action = this.getAction(module, actionName),
		funcName = "on" + func, result, fn, rstFlag;

		System.log.println("Do action " + actionName + " with " + JSON.stringify(params));		  

		action.doAction(
			params, 
			this, 
			function(http){
				// success
				result = http.responseJSON();
				if(result.err == 0) {
					rstFlag = CLASS.ACTION_RST_FLAG_SUCCESS;					   

					if(typeof callback == "function"){
						(function(v){
							 callback(v);
						 }).$delay(this, 1, result.obj || {});
					}else{
						fn = this[funcName];
						if(typeof fn === "function") {
							fn.$delay(this, 0, result.obj);
						}
					}
				}else {
					rstFlag = CLASS.ACTION_RST_FLAG_ERROR;
					Rt.message("error", result.err, result.msg);
				}
				http.close();
				
				// Do something others, e.g. to hide loading
				this.doAfterAction(actionName, rstFlag);

			}, function(http){
				// HTTP error
				if(http.status()<100||http.status()>=600){
					Rt.message("warn", "HTTP " + http.status(),
							   Rt.nlsText("httpAccessDeny", 
										  "The required server resources cannot be accessed."));
				}else{
					Rt.message("warn", "HTTP " + http.status(), http.statusText());
				}
				http.close();
				
				// Do something others, e.g. to hide loading
				this.doAfterAction(actionName, CLASS.ACTION_RST_FLAG_HTTPERROR);				 

			}, function(http){
				// timeout
				Rt.message("warn", Rt.nlsText("httpTimeout", "HTTP timeout"), "");
				http.close();
				
				// Do something others, e.g. to hide loading
				this.doAfterAction(actionName, CLASS.ACTION_RST_FLAG_HTTPTIMEOUT);				   
			});
	};

    var _onheartbeat = function(e){
        // TODO: 
        System.out.println(e);
    };


    thi$.destroy = function(){
        this.heartbeat.stop();
        this.heartbeat = null;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        def = def || {}
        
        arguments.callee.__super__.apply(this, arguments);

        // Report browser infomation
        _browserInfo.call(this);
        
        (Class.forName("com.jinfonet.HeartBeat")).call(this, Runtime);
        System.out.println("Heartbeat established.");

        J$VM.MQ.register(this.MSG_HEARTBEAT, this, _onheartbeat);        

    }.$override(this._init);

	this._init.apply(this, arguments);
    
}.$extend(js.lang.Service);



