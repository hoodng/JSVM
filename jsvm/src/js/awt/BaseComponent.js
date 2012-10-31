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
 * Author: Hu dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.awt");

$import("js.util.EventTarget");
$import("js.awt.Cover");

/**
 * A BaseComponent is an object having a graphical representation
 * that can be displayed in the browser and that can interact with the
 * user.<p>
 * 
 *@param def : {
 *     className : style class
 *     id : string to identify a component
 *     css: css text
 * 
 *     x : position left,
 *     y : position top,
 * 
 *     width : outer width of the componet,
 *     height: outer height of the component,
 * 
 * },
 * The <em>def</em> is the definition of this component.
 * 
 * @param Runtime, @see <code>js.lang.Runtime</code>
 * 
 * @param view,  a document element  
 * When new a <em>component</em> will create a DIV element as the <em>view</em>
 * of this component. But you also can use an existing view to instead of the
 * view.

 */
js.awt.BaseComponent = function(def, Runtime, view){

    var CLASS = js.awt.BaseComponent, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

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

        return{x: M.x, y: M.y };
    };
    
    /**
     * Set position of the component.<p>
     * 
     * @param x, the position left
     * @param y, the position top
     */
    thi$.setPosition = function(x, y, fire){
        var M = this.def, bounds = this.getBounds();

        DOM.setPosition(this.view, x, y, bounds);
        M.x = bounds.x;
        M.y = bounds.y;
        
        this._adjust("move");
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
        
        this._adjust("zorder");

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
    thi$.setWidth = function(w, fire){
        this.setSize(w, undefined, fire);
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
    thi$.setHeight = function(h, fire){
        this.setSize(undefined, h, fire);
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
     * Set outer size of the component.<p>
     * 
     * @param w, width
     * @param h, height
     */
    thi$.setSize = function(w, h, fire){
        var M = this.def, bounds = this.getBounds();

        DOM.setSize(this.view, w, h, bounds);
        M.width = bounds.width;
        M.height= bounds.height;

        this._adjust("resize");
    };
    
    thi$.getBounds = function(){
        var el = this.view, bounds = DOM.getBounds(el), pounds;
        position = this.getStyle("position");
        if(position){
        	position = position.toLowerCase();
        }
        
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
        
        this._adjust("resize");
    };

    thi$.invalidateBounds = function(){
        this.view.bounds = null;
    };
    
    thi$.getPreferredSize = function(nocache){
        var d;
        if(nocache === true){
            d = this.getBounds();
            return {width: d.width, height: d.height};
        }else{
            if(!this.def.prefSize){
                d = this.getBounds();
                this.setPreferredSize(d.width, d.height);
            }
            return this.def.prefSize;
        }
    };
    
    thi$.setPreferredSize = function(w, h){
        this.def.prefSize = {
            width: w > 0 ? w : 0, 
            height:h > 0 ? h : 0
        };
    };
    
    thi$.getMinimumSize = function(nocache){
        var d;
        if(nocache === true){
            d = this.getBounds();
            this.setMinimumSize(d.MBP.BPW, d.MBP.BPH);
        }else{
            d = this.def.miniSize;
            if(!d){
                d = this.getBounds();
                this.setMinimumSize(d.MBP.BPW, d.MBP.BPH);
            }
        }

        return this.def.miniSize;
    };
    
    thi$.setMinimumSize = function(w, h){
        this.def.miniSize = {
            width: w, height:h
        };
    };
    
    thi$.getMaximumSize = function(nocache){
        var d;
        if(nocache === true){
            this.setMaximumSize(Number.MAX_VALUE, Number.MAX_VALUE);
        }else{
            d = this.def.maxiSize;
            if(!d){
                this.setMaximumSize(Number.MAX_VALUE, Number.MAX_VALUE);
            }
        }

        return this.def.maxiSize;
    };
    
    thi$.setMaximumSize = function(w, h){
        this.def.maxiSize = {
            width: w, height:h
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
     * Returns the alignment along the x axis.  This specifies how
     * the component would like to be aligned relative to other
     * components.  The value should be a number between 0 and 1
     * where 0 represents alignment along the origin, 1 is aligned
     * the furthest away from the origin, 0.5 is centered, etc.
     */
    thi$.getAlignmentX = function(){
        return this.def.align_x || 0.0;
    };
    
    /**
     * Returns the alignment along the y axis.  This specifies how
     * the component would like to be aligned relative to other
     * components.  The value should be a number between 0 and 1
     * where 0 represents alignment along the origin, 1 is aligned
     * the furthest away from the origin, 0.5 is centered, etc.
     */
    thi$.getAlignmentY = function(){
        return this.def.align_y || 0.0;
    };
    
    /**
     * Return the computed style with the specified style name
     */
    thi$.getStyle = function(sp){
        sp = DOM.camelName(sp);
        return DOM.currentStyles(this.view)[sp];
    };
    
    /**
     * Return the computed styles set with the specified style names array.<p>
     * 
     * @return an object with key are style name and value are style value. 
     */
    thi$.getStyles = function(sps){
        var currents = DOM.currentStyles(this.view), 
        styles = {}, i, len, sp;

        for(i=0, len=sps.length; i<len; i++){
            sp = DOM.camelName(sps[i]);
            styles[sp] = currents[sp];
        }
        
        return styles;
    };

    /**
     * Apply a style set to the component.<p>
     * 
     * @param styles, an object with key are style name and value are style value. 
     */
    thi$.applyStyles = function(styles){
        var el = this.view, 
        w = parseFloat(styles.width), 
        h = parseFloat(styles.height);
        
        delete styles.width;
        delete styles.height;

        sizeChanged = function(value, sp){
            return sp.match(/[wW]idth|padding/) != undefined;
        }.$some(this, styles);

        DOM.applyStyles(el, styles);
        if(sizeChanged){
            this.invalidateBounds();
        }
        
        if(!isNaN(w) || !isNaN(h)){
            this.setSize(w, h);
        }
        
        return sizeChanged ? this.repaint() : false;

    };

    /**
     * Sets style.display = none/blcok
     */
    thi$.display = function(show){
        if(show === false){
            this.view.style.display = "none";
            this._adjust("display", "none");
        }else{
            this.view.style.display = "block";
            this._adjust("display", "block");
        }
    };

    /**
     * Gets the attribute with specified name
     * 
     * @param attr, attribute name
     */    
    thi$.getAttribute = function(attr){
        return DOM.getAttribute(this.view, attr);
    };
    
    /**
     * Sets the attribute with specified name and value
     * 
     * @param attr, attribute name
     */    
    thi$.setAttribute = function(attr, value){
        DOM.setAttribute(this.view, attr, value);
    };
    
    /**
     * Removes the attribute with specified name
     * 
     * @param attr, attribute name
     */    
    thi$.removeAttribute = function(attr){
        DOM.removeAttribute(this.view, attr);
    };

    thi$.setToolTipText = function(s){
        this.def.tip = s;
        this.setAttribute("title", s);
    };
    
    thi$.delToolTipText = function(){
        this.def.tip = undefined;
        this.removeAttribute("title");
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
        this._adjust("remove");
    };
    
    /**
     * Append the view of this component to the specified parent node.
     * 
     * @see removeFrom(parentNode)
     */
    thi$.appendTo = function(parentNode){
        DOM.appendTo(this.view, parentNode);
        if(this.repaint()){
            this.doLayout(true);
        }
    };
    
    /**
     * Insert the view of this component before the specified refNode
     * 
     * @param refNode
     */
    thi$.insertBefore = function(refNode, parentNode){
        DOM.insertBefore(this.view, refNode, parentNode);
        if(this.repaint()){
            this.doLayout(true);
        }
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
     * Map a absolute XY to this component
     * 
     * @param point: {x, y}
     * @return {x, y}
     */
    thi$.relative = function(point){
        var bounds = this.getBounds();
        return {
            x: point.x - bounds.absX - bounds.MBP.borderLeftWidth,
            y: point.y - bounds.absY - bounds.MBP.borderTopWidth
        };
    };

    /**
     * When this component was add to DOM tree, then invokes
     * this method. 
     * 
     * @param force true/false
     * 
     * @return Must return true if did repaint.
     * 
     * Notes: Sub class should override this method
     */
    thi$.repaint = function(){
        var M = this.def, U = this._local, el = this.view, 
        bounds, ret = false;

        if(this.isDOMElement()){
            if(this._geometric) {
                this._geometric();
            }

            bounds = this.getBounds();

            if(M.x != bounds.x || M.y != bounds.y){
                DOM.setPosition(el, M.x, M.y, bounds);
            }

            if(M.width != bounds.width || M.height != bounds.height){
                DOM.setSize(el, M.width, M.height, bounds);
            }

            el.style.zIndex = M.z;

            ret = true;
        }
        
        return ret;
    };
    
    var _geometric = function(){
        var M = this.def, U = this._local, bounds = this.getBounds();
        
        if(!Class.isNumber(M.x)){
            M.x = bounds.x;
        }
        U.userX = M.x; 

        if(!Class.isNumber(M.y)){
            M.y = bounds.y;
        }
        U.userY = M.y;

        if(!Class.isNumber(M.width)){
            M.width = bounds.width;
            if(!bounds.BBM){
                M.width -= bounds.MBP.BPW;
            }
        }
        U.userW = M.width;

        if(!Class.isNumber(M.height)){
            M.height= bounds.height;
            if(!bounds.BBM){
                M.height -= bounds.MBP.BPH;
            }
        }
        U.userH = M.height;

        if(!Class.isNumber(M.z)){
            var z = parseInt(this.getStyle("z-index"));
            M.z = Class.isNumber(z) ? z : 0;
        }
    };

    /**
     * When parent size changed will ask every children component
     * doLayout.
     * 
     * @return Must return true if did layout
     * 
     * Notes: Sub class should override this method
     */
    thi$.doLayout = function(force){
        if(!this.needLayout(force)) return false;

        this._local.didLayout = true;
        
        return true;
    };

    /**
     * Test whether this component need do layout
     * 
     */
    thi$.needLayout = function(force){
        return force === true ? true :
            (!this.isRigidWidth() || 
             !this.isRigidHeight() || 
             !this._local.didLayout);
    };
    
    /**
     * Force this compoents need do layout
     * 
     */
    thi$.forceLayout = function(){
        this._local.didLayout = false;
    };

    thi$.activateComponent = function(){
        
    };
    
    thi$._adjust = function(cmd, show){
        switch(cmd){
        case "move":
        case "resize":
            this.adjustCover(this.getBounds());
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
    };

    thi$.appendStyleClass = function(className){
        if(Class.isString(className)){
            var names = this._local.styles;
            if(!names){
                names = [this.className];
            }
            names = names.concat(className.split(" "));
            this._local.styles = names;

            this.view.className = names.join(" ");
        }
    };

    thi$.removeStyleClass = function(className){
        var names = this._local.styles, e;

        if(Class.isArray(names)){
            for(var i=0, len=names.length; i<len; i++){
                e = names[i];
                if(e == className){
                    names.splice(i, 1);
                    break;
                }
            }
            
            this.view.className = names.join(" ");
        }
    };

    thi$.hasStyleClass = function(className){
        var names = this._local.styles, e, ret = false;
        if(Class.isArray(names)){
            for(var i=0, len=names.length; i<len; i++){
                e = names[i];
                if(e == className){
                    ret = true;
                    break;
                }
            }
        }
        return ret;
    };

    thi$.clearStyleClass = function(apply){
        var names = this._local.styles = [this.className];
        if(apply === true){
            this.view.className = names.join(" ");            
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
     * Clone view from the view of this component
     */
    thi$.cloneView = function(){
        var ele = this.view, view = ele.cloneNode(true);
        //DOM.removeFun(view);
        view.bounds = {BBM:ele.bounds.BBM, MBP:ele.bounds.MBP};
        view.cloned = "true";
        return view;
    };

    /**
     * Return componet's Margin-Border-Padding information
     * 
     * @return:{
     *     marginLeft,
     *     marginTop,
     *     marginRight,
     *     marginBottom,
     *    
     *     borderLeftWidth,
     *     borderTopWidth,
     *     borderRightWidth,
     *     borderBottomWidth,
     * 
     *     paddingLeft,
     *     paddingTop,
     *     paddingRight,
     *     paddingBottom,
     * 
     *     BW: borderLeftWidth + borderRightWidth
     *     BH: borderTopWidth + borderBottomWidth
     * 
     *     PW: paddingLeft + paddingRight
     *     PH: paddingTop + paddingBottom
     * 
     *     BPW: BW + PW
     *     BPH: BH + PH
     *     
     * }
     */
    thi$.MBP = function(){
        return this.getGeometric(this.className).MBP;
    };
    
    thi$.getGeometric = function(className){
        className  = className || this.className;
        return CLASS.G[className] || this._local.G;
    };

    /**
     * @param NUCG Not Use Cached Geometric
     */
    var _preparegeom = function(NUCG){
        NUCG = NUCG || false;
        CLASS.G = CLASS.G || {};
        
        var className = this.className, G = NUCG ? null : CLASS.G[className], 
        M = this.def, ele, bounds, styleW, styleH, 
        buf = new js.lang.StringBuffer();
        if(!G){
            G = {};
            ele = this.view.cloneNode(false);
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
            G.bounds = DOM.getBounds(ele);
            DOM.remove(ele, true);
            if(!NUCG){
                CLASS.G[className] = G;
            }else{
                this._local.G = G;
            }
        }

        bounds = this.view.bounds = {BBM: G.bounds.BBM, MBP:G.bounds.MBP};
        
        if(Class.isNumber(M.x)){
            buf.append("left:").append(M.x).append("px;");
        }
        if(Class.isNumber(M.y)){
            buf.append("top:").append(M.y).append("px;");
        }
        if(Class.isNumber(M.width)){
            styleW = M.width;
            if(!bounds.BBM){
                styleW -= bounds.MBP.BPW;
            }
            buf.append("width:").append(styleW).append("px;");
        }
        if(Class.isNumber(M.height)){
            styleH = M.height;
            if(!bounds.BBM){
                styleH -= bounds.MBP.BPH;
            }
            buf.append("height:").append(styleH).append("px;");
        }

        buf.append(this.view.style.cssText);

        this.view.style.cssText = buf.toString();        

    };

    thi$.destroy = function(){
        if(this._coverView){
            this.removeCover();
        }
        delete this._local;
        
        DOM.remove(this.view, true);
        delete this.view;

        arguments.callee.__super__.apply(this, arguments);    
        
    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime, view){
        if(def == undefined) return;
        
        this.def = def;
        this._local = this._local || {};
        this._local.Runtime = Runtime;
        this.uuid(def.uuid);

        this.id = def.id || this.uuid();

        def.classType = def.classType || "js.awt.BaseComponent";
        
        if(view){
            this.view = view;
            def.className = view.clazz || def.className;
        }else{
            this.view = view = DOM.createElement(def.viewType || "DIV");
            def.className = def.className || "jsvm_comp";
            view.clazz = view.className = def.className; 
        }

        view.uuid = this.uuid();

        this.className = def.className;
        if(def.css) view.style.cssText = view.style.cssText + def.css;
        if(view.tagName != "BODY" && view.cloned != "true"){
            _preparegeom.call(this, def.NUCG);    
        }

        arguments.callee.__super__.apply(this, arguments);

        this._geometric = function(){
            var o = _geometric.call(this);
            delete this._geometric;
            return o;
        };
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.util.EventTarget).$implements(js.awt.Cover);
