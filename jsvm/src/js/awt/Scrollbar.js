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
 * 
 * @param def :{
 *     className: xxx
 *     
 * } 
 */
js.awt.Scrollbar = function (def, Runtime){

    var CLASS = js.awt.Scrollbar, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ, WIN_MAX_SIZE = 8192;
    
    thi$.isHorizontal = function(){
        return this.def.axis === 0;
    };

    /**
     * Set data size
     *
     *   |--------------------max--------------------|
     *   |------window------|
     *   |--view--|
     *
     * @param max, {w:maxW, h:maxH}. the data max size
     * @param win, {w:winW, h:winH}. the data window size
     */
    thi$.setDataSize = function(max, win, limitW, limitH){
        var isH = this.isHorizontal(), bounds = this.getBounds();

        win = win || { w:max.w, h:max.h };
        win.w = Math.max(Math.min(win.w, limitW || WIN_MAX_SIZE), 
                         bounds.innerWidth);
        win.h = Math.max(Math.min(win.h, limitH || WIN_MAX_SIZE), 
                         bounds.innerHeight);
        
        // Make two braces if max size large than the data 
        // window size.
        var U = this._local, brace = this.brace;
        if(!brace){
            brace = this.brace = DOM.createElement("DIV");
            brace.className = isH ? "xbrace" : "ybrace";
            brace.style.cssText = "position:absolute;";
            DOM.insertBefore(brace, this.view.firstChild, this.view);
        }
        
        if(isH){
            DOM.setSize(brace, max.w, 1);            
        }else{
            DOM.setSize(brace, 1, max.h);
        }

        U.paper = {
            maxW: max.w,
            maxH: max.h,
            winW: win.w,
            winH: win.h
        };
        
        Event.attachEvent(this.view, "scroll", 1, this, _onscroll);
    };

    var _onscroll = function(e){
        var U = this._local, scroll = U.scroll, view = this.view, 
        bounds = this.getBounds(), MBP = bounds.MBP, paper = U.paper, 
        vieW = bounds.clientWidth - (MBP.paddingLeft+MBP.paddingRight),
        vieH = bounds.clientHeight- (MBP.paddingTop+MBP.paddingBottom),
        maxW = paper.maxW, maxH = paper.maxH,
        winW = paper.winW, winH = paper.winH,
        Xw = scroll.Xw, Yw = scroll.Yw, Xv, X1, Yv, Y1, reload = false;

        Xv = Math.min(maxW - vieW, view.scrollLeft);
        Yv = Math.min(maxH - vieH, view.scrollTop);
        
        X1 = _getWinPs(maxW, winW, vieW, Xv, Xw);
        Y1 = _getWinPs(maxH, winH, vieH, Yv, Yw);
        
        if(X1 != Xw){
            reload = true;
            Xw = scroll.Xw = X1;
        }
        if(Y1 != Yw){
            reload = true;
            Yw = scroll.Yw = Y1;
        }
        
        this.fireEvent(new Event("scroll",{
                                     scrollLeft: Xv,
                                     scrollTop:  Yv,
                                     Xw: Xw,
                                     Yw: Yw,
                                     reload: reload
                                 }, this));
    };

    var _getWinPs = function(M, W, V, vp, wp){
        return (vp >= 0 && vp <= (W-V)) ? 0 :
            ((vp >= (M-W) && vp <= (M-V)) ? M-W : 
             (vp < wp || vp >= wp+W-V) ? vp-(W-V)/2 : wp);
    };

    /**
     * @see js.awt.BaseComponent
     */
    thi$.destroy = function(){
        var brace, scroll = false;
        brace = this.brace;
        if(brace){
            scroll = true;
            DOM.removeFrom(brace, this.view);
            delete this.brace;
        }

        if(scroll){
            Event.detachEvent(this.view, "scroll", 1, this, _onscroll);
        }

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        var axis = def.axis, css;
        if(axis !== 0 && axis !== 1){
            axis = def.axis = 0;
        }
        
        css = (axis === 0) 
            ? "overflow-x:scroll;overflow-y:hidden;"
            : "overflow-x:hidden;overflow-y:scroll;";
        def.css = css + (def.css || "");
        
        arguments.callee.__super__.apply(this, arguments);

        var U = this._local;
        U.scroll = {Xw:0, Yw: 0};

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Component);




