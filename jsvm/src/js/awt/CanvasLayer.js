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
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ, Color = Class.forName("js.awt.Color"),
        G = Class.forName("js.awt.Graphics2D");

    
    thi$.getContext = function(hit){
        return hit ? this._local.hitContext : this._local.relContext;
    }.$override(this.getContext);

    thi$.addShape = function(shape){
        var g = this.getElementById(shape.getGID()),
            c = g ? g : this;

        return c.appendChild(shape);
    };

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

    thi$.getImageData = function(hit, sx, sy, sw, sh){
        sx = sx || 0;
        sy = sy || 0;
        sw = sw || this.getWidth();
        sh = sh || this.getHeight();

        return this.getContext(hit).getImageData(sx, sy, sw, sh);
    };

    thi$.putImageData = function(hit, image, dx, dy){
        dx = dx || 0;
        dy = dy || 0;

        this.getContext(hit).putImageData(image, dx, dy);
    };

    thi$.erase = function(){
        var D = this.getSize();
        this.getContext().clearRect(0,0, D.width, D.height);
        if(this.canCapture()){
            this.getContext(true).clearRect(0,0, D.width, D.height);
        }
    };

    thi$.drawing = function(layer, callback){
        this.erase();
        
        var U = this._local;
        U.Queue = [];

        var items = this.items()||[], i, len, ele, Q = U.Queue;
        for(i=0, len=items.length; i<len; i++){
            ele = this[items[i]];
            if(ele){
                Q.push(ele);
                if(ele.instanceOf(js.awt.GraphicShape)){
                    ele.setDirty(true);
                }
            }
        }
        
        _onDrawEnd.call(this, null, layer, callback);

    }.$override(this.drawing);

    var _onDrawEnd = function(ele, layer, callback){
        var U = this._local, Q = U.Queue;
        
        if(Q.length > 0){
            ele = Q.shift();
            ele.draw(this, _onDrawEnd.$bind(this, layer, callback));
        }else{
            this.afterDraw(this, callback);
        }
    };

    thi$.detectShape = function(x, y){
        var cache = this.cachedShapes(),
            image = this.getImageData(true, x,y,1,1), 
            px = image.data, colorKey, shape;
        if(px[3] != 0){
            colorKey = new Color(px[0], px[1], px[2], px[3]);
            shape = cache[colorKey.toString("rgba")];
        }
        return shape;
    };


    thi$.setSize = function(w, h){
        arguments.callee.__super__.apply(this, arguments);

        _setSize.call(this, w, h);

    }.$override(this.setSize);

    thi$.setBounds = function(x, y, w, h){
        arguments.callee.__super__.apply(this, arguments);

        _setSize.call(this, w, h);
        
    }.$override(this.setBounds);

    var _setSize = function(w, h){
        var buf = this.relCanvas, hit = this.hitCanvas;

        buf.width = w;
        buf.height= h;
        if(hit){
            hit.width = w;
            hit.height= h;
        }
        
        this.setDirty(true);
        _notifyEvent.call(
            this, new Event(G.Events.GM_LAYER_TRANS_CHANGED,{}, this));
    };

    var _notifyEvent = function(e){
        this.notifyContainer(G.Events.GM_EVENTS, e, true);
    };

    thi$.destroy = function(){
        delete this.relCanvas;
        delete this.hitCanvas;
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.CanvasLayer";

        arguments.callee.__super__.apply(this, arguments);

        var U = this._local;

        this.relCanvas = DOM.createElement("CANVAS");
        U.relContext = this.relCanvas.getContext("2d");

        var view;
        view = this.view = this.relCanvas;
        view.id = this.id;
        view.uuid = this.uuid();

        if(def.capture === true){
            this.hitCanvas = DOM.createElement("CANVAS");
            U.hitContext = this.hitCanvas.getContext("2d");
        }
        
        // DEBUG:

        this.hitCanvas.style.cssText = "position:absolute;right:0;top:0;";
        document.body.appendChild(this.hitCanvas);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.GraphicLayer);


