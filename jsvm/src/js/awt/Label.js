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
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * Define Label component
 * 
 * @param def:{
 *            className: required, css: optional,
 * 
 *            text: optional,
 * 
 *            editable:optional 
 * }
 */
js.awt.Label = function(def, Runtime) {
    
    var CLASS = js.awt.Label, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;

    thi$.getPreferredSize = function(){
        if(this.def.prefSize == undefined 
           && this.isDOMElement()){
            
            var textSize = DOM.getTextSize(this.view),
            d = this.getBounds(),
            w = textSize.width + d.MBP.BPW,
            h = textSize.height+ d.MBP.BPH;

            this.setPreferredSize(w, h);
        }
        
        return this.def.prefSize;

    }.$override(this.getPreferredSize);
    
    thi$.getText = function() {
        return this.def.text;
    };

    /**
     * Sets lable text, only and only if encode == false, the text
     * won't be encoded for html.
     */
    thi$.setText = function(text, encode) {
        this.def.text = text || "";
        this.view.innerHTML = (encode == false) ? 
            this.def.text : js.lang.String.encodeHtml(this.def.text);

        if(!this.isPreferredSizeSet){
            this.def.prefSize = undefined;
            this.getPreferredSize();
        }

    };

    thi$.setEMail = function(text) {
        this.def.text = text || "";
        var mail = document.createElement("A"),
        str = js.lang.String.encodeHtml(this.def.text);
        mail.href = "mailto:" + str;
        this.view.appendChild(mail);
        mail.innerHTML = str;

        if(!this.isPreferredSizeSet){
            this.def.prefSize = undefined;
            this.getPreferredSize();
        }

    };

    thi$.isEditable = function(){
        return this.def.editable || false;
    };

    thi$.setEditable = function(b) {
        b = b || false;

        this.def.editable = b;

        if (b) {
            this.detachEvent("dblclick", 0, this, _onDblClick);
            this.attachEvent("dblclick", 0, this, _onDblClick);
        } else {
            this.detachEvent("dblclick", 0, this, _onDblClick);
        }
    };

    var _onDblClick = function(e){
        if(!this.isEditable()) return;

        e.cancelBubble();
        
        var editor = 
            new (Class.forName("js.awt.LabelEditor"))(this.view, this);

        MQ.register("js.awt.event.LabelEditorEvent", this, _onedit);

        editor.doEdit();
    };
    
    var _onedit = function(e){
        var data = e.getData(); 
        this.setText(data.text, undefined, true);
        e.getEventTarget().destroy();
        MQ.cancel("js.awt.event.LabelEditorEvent", this, _onedit);

        this.notifyContainer(
            "js.awt.event.LabelTextEvent", new Event("changed", {}, this));
        
        this.setChanged();
        this.notifyObservers();
    };

    /**
     * @param keyword: The keyword of the <em>RegExp</em> object which is used 
     *        to matched.
     * @param mode: "global|insensitive|wholeword".
     * @param highlightClass: the style class name for highlighting text.
     */
    thi$.highlightAll = function(keyword, mode, highlightClass) {
        var text = this.getText();
        if (!keyword || !mode || !text)
            return;

        text = js.lang.String.encodeHtml(text);
        //J$VM.System.out.println("Text:" + text);
        keyword = js.lang.String.encodeHtml(keyword);

        var kit = Class.forName("js.swt.SearchKit"),
        pattern = kit.buildRegExp(keyword, mode);
        if(!pattern){
            return;
        }
        
        var className = highlightClass;
        if (!className) {
            className = this.__buf__.clear().append(this.def.className)
                .append("_").append("highlight").toString();
        }

        var newText = text.replace(
            pattern, 
            function(m) {
                return "<span class=\"" + className + "\">" + m + "</span>";
            });

        this.view.innerHTML = newText;
        newText = null;
    };
    
    /**
     * @param matches: <em>Array</em>, each element in it is a object maintained 
     *        each match's start index and its length. Its structure is as follow:
     *        [
     *          {start: m, length: x},
     *          ...
     *          {start: n, length: x}     
     *        ]
     *
     * @param highlightClass: the style class name for highlighting text.
     */
    thi$.highlightMatches = function(matches, highlightClass) {
        var text = this.getText();
        if (!C.isString(text)) return;

        var className = highlightClass;
        if (!className) {
            className = this.__buf__.clear().append(this.def.className)
                .append("_").append("highlight").toString();
        }

        var rpSeg = new js.lang.StringBuffer(), subStr = null,
        mCnt = matches ? matches.length : 0, aMatches = null,
        vernier = 0;
        
        for(var i = 0; i < mCnt; i++){
            aMatches = matches[i];
            if(aMatches.start > vernier){
                subStr = text.substring(vernier, aMatches.start);
                subStr = js.lang.String.encodeHtml(subStr);
                rpSeg.append(subStr);
                
                subStr = text.substr(aMatches.start, aMatches.length);
                subStr = js.lang.String.encodeHtml(subStr);
                subStr = "<span class=\"" + className + "\">" + subStr + "</span>";
                rpSeg.append(subStr);
                
                vernier = aMatches.start + aMatches.length;
            }else if(aMatches.start == vernier){
                subStr = text.substr(aMatches.start, aMatches.length);
                subStr = js.lang.String.encodeHtml(subStr);
                subStr = "<span class=\"" + className + "\">" + subStr + "</span>";
                rpSeg.append(subStr);
                
                vernier = aMatches.start + aMatches.length;
            }else{
                //Error
            }
        }
        
        if(vernier <= text.length){
            subStr = text.substr(vernier);
            subStr = js.lang.String.encodeHtml(subStr);
            rpSeg.append(subStr);
        }

        this.view.innerHTML = rpSeg.toString();
        rpSeg = null;
    };

    thi$.doLayout = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            this.view.style.lineHeight = DOM.innerHeight(this.view) + "px";
            return true;            
        }

        return false;
    }.$override(this.doLayout);

    
    thi$._init = function(def, Runtime) {
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Label";
        def.className = def.className || "jsvm_label";
        def.css = (def.css || "") + "margin:0px;white-space:nowrap;";
        def.text = typeof def.text == "string" ? def.text : "Label";
        def.viewType = "SPAN";

        arguments.callee.__super__.apply(this, arguments);
        
        this.setText(this.def.text, true);
        this.setEditable(this.def.editable);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Component);

