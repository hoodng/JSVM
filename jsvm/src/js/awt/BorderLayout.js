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
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.awt");

/**
 * A border layout lays out a container, arranging and resizing its components to fit in 
 * five regions: north, south, east, west, and center. Each region may contain no more than 
 * one component, and is identified by a corresponding constant: NORTH, SOUTH, EAST, WEST, 
 * and CENTER.
 * 
 * @param def :{
 *     classType : the layout class
 *     vgap: 0,
 *     hgap: 0,
 *     mode: 0|1
 *     status : an object to store the result of layout
 * } 
 */
js.awt.BorderLayout = function (def){

    var CLASS = js.awt.BorderLayout, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;
    
    /**
     * Adds the specified component to the layout, using the specified constraint object. 
     * For border layouts, the constraint must be one of the following constants: 
     * NORTH, SOUTH, EAST, WEST, or CENTER.
     */
    thi$.addLayoutComponent = function(comp, constraints){
        var name = constraints || CLASS.CENTER;
        var status = this.def.status, id = comp.id;

        arguments.callee.__super__.apply(this, arguments);

        switch(name){
        case "center":
            status.center = id;
            break;
        case "north":
            status.north = id;
            break;
        case "south":
            status.south = id;
            break;
        case "east":
            status.east = id;
            break;
        case "west":
            status.west = id;
            break;
        default:
            //throw "Cannot add to layout: unknown constraint: " + name;
        }

    }.$override(this.addLayoutComponent);
    
    thi$.removeLayoutComponent = function(comp){
        var status = this.def.status, id = comp.id;
        if(id == status.center){
            status.center = null;
        }else if(id == status.north){
            status.north = null;
        }else if(id == status.south){
            status.south = null;
        }else if(id == status.east){
            status.east = null;
        }else if(id == status.west){
            status.west = null;
        }

    }.$override(this.removeLayoutComponent);
    
    thi$.invalidateLayout = function(container){
        var status = this.def.status;
        status.north = null;
        status.south = null;
        status.east  = null;
        status.west  = null;
        status.center= null;

    }.$override(this.invalidateLayout);

    thi$.layoutContainer = function(container, force){

        switch(this.def.mode){
        case 0:
            _mode0Layout.call(this, container, force);
            break;
        case 1:
            _mode1Layout.call(this, container, force);
            break;
        default:
            throw "Unsupport layout mode "+this.def.mode;
            break;
        }
    }.$override(this.layoutContainer);

    var _mode0Layout = function(container, force){
        var setting = this.def, bounds = container.getBounds(),
        vgap = setting.vgap || 0, hgap = setting.hgap || 0,
        xbase = bounds.MBP.paddingLeft, left = 0,
        ybase = bounds.MBP.paddingTop,  top = 0, 
        right = bounds.innerWidth, bottom= bounds.innerHeight,
        d, comp;
        
        if((comp = _getComp.call(this, "north", container)) != null){
            comp.setWidth(bounds.innerWidth, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            top += d.height + vgap;
        }

        if((comp = _getComp.call(this, "south", container)) != null){
            comp.setWidth(bounds.innerWidth, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase + bounds.innerHeight - d.height, 3);
            bottom -= d.height + vgap;
        }

        if((comp = _getComp.call(this, "east", container)) != null){
            comp.setHeight(bottom - top, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+right - d.width, ybase+top, 3);
            right -= d.width + hgap;
        }

        if((comp = _getComp.call(this, "west", container)) != null){
            comp.setHeight(bottom - top, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            left += d.width + hgap;
        }

        if((comp = _getComp.call(this, "center", container)) != null){
            var fire = force === true ? 0x0F : 0x07;
            comp.setSize(right-left, bottom-top, fire);
            comp.setPosition(xbase+left, ybase+top, fire);
        }
    };

    var _mode1Layout = function(container, force){
        var setting = this.def, bounds = container.getBounds(),
        vgap = setting.vgap || 0, hgap = setting.hgap || 0,
        xbase = bounds.MBP.paddingLeft, left = 0,
        ybase = bounds.MBP.paddingTop,  top = 0, 
        right = bounds.innerWidth, bottom= bounds.innerHeight,
        d, comp;
        
        if((comp = _getComp.call(this, "west", container)) != null){
            comp.setHeight(bounds.innerHeight, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            left += d.width + hgap;
        }

        if((comp = _getComp.call(this, "east", container)) != null){
            comp.setHeight(bounds.innerHeight, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+bounds.innerWidth - d.width, ybase+top, 3);
            right -= d.width + hgap;
        }

        if((comp = _getComp.call(this, "south", container)) != null){
            comp.setWidth(right - left, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+bounds.innerHeight-d.height, 3);
            bottom -= d.height + vgap;
        }

        if((comp = _getComp.call(this, "north", container)) != null){
            comp.setWidth(right - left, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            top += d.height + vgap;
        }

        if((comp = _getComp.call(this, "center", container)) != null){
            var fire = force === true ? 0x0F : 0x07;
            comp.setSize(right-left, bottom-top, fire);
            comp.setPosition(xbase+left, ybase+top, fire);
        }
    };
    
    var _getComp = function(name, container){
        var id = this.def.status[name], 
        comp = id ? container.getComponent(id) : null;

        return (comp && comp.isVisible()) ? comp : null;
    };
    
    thi$._init = function(def){
        def = def || {};
        
        def.classType = "js.awt.BorderLayout";
        def.mode = def.mode || 0;
        def.hgap = def.hgap || 0;
        def.vgap = def.vgap || 0;
        def.status = def.status || {
            north: null,
            south: null,
            east : null,
            west : null,
            center: null
        };

        arguments.callee.__super__.apply(this, arguments);        

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.AbstractLayout);

js.awt.BorderLayout.NORTH = "north";
js.awt.BorderLayout.SOUTH = "south";
js.awt.BorderLayout.EAST  = "east";
js.awt.BorderLayout.WEST  = "west";
js.awt.BorderLayout.CENTER= "center";

