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
 * A <em>Shodow</em> is used to support shodow of a component.<p>
 */
js.awt.Shadow = function (){

    var CLASS = js.awt.Shadow, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    var shadowbounds;

    thi$.setShadowy = function(b){
        b = b || false;
        if(b){
            var shadow = this._shadowView = DOM.createElement("DIV");
            shadow.className = "jsvm_shadow";
            shadow.style.cssText = "position:absolute;";
            shadow.uuid = this.uuid();
        }else{
            if(this._shadowView){
                this.removeShadow(true);
                delete this._shadowView;
            }
        }
        
        shadowbounds = shadowbounds || {
            BBM: J$VM.supports.borderBox,
            MBP: {BW: 0, BH: 0, PW: 0, PH: 0, BPW: 0, BPH: 0}
        };

        this._local.shadowSettled = true;
    };
    
    thi$.shadowSettled = function(){
        return this._local.shadowSettled || false;
    };

    thi$.addShadow = function(){
        var shadow = this._shadowView;
        if(shadow && this.isDOMElement()){
            shadow.style.zIndex = this.getZ();
            DOM.insertBefore(shadow, this.view);
        }
    };

    thi$.removeShadow = function(gc){
        var shadow = this._shadowView;
        if(shadow){
            DOM.remove(shadow, gc);
        }
    };

    thi$.adjustShadow = function(bounds){
        var shadow = this._shadowView, U = this._local;
        if(shadow){
            bounds = bounds || this.getBounds();
            DOM.setBounds(shadow, bounds.offsetX, bounds.offsetY, 
                          bounds.width, bounds.height, shadowbounds);
        }
    };

    thi$.setShadowZIndex = function(z){
        var shadow = this._shadowView;
        if(shadow){
            z = z || this.getZ();
            shadow.style.zIndex = z;
        }            
    };

    thi$.setShadowDisplay = function(show){
        var shadow = this._shadowView;
        if(shadow){
            shadow.style.display = show;
        }            
    };
};
