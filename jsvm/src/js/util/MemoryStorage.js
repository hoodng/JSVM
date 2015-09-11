/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Pan mingfa
 * Contact: pmf.sei@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.util");

/**
 * 
 */
$import("js.util.HashMap");

js.util.MemoryStorage = function(capacity){

    var CLASS = js.util.MemoryStorage, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class;

    thi$.isMemory = true;

    thi$.length = function(){
        return this.size();
    };

    thi$.key = function(index){
        return this._keys[index];
    };

    thi$.setItem = function(key, value){
        if(this.size() >= this.capacity){
            _reduce.call(this);
        }

        this.put(key, {key:key, count:1, data:value});
    };
    
    thi$.getItem = function(key){
        var ele = this.get(key), ret;
        if(ele){
            ele.count++;
            ret = ele.data;
        }
        return ret;
    };
    
    thi$.removeItem = function(key){
        var o = this.remove(key);
        return o ? o.data : undefined;
    };

    var _reduce = function(){
        var array = this.values().sort(
            function(a, b){return a.count - b.count;}
        ), len = Math.floor(this.capacity/10), tmp;

        len = len < 1 ? 1 : len;
        while(len > 0){
            tmp = array.shift();
            this.removeItem(tmp.key);
            len--;
        }
    };
    
    thi$._init = function(capacity){
        arguments.callee.__super__.call(this);
        this.capacity = 
            Class.isNumber(capacity) ? capacity : 1024;
    }.$override(this._init);

    this._init.apply(this, arguments);
    
}.$extend(js.util.HashMap);

