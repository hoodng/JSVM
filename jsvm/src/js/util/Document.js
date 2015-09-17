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
    //    Google Chrome, Safari and in Internet Explorer from version 8.
    // 2) In Internet Explorer earlier than version 8, the default is that
    //    the name is case-sensitive in HTML documents but these settings can
    //    be modified by the caseSens parameter of the setAttribute method.
    // 3) In Internet Explorer earlier than version 8, the corresponding JavaScript
    //    property name (camelCase name) needs to be specified.
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
    },
    REGX_CAMEL = /[A-Z]/g, REGX_HYPHEN = /-([a-z])/ig,
    textSps = [
        "font-family", "font-size", "font-style", "font-weight", 
        "text-decoration", "text-align", "font-weight", "line-height"
    ],
    camelMap = {}, hyphenMap = {};

    thi$.checkBrowser = function(){
        /**
         * @member J$VM
         * @property {Properties} supports
         * Determines the current browser's abilities
         */
        // Check browser supports
        var supports = J$VM.supports
                     = {reliableMarginRight :true, supportCssFloat : true},
            buf = [], doc = self.document, div = doc.createElement("DIV"),
            ipt, obj;

        buf.push('<div style="height:30px;width:50px;left:0px;position:absolute;">');
        buf.push('<div style="height:20px;width:20px;"></div></div>');
        buf.push('<div style="float:left;"></div>');
        div.innerHTML = buf.join("");
        div.style.cssText = "position:absolute;width:100px;height:100px;"
                          + "border:5px solid black;padding:5px;"
                          + "visibility:hidden;";
        doc.body.appendChild(div);

        // Check browser supports for Input, Textarea
        ipt = doc.createElement("INPUT");
        ipt.type = "text";
        ipt.style.cssText = "position:absolute;width:100px;height:100px;"
                          + "border:2px solid;visibility:hidden;";
        doc.body.appendChild(ipt);

        var view = doc.defaultView, cdiv = div.firstChild,
            ccdiv = cdiv.firstChild;
        
        if(view && view.getComputedStyle
                && (view.getComputedStyle(ccdiv, null).marginRight != '0px')){
            supports.reliableMarginRight = false;
        }

        /**
         * @member J$VM.supports
         * @property {Boolean} supportCssFloat
         *
         */
        supports.supportCssFloat = !!div.lastChild.style.cssFloat;
        if(supports.supportCssFloat){
            camelMap["float"] = "cssFloat";
        }else{
            camelMap["float"] = "styleFloat";
        }

        /**
         * @member J$VM.supports
         * @property {Boolean} borderBox
         * Whether CSS box model is border-box
         */
        supports.borderBox = !(div.offsetWidth > 100);
        /**
         * @member J$VM.supports
         * @property {Boolean} borderEdg
         * Whether CSS box model is border-edge
         */
        supports.borderEdg = !(cdiv.offsetLeft == 0);
        /**
         * @member J$VM.supports
         * @property {Boolean} iptBorderBox
         * Whether BorderBox support of Input and Textarea
         */
        supports.iptBorderBox = !(ipt.offsetWidth > 100);
        /**
         * @member J$VM.supports
         * @property {Boolean} placeholder
         * Whether placeholder support of Input and Textarea
         */
        supports.placeholder = ("placeholder" in ipt);

        // Check scrollbars' thicknesses
        // Attention:
        // In firefox (win 19.0.2 1024 * 768), if there is no enough 
        // space to show the scrollbar, the scrollbar won't be display 
        // and its thickness is 0. So, the width of the horizontal 
        // scrollbar should be large than (16px (left button) + 16px (right button)
        // + xpx (minwidth of the slider, maybe 2px)) and the width of div 
        // should be large than 51px (include width of virtical scrollbar.)
        // Additionally, when screen resolution ratio (maybe dpi) is special, 
        // the scrollbar's thickness and button may be more large. 
        // So we use a big size for div to check.
        div.innerHTML = "";
        div.style.cssText = "position:absolute;left:-550px;top:-550px;"
                          + "width:550px;height:550px;overflow:scroll;"
                          + "visibility:hidden;";
        obj = this.hasScrollbar(div);
        /**
         * @member J$VM.supports
         * @property {Number} hscrollbar
         * Height of hscrollbar
         */
        supports.hscrollbar = obj.hbw;
        /**
         * @member J$VM.supports
         * @property {Number} vscrollbar
         * Width of vscrollbar
         */
        supports.vscrollbar = obj.vbw;

        // For IE, the dom element which has scrollbars should wider than 
        // the vscrollbar and higher than the hscrollbar.

        /**
         * @member J$VM.supports
         * @property {Number} preHScrollEleH
         * For IE, the dom element which has scrollbars should wider than 
         * the vscrollbar and higher than the hscrollbar.
         */
        supports.preHScrollEleH = supports.hscrollbar + (J$VM.ie ? 1 : 0);
        /**
         * @member J$VM.supports
         * @property {Number} preVScrollEleW
         * For IE, the dom element which has scrollbars should wider than 
         * the vscrollbar and higher than the hscrollbar.
         */
        supports.preVScrollEleW = supports.vscrollbar + (J$VM.ie ? 1 : 0);
        /**
         * @member J$VM.supports
         * @property {Boolean} touchEnabled
         * Whether browser support touch events
         */
        supports.touchEnabled = (window.TouchEvent != undefined);
        /**
         * @member J$VM.supports
         * @property {Boolean} pointerEnabled
         * Whether browser support pointer events
         */
        supports.pointerEnabled = (window.PointerEvent != undefined);
        /**
         * @member J$VM.supports
         * @property {Boolean} mouseEnabled
         * Whether browser support mouse events
         */
        supports.mouseEnabled = (window.MouseEvent != undefined);


        // Dectect logical DPI of the browser
        div.innerHTML = "";
        div.style.cssText = "position:absolution;left:0px;top:0px;"
                          +"width:2.54cm;height:2.54cm;visibility:hidden;";
        if(!window.screen.logicalXDPI){
            var styles = doc.defaultView.getComputedStyle(div, null);
            supports.logicalXDPI = parseInt(styles["width"]);
            supports.logicalYDPI = parseInt(styles["height"]);
        }else{
            /**
             * @member J$VM.supports
             * @property {Number} logicalXDPI
             */
            supports.logicalXDPI = window.screen.logicalXDPI;
            /**
             * @member J$VM.supports
             * @property {Number} logicalYDPI
             */
            supports.logicalYDPI = window.screen.logicalYDPI;
        }

        // Check graphics, canvas, svg and vml.
        obj = doc.createElement("CANVAS");
        /**
         * @member J$VM.supports
         * @property {Boolean} canvas
         * Whether supports Canvas
         */
        supports.canvas = (typeof obj.getContext === "function");
        /**
         * @member J$VM.supports
         * @property {Boolean} svg
         * Whether supports SVG
         */
        supports.svg = (doc.SVGAngle || doc.implementation.hasFeature(
            "http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));
        div.innerHTML = "<v:shape id='vml_flag1' adj='1' />";
        obj = div.firstChild;
        obj.style.behavior = "url(#default#VML)";
        /**
         * @member J$VM.supports
         * @property {Boolean} vml
         * Whether supports VML
         */
        supports.vml = (obj ? typeof obj.adj === "object" : false);

        // IE Binary2Array
        if(typeof self.Uint8Array != "function"){
            var script = doc.createElement("script"),
                head = document.getElementsByTagName("head")[0];
            script.type = "text/vbscript";
            script.text = "Function IEBinaryToString(B)\r\n"+
                "Dim I, S\r\n"+
                "For I = 1 To LenB(B)\r\n" +
                "If I <> 1 Then S = S & \",\"\r\n" +
                "S = S & CStr(AscB(MidB(B, I, 1)))\r\n" +
                "Next\r\n"+
                "IEBinaryToString = S\r\n"+
                "End Function\r\n";
            head.appendChild(script);
            head.removeChild(script);
        }

        if(J$VM.firefox){
            Event.W3C_EVT_MOUSE_WHEEL = "DOMMouseScroll";
        }
        
        // Clean
        obj = null;
        doc.body.removeChild(div);
        doc.body.removeChild(ipt);
    };

    thi$.checkDoctype = function(){
        var reg = /(\"[^\"]+\")/gi,
            publicIDReg=/\s+(X?HTML)\s+([\d\.]+)\s*([^\/]+)*\//gi,
            DOCTYPEFEATURS = ["xhtml", "version", "importance"/*, "systemId"*/],
            doctype = J$VM.doctype = {declared: false},
            dtype, publicId, systemId;

        if(document.doctype != null){
            doctype.declared = true;

            dtype = document.doctype;
            doctype.name = dtype.name;

            publicId = dtype.publicId || "";
            systemId = dtype.systemId || "";
        }else if(typeof document.namespaces != "undefined"){
            var dt = document.all[0];

            var value = (dt.nodeType == 8 ? dt.nodeValue : "");
            if(value && (value.toLowerCase().indexOf("doctype") != -1)){
                doctype.declared = true;
                doctype.name = dt.scopeName;

                dtype = [];
                value.replace(reg,
                              function($0){
                                  if($0){
                                      $0 = $0.replace(/"|'/g, "");
                                      dtype.push($0);
                                  }
                              });

                publicId = dtype[0] || "";
                systemId = dtype[1] || "";
            }
        }

        if(doctype.declared){
            doctype.publicId = publicId = publicId.toLowerCase();
            doctype.systemId = systemId.toLowerCase();

            try{
                if(publicId.length > 0 &&
                   publicIDReg.test(publicId) && RegExp.$1){
                    doctype["xhtml"] = (RegExp.$1);
                    doctype["version"] = RegExp.$2;
                    doctype["importance"] = RegExp.$3;
                }
            }catch(e){}

            doctype.getEigenStr = function(){
                var fValues = [], v;
                if(this.declared){
                    for(var i = 0, len = DOCTYPEFEATURS.length; i < len; i++){
                        v = this[DOCTYPEFEATURS[i]];
                        if(v){
                            fValues.push(v);
                        }
                    }

                    v = fValues.length > 0 ? fValues.join("-") : "";
                }

                return v;
            };
        }
    };

    
    /**
     * Create a DOM element
     *
     */
    thi$.createElement = function(type){
        var el = document.createElement(type);
        // TODO ?
        return el;
    };

    thi$.cloneElement = function(ele, deep){
        var view;
        switch(Class.typeOf(ele)){
            case "htmlbodyelement":
            case "htmliframeelement":
            view = this.createElement("DIV");
            break;
            default:
            if(ele){
                view = ele.cloneNode(deep);
            }
            break;
        }
        return view;
    };

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
            hyphenMap[_s]=  s;
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
        var p = ele.offsetParent, body = document.body;

        if(!p || !this.contains(body, p, true)){
            p = body;
        }
        return p;
    };

    /**
     * Returns current styles of the specified element
     *
     */
    thi$.currentStyles = function(el){
        var V = document.defaultView;
        return (V && V.getComputedStyle) ?
            V.getComputedStyle(el, null) : (el.currentStyle || el.style);
    };


    var OPACITYREGX = /alpha\(opacity=(.*)\)/i;
    /**
     * Return the computed style of the element.
     *
     * @param el, the DOM element
     * @param sp, the style property name
     */
    thi$.getStyle = function(el, sp, currentStyle){
        if(!el || el === self.document) return null;

        var out;

        sp = this.camelName(sp);
        currentStyle = currentStyle || this.currentStyles(el);
        out = currentStyle[sp];

        if(sp === "marginRight" && out !== "0px" &&
                    !J$VM.supports.reliableMarginRight){
            sp = el.style.display;
            el.style.display = "inline-block";
            out = this.currentStyles(el).marginRight;
            el.style.display = sp;
        }else if(sp === "opacity"){
            if(el.style.filter.match){
                out = 1;
                sp = el.style.filter.match(OPACITYREGX);
                if(sp){
                    sp = parseFloat(sp[1]);
                    if(!isNaN(sp)){
                        out = sp/100;
                    }
                }
            }
        }

        return out;
    };

    /**
     * Return the computed styles of the element
     *
     * @param el, the DOM element
     * @param sps, the array of style property name
     */
    thi$.getStyles = function(el, sps){
        var currentStyle = this.currentStyles(el), styles = {};
        
        (function(sp){
            styles[this.camelName(sp)] =
                this.getStyle(el, sp, currentStyle);
        }).$forEach(this, sps || []);

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
     *        "" if not found.
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
        return el.hasAttribute ? el.hasAttribute(attr) :
            Class.isValid(el.getAttribute(attr));
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
        var style = el.style, currentStyle = el.currentStyle;

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

    var _setStyle = function(ele, sp, value){
        if(sp == "opacity"){
            this.setOpacity(ele, value);
        }else{
            sp = this.camelName(sp);
            ele.style[sp] = value;
        };
    };
    
    /**
     * Apply style for the DOM element
     *
     * @param el: the DOM element
     * @param sp: name of the specified style to apply
     * @param value: the vlaue of the specified style to apply
     */
    thi$.setStyle = function(el, sp, value){
        var styles = {};
        styles[sp] = value;
        this.applyStyles(el, styles);
    };
    
    /**
     * Apply styles to the DOM element
     *
     * @param el, the DOM element
     * @param styles, the style set
     */
    thi$.applyStyles = function(ele, styles){
        var mbpchanged = false, sp;
        
        styles = styles || {};
        for(sp in styles){
            mbpchanged = MBPTEST.test(sp);
            _setStyle.call(this, ele, sp, styles[sp]);
        }

        return this.getBounds(ele, mbpchanged);
    };

    thi$.MBPCache = {};
    
    thi$.MBP = function(ele, nocache, clazz){
        var bounds = ele ? (ele.bounds||{}) : {}, outer,
            mbp, mbpinline, clone, body;

        if(!ele) return null;

        outer = this.outerSize(ele);
        clazz = clazz || this.getClassName(ele);
        
        mbp = bounds.MBP;
        if(mbp && !nocache && (mbp.clazz === clazz) ||
           (mbp && ele.cloned)){
            if(outer.valid){
                J$VM.System.objectCopy(outer, mbp);                
            }

            return mbp;
        }

        mbpinline = MBPTEST.test(ele.style.cssText);
        if(!mbpinline){
            mbp = this.MBPCache[clazz];
            mbp = mbp ? J$VM.System.objectCopy(mbp, {}) : null;
            if(mbp){
                if(outer.valid){
                    J$VM.System.objectCopy(outer, mbp);
                }
                return mbp;
            }
        }

        if(this.isDOMElement(ele)){
            mbp = _calcMBP.call(this, ele,  clazz, outer, mbpinline);
            return mbp;
        }

        // When the ele is not a DOM element or
        // when the ele or it's ancestors are diplay == none.
        body = self.document.body;
        clone = ele.cloneNode(ele.nodeName === "SPAN" ? true : false);
        clone.style.cssText = [
            ele.style.cssText,
            "visibility:hidden"].join(";");
        body.appendChild(clone);

        if(this.getStyle(clone, "display") === "none"){
            clone.style.display = "";
        }

        outer = this.outerSize(clone);
        mbp = _calcMBP.call(this, clone, clazz, outer, mbpinline);
        mbp.fake = true;
        body.removeChild(clone);

        return mbp;
    };
    
    var _calcMBP = function(ele, clazz, outer, mbpinline){
        var styles = this.currentStyles(ele, true), mbp ={};

        // BBM: BorderBoxModel
        switch(Class.typeOf(ele)){
            case "htmlinputelement":
            case "htmltextareaelement":
            mbp.BBM = J$VM.supports.iptBorderBox;
            break;
            default:
            mbp.BBM = J$VM.supports.borderBox;
            break;
        }

        var z = parseInt(styles.zIndex);
        mbp.zIndex = isNaN(z) ? 0 : z;
        margin(styles, mbp);
        border(styles, mbp);
        padding(styles,mbp);
        mbp.BPW= mbp.BW + mbp.PW;
        mbp.BPH= mbp.BH + mbp.PH;
        mbp.clazz = clazz
        if(outer.valid){
            J$VM.System.objectCopy(outer, mbp);
        }
        
        if(!mbpinline){
            this.MBPCache[clazz] =
                J$VM.System.objectCopy(mbp, {}, true);
        }
        return mbp;
    };

    var MBPTEST = /margin|border|padding|top|right|bottom|left|width|height/;

    var MBPSTYLES = [
        {style: "borderTopStyle", border:"borderTopWidth",
         margin: "marginTop", padding:"paddingTop"},
        
        {style: "borderRightStyle", border:"borderRightWidth",
         margin: "marginRight", padding:"paddingRight"},
        
        {style: "borderBottomStyle", border:"borderBottomWidth",
         margin: "marginBottom", padding:"paddingBottom"},
        
        {style: "borderLeftStyle", border:"borderLeftWidth",
         margin: "marginLeft", padding:"paddingLeft"}
    ];

    var parseNumber = function(value){
        var i = Class.isValid(value) ? parseInt(value) : 0;
        if(Class.isNumber(i)) return i;
        switch(value.toLowerCase()){
            case "thin": return 1;
            case "medium": return 3;
            case "thick": return 5;
            default: return 0;
        }
    };

    var margin = function(styles, mbp){
        var i, op;
        for(i=0; i<4; i++){
            op = MBPSTYLES[i];
            mbp[op.margin] = parseNumber(styles[op.margin]);
        }
        mbp.MW = mbp.marginLeft + mbp.marginRight;
        mbp.MH = mbp.marginTop + mbp.marginBottom;
    };
    
    var border = function(styles, mbp){
        var i, op, bs;
        for(i=0; i<4; i++){
            op = MBPSTYLES[i];
            bs = styles[op.style].toLowerCase();
            mbp[op.border] = (!bs || bs === "none") ?
                0 : parseNumber(styles[op.border]);
        }
        mbp.BW = mbp.borderLeftWidth + mbp.borderRightWidth;
        mbp.BH = mbp.borderTopWidth + mbp.borderBottomWidth;
    };

    var padding= function(styles, mbp){
        var i, op;
        for(i=0; i<4; i++){
            op = MBPSTYLES[i];
            mbp[op.padding] = parseNumber(styles[op.padding]);
        }
        mbp.PW = mbp.paddingLeft + mbp.paddingRight;
        mbp.PH = mbp.paddingTop + mbp.paddingBottom;
    };

    /**
     * Get border width of this element
     *
     * @param ele the element
     *
     * @return {borderTopWidth, borderRightWidth,
     * borderBottomWidth, borderLeftWidth}
     */
    thi$.getBorderWidth = function(ele){
        return this.MBP(ele).MBP;
    };

    /**
     * Return padding width of the element
     *
     * @param ele the element
     * 
     * @return {paddingTop, paddingRight, paddingBottom, paddingLeft}
     */
    thi$.getPadding = function(ele){
        return this.MBP(ele).MBP;
    };

    /**
     * Return margin width of the element
     *
     * @param el the element
     *
     * @return {marginTop, marginRight, marginBottom, marginLeft}
     */
    thi$.getMargin = function(ele){
        return this.MBP(ele).MBP;
    };

    thi$.getBoundRect = function(ele, rect){
        var r, ftoi = Math.ceil;
        rect = rect || {};
        r = ele.getBoundingClientRect();
        rect.left = ftoi(r.left);
        rect.top = ftoi(r.top);
        rect.bottom = ftoi(r.bottom);
        rect.right = ftoi(r.right);
        return rect;
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
    thi$.outerSize = function(el, rect){
        rect = rect || {};
        if(el.tagName !== "BODY"){
            rect = this.getBoundRect(el, rect);
            rect.width = rect.right - rect.left;
            rect.height= rect.bottom- rect.top;
        }else{
            var r = _computeByBody.call(this) ?
                document.body : document.documentElement;
            rect.left = rect.top = 0;
            rect.right = rect.width = r.clientWidth;
            rect.bottom= rect.height= r.clientHeight;
        }

        rect.valid = (rect.width + rect.height) > 0;
        rect.position = this.getStyle(el, "position");
        return rect;
    };

    /**
     * Return outer (outer border) width of the element
     *
     */
    thi$.outerWidth = function(el){
        return this.outerSize(el).width;
    };

    /**
     * Return outer (outer border) height of the element
     *
     */
    thi$.outerHeight = function(el){
        return this.outerSize(el).height;
    };

    /**
     * Return the inner (content area) size of the element
     *
     * @return {width, height}
     */
    thi$.innerSize = function(ele){
        return this.getBounds(ele);
    };

    /**
     * Return the inner (content area) width of the element
     */
    thi$.innerWidth = function(el){
        return this.innerSize(el).width;
    };

    /**
     * Return the inner (content area) height of the element
     */
    thi$.innerHeight = function(el){
        return this.innerSize(el).height;
    };

    /**
     * Set outer size of the element
     *
     * @param el
     * @param w width
     * @param h height
     * @param bounds @see getBounds(el)
     */
    thi$.setSize = function(ele, w, h, bounds){
        var mbp, v, changed = false,
            canvas = (ele.tagName === "CANVAS");

        bounds = bounds || this.getBounds(ele);
        mbp = bounds.MBP;

        if(w !== bounds.width && Class.isNumber(w)){
            v = w;
            w = mbp.BBM ? w : w - mbp.BPW;
            if(w >= 0){
                if(canvas){
                    ele.width = w;
                }else{
                    ele.style.width =  w + "px";
                }

                bounds.width = mbp.width = v;
                mbp.right = mbp.left + mbp.width;
                bounds.innerWidth = v > 0 ? bounds.width - mbp.BPW : 0;
                bounds.styleW = mbp.BBM ? bounds.width : bounds.innerWidth;
                bounds.offsetWidth = ele.offsetWidth;
                bounds.clientWidth = ele.clientWidth;
                bounds.scrollWidth = ele.scrollWidth;
            }
        }

        if(h !== bounds.height && Class.isNumber(h)){
            v = h;
            h = mbp.BBM ? h : h - mbp.BPH;
            if(h >= 0){
                if(canvas){
                    ele.height = h;
                }else{
                    ele.style.height =  h + "px";
                }

                bounds.height = mbp.height = v;
                mbp.bottom = mbp.top + mbp.height;
                bounds.innerHeight = v > 0 ? bounds.height - mbp.BPH : 0;
                bounds.styleH = mbp.BBM ? bounds.height : bounds.innerHeight;
                bounds.offsetHeight= ele.offsetHeight;
                bounds.clientHeight = ele.clientHeight;
                bounds.scrollHeight = ele.scrollHeight;
            }
        }

        return bounds;
    };

    /**
     * Return absolute (x, y) of this element
     *
     * @return {x, y}
     *
     * @see absX()
     * @see absY()
     */
    thi$.absXY = function(el){
        var r = this.getBoundRect(el);
        return { x: r.left, y: r.top };
    };

    /**
     * Return absolute left (outer border to body's outer border) of this
     * element
     */
    thi$.absX = function(el){
        return this.absXY(el).x;
    };

    /**
     * Return absolute top (outer border to body's outer border) of this
     * element
     */
    thi$.absY = function(el){
        return this.absXY(el).y;
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
    thi$.setPosition = function(ele, x, y, bounds){
        var mbp, changed = false;

        bounds = bounds || this.getBounds(ele);
        mbp = bounds.MBP;

        if(x !== bounds.x && Class.isNumber(x)){
            ele.style.left = x + "px";

            mbp.left += (x - bounds.x);
            mbp.right = mbp.left + mbp.width;
            bounds.absX = mbp.left;
            bounds.x = x;
            bounds.offsetX = ele.offsetLeft;
            bounds.scrollLeft  = ele.scrollLeft;
        }

        if(y !== bounds.y && Class.isNumber(y)){
            ele.style.top = y + "px";

            mbp.top += (y - bounds.y);
            mbp.bottom = mbp.top + mbp.height;
            bounds.absY = mbp.top;
            bounds.y = y;
            bounds.offsetY = ele.offsetTop;
            bounds.scrollTop   = ele.scrollTop;
        }

        return bounds;
    };

    thi$.setZ = function(ele, z, bounds){
        var mbp;
        
        bounds = bounds || this.getBounds(ele);
        mbp = bounds.MBP;
        
        ele.style.zIndex = z;
        mbp.zIndex = z;

        return bounds;
    };

    /**
     * Set box model to this element
     *
     * @see getBounds(el);
     */
    thi$.setBounds = function(ele, x, y, w, h, bounds){
        bounds = bounds || this.getBounds(ele);
        this.setPosition(ele, x, y, bounds);
        this.setSize(ele, w, h, bounds);
        return bounds;
    };

    /**
     * Return box model of this element
     */
    thi$.getBounds = function(ele, nocache){
        var bounds, mbp, clazz;
        
        if(!ele) return null;

        bounds = ele.bounds = (ele.bounds || {});
        mbp = bounds.MBP;
        clazz = this.getClassName(ele);
        if(mbp && !nocache && (mbp.clazz === clazz)){
            if(mbp.position === "absolute") {
                return this.updateBounds(ele, bounds);
            }
            nocache = false;
        }else{
            nocache = true;
        }
        
        bounds.MBP = this.MBP(ele, nocache, clazz);
        bounds.BBM = bounds.MBP.BBM;
        bounds = _calcCoords.call(this, ele, bounds);
        bounds = _calcSize.call(this, ele, bounds);

        return this.updateBounds(ele, bounds);
    };

    thi$.updateBounds = function(ele, bounds){
        bounds.offsetX = ele.offsetLeft;
        bounds.offsetY = ele.offsetTop;
        bounds.offsetWidth = ele.offsetWidth;
        bounds.offsetHeight= ele.offsetHeight;

        bounds.scrollLeft  = ele.scrollLeft;
        bounds.scrollTop   = ele.scrollTop;
        bounds.scrollWidth = ele.scrollWidth;
        bounds.scrollHeight= ele.scrollHeight;

        bounds.clientWidth = ele.clientWidth;
        bounds.clientHeight= ele.clientHeight;

        bounds.scroll = this.hasScrollbar(ele, bounds);
        
        return bounds;
    };

    thi$.validBounds = function(bounds){
        var mbp = bounds ? bounds.MBP : null; 
        return mbp && mbp.valid;
    };

    var _calcCoords = function(ele, bounds){
        var mbp = bounds.MBP, pMBP;
        
        bounds.absX    = mbp.left;
        bounds.absY    = mbp.top;
        bounds.offsetX = ele.offsetLeft;
        bounds.offsetY = ele.offsetTop;

        bounds.x = bounds.offsetX - mbp.marginLeft;
        bounds.y = bounds.offsetY - mbp.marginTop;
        
        if(!this.isDOMElement(ele)) return bounds;

        if(J$VM.supports.borderEdg && mbp.position !== "relative"){
            pMBP = this.MBP(ele.parentNode);
            bounds.x -= pMBP.borderLeftWidth;
            bounds.y -= pMBP.borderTopWidth;
        }

        if(mbp.position === "relative"){
            pMBP = pMBP || this.MBP(ele.parentNode);
            bounds.x -= pMBP.paddingLeft;
            bounds.y -= pMBP.paddingTop;
        }

        return bounds;
    };

    var _calcSize = function(ele, bounds){
        var mbp = bounds.MBP;

        bounds.width  = mbp.width;
        bounds.height = mbp.height;

        if(mbp.valid){
            bounds.innerWidth  = bounds.width - mbp.BPW;
            bounds.innerHeight = bounds.height- mbp.BPH;
        }else{
            bounds.innerWidth  = bounds.width;
            bounds.innerHeight = bounds.height;
        }
        
        if(mbp.BBM){
            bounds.styleW = bounds.width;
            bounds.styleH = bounds.height;
        }else{
            bounds.styleW = bounds.innerWidth;
            bounds.styleH = bounds.innerHeight;
        }

        return bounds;
    };

    /**
     * Returns whether an element has scroll bar
     *
     * @return {
     *   hscroll: true/false
     *   vscroll: true/false
     * }
     */
    thi$.hasScrollbar = function(el, bounds){
        var mbp = (bounds || this.getBounds(el)).MBP,
            vbw = el.offsetWidth - el.clientWidth - mbp.BW,
            hbw = el.offsetHeight- el.clientHeight- mbp.BH;

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
        //_fireHtmlEvent.call(this, el, Event.SYS_EVT_ELE_REMOVED);        
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
        if(!el || !parentNode) return;
        parentNode.appendChild(el);
        _fireHtmlEvent.call(this, el, Event.SYS_EVT_ELE_APPEND);
    };

    /**
     * Insert the element before refNode
     */
    thi$.insertBefore = function(el, refNode, parentNode){
        if(!el || (!refNode && !parentNode)) return;
        if(refNode){
            refNode.parentNode.insertBefore(el, refNode);
        }else{
            parentNode.appendChild(el);
        }
        _fireHtmlEvent.call(this, el, Event.SYS_EVT_ELE_APPEND);        
    };

    /**
     * Insert the element after refNode
     */
    thi$.insertAfter = function(el, refNode){
        if(!el || !refNode) return;
        var parentNode = refNode.parentNode;
        refNode = refNode.nextSibling;
        if(refNode){
            parentNode.insertBefore(el, refNode);
        }else{
            parentNode.appendChild(el);
        }
        _fireHtmlEvent.call(this, el, Event.SYS_EVT_ELE_APPEND);        
    };

    var _fireHtmlEvent = function(el, type){
        if(!this.isDOMElement(el)) return;
        var event = self.document.createEvent("Event"), dispatch;
        event.initEvent(type, true, true);
        dispatch = el.dispatchEvent || el.fireEvent;
        if(Class.isFunction(dispatch)){
            dispatch.call(el, event);
        }
    };

    /**
     * Check if the child node is the descendence node of this element.<p>
     *
     * @param el, the element that is being compared
     * @param child, the element that is begin compared against
     * @param containSelf, whether contains the scenario of parent == child
     */
    thi$.contains = function(el, child, containSelf){
        if(!el || !child) return false;

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
     * Theory:
     * 
     * When a span is "inline" and its width / height is "auto" for 
     * the text content. It will stretch auto to fit the content.
     * 
     *
     * @param {String} str The text to measure, it must not be encoded.
     * @param {Object} txtStyles Some styles which can impact the string size.
     *        They should be the font-related, such as font-size, font-weight,
     *        font-family, etc.
     * 
     * @param {Boolean} wordwrap Optional boolean value to indicate whether to
     *        compute the wordwrap size.
     * @param {Number} width Optional. The width for wordwrap to compute.
     *
     */
	thi$.getStringSize = function(str, txtStyles, wordwrap, width){
        if(!Class.isString(str) || str.length == 0){
            return {width: 0, height: 0};
        }

		var System = J$VM.System, textNode, s, sp,
		styles = {
			position: "absolute",
			left: "-10000px",
			top: "-10000px",

			display: "inline",
            width: "auto",
            height: "auto",

            padding: "0px",
            border: "0px none"
		};

        if(wordwrap === true && width > 0){
            styles["white-space"] = "nomal";
            styles["width"] = width + "px";
        }else{
            wordwrap = false;
            styles["white-space"] = "nowrap";
        }

        txtStyles = txtStyles || {};
        for(sp in txtStyles){
            if(!styles[sp] 
               && !sp.match(/[wW]idth|margin|border|padding/)){
                styles[sp] = txtStyles[sp];
            }
        }

		textNode = this.createElement("SPAN");
		textNode.style.cssText = this.toCssText(styles);
		textNode.innerHTML = js.lang.String.encodeHtml(str, undefined, wordwrap);

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
     * @param {DOM} ele A DOM node with text as display content, include
     *        "SPAN", "INPUT", "TEXTAREA".
     * 
     * @param {Boolean} wordwrap Optional boolean value to indicate whether to
     *        compute the wordwrap size.
     * @param {Number} width Optional. The width for wordwrap to compute.
     * 
     * @link#getStringSize
     */
    thi$.getTextSize = function(ele, wordwrap, width){
		var tagName = ele ? ele.tagName : null, str, styles;
		switch(tagName){
		case "DIV": // Such as: <div>xxxx</div>
		case "SPAN":
			str = ele.textContent ? ele.textContent : ele.innerText;
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
		return this.getStringSize(str, styles, wordwrap, width);
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

    //////////////////  J$VM StyleSheet  //////////////////////////////////
    
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


    thi$.setClassName = function(ele, className, prefix){
        if(!ele) return;
        
        if(!Class.isString(prefix)){
            prefix = "jsvm--";
        }
        
        switch(Class.typeOf(ele)){
            case "htmlinputelement":
            case "htmltextareaelement":
            prefix = prefix ? prefix+"txt" : "";
            break;
            default:
            prefix = prefix ? prefix+"com" : "";
            break;
        }

        ele.className = [prefix, className].join(" ");
    };

    thi$.getClassName = function(ele){
        var clazz, name;
        if(!Class.isHtmlElement(ele)){
            clazz = ele.uuid = (ele.uuid || js.lang.Math.uuid());
        }else{
            clazz = this.splitClassName(ele.className).join(" ");
        }
        return clazz;
    };
    
    var STATEREG = /(\w+)(_\d{1,4})$/;

    thi$.splitClassName = function(className){
        className.trim();

        var names = className.split(" "), map = {}, ret=[], name;
        while(names.length > 0){
            name = names.shift();
            if(STATEREG.test(name)){
                name = RegExp.$1;
            }
            if(!map[name]){
                ret.push(name);
            }
        }
        return ret;
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
        var mbp = bounds.MBP, minX, minY, maxX, maxY;
        minX = bounds.absX + mbp.borderLeftWidth;
        maxX = minX + bounds.clientWidth;
        minY = bounds.absY + mbp.borderTopWidth;
        maxY = minY + bounds.clientHeight;
        return x > minX && x < maxX && y > minY && y < maxY;
    };

    thi$.relative = function(x, y, bounds){
        var mbp = bounds.MBP;
        return {
            x: x - bounds.absX - mbp.borderLeftWidth,
            y: y - bounds.absY - mbp.borderTopWidth
        };
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
