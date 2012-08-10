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
 * @File: MemoryStorage.js
 * @Create: 2011/11/04 03:57:36
 * @Author: pmf.sei@gmail.com
 */

$package("js.util");

/**
 * When window has no sessionStorage or localStorage, we use a
 * memory storage instead.
 */
$import("js.util.HashMap");

js.util.MemoryStorage = function(){

    var CLASS = js.util.MemoryStorage, thi$ = CLASS.prototype;
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
        return this._storage.keys();  
    };

    thi$.length = function(){
        return this._storage.size();  
    };

    thi$.key = function(index){
        return this._storage.keys().get(index);
    };

    thi$.setItem = function(key, value){
        if(!_check.call(this, key)) return;
        
        switch(Class.typeOf(value)){
        case "string":
            this._storage.put(key, value);
            break;
        case "object":
        case "array":
            this._storage.put(key, JSON.stringify(value));
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
        
        this._storage.remove(key);
    };
    
    thi$.clear = function(){
        this._storage.clear();
    };

    thi$._init = function(){
        this._storage = new js.util.HashMap();
    };
    
    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);
