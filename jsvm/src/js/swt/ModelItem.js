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
 * File: ModelItem.js
 * Create: 2015/07/21 03:20:16
 * Author: 
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

$import("js.awt.Item");

/**
 * @fileOverview Define the spcial Item which has its own model. And it should be
 * used as the display item of ComboBox, ComboSelector and so on.
 */

/**
 * @class js.swt.ModelItem
 * @extends js.awt.Item
 * 
 * @param {Object} def The definition for ModelItem.
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
js.swt.ModelItem = function(def, Runtime){
	var CLASS = js.swt.ModelItem,
	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ;

	/**
	 * @method
	 * @inheritdoc js.awt.Item#destroy
	 */
	thi$.destroy = function(){
		this.model = null;

		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.destroy);

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

		def.classType = def.classType || "js.swt.ModelItem";
		def.className = def.className || "jsvm_item";
		def.strict = (def.strict !== false);

		_preDef.apply(this, arguments);
		arguments.callee.__super__.apply(this, [def, Runtime, view]);

		this.model = def.model;

	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.awt.Item);
