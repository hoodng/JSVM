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

/**
 * A <em>LayoutManager</em> is used to implement various layout in container.<p>
 * A layout has below properties in its model:
 * @param def :{
 *     classType : the layout class
 *     ...
 *     status : optional, an object to store the result of layout
 * }
 */
js.awt.LayoutManager = function (def){

    var CLASS = js.awt.LayoutManager, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    thi$.getLayoutInfo = function(){
        return this.def;        
    };

    thi$.getLayoutComponents = function(container){
        var ret = [];

        _filter.$forEach(
            this, container.getLayoutComponents(), container, ret);
        return ret;
    };

    var _filter = function(container, array, id){
        var comp = container.getComponent(id);
        if(comp && comp.isVisible()){
            array.push(comp);
        }
    };

    thi$.layoutContainer = function(container, force){
        _doLayout.$forEach(
            this, this.getLayoutComponents(container), force);
    };

    var _doLayout = function(force, comp){
        comp.doLayout(force);
    };

    
    /**
     * Invalidates the layout, indicating that if the layout manager
     * has cached information it should be discarded.
     */
    thi$.invalidateLayout = function(container){
        // Implements by sub class          
    };
    
    /**
     * Notes: Every layout should override this method
     */
    thi$.getLayoutSize = function(container, fn){
        var comps = this.getLayoutComponents(container),
        bounds = container.getBounds(), ret,
        w = 0, h = 0;

        if(comps.length > 0){
            ret ={x0: undefined, y0: undefined, x1: 0, y1: 0};
            _calcSize.$forEach(this, comps, fn, ret);

            w = ret.x1 - ret.x0;
            h = ret.y1 - ret.y0;
        }

        w += bounds.MBP.BPW;
        h += bounds.MBP.BPH;
        
        return {width: w, height: h};
    };

    var _calcSize = function(fn, ret, comp){
        var d = comp[fn](), xy = comp.absXY(), x = xy.x, y = xy.y;
        ret.x0 = Class.isNumber(ret.x0) ? Math.min(ret.x0, x) : x;
        ret.y0 = Class.isNumber(ret.y0) ? Math.min(ret.y0, y) : y;
        ret.x1 = Math.max(ret.x1, x + d.width);
        ret.y1 = Math.max(ret.y1, y + d.height);
    };

    /**
     * Calculates the preferred size dimensions for the specified 
     * container, given the components it contains.
     * @param container the container to be laid out
     *  
     * @see #minimumLayoutSize
     */
    thi$.preferredLayoutSize = function(container){
        return this.getLayoutSize(container, "getPreferredSize");  
    };

    /** 
     * Calculates the minimum size dimensions for the specified 
     * container, given the components it contains.
     * @param container the component to be laid out
     * @see #preferredLayoutSize
     */
    thi$.minimumLayoutSize = function(container){
        return this.getLayoutSize(container, "getMinimumSize");
    };
    
    /** 
     * Calculates the maximum size dimensions for the specified container,
     * given the components it contains.
     * @see java.awt.Component#getMaximumSize
     */
    thi$.maximumLayoutSize = function(container){
        return this.getLayoutSize(container, "getMaximumSize");
    };
    
    /**
     * Returns the alignment along the x axis.  This specifies how
     * the component would like to be aligned relative to other 
     * components.  The value should be a number between 0 and 1
     * where 0 represents alignment along the origin, 1 is aligned
     * the furthest away from the origin, 0.5 is centered, etc.
     */
    thi$.getLayoutAlignmentX = function(){
        var align = this.def.align_x;
        return Class.isNumber(align) ? align : 0.5; 
    };

    /**
     * Returns the alignment along the y axis.  This specifies how
     * the component would like to be aligned relative to other 
     * components.  The value should be a number between 0 and 1
     * where 0 represents alignment along the origin, 1 is aligned
     * the furthest away from the origin, 0.5 is centered, etc.
     */
    thi$.getLayoutAlignmentY = function(){
        var align = this.def.align_y;
        return Class.isNumber(align) ? align : 0.5; 
    };
    
    thi$.destroy = function(){
        this.def = null;
        $super(this);
    }.$override(this.destroy);
    
    
    thi$._init = function(def){
        this.def = def || {};
        this.def.classType =  "js.awt.LayoutManager";
    };

    this._init.apply(this, arguments);

}.$extend(js.lang.Object);

