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

	var _getItemOrNode = function(item, id){
		var menu, cache, nodes, i, len, rst;
		if(Class.isFunction(item.subMenu)){
			menu = item.subMenu();
			cache = menu.cache;
			for(uuid in cache){
				item = cache[uuid];
				if(item.id === id){
					rst = item;
					break;
				}else{
					rst = _getItemOrNode.call(this, item, id);
				}
			}
		}else{
			nodes = item.nodes;
			len = Class.isArray(nodes) ? nodes.length : 0;
			for(i = 0; i < len; i++){
				item = nodes[i];
				if(item.id === id){
					rst = item;
					break;
				}else{
					rst = _getItemOrNode.call(this, item, id);
				}
			}
		}

		return rst;
	};

	/*
	 * Find and return the menu item specified by the given id. If the
	 * menu item hasn't been created, return the original node object.
	 * 
	 * @param {String} id
	 */
	var _getItemOrNodeById = function(id){
		var root = this.rootLayer(), cache = root.cache, 
		uuid, item, rst;
		for(uuid in cache){
			item = cache[uuid];
			if(item.id === id){
				rst = item;
			}else{
				rst = _getItemOrNode.call(this, item, id);				  
			}

			if(rst){
				break;
			}
		}

		return rst;
	};

	/**
	 * Set the specified menu item enabeld / disabled.
	 * 
	 * @param {String} id Id of the menut item to ref.
	 * @param {Boolean} b
	 */
	this.setItemEnabled = function(id, b){
		var node = _getItemOrNodeById.call(this, id),
		changed = false, state, nstate;
		if(!node){
			return changed;
		}

		if(Class.isFunction(node.setEnabled)){
			changed = node.isEnabled() != b;
			if(changed){
				node.setEnabled(b);
			}
		}else{
			nstate = b ? 0 : 1;
			state = node.state === 1 ? 1 : 0;

			changed = state !== nstate;
			if(changed){
				node.state = nstate;
			}
		}

		return changed;
	};

	var _getMenuItemById = function(cache, id){
		var uuid, item, rst, menu;
		for(uuid in cache){
			item = cache[uuid];
			if(item.id === id){
				rst = item;
			}else{
				if(Class.isFunction(item.subMenu)){
					menu = item.subMenu();
					if(menu){
						rst = _getMenuItemById.call(this, menu.cache, id);
					}
				}
			}

			if(rst){
				break;
			}
		}

		return rst;
	};

	/**
	 * Find and return the menu item specified by the given id.
	 * If the menu item hasn't been shown, return null.
	 * 
	 * @param {String} id
	 * 
	 * @return {js.awt.MenuItem}
	 */
	thi$.getMenuItemById = function(id){
		var root = this.rootLayer(), cache = root.cache;
		return cache ? _getMenuItemById.call(this, cache, id) : null;
	};

	/**
	 * Build and return the nodes for the sub-menu of the specified
	 * menu item.
	 * 
	 * @param {js.awt.MenuItem} item
	 */
	thi$.getSubMenuNodes = function(item){
		return null;  
	};

	/**
	 * Rectify and improve the sub-menu of the specified menu item
	 * before showing it.
	 * 
	 * @param {js.awt.MenuItem} item
	 * @param {js.awt.Menu} subMenu
	 */
	thi$.rectifySubMenu = function(item, subMenu){
		subMenu = subMenu || item.subMenu();
		return subMenu;
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Component#getPeerComponent
	 */
	thi$.getPeerComponent = function(){
		var root = this.rootLayer();

		return this == root ?
			$super(this) :
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
			
			// Handle the iconStateless
			if(!itemDef.hasOwnProperty("iconStateless")){
				itemDef.iconStateless = (M.iconStateless === true);
			}

			// Handle the useBgImage
			if(!itemDef.hasOwnProperty("useBgImage")){
				itemDef.useBgImage = (M.useBgImage === true);
			}

			clazz = itemDef.classType 
				|| ("-" === itemDef.type 
					? "js.awt.MenuSeparator" : "js.awt.MenuItem");
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
	
	thi$.mark = function(id){
		var item = this[id];
		if(!item){
			return;
		}
		
		var nodes = this.nodes, 
		len = nodes.length, node;
		for(var i = 0; i < len; i++){
			node = nodes[i];
			node.mark(node.id === id);
		}
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

	/*
	 * When the menu is hidden, some items' state may be changed. 
	 * The disabled cover can not be handled right. So, we rectify
	 * them again.
	 */
	var _adjustItemCover = function(){
		var cache = this.cache, uuid, item;
		for(uuid in cache){
			item = cache[uuid];
			item.showDisableCover(!item.isEnabled(), 
								  item.def.disableClassName);
		}
	};

	/**
	 * @method
	 * @inheritdoc js.awt.PopupLayer#showAt
	 */
	thi$.showAt = function(){
		$super(this);

		_adjustItemCover.call(this);

	}.$override(this.showAt);

	/**
	 * @method
	 * @inheritdoc js.awt.PopupLayer#showBy
	 */
	thi$.showBy = function(){
		$super(this);

		_adjustItemCover.call(this);

	}.$override(this.showBy);

	/**
	 * @see js.awt.PopupLayer
	 */
	thi$.canHide = function(e){
		var type = e.getType(), b = true;
		switch(type){
		case "mousedown":
			b = !this.contains(e.srcElement, true)
				&& $super(this);
			break;
		case "blur":
			b = this.rootLayer().isHideOnBlur();
			break;
		default:
			b = $super(this);
			break;
		}

		return b;

	}.$override(this.canHide);

	/**
	 * @method
	 * @inheritdoc js.awt.PopupLayer#hide
	 */
	thi$.hide = function(){
		// Close my sub menu at first
		var item = this.active, 
		subMenu = item ? item.subMenu() : undefined;
		if(item && subMenu && subMenu.isShown()){
			subMenu.hide();
			item.setHover(false);
		}

		$super(this);

	}.$override(this.hide);

	/**
	 * @method
	 * @inheritdoc js.awt.Component#repaint
	 */
	thi$.repaint = function(){
		var U = this._local, M = this.def, bounds, clientH, height,
		nodes, node, scrollbar, i, len;
		if(!U.repaint){
			bounds = this.getBounds();
			nodes = this.nodes;

			clientH = document.documentElement.clientHeight;
			height = M.height ? M.height : bounds.height;

			if(height > clientH){
				this.setY(0);
				this.view.style.height = "100%";
				this.applyStyles({overflow: "auto"});
			}

			M.width = bounds.width;
			M.width -= bounds.BBM ? 0 : bounds.MBP.BPW;

			scrollbar = this.hasScrollbar();
			if(scrollbar.vscroll){
				M.width = M.width - scrollbar.vbw;
			}
			M.height = bounds.height;
			M.height-= bounds.BBM ? 0 : bounds.MBP.BPH;

			M.z = this.getStyle("z-index");

			// For floating layer
			if(M.isfloating === true && !this.floatingSettled()){
				this.setFloating(true);
			}

			nodes = this.nodes;
			for(i=0, len=nodes.length; i<len; i++){
				node = nodes[i];
				if(!(node instanceof js.awt.MenuSeparator)){
					node.doLayout();
					node.setEnabled(node.isEnabled());
				}
			}
			U.repaint = true;
		}

		// For shadow
		if(M.shadow){
			this.showShadow(true, M.shadowClassName);
		}

		this.adjustLayers("resize");

		if(this.active){
			this.active.setHover(false);
			this.active = undefined;
		}

	}.$override(this.repaint);

	/**
	 * @method
	 * @inheritdoc js.awt.Component#destroy
	 */
	thi$.destroy = function(){
		this.removeAllNodes();

		delete this._local.root;
		delete this._local.parent;
		delete this._local.menuView;
		delete this.cache;

		$super(this);

	}.$override(this.destroy);

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

	thi$._init = function(def, Runtime, parentMenu, rootMenu){
		if(def == undefined) return;

		def.classType = def.classType || "js.awt.Menu";
		def.className = def.className || "jsvm_menu";
		def.isfloating = true;
		def.PMFlag = def.PMFlag || 0x27;

		$super(this, def, Runtime);

		_setParentMenu.call(this, parentMenu);
		_setRootMenu.call(this, rootMenu);

		var menuView = this._menuView = DOM.createElement("DIV");
		menuView.className = DOM.combineClassName(this.className, "menuview");
		menuView.style.cssText = "position:relative;width:100%;height:100%;";
		DOM.appendTo(menuView, this.view);

		this.cache = {};

		if(def.nodes && def.nodes.length > 0){
			this.insertNodes(0, def.nodes);
		}

		this.setAttribute("touchcapture", "true");
		this.attachEvent("mouseover", 4, this, _onmouseover);
		this.attachEvent("mouseout",  4, this, _onmouseover);
		this.attachEvent("click",	  4, this, _onclick);

		MQ.register("js.awt.event.ItemTextEvent", this, _onMenuItem);

	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component);
