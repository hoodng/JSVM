/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */
$package("js.awt");

$import("js.util.Observer");
$import("js.awt.Element");
$import("js.awt.Editable");
$import("js.awt.PopupLayer");

/**
 * A base Component is an object having a graphical representation
 * that can be displayed in the browser and that can interact with the
 * user.
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
 *     miniSize: {width, height},
 *     maxiSize: {width, height},
 *     prefSize: {width, height},
 *     rigid_w: true|false
 *     rigid_h: true|false  
 *     align_x: 0.0|0.5|1.0
 *     align_y: 0.0|0.5|1.0
 *     
 *     state : number, see also <code>js.util.State</code>
 *     
 *     mover : {delay, bound ...}, see also <code>js.awt.Movable</code>
 *     movable : true/false,
 *     
 *     resizer : 8 bits number to define 8 directions resize, see also 
 *               <code>js.awt.Resizable</code>,
 *     resizable : true/false
 * 
 *     alwaysOnTop: true/false
 * 
 * },
 * The <code>def</code> is the definition of this component.
 * 
 * @param Runtime, @see <code>js.lang.Runtime</code>
 * 
 * @param view,  a document element  
 * When new a <code>component</code> will create a DIV element as the 
 * <code>view</code> of this component. But you also can use an existing 
 * view to instead of the view.
 */
js.awt.Component = function(def, Runtime, view){

    var CLASS = js.awt.Component, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event,
        DOM = J$VM.DOM, System = J$VM.System, MQ = J$VM.MQ;

    /**
     * Set position of the component.<p>
     * 
     * @param x, the position left
     * @param y, the position top
     * @param fire       1: raise <em>moved</em>  event
     *                   2: doLayout
     *                   4: set this position as original position
     */
    thi$.setPosition = function(x, y, fire){
        var M = this.def, U = this._local;

        arguments.callee.__super__.apply(this, arguments);

        fire = !Class.isNumber(fire) ? 0 : fire;

        if((fire & 0x04) != 0){
            U.userX = M.x;
            U.userY = M.y;
        }

        if((fire & 0x01) != 0){
            this.onMoved(fire);            
        }

    }.$override(this.setPosition);
    
    /**
     * Set css z-index of the component.<p>
     * 
     * @param z
     * @param fire
     */
    thi$.setZ = function(z, fire){
        var M = this.def, U = this._local;
        
        arguments.callee.__super__.apply(this, arguments);

        fire = !Class.isNumber(fire) ? 0 : fire;

        if((fire & 0x04) != 0){
            U.userZ = M.z;
        }

        if((fire & 0x01) != 0){
            this.onZOrderChanged(fire);
        }
    }.$override(this.setZ);

    /**
     * Set outer size of the component.<p>
     * 
     * @param w, width
     * @param h, height
     * @param fire       1: raise <em>resized</em>  event
     *                   2: doLayout
     *                   4: set this size as original size
     */
    thi$.setSize = function(w, h, fire){
        var M = this.def, U = this._local;

        arguments.callee.__super__.apply(this, arguments);

        fire = !Class.isNumber(fire) ? 0 : fire;

        if((fire & 0x04) != 0){
            U.userW = M.width;
            U.userH = M.height;
        }

        if((fire & 0x01) != 0){
            this.onResized(fire);
        }
        
    }.$override(this.setSize);
    

    thi$.setBounds = function(x, y, w, h, fire){
        var M = this.def, U = this._local;

        arguments.callee.__super__.apply(this, arguments);

        fire = Class.isNumber(fire) ? fire : 0;

        if((fire & 0x04) != 0){
            U.userX = M.x;
            U.userY = M.y;

            U.userW = M.width;
            U.userH = M.height;
        }

        if((fire & 0x01) != 0){
            this.onGeomChanged(fire);
        }

    }.$override(this.setBounds);
    
    /**
     * Tests whether this component has scroll bar
     * 
     * @return {
     *   hscroll: true/false, 
     *   vscroll: true/false
     * }
     */
    thi$.hasScrollbar = function(){
        return DOM.hasScrollbar(this.view);
    };

    /**
     * Activate this component
     * 
     */    
    thi$.activateComponent = function(){
        var container = this.getContainer();
        if(container){
            container.activateComponent(this);
        }
    };

    /**
     * Open a dialog with specified dialog class and dialog object
     * 
     * @param className, the definition of dialog
     * @param rect, x, y, width and height
     * @param dialogObj, the DialogObj instance 
     * @param handler
     */
    thi$.openDialog = function(className, rect, dialogObj, handler){
        var dialog = J$VM.Factory.createComponent(
            className, rect, this.Runtime());

        dialog.setPeerComponent(this);        
        dialog.setDialogObject(dialogObj, handler);
       
        //@link js.lang.Object#setContextID
        if(!dialogObj.def["__contextid__"]){
            dialogObj.setContextID(this.uuid());
        }

        dialog.show();
        return dialog;
    };
    
    /**
     * Open confirm dialog
     * 
     * @param className, the definition of dialog
     * @param rect, x, y, width and height
     * @param def, ,an object like:{
     *     className: "",
     *     model: {
     *         msgSubject: "",
     *         msgContent: ""
     *     }
     * } 
     * @param handler
     */
    thi$.openConfirm = function(className, rect, def, handler){
        def = def || {};
        def.className = def.className || "msgbox";
        def.stateless = true;
        def.model = def.model || {};
        def.model.msgType = def.model.msgType || "confirm";
        return this.openDialog(
            className,
            rect, 
            new js.awt.MessageBox(def, this.Runtime()),
            handler);
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

    var SIZEP = /[wW]idth|margin|border|padding/;
    /**
     * Apply a style set to the component.<p>
     * 
     * @param styles, an object with key are style name and value 
     * are style value. 
     */
    thi$.applyStyles = function(styles){
        var el = this.view, 
            w = parseFloat(styles.width), 
            h = parseFloat(styles.height);
        
        delete styles.width;
        delete styles.height;

        var sizeChanged = function(value, sp){
            return sp.match(SIZEP) != undefined;
        }.$some(this, styles);

        DOM.applyStyles(el, styles);

        if(sizeChanged){
            this.invalidateBounds();
        }
        
        if(!isNaN(w) || !isNaN(h)){
            this.setSize(w, h);
        }

        if(sizeChanged && this.repaint()){
            this.onGeomChanged(0x02);
            return true;
        }        
        
        return false;
    };

    var DISPLAYS = ["none", "block"];
    /**
     * Sets style.display = none/blcok
     */
    thi$.display = function(show){
        var disp;
        show = show ? 1 : 0;
        disp = DISPLAYS[show];
        this.view.style.display = disp;
        this.adjustLayers("display", disp);
    }.$override(this.display);

    /**
     * Append the view of this component to the specified parent node.
     * 
     * @see removeFrom(parentNode)
     */
    thi$.appendTo = function(parentNode){
        arguments.callee.__super__.apply(this,arguments);
        if(this.repaint()){
            this.doLayout(true);
        }
    }.$override(this.appendTo);
    
    /**
     * Insert the view of this component before the specified refNode
     * 
     * @param refNode
     */
    thi$.insertBefore = function(refNode, parentNode){
        arguments.callee.__super__.apply(this,arguments);
        if(this.repaint()){
            this.doLayout(true);
        }
    }.$override(this.insertBefore);

    /**
     * Insert the view of this component after the specified refNode
     * 
     * @see insertBefore(refNode, parentNode)
     */
    thi$.insertAfter = function(refNode){
        this.insertBefore(refNode.nextSibling, refNode.parentNode);
    }.$override(this.insertAfter);

    /**
     * Test whether contains a child node in this component
     * 
     * @param child, a HTMLElement
     * @param containSelf, a boolean indicates whether includes the scenario 
     * of the parent === child.
     */
    thi$.contains = function(child, containSelf){
        return DOM.contains(this.view, child, containSelf);
    }.$override(this.contains);

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
        var M = this.def, U = this._local, ele, bounds;
        if(!this.isDOMElement()) return false;
        
        if(this._geometric) {
            this._geometric();
        }
        
        ele = this.view;
        bounds = this.getBounds();

        if(M.x != bounds.x || M.y != bounds.y){
            DOM.setPosition(ele, M.x, M.y, bounds);
        }

        if(M.width != bounds.width || M.height != bounds.height){
            DOM.setSize(ele, M.width, M.height, bounds);
        }

        ele.style.zIndex = M.z;

        if(M.isfloating){
            this.setFloating(true);
        }

        if(!this.isEnabled()){
            this.showDisableCover(true);
        }

        if(M.outline){
            this.showOutline(true, M.outlineClassName);
        }
        
        if(M.shadow){
            this.showShadow(true, M.shadowClassName);
        }

        this.adjustLayers("resize");
        return true;
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
        var ret = true;
        if(!this.isDOMElement() ||
           (this.getStyle("display") === "none") ||
                    !arguments.callee.__super__.apply(this, arguments)){
            ret = false;
        }
        this.adjustController();
        return ret;
    }.$override(this.doLayout);

    thi$.setController = function(ctrl){
        this.controller = ctrl;
        this.controller.setContainer(this);
    };
    
    thi$.delController = function(){
        var ctrl = this.controller;
        if(ctrl){
            ctrl.removeFrom(this.view);
            delete ctrl.container;
            delete this.controller;
        }
        return ctrl;
    };
    
    thi$.adjustController = function(){
        var ctrl = this.controller, bounds, counds, x, y, w, h;
        if(!ctrl) return;

        ctrl.appendTo(this.view); // Keep controller alwasy on top
        bounds = this.getBounds();
        counds = ctrl.getBounds();
        w = ctrl.isRigidWidth() ? counds.width : bounds.innerWidth;
        h = ctrl.isRigidHeight()? counds.height: bounds.innerHeight;
        x = bounds.MBP.paddingLeft +
            (bounds.innerWidth - w)*ctrl.getAlignmentX();
        y = bounds.MBP.paddingTop  +
            (bounds.innerHeight- h)*ctrl.getAlignmentY();
        ctrl.setBounds(x, y, w, h, 7);
    };


    /**
     * When the position and size of the component has changed, we need
     * to adjust its container's size to handle the scroll bars.
     */
    thi$.autoResizeContainer = function(){
        var container = this.getContainer();
        if(container && (container instanceof js.awt.Container)){
            container.autoResize();
        }
    };

    /**
     * When this component was moved to a new position will 
     * invoke this method,
     * 
     * 
     * Notes: Sub class maybe should override this method
     */
    thi$.onMoved = function(fire){
        this.autoResizeContainer();
    };

    /**
     * When this component was resized will invoke this method.
     * 
     * @param doLayout, true then invoke doLayout of this component
     * 
     * Notes: Sub class maybe should override this method
     */
    thi$.onResized = function(fire){
        if((fire & 0x02) != 0){
            this.doLayout(true);
        }
        this.autoResizeContainer();
    };

    /**
     * When this component ZOrder.
     * 
     * Notes: Sub class maybe should override this method
     */
    thi$.onZOrderChanged = function(fire){

    };
    
    /**
     * When geometric (includes position and size) was changed 
     * of this compoent will invoke this method.
     * 
     * Notes: Sub class maybe should override this method
     */
    thi$.onGeomChanged = function(fire){
        if((fire & 0x02) != 0){
            this.doLayout(true);
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
     * Indicate whether the state can affect the style
     * of current Component.
     */ 
    thi$.isStyleByState = function(){
        return !this.isStateless() && this.def.styleByState;
    };

    thi$.onStateChanged = function(e){
        if(this.isStyleByState()){
            this.view.className = DOM.stateClassName(
                this.def.className || this.className, this.getState());
        }        
        
        if(this.view.parentNode){
            this.showDisableCover(!this.isEnabled());
        }
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
        var G = this.getGeometric(this.className);
        return System.objectCopy(G.bounds.MBP, {});
    };
    
    thi$.getGeometric = function(className){
        className  = className || this.className;
        return CLASS.G[className];
    };

    var _getBounds = function(){
        var cssText = this.def.css, rst = {},
        ele = this.view.cloneNode(false);

        // The clean bounds should be generated only with the css file
        // and style tags. The css fragment in the def shouldn't parse
        // into the cached bounds. Otherwise, it may pollute and influence
        // other object instances.
        if(cssText){
            ele.style.cssText = "";
        }

        // When we append an DOM element to body, if it didn't set any
        // "position" or set the position as "absolute" but no "top" and 
        // "left" that element also be place at the bottom of body other
        // than the (0, 0) position. Then it may extend the body's size 
        // and trigger window's "resize" event.
        ele.style.position = "absolute";
        ele.style.top = "-10000px";
        ele.style.left = "-10000px";

        ele.style.whiteSpace = "nowrap";
        ele.style.visibility = "hidden";

        DOM.appendTo(ele, document.body);
        rst.bounds = DOM.getBounds(ele);

        if(cssText){
            ele.style.cssText += cssText;

            ele.bounds = null;
            rst.vbounds = DOM.getBounds(ele);
        }else{
            rst.vbounds = rst.bounds;
        }

        DOM.remove(ele, true);
        
        return rst;
    };

    var _preparegeom = function(){
        CLASS.G = CLASS.G || {};

        var className = this.className, G = CLASS.G[className], 
        M = this.def, bounds, styleW, styleH, rst,
        buf = new js.lang.StringBuffer();
        if(!G){
            G = {};
            rst = _getBounds.call(this, M.css);
            G.bounds = rst.bounds;
            CLASS.G[className] = G;
            
            bounds = rst.vbounds;
        }else{
            if(!M.css){ // Use the cached bounds directly
                bounds = G.bounds;
            }else{ // Get bounds with the definition's css text
                rst = _getBounds.call(this);
                bounds = rst.vbounds;
            }
        }

        // TODO: Cache the initial bounds
        this._local.vbounds = System.objectCopy(bounds, {});

        // Copy the MBP to avoid some object's change pollute and 
        // influence other object instance with the same className. 
        // With copying, the old "NUCG" property should be discarded.
        bounds = this.view.bounds = {
            BBM: bounds.BBM, 
            MBP: System.objectCopy(bounds.MBP, {})
        };

        // Hande the x, y, width, height of definition
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

    thi$.invalidateBounds = function(){
        this.view.bounds = null;
        
        // If the preferred size is not from the definition, it will be calcualted
        // with bounds. And when the bounds is invalidating, the old calculated 
        // preferred size should be invalidated, too.
        if(!this.isPreferredSizeSet){
            this.def.prefSize = null;
        }
    };
    
    /**
     * When some propery of component was changed, it may cause the 
     * layout of parent component change, So we must find the parent 
     * component which take charge of the change and redo layout.
     */
    thi$.invalidParentLayout = function() {
        var target = this.getContainer();
        while(target && !target.handleLayoutInvalid) {
            if (target.getContainer && target.getContainer()) {
                target = target.getContainer();
            } else {
                break;
            }
        }
        if (target && target.handleLayoutInvalid) {
            target.handleLayoutInvalid();
        }
    };
    
    thi$.destroy = function(){
        if(this.destroied) return;

        var obj = this.controller;
        if(obj){
            obj.destroy();
            delete this.controller;
        }

        obj = this.getContainer();
        if(obj && obj instanceof js.awt.Container){
            obj.removeComponent(this);
        }
        delete this.container;
        delete this.peer;
        
        DOM.remove(this.view, true);            
        delete this.view;
        
        arguments.callee.__super__.apply(this, arguments);    
    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime, view){
        if(!Class.isObject(def)) return;
        
        def.classType = def.classType || "js.awt.Component";

        arguments.callee.__super__.apply(this, arguments);

        var hasView = Class.isHtmlElement(view), clazz;
        if(!hasView){
            this.view = view = DOM.createElement(def.viewType || "DIV");
            view.id = this.id;
            if(def.css){
                view.style.cssText = view.style.cssText + def.css;
            }
            def.className = def.className || "jsvm__element";
        }else{
            this.view = view;
            def.className = view.clazz || view.className;
        }

        this.className = DOM.extractDOMClassName(def.className);
        if(this.isStyleByState()){
            clazz = DOM.stateClassName(def.className, this.getState());
        }else{
            clazz = this.className;
        }
        view.clazz = def.className;
        DOM.setClassName(view, clazz, def.classPrefix);
        view = this.view;
        view.uuid = this.uuid();
        
        /*
        if(view.tagName != "BODY" && view.tagName != "CANVAS"
           && view.cloned != "true"){
            _preparegeom.call(this);    
        }*/

        this.setTipText(def.tip);

        this._geometric = function(){
            var o = _geometric.call(this);
            delete this._geometric;
            return o;
        };
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Element).$implements(
    js.util.Observer, js.awt.Editable, js.awt.PopupLayer);


