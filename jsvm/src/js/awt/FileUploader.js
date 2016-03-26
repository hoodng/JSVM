/**

 Copyright 2010-2015, The JSVM Project. 
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
 * File: FileUploader.js
 * Create: 2015/10/14 02:04:58
 * Author: 
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * @fileOverview Define the component for supporting to choose and upload the
 * file to the specified action.
 */

/**
 * @class js.awt.FileUploader
 * @extends js.awt.Container
 */
js.awt.FileUploader = function(def, Runtime){
	var CLASS = js.awt.FileUploader,
	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	CLASS.EVT_FILECHANGED = "filechanged";
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ,

	jsTools = Class.forName("js.util.Tools");
	
	/**
	 * Set the init file.
	 * 
	 * @param {String} The path / name of the initial file.
	 */
	thi$.setFile = function(f){
		if(!Class.isString(f)){
			return;
		}

		var fileInput = this.fileInput, 
		fileField = this.fileField;
		if(fileInput.value !== f){
			fileInput.value = f;
		}

		if(fileField){
			fileField.setValue(f);
		}
	};

	/**
	 * Return the current selected file.
	 * 
	 * @return {String} The path / name of the selected file.
	 */
	thi$.getFile = function(){
		return this.fileInput.value;
	};

	/**
	 * Set the accepted file extensions for validating the selected file,
	 * such as [".jpg", ".png", ".exe"].
	 * 
	 * @param {Array} exts
	 */
	thi$.setFileExtensions = function(exts){
		this._local.fileExts = exts;
	};

	/**
	 * Return the accepted file extensions.
	 * 
	 * @return {Array}
	 */
	thi$.getFileExtensions = function(){
		return this._local.fileExts;  
	};

	/**
	 * Set the server URL as the submmitting action of the form.
	 * 
	 * @param {String} action
	 */
	thi$.setFormAction = function(action){
		this.uploadForm.action = action;  
	};

	/**
	 * Judge whether the current selected file is valid.
	 * 
	 * @param {String} file The path / name to check.
	 * 
	 * @return {Boolean}
	 */
	thi$.validateFile = function(file){
		var exts = this._local.fileExts, 
		ext = jsTools.getFileSuffix(file),
		rst = true;
		if(Class.isArray(exts) && exts.length > 0){
			rst = Class.isIn(ext, exts);
		}

		return rst;
	};

	/**
	 * Start up the uploader to pop up the file chooser dialog,
	 * then upload the selected file.
	 */
	thi$.triggerUpload = function(e){
		var fileInput = this.fileInput, evt;
		if(document.createEvent){
			evt = document.createEvent("MouseEvents");
			evt.initEvent("click", false, false);
			fileInput.dispatchEvent(evt);
		}else{
			fileInput.click();	 
		}
	};

	var _getDefaultTarget = function(){
		var iframe = this.targetFrame;
		if(!iframe){
			iframe = this.targetFrame = DOM.createElement("IFRAME");
			iframe.id = iframe.name = "TragetFrame" + js.lang.Math.hash();
			iframe.style.cssText = "position:absolute;left:0px;top:0px;"
				+ "width:0px;height:0px;overflow:hidden;display:none;";
			DOM.appendTo(iframe, this.view);
		}

		return iframe.name;
	};

	/**
	 * Submit the selected file to the specified target action.
	 * 
	 * @param {String} target The optional target identification.
	 * 
	 * Ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
	 * 
	 * target:
	 * 
	 * A name or keyword indicating where to display the response that is
	 * received after submitting the form. In HTML 4, this is the name/keyword
	 * for a frame. In HTML5, it is a name/keyword for a browsing context 
	 * (for example, tab, window, or inline frame). The following keywords
	 * have special meanings:
	 * 
	 * _self: Load the response into the same HTML 4 frame (or HTML5 browsing
	 *		  context) as the current one. This value is the default if the 
	 *		  attribute is not specified.
	 * _blank: Load the response into a new unnamed HTML 4 window or HTML5 
	 *		  browsing context.
	 * _parent: Load the response into the HTML 4 frameset parent of the 
	 *		  current frame, or HTML5 parent browsing context of the current
	 *		  one. If there is no parent, this option behaves the same way as
	 *		  _self.
	 * _top: HTML 4: Load the response into the full original window, and
	 *		 cancel all other frames. HTML5: Load the response into the 
	 *		 top-level browsing context (i.e., the browsing context that 
	 *		 is an ancestor of the current one, and has no parent). If there
	 *		 is no parent, this option behaves the same way as _self.
	 * iframename: The response is displayed in a named <iframe>.
	 */
	thi$.submit = function(target){
		var form = this.uploadForm;
		form.target = target || _getDefaultTarget.call(this);

		if(!form.action){
			throw "Illegal form action!";
		}

		form.submit();
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Container#destroy
	 */
	thi$.destroy = function(){
		var fileInput = this.fileInput, form = this.uploadForm,
		btn = this.btnFileBrowse, iframe = this.targetFrame,
		M = this.def;

		this.fileInput = null;
		this.uploadForm = null;
		this.targetFrame = null;

		DOM.remove(fileInput, true);
		DOM.remove(form, true);

		if(iframe){
			DOM.remove(iframe, true);
		}

		if(M.wholeTrigger !== true && btn){
			btn.detachEvent("click", 4, this, _onClick);
		}else{
			this.detachEvent("click", 4, this, _onClick);
		}

		$super(this);		 

	}.$override(this.destroy);

	var _onClick = function(e){
		var fileInput = this.fileInput, ele = e.srcElement;
		if(ele === fileInput){
			return;			   
		}
		
		this.triggerUpload(e);
	};

	var _onFileChanged = function(e){
		var fileInput = this.fileInput, 
		fileField = this.fileField,
		file = fileInput.value, 
		valid = this.validateFile(file),
		value = file, evt;
		
		if(!valid){
			value = "";
			fileInput.value = "";
		}

		if(fileField){
			fileField.setValue(value);
		}

		evt = new Event(CLASS.EVT_FILECHANGED, 
						{file: file, valid: valid}, this);
		this.fireEvent(evt);
	};

	/*
	 * Ref: http://help.dottoro.com/lhwjmspm.php
	 * 
	 * The selected files can be submitted to a server if the following
	 * conditions are met:
	 * 1) A form element must contain the file selection control.
	 * 2) The action attribute of the container form must be set to the URL
	 *	  of the server.
	 * 3) The method attribute of the container form must be set to 'post'.
	 * 4) The encType attribute of the container form must be set to 'multipart/form-data'.
	 * 5) The name attribute of the file selection control must be specified
	 *	  and non-empty.
	 */
	var _initUploadForm = function(def, R){
		var fileInput = this.fileInput = DOM.createElement("INPUT"),
		form = this.uploadForm = DOM.createElement("FORM");

		fileInput.type = "file";
		fileInput.name = "fileName";

		form.method = "POST";
		form.encType = "multipart/form-data";
		form.encoding = "multipart/form-data"; // For old browser version

		form.style.cssText = "position:absolute;left:0px;top:0px;"
			+ "width:1px;height:1px;overflow:hidden;display:none;";
		fileInput.style.cssText = "display:none;";

		DOM.appendTo(fileInput, form);
		DOM.appendTo(form, this.view);

		Event.attachEvent(fileInput, "change", 0, this, _onFileChanged);
	};

	/**
	 * Generate and return the definition for the specified item.
	 * 
	 * @param {String} iid The id of the item.
	 * @param {Object} def The definition of the current FileUploader.
	 * @param {js.lang.Runtime} R
	 * 
	 * @return {Object} The definition of item.
	 */
	thi$.getItemDef = function(iid, def, R){
		var tclassName = DOM.combineClassName(def.className, iid), idef;
		switch(iid){
		case "fileField":
			idef = {
				classType: "js.swt.TextField",
				className: "jsvm_textfield $jsvm_textfield" + " " + tclassName,

				editable: false,

				rigid_w: false,
				rigid_h: true
			};
			break;
		case "btnFileBrowse":
			idef = {
				classType: "js.awt.Button",
				className: "jsvm_button $jsvm_button" + " " + tclassName,
				labelText: R.nlsText("btnBrowse--ellipsis", "Browse..."),
				effect: true,

				rigid_w: true,
				rigid_h: true
			};
			break;
		}

		return idef;
	};

	var _preDef = function(def, R){
		var items = def.items = def.items || ["fileField", "btnFileBrowse"],
		len = items.length, i, iid;
		for(i = 0; i < len; i++){
			iid = items[i];
			if(!def[iid]){
				def[iid] = this.getItemDef(iid, def, R);
			}
		}

		def.layout = def.layout || {
			classType: "js.awt.BoxLayout",
			axis: 0,

			gap: 3
		};

		return def;
	};

	thi$._init = function(def, Runtime){
		if(typeof def !== "object") return;
		
		def.classType = def.classType || "js.awt.FileUploader";
		def.className = def.className || "jsvm_fileUploader";

		_preDef.apply(this, arguments);
		$super(this);

		/*
		 * Init the form for uploading form to server.
		 * 
		 * For submmitting the form, all uncorrelated inputs in the form also 
		 * will be collected and submmitted to server. That won't be reasonable.
		 * So the uploader don't use the form as its view.
		 */ 
		_initUploadForm.apply(this, arguments);

		// Set the accepted file extensions
		this.setFileExtensions(def.fileExts);

		// Set the form action
		this.setFormAction(def.formAction);

		var btn = this.btnFileBrowse;
		if(def.wholeTrigger !== true && btn){
			btn.attachEvent("click", 4, this, _onClick);
		}else{
			this.attachEvent("click", 4, this, _onClick);
		}

	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.awt.Container);
