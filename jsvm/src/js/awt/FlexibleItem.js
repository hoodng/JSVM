/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * @File: FlexibleItem.js
 * @Create: 2013/01/15 07:16:10
 * @Author: mingfa.pan@china.jinfonet.com
 */

$package("js.awt");

/**
 * @param def: {Object} Definition of current item, include:
 *	   id: {String} 
 *	   iconImage: {String} Optional. Image filename for the icon.
 *	   labelText: {String} Optional. Textual content for current item. 
 *	   
 *	   markable: {Boolean} Default is true.
 *	   iconic: {Boolean} Indicate whether an icon existed for current item.
 *	   custom: {Object} Specify a component as current item's main contents. It's prior.
 *			   If the custom is specified, the given textual content will be ignored.
 *			   Otherwise an input or label will be created.
 */
js.awt.FlexibleItem = function(def, Runtime){
	var CLASS = js.awt.FlexibleItem,
	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event,
	DOM = J$VM.DOM, System = J$VM.System;
	
	thi$.isCustomized = function(){
		return this._local.customized;	
	};
	
	/**
	 * @see js.awt.Item #getPreferredSize
	 */
	thi$.getPreferredSize = function(){
		if(this.def.prefSize == undefined){
			var customComp = this.getCustomComponent(),
			G = this.getGeometric(), nodes = this.view.childNodes,
			leftmostCtrl = this._local.leftmostCtrl || this.ctrl,
			len = nodes.length, overline = false, width = 0, preEle, ele, s;
			
			for(var i = 0; i < len; i++){
				ele = nodes[i];
				if(leftmostCtrl && ele == leftmostCtrl){
					break;
				}
				
				if(customComp && customComp.view == ele){
					if(!overline){
						overline = true;
						width += ele.offsetLeft;
					}
					s = customComp.getPreferredSize();
					width += s.width;
				}else{
					if(ele.tagName == "SPAN" || ele.tagName == "INPUT"){
						if(!overline){
							overline = true;
							width += ele.offsetLeft;
						}
						
						if(ele.tagName == "SPAN"){
							width += DOM.getTextSize(ele).width;   
						}else{
							width += ele.scrollWidth;
						}
					}
				}
			}
			
			var w = this._local.ctrlsWidth, D = G.ctrl;
			if(!isNaN(s)){
				width += s;
			}
			
			if(D){
				width += D.MBP.marginLeft + D.width + D.MBP.marginRight;
			}
			
			width += G.bounds.MBP.BPW;
			this.setPreferredSize(width, G.bounds.height);
		}
		
		return this.def.prefSize;
		
	}.$override(this.getPreferredSize);
	
	/**
	 * @see js.awt.Item #isMoverSpot
	 */
	thi$.isMoverSpot = function(el, x, y){
		if(arguments.callee.__super__.apply(this, arguments)){
			var extraCtrls = this._local.extraCtrls,
			ids = extraCtrls ? extraCtrls.keys() : [], ctrl;
			for(var i = 0, len = ids; i < len; i++){
				ctrl = this[ids[i]];
				if(el === ctrl){
					return false;
				}
			}
			
			if(this.customComponent 
			   && this.customComponent.contains(el, true)){
				return false;
			}
		}
		
		return true;
		
	}.$override(this.isMoverSpot);
	
	/**
	 * @see js.awt.Item #doLayout
	 */
	thi$.doLayout = function(){
		var customComp = this.getCustomComponent(), 
		leftmostCtrl = this._local.leftmostCtrl,
		ele = (customComp && customComp.view) 
			? customComp.view : (this.input || this.label),
		leftEle = ele.previousSibling,
		rightEle = leftmostCtrl || this.ctrl,
		w = rightEle 
			? rightEle.offsetLeft : this.getBounds().innerWidth, 
		width;
		
		if(customComp && customComp.view){
			var G = this.getGeometric(), MBP = G.bounds.MBP,
			ybase = MBP.paddingTop,
			h = G.bounds.BBM ? 
				G.bounds.height : G.bounds.height - MBP.BPH,
			innerHeight = h - MBP.BPH, x, y;

			if(leftEle){
				D = G[leftEle.id] || DOM.getBounds(leftEle);
				x = leftEle.offsetLeft + D.width + D.MBP.marginRight;
			}else{
				x = MBP.borderLeftWidth + MBP.paddingRight;
			}

			D = customComp.getBounds();
			y = ybase + (innerHeight - D.height)*0.5;

			width = Math.max(w - x, 0);
			customComp.setBounds(x, y, width, undefined);

			// Trigger custom component's doLayou
			customComp.doLayout(true);
		}else{
			width = Math.max(w - ele.offsetLeft, 0);

			if(this.input){
				DOM.setSize(ele, width, undefined);
			}else{
				ele.style.width = width + "px";
			}
		}
		
	}.$override(this.doLayout);

	thi$.destroy = function(){
		delete this._local.leftmostCtrl;
		delete this._local.extraCtrls;
		
		arguments.callee.__super__.apply(this, arguments);
		
	}.$override(this.destroy);
	
	/**
	 * Specify a component as current item's customized contents.
	 * 
	 * @param comp: {Object} A custom component must be an object of the BaseComponent
	 *		  or BaseComponent's derived class. And it must implement an getValue method
	 *		  to return the item's value.
	 */
	thi$.setCustomComponent = function(comp){
		if(!comp || !comp.view 
		   || !Class.isFunction(comp.getValue)){
			return;
		}
		
		var customComponent = this._local.customComponent,
		ctrl = this._local.leftmostCtrl || this.ctrl, peer;
		if(customComponent){
			DOM.remove(customComponent.view, true);
		}else{
			this._local.customComponent = comp;
		}
		
		comp.applyStyles({position: "absolute"});
		DOM.insertBefore(comp.view, ctrl, this.view);
		comp.setContainer(this);
		
		if(DOM.isDOMElement(comp.view)){
			this.doLayout(true);
		}
	};
	
	/**
	 * Return the customized component of current item.
	 */
	thi$.getCustomComponent = function(){
		return this._local.customComponent;	 
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
		var M = this.def, buf = this.__buf__,
		ctrls = M.ctrls, len = ctrls.length;
		if(len == 0){
			return;
		}

		var G = this.getGeometric(), ybase = G.bounds.MBP.paddingTop,
		height = G.bounds.BBM ? 
			G.bounds.height : G.bounds.height - G.bounds.MBP.BPH,
		innerHeight = height - G.bounds.MBP.BPH, anchor = this.ctrl,
		ctrlsWidth = 0, align = 0.5, top = 0, right = 0, 
		el, iid, D, styleW, styleH;
		
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
				
				align = (ctrl.align && !isNaN(ctrl.align)) ? ctrl.align : align; 
				top = ybase + (innerHeight - D.height) * align;
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
				System.err.println("The \"ctrl\" has been reserved for special purpose.");
			}
			
			// Cache this value for calculate the prefered size
			this._local.ctrlsWidth = ctrlsWidth;
		}
	};
	
	var _createCustomComponent = function(){
		var M = this.def, custom = M.custom,
		comp = new (Class.forName(custom.classType))(custom, this.Runtime());

		this.setCustomComponent(comp);
	};
	
	var _checkItems = function(def){
		var items = def.items, custom = def.custom,
		customized = false;
		
		if(Class.isObject(custom) 
		   && Class.isString(custom.classType)){
			customized = this._local.customized = true;
		}
		
		if(items.length > 0){
			return def;
		}
		
		if(def.markable === true){
			items.push("marker");
		}
		
		if(def.iconic !== false){
			items.push("icon");
		}
		
		if(!customized){
			if(def.inputText){
				items.push("input");
			}else{
				items.push("label");
			}
		}
		
		if(def.controlled === true){
			items.push("ctrl");
		}
		
		return def;
	};
	
	thi$._init = function(def, Runtime, view){
		if(typeof def !== "object") return;
		
		this._local = this._local || {};
		def.classType = def.classType || "js.awt.FlexibleItem";
		def.markable = Class.isBoolean(def.markable) ? def.markable : true;
		
		if(view == undefined){
			def.items = js.util.LinkedList.$decorate([]);
			_checkItems.call(this, def);
		}
		
		arguments.callee.__super__.apply(this, [def, Runtime, view]);
		
		if(this.isCustomized()){
			_createCustomComponent.call(this);
		}
		
		if(Class.isArray(def.ctrls)){
			_createExtraCtrls.call(this);
		}
		
		if(this.isMarkable()){
			this.mark(def.checked);
		}
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.Item);
