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

js.lang.Runtime = function(){

    var CLASS = js.lang.Runtime, thi$ = CLASS.prototype;
    if(CLASS.__defined__) {
        this._init.apply(this, arguments);        
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event;

    thi$.registerService = function(service){
        this._service = service;
    };

    thi$.getService = function(){
        var service = this._service;
        if(!service){
            service = this._service = new js.lang.Service({}, this);
        }
        return service;
    };

    thi$.registerDesktop = function(desktop){
        this._desktop = desktop;
    }
    
    thi$.getDesktop = function(){
        return this._desktop;
    };

    var procs = [];
    thi$.exec = function(entryId, fn){
        procs.push({entry:entryId, fn:fn});
    };

    var scopes = {};
    thi$._execProcs = function(){
        var proc, scope, entry;
        while(procs.length > 0){
            proc = procs.shift();
            entry = proc.entry;
            if(entry){
                scope = scopes[entry] =
                    (scopes[entry] || _newScope.call(this, entry));
            }else{
                scope = this;
            }

            (function(scope, proc){
                proc.fn.call(scope, proc.entry);                
            }).$delay(this, 0, scope, proc);
        }
    };

    var _newScope = function(entry){
        var runtimeScope = function(){

            this.getEntryID = function(){
                return entry;
            };

            this.createApp = function(def){
                def = def || {};
                def.classType = def.classType || "js.awt.Application";
                def.className = def.className || "jsvm_app";
                var appClass = Class.forName(def.classType), app;
                app = this.Application = new (appClass)(def, this, entry);
                this.getDesktop().registerApp(entry, app);
                return app;
            };

            this.getApp = function(){
                return this.Application;
            };
        };

        runtimeScope.prototype = this;
        runtimeScope = js.lang.Object.$decorate(new runtimeScope());
        runtimeScope.uuid(this.uuid()+"_"+entry);
        runtimeScope.setContextID(this.uuid());
        runtimeScope.putContextAttr("runtime", runtimeScope);
        return runtimeScope;
    };

    /**
     * Test if this J$VM is embedded in a iframe 
     */
    thi$.isEmbedded = function(){
        return self != self.parent;
    };

    /**
     * Test whether current J$VM has same PID with parent J$VM
     */
    thi$.isSamePID = function(){
        if(this.isEmbedded()){
            var pJ$VM = self.parent.J$VM;
            return pJ$VM && (pJ$VM.Runtime.PID() == this.PID());
        }
        return false;
    }

    thi$.getProperty = function(key, defValue){
        return J$VM.System.getProperty(key, defValue);
    };
    
    thi$.setProperty = function(key, value){
        J$VM.System.setProperty(key, value);
    };

    thi$.prefer = function(prefer){
        if(Class.isObject(prefer)){
            this.setProperty("prefer", prefer);
        }
        return this.getProperty("prefer", {});
    };

    thi$.themes = function(themes){
        if(Class.isArray(themes)){
            this.setProperty("themes", themes);
        }
        return this.getProperty("themes", ["default"]);
    };

    thi$.theme = function(theme){
        if(Class.isString(theme)){
            this.setProperty("theme", theme);
        }
        return this.getProperty("theme", "default");
    };

    var _isAbsPath = function(url){
        return url.indexOf("http") === 0;
    };
    
    thi$.imagePath = function(imagePath){
        if(Class.isString(imagePath)){
            if(!_isAbsPath(imagePath)){
                imagePath = J$VM.DOM.makeUrlPath(
                    J$VM.env.j$vm_home, imagePath);
            }
            this.setProperty("imagePath", imagePath);
        }
        
        return this.getProperty(
            "imagePath", J$VM.DOM.makeUrlPath(
                J$VM.env.j$vm_home, "../style/"+this.theme()+"/images/"));
    };

    thi$.PID = function(pid){
        if(Class.isString(pid)){
            this.setProperty("j$vm_pid", pid);
        }
        
        return this.getProperty("j$vm_pid", "");
    };

    thi$.postEntry = function(entry){
        if(Class.isString(entry)){
            if(!_isAbsPath(entry)){
                entry = J$VM.DOM.makeUrlPath(J$VM.env.j$vm_home, entry);
            }
            this.setProperty("postEntry", entry);
        }
        
        return this.getProperty("postEntry", J$VM.DOM.makeUrlPath(
            J$VM.env.j$vm_home, "../../"+this.PID()+".vt"));
    };

    thi$.getsEntry = function(entry){
        if(Class.isString(entry)){
            if(!_isAbsPath(entry)){
                entry = J$VM.DOM.makeUrlPath(J$VM.env.j$vm_home, entry);
            }
            this.setProperty("getsEntry", entry);
        }

        return this.getProperty("getsEntry", J$VM.DOM.makeUrlPath(
            J$VM.env.j$vm_home, "../../vt"));
    };

    thi$.nlsText = function(text, defVal){
        return defVal;
    };

    /**
     * Popup message box
     *
     */
    thi$.message = function(type, subject, content, title, rect, handler){
        var msgbox = {
            className: "msgbox",
            model:{
                msgType: type,
                title: title || "",
                msgSubject: subject || "",
                msgContent: content || " "
            }
        };

        this.getDesktop().openDialog(
            "message",
            rect || {},
            new js.awt.MessageBox(msgbox, this),
            handler);
    };

    var _registerMessageClass = function(){
        var Factory = J$VM.Factory;

        if(Factory.hasClass("message")) return;
        Factory.registerClass(
            {
                classType : "js.awt.Dialog",
                className : "message",

                items: [ "title", "client", "btnpane"],

                title: {
                    classType: "js.awt.HBox",
                    className: "win_title",
                    constraints: "north",

                    items:["labTitle", "btnClose"],

                    labTitle:{
                        classType: "js.awt.Label",
                        className: "win_title_label",
                        text : "Dialog",
                        rigid_w: false,
                        rigid_h: false
                    },

                    btnClose:{
                        classType: "js.awt.Button",
                        className: "win_title_button",
                        iconImage: "dialog_close.png"
                    }
                },

                client:{
                    classType: "js.awt.Container",
                    className: "message_client",
                    constraints: "center",
                    css: "overflow:hidden;",
                    layout:{
                        classType: "js.awt.BorderLayout"
                    }
                },

                btnpane:{
                    classType: "js.awt.HBox",
                    className: "message_btnpane",
                    constraints: "south",

                    items:["btnOK"],

                    btnOK:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnOK", "OK")
                    },

                    layout:{
                        gap: 4,
                        align_x : 1.0,
                        align_y : 0.0
                    }
                },

                width: 330,
                height:150,
                miniSize:{width:330, height:150},
                resizable: true
            }
        );
    };

    var _registerConfirmClass = function(){
        var Factory = J$VM.Factory;

        if(Factory.hasClass("jsvmconfirm")) return;
        Factory.registerClass(
            {
                classType : "js.awt.Dialog",
                className : "jsvmconfirm",

                items: [ "title", "client", "btnpane"],

                title: {
                    classType: "js.awt.HBox",
                    className: "win_title",
                    constraints: "north",

                    items:["labTitle", "btnClose"],

                    labTitle:{
                        classType: "js.awt.Label",
                        className: "win_title_label",
                        text : "Confirm",
                        rigid_w: false,
                        rigid_h: false
                    },

                    btnClose:{
                        classType: "js.awt.Button",
                        className: "win_title_button",
                        iconImage: "dialog_close.png"
                    }
                },

                client:{
                    classType: "js.awt.Container",
                    className: "message_client",
                    constraints: "center",
                    css: "overflow:hidden;",
                    layout:{
                        classType: "js.awt.BorderLayout"
                    }
                },

                btnpane:{
                    classType: "js.awt.HBox",
                    className: "message_btnpane",
                    constraints: "south",

                    items:["btnOK", "btnCancel"],

                    btnOK:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnOK", "OK")
                    },

                    btnCancel:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnCancel", "Cancel")
                    },

                    layout:{
                        gap: 4,
                        align_x : 1.0,
                        align_y : 0.0
                    }
                },

                modal: true,
                width: 330,
                height:150,
                miniSize:{width:330, height:150},
                resizable: true
            }
        );
    };

    var _registerConfirm2Class = function(){
        var Factory = J$VM.Factory;

        if(Factory.hasClass("jsvmconfirm2")) return;
        Factory.registerClass(
            {
                classType : "js.awt.Dialog",
                className : "jsvmconfirm2",

                items: [ "title", "client", "btnpane"],

                title: {
                    classType: "js.awt.HBox",
                    className: "win_title",
                    constraints: "north",

                    items:["labTitle", "btnClose"],

                    labTitle:{
                        classType: "js.awt.Label",
                        className: "win_title_label",
                        text : "Confirm",
                        rigid_w: false,
                        rigid_h: false
                    },

                    btnClose:{
                        classType: "js.awt.Button",
                        className: "win_title_button",
                        iconImage: "dialog_close.png"
                    }
                },

                client:{
                    classType: "js.awt.Container",
                    className: "message_client",
                    constraints: "center",
                    css: "overflow:hidden;",
                    layout:{
                        classType: "js.awt.BorderLayout"
                    }
                },

                btnpane:{
                    classType: "js.awt.HBox",
                    className: "message_btnpane",
                    constraints: "south",

                    items:["btnYes", "btnNo", "btnCancel"],

                    btnYes:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnYes", "Yes")
                    },

                    btnNo:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnNo", "No")
                    },

                    btnCancel:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnCancel", "Cancel")
                    },

                    layout:{
                        gap: 4,
                        align_x : 1.0,
                        align_y : 0.0
                    }
                },

                modal: true,
                width: 350,
                height: 150,
                miniSize: {width:354, height:150},
                resizable: true
            }
        );
    };

    thi$.initialize = function(env){
        J$VM.System.getProperties().addAll(env || {});

        if(env.postEntry){
            this.postEntry(env.postEntry);
        }

        if(env.getsEntry){
            this.getsEntry(env.getsEntry);
        }

        if(env.imagePath){
            this.imagePath(env.imagePath);
        }

        if(this._desktop){
            this._desktop.updateTheme(this.theme());
        }
        
        _registerMessageClass.call(this);
        _registerConfirmClass.call(this);
        // Confirm message box with "Yes", "No" and "Cancel"
        _registerConfirm2Class.call(this);

    };
    
    thi$.destroy = function(){
        if(this._service){
            this._service.destroy();
            this._service = null;
        }

        if(this._desktop){
            this._desktop.destroy();
            this._desktop = null;
        }

        procs = null;
        scopes= null;
        
        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);

    thi$._init = function(){
        this.uuid("runtime");
        arguments.callee.__super__.call(this, [{}, this]);
        
    }.$override(this._init);

    this._init.apply(this, arguments);
    
}.$extend(js.util.EventTarget);
