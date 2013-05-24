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

/**
 * 
 */
js.awt.GraphicShape = function(def, Runtime){

    var CLASS = js.awt.GraphicShape, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System, 
        Color = Class.forName("js.awt.Color"),
        Matrix= Class.forName("js.math.Matrix"),
        TRANSFORM = {m11:1, m12:0, m21:0, m22:1, dx:0, dy:0},
        sin = Math.sin, cos = Math.cos;

    thi$.colorKey = function(){
        return this._local.colorKey;
    };

    /**
     * Return group ID of this shape
     */
    thi$.getGID = function(){
        return this.def.gid;
    };

    thi$.getLayer = function(){
        return this.getContainer().getLayer();
    };

    thi$.getRenderer = function(){
        return this.getContainer().getRenderer();
    };

    thi$.getContext = function(){
        return this.getContainer().getContext();
    };

    thi$.setDrawFunc = function(func){
        this.drawFunc = func;
    };

    thi$.draw = function(callback){
        if(this.isVisible && Class.isFunction(this.drawFunc)){
            this.drawFunc(this, 
                          this.getContainer(), 
                          this.getRenderer(), 
                          callback);
        }else{
            callback(this);
        }
    };

    thi$.isFill = function(){
        return (this.def.fillStroke & 2) != 0;
    };

    thi$.isStroke = function(){
        return (this.def.fillStroke & 1) != 0;
    };

    thi$.canCapture = function(){
        var cap = this.def.capture || false;
        return cap && this.getContainer().canCapture();
    };

    thi$.setAttr = function(key, value){
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.setAttr);

    thi$.getAttr = function(key){
        var v = arguments.callee.__super__.apply(this, arguments), p;
        if(!v){
            p = this.getContainer();
            v = p ? p.getAttr(key) : undefined;
        }
        return v;
    }.$override(this.getAttr);
    
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

        this._local.matrix = Matrix.multiply(T0, T1);
    };

    thi$.setTransform = function(m11, m12, m21, m22, dx, dy){
        var T0 = this.getMatrix();

        T0.Aij(0,0,m11);
        T0.Aij(0,1,m21);
        T0.Aij(0,2,0);

        T0.Aij(1,0,m21);
        T0.Aij(1,1,m22);
        T0.Aij(1,2,0);

        T0.Aij(2,0,dx);
        T0.Aij(2,1,dy);
        T0.Aij(2,2,1);
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

    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.GraphicShape";
        
        var tmp;

        tmp = def.visible;
        def.visible = Class.isBoolean(tmp) ? tmp : true;

        tmp = def.fillStroke;
        def.fillStroke = Class.isNumber(tmp) ? tmp : 1;
        
        arguments.callee.__super__.apply(this, arguments);

        var M = this.def;
        if(Class.isFunction(M.drawFunc)){
            this.setDrawFunc(M.drawFunc);
        }

        var U = this._local;
        if(!Color.randomColor){
            new Color(0,0,0);
        }
        U.colorKey = Color.randomColor(this.uuid());
        U.colorKey.value |= (0x00FF << 24);
        U.colorKey.rgba = U.colorKey.toString("rgba");

        U.matrix = new Matrix({M:[[1,0,0],[0,1,0],[0,0,1]]});

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Element);

