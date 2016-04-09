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
     * Draw a square
     *
     * @param data: {cx, cy, r}
     */
    thi$.drawSquare = function(data){
        return this.drawShape("square", data);
    };
    
    /**
     * Draw Text
     *
     * @param data: {text:xxx}
     */
    thi$.drawText = function(data){
        return this.drawShape("text", data);
    };

    /**
     * Draw a regular polygon
     *
     * @param data: {cx, cy, radius, ends, offset, rscale}
     */
    thi$.drawRPolygon = function(data){
        return this.drawShape("rpolygon", data);
    };
    
    /**
     * Draw a Triangle
     *
     * @param data: {cx, cy, radius, offset}
     */
    thi$.drawTriangle = function(data){
        return this.drawShape("triangle", data);
    };
    
    /**
     * Draw a Pentagon
     *
     * @param data: {cx, cy, radius, offset}
     */
    thi$.drawPentagon = function(data){
        return this.drawShape("pentagon", data);
    };

    /**
     * Draw a Star
     *
     * @param data: {cx, cy, radius, offset, rscale}
     */
    thi$.drawStar = function(data){
        return this.drawShape("star", data);
    };



    thi$.drawShape = function(type, data){
        var layer = this.getLayer(data.layer) || this.curLayer(), 
            renderer = layer.getRenderer(),
            C = Class.forName(CLASS.SHAPES[type.toLowerCase()]);
        return layer.addShape(new (C)(data, this, renderer));
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
        return this.def.capture === true;
    }.$override(this.capCapture);

    thi$.drawing = function(layer, callback){
        var U = this._local;

        var items = this.items(), i, len, Q = U.Queue;
        for(i=0,len=items.length; i<len; i++){
            layer = this.getLayer(items[i]);
            if(layer.isVisible() && layer.isDirty()){
                layer.draw();
            }
        }

        this.afterDraw(layer, callback);

    }.$override(this.drawing);

    var _onGraphicEvents = function(e){
        var U = this._local, type = e.getType(), tmp;

        switch(type){
        case CLASS.Events.TRANS_CHANGED:
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
            shape = this.detectShape(XY.x, XY.y);
            
            if(!shape){
                if(U.curShape){
                    e.setType("mouseout");
                    e.fromElement = e._target = U.curShape;
                    e.trigger = this;
                    U.curShape.fireEvent(e, bubble);
                    U.curShape = undefined;
                }

            }else if(shape !== U.curShape){
                if(U.curShape){
                    e.setType("mouseout");
                    e.fromElement = e._target = U.curShape;
                    e.toElement = shape;
                    e.trigger = this;
                    U.curShape.fireEvent(e, bubble);
                }

                if(e._default === true){
                    e.toElement = e._target = shape;
                    e.fromElement = U.curShape;
                    e.setType("mouseover");
                    e.trigger = this;
                    shape.fireEvent(e, bubble);

                    if(eType !== "mouseover"){
                        e.setType(eType);
                        e.trigger = this;
                        shape.fireEvent(e, bubble);
                    }
                }

                U.curShape = shape;
            }else{
                e._target = shape;
                e.trigger = this;
                shape.fireEvent(e, bubble);
            }
        }

        return true;
    };

    thi$.detectShape = function(x, y){
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

    thi$.checkAttachEvent = function(eTypes){
        var U = this._local, eType;
        for(var i=0, len=arguments.length; i<len; i++){
            eType = arguments[i];
            if(!U.events[eType]){
                this.attachEvent(eType, 4, this, _onmouseevents);
                U.events[eType] = true;
            }
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
    thi$.setDataSize = function(max, win, fire){
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

        _setSize.call(this, win.w, win.h, fire);
    };

    thi$.getDataSize = function(){
        return this._local.paper;
    };

    thi$.setDataPosition = function(x, y, fire){
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

        $super(this);

        this.applyStyles(overflow);

    }.$override(this.onResized);
    
    /**
     * @see js.awt.Component
     */
    thi$.doLayout = function(){
        var ret = false, bounds, MBP, w, h;
        if($super(this)){
            if(!this._local.paper){
                bounds = this.getBounds(); MBP = bounds.MBP;
                w = bounds.width - (MBP.borderLeftWidth + MBP.borderRightWidth),
                h = bounds.height- (MBP.borderTopWidth + MBP.borderBottomWidth),
                _setSize.call(this, w, h, 0x07);
            }

            ret = true;
        }
        return ret;
    }.$override(this.doLayout);

    var _setSize = function(w, h, fire){
        var items = this.items(), i, len, layer,
            size = this[items[0]].getSize();

        if(size.width != w || size.height != h){
            for(i=0, len=items.length; i<len; i++){
                layer = this[items[i]];
                layer.setSize(w, h, fire);
            }
        }
    };

    var _setPos = function(x, y, fire){
        var items = this.items(), i, len, layer,
            pos = this[items[0]].getPosition();

        if((Class.isNumber(x) && pos.x != x ) || 
           (Class.isNumber(y) && pos.y != y)){
            for(i=0, len=items.length; i<len; i++){
                layer = this[items[i]];
                layer.setPosition(x, y, fire);
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

        $super(this);

    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Graphics2D";
        def.className = def.className || "jsvm_graphic";

        def.layout = def.layout || {
            classType: "js.awt.AbsoluteLayout"
        };

        $super(this);

        var U = this._local;
        U.events = {};
        U.curShape = undefined;
        U.scroll = {Xw: 0, Yw: 0 };

        var M = this.def, id = this.id, 
            layerClass = CLASS.getLayerClass(def.gType);

        if(!M.items || M.items.length === 0){
            id += "__layer0__";
            this.addComponent(new (Class.forName(layerClass))(
                {
                    id: id,
                    classType: def.layer || layerClass,
                    className: "jsvm_graphlayer",
                    x:0, y:0, z:0,
                    width:300, height:150,
                    capture: this.canCapture()
                }, this
            ));
        }

        var items = this.items();
        U.curLayer = items[items.length-1];

        this.attachEvent(CLASS.Events.ATTRS_CHANGED, 4, this, _onGraphicEvents);
        this.attachEvent(CLASS.Events.ITEMS_CHANGED, 4, this, _onGraphicEvents);
        this.attachEvent(CLASS.Events.TRANS_CHANGED, 4, this, _onGraphicEvents);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Container).$implements(js.awt.Drawable);

(function(CLASS){

    CLASS.TAGS = {
        canvas: "js.awt.CanvasLayer",
        svg: "js.awt.SvgLayer",
        vml: "js.awt.VmlLayer"
    };

    CLASS.SHAPES = {
        arc: "js.awt.shape.Arc",
        circle: "js.awt.shape.Circle",
        ellipse: "js.awt.shape.Ellipse",
        image: "js.awt.shape.Image",
        line: "js.awt.shape.Line",
        pentagon: "js.awt.shape.Pentagon",
        polygon: "js.awt.shape.Polygon",
        polyline: "js.awt.shape.Polyline",
        rect: "js.awt.shape.Rect",
        rpolygon: "js.awt.shape.RPolygon",
        sector:"js.awt.shape.Sector",
        square:"js.awt.shape.Square",
        star:"js.awt.shape.Star",
        text: "js.awt.shape.Text",
        triangle: "js.awt.shape.Triangle"
    };

    CLASS.Events = {
        ATTRS_CHANGED: "attrschanged",
        ITEMS_CHANGED: "itemschanged",
        TRANS_CHANGED: "transchanged"
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
        return (u === undefined || u === this.RAD) ? 
            d : js.math.Trig.Deg2Rad(d);
    };

    CLASS.rad2deg = function(r, u){
        return (u === undefined || u === this.RAD) ? 
            js.math.Trig.Rad2Deg(r) : r;
    };

    CLASS.getLayerClass = function(gtype){
        gtype = gtype || "canvas";

        if(!J$VM.supports[gtype]){
            gtype = "svg";
            if(!J$VM.supports[gtype]){
                gtype = "vml";
            }
        }

        if(!J$VM.supports[gtype]){
            throw "Your browser does not support graphic "+gtype;
        }

        return this.TAGS[gtype];
    };

})(js.awt.Graphics2D);

