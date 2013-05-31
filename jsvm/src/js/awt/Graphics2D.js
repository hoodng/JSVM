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

$import("js.awt.Drawable");

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
        System = J$VM.System, MQ = J$VM.MQ;

    /**
     * Draw an Arc
     *
     * @param data: {cx, cy, radius, startAngle, endAngle}
     */
    thi$.drawArc = function(data){
        return this.drawShape("arc", data);
    };

    /**
     * Draw a Circle
     *
     * @param data: {cx, cy, radius}
     */
    thi$.drawCircle = function(data){
        return this.drawShape("circle", data);
    };

    /**
     * Draw an Ellipse
     *
     * @param data: {cx, cy, ra, rb}
     */
    thi$.drawEllipse = function(data){
        return this.drawShape("ellipse", data);
    };

    /**
     * Draw an Image
     *
     * @param data: {image, sx, sy, sw, sh, x, y, width, height}
     */
    thi$.drawImage = function(data){
        return this.drawShape("image", data);
    };

    /**
     * Draw line
     *
     * @param data: {x, y, x1, y1}
     */
    thi$.drawLine = function(data){
        return this.drawShape("line", data);
    };

    /**
     * Draw Polyline
     *
     * @param data: { points:[[cmd, x0,y0],[cmd, x1, y1],...]}
     * cmd 0 for moveTo, cmd 1 for lineTo
     */
    thi$.drawPolyline = function(data){
        return this.drawShape("polyline", data);
    };

    /**
     * Draw Polygon
     *
     * @param data: { cmds:[0, 1,...], coords:[[x0,y0],[x1, y1],...]}
     * cmd 0 for moveTo, cmd 1 for lineTo
     */
    thi$.drawPolygon = function(data){
        return this.drawShape("polygon", data);
    };

    /**
     * Draw a rectangle
     *
     * @param data: {x, y, width, height}
     */
    thi$.drawRect = function(data){
        return this.drawShape("rect", data);
    };

    /**
     * Draw a sector
     *
     * @param data: {cx, cy, r, startAngle, endAngle}
     */
    thi$.drawSector = function(data){
        return this.drawShape("sector", data);
    };
    
    /**
     * Draw Text
     *
     * @param data: {text:xxx}
     */
    thi$.drawText = function(data){
        return this.drawShape("text", data);
    };

    thi$.drawShape = function(type, data){
        var layer = this.getLayer(data.layer) || this.curLayer(), 
            renderer = layer.getRenderer(),
            C = Class.forName(CLASS.SHAPES[type.toLowerCase()]);
        return layer.addShape(new (C)(data, renderer));
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
        return this.getElementById(id);
    };

    thi$.canCapture = function(){
        return true;
    }.$override(this.canCapture);


    thi$.drawing = function(layer, callback){
        var U = this._local;
        U.Queue = [];

        var items = this.items(), i, len, Q = U.Queue;
        for(i=0,len=items.length; i<len; i++){
            layer = this.getLayer(items[i]);
            if(layer.isVisible() && layer.isDirty()){
                Q.push(layer);
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

    var _onGraphicEvents = function(e){
        var U = this._local, type = e.getType(), tmp;

        switch(type){
        case CLASS.Events.GM_LAYER_TRANS_CHANGED:
            tmp = U.dirtyCount;
            U.dirtyCount = Class.isNumber(tmp) ? 
                tmp : this.getElementsCount();
            U.dirtyCount--;
            if(U.dirtyCount === 0){
                U.dirtyCount = this.getElementsCount();
                this.setDirty(true);
                this.draw();
            }
            break;
        default:
            this.setDirty(true);
            break;
        }
        _notifyEvent.call(this, e);
    };
    
    var _notifyEvent = function(e){
        this.notifyContainer(CLASS.Events.GM_EVENTS, e, true);
    };

    var _onmouseevents = function(e){
		var eType = e.getType(), ele;
		if(eType === "mouseover"){
			ele = e.toElement;
		}else if(eType === "mouseout"){
			ele = e.fromElement;
		}else{
			ele = e.srcElement;
		}
        
		var U = this._local, XY, shape, bubble = true;
		if(this.contains(ele, true) || ele === this._coverView){
            
			XY = this.curLayer().relative(e.eventXY());
			shape = _detectShape.call(this, XY.x, XY.y);

			if(!shape){
				if(U.curShape){
					e.setType("mouseout");
					e.fromElement = e.srcElement = e._target = U.curShape;
					U.curShape.fireEvent(e, bubble);
					U.curShape = undefined;
				}
			}else if(shape !== U.curShape){
				if(U.curShape){
					e.setType("mouseout");
					e.fromElement = e.srcElement = e._target = U.curShape;
					e.toElement = shape;
					U.curShape.fireEvent(e, bubble);
				}

				if(e._default === true){
					e.setType("mouseover");
					e.toElement = e.srcElement = e._target = shape;
					e.fromElement = U.curShape;
					shape.fireEvent(e, bubble);

                    e.setType(eType);
                    shape.fireEvent(e, bubble);
				}

				U.curShape = shape;
			}else{
				e.srcElement = e._target = shape;
				shape.fireEvent(e, bubble);
			}
		}

		return true;
    };

	var _detectShape = function(x, y){
		var items = this.items(), i, len, layer, shape, shapes = [];

		for(i=0, len=items.length; i<len; i++){
			layer = this.getLayer(items[i]);
			shape = layer.detectShape(x, y);
			if(shape){
				shapes.push(shape);
			}
		}
		return shapes.pop();
	};

    thi$.classType = function(){
        return "js.awt.Graphics2D";
    }.$override(this.classType);

    thi$.checkAttachEvent = function(eType){
        var U = this._local;
        if(!U.events[eType]){
            Event.attachEvent(this.view, eType, 0, this, _onmouseevents);
            U.events[eType] = true;
        }
    };

    var CANVAS_MAX = "8192";
    /**
     * Set paper size
     *
     *   |--------------------max--------------------|
     *   |------window------|
     *   |--view--|
     *
     * @param max, {w:maxW, h:maxH}. the data max size
     * @param win, {w:winW, h:winH}. the data window size
     */
    thi$.setDataSize = function(max, win){
        var bounds = this.getBounds();
        win = win || { w:max.w, h:max.h };
        win.w = Math.max(Math.min(win.w, CANVAS_MAX), bounds.innerWidth);
        win.h = Math.max(Math.min(win.h, CANVAS_MAX), bounds.innerHeight);
        
        var U = this._local;

        U.paper = {
            maxW: max.w,
            maxH: max.h,
            winW: win.w,
            winH: win.h
        };

        _setSize.call(this, win.w, win.h);
    };

    thi$.setDataPosition = function(x, y){
        _setPos.call(this, x, y);
    };

    thi$.setScroll = function(x, y){
        var view = this.view;
        if(Class.isNumber(x)){
            view.scrollLeft = x;
        }
        if(Class.isNumber(y)){
            view.scrollTop = y;
        }
    };

    /**
     * @see js.awt.Component
     */
    thi$.onResized = function(){
        var overflow = this.getStyles(
            ["overflow", "overflowX","overflowY"]);

        this.applyStyles({overflowX: "hidden", overflowY: "hidden"});

        arguments.callee.__super__.apply(this, arguments);

        this.applyStyles(overflow);

    }.$override(this.onResized);
    
    /**
     * @see js.awt.Component
     */
    thi$.doLayout = function(){
        var ret = false, bounds, MBP, w, h;
        if(arguments.callee.__super__.apply(this, arguments)){
            if(!this._local.paper){
                bounds = this.getBounds(); MBP = bounds.MBP;
                w = bounds.width - (MBP.borderLeftWidth + MBP.borderRightWidth),
                h = bounds.height- (MBP.borderTopWidth + MBP.borderBottomWidth),
                _setSize.call(this, w, h);
            }

            ret = true;
        }
        return ret;
    }.$override(this.doLayout);

    var _setSize = function(w, h){
        var items = this.items(), i, len, layer,
        size = this[items[0]].getSize();

        if(size.width != w || size.height != h){
            for(i=0, len=items.length; i<len; i++){
                layer = this[items[i]];
                layer.setSize(w, h);
            }
        }
    };

    var _setPos = function(x, y){
        var items = this.items(), i, len, layer,
        pos = this[items[0]].getPosition();

        if((Class.isNumber(x) && pos.x != x ) || 
           (Class.isNumber(y) && pos.y != y)){
            for(i=0, len=items.length; i<len; i++){
                layer = this[items[i]];
                layer.setPosition(x, y);
            }
        }
    };

    /**
     * Override destroy method of js.lang.Object
     */
    thi$.destroy = function(){
        var events = this._local.events;
        for(var eType in events){
            Event.detachEvent(this.view, eType, 0, this, _onmouseevents);
        }

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Graphics2D";
        def.className = def.className || "jsvm_graphic";

        var id = "__layer0__";
        def.items = def.items || [];
        if(def.items.length == 0){
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
        def.layout = def.layout || {
            classType: "js.awt.AbstractLayout"
        };

        arguments.callee.__super__.apply(this, arguments);
        
        var U = this._local, items = this.items();
        U.curLayer = items[items.length-1];
        U.events = {};
		U.curShape = undefined;
        U.scroll = {Xw: 0, Yw: 0 };

        MQ.register(CLASS.Events.GM_EVENTS, this, _onGraphicEvents);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Container).$implements(js.awt.Drawable);

var CLASS = js.awt.Graphics2D;

CLASS.SHAPES = {
    arc: "js.awt.shape.Arc",
    circle: "js.awt.shape.Circle",
    ellipse: "js.awt.shape.Ellipse",
    image: "js.awt.shape.Image",
    line: "js.awt.shape.Line",
    polygon: "js.awt.shape.Polygon",
    polyline: "js.awt.shape.Polyline",
    rect: "js.awt.shape.Rect",
    sector:"js.awt.shape.Sector",
    text: "js.awt.shape.Text"
};

CLASS.RAD = "rad";
CLASS.DEG = "deg";

/**
 * @param vs: [[op, x, y],[op, x1, y1]....]
 */
CLASS.vertices2Rect = function(vs){
    var i, len, p, x = [], y =[], mx, my, r = {};
    for(i=0, len=vs.length; i<len; i++){
        p = vs[i];
        x.push(p[1]);
        y.push(p[2]);
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
    return (u === undefined || u === this.RAD) ? d : d * Math.PI/180;
};

CLASS.rad2deg = function(r, u){
    return (u === undefined || u === this.RAD) ? 180*r/Math.PI : r;
};

CLASS.Events = {
    "GM_EVENTS" : "gm.events",
    "GM_SHAPE_ATTRS_CHANGED" : "gm.shape.attrschanged",
    "GM_SHAPE_TRANS_CHANGED" : "gm.shape.transchanged",

    "GM_GROUP_ATTRS_CHANGED" : "gm.group.attrschanged",
    "GM_GROUP_ITEMS_CHANGED" : "gm.group.itemschanged",
    "GM_GROUP_TRANS_CHANGED" : "gm.group.transchanged",

    "GM_LAYER_TRANS_CHANGED" : "gm.layer.transchanged"

};

CLASS = undefined;
