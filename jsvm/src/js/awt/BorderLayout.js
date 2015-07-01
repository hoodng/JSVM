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
    
    thi$.layoutContainer = function(container, force){
        var items = this.getLayoutComponents(container), comps = {}, comp;
        for(var i=0, len=items.length; i<len; i++){
            comp = items[i];
            comps[comp.def.constraints] = comp;
        }
        
        switch(this.def.mode){
        case 0:
            _mode0Layout.call(this, container, comps, force);
            break;
        case 1:
            _mode1Layout.call(this, container, comps, force);
            break;
        default:
            throw "Unsupport layout mode "+this.def.mode;
            break;
        }
    }.$override(this.layoutContainer);

    var _mode0Layout = function(container, comps, force){
        var setting = this.def, bounds = container.getBounds(),
        vgap = setting.vgap || 0, hgap = setting.hgap || 0,
        xbase = bounds.MBP.paddingLeft, left = 0,
        ybase = bounds.MBP.paddingTop,  top = 0, 
        right = bounds.innerWidth, bottom= bounds.innerHeight,
        d, comp;
        
        if((comp = comps["north"])){
            comp.setWidth(bounds.innerWidth, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            top += d.height + vgap;
        }

        if((comp = comps["south"])){
            comp.setWidth(bounds.innerWidth, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase + bounds.innerHeight - d.height, 3);
            bottom -= d.height + vgap;
        }

        if((comp = comps["east"])){
            comp.setHeight(bottom - top, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+right - d.width, ybase+top, 3);
            right -= d.width + hgap;
        }

        if((comp = comps["west"])){
            comp.setHeight(bottom - top, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            left += d.width + hgap;
        }

        if((comp = comps["center"])){
            var fire = force === true ? 0x0F : 0x07;
            comp.setSize(right-left, bottom-top, fire);
            comp.setPosition(xbase+left, ybase+top, fire);
        }
    };

    var _mode1Layout = function(container, comps, force){
        var setting = this.def, bounds = container.getBounds(),
        vgap = setting.vgap || 0, hgap = setting.hgap || 0,
        xbase = bounds.MBP.paddingLeft, left = 0,
        ybase = bounds.MBP.paddingTop,  top = 0, 
        right = bounds.innerWidth, bottom= bounds.innerHeight,
        d, comp;
        
        if((comp = comps["west"])){
            comp.setHeight(bounds.innerHeight, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            left += d.width + hgap;
        }

        if((comp = comps["east"])){
            comp.setHeight(bounds.innerHeight, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+bounds.innerWidth - d.width, ybase+top, 3);
            right -= d.width + hgap;
        }

        if((comp = comps["south"])){
            comp.setWidth(right - left, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+bounds.innerHeight-d.height, 3);
            bottom -= d.height + vgap;
        }

        if((comp = comps["north"])){
            comp.setWidth(right - left, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            top += d.height + vgap;
        }

        if((comp = comps["center"])){
            var fire = force === true ? 0x0F : 0x07;
            comp.setSize(right-left, bottom-top, fire);
            comp.setPosition(xbase+left, ybase+top, fire);
        }
    };
    
    thi$._init = function(def){
        def = def || {};
        
        def.classType = "js.awt.BorderLayout";
        def.mode = def.mode || 0;
        def.hgap = def.hgap || 0;
        def.vgap = def.vgap || 0;

        arguments.callee.__super__.apply(this, arguments);        

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.AbsoluteLayout);

(function(){
    var CLASS = js.awt.BorderLayout;
    
    CLASS.NORTH = "north";
    CLASS.SOUTH = "south";
    CLASS.EAST  = "east";
    CLASS.WEST  = "west";
    CLASS.CENTER= "center";
    
})();

