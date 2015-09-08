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

/**
 * 
 */
js.awt.Application = function(def, Runtime, entryId){

    var CLASS = js.awt.Application, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ, Desktop;

    thi$.getAppID = function(){
        return this.uuid();
    };

    thi$.startApp = function(){
        var cview = this._local.entry;
        if(this.view != cview){
            var children = cview.children;
            if(children.length === 0){
                this.appendTo(cview);
            }else{
                this.insertBefore(children[0]);
            }
        }
    };

    thi$.closeApp = function(){
        var cview = this._local.entry;
        if(this.view != cview){
            this.removeFrom(cview);
        }
        Desktop.unregisterApp(this.getAppID());
    };

    thi$.run = function(fn){
        if(Class.isFunction(fn)){
            fn.call(this);
        }
        this.startApp();
    };

    thi$.changeTheme = function(theme, old){
        Desktop.updateTheme(theme, old);
    };

    var _onresize = function(e){
        if(Class.isFunction(this.onresize)){
            this.onresize(e);
        }else{
            this.doLayout(true);
        }
        return e.cancelBubble();
    };

    thi$.destroy = function(){
        this.closeApp();
        
        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime, entryId){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Application";
        def.className = DOM.combineClassName(
            ["jsvm_", def.className||""].join(" "),
            ["entry", "app"]);
        def.id = def.uuid = entryId;
        def.__contextid__ = Runtime.uuid();

        var entry = self.document.querySelector("[jsvm_entry='"+entryId+"']");
        
        if(entry.getAttribute("jsvm_asapp")){
            arguments.callee.__super__.call(this, def, Runtime, entry);
        }else{
            arguments.callee.__super__.call(this, def, Runtime);            
        }

        this._local.entry = entry;

        this.putContextAttr("appid", this.getAppID());
        this.putContextAttr("app", this);
        
        this.attachEvent(Event.W3C_EVT_RESIZE, 4, this, _onresize);
        
        MQ.register("js.awt.event.ButtonEvent",
                    this, js.awt.Button.eventDispatcher);

        Desktop = Runtime.getDesktop();
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

