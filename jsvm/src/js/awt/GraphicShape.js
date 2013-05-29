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

$import("js.awt.Element");
$import("js.awt.Drawable");

/**
 * 
 */
js.awt.GraphicShape = function(def, renderer){

    var CLASS = js.awt.GraphicShape, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, 
        System = J$VM.System, G = Class.forName("js.awt.Graphics2D"),
        Color = Class.forName("js.awt.Color"),
        Matrix= Class.forName("js.math.Matrix"),
        TRANSFORM = {m11:1, m12:0, m21:0, m22:1, dx:0, dy:0},
        sin = Math.sin, cos = Math.cos;

    thi$.colorKey = function(){
        return this.def.colorKey;
    };

    thi$.getType = function(){
        return this.def.type;
    };

    thi$.getShapeInfo = function(){
        
    };

    thi$.getStyle = function(){
        return this.def;
    };

    thi$.getGID = function(){
        return this.def.gid;
    };

    thi$.getLayer = function(){
        return this.getContainer().getLayer();
    };

    thi$.setRenderer = function(renderer){
        this._local.renderer = renderer;
    };

    thi$.getRenderer = function(layer){
        return this._local.renderer || layer.getRenderer();
    };

    thi$.drawing = function(layer, callback){
        var renderer = this.getRenderer(layer);

        renderer.drawShape(layer.getContext(), this);
        if(this.canCapture()){
            renderer.drawShape(layer.getContext(true), this, true);
        }

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.drawing);

    thi$.setAttr = function(key, value){
        arguments.callee.__super__.apply(this, arguments);

        this.setDirty(true);
        _notifyEvent.call(
            this, new Event(G.Events.GM_SHAPE_ATTRS_CHANGED, {}, this));

    }.$override(this.setAttr);

    thi$.getAttr = function(key){
        var v = arguments.callee.__super__.apply(this, arguments), p;
        if(!v){
            p = this.getContainer();
            v = p ? p.getAttr(key) : undefined;
        }
        return v;
    }.$override(this.getAttr);

    thi$.attachEvent = function(eType, flag, listener, handler){
        var layer = this.getLayer(), 
            G = layer ? layer.getGraphic() : undefined;

        if(G){
            G.checkAttachEvent(eType);
            arguments.callee.__super__.apply(this, arguments);
        }
    }.$override(this.attachEvent);
    
    thi$.translate =function(dx, dy){
        this.transform(1, 0, 0, 1, dx, dy);
    };
    
    thi$.scale = function(Sx, Sy, xF, yF){
        xF = xF || 0, yF = yF || 0;
        this.transform(Sx, 0, 0, Sy, 0, (1-Sx)*xF, (1-Sy)*yF);        
    };

    thi$.rotate = function(theta, xR, yR){
        xR = xR || 0; yR = yR || 0;
        var a = theta;
        this.transform(cos(a), sin(a), 
                       -sin(a), cos(a),
                       (1-cos(a))*xR+sin(a)*yR,
                       -sin(a)*xR+(1-cos(a))*yR);
    };

    thi$.skew = function(Hx, Hy){
        this.transform(1, Hy, Hx, 1, 0, 0);
    };
    
    /**
     * Every shape should override this method
     */
    thi$.transform = function(m11, m12, m21, m22, dx, dy){
        var T0 = this.getMatrix(),
            T1 = new Matrix({M:[[m11, m12, 0],[m21, m22, 0],[dx, dy, 1]]});

        T0 = Matrix.multiply(T0, T1);
        this.setTransform(T0.Aij(0,0), T0.Aij(0,1), 
                          T0.Aij(1,0), T0.Aij(1,1), 
                          T0.Aij(2,0), T0.Aij(2,1));
    };

    thi$.setTransform = function(m11, m12, m21, m22, dx, dy){
        var T0 = this.getMatrix();

        T0.Aij(0,0,m11);
        T0.Aij(0,1,m12);
        T0.Aij(0,2,0);

        T0.Aij(1,0,m21);
        T0.Aij(1,1,m22);
        T0.Aij(1,2,0);

        T0.Aij(2,0,dx);
        T0.Aij(2,1,dy);
        T0.Aij(2,2,1);
        
        this.setDirty(true);
        _notifyEvent.call(
            this, new Event(G.Events.GM_SHAPE_TRANS_CHANGED, {}, this));
    };

    var _notifyEvent = function(e){
        this.notifyContainer(G.Events.GM_EVENTS, e, true);
    };

    thi$.getTransform = function(){
        var T0 = this.getMatrix();
        return {
            m11: T0.Aij(0,0),
            m12: T0.Aij(0,1),
            m21: T0.Aij(1,0),
            m22: T0.Aij(1,1),
            dx:  T0.Aij(2,0),
            dy:  T0.Aij(2,1)
        };
    };

    thi$.getMatrix = function(){
        return this._local.matrix;
    };

    thi$.getClip = function(){
        
    };

    thi$._init = function(def, renderer){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.GraphicShape";
        
        var tmp;

        tmp = def.visible;
        def.visible = Class.isBoolean(tmp) ? tmp : true;

        tmp = def.fillStroke;
        def.fillStroke = Class.isNumber(tmp) ? tmp : 1;
        
        var M = def;
        if(!Color.randomColor){
            new Color(0,0,0);
        }
        M.colorKey = Color.randomColor(this.uuid());
        M.colorKey.value |= (0x00FF << 24);
        M.colorKey.rgba = M.colorKey.toString("rgba");
        this.uuid(M.colorKey.rgba);
        
        arguments.callee.__super__.call(this, def, null);

        this.setRenderer(renderer);

        var U = this._local;
        U.matrix = new Matrix({M:[[1,0,0],[0,1,0],[0,0,1]]});
        
        this.setDirty(true);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Element).$implements(js.awt.Drawable);

