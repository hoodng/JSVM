/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * @File: ActionConnection.js
 * @Create: 2013/12/23
 * @Author: dong.hu@china.jinfonet.com
 */

$package("com.jinfonet");

$import("com.jinfonet.BlockingAction");

/**
 * 
 */
com.jinfonet.ActionConnection = function(isAsync){
    
    var CLASS = com.jinfonet.ActionConnection,
        thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System, 
        Event = js.util.Event, AQ = com.jinfonet.BlockingAction,
        Base64 = Class.forName("js.util.Base64");

    thi$.isAsync = function(){
        return this.xhr.isAsync();
    };

    thi$.setAsync = function(isAsync){
        this.xhr.setAsync(isAsync);
    };

    thi$.isNoCache = function(){
        return this.xhr.isNoCache();
    };

    thi$.setNoCache = function(isNoCache){
        this.xhr.setNoCache(isNoCache);
    };

    thi$.setRequestHeader = function(key, value){
        this.xhr.setRequestHeader(key, value);
    };

    thi$.getTimeout = function(){
        return this.xhr.getTimeout();
    };

    thi$.setTimeout = function(v){
        this.xhr.setTimeout(v);
    };

    thi$.contentType = function(){
        return this.xhr.contentType();
    };

    thi$.getResponseHeader = function(key){
        return this.xhr.getResponseHeader(key);
    };

    thi$.getAllResponseHeaders = function(){
        return this.xhr.getAllResponseHeaders();
    };

    thi$.response = function(){
        return this.xhr.response();
    };

    thi$.responseText = function(){
        return this.xhr.responseText();
    };

    thi$.responseXML = function(){
        return this.xhr.responseXML();
    };

    thi$.responseJSON = function(){
        return this.xhr.responseJSON();
    };

    thi$.status = function(){
        return this.xhr.status();
    };

    thi$.statusText = function(){
        return this.xhr.statusText();
    };
    
    thi$.readyState = function(){
        return this.xhr.readyState();
    };

    var _successhandler = function(e, url, params){
        var res = this.responseJSON();
        if(res.err == 0 && res.ticket != undefined){
            AQ.post(res.ticket,
                    {entry:url, 
                     params:params,
                     handler:this.onsuccess, 
                     uuid:this.uuid()});
            this.close();
        }else{
            this.onsuccess(
                new Event(Event.SYS_EVT_SUCCESS, this, this));
        }
    };

    thi$.open = function(method, url, params, withOutCookie){
        params = params || {};

        if(params.jrd_input){
            params.jrd_input = Base64.encode(params.jrd_input);
        }else{
            var p, v, p2={};
            for(p in params){
                if("jrd_action" != p && "j$vm_pid" != p){
                    v = params[p];
                    p2[p] = (Class.isObject(v) || 
                             Class.isArray(v) || 
                             !Class.isValid(v)) ? v : v + "";
                    delete params[p];
                }
            } 
            params["jrd_B64Pack"] = Base64.encode(JSON.stringify(p2));
        }

        if(!this.isAsync()){
            params.jrd_sync = true;
        }
        
        params.j$vmAction = true;

        if((url.lastIndexOf("action.do") != -1) &&
           params.jrd_input){
            url = params.j$vm_pid+".vt";
        }

        if(typeof this.onsuccess == "function"){
            this.xhr.onsuccess = _successhandler.$bind(this, url, params);
        }
        
        if(typeof this.onhttperr == "function"){
            this.xhr.onhttperr = this.onhttperr;
        }

        if(typeof this.ontimeout == "function"){
            this.xhr.ontimeout = this.ontimeout;
        }

        this.xhr.open(method, url, params, withOutCookie);
    };

    thi$.close = function(){
        if(this.xhr){
            this.xhr.close();
            delete this.xhr;
        }
    };
    
    thi$._init = function(isAsync){
        this.xhr = J$VM.XHRPool.getXHR(isAsync);
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.util.EventTarget);
