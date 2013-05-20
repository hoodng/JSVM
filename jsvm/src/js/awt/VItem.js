/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * @File: VItem.js
 * @Create: 2013/03/20 03:41:31
 * @Author: mingfa.pan@china.jinfonet.com
 */

$package("js.awt");
$import("js.awt.CanvasLabel");

js.awt.VItem = function(def, Runtime){
    var CLASS = js.awt.VItem,
    thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event,
    LList = js.util.LinkedList, 
    DOM = J$VM.DOM, System = J$VM.System;
    
    thi$.setIconImage = function(state){
        var buf = this.__buf__.clear();
        buf.append(this.Runtime().imagePath())
            .append(state & 0x0F).append("-")
            .append(this.getIconImage());
        
        this.icon.src = buf.toString();
    };
    
    thi$.getIconImage = function(){
        return this.def.iconImage || "blank.gif";  
    };

    /**
     * Set the contents of current item. 
     */    
    thi$.setText = function(text){
        if(Class.isString(text)){
            this.def.labelText = text;
            
            if(this.label){
                if(this.canvasLabel){
                    this.label.setText(text);
                }else{
                    this.label.innerHTML = js.lang.String.encodeHtml(text);
                }
            }
        }
    };
    
    thi$.getText = function(){
        var text = this.def.labelText;
        if(this.label){
            if(this.canvasLabel){
                text = this.canvasLabel.getText();
            }
        }

        return text;        
    };
    
    thi$.isMarkable = function(){
        return this.def.markable === true;  
    };
    
    thi$.isControlled = function(){
        return this.def.controlled === true;  
    };
    
    thi$.isMarked = function(){
        return this._local.marked = true;  
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
    
    thi$.triggerCtrl = function(b){
        var ctrl = this.ctrl;
        if(!ctrl) return;
        
        if(b){
            ctrl.className = this.className + "_ctrl_4";
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
     * @see js.awt.Item #getPreferredSize
     */
    thi$.getPreferredSize = function(){
        var M = this.def;
        if(M.prefSize == undefined){
            var G = this.getGeometric(), nodes = this.view.childNodes,
            ele, D, MBP, w = 0, h, csize;
            
            for(var i = 0, len = nodes.length; i < len; i++){
                ele = nodes[i];
                if(ele.tagName == "CANVAS"){
                    D = G.label;
                    csize = this.canvasLabel.getPreferredSize();
                    w = Math.max(w, csize.width);
                    h = ele.offsetTop + csize.height;
                    
                    if(D && D.MBP){
                        h += D.MBP.marginBottom;
                    }
                }else if(ele.tagName == "SPAN"){
                    D = G.label;
                    csize = DOM.getTextSize(ele);
                    w = Math.max(w, csize.width);
                    h = ele.offsetTop + csize.height;
                    
                    if(D && D.MBP){
                        h += D.MBP.marginBottom;
                    }

                }else{
                    w = Math.max(w, ele.scrollWidth);
                }
            }
            
            D = G.ctrl;
            if(D){
                h += D.MBP.marginTop + D.height + D.MBP.marginBottom;
            }
            
            D = this.getBounds();
            MBP = D.MBP;
            
            w += MBP.BPW;
            h += MBP.BPH;
            
            this.setPreferredSize(w, h);
        }            
        
        return M.prefSize; 
        
    }.$override(this.getPreferredSize);
    
    thi$.repaint = function(){
        // Nothing to do        
    }.$override(this.repaint);
    
    thi$.doLayout = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            if(!this.label) return true;
            
            var M = this.def, items = M.items, 
            G = this.getGeometric(), bounds = this.getBounds(), 
            h = bounds.innerHeight, measure = 0, iid, D, MBP;
            
            for(var i = 0, len = items.length; i < len; i++){
                iid = items[i];
                D = G[iid];
                if(iid == "label"){
                    MBP = D.MBP;
                    if(MBP && !isNaN(MBP.marginTop)){
                        measure += MBP.marginTop;
                    }

                    if(MBP && !isNaN(MBP.marginBottom)){
                        measure += MBP.marginBottom;
                    }
                    
                    continue;
                }
                
                if(D && !isNaN(D.height)){
                    measure += D.height;
                    
                    MBP = D.MBP;
                    if(MBP && !isNaN(MBP.marginTop)){
                        measure += MBP.marginTop;
                    }
                    
                    if(MBP && !isNaN(MBP.marginBottom)){
                        measure += MBP.marginBottom;
                    }
                }
            }
            
            h -= measure;
            
            if(this.canvasLabel){
                this.canvasLabel.setHeight(h);
            }else{
                this.label.style.height = height + "px";
            }      
            
            return true;
        }
        
        return false;
        
    }.$override(this.doLayout);
    
    thi$.destroy = function(){
        if(this.canvasLabel){
            this.canvasLabel.destroy();
            delete this.canvasLabel;
        }
        
        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);
    
    var _setLayoutMode = function(mode){
        mode = Class.isNumber(mode) ? mode : parseInt(mode);
        switch(mode){
        case 1: // From top to bottom
            this._local.layoutMode = 1;
            this._local.writeMode = "tb"; 
            break;
            
        case 2: // From bottom to top
            this._local.layoutMode = 2;
            this._local.writeMode = "bt";
            break;
            
        default:
            this._local.layoutMode = 0;
            this._local.writeMode = "normal";
        }
    };
    
    var _checkItems = function(def){
        var items = def.items;
        
        if(items.length > 0){
            return def;
        }
        
        if(def.markable === true){
            items.push("marker");
        }
        
        if(def.iconic !== false){
            items.push("icon");
        }
        
        if(Class.isString(def.labelText)){
            items.push("label");
        }
        
        if(def.controlled === true){
            items.push("ctrl");
        }
        
        // if(this._local.layoutMode == 2){
        //  items = items.reverse();
        //  def.items = LList.$decorate(items);  
        // }
        
        return def;
    };
    
    var _createElements = function(){
        var G = this.getGeometric(), M = this.def, MBP = G.bounds.MBP,
        xbase = MBP.paddingLeft, ybase = MBP.paddingTop,
        width = G.bounds.BBM ?
            G.bounds.width : G.bounds.width - MBP.BPW,
        height = G.bounds.BBM ? 
            G.bounds.height : G.bounds.height - MBP.BPH,
        innerWidth = width - MBP.BPW,
        innerHeight = height - MBP.BPH,
        className = this.className, body = document.body,
        items = M.items, ele, id, iid, viewType, cdef, i, len, D,
        left = xbase, top = ybase, bottom = MBP.paddingBottom, 
        buf = this.__buf__;
        
        this.view.style.width = G.bounds.BBM 
            ? (width + "px") : (innerWidth + "px");
        
        for(i = 0, len = items.length; i < len; i++){
            id = items[i];
            iid = id.split(/\d+/g)[0];
            switch(iid){
            case "icon":
                viewType = "IMG";
                break;
            case "label":
                viewType = (M.useSpan === true) ? "SPAN" : "CANVAS";
                break;
            default:
                viewType = "DIV";
                break;
            }
            
            if(viewType == "CANVAS"){
                cdef = {
                    className: className + "_" + id,
                    labelText: this.getText(), 
                    writeMode: this._local.writeMode,
                    align_x: M.hTextAlign,
                    align_y: M.vTextAlign
                };
                this.canvasLabel = new js.awt.CanvasLabel(cdef, this.Runtime(), this.view);
                ele = this.canvasLabel.view;
                G[iid] = this.canvasLabel.getBounds();
            }else{
                ele = DOM.createElement(viewType);
            }
            
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
            left = Math.floor(xbase + (innerWidth - D.width) * 0.5);
            buf.append("left:").append(left).append("px;");
            if(iid !== "ctrl"){
                if(this._local.layoutMode == 2){
                    bottom += D.MBP.marginBottom;
                    buf.append("bottom:").append(bottom).append("px;");
                    bottom += D.height + D.MBP.marginTop;
                }else{
                    top += D.MBP.marginTop;
                    buf.append("top:").append(top).append("px;");
                    top += D.height + D.MBP.marginBottom;
                }
            }else{
                if(this._local.layoutMode == 2){
                    buf.append("top:")
                        .append(MBP.paddingTop).append("px;");
                }else{
                    buf.append("bottom:")
                        .append(MBP.paddingBottom).append("px;");
                }
            }
            
            if(viewType == "SPAN"){
                buf.append("white-space:nowrap;");
            }
            
            ele.style.cssText = buf.toString();
            DOM.appendTo(ele, this.view);
        }
        
    };
    
    thi$._init = function(def, Runtime, view){
        if(typeof def !== "object") return;
        
        def.classType = def.classType || "js.awt.VItem";
        def.className = def.className || "jsvm_vitem";
        def.markable = def.markable === true;
        
        arguments.callee.__super__.apply(this, [def, Runtime, view]);   
        def.items = LList.$decorate(def.items || []);
        
        var text = Class.isString(def.labelText) 
            ? def.labelText : (Class.isString(def.text) ? def.text : "Item");
        def.labelText = text;
        
        _setLayoutMode.call(this, def.layoutMode);
        
        if(view == undefined){
            _checkItems.call(this, def);
            _createElements.call(this);
        }
        
        def.items.clear();
        var uuid = this.uuid(), nodes = this.view.childNodes,
        id, i, len, node;
        for(i = 0, len = nodes.length; i < len; i++){
            node = nodes[i];
            id = node.id;
            node.uuid = uuid;
            node.iid = (node.iid || id.split(/\d+/g)[0]);
            def.items.push(id);
            this[id] = node;
        }
        
        if(this.icon){
            this.setIconImage(this.isTriggered() ? 4 : 0);
        }
        
        if(this.isMarkable()){
            this.mark(def.checked);
        }
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
}.$extend(js.awt.Component);
