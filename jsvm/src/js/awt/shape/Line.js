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
 * Source code availability: http://github.com/jsvm
 */

$package("js.awt.shape");

$import("js.awt.Shape");

/**
 * {x0, y0, x1, y1}
 */
js.awt.shape.Line = function(def, Runtime){

    var CLASS = js.awt.shape.Line, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;

    thi$.getLine = function(){
        var M = this.def;
        return {
            x0: M.x0,
            y0: M.y0,
            x1: M.x1,
            y1: M.y1
        };
    };

    thi$.relDraw = function(shape){
        var layer = shape.getLayer();
        switch(layer.classType()){
        case "js.awt.CanvasLayer":
            layer.drawLine(shape);
            break;
        default:
            // TODO: for svg, vml ?
            break;
        };
    };

    thi$.hitDraw = function(shape){
        var layer = shape.getLayer();
        switch(layer.classType()){
        case "js.awt.CanvasLayer":
            layer.drawLine(shape, true);
            break;
        };
    };

    thi$.isFill = function(){
        return false;
    }.$override(this.fill);

    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.shape.Line";
        
        def.x = Math.min(def.x0, def.x1);
        def.y = Math.min(def.y0, def.y1);

        var v;
        v = def.width = Math.abs(def.x1 - def.x0);
        def.width = v < 1 ? 1 : v;

        v = def.height= Math.abs(def.y1 - def.y0);
        def.height= v < 1 ? 1 : v;
        
        def.close = "open";

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Shape);
