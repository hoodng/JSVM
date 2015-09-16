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

$import("js.awt.Highlighter");

/**
 * @fileOverview Define the basic Item component. 
 * 
 * For such Item, there are about two kinds of user cases:
 * 
 * 1) Use as the iterable items for tree, list and so on. It should be 
 * lightweight, high-performance. And it can be a little low flexibility. 
 * So we need to finish most of the layout things before appending it to 
 * the DOM tree. And reducing the "repaint" and "layout" things.
 * 
 * 2) Use as the standalone component like a button. It should be strict, 
 * flexibility and with smart layout. Of course it may be a little weighty
 * and low-performace.
 * 
 * However, we add the "strict" property in the definition of the item to 
 * diff such two scenes.
 */

/**
 * @param def :{
 *
 *	   markable: true/false. If true will create a marker element.
 *	   iconImage: icon image name
 *	   labelText: label text
 *	   inputText: input value
 *	   controlled : true/false. If true will create a control element.
 *
 * }
 */
js.awt.Item = function(def, Runtime, view){

	var CLASS = js.awt.Item, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ;

	thi$.msgType = function(msgType){
		var U = this._local;
		if(Class.isString(msgType) && msgType.length > 0){
			U.msgType = msgType;
		}

		return U.msgType || "js.awt.event.StrictItemEvent";
	};
	
	/**
	 * Judge whether the current Item is strict for the non-iterative
	 * use scenes.
	 */
	thi$.isStrict = function(){
		return this.def.strict === true;  
	};

	/**
	 * @see js.awt.Component
	 */
	thi$.getPreferredSize = function(){
		var M = this.def, prefSize = M.prefSize, bounds,
		D, nodes, ele1, ele0, width;

		if(!prefSize){
			bounds = this.getBounds();

			if(!this.isStrict()){
				nodes = this.view.childNodes;
				ele1 = nodes[nodes.length-2];
				ele0 = nodes[nodes.length -1];

				if(ele0.tagName == "SPAN"){
					/*
					 ele0.style.width = "0px";
					 width = ele0.offsetLeft + ele0.scrollWidth;
					 */
					width = ele0.offsetLeft + DOM.getTextSize(ele0).width;
				}else{
					if(ele1.tagName == "SPAN"){
						/*
						 ele1.style.width = "0px";
						 width = ele1.offsetLeft + ele1.scrollWidth;
						 */
						width = ele1.offsetLeft + DOM.getTextSize(ele1).width;
					}else{
						width = ele1.offsetLeft + ele1.scrollWidth;
					}

					D = DOM.getBounds(this.ctrl);
					width += D.MBP.marginLeft + D.width;
				}
				width += bounds.MBP.BPW;

				prefSize = {width: width, height: bounds.height};
			}else{
				prefSize = {width: bounds.width, height: bounds.height};
			}
		}

		return prefSize;
	};

	thi$.getIconImage = function(){
		return this.def.iconImage || "blank.gif";
	};

	thi$.isIconStateless = function(){
		var M = this.def;
		return M.stateless === true
			|| M.iconStateless === true;
	};

	thi$.setIconImage = function(state){
		if(!this.icon){
			return;
		}

		var buf = this.__buf__.clear();
		buf.append(this.Runtime().imagePath());

		if(!this.isIconStateless()){
			buf.append(state & 0x0F).append("-");
		}

		buf.append(this.getIconImage());

		this.icon.src = buf.toString();
	};

	var _paintColorSign = function(signObj){
		var R = this.Runtime(), color = signObj.color, 
		opacity = signObj.opacity, styles, cview;

		if(!color){
			return;
		}
		
		if(js.awt.Color && (color instanceof js.awt.Color)){
			color = color.toString("hex");
		}
		
		if (color.toLowerCase() == "transparent"
			|| color.toLowerCase() == "rgba(0, 0, 0, 0)") {
			styles = {
				"background-image": "url(" + R.imagePath()
					+ "transparent.gif)"
			};
		} else {
			styles = {"background-color": color};
		}	
		
		if(Class.isNumber(opacity) && opacity >= 0){
			if(opacity > 1){
				opacity = opacity / 100;
			}
			
			styles["opacity"] = opacity;
		}
		
		DOM.applyStyles(this.sign, styles);
	};

	var _paintShapeSign = function(signObj){
		var R = this.Runtime(), shape = signObj.shape,
		styles;
		if(!shape){
			return;
		}
		
		if(signObj.real !== true){
			shape = R.imagePath() + shape;
		}

		styles = {
			backgroundImage: shape,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center"
		};

		DOM.applyStyles(this.sign, styles);
	};

	thi$.paintSign = function(){
		var signObj = this.def.sign;
		if(!this.sign || !Class.isObject(signObj)){
			return;
		}

		switch(signObj.type){
		case "color":
			_paintColorSign.call(this, signObj);
			break;
		case "shape":
			_paintShapeSign.call(this, signObj);
			break;
		default:
			break;
		}
	};

	thi$.setText = function(text, edit){
		if(this.label){
			this.def.labelText = text;
			this.label.innerHTML = js.lang.String.encodeHtml(text);
		}else if(this.input){
			this.def.inputText = text;
			this.input.value = text;
		}

		if(edit){
			this.notifyContainer(
				"js.awt.event.ItemTextEvent", new Event(edit, {}, this));
		}
	};

	thi$.getText = function(){
		if(this.label){
			return this.def.labelText;
		}else if(this.input){
			return this.def.inputText;
		}
		return undefined;
	};

	thi$.isMarkable = function(){
		return this.def.markable === true;
	};

	thi$.isControlled = function(){
		return this.def.controlled === true;
	};

	thi$.isMarked = function(){
		return this._local.marked === true;
	};

	thi$.mark = function(b){
		var marker = this.marker;
		if(!marker) return;

		b = b || false;
		this._local.marked = b;
		this.def.checked = b;

		if(this.isMarked()){
			marker.className = DOM.combineClassName(this.className, "marker_4");
		}else{
			marker.className = DOM.combineClassName(this.className, "marker_0");
		}
	};

	thi$.hoverCtrl = function(b){
		var ctrl = this.ctrl;
		if(!ctrl) return;

		if(b){
			ctrl.className = DOM.combineClassName(this.className, "ctrl_2");
		}else{
			ctrl.className = DOM.combineClassName(this.className, "ctrl_0");
		}
	};

	thi$.triggerCtrl = function(b){
		var ctrl = this.ctrl;
		if(!ctrl) return;

		if(b){
			ctrl.className = DOM.combineClassName(this.className, "ctrl_4");
		}else{
			ctrl.className = DOM.combineClassName(this.className, "ctrl_0");
		}
	};

	/**
	 * @see js.awt.Component#setToolTipText
	 *
	 * @param text
	 * @param elid, can be branch, marker label and ctrl
	 */
	thi$.setToolTipText = function(text, elid){
		if(elid){
			DOM.setAttribute(this[elid], "title", text);
		}else{
			$super(this, text);
		}
	}.$override(this.setToolTipText);

	/**
	 * @see js.awt.Movable
	 */
	thi$.isMoverSpot = function(el, x, y){
		return el != this.branch && el != this.marker 
			&& el !== this.ctrl;
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Component#onStateChanged
	 */
	thi$.onStateChanged = function(){
		$super(this);		  
		
		if(this.isStrict() && this.icon){
			this.setIconImage(this.getState());
		}

	}.$override(this.onStateChanged);

	/*
	 * Do the strict layout	 
	 */
	var _doStrictLayout = function(force){
		if(!this.isDOMElement() || !this.needLayout(force)){
			return false;
		}
		
		var M = this.def, G = {}, bounds = this.getBounds(), MBP = bounds.MBP,
		xbase = MBP.paddingLeft, ybase = MBP.paddingTop,
		left = 0, top, space = bounds.innerWidth, layout = M.layout || {},
		gap = layout.gap || 0, hAlign = layout.align_x, vAlign = layout.align_y,
		ctrlAlign = M.ctrlAlign, items = M.items, len = items.length, 
		rects = [], rigid, ele, id, iid, d, r, h, c = 0, iSize, sv;

		if(!Class.isNumber(hAlign)){
			hAlign = 0.5;
		}

		if(!Class.isNumber(vAlign)){
			vAlign = 0.5;
		}

		if(!Class.isNumber(ctrlAlign)){
			ctrlAlign = 0.5;
		}
		
		for(var i = 0; i < len; i++){
			id = items[i];
			ele = this[id];

			d = G[id] = G[id] || DOM.getBounds(ele);
			MBP = d.MBP;
			iid = id.split(/\d+/g)[0];
			r = {};
			
			space -= MBP.marginLeft;
			switch(iid){
			case "label":
			case "input":
				rigid = (iid === "label") 
					? M.labelRigid === true 
					: M.inputRigid === true;

				if(rigid){
					r.width = d.width;
					space -= r.width;
				}else{
					r.width = null;
					c += 1;
				}

				// ?? Sometimes, no any height style setten for the label,
				// the height of bounds will be 0.
				if(d.height == 0){
					d.height = bounds.innerHeight;
				}
				break;

			case "icon":
			case "sign":
				r.width = d.width;
				
				if(iid === "icon"){
					iSize = M.iconSize || {};
				}else{
					iSize = M.signSize || {};
				}

				sv = iSize.width;
				if(!isNaN(sv) && sv > 0){
					r.width = sv;
				}
				
				sv = iSize.height;
				if(!isNaN(sv) && sv > 0){
					r.height = sv;
				}

				space -= r.width;				 
				break;

			default:
				r.width = d.width;
				space -= r.width;
				break;
			}
			space -= MBP.marginRight;
			
			r.node = ele;
			rects.push(r);
		}
		
		space -= gap * (len - 1);
		
		if(c > 1){
			space = Math.round(space / c);
		}
		
		if(c == 0){
			left = Math.round(space * hAlign);
		}

		for(i = 0, len = rects.length; i < len; i++){
			r = rects[i];
			if(r.width == null){
				r.width = space;
			}

			ele = r.node;
			id = ele.id;
			iid = id.split(/\d+/g)[0];

			d = G[id];
			MBP = d.MBP;
			h = r.height || d.height;

			left += MBP.marginLeft;

			if(iid == "ctrl" && Class.isNumber(ctrlAlign)){
				top = ybase + (bounds.innerHeight - h) * ctrlAlign;
			}else{
				if(!Class.isNumber(vAlign)){
					vAlign = 0.5;
				}
				top = ybase + (bounds.innerHeight - h) * vAlign;
			}

			if(iid == "label"){
				ele.style.lineHeight = h + "px";
			}

			DOM.setBounds(r.node, xbase + left, top, r.width, h, 0);

			left += r.width + MBP.marginRight + gap;
		}
		
		return true;
		
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Item#doLayout
	 */
	thi$.doLayout = function(){
		if(!this.isStrict()){
			var ele = this.label || this.input,
			maxWidth = this.ctrl ? this.ctrl.offsetLeft :
				this.getBounds().innerWidth,
			width = maxWidth - ele.offsetLeft;
			width = width < 0 ? 0 : width;

			if(this.input){
				DOM.setSize(ele, width, undefined);
			}else{
				ele.style.width = width + "px";
			}
		}else{
			_doStrictLayout.apply(this, arguments);
		}

	};

	/**
	 * The js.awt.Item is prepared for those iterable cases. So it must
	 * be simple enough. And it must not be resized, moved, floating and
	 * showing shadow. However it can be disabled.
	 * 
	 * @link js.awt.Component#repaint
	 * @link js.awt.Component#repaint
	 */
	thi$.repaint = function(){
		var rst = false;
		if(!this.isStrict()){
			if(this.isDOMElement()){
				rst = true;
				this.showDisableCover(!this.isEnabled(), 
									  this.def.disableClassName);
			}
		}else{
			rst = $super(this);
		}

		return rst;

	}.$override(this.repaint);

	thi$.destroy = function(){
		if(this.input){
			Event.detachEvent(this.input, "focus", 1,  this, _onFocus);
		}

		if(this.isStrict() && !this.isStateless()){
			this.attachEvent("mouseover", 4, this, _onHover);
			this.attachEvent("mouseout", 4, this, _onHover);

			this.attachEvent("mousedown", 4, this, _onmousedown);
			this.attachEvent("mouseup", 4, this, _onmouseup);
		}

		$super(this);

	}.$override(this.destroy);

	thi$.isEditable = function(){
		return this.label && this.def.editable || false;
	};

	thi$.editLabel = function(){
		if(!this.isEditable()) return;

		var editor =
			new (Class.forName("js.awt.LabelEditor"))(this.label, this);

		MQ.register("js.awt.event.LabelEditorEvent", this, _onedit);

		editor.doEdit();
	};

	var _onedit = function(e){
		var data = e.getData();
		this.setText(data.text, "edit");

		e.getEventTarget().destroy();
		MQ.cancel("js.awt.event.LabelEditorEvent", this, _onedit);
	};

	thi$.canCloneView = function(itemDef){
		var items = [];
		if(itemDef.markable === true){
			items.push("marker");
		}

		if(itemDef.iconImage){
			items.push("icon");
		}

		if(typeof itemDef.sign === "object"){
			items.push("sign");
		}

		if(Class.isValid(itemDef.labelText)){
			items.push("label");
		}else{
			if(Class.isValid(itemDef.inputText)){
				items.push("input");
			}
		}

		if(itemDef.controlled === true){
			items.push("ctrl");
		}

		return items.length === this.def.items.length;
	};

	thi$.onSubmit = function(e){
		var v = this.input.value;
		this.setText(v, "input");
	};

	thi$.validate = function(e){
		// The keycode of mouse event for a password input box is very
		// different with a text input box
		var iptType = this.input.type || "";
		if(iptType.toLowerCase() !== "text"){
			return true;
		}

		var M = this.def,
		kcode = e.keyCode,
		isShift = (e.shiftKey === true),
		dataType = M.dataType || "",
		allowMinus = (M.allowMinus === true),
		value = this.input.value || "",
		valid = false;

		/**
		 * 8: Backspace
		 * 46: Delete
		 * 37: <--
		 * 39: -->
		 * 13: Enter
		 * 110: .
		 * 190: .
		 * 189: -
		 * 109: - (Num Key)
		 * 48-57: 0 - 9
		 * 16: Shift (Left & Right)
		 * 20: Caps Lock
		 * 65-70: a-f / A - F
		 * 96-105: 0-9 (Num Key)
		 */
		if(kcode == 8 || kcode == 46 || kcode == 37 || kcode == 39 || kcode == 13){
			return true;
		}

		switch(dataType.toLowerCase()){
		case "hex":
			if((!isShift && kcode >= 48 && kcode <= 57)
				|| (kcode >= 65 && kcode <= 70) || (kcode >= 96 && kcode <= 105)){
				valid = true;
			}else{
				valid = false;
			}
			break;
		case "integer":
			if(allowMinus && ((!isShift && kcode == 189) || kcode == 109)
			   && value.length == 0){
				valid = true;
			}else if((kcode >= 96 && kcode < 106)
					 || (!isShift && kcode > 47 && kcode < 60)){
				valid = true;
			}else{
				valid = false;
			}

			break;
		case "float":
			if(allowMinus && ((!isShift && kcode == 189) || kcode == 109)
			   && value.length == 0){
				valid = true;
			}else if((kcode >= 96 && kcode < 106)
					 || (!isShift && kcode > 47 && kcode < 60)
					 || ((kcode == 110 || (!isShift && kcode == 190))
						 && value.indexOf(".") == -1)){
				valid = true;
			}else{
				valid = false;
			}
			break;
		default:
			valid = true;
			break;
		}

		return valid;
	};

	var _onKeyDown = function(e){
		if(!this.validate(e)){
			return false;
		}

		if(e.keyCode === 13){
			Event.detachEvent(this.input, "blur", 1, this, _onBlur);
			this.onSubmit(e);
		}

		return true;
	};

	var _onFocus = function(e){
		if(!this._local.eventAttached){
			Event.attachEvent(this.input, 'keydown', 0, this, _onKeyDown);
			Event.attachEvent(this.input, "blur", 1, this, _onBlur);

			this._local.eventAttached = true;
		}
	};

	var _onBlur = function(e) {
		var U = this._local;
		if(U.eventAttached){
			Event.detachEvent(this.input, 'keydown', 0, this, _onKeyDown);
			Event.detachEvent(this.input, "blur", 1, this, _onBlur);

			U.eventAttached = false;
		}

		this.onSubmit(e);
	};

	var _onHover = function(e){
		if(e.getType() === "mouseover"){
			if(this.contains(e.toElement, true)
			   && !this.isHover()){
				this.setHover(true);
			}
		}else{
			if(!this.contains(e.toElement, true)
			   && this.isHover()){
				this.setHover(false);
			}
		}
	};

	var _onmousedown = function(e){
		this._local.mousedown = true;

		e.setEventTarget(this);
		this.notifyPeer(this.msgType(), e);
	};

	var _onmouseup = function(e){
		if(this._local.mousedown === true){
			delete this._local.mousedown;

			if(this.def.toggle === true){
				this.setTriggered(!this.isTriggered());
			}

			e.setEventTarget(this);
			this.notifyPeer(this.msgType(), e);
		}
	};

	var _createElements = function(){
		var M = this.def, items = M.items, G = {}, bounds,
		MBP, xbase, ybase, left, top, innerHeight, D, ele,
		id ,iid, viewType, i, len, 

		buf = this.__buf__, uuid = this.uuid(),
		strict = this.isStrict();

		// For the iterable items, rectify the Box-model compatibility 
		// differences in advance.
		if(!strict){
			bounds = DOM.getBounds(this.view);

			if(!bounds.BBM){
				DOM.setSize(this.view, undefined, bounds.innerHeight);
				bounds = DOM.getBounds(this.view);				  
			}

			MBP = bounds.MBP;
			xbase = MBP.paddingLeft;
			ybase = MBP.paddingTop;
			left = xbase;

			innerHeight = bounds.innerHeight;
		}		 
		
		for(i = 0, len = items.length; i < len; i++){
			id = items[i];
			iid = id.split(/\d+/g)[0];
			switch(iid){
			case "icon":
				viewType = "IMG";
				break;
			case "label":
				viewType = "SPAN";
				break;
			case "input":
				viewType = "INPUT";
				break;
			default:
				viewType = "DIV";
				break;
			}

			ele = DOM.createElement(viewType);
			ele.id = id;
			ele.className = DOM.combineClassName(this.className, id);
			ele.iid = iid;

			buf.clear();
			buf.append("position:absolute;display:block;");

			// For the iterable items, do the layout things ahead
			if(!strict){
				if(!G[iid]){
					ele.style.cssText = "display:block;";
					G[iid] = DOM.getBounds(ele);
				}

				D = G[iid];
				top = ybase + (innerHeight - D.height) * 0.5;
				buf.append("top:").append(top).append("px;");

				if(iid !== "ctrl"){
					buf.append("left:").append(left).append("px;");
					left += D.MBP.marginLeft + D.width + D.MBP.marginRight;
				}else{
					buf.append("right:")
						.append(bounds.MBP.paddingRight).append("px;");
				}
			}

			if(iid == "label"){
				buf.append("white-space:nowrap;");
			}

			ele.style.cssText = buf.toString();

			ele.uuid = uuid;
			this[id] = ele;

			DOM.appendTo(ele, this.view);
		}
	};

	var _checkItems = function(){
		var M = this.def, items = M.items;
		if(items.length > 0){
			return;
		}

		if(this.isMarkable()){
			items.push("marker");
		}

		if(M.iconImage){
			items.push("icon");
		}

		if(M.sign){
			items.push("sign");
		}

		if(Class.isValid(M.labelText)){
			items.push("label");
		}else{
			if(Class.isValid(M.inputText)){
				items.push("input");
			}
		}

		if(this.isControlled()){
			items.push("ctrl");
		}
	};

	thi$._init = function(def, Runtime, view){
		if(def == undefined) return;

		def.classType = def.classType || "js.awt.Item";
		def.className = def.className || "jsvm_item";

		$super(this, def, Runtime, view);

		var M = this.def, uuid = this.uuid(), items, nodes, id, 
		i, len, node, text, ipt, placeholder;
		if(view == undefined){
			items = M.items = M.items || [];

			_checkItems.call(this);
			_createElements.call(this);
		}else{
			items = M.items = [];

			nodes = this.view.childNodes;
			len = nodes.length;
			for(i = 0; i < len; i++){
				node = nodes[i]; 
				id = node.id;
				node.iid = (node.iid || id.split(/\d+/g)[0]);
				node.className = DOM.combineClassName(this.className, id);
				items.push(id);

				node.uuid = uuid;
				this[id] = node;
			}
		}

		if(this.icon){
			this.setIconImage(this.isTriggered() ? 4 : 0);
			//DOM.forbidSelect(this.icon);
		}

		if(this.sign){
			this.paintSign();
		}

		ipt = this.input;
		if(this.label || ipt){
			if(Class.isValid(def.labelText)){
				text = def.labelText;
			}else if(Class.isValid(def.inputText)){
				text = def.inputText;
			}else{
				text = def.text || def.name || def.dname || "Item";
			}

			this.setText(text);
		}

		if(ipt){
			placeholder = def.placeholder;
			if(J$VM.supports.placeholder && Class.isString(placeholder)
			   && placeholder.length > 0){
				ipt.placeholder = placeholder;
			}

			Event.attachEvent(ipt, "focus", 1, this, _onFocus);
		}

		if(this.isMarkable()){
			this.mark(def.checked === true);
		}

		if(this.isStrict() && !this.isStateless()){
			this.attachEvent("mouseover", 4, this, _onHover);
			this.attachEvent("mouseout", 4, this, _onHover);

			this.attachEvent("mousedown", 4, this, _onmousedown);
			this.attachEvent("mouseup", 4, this, _onmouseup);
		}

	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component)
	.$implements(js.awt.Highlighter);
