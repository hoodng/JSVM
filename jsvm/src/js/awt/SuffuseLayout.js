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

/**
 *
 */
js.awt.SuffuseLayout = function (def){

    var CLASS = js.awt.SuffuseLayout, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;


    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System;

    /**
     * Adds the specified component to the layout, using the specified
     * constraint object.
     * @param comp the component to be added
     * @param constraints  where/how the component is added to the layout.
     */
    thi$.addLayoutComponent = function(comp, constraints){
        arguments.callee.__super__.apply(this, arguments);

        var container = comp.getContainer(), bounds;
        if(container.isDOMElement()){
            bounds = container.getBounds();
            comp.setBounds(bounds.MBP.paddingLeft, 
                           bounds.MBP.paddingTop, 
                           bounds.innerWidth, 
                           bounds.innerHeight);
        }
    }.$override(this.addLayoutComponent);

    thi$.layoutContainer = function(container){
        var comps = container.items(), bounds = container.getBounds(),
            MBP = bounds.MBP, comp, i, len;
        
        for(i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]];

            comp.setBounds(MBP.paddingLeft, MBP.paddingTop, 
                           bounds.innerWidth, bounds.innerHeight, 3);
        }

    }.$override(this.layoutContainer);
    
    thi$._init = function(def){
        def = def || {};
        
        def.classType = "js.awt.SuffuseLayout";
        arguments.callee.__super__.apply(this, arguments);        

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.AbstractLayout);

