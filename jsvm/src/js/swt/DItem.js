/**

 Copyright 2010-2013, The JSVM Project. 
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
 * File: DItem.js
 * Create: 2012/05/08 02:55:06
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

/**
 * Defined an Item as ComboBox's display item. It will be used to
 * load and present the current selection.
 */
js.swt.DItem = function(def, Runtime){
    var CLASS = js.swt.DItem, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;
    var iconDef = {
        classType: "js.awt.Icon",
        
        rigid_w: true, rigid_h: true,
        stateless: true
    },
    labelDef = {
        classType: "js.awt.Label",
        
        rigid_w: false, rigid_h: false,
        stateless: true
    };
    
    thi$.getModel = function () {
        return this.model;
    };
    
    thi$.getValue = function () {
        var value = this.model ? this.model.value : null;
        return value;
    };
    
    thi$.setModel = function(model){
        if((typeof model !== "object") || (model == this.model)){
            return;
        }
        
        var dname = model.dname, img = model.img, flag = false;
        if(Class.isString(img) && img.length > 0){
            if(!this.icon){
                this.icon = new js.awt.Icon({
                    classType: "js.awt.Icon",
                    className: this.className + "_icon",
                    rigid_w: true, rigid_h: true,
                    image: img,
                    stateless: true
                },this.Runtime());
                this.addComponent(this.icon);
                
            }else{
                this.icon.setImage(img);
            }
            flag = true;
        }else{
            if(this.icon){
                this.removeComponent(this.icon);
                this.icon = null;
            }
        }
        
        if(Class.isString(dname)){
            if(!this.label){
                this.label = new js.awt.Label({
                    classType: "js.awt.Label",
                    className: this.className + "_label",
                    rigid_w: false, rigid_h: true,
                    text: dname,
                    stateless: true
                },this.Runtime());
                this.addComponent(this.label);
            }else{
                this.label.setText(dname);
            }           
            flag = true;
        }else{
            if(this.labele)
            this.removeComponent(this.label);
            this.label = null;
        }
        
        if(this.showTips){
            var tip = model.tip ? model.tip 
                    : (dname ? dname : (model.value || ""));
            this.setTooltips(tip);
        }
        
        if(flag){
            this.model = model;
        }
        this.doLayout(true);    
    };
    
    thi$.doLayout = function(force){
        if(this.isDOMElement()){
            return arguments.callee.__super__.apply(this, arguments);
        }
        
        return false;
        
    }.$override(this.doLayout);
    
    thi$.destroy = function(){
        delete this.model;
        arguments.callee.__super__.apply(this, arguments);
    }.$override(this.destroy);
    
    var _preInit = function(def){
        var M = def.model,
        iconImage = M.img || M.iconImage,
        dname = M.dname;
        
        def.items = [];
        if(Class.isString(iconImage) && iconImage.length > 0){
            def.items.push("icon");
            def.icon = System.objectCopy(iconDef, {}, true);
            def.icon.image = iconImage;         
        }
        
        if(dname != undefined || dname != null){
            dname = Class.isString(dname) ? dname : String(dname);
            
            def.items.push("label");
            def.label = System.objectCopy(labelDef, {}, true);
            def.label.text = dname || " ";
        }
        
        var layout = def.layout = def.layout || {};
        layout.gap = !isNaN(layout.gap) ? layout.gap : 2;
        layout.align_x = !isNaN(layout.align_x) ? layout.align_x : 0.5;
        layout.align_y = !isNaN(layout.align_y) ? layout.align_y : 0.5;
        
        return def;
    };
    
    thi$._init = function (def, Runtime) {
        if (typeof def !== "object") return;
        def.classType = def.classType || "js.swt.DItem";
        def.className = def.className || "jsvm_comboBox_dItem";
        
        def = _preInit.call(this, def);
        arguments.callee.__super__.apply(this, arguments);
        
        // Cache model
        this.model = def.model;
        
        // Set tooltips for item
        var m = this.model;
        if(def.showTips !== false){
            var tip = m.tip || m.dname || "";
            this.setToolTipText(tip);
        }
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.HBox);
