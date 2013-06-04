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

$import("js.awt.GraphicContainer"); 

/**
 * 
 */
js.awt.GraphicGroup = function(def, Graphics2D){

    var CLASS = js.awt.GraphicGroup, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event,
        System = J$VM.System, MQ = J$VM.MQ,
        G = Class.forName("js.awt.Graphics2D");

    thi$.drawing = function(layer, callback){
        var renderer = this.getRenderer(), 
            ctx = this.getContext(),
            items = this.items(), ele, i, len;
        
        for(i=0, len=items.length; i<len; i++){
            ele = this[items[i]];
            renderer.drawShape(this.getContext(), ele);
            if(ele.canCapture()){
                renderer.drawShape(this.getContext(true), ele);
            }
        }
        
        this.afterDraw(layer, callback);

    }.$override(this.drawing);

    thi$._init = function(def, Graphics2D){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.GraphicGroup";
        
        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.GraphicContainer);
