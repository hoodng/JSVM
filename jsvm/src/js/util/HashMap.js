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

$package("js.util");

$import("js.util.LinkedList");

js.util.HashMap = function (map){

    var CLASS = js.util.HashMap, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class;

    thi$.put = function(key, value){
        if(!Class.isString(key) && !Class.isNumber(key))
            throw "The key must be a string or number";
        
        this._vals[key] = value;
        if(!this._keys.contains(key)){
            this._keys.addLast(key);
        }
    };
    
    thi$.size = function(){
        return this._keys.length;
    };
    
    thi$.contains = function(key){
        return this._keys.contains(key);
    };
    
    thi$.get = function(key){
        return this._vals[key];
    };
    
    thi$.remove = function(key){
        var e;
        this._keys.remove(key);
        e = this._vals[key];
        delete this._vals[key];
        return e;
    };
    
    thi$.keys = function(){
        var ret = [], keys = this._keys;
        for(var i=0, len=keys.length; i<len; i++){
            ret.push(keys[i]);
        }
        return ret;
    };
    
    thi$.values = function(){
        var ret = [], keys = this._keys, vals = this._vals;
        for(var i=0, len=keys.length; i<len; i++){
            ret.push(vals[keys[i]]);
        }
        return ret;
    };
    
    thi$.addAll = function(map){
        for(var p in map){
            this.put(p, map[p]);
        }
    };
    
    thi$.clear = function(){
        this._vals = {};
        this._keys = js.util.LinkedList.newInstance();
    };
    
    thi$._init = function(map){
        this._vals = map || {};
        this._keys = js.util.LinkedList.newInstance();

        var _keys = this._keys, _vals = this._vals;
        for(var p in _vals){
            if(_vals.hasOwnProperty(p))_keys.push(p);
        }
    };

    this._init.apply(this, arguments);    

}.$extend(js.lang.Object);

