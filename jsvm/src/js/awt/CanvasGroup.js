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

$package("js.awt");

$import("js.awt.GraphicGroup"); 

/**
 * 
 */
js.awt.CanvasGroup = function(def, Runtime){

    var CLASS = js.awt.CanvasGroup, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ;
    
    thi$.getCanvas = function(hit){
        return hit ? this.hitCanvas : this.bufCanvas;
    };

    /**
     * Get context of this group
     */
    thi$.getContext = function(hit){
        return hit ? this._local.hitContext : this._local.bufContext;
    };

    /**
     * Write image data to result layer
     */
    thi$.writeImage = function(layer){
        var ctx, abs = this.absXY(), hit = false;
            
        // Write buf image to result layer
        ctx= layer.getContext(hit);
        ctx.putImageData(this.getImageData(hit), abs.x, abs.y);
        
        // Write hit image to hit layer
        hit =true;
        ctx= layer.getContext(hit);
        ctx.putImageData(this.getImageData(hit), abs.x, abs.y);

        var items = this.items(), i, len, ele;
        for(i=0, len=items.length; i<len; i++){
            ele = this[items[i]];
            if(ele.instanceOf(js.awt.CanvasGroup)){
                ele.writeImage(layer);
            }
        }
    };

    thi$.getImageData = function(hit){
        var ctx = hit ? this.getContext(hit) : this.getContext();
        return ctx.getImageData(0,0, this.getWidth(), this.getHeight());
    };

    thi$.setSize = function(w, h){
        arguments.callee.__super__.apply(this, arguments);

        _setCanvasSize.call(this, this.getCanvas(), w, h);
        _setCanvasSize.call(this, this.getCanvas(true), w, h);

        var items = this.items(), i, len, g;
        for(i=0, len=items.length; i<len; i++){
            g = this[items[i]];
            if(g.instanceOf(js.awt.CanvasGroup)){
                g.setSize(w, h);
            }
        }

    }.$override(this.setSize);

    var _setCanvasSize = function(canvas, w, h){
        canvas.width = w;
        canvas.height= h;
    };

    thi$.destroy = function(){
        delete this.bufCanvas;
        delete this.hitCanvas;

        var U = this._local;
        delete U.bufContext;
        delete U.hitContext;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.CanvasGroup";
        
        arguments.callee.__super__.apply(this, arguments);

        this.bufCanvas = DOM.createElement("CANVAS");
        this.hitCanvas = DOM.createElement("CANVAS");
        
        var U = this._local;
        U.bufContext = this.bufCanvas.getContext("2d");
        U.hitContext = this.hitCanvas.getContext("2d");
 
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.GraphicGroup);

