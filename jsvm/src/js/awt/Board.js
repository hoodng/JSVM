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
 * File: Board.js
 * Create: 2014/04/02 08:02:59
 * Author: 
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 *
 * 
 */
js.awt.Board = function(def, Runtime){
	var CLASS = js.awt.Board,
	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, System = J$VM.System,
	DOM = J$VM.DOM, MQ = J$VM.MQ,
	
	Label = Class.forName("js.awt.Label"),
	TextField = Class.forName("js.awt.TextField"),
	
	lblDef = {
		classType: "js.awt.Label",
		css: "position:absolute;",
		
		rigid_w: false, rigid_h: true
	},
	
	fieldDef = {
		classType: "js.awt.TextField",	
		css: "position:absolute;margin:0px;",
		
		rigid_w: false, rigid_h: true
	};
	
	thi$.rectifyDef = function(def){
		return def;
	};
	
	thi$.setData = function(data){
		if(!data || !Class.isObject(data)){
			return;
		}
		
		this.def.data = data;
		
		if(this.getElementsCount() > 0){
			this.removeAll();
		}
		
		var R = this.Runtime(), key, v, idef, ext, n = 0;
		for(key in data){
			v = data[key];
			
			ext = {
				className: this.className + "_label",
				text: key + ": ",
				constraints: {rowIndex: n, colIndex: 0}
			};
			idef = this.rectifyDef(System.objectCopy(lblDef, ext));
			this.addComponent(new Label(idef, R));
			
			ext = {
				className: this.className + "_field",
				text: v,
				constraints: {rowIndex: n, colIndex: 1}
			};
			idef = this.rectifyDef(System.objectCopy(fieldDef, ext));
			this.addComponent(new TextField(idef, R));
			
			++n;
		}
		
		if(this.isDOMElement()){
			this.doLayout(true);
		}
	};
	
	thi$.getData = function(){
		return this.def.data;
	};
	
	thi$.getCompOptimalSize = function(comp){
		var txtSize = DOM.getTextSize(comp.view),
		bounds = comp.getBounds(), 
		MBP = bounds.MBP;
		
		txtSize.width += MBP.BPW;
		txtSize.height += MBP.BPH;
		
		return txtSize;
	};
	
	var _layout = function(){
		var M = this.def, 
		comps = this.getAllComponents(), 
		len = comps.length, comp, constraints,
		ridx, cidx, cols = [], rows = [], 
		s, v, ov, bounds, MBP, left, top,
		rcomps = [], tmp, h, th = 0, 
		hgap, vgap, oStyle;
		
		for(var i = 0; i < len; i++){
			comp = comps[i];
			constraints = comp.def.constraints;
			
			ridx = constraints.rowIndex;
			cidx = constraints.colIndex;
			
			tmp = rcomps[ridx];
			if(!tmp){
				tmp = rcomps[ridx] = [];
			}
			tmp[cidx] = comp;
			
			s = this.getCompOptimalSize(comp);

			v = s.height;
			ov = rows[ridx];			
			rows[ridx] = isNaN(ov) ? v : Math.max(v, ov);
			
			v = s.width;
			ov = cols[cidx];
			cols[cidx] = isNaN(ov) ? v : Math.max(v, ov);
		}
		
		bounds = this.getBounds();
		MBP = bounds.MBP;
		left = MBP.paddingLeft;
		top = MBP.paddingTop;
		
		hgap = Class.isNumber(M.hgap) ? M.hgap : 0;
		vgap = Class.isNumber(M.vgap) ? M.vgap : 0;
		
		len = rcomps.length;
		for(i = 0; i < len; i++){
			tmp = rcomps[i];
			h = rows[i];
			
			comp = tmp[0];
			comp.setBounds(left, top, cols[0], h, 7);
			
			comp = tmp[1];
			
			oStyle = DOM.getStyle(comp.view, "overflow");
			DOM.setStyle(comp.view, "overflow", "hidden");
			comp.setBounds(left + cols[0] + hgap, top, cols[1], h, 7);
			DOM.setStyle(comp.view, "overflow", oStyle || "auto");
			
			th += h + vgap;
			top += h + vgap;
		}
		
		return {
			width: cols[0] + hgap + cols[1] + MBP.BPW,
			height: th - vgap + MBP.BPH
		};
	};
	
	thi$.doLayout = function(force){
		if(arguments.callee.__super__.apply(this, arguments)){
			var s = _layout.call(this);
			this.setPreferredSize(s.width, s.height);
			this.setSize(s.width, s.height);

			return true;
		}
		
		return false;
		
	}.$override(this.doLayout);
	
	thi$._init = function(def, Runtime){
		if(typeof def !== "object") return;
		
		def.classType = def.classType || "js.awt.Board";
		def.className = def.className || "jsvm_board";
		
		arguments.callee.__super__.apply(this, arguments);
		
		this.setData(def.data);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.awt.Container);
