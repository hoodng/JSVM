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
 * File: HotSpotLine.js
 * Create: 2013/02/07 06:20:10
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

js.awt.HotSpotLine = function(def, Runtime){
	var CLASS = js.awt.HotSpotLine, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, System = J$VM.System, DOM = J$VM.DOM;
	
	thi$.getMoveObject = function(e){
		var moveObj = this.moveObj;
		if(!moveObj){
			var absXY = DOM.absXY(this.view), 
			def = System.objectCopy(this.def, {}, true),
			ele = this.cloneView();
			
			def.className = this.className + "_move";
			def.stateless = true;
			
			if(ele){
				ele.className = def.className;
			}
			
			moveObj = this.moveObj = 
				new CLASS(def, this.Runtime(), ele);
			moveObj.applyStyles({position: "absolute"});
			moveObj.setMovingPeer(this.getPeerComponent());
			moveObj.appendTo(document.body);
			moveObj.setPosition(absXY.x, absXY.y);
		}

		return moveObj;
		
	}.$override(this.getMoveObject);
	
	thi$.getMovingMsgType = function(){
		return "js.awt.event.HotSpotLineMovingEvent";		  
		
	}.$override(this.getMovingMsgType);
	
	thi$._init = function(def, Runtime){
		if(typeof def !== "object") return;
		
		def.classType = def.classType || "js.awt.HotSpotLine";
		def.className = def.className || "jsvm_hotSpotLine";
		arguments.callee.__super__.apply(this, arguments);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.Component);
