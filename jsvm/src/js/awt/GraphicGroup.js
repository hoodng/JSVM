/**

  Copyright 2010-2011, The JSVM Project. 
  All rights reserved.
  
 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

$import("js.awt.GraphicContainer"); 

/**
 * 
 */
js.awt.GraphicGroup = function(def, Graphics2D){

    var CLASS = js.awt.GraphicGroup, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event,
        System = J$VM.System, MQ = J$VM.MQ,
        G = Class.forName("js.awt.Graphics2D");

    thi$.drawing = function(layer, callback){
        var renderer = this.getRenderer(), 
            items = this.items(), ele, i, len;
        
        for(i=0, len=items.length; i<len; i++){
            ele = this[items[i]];
            renderer.drawShape(this.getContext(), ele);
            if(ele.canCapture()){
                renderer.drawShape(this.getContext(true), ele, true);
            }
        }
        
        this.afterDraw(layer, callback);

    }.$override(this.drawing);

    thi$._init = function(def, Graphics2D){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.GraphicGroup";
        
        $super(this);
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.GraphicContainer);

