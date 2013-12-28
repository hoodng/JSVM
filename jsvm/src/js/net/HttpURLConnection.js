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
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.net");

js.net.XHRPROVIDER = {

    progid: undefined,

    progids:["MSXML2.XMLHTTP.6.0",
             "MSXML2.XMLHTTP",
             "Microsoft.XMLHTTP"]
};

js.net.XHRPool = new function(){

    J$VM.XHRPool = this;
    this.pool = [];
    
    var Q = [], running = false;

    this.getXHR = function(isAsync){
        var xhr, i, len, pool = this.pool, 
            max = J$VM.System.getProperty("j$vm_ajax_concurrent", 4);

        for(i=0, len=pool.length; i<len; i++){
            xhr = pool[i];
            if(!xhr.isOccupy()){
                break;
            }else{
                xhr = undefined;
            }
        }
        
        if(!xhr){
            // Can not found available xhr, then create a new instance.
            if(!isAsync || max < 0 || this.pool.length < max){
                xhr = new js.net.HttpURLConnection(isAsync);
                pool.push(xhr);
            }else{
                xhr = new js.net.HttpURLConnection(isAsync, true);
            }
        }
        
        xhr.setAsync(isAsync);
        xhr.occupy();

        return xhr;
    };

    this.post = function(req){
        Q.push(req);
        if(!running){
            _schedule(0);
        }
    };

    var _schedule = function(delay){
        if(Q.length == 0){
            running = false;
        }else{
            running = true;
            _dispatch.$delay(this, delay);
        }
    }.$bind(this);

    var _dispatch = function(){
        var xhr = this.getXHR(true), req, data;
        if(xhr.isBlocking()){
            _schedule(100);
            return;
        }

        req = Q.shift();
        req._xhr = xhr._xhr;
        req._blocking = false;
        req.xhr = xhr;
        data = req.data;
        req.open(data.method, data.url, data.params);
        _schedule(100);

    }.$bind(this);

    var _init = function(){
        _schedule(0);
    }.call(this);

}();

js.net.HttpURLConnection = function (isAsync, blocking){

    var CLASS = js.net.HttpURLConnection, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init(isAsync, blocking);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, 
        PV = js.net.XHRPROVIDER;

    thi$.isAsync = function(){
        return this._async || false;
    };

    thi$.setAsync = function(isAsync){
        this._async = isAsync || false;
        
        if(this._async){
            this.declareEvent(Event.SYS_EVT_SUCCESS);
            this.declareEvent(Event.SYS_EVT_HTTPERR);
        }else{
            delete this["on"+Event.SYS_EVT_SUCCESS];
            delete this["on"+Event.SYS_EVT_HTTPERR];
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

    thi$.isBlocking = function(){
        return this._blocking === true;
    };

    thi$.isOccupy = function(){
        return this._occupy || false;
    };

    thi$.occupy = function(){
        this._usecount ++;
        this._occupy = true;
    };

    thi$.getResponseHeader = function(key){
        return this._xhr.getResponseHeader(key);
    };

    thi$.getAllResponseHeaders = function(){
        return this._xhr.getAllResponseHeaders();
    };

    thi$.responseText = function(){
        return this._xhr.responseText;
    };

    thi$.responseXML = function(){
        return this._xhr.responseXML;
    };

    thi$.responseJSON = function(){
        return JSON.parse(this.responseText());
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
    thi$.open = function(method, url, params){

        if(this.isBlocking()){
            this.data = {
                method: method,
                url: url,
                params: params
            };
            J$VM.XHRPool.post(this);
            return;
        }

        var _url, query = _makeQueryString.call(this, params),
            xhr = this._xhr, async = this.isAsync();

        switch(method.toUpperCase()){
        case "GET":
            _url = (query != null) ? [url, "?", query].join("") : url;
            query = null;
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
                if(xhr.isTimeout) return;

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
        _setRequestHeader.call(this, xhr, this._headers);
        xhr.send(query);

    };
    
    /**
     * Close this connection
     */
    thi$.close = function(){
        _stopTimeout.call(this);
        var xhr = this._xhr;

        try{
            xhr.onreadystatechange = null;
            xhr.response = null;
            xhr.responseText = null;
            xhr.responseXML = null;
        } catch (x) {
        }

        this["on"+Event.SYS_EVT_SUCCESS] = null;
        this["on"+Event.SYS_EVT_HTTPERR] = null;
        this["on"+Event.SYS_EVT_TIMEOUT] = null;
        this._headers = {};
        this._occupy = false;

        if(this._blocked === true){
            this.xhr.close();
            delete this.xhr;
            delete this.data;
            delete this._blocked;
        }
    };
    
    var _checkTimeout = function(){
        var xhr = this._xhr;
        if(xhr){
            xhr.isTimeout = true;
            xhr.abort();
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

    var _createXHR = function(){
        var xhr;

        if(self.XMLHttpRequest != undefined){
            xhr = new XMLHttpRequest();
        }else{
            // IE
            if(PV.progid != undefined){
                xhr = new ActiveXObject(PV.progid);
            }else{
                for(var i=0; i<PV.progids.length; i++){
                    PV.progid = PV.progids[i];
                    try{
                        xhr = new ActiveXObject(PV.progid);
                        break;
                    } catch (x) {
                        // Nothing to do
                    }
                }// For
            }// progid
        }
        
        return xhr;
    };

    thi$._init = function(isAsync, blocking){
        this.setAsync(isAsync);

        if(blocking !== true){
            this._xhr = _createXHR();
        }else{
            this._blocked = true;
        }
        this._blocking = blocking;
        this._usecount = 0;
        this.setNoCache(J$VM.System.getProperty("j$vm_ajax_nocache", true));
        this.setTimeout(J$VM.System.getProperty("j$vm_ajax_timeout", 6000000));
        this.declareEvent(Event.SYS_EVT_TIMEOUT);
    }.$override(this._init);

    this._init(isAsync, blocking);

}.$extend(js.util.EventTarget);

