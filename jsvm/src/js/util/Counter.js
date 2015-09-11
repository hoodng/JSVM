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

js.util.Counter = function(){

    var CLASS = js.util.Counter, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class;
    
    thi$.setCount = function(count){
        count = (Class.isNumber(count) && count > 0) ? 
            count : Number.MAX_VALUE;

        this._local.count = count;
        this.setPos(0);
    };

    thi$.getCount = function(){
        return this._local.count;
    };
    
    thi$.setPos = function(p){
        var U = this._local, ret = false;

        if(p >= 0 && p <= U.count){
            U.pos = p;
            ret = true;
        }else{
            if(p > U.count){
                U.pos = p - U.count;
                ret = true;
            }
        }

        return ret;
    };

    thi$.getPos = function(){
        return this._local.pos;
    };
    
    thi$.increase = function(d){
        return _add.call(this, d || 1);
    };
    
    thi$.decrease = function(d){
        return _add.call(this, 0-Math.abs((d || 1)));
    };
    
    var _add = function(d){
        var U = this._local, 
        count = U.count, p = U.pos;
        
        p += d;
        p = p < 0 ? count-1 : p%count; 
        
        U.pos = p;
        
        return p;
    };
};

js.util.SimpleCounter = function(count, pos){
    
    var CLASS = js.util.SimpleCounter, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    thi$._init = function(count, pos){
        this._local = {};

        this.setCount(count);
        this.setPos(pos);
    };
    
    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object).$implements(js.util.Counter);

