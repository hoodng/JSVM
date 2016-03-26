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
 * File: CanvasLabel.js
 * Create: 2013/05/31 01:34:35
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");
$import("js.awt.Graphics2D");

/**
 * Define a kind label which is draw with canvas.
 * 
 * @param def: {Object} Definition of the CanvasLabel as follow:
 *		  labelText: {String} Contents of current canvas label to draw
 */
js.awt.CanvasLabel = function(def, Runtime){
	var CLASS = js.awt.CanvasLabel,
	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, 
	DOM = J$VM.DOM, System = J$VM.System,
	Font = Class.forName("js.awt.Font"),
	
	fontSps = ["fontFamily", "fontSize", "fontStyle", "fontWeight",
			   "fontVariant", "lineHeight", "color", "textOverflow"];
	
	thi$.setDrawData = function(sp, v){
		var data = this._local.drawData;
		if(Class.isString(sp) && Class.isValid(v) 
		   && data[sp] !== v){
			data[sp] = v;
		}
	};
	
	thi$.getDrawData = function(sp){
		var data = this._local.drawData;
		return data[sp];
	};
	
	thi$.getFontInfo = function(){
		return _prepareFontInfo.call(this);
	};
	
	thi$.getTextSize = function(){
		var fontInfo = _prepareFontInfo.call(this);
		return this.measureText(this.def.labelText, fontInfo.font.toString());
	};
	
	/**
	 * Set contents for current label.
	 * 
	 * @param text: {String} Contents to set.
	 */
	thi$.setText = function(text){
		var M = this.def, U = this._local;
		if(Class.isString(text) && text != U.labelText){
			M.labelText = text;

			this.setDrawData("text", text);
		}
	};
	
	/**
	 * Return contents of current label.
	 */
	thi$.getText = function(){
		return this.def.labelText;	
	};
	
	/**
	 * Up to now, since need to calculate the preferred size, 
	 * we only support follwing rotate for the flexible label:
	 * 180 * n (0, 1, 2, 3, 4, 5, ...)
	 * 90 + 180 * n (0, 1, 2, 3, 4, 5, ...)
	 */
	var _isSupportedRotate = function(rotate){
		return Class.isNumber(rotate) 
			&& ((rotate % 180 == 0) || (rotate % 90 == 0));
	};
	
	/**
	 * Set rotate degress of current label.
	 * Up to now, since need to calculate the preferred size, 
	 * we only support follwing rotate for the flexible label:
	 * 180 * n (0, 1, 2, 3, 4, 5, ...)
	 * 90 + 180 * n (0, 1, 2, 3, 4, 5, ...)
	 * 
	 * @param rotate: {Integer} The rotate degress
	 */
	thi$.setRotate = function(rotate){
		var U = this._local;
		if(_isSupportedRotate.call(this, rotate) && rotate != U.rotate){
			this.setDrawData("rotate", rotate);
		}
	};
	
	/**
	 * Return rotate degress of current label.
	 */
	thi$.getRotate = function(){
		return this.getDrawData("rotate");
	};
	
	var _prepareFontInfo = function(force){
		var U = this._local, info = U.fontInfo, font, 
		ele, textOverflow;
		if(force || !info){
			ele = DOM.createElement("SPAN");
			ele.className = this.className;
			ele.style.cssText = this.view.style.cssText;
			ele.style.whiteSpace = "nowrap";
			ele.style.visibility = "hidden";
			
			// When we append an DOM element to body, if we didn't set any "position"
			// or set the position as "absolute" but "top" and "left" that element also
			// be place at the bottom of body other than the (0, 0) position. Then it
			// may extend the body's size and trigger window's "resize" event.
			ele.style.position = "absolute";
			ele.style.top = "-10000px";
			ele.style.left = "-10000px";

			DOM.appendTo(ele, document.body);
			
			info = U.fontInfo = DOM.getStyles(ele, fontSps);
			textOverflow = info["textOverflow"];
			font = info.font = Font.initFont(info);

			DOM.remove(ele, true);
			
			this.setDrawData("byEllipsis", 
							 (textOverflow === "ellipsis" ? true : false));			
			this.setDrawData("font", font.toString());
			this.setDrawData("fillStyle", info["color"]);
		}
		
		return info;
	};
	
	var _prepareDrawData = function(){
		var M = this.def, data = this._local.drawData, 
		bounds = this.getBounds();
		
		data.x = 0;
		data.y = 0;
		data.width = bounds.innerWidth;
		data.height = bounds.innerHeight;
		
		data.angleUnit = "deg";
		data.textBaseline = "top";
		
		_prepareFontInfo.call(this, false);
		return data;
	};
	
	thi$.doLayout = function(){
		if($super(this)){
			var layer = this.curLayer(), renderer = layer.getRenderer(), 
			ctx = layer.getContext(), drawData = _prepareDrawData.call(this),
			data = new (Class.forName("js.awt.shape.Text"))(drawData, this);
			
			layer.erase();
			renderer.drawText(ctx, data.getShapeInfo(), data.getStyles());

			return true;
		}
		
		return false;
		
	}.$override(this.doLayout);
	
	
	thi$.applyStyles = function(styles){
		var fontStyleChanged = function(value, sp){
			return sp.match(/font/) != undefined;
		}.$some(this, styles);
		
		if(fontStyleChanged){
			_prepareFontInfo.call(this, force);			   
		}
		
		return $super(this);
		
	}.$override(this.applyStyles);
	
	thi$.getPreferredSize = function(){
		var M = this.def, prefSize = M.prefSize, 
		bounds, s, w, h, rotate;
		if(!prefSize){
			s = this.getTextSize();
			bounds = this.getBounds();
			
			w = Math.ceil(s.width + bounds.MBP.BPW);
			h = Math.ceil(s.height + bounds.MBP.BPH);
			
			//?? If rotate % 180 != 0, swap width and height
			rotate = this.getRotate() || 0;
			if(rotate % 180 == 0){
				prefSize = {width: w, height: h};
			}else{
				prefSize = {width: h, height: w};
			}
		}
		
		return prefSize;
		
	}.$override(this.getPreferredSize);
	
	thi$.destroy = function(){
		delete this._local.fontInfo;
		delete this._local.drawData;
		
		$super(this);
		
	}.$override(this.destroy);
	
	thi$._init = function(def, Runtime){
		if(typeof def !== "object") return;
		
		def.classType = def.classType || "js.awt.CanvasLabel";
		def.className = def.className || "jsvm_canvasLabel";
		def.angleUnit = def.angleUnit || "deg";
		def.labelText = Class.isString(def.labelText) 
			? def.labelText : (Class.isString(def.text) ? def.text : "");
		
		$super(this);
		
		var data = this._local.drawData = def.data || {};
		this.setText(def.labelText || data.text);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.awt.Graphics2D);
