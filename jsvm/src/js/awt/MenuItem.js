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
$import("js.awt.FlexibleItem");

/**
 * 
 * @param def :{
 *	   id: "MenuItem",
 *	   
 *	   iconImage: "",
 *	   labelText: "Menu",
 *	   markable: true/false,   Default is true
 *	   controlled: true/false, If has nodes, then controlles should be true
 *	   nodes:[] // sub menu
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

	thi$.rootMenu = function(){
		return this.def.beInMenu 
			? this.menuContainer().rootLayer() 
			: null;
	};

	thi$.subMenu = function(){
		return this._local.submenu;
	};
	
	thi$.setNodes = function(nodes){
		var subMenu ;
		if(Class.isArray(nodes)){
			this.def.nodes = nodes;
			
			subMenu = this.subMenu();
			if(subMenu){
				subMenu.hide();
				subMenu = this._local.submenu = null;
			}
		}
	};
	
	thi$.hasNodes = function(){
		var M = this.def, nodes = M.nodes;
		return (Class.isArray(nodes) && nodes.length > 0) 
			|| (M.dynamic === true);
	};

	/**
	 * Show the current item's submenu, if the submenu hasn't been created,
	 * creat it. If the <em>force</em> is true, a new submenu will always be
	 * created.
	 * 
	 * @param nodes: {Array} Nodes of the submenu to creat.
	 * @param force: {Boolean} Indicate whether a new submenu will always be
	 *				 created. 
	 */ 
	thi$.showSubMenu = function(nodes, force){
		var M = this.def, U = this._local, root = this.rootMenu(),
		menu = this.menuContainer(), subMenu = this.subMenu(), 
		thickness;
		
		if(force === true && subMenu && Class.isArray(nodes)){
			subMenu.hide();
			subMenu = U.submenu = null;
		}
		
		if(!subMenu && Class.isArray(nodes)){
			subMenu = U.submenu = 
				_createSubMenu.call(this, nodes, M.menuClass);
		}
		
		if(subMenu && !subMenu.isShown()){
			if(root && Class.isFunction(root.rectifySubMenu)){
				subMenu = root.rectifySubMenu(this, subMenu);
			}

			thickness = M.beInMenu ? menu.getWidth() - 8 : this.getHeight();
			subMenu.showBy(this.view, M.beInMenu, thickness);
		}
	};
	
	thi$.onStateChanged = function(){
		$super(this);

		if(this.isHover()){	 
			var M = this.def, menu = this.menuContainer(),
			active = menu.active, root, subMenu, timeout,
			nodes;
			
			if(active && active != this){
				subMenu = active.subMenu();
				if(subMenu && subMenu.isShown()){
					subMenu.hide("hide", this);
					active.setHover(false);
				}
			}

			if (this.isEnabled()){
				subMenu = this.subMenu();

				if(M.dynamic === true 
				   && (!subMenu || M.changeable === true)){
					if(typeof this.loadMenu == "function"){
						timeout = !isNaN(M.timeout) ? M.timeout : 500;
						this.loadMenu.$clearTimer();
						this.loadMenu.$delay(this, timeout);
					}else{
						root = this.rootMenu();
						nodes = root.getSubMenuNodes(this);
						if(nodes){
							this.showSubMenu(nodes, true);
						}
					}
				}else{
					this.showSubMenu(M.nodes);
				}
			}
		}
		
	}.$override(this.onStateChanged);
	
	/**
	 * @see js.awt.Component
	 */
	thi$.getPeerComponent = function(){
		var peer;
		if(this.def.beInMenu){
			peer = this.menuContainer().rootLayer().getPeerComponent();
		}else{
			peer = $super(this);
		}
		
		return peer;
		
	}.$override(this.getPeerComponent);
	
	/**
	 * @see js.awt.FlexibleItem #doLayout
	 */
	thi$.doLayout = function(){
		if(this.isCustomized()){
			var customComp = this.getCustomComponent(),
			peer = customComp.getPeerComponent();
			if(!peer && DOM.isDOMElement(customComp.view)){
				customComp.setPeerComponent(this.getPeerComponent());
			}
		}
		
		$super(this);
		
	}.$override(this.doLayout);
	
	var _onInput = function(e){
		e.cancelBubble();
	};

	var _createSubMenu = function(nodes, mClass){
		var M = this.def, menuC = this.menuContainer(), menuD = menuC.def,
		mClassType = M.beInMenu ? menuD.classType : (M.mClassType || "js.awt.Menu"),
		menuShadow = M.beInMenu ? menuD.shadow : (M.menuShadow !== false),
		menudef = {
			id: this.def.id,
			classType: mClassType,
			className: mClass || menuD.className,
			nodes: nodes,
			shadow: menuShadow,
			PMFlag: 0x07,
			isfloating: true
		}, pmenu, root;
		
		if(M.beInMenu){
			pmenu = menuC.parentMenu();
			root = menuC.rootLayer();
		}
		
		// Handle the iconStateless
		if(menuD.hasOwnProperty("iconStateless")){
			menudef.iconStateless = menuD.iconStateless;
		}
		
		// Handle the useBgImage
		if(menuD.hasOwnProperty("useBgImage")){
			menudef.useBgImage = menuD.useBgImage;
		}

		var submenu =new (Class.forName(mClassType))(
			menudef, this.Runtime(), pmenu, root);
		if(!M.beInMenu){
			submenu.setPeerComponent(this.getPeerComponent());
		}

		return submenu;
	};
	
	thi$.destroy = function(){
		if(this._local.submenu){
			this._local.submenu.destroy();
		}
		delete this._local.submenu;
		
		$super(this);

	}.$override(this.destroy);
	
	thi$._init = function(def, Runtime, menu, view){
		if(def == undefined) return;
		
		def.classType = def.classType || "js.awt.MenuItem";
		def.className = DOM.combineClassName(menu.def.className 
											 || menu.className, "item");
		def.beInMenu = (def.beInMenu !== false);
		def.markable =(def.markable !== false);
		def.controlled = (def.beInMenu && (Class.isArray(def.nodes) 
										   || def.dynamic === true));
		
		// By testing, when a relative div is included in another div,
		// the inner div will fetch the inner width of the outer div
		// as its width if no set any width for it.
		// So, there may not be "width:100%". Otherwise, if the menu
		// item has borders and paddings, it will exceed the outer div.
		if(def.beInMenu){
			def.css = "position:relative;";
		}
		
		$super(this, def, Runtime, view);
		
		this.setContainer(menu);
		menu.cache[this.uuid()] = this;

		if(this.input){
			Event.attachEvent(this.input, "mousedown", 0, this, _onInput);
			Event.attachEvent(this.input, "click", 0, this, _onInput); 
		}

	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.awt.FlexibleItem);

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
		def.className = DOM.combineClassName(menu.def.className 
											 || menu.className, "separator");
		def.css = "overflow:hidden;width:100%;"; // If not, IE has 13px height

		$super(this, def, Runtime);

	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.Component);

