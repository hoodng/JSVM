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
 * Source code availability: http://github.com/jsvm
 */

$package("js.awt");

$import("js.util.EventTarget");

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
        System = J$VM.System, MQ = J$VM.MQ;
    
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
        var M = this.def;
        M.x = Class.isNumber(x) ? x : this.getX();
        M.y = Class.isNumber(y) ? y : this.getY();
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
        this.def.z = Class.isNumber(z) ? z : this.getZ();
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
        var M = this.def;
        M.width = Class.isNumber(w) ? w : this.getWidth();
        M.height= Class.isNumber(h) ? h : this.getHeight();
    };
    
    thi$.getBounds = function(){
        var M = this.def, bounds = {
            x: this.getX(),
            y: this.getY(),
            width: this.getWidth(),
            height: this.getHeight()
        };

        return bounds;
    };

    thi$.setBounds = function(x, y, w, h, fire){
        var M = this.def;

        M.x = Class.isNumber(x) ? x : this.getX();
        M.y = Class.isNumber(y) ? y : this.getY();
        M.width = Class.isNumber(w) ? w : this.getWidth();
        M.height= Class.isNumber(h) ? h : this.getHeight();
    };
    
    thi$.isVisible = function(){
        return this.def.visible || false;
    };

    thi$.setVisible = function(v){
        this.def.visible = Class.isBoolean(v) ? v : this.isVisible();
    };

    thi$.getAttr = function(key){
        return this.def[key];
    };

    thi$.setAttr = function(key, val){
        this.def[key] = val;
    };

    thi$.delAttr = function(key){
        delete this.def[key];
    };

    thi$.getAttrs = function(){
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
        if(parent && parent.instanceOf(js.awt.Containable)){
            parent.appendChild(this);
        }
    };

    /**
     * Remove this element from the specified parent node.
     * 
     * @param parent, the specified parent
     */
    thi$.removeFrom = function(parent){
        if(parent && parent.instanceOf(js.awt.Containable)){
            parent.removeChild(this);
        }
    };

    /**
     * Insert this element before the specified node.
     *
     * @param ref, the specified node
     */
    thi$.insertBefore = function(ref){
        var parent = ref ? ref.getContainer() : undefined;
        if(parent && parent.instanceOf(js.awt.Containable)){
            parent.insertChildBefore(this, ref);
        }
    };

    /**
     * Insert this element after the specified node.
     * 
     * @param ref, the specified node
     */
    thi$.insertAfter = function(ref){
        var parent = ref ? ref.getContainer() : undefined;
        if(parent && parent.instanceOf(js.awt.Containable)){
            parent.insertChildAfter(this, ref);
        }
    };

    thi$.contains = function(ele, containSelf){
        var id = this.getID(ele), obj = this.getOBJ(ele), o = this[id];
        return o === obj || (containSelf ? this === obj : false);
    };

    thi$.inside = function(x, y){
        var d = this.getBounds(), minX = d.x, minY = d.y, 
            maxX = minX + d.width, maxY = minY + d.height;
        return (x >= minX && x <= maxX && y >= minY && y <= maxY);
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
        var ZM = this.container;
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
        sync = (sync == undefined) ? this.def.sync : sync;

        if(sync == true){
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
        if(show === false){
            this.setVisible(false);
        }else{
            this.setVisible(true);
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

    thi$.classType = function(){
        return this.def.classType;
    };

    thi$.destroy = function(){
        delete this._local;

        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        this.def = def;
        this._local = this._local || {};
        this._local.Runtime = Runtime;
        this.uuid(def.uuid);
        this.id = def.id || this.uuid();
        
        def.classType = def.classType || "js.awt.Element";

        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.util.EventTarget);
