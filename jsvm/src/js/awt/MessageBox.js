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

$import("js.awt.Component");
$import("js.awt.Dialog");

/**
 * def :{
 * 
 *     model:{
 *        msgType:    info|warn|error|confirm
 *        msgSubject: Any string
 *        msgContent: Any string
 *     }
 * }
 */
js.awt.MessageBox = function(def, Runtime){

    var CLASS = js.awt.MessageBox, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ, Str = js.lang.String,
    icons = {
        info : "info.gif",
        warn : "alert.gif",
        error : "error.gif",
        confirm : "confirm.gif"
    };

    /**
     * The data feedback to dialog opener.
     * 
     * Notes: Sub class should implements this function.
     */
    thi$.getDialogData = function(){
        return this.def.model;
    }.$override(this.getDialogData);

    /**
     * @see js.awt.Component
     */
    thi$.doLayout = function(force){
        if(arguments.callee.__super__.apply(this, arguments)){
            var bounds = this.getBounds(), icon = this.icon, 
            label = this.label, text = this.text, h;
            
            DOM.setSize(label,
                        bounds.innerWidth - label.offsetLeft);
            h = icon.offsetHeight - label.offsetHeight;
            h = icon.offsetTop + (h > 0 ? h/2 : 0);
            DOM.setPosition(label, undefined, h);

            DOM.setSize(text,
                        bounds.innerWidth - text.offsetLeft, 
                        bounds.innerHeight  - text.offsetTop);

            return true;
        }

        return false;

    }.$override(this.doLayout);

    thi$.initialize = function(){
        var title = "", R = this.Runtime();
        switch(this.def.model.msgType){
        case "info":
            title = R.nlsText("msgDlgInfoTitle", "Information");
            break;
        case "warn":
            title = R.nlsText("msgDlgWarnTitle", "Warning");
            break;
        case "error":
            title = R.nlsText("msgDlgErrTitle", "Error");
            break;
        case "confirm":
            title = R.nlsText("msgDlgConfirmTitle", "Confirm");
            break;
        }
        this.setTitle(title);

    }.$override(this.initialize);

    var _createElements = function(model){
        var icon, label, text, R = this.Runtime();

        icon = this.icon = DOM.createElement("IMG");
        icon.className = "msg_icon";
        icon.src = R.imagePath() + icons[model.msgType];
        this.view.appendChild(icon);

        label = this.label = DOM.createElement("SPAN");
        label.className = "msg_subject";
        label.innerHTML = model.msgSubject;
        this.view.appendChild(label);

        text = this.text = DOM.createElement("TEXTAREA");
        text.className = "msg_content";
        text.readOnly = "true";
        text.innerHTML = model.msgContent;
        this.view.appendChild(text);
    };

    thi$._init = function(def, Runtime){

        def.classType = def.classType || "js.awt.MessageBox";
        def.className = def.className || "jsvm_msg";

        arguments.callee.__super__.apply(this, arguments);

        var model = this.def.model || {
            msgType:    "info",
            msgSubject: "Info subject",
            msgContent: "Info content"
        };

        _createElements.call(this, model);
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(js.awt.DialogObject);

js.awt.MessageBox.INFO = "info";
js.awt.MessageBox.WARN = "warn";
js.awt.MessageBox.ERROR= "error";
js.awt.MessageBox.CONFIRM = "confirm";

