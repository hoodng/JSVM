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
 * A layout manager that allows multiple components to be laid out either vertically 
 * or horizontally. The components will not wrap so, for example, a vertical arrangement 
 * of components will stay vertically arranged when the frame is resized.
 * 
 * @param def :{
 *     classType : the layout class
 *     setting : {axis: [0(horizontally)|1(vertically)], gap:0 }
 *     status : an object to store the result of layout
 * } 
 */
js.awt.BoxLayout = function (def){

    var CLASS = js.awt.BoxLayout, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    thi$.layoutContainer = function(container){

        var setting = this.def, bounds = container.getBounds(),
        gap = setting.gap || 0, axis = setting.axis || 0,
        space = (axis == 0) ? bounds.innerWidth : bounds.innerHeight,
        xbase = bounds.MBP.paddingLeft, left = 0,
        ybase = bounds.MBP.paddingTop,  top = 0,
        comps = container.items0(), comp,
        rects = [], d, r, c = 0;

        for(var i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]]; 

            if(!comp.isVisible()) continue;

            d = comp.getPreferredSize();
            r = {};

            if(axis == 0){
                // Horizontally
                // Calculates the top of every components
                r.top = (bounds.innerHeight - d.height)*this.getLayoutAlignmentY();
                if(!comp.isRigidHeight()){
                    r.top = 0;
                    r.height = bounds.innerHeight;
                }else{
                    r.height = d.height;
                }
                // Get width if the component is rigid width
                r.width = comp.isRigidWidth() ? d.width : null;
                if(r.width != null) {
                    space -= r.width;
                }else{
                    c += 1;
                }
            }else{
                // Vertically
                // Calculates the left of every components
                r.left = (bounds.innerWidth - d.width)*this.getLayoutAlignmentX();
                if(!comp.isRigidWidth()){
                    r.left = 0;
                    r.width = bounds.innerWidth;
                }else{
                    r.width = d.width;
                }
                // Get height if the component is rigid height
                r.height = comp.isRigidHeight() ? d.height : null;
                if(r.height != null){
                    space -= r.height;
                }else{
                    c += 1;
                }
            }

            r.comp = comp;
            rects.push(r);
        }
        
        if(rects.length > 1){
            space -= (rects.length - 1)*gap;
        }
        
        if(c > 1){
            space = Math.round(space/c);
        }

        if(c == 0){
            // All components are rigid
            if(axis == 0){
                left = Math.round(space*this.getLayoutAlignmentX());
            }else{
                top  = Math.round(space*this.getLayoutAlignmentY());
            }
        }
        
        for(i=0, len=rects.length; i<len; i++){
            r = rects[i]; comp = r.comp;
            if(axis == 0){
                if(r.width == null) r.width = space;
                comp.setBounds(xbase+left, ybase+r.top, r.width, r.height, 3);
                left += r.width + gap;
            }else{
                if(r.height== null) r.height= space;
                comp.setBounds(xbase+r.left, ybase+top, r.width, r.height, 3);
                top += r.height + gap;
            }
        }

    }.$override(this.layoutContainer);
    
    thi$._init = function(def){
        def = def || {};

        def.classType = "js.awt.BoxLayout";
        def.axis = def.axis || 0;
        def.gap  = def.gap || 0;

        arguments.callee.__super__.apply(this, arguments);        

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.AbstractLayout);

