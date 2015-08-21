/**
 Copyright 2007-2015, The JSVM Project.
 All rights reserved.

 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("org.jsvm");

/**
 * Attention:
 * According to the implementation of the "_onmessage()" function 
 * in System.js, the application can't listen messages from the 
 * current application itself.
 */
org.jsvm.Application = function(def, Runtime, entryId){

	var CLASS = org.jsvm.Application, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
        this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, 
	    System = J$VM.System, MQ = J$VM.MQ, Service;

	/**
	 * Startup the current application to prepare context and start listening
	 * the cross-window message.
	 */
	thi$.startApp = function(doLoadedNotify){
        arguments.callee.__super__.apply(this, arguments);
        		
	}.$override(this.startApp);

	/**
	 * Close down current application to clean the context env.
	 */ 
	thi$.closeApp = function(){

        arguments.callee.__super__.apply(this, arguments);
        
	}.$override(this.closeApp);


	/**
	 * Application doAction entry
	 */
	thi$.doAction = function(func, params, module, callback) {
        params = params || {};
        params["j$vm_app"] = this.getAppID();

        if(!Class.isFunction(callback)){
            var fn = this["on"+func];
            if(Class.isFunction(fn)){
                callback = fn.$bind(this);
            }
        }
        
        Service.doAction(func, params, module, callback);
	};

	/**
	 * Application doSyncAction entry
	 */
	thi$.doSyncAction = function(func, params, module) {
        params = params || {};
        params["j$vm_app"] = this.getAppID();

        return Service.doSyncAction(func, params, module);
	};
	
	/**
	 * Returns a new Action object
	 */
	thi$.getAction = function(module, action){
        return Service.getAction(module, action);
	};
	

    thi$._init = function(def, Runtime, entryId){
        if(def == undefined) return;

        arguments.callee.__super__.apply(this, arguments);

        Service = Runtime.getService();
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Application);


