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
 * A ScrollPane is a container that allows multiple components to be laid out horizontally. 
 * The components will not wrap so.
 * 
 * @param def :{
 *     className: xxx
 *     
 * } 
 */
js.awt.TabPane = function (def, Runtime){

    var CLASS = js.awt.TabPane, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;

    /**
     * Add a panel to TabPane with speciifed tab definition.
     * 
     * @param tabDef:{
     *     className: 
     *     id: 
     *     
     *     labelText: 
     *     ...
     * }
     * 
     * @param panel, any js.awt.Component instance
     */
    thi$.addTab = function(tabDef, panel){
        tabDef.classType = tabDef.classType || "js.awt.Item";
        tabDef.className = tabDef.className || this.className + "_tab";
        tabDef.id = tabDef.id || "tab" + this.tabs.getComponentCount();
        var tab = new (Class.forName(tabDef.classType))(tabDef, this.Runtime());
        this.cache[tab.uuid()] = tab;

        this.tabs.addComponent(tab);
        this.panes.addComponent(panel);
    };
    
    thi$.removeTab = function(tabId,panId){
    	var items = this.tabs.items0(), id,
        tabs = this.tabs, panes = this.panes;
//    	for(var i=0, len=items.length; i<len; i++){
//    		id = items[i];
//    		if(id == tabId){
//    			
//    		}
//    	}
    	tabs.removeComponent(tabs[tabId]);
		panes.removeComponent(panes[panId]);
    };
    
    /**
     * Switch to tab with specified tab id
     * 
     * @param tabId
     */
    thi$.activateTab = function(tabId){
        var items = this.tabs.items0(), id,
        tabs = this.tabs, panes = this.panes;

        for(var i=0, len=items.length; i<len; i++){
            id = items[i];
            if(id == tabId){
                tabs[id].setTriggered(true);    
                panes.layout.show(this.panes, i);
            }else{
                tabs[id].setTriggered(false);
            }
        }

        var msg = {
        	activateId : tabId
        };
        
        this.activateId = tabId;
        this.notifyPeer(
            "js.awt.event.TabActivatedEvent", 
            new Event("TabActivatedEvent", msg));
    };
    
    thi$.getActivateTabId = function(){
        return this.activateId;
    };
    
    /**
     * Disable the specified tab
     */
    thi$.disableTab = function(tabId, disable){
        var tab = this.tabs[tabId];
        if(disable === false){
            tab.setEnabled(true);
        }else{
            tab.setEnabled(false);
        }
    };
    
    /**
     * Return all panels 
     */
    thi$.getAllPanels = function(){
        return this.panes.getAllComponents();
    };
    
    /**
     * Return the panel with specified tab ID
     * 
     * @param tabId
     */
    thi$.getPanelByTab = function(tabId){
        var index = this.indexOfTab(tabId),
        panelId = this.panes.items0()[index];

        return this.panes[panelId];
    };
    
    thi$.indexOfTab = function(tabId){
        var items = this.tabs.items0(), id;
        for(var i=0, len=items.length; i<len; i++){
            id = items[i];
            if(id == tabId){
                return i;
            }
        }
        return -1;
    };
    
    var _onmousedown = function(e){
        var el = e.srcElement, uuid = el.uuid, 
        tab = this.cache[uuid];

        if(tab && tab.isEnabled()){
            this.activateTab(tab.id);
        }
    };

    thi$.destroy = function(){
        delete this.cache;

        arguments.callee.__super__.apply(this, arguments);
        

    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
        System.objectCopy(newDef, def, true, true);
        
        arguments.callee.__super__.apply(this, arguments);

        this.cache = {};

        this.attachEvent("mousedown", 0, this, _onmousedown);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

js.awt.TabPane.DEFAULTDEF = function(){
    return {
        classType: "js.awt.TabPane",
        className: "jsvm_tabpane",
        
        items: ["tabs", "panes"],
        
        tabs:{
            classType: "js.awt.Container",
            constraints: "north",
            layout:{
                classType: "js.awt.FlowLayout",
                axis: 0,
                hgap: 0,
                align_x: 0.0,
                align_y: 0.0
            },
            stateless: true
        },
        
        panes:{
            classType: "js.awt.Container",
            constraints: "center",
            layout:{
                classType: "js.awt.CardLayout"
            },
            zorder: true,
            stateless: true
        },
        
        layout:{
            classType: "js.awt.BorderLayout"
        },
        
        rigid_w: false,
        rigid_h: false
    };
};

