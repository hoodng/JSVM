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
 * 
 *     miniSize: {width, height},
 *     maxiSize: {width, height},
 *     prefSize: {width, height},
 * 
 *     rigid_w: true|false
 *     rigid_h: true|false  
 * 
 *     align_x: 0.0|0.5|1.0
 *     align_y: 0.0|0.5|1.0,
 * 
 *     border: [top, right, bottom, left],
 *     margin: [top, right, bottom, left],
 *     padding:[top, right, bottom, left],
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
        DOM = J$VM.DOM, System = J$VM.System, 
        MQ = J$VM.MQ;

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
        var changed = $super(this);
        if(fire & 0x01){
            this.onMoved(fire);
        }
        return changed;
    }.$override(this.setPosition);
    
    /**
     * Set css z-index of the component.<p>
     * 
     * @param z
     * @param fire
     */
    thi$.setZ = function(z, fire){
        if($super(this) && (fire & 0x01)){
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
        var changed = $super(this);
        if(changed && (fire & 0x01)){
            this.onResized(fire);
        }
        
        return changed;
        
    }.$override(this.setSize);
    

    thi$.setBounds = function(x, y, w, h, fire){
        var changed = $super(this);
        if(changed && (fire & 0x01)){
            this.onGeomChanged(fire);
        }
        
        return changed;
                
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
     * Delegate the container to activate self.
     * 
     * Attention:
     * 
     * Since 13.5, diff the "activateComponent" and "activate" 
     * as two functions. "activateComponent" indicate the current
     * container to activate the specified component in it. And
     * "activate" indicate the current component to delegate its
     * container to help activate the self component.
     */    
    thi$.activate = function(){
        var container = this.getContainer();
        if(container && container.activateComponent){
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
        def.className = def.className || "jmsgbox msgbox $jmsgbox $msgbox";
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
     * Test whether contains a child node in this component
     * 
     * @param child, a HTMLElement
     * @param containSelf, a boolean indicates whether includes the scenario 
     * of the parent === child.
     */
    thi$.contains = function(child, containSelf){
        return DOM.contains(this.view, child, containSelf);
    }.$override(this.contains);

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
    
    thi$.adjustController = function(bounds){
        var ctrl = this.controller, counds, x, y, w, h;
        if(!ctrl) return;

        ctrl.appendTo(this.view); // Keep controller alwasy on top
        bounds = bounds || this.getBounds();
        counds = ctrl.getBounds();
        w = ctrl.isRigidWidth() ? counds.width : bounds.innerWidth;
        h = ctrl.isRigidHeight()? counds.height: bounds.innerHeight;
        x = bounds.MBP.paddingLeft +
            (bounds.innerWidth - w)*ctrl.getAlignmentX();
        y = bounds.MBP.paddingTop  +
            (bounds.innerHeight- h)*ctrl.getAlignmentY();
        ctrl.setBounds(x, y, w, h, 7);
    };
    
    // When the position and size of the component has changed, 
    // the layout dirty status need to notify its container.
    var _onLayoutDirty = function(cmd){
        var container = this.getContainer();
        if(container && Class.isFunction(container.onLayoutDirty)){
            container.onLayoutDirty(this, cmd);
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
        _onLayoutDirty.call(this, "move");
    };

    /**
     * When this component was resized will invoke this method.
     * 
     * @param doLayout, true then invoke doLayout of this component
     * 
     * Notes: Sub class maybe should override this method
     */
    thi$.onResized = function(fire){
        _onLayoutDirty.call(this, "resize");
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
        _onLayoutDirty.call(this, "geomchanged");
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
        return !this.isStateless() && (this.def.styleByState !== false);
    };

    thi$.onStateChanged = function(e){
        var M = this.def, clazz;

        if(this.isStyleByState()){
            clazz = DOM.stateClassName(M.className || this.className,
                                       this.getState());
            DOM.setClassName(this.view, clazz, M.classPrefix);
        }
        
        if(this.isDOMElement()){
            this.showDisableCover(!this.isEnabled(), M.disableClassName);
        }
    };

    /**
     * Clone view from the view of this component
     */
    thi$.cloneView = function(){
        var view = DOM.cloneElement(this.view, true);
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
        return DOM.BMP(this.view);
    };

    thi$.invalidateBounds = function(){
        J$VM.System.out.println('The "invalidateBounds" has been discarded.');
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
        var ret = false;
        if(this.isDOMElement()){
            _repaint.call(this);
            ret = true;
        }
        return ret;
    };
    
    /**
     * When parent size changed will ask every children component
     * doLayout.
     * 
     * @return Must return true if did layout
     * 
     * Notes: Sub class should override this method
     */
    thi$.doLayout = function(force, bounds){
        var ret = false, container;
        if($super(this)){
            this.adjustController(bounds);
            ret = true;
        }
        return ret;
    }.$override(this.doLayout);

    // Window's resize event 
    thi$.onresize = function(e){
        var U = this._local, M = this.def,
            bounds = this.getBounds(true);
        if(U.userW !== bounds.width ||
           U.userH !== bounds.height){
            this.doLayout(true, bounds);
            U.userW = M.width = bounds.width;
            U.userH = M.height= bounds.height;
        }
    };
    
    var _repaint = function(){
        var M = this.def, U = this._local, bounds;

        bounds = this._geometric ?
            this._geometric() : this.getBounds();

        U.userX = bounds.x;
        U.userY = bounds.y;
        U.userZ = bounds.MBP.zIndex;
        U.userW = bounds.width;
        U.userH = bounds.height;
        
        if(M.isfloating){
            this.setFloating(true);
        }

        if(!this.isEnabled()){
            this.showDisableCover(true, M.disableClassName);
        }

        if(M.outline){
            this.showOutline(true, M.outlineClassName);
        }
        
        if(M.shadow){
            this.showShadow(true, M.shadowClassName);
        }

        if(M.useUserDefinedTip){
            this.setUserDefinedTip(true, M.tipDef);
        }

        this.setTipText(M.tip);
    };

    var _geometric = function(isNative){
        var M = this.def, U = this._local, ele = this.view,
            z, bounds;

        bounds = DOM.getBounds(ele, true);
        if(!isNative){
            M.x = !Class.isNumber(M.x) ? bounds.x : M.x;
            M.y = !Class.isNumber(M.y) ? bounds.y : M.y;
            M.z = !Class.isNumber(M.z) ? bounds.MBP.zIndex : M.z;
            M.width = !Class.isNumber(M.width) ? bounds.styleW : M.width;
            M.height= !Class.isNumber(M.height)? bounds.styleH : M.height;
        }else{
            M.x = bounds.x;
            M.y = bounds.y;
            M.z = bounds.MBP.zIndex;
            M.width = bounds.width;
            M.height= bounds.height;
        }

        DOM.setBounds(ele, M.x, M.y, M.width, M.height, bounds);
        DOM.setZ(ele, M.z, bounds);
        U.userX = bounds.userX = M.x = bounds.x;
        U.userY = bounds.userY = M.y = bounds.y;
        U.userZ = bounds.userZ = M.z = bounds.MBP.zIndex;
        U.userW = bounds.userW = M.width = bounds.width;
        U.userH = bounds.userH = M.height= bounds.height;
        
        return bounds;
    };

    thi$.onelementappend = function(e){
        var U = this._local, bounds;
        if(e && e.srcElement !== this.view) return;
        if(this.repaint()){
            this.doLayout(true);
        }
    };


    thi$.onmousedown = function(e){
    };

    thi$.onmouseup = function(e){
    };

    thi$.onmouseover = function(e){
    };

    thi$.onmouseout = function(e){
    };
    
    thi$.destroy = function(){
        if(this.destroied) return;

        var obj = this.controller, view;
        if(obj){
            delete this.controller;
            obj.destroy();
        }

        obj = this.getContainer();
        if(obj && obj instanceof js.awt.Container){
            obj.removeComponent(this);
        }
        this.container = null;
        this.peer = null;
        
        view = this.view;
        this.view = null;
        
        if(view.refCnt == 1){
            DOM.remove(view, true);
        }else{
            view.refCnt -= 1;
        }
        
        $super(this);

    }.$override(this.destroy);

    /**
     * Reset the className for the current component. It is equivalent to
     * set the className by the definition preperty.
     * 
     * Attention:
     * 
     * It is strongly recommended to set the className by the definition,
     * especially for the container. So that the className can be used to
     * generate the new className for its descendant components and DOM.
     * 
     * @param {String} className
     * 
     *        @example
     *        "A"
     *        "A B"
     *        "A B $A"
     * 
     * @param {Boolean} force The optional boolean to indicate whether always
     *        use the given className for the current component view even if
     *        it is the cloned.
     */
    thi$.setClassName = function(className, force){
        var M = this.def, view = this.view, clazz;
        if(!Class.isString(className) || className.length == 0
           || (!force && this.viewSettled && !view.cloned)){
            return;
        }

        view.clazz = M.className = className;
        this.className = DOM.extractDOMClassName(className);

        if(this.isStyleByState()){
            clazz = DOM.stateClassName(M.className, this.getState());
        }else{
            clazz = this.className;
        }

        DOM.setClassName(view, clazz, M.classPrefix);
    };
    
    thi$._init = function(def, Runtime, view){
        if(!Class.isObject(def)) return;
        
        def.classType = def.classType || "js.awt.Component";
        
        $super(this);

        var preView = this.viewSettled = Class.isHtmlElement(view),
            clazz;
        
        if(!preView || (view && view.cloned)){
            this.view = view = (view ||
                                DOM.createElement(def.viewType || "DIV"));
            view.id = this.id;
            view.refCnt = 1;
            
            if(def.css){
                view.style.cssText = view.style.cssText + def.css;
            }
            def.className = def.className || "jsvm__element";
        }else {
            if(!Class.isNumber(view.refCnt)){
                view.refCnt = 1;
            }
            view.refCnt += 1;
            
            this.view = view;
            def.className = view.clazz || view.className;
        }
        this.setClassName(def.className, false);
        
        if(!view.uuid || view.cloned){
            view.uuid = this.uuid();
        }

        if(this.isDOMElement()){
            if(view !== document.body){
                _geometric.call(this, true);
            }
        }else{
            this._geometric = function(){
                this._geometric = null;
                return _geometric.call(this);
            };
        }
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Element).$implements(
    js.util.Observer, js.awt.Editable, js.awt.PopupLayer);

