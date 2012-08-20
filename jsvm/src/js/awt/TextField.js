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

    thi$.isEditable = function(){
        return this.view.readOnly != undefined;        
    };

    thi$.setEditable = function(b){
        b = b || false;
        if(b){
            this.view.readOnly = true;
        }else{
            DOM.removeAttribute(this.view, "readOnly");
        }
    };

    thi$.setText = function(text){
        this.def.text = text || "";
        this.view.value = text;
    };

    thi$.getText = function(){
        return this.def.text;
    };

    thi$.getSelection = function(){
        var data = {text:"", start:0, end:0}, 
        textarea = this.view, doc = self.document, p0, p1;
        
        textarea.focus();

        if(textarea.setSelectionRange){
            // W3C
            p0 = data.start = textarea.selectionStart;
            p1 = data.end = textarea.selectionEnd;
            data.text = (p0 != p1) ? 
                textarea.value.substring(p0, p1) : "";
        }else if(doc.selection){
            // IE
            
        }
        
    };

    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.viewType = "textarea";
        
        arguments.callee.__super__.apply(this, arguments);
        
        var M = this.def;
        this.setText(M.text);
        this.setEditable(M.editable);
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Component);

