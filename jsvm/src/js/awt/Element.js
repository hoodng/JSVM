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

$import("js.util.EventTarget");
$import("js.awt.State");
$import("js.awt.Shadow");
$import("js.awt.Cover");
$import("js.awt.Movable");
$import("js.awt.Resizable");
$import("js.awt.Outline");
$import("js.awt.ToolTip");

/**
 * Define general element
 */
js.awt.Element = function(def, Runtime){

    var CLASS = js.awt.Element, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, 
        DOM = J$VM.DOM, System = J$VM.System, MQ = J$VM.MQ, 
        Z4 = [0,0,0,0];
    
    /**
     * Return the position left of the component.<p>
     * This value also is css left value.
     */
    thi$.getX = function(){
        var r = this.def.x;
        return Class.isNumber(r) ? r : 0;
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
        var r = this.def.y;
        return Class.isNumber(r) ? r : 0;
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
        return {
            x: this.getX(), y: this.getY()
        };
    };
    
    /**
     * Set position of the component.<p>
     * 
     * @param x, the position left
     * @param y, the position top
     */
    thi$.setPosition = function(x, y, fire){
        var M = this.def, ele = this.view, bounds;
        if(ele){
            bounds = this.getBounds();
            DOM.setPosition(ele, x, y, bounds);
            M.x = bounds.x;
            M.y = bounds.y;
        }else{
            M.x = Class.isNumber(x) ? x : this.getX();
            M.y = Class.isNumber(y) ? y : this.getY();
        }
        
        this.adjustLayers("move");
    };


    /**
     * Return z-index of the component.<p>
     * It also is the css zIndex value.
     */
    thi$.getZ = function(){
        var r = this.def.z;
        return Class.isNumber(r) ? r : 0;
    };
    
    /**
     * Set css z-index of the component.<p>
     * 
     * @param z
     */
    thi$.setZ = function(z, fire){
        var M = this.def, ele = this.view;
        M.z = Class.isNumber(z) ? z : this.getZ();
        if(ele){
            ele.style.zIndex = M.z;
        }
        
        this.adjustLayers("zorder");        
    };
    
    /**
     * Return the outer (outer border) width of the component.<p>
     * This value maybe large then css value
     */
    thi$.getWidth = function(){
        var r = this.def.width;
        return Class.isNumber(r) ? r : 0;
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
        var r = this.def.height;
        return Class.isNumber(r) ? r : 0;
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
        return {
            width: this.getWidth(), height: this.getHeight()
        };
    };
    
    /**
     * Set outer size of the component.<p>
     * 
     * @param w, width
     * @param h, height
     */
    thi$.setSize = function(w, h, fire){
        var M = this.def, ele = this.veiw, bounds;

        if(ele){
            bounds = this.getBounds();
            DOM.setSize(ele, w, h, bounds);
            M.width = bounds.width;
            M.height= bounds.height;
        }else{
            M.width = Class.isNumber(w) ? w : this.getWidth();
            M.height= Class.isNumber(h) ? h : this.getHeight();
        }
        
        this.adjustLayers("resize");
    };

    thi$.absXY = function(){
        return {x: 0, y:0};
    };
    
    thi$.getBounds = function(){
        var M = this.def, U = this._local, el = this.view, abs,
            bounds, pounds, position, margin, border, padding;

        if(DOM.isDOMElement(el)){
            bounds = DOM.getBounds(el);
            position = this.getStyle("position");
            position = position ? position.toLowerCase() : undefined;
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

            bounds.clientWidth = el.clientWidth;
            bounds.clientHeight= el.clientHeight;
            
            bounds.scrollWidth = el.scrollWidth;
            bounds.scrollHeight= el.scrollHeight;
            bounds.scrollLeft  = el.scrollLeft;
            bounds.scrollTop   = el.scrollTop;
            
        }else{
            margin = M.margin  || Z4;
            border = M.border  || Z4;
            padding= M.padding || Z4;
            abs = this.absXY();

            bounds = {
                x: this.getX(),
                y: this.getY(),
                width:  this.getWidth(),
                height: this.getHeight(),

                MBP:{
                    marginTop: margin[0],
                    marginRight: margin[1],
                    marginBottom: margin[2],
                    marginLeft: margin[3],

                    borderTopWidth: border[0],
                    borderRightWidth: border[1],
                    borderBottomWidth: border[2],
                    borderLeftWidth: border[3],

                    paddingTop: padding[0],
                    paddingRight: padding[1],
                    paddingBottom: padding[2],
                    paddingLeft: padding[3],

                    BPW: border[3]+padding[3]+padding[1]+border[1],
                    BPH: border[0]+padding[0]+padding[2]+border[2]
                },

                absX : abs.x,
                absY : abs.y
            };
            
            bounds.offsetX = bounds.x;
            bounds.offsetY = bounds.y;

            bounds.clienWidth   = bounds.width - bounds.MBP.BPW;
            bounds.clientHeight = bounds.height- bounds.MBP.BPH;
        }

        bounds.innerWidth = bounds.width - bounds.MBP.BPW;
        bounds.innerHeight= bounds.height- bounds.MBP.BPH;

        if(U){
            bounds.userX = U.userX;
            bounds.userY = U.userY;
            bounds.userW = U.userW;
            bounds.userH = U.userH;
        }
        
        return bounds;
    };

    thi$.setBounds = function(x, y, w, h, fire){
        var M = this.def, ele = this.view, bounds;

        if(ele){
            bounds = this.getBounds();
            DOM.setBounds(ele, x, y, w, h, bounds);
            M.x = bounds.x;
            M.y = bounds.y;
            M.width = bounds.width;
            M.height= bounds.height;
        }else{
            M.x = Class.isNumber(x) ? x : this.getX();
            M.y = Class.isNumber(y) ? y : this.getY();
            M.width = Class.isNumber(w) ? w : this.getWidth();
            M.height= Class.isNumber(h) ? h : this.getHeight();
        }

        this.adjustLayers("resize");        
    };

    thi$.getPreferredSize = function(nocache){
        var d, ret = this.def.prefSize;
        if(nocache === true || !ret){
            d = this.getBounds();
            this.setPreferredSize(d.width, d.height);
            ret = this.def.prefSize;
        }
        return ret;
    };
    
    thi$.setPreferredSize = function(w, h){
        this.def.prefSize = {
            width: w > 0 ? w : 0, 
            height:h > 0 ? h : 0
        };
    };
    
    thi$.getMinimumSize = function(nocache){
        var d, ret = this.def.miniSize;
        if(nocache === true || !ret){
            d = this.getBounds();
            this.setMinimumSize(
                this.isRigidWidth() ? d.width : d.MBP.BPW+1, 
                this.isRigidHeight()? d.height: d.MBP.BPH+1);
            ret = this.def.miniSize;
        }
        return ret;
    };
    
    thi$.setMinimumSize = function(w, h){
        this.def.miniSize = {
            width: w, height:h
        };
    };
    
    thi$.getMaximumSize = function(nocache){
        var d, ret = this.def.maxiSize;
        if(nocache === true || !ret){
            d = this.getBounds();
            this.setMaximumSize(0xFFFF, 0xFFFF);
            ret = this.def.maxiSize;
        }
        return ret;
    };
    
    thi$.setMaximumSize = function(w, h){
        this.def.maxiSize = {
            width: w, height:h
        };
    };

    /**
     * Return the computed style with the specified style name
     */
    thi$.getStyle = function(sp){
        var ret;
        if(this.view){
            sp = DOM.camelName(sp);
            ret = DOM.currentStyles(this.view)[sp];
        }
        return ret;
    };
    
    thi$.defAttr = function(key, val){
        var M = this.getDef();
        if(Class.isValid(val)){
            M[key] = val;            
        }
        return M[key];
    };

    thi$.getDef = function(){
        return this.def;
    };

    thi$.getID = function(ele){
        var id;
        switch(Class.typeOf(ele)){
        case "string":
            id = ele;
            break;
        case "object":
            id = ele.id;
            break;
        default:
            id = this.id;
        }
        return id;
    };

    thi$.getOBJ = function(ele){
        var obj;
        switch(Class.typeOf(ele)){
        case "string":
            obj = this[ele];
            break;
        case "object":
            obj = ele;
            break;
        default:
            obj = this;
        }
        return obj;
    };

    /**
     * Append this element to the specified parent node.
     * 
     * @param parent, the specified parent
     */
    thi$.appendTo = function(parent){
        if(this.view && Class.isHtmlElement(parent)){
            DOM.appendTo(this.view, parent);
        }else if (parent.appendChild){
            parent.appendChild(this);
        } 
    };

    /**
     * Remove this element from the specified parent node.
     * 
     * @param parent, the specified parent
     */
    thi$.removeFrom = function(parent){
        if(this.view && Class.isHtmlElement(parent)){
            DOM.removeFrom(this.view, parent);
        }else if (parent.removeChild){
            parent.removeChild(this);
        }
        
        this.adjustLayers("remove");
    };

    /**
     * Insert this element before the specified node.
     *
     * @param ref, the specified node
     */
    thi$.insertBefore = function(ref, parent){
        if(this.view && (ref || Class.isHtmlElement(parent))){
            DOM.insertBefore(this.view, ref, parent);
        }else if (ref.getContainer()){
            ref.getContainer().insertChildBefore(this, ref);
        } 
    };

    /**
     * Insert this element after the specified node.
     * 
     * @param ref, the specified node
     */
    thi$.insertAfter = function(ref){
        if(this.view && ref){
            this.insertBefore(ref.nextSibling, ref.parentNode);
        }else if (ref.getContainer()){
            ref.getContainer().insertChildAfter(this, ref);
        } 
    };

    /**
     * Test whether contains a child node in this component
     * 
     * @param ele
     * @param containSelf, a boolean indicates whether includes the scenario 
     * of the parent === child.
     */
    thi$.contains = function(ele, containSelf){
        var id = this.getID(ele), obj = this.getOBJ(ele), o = this[id];
        return o === obj || (containSelf ? this === obj : false);
    };

    /**
     * Test if the specified (x, y) is in area of the component 
     */
    thi$.inside = function(x, y){
        return DOM.inside(x, y, this.getBounds());
    };

    /**
     * Map a absolute XY to this component
     * 
     * @param point: {x, y}
     * @return {x, y}
     */
    thi$.relative = function(point){
        return DOM.relative(point.x, point.y, this.getBounds());
    };

    /**
     * Returns whether the component width is rigid or flexible.
     * 
     * @see isRigidHeight
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
        var v = this.def.align_x;
        return Class.isNumber(v) ? v : 0.0;
    };
    
    /**
     * Returns the alignment along the y axis.  This specifies how
     * the component would like to be aligned relative to other
     * components.  The value should be a number between 0 and 1
     * where 0 represents alignment along the origin, 1 is aligned
     * the furthest away from the origin, 0.5 is centered, etc.
     */
    thi$.getAlignmentY = function(){
        var v = this.def.align_y;
        return Class.isNumber(v) ? v : 0.0;
    };

    /**
     * Return whether this component is always on top.
     */
    thi$.isAlwaysOnTop = function(){
        return this.def.alwaysOnTop || false;
    };
    
    /**
     * Set this component to always on top
     * 
     * @param b, boolean value indicate whether is always on top
     */
    thi$.setAlwaysOnTop = function(b){
        b = b || false;
        var ZM = this.getContainer();
        if(ZM) ZM.setCompAlwaysOnTop(this, b);
    };
    
    /**
     * Moves the component up, or forward, one position in the order
     */
    thi$.bringForward = function(){
        var ZM = this.getContainer();
        if(ZM) ZM.bringCompForward(this);
    };
    
    /**
     * Moves the component to the first position in the order
     */
    thi$.bringToFront = function(){
        var ZM = this.getContainer();
        if(ZM) ZM.bringCompToFront(this);        
    };
    
    /**
     * Moves the component down, or back, one position in the order
     */
    thi$.sendBackward = function(){
        var ZM = this.getContainer();
        if(ZM) ZM.sendCompBackward(this);        
    };
    
    /**
     * Moves the component to the last position in the order
     */
    thi$.sendToBack = function(){
        var ZM = this.getContainer();
        if(ZM) ZM.sendCompToBack(this);        
    };

    /**
     * The peer component is the action object of this component. 
     * For example, window and its title, the window is title's 
     * peer component. If there are some buttons in title area,
     * then the window object also are peer component of those 
     * buttons.
     */
    thi$.setPeerComponent = function(peer){
        this.peer = peer;
    };
    
    /**
     * Return peer component of this component.
     * 
     * @see setPeerComponent(peer)
     */
    thi$.getPeerComponent = function(){
        return this.peer;        
    };

    /**
     * Notifies peer component with special message id and 
     * event.
     * 
     * @param msgId, a string identify the event
     * @param event, a js.util.Event object
     */
    thi$.notifyPeer = function(msgId, event, sync){
        var peer = this.getPeerComponent();
        if(peer){
            _notify.call(this, peer, msgId, event, sync);
        }
    };

    /**
     * Sets container of this component
     */
    thi$.setContainer = function(container){
        this.container = container;
    };

    /**
     * Gets container of this component
     */
    thi$.getContainer = function(){
        return this.container;
    };

    /**
     * Notifies container component with special message id and 
     * event.
     * 
     * @param msgId, a string identify the event
     * @param event, a js.util.Event object
     */
    thi$.notifyContainer = function(msgId, event, sync){
        var comp = this.getContainer();
        if(comp){
            _notify.call(this, comp, msgId, event, sync);
        }
    };

    var _notify = function(comp, msgId, event, sync){
        sync = (sync === undefined) ?
            this.isSynchronizedNotify() : (sync || false);

        if(sync){
            MQ.send(msgId, event, [comp.uuid()]);    
        }else{
            MQ.post(msgId, event, [comp.uuid()]);
        }
    };
    
    /**
     * Sets notify peer (container) is synchronized or not
     * 
     * @param b, true/false
     */
    thi$.setSynchronizedNotify = function(b){
        this.def.sync = b || false;
    };

    /**
     * Returns whether current notify mode is synchronized or not
     * 
     * @return true/false
     */
    thi$.isSynchronizedNotify = function(){
        return this.def.sync || false;
    };

    thi$.display = function(show){
        this.setVisible(show||false);
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

    /**
     * Test whether this componet view is a DOM element
     */    
    thi$.isDOMElement = function(){
        return DOM.isDOMElement(this.view);
    };
    
    thi$.doLayout = function(force){
        var U = this._local, ret = true;
        if(!this.needLayout(force)){
            ret = false;
        }else{
            this.adjustLayers("resize");
            ret = U.didLayout = true;
        }
        
        return ret;
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
    
    thi$.adjustLayers = function(cmd, show){
        var bounds, z;
        switch(cmd){
        case "move":
        case "resize":
            bounds = this.getBounds();
            this.adjustShadow(bounds);
            this.adjustCover(bounds);
            this.adjustOutline(bounds);
            break;
        case "zorder":
            z = this.getZ();
            this.setShadowZIndex(z);
            this.setCoverZIndex(z);
            this.setOutlineZIndex(z);
            break;
        case "display":
            this.setShadowDisplay(show);
            this.setCoverDisplay(show);
            this.setOutlineDisplay(show);            
            break;
        case "remove":
            this.removeShadow();
            this.removeCover();
            this.removeOutline();
            break;
        }
    };

    thi$.spotIndex = function(ele, xy, dragObj){
        var bounds, movable, resizable, idxes, idx = -1;

        movable = this.isMovable() && this.isMoverSpot(ele, xy.x, xy.y);

        bounds = this.getBounds();
        idxes = DOM.offsetIndexes(xy.x, xy.y, bounds, movable);
        if(idxes[1] === -1){
            idx = movable ? 8 : -1;
        }else{
            idx = idxes[1];
            if(idxes[0] === 9){
                idx = movable ? 8 : (this.isResizable(idx) ? idx : -1);
            }else{
                idx = this.isResizable(idx) ? idx : (movable ? 8 : -1);
            }
        }
        return idx;
    };

    thi$.getCursor = function(ele){
        return "default";
    };

    thi$.getMovingConstraints = function(){
        return this.def.mover;
    };

    var isScroll = {auto: true, visible: true, scroll: true};

    /**
     * @return {Object} {
     *  container: container element
     *  range:[minX, minY, maxX, maxY]
     * }
     */
    thi$.getMovingContext = function(){
        var autofit = false, thip, bounds, pounds,
            styles, hscroll, vscroll;
        thip = DOM.getComponent(
            DOM.offsetParent(this.view), true, this.Runtime()),
        autofit = thip.isAutoFit ? thip.isAutoFit() : false;

        styles = DOM.currentStyles(thip.view);
        hscroll = isScroll[styles.overflowX];
        vscroll = isScroll[styles.overflowY];

        bounds = this.getBounds();
        pounds = thip.getBounds();
        
        return{
            container: thip,
            range: [
                0 - bounds.width,
                0 - bounds.height,
                hscroll ? 0xFFFF : pounds.innerWidth,
                vscroll ? 0xFFFF : pounds.innerHeight
            ],
            autofit: autofit,
            hscroll: hscroll,
            vscroll: vscroll
        }
    };
    

    thi$.destroy = function(){
        if(this.destroied) return;

        this.removeOutline();
        this.removeCover();
        this.removeShadow();
        this.removeTipLayer();
        
        delete this.peer;
        delete this.container;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$.classType = function(){
        return this.def.classType;
    };

    thi$._init = function(def, Runtime){
        if(def === undefined) return;
        
        this.def = def;
        this.uuid(def.uuid);
        this.id = def.id || this.uuid();
        
        def.classType = def.classType || "js.awt.Element";

        arguments.callee.__super__.apply(this, arguments);

        this.__buf__ = new js.lang.StringBuffer();

        CLASS.count++;

        if(def.movable){
            this.setMovable(def.movable);
        }

        if(def.resizable){
            this.setResizable(def.resizable, def.resizer);
        }

        if(def.useUserDefinedTip){
            this.setUserDefinedTip(true, def.tipDef);
        }
        
        if(def.prefSize){
            this.isPreferredSizeSet = true;
        }
        
        if(def.miniSize){
            this.isMinimumSizeSet = true;
        }
        
        if(def.maxiSize){
            this.isMaximumSizeSet = true;
        }        
                
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.util.EventTarget).$implements(
    js.awt.State, js.awt.Shadow, js.awt.Cover,
    js.awt.Movable, js.awt.MoveObject,
    js.awt.Resizable, js.awt.SizeObject,
    js.awt.Outline, js.awt.ToolTip);

js.awt.Element.count = 0;

