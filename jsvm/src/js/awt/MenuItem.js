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
 * 
 * @param def :{
 *     id: "MenuItem",
 *     
 *     iconImage: "",
 *     labelText: "Menu",
 *     markable: true/false,   Default is true
 *     controlled: true/false, If has nodes, then controlles should be true
 *     nodes:[] // sub menu
 * }
 * @param Runtime
 * @param menu
 */
js.awt.MenuItem = function (def, Runtime, menu, view){

    var CLASS = js.awt.MenuItem, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;
    
    thi$.menuContainer = function(){
        return this.container;
    };
    
    thi$.subMenu = function(){
        return this._local.submenu;
    };
    
    thi$.onStateChanged = function(){
        arguments.callee.__super__.apply(this, arguments);

        if(this.isHover()){
            var menu = this.menuContainer(),
            active = menu.active, subMenu;
            if(active && active != this){
                subMenu = active.subMenu();
                if(subMenu && subMenu.isShown()){
                    subMenu.hide();
                    active.setHover(false);
                }
            }
            
            subMenu = this.subMenu();
            if(!subMenu && Class.isArray(this.def.nodes)){
                subMenu = this._local.submenu = 
                    _createSubMenu.call(this, this.def.nodes);
            }
            if(subMenu && !subMenu.isShown()){
                subMenu.showBy(this.view, true, menu.getWidth()-8);
            }
        }
        
    }.$override(this.onStateChanged);
    
    /**
     * @see js.awt.Component
     */
    thi$.getPeerComponent = function(){
        return this.menuContainer().rootLayer().getPeerComponent();
    }.$override(this.getPeerComponent);
    

    var _createSubMenu = function(nodes){
        var menuC = this.menuContainer(), menuD = menuC.def,
        menudef = {
            classType: menuD.classType,
            className: menuD.className,
            id: this.def.id,
            nodes: nodes,
            shadow: menuD.shadow,
            PMFlag: 0x07,
            isfloating: true
        };
        
        var submenu =new (Class.forName(menudef.classType))(
            menudef, this.Runtime(), menuC.parentMenu(), menuC.rootLayer());

        return submenu;
    };
    
    var _checkItems = function(def){
        var items = def.items;

        if(def.markable === true){
            items.push("marker");    
        }
        
        items.push("icon");
        if(def.inputText){
            items.push("input");
        }else{
            items.push("label");    
        }
        if(def.nodes){
            def.controlled = true;
            items.push("ctrl");
        }
        
        return def;
    };

    thi$.destroy = function(){
        if(this._local.submenu){
            this._local.submenu.destroy();
        }
        delete this._local.submenu;
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime, menu, view){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.MenuItem";
        def.className = menu.className + "_item";
        def.css = "position:relative;width:100%;";
        
        def.markable = Class.isBoolean(def.markable) ? def.markable : true; 
        
        if(view == undefined){
            def.items = js.util.LinkedList.$decorate([]);
            _checkItems.call(this, def);
        }

        arguments.callee.__super__.apply(this, [def, Runtime, view]);

        this.setContainer(menu);
        menu.cache[this.uuid()] = this;
        
        if(this.isMarkable()){
            this.mark(def.checked);
        }

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Item);

js.awt.MenuSeparator = function(def, Runtime, menu){

    var CLASS = js.awt.MenuSeparator, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;
    
    thi$._init = function(def, Runtime, menu){
        if(def == undefined) return;

        def.classType = "js.awt.MenuSeparator";
        def.className = menu.className + "_separator";
        def.css = "overflow:hidden;width:100%;"; // If not, IE has 13px height

        arguments.callee.__super__.apply(this, [def, Runtime]);

    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
}.$extend(js.awt.BaseComponent);

