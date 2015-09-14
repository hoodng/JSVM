/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.awt");

/**
 * 
 */
js.awt.Drawable = function(){

    var CLASS = js.awt.Drawable, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;

    var _checkEnv = function(){
        this._local = this._local || {};
    };
    
    thi$.isDirty = function(){
        _checkEnv.call(this);

        return this._local.dirty || false;
    };

    thi$.setDirty = function(dirty){
        _checkEnv.call(this);
        
        this._local.dirty = Class.isBoolean(dirty) ? dirty : true;
    };

    thi$.beforeDraw = function(layer, callback){
        this.drawing(layer, callback);
    };

    thi$.draw = function(layer, callback){
        if(!this.isVisible()){
            this.invisibleReturn(layer, callback);
        }else if(!this.isDirty()){
            this.nondirtyReturn(layer, callback);
        }else{
            this.beforeDraw(layer, callback);
        }
    };

    thi$.drawing = function(layer, callback){
        this.afterDraw(layer, callback);
    };

    thi$.invisibleReturn = function(layer, callback){
        this.afterDraw(layer, callback);
    };

    thi$.nondirtyReturn = function(layer, callback){
        this.afterDraw(layer, callback);
    };

    thi$.afterDraw = function(layer, callback){
        this.setDirty(false);
        if(callback){
            callback(this);
        }
    };
};

