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

/**
 * A ScrollPane is a container that allows multiple components to be laid out horizontally. 
 * The components will not wrap so.
 * 
 * @param def :{
 *	   className: xxx
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

	CLASS.EVT_TABACTIVATED = "TabActivatedEvent";
	CLASS.EVT_TABDISABLED = "TabDisabledEvent";

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ;

	thi$.msgType = function(msgType){
		var U = this._local;
		if(Class.isString(msgType) && msgType.length > 0){
			U.msgType = msgType;
		}

		return U.msgType || "js.awt.event.TabActivatedEvent";
	};


	/**
	 * Add a panel to TabPane with speciifed tab definition.
	 * 
	 * @param tabDef:{
	 *	   className: 
	 *	   id: 
	 *	   
	 *	   labelText: 
	 *	   ...
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

		tabs.removeComponent(tabs[tabId]);
		panes.removeComponent(panes[panId]);
	};
	
	/**
	 * Switch to tab with specified tab id
	 * 
	 * @param tabId
	 */
	thi$.activateTab = function(tabId){
		var items = this.tabs.items0(), id, tabs = this.tabs, 
		panes = this.panes, evt;

		for(var i=0, len=items.length; i<len; i++){
			id = items[i];
			if(id == tabId){
				tabs[id].setTriggered(true);	
				panes.layout.show(this.panes, i);
			}else{
				tabs[id].setTriggered(false);
			}
		}

		this.activateId = tabId;

		evt = new Event(CLASS.EVT_TABACTIVATED, {activateId: tabId}, this);
		this.notifyPeer(this.msgType(), evt);
	};
	
	thi$.getActivateTabId = function(){
		return this.activateId;
	};

	/**
	 * Judge whether all the tabs is disabled.
	 */
	thi$.isAllTabDisabled = function(){
		var tabs = this.tabs, items = tabs.items0(),
		tab, b = true;

		for(var i = 0, len = items.length; i < len; i++){
			tab = tabs[items[i]];
			if(tab && tab.isEnabled()){
				b = false;
				break;
			}
		}

		return b;
	};
	
	/**
	 * Disable the specified tab
	 */
	thi$.disableTab = function(tabId, disable){
		var tab = this.tabs[tabId], panes = this.panes, 
		enable, b, data, evt;

		// Disable the specified tab
		enable = (disable !== true);
		if(tab.isEnabled() !== enable){
			tab.setEnabled(enable);
		}

		// If the specified tab is activated, to de-activate it.
		// And then re-activate the first enabled one.
		if(tabId === this.activateId){
			tab.setTriggered(false);

			this.activateFirstTab();
		}

		// If all tabs are disabled, to disable the panes.
		b = this.isAllTabDisabled();
		if(panes.isEnabled() === b){
			panes.setEnabled(b);
			panes.showDisableCover(b);
		}

		// Notify the changed
		data = {
			tabId: tabId,
			isAllTabDisabled: b	 
		};
		evt = new Event(CLASS.EVT_TABDISABLED, data, this);
		this.notifyPeer(this.msgType(), evt);
	};
	
	/**
	 * Return all tabs.
	 */
	thi$.getAllTabs = function(){
		return this.tabs.getAllComponents();
	};
	
	/**
	 * Return all panels 
	 */
	thi$.getAllPanels = function(){
		return this.panes.getAllComponents();
	};
	
	/**
	 * Activate the first enabled tab.
	 */
	thi$.activateFirstTab = function(){
		var tabs = this.tabs, items = tabs.items0(),
		id, tab, rst, b = true;

		for(var i = 0, len = items.length; i < len; i++){
			id = items[i];
			tab = tabs[id];

			if(tab && tab.isEnabled()){
				this.activateTab(id);
				break;
			}

			tab = null;
		}

		return tab;
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
	
	/**
	 * Return the tab with the specified panel ID.
	 * 
	 * @param panId
	 */
	thi$.getTabByPanel = function(panId){
		var index = this.indexOfPanel(panId),
		tabId = this.tabs.items0()[index];

		return this.tabs[tabId];
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
	
	thi$.indexOfPanel = function(panId){
		var items = this.panes.items0(), id;
		for(var i = 0, len = items.length; i < len; i++){
			id = items[i];
			if(id == panId){
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

		$super(this);
		

	}.$override(this.destroy);
	
	thi$._init = function(def, Runtime){
		if(def == undefined) return;
		
		var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
		System.objectCopy(newDef, def, true, true);
		
		$super(this);

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

