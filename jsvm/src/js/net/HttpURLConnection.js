/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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
    
    var Class =js.lang.Class, Q = [], running = false;

    this.getXHR = function(isAsync){
        var xhr, i, len, pool = this.pool, ie = (J$VM.ie !== undefined),
            Connection = Class.forName("js.net.HttpURLConnection"),
            max = J$VM.System.getProperty("j$vm_ajax_concurrent", 8);
        
        for(i=0, len=pool.length; i<len; i++){
            xhr = pool[i];
            if(!xhr.isOccupy() && !ie){
                break;
            }else{
                xhr = undefined;
            }
        }
        
        if(!xhr){
            // Can not found available xhr, then create a new instance.
            if(!isAsync || max < 0 || this.pool.length < max){
                xhr = new Connection(isAsync);
                if(!ie){
                    pool.push(xhr);
                }
            }else{
                xhr = (!ie) ? new Connection(isAsync, true) :
                    new Connection(isAsync);
            }
        }

        xhr.setAsync(isAsync);
        xhr.occupy();

        return xhr;
    };

    this.getQ = function(){
        return Q;
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
        req.open(data.method, data.url, data.params,
                 data.withOutCookie);
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
        return (this._occupy && true); 
    };

    thi$.occupy = function(){
        this._usecount ++;
        this._occupy = true;
    };

    thi$.contentType = function(){
        return this._xhr.contentType ||
            this.getResponseHeader("Content-Type");
    };

    thi$.getResponseHeader = function(key){
        return this._xhr.getResponseHeader(key);
    };

    thi$.getAllResponseHeaders = function(){
        return this._xhr.getAllResponseHeaders();
    };

    thi$.response = function(){
        var b;
        if(typeof self.Uint8Array == "undefined"){
            b = IEBinaryToString(this._xhr.responseBody).split(",");
            for(var i=0, len=b.length; i<len; i++){
                b[i] = parseInt(b[i]);
            }
        }else{
            b = new Uint8Array(this._xhr.response);
        }
        return b;
    };

    thi$.responseText = function(){
        return this._xhr.responseText;
    };

    thi$.responseXML = function(){
        return this._xhr.responseXML;
    };

    thi$.responseJSON = function(){
        var json, text = this.responseText();
        try{
            json = JSON.parse(text);
        }catch(x){
            json = {
                err: -1,
                exception: x,
                text: text
            };
        }
        return json;
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
    thi$.open = function(method, url, params, withOutCookie){
        J$VM.System.updateLastAccessTime();

        if(this.isBlocking()){
            this.data = {
                method: method,
                url: url,
                params: params,
                withOutCookie: withOutCookie
            };
            J$VM.XHRPool.post(this);
            return;
        }

        var _url, query = _makeQueryString.call(this, params),
            xhr = this._xhr, bAsync = this.isAsync();

        switch(method.toUpperCase()){
        case "GET":
            _url = (query != null) ? [url, "?", query].join("") : url;
            query = null;
            break;
        case "POST":
            _url = url;
            this.setRequestHeader("Content-Type",
                                  "application/x-www-form-urlencoded");
            break;
        default:
            // TODO in the furture ?
            break;
        }
        
        if(bAsync){
            xhr.onreadystatechange = function(){
                if(xhr.isTimeout || !self.J$VM) return;

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
                        this.fireEvent(new Event(
                            Event.SYS_EVT_HTTPERR, this, this));
                    }
                    break;
                case 4:
                    _stopTimeout.call(this);

                    switch(xhr.status){
                    case 200:
                    case 304:
                        this.fireEvent(new Event(
                            Event.SYS_EVT_SUCCESS, this, this));
                        break;
                    default:
                        this.fireEvent(new Event(
                            Event.SYS_EVT_HTTPERR, this, this));
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

        xhr.open(method, _url, bAsync);
        _setRequestHeader.call(this, xhr, this._headers);

        if(bAsync){
            (function(){
                xhr.send(query);
            }).$delay(this, 0);
        }else{
            xhr.send(query);
        }
        
    };
    
    /**
     * Close this connection
     */
    thi$.close = function(){
        if(this._xhr){
            _stopTimeout.call(this);
            var xhr = this._xhr;

            try{
                xhr.onreadystatechange = null;
                xhr.response = null;
                xhr.responseText = null;
                xhr.responseXML = null;
            } catch (x) {
            }
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
        if(params === null || 
           params === undefined || 
           typeof params != "object") params={};
        
        var buf = [];
        for(var p in params){
            buf.push(p, "=", params[p], "&");
        }
        if(this.isNoCache()){
            buf.push("__=", J$VM.__version__);
        }

        return buf.join("");
    };
    
    var _setRequestHeader = function(_xhr, map){
        if(map){
            for(var p in map){
                if(p === "responseType"){
                    try{
                        _xhr.responseType = map[p];
                    }catch(e){}
                }else{
                    try{
                        _xhr.setRequestHeader(p, map[p]);
                    }catch(e){
                    }
                }
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
        this.setTimeout(J$VM.System.getProperty("j$vm_ajax_timeout", 6000000));
        this.declareEvent(Event.SYS_EVT_TIMEOUT);
        
    }.$override(this._init);

    this._init(isAsync, blocking);

}.$extend(js.util.EventTarget);

