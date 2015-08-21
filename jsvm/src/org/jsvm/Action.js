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

$import("org.jsvm.ActionConnection");

org.jsvm.Action = function(entry, module, action){
	
	var CLASS = org.jsvm.Action, thi$ = CLASS.prototype;
	if(CLASS.__defined){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined = true;

    var Class = js.lang.Class, System = J$VM.System,
        ActionConnection = Class.forName("org.jsvm.ActionConnection");

	var _encodeParams = function(params){
		var p = System.arrayCopy(
			this.params, 0, [], 0, this.params.length, true),s;
		p.push(params); s = JSON.stringify(p);
		return s;
	};

	thi$._send = function(http, params, withOutCookie){
		http.open("POST", 
			[this.entry, "?__acid__=", this.uuid()].join(""),
			{$:_encodeParams.call(this, params)}, 
			withOutCookie);
		return http;
	};

	var _handler = function(e, fn){
		fn.call(this, e.getData());
	};

	thi$.doAction = function(params, thisObj,
        success, error, timeout, withOutCookie){
		var http = new (ActionConnection)(true);

		if(Class.isFunction(success)){
			http.onsuccess = _handler.$bind(thisObj, success);
		}
        
		if(Class.isFunction(error)){
			http.onhttperr = _handler.$bind(thisObj, error);
		}
        
		if(Class.isFunction(timeout)){
			http.ontimeout = _handler.$bind(thisObj, timeout);
		}
		
		return this._send(http, params, withOutCookie);
	};

	thi$.doSyncAction = function(params, withOutCookie){
		var http =	new (ActionConnection)(false);
		return this._send(http, params, withOutCookie);
	};

	thi$._init = function(entry, module, action){
		if(entry == undefined) return;

		this.entry = entry;
        this.module = module;        
        this.action = action;

		this.params = [module, action];
	};

	this._init.apply(this, arguments);

}.$extend(js.lang.Object);


