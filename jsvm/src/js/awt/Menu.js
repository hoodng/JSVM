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

$import("js.awt.MenuItem");

/**
 *
 * @param def :{
 *	   className: "jsvm_menu",
 *	   id: "Menu",
 *
 *	   iconImage: "",
 *	   labelText: "Menu",
 *
 *	   markable: true / false, indicate whether the menu items are markable
 *	   iconic: true / false, indicate whether the menu items have icons
 *	   nodes:[] // sub menu
 * }
 */
js.awt.Menu = function (def, Runtime, parentMenu, rootMenu){

	var CLASS = js.awt.Menu, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ;

	thi$.getPeerComponent = function(){
		var root = this.rootLayer();

		return this == root ?
			arguments.callee.__super__.apply(this, arguments) :
			root.getPeerComponent();

	}.$override(this.getPeerComponent);

	thi$.parentMenu = function(){
		return this._local.parent;
	};

	var _setRootMenu = function(menu){
		if(menu instanceof js.awt.Menu){
			this._local.root = menu;
		}else if(!Class.isValid(menu)){
			this._local.root = this;
			MQ.register("hideMenuRoot", this, _onhideMenuRoot);
		}
	};

	var _setParentMenu = function(menu){
		if(menu instanceof js.awt.Menu){
			this._local.parent = menu;
		}else if(!Class.isValid(menu)){
			this._local.parent = this;
		}
	};

	/**
	 * Insert menu items into specified position
	 *
	 * @param index
	 * @param itemDefs, an array of menu item definition
	 */
	thi$.insertNodes = function(index, itemDefs){
		var M = this.def, nodes = this.nodes,
		isMarkableSetten = Class.isBoolean(M.markable),
		isIconicSetten = Class.isBoolean(M.iconic),
		ibase = index, item, refNode, itemDef,
		clazz, i, len;

		if(!nodes){
			nodes = this.nodes = js.util.LinkedList.$decorate([]);
		}

		item = nodes.get(index);
		refNode = item ? item.view : undefined;

		for(i=0, len=itemDefs.length; i<len; i++){
			itemDef = itemDefs[i];

			if(isMarkableSetten){
				itemDef.markable = M.markable;
			}

			if(isIconicSetten){
				itemDef.iconic = M.iconic;
			}

			clazz = itemDef.classType ||
				("-" === itemDef.type ? "js.awt.MenuSeparator" : "js.awt.MenuItem");
			item = new (Class.forName(clazz))(itemDef, this.Runtime(), this);

			this[item.id] = item;

			nodes.add(ibase++, item);

			if(refNode){
				DOM.insertAfter(item.view, refNode);
			}else{
				DOM.appendTo(item.view, this._menuView);
			}

			refNode = item.view;
		};
	};

	/**
	 * Remove menu items from index to index + length
	 */
	thi$.removeNodes = function(index, length){
		var nodes = this.nodes, items = nodes.splice(index, length), item,
		cache = this.cache;
		while(items && items.length > 0){
			item = items.shift();
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

	/**
	 * @see js.awt.PopupLayer
	 */
	thi$.canHide = function(e){
		var b = true;
		if(e.getType() === "blur"){
			b = this.rootLayer().isHideOnBlur();
		}else{
			b = arguments.callee.__super__.apply(this, arguments);
		}

		return b;

	}.$override(this.canHide);

	/**
	 * @see js.awt.PopupLayer
	 */
	thi$.hide = function(){
		// Close my sub menu at first
		var item = this.active, subMenu = item ? item.subMenu() : undefined;
		if(item && subMenu && subMenu.isShown()){
			subMenu.hide();
			item.setHover(false);
		}
		arguments.callee.__super__.apply(this, arguments);
	}.$override(this.hide);

	/**
	 * @see js.awt.BaseComponent
	 * @see js.awt.Component
	 */
	thi$.repaint = function(){
		if(!this._local.repaint){
			var M = this.def, bounds = this.getBounds(),
			nodes = this.nodes, node;

			var clientH = document.documentElement.clientHeight,
			height = this.def.height ? this.def.height : bounds.height;

			if(height > clientH){
				this.setY(0);
				this.view.style.height = "100%";
				this.applyStyles({overflow: "auto"});
			}

			M.width = bounds.width;
			M.width -= bounds.BBM ? 0 : bounds.MBP.BPW;

			var scrollbar = this.hasScrollbar();
			if(scrollbar.vscroll){
				M.width = M.width - scrollbar.vbw;
			}
			M.height = bounds.height;
			M.height-= bounds.BBM ? 0 : bounds.MBP.BPH;

			M.z = this.getStyle("z-index");

			// For shadow
			if(M.shadow === true && !this.shadowSettled()){
				this.setShadowy(true);
			}

			// For floating layer
			if(M.isfloating === true && !this.floatingSettled()){
				this.setFloating(true);
			}

			var nodes = this.nodes, node, i, len;
			for(i=0, len=nodes.length; i<len; i++){
				node = nodes[i];
				if(!(node instanceof js.awt.MenuSeparator)){
					node.doLayout();
					node.setEnabled(node.isEnabled());
				}
			}
			this._local.repaint = true;
		}

		if(this.shadowSettled()){
			this.addShadow();
			this.adjustShadow();
		}

		if(this.active){
			this.active.setHover(false);
			this.active = undefined;
		}

	}.$override(this.repaint);

	var _notify = function(e, item){
		/* After click a menu item, a process block may occur so that the menu
		 * cann't be hide. Maybe that is reasonable to hide it first. However,
		 * if we hide it before notifying its peer component to do something,
		 * the menu may be destoried. Meanwhile, the data carried by that menu
		 * item may be destoried, too.
		 * So we copy the def of menu item and build an object as the event
		 * target in order to avoid much change. Then we can hide menu first.
		 *
		 * P.S.
		 * The menu of dashboard and gadget has menu item to do something like
		 * mark. So we also need use the menu item as the event target. However,
		 * In this case, there are some memory leak risk existed.
		 */
		// e.setEventTarget(item);
		// this.notifyPeer("js.awt.event.MenuItemEvent", e);
		e.setEventTarget(System.objectCopy(item, {}));

		// Here, we will invoke the hide() to hide the menu rather than trigger
		// it by the message post. Because the message execution is asynchronously.
		// In some case, it may be block, too.
		//MQ.post("hideMenuRoot","", [this.rootLayer().uuid()]);
		this.rootLayer().hide();

		this.notifyPeer("js.awt.event.MenuItemEvent", e);
	};

	var _onclick = function(e){
		var el = e.srcElement, uuid = el.uuid,
		item = this.cache[uuid];

		if(item && item.hasNodes()){
			item.showSubMenu();
			return;
		}
		if(item && item.isEnabled()){
			if(e.getType() == "click"){
				if(item.hitCtrl(e)){
					System.log.println("Hit the \"" + el.id + "\" ctrl.");
					e.setType("hitctrl");
				}

				_notify.call(this, e, item);
			}
		}
	};

	var _onMenuItem = function(e){
		if(e.getType() == "input"){
			_notify.call(this, e, e.getEventTarget());
		}
	};

	var _onhideMenuRoot = function(){
		this.hide();
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
			if(titem && !titem.isHover()){
				titem.setHover(true);
				this.active = titem;
			}
		}
	};


	thi$.destroy = function(){
		this.removeAllNodes();

		delete this._local.root;
		delete this._local.parent;
		delete this._local.menuView;
		delete this.cache;

		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.destroy);


	thi$._init = function(def, Runtime, parentMenu, rootMenu){
		if(def == undefined) return;

		def.classType = def.classType || "js.awt.Menu";
		def.className = def.className || "jsvm_menu";
		def.isfloating = true;
		def.PMFlag = def.PMFlag || 0x27;

		arguments.callee.__super__.apply(this, [def, Runtime]);

		_setParentMenu.call(this, parentMenu);
		_setRootMenu.call(this, rootMenu);

		var menuView = this._menuView = DOM.createElement("DIV");
		menuView.className = this.className + "_menuview";
		menuView.style.cssText = "position:relative;width:100%;height:100%;";
		DOM.appendTo(menuView, this.view);

		this.cache = {};

		if(def.nodes && def.nodes.length > 0){
			this.insertNodes(0, def.nodes);
		}

		this.setAttribute("touchcapture", "true");
		Event.attachEvent(this.view, "mouseover", 0, this, _onmouseover);
		Event.attachEvent(this.view, "mouseout",  0, this, _onmouseover);
		Event.attachEvent(this.view, "click",	  0, this, _onclick);

		MQ.register("js.awt.event.ItemTextEvent", this, _onMenuItem);

	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component);
