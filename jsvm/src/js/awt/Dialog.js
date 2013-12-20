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

$import("js.awt.Window");

/**
 * The DialogObject is the interface between dialog entity and 
 * dialog frame.
 */
js.awt.DialogObject = function (){

    var CLASS = js.awt.DialogObject, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM;
    
    /**
     * The data feedback to dialog opener.
     * 
     * Notes: Sub class should implements this function.
     */
    thi$.getDialogData = function(){
        return {};
    };

    /**
     * Validate dialog data
     * 
     * @param okFunc
     */
    thi$.validateData = function(okFunc){
        if(typeof okFunc == "function"){
            okFunc();
        }
    };
    
    /**
     * The message type is a such a string that identify what message
     * will be posted to dialog opener.
     * 
     * Notes: Sub class should implements this function.
     */
    thi$.getDialogMsgType = function(){
        if(!this._local.msgtype){
            this._local.msgtype = js.lang.Math.uuid();
        }

        return this._local.msgtype;
    };

    /**
     * 
     */
    thi$.getHelpID = function(){
        return "";        
    };

    /**
     * Set Dialog window title
     */    
    thi$.setTitle = function(text){
        var dialog = this.getPeerComponent();
        if(dialog instanceof js.awt.Dialog){
            dialog.setTitle(text);
        }
    };

    /**
     * Dialog invoke this method to initialize DialogObject
     */
    thi$.initialize = function(){
    };

};

/**
 * The Dialog is dialog frame, it can holds any DialogObj. 
 */
js.awt.Dialog = function (def, Runtime){

    var CLASS = js.awt.Dialog, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;

    thi$.setDialogObject = function(dialogObj, handler){
        if(!dialogObj || !dialogObj.instanceOf(js.awt.DialogObject))
            throw "Request a js.awt.DialogObj instance";

        dialogObj.id = "dialogObj";
        dialogObj.setPeerComponent(this);
        this.client.addComponent(dialogObj);

        if(handler){
            this._local.handler = handler;
            MQ.register(dialogObj.getDialogMsgType(), this.getPeerComponent(), handler);
        }
    };

    thi$.getDialogObject = function(){
        return this.client.dialogObj;
    };

    thi$.getDialogMsgType = function(){
        var dialogObj = this.client.dialogObj;
        return dialogObj ? dialogObj.getDialogMsgType() : null;
    };

    thi$.getDialogDate = function(){
        var dialogObj = this.client.dialogObj;
        return dialogObj ? dialogObj.getDialogData() : null;
    };
    
    var _showMaskCover = function(b){
        var peer = this.getPeerComponent();
        if(this.def.modal === true){
            if(peer && peer !== this.Runtime()){
                peer.showMaskCover(b);
            }
        }else{
            var event = _buildDialogEvent.call(
                this, b ? "open" : "close", false);
            this.notifyPeer(event.msgId, event);
        }
    };

    thi$.show = function(){
        _showMaskCover.call(this, true);
        
        var x = this.def.x, y = this.def.y, DM = this.Runtime().DM;

        if(x == undefined || y == undefined){
            var pox = DM.getBounds();
            x = (pox.width - this.def.width)*0.5,
            y = (pox.height- this.def.height)*0.5;

            x = x < 0 ? 0:x;
            y = y < 0 ? 0:y;
        }

        DM.addComponent(this);
        this.getDialogObject().initialize();
        if(this.btnpane){
            // Maybe dialogObject modified btnpane, 
            // so need doLayout 
            this.btnpane.doLayout(true);
        }
        this.setPosition(x, y);
    };
    
    /**
     * @see js.awt.Cover
     */
    thi$.showLoading = function(b){
        
        arguments.callee.__super__.apply(this, arguments);
        this.btnpane.showLoading(b);

    }.$override(this.showLoading);

    thi$.onbtnHelp = function(button){
        MQ.post("js.awt.event.ShowHelpEvent", 
                new Event("helpid", this.getDialogObject().getHelpID()));
    };

    thi$.onbtnApply = function(button){
        var obj = this.getDialogObject();
        obj.validateData(
            function(){
                var event = this.buildDialogEvent("apply");
                this.notifyPeer(event.msgId, event, true);
            }.$bind(this));
    };

    thi$.onbtnOK = function(button){
        var obj = this.getDialogObject();
        obj.validateData(
            function(){
                var event = this.buildDialogEvent("ok");
                this.notifyPeer(event.msgId, event, true);
                this.close();
            }.$bind(this));
    };

    thi$.onbtnCancel = function(button){
        var event = this.buildDialogEvent("cancel", false);
        this.notifyPeer(event.msgId, event, true);
        this.close();
    };

    thi$.buildDialogEvent = function(type, hasData){
        var dialogObj = this.client.dialogObj,
        msgId = dialogObj.getDialogMsgType(), 
        data, event;

        if(hasData !== false){
            data = dialogObj.getDialogData();
        }
        event = new Event(type, data, this);
        event.msgId = msgId;

        return event;
    };
    
    thi$.onbtnClose = function(button){
        
        var event = this.buildDialogEvent("close", false);
        this.notifyPeer(event.msgId, event, true);
        
        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.onbtnClose);

    thi$.close = function(){
        var peer = this.getPeerComponent();
        /*
         if(peer){
         peer.getDialogs().remove(this);
         }*/
        
        var handler = this._local.handler;
        if(typeof handler == "function"){
            MQ.cancel(this.getDialogMsgType(), peer, handler);
            delete this._local.handler;
        }

        _showMaskCover.call(this, false);

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.close);

    thi$.destroy = function(){
        var dialogObj = this.client.dialogObj;
        if(dialogObj){
            dialogObj.setPeerComponent(null);
        }

        delete this.opener;

        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);

        var btnpaneDef = newDef.btnpane, item;
        btnpaneDef.className = btnpaneDef.className || newDef.className + "_btnpane";
        (function(name){
             if(name.indexOf("btn") == 0){
                 item = btnpaneDef[name];
                 item.className = item.className || btnpaneDef.className + "_button";
             }
         }).$forEach(this, btnpaneDef.items);

        System.objectCopy(newDef, def, true, true);
        arguments.callee.__super__.apply(this, arguments);

        // For MoverSpot testing
        var restricted = this._local.restricted;

        if(this.btnpane){
            (function(name){
                 if(name.indexOf("btn") == 0){
                     item = this.btnpane[name];
                     item.setPeerComponent(this);
                     restricted.push(item);
                 }
             }).$forEach(this, this.btnpane.def.items);
        }

        restricted.push(this.client);
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Window);

js.awt.AbstractDialogObject = function(def, Runtime){

    var CLASS = js.awt.AbstractDialogObject, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM;

    /**
     * The message type is a such a string that identify what message
     * will be posted to dialog opener.
     * 
     * Notes: Sub class should implements this function.
     */
    thi$.getDialogMsgType = function(){
        if(!this._local.msgtype){
            this._local.msgtype = js.lang.Math.uuid();
        }

        return this._local.msgtype;

    }.$override(this.getDialogMsgType);

    this._init.apply(this, arguments);
    
}.$extend(js.awt.Component).$implements(js.awt.DialogObject);

js.awt.Dialog.DEFAULTDEF = function(){
    return {
        classType : "js.awt.Dialog",
        className : "jsvm_dlg",

        items: [ "title", "client", "btnpane"],

        title: {
            classType: "js.awt.HBox",
            constraints: "north",

            items:["labTitle", "btnHelp", "btnClose"],
            
            labTitle:{
                classType: "js.awt.Label",
                text : "Dialog",
                rigid_w: false,
                rigid_h: false
            },

            btnHelp:{
                classType: "js.awt.Button",
                className: "jsvm_title_button",
                iconImage: "dialog_help.png"
            },
            
            btnClose:{
                classType: "js.awt.Button",
                className: "jsvm_title_button",
                iconImage: "close.png"
            }
        },

        client:{
            classType: "js.awt.Container",
            constraints: "center",

            layout:{
                classType: "js.awt.BorderLayout"
            }
        },

        btnpane:{
            classType: "js.awt.HBox",
            constraints: "south",

            items:["btnApply", "btnOK", "btnCancel"],

            btnApply:{
                classType: "js.awt.Button",
                className: "jsvm_button",
                labelText: "Apply",
                effect: true
            },

            btnOK:{
                classType: "js.awt.Button",
                className: "jsvm_button",
                labelText: "OK",
                effect: true
            },
            
            btnCancel:{
                classType: "js.awt.Button",
                className: "jsvm_button",
                labelText: "Cancel",
                effect: true
            },

            layout:{
                gap: 4,
                align_x : 1.0,
                align_y : 0.0
            }
        },

        modal: true
    };
};

J$VM.Factory.registerClass(js.awt.Dialog.DEFAULTDEF());

js.awt.Dialog.MSGDIALOGDEF = function(){
    return{
        classType : "js.awt.Dialog",
        className : "jsvm_msg",

        items: [ "title", "client", "btnpane"],

        title: {
            classType: "js.awt.HBox",
            constraints: "north",

            items:["labTitle"],
            
            labTitle:{
                classType: "js.awt.Label",
                text : "Dialog"
            }
        },

        client:{
            classType: "js.awt.Container",
            constraints: "center",
            layout:{
                classType: "js.awt.BorderLayout",
                hgap: 0,
                vgap: 0
            }
        },

        btnpane:{
            classType: "js.awt.HBox",
            constraints: "south",

            items:["btnOK"],

            btnOK:{
                classType: "js.awt.Button",
                className: "jsvm_button",
                labelText: "Close",
                effect: true
            },
            
            layout:{
                gap: 4,
                align_x : 1.0,
                align_y : 0.0
            }
        },

        modal: false,
        width: 400,
        height:300,
        prefSize:{width: 400, height:300}
    };
};

J$VM.Factory.registerClass(js.awt.Dialog.MSGDIALOGDEF());

