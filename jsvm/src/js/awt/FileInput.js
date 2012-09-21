/**
 * Copyright (c) Jinfonet Inc. 2000-2011, All rights reserved.
 * 
 * @File: FileInput.js
 * @Create: 2012-05-24
 * @Author: chao.chen@china.jinfonet.com
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
			this.form.fileName.setValue("");
			this.file.value = "";
			if(typeof this.onFileError == "function"){
				this.onFileError();
			}
			return;
		} else {
			this.form.fileName.setValue(this.file.value);
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
		return this.form.fileName.getValue();
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
		this.form.view.action = action;
	};

	thi$.setFormMethod = function(method) {
		this.form.view.method = method;
	};
	
	thi$.setFormEncoding = function(encoding){
		this.form.view.encoding = encoding;
	};
	
	thi$.setVisible = function(b){
		arguments.callee.__super__.apply(this, arguments);		
		
		var form = this.form;
		if(!b){
			form.view.style.visibility = "hidden";
			form.fileName.textField.style.visibility = "hidden";
			this.file.style.visibility = "hidden";
		}else {
			form.view.style.visibility = "visible";
			form.fileName.textField.style.visibility = "visible";
			this.file.style.visibility = "visible";
		}
		
	}.$override(this.setVisible);

	thi$.setFormEnctype = function(enctype) {
		this.form.view.enctype = enctype;
	};
	
	thi$.setFilter = function(types){
		this.types = types;
	};
	
	thi$.getFilter = function(){
		return this.types;
	};
	
	thi$.destroy = function(){
		this.form.fileName.setValue("");
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
		
		def = System.objectCopy(def, CLASS.DEFAULTCLASS, true, true);
		
		arguments.callee.__super__.apply(this, arguments);
		
		var model = this.model = def.model || 
			{action: "",method: "POST",enctype : "multipart/form-data", encoding: "multipart/form-data"};
		
		this.setFormAction(model.action);
		this.setFormMethod("POST");
		this.setFormEnctype("multipart/form-data");
		this.setFormEncoding("multipart/form-data");
		this.setFilter(def.types);
		
		this.form.btnBrowse.text = Runtime.nlsText("iidBtnBrowse", "Browse...");
		
		var file = this.file = DOM.createElement("input");
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
		file.name = "fileName";
		file.setAttribute("type", "file");
		DOM.appendTo(file, this.form.view);
		
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
	items: ["form"],
	form: {
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