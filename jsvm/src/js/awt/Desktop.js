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

$import("js.awt.Container");

js.awt.Desktop = function (Runtime){

    var CLASS = js.awt.Desktop, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ =J$VM.MQ, Factory = J$VM.Factory;

    /**
     * Popup message box
     *
     * @see js.lang.Runtime
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

        this.openDialog(
            "message",
            rect || {},
            new js.awt.MessageBox(msgbox, this),
            handler);

    }.$override(this.message);

    var _registerMessageClass = function(){
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
                width: 354,
                height: 150,
                miniSize: {width:354, height:150},
                resizable: true
            }
        );
    };

    var _activateComponent = function(target, uuid){
        if(!target) return;

        if(target.activateComponent){
            target.activateComponent();
        }
    };

    var _notifyLM = function(e){
        if(e){
            var el = e.srcElement, target = e.getEventTarget(),
                uuid = el ? el.uuid : undefined;
            this.LM.cleanLayers(e, this);
            _activateComponent(target, uuid);
        }
        return true;
    };

    var _notifyComps = function(msgid, e){
        var comps = this.getAllComponents(),
            len = comps ? comps.length : 0,
            i, comp, recs = [];

        for(i = 0; i < len; i++){
            comp = comps[i];
            recs.push(comp.uuid());
        }

        if(recs.length > 0){
            MQ.post(msgid, e, recs);
        }
    };

    var bodyW, bodyH;
    var _onresize = function(e){
        System.updateLastAccessTime();

        var bounds = DOM.getBounds(document.body), evt;
        if(bounds.width != bodyW || bounds.height != bodyH){
            evt = new Event(Event.W3C_EVT_RESIZE,
                            {owidth: bodyW, oheight: bodyH,
                             width: bounds.width, height: bounds.height});
            
            _notifyComps.call(this, "js.awt.event.WindowResized", evt);

            this.LM.clearStack(e);
            
            bodyW = bounds.width;
            bodyH = bounds.height;

            for(var appid in apps){
                this.getApp(appid).doLayout(true);
            }
        }
    };

    var _onkeyevent = function(e){
        System.updateLastAccessTime();
        J$VM.MQ.post("js.awt.event.KeyEvent", e);
    };

    var _onmouseevent = function(e){
        System.updateLastAccessTime();
        J$VM.MQ.post("js.awt.event.MouseEvent", e);
        
        switch(e.getType()){
            case Event.W3C_EVT_MOUSE_DOWN:
            case Event.W3C_EVT_MOUSE_WHEEL:
            return _notifyLM.call(this, e);

            case Event.W3C_EVT_CONTEXTMENU:
            e.cancelBubble();
            return e.cancelDefault();
            
            default:
            break;
        }
    };
    
    var _onmessage = function(e){
        var _e = e.getData();
        if(_e.source == self) return;

        var msg;
        try{
            msg = JSON.parse(_e.data);
        } catch (x) {
        }

        if(Class.isArray(msg)){
            e.message = msg[1];
            J$VM.MQ.post(msg[0], e, msg[2], null, msg[4]);
        }
    };

    var apps = {};

    thi$.getApps = function(){
        return apps;
    };
    
    thi$.getApp = function(id){
        return apps[id];
    }

    thi$.createApp = function(classType, entryId){
        var appClass = Class.forName(classType), app;
        app = new (appClass)(null, Runtime, entryId);
        apps[app.getAppID()] = app;
        return app;
    };

    thi$.registerApp = function(id, app){
        apps[id] = app;
    };

    thi$.closeApp = function(id){
        delete apps[id];
    };
    
    thi$.showCover = function(b, style){
        arguments.callee.__super__.call(
            this, b, style || "jsvm_desktop_mask");
        if(b){
            this.setCoverZIndex(_getMaxZIndex.call(this)+1);
        }
    }.$override(this.showCover);

    
    var _getMaxZIndex = function(){
        var children = this.view.children, zIndex = 0, tmp, e;
        for(var i=0, len=children.length; i<len; i++){
            e = children[i];
            tmp = parseInt(DOM.currentStyles(e, true).zIndex);
            tmp = Class.isNumber(tmp) ? tmp : 0;
            zIndex = Math.max(zIndex, tmp);
        }
        return zIndex;
    };

    var styles = ["jsvm.css"];
    /**
     * @param files {Array} Array of style file names
     */
    thi$.registerStyleFiles = function(files){
        if(Class.isArray(files)){
            for(var i=0, len=files.length; i<len; i++){
                styles.push(files[i]);
            }
        }
    };

    thi$.updateTheme = function(theme, old){
        for(var i=0, len=styles.length; i<len; i++){
            this.updateThemeCSS(theme, styles[i]);
        }
        DOM.applyStyleSheet("__apply__", "", true);
        this.updateThemeImages(theme, old);
    };

    var IMGSREG = /images\//gi;
    
    thi$.updateThemeCSS = function(theme, file){
        var stylePath = DOM.makeUrlPath(J$VM.j$vm_home, "../style/" + theme + "/"),
            styleText = Class.getResource(stylePath + file, true);

        styleText = styleText.replace(IMGSREG, stylePath+"images/");
        DOM.applyStyleSheet(file, styleText);
    };

    thi$.updateThemeLinks = function(theme, old, file){
        var dom = self.document, links, link, src, path, found;
        
        path = DOM.makeUrlPath(J$VM.j$vm_home,
                               "../style/"+ old +"/");

        links = dom.getElementsByTagName("link");
        for(var i=0, len=links.length; i<len; i++){
            link = links[i];
            src = decodeURI(link.href);
            if (src && src.indexOf(path) != -1){
                src = src.replace(old, theme);
                link.href = src;
                found = true;
            }
        }

        if(!found){
            link = dom.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = DOM.makeUrlPath(J$VM.j$vm_home, "../style/"+theme+"/"+file);
            DOM.insertBefore(link, dom.getElementById("j$vm"));
        }
    };

    thi$.updateThemeImages = function(theme, old){
        var dom = self.document, links, link, src, path;
        
        path = DOM.makeUrlPath(J$VM.j$vm_home,
                               "../style/"+ old +"/images/");
        
        links = dom.getElementsByTagName("img");
        for(var i=0, len=links.length; i<len; i++){
            link = links[i];
            src = decodeURI(link.src);
            if (src && src.indexOf(path) != -1){
                src = src.replace(old, theme);
                link.src = src;
            }
        }
    };
    
    /**
     * @see js.awt.BaseComponent
     */
    thi$.destroy = function(){
        for(var app in apps){
            app.closeApp();
            app.destroy();
        }
        apps = null;

        this.DM.destroy();
        this.DM = null;

        this.LM.destroy();
        this.LM = null;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$._init = function(Runtime){
        var dom = self.document, body = dom.body,        
            def = {
                classType: "js.awt.Desktop",
                className: body.className,
                id: body.id,
                uuid: "desktop",
                zorder:true,
                stateless: true,            
                zbase:1,
                __contextid__: Runtime.uuid()
            };

        arguments.callee.__super__.apply(this, [def, Runtime, body]);

        // Popup Layer manager
        var LM = this.LM = new js.awt.LayerManager(
            {classType: "js.awt.LayerManager",
             className: body.className,
             id: body.id,
             zorder:true,
             stateless: true,
             zbase: 10000
            }, Runtime, body);

        // Popup dialog manager
        var DM = this.DM = new js.awt.Container(
            {classType: "js.awt.Container",
             className: body.className,
             id: body.id,
             zorder:true,
             stateless: true,
             zbase: 1000
            }, Runtime, body);

        DM.destroy = function(){
            this.removeAll(true);

        }.$override(DM.destroy);

        var styleText = Class.getResource(
            J$VM.j$vm_home + "../style/jsvm_reset.css", true);
        DOM.applyStyleSheet("jsvm_reset.css", styleText);
        
        Event.attachEvent(self, Event.W3C_EVT_RESIZE, 0, this, _onresize);
        Event.attachEvent(self, Event.W3C_EVT_MESSAGE,0, this, _onmessage);

        Event.attachEvent(dom,  Event.W3C_EVT_KEY_DOWN,   0, this, _onkeyevent);
        Event.attachEvent(dom,  Event.W3C_EVT_KEY_UP,     0, this, _onkeyevent);
        
        Event.attachEvent(dom,  Event.W3C_EVT_MOUSE_MOVE, 0, this, _onmouseevent);
        Event.attachEvent(dom,  Event.W3C_EVT_MOUSE_DOWN, 0, this, _onmouseevent);       
        Event.attachEvent(dom,  Event.W3C_EVT_MOUSE_WHEEL,0, this, _onmouseevent);
        Event.attachEvent(dom,  Event.W3C_EVT_CONTEXTMENU,0, this, _onmouseevent);
        
        MQ.register("js.awt.event.LayerEvent", this, _notifyLM);

        //_registerMessageClass.call(this);
        //_registerConfirmClass.call(this);

        // Confirm message box with "Yes", "No" and "Cancel"
        // Widely used in WebReport Studio for insteading jConfirm2
        //_registerConfirm2Class.call(this);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

