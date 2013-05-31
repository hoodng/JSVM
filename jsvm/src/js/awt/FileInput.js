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
 * Author:  Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://github.com/jsvm
 */

$package("js.awt");

js.awt.FileInput = function(def, Runtime){
	var CLASS = js.awt.FileInput, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
	
	thi$.onChange = function() {

		var fileName = this.file.value;

		if (fileName == "" || fileName.length == 0) {
			return;
		}

		var txt = fileName.substr(fileName.lastIndexOf('\\') + 1);

		var valid = _checkExt.call(this, fileName);

		if (!valid) {
			this.formPane.fileName.setValue("");
			this.file.value = "";
			if(typeof this.onFileError == "function"){
				this.onFileError();
			}
			return;
		} else {
			this.formPane.fileName.setValue(this.file.value);
			if (typeof this.onFileChange == "function") {
				this.onFileChange(this.getFileName());
			}
		}
	};
	
	var _onFormSubmit = function(fileName){
		this.view.submit();
	};
	
	var _checkExt = function(filename){
		var str = filename.substr(filename.lastIndexOf('.') + 1);
		for(var t in this.types){
			if(str.toLowerCase() == this.types[t]){
				return true;
			}
		}
		return false;
	};
	
	thi$.getFileName = function(){
		return this.formPane.fileName.getValue();
	};
	
	thi$._onMouseOver = function(e) {
		// this.btnBrowse.setMouseOver(true);
		//this.btnBrowse.onmouseover(e);
	};

	thi$._onMouseOut = function(e) {
		// this.btnBrowse.setMouseOver(false);
		//this.btnBrowse.onmouseout(e);
	};

	thi$._onKeyDown = function(e) {
		return false;
	};
	
	thi$.setFormAction = function(action) {
		this.formPane.view.action = action;
	};

	thi$.setFormMethod = function(method) {
		this.formPane.view.method = method;
	};
	
	thi$.setFormEncoding = function(encoding){
		this.formPane.view.encoding = encoding;
	};
	
	thi$.setVisible = function(b){
		arguments.callee.__super__.apply(this, arguments);		
		
		var formPane = this.formPane;
		if(!b){
			formPane.view.style.visibility = "hidden";
			formPane.fileName.textField.style.visibility = "hidden";
			this.file.style.visibility = "hidden";
		}else {
			formPane.view.style.visibility = "visible";
			formPane.fileName.textField.style.visibility = "visible";
			this.file.style.visibility = "visible";
		}
		
	}.$override(this.setVisible);

	thi$.setFormEnctype = function(enctype) {
		this.formPane.view.enctype = enctype;
	};
	
	thi$.setFilter = function(types){
		this.types = types;
	};
	
	thi$.getFilter = function(){
		return this.types;
	};
	
	thi$.destroy = function(){
		this.formPane.fileName.setValue("");
		this.file.value = "";
		arguments.callee.__super__.apply(this, arguments);
	}.$override(this.destroy);
	
	thi$.doLayout = function(force){
		if(arguments.callee.__super__.apply(this, arguments)){
			if(J$VM.firefox){
				var size = this.getWidth()/this._local.charsize;
				this.file.setAttribute("size", size);
			}
			return true;
		}
		return false;
	}.$override(this.doLayout);
	
	var _calcCharSize = function(){
        var label = DOM.createElement("SPAN");
        label.innerHTML = "..........";
        var size = DOM.getTextSize(label);
        return size.width/10;
	};
	
	thi$._init = function(def, Runtime) {
		if(typeof def !== "object"){
			return;
		}
		
		def.layout = def.layout || {
			classType:"js.awt.BorderLayout"
		};		
		def.items = def.items || ["formPane"];
		def.className = def.className || "jsvm_fileinput";
		def.classType = def.classType || "js.awt.FileInput";
		def.css = def.css || "margin:0px,padding:0px;border:0px solid #000;overflow:hidden;height:24px;";
		def.formPane = def.formPane || {
				classType: "js.awt.HBox",
				viewType: "form",
				items: ["fileName", "btnBrowse"],
				
				fileName: {
					classType: "js.swt.TextField",
					className: "jsvm_textfield",
					rigid_w: false,
					rigid_h: true,
					height: 18
				},
				
				btnBrowse:{
					classType: "js.awt.Button",
					className: "jsvm_button",
					labelText: "Browse...",
					rigid_w : true,
					rigid_h : true,
					height: 18
				},
				
				layout:{
					gap:3
				}
			};
		def.id = def.id || "openFile";
		
		arguments.callee.__super__.apply(this, arguments);
		
		var model = this.model = def.model || 
			{action: "",method: "POST",enctype : "multipart/form-data", encoding: "multipart/form-data"};
		
		this.setFormAction(model.action);
		this.setFormMethod("POST");
		this.setFormEnctype("multipart/form-data");
		this.setFormEncoding("multipart/form-data");
		this.setFilter(def.types);
		
		this.formPane.btnBrowse.text = Runtime.nlsText("iidBtnBrowse", "Browse...");
		
		var filePane = this.filePane = DOM.createElement("DIV");
		filePane.style.cssText = "position:absolute;float:right;top:0px;right:0px;width:100%;height:100%";
		var file = this.file = DOM.createElement("INPUT");
		DOM.applyStyles(file, {
			position : "absolute",
			cursor : "default",
			left: 0,
			top: 0,
			height: "100%",
			width: "100%"
		});
		file.className = "jsvm_fileinput_file";
		file.style.cursor = "default";
		file.style.backgroundColor = "red";
		file.name = "fileName";
		file.setAttribute("type", "file");
		DOM.appendTo(file, filePane);
		DOM.appendTo(filePane, this.formPane.view);
		
		this._local.charsize = _calcCharSize.call(this);
				
		Event.attachEvent(file, "change", 0, this, this.onChange);
		Event.attachEvent(file, "mouseover", 1, this, this._onMouseOver);
		Event.attachEvent(file, "mouseout", 1, this, this._onMouseOut);
		Event.attachEvent(file, "keydown", 0, this, this._onKeyDown);		

	}.$override(this._init);
	
	this._init.apply(this,arguments);
	
}.$extend(js.awt.Container);

js.awt.FileInput.DEFAULTCLASS = {
	classType: "js.awt.FileInput",
	className: "jsvm_fileinput",
	css: "margin:0px,padding:0px;border:0px solid #000;overflow:hidden;height:24px;",
	id: "openFile",
	items: ["formPane"],
	formPane: {
		classType: "js.awt.HBox",
		viewType: "form",
		items: ["fileName", "btnBrowse"],
		
		fileName: {
			classType: "js.swt.TextField",
			className: "jsvm_textfield",
			rigid_w: false,
			rigid_h: true,
			height: 18
		},
		
		btnBrowse:{
			classType: "js.awt.Button",
			className: "jsvm_button",
			labelText: "Browse...",
			rigid_w : true,
			rigid_h : true,
			height: 18
		},
		
		layout:{
			gap:3
		}
	},
	layout:{
		classType:"js.awt.BorderLayout"
	}
};
