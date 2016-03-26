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
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

/**
 * @fileOverview Define the FieldSet as a Component. It has a container named as
 * "legendView" as the real container of its contents. However, we try to make
 * the user needn't realize the legendView's existence.
 */
js.swt.FieldSet = function (def, Runtime){
	var CLASS = js.swt.FieldSet, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System;

	/**
	 * Return the component in the LegendView according to the given id. 
	 * 
	 * @param {String} id
	 * @return {js.awt.Component}
	 */
	thi$.get = function(id){
		return this.legendView[id];
	};

	/**
	 * Set the contents for legend of the current FieldSet.
	 */	
	thi$.setLegendText = function(legendText){
		this.legend.innerHTML = String.encodeHtml(legendText);
	};

	/**
	 * @link js.awt.Container#addComponent
	 */
	thi$.addComponent = function(comp, constraints){
		var container = this.legendView;
		return container.addComponent.apply(container, arguments);
	};

	/**
	 * @link js.awt.Container#insertComponent
	 */
	thi$.insertComponent = function(index, comp, constraints){
		var container = this.legendView;
		container.insertComponent.apply(container, arguments);

		this[comp.id] = comp;
		return comp;
	};

	/**
	 * @link js.awt.Container#getComponent
	 */
	thi$.getComponent = function(id){
		return this.legendView.getComponent(id);  
	};

	/**
	 * @link js.awt.Container#getAllComponents
	 */
	thi$.getAllComponents = function(){
		return this.legendView.getAllComponents();	
	};

	/**
	 * @link js.awt.Container#removeComponent
	 */
	thi$.removeComponent = function(comp){
		this.legendView.removeComponent(comp);
		this[comp.id] = null;

		return comp;
	};

	/**
	 * @link js.awt.Container#removeAll
	 */
	thi$.removeAll = function(){
		var container = this.legendView, 
		items = container.items0() || [];

		for(var i = 0, len = items.length; i < len; i++){
			this[items[i]] = null;
		}
		
		container.removeAll();
	};

	/**
	 * @link js.awt.Containable#items
	 */
	thi$.items = function(){
		return this.legendView.items();	 
	};

	/**
	 * @link js.awt.Containable#items0
	 */
	thi$.items0 = function(){
		return this.legendView.items0();  
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Component#doLayout
	 */
	thi$.doLayout = function(force){
		if(arguments.callee.__super__.apply(this, arguments)){
			var D = this.getBounds(), MBP = D.MBP,
			box = DOM.getBounds(this.legend),

			left = MBP.borderLeftWidth + MBP.paddingLeft,
			top = box.height,

			width = D.innerWidth,
			height = D.height - top - MBP.borderBottomWidth - MBP.paddingBottom;

			// Layout legend
			DOM.setStyle(this.legend, "line-height", box.height + "px");

			// In firefox, the coordinate origin of the contents begins with
			// the bottom of FieldSet's legend. But in others browser, it begins
			// with the FieldSet's upper left corner. However, the paddings
			// always take effects in the FieldSet like other DOM element.
			if(J$VM.firefox){
				top = 0;
			}

			this.legendView.setBounds(left, top, width, height, 7);
			return true;
		}

		return false;

	}.$override(this.doLayout);

	/**
	 * @method
	 * @inheritdoc js.awt.Component#destroy
	 */
	thi$.destroy = function(){
		// Destroy the legend
		var view = this.legend, items;
		this.legend = null;		   
		DOM.remove(view, true);

		// Destroy the LegendView
		view = this.legendView;
		items = view.items0() || [];
		for(var i = 0, len = items.length; i < len; i++){
			delete this[items[i]];
		}

		this.legendView = null;
		view.destroy();
		
		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.destroy);
	
	var _getLegendViewDef = function(def, R){
		var vdef = def.legendView = def.legendView || {}, items, iid, idef;
		vdef.classType = vdef.classType || "js.awt.Container";
		vdef.className = vdef.className 
            || DOM.combineClassName(def.className, "legendView");
		vdef.css = "position:absolute;" + (vdef.css || "");

		items = vdef.items = vdef.items || def.items || [];
		delete def.items;

		for(var i = 0, len = items.length; i < len; i++){
			iid = items[i];
			idef = def[iid];
			delete def[iid];

			if(!vdef[iid]){
				vdef[iid] = idef;
			}
		}

		vdef.layout = vdef.layout || def.layout;
		return vdef;
	};

	thi$._init = function(def, Runtime){
		if(typeof def !== "object") return;

		def.classType = def.classType || "js.swt.FieldSet";
		def.className = def.className || "jsvm_fieldset";
		def.stateless = (def.stateless !== false);

		def.viewType = "FIELDSET";
		def.css = "margin:0px;padding-top:0px;";
		arguments.callee.__super__.apply(this, arguments);
		
		var legend = this.legend = DOM.createElement("LEGEND"), 
		vdef, legendView, ele = this.view, items, iid;

		legend.className = DOM.combineClassName(this.className, "legend");
		legend.innerHTML = this.def.legendText;
		ele.appendChild(legend);

		vdef = _getLegendViewDef.apply(this, arguments);
		legendView = this.legendView 
			= new (Class.forName(vdef.classType))(vdef, Runtime);
		legendView.appendTo(ele);

		// Make the user needn't realize the legendView's existence.
		items = legendView.items0() || [];
		for(var i = 0, len = items.length; i < len; i++){
			iid = items[i];
			this[iid] = legendView[iid];
		}

	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.Component);

js.swt.FieldSet.DEFAULTDEF = function(){
	return {
		classType: "js.swt.FieldSet",
		legendText: "",
		rigid_w: false,
		rigid_h: false
	};
};
