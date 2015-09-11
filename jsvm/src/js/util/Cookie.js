/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
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
    
    thi$._init = function(k, v, e, p, d, s){
        this._name = k;

        this.setValue(v);
        this.setMaxAge(e);
        this.setPath(p);
        this.setDomain(d);

    };

    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);

