/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.awt");

$import("js.awt.Drawable");
$import("js.awt.Element"); 
$import("js.util.Observer");

/**
 * 
 */
js.awt.GraphicElement = function(def, Graphics2D, Renderder){

    var CLASS = js.awt.GraphicElement, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event,
        System = J$VM.System, MQ = J$VM.MQ,
        G = Class.forName("js.awt.Graphics2D"),
        Color = Class.forName("js.awt.Color"),
        Matrix= Class.forName("js.math.Matrix"),
        sin = Math.sin, cos = Math.cos;

    /**
     * Return the Grahpics2D container that this group belong to
     */
    thi$.getGraphic = function(){
        return this.G2D;
    };

    thi$.getLayer = function(){
        var p = this.getContainer();
        return p ? p.getLayer() : undefined;
    };

    thi$.colorKey = function(){
        return this.def.colorKey;
    };

    thi$.getShapeInfo = function(){

    };

    thi$.getStyles = function(){
        return this.def;
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

        $super(this);

    }.$override(this.drawing);

    
    thi$.defAttr = function(key, val){
        var v, p;
        if(Class.isValid(val)){
            v = $super(this);
            this.fireEvent(new Event(
                G.Events.ATTRS_CHANGED, {}, this), true);
        }else{
            v = $super(this, key);
            if(!Class.isValid(v)){
                p = this.getContainer();
                v = p ? p.defAttr(key) : null;
            }
        }
        
        return v;
        
    }.$override(this.defAttr);
    
    /*
     *  Translation Transform 
     * 
     *  the translation transformation matrix:
     *              [1, 0, 0]
     *              [0, 1, 0]
     *              [dx,dy,1]
     */
    thi$.translate =function(dx, dy){
        this.transform(1, 0, 0, 1, dx, dy);
    };
    
    /**
     *  Scale Transform 
     * 
     * @param Sx {Number}: the magnification times of x-axis.
     * @param Sy {Number}: the magnification times of y-axis.
     * 
     * @param xF, yF {Number}: the coordinate of a point. 
     *                         And this transformation relative to this point. 
     * 
     *  the scale transformation matrix:
     *      [    Sx,         0,    0]
     *      [     0,        Sy,    0]
     *      [(1-Sx)*xF, (1-Sy)*yF, 1]
     * 
     */
    thi$.scale = function(Sx, Sy, xF, yF){
        xF = xF || 0, yF = yF || 0;
        this.transform(Sx, 0, 0, Sy, (1-Sx)*xF, (1-Sy)*yF);        
    };
    
    /**
     * Rotate Transform
     * 
     * @param theta {Number} the rotation angle.
     * 
     * @param xR, yR {Number} the coordinate of a point. 
     *                        And this transformation relative to this point.
     * 
     * the rotate transformation matrix: (ps. a = theta)
     *      [           cos(a),                 sin(a),         0]
     *      [          -sin(a),                 cos(a),         0]
     *      [(1-cos(a))*xR+sin(a)*yR, -sin(a)*xR+(1-cos(a))*yR, 0]
     */
    thi$.rotate = function(theta, xR, yR){
        xR = xR || 0; yR = yR || 0;
        var a = theta;
        this.transform(cos(a), sin(a), 
                       -sin(a), cos(a),
                       (1-cos(a))*xR+sin(a)*yR,
                       -sin(a)*xR+(1-cos(a))*yR);
    };
    
    /**
     * Shear Transform
     * 
     * @param Hx {Number}: work on x-axis
     * 
     * @param Hy {Number}: work on y-axis
     * 
     * the shear transformation matrix:
     *      [ 1, Hy, 0]
     *      [Hx,  1, 0]
     *      [ 0,  0, 0] 
     */
    thi$.skew = function(Hx, Hy){
        this.transform(1, Hy, Hx, 1, 0, 0);
    };
    
    /**
     * Every shape should override this method
     */
    thi$.transform = function(m11, m12, m21, m22, dx, dy){
        var T0 = this.getMatrix(),
            T1 = new Matrix(
                {M:[[m11, m12, 0],[m21, m22, 0],[dx, dy, 1]]});

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
        
        this.fireEvent(new Event(
            G.Events.TRANS_CHANGED, {}, this), true);

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
        var T = this._local.matrix;
        if(!T){
            T = this._local.matrix = 
                new Matrix({M:[[1,0,0],[0,1,0],[0,0,1]]});
        }
        return T;
    };

    /**
     * The clip object is like this:
     * {
     *      x:0,
     *      y:0,
     *      width:0,
     *      height:0
     *  }
     * 
     */
    thi$.getClip = function(){
        return this.def.clip;
    };

    thi$.attachEvent = function(eType, flag, listener, handler){
        var G2D = this.getGraphic();
        
        if(G2D){
            G2D.checkAttachEvent(eType);
        }

        $super(this);
        
    }.$override(this.attachEvent);

    thi$.fireEvent = function(e, bubble){
        var type = e.getType();

        switch(type){
        case G.Events.ATTRS_CHANGED:
        case G.Events.ITEMS_CHANGED:
        case G.Events.TRANS_CHANGED:
            this.setDirty(true);
            break;
        default:
            break;
        }

        $super(this);

    }.$override(this.fireEvent);

    thi$.destroy = function(){
        delete this.G2D;
        $super(this);
    }.$override(this.destroy);

    thi$._init = function(def, Graphics2D, Renderder){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.GraphicElement";
        
        var tmp;

        tmp = def.visible;
        def.visible = Class.isBoolean(tmp) ? tmp : true;

        tmp = def.fillStroke;
        def.fillStroke = Class.isNumber(tmp) ? tmp : 1;

        var M = def;
        M.colorKey = Color.randomColor(this.uuid());
        M.colorKey.value |= (0x00FF << 24);
        var ckey = M.colorKey;
        ckey.rgba = ckey.toString("rgba");
        ckey.uuid = ckey.toString("uuid");
        this.uuid(ckey.uuid);

        $super(this, def, Graphics2D.Runtime());

        this.G2D = Graphics2D;

        this.setRenderer(Renderder);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Element).$implements(js.awt.Drawable, js.util.Observer);

