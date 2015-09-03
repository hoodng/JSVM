/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.util");

js.util.Document = function (){

	var CLASS = js.util.Document, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, cache = {},

	// Attributes Compatibility Table: Left - W3C, Right - IE 7
	// 1) In HTML documents, the name is case-insensitive in Firefox, Opera,
	//	  Google Chrome, Safari and in Internet Explorer from version 8.
	// 2) In Internet Explorer earlier than version 8, the default is that
	//	  the name is case-sensitive in HTML documents but these settings can
	//	  be modified by the caseSens parameter of the setAttribute method.
	// 3) In Internet Explorer earlier than version 8, the corresponding JavaScript
	//	  property name (camelCase name) needs to be specified.
	ATTRIBUTESCT = {
		acceptcharset: "acceptCharset",
		accesskey: "accessKey",
		allowtransparency: "allowTransparency",
		bgcolor: "bgColor",
		cellpadding: "cellPadding",
		cellspacing: "cellSpacing",
		"class": "className",
		colspan: "colSpan",
		checked: "defaultChecked",
		selected: "defaultSelected",
		"for": "htmlFor" ,
		frameborder: "frameBorder",
		hspace: "hSpace",
		longdesc: "longDesc",
		maxlength: "maxLength",
		marginwidth: "marginWidth",
		marginheight: "marginHeight",
		noresize: "noResize",
		noshade: "noShade",
		readonly: "readOnly",
		rowspan: "rowSpan",
		tabindex: "tabIndex",
		valign: "vAlign",
		vspace: "vSpace"
	},
	BOOLATTRREGEXP = /^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noshade|nowrap|readonly|selected)$/,
	DOCTYPECT = {
		"html-4.01": {bodysize: false},
		"html-4.01-transitional": {bodysize: true}
	};

	var _prefix_ = thi$.CSSPrefix = function(){
		if(J$VM.ie){
			return "-ms-";
		}else if(J$VM.chrome || J$VM.safari){
			return "-webkit-";
		}else if(J$VM.firefox){
			return "-moz-";
		}
		return "";
	}();

	var userselect = _prefix_+"user-select",
	userdrag = _prefix_+"user-drag";
	
	/**
	 * Create a DOM element
	 *
	 */
	thi$.createElement = function(type){
		var el = document.createElement(type);
		this.setStyle(el, userselect, "none");
		this.setStyle(el, userdrag, "none");

		switch(el.tagName){
		case "IMG":
			//this.forbidSelect(el);			
			break;
		case "INPUT":
			el.className = "jsvm--font ";
			this.setStyle(el, userselect, "text");
			this.applyStyles(el, {resize: "none", outline: "none"});
			break;
		case "TEXTAREA":
			el.className = "jsvm--font ";
			this.setStyle(el, userselect, "text");
			this.applyStyles(el, {resize: "none", outline: "none", overflow: "auto"});
			break;
		}
		return el;
	};

	var REGX_CAMEL = /[A-Z]/g, REGX_HYPHEN = /-([a-z])/ig,
	textSps = ["font-family", "font-size", "font-style",
			   "font-weight", "text-decoration", "text-align", "font-weight"],
	camelMap = {}, hyphenMap = {};

	/**
	 * Convert hyphen style name to camel style name
	 *
	 * @param s, name string
	 *
	 * @return string
	 */
	thi$.camelName = function(s){
		var _s = camelMap[s];
		if(_s != undefined) return _s;

		_s = s.replace(REGX_HYPHEN,
					   function(a, l){return l.toUpperCase();});

		camelMap[s] = _s;
		if(_s !== s){
			hyphenMap[_s]=	s;
		}

		return _s;
	};

	/**
	 * Convert camel style name to hyphen style name
	 *
	 * @param s, name string
	 *
	 * @return string
	 */
	thi$.hyphenName = function(s){
		var _s = hyphenMap[s];
		if(_s !== undefined) return _s;

		_s = s.replace(REGX_CAMEL,
					   function(u){return "-" + u.toLowerCase();});

		hyphenMap[s] = _s;
		if(_s !== s){
			camelMap[_s]=  s;
		}

		return _s;
	};

	thi$.offsetParent = function(ele){
		var body = document.body, p = ele.offsetParent;
		if(!p || !this.contains(body, p, true)){
			p = body;
		}

		return p;
	};

	/**
	 * Returns current styles of the specified element
	 *
	 */
	thi$.currentStyles = function(el, isEle){
		var defaultView = document.defaultView, ret;
		isEle = isEle === undefined ? this.isDOMElement(el) : isEle;

		if(isEle){
			if(defaultView && defaultView.getComputedStyle){
				// W3C
				ret = defaultView.getComputedStyle(el, null);
			}else{
				// IE
				ret = el.currentStyle;
			}
		}else {
			ret = {};
		}

		return ret;
	};


	var _pretreatProp = function (sp) {
		if(sp == "float") {
			return J$VM.supports.supportCssFloat ?
				"cssFloat" : "styleFloat";
		} else {
			return this.camelName(sp);
		}

	};

	/**
	 * Return the computed style of the element.
	 *
	 * @param el, the DOM element
	 * @param sp, the style property name
	 */
	thi$.getStyle = function(el, sp){
		if(el == document)
			return null;

		var defaultView = document.defaultView;
		var cs, prop = _pretreatProp.call(this, sp);

		if(defaultView && defaultView.getComputedStyle){
			var out = el.style[prop];
			if(!out) {
				cs = defaultView.getComputedStyle(el, "");
				out = cs ? cs[prop] : null;
			}

			if(prop == "marginRight" && out != "0px" &&
			   !J$VM.supports.reliableMarginRight){
				var display = el.style.display;
				el.style.display = 'inline-block';
				out = defaultView.getComputedStyle(el, "").marginRight;
				el.style.display = display;
			}

			return out;
		} else {
			if ( sp == "opacity") {
				if (el.style.filter.match) {
					var matches = el.style.filter.match(/alpha\(opacity=(.*)\)/i);
					if(matches){
						var fv = parseFloat(matches[1]);
						if(!isNaN(fv)){
							return fv ? fv / 100 : 0;
						}
					}
				}
				return 1;
			}

			return el.style[prop] || ((cs = el.currentStyle) ? cs[prop] : null);
		}
	};

	/**
	 * Return the computed styles of the element
	 *
	 * @param el, the DOM element
	 * @param sps, the array of style property name
	 */
	thi$.getStyles = function(el, sps){
		var styles = {};
		(function(styles, el, sp){
			 styles[this.camelName(sp)] = this.getStyle(el, sp);
		 }).$forEach(this, sps || [], styles, el);

		return styles;
	};

	/**
	 * Fetch and return the value of attribute from the specified
	 * DOM element.
	 *
	 * @param el: {DOM} Specified DOM element
	 * @param attr: {String} Specified attribute name to fetch
	 *
	 * @return {String} Value fo the specified attribute. Return
	 *		  "" if not found.
	 */
	thi$.getAttribute = function(el, attr){
		if(!el || el.nodeType !== 1 || !attr){
			return "";
		}

		var tmp = attr.toLowerCase(), prop = tmp, v;
		if(J$VM.ie && parseInt(J$VM.ie) < 8){
			prop = ATTRIBUTESCT[attr] || ATTRIBUTESCT[tmp] || attr;
		}else{
			prop = tmp;
		}

		if(J$VM.ie){
			v = el[prop];
		}

		if(!v){
			v = el.getAttribute(attr);
		}

		// Check boolean attributes
		if(BOOLATTRREGEXP.test(tmp)){
			if(el[prop] === true && v === ""){
				return tmp;
			}

			return v ? tmp : "";
		}

		return v ? "" + v : "";
	};

	/**
	 * Judge whether the specified DOM element has the specified
	 * attribute.
	 *
	 * @param attr: {String} Name of the specified attribute.
	 */
	thi$.hasAttribute = function(el, attr){
		if(el.hasAttribute){
			return el.hasAttribute(attr);
		}

		return el.getAttribute(attr) != null;
	};

	/**
	 * Set value of given attribute for the specified DOM element.
	 * If the attribute is boolen kind, when only when the given
	 * value is true/"true" it will be setten otherwise the specified
	 * attribute will be removed.
	 */
	thi$.setAttribute = function(el, attr, value){
		if(!el || el.nodeType !== 1 || !attr){
			return;
		}

		var prop = attr.toLowerCase(), v;
		if(J$VM.ie && parseInt(J$VM.ie) < 8){
			attr = ATTRIBUTESCT[attr] || ATTRIBUTESCT[prop] || attr;
		}else{
			attr = prop;
		}

		if(BOOLATTRREGEXP.test(prop)){
			if(Class.isString(value)){
				v = (value.toLowerCase() === "true");
			}else{
				v = (value === true);
			}

			if(v){
				el.setAttribute(attr, "" + v);
			}else{
				el.removeAttribute(attr);
			}

			return;
		}

		v = Class.isValid(value) ? "" + value : "";
		if(v.length > 0){
			el.setAttribute(attr, v);
		}else{
			el.removeAttribute(attr);
		}
	};

	thi$.removeAttribute = function(el, attr){
		if(!el || el.nodeType !== 1 || !attr){
			return;
		}

		var prop = attr.toLowerCase();
		if(J$VM.ie && parseInt(J$VM.ie) < 8){
			attr = ATTRIBUTESCT[attr] || ATTRIBUTESCT[prop] || attr;
		}else{
			attr = prop;
		}

		el.removeAttribute(attr);
	};

	thi$.setAttributes = function(el, attrObj){
		if(!el || el.nodeType !== 1
		   || (typeof attrObj !== "object")){
			return;
		}

		var attr;
		for(attr in attrObj){
			this.setAttribute(el, attr, attrObj[attr]);
		}
	};

	/**
	 * Apply opacity to the DOM element.
	 * For IE, apply it by setting the alpha filter.
	 *
	 * @param el, the Dom element
	 * @param value, the opacity will be used
	 */
	thi$.setOpacity = function(el, value){
		var style = el.style,
		currentStyle = el.currentStyle;

		if(J$VM.ie && parseInt(J$VM.ie) < 10) {
			var opacity = isNaN(value) ? "" : "alpha(opacity=" + value * 100 + ")";
			var filter = currentStyle && currentStyle.filter || style.filter || "";
			filter = filter.replace(/alpha\(opacity=(.*)\)/i, "")
				.replace(/(^\s*)|(\s*$)/g, "");

			// Force IE to layout by setting the zoom level
			style.zoom = 1;

			// Set the opacity by setting the alpha filter
			var filterVal = new js.lang.StringBuffer();
			filterVal = filterVal.append(filter);
			filterVal = filter.length > 0 ? filterVal.append(" ") : filterVal;
			filterVal = filterVal.append(opacity);

			style.filter = filterVal.toString();
		} else {
			style.opacity = value;
		}
	};

	/**
	 * Clear the setten opacity from the DOM element.
	 *
	 * @param el, the DOM element
	 */
	thi$.clearOpacity = function(el){
		var style = el.style;
		if(J$VM.ie && parseInt(J$VM.ie) < 10){
			var filter = style.filter;
			style.filter = filter ? filter.replace(/alpha\(opacity=(.*)\)/i, "")
				.replace(/(^\s*)|(\s*$)/g, "") : "";
		}else{
			style.opacity = style['-moz-opacity'] = style['-khtml-opacity'] = "";
		}
	};

	/**
	 * Apply style for the DOM element
	 *
	 * @param el: the DOM element
	 * @param sp: name of the specified style to apply
	 * @param value: the vlaue of the specified style to apply
	 */
	thi$.setStyle = function(el, sp, value){
		if(sp.toLowerCase() == "opacity"){
			this.setOpacity(el, value);
		}else{
			sp = _pretreatProp.call(this, sp);
			el.style[sp] = value;
		};
	};

	/**
	 * Apply styles to the DOM element
	 *
	 * @param el, the DOM element
	 * @param styles, the style set
	 */
	thi$.applyStyles = function(el, styles){
		(function(el, value, sp){
			 this.setStyle(el, sp, value);
		 }).$map(this, styles || {}, el);
	};

	thi$.parseNumber = function(value){
		var i = Class.isValid(value) ? parseInt(value) : 0;
		if(Class.isNumber(i)) return i;
		switch(value.toLowerCase()){
		case "thin": return 1;
		case "medium": return 3;
		case "thick": return 5;
		default: return 0;
		}
	};

	/**
	 * Get border width of this element
	 *
	 * @param el the element
	 * @param currentStyles @see this.currentStyles()
	 * @param isEle	 whether the element is a DOM element
	 *
	 * @return {borderTopWidth, borderRightWidth,
	 * borderBottomWidth, borderLeftWidth}
	 */
	thi$.getBorderWidth = function(el, currentStyles, isEle){
		var bounds = el.bounds; if(!bounds) bounds = el.bounds = {};

		if(!bounds.MBP || !bounds.MBP.borderTopWidth){
			var MBP = bounds.MBP = bounds.MBP || {};

			isEle  = isEle === undefined ?	this.isDOMElement(el) : isEle;
			currentStyles = currentStyles || this.currentStyles(el, isEle);

			var bs = currentStyles["borderTopStyle"].toLowerCase();
			MBP.borderTopWidth =
				((!bs || bs === "none") ?
				 0 : this.parseNumber(currentStyles["borderTopWidth"]));

			bs = currentStyles["borderRightStyle"].toLowerCase();
			MBP.borderRightWidth =
				((!bs || bs === "none") ?
				 0 : this.parseNumber(currentStyles["borderRightWidth"]));

			bs = currentStyles["borderBottomStyle"].toLowerCase();
			MBP.borderBottomWidth =
				((!bs || bs === "none") ?
				 0 : this.parseNumber(currentStyles["borderBottomWidth"]));

			bs = currentStyles["borderLeftStyle"].toLowerCase();
			MBP.borderLeftWidth =
				((!bs || bs === "none") ?
				 0 : this.parseNumber(currentStyles["borderLeftWidth"]));
		}

		return bounds.MBP;
	};

	/**
	 * Return padding width of the element
	 *
	 * @param el the element
	 * @param currentStyles @see this.currentStyles()
	 * @param isEle	 whether the element is a DOM element
	 *
	 * @return {paddingTop, paddingRight, paddingBottom, paddingLeft}
	 */
	thi$.getPadding = function(el, currentStyles, isEle){
		var bounds = el.bounds; if(!bounds) bounds = el.bounds = {};

		if(!bounds.MBP || !bounds.MBP.paddingTop){
			var MBP = bounds.MBP = bounds.MBP || {};
			isEle  = isEle === undefined ?	this.isDOMElement(el) : isEle;
			currentStyles = currentStyles || this.currentStyles(el, isEle);

			MBP.paddingTop	 = this.parseNumber(currentStyles["paddingTop"]);
			MBP.paddingRight = this.parseNumber(currentStyles["paddingRight"]);
			MBP.paddingBottom= this.parseNumber(currentStyles["paddingBottom"]);
			MBP.paddingLeft	 = this.parseNumber(currentStyles["paddingLeft"]);
		}

		return bounds.MBP;
	};

	/**
	 * Return margin width of the element
	 *
	 * @param el the element
	 * @param currentStyles @see this.currentStyles()
	 * @param isEle	 whether the element is a DOM element
	 *
	 * @return {marginTop, marginRight, marginBottom, marginLeft}
	 */
	thi$.getMargin = function(el, currentStyles, isEle){
		var bounds = el.bounds; if(!bounds) bounds = el.bounds = {};

		if(!bounds.MBP || !bounds.MBP.marginTop){
			var MBP = bounds.MBP = bounds.MBP || {};
			isEle  = isEle === undefined ?	this.isDOMElement(el) : isEle;
			currentStyles = currentStyles || this.currentStyles(el, isEle);

			MBP.marginTop	= this.parseNumber(currentStyles["marginTop"]);
			MBP.marginRight = this.parseNumber(currentStyles["marginRight"]);
			MBP.marginBottom= this.parseNumber(currentStyles["marginBottom"]);
			MBP.marginLeft	= this.parseNumber(currentStyles["marginLeft"]);
		}

		return bounds.MBP;
	};

	thi$.getBoundRect = function(el, isEle){
		isEle = isEle === undefined ? this.isDOMElement(el) : isEle;
		var d, ret = { left: 0, top: 0, bottom: 0, right: 0 };
		
		if(isEle){
			d = el.getBoundingClientRect();
			ret.left = Math.ceil(d.left);
			ret.top = Math.ceil(d.top);
			ret.bottom = Math.ceil(d.bottom);
			ret.right = Math.ceil(d.right);
		}
		return ret;
	};

	var _computeByBody = function(){
		var doctype = J$VM.doctype, fValues = [],
		b = true, v, table;
		if(doctype.declared){
			v = doctype.getEigenStr();
			if(v){
				table = DOCTYPECT[v];
				b = table ? (table["bodysize"] || false) : false;
			}else{
				b = false;
			}
		}

		return b;
	};

	/**
	 * Return the outer (outer border) size of the element
	 *
	 * @return {width, height}
	 */
	thi$.outerSize = function(el, isEle){
		if(el.tagName !== "BODY"){
			var r = this.getBoundRect(el, isEle);
			return {left: r.left,
					top: r.top,
					width: r.right-r.left,
					height:r.bottom-r.top };
		}else{
			var b = _computeByBody.call(this);
			return {
				left: 0,
				top:  0,
				width: b ? document.body.clientWidth :
					document.documentElement.clientWidth,
				height: b ? document.body.clientHeight :
					document.documentElement.clientHeight};
		}
	};

	/**
	 * Return outer (outer border) width of the element
	 *
	 */
	thi$.outerWidth = function(el, isEle){
		return this.outerSize(el, isEle).width;
	};

	/**
	 * Return outer (outer border) height of the element
	 *
	 */
	thi$.outerHeight = function(el, isEle){
		return this.outerSize(el, isEle).height;
	};

	/**
	 * Return the inner (content area) size of the element
	 *
	 * @return {width, height}
	 */
	thi$.innerSize = function(el, currentStyles, isEle){
		var o = this.outerSize(el, isEle),
		b = this.getBorderWidth(el, currentStyles, isEle),
		p = this.getPadding(el, currentStyles, isEle);

		return{
			width:	o.width - b.borderLeftWidth - b.borderRightWidth -
				p.paddingLeft - p.paddingRight,

			height: o.height- b.borderTopWidth	- b.borderBottomWidth-
				p.paddingTop - p.paddingBottom
		};
	};

	/**
	 * Return the inner (content area) width of the element
	 */
	thi$.innerWidth = function(el, currentStyles, isEle){
		return this.innerSize(el, currentStyles, isEle).width;
	};

	/**
	 * Return the inner (content area) height of the element
	 */
	thi$.innerHeight = function(el, currentStyles, isEle){
		return this.innerSize(el, currentStyles, isEle).height;
	};

	/**
	 * Set outer size of the element
	 *
	 * @param el
	 * @param w width
	 * @param h height
	 * @param bounds @see getBounds(el)
	 */
	thi$.setSize = function(el, w, h, bounds){
		bounds = bounds || this.getBounds(el);

		var BBM = bounds.BBM, styleW, styleH,
		isCanvas = (el.tagName === "CANVAS");

		if(BBM){
			styleW = w;
			styleH = h;
		}else{
			styleW = w - bounds.MBP.BPW;
			styleH = h - bounds.MBP.BPH;
		}

		if(Class.isNumber(styleW) && styleW >= 0){
			bounds.width = w;
			bounds.innerWidth = w - bounds.MBP.BPW;

			if(isCanvas){
				el.width = styleW;
			}else{
				el.style.width = styleW + "px";
			}
		}

		if(Class.isNumber(styleH) && styleH >= 0){
			bounds.height= h;
			bounds.innerHeight = h - bounds.MBP.BPH;

			if(isCanvas){
				el.height = styleH;
			}else{
				el.style.height = styleH + "px";
			}
		}
	};

	/**
	 * Return absolute (x, y) of this element
	 *
	 * @return {x, y}
	 *
	 * @see absX()
	 * @see absY()
	 */
	thi$.absXY = function(el, isEle){
		var r = this.getBoundRect(el, isEle);
		return { x: r.left, y: r.top };
	};

	/**
	 * Return absolute left (outer border to body's outer border) of this
	 * element
	 */
	thi$.absX = function(el, isEle){
		return this.absXY(el, isEle).x;
	};

	/**
	 * Return absolute top (outer border to body's outer border) of this
	 * element
	 */
	thi$.absY = function(el, isEle){
		return this.absXY(el, isEle).y;
	};

	/**
	 * Return offset (x, y) of this element
	 *
	 * @return {x, y}
	 *
	 * @see offsetX()
	 * @see offsetY()
	 */
	thi$.offsetXY = function(el){
		return {x: el.offsetLeft, y: el.offsetTop };
	};

	/**
	 * Return offset left (outer border to offsetParent's outer border) of
	 * this element
	 */
	thi$.offsetX  = function(el){
		return this.offsetXY(el).x;
	};

	/**
	 * Return offset top (outer border to offsetParent's outer border) of
	 * this element
	 */
	thi$.offsetY = function(el){
		return this.offsetXY(el).y;
	};

	/**
	 * Set the position of the element
	 *
	 * @param el, element
	 * @param x, left position in pixel
	 * @param y, top position in pixel
	 */
	thi$.setPosition = function(el, x, y, bounds){
		bounds = bounds || this.getBounds(el);

		if(Class.isNumber(x)){
			bounds.x = x;
			el.style.left = x + "px";
		}

		if(Class.isNumber(y)){
			bounds.y = y;
			el.style.top =	y + "px";
		}
	};

	/**
	 * Return box model of this element
	 */
	thi$.getBounds = function(el){
		var isEle = _checkElement.call(this, el),
		outer = this.outerSize(el, isEle),
		bounds = el.bounds = el.bounds || {};

		if(bounds.BBM === undefined){
			// BBM: BorderBoxModel
			if(Class.typeOf(el) === "htmlinputelement" ||
			   Class.typeOf(el) === "htmltextareaelement"){
				bounds.BBM = J$VM.supports.iptBorderBox;
			}else{
				bounds.BBM = J$VM.supports.borderBox;
			}

			var currentStyles = this.currentStyles(el, isEle);
			this.getMargin(el, currentStyles, isEle);
			this.getPadding(el, currentStyles, isEle);
			this.getBorderWidth(el, currentStyles, isEle);
			// Above 3 invokes will generates bounds.MBP
			var MBP = bounds.MBP; // MBP: Margin-Border-Padding
			MBP.BW = MBP.borderLeftWidth + MBP.borderRightWidth;
			MBP.BH = MBP.borderTopWidth + MBP.borderBottomWidth;
			MBP.PW = MBP.paddingLeft + MBP.paddingRight;
			MBP.PH = MBP.paddingTop + MBP.paddingBottom;
			MBP.MW = MBP.marginLeft + MBP.marginRight;
			MBP.MH = MBP.marginTop + MBP.marginBottom;
			MBP.BPW= MBP.BW + MBP.PW;
			MBP.BPH= MBP.BH + MBP.PH;
		}

		bounds.width = outer.width;
		bounds.height= outer.height;

		bounds.absX	 = outer.left;
		bounds.absY	 = outer.top;

		return bounds;
	};

	/**
	 * Set box model to this element
	 *
	 * @see getBounds(el);
	 */
	thi$.setBounds = function(el, x, y, w, h, bounds){
		this.setPosition(el, x, y, bounds);
		this.setSize(el, w, h, bounds);
	};

	/**
	 * Returns whether an element has scroll bar
	 *
	 * @return {
	 *	 hscroll: true/false
	 *	 vscroll: true/false
	 * }
	 */
	thi$.hasScrollbar = function(el){
		var MBP = this.getBounds(el).MBP,
		vbw = el.offsetWidth - el.clientWidth - MBP.BW,
		hbw = el.offsetHeight- el.clientHeight- MBP.BH;

		return {
			vbw: vbw, hbw: hbw,
			vscroll: vbw > 1,
			hscroll: hbw > 1
		};
	};

	/**
	 * Unbind listeners for the given DOM.
	 */
	thi$.removeFun = function(el){
		if(!el) return;

		if(el.nodeType == 1){
			var handlers = el.__handlers__, eventType;
			if(handlers){
				for(eventType in handlers){
					Event.detachEvent(el, eventType);
				}
			}

			el.__handlers__ = undefined;
			el.bounds = undefined;
		}

		var a = el.attributes, i, l, n;
		if(a){
			for(i=a.length-1; i>=0; i--){
				n = a[i].name;
				if(typeof el[n] === "function"){
					el[n] = null;
				}
			}
		}
		a = el.childNodes;
		if(a){
			for(i=0, l=a.length; i<l; i++){
				arguments.callee(a.item(i));
			}
		}
	};

	/**
	 * Remove child from DOM tree and driver browser to collect garbage.
	 */
	thi$.remove = function(){
		var p;
		return function(el, gc){
			if(!el) return;

			if(gc){
				this.removeFun(el);

				if(Class.typeOf(el) != "htmlbodyelement"){
					p = p || document.createElement("DIV");
					p.appendChild(el);
					p.innerHTML = "";
				}
			}

			if(el.parentNode) {
				el.parentNode.removeChild(el);
			}
		};

	}();

	/**
	 * Remove the element from the parent node
	 */
	thi$.removeFrom = function(el, parentNode){
		if(!el) return;

		parentNode = parentNode || el.parentNode;
		parentNode.removeChild(el);
	};

	/**
	 * Remove all child nodes from the DOM.
	 */
	thi$.empty = function(el){
		if(!el) return;

		// Remove any remaining nodes
		while (el.firstChild) {
			this.remove(el.firstChild, true);
		}

		// If this is a select, ensure that it displays empty
		// Support: IE<9
		if(el.options && el.tagName === "SELECT"){
			el.options.length = 0;
		}
	};

	/**
	 * Append the element to the parent node
	 */
	thi$.appendTo = function(el, parentNode){
		parentNode.appendChild(el);
	};

	/**
	 * Insert the element before refNode
	 */
	thi$.insertBefore = function(el, refNode, parentNode){
		parentNode = parentNode || refNode.parentNode;
		if(refNode){
			parentNode.insertBefore(el, refNode);
		}else{
			parentNode.appendChild(el);
		}
	};

	/**
	 * Insert the element after refNode
	 */
	thi$.insertAfter = function(el, refNode){
		this.insertBefore(el, refNode.nextSibling, refNode.parentNode);
	};

	/**
	 * Check if the child node is the descendence node of this element.<p>
	 *
	 * @param el, the element that is being compared
	 * @param child, the element that is begin compared against
	 * @param containSelf, whether contains the scenario of parent == child
	 */
	thi$.contains = function(el, child, containSelf){
		if(el == null || el == undefined ||
		   child == null || child == undefined){
			return false;
		}
		if(el.compareDocumentPosition){
			// W3C
			var res = el.compareDocumentPosition(child);
			if(containSelf && res === 0){
				return true;
			}else{
				return res === 0x14;
			}
		}else{
			// IE
			if(containSelf && el === child){
				return true;
			}else{
				return el.contains(child);
			}
		}
	};

	/**
	 * Test if an element has been a DOM element.
	 */
	thi$.isDOMElement = function(el){
		return this.contains(document.body, el, true);
	};

	var _checkElement = function(el){
		if(!this.isDOMElement(el)){
			var err = "The element "+(el.id || el.name)+" is not a DOM element.";
			// throw err;
			J$VM.System.err.println(err);
			return false;
		}
		return true;
	};

	var _breakEventChian = function(e){
		if(e.getType() == "selectstart"){
			var el = e.srcElement, elType = Class.typeOf(el);
			if(elType == "htmlinputelement" ||
			   elType == "htmltextareaelement"){
				return true;
			}
		}
		e.cancelBubble();
		return e.cancelDefault();
	};
	/**
	 * Forbid select the element
	 *
	 * @param el, the element that is fobidden.
	 */
	thi$.forbidSelect = function(el){
		if(typeof document.onselectstart != "function"){
			Event.attachEvent(document, "selectstart", 1, this, _breakEventChian);
		}
		if(typeof el.ondragstart != "function"){
			Event.attachEvent(el, "dragstart", 1, this, _breakEventChian);
		}
	};

	/**
	 * Transform styles to the CSSText string.
	 *
	 * @param styles: {Object} key/value pairs of styles.
	 */
	thi$.toCssText = function(styles){
		if(!Class.isObject(styles)) return "";

		var p, v, ret=[];
		for(p in styles){
			if(styles.hasOwnProperty(p)){
				v = styles[p];
				p = this.hyphenName(p);
				ret.push(p, ":", v,";");
			}
		}
		return ret.join("");
	};

	/**
	 * Join the given ordered styles to the CSSText string.
	 *
	 * @param styleMap: {HashMap} The ordered key/value pairs of styles
	 */
	thi$.joinMapToCssText = function(styleMap){
		var HashMap = Class.forName("js.util.HashMap"),
		buf, keys, p, v;
		if(!styleMap || !(styleMap instanceof HashMap)){
			return "";
		}

		buf = new js.lang.StringBuffer();
		keys = styleMap.keys();
		for(var i = 0, len = keys.length; i < len; i++){
			p = keys[i];
			v = styleMap.get(p);

			if(v !== null && v !== undefined){
				p = this.hyphenName(p);

				buf.append(p).append(":").append(v).append(";");
			}
		}

		return buf.toString();
	};

	/**
	 * Parse the given CSSText as HashMap. With the HashMap,
	 * the order of style names will be kept.
	 *
	 * @param css: {String} The CSSText string to parse.
	 *
	 * @return {js.util.HashMap} The ordered styles.
	 */
	thi$.parseCssText = function(css){
		var String = js.lang.String,
		styleMap = new (Class.forName("js.util.HashMap"))(),
		frags, len, tmp, style, value;
		if(!Class.isString(css) || css.length == 0){
			return styleMap;
		}

		frags = css.split(";");
		len = Class.isArray(frags) ? frags.length : 0;
		for(var i = 0; i < len; i++){
			tmp = frags[i];
			tmp = tmp ? tmp.split(":") : null;

			if(Class.isArray(tmp)){
				style = tmp[0];
				value = tmp[1];

				if(Class.isString(style) && style.length > 0){
					style = String.trim(style);
					value = (Class.isString(value))
						? String.trim(value) : "";

					if(style){
						styleMap.put(style, value);
					}
				}
			}
		}

		return styleMap;
	};

	/**
	 * Remove style declaration with the specified style name from
	 * the given CSSText string, then return the result CSSText string.
	 *
	 * @param css: {String} The CSSText string to remove from.
	 * @param style: {String} The name of style to remove.
	 *
	 * @return {String} The result CSSText string.
	 */
	thi$.rmStyleFromCssText = function(css, style){
		if(!Class.isString(css) || css.length == 0
		   || !Class.isString(style) || style.length == 0){
			return css;
		}

		var styleMap = this.parseCssText(css);
		if(!styleMap.contains(style)){
			style = this.hyphenName(style);
		}

		styleMap.remove(style);
		return this.joinMapToCssText(styleMap);
	};

	/**
	 * Calculate the text size of the specified span node.
	 *
	 * @param str: {String} The text to measure, it must not be encoded.
	 * @param styles: {Object} Some styles which can impact the string size,
	 *		  include font-size, font-weight, font-family, etc.
	 *
	 */
	thi$.getStringSize = function(str, styles){
		var System = J$VM.System,
		specialStyles = {
			display: "inline",
			"white-space": "nowrap",
			position: "absolute",
			left: "-10000px",
			top: "-10000px"
		}, textNode, s;

		styles = System.objectCopy(styles || {}, {});
		styles = System.objectCopy(specialStyles, styles);

		textNode = this.createElement("SPAN");
		textNode.style.cssText = this.toCssText(styles);
		textNode.innerHTML = js.lang.String.encodeHtml(str);

		this.appendTo(textNode, document.body);
		s = this.outerSize(textNode);
		this.remove(textNode, true);
		textNode = null;

		// For ie, the width of a text to fetch isn't often enough for placing
		// the text. Here, we add 1px to make it better.
		if(J$VM.ie){
			s.width += 1;
		}

		return s;
	};

	/**
	 * Calculate the text size of the specified span node.
	 *
	 * @param ele: A DOM node with text as display content,
	 *		  include "SPAN", "INPUT", "TEXTAREA"
	 */
	thi$.getTextSize = function(ele){
		var tagName = ele ? ele.tagName : null,
		str, styles;
		switch(tagName){
		case "DIV": // Such as: <div>xxxx</div>
		case "SPAN":
			str = js.lang.String.decodeHtml(ele.innerHTML);
			break;
		case "INPUT":
		case "TEXTAREA":
			str = ele.value;
			break;
		default:
			break;
		}

		if(!Class.isValid(str)){
			return {width: 0, height: 0};
		}

		styles = this.getStyles(ele, textSps);
		return this.getStringSize(str, styles);
	};

	/**
	 * Set the given HTML content inside the given element.
	 *
	 * @param e: {DOM} A given DOM element into which the given HTML content will be set.
	 * @param html: {Strin} HTML content to set.
	 */
	thi$.setHTML = function(el, html){
		if(J$VM.ie){
			// Remove children, IE keeps empty text nodes in DOM
			while(el.firstChild){
				el.removeChild(el.firstChild);
			}

			try{
				// IE will remove comments from the beginning unless
				// place the contents with something.
				el.innerHTML = "<br />" + html;
				el.removeChild(el.firstChild);
			} catch (e) {
				// IE sometimes produce an unknown runtime error on innerHTML
				// if it's an block element within a block element.
				var tempDiv = this.create("div");
				tempDiv.innerHTML = "<br />" + html;

				// Add all children from div to target element except br
				var children = tempDiv.childNodes,
				len = children ? children.length : 0;
				for(var i = 1; i < len; i++){
					el.appendChild(children[i]);
				}
			}
		} else {
			el.innerHTML = html;
		}

		return el;
	};

	/**
	 * Fetch the absolute url of the given relative url.
	 * 
	 * @param {String} url The relative url.
	 * @return {String} The absolute url.
	 */
	thi$.getAbsoluteUrl = function() {
		var a;
		
		return function(url) {
			if(!a) a = document.createElement('a');
			a.href = url;

			return a.href;
		};
	}();

	/**
	 * Add styles specified the given CSS codes to current document or
	 * the specified document at runtime.
	 * If only one argument is given, which should be the CSS codes. If
	 * two are given, the first should be the specified CSS codes, and
	 * the second should be a document object.
	 *
	 * @param css: {String} CSS codes to add
	 * @param doc: {HTMLDocument} Optional. A document object
	 */
	thi$.addStyle = function(css, doc){
		doc = doc || document;
		if(!css || !doc){
			return;
		}

		var head = doc.getElementsByTagName("head")[0],
		styleElements = head.getElementsByTagName("style"),
		styleElement, media, tmpEl;
		if (styleElements.length == 0) {
			if (J$VM.ie) {
				doc.createStyleSheet();
			} else { //w3c
				tmpEl = doc.createElement('style');
				tmpEl.setAttribute("type", "text/css");
				head.appendChild(tmpEl);
			}

			styleElements = head.getElementsByTagName("style");
		}

		styleElement = styleElements[0];
		media = styleElement.getAttribute("media");
		if (media != null && !/screen/.test(media.toLowerCase())) {
			styleElement.setAttribute("media", "screen");
		}

		if (J$VM.ie) {
			styleElement.styleSheet.cssText += css;
		} else if (J$VM.firefox) {
			styleElement.innerHTML += css; //Firefox supports adding style by innerHTML
		} else {
			styleElement.appendChild(doc.createTextNode(css));
		}
	};

	//////////////////	J$VM StyleSheet	 //////////////////////////////////
	
	thi$.styleSheets = {};
	
	thi$.getStyleSheetBy = function(id, href){
		id = id || null; href = href || null;
		
		var key = id+":"+href, styleEle, dom = self.document,
		styleSheet = this.styleSheets[key];

		if(styleSheet){
			return styleSheet._syncUpdate();
		}
		
		styleSheet = this._findNativeStyleSheet(id, href);
		if(!styleSheet){
			if(href){
				styleEle = dom.createElement("link");
				styleEle.href = href;
				styleEle.rel = "stylesheet";
				styleEle.type = "text/css";
			}else{
				styleEle = dom.createElement("style");
				if(id){
					styleEle.id = id;						 
				}
				styleEle.type = "text/css";					   
			}
			this.insertBefore(styleEle, dom.getElementById("j$vm"));
			styleSheet = this._findNativeStyleSheet(id, href);
		}

		styleSheet = this.styleSheets[key] =
			new (Class.forName("js.util.StyleSheet"))(styleSheet);

		return styleSheet;
	};

	thi$.rmvStyleSheetBy = function(id, href){
		id = id || null; href = href || null;
		
		var key = id+":"+href, styleEle, dom = self.document,
		styleSheet = this.styleSheets[key];

		if(styleSheet){
			this.removeFrom(styleSheet.nativeSheet.ownerNode);
			styleSheet.destroy();
			delete this.styleSheets[key];
		}else{
			styleSheet = this._findNativeStyleSheet(id, href);
			this.removeFrom(styleSheet.ownerNode);
		}
	};
	
	thi$._findNativeStyleSheet = function(id, href){
		id = id || null; href = href || null;

		var styleSheets = self.document.styleSheets, styleSheet, ret=[];
		
		for(var i=0, len=styleSheets.length; i<len; i++){
			styleSheet = styleSheets[i];
			if(styleSheet.ownerNode && styleSheet.ownerNode.id === id &&
			   styleSheet.href === href){
				ret.push(styleSheet);
			}
		}

		return ret.length > 0 ? ret[ret.length-1] : null;
	};


	var STATEREG = /(\w+)(_\d{1,4})$/;

	thi$.splitClassName = function(className){
		className.trim();

		var names = className.split(" "), last = names.pop();
		if(STATEREG.test(last)){
			last = RegExp.$1;
			if(names.length > 0){
				if(last != names[names.length-1]){
					names.push(last);
				}
			}else{
				names.push(last);
			}
		}else{
			names.push(last);
		}
		
		return names;
	};

	var _combineClassName = function(className, ext, separator){
		if(!Class.isString(separator)){
			separator = "_";
		}

		var names = this.splitClassName(className), rst = [], name, tmp;
		for(var i = 0, len = names.length; i < len; i++){
			name = names[i].trim();
            
            // Skip the decorating className, e.g. restree--nombp, btn--square.
            // Rule: all decorating className only for the current component
            if(!name || name.indexOf("--") !== -1){
                continue;
            }

			for(var j = 0, jlen = ext.length; j < jlen; j++){
                tmp = ext[j].trim();
                if(tmp){
                    rst.push(name+separator+tmp);
                }else{
                    rst.push(name);
                }
			}
		}
		
		return rst.join(" ");
	};

	var STATESEGREG = /\s+\$(\S+)/g;

	/**
	 * "A B" + "xx" ==> "A_xx B_xx"
	 * "A B $A $B" + "xx" ==> "A_xx B_xx $A_xx $B_xx"
	 * "A B" + [x, y] ==> "A_x A_y B_x By"
	 * "A B $A $B" + [x, y] ==> "A_x A_y B_x B_y $A_x $A_y $B_x $B_y"
     * 
     * "A B B--nombp" + [x, y] ==> "A_x A_y B_x B_y"
     * 
     * Also, skip the decorating className, e.g. restree--nombp, btn--square.
     * Rule: all decorating className only for the current component.
	 * 
	 * @param {String} className Like "A B", "A B $A $B".
	 * @param {String / Array} ext The specified string / strings to combine.
	 * @param {String} separator Like "", "_".
	 */	   
	thi$.combineClassName = function(className, ext, separator){
		if(!Class.isArray(ext)){
            if(Class.isValid(ext)){
                ext = "" + ext;
            }

			if(ext){
				ext = [ext];
			}else{
				ext = [];
			}
		}

		if(className && ext.length > 0){
			className = _combineClassName.apply(this, arguments);  
		}

		return className;
	};

	/**
	 * "A B" + 4 ==> "A B B_4"
	 * "A B $A" + 2 ==> "A B A_2"
	 * "A B $A $B" + 16 ==> "A B A_16 B_16"
     * "A A--nombp" + 1 ==> "A A--nombp A_1"
     * 
     * Also, skip the decorating className, e.g. restree--nombp, btn--square.
     * Rule: all decorating className only for the current component.
	 * 
	 * @param {String} className Like "A B", "A B $A $B".
	 * @param {Number} state
	 */
	thi$.stateClassName = function(className, state){
		var names = [], stateNames = [], sname,
		str = className.replace(STATESEGREG,
								function(match, name){
									if(name){
										stateNames.push(name);
									}

									return "";
								});

		names = this.splitClassName(str);
		if(stateNames.length === 0){
            // Skip the decorating className, e.g. restree--nombp, btn--square.
            for(var i = names.length - 1; i >= 0; i--){
                sname = names[i];
                if(!sname || sname.indexOf("--") !== -1){
                    continue;
                }else{
                    stateNames.push(sname);
                    break;
                }
            }
		}

		if(state != 0){
			for(var i = 0, len = stateNames.length; i < len; i++){
				names.push(stateNames[i] + "_" + state);
			}
		}

		return names.join(" ");
	};

	/**
	 * Clear the special "State ClassName" segments, such as "$abc", 
	 * and return the clean className for the DOM element.
	 * 
	 * "A B $A $B" ==> "A B"
	 * 
	 * @param {String} className Link "A B $A $B"
	 * @return {String}
	 */
	thi$.extractDOMClassName = function(className){
		return className ? className.replace(STATESEGREG, "") : "";
	};

	thi$.makeUrlPath = function(parent, file){
		var A = self.document.createElement("A");
		A.href = parent + file;
		return A.href;
	};

	thi$.getEntryID = function(ele){
		var entries = self.document.querySelectorAll("[jsvm_entry]"),
		entry, ret;
		if(!ele){
			ret = (entries && entries.length > 0) ?
				entries[0].getAttribute("jsvm_entry") : ret;
		}else{
			for(var i=0, len=entries.length; i<len; i++){
				entry = entries[i];
				if(this.contains(entry, ele, true)){
					ret = entry.getAttribute("jsvm_entry");
					break;
				}
			}
		}
		return ret;
	};

    thi$.getComponent = function(ele, create, Runtime){
        var obj = null, uuid, parent;
        if(!ele || ele === self.document) return obj;

        uuid = ele.uuid;
        if(uuid){
            // Return the object which was cached in 
            // js.lang.Object.objectStore
            obj = this.getObject(uuid);
        }else if(create){
            uuid = js.lang.Math.uuid();
            ele.uuid = uuid;
            obj = new js.awt.Component({
                id: ele.id,
                uuid:uuid,
                className: ele.className||"",
                stateless:true},
                Runtime, ele);
            var bounds = obj.getBounds();
            obj.setBounds(bounds.x, bounds.y,
                bounds.width, bounds.height, 0x04);
        }else{
            // Return the ancestor which is a js.lang.Object
            obj = this.getComponent(ele.parentNode);
        }

        return obj;
    };

    thi$.inside = function(x, y, bounds){
        var d = bounds, MBP = d.MBP, minX, minY, maxX, maxY;
        minX = d.absX + MBP.borderLeftWidth;
        maxX = minX + d.clientWidth;
        minY = d.absY + MBP.borderTopWidth;
        maxY = minY + d.clientHeight;
        return x > minX && x < maxX && y > minY && y < maxY;
    };

    thi$.relative = function(x, y, bounds){
        var d = bounds, MBP = d.MBP;
        return {
            x: x - d.absX - MBP.borderLeftWidth,
            y: y - d.absY - MBP.borderTopWidth
        }
    };

    // For resize and move
    var OFFSETTABLE = [
        [[8, 0], [9, 7], [8, 7], [9, 7], [8, 6]],
        [[9, 1], [8,-1], [8,-1], [8,-1], [9, 5]],
        [[8, 1], [8,-1], [8,-1], [8,-1], [8, 5]],
        [[9, 1], [8,-1], [8,-1], [8,-1], [9, 5]],
        [[8, 2], [9, 3], [8, 3], [9, 3], [8, 4]]
    ];

    var offsetIndex0 = function(offset, min, max, step){
        var ret = -1, b0 = min, b1, b2, b3, b4, b5 = max, m, hm;
        step = Class.isNumber(step) ? step : 6;
        m = (b5-b0)/(2*step) - 1;
        hm = m/2;

        b1 = b0 + step;
        b2 = b1 + hm*step;
        b3 = b2 + m*step;
        b4 = b3 + hm*step;
        
        if(offset >= b0 && offset < b1){
            ret = 0;
        }else if(offset >= b1 && offset < b2){
            ret = 1;
        }else if(offset >= b2 && offset < b3){
            ret = 2;
        }else if(offset >= b3 && offset < b4){
            ret = 3;
        }else if(offset >= b4 && offset <= b5){
            ret = 4;
        }

        return ret;
    };

    thi$.offsetIndexes = function(x, y, bounds, movable){
        var xIdx, yIdx, idx = [-1,-1];
        yIdx = offsetIndex0(y, bounds.absY,
                            bounds.absY + bounds.height);
        xIdx = offsetIndex0(x, bounds.absX,
                            bounds.absX + bounds.width);

        if(yIdx >= 0  && xIdx >= 0){
            idx = OFFSETTABLE[yIdx][xIdx];
        }

        return idx;
    };

    var CURSORS = [
        "nw-resize",
        "w-resize",
        "sw-resize",
        "s-resize",
        "se-resize",
        "e-resize",
        "ne-resize",
        "n-resize",
        "move",
        "ew-resize",
        "ns-resize",
        "default"
    ];
    
    thi$.getDynamicCursor = function(index){
        return index >= 0 ? CURSORS[index] : null;
    };

    var _ele, _cursor;
    
    thi$.setDynamicCursor = function(ele, cursor){

        if(_ele){
            _ele.style.cursor = _cursor;
        }

        if(ele !== _ele){
            _ele = ele;
            _cursor = this.getStyle(ele, "cursor");
        }

        if(cursor){
            ele.style.cursor = cursor;
        }
    };
    
}.$extend(js.lang.Object);
