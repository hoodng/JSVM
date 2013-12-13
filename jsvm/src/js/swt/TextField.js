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
 * File: TextField.js
 * Create: 2011-10-12
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://github.com/jsvm
 */

$package("js.swt");

/**
 * A <em>TextField</em> is a <em>Component</em> which wraps an input box. 
 * 
 * @param def:{
 *	   className: {String} Style class for current view, required.
 *	   container: {js.awt.Component} Container of current component.
 *					  
 *	   value: {String} Value of current TextField.
 *	   isPassword: {Boolean} Indicate whether the current input is a password input.
 * }
 */

js.swt.TextField = function(def){
	var CLASS = js.swt.TextField, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, E = js.util.Event, 
	DOM = J$VM.DOM, System = J$VM.System;
	
	thi$.getValue = function(dataType) {
		if(typeof dataType !== "string"){
			dataType = this.def.dataType || "";
		}

		var v = this.textField.value;		 
		switch(dataType.toLowerCase()){
		case "integer":
			v = parseInt(v, 10);
			break;
		case "float":
			v = parseFloat(v);
			break;
		default:
			break;
		}
		
		return v;
	};
	
	thi$.setValue = function (value, callback) {
		var v = "";
		if(value != undefined && value != null){
			v = value;
		}
		
		this._latestValue = undefined;
		this.def.value = v;
		this.textField.value = v;
		
		// Determine whether show the placeholder
		_showPlaceholder.call(this, !this.textField.value);
		
		if(callback){
			var e = new E("set", v, this);
			_onValueChanged.call(this, e);
		}
	};
	
	/**
	 * @deprecated
	 */
	thi$.getText = function () {
		J$VM.System.err.println("This method is deprecated, please use getValue");
		return this.getValue();
	};
	
	/**
	 * @deprecated
	 */
	thi$.setText = function (text) {
		J$VM.System.err.println("This method is deprecated, please use setValue");
		this.setValue(text);		
	};
	
	thi$.getEditable = function () {
		return !this.textField.readOnly;
	};
	
	thi$.setEditable = function (b) {
		this.textField.readOnly = !b;
	};
	
	thi$.setEnabled = function(b){
		arguments.callee.__super__.apply(this, arguments);
		this.textField.disabled = !b;
		
	}.$override(this.setEnabled);
	
	thi$.getEnable = function () {
		J$VM.System.err.println("This method is deprecated, please use isEnabled");
		return this.isEnabled();
	};
	
	thi$.focus = function(select){
		if(this.isEnabled()){
			if(J$VM.ie){
				this.textField.setActive();
			}
			
			this.textField.focus();
			
			if(select === true){
				this.textField.select();
			}
		}
	};
	
	thi$.blur = function(){
		if(this.isEnabled()){
			this.textField.blur();
		}
	};
	
	thi$.setMaxLength = function (num) {
		if(num > 0) {
			this.textField.maxLength = num;
		}
	};
	
	var _onPhLabelClick = function(e){
		this.focus();  
	};

	var _createPlaceholder = function(){
		var phLabel = document.createElement("span");
		phLabel.className = this.def.className + "_placeholder";
		phLabel.style.cssText = "position:absolute;left:0px;top:0px;"
			+ "width:1px;height:1px;display:none;";
		phLabel.innerHTML = this.getPlaceholder() || "";
		DOM.appendTo(phLabel, this.view);
		
		E.attachEvent(phLabel, "click", 0, this, _onPhLabelClick);
		return phLabel;
	};
	
	var _adjustPlaceholder = function(){
		var sps = ["left", "top", "height", "line-height"], 
		styles = DOM.getStyles(this.textField, sps);
		
		DOM.applyStyles(this.phLabel, styles);
	};
	
	thi$.setPlaceholder = function(placeholder){
		if(Class.isString(placeholder)){
			this._local.placeholder = placeholder;
			
			if(J$VM.supports.placeholder){
				this.textField.placeholder = placeholder;
			}else{
				if(!this.phLabel){
					this.phLabel = _createPlaceholder.call(this);
				}else{
					this.phLabel.innerHTML = placeholder || "";
				}
				
				_adjustPlaceholder.call(this);
				_showPlaceholder.call(this, !this.textField.value);
			}
		}
	};
	
	thi$.getPlaceholder = function(){
		return this._local.placeholder;	 
	};
	
	var _showPlaceholder = function(b){
		if(this.phLabel){
			this.phLabel.style.display = b ? "inline" : "none";
		}
	};
	
	var _layout = function(){
		var box = this.getBounds(), mbp = box.MBP;
		DOM.setPosition(this.textField, mbp.paddingLeft, mbp.paddingTop);
		
		// Input is special, don't use the size to subtract the pading
		var w = box.innerWidth, h = box.innerHeight, d;
		if(!isNaN(w) || !isNaN(h)){
			DOM.setSize(this.textField, w, h);
		}
		
		d = DOM.getBounds(this.textField);
		h = d.innerHeight;
		if(!isNaN(h)){
			this.textField.style.lineHeight = h + "px";
		}
		
		// Place the placeholder
		if(this.phLabel){
			_adjustPlaceholder.call(this);
		}
	};
	
	thi$.doLayout = function(){
		if(arguments.callee.__super__.apply(this, arguments)){
			_layout.call(this);
			return true;
		}
		
		return false;
		
	}.$override(this.doLayout);

	thi$.destroy = function(){
		E.detachEvent(this.textField, "selectstart", 1, this, _onselectstart);
		E.detachEvent(this.textField, "focus", 1, this, _onFocus);
		
		DOM.remove(this.textField, true);
		delete this.textField;
		
		delete this._latestValue;
		delete this._curValue; 

		arguments.callee.__super__.apply(this, arguments);
	}.$override(this.destroy);
	
	var _onselectstart = function(e) {
		e.cancelBubble();
		return true;
	};
	
	thi$.validate = function(e){
		// The keycode of mouse event for a password input box is very
		// different with a text input box
		if(this.isPassword){
			return true;
		}
		
		var M = this.def, dataType = M.dataType || "", 
		allowMinus = (M.allowMinus === true), isShift = (e.shiftKey === true),
		kcode = e.keyCode, value = this.textField.value || "", 
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
		e.cancelBubble();

		if(!this.validate(e)){
			return false;
		}

		if(e.keyCode === 13){
			E.detachEvent(this.textField, "blur", 1, this, _onBlur);
			
			var value = this.getValue();
			_submitValue.call(this, e, value);
		}

		return true;
	};
	
	var _onKeyUp = function(e){
		e.cancelBubble();
		
		// _onValueChanged.$clearTimer();
		// _onValueChanged.$delay(this, 500, e);
		_onValueChanged.call(this, e);
	};
	
	var _onValueChanged = function(e){
		var value = this.getValue(),
		data = {eType: e.getType(), value: value, changed: false},
		changed = (this._latestValue != value);

		// Record current value
		this._latestValue = value;
		
		if(changed){
			data.changed = true;
			this.fireEvent(
				new E(CLASS.EVT_VALUECHANGED, data, this));
			
			// @deprecated
			if(typeof this.onValueChanged == "function"){
				this.onValueChanged(value);
			}
		}
	};
	
	var _onFocus = function() {
		this._latestValue = this._curValue = this.getValue();
		
		if(!this._local.eventAttached){
			E.attachEvent(this.textField, 'keydown', 1, this, _onKeyDown);
			E.attachEvent(this.textField, 'keyup', 0, this, _onKeyUp);
			E.attachEvent(this.textField, "blur", 1, this, _onBlur);
			
			this._local.eventAttached = true;
		}
		
		// Determine whether show the placeholder
		_showPlaceholder.call(this, false);
	};

	var _onBlur = function(e) {
		if(this._local.eventAttached){
			E.detachEvent(this.textField, 'keydown', 1, this, _onKeyDown);
			E.detachEvent(this.textField, 'keyup', 0, this, _onKeyUp);
			E.detachEvent(this.textField, "blur", 1, this, _onBlur);
			
			this._local.eventAttached = false;
		}
		
		// Determine whether show the placeholder
		_showPlaceholder.call(this, !this.textField.value);
		
		var value = this.getValue();
		_submitValue.call(this, e, value);
	};
	
	var _submitValue = function(e, value){
		var data = {eType: e.getType(), value: value, changed: false};
		data.changed = (this._curValue != value);			
		this.fireEvent(
			new E(CLASS.EVT_SUBMIT, data, this));

		// @deprecated
		if(typeof this.onSubmitValue == "function"){
			this.onSubmitValue(data);
		}
	};
	
	var _createInput = function(def){
		var rView;
		if(this.isPassword) {
			//IE 9 didn't supported the following solution to create an input
			// rView = this.textField = document.createElement("<input type='password'>"); 

			rView = this.textField = document.createElement("input");
			rView.type = "password";
		} else {
			// rView = this.textField = document.createElement("<input type='text'>");
			rView = this.textField = document.createElement("input");
			rView.type = "text";
		}
		
		// Set className
		rView.className = this.def.className + "_input";
		
		var css = "position:absolute;left:0px;top:0px;margin:0px;"
			+ "border:0px none;outline:none;",
		fCss = def.fontCss;
		
		/*
		 * In IE, if an input box has no left/right padding, the cursor will be
		 * invisible when it is at the left/right side of the input. So we reverse 
		 * 1px padding for the left and right edge of input box.
		 */
		/* var pStyle = "padding:0px;";
		 if(J$VM.ie){
		 pStyle = "padding:0px ";
		 pStyle += CLASS.RESERVEDPADDINGLEFT + "px;";
		 }
		 css += pStyle; */
		
		if(Class.isString(fCss) && fCss.length > 0){
			css += fCss;
		}
		rView.style.cssText = css;
		DOM.appendTo(rView, this.view);		
		
		E.attachEvent(rView, "selectstart", 1, this, _onselectstart);
		E.attachEvent(rView, "focus", 1, this, _onFocus);
	};
	
	thi$._init = function(def, Runtime){
		if(typeof def !== "object") return;
		
		def.classType = def.classType || "js.swt.TextField";
		def.className = def.className || "jsvm_textfield";
		arguments.callee.__super__.apply(this, arguments);

		this.isPassword = (def.isPassword === true);
		_createInput.call(this, def);
		
		// Set the display contents
		this.setValue(def.value);
		
		// Set placeholder
		this.setPlaceholder(def.placeholder);
		
		this.setEnabled(def.enable !== false);		 
		this.setEditable(def.editable !== false);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.Component);

js.swt.TextField.RESERVEDPADDINGLEFT = 1;

js.swt.TextField.EVT_SUBMIT = "SubmitValue";
js.swt.TextField.EVT_VALUECHANGED = "ValueChanged";

js.swt.TextField.DEFAULTDEF = function(value){
	return {
		classType: "js.swt.TextField",
		className: "jsvm_textfield",
		fontCss: undefined, /* e.g. "color:#000000;font-size:12px;" */
		
		enable: true,
		editable: true,
		isPassword: false,
		
		value: value || ""
	};
};
