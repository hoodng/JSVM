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

/**
 * @param {Map} def : {movable: 0|1, resizable: 0|1, create, show....}
 */
js.util.Permission = function(def){

    var CLASS = js.util.Permission, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, System = J$VM.System;

    thi$.check = function(op){
        return this.def[op];
    };

    thi$.checkAll = function(){
        return this.def;
    };

    thi$.clone = function(def){
        var p = new(CLASS)(System.objectCopy(this.def, {}));
        if(Class.isObject(def)){
            System.objectCopy(def, p.def);            
        }
        return p;
    };
        
    thi$._init = function(def){
        if(!Class.isObject(def)) return;
        this.def = def;
    };
    
    this._init.apply(this, arguments);
};

(function(){

	this.isVisible = function(p){
		return (p & 1) == 1;
	};
	
	this.isRead = function(p){
		return (p & 2) == 2;
	};
	
	this.isWrite = function(p){
		return (p & 4) == 4;
	};
	
	this.isExecute = function(p){
		return (p & 8) == 8;
	};
	
	this.isEdit = function(p){
		return (p & 16) == 16;
	};
    
}).call(js.util.Permission);

