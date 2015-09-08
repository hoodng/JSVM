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
 * File: HItem.js
 * Create: 2015/07/21 03:20:16
 * Author: 
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

$import("js.awt.Item");

/**
 * @fileOverview Define the more complex item. It is horizontal and with more
 * complex layout than js.awt.Item. It can have own model. And it should be used
 * to replace js.swt.DItem and com.jinfonet.ui.CtrlItem.
 */

/**
 * @class js.swt.HItem
 * @extends js.awt.Item
 * 
 * @param {Object} def The definition for HItem.
 * 
 *		  @example
 *		  {
 *			  markable: true / false, // Indicate whether show a marker
 *			  iconImage: "xxx", // Optional
 * 
 *			  model: {	// Optional
 *				  dname: "xxx", // Optional
 *				  sign: {
 *					  type: "color" / "shape",
 *					  color: "xxx" / js.awt.Color,
 *					  opacity: 0.45,
 *					  
 *					  shape: "xxx",
 *					  real: true / false //Indicate whether the shape is real path.
 *				  },
 * 
 *				  value: {},
 *				  ...
 *			  },
 * 
 *			  labelRigid: false, // Indicate whether the label's width is rigid.
 *			  inputRigid: false, // Indicate whether the input's width is rigid.
 * 
 *			  iconSize: {width: xx, height: xx}, // Optional
 * 
 *			  controlled: true, // Indicate whether the current item has ctrl
 *			  ctrlAlign: 0.5, // 0.0 - 1.0
 * 
 *			  layout: { 
 *				  gap: 0,
 *			  
 *				  align_x: 0.5, //0.0 - 1.0
 *				  align_y: 0.5	// 0.0 - 1.0
 *			  }
 *		  }
 */
js.swt.HItem = function(def, Runtime){
	var CLASS = js.swt.HItem,
	thi$ = CLASS.prototype;
	
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

		return U.msgType || "js.swt.event.HItemEvent";
	};
	
	thi$.isControlled = function(){
		return this.def.controlled === true;
	};
	
	/**
	 * @method
	 * @inheritdoc js.awt.Item#getPreferredSize
	 */
	thi$.getPreferredSize = function(){
		var prefSize = this.def.prefSize, size;
		if(!this.isPreferredSizeSet || !prefSize){
			size = this.getSize();
			prefSize = {
				height: size.height,
				width: size.width
			};
		}

		return prefSize;
	};	

	/**
	 * @method
	 * @inheritdoc js.awt.Component#onStateChanged
	 */
	thi$.onStateChanged = function(){
		arguments.callee.__super__.apply(this, arguments);		  
		
		if(this.icon){
			this.setIconImage(this.getState());
		}

	}.$override(this.onStateChanged);

	/**
	 * The js.swt.HItem is different from the js.awt.Item. It should be the 
	 * normal component. So it can support resize, move and so on.
	 * 
	 * @link js.awt.Component#repaint
	 * @link js.awt.Component#repaint
	 */
	thi$.repaint = function(){
		return js.awt.Component.prototype.repaint.apply(this, arguments);
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Item#doLayout
	 */	   
	thi$.doLayout = function(force){
		if(!this.isDOMElement() || !this.needLayout(force)){
			return false;
		}

		var G = this.getGeometric(), bounds = this.getBounds(),
		xbase = bounds.MBP.paddingLeft, ybase = bounds.MBP.paddingTop,
		left = 0, M = this.def, layout = def.layout, gap = layout.gap || 0, 
		iSize, sv, space = bounds.innerWidth, hAlign = layout.align_x, 
		vAlign = layout.align_y, ctrlAlign = M.ctrlAlign, 
		items = M.items, len = items.length, rects = [], rigid,
		ele, id, iid, d, MBP, r, h, c = 0, top;
		
		for(var i = 0; i < len; i++){
			id = items[i];
			ele = this[id];

			iid = id.split(/\d+/g)[0];
			r = {};
			d = G[id];

			switch(iid){
			case "label":
			case "input":
				G[id] = d = DOM.getBounds(ele);
				
				rigid = iid === "label" 
					? M.labelRigid : M.inputRigid;
				if(rigid){
					r.width = d.width;
					space -= r.width;
				}else{
					r.width = null;
					c += 1;
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
			
			r.node = ele;
			rects.push(r);
		}
		
		space -= gap*(len - 1);
		
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
				if(Class.isNumber(vAlign)){
					top = ybase + (bounds.innerHeight - h) * vAlign;
				}else{
					top = undefined;
				}
			}

			DOM.setBounds(r.node, xbase + left, top, r.width, r.height, 0);
			left += r.width + MBP.marginRight + gap;
		}
		
		return true;
		
	}.$override(this.doLayout);

	/**
	 * @method
	 * @inheritdoc js.awt.Item#destroy
	 */
	thi$.destroy = function(){
		if(!this.isStateless()){
			this.detachEvent("mouseover", 4, this, _onHover);
			this.detachEvent("mouseout", 4, this, _onHover);

			this.detachEvent("mousedown", 4, this, _onmousedown);
			this.detachEvent("mouseup", 4, this, _onmouseup);
		}
		
		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.destroy);

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

	var _preDef = function(def, R){
		var m = def.model, iconImage, sign, dname;
		if(!Class.isObject(m)){
			return def;
		}

		iconImage = m.img || m.iconImage;
		if(iconImage){
			def.iconImage = iconImage;
		}

		sign = m.sign;
		if(Class.isObject(sign)){
			def.sign = sign;	
		}

		dname = m.dname;
		if(Class.isValid(dname)){
			if(def.useInput === true){
				def.inputText = dname;
				def.labelText = null;
			}else{
				def.inputText = null;
				def.labelText = dname;
			}
		}

		def.checked = (m.marked === true);

		return def;
	};

	thi$._init = function(def, Runtime, view){
		if(typeof def !== "object") return;

		def.classType = def.classType || "js.swt.HItem";
		def.className = def.className || "jsvm_item";
		def.stateless = def.stateless || false;

		var layout = def.layout = def.layout || {};
		if(!Class.isNumber(layout.align_x)){
			layout.align_x = 0.0;
		}

		if(!Class.isNumber(layout.align_y)){
			layout.align_y = 0.5;
		}

		def = _preDef.call(this, def, Runtime);
		arguments.callee.__super__.apply(this, arguments);

		if(def.stateless !== true){
			this.attachEvent("mouseover", 4, this, _onHover);
			this.attachEvent("mouseout", 4, this, _onHover);

			this.attachEvent("mousedown", 4, this, _onmousedown);
			this.attachEvent("mouseup", 4, this, _onmouseup);
		}

		// For compatible with the old DItem
		this.model = def.model || {};

	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.awt.Item);
