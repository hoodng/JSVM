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

js.util.Cookie = function (k, v, e, p, d, s){

    var CLASS = js.util.Cookie, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    thi$.getName = function(){
        return this._name;
    };

    thi$.getValue = function(){
        return this._value;
    };

    thi$.setValue = function(v){
        this._value = v;
    };

    thi$.getMaxAge = function(){
        return this._maxAge;
    };

    thi$.setMaxAge = function(expiry){
        this._maxAge = (typeof expiry === "number" && !isNaN(expiry)) ? 
            expiry*1000 : undefined;
    };

    thi$.getPath = function(){
        return this._path;
    };

    thi$.setPath = function(uri){
        this._path = (typeof uri === "string") ? uri : "/";
    };

    thi$.getDomain = function(){
        return this._domain;
    };

    thi$.setDomain = function(pattern){
        this._domain = (typeof pattern === "string") ? 
            pattern.toLowerCase() : undefined;
    };

    thi$.setSecure = function(s){
        this._secure = (s === true) ? true : undefined;
    };

    thi$.toString = function(){
        var buf = new js.lang.StringBuffer();
        buf.append(this._name).append("=")
            .append(this._value ? escape(this._value) : "");
        if(typeof this._maxAge === "number"){
            var exp = new Date();
            exp.setTime(exp.getTime() + this._maxAge);
            buf.append(";expire=").append(exp.toGMTString());
        }
        if(this._path){
            buf.append(";path=").append(this._path);
        }
        if(this._domain){
            buf.append(";domain=").append(this._domain);
        }
        if(this._secure === true){
            buf.append(";secure").append(this._secure);
        }

        return buf.toString();
    };
    
    thi$._init = function(k, v, e){
        this._name = k;

        this.setValue(v);
        this.setMaxAge(e);
        this.setPath(p);
        this.setDomain(d);

    };

    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);

