/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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
        this.showMoveCover(true);
    };
    
    var _hideCover = function(){
        this.showMoveCover(false);
    };

    thi$.onload = function(e){
        var doc = this.getDocument();

        if(doc && doc.URL != "about:blank"){
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

        if(doc && doc.URL != "about:blank"){
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

        $super(this);
        
        this.setAttribute("frameBorder", "0");
        this.setAttribute("flex","none");
        
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

