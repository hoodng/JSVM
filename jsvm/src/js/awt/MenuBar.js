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

$import("js.awt.Menu");
$import("js.awt.MenuItem");

/**
 * 
 * @param def :{
 *	   className: "jsvm_menubar",
 * 
 *	   nodes:[] // sub menu
 * } 
 */
js.awt.MenuBar = function (def, Runtime){

	var CLASS = js.awt.MenuBar, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, 
	LList = js.util.LinkedList, DOM = J$VM.DOM, 
	System = J$VM.System, MQ = J$VM.MQ;
	
	/**
	 * Insert menu items into specified position
	 * 
	 * @param index
	 * @param itemDefs, an array of menu item definition
	 */
	thi$.insertNodes = function(index, itemDefs){
		var M = this.def, items0 = LList.$decorate(this.items0()),
		items = LList.$decorate(this.items()),
		nodes = this.nodes, ibase = index, item, refNode, 
		itemDef, i, len, R = this.Runtime();

		if(!nodes){
			nodes = this.nodes = js.util.LinkedList.$decorate([]);
		}

		item = nodes.get(index);
		refNode = item ? item.view : undefined;
		
		for(i=0, len=itemDefs.length; i<len; i++){
			itemDef = itemDefs[i];
			itemDef.beInMenu = false;
			itemDef.markable = itemDef.markable || false;
			itemDef.text = itemDef.name;
			itemDef.className = this.className + "_item";
			itemDef.css = (itemDef.css || "") + "position:absolute;";
			itemDef.menuClass = M.subMenuClass 
				? M.subMenuClass : (this.className + "_menu");
			
			item = new (Class.forName("js.awt.MenuItem"))(itemDef, R, this);
			item.setPeerComponent(this);
			item.setContainer(this);
			
			this[item.id] = item;
			items0.add(ibase, item.id);
			items.add(ibase, item.id);
			nodes.add(ibase, item);
			
			if(refNode){
				DOM.insertAfter(item.view, refNode);
			}else{
				DOM.appendTo(item.view, this.view);
			}

			refNode = item.view;
			++ibase;
		};
	};

	/**
	 * Remove menu items from index to index + length
	 */
	thi$.removeNodes = function(index, length){
		var nodes = this.nodes, ritems = nodes.splice(index, length), 
		items0 = this.items0(), items = this.items(),
		cache = this.cache, item;
		
		items0.splice(index, length);
		items.splice(index, length);
		
		while(ritems && ritems.length > 0){
			item = ritems.shift();
			delete cache[item.uuid()];
			delete this[item.id];
			item.destroy();
		}
	};
	
	/**
	 * Remove all menu times
	 */
	thi$.removeAllNodes = function(){
		var nodes = this.nodes;
		if(nodes){
			this.removeNodes(0, nodes.length);	  
		}
	};
	
	var _notify = function(e, item){
		e.setEventTarget(item);
		this.notifyPeer("js.awt.event.MenuItemEvent", e);
	};
	
	var _onclick = function(e){
		var el = e.srcElement, uuid = el.uuid, 
		item = this.cache[uuid];
		
		if(!this._local.triggerMenu){
			this._local.triggerMenu = true;
			if(item && item.isEnabled()){
				item.setHover(true);
				this.active = item;
			}
		}else{
			this._local.triggerMenu = false;
		}
	};
	
	var _onmouseover = function(e){
		var from = e.fromElement, to = e.toElement, 
		fid = from ? from.uuid : undefined, 
		tid = to ? to.uuid : undefined,
		fitem, titem, cache = this.cache;

		if(fid !== tid){
			fitem = cache[fid];
			titem = cache[tid];
			if(fitem && fitem.isHover()){
				var subMenu = fitem.subMenu();
				if(!subMenu || !subMenu.isShown()){
					fitem.setHover(false);
					this.active = undefined;
				}
			}
			
			if(this._local.triggerMenu 
				&& titem && !titem.isHover()){
				titem.setHover(true);
				this.active = titem;
			}
		}
	};

	var _onMenuItem = function(e){
		this.notifyPeer("js.awt.event.MenuItemEvent", e);
	};

	var _onMenuHide = function(e){
		var menu = e.getEventTarget(), type = e.getType(), 
		evt = e.getData(), eType = evt ? evt.getType() : undefined,
		canTrigger = false, item, activeItem, src;
		if(type = "afterRemoveLayer" && menu 
		   && menu == menu.rootLayer()){
			item = this[menu.def.id];
			if(item && item.isHover()){
				item.setHover(false);
			}
			
			switch(eType){
				case "mousedown":
					src = evt.srcElement;
					activeItem = src && src.uuid ? this.cache[src.uuid] : undefined;
					break;
				case "hide":
					activeItem = evt.getData();
					break;
			}

			if(activeItem && (activeItem instanceof js.awt.MenuItem)){
				this._local.triggerMenu = true;
			}else{
				this._local.triggerMenu = false;
			}
		}
   
	};
	
	thi$.destroy = function(){
		this.removeAllNodes();

		delete this.cache;

		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.destroy);
	

	thi$._init = function(def, Runtime){
		if(def == undefined) return;
		
		def.classType = def.classType || "js.awt.MenuBar";
		def.className = def.className || "jsvm_menubar";

		var layout = def.layout = def.layout || {};
		layout.classType = layout.classType || "js.awt.BoxLayout";
		layout.axis = layout.axis || 0;
		layout.align_x = layout.align_x || 0.0;
		layout.align_y = layout.align_y || 0.5;

		arguments.callee.__super__.apply(this, [def, Runtime]);
		
		this.cache = {};
		
		// Indicate whether the item can trigger its submenu
		this._local.triggerMenu = false;
		
		if(def.nodes && def.nodes.length > 0){
			this.insertNodes(0, def.nodes);
		}
		
		Event.attachEvent(this.view, "mouseover", 0, this, _onmouseover);
		Event.attachEvent(this.view, "mouseout",  0, this, _onmouseover);
		Event.attachEvent(this.view, "click",	  0, this, _onclick);
		
		MQ.register("js.awt.event.MenuItemEvent", this, _onMenuItem);
		MQ.register("js.awt.event.LayerEvent", this, _onMenuHide);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.awt.Container);

