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
 * File: ToolTip.js
 * Create: 2014/02/20 06:41:25
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * An interface for showing user-defined tooltips.
 * 
 * Attention:
 * 
 * If the user-defined tooltips will be shown for GraphicElement, its "Graphic2D" 
 * ancestor object must invoke the "checkAttachEvent" method to make the "mouseover",
 * "mouseout", "mousemove" can be fired and listened, as follow:
 *	   this.checkAttachEvent("mouseover", "mouseout", "mousemove");
 */
js.awt.ToolTip = function(){
	var CLASS = js.awt.ToolTip, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		return;
	}
	CLASS.__defined__ = true;
	
	CLASS.DEFAULTTOOLTIPID =  "__J$VMTOOLTIP__";
	
	var Class = js.lang.Class, Event = js.util.Event, 
	System = J$VM.System, MQ = J$VM.MQ;
	
	thi$.layerDef = function(def){
		var U = this._local, cdef = U.layerDef;
		if(Class.isObject(def)){
			cdef = U.layerDef = System.objectCopy(def, {}, true);			 
		}
		
		return cdef || {shadow: true};
	};
	
	/**
	 * Set the tip object for tip layer. The tip object is the real content
	 * component for showing user-defined tips. It can be any "Component", 
	 * "Container" instance object.
	 * 
	 * @param tipObj: {Component} A Component or Container instance object.
	 * @param gc: {Boolean} Indicate whether gc the old useless tipObj.
	 */
	thi$.setTipObj = function(tipObj, gc){
		var tipLayer = this.tipLayer, oTipObj;
		if(tipLayer){
			delete this._local.tipObj;
			oTipObj = tipLayer.setTipObj(tipObj, gc);
			
			if(gc === true && oTipObj && !oTipObj.destroied 
			   && Class.isFunction(oTipObj.destroy)){
				oTipObj.destroy();
			}
		}else{
			this._local.tipObj = tipObj;
		}
	};
	
	thi$.getTipObj = function(){
		var tipLayer = this.tipLayer, U = this._local,
		tipObj = tipLayer ? tipLayer.tipObj : null;
		return tipObj || U.tipObj;
	};
	
	var _createTipObjByDef = function(def){
		var classType = def ? def.classType : null,
		tipClz = Class.isString(classType) 
			? Class.forName(def.classType) : null,
		tipObj;	  
		if(!tipClz){
			return tipObj;
		}
		
		def.stateless = true;
		def.NUCG = true;
		def.className = def.className || "jsvm_tipObj";
		
		tipObj = new (tipClz)(def, this.Runtime());
		return tipObj;
	};
	
	/**
	 * Set the tip object by the specified definition. The real tip object
	 * will be created with the given definition.
	 * 
	 * @param def: {Object} Definition for the tip object.
	 */ 
	thi$.setTipObjByDef = function(def){
		var tipObj = _createTipObjByDef.call(this, def);
		this.setTipObj(tipObj, true);
		
		return tipObj;
	};

	/**
	 * Set the text for the label tip. If the label tip object is not
	 * existed, create it first.
	 * 
	 * @param labelText: {String} Text for the label tip.
	 * @param styles: {Object} Optional. Some extra styles for the label 
	 *		  tip to apply.
	 * @param extDef: {Object} Optional. Some extra definition.
	 */
	thi$.setTipLabel = function(labelText, styles, extDef){
		// Creat it when show
		this._local.tipLabelArgs 
			= Array.prototype.slice.call(arguments, 0);
	};
	
	/**
	 * Maybe, sometimes we need to adjust the tip contents accordint to the 
	 * runtime event position. Then we can use it.
	 */
	thi$.adjustTipObj = function(e){
		return false;  
	};
	
	var _initTipLabel = function(labelText, styles, extDef){
		var LabelClz = js.awt.Label, tipLabel = this.getTipObj(), tdef;
		if(!tipLabel || !(tipLabel instanceof LabelClz)){
			tdef = {
				id: "tipObj",
				classType: "js.awt.Label",
				className: "jsvm_tipObj",

				NUCG: true,
				stateless: true		   
			};
			
			if(extDef && Class.isObject(extDef)){
				System.objectCopy(extDef, tdef);
			}
			
			tdef.classType = "js.awt.Label";
			tipLabel = _createTipObjByDef.call(this, tdef);
			tipLabel.doLayout = function(){
				return;
			};
		}
		
		if(styles && Class.isObject(styles)){
			tipLabel.applyStyles(styles);
		}
		
		tipLabel.setText(labelText);
		
		return tipLabel;
	};
	
	var _initTipObj = function(){
		var U = this._local, tipObj = this.getTipObj(),
		args = U.tipLabelArgs;
		
		// Destroy cache
		//delete U.tipLabelArgs;
		
		if(Class.isArray(args) && args.length > 0){
			tipObj = _initTipLabel.apply(this, args);
		}
		
		return tipObj;
	};
	
	var _getTipLayer = function(){
		var M = this.def, tipLayer = this.tipLayer, 
		tipLayers, tipId, tdef;
		if(tipLayer){
			return tipLayer;
		}
		
		tipLayers = CLASS.TIPLAYERS;
		if(!tipLayers){
			tipLayers = CLASS.TIPLAYERS = {cnt: 0};
		}
		
		tipId = M.tipId;
		if(!tipId){
			tipId = M.tipId = this.hasOwnTip() 
				? this.uuid() + "_tip" : CLASS.DEFAULTTOOLTIPID;
		}
		
		tipLayer = tipLayers[tipId];
		if(tipLayer){
			tipLayer["__refCnt__"] += 1;
			return tipLayer;
		}
		
		tdef = this.layerDef();
		tdef.id = tipId;
		tipLayer = this.tipLayer 
			= new (Class.forName("js.awt.TipLayer"))(tdef, this.Runtime());
		tipLayer["__refCnt__"] = 1;
		
		tipLayers.cnt += 1;
		tipLayers[tipLayer.id] = tipLayer;
		return tipLayer;
	};

	
	thi$.showTipLayer = function(b, e){
		var U = this._local, tipLayer = this.tipLayer, tipObj, xy;
		if(b){
			if(!tipLayer){
				tipLayer = this.tipLayer = _getTipLayer.call(this);
			}

			tipObj = _initTipObj.call(this);
			if(tipObj){
				tipLayer.setTipObj(tipObj, true);
			}
			
			if(this.adjustTipObj(e) 
			   && tipLayer.isDOMElement()){
				tipLayer.doLayout(true); 
			}

			xy = e.eventXY();
			tipLayer.showAt(xy.x - 2, xy.y + 18, true);
		}else{
			if(tipLayer){
				tipLayer.hide(e);
			}
		}
	};
	
	var _onhover = function(e){
		if(e.getType() === "mouseover"){
			this.showTipLayer(true, e);
		}else{
			this.showTipLayer(false);
		}
	};
	
	var _onmousemv = function(e){
		var tipLayer = this.tipLayer, xy;
		if(tipLayer && tipLayer.isShown()){
			this.showTipLayer(true, e);
		}
	};
	
	thi$.gcTipLayer = function(){
		var M = this.def, tipLayer = this.tipLayer, 
		tipLayers = CLASS.TIPLAYERS, tipId, tipObj;
		
		delete this.tipLayer;
		if(!tipLayer){
			return;
		}
		
		tipId = M.tipId;
		tipLayer["__refCnt__"] -= 1;

		if(tipLayer["__refCnt__"] == 0){
			delete tipLayers[tipId];
			tipLayers.cnt -= 1;
			
			tipObj = tipLayer.removeTipObj();
			if(tipObj && !tipObj.destroied 
			   && Class.isFunction(tipObj.destroy)){
				tipObj.destroy();
			}
			
			
			tipLayer.destroy();
		}
		
		if(tipLayers.cnt == 0){
			delete CLASS.TIPLAYERS;
		}
	};
	
	/**
	 * Init the user-defined tip usage environment and prepare to listen
	 * the mouseover, mouseout and mousemove event.
	 * 
	 * Here, two branch logics are existed. For the GraphicElement, the 
	 * user event will be attached with the flag 4. And for Component, 
	 * the DOM event will be attached with the flag 0.
	 */
	thi$.setTipUserDefined = function(b){
		b = (b === true);
		
		this.def = this.def || {};
		this._local = this._local || {};
		
		var M = this.def, U = this._local, flag = this.view ? 0 : 4, 
		tip, tipLayer;

		M.useUserDefinedTip = b;
		if(b){
			tip = U.nativeTip = M.tip;
			if(Class.isString(tip) && tip.length > 0
			   && Class.isFunction(this.delToolTipText)){
				this.delToolTipText();				  
			}
			
			if(U.attachedFlag !== flag){
				if(!isNaN(U.attachedFlag)){
					this.detachEvent("mouseover", U.attachedFlag, this, _onhover);
					this.detachEvent("mouseout", U.attachedFlag, this, _onhover);				  
					this.detachEvent("mousemove", U.attachedFlag, this, _onmousemv);
				}
				
				this.attachEvent("mouseover", flag, this, _onhover);
				this.attachEvent("mouseout", flag, this, _onhover);
				this.attachEvent("mousemove", flag, this, _onmousemv);
				
				U.attachedFlag = flag;
			}
		}else{
			delete U.layerDef;
			delete U.tipLabelArgs;
			
			tipLayer = this.tipLayer;
			if(tipLayer){
				tipLayer.hide();
				this.gcTipLayer();
			}

			tip = U.nativeTip;
			if(Class.isString(tip) && tip.length > 0 
			   && Class.isFunction(this.setToolTipText)){
				this.setToolTipText(tip);
			}
			
			if(!isNaN(U.attachedFlag)){
				this.detachEvent("mouseover", U.attachedFlag, this, _onhover);
				this.detachEvent("mouseout", U.attachedFlag, this, _onhover);				  
				this.detachEvent("mousemove", U.attachedFlag, this, _onmousemv);

				delete U.attachedEventFlag;
			}
		}
	};
	
	thi$.isTipUserDefined = function(){
		return this.def.useUserDefinedTip;
	};
	
	thi$.hasOwnTip = function(){
		return this.def.hasOwnTip === true;
	};
};
