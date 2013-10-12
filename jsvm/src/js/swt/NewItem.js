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
 * File: NewItem.js
 * Create: 2013/07/26 06:17:56
 * Author: PanMingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://github.com/jsvm
 */

$package("js.swt");

/**
 * Define the NewItem to support the virtual item with CanvasLabel.
 * 
 * @param def: {
 *     classType: "js.swt.NewItem",
 *     className: "jsvm_nitem",
 * 
 *     iconic: true/false,
 *     byBgImage: true/false,
 * 
 *     controlled: true/false,
 *     showTip: true/false, // Whether show tooltip with dname  
 *     
 *     model: {dname: xxx, value: xxx},
 *     
 *     // 0: nomal, horizontal 
 *     // 1: from bottom to top, rotate 90deg, vertical
 *     // 2: from top to bottom, totate -90deg, vertical  
 *     layoutMode: 0, 
 * 
 *     textAlign_x: 0.5,
 *     textAlign_y: 0.5
 * } 
 */
js.swt.NewItem = function(def, Runtime){
    var CLASS = js.swt.NewItem,
    thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, 
    System = J$VM.System, MQ = J$VM.MQ,
    
    iconDef = {
        classType: "js.awt.Component",
        viewType: "IMG",
        
        stateless: true,
        rigid_w: true, rigid_h: true
    },
    
    cLabelDef = {
        classType: "js.awt.CanvasLabel",
        
        rigid_w: false, rigid_h: false
    },
    
    ctrlDef = {
        classType: "js.awt.Component",
        
        rigid_w: true, rigid_h: true
    },
    
    layoutDef = {
        classType: "js.awt.BoxLayout",
        
        gap: 2
    };
    
    thi$.msgType = function(msgType){
        if(msgType){
            this._local.msgType = msgType;
        }
        
        return this._local.msgType 
            || "com.jinfonet.event.NewItemEvent";
    };
    
    thi$.isVertical = function(){
        return this.def.layoutMode !== 0;
    };
    
    thi$.setModel = function(model){
        var M = this.def, dname;
        if(typeof model == "object"){
            M.model = model;
            this.label.setText(model.dname);
            
            if(M.showTip){
                this.setToolTipText(model.dname);
            }
            
            if(this.isDOMElement() 
               && !this.isPreferredSizeSet){
                M.prefSize = undefined;
            }
        }
    };
    
    thi$.getModel = function(){
        return this.def.model;  
    };

    thi$.getValue = function(){
        var m = this.getModel() || {};
        return m.value;
    };
    
    thi$.getIconImage = function(){
        return this.def.iconImage;  
    };
    
    thi$.setIconImage = function(iconImage, id){
        var M = this.def, icon = this[id] || this["icon"];
        if(!M.byBgImage && icon){
            iconImage = Class.isString(iconImage) 
                ? iconImage : this.getIconImage();
            
            var buf = this.__buf__.clear();
            buf.append(this.Runtime().imagePath());
            if(!icon.isStateless()){
                buf.append(this.getState() & 0x0F).append("-");
            }
            buf.append(iconImage);
            icon.view.src = buf.toString();
        }
    };
    
    thi$.isSelfStateful = function(){
        return (this.def.selfStateful == true);  
    };
    
    var _onEvent = function(e){
        var from = e.fromElement, to = e.toElement,
        type = e.getType(), ishover = false;
        
        if(type == "mouseover" || this.contains(to, true)){
            ishover = true;
        }
        
        this.setHover(ishover);
    };

    thi$.getPreferredSize = function(){
        var M = this.def, prefSize = M.prefSize, bounds, 
        comps = this.items0(), comp, layoutDef, axis = 0, 
        gap = 0, w = 0, h = 0, cnt = 0, d;
        
        if(!this.isPreferredSizeSet && !prefSize){
            layoutDef = this.layout.def;
            axis = layoutDef.axis;
            gap = layoutDef.gap;
            bounds = this.getBounds();
            
            for(var i = 0, len = comps.length; i < len; i++){
                comp = this[comps[i]];

                if(!comp.isVisible()) continue;
                
                d = comp.getPreferredSize();
                if(axis == 0){
                    w += d.width;
                }else{
                    h += d.height;
                }
                
                ++cnt;
            }
            
            if(axis == 0){
                w += gap * (cnt - 1);
                w += bounds.MBP.BPW;
                
                h = bounds.height;
            }else{
                w = bounds.width;
                
                h += gap * (cnt - 1);
                h += bounds.MBP.BPH;
            }
            
            this.setPreferredSize(w, h);
        }
        
        return M.prefSize;
        
    }.$override(this.getPreferredSize);
    
    thi$.onStateChanged = function(state){

        arguments.callee.__super__.apply(this, arguments);
        
        var items = this.def.items, len = items.length, 
        id, iid, item;
        for(var i = 0; i < len; i++){
            id = items[i];
            iid = id.split(/\d+/g)[0];
            
            item = this[id];
            if(!item.isStateless()){
                item.setState(state);
            }
        }
        
    }.$override(this.onStateChanged);
    
    thi$.repaint = function(){
        if(!this._local.eventAttached && this.isSelfStateful()){
            this.attachEvent("mouseover", 0, this, _onEvent);
            this.attachEvent("mouseout", 0, this, _onEvent);
            
            this._local.eventAttached = true;
        }
        
    }.$override(this.repaint);
    
    thi$.destroy = function(){
        if(this._local.eventAttached){
            this.detachEvent("mouseover", 0, this, _onEvent);
            this.detachEvent("mouseout", 0, this, _onEvent);
        }
        
        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);
    
    thi$.getCtrlClassName = function(def){
        return def.ctrlClassName;  
    };
    
    thi$.imprintUUID = function(uuid){
        if(!uuid) return;
        
        this.view.uuid = uuid;
        _tagElements.call(this, this.view.childNodes, uuid);
    };
    
    var _tagElements = function(eles, uuid, $uuid){
        var ele, nodes;
        for(var i = 0, len = eles.length; i < len; i++){
            ele = eles[i];
            ele.uuid = uuid;
            
            if($uuid){
                ele.$uuid = $uuid;
            }
            
            nodes = ele.childNodes;
            if(nodes && nodes.length > 0){
                _tagElements.call(this, nodes, uuid, $uuid);
            }
        }
    };
    
    var _preDef = function(def){
        var rotate = 0, axis = 0, items = def.items;
        switch(def.layoutMode){
        case 0:
            rotate = 0;
            axis = 0;
            break;
        case 1:
            rotate = 90;
            axis = 1;
            break;
        case 2:
            rotate = -90;
            axis = 1;
            break;
        default:
            rotate = 0;
            axis = 0;
            def.layoutMode = 0;
            break;
        }
        
        if(!items || items.length == 0){
            items = def.items = [];
            
            if(def.iconic === true){
                items.push("icon");
            }
            
            items.push("label");
            
            if(def.controlled === true){
                items.push("ctrl");
            }
            
            if(rotate == 90){
                items.reverse();
            }
        }
        
        var m = def.model || {}, len = items.length, 
        id, iid, cdef, data, ctrlClassName;
        for(var i = 0; i < len; i++){
            id = items[i];
            cdef = def[id];            
            iid = id.split(/\d+/g)[0];
            
            switch(iid){
            case "icon":
                if(!cdef){
                    cdef = def[id] = System.objectCopy(iconDef, {});
                    if(def.byBgImage == true){
                        cdef.viewType = "DIV";
                    }
                }
                break;
            case "label":
                cdef = def[id] = def[id] || System.objectCopy(cLabelDef, {});
                cdef.labelText = m.dname || "";
                
                data = cdef.data = cdef.data || {};
                data.rotate = rotate;
                data.align_x = Class.isNumber(def.textAlign_x) 
                    ? def.textAlign_x : 0.5;
                data.align_y = Class.isNumber(def.textAlign_y) 
                    ? def.textAlign_y : 0.5;
                break;
            case "ctrl":
                cdef = def[id] = def[id] || System.objectCopy(ctrlDef, {});

                ctrlClassName = this.getCtrlClassName(def);
                if(Class.isString(ctrlClassName) 
                   && ctrlClassName.length > 0){
                    cdef.className = ctrlClassName;
                }
                break;
            default:
                def[id] = def[id] || System.objectCopy(ctrlDef, {});
                break;
            }
        }
        
        var layout = def.layout, gap = def.gap;
        if(!layout){
            layout = def.layout = System.objectCopy(layoutDef, {});
        }
        
        layout.axis = axis;
        layout.gap = def.gap = !isNaN(gap) ? gap : 0;
    };
    
    thi$._init = function(def, Runtime){
        if(typeof def !== "object") return;
        
        def.classType = def.classType || "js.swt.NewItem";        
        def.className = def.className || "jsvm_nitem";
        
        _preDef.call(this, def);
        arguments.callee.__super__.apply(this, arguments);

        // Init image       
        this.setIconImage();
        
        // Initialize tooltip
        var M = this.def, m = M.model, uuid = this.uuid();
        if(M.showTip){
            this.setToolTipText(m.dname);
        }
        
        // Make each dom with a uuid attribute point to current item
        // in order to find the item by an event srcElement
        this.view.$uuid = this.$uuid = uuid;
        _tagElements.call(this, this.view.childNodes, uuid, uuid);
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
}.$extend(js.awt.Container);
