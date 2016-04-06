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
            this._vals[key] = null;
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
