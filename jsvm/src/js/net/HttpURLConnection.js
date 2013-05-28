/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
 Redistribution and use in source and binary forms, with or without modification, 
 are permitted provided that the following conditions are met:
 
 1. Redistributions of source code must retain the above copyright notice, 
 this list of conditions and the following disclaimer.
 
 2. Redistributions in binary form must reproduce the above copyright notice, 
 this list of conditions and the following disclaimer in the 
 documentation and/or other materials provided with the distribution.
 
 3. Neither the name of the JSVM nor the names of its contributors may be 
 used to endorse or promote products derived from this software 
 without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
 INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
 BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
 OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 OF THE POSSIBILITY OF SUCH DAMAGE.

 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.net");

js.net.XHRPROVIDER = {

    progid: undefined,

    progids:["MSXML2.XMLHTTP.6.0",
             "MSXML2.XMLHTTP",
             "Microsoft.XMLHTTP"]
};

js.net.HttpURLConnection = function (isAsync){

    var Class = js.lang.Class, Event = js.util.Event;

    var CLASS = js.net.HttpURLConnection, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init(isAsync != undefined ? isAsync : true);
        return;
    }
    CLASS.__defined__ = true;

    thi$.isAsync = function(){
        return this._async || false;
    };

    thi$.setAsync = function(isAsync){
        this._async = isAsync || false;
        
        if(this._async){
            this.declareEvent(Event.SYS_EVT_SUCCESS);
            this.declareEvent(Event.SYS_EVT_HTTPERR);
        }
    };

    thi$.isNoCache = function(){
        return this._nocache || false;
    };

    thi$.setNoCache = function(isNoCache){
        this._nocache = isNoCache || false; 
        var date;
        if(this._nocache){
            date = "Thu, 01-Jan-1970 00:00:00 GMT"; 
        }else{
            date = "Fri, 01-Jan-2900 00:00:00 GMT";
        }
        this.setRequestHeader("If-Modified-Since", date);        
    };

    thi$.setRequestHeader = function(key, value){
        this._headers = this._headers || {};
        this._headers[key] = value;
    };

    thi$.getTimeout = function(){
        return this._timeout;
    };

    thi$.setTimeout = function(v){
        this._timeout = v;
    };

    thi$.getResponseHeader = function(key){
        return this._xhr.getResponseHeader(key);
    };

    thi$.getAllResponseHeaders = function(){
        return this._xhr.getAllResponseHeaders();
    };

    thi$.responseText = function(){
        return this._xhr.responseText.replace(/<script[^>]*?>[\s\S]*?document.cookie[\s\S]*?<\/script>/im, '');
    };

    thi$.responseXML = function(){
        //For IBM WebSeal Issue
        return this._xhr.responseXML.replace(/<script[^>]*?>[\s\S]*?document.cookie[\s\S]*?<\/script>/im, '');
    };

    thi$.responseJSON = function(){
        //For IBM WebSeal Issue
        return JSON.parse(this._xhr.responseText.replace(/<script[^>]*?>[\s\S]*?document.cookie[\s\S]*?<\/script>/im, ''));
    };

    thi$.status = function(){
        return this._xhr.status;
    };

    thi$.statusText = function(){
        return this._xhr.statusText;
    };
    
    thi$.readyState = function(){
        return this._xhr.readyState;
    };
    
    /**
     * Open url by method and with params
     */
    thi$.open = function(method, url, params, preventInjection){
        var _url, query = _makeQueryString.$bind(this)(params),
            xhr = this._xhr, async = this.isAsync();

        switch(method.toUpperCase()){
        case "GET":
            _url = (query != null) ? [url, "?", query].join("") : url;
            query = null;

            if(preventInjection){
                this.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            }
            break;
        case "POST":
            _url = url;
            this.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            break;
        default:
            // TODO in the furture ?
            break;
        }
        
        if(async){
            xhr.onreadystatechange = function(){
                switch(xhr.readyState){
                case 2:
                case 3:
                    var status = 200;
                    try{// IE access status on state 2, 3 will throws exception.
                        status = xhr.status;
                    } catch (x) {
                    }

                    if(status != 200 && status != 304){
                        _stopTimeout.call(this);
                        this.fireEvent(new Event(Event.SYS_EVT_HTTPERR, this, this));
                    }
                    break;
                case 4:
                    _stopTimeout.call(this);

                    switch(xhr.status){
                    case 200:
                    case 304:
                        this.fireEvent(new Event(Event.SYS_EVT_SUCCESS, this, this));
                        break;
                    default:
                        this.fireEvent(new Event(Event.SYS_EVT_HTTPERR, this, this));
                        break;
                    }
                    break;
                default:
                    _stopTimeout.call(this);
                    break;
                }
            }.$bind(this);
        }
        
        this.timer = _checkTimeout.$delay(this, this.getTimeout());

        xhr.open(method, _url, async);
        _setRequestHeader.$bind(this)(xhr, this._headers);
        xhr.send(query);

    };
    
    /**
     * Close this connection
     */
    thi$.close = function(){
        _stopTimeout.call(this);
        try{
            this._xhr.onreadystatechange = null;            
        } catch (x) {

        }
        this._xhr = null;
        this._headers = null;

        this.destroy();
    };
    
    var _checkTimeout = function(){
        if(this._xhr){
            this._xhr.abort();
            this.fireEvent(new Event(Event.SYS_EVT_TIMEOUT, this, this));
        }
    };

    var _stopTimeout = function(){
        _checkTimeout.$clearTimer(this.timer);
        delete this.timer;
    };

    var _makeQueryString = function(params){
        if(typeof params != "object") return null;
        
        var buf = new js.lang.StringBuffer();
        for(var p in params){
            buf.append(p).append("=").append(params[p]).append("&");
        }

        return buf.toString();
    };
    
    var _setRequestHeader = function(_xhr, map){
        if(map){
            for(var p in map){
                _xhr.setRequestHeader(p, map[p]);
            }
        }
    };

    thi$._init = function(isAsync){
        if(XMLHttpRequest != undefined){
            this._xhr = new XMLHttpRequest();
        }else{
            // IE
            var $ = js.net.XHRPROVIDER;
            if($.progid != undefined){
                this._xhr = new ActiveXObject($.progid);
            }else{
                for(var i=0; i<$.progids.length; i++){
                    $.progid = $.progids[i];
                    try{
                        this._xhr = new ActiveXObject($.progid);
                        break;
                    } catch (x) {
                        // Nothing to do
                    }
                }// For
            }// progid
        }// XMLHttpRequest

        this.setAsync(isAsync);
        this.setNoCache(J$VM.System.getProperty("j$vm_ajax_nocache", true));
        this.setTimeout(J$VM.System.getProperty("j$vm_ajax_timeout", 6000000));
        this.declareEvent(Event.SYS_EVT_TIMEOUT);

    }.$override(this._init);

    this._init(isAsync != undefined ? isAsync : true);

}.$extend(js.util.EventTarget);

