
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

js.awt.IFrame = function (def, Runtime){

    var CLASS = js.awt.IFrame, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;

    thi$.refresh = function(){
        var win = this.getWindow();
        if(win){
            MQ.post("refresh", "", [], win);
        }
    }.$override(this.refresh);

    var _showCover = function(){
        this.showCover(true);
    };
    
    var _hideCover = function(){
        this.showCover(false);
    };

    thi$.onload = function(e){
        var doc = this.getDocument();

        if(doc){
            try{
                Event.attachEvent(doc, "mousedown", 0, this, this.onmousedown);
            } catch (x) {
                // Maybe cross-domain
                var err = e ? e.message : "Can't attach mousedown event to IFrame";
                System.err.println(err);
            }
        }
        return true;
    };

    var _onunload = function(e){
        var doc = this.getDocument();

        if(doc){
            try{
                Event.detachEvent(doc, "mousedown", 0, this, this.onmousedown);
            } catch (x) {
                // Nothing to do
            }
        }
        return true;
    };

    thi$.onmousedown = function(e){
        var win = this.getWindow();
        if(win && win.parent != win.self){
            MQ.post("js.awt.event.LayerEvent", 
                    new Event("message", "", this), 
                    [this.Runtime().uuid()]);
        }
    };

    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.IFrame";
        def.className = def.className || "jsvm_iframe";
       
        def.viewType = "IFRAME";
        def.css = "border:0px none;" + (def.css || "");

        arguments.callee.__super__.apply(this, arguments);
        
        this.setAttribute("frameBorder", "0");

        if(def.src){
            this.setSrc(def.src);
        }

        Event.attachEvent(this.view, "load", 0, this, this.onload);
        Event.attachEvent(this.view, "unload", 0, this, _onunload);

        MQ.register(Event.SYS_EVT_MOVING,   this, _showCover);
        MQ.register(Event.SYS_EVT_MOVED,    this, _hideCover);
        MQ.register(Event.SYS_EVT_RESIZING, this, _showCover);
        MQ.register(Event.SYS_EVT_RESIZED,  this, _hideCover);
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(js.awt.Frame);

