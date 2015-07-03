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
 * A layout manager that allows multiple components to be laid out either vertically 
 * or horizontally. The components will not wrap so, for example, a vertical arrangement 
 * of components will stay vertically arranged when the frame is resized.
 * 
 * @param def :{
 *     classType : the layout class
 *     axis: 0(horizontally)|1(vertically)|2(horizontally & multi-line)|3(vertically & multi-column), 
 *     hgap:0, 
 *     vgap:0,
 *     align_x:0.0,
 *     align_y:0.0, 
 *     status : an object to store the result of layout
 * } 
 */
js.awt.FlowLayout = function (def){

    var CLASS = js.awt.FlowLayout, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System;

    thi$.layoutContainer = function(container){
        var setting = this.def;
        switch(setting.axis){
            case 0:
            _axis0Layout.call(this, container);
            break;
            case 1:
            _axis1Layout.call(this, container);
            break;
            case 2:
            _axis2Layout.call(this, container);
            break;
            case 3:
            _axis3Layout.call(this, container);
            break;
            default:
            throw "Unsupport axis "+setting.axis;
            break;
        }
    }.$override(this.layoutContainer);

    var _axis0Layout = function(container){
        var setting = this.def, bounds = container.getBounds(),
            gap = setting.hgap, comps = container.items0(),
            xbase = bounds.MBP.paddingLeft, left = 0,
            ybase = bounds.MBP.paddingTop,  top = 0,
            rigid = container.isRigidWidth(), comp, i, len,
            d = _axis0Size.call(
                this, container, bounds, "getPreferredSize");
        left = xbase + (rigid ?
                        (bounds.innerWidth - d.width) * this.getLayoutAlignmentX():0);

        for(i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]];
            if(!comp.isVisible()) continue;
            
            rigid = comp.isRigidHeight();
            d = comp.getPreferredSize();
            top = ybase + (rigid ? 
                           (bounds.innerHeight-d.height)*this.getLayoutAlignmentY():0);
            comp.setBounds(left, top, d.width, (rigid ? d.height:bounds.innerHeight),3);
            left += d.width + gap;
        };
    };

    var _axis1Layout = function(container){
        var setting = this.def, bounds = container.getBounds(),
            gap = setting.vgap, comps = container.items0(),
            xbase = bounds.MBP.paddingLeft, left = 0,
            ybase = bounds.MBP.paddingTop,  top = 0,
            rigid = container.isRigidHeight(), comp, i, len,
            d = _axis1Size.call(
                this, container, bounds, "getPreferredSize");
        top = ybase + (rigid ?
                       (bounds.innerHeight - d.height) * this.getLayoutAlignmentY():0);

        for(i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]];
            if(!comp.isVisible()) continue;

            rigid = comp.isRigidWidth();
            d = comp.getPreferredSize();
            left = xbase + (rigid ? 
                            (bounds.innerWidth-d.width)*this.getLayoutAlignmentX():0);
            comp.setBounds(left, top, (rigid ? d.width:bounds.innerWidth), d.height, 3);
            top += d.height + gap;
        }
    };

    var _axis2Layout = function(container){
        // TODO:
    };

    var _axis3Layout = function(container){
        // TODO:
    };
    
    /**
     * Gets average width of all components in axis 0 mode 
     */
    thi$.getAverageWidth= function(container){
        var d = _axis0Size.call(this, container, null, "getPreferredSize");
        return d.count > 0 ? d.width/d.count : 0;
    };

    /**
     * Gets average height of all components in axis 1 mode 
     */
    thi$.getAverageHeight= function(container){
        var d = _axis1Size.call(this, container, null, "getPreferredSize");
        return d.count > 0 ? d.height/d.count : 0;
    };
    
    var _axis0Size = function(container, bounds, fn){
        var setting = this.def, gap = setting.hgap,
            comps = container.items0(),
            d, w = 0, h = 0, n= 0, comp, i, len;
        
        for(i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]];
            if(!comp.isVisible()) continue;

            n++;
            d = comp[fn]();
            w += d.width + gap;
            h = Math.max(h, d.height);
        };

        w -= gap;

        return {
            width : w,
            height: h,
            count : n
        };
    };

    var _axis1Size = function(container, bounds, fn){
        var setting = this.def, gap = setting.vgap,
            comps = container.items0(),
            d, w = 0, h = 0, n = 0, comp, i, len;
        
        for(i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]];
            if(!comp.isVisible()) continue;

            n++;
            d = comp[fn]();
            h += d.height + gap;
            w = Math.max(w, d.width);
        }

        h -= gap;

        return {
            width : w,
            height: h,
            count : n
        };
    };

    var _axis2Size = function(container, bounds, fn){
        // TODO: 
        return {
            width : 0,
            height: 0
        };
    };

    var _axis3Size = function(container, bounds, fn){
        // TODO:
        return {
            width : 0,
            height: 0
        };
    };


    thi$._init = function(def){
        def = def || {};
        
        def.classType = "js.awt.FlowLayout";
        def.axis = def.axis || 0;
        def.hgap = def.hgap || 0;
        def.vgap = def.vgap || 0;

        def.align_x = def.align_x || 0.0;
        def.align_y = def.align_y || 0.0;

        arguments.callee.__super__.apply(this, arguments);        

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.AbsoluteLayout);



