/**
 * Copyright (c) Jinfonet Inc. 2000-2011, All rights reserved.
 * 
 * @File: Action.js
 * @Create: Mar 29, 2011
 */

$package("com.jinfonet");

$import("com.jinfonet.ActionConnection");

com.jinfonet.Action = function(entry, module, action){
	
	var CLASS = com.jinfonet.Action, thi$ = CLASS.prototype;
	if(CLASS.__defined){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined = true;

	var _encodeParams = function(params){
		var p = J$VM.System.arrayCopy(
			this.params, 0, [], 0, this.params.length, true),s;
		p.push(params); s = JSON.stringify(p);
		return s;
	};

	thi$._send = function(http, params, withOutCookie){
		http.open("POST", 
				  this.entry,
				  {jrd_input:_encodeParams.call(this, params)}, 
				  withOutCookie);
		return http;
	};

	var _actionhandle = function(e, fn){
		fn.call(this, e.getData());
	};

	thi$.doAction = function(params, thisObj, success, error, timeout, withOutCookie){
		var http = new com.jinfonet.ActionConnection(true);

		if(typeof success == "function"){
			http.onsuccess = _actionhandle.$bind(thisObj, success);
		}
		if(typeof error == "function"){
			http.onhttperr = _actionhandle.$bind(thisObj, error);
		}
		if(typeof timeout == "function"){
			http.ontimeout = _actionhandle.$bind(thisObj, timeout);
		}
		
		return this._send(http, params, withOutCookie);
	};

	thi$.doSyncAction = function(params, withOutCookie){
		var http =	new com.jinfonet.ActionConnection(false);
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

};
