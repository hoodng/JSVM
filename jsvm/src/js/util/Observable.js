/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */
$package("js.util");

js.util.Observable = function (def, Runtime){

    var CLASS = js.util.Observable, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, 
        List = js.util.LinkedList;

    thi$.addObserver = function(observer){
        var svrs = this.__observers__;

        if(observer && observer.update && !svrs.contains(observer)){
            svrs.addLast(observer);
        }
    };
    
    thi$.deleteObserver = function(observer){
        this.__observers__.remove(observer);
    };
    
    thi$.deleteObservers = function(){
        this.__observers__.clear();
    };
    
    thi$.notifyObservers = function(data){
        if(!this.hasChanged()) return;

        (function(observer){
            observer.update(this, data);
        }).$forEach(this, this.__observers__);    
    };
    
    thi$.hasChanged = function(){
        return this._local.changed;
    };
    
    thi$.setChanged = function(){
        this._local.changed = true;    
    };
    
    thi$.clearChanged = function(){
        this._local.changed = false;
    };

    thi$.Runtime = function(){
        return this._local.Runtime;
    };

    thi$.destroy = function(){
        this.__observers__ = null;
        this._local = null;

        $super(this);
        
    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(!Class.isObject(def)) return;

        this.def = def;
        this.uuid(def.uuid);
        this.__observers__ = List.$decorate([]);

        var U = this._local = {};
        U.Runtime = Runtime;
        U.changed = false;
        // Cache current object
        // @link js.lang.Object#setContextID
        this.setContextID(def["__contextid__"]);
    };

    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);

