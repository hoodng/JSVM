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
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

$import("js.awt.Container");

js.awt.Window = function (def, Runtime, view){

    var CLASS = js.awt.Window, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ;
    
    var _getTitle = function(){
        return (this.title && this.title.labTitle) ? 
            this.title.labTitle : undefined;        
    };

    thi$.getTitle = function(){
        var title = _getTitle.call(this);
        return title ? title.getText() : null; 
    };
    
    thi$.setTitle = function(s){
        var title = _getTitle.call(this);
        if(title) title.setText(s, true);
    };
    
    thi$.isFloatTitle = function(){
        return (this.def.tstyle & 0x01) != 0;
    };
    
    /**
     * Set Title style and Button style
     * 
     * @param tstyle: 0: Always show, 1: Never show, 3: Hover show
     * @param bstyle: 0: Always show, 1: Never show, 3: Hover show
     */
    thi$.setTitleStyle = function(tstyle, bstyle){
        var title = this.title, style;
        
        if(!title) return;

        style = title.def;

        tstyle = (tstyle || 0) & 0x03; 
        bstyle = (bstyle || 0) & 0x03;

        if(style.bstyle !== bstyle){
            style.bstyle = bstyle;
            switch(bstyle){
            case 0:
            case 2:
                _showtitlebutton.call(this, true);
                break;
            case 1:
            case 3:
                _showtitlebutton.call(this, false);
                break;
            }
        }

        if(style.tstyle !== tstyle){
            style.tstyle = tstyle;

            switch(tstyle){
            case 0:
            case 2:
                title = this.delController();
                this.addComponent(title, title.def.constraints);
                title.setVisible(true);
                break;
            case 1:
            case 3:
                title = this.title = this.removeComponent("title");
                this.setController(title);
                title.setVisible(false);
                break;
            default:
                break;
            }

            if(this.isDOMElement()){
                this.doLayout(true);
            }
        }
    };

    thi$.getTitleStyle = function(){
        var style = this.title.def;
        return {
            tstyle: style.tstyle,
            bstyle: style.bstyle
        };
    };

    /**
     * @see js.awt.Cover
     */
    thi$.showLoading = function(b, styleClass){
        this.client.showLoading(b, styleClass);

    }.$override(this.showLoading);

    /**
     * @see js.awt.Movable
     */    
    thi$.isMoverSpot = function(el){
        var b = function(comp){
            return comp.contains(el, true);            
        }.$every(this, this._local.restricted);

        return b && (el.tagName != "INPUT") && (el.tagName != "TEXTAREA");

    }.$override(this.isMoverSpot);

    /**
     * Add restricted move area
     */
    thi$.addMoverRestricted = function(comp){
        this._local.restricted.push(comp);
    };
    
    /**
     * Remove restricted move area
     */
    thi$.rmvMoverRestricted = function(comp){
        this._local.restricted.remove(comp);
    };
    
    /**
     * @see js.awt.Component
     */
    thi$.needLayout = function(force){
        return arguments.callee.__super__.apply(this, arguments) || 
            this.isMaximized();        

    }.$override(this.needLayout);
    
    /**
     * @see js.awt.Component
     */
    thi$.doLayout = function(force){
        var p, ele, styles, scroll, 
            overflowX, overflowY, 
            width, height;

        if(this.needLayout(force)){
            if(this.isMaximized()){
                p = this.view.parentNode;
                scroll = DOM.hasScrollbar(p);
                styles = DOM.currentStyles(p);
                overflowX = styles.overflowX;
                overflowY = styles.overflowY;

                width = (overflowX === "hidden") ? p.clientWidth :
                    (scroll.hscroll ? p.scrollWidth : p.clientWidth);

                height= (overflowY === "hidden") ? p.clientHeight: 
                    (scroll.vscroll ? p.scrollHeight : p.clientHeight);
                
                if(this.getWidth() != width || this.getHeight() != height){
                    this.setBounds(0, 0, width, height);    
                }
                arguments.callee.__super__.apply(this, arguments);    
            }else{
                ele = this.client.view; 
                styles = DOM.currentStyles(ele);
                overflowX = styles.overflowX; 
                overflowY = styles.overflowY;
                ele.style.overflow = "hidden";
                arguments.callee.__super__.apply(this, arguments);
                ele.style.overflowX = overflowX;
                ele.style.overflowY = overflowY;
            }

            return true;
        }

        return false;

    }.$override(this.doLayout);
    
    var _setSizeTo = function(winsize){
        var d, m, r;
        winsize = winsize || "normal";
        switch(winsize){
        case "maximized":
            var p = this.view.parentNode;
            d = {x: 0, y: 0, width: p.scrollWidth, height: p.scrollHeight };
            this._local.movable = this.isMovable();
            this._local.resizable = this.isResizable();
            this._local.alwaysOnTop = this.isAlwaysOnTop();
            m = false; 
            r = false;
            break;
        case "minimized":
            d = this.getMinimumSize();
            d.x = this._local.userX;
            d.y = this._local.userY;
            this._local.movable = this.isMovable();
            this._local.resizable = this.isResizable();
            m = this.isMovable();
            r = false;
            break;
        default:
            d = { width: this._local.userW, height:this._local.userH };
            d.x = this._local.userX;
            d.y = this._local.userY;
            m = this._local.movable || this.isMovable();
            r = this._local.resizable || this.isResizable();
            break;
        }

        this.setMovable(m);
        this.setResizable(r);
        if(r){
            this.addResizer();
        }
        this.setBounds(d.x, d.y, d.width, d.height, 3);
    };

    thi$.onbtnMin = function(button){
        if(this.isMinimized()){
            // Restore
            this.setMinimized(false);
            _setSizeTo.call(this, "normal");                
        }else{
            if(this.isMaximized()){
                this.setMovable(this._local.movable);
                this.setResizable(this._local.resizable);
            }
            this.setMinimized(true);
            _setSizeTo.call(this, "minimized");            
        }
    };
    
    thi$.onbtnMax = function(button){
        if(this.isMaximized()){
            // Restore
            this.setMaximized(false);
            _setSizeTo.call(this, "normal");
            button.setTriggered(false);
            button.setToolTipText(this.Runtime().nlsText("btnMax_tip"));    
        }else{
            if(this.isMinimized()){
                this.setMovable(this._local.movable);
                this.setResizable(this._local.resizable);
            }
            this.setMaximized(true);
            _setSizeTo.call(this, "maximized");
            button.setTriggered(true);
            button.setToolTipText(this.Runtime().nlsText("btnMin_tip"));
        }
    };
    
    thi$.onbtnClose = function(button){
        this.close();
    };

    thi$.close = function(){
        
        if(typeof this.beforClose == "function"){
            this.beforClose();
        }
        
        if(this.container instanceof js.awt.Container){
            this.container.removeComponent(this);
        }
        
        this.destroy();
    };
    
    thi$.refresh = function(){
        var client = this.client;
        if(typeof client.refresh == "function"){
            client.refresh();
        }
    };
    
    thi$.onrefresh = function(target){
        this.refresh();
    };

    thi$.notifyIFrame = function(msgId, msgData){
        var win = this.client.getWindow();
        if (win) {
            MQ.post(msgId, msgData, [], win, 1);
        }
    };
    
    thi$.isMaximized = function(){
        if(typeof arguments.callee.__super__ == "function"){
            // 0.9d
            return arguments.callee.__super__.call(this);
        }else{
            return this.def.winsize == "maximized";
        }
    }.$override(this.isMaximized);
    
    thi$.setMaximized = function(b){
        if(typeof arguments.callee.__super__ == "function"){
            // 0.9d
            arguments.callee.__super__.apply(this, arguments);
        }else{
            this.def.winsize = b ? "maximized" : "normal";
        }
    }.$override(this.setMaximized);

    thi$.isMinimized = function(){
        if(typeof arguments.callee.__super__ == "function"){
            // 0.9d
            return arguments.callee.__super__.call(this);
        }else{
            return this.def.winsize == "minimized";
        }
    }.$override(this.isMinimized);
    
    thi$.setMinimized = function(b){
        if(typeof arguments.callee.__super__ == "function"){
            // 0.9d
            arguments.callee.__super__.apply(this, arguments);
        }else{
            this.def.winsize = b ? "minimized" : "normal";
        }
    }.$override(this.setMinimized);
    
    thi$.loadUrl = function(url){
        var client = this.client;
        if(client.instanceOf(js.awt.Frame)){
            client.setSrc(url);
            client.load();
        }else{
            throw "This window does not support this ability.";
        }
    };
    
    thi$.setContent = function(html, href){
        var client = this.client;
        if(client.instanceOf(js.awt.Frame)){
            client.setContent(html, href);
        }else{
            throw "This window does not support this ability.";
        }
    };
    
    var _onmouseover = function(e){
        var title = this.title;
        if(!title) return;

        var eType = e.getType(), ele = e.toElement,  
            xy = this.relative(e.eventXY()), style = this.getTitleStyle();

        switch(eType){
        case "mouseover":
            if(this.contains(ele, true) && xy.y < 50){

                if(style.tstyle === 3){
                    title.setVisible(true);
                }

                if(style.bstyle === 3){
                    if(title.contains(ele, true)){
                        _showtitlebutton.call(this, true);
                    }else{
                        _showtitlebutton.call(this, false);
                    }
                }
            }
            this.setHover(true);
            break;
        case "mouseout":
            if(!this.contains(ele, true) && ele !== this._coverView){

                if(style.tstyle === 3){
                    title.setVisible(false);
                }

                if(style.bstyle === 3){
                    _showtitlebutton.call(this, false);
                }
            }
            this.setHover(false);
            break;
        }
    };

    var _showtitlebutton = function(b){
        var title = this.title, items = title.items0(), item;
        for(var i=0, len=items.length; i<len; i++){
            item = title[items[i]];
            if(item.id.indexOf("btn") == 0){
                item.setVisible(b);
            }
        }

        if(title.isDOMElement()){
            title.doLayout(true);
        }
    };

    var _cmdDispatcher = function(e){
        switch(e.getType()){
        case "mousedown":
            this.activateComponent();
            break;
        case "mouseup":
        case "message":
            var target = e.getEventTarget(),
                func = "on"+target.id;
            if(typeof this[func] == "function"){
                this[func](target);
            }else{
                throw "Can not found function of button "+ target.id;
            }

            break;
        default:
            break;
        }
    };

    thi$.destroy = function(){
        delete this._local.restricted;
        arguments.callee.__super__.apply(this,arguments);
    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime, view){
        if(def == undefined) return;
        
        var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
        newDef.css = def.css || "";
        var titleDef = newDef.title;
        titleDef.className = titleDef.className || newDef.className + "_title";
        (function(name){
            var item = titleDef[name];
            if(name.indexOf("lab") == 0){
                item.className = item.className || titleDef.className + "_label";
                item.css = (item.css || "") + "white-space:nowrap;"
                    + "test-overflow:ellipsis;"
                    + "overflow:hidden;cursor:default;";
            }else if(name.indexOf("btn") == 0){
                item.className = item.className || titleDef.className + "_button"; 
            }
        }).$forEach(this, titleDef.items);

        newDef.client.className = newDef.client.className || newDef.className + "_client";

        System.objectCopy(newDef, def, true, true);
        arguments.callee.__super__.apply(this, arguments);
        view = this.view;
        view.style.position = "absolute";
        view.style.overflow = "hidden";

        var uuid = this.uuid();
        // For MoverSpot testing
        var restricted = this._local.restricted = js.util.LinkedList.$decorate([]);
        
        var title = this.title;
        if(title){
            title.setPeerComponent(this);
            title.view.uuid = uuid;
            (function(name){
                var item = this.title[name];
                item.setPeerComponent(this);
                item.view.uuid = uuid;
                if(name.indexOf("btn") == 0){
                    this.addMoverRestricted(item);
                    item.icon.uuid = uuid;
                }

            }).$forEach(this, title.def.items);
            
            var tstyle = title.def.tstyle, bstyle = title.def.bstyle;

            title.def.tstyle = 0;
            title.def.bstyle = 0;

            this.setTitleStyle(tstyle, bstyle);
        }

        this.client.setPeerComponent(this);
        this.client.view.uuid = uuid;
        //restricted.push(this.client); ??

        Event.attachEvent(this.view, "mouseover", 0, this, _onmouseover);
        Event.attachEvent(this.view, "mouseout",  0, this, _onmouseover);

        MQ.register("js.awt.event.ButtonEvent", this, _cmdDispatcher);
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

js.awt.Window.DEFAULTDEF = function(){
    return {
        classType : "js.awt.Window",
        className : "jsvm_win",

        items: ["title", "client"],

        title: {
            classType: "js.awt.HBox",
            constraints: "north",

            items:["labTitle", "btnMin", "btnMax", "btnClose"],
            
            labTitle:{
                classType: "js.awt.Label",
                text: "J$VM",

                rigid_w: false,
                rigid_h: false
            },
            
            btnMin:{
                classType: "js.awt.Button",
                className: "jsvm_title_button",
                iconImage: "minimize.gif"
            },

            btnMax:{
                classType: "js.awt.Button",
                className: "jsvm_title_button",
                iconImage: "maximize.png"
            },

            btnClose:{
                classType: "js.awt.Button",
                className: "jsvm_title_button",
                iconImage: "close.png"
            }
        },

        client:{
            classType: "js.awt.VFrame",
            constraints: "center",
            rigid_w: false,
            rigid_h: false
        },

        layout:{
            classType: "js.awt.BorderLayout",
            mode: 0,
            hgap: 0,
            vgap: 0
        },

        resizer: 0xFF, resizable: true,
        mover:{ bt:1.0, br:0.0, bb:0.0, bl:1.0 }, movable: true,
        shadow: true,
        
        width: 400,
        height:300,

        rigid_w: true,
        rigid_h: true,

        miniSize:{width: 72, height:24},
        prefSize:{width: 640, height:480}    
    };
};

J$VM.Factory.registerClass(js.awt.Window.DEFAULTDEF());

