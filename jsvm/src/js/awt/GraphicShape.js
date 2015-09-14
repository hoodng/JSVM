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

$import("js.awt.GraphicElement");

/**
 * 
 */
js.awt.GraphicShape = function(def, Graphics2D, Renderer){

    var CLASS = js.awt.GraphicShape, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, 
        System = J$VM.System, G = Class.forName("js.awt.Graphics2D");


    thi$.getType = function(){
        return this.def.type;
    };

    thi$.getGID = function(){
        return this.def.gid;
    };

    thi$._init = function(def, Graphics2D, Renderer){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.GraphicShape";
        
        $super(this);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.GraphicElement);

