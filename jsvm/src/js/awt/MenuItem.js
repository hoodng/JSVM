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
	
	thi$.subMenu = function(){
		return this._local.submenu;
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
		var M = this.def, menu = this.menuContainer(),
		subMenu = this.subMenu(), thickness;
		
		if(force === true && subMenu && Class.isArray(nodes)){
			subMenu.hide();
			subMenu = this._local.submenu = null;
		}
		
		if(!subMenu && Class.isArray(nodes)){
			subMenu = this._local.submenu = 
				_createSubMenu.call(this, nodes, M.menuClass);
		}
		
		if(subMenu && !subMenu.isShown()){
			thickness = M.beInMenu ? menu.getWidth() - 8 : this.getHeight();
			subMenu.showBy(this.view, M.beInMenu, thickness);
		}
	};
	
	thi$.onStateChanged = function(){
		arguments.callee.__super__.apply(this, arguments);

		if(this.isHover()){	 
			var M = this.def, menu = this.menuContainer(),
			active = menu.active, subMenu, timeout;
			
			if(active && active != this){
				subMenu = active.subMenu();
				if(subMenu && subMenu.isShown()){
					subMenu.hide();
					active.setHover(false);
				}
			}
			
			subMenu = this.subMenu();
			if(!subMenu && M.dynamic === true
			   && (typeof this.loadMenu == "function")){
				timeout = !isNaN(M.timeout) ? M.timeout : 500;
				this.loadMenu.$clearTimer();
				this.loadMenu.$delay(this, timeout);
			}else{
				this.showSubMenu(M.nodes);
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
			peer = arguments.callee.__super__.apply(this, arguments);
		}
		
		return peer;
		
	}.$override(this.getPeerComponent);
	
	/**
	 * @see js.awt.Item #getPreferedSize
	 */
	thi$.getPreferredSize = function(){
		if(this.def.prefSize == undefined && this._local.leftmostCtrl){
			var G = this.getGeometric(), nodes = this.view.childNodes,
			len = nodes.length, preEle, ele, width;
			for(var i = 0; i < len; i++){
				ele = nodes[i];
				if(ele == this._local.leftmostCtrl){
					preEle = nodes[i - 1];

					if(preEle.tagName == "SPAN"){
						width = preEle.offsetLeft + DOM.getTextSize(preEle).width;
					}else{
						width = preEle.offsetLeft + preEle.scrollWidth;
					}
					
					break;
				}
			}
			
			width += this._local.ctrlsWidth;
			if(G.ctrl){
				width += G.ctrl.MBP.marginLeft + G.ctrl.width + G.ctrl.MBP.marginRight;
			}
			width += G.bounds.MBP.BPW;
			
			this.setPreferredSize(width, G.bounds.height);
		}else{
			arguments.callee.__super__.apply(this, arguments);
		}
		
		return this.def.prefSize;
		
	}.$override(this.getPreferredSize);
	
	/**
	 * @see js.awt.Item #isMoverSpot
	 */
	thi$.isMoverSpot = function(el, x, y){
		var b = arguments.callee.__super__.apply(this, arguments),
		extraCtrls = this._local.extraCtrls,
		ids = extraCtrls ? extraCtrls.keys() : [];
		for(var i = 0, len = ids; i < len; i++){
			b = b && this[ids[i]];
		}
		
		return b;
		
	}.$override(this.isMoverSpot);
	
	/**
	 * @see js.awt.Item #doLayout
	 */
	thi$.doLayout = function(){
		var leftmostCtrl = this._local.leftmostCtrl;
		if(leftmostCtrl){
			var ele = this.label || this.input,
			maxWidth = leftmostCtrl.offsetLeft;
			width = maxWidth - ele.offsetLeft;
			width = width < 0 ? 0 : width;
			
			if(this.input){
				DOM.setSize(ele, width, undefined);
			}else{
				ele.style.width = width + "px";
			}
		}else{
			arguments.callee.__super__.apply(this, arguments);
		}
		
	}.$override(this.doLayout);
	
	var _onInput = function(e){
		e.cancelBubble();
	};

	var _createSubMenu = function(nodes, mClass){
		var M = this.def, menuC = this.menuContainer(), menuD = menuC.def,
		mClassType = M.beInMenu ? menuD.classType : (M.mClassType || "js.awt.Menu"),
		menuShadow = M.beInMenu ? menuD.shadow : (M.menuShadow !== false),
		menudef = {
			classType: mClassType,
			className: mClass || menuD.className,
			id: this.def.id,
			nodes: nodes,
			shadow: menuShadow,
			PMFlag: 0x07,
			isfloating: true
		}, pmenu, root;
		
		if(M.beInMenu){
			pmenu = menuC.parentMenu();
			root = menuC.rootLayer();
		}
		
		var submenu =new (Class.forName(mClassType))(
			menudef, this.Runtime(), pmenu, root);
		if(!M.beInMenu){
			submenu.setPeerComponent(this.getPeerComponent());
		}

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
		
		if(def.beInMenu && (Class.isArray(def.nodes) 
							|| def.dynamic === true)){
			def.controlled = true;
			items.push("ctrl");
		}
		
		return def;
	};

	/**
	 * Judge whethe the current event hit some extra ctrl.
	 * 
	 * @param e: {js.awt.Event}
	 */	   
	thi$.hitCtrl = function(e){
		var src = e.srcElement, extraCtrls = this._local.extraCtrls, 
		ids = extraCtrls ? extraCtrls.keys() : undefined, id, ele, ctrl;
		if(!src || !ids || ids.length == 0) {
			return false;
		}
		
		for(var i = 0, len = ids.length; i < len; i++){
			id = ids[i];
			ele = this[id];
			
			if(ele && DOM.contains(ele, src, true)){
				// ctrl = extraCtrls.get(id);
				return true;
			}
		}
		
		return false;
	};
	
	var _createExtraCtrls = function(){
		var M = this.def, buf = this.__buf__, ctrls = M.ctrls,
		len = Class.isArray(ctrls) ? ctrls.length : 0;
		if(len == 0){
			return;
		}

		var G = this.getGeometric(), ybase = G.bounds.MBP.paddingTop,
		height = G.bounds.BBM ? 
			G.bounds.height : G.bounds.height - G.bounds.MBP.BPH,
		innerHeight = height - G.bounds.MBP.BPH, anchor = this.ctrl,
		ctrlsWidth = 0, top = 0, right = 0, el, iid, D, styleW, styleH;
		
		if(this.ctrl){
			right = G.bounds.MBP.paddingRight 
				+ G.ctrl.MBP.marginLeft + G.ctrl.width + G.ctrl.MBP.marginRight; 
		}
		
		var extraCtrls = this._local.extraCtrls = new js.util.HashMap(),
		ctrl, ctrlId;
		for(var i = len - 1; i >= 0; i--){
			ctrl = ctrls[i];
			ctrlId = ctrl.id || ("ctrl" + i);
			iid = ctrlId.split(/\d+/g)[0];

			if(ctrlId !== "ctrl"){
				extraCtrls.put(ctrlId, ctrl);
				
				el = DOM.createElement("DIV");
				el.id = ctrlId;
				el.iid = iid;
				el.uuid = this.uuid();
				el.className = ctrl.className || (this.className + "_extra");
				
				buf.clear();
				buf.append("position:absolute;");
				
				if(ctrl.image){
					buf.append("background-image: url(")
						.append(this.Runtime().imagePath() + ctrl.image).append(");")
						.append("background-repeat:no-repeat;background-position:center;");
				}
				
				if(ctrl.css){
					buf.append(css);
				}				 
				el.style.cssText = buf.toString();
				
				DOM.appendTo(el, document.body);
				DOM.setSize(el, ctrl.width, ctrl.height);
				D = G[ctrlId] = DOM.getBounds(el);
				styleW = DOM.getStyle(el, "width");
				styleH = DOM.getStyle(el, "height");
				DOM.removeFrom(el);
				
				if(styleW){
					buf.append("width:").append(styleW).append(";");
				}
				
				if(styleH){
					buf.append("height:").append(styleH).append(";");
				}
				
				top = ybase + (innerHeight - D.height)*0.5;
				buf.append("top:").append(top).append("px;");
				buf.append("right:").append(right).append("px;");
				el.style.cssText = buf.toString();
				
				DOM.insertBefore(el, anchor, this.view);
				anchor = el;
				
				// The leftmost ctrl which will be used to calculate the lable 
				// or input width in doLayout
				this._local.leftmostCtrl = el;

				M.items.push(ctrlId);
				this[ctrlId] = el;
				
				ctrlsWidth = D.MBP.marginLeft + D.width + D.MBP.marginRight;
				right += ctrlsWidth;
			}else{
				System.err.println("The \"ctrl\" has been reserved for the submenu.");
			}
			
			// Cache this value for calculate the prefered size
			this._local.ctrlsWidth = ctrlsWidth;
		}
	};
	
	thi$.destroy = function(){
		delete this._local.leftmostCtrl;
		delete this._local.extraCtrls;
		
		if(this._local.submenu){
			this._local.submenu.destroy();
		}
		delete this._local.submenu;
		
		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.destroy);
	
	thi$._init = function(def, Runtime, menu, view){
		if(def == undefined) return;
		
		def.beInMenu = (def.beInMenu !== false);
		def.classType = def.classType || "js.awt.MenuItem";
		def.className = menu.className + "_item";
		
		if(def.beInMenu){
			def.css = "position:relative;width:100%;";
		}
		
		def.markable = Class.isBoolean(def.markable) ? def.markable : true; 
		
		if(view == undefined){
			def.items = js.util.LinkedList.$decorate([]);
			_checkItems.call(this, def);
		}

		arguments.callee.__super__.apply(this, [def, Runtime, view]);
		
		// Add extra ctrls
		_createExtraCtrls.call(this);		 

		this.setContainer(menu);
		menu.cache[this.uuid()] = this;
		
		if(this.input){
			Event.attachEvent(this.input, "mousedown", 0, this, _onInput);
			Event.attachEvent(this.input, "click", 0, this, _onInput); 
		}
		
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

