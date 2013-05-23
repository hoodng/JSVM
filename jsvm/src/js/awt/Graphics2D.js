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

$import("js.awt.shape.Arc");
$import("js.awt.shape.Circle");
$import("js.awt.shape.Ellipse");
$import("js.awt.shape.Image");
$import("js.awt.shape.Line");
$import("js.awt.shape.Polygon");
$import("js.awt.shape.Polyline");
$import("js.awt.shape.Rect");
$import("js.awt.shape.Text");

$import("js.awt.CanvasLayer");
/**
 * 
 */
js.awt.Graphics2D = function(def, Runtime, view){

    var CLASS = js.awt.Graphics2D, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ,
        PI = Math.PI, PI180 = PI/180;

    CLASS.RAD = "rad";
    CLASS.DEG = "deg";

    /**
     * @param vs: [[x, y],[x1, y1]....]
     */
    CLASS.vertices2Rect = function(vs){
        var i, len, p, x = [], y =[], mx, my, r = {};
        for(i=0, len=vs.length; i<len; i++){
            p = vs[i];
            x.push(p[0]);
            y.push(p[1]);
        }

        mx = Math.max.apply(Math, x);
        my = Math.max.apply(Math, y);

        r.x = Math.min.apply(Math, x);
        r.y = Math.min.apply(Math, y);

        r.width = mx - r.x;
        r.height= my - r.y;
        
        return r;
    };

    CLASS.deg2rad = function(d, u){
        return (u === undefined || u === CLASS.RAD) ? d : d * PI180;
    };

    CLASS.rad2deg = function(r, u){
        return (u === undefined || u === CLASS.RAD) ? r/PI180 : r;
    };


    /**
     * Draw an Arc
     *
     * @param data: {cx, cy, radius, startAngle, endAngle}
     */
    thi$.drawArc = function(data){
        var layer = this.curLayer();
        return layer.addShape(new js.awt.shape.Arc(data, this.Runtime()));
    };

    /**
     * Draw a Circle
     *
     * @param data: {cx, cy, radius}
     */
    thi$.drawCircle = function(data){
        var layer = this.curLayer();
        return layer.addShape(new js.awt.shape.Circle(data, this.Runtime()));
    };

    /**
     * Draw an Ellipse
     *
     * @param data: {cx, cy, ra, rb}
     */
    thi$.drawEllipse = function(data){
        var layer = this.curLayer();
        return layer.addShape(new js.awt.shape.Ellipse(data, this.Runtime()));
    };

    /**
     * Draw an Image
     *
     * @param data: {image, sx, sy, sw, sh, x, y, width, height}
     */
    thi$.drawImage = function(data){
        var layer = this.curLayer();
        return layer.addShape(new js.awt.shape.Image(data, this.Runtime()));
    };

    /**
     * Draw line
     *
     * @param data: {x, y, x1, y1}
     */
    thi$.drawLine = function(data){
        var layer = this.curLayer();
        return layer.addShape(new js.awt.shape.Line(data, this.Runtime()));
    };

    /**
     * Draw Polyline
     *
     * @param data: { cmds:[0, 1,...], coords:[[x0,y0],[x1, y1],...]}
     * cmd 0 for moveTo, cmd 1 for lineTo
     */
    thi$.drawPolyline = function(data){
        var layer = this.curLayer();
        return layer.addShape(new js.awt.shape.Polyline(data, this.Runtime()));
    };

    /**
     * Draw Polygon
     *
     * @param data: { cmds:[0, 1,...], coords:[[x0,y0],[x1, y1],...]}
     * cmd 0 for moveTo, cmd 1 for lineTo
     */
    thi$.drawPolygon = function(data){
        var layer = this.curLayer();
        return layer.addShape(new js.awt.shape.Polygon(data, this.Runtime()));
    };

    /**
     * Draw a rectangle
     *
     * @param data: {x, y, width, height}
     */
    thi$.drawRect = function(data){
        var layer = this.curLayer();
        return layer.addShape(new js.awt.shape.Rect(data, this.Runtime()));
    };
    
    /**
     * Draw Text
     *
     * @param data: {text:xxx}
     */
    thi$.drawText = function(data){
        var layer = this.curLayer();
        return layer.addShape(new js.awt.shape.Text(data, this.Runtime()));
    };
    
    /**
     * Return text's size in {width:xxx, height:yyy}
     */
    thi$.measureText = function(text, font, layer){
        layer = layer || this.curLayer();
        return layer.measureText(text, font);
    };

    /**
     * Set and get current layer
     */
    thi$.curLayer = function(id){
        var U = this._local;
        if(id && this[id]){
            U.curLayer = id;
        }
        return this.getLayer(U.curLayer);
    };
    
    /**
     * Get specified layer
     */
    thi$.getLayer = function(id){
        return this[id];
    };

    thi$.cachedShapes = function(){
        return this._local.shapes;
    };

    thi$.isCapture = function(){
        return true;
    };

    thi$.update = function(layer){
        layer.draw();
    }.$override(this.update);

    var _onDrawEnd = function(e){
        var layer = e.getEventTarget();
        if(layer){
            layer.refresh();
        }
    };

    /**
     * @see js.awt.Containable
     */
    thi$._insert = function(){
        var ele = arguments.callee.__super__.apply(this, arguments);
        if(ele.addObserver){
            ele.addObserver(this);
        }
        return ele;
    }.$override(this._insert);

    /**
     * @see js.awt.Containable
     */
    thi$.removeChild = function(){
        var ele = arguments.callee.__super__.apply(this, arguments);
        if(ele.deleteObserver){
            ele.deleteObserver(this);
        }
        return ele;
    }.$override(this.removeChild);

    /**
     * Override destroy method of js.lang.Object
     */
    thi$.destroy = function(){
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);


    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Graphics2D";
        def.className = def.className || "jsvm_graphic";
        def.items = def.items || [];
        if(def.items.length == 0){
            var id = "__layer0__";
            def.items.push(id);
            def[id] = {
                id: id,
                classType: def.layer || "js.awt.CanvasLayer",
                className: "jsvm_graphlayer",
                x:0, y:0, z:0,
                width:300, height:150,
                capture: true
            }; 
        }
        
        def.layout = def.layout || {classType: "js.awt.SuffuseLayout"};

        arguments.callee.__super__.apply(this, arguments);
        
        var U = this._local, itemIds = this.items0();
        U.curLayer = itemIds[itemIds.length-1];

        MQ.register("graphic.draw.end", this, _onDrawEnd);        

        // For caching shapes with shape.colorKey 
        U.shapes = {};
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

