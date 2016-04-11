/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.awt");

$import("js.awt.Component");
$import("js.awt.Dialog");

/**
 * def :{
 * 
 *	   model:{
 *		  msgType:	  info|warn|error|confirm
 *		  msgSubject: Any string
 *		  msgContent: Any string
 *	   }
 * }
 */
js.awt.MessageBox = function(def, Runtime){
	var CLASS = js.awt.MessageBox, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
		System = J$VM.System, MQ = J$VM.MQ, Str = js.lang.String,
		icons = {
			info : "info.gif",
			warn : "alert.gif",
			error : "error.gif",
			confirm : "confirm.gif"
		};

	/**
	 * The data feedback to dialog opener.
	 * 
	 * Notes: Sub class should implements this function.
	 */
	thi$.getDialogData = function(){
		return this.def.model;
	}.$override(this.getDialogData);

	/**
	 * @see js.awt.Component
	 */
	thi$.doLayout = function(force){
		if($super(this)){
			var bounds = this.getBounds(), icon = this.icon, 
				label = this.label, text = this.text, h, top;
			
			if(label){
				DOM.setSize(label,
							bounds.innerWidth - label.offsetLeft);
				h = icon.offsetHeight - label.offsetHeight;
				h = icon.offsetTop + (h > 0 ? h/2 : 0);
				DOM.setPosition(label, undefined, h);
			}else{
				h = icon.offsetHeight > text.offsetHeight; 
				top = icon.offsetTop + (h > 0 ? h / 2 : 0);
				DOM.setPosition(text, undefined, top);
			}

			DOM.setSize(text,
						bounds.innerWidth - text.offsetLeft, 
						bounds.innerHeight	- text.offsetTop);

			return true;
		}

		return false;

	}.$override(this.doLayout);

	thi$.initialize = function(){
		var m = this.def.model, title = m.title, R = this.Runtime();
		if(!title){
			switch(m.msgType){
			case CLASS.INFO:
				title = R.nlsText("msgDlgInfoTitle", "Information");
				break;
			case CLASS.WARN:
				title = R.nlsText("msgDlgWarnTitle", "Warning");
				break;
			case CLASS.ERROR:
				title = R.nlsText("msgDlgErrTitle", "Error");
				break;
			case CLASS.CONFIRM:
				title = R.nlsText("msgDlgConfirmTitle", "Confirm");
				break;
			}
		}
		this.setTitle(title || "");

	}.$override(this.initialize);

	var _createElements = function(model){
		var R = this.Runtime(), icon, label, text, styleClass;

		icon = this.icon = DOM.createElement("IMG");
		styleClass = DOM.combineClassName(this.className, "icon");
		DOM.setClassName(icon, styleClass);
		icon.src = R.imagePath() + icons[model.msgType];
		this.view.appendChild(icon);

		if(model.msgSubject){
			label = this.label = DOM.createElement("SPAN");
			styleClass = DOM.combineClassName(this.className, "subject");
			DOM.setClassName(label, styleClass);
			label.innerHTML = model.msgSubject;
			this.view.appendChild(label);
		}

		text = this.text = DOM.createElement("TEXTAREA");
		styleClass = DOM.combineClassName(this.className, "content");
		DOM.setClassName(text, styleClass);
		text.readOnly = "true";
		text.innerHTML = model.msgContent || "";
		this.view.appendChild(text);
	};

	thi$._init = function(def, Runtime){

		def.classType = def.classType || "js.awt.MessageBox";
		def.className = def.className || "jsvm_msg";

		$super(this);

		var model = this.def.model || {
			msgType:	"info",
			msgSubject: "Info subject",
			msgContent: "Info content"
		};

		_createElements.call(this, model);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(js.awt.DialogObject);

(function(){
	var CLASS = js.awt.MessageBox;
	CLASS.INFO = "info";
	CLASS.WARN = "warn";
	CLASS.ERROR= "error";
	CLASS.CONFIRM = "confirm";
})();

