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

$import("js.awt.GraphicLayer");

/**
 * 
 */
js.awt.CanvasLayer = function(def, Runtime){

    var CLASS = js.awt.CanvasLayer, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, 
        System = J$VM.System, MQ = J$VM.MQ, DOM = J$VM.DOM,
        DEFAULE_GROUP = "__g0__";
    
    thi$.getContext = function(hit){
        var U = this._local;
        return hit ? U.hitContext : U.relContext;
    }.$override(this.getContext);

    thi$.measureText = function(text, font, ctx){
        ctx = ctx || this.getContext();

        var save = (font !== undefined), ret;
        
        if(save){
            ctx.save();
            ctx.font = font;
        }

        ret = {
            width:  ctx.measureText(text).width,
            height: parseInt(ctx.font.match(/\s*\d+px/)[0])
        };
        
        if(save){
            ctx.restore();
        }

        return ret;

    }.$override(this.measureText);

    thi$.getImageData = function(x, y, w, h, ctx){
        ctx = ctx || this.getContext();
        return ctx.getImageData(x, y, w, h);
    };

    thi$.putImageData = function(image, dx, dy, dw, dh, ctx){
        ctx = ctx || this.getContext();
        dx = dx || 0;
        dy = dy || 0;
        dw = dw || this.getWidth();
        dh = dh || this.getHeight();

        ctx.putImageData(image, 0, 0, dx, dy, dw, dh);
    };

    thi$.addShape = function(shape){
        var group = this.getGroup(shape.getGID());
        shape.def.gid = group.id;
        return group.appendChild(shape);
    };

    thi$.getGroup = function(gid){
        return this.getElementById(gid || DEFAULE_GROUP);
    };

    thi$.refresh = function(){
        this.erase();

        var items = this.items(), i, len, g;
        for(i=0, len=items.length; i<len; i++){
            g = this[items[i]];
            if(g.isVisible()){
                this.putImageData(g.getImageData());
            }
        }
    }.$override(this.refresh);

    thi$.erase = function(){
        var D = this.getSize();
        this.getContext().clearRect(0,0, D.width, D.height);
        this.getContext(true).clearRect(0,0, D.width, D.height);
    };

    thi$.redraw = function(n){
        n = n || 0;

        if(n == 0){
            this.erase();
        }
        /*
        var shape, shapes = this.items();
        for(var i=n, len=shapes.length; i<len; i++){
            shape = this[shapes[i]];
            if(shape && shape.draw){
                shape.draw();
            }
        }*/
    };

    var _detectShape = function(x, y){
        var cache = this.getContainer().cachedShapes(),
            image = this.getImageData(x,y,1,1, this.hitContext()), 
            px = image.data, colorKey, shape;
        if(px[3] != 0){
             colorKey = new Color(px[0], px[1], px[2], px[3]).toString("rgba");
            shape = cache[colorKey];
        }
        return shape;
    };

    var _onmousemove = function(e){
        var mp = this.relative(e.eventXY()), shape;
        shape = _detectShape.call(this, mp.x, mp.y);
        if(shape) System.err.println(shape.id);
    };

    thi$.getSize = function(){
        var ctx = this.relCanvas;
        return {
            width : ctx.width,
            height: ctx.height
        };
    }.$override(this.getSize);

    /**
     * @see js.awt.Container
     */
    thi$.setSize = function(w, h, fire){
        if(DOM.isDOMElement(this.view)){
            arguments.callee.__super__.apply(this, arguments);
            _setSize.call(this, w, h);
        }
    }.$override(this.setSize);

    /**
     * @see js.awt.Container
     */
    thi$.setBounds = function(x, y, w, h, fire){
        if(DOM.isDOMElement(this.view)){
            arguments.callee.__super__.apply(this, arguments);
            _setSize.call(this, w, h);
        }
    }.$override(this.setBounds);

    var _setSize = function(w, h){
        var rel = this.relCanvas, hit = this.hitCanvas;

        rel.width = w;
        rel.height= h;

        hit.width = w;
        hit.height= h;

        var items = this.items(), i, len, g;
        for(i=0, len=items.length; i<len; i++){
            g = this[items[i]];
            g.setSize(w, h);
        }

        this.redraw();
    };

    thi$.destroy = function(){
        delete this.relCanvas;
        delete this.hitCanvas;
        
        var U = this._local;
        delete U.relContext;
        delete U.hitContext;
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
		if(def == undefined) return;

        def.classType = def.classType || "js.awt.CanvasLayer";

        arguments.callee.__super__.apply(this, arguments);
        
        this.relCanvas = DOM.createElement("CANVAS");
        this.hitCanvas = DOM.createElement("CANVAS");
        this.view = this.relCanvas;
        this.view.id = this.id;

        var U = this._local;
        U.relContext = this.relCanvas.getContext("2d");
        U.hitContext = this.hitCanvas.getContext("2d");

        this.appendChild(new (Class.forName("js.awt.CanvasGroup"))({
            id: DEFAULE_GROUP,
            capture: true
        }, Runtime));

//        this.attachEvent("mousemove", 0, this, _onmousemove);
        
        // DEBUG:
        this.hitCanvas.style.cssText = "position:absolute;right:0;top:0;";
        document.body.appendChild(this.hitCanvas);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.GraphicLayer);


