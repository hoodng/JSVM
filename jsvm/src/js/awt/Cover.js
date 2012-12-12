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

js.awt.Cover = function (comp){

    var CLASS = js.awt.Cover, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    /**
     * Show loading status in this cover
     */
    thi$.showLoading = function(b){
        b = b || false;
        if(b && this._coverView) return;
        
        _showCover.call(this, b, this.className + "_loading");

    };
    
    /**
     * Show cover for resizing with class name "jsvm_resizecover"
     */
    thi$.showResizeCover = function(b){
        b = b || false;
        if(b && this._coverView) return;

        _showCover.call(this, b, this.className + "_resizecover");
    };

    /**
     * Show cover for moving with class name "jsvm_movecover"
     */
    thi$.showMoveCover = function(b){
        b = b || false;
        if(b && this._coverView) return;

        _showCover.call(this, b, this.className + "_movecover");
    };

    thi$.showMaskCover = function(b){
        b = b || false;
        if(b && this._coverView) return;

        _showCover.call(this, b, this.className + "_mask");
    };

    thi$.showDisableCover = function(b){
        b = b || false;
        if(b && this._coverView) return;

        _showCover.call(this, b, this.className + "_disable");
    };

    thi$.showCover = function(b, style){
        b = b || false;
        if(b && this._coverView) return;

        _showCover.call(this, b, (style || "jsvm_cover"));
    };

    /**
     * Show cover
     * 
     * @param b, true show the cover and false hide the cover
     */
    var _showCover = function(b, style){
        var cover = this._coverView;

        if(b){
            if(cover == undefined){
                cover = this._coverView = DOM.createElement("DIV");
                cover.className = style;
                cover.style.cssText = "position:absolute;";
                //cover.uuid = this.uuid();
				
                var el = this.getLastResizer() || this.view;
                DOM.insertAfter(cover, el);
                this.adjustCover();
            }
        }else{
            if(cover && cover.className == style){
               cover.style.cursor = "default"; 
               this.removeCover();
            }
        }
    };
    
    thi$.setCoverZIndex = function(z){
        var cover = this._coverView;
        if(cover){
            z = z || this.getZ();
            cover.style.zIndex = z;
        }
    };

    thi$.setCoverDisplay = function(show){
        var cover = this._coverView;
        if(cover){
            cover.style.display = show;
        }
    };

    /**
     * Adjust the postion and size of the cover
     */
    thi$.adjustCover = function(bounds){
        var cover = this._coverView, U = this._local;
        if(cover){
            bounds = bounds || this.getBounds();
            DOM.setBounds(cover,
                          bounds.x, 
                          bounds.y,
                          bounds.width, bounds.height);    
        }
    };
        
    thi$.removeCover = function(){
        if(this._coverView){
            DOM.remove(this._coverView, true);
            delete this._coverView;
        }
    };

    thi$.isCovering = function(){
        return this._coverView != undefined;
    };

};



