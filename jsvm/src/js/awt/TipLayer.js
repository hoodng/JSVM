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
 * File: TipLayer.js
 * Create: 2014/02/20 09:16:52
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

js.awt.TipLayer = function(def, Runtime){
	var CLASS = js.awt.TipLayer, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments); 
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, System = J$VM.System,
	MQ = J$VM.MQ, DOM = J$VM.DOM;
	
	/**
	 * Set the tip object for current tip layer. If a old tip object is existed
	 * and not same as the new given object, remove if first. Otherwise, use the
	 * old one directly.
	 * 
	 * @param tipObj: {Component} A Component or Container instance object.
	 */
	thi$.setTipObj = function(tipObj){
		var oTipObj = this.tipObj;
		if(oTipObj && tipObj === oTipObj){
			return null;
		}

		if(oTipObj){
			oTipObj = this.removeTipObj();
		}
		
		if(tipObj && tipObj.view){
			DOM.applyStyles(tipObj.view, {position: "absolute"});
			this.tipObj = tipObj;

			tipObj.id = "tipObj";
			tipObj.appendTo(this.view);
		}
		
		return oTipObj;
	};
	
	/**
	 * Attention:
	 * 
	 * The tipObj is not created by tip layer. So tip layer won't
	 * take responsibility for destroy it.
	 */
	thi$.removeTipObj = function(){
		var tipObj = this.tipObj;
		delete this.tipObj;
		
		if(tipObj){
			tipObj.removeFrom(this.view);
		}
		
		return tipObj;
	};
	
	thi$.getTipObj = function(){
		return this.tipObj;	 
	};
	
	thi$.doLayout = function(force){
		if(arguments.callee.__super__.apply(this, arguments)){
			var tipObj = this.tipObj, bounds = this.getBounds(),
			MBP = bounds.MBP;
			if(tipObj){
				tipObj.setPosition(MBP.borderLeftWidth + MBP.paddingLeft, 
								   MBP.borderTopWidth + MBP.paddingTop);
				tipObj.doLayout(true);
				
				bounds = tipObj.getBounds();
				this.setSize(bounds.width + MBP.BPW, bounds.height + MBP.BPH, 4);
			}
			
			return true;
		}
		
		return false;
		
	}.$override(this.doLayout);
	
	thi$.destroy = function(){
		this.removeTipObj();
		
		arguments.callee.__super__.apply(this, arguments);
		
	}.$override(this.destroy);
	
	thi$._init = function(def, Runtime){
		if(typeof def !== "object") return;
		
		def.classType = def.classType || "js.awt.TipLayer";
		def.className = def.className || "jsvm_tipLayer";
		
		def.isfloating = true;
		def.stateless = true;
		
		arguments.callee.__super__.apply(this, arguments);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.Component);
