/**
 Copyright 2007-2015, The JSVM Project.
 All rights reserved.

 *
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * Define Button component
 *
 * @param def:{
 *	 className: string, required
 *
 *	 id: request,
 *
 *	 iconImage: "",
 *	 iconAlign: "left"|"right"|"top"|"bottom"
 *	 labelText: "Button",
 *
 *	 state:optional,
 *	 toggle:boolean, required
 *
 * }
 */
js.awt.Button = function(def, Runtime){

	var CLASS = js.awt.Button, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System;

	thi$.getMsgType = function(){
		return "js.awt.event.ButtonEvent";
	};

	thi$.setIconImage = function(state){
		var buf = this.__buf__.clear();
		buf.append(this.Runtime().imagePath())
			.append(state & 0x0F).append("-")
			.append(this.getIconImage());

		this.icon.src = buf.toString();
	};

	thi$.getIconImage = function(){
		return this.def.iconImage || "blank.gif";
	};

	thi$.setText = function(text){
		if(this.label){
			this.def.labelText = text;
			this.label.innerHTML = js.lang.String.encodeHtml(text);
		}
	};

	thi$.getText = function(){
		if(this.label){
			return this.def.labelText;
		}

		return undefined;
	};

	thi$.isMarkable = function(){
		return this.def.markable === true;
	};

	thi$.isMarked = function(){
		return this.def.marked === true;
	};

	thi$.mark = function(b){
		var marker = this.marker;
		if(!marker) return;

		b = b || false;
		this.def.marked = b;

		if(this.isMarked()){
			marker.className = DOM.combineClassName(this.className, "marker_4");
		}else{
			marker.className = DOM.combineClassName(this.className, "marker_0");
		}
	};

	thi$.isOnMousedown = function(){
		return this._local.mousedown === true;
	};

	thi$.setTipText = function(s){
		arguments.callee.__super__.apply(this, arguments);

		if(this.icon) {
			DOM.setAttribute(this.icon, "title", s);
		}
		if(this.label){
			DOM.setAttribute(this.label, "title", s);
		}

	}.$override(this.setTipText);

	/**
	 * @see js.awt.Component
	 */
	thi$.repaint = function(){
        var M = this.def;
        
		arguments.callee.__super__.apply(this, arguments);
        
        if(this.icon){
			this.setIconImage(this.isTriggered() ? 4 :
                              (this.isEnabled() ? 0 : 1));
		}

		if(this.label){
			this.setText(M.labelText || M.text || M.name || "Button");
		}

		if(M.effect){
			this._local.effectClass = M.effectClass;
			_createEffectLayer.call(this);
		}

	}.$override(this.repaint);

	/**
	 * @see js.awt.Component
	 */
	thi$.doLayout = function(force){
        if(!arguments.callee.__super__.apply(this, arguments))
            return;

		var M = this.def, G0 = this.getGeometric(), B = this.getBounds(),
			BBM = B.BBM, MBP = B.MBP,
			innerWidth = B.innerWidth, innerHeight= B.innerHeight,
			xbase = MBP.paddingLeft, ybase = MBP.paddingTop,
			align_x = M.layout.align_x,
			align_y = M.layout.align_y,
			items = M.items, ele, i, len, cwidth = 0, D,
			buf = this.__buf__, left, top, uwidth;

		for(i=0, len=items.length; i<len; i++){
			ele = this[items[i]];
			D = G0[ele.iid];
			if(ele.iid == "label"){
				cwidth += ele.scrollWidth;
			}else{
				cwidth += ele.offsetWidth + D.MBP.marginRight;
			}
		}

		cwidth = cwidth > innerWidth ? innerWidth : cwidth;

		left = xbase + (innerWidth - cwidth) * align_x;
		for(i=0, len=items.length; i<len; i++){
			ele = this[items[i]];
			D = G0[ele.iid];
			top = ybase + (innerHeight - D.height) * align_y;
            
			buf.clear().append(ele.style.cssText)
			.append(";left:").append(left).append("px;")
			.append("top:").append(top).append("px;");

			if(ele.iid === "label"){
				buf.append("width:").append(cwidth+2).append("px;")
				.append("white-space:nowrap;overflow:hidden;")
				.append("text-overflow:ellipsis;");
			}

			ele.style.cssText = buf.toString();

			uwidth = D.width + D.MBP.marginRight;
			left   += uwidth;
			cwidth -= uwidth;
		}

		_adjustEffectLayer.call(this);

	}.$override(this.doLayout);

	/**
	 * @see js.awt.State
	 * @see js.awt.Component
	 */
	thi$.onStateChanged = function(){
		arguments.callee.__super__.apply(this, arguments);

		if(this.icon){
			this.setIconImage(this.getState());
		}
	}.$override(this.onStateChanged);

	thi$.setEnabled = function(b){
		if(!b){
			_showEffectLayer.call(this, "normal");
		}

		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.setEnabled);

	var _getEffectStyleClass = function(style){
		style = style || "normal";

		var tclazz = this._local.effectClass;
		if(tclazz){
			tclazz = DOM.combineClassName(tclazz, style);
		}else{
			tclazz = DOM.combineClassName("jsvm_btnEffect", style);

			if(this.className){
				style = "Effect" + "_" + style;
				tclazz += " " + DOM.combineClassName(this.className, style, "");
			}
		}

		return tclazz;		  
	};

	var _showEffectLayer = function(style){
		if(!this._effectLayer || !this.isEnabled()){
			return;
		}

		this._effectLayer.className 
			= _getEffectStyleClass.call(this, style);

		if(this.isStyleByState()){
			var state;
			switch(style){
			case "trigger":
				state = 4;
				break;
			case "hover":
				state = 2;
				break;
			default:
				break;
			}

			if(!isNaN(state) && state !== this.getState()){
				this.view.className 
					= DOM.stateClassName(this.def.className, state);
			}
		}
	};

	var _createEffectLayer = function(){
		var layer = this._effectLayer = DOM.createElement("DIV");
		layer.uuid = this.uuid();
		layer.className = _getEffectStyleClass.call(this, "normal");
		layer.style.cssText = "position:absolute;left:0px;top:0px;";
        this.view.appendChild(layer);
	};

	var _adjustEffectLayer = function(){
		if(this._effectLayer){
			// The effect layer has border
			DOM.setSize(this._effectLayer,
						this.view.clientWidth, this.view.clientHeight);
		}
	};

	var _onmousedown = function(e){
		_showEffectLayer.call(this, "trigger");

		this._local.mousedown = true;
		this.onHover(false, e.getType());

		e.setEventTarget(this);
		this.notifyPeer(this.getMsgType(), e);
	};

	var _onmouseup = function(e){
		if(this._local.mousedown === true){
			delete this._local.mousedown;

			_showEffectLayer.call(
				this,
				this.isHover() ? "hover" : "normal");

			if(this.def.toggle === true){
				this.setTriggered(!this.isTriggered());
			}

			e.setEventTarget(this);
			this.notifyPeer(this.getMsgType(), e);
		}
	};

	thi$.onHover = function(b, eType){
		// Do something if need.
	};

	var _onmouseover = function(e){
		if(this.contains(e.toElement, true)
		   && !this.isHover()){
			this.setHover(true);
			_showEffectLayer.call(this, "hover");

			this.onHover(true, e.getType());
		}
	};

	var _onmouseout = function(e){
		if(!this.contains(e.toElement, true)
		   && this.isHover()){
			delete this._local.mousedown;

			this.setHover(false);
			_showEffectLayer.call(
				this,
				!this.isTriggered() ? "normal" : "trigger");

			this.onHover(false, e.getType());
		}
	};

	var _createElements = function(){
		var G = this.getGeometric(), className = this.className,
		    items = this.def.items, ele, id, iid, viewType, i, len;

		for(i=0, len=items.length; i<len; i++){
			id = items[i];
			iid = id.split(/\d+/g)[0];
			switch(iid){
			    case "icon":
				viewType = "IMG";
				break;
			    case "label":
				viewType = "SPAN";
				break;
			    default:
				viewType = "DIV";
				break;
			}

			ele = DOM.createElement(viewType);
			ele.id = id;
			ele.className = DOM.combineClassName(className, id);
			ele.iid = iid;

			if(!G[iid]){
                G[iid] = DOM.getBounds(ele);
			}
			ele.style.position ="absolute";
			DOM.appendTo(ele, this.view);
		}
	};

	var _checkItems = function(){
		var M = this.def, items = M.items = (M.items || []);
		if(items.length == 0){
			if(this.isMarkable()) items.push("marker");
			if(M.iconImage) items.push("icon");
			if(M.labelText) items.push("label");
		}
	};

	thi$.destroy = function(){
		DOM.remove(this._effectLayer, true);
		delete this._effectLayer;

		this.detachEvent("mouseover", 4, this, _onmouseover);
		this.detachEvent("mouseout",  4, this, _onmouseout);
		this.detachEvent("mousedown", 4, this, _onmousedown);
		this.detachEvent("mouseup",	  4, this, _onmouseup);

		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.destroy);

	thi$._init = function(def, Runtime, view){
		if(typeof def !== "object") return;

		def.classType = def.classType || "js.awt.Button";
		def.className = def.className || "jsvm_button";

		arguments.callee.__super__.apply(this, [def, Runtime, view]);

		var layout = def.layout = def.layout || {};
		layout.align_x = Class.isNumber(layout.align_x) ? layout.align_x : 0.5;
		layout.align_y = Class.isNumber(layout.align_y) ? layout.align_y : 0.5;

		// Create inner elements
		if(!Class.isHtmlElement(view)){
			_checkItems.call(this);
			_createElements.call(this);
		}

		def.items = [];
		var uuid = this.uuid(), nodes = this.view.childNodes,
		id, i, len, node;
		for(i=0, len=nodes.length; i<len; i++){
			node = nodes[i]; id = node.id;
			node.uuid = uuid;
			node.iid = (node.iid || id.split(/\d+/g)[0]);
			def.items.push(id);
			this[id] = node;
		}

		this.setAttribute("touchcapture", "true");
        
		this.attachEvent("mouseover", 4, this, _onmouseover);
		this.attachEvent("mouseout",  4, this, _onmouseout);
		this.attachEvent("mousedown", 4, this, _onmousedown);
		this.attachEvent("mouseup",	  4, this, _onmouseup);

	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component);

js.awt.Button.eventDispatcher = function(e){
	var Class = js.lang.Class, System = J$VM.System,
	target, func;
	
	switch(e.getType()){
	case "mousedown":
		if(Class.isFunction(this.activateComponent)){
			this.activateComponent();			 
		}
		break;
	case "mouseup":
	case "message":
		target = e.getEventTarget();
		func = this["on" + target.id];
		func = Class.isFunction(func) ? func : this.onbtnDispatcher;
		if(Class.isFunction(func)){
			func.call(this, target, e);
		}else{
			System.err.println("Can not found function for button "+ target.id);
		}
		break;
	default:
		break;
	}
};
