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
 * File: SComponent.js
 * Create: 2015/08/04 09:11:30
 * Author: mingfa.pan@china.jinfonet.com
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

/**
 * Define the special component with the customized view component and 
 * two scrollbars
 */

/**
 * @class js.swt.SComponent
 * @extends js.awt.Component
 */
js.swt.SComponent = function(def, Runtime){
	var CLASS = js.swt.SComponent,
	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, System = J$VM.System,
	DOM = J$VM.DOM, MQ = J$VM.MQ;

	var _onMousewheel = function(e){
		var hScrollbar = this.hScrollbar, vScrollbar = this.vScrollbar,
		domE = e._event, deltaX = domE.deltaX, deltaY = domE.deltaY,
		cview = this.vcomp.view;

		if(Class.isNumber(deltaX) && deltaX != 0){
			hScrollbar.view.scrollLeft += deltaX;
			cview.scrollLeft += deltaX;		   
		}

		if(Class.isNumber(deltaY) && deltaY != 0){
			vScrollbar.view.scrollTop += deltaY;
			cview.scrollTop += deltaY;
		}		 
	};

	/**
	 * Set the view component for maitaining the component contents.
	 * 
	 * @param {js.awt.Component} comp
	 */
	thi$.setVComponent = function(comp){
		if(!comp){
			return;
		}
		
		var vcomp = this.vcomp;
		this.vcomp = null;

		if(vcomp){
			vcomp.detachEvent(Event.W3C_EVT_MOUSE_WHEEL, 4, 
							  this, _onMousewheel);
			vcomp.destroy();
		}

		comp.view.style.position = "absolute";
		comp.view.style.overflow = "hidden";

		comp.attachEvent(Event.W3C_EVT_MOUSE_WHEEL, 4,
						 this, _onMousewheel);

		this.vcomp = comp;		  
		comp.appendTo(this.view);
	};

	/**
	 * Return the view component which is the contents' viewport component 
	 * of the scrollable component.
	 * 
	 * @return {js.awt.Component}
	 */
	thi$.getVComponent = function(){
		return this.vcomp;	
	};

	/**
	 * Calculate and return the scroll size of the current view component.
	 * 
	 * @return {Object}
	 */
	thi$.getScrollSize = function(){
		var vcomp = this.vcomp, ele, s, D;
		if(vcomp && vcomp.isVisible()){
			if(Class.isFunction(vcomp.getScrollSize)){
				s = vcomp.getScrollSize();
			}else{
				ele = vcomp.view;
				ele.style.overflow = "hidden";

				D = vcomp.getBounds();
				s = {
					width: ele.scrollWidth,
					height: ele.scrollHeight
				};
			}
		}

		return s;
	};

	var _checkScrollbars = function(w, h){
		var hbw = J$VM.supports.preHScrollEleH,
		vbw = J$VM.supports.preVScrollEleW,

		rst = {
			v: false, h: false,
			vbw: vbw, hbw: hbw	
		},

		vcomp = this.vcomp, s, tw, th;

		if(vcomp && vcomp.isVisible()){
			s = this.getScrollSize();
			tw = rst.tw = s.width;
			th = rst.th = s.height;

			if(tw > w && th > h){
				rst.v = true;
				rst.h = true;
			}else if(th > h){
				rst.v = true;

				if(tw > w - vbw){
					rst.h = true;
				}
			}else{
				if(tw > w){
					rst.h = true;

					if(th > h - hbw){
						rst.v = true;
					}
				}
			}
		}

		return rst;
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Component#doLayout
	 */
	thi$.doLayout = function(){
		if($super(this)){
			var bounds = this.getBounds(), MBP = bounds.MBP,
			w = bounds.innerWidth, h = bounds.innerHeight,
			x = MBP.paddingLeft, y = MBP.paddingTop,
			comp, rst;

			// Show / hide scrollbars
			rst = _checkScrollbars.call(this, w, h);
			w -= (rst.v ? rst.vbw : 0);
			this.vScrollbar.display(rst.v);

			h -= (rst.h ? rst.hbw : 0);
			this.hScrollbar.display(rst.h);

			// Layout the vcomp
			comp = this.vcomp;
			if(comp && comp.isVisible()){
				comp.setBounds(x, y, w, h, 5);
			}

			// Lay out scrollbars
			if(rst.v){
				comp = this.vScrollbar;
				comp.setDataSize({w: 1, h: rst.th}, {w: 1, h: h});
				comp.setBounds(x + w, y, rst.vbw, h);
			}

			if(rst.h){
				comp = this.hScrollbar;
				comp.setDataSize({w: rst.tw, h: 1}, {w: w, h: 1});
				comp.setBounds(x, y + h, w, rst.hbw);
			}

			comp = this.blankBar;
			if(rst.v && rst.h){
				comp.display(true);
				comp.setBounds(x + w, y + h, rst.vbw, rst.hbw);
			}else{
				comp.display(false);
			}

			return true;
		}

		return false;

	}.$override(this.doLayout);

	/**
	 * Handler for the "childrenchanged" from the Element.
	 * 
	 * @link js.awt.Element#_childrenChanged
	 */
	thi$.onchildrenchanged = function(e){
		var U = this._local, os = U.scrollSize,
		s = this.getScrollSize();

		if(os && s && os.width === s.width 
		   && os.height === s.height){
			return;			   
		}

		this.doLayout(true);
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Component#elementFromPoint
	 */
	thi$.elementFromPoint = function(x, y, nothese){
		return this.vcomp.elementFromPoint(x, y, nothese);
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Component#destroy
	 */
	thi$.destroy = function(){
		var comp = this.vcomp;
		this.vcomp = null;

		if(comp){
			comp.detachEvent(Event.W3C_EVT_MOUSE_WHEEL, 4, 
							 this, _onMousewheel);
			comp.destroy();
		}
		
		// Destroy the scrollbars
		comp = this.hScrollbar;
		this.hScrollbar = null;
		comp.destroy();

		comp = this.vScrollbar;
		this.vScrollbar = null;
		comp.destroy();

		comp = this.blankBar;
		this.blankBar = null;
		comp.destroy();

		comp = null;
		arguments.calee.__super__.apply(this, arguments);

	}.$override(this.destroy);

	thi$.onHScroll = function(e){
		var data = e.getData(), vcomp = this.vcomp;
		if(vcomp && vcomp.isVisible()){
			vcomp.view.scrollLeft = data.scrollLeft;
		}
	};

	thi$.onVScroll = function(e){
		var data = e.getData(), vcomp = this.vcomp;
		if(vcomp && vcomp.isVisible()){
			vcomp.view.scrollTop = data.scrollTop;
		}
	};

	var _initScrollbars = function(def){
		var R = this.Runtime(),
		sdef = {
			classType: "js.awt.Scrollbar",
			css: "position:absolute;background:#FFFFFF;",

			axis: 1
		},
		comp = this.vScrollbar = new js.awt.Scrollbar(sdef, R);
		comp.display(false);
		comp.attachEvent("scroll", 4, this, this.onVScroll);
		comp.appendTo(this.view);

		sdef = {
			classType: "js.awt.Component",
			css: "position:absolute;background:#FFFFFF;"
		};
		comp = this.blankBar = new js.awt.Component(sdef, R);
		comp.display(false);
		comp.appendTo(this.view);

		sdef = {
			classType: "js.awt.Scrollbar",
			css: "position:absolute;background:#FFFFFF;",

			axis: 0
		};
		comp = this.hScrollbar = new js.awt.Scrollbar(sdef, R);
		comp.display(false);
		comp.attachEvent("scroll", 4, this, this.onHScroll);
		comp.appendTo(this.view);
	};

	thi$._init = function(def, Runtime){
		if(typeof def !== "object") return;

		def.classType = def.classType || "js.swt.SComponent";
		def.className = def.className || "jsvm_scomp";

		$super(this, def, Runtime);

		// Init the view component
		var vdef = def.vcomp = def.vcomp || {}, vcomp;
		vdef.classType = vdef.classType || "js.awt.Container";
		vdef.className = vdef.className 
			|| DOM.combineClassName(def.className, "vcomp");
		vcomp = new (Class.forName(vdef.classType))(vdef, Runtime);
		this.setVComponent(vcomp);
		
		// Init the scrollbars
		_initScrollbars.call(this, def);

	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.awt.Component);
