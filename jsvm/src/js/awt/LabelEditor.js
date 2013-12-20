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
 * Author: Hu dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * Label editor
 * 
 * @param listener
 * @param label
 * 
 */
js.awt.LabelEditor = function(label, listener) {
	
	var CLASS = js.awt.LabelEditor, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ;
	
	var styles = [
		"position", "top", "left",
		"font-family", "font-size", "font-style", "font-weight",
		"text-decoration", "text-align", "font-weight",
		"color", "background-color",
		"padding-top","padding-left","padding-bottom","padding-right",
		"border-top-width", "border-right-width", 
		"border-bottom-width", "border-left-width",
		"border-top-style", "border-right-style",
		"border-bottom-style", "border-left-style",
		"border-top-color", "border-right-color",
		"border-bottom-style", "border-left-color"
	];

	thi$.doEdit = function(){

		var input = this.input = DOM.createElement("INPUT"),
		w, h, s,  
		label = this.label;

		input.type = "text";
		input.style.cssText = "outline:none;display:none";
		DOM.insertBefore(input, label);
		input.className = "jsvm_textfield_input";
		this.styles =  DOM.getStyles(label, styles);
		
		if(this.listener.def.autoFit){
			s = DOM.getStringSize(js.lang.String.decodeHtml(label.innerHTML || ""), this.styles);
			w = s.width + label.bounds.MBP.BPW;
			h = s.height + label.bounds.MBP.BPH;
		}else {
			w = parseInt(label.clientWidth + label.bounds.MBP.BW);
			h = parseInt(label.clientHeight + label.bounds.MBP.BH);
		}
		if(J$VM.ie && parseInt(J$VM.ie) == 10){
			w = Math.ceil(w);
			h = Math.ceil(h);
		}
		if(J$VM.ie){
			this.styles.lineHeight = DOM.getStyle(label, "line-height");
			//DOM.applyStyles(input, {lineHeight:DOM.getStyle(label, "line-height")});	  
		}		 
		DOM.applyStyles(input, this.styles);
		DOM.setSize(input, w, h);
		input.style.cssText = input.style.cssText + "-ms-clear{display:none;}";

		input.value = this.text;
		input.style.display = "block";
		input.focus();
		label.style.display = "none";

		Event.attachEvent(input, "blur", 0, this, _onblur);
		Event.attachEvent(input, "keydown", 0, this, _onkeydown);
		Event.attachEvent(input, "mousedown", 0, this, _oninputmsdown);
		if(this.listener && this.listener.def && this.listener.def.autoFit){
			Event.attachEvent(input, "keyup", 1, this, _oninputkeyup);
		}

		Event.detachEvent(document, Event.W3C_EVT_SELECTSTART, 1);
		
		//		  if(this.listener && this.listener.def && this.listener.def.autoFit){
		//			var bounds = DOM.getBounds(input);			
		//			var str = input.getAttribute("style");
		//			str = str.replace(/width\b\s*\:\s*\d+\px;?/ig, "");
		//			input.setAttribute("style",str);
		//			var size = input.size = input.value.length;//input.value.replace(/[^\u0000-\u00ff]/g,"aa").length;
		//			bounds.width = size * 13;
		//			DOM.setSize(input, bounds.width, bounds.height);
		//			input.style.border = "0px";				
		//		  }		   
	};
	
	var _onblur = function(e){
		_doChange.call(this);

		return e.cancelDefault();
	};
	
	var _onkeydown = function(e){
		var c = e.keyCode;
		if (c == 13) {
			_doChange.call(this);
		}

		return true;
	};

	var _oninputmsdown = function(e){
		e.cancelBubble();
	};
	
	var _oninputkeyup = function(e){		
		var input = this.input,
		str = js.lang.String.encodeHtml(input.value),
		obj = this.listener,
		s = DOM.getStringSize(str, this.styles);
		if(obj.isDOMElement()){
			var b = DOM.getBounds(this.input),
			w = s.width,
			h = s.height;
			
			if(J$VM.ie && parseInt(J$VM.ie) == 10){
				w = Math.ceil(w);
				h = Math.ceil(h);
			}
			DOM.setSize(input, w - label.bounds.MBP.PW, h - label.bounds.MBP.PH);
			obj.oninputkeyup(w, h);
		}
	};

	var _doChange = function() {
		if(this.input.value != this.text){
			var label = this.label, recvs = [];
			if(this.listener) recvs.push(this.listener.uuid());
			
			MQ.post("js.awt.event.LabelEditorEvent", 
					new Event("changed", 
							  {label: label, text:this.input.value}, 
							  this),
					recvs);
		}

		DOM.forbidSelect(this.input);
		DOM.remove(this.input, true);
		delete this.input;
		this.label.style.display = "block";
		delete this.label;
		delete this.text;
		delete this.styles;
	};
	
	thi$._init = function(label, listener) {
		arguments.callee.__super__.apply(this, arguments);

		this.listener = listener;
		this.label = label;
		this.text = js.lang.String.decodeHtml(label.innerHTML);

	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.util.EventTarget);



