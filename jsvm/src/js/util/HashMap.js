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

$package("js.util");

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

        if(!this.contains(key)){
            this._size++;            
        }
        
        this._vals[key] = value;
    };
    
    thi$.size = function(){
        return this._size;
    };
    
    thi$.contains = function(key){
        return this._vals.hasOwnProperty(key);
    };
    
    thi$.get = function(key){
        return this.contains(key) ? this._vals[key] : undefined;
    };
    
    thi$.remove = function(key){
        var e = undefined;
        if(this.contains(key)){
            e = this._vals[key];
            delete this._vals[key];
            this._size--;
        }
        return e;
    };
    
    thi$.keys = function(){
        var ret = [], vals = this._vals;
        for(var k in vals){
            if(vals.hasOwnProperty(k)){
                ret.push(k);
            }
        }
        return ret;
    };
    
    thi$.values = function(){
        var ret = [], vals = this._vals;
        for(var k in vals){
            if(vals.hasOwnProperty(k)){
                ret.push(vals[k]);
            }
        }
        return ret;
    };
    
    thi$.addAll = function(map){
        for(var p in map){
            if(map.hasOwnProperty(p)){
                this.put(p, map[p]);
            }
        }
    };
    
    thi$.clear = function(){
        this._vals = {};
        this._size = 0;
    };
    
    thi$._init = function(map){
        this._vals = map || {};
        var n = 0, vals = this._vals;
        for(var k in vals){
            if(vals.hasOwnProperty(k)){
                n++;
            }
        }
        this._size = n;
    };

    this._init.apply(this, arguments);    

}.$extend(js.lang.Object);
