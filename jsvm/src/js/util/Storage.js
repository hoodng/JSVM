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
 * Author: Pan mingfa
 * Contact: pmf.sei@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.util");

/**
 * <em>Storage</em> is a encapsulation of HTML WebStorage object.
 * We strongly recommend sb to instantiate this class by invoking the static method
 * <em>getStorage()</em>. 
 * 
 * @param storage: <em>window.sessionStorage</em> or
 *                 <em>window.localStorage</em>
 */
js.util.Storage = function(storage){

    var CLASS = js.util.Storage, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class;

    var _check = function(){
        var hasStorage = (this._storage != null && this._storage != undefined);

        if(arguments.length > 0){
            var key = arguments[0];
            if(typeof key === "string" && key.length > 0){
                return hasStorage;
            }else{
                return false;
            }
        }
        
        return hasStorage;
    };
    
    thi$.keys = function(){
        var keys = [];
        
        if(!this._storage.isMemory){
            for(var i = 0, len= this.length(); i < len; i++){
                keys[i] = this._storage.key(i);                
            }
        }else{
            keys = this._storage.keys();
        }

        return keys;
    };

    thi$.length = function(){
        var sto = this._storage;
        return _check() ? 
            (sto.isMemory ? sto.size() : sto.length) : 0;
    };
    
    thi$.key = function(index){
        return _check() ? this._storage.key(index) : undefined;        
    };

    thi$.setItem = function(key, value){
        if(!_check.call(this,key)) return;
        
        var sto = this._storage;
        
        sto.removeItem(key);

        switch(Class.typeOf(value)){
        case "string":
            sto.setItem(key, value);
            break;
        case "object":
        case "array":
            if(sto.isMemory){
                sto.setItem(key, value);
            }else{
                sto.setItem(key, JSON.stringify(value));                
            }
            break;
        default:
            break;
        }
    };
    
    thi$.getItem = function(key){
        if(!_check.call(this, key)) return null;
        
        var value =  this._storage.getItem(key);
        if(value){
            if(Class.typeOf(value) == "string" && 
               (value.indexOf("{") == 0 || value.indexOf("[") == 0))
                value =  JSON.parse(value);
        }
        
        return value;
    };
    
    thi$.removeItem = function(key){
        if(!_check.call(this, key)) return;

        this._storage.removeItem(key);
    };
    
    thi$.clear = function(){
        if(!_check.call(this)) return;

        this._storage.clear();
    };

    thi$._init = function(storage){
        this._storage = storage;
    };

    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);

/**
 * An static method to instatiate the web storage. For avoiding some syntax 
 * errors and exception, we will instatiate an <em>MemoryStorage</em> instead
 * when HTML5 WebStorage has been supported by browser.
 * 
 * @param type: <em>"local"</em>, <em>"session"</em> and so on. It indicates
 *              which storage will be created.
 */
js.util.Storage.getStorage = function(type) {
    var _storage, _storageObj;

    switch(type){
    case "local":
        try{
            _storage = window.localStorage; 
        } catch (x) {}
        
        break;
    case "session":
        try{
            _storage = window.sessionStorage;
        } catch (e) {}

        break;
    case "memory":
    default:
        _storage = new js.util.MemoryStorage();
        break;
    }
    
    _storageObj = new js.util.Storage(_storage || new js.util.MemoryStorage());

    return _storageObj;
};

js.util.Cache = function(){

    var CLASS = js.util.Cache, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var local, session, memory;

    thi$.setItem = function(key, value){
        try{
            local.setItem(key, value);
        } catch (e1) {
            try{
                session.setItem(key, value);
            } catch (e2) {
                memory.setItem(key, value);
            }
        }
    };
    
    thi$.getItem = function(key){
        var value = memory.getItem(key);
        value = value ? value : session.getItem(key);
        value = value ? value : local.getItem(key);
        return value;
    };

    thi$._init = function(){
        local  = J$VM.storage.local;
        session= J$VM.storage.session;
        memory = J$VM.storage.memory;
    };
    
    this._init.apply(this, arguments);

}.$extend(js.lang.Object);
