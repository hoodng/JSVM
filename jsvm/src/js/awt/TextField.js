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
 * Author: hudong@dong.hu@china,jinfonet.com
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.awt");

/**
 * 
 */
js.awt.TextField = function(def, Runtime){

    var CLASS = js.awt.TextField, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event,
    System = J$VM.System, MQ = J$VM.MQ, DOM = J$VM.DOM;

    thi$.getMsgType = function(){
        return "js.awt.event.TextFieldEvent";        
    };

    thi$.isEditable = function(){
        return this.view.readOnly == undefined;        
    };

    thi$.setEditable = function(b){
        b = b || false;
        if(b){
            DOM.removeAttribute(this.view, "readOnly");
        }else{
            this.view.readOnly = true;
        }
    };

    thi$.setValue = function(text, notify){
        var view = this.view;

        text = text || "";
        if(text != view.value){
            view.value = text;
            if(notify === true){
                this.notifyPeer(
                    this.getMsgType(), 
                    new Event("changed", text, this));
            }
        }
    };

    thi$.getValue = function(){
        return this.view.value;
    };
    
    thi$.select = function(start, end){
        var textarea = this.view, 
        range, len = textarea.value.length;
        
        if(textarea.setSelectionRange){
            start = !Class.isNumber(start) ? 0 : start;
            end   = !Class.isNumber(end) ? len : end;

            textarea.setSelectionRange(start, end);
        }else{
            range = textarea.createTextRange();
            range.select();
            
            start = !Class.isNumber(start) ? 0 : start;
            end   = !Class.isNumber(end) ? 0 : end - len;

            range.moveStart("character", start);
            range.moveEnd("character", end);
            range.select();
        }

        textarea.focus();
    };
    
    thi$.getSelection = function(){
        return this._local.selection || _getSelection.call(this);
    };
    
    thi$.insert = function(text, selection){
        selection = selection || this.getSelection();

        var value = this.getValue(),
        v0 = value.substring(0, selection.start),
        v1 = value.substring(selection.end), p1 = v1.length;

        value = [v0, v1].join((text || ""));
        this.setValue(value, true);
        p1 = value.length - p1;

        delete this._local.selection;
        this.select(p1, p1);
    };

    var _getSelection = function(){
        var range = {}, textarea = this.view,
        p0 = 0, p1 = 0, text = "", i = 0;
        
        textarea.focus();
        
        if(textarea.setSelectionRange){
            p0 = textarea.selectionStart;
            p1 = textarea.selectionEnd;
            text = (p0 != p1) ? textarea.value.substring(p0, p1) : "";
        }else if(document.selection){
            p0 = document.selection.createRange();
            p1 = p0.duplicate();
            p1.moveToElementText(textarea);
            text = p0.text;
            while(p1.compareEndPoints("StartToStart", p0) < 0){
                p0.moveStart("character", -1);
                i++;
            }
            p0 = i;
            p1 = p0 + text.length;
        }

        range.text = text;
        range.start= p0;
        range.end  = p1;

        return range;
    };
    
    var _onmouseevent = function(e){
        switch(e.getType()){
        case "mousedown":
            delete this._local.selection;
            break;
        case "mouseup":
        case "mouseout":
            this._local.selection = _getSelection.call(this);
            break;
        }
    };

    var _onblur = function(e){
        this.notifyPeer(
            this.getMsgType(), 
            new Event("changed", this.getValue(), this));
    };
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        if(def.multiline === false){
            def.viewType = "INPUT";
        }else{
            def.viewType = "TEXTAREA";
        }

        arguments.callee.__super__.apply(this, arguments);

        if(def.multiline === false){
            this.view.type = "text";
        }
        
        
        var M = this.def, view = this.view;
        this.setValue(M.text);
        this.setEditable(M.editable);
        
        Event.attachEvent(view, "mouseout",  0, this, _onmouseevent);
        Event.attachEvent(view, "mousedown", 0, this, _onmouseevent);
        Event.attachEvent(view, "mouseup",   0, this, _onmouseevent);
        Event.attachEvent(view, "blur",      0, this, _onblur);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Component);

