/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

js.lang.Runtime = function(System){

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
    };
    
    thi$.getDesktop = function(){
        return this._desktop;
    };

    var procs = [];
    thi$.exec = function(entryId, fn){
        procs.push({entry:entryId, fn:fn});
    };

    var scopes = J$VM.runtime = {};
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

    var _newScope = function(entryId){

        var runtimeScope = function(){

            this.getEntryID = function(){
                return entryId;
            };

            this.createApp = function(def){
                var app = new appPromise(this);
                _createApp.$delay(this, 0, entryId, def, app);
                return app;
            };

            this.getApp = function(){
                return this.Application;
            };
            
            var _createApp = function(entryId, def, promise){
                def = def || {};
                def.classType = def.classType || "js.awt.Application";
                var appClass = Class.forName(def.classType), app;
                app = new (appClass)(def, this, entryId);
                promise.done(app);
            };

            var appPromise = function(runtime){
                var tasks = [];

                this.startApp = function(){
                    this.run();
                };
                
                this.run = function(fn){
                    if(Class.isFunction(fn)){
                        tasks.push(fn);
                    }
                    return this;
                };

                this.done = function(app){
                    runtime.Application = app;
                    runtime.getDesktop().registerApp(
                        runtime.getEntryID(), app);
                    app.startApp();
                    while(tasks.length > 0){
                        tasks.shift().call(app);
                    }
                };
            };
        };

        runtimeScope.prototype = this;
        runtimeScope = js.lang.Object.$decorate(new runtimeScope());
        runtimeScope.uuid(this.uuid()+"_"+entryId);
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
    };

    thi$.getProperty = function(key, defValue){
        return System.getProperty(key, defValue);
    };
    
    thi$.setProperty = function(key, value){
        System.setProperty(key, value);
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
            J$VM.env.j$vm_home, +this.PID()+".vt"));
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
                    className: "win_title message_title",
                    constraints: "north",

                    items:["labTitle", "btnClose"],

                    labTitle:{
                        classType: "js.awt.Label",
                        text : "Dialog",
                        rigid_w: false,
                        rigid_h: false
                    },

                    btnClose:{
                        classType: "js.awt.Button",
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
                        className: "jbtn",
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
                    className: "win_title message_title",
                    constraints: "north",

                    items:["labTitle", "btnClose"],

                    labTitle:{
                        classType: "js.awt.Label",
                        text : "Confirm",
                        rigid_w: false,
                        rigid_h: false
                    },

                    btnClose:{
                        classType: "js.awt.Button",
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
                        className: "jbtn",
                        effect: true,
                        labelText: this.nlsText("btnOK", "OK")
                    },

                    btnCancel:{
                        classType: "js.awt.Button",
                        className: "jbtn",
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
                    className: "win_title message_title",
                    constraints: "north",

                    items:["labTitle", "btnClose"],

                    labTitle:{
                        classType: "js.awt.Label",
                        text : "Confirm",
                        rigid_w: false,
                        rigid_h: false
                    },

                    btnClose:{
                        classType: "js.awt.Button",
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
                        className: "jbtn",
                        effect: true,
                        labelText: this.nlsText("btnYes", "Yes")
                    },

                    btnNo:{
                        classType: "js.awt.Button",
                        className: "jbtn",
                        effect: true,
                        labelText: this.nlsText("btnNo", "No")
                    },

                    btnCancel:{
                        classType: "js.awt.Button",
                        className: "jbtn",
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
        System.getProperties().addAll(env || {});

        if(env.postEntry){
            this.postEntry(env.postEntry);
        }

        if(env.getsEntry){
            this.getsEntry(env.getsEntry);
        }

        if(env.imagePath){
            this.imagePath(env.imagePath);
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

    thi$._init = function(system){
        System = system;
        arguments.callee.__super__.call(this, {uuid:"runtime"}, this);
    }.$override(this._init);

    this._init.apply(this, arguments);
    
}.$extend(js.util.EventTarget);
