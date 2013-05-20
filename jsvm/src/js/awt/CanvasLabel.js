/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * @File: CanvasLabel.js
 * @Create: 2013/03/15 07:50:51
 * @Author: mingfa.pan@china.jinfonet.com
 */

$package("js.awt");

/**
 * Define a kind label which is draw with canvase.
 * 
 * @param def: {Object} Definition of the CanvasLabel as follow:
 *		  labelText: {String} Contents of current canvas label to draw
 *		  writeMode: indicate the write mode and the text direction
 * @param dom: {DOM} A CANVAS element or a block DOM element, such as DIV.
 *		  If the dom is CANVAS, it will used to be the view of CanvasLabel
 *		  to draw contents directly. Otherwise, it will be the container DOM
 *		  of the canvas.
 */
js.awt.CanvasLabel = function(def, Runtime, dom){
	var CLASS = js.awt.CanvasLabel, thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM, 
	System = J$VM.System,
	penSps = ["fontFamily", "fontSize", "fontStyle", "fontWeight",
			  "color", "lineHeight"],
	fontSps = ["fontFamily", "fontSize", "fontStyle", "fontWeight"];
	
	/**
	 * Set contents for current label
	 * 
	 * @param text: {String} Contents to set.
	 */
	thi$.setText = function(text){
		var M = this.def;
		if(Class.isString(text) && text != M.labelText){
			M.labelText = text;

			_adjust.call(this, "content");
		}
	};
	
	/**
	 * Return contents of current label.
	 */
	thi$.getText = function(){
		return this.def.labelText;	
	};
	
	/**
	 * Set the write mode for contents of current label.
	 * 
	 * @param  mode: {String} 
	 *		   "bt": from bottom to top, rotate -90degress,
	 *		   "tb": from top to bottom, rotate 90degress,
	 *		   "normal": from left to right, rotate 0degress
	 */
	thi$.setWriteMode = function(mode){
		var U = this._local;
		if(U.writeMode === mode){
			return;
		}
		
		switch(mode){
		case "bt":
			U.writeMode = "bt";
			U.rotate = -90;
			break;
			
		case "tb":
			U.writeMode = "tb";
			U.rotate = 90;
			break;
		default:
			U.writeMode = "normal";
			U.rotate = 0;
			break;
		}
		
		_adjust.call(this, "rotate");
	};
	
	/**
	 * Return the write of current label.
	 */
	thi$.getWriteMode = function(){
		return this._local.writeMode;
	};
	
	/**
	 * Return the rotate of current label
	 */
	thi$.getRotate = function(){
		return this._local.rotate;	
	};
	
	/**
	 * Return the position left of the component.<p>
	 * This value also is css left value.
	 */
	thi$.getX = function(){
		return this.def.x;
	};
	
	/**
	 * Set the position left of the component.<p>
	 * 
	 * @param x
	 * 
	 * @see setPosition(x, y)
	 */
	thi$.setX = function(x, fire){
		this.setPosition(x, undefined, fire);
	};
	
	/**
	 * Return the position top of the component.<p>
	 * This value also is css top value.
	 */
	thi$.getY = function(){
		return this.def.y;
	};
	
	/**
	 * Set the position top of the component.<p>
	 * 
	 * @param y
	 * 
	 * @see setPosition(x, y)
	 */
	thi$.setY = function(y, fire){
		this.setPosition(undefined, y, fire);
	};
	
	/**
	 * Return position of the componet<p>
	 * 
	 * @return an object with below infomation,
	 * {x, y}
	 */
	thi$.getPosition = function(){
		var M = this.def;

		return {x: M.x, y: M.y };
	};
	
	/**
	 * Set position of the component.<p>
	 * 
	 * @param x, the position left
	 * @param y, the position top
	 */
	thi$.setPosition = function(x, y){
		var M = this.def, bounds = this.getBounds();
		DOM.setPosition(this.view, x, y);
		
		M.x = bounds.x;
		M.y = bounds.y;
		
		_adust.call(this, "move");
	};

	/**
	 * Return z-index of the component.<p>
	 * It also is the css zIndex value.
	 */
	thi$.getZ = function(){
		return this.def.z;
	};
	
	/**
	 * Set css z-index of the component.<p>
	 * 
	 * @param z
	 */
	thi$.setZ = function(z, fire){
		var M = this.def;
		
		M.z = z;
		this.view.style.zIndex = M.z;
		
		_adjust.call(this, "zorder");

	};
	
	/**
	 * Return the outer (outer border) width of the component.<p>
	 * This value maybe large then css value
	 */
	thi$.getWidth = function(){
		return this.def.width;
	};
	
	/**
	 * Set the outer (outer border) width of the component.<p>
	 * 
	 * @param w
	 * 
	 * @see setSize(w, h)
	 */
	thi$.setWidth = function(w){
		this.setSize(w, undefined);
	};
	
	/**
	 * Return the outer (outer border) heigth of the component.<p>
	 * This value maybe large then css value
	 */
	thi$.getHeight = function(){
		return this.def.height;
	};

	/**
	 * Set the outer (outer border) width of the component.<p>
	 * 
	 * @param h
	 * 
	 * @see setSize(w, h)
	 */
	thi$.setHeight = function(h){
		this.setSize(undefined, h);
	};
	
	/**
	 * Return outer size of the component.<p>
	 * 
	 * @return an object with {width, height}
	 */
	thi$.getSize = function(){
		var M = this.def;

		return{width: M.width, height: M.height};
	};
	
	/**
	 * Set outer size of the component.
	 * 
	 * P.S.
	 * Don't set the size to canvas as style directly. 
	 * Otherwise, that may make the graphic distort.
	 * 
	 * @param w, width
	 * @param h, height
	 */
	thi$.setSize = function(w, h){
		var M = this.def, bounds = this.getBounds(),
		BBM = bounds.BBM, styleW, styleH;
		
		if((isNaN(w) && isNaN(h)) 
			|| (isNaN(w) && h == bounds.height) 
		   || (isNaN(h) && w == bounds.width) 
		   || (w == bounds.width && h == bounds.height)){
			return;
		}

		if(BBM){
			styleW = w;
			styleH = h;
		}else{
			styleW = w - bounds.MBP.BPW;
			styleH = h - bounds.MBP.BPH;
		}

		if(Class.isNumber(styleW) && styleW >= 0){
			bounds.width = w;	 
		}

		if(Class.isNumber(styleH) && styleH >= 0){
			bounds.height= h;
		}
		
		M.width = bounds.width;
		M.height= bounds.height;

		_adjust.call(this, "resize");
	};
	
	thi$.getBounds = function(){
		// We can't set size to canvas (current view) as style directly,
		// so we can't get bounds by DOM.getBounds. DOM.getBounds will
		// re-set the width and height with the outer size, that will
		// cause the wrong value.
		var el = this.view, bounds = el.bounds || DOM.getBounds(el),
		position = DOM.getStyle(this.view, "position"), pounds;

		bounds.offsetX = el.offsetLeft;
		bounds.offsetY = el.offsetTop;

		if(J$VM.supports.borderEdg && position !== "relative"){
			pounds = DOM.getBounds(el.parentNode);
			bounds.offsetX -= pounds.MBP.borderLeftWidth;
			bounds.offsetY -= pounds.MBP.borderTopWidth;
		}

		bounds.x = bounds.offsetX - bounds.MBP.marginLeft;
		bounds.y = bounds.offsetY - bounds.MBP.marginTop;
		if(position == "relative"){
			pounds = pounds || DOM.getBounds(el.parentNode);
			bounds.x -= pounds.MBP.paddingLeft;
			bounds.y -= pounds.MBP.paddingTop;
		}

		bounds.innerWidth = bounds.width - bounds.MBP.BPW;
		bounds.innerHeight= bounds.height- bounds.MBP.BPH;
		
		bounds.clientWidth = el.clientWidth;
		bounds.clientHeight= el.clientHeight;
		
		if(this._local){
			bounds.userX = this._local.userX;
			bounds.userY = this._local.userY;
			bounds.userW = this._local.userW;
			bounds.userH = this._local.userH;
		}

		bounds.scrollWidth = el.scrollWidth;
		bounds.scrollHeight= el.scrollHeight;
		bounds.scrollLeft  = el.scrollLeft;
		bounds.scrollTop   = el.scrollTop;
		
		return bounds;
	};
	
	thi$.setBounds = function(x, y, w, h){
		var M = this.def, bounds = this.getBounds();
		DOM.setBounds(this.view, x, y, w, h, bounds);
		
		M.x = bounds.x; 
		M.y = bounds.y;
		M.width = bounds.width; 
		M.height= bounds.height;
		
		_adjust.call(this, "resize");
	};

	thi$.getPreferredSize = function(nocache){
		var M = this.def, d, s;
		if(nocache === true){
			d = this.getBounds();
			s = {width: d.width, height: d.height};
		}else{
			if(!M.prefSize){
				d = this.getBounds();
				this.setPreferredSize(d.width, d.height);
			}
			s = M.prefSize;
		}
		
		return s;
	};
	
	thi$.setPreferredSize = function(w, h){
		this.def.prefSize = {
			width: w > 0 ? w : 0,
			height: h > 0 ? h: 0
		};
	};
	
	
	/**
	 * Returns whether the component width is rigid or flexible.
	 * 
	 * @see isRigidHeight()
	 */
	thi$.isRigidWidth = function(){
		var v = this.def.rigid_w;
		return v === false ? false : true;
	};
	
	/**
	 * Returns whether the component height is rigid or flexible.
	 * 
	 * @see isRigidWidth
	 */
	thi$.isRigidHeight = function(){
		var v = this.def.rigid_h;
		return v === false ? false : true;
	};

	/**
	 * Returns the alignment along the x axis.	This specifies how
	 * the component would like to be aligned relative to other
	 * components.	The value should be a number between 0 and 1
	 * where 0 represents alignment along the origin, 1 is aligned
	 * the furthest away from the origin, 0.5 is centered, etc.
	 */
	thi$.getAlignmentX = function(){
		return this.def.align_x || 0.0;
	};
	
	/**
	 * Returns the alignment along the y axis.	This specifies how
	 * the component would like to be aligned relative to other
	 * components.	The value should be a number between 0 and 1
	 * where 0 represents alignment along the origin, 1 is aligned
	 * the furthest away from the origin, 0.5 is centered, etc.
	 */
	thi$.getAlignmentY = function(){
		return this.def.align_y || 0.0;
	};
	
	/**
	 * Test if the specified (x, y) is in area of the component 
	 */
	thi$.inside = function(x, y){
		var d = this.getBounds(), 
		minX = d.absX + d.MBP.borderLeftWidth, maxX = minX + d.clientWidth,
		minY = d.absY + d.MBP.borderTopWidth,  maxY = minY + d.clientHeight;
		return (x > minX && x < maxX && y > minY && y < maxY);
	};
	
	/**
	 * Sets style.display = none/blcok
	 */
	thi$.display = function(show){
		if(show === false){
			this.view.style.display = "none";
			_adjust(this, "display", "none");
		}else{
			this.view.style.display = "block";
			_adjust(this, "display", "block");
		}
	};

	var _adjust = function(cmd, show){
		if(!this.view){
			return;
		}
		
		var repaint = false, D = this.getBounds(), g;
		switch(cmd){
		case "content":
		case "resize":
		case "rotate":
			this.adjustCover(D);
			repaint = true;
			break;
		case "move":
			this.adjustCover(D);
			break;
		case "zorder":
			this.setCoverZIndex(this.getZ());
			break;
		case "display":
			this.setCoverDisplay(show);
			break;
		case "remove":
			this.removeCover();
			break;
		}
		
		if(repaint){
			g = this.graphic();
			g.setSize(D.innerWidth, D.innerHeight);
			_paintLabel.call(this);
		}
	};
	
	/**
	 * Return runtime object
	 * 
	 * @see js.lang.Runtime
	 * @see js.awt.Desktop
	 */
	thi$.Runtime = function(){
		return this._local.Runtime;
	};
	
	/**
	 * Return current CanvasGraphic object.
	 */
	thi$.graphic = function(){
		return this._local.graphic;	 
	};
	
	/**
	 * @see js.awt.Component #setPeerComponent
	 */
	thi$.setPeerComponent = function(peer){
		this.peer = peer;
	};
	
	/**
	 * @see js.awt.Component #getPeerComponent
	 */
	thi$.getPeerComponent = function(){
		return this.peer;		 
	};

	/**
	 * @see js.awt.Component #notifyPeer
	 */
	thi$.notifyPeer = function(msgId, event, sync){
		var peer = this.getPeerComponent();
		if(peer){
			_notify.call(this, peer, msgId, event, sync);
		}
	};

	/**
	 * Sets container of this cavas label
	 */
	thi$.setContainer = function(container){
		this.container = container;
	};

	/**
	 * Gets container of this cavas label
	 */
	thi$.getContainer = function(){
		return this.container;
	};

	/**
	 * @see js.awt.Component #notifyContainer
	 */
	thi$.notifyContainer = function(msgId, event, sync){
		var comp = this.getContainer();
		if(comp){
			_notify.call(this, comp, msgId, event, sync);
		}
	};

	var _notify = function(comp, msgId, event, sync){
		sync = (sync == undefined) ? this.def.sync : sync;

		if(sync == true){
			MQ.send(msgId, event, [comp.uuid()]);	 
		}else{
			MQ.post(msgId, event, [comp.uuid()]);
		}
	};
	
	/**
	 * Test whether this componet view is a DOM element
	 */	   
	thi$.isDOMElement = function(){
		return DOM.isDOMElement(this.view);
	};

	/**
	 * Remove the view of this component from the specified parent node.
	 * 
	 * @see appendTo(parentNode)
	 */
	thi$.removeFrom = function(parentNode){
		DOM.removeFrom(this.view, parentNode);
		_adjust.call(this, "remove");
	};
	
	/**
	 * Append the view of this component to the specified parent node.
	 * 
	 * @see removeFrom(parentNode)
	 */
	thi$.appendTo = function(parentNode){
		DOM.appendTo(this.view, parentNode);
	};
	
	/**
	 * Insert the view of this component before the specified refNode
	 * 
	 * @param refNode
	 */
	thi$.insertBefore = function(refNode, parentNode){
		DOM.insertBefore(this.view, refNode, parentNode);
	};

	/**
	 * Insert the view of this component after the specified refNode
	 * 
	 * @see insertBefore(refNode, parentNode)
	 */
	thi$.insertAfter = function(refNode){
		this.insertBefore(refNode.nextSibling, refNode.parentNode);
	};

	/**
	 * Test whether contains a child node in this component
	 * 
	 * @param child, a HTMLElement
	 * @param constainSelf, a boolean indicates whether includes the scenario 
	 * of the parent === child.
	 */
	thi$.contains = function(child, constainSelf){
		return DOM.contains(this.view, child, constainSelf);
	};
	
	thi$.repaint = function(){
		// Do nothing
	};
	
	thi$.doLayout = function(){
		// Do nothing
	};
	
	thi$.destroy = function(){
		arguments.callee.__super__.apply(this, arguments);	  
		
		delete this.view;
		delete this.canvas;
		
		var g = this._local.graphic;
		if(g){
			g.clear();
		}
		
		delete this._local.bounds;
		delete this._local.graphic;
		delete this._local;
		
	}.$override(this.destroy);
	
	var _prepareinfo = function(){
		var M = this.def, U = this._local, bounds = this.view.bounds,
		ele, w, h, x, y, styleW, styleH, MBP, D, paintInfo,
		rotate = this.getRotate(), g = this.graphic(), pen = g.pen,
		buf = new js.lang.StringBuffer();
		
		if(!bounds){
			ele = DOM.createElement("SPAN");
			ele.innerHTML = js.lang.String.encodeHtml(M.labelText);
			
			ele.className = this.className;
			ele.style.cssText = def.css || "";
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
			bounds = DOM.getBounds(ele);
			w = bounds.width;
			h = bounds.height;
			
			paintInfo = U.paintInfo = DOM.getStyles(ele, penSps);
			DOM.remove(ele, true);
			
			// Calculate the text size with canvas
			paintInfo.font = _getFont.call(this, paintInfo);
			g.setFont(paintInfo.font);
			w = bounds.width = g.getLabelWidth(M.labelText);

			this.view.bounds = D = {BBM: bounds.BBM, MBP: bounds.MBP};
			
			// Rectify bounds
			if(!bounds.BBM){
				// We think the width and height from definition or style 
				// should be as the outer size include borders and paddings.
				// However, the size in bounds computed above didn't use the
				// width and height as the outer when browser isn't BBM. So
				// we need to cut it.
				MBP = bounds.MBP;
				
				w = w - MBP.BPW;
				h = h - MBP.BPH;
			}
			
			//?? If rotate 90degress or -90degress, swap width and height
			if(rotate != 0){
				bounds.width = h;
				bounds.height = w;
			}
			
			// Rectify 
			this.view.className = this.className;
			buf.append(def.css || "");
			
			if(Class.isNumber(M.x)){
				x = M.x;
				buf.append("left:").append(M.x).append("px;");
			}else{
				x = bounds.x;
			}
			D.x = U.userX = x;
			
			if(Class.isNumber(M.y)){
				y = M.y;
				buf.append("top:").append(M.y).append("px;");
			}else{
				y = bounds.y;
			}
			D.y = U.userY = y;
			
			// Don't set the size to canvas as style directly. 
			// Otherwise, that may make the graphic distort.
			styleW = Class.isNumber(M.width) ? M.width : bounds.width;
			D.width = styleW;
			
			if(!bounds.BBM){
				styleW -= bounds.MBP.BPW;
			}
			U.userW = M.width = styleW;
			//buf.append("width:").append(styleW).append("px;");

			styleH = Class.isNumber(M.height) ? M.height : bounds.height;
			D.height = styleH;
			
			if(!bounds.BBM){
				styleH -= bounds.MBP.BPH;
			}
			U.userH = M.height = styleH;
			//buf.append("height:").append(styleH).append("px;");
			
			this.view.style.cssText = buf.toString();
			
			// Rectify Graphic size
			g.setSize(styleW, styleH);
		}
	};
	
	var _initGraphic = function(dom, w, h){
		var M = this.def, g = this._local.graphic,
		buf = new js.lang.StringBuffer();
		if(!g){
			g = this._local.graphic 
				= new (Class.forName("js.awt.CanvasGraphic"))({width: w, height: h}, dom);
			this.view = this.canvas = g.canvas();
		}else{
			if(!isNaN(w) || !isNaN(h)){
				w = !isNaN(w) ? w : g.getWidth();
				h = !isNaN(h) ? h : g.getHeight();
				g.setSize(w, h);
			}
		}
		
		return g;
	};
	
	var _getFont = function(info){
		var fontInfo = {};
		for(var i = 0, len = fontSps.length; i < len; i++){
			sp = fontSps[i];
			
			v = info[sp];
			if(sp == "fontWeight" && J$VM.firefox){
				var Font = Class.forName("js.awt.Font");
				v = Font.FFCANVASFONTWEIGHTS[v + ""] || "normal";
			}

			if(v){
				fontInfo[sp] = v;
			}
		}
		
		return fontInfo;
	};
	
	var _getPaintInfo = function(){
		var M = this.def, info = this._local.paintInfo, 
		writeMode = this.getWriteMode(),
		paintInfo = {}, sp, v, align_x, align_y;
		
		v = M.color || info["color"];
		if(v){
			paintInfo["color"] = v;
		}
		
		paintInfo.font = info.font;
		paintInfo.rotate = this.getRotate();
		paintInfo.textOverflow = "ellipsis";
		
		switch(writeMode){
		case "tb":
			paintInfo.ha = !isNaN(M.align_x) ? M.align_x : 0.5; //horizontal: "center"
			paintInfo.va = !isNaN(M.align_y) ? M.align_y : 0.0; //virtical: "top"
			break;
		case "bt":
			paintInfo.ha = !isNaN(M.align_x) ? M.align_x : 0.5; //horizontal: "center"
			paintInfo.va = !isNaN(M.align_y) ? M.align_y : 1.0; //virtical: "bottom"
			break;
		default:
			paintInfo.ha = !isNaN(M.align_x) ? M.align_x : 0.0; //horizontal: "left"
			paintInfo.va = !isNaN(M.align_y) ? M.align_y : 0.5; //virtical: "middle"
			break;
		}
		
		return paintInfo;
	};
	
	var _paintLabel = function(){
		var g = this.graphic(), D = this.getBounds(), MBP = D.MBP, 
		x = MBP.borderLeftWidth + MBP.paddingLeft,
		y = MBP.borderTopWidth + MBP.paddingTop,
		w = D.innerWidth, h = D.innerHeight,
		rect = {x: x, y: y, w: w, h: h},
		style = _getPaintInfo.call(this);
		
		g.drawText(this.getText(), rect, style);
	};
	
	thi$._init = function(def, Runtime, dom){
		if(typeof def !== "object") return;
		def.classType = def.classType || "js.awt.CanvasLabel";
		def.className = def.className || "jsvm_canvasLabel";
		def.labelText = Class.isString(def.labelText) 
			? def.labelText : (Class.isString(def.text) ? def.text : ""); 
		
		this.def = def;
		this._local = this._local || {};
		this._local.Runtime = Runtime;
		this.uuid(def.uuid);
		
		this.id = def.id || this.uuid();
		this.className = def.className;
		this.setWriteMode(def.writeMode);

		_initGraphic.call(this, dom);		 
		_prepareinfo.call(this);
		_paintLabel.call(this);
		
		arguments.callee.__super__.apply(this, arguments);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.util.EventTarget).$implements(js.awt.Cover, js.awt.State);
