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
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
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
            this.setStyle(el, userselect, "text");
            this.applyStyles(el, {resize: "none", outline: "none"});
            break;
            case "TEXTAREA":
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

		return isEle ? el.getBoundingClientRect() :
			{ left: 0, top: 0, bottom: 0, right: 0 };
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
		if(typeof styles !== "object"){
			return "";
		}

		var buf = new js.lang.StringBuffer(), p, v;
		for(p in styles){
			v = styles[p];

			if(v !== null && v !== undefined){
				p = this.hyphenName(p);

				buf.append(p).append(":").append(v).append(";");
			}
		}

		return buf.toString();
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

    
    thi$.styleSheets = [];
    
    thi$.styleSheetSet = {};
    
    /**
     * Apply a stylesheet with id and css code
     * 
     * @param id {String} id of the style tag
     * @param css {String} CSS code
     */
    thi$.applyStyleSheet = function(id, css){
        var dom = self.document, entry="j$vm_css",
            style = dom.getElementById(entry),
            sheets = this.styleSheets,
            set = this.styleSheetSet;

        sheets.push(id);
        set[id] = css;

        if(!style){
            style = dom.createElement("style");
            style.id = entry;
            style.title = entry;
            style.type = "text/css";
            this.insertBefore(style, dom.getElementById("j$vm"));
        }

        var buf = [];
        for(var i=0, len=sheets.length; i<len; i++){
            buf.push(set[sheets[i]]);
        }
        css = buf.join("\r\n");

        if(style.styleSheet){
            // IE
            try{
                style.styleSheet.cssText = css;
            } catch (x) {

            }
        }else{
            // W3C
            style.innerHTML = css;
        }
    };

    var STATEREG = /(\w+)(_\d{1,4})$/;

    thi$.splitCSSClass = function(className){
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
    }
    
    /**
     * 
     * @param className {String}
     * @param ele {String} 
     */
    thi$.comboCSSClass = function(className, ele){
        var names = this.splitCSSClass(className);
        for(var i=0, len=names.length; i<len; i++){
            names[i] = names[i]+"_"+ele;
        }
        return names.join(" ");
    }

    /**
     * 
     * @param className {String}
     * @param state {Number}
     */
    thi$.stateCSSClass = function(className, state){
        var names = this.splitCSSClass(className);
        if(state != 0){
            names.push(names[names.length-1]+"_"+state);
        }
        return names.join(" ");        
    };

    thi$.makeUrlPath = function(parent, file){
        var A = self.document.createElement("A");
        A.href = parent + file;
        return A.href;
    }

}.$extend(js.lang.Object);
