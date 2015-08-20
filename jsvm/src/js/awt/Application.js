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
 * Author: Hu dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
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
        if(this.view != this._local.entry){
            this.appendTo(this._local.entry);            
        }
    };

    thi$.closeApp = function(){
        if(this.view != this._local.entry){
            this.removeFrom(this._local.entry);
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
        def.className = def.className || "jsvm_app";
        def.className = "jsvm__entry " + def.className;
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

