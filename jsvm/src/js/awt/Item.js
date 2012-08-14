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

/**
 * @param def :{
 *     
 *     markable: true/false. If true will create a marker element.
 *     iconImage: icon image name
 *     labelText: label text
 *     inputText: input value
 *     controlled : true/false. If true will create a control element.
 * 
 * }
 */
js.awt.Item = function(def, Runtime, view){

    var CLASS = js.awt.Item, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    /**
     * @see js.awt.BaseComponent
     */
    thi$.getPreferredSize = function(){
        if(this.def.prefSize == undefined){
            var G = this.getGeometric(), nodes = this.view.childNodes,
            ele1 = nodes[nodes.length-2], ele0 = nodes[nodes.length -1],
            width;
            
            if(ele0.tagName == "SPAN"){
                ele0.style.width = "0px";
                width = ele0.offsetLeft + ele0.scrollWidth;
            }else{
                if(ele1.tagName == "SPAN"){
                    ele1.style.width = "0px";
                }
                width = ele1.offsetLeft + ele1.scrollWidth;
                width += G.ctrl.MBP.marginLeft + G.ctrl.width;
            }
            width += G.bounds.MBP.BPW;

            this.setPreferredSize(width, 
                                  G.bounds.height - (G.bounds.BBM ? 0 : G.bounds.MBP.BPH));

        }
        return this.def.prefSize;
    };
    
    thi$.getIconImage = function(){
        return this.def.iconImage || "blank.gif";
    };
    
    thi$.setIconImage = function(state){
        var buf = this.__buf__.clear();
        buf.append(this.Runtime().imagePath())
            .append(state & 0x0F).append("-")
            .append(this.getIconImage());

        this.icon.src = buf.toString();
    };

    thi$.setText = function(text){
        if(this.label){
            this.def.labelText = text;
            this.label.innerHTML = js.lang.String.encodeHtml(text);    
        }else if(this.input){
            this.def.inputText = text;
            this.input.value = text;
        }
    };
    
    thi$.getText = function(){
        if(this.label){
            return this.def.labelText;
        }else if(this.input){
            return this.def.inputText;
        }
        return undefined;
    };

    thi$.isMarkable = function(){
        return this.def.markable === true;        
    };
    
    thi$.isControlled = function(){
        return this.def.controlled === true;
    };
    
    thi$.isMarked = function(){
        return this._local.marked === true;
    };
    
    thi$.mark = function(b){
        var marker = this.marker;
        if(!marker) return;

        b = b || false;        
        this._local.marked = b;

        if(this.isMarked()){
            marker.className = this.className + "_marker_4";
        }else{
            marker.className = this.className + "_marker_0";
        }
    };
    
    thi$.hoverCtrl = function(b){
        var ctrl = this.ctrl;
        if(!ctrl) return;
        
        if(b){
            ctrl.className = this.className + "_ctrl_2";
        }else{
            ctrl.className = this.className + "_ctrl_0";
        }
    };
    
    /**
     * @see js.awt.BaseComponent#setToolTipText
     * 
     * @param text
     * @param elid, can be branch, marker label and ctrl
     */
    thi$.setToolTipText = function(text, elid){
        if(elid){
            DOM.setAttribute(this[elid], "title", text);
        }else{
            arguments.callee.__super__.apply(this, [text]);
        }
    }.$override(this.setToolTipText);
    
    /**
     * @see js.awt.Movable
     */    
    thi$.isMoverSpot = function(el, x, y){
        return (el != this.branch && 
                el != this.marker && 
                el !== this.ctrl);
    };
    
    /**
     * @see js.awt.BaseComponent
     */
    thi$.doLayout = function(){
        var ele = this.label || this.input,
        maxWidth = this.ctrl ? this.ctrl.offsetLeft : 
            this.getBounds().innerWidth,
        width = maxWidth - ele.offsetLeft;
        width = width < 0 ? 0 : width;

        ele.style.width = width + "px";

    }.$override(this.doLayout);
    
    /**
     * @see js.awt.BaseComponent
     */
    thi$.repaint = function(){
        // Nothing to do
    }.$override(this.repaint);
    
    thi$.isEditable = function(){
        return this.label && this.def.editable || false;
    };

    thi$.editLabel = function(){
        if(!this.isEditable()) return;
        
        var editor = 
            new (Class.forName("js.awt.LabelEditor"))(this.label, this);

        MQ.register("js.awt.event.LabelEditorEvent", this, _onedit);

        editor.doEdit();
    };
    
    var _onedit = function(e){
        var data = e.getData(); 
        this.setText(data.text);
        e.getEventTarget().destroy();
        MQ.cancel("js.awt.event.LabelEditorEvent", this, _onedit);

        this.notifyContainer(
            "js.awt.event.ItemTextEvent", new Event("changed", {}, this));
    };
    
    thi$.canCloneView = function(itemDef){
        var items = [];
        if(itemDef.markable === true) items.push("marker");
        if(itemDef.iconImage) items.push("icon");
        if(itemDef.labelText) items.push("label");
        if(itemDef.inputText) items.push("input");
        if(itemDef.controlled === true) items.push("ctrl");

        return items.length === this.def.items.length;
    };

    var _createElements = function(){
        var G = this.getGeometric(), M = this.def, 
        xbase = G.bounds.MBP.paddingLeft, ybase = G.bounds.MBP.paddingTop,
        height = G.bounds.BBM ? 
            G.bounds.height : G.bounds.height - G.bounds.MBP.BPH,
        innerHeight = height - G.bounds.MBP.BPH,
        className = this.className, body = document.body,
        items = M.items, ele, id, iid, viewType, i, len, D, 
        left = xbase, top, buf = this.__buf__;
        
        this.view.style.height = G.bounds.BBM ?
            (height + "px") : (innerHeight+"px");

        for(i=0, len=items.length; i<len; i++){
            id = items[i];
            iid = id.split(/\d+/g)[0];
            switch(iid){
            case "icon":
                viewType = "IMG";
                break;
            case "label":
                viewType = "SPAN";
                break;
            case "input":
                viewType = "INPUT";
                break;
            default:
                viewType = "DIV";
                break;
            }

            ele = DOM.createElement(viewType);
            ele.id = id;
            ele.className = className + "_" + id;
            ele.iid = iid;
            
            if(!G[iid]){
                ele.style.cssText = 
                    "position:absolute;white-space:nowrap;visibility:hidden;";
                DOM.appendTo(ele, body);
                G[iid] = DOM.getBounds(ele);
                DOM.removeFrom(ele);
                ele.style.cssText = "";
            }
            
            D = G[iid];

            buf.clear();
            buf.append("position:absolute;");
            top = ybase + (innerHeight - D.height)*0.5;
            buf.append("top:").append(top).append("px;");
            if(iid !== "ctrl"){
                buf.append("left:").append(left).append("px;");
                left += D.width + D.MBP.marginRight;                
            }else{
                buf.append("right:")
                    .append(G.bounds.MBP.paddingRight).append("px;");
            }
            
            if(iid == "label"){
                buf.append("white-space:nowrap;");
            }
            
            ele.style.cssText = buf.toString();

            DOM.appendTo(ele, this.view);
        }
    };
    
    var _checkItems = function(){
        var M = this.def, items = M.items;
        if(items.length == 0){
            if(this.isMarkable()) items.push("marker");
            if(M.iconImage) items.push("icon");
            if(M.labelText) items.push("label");
            if(M.inputText) items.push("input");
            if(this.isControlled()) items.push("ctrl");
        }
    };

    thi$._init = function(def, Runtime, view){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Item";
        def.className = def.className || "jsvm_item";

        arguments.callee.__super__.apply(this, [def, Runtime, view]);
        
        def.items = def.items || [];

        // Create inner elements
        if(view == undefined){
            _checkItems.call(this);
            _createElements.call(this);
        }
        
        if(!def.items.clear){
            js.util.LinkedList.$decorate(def.items);    
        }
        
        def.items.clear();
        var uuid = this.uuid(), nodes = this.view.childNodes, 
        id, i, len, node;
        for(i=0, len=nodes.length; i<len; i++){
            node = nodes[i]; id = node.id;
            node.uuid = uuid;
            node.iid = (node.iid || id.split(/\d+/g)[0]);
            def.items.push(id);
            this[id] = node;
        }

        if(this.icon){
            this.setIconImage(this.isTriggered() ? 4:0);
            //DOM.forbidSelect(this.icon);
        }
        
        if(this.label || this.input){
            this.setText(def.labelText || def.inputText || 
                         def.text || def.name || def.dname || 
                         "Item");
        }

        if(this.isMarkable()){
            this.mark(def.checked === true);
        }

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Component);

