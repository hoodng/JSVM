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
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.awt");

/**
 * Label editor
 * 
 * @param listener
 * @param label
 * 
 */
js.awt.LabelEditor = function(label, listener) {
    
    var CLASS = js.awt.LabelEditor, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    var styles = [
        "position", "top", "left",
        "font-family", "font-size", "font-style", "font-weight",
        "text-decoration", "text-align", "font-weight",
        "color", "background-color",
        "padding-top", "padding-right", "padding-bottom", "padding-left",
        "border-top-width", "border-right-width", 
        "border-bottom-width", "border-left-width",
        "border-top-style", "border-right-style",
        "border-bottom-style", "border-left-style",
        "border-top-color", "border-right-color",
        "border-bottom-style", "border-left-color"
    ];

    thi$.doEdit = function(){

        var input = this.input = DOM.createElement("INPUT"), 
        label = this.label;

        input.type = "text";
        input.style.cssText = "outline:none;display:none";
        DOM.insertBefore(input, label);
        
        DOM.applyStyles(input, DOM.getStyles(label, styles));
        DOM.setSize(input, label.offsetWidth, label.offsetHeight);
        if(J$VM.ie){
            DOM.applyStyles(input, {lineHeight:DOM.getStyle(label, "line-height")});    
        }

        input.value = this.text;
        input.style.display = "block";
        input.focus();
        label.style.display = "none";

        Event.attachEvent(input, "blur", 0, this, _onblur);
        Event.attachEvent(input, "keydown", 0, this, _onkeydown);
        Event.attachEvent(input, "mousedown", 0, this, _oninputmsdown);

        Event.detachEvent(document, Event.W3C_EVT_SELECTSTART, 1);
        
    };
    
    var _onblur = function(e){
        _doChange.call(this);

        return e.cancelDefault();
    };
    
    var _onkeydown = function(e){
        var c = e.keyCode;
        if (c == 13) {
            _doChange.call(this);
        }

        return true;
    };

    var _oninputmsdown = function(e){
        e.cancelBubble();
    };

    var _doChange = function() {
        if(this.input.value != this.text){
            var label = this.label, recvs = [];
            if(this.listener) recvs.push(this.listener.uuid());
            
            MQ.post("js.awt.event.LabelEditorEvent", 
                    new Event("changed", 
                              {label: label, text:this.input.value}, 
                              this),
                    recvs);
        }

        DOM.forbidSelect(this.input);
        DOM.remove(this.input, true);
        delete this.input;
        this.label.style.display = "block";
        delete this.label;
        delete this.text;
    };
    
    thi$._init = function(label, listener) {
        arguments.callee.__super__.apply(this, arguments);

        this.listener = listener;
        this.label = label;
        this.text = js.lang.String.decodeHtml(label.innerHTML);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.util.EventTarget);



