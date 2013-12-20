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
 * Source code availability: https://github.com/jsvm/JSVM
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

    thi$.layoutContainer = function(container, force){
        var comps = container.items0(), i, len, comp;
        for(i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]];
            if(comp && comp.needLayout(force)){
                comp.doLayout(force);
            }
        }
    };
    
    /**
     * Adds the specified component to the layout, using the specified
     * constraint object.
     * @param comp the component to be added
     * @param constraints  where/how the component is added to the layout.
     */
    thi$.addLayoutComponent = function(comp, constraints){
        // Should override by sub class
    };
    
    thi$.removeLayoutComponent = function(comp){
        // Implements by sub class
    };

    /**
     * Invalidates the layout, indicating that if the layout manager
     * has cached information it should be discarded.
     */
    thi$.invalidateLayout = function(container){
        // Implements by sub class          
    };
    
    /**
     * 
     * Notes: Every layout should override this method
     */
    thi$.getLayoutSize = function(container, fn, nocache){
        var comps = container.items0(),
        comp, bounds = container.getBounds(), d,
        w = 0, h = 0, i, len;
        
        for(i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]];

            if(!comp.isVisible()) continue;
            
            d = comp[fn](nocache);
            w = Math.max(w, (comp.getX() + d.width));
            h = Math.max(h, (comp.getY() + d.height));
        }

        w += bounds.MBP.BW;
        h += bounds.MBP.BH;
        
        return {width:w, height:h};
    };

    /**
     * Calculates the preferred size dimensions for the specified 
     * container, given the components it contains.
     * @param container the container to be laid out
     *  
     * @see #minimumLayoutSize
     */
    thi$.preferredLayoutSize = function(container, nocache){
        return this.getLayoutSize(container, "getPreferredSize", nocache);  
    };

    /** 
     * Calculates the minimum size dimensions for the specified 
     * container, given the components it contains.
     * @param container the component to be laid out
     * @see #preferredLayoutSize
     */
    thi$.minimumLayoutSize = function(container, nocache){
        return this.getLayoutSize(container, "getMinimumSize", nocache);
    };
    
    /** 
     * Calculates the maximum size dimensions for the specified container,
     * given the components it contains.
     * @see java.awt.Component#getMaximumSize
     */
    thi$.maximumLayoutSize = function(container, nocache){
        return this.getLayoutSize(container, "getMaximumSize", nocache);
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
        delete this.def;

        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);
    
    
    thi$._init = function(def){
        this.def = def || {};
        this.def.classType =  "js.awt.LayoutManager";
    };

    this._init.apply(this, arguments);

}.$extend(js.lang.Object);

