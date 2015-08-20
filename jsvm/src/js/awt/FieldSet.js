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
 * A FieldSet is a container. 
 * 
 */
js.awt.FieldSet = function (def, Runtime){

    var CLASS = js.awt.FieldSet, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;
	
	thi$.setLegendText = function(legendText){
		this.legend.innerHTML = String.encodeHtml(legendText);
	};
	
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
		def.classType = def.classType || "js.awt.FieldSet";
		def.className = def.className || "jsvm_fieldset";
		def.stateless = (def.stateless !== false);
		def.viewType = "FIELDSET";
		arguments.callee.__super__.apply(this, arguments);
		
		var legend = this.legend = DOM.createElement("LEGEND");
		legend.className = this.className + "_legend";
		
        // There is a bug of IE8. In IE8, that is very strange for the legned.
        // If I didn't set following style for the legend, it will overlap 
        // fieldset's first line contents.
        // Add by mingfa.pan, 04/25/2013.
        if(J$VM.ie && parseInt(J$VM.ie) < 9){
            legend.style.cssText = "position:absolute;left:12px;top:0px;";
        }
        
        legend.innerHTML = this.def.legendText;
        this.view.appendChild(legend);

    }.$override(this._init);
    
    this._init.apply(this, arguments);
	
}.$extend(js.awt.Container);

js.awt.FieldSet.DEFAULTDEF = function(){
    return {
        classType: "js.awt.FieldSet",
        legendText: "",
        rigid_w: false,
        rigid_h: false
    };
};
