/**

 Copyright 2010-2013, The JSVM Project. 
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
 * File: ListItem.js
 * Create: 2012/07/09 05:31:14
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

/**
 * @param def: {
 *	   className: {String} required,
 *	   css: {String} optional
 *	   id: {String} optional,
 *	   container: {js.awt.Component),
 *
 *	   markable: {Boolean} Default is <em>false</em>. If <em>true</em>, the
 *		   item will be like a checkbox. An icon expressed checked/unchecked will be created.
 *	   removable: {Boolean} Default is false. If <em>true</em>, the item will show a remove 
 *		   button float on right.
 *	   removeIcon: {String} Name of the remove button icon, optional.
 *
 *	   enable: {Boolean} Default is <em>true</em> indicate whether item can interact with user,
 * 
 *	   showTips: {Boolean} Default is false, required. Indicate whether this item should show 
 *		   its tooltips with its display value.
 * 
 *	   model: {
 *		   dname: abbr. of displayValue,
 *		   img: abbr. of display image,
 *		   value: realValue,
 *		   marked: Default is false, optional. Indicate whether this item should be 
 *				   selected after initialization
 *	   }
 * }
 */
js.swt.ListItem = function(def, Runtime, view){
	var CLASS = js.swt.ListItem, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, E = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ;

	/**
	 * Make the icon as stateless
	 */	   
	thi$.setIconImage = function(){
		var buf = this.__buf__.clear();
		buf.append(this.Runtime().imagePath())
			.append(this.getIconImage());

		this.icon.src = buf.toString();
	}.$override(this.setIconImage);
	
	thi$.getModel = function(){
		return this.model;
	};
	
	thi$.isMine = function(model){
		if (!(this.model && model))
			return false;
		
		if (this.model === model)
			return true;
		
		//TODO: maybe this is not enough
		if ((this.model.value === model.value)
			&& ((this.model.dname === model.dname)
				|| (this.model.img === model.img))) {
			return true;
		}
		
		return false;
	};
	
	thi$.hasController = function(b){
		if(Class.isBoolean(b)){
			this.model.noController = !b;
		}
		
		return !this.model.noController;
	};
	
	thi$.getValue = function(){
		var value = this.model ? this.model.value : null;
		return value;
	};
	
	thi$.mark = function(b){
		$super(this);
		this.model.marked = this.isMarked();
	}.$override(this.mark);
	
	thi$.isHoverForSelected = function(){
		return this.def.hoverForSelected === true;
	};
	
	thi$.setSelected = function (b) {
		if (this.isMarkable()) {
			this.mark(b);
		} else {
			this._local.selected = b;
			this.model.marked = b;
			
			if(this.isHoverForSelected()){
				this.setHover(b);
			}else{
				this.setHover(false);
				this.setTriggered(b);
			}
		}
	};
	
	thi$.isSelected = function () {
		return this._local.selected || this.isMarked();
	};
	
	thi$.getContent = function () {
		var m = this.model || {};
		return m.dname || "";
	};
	
	thi$.isSearchable = function () {
		return Class.isString(this.model.dname);
	};
	
	thi$.cloneView = function(){
		var v = $super(this);
		DOM.removeFun(v);
		
		return v;
	}.$override(this.cloneView);
	
	var _preInit = function(def){
		var m = def.model;
		if(!m){
			return def;
		}
		
		var sign = m.sign, dname = m.dname,
		iconImage = m.img || m.iconImage;

		if(Class.isObject(sign)){
			def.sign = sign;	
		}
		
		if(dname !== undefined || dname !== null){
			def.labelText = dname;
		}
		
		if(iconImage !== undefined || iconImage !== null){
			def.iconImage = iconImage;
		}
		
		def.checked = (m.marked === true);
		return def;
	};
	
	thi$._init = function(def, Runtime, view){
		if(typeof def !== "object") return;
		def.classType = def.classType || "js.swt.ListItem";
		def.className = def.className || "jsvm_listItem";
		
		var newDef = System.objectCopy(def, {}, true);
		this.model = newDef.model;
		
		newDef = _preInit.call(this, newDef);
		$super(this, newDef, Runtime, view);
		
		var m = this.model;
		if(newDef.showTips && m){
			var tip = m.tip || m.dname || "";
			this.setToolTipText(tip);
		}

		this.setEnabled(newDef.enable !== false);
		if(newDef.checked){
			this.setSelected(true);
		}
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.Item);
