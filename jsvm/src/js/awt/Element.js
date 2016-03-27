/*global  */
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
        DOM = J$VM.DOM, System = J$VM.System, MQ = J$VM.MQ;
    
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
        return this.setPosition(x, null, fire);
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
        return this.setPosition(null, y, fire);
    };
    
    /**
     * Return position of the componet<p>
     * 
     * @return an object with below infomation,
     * {x, y}
     */
    thi$.getPosition = function(){
        return {x: this.getX(), y: this.getY()};
    };
    
    /**
     * Set position of the component.<p>
     * 
     * @param x, the position left
     * @param y, the position top
     */
    thi$.setPosition = function(x, y, fire){
        var M = this.def, bounds, changed = false;
        if(this.view){
            bounds = DOM.setPosition(this.view, x, y);
        }else{
            bounds = {x: x, y: y};
        }

        changed = _updateCoords.call(this, M, bounds, fire);
        if(changed){
            this.adjustLayers("coord", bounds);
        }
        
        return changed;
    };

    var _updateCoords = function(M, bounds, fire){
        var U = this._local, changed = false;
        if(M.x !== bounds.x || M.y !== bounds.y ){
            M.x = bounds.x;
            M.y = bounds.y;
            changed = true;
        }

        if((fire & 0x04)){
            U.userX = M.x;
            U.userY = M.y;
        }
        return changed;
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
        var M = this.def, bounds, changed = false;
        if(this.view){
            bounds = DOM.setZ(this.view, z);
        }else{
            bounds = {MBP:{zIndex:z}};
        }

        changed = _updateZ.call(this, M, bounds, fire);
        if(changed){
            this.adjustLayers("zorder", bounds);            
        }
        
        return changed;
    };

    var _updateZ = function(M, bounds, fire){
        var U = this._local, changed = false;
        if(M.z !== bounds.MBP.zIndex){
            M.z = bounds.MBP.zIndex;
            changed = true;
        }
        if((fire & 0x04)){
            U.userZ = M.z;
        }
        return changed;
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
        return this.setSize(w, null, fire);
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
        return this.setSize(null, h, fire);
    };
    
    /**
     * Return outer size of the component.<p>
     * 
     * @return an object with {width, height}
     */
    thi$.getSize = function(){
        return {width: this.getWidth(), height: this.getHeight()};
    };
    
    /**
     * Set outer size of the component.<p>
     * 
     * @param w, width
     * @param h, height
     */
    thi$.setSize = function(w, h, fire){
        var M = this.def, bounds, changed = false;
        if(this.view){
            bounds = DOM.setSize(this.view, w, h);
        }else{
            bounds = {width: w, height: h};
        }
        
        changed = _updateSize.call(this, M, bounds, fire);
        if(changed){
            this.adjustLayers("sized", bounds);
        }
        
        if((fire & 0x01)){
            this.doLayout(true, bounds);
        }
        
        return changed;
    };

    var _updateSize = function(M, bounds, fire){
        var U = this._local, changed = false;
        
        if(M.width !== bounds.width ||
           M.height !== bounds.height){
            M.width = bounds.width;
            M.height= bounds.height;
            changed = true;
        }

        if((fire & 0x04)){
            U.userW = M.width;
            U.userH = M.height;
        }
        
        return changed;
    };

    thi$.absXY = function(){
        var bounds = this.getBounds();
        return{x: bounds.absX, y:bounds.absY};
    };
    
    thi$.getBounds = function(nocache){
        var U = this._local, bounds;
        
        if(this.view){
            bounds = DOM.getBounds(this.view, nocache);
        }else{
            bounds = {
                MBP:{zIndex:this.getZ()},
                absX: 0,
                absY: 0,
                x: this.getX(),
                y: this.getY(),
                width: this.getWidth(),
                height:this.getHeight()
            };
            bounds.styleW = bounds.width;
            bounds.styleH = bounds.height;
        }

        bounds.userX = U.userX;
        bounds.userY = U.userY;
        bounds.userZ = U.userZ;
        bounds.userW = U.userW;
        bounds.userH = U.userH;
        
        return bounds;
    };

    thi$.setBounds = function(x, y, w, h, fire){
        var M = this.def, bounds, coord, sized;
        
        if(this.view){
            bounds = DOM.setBounds(this.view, x, y, w, h);
        }else{
            bounds = {x: x, y: y, width: w, height: h};
        }

        coord = _updateCoords.call(this, M, bounds, fire);
        sized = _updateSize.call(this, M, bounds, fire);
        if(coord || sized){
            this.adjustLayers("geom", bounds);
        }
        
        if((fire & 0x01)){
            this.doLayout(true, bounds);
        }

        return (coord || sized);
    };

    thi$.getPreferredSize = function(){
        var size = this.def.prefSize, bounds = this.getBounds();
        if(!size){
            return {width: bounds.width, height: bounds.height};
        }else{
            return checkSize0(size, bounds.width, bounds.height);
        }
    };
    
    thi$.setPreferredSize = function(w, h){
        var M = this.def, size = M.prefSize = (M.prefSize || {});
        return checkSize1(size, w, h);        
    };
    
    thi$.getMinimumSize = function(){
        var size = this.def.miniSize, bounds = this.getBounds();
        
        if(!size){
            return {width: bounds.MBP.BPW+1, height:bounds.MBP.BPH+1};
        }else{
            return checkSize0(size, bounds.MBP.BPW+1, bounds.MBP.BPH+1);
        }
    };
    
    thi$.setMinimumSize = function(w, h){
        var M = this.def, size = M.miniSize = (M.miniSize || {});
        return checkSize1(size, w, h);
    };
    
    thi$.getMaximumSize = function(nocache){
        var size = this.def.maxiSize, bounds = this.getBounds();
        
        if(!size){
            return { width: 0xFFFF, height:0xFFFF };
        }else{
            return checkSize0(size, 0xFFFF, 0xFFFF);
        }
    };
    
    thi$.setMaximumSize = function(w, h){
        var M = this.def, size = M.maxiSize = (M.maxiSize || {});
        return checkSize1(size, w, h);
    };

    var checkSize0 = function(size, w, h){
        if(!Class.isNumber(size.width)){
            size.width = w;
        }
        if(!Class.isNumber(size.height)){
            size.height= h;
        }
        return size;
    };

    var checkSize1 = function(size, w, h){
        if(Class.isNumber(w)){
            size.width = w;
        }
        if(Class.isNumber(h)){
            size.height= h;
        }
        return size;
    };

    /**
     * Return the computed style with the specified style name
     */
    thi$.getStyle = function(sp){
        if(!this.view) return null;
        return DOM.currentStyles(this.view)[DOM.camelName(sp)];
    };

    /**
     * Return the computed styles set with the specified style names array.<p>
     * 
     * @return an object with key are style name and value are style value. 
     */
    thi$.getStyles = function(sps){
        if(!this.view) return {};

        var styles = DOM.currentStyles(this.view),
            i, len, sp, ret = {};
        for(i=0, len=sps.length; i<len; i++){
            sp = DOM.camelName(sps[i]);
            ret[sp] = styles[sp];
        }
        return ret;
    };

    /**
     * Apply a style set to the component.<p>
     * 
     * @param styles, an object with key are style name and value 
     * are style value. 
     */
    thi$.applyStyles = function(styles){
        var M = this.def, coord, sized, fire = 0x0F,
            bounds = DOM.applyStyles(this.view, styles);

        if(this.isDOMElement()){
            coord = _updateCoords.call(this, M, bounds, fire);
            sized = _updateSize.call(this, M, bounds, fire);

            if(coord || sized){
                this.adjustLayers("geom", bounds);
                
                if(sized && (fire & 0x01)){
                    this.doLayout(true, bounds);
                }
            }
        }
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
        if(this.view){
            DOM.appendTo(this.view, parent);
        }else if (parent.appendChild){
            parent.appendChild(this);
        }

        this.adjustLayers("append");
    };

    /**
     * Remove this element from the specified parent node.
     * 
     * @param parent, the specified parent
     */
    thi$.removeFrom = function(parent){
        if(this.view){
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
    thi$.insertBefore = function(ref){
        if(this.view){
            DOM.insertBefore(this.view, ref);
        }else if (ref.getContainer()){
            ref.getContainer().insertChildBefore(this, ref);
        }

        this.adjustLayers("append");
    };

    /**
     * Insert this element after the specified node.
     * 
     * @param ref, the specified node
     */
    thi$.insertAfter = function(ref){
        if(this.view){
            DOM.insertAfter(this.view, ref);
        }else if (ref.getContainer()){
            ref.getContainer().insertChildAfter(this, ref);
        } 

        this.adjustLayers("append");
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
        var container = this.container;
        if(!container && this.view && this.view.parentNode){
            container = DOM.getComponent(this.view.parentNode);
        }
        return container;
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

    var DISPLAYS = ["none", "block", "inline"];

    thi$.display = function(show){
        var disp;
        show = Class.isBoolean(show) ? (show ? 1:0) :
        Class.isNumber(show) ? show : 0;
        this.setVisible(show !== 0);
        
        if(this.view){
            disp = DISPLAYS[show];
            this.view.style.display = disp;
            this.adjustLayers("display", null, disp);
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

    /**
     * Test whether this componet view is a DOM element
     */    
    thi$.isDOMElement = function(){
        return DOM.isDOMElement(this.view);
    };
    
    thi$.doLayout = function(force, bounds){
        var U = this._local, ret = true;
        if(!this.needLayout(force)){
            ret = false;
        }else{
            // Why do need bounds here ?
            bounds = bounds || this.getBounds(true);
            ret = U.didLayout = true;
        }
        
        return ret;
    };

    /**
     * Test whether this component need do layout
     * 
     */
    thi$.needLayout = function(force){
        var U = this._local, ret = false;
        if(this.isDOMElement()){
            ret = !U.didLayout || force;
        }
        return ret;
    };
    
    /**
     * Force this compoents need do layout
     * 
     */
    thi$.forceLayout = function(){
        this._local.didLayout = false;
    };

    var _elementChanged = function(cmd){
        var container = this.getContainer() 
            || DOM.getComponent(this.view.parentNode);
        if(container && container.fireEvent){
            container.fireEvent(
                new Event("childrenchanged", {cmd: cmd}, this));
        }
    };
    
    thi$.adjustLayers = function(cmd, bounds, show){
        var doo = false;
        switch(cmd){
        case "coord":
        case "sized":
        case "geom":
            bounds = bounds || this.getBounds();
            this.adjustShadow(bounds);
            this.adjustCover(bounds);
            this.adjustOutline(bounds);
            doo = true;
            break;
        case "zorder":
            var z = this.getZ();
            this.setShadowZIndex(z);
            this.setCoverZIndex(z);
            this.setOutlineZIndex(z);
            break;
        case "display":
            if(show != "none"){
                bounds = bounds || this.getBounds();
                this.adjustShadow(bounds);
                this.adjustCover(bounds);
                this.adjustOutline(bounds);
            }
            this.setShadowDisplay(show);
            this.setCoverDisplay(show);
            this.setOutlineDisplay(show);
            break;
        case "remove":
            this.removeShadow();
            this.removeCover();
            this.removeOutline();
            this.removeTipLayer();

            doo = true;
            break;
        case "append":
            doo = true;
            break;
        }

        if(doo){
            _elementChanged.call(this, cmd);
        }
    };

    thi$.spotIndex = function(ele, xy, dragObj){
        if(DOM.isMouseCapture(ele)){
            return parseInt(ele.spot);
        }
        
        return this.isMovable() &&
            this.isMoverSpot(ele, xy.x, xy.y) ? 8 : -1;
    };

    /**
     * Return the <code>js.awt.Element</code> that the point (x, y) 
     * is inside it.
     * 
     * @param {Number} x, the x coordinator of the point.
     * @param {Number} y, the y coordinator of the point.
     * @param {Array} nothese, the excludes js.awt.Elements.
     * 
     * @return {js.awt.Element} the element found.
     */
    thi$.elementFromPoint = function(x, y, nothese){
        return  (!nothese || !nothese.$contains(this)) ? 
            (this.inside(x, y) ? this : null) : null;
    };

    /**
     * Return all the <code>js.awt.Element</code> which the point (x, y) 
     * is inside them.
     * 
     * @param {Number} x, the x coordinator of the point.
     * @param {Number} y, the y coordinator of the point.
     * @param {Array} nothese, the excludes js.awt.Elements.
     * 
     * @return {Array} the js.awt.Element array
     * 
     */
    thi$.elementsFromPoint = function(x, y, nothese, result){
        result = result || [];
        var ele = this.elementFromPoint(x, y, nothese);
        if(ele){
            result.push(ele);
        }
        return result;
    };

    thi$.isDropable = function(x, y, data){
        return this.def.dropable || false;
    };
    
    thi$.getDropableTarget = function(x, y, data){
        var target;
        if(this.isDropable(x,y,data)){
            target = this;
        } else {
            var container = this.getContainer();
            if(container){
                target = container.getDropableTarget(x, y, data);
            }
        }
        return target;
    };
        
    thi$.getCursor = function(ele, x, y){
        return 11;
    };

    thi$.getMovingConstraints = function(){
        var mover = this.def.mover;
        if(!mover){
            mover = this.def.mover = {
                bt: 1, br: 0, bb: 0, bl: 1,
                grid: 1,
                freedom: 3
            };
        }else {
            mover.bt = Class.isNumber(mover.bt) ? mover.bt : 1;
            mover.br = Class.isNumber(mover.br) ? mover.br : 0;
            mover.bb = Class.isNumber(mover.bb) ? mover.bb : 0;
            mover.bl = Class.isNumber(mover.bl) ? mover.bl : 1;
            mover.grid = Class.isNumber(mover.grid) ? mover.grid : 1;
            mover.freedom = Class.isNumber(mover.freedom) ? mover.freedom : 3;
        }
        return mover;
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
                0 - 0xFFFF,
                0 - 0xFFFF,
                hscroll ? 0xFFFF : pounds.innerWidth,
                vscroll ? 0xFFFF : pounds.innerHeight
            ],
            autofit: autofit,
            hscroll: hscroll,
            vscroll: vscroll
        };
    };
    
    thi$.destroy = function(){
        if(this.destroied) return;
        
        this.removeOutline();
        this.removeCover();
        this.removeShadow();
        this.removeTipLayer();
        
        this.peer = null;
        this.container = null;

        $super(this);

    }.$override(this.destroy);

    thi$.classType = function(){
        return this.def.classType;
    };

    thi$._init = function(def, Runtime, view){
        if(!Class.isObject(def)) return;
        
        def.classType = def.classType || "js.awt.Element";
        var id = this.uuid(def.uuid);
        this.id = def.id || (view ? (view.id || id) : id); 

        $super(this);

        var M = this.def, U = this._local;

        this.__buf__ = new js.lang.StringBuffer();

        CLASS.count++;

        if(!this.isStateless()){
            if(!Class.isNumber(M.state)){
                M.state = 0;
            }
        }

        if(M.movable){
            this.setMovable(true);
        }

        if(M.resizable){
            this.setResizable(true, M.resizer);
        }
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.util.EventTarget).$implements(
    js.awt.State, js.awt.Shadow, js.awt.Cover,
    js.awt.Movable, js.awt.MoveObject,
    js.awt.Resizable, js.awt.SizeObject,
    js.awt.Outline, js.awt.ToolTip);

js.awt.Element.count = 0;

