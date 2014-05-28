/**
 * Copyright (c) Jinfonet Inc. 2000-2011, All rights reserved.
 * 
 * @File: Component.js
 * @Create: 2010-11-17
 * @Author: dong.hu@china.jinfonet.com
 */

$package("js.awt");

js.awt.State = function() {

    var CLASS = js.awt.State, thi$ = CLASS.prototype;
    if(CLASS.__defined__) {
        this._init0.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var C = js.lang.Class, E = js.util.Event;
    
    thi$.isStateless = function(){
        return this.def.stateless || false;
    };
    
    thi$.getState = function() {
        return this.def.state;
    };

    thi$.setState = function(state) {
        if(!this.isStateless()) {
            this.def.state = state & 0x7F;
            if(C.isFunction(this.onStateChanged)) {
                this.onStateChanged(this.getState());
            }
        }
    };

    thi$.isEnabled = function(){
        return (this.getState() & CLASS.D) == 0;
    };

    thi$.setEnabled = function(b){
        var state = this.getState(), $ = CLASS.D;
        this.setState(b ? (state & ~$):(state | $));
    };
    
    /**
     * @deprecated
     */
    thi$.setEnable = function(b) {
        J$VM.System.err.println("This method is deprecated, please use setEnabled");
        return this.setEnabled(b);
    };
    
    thi$.isHover = function(){
        return (this.getState() & CLASS.H) != 0;
    };

    thi$.setHover = function(b){
        var state = this.getState(), $ = CLASS.H;
        this.setState(b ? (state | $):(state & ~$));
    };
    
    /**
     * @deprecated
     */
    thi$.isMouseOver = function() {
        J$VM.System.err.println("This method is deprecated, please use isHover");
        return this.isHover();
    };

    /**
     * @deprecated
     */
    thi$.setMouseOver = function(b) {
        J$VM.System.err.println("This method is deprecated, please use setHover");
        return this.setHover(b);
    };

    thi$.isActivated = function(){
        return (this.getState() & CLASS.A) != 0;
    };

    thi$.setActivated = function(b){
        var state = this.getState(), $ = CLASS.A;
        this.setState(b ? (state | $):(state & ~$));
    };

    thi$.isTriggered = function(){
        return (this.getState() & CLASS.T) != 0;
    };
    
    thi$.setTriggered = function(b){
        var state = this.getState(), $ = CLASS.T;
        this.setState(b ? (state | $):(state & ~$));
    };

    /**
     * @deprecated
     */
    thi$.isTrigger = function() {
        J$VM.System.err.println("This method is deprecated, please use isTriggered.");
        return this.isTriggered();
    };
    
    /**
     * @deprecated
     */
    thi$.setTrigger = function(b) {
        J$VM.System.err.println("This method is deprecated, please use setTriggered.");
        return this.setTriggered(b);
    };

    thi$.isVisible = function() {
        return (this.getState() & CLASS.V) == 0;
    };

    thi$.setVisible = function(b) {
        var state = this.getState(), $ = CLASS.V;
        this.setState(b ? (state & ~$):(state | $));
    };

    thi$.isMaximized = function() {
        return (this.getState() & CLASS.X) != 0;
    };

    thi$.setMaximized = function(b) {
        var state = this.getState(), $ = CLASS.X;
        this.setState(b ? (state | $):(state & ~$));
    };

    thi$.isMinimized = function() {
        return (this.getState() & CLASS.I) != 0;
    };

    thi$.setMinimized = function(b) {
        var state = this.getState(), $ = CLASS.I;
        this.setState(b ? (state | $):(state & ~$));
    };

    if(this instanceof js.util.EventTarget){
        this.declareEvent(E.SYS_EVT_STATECHANGED);
    }
    
    thi$._init0 = function(def){
        this.def = def || {};
    };
    
    this._init0.apply(this, arguments);
};

js.awt.State.D = 0x01 << 0; // Disable/Enable
js.awt.State.O = 0x01 << 1; // MouseOver/MouseOut
js.awt.State.T = 0x01 << 2; // Trigger/Un-trigger
js.awt.State.A = 0x01 << 3; // Actived/Deactived
js.awt.State.V = 0x01 << 4; // Hidden/Visible
js.awt.State.X = 0x01 << 5; // Maximized/Normal
js.awt.State.I = 0x01 << 6; // Iconified/Normal

js.awt.State.H = 0x01 << 1;

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

$package("js.awt");

js.awt.Editable = function(){

    var CLASS = js.awt.Editable, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }

    thi$.getProperties = function(category){
        return {};
    };

    thi$.apply = function(category, properties){
        
    };
    
};


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

$package("js.awt");

js.awt.Cover = function (comp){

    var CLASS = js.awt.Cover, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    /**
     * Show loading status in this cover
     */
    thi$.showLoading = function(b, styleClass){
        b = b || false;
        if(b && this._coverView) return;
        
        _showCover.call(this, b, styleClass || (this.className + "_loading"));

    };
    
    /**
     * Show cover for resizing with class name "jsvm_resizecover"
     */
    thi$.showResizeCover = function(b){
        b = b || false;
        if(b && this._coverView) return;

        _showCover.call(this, b, this.className + "_resizecover");
    };

    /**
     * Show cover for moving with class name "jsvm_movecover"
     */
    thi$.showMoveCover = function(b){
        b = b || false;
        if(b && this._coverView) return;

        _showCover.call(this, b, this.className + "_movecover");
    };

    thi$.showMaskCover = function(b){
        b = b || false;
        if(b && this._coverView) return;

        _showCover.call(this, b, this.className + "_mask");
    };

    thi$.showDisableCover = function(b){
        b = b || false;
        if(b && this._coverView) return;

        _showCover.call(this, b, this.className + "_disable");
    };

    thi$.showCover = function(b, style){
        b = b || false;
        if(b && this._coverView) return;

        _showCover.call(this, b, (style || "jsvm_cover"));
    };

    /**
     * Show cover
     * 
     * @param b, true show the cover and false hide the cover
     */
    var _showCover = function(b, style){
        var cover = this._coverView;

        if(b){
            if(cover == undefined){
                cover = this._coverView = DOM.createElement("DIV");
                cover.className = style;
                cover.style.cssText = "position:absolute;";
                //cover.uuid = this.uuid();
                
                var el = this.view;
                if(typeof this.getLastResizer == "function"){
                    el = this.getLastResizer() || this.view;
                }
                
                DOM.insertAfter(cover, el);
                this.adjustCover();
            }
        }else{
            if(cover && cover.className == style){
               cover.style.cursor = "default"; 
               this.removeCover();
            }
        }
    };
    
    thi$.setCoverZIndex = function(z){
        var cover = this._coverView;
        if(cover){
            z = z || this.getZ();
            cover.style.zIndex = z;
        }
    };

    thi$.setCoverDisplay = function(show){
        var cover = this._coverView;
        if(cover){
            cover.style.display = show;
        }
    };

    /**
     * Adjust the postion and size of the cover
     */
    thi$.adjustCover = function(bounds){
        var cover = this._coverView, U = this._local;
        if(cover){
            bounds = bounds || this.getBounds();
            DOM.setBounds(cover,
                          bounds.x, 
                          bounds.y,
                          bounds.width + bounds.MBP.MW, 
                          bounds.height+ bounds.MBP.MH);    
        }
    };
        
    thi$.removeCover = function(){
        if(this._coverView){
            DOM.remove(this._coverView, true);
            delete this._coverView;
        }
    };

    thi$.isCovering = function(){
        return this._coverView != undefined;
    };

};




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

$package("js.awt");

/**
 * A <em>Shodow</em> is used to support shodow of a component.<p>
 */
js.awt.Shadow = function (){

    var CLASS = js.awt.Shadow, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    var shadowbounds;

    thi$.setShadowy = function(b){
        b = b || false;
        if(b){
            var shadow = this._shadowView = DOM.createElement("DIV");
            shadow.className = "jsvm_shadow";
            shadow.style.cssText = "position:absolute;";
            shadow.uuid = this.uuid();
        }else{
            if(this._shadowView){
                this.removeShadow(true);
                delete this._shadowView;
            }
        }
        
        shadowbounds = shadowbounds || {
            BBM: J$VM.supports.borderBox,
            MBP: {BW: 0, BH: 0, PW: 0, PH: 0, BPW: 0, BPH: 0}
        };

        this._local.shadowSettled = true;
    };
    
    thi$.shadowSettled = function(){
        return this._local.shadowSettled || false;
    };

    thi$.addShadow = function(){
        var shadow = this._shadowView;
        if(shadow && this.isDOMElement()){
            shadow.style.zIndex = this.getZ();
            DOM.insertBefore(shadow, this.view);
            
        }
    };

    thi$.removeShadow = function(gc){
        var shadow = this._shadowView;
        if(shadow){
            DOM.remove(shadow, gc);
        }
    };

    thi$.adjustShadow = function(bounds){
        var shadow = this._shadowView, U = this._local;
        if(shadow){
            bounds = bounds || this.getBounds();
            DOM.setBounds(shadow, bounds.offsetX, bounds.offsetY, 
                          bounds.width, bounds.height, shadowbounds);
        }
    };

    thi$.setShadowZIndex = function(z){
        var shadow = this._shadowView;
        if(shadow){
            z = z || this.getZ();
            shadow.style.zIndex = z;
        }            
    };

    thi$.setShadowDisplay = function(show){
        var shadow = this._shadowView;
        if(shadow){
            shadow.style.display = show;
        }            
    };
};

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

$package("js.awt");

/**
 * The MoveObject is the entity that drag and drop 
 */
js.awt.MoveObject = function(){

    var CLASS = js.awt.MoveObject, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    /**
     * The moving peer is a moving object's ontologing. Generally,
     * the ontologing just is the moving object itself. But in some
     * case, for example, when drag a tree node, the moving ontologing
     * is the tree node, but moving object maybe looks like a shadow
     * of ontologing.
     */
    thi$.setMovingPeer = function(peer){
        this.movingPeer = peer;
    };
    
    thi$.getMovingPeer = function(){
        return this.movingPeer;
    };

    /**
     * The drop target can get infomation from this moving object.
     * 
     * Notes: Sub class should implements this function.
     */
    thi$.getMovingData = function(){
        return {};
    };
    
    /**
     * The message type is such a string that identify what kind message
     * will be posted to message receivers. Generally, message receivers
     * are drop targets.
     * 
     * Notes: Sub class should implements this function.
     */
    thi$.getMovingMsgType = function(){
        return "js.awt.event.MovingEvent";        
    };
    
    /**
     * The mover will invoke this method to determine moving message 
     * should be posted to which receivers.
     */
    thi$.getMovingMsgRecvs = function(){
        return null;
    };
    
    /**
     * The drop target use this method to release this moving object.
     */
    thi$.releaseMoveObject = function(){
        if(this != this.movingPeer){
            delete this.movingPeer;
            this.destroy();
        }else{
            this.movingPeer = null;
        }
    };
};

/**
 * A <em>Movable</em> is used to support moving a component.<p>
 * This function request a <em>mover</em> definition as below in the model of 
 * the component.<p>
 *  
 * def.mover :{
 *     longpress: Optinal, default is 145ms
 *     bl: boundary left size, it's 0.0 to 1.0 of width. Default is 0.0
 *     bt: boundary top size, it's 0.0 to 1.0 of height. Default is 0.0
 *     br: boundary right size, it's 0.0 to 1.0 of width. Default is 0.0
 *     bb: boundary bottom size, it's 0.0 to 1.0 of height. Default is 0.0
 *     grid: moving on grid, the grid size default is 1px.
 *     freedom: freedom of moving, possible values are 
 *              1: horizontal, 2: vertical and 3: both
 *     }
 * def.movable : true|false
 * <p>
 * When the component is moving, the event "onmoving" will be raised. 
 * Other components can attach this event.
 */
js.awt.Movable = function (){

    var CLASS = js.awt.Movable, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ,
        max = Math.max, min = Math.min, 
        ceil = Math.ceil, floor = Math.floor, round = Math.round;
    
    var _doSelect = function(e){
        
        MQ.register("releaseMoveObject", this, _releaseMoveObject);

        Event.attachEvent(document, "mousemove", 0, this, _onmousemove);
        Event.attachEvent(document, "mouseup", 0, this, _onmouseup);
        
        Event.detachEvent(this.view, "mousemove", 0, this, _onmousemv1);
        Event.detachEvent(this.view, "mouseup",   0, this, _onmouseup1);

        var U = this._local, moveObj = this.getMoveObject(e), 
        objContainer = moveObj.getContainer(), 
        isAutoFit = false, rigidW = false, rigidH = false,
        hscroll = false, vscroll = false;
        if(objContainer){
            rigidW = objContainer.isRigidWidth();
            rigidH = objContainer.isRigidHeight();
            if(objContainer instanceof js.awt.Container){
                isAutoFit = objContainer.isAutoFit();
            }
            var styles = DOM.currentStyles(objContainer.view),
            overflowX = styles.overflowX, overflowY = styles.overflowY;
            hscroll = (overflowX === "auto" || overflowX === "scroll");
            vscroll = (overflowY === "auto" || overflowY === "scroll");
        }

        var bounds = moveObj.getBounds(), maxX, maxY,
        mW = bounds.width, mH = bounds.height, 
        marginLf = bounds.MBP.marginLeft,
        marginTp = bounds.MBP.marginTop,
        mover = this.def.mover, grid = mover.grid, bound = mover.bound,
        bt = max(mover.bt*mH, bound),
        br = max(mover.br*mW, bound),
        bb = max(mover.bb*mH, bound),
        bl = max(mover.bl*mW, bound),
        pview = DOM.offsetParent(moveObj.view),
        cview = isAutoFit ? DOM.offsetParent(pview) : pview,
        pbounds = DOM.getBounds(pview);

        moveObj.minX = grid*ceil((0 - marginLf - mW + bl)/grid);
        moveObj.minY = grid*ceil((0 - marginTp - mH + bt)/grid);
        
        maxX = (!isAutoFit || rigidW) ? 
            (!hscroll ? pbounds.width - pbounds.MBP.BW - marginLf - br:
             max(pview.scrollWidth, pbounds.width) - marginLf - br) :
        max(cview.scrollWidth, cview.offsetWidth) - marginLf - br;
        //moveObj.maxX = grid*Math.floor(maxX/grid);
        moveObj.maxX = maxX;

        maxY = (!isAutoFit || rigidH) ?
            (!vscroll ? pbounds.height-pbounds.MBP.BH - marginTp - bb:
             max(pview.scrollHeight, pbounds.height) - marginTp - bb) :
        max(cview.scrollHeight, cview.offsetHeight) - marginTp - bb;
        //moveObj.maxY = grid*Math.floor(maxY/grid);
        moveObj.maxY = maxY;

        moveObj.showMoveCover(true);
        moveObj.cview = cview;

        U.clickXY.x += (cview.scrollLeft- moveObj.getX());
        U.clickXY.y += (cview.scrollTop - moveObj.getY());
        
    };

    var _onmousedown = function(e){
        this.fireEvent(e);
        // Notify popup LayerManager 
        e.setEventTarget(this);
        MQ.post("js.awt.event.LayerEvent", e, [this.Runtime().uuid()]);

        var targ = e.srcElement;
        if(targ.nodeType == 3){
            // Safari bug
            targ = targ.parentNode;
        }

        var xy = this._local.clickXY = e.eventXY();

        if(e.button == 1 && !e.ctrlKey && !e.shiftKey 
           && this.isMovable() 
           && this.isMoverSpot(targ, xy.x, xy.y) 
           && this.inside(xy.x, xy.y)){
            
            var longpress = this.def.mover.longpress;
            longpress = Class.isNumber(longpress) ? longpress : 
                (J$VM.env["j$vm_longpress"] || 145);

            //Event.attachEvent(this.view, "mousemove", 0, this, _onmousemv1);            
            Event.attachEvent(this.view, "mouseup",   0, this, _onmouseup1);

            _doSelect.$delay(this, longpress, e);

            //e.cancelBubble();
        }

        return true;

    };

    var _onmouseup1 = function(e){
        e.setEventTarget(this);
        this.fireEvent(e);

        if(!_doSelect.$clearTimer()){
            //Event.detachEvent(this.view, "mousemove", 0, this, _onmousemv1);
            Event.detachEvent(this.view, "mouseup",   0, this, _onmouseup1);
        }
        return true;
    };
    
    var _onmousemv1 = function(e){
        if(!System.checkThreshold(e.getTimeStamp().getTime(), 20)) 
            return e.cancelDefault();

        return _onmouseup1.call(this, e);
    };

    var _onmousemove =function(e){
        if(!System.checkThreshold(e.getTimeStamp().getTime(), 
                                  this.def.mover.threshold)) 
            return e.cancelDefault();
        
        _doSelect.$clearTimer();
        
        if(!this._local.notified){
            // Notify all IFrames to show cover on itself
            MQ.post(Event.SYS_EVT_MOVING, "");
            this._local.notified = true;
        }

        var moveObj = this.getMoveObject(), p = moveObj.cview,
        bounds = moveObj.getBounds(), mover = this.def.mover,
        grid = mover.grid, freedom = mover.freedom,
        xy = e.eventXY(), oxy = this._local.clickXY,
        x = xy.x + p.scrollLeft - oxy.x , y = xy.y + p.scrollTop - oxy.y,
        minX = moveObj.minX, minY = moveObj.minY,
        maxX = moveObj.maxX, maxY = moveObj.maxY;
        
        x = x < minX ? minX : x > maxX ? maxX : x;
        y = y < minY ? minY : y > maxY ? maxY : y;
        
        if(x != bounds.x || y != bounds.y){
            // Snap to grid
            x = grid*round(x/grid);
            x = (freedom & 0x01) != 0 ? x : undefined;

            y = grid*round(y/grid);
            y = (freedom & 0x02) != 0 ? y : undefined;

            moveObj.setPosition(x, y);
            moveObj._moved = true;
        }
        
        // Notify all drop targets
        var recvs = moveObj.getMovingMsgRecvs() || [];
        recvs.unshift(moveObj.getMovingPeer().uuid());
        e.setEventTarget(moveObj);
        MQ.post(moveObj.getMovingMsgType(), e, recvs);

        return e.cancelDefault();
    };

    var _onmouseup =function(e){
        _doSelect.$clearTimer();
        this.fireEvent(e);

        Event.detachEvent(document, "mousemove", 0, this, _onmousemove);        
        Event.detachEvent(document, "mouseup", 0, this, _onmouseup);
        // Notify all IFrames can remove cover now
        MQ.post(Event.SYS_EVT_MOVED, "");
        this._local.notified = false;

        var moveObj = this.getMoveObject(),
        recvs = moveObj.getMovingMsgRecvs() || [];
        // Notify all drop targets
        recvs.unshift(moveObj.getMovingPeer().uuid());
        e.setEventTarget(moveObj);
        MQ.post(moveObj.getMovingMsgType(), e, recvs);

        // Release MoveObject
        MQ.post("releaseMoveObject", "", [this.uuid()]);

        moveObj.showMoveCover(false);
        if(moveObj._moved){
            moveObj.setPosition(moveObj.getX(), moveObj.getY(), 0x0F);
            delete moveObj._moved;
        }

        return true;
    };

    var _releaseMoveObject = function(){
        if(this.moveObj){
            delete this.moveObj.cview;
            this.moveObj.releaseMoveObject();
            delete this.moveObj;
        }
        
        MQ.cancel("releaseMoveObject", this, _releaseMoveObject);
    };

    /**
     * Test if the element is a hotspot for moving.
     * 
     * @param el, a HTMLElement
     * @param x, y
     * 
     * @return boolean
     * 
     * Notes: Sub class should override this method
     */
    thi$.isMoverSpot = function(el, x, y){
        return true;
    };

    /**
     * Gets MoveObject from this component. 
     * 
     * @see js.awt.MoveObject
     * 
     * Notes: If need sub class can override this method
     */    
    thi$.getMoveObject = function(e){
        var moveObj = this.moveObj;
        if(!moveObj){
            moveObj = this.moveObj = this;
            moveObj.setMovingPeer(this);
        }

        return moveObj;
    };
    
    /**
     * Tests whether this component is movable.
     */
    thi$.isMovable = function(){
        return this.def.movable || false;
    };
    
    /**
     * Sets whether this component is movable.
     * 
     * @param b, true is movable, false is unable.
     */
    thi$.setMovable = function(b){
        this.def = this.def || {};
        this._local = this._local || {};
        b = b || false;
        
        var M = this.def, U = this._local;
        
        M.movable = b;
        if(b){
            if(!U.moveEventAttached){
                var mover = M.mover = M.mover || {};
                mover.longpress = 
                    Class.isNumber(mover.longpress) ? mover.longpress : 1;
                mover.bound = 
                    Class.isNumber(mover.bound) ? mover.bound : 20;
                mover.bt = Class.isNumber(mover.bt) ? mover.bt : 1;
                mover.br = Class.isNumber(mover.br) ? mover.br : 0;
                mover.bb = Class.isNumber(mover.bb) ? mover.bb : 0;
                mover.bl = Class.isNumber(mover.bl) ? mover.bl : 1;
                mover.grid = Class.isNumber(mover.grid) ? mover.grid : 1;
                mover.freedom = Class.isNumber(mover.freedom) ? mover.freedom : 3;

                Event.attachEvent(this.view, "mousedown", 0, this, _onmousedown);
                U.moveEventAttached = true;
            }
        }else{
            if(U.moveEventAttached){
                Event.detachEvent(this.view, "mousedown", 0, this, _onmousedown);
                U.moveEventAttached = false;
            }
        }
        
        U.movableSettled = true;
    };
    
    thi$.movableSettled = function(){
        return this._local.movableSettled || false;
    };

};


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

$package("js.awt");

/**
 * The SizeObject is the entity that drag to resize
 */
js.awt.SizeObject = function(){

    var CLASS = js.awt.SizeObject, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    
    thi$.setSizingPeer = function(peer){
        this.sizingPeer = peer;
    };
    
    thi$.getSizingPeer = function(){
        return this.sizingPeer;
    };
    
    thi$.getSizingData = function(){
        return {};
    };
    
    thi$.getSizingMsgType = function(){
        return "js.awt.event.SizingEvent";
    };
    
    thi$.getSizingMsgRecvs = function(){
        return null;
    };
    
    thi$.releaseSizeObject = function(){
        if(this != this.sizingPeer){
            delete this.sizingPeer;
            this.destroy();
        }else{
            this.sizingPeer = null;
        }
    };
};

/**
 * A <em>Resizable</em> is used to support resizing a component.<p>
 * This function request a <em>resizer</em> definition as below in the def of 
 * the component.
 * <p>
 * 
 * def.resizer : number 
 *                 8 bits for the 8 directions
 *                 7  6  5  4  3  2  1  0         
 *                 N  NE E  SE S  SW W  NW
 * 
 *                 0 ---- 7 ---- 6 
 *                 |             |
 *                 1             5
 *                 |             |
 *                 2 ---- 3 ---- 4
 * 
 * <p>
 * When the component is resizing, the event "resizing" will be raised. 
 * Other components can attach this event.
 */
js.awt.Resizable = function(){
    
    var CLASS = js.awt.Resizable, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;

    var CURSORS = [
        "nw-resize",
        "w-resize",
        "sw-resize",
        "s-resize",
        "se-resize",
        "e-resize",
        "ne-resize",
        "n-resize"
    ];

    var SpotSize = {lw: 3, l2w: 6, pw: 5, p2w:10 };    

    var ACalc = [
    // 0
    function(box, spot){
        return {
            x: box.offsetX, y: box.offsetY,
            w: spot.pw, h: spot.pw
        };
    },
    // 1
    function(box, spot){
        return {
            x: box.offsetX, y: box.offsetY + spot.pw,
            w : spot.lw, h:box.height - spot.p2w
        };
    },
    // 2
    function(box, spot){
        return {
            x: box.offsetX, 
            y: box.offsetY + box.height - spot.pw,
            w: spot.pw, h:spot.pw
        };
    },
    // 3
    function(box, spot){
        return {
            x:box.offsetX + spot.pw, 
            y:box.offsetY + box.height - spot.lw,
            w:box.width - spot.p2w, h:spot.lw
        };
    },
    // 4
    function(box, spot){
        return {
            x: box.offsetX + box.width - spot.pw,
            y: box.offsetY + box.height- spot.pw,
            w: spot.pw, h: spot.pw
        };
    },
    // 5
    function(box, spot){
        return {
            x: box.offsetX + box.width - spot.lw,
            y: box.offsetY + spot.pw,
            w: spot.lw, h: box.height - spot.p2w
        };
    },
    // 6
    function(box, spot){
        return {
            x: box.offsetX + box.width - spot.pw,
            y: box.offsetY,
            w: spot.pw, h: spot.pw
        };
    },
    // 7
    function(box, spot){
        return {
            x: box.offsetX + spot.pw, y: box.offsetY,
            w: box.width - spot.p2w, h: spot.lw
        };
    }
    ];

    var diffW = function(i, eventXY, startXY){
        switch(i){
        case 4: case 5: case 6:
            return eventXY.x - startXY.x;
        case 0: case 1: case 2:
            return startXY.x - eventXY.x;
        default:
            return 0;
        }
    };

    var diffH = function(i, eventXY, startXY){
        switch(i){
        case 2: case 3: case 4:
            return eventXY.y - startXY.y;
        case 0: case 6: case 7:
            return startXY.y - eventXY.y;
        default:
            return 0;
        }
    };
    
    var miniW = function(w, miniW){
        return w < miniW ? miniW : w; 
    };
    
    var miniH = function(h, miniH){
        return h < miniH ? miniH : h;
    };

    var maxiW = function(i, box, pox, maxiW){
        var w;
        switch(i){
        case 4: case 5: case 6:
            w = pox.clientWidth - box.offsetX;
            break;
        case 0: case 1: case 2:
            w = box.userX + box.userW;
            break;
        }
        return w > maxiW ? maxiW : w;
    };

    var maxiH = function(i, box, pox, maxiH){
        var h;
        switch(i){
        case 2: case 3: case 4:
            h = pox.clientHeight - box.offsetY;
            break;
        case 0: case 6: case 7:
            h = box.userY + box.userH;
            break;
        }
        return h > maxiH ? maxiH : h;
    };

    var _onmousedown = function(e, i){
        // Notify popup LayerManager 
        e.setEventTarget(this);
        MQ.post("js.awt.event.LayerEvent", e, [this.Runtime().uuid()]);

        if(e.button != 1 || !this.isResizable()) return false;
        
        this.showCover(true);
        
        this._local.clickXY = e.eventXY();
        
        Event.attachEvent(document, "mousemove", 0, this, _onmousemove, i);
        Event.attachEvent(document, "mouseup", 0, this, _onmouseup, i);
        
        MQ.register("releaseSizeObject", this, _releaseSizeObject);

        //e.cancelBubble();

        return e.cancelDefault();
    };

    var _onmousemove = function(e, i){

        if(!J$VM.System.checkThreshold(e.getTimeStamp().getTime(), 
                                       this.def.mover.threshold)) 
            return e.cancelDefault();
        
        if(!this._local.notified){
        // Notify all IFrames show cover on it self
            MQ.post(Event.SYS_EVT_RESIZING, "");
            this._local.notified = true;
        }
        
        var sizeObj = this.getSizeObject(), grid = this.def.mover.grid,
        box = sizeObj.getBounds(), pox = sizeObj.view.parentNode,
        miniSize = sizeObj.getMinimumSize(),
        maxiSize = sizeObj.getMaximumSize();

        var c = SpotSize.p2w, startXY = this._local.clickXY, xy = e.eventXY(),
        dw = diffW(i, xy, startXY), dh = diffH(i, xy, startXY), x, y,
        w = grid*Math.round((box.userW + dw)/grid),
        h = grid*Math.round((box.userH + dh)/grid), 
        minW = grid*Math.ceil(miniW(c, miniSize.width)/grid),
        minH = grid*Math.ceil(miniH(c, miniSize.height)/grid),
        maxW = grid*Math.floor(maxiW(i, box, pox, maxiSize.width)/grid),
        maxH = grid*Math.floor(maxiH(i, box, pox, maxiSize.height)/grid);

        w = w < minW ? minW : (w > maxW) ? maxW : w;
        h = h < minH ? minH : (h > maxH) ? maxH : h;
        
        switch(i){
        case 0:
            x = box.userX + box.userW - w;
            y = box.userY + box.userH - h;
            break;
        case 1:
            x = box.userX + box.userW - w;
            y = box.userY;
            h = box.userH;
            break;
        case 2:
            x = box.userX + box.userW - w;
            y = box.userY;
            break;
        case 3:
            x = box.userX;
            y = box.userY;
            w = box.userW;
            break;
        case 4:
            x = box.userX;
            y = box.userY;
            break;
        case 5:
            x = box.userX;
            y = box.userY;
            h = box.userH; 
            break;
        case 6:
            x = box.userX;
            y = box.userY + box.userH - h;
            break;
        case 7:
            x = box.userX;
            y = box.userY + box.userH - h;
            w = box.userW;
            break;
        }

        // Snap to grid
        x = grid*Math.round(x/grid);
        y = grid*Math.round(y/grid);
        
        if(x != box.offsetX || y != box.offsetY){
            sizeObj.setPosition(x, y);
            sizeObj._moved = true;
        }
        if(w != box.width || h != box.height){
            sizeObj.setSize(w, h);
            sizeObj._sized = true;
        }
        
        // Notify all message receivers
        var recvs = sizeObj.getSizingMsgRecvs() || [];
        recvs.unshift(sizeObj.getSizingPeer().uuid());
        e.setEventTarget(sizeObj);
        MQ.post(sizeObj.getSizingMsgType(), e, recvs);

        return e.cancelDefault();
    };

    var _onmouseup = function(e, i){
        Event.detachEvent(document, "mousemove", 0, this, _onmousemove, i);
        Event.detachEvent(document, "mouseup", 0, this, _onmouseup, i);
        // Notify all IFrames remove cover from it self
        MQ.post(Event.SYS_EVT_RESIZED, "");
        this._local.notified = false;
        
        // Notify all message receivers
        var sizeObj = this.getSizeObject(),
        recvs = sizeObj.getSizingMsgRecvs() || [];
        recvs.unshift(sizeObj.getSizingPeer().uuid());
        e.setEventTarget(sizeObj);
        MQ.post(sizeObj.getSizingMsgType(), e, recvs);

        // Release SizeObject
        MQ.post("releaseSizeObject", "", [this.uuid()]);

        this.showCover(false);
        if(sizeObj._sized){
            sizeObj.setSize(sizeObj.getWidth(), sizeObj.getHeight(), 0x0F);
            delete sizeObj._sized;
        }
        if(sizeObj._moved){
            sizeObj.setPosition(sizeObj.getX(), sizeObj.getY(), 0x0F);
            delete sizeObj._moved;
        }

        return e.cancelDefault();
    };
    
    var _releaseSizeObject = function(){
        if(this.sizeObj){
            this.sizeObj.releaseSizeObject();
            delete this.sizeObj;
        }

        MQ.cancel("releaseSizeObject", this, _releaseSizeObject);
    };
    
    var _onsizingevent = function(e){
        // If subclass has own user-defined event handle, invoke it.
        // And if the boolean true was returned, break current handl.
        if(Class.isFunction(this.onUDFResizing) 
            && this.onUDFResizing(e)){
            return;
        }
        
        var eType = e.getType(), target = e.getEventTarget(), 
        x, y, w, h;

        if(eType == "mouseup"){
            x = target.getX(); y = target.getY();
            w = target.getWidth(); h = target.getHeight();
            
            if(x != this.getX() || y != this.getY()){
                this.setPosition(x, y, 0x0F);
            }
            
            if(w != this.getWidth() || h != this.getHeight()){
                this.setSize(w, h, 0x0F);
            }
        }
    };

    var _createResizer = function(r){
        var div, CS = CURSORS,
        resizer = this._local.resizer = new Array(8),
        uuid = this.uuid(), buf = new js.lang.StringBuffer();
        
        for(var i=7; i>=0; i--){
            if((r & (0x01 << i)) != 0){
                div = resizer[i] = DOM.createElement("DIV");
                div.id = "resizer"+i;
                div.clazz = "jsvm_"+div.id;
                div.className = div.clazz;
                div.uuid = uuid;
                buf.clear().append("position:absolute;")
                    .append("overflow:hidden;cursor:").append(CS[i]).append(";");
                if(J$VM.ie){
                    buf.append("background-color:#FFFFFF;");
                    if(parseInt(J$VM.ie) < 10){
                        buf.append("filter:alpha(Opacity=0);");
                    }else{
                        buf.append("opacity:0;");
                    }
                }
                div.style.cssText = buf.toString();

                Event.attachEvent(div, "mousedown", 0, this, _onmousedown, i);
            }
        }
    };
    
    /**
     * Gets SizeObject from this component.
     * 
     * @see js.awt.SizeObject
     * 
     * Notes: If need sub class can override this method
     */    
    thi$.getSizeObject = function(){
        var sizeObj = this.sizeObj;
        if(!sizeObj){
            var bounds = this.getBounds();
            sizeObj = this.sizeObj = /*this;*/

            new js.awt.Component(
                    {className: "jsvm_resize_cover",
                     css: "position:absolute;",
                     x : bounds.offsetX,
                     y : bounds.offsetY,
                     z : this.getZ(),
                     width: bounds.width,
                     height:bounds.height,
                     prefSize : this.getPreferredSize(),
                     miniSize : this.getMinimumSize(),
                     maxiSize : this.getMaximumSize(),
                     stateless: true
                    },this.Runtime());
            sizeObj.insertAfter(this._coverView || this.view);

            sizeObj.setSizingPeer(this);
            
            MQ.register(sizeObj.getSizingMsgType(), this, _onsizingevent);
        }
        
        return sizeObj;
    };
    
    /**
     * Tests whether this component is resizable.
     */
    thi$.isResizable = function(){
        return (this.def.resizable || false);
    };
    
    var resizerbounds;

    /**
     * Sets whether this component is resizable.
     * 
     * @param b, true is resizable, false is unable
     * @param resizer a number 0 to 255 identifies 8 directions
     */
    thi$.setResizable = function(b, resizer){
        this._local = this._local || {};

        b = b || false;
        resizer = Class.isNumber(resizer) ? (resizer & 0x0FF) : 255;
        
        var M = this.def, U = this._local;
        if(U.resizableSettled && M.resizable === b){
            if(b == false || M.resizer === resizer){
                return;
            }else{
                this.removeResizer(true);
            }
        }

        M.resizable = b;
        M.resizer = resizer;
        M.mover = M.mover || {};
        M.mover.grid = M.mover.grid || 1;

        if(b){
            _createResizer.call(this, M.resizer);
            if(this.isDOMElement()){
                this.addResizer();
                this.adjustResizer();
            }
        }else{
            this.removeResizer(true);
        }
        
        resizerbounds = resizerbounds || {
            BBM: J$VM.supports.borderBox,
            MBP: {BW: 0, BH: 0, PW: 0, PH: 0, BPW: 0, BPH: 0}
        };
        
        U.resizableSettled = true;
    };
    
    thi$.resizableSettled = function(){
        return this._local.resizableSettled || false;
    };
    
    thi$.adjustResizer = function(bounds){
        var resizer = this._local.resizer;
        if(resizer == undefined) return;
        
        bounds = bounds || this.getBounds();
        var aCalc = ACalc, spot = this.SpotSize || SpotSize, 
        div, i, rect;
        
        for(i=0; i<8; i++){
            div = resizer[i];
            if(div == undefined) continue;
            
            rect = aCalc[i](bounds, spot);
            DOM.setBounds(div, rect.x, rect.y, rect.w, rect.h, resizerbounds);
        }
    };

    thi$.addResizer = function(){
        var resizer = this._local.resizer;
        if(resizer == undefined) return;
        
        var div, i, isDOM = this.isDOMElement();
        for(i=0; isDOM && i<8; i++){
            div = resizer[i];
            if(div){
                div.style.zIndex = this.getZ();
                DOM.insertAfter(div, this.view);
            }
        }

    };

    thi$.removeResizer = function(gc){
        var resizer = this._local.resizer;
        if(resizer == undefined) return;
        
        var div, i;
        while(resizer.length > 0){
            div = resizer.shift();
            if(div){
                DOM.remove(div, gc);
            }
        }

        delete this._local.resizer;
    };
    
    thi$.setResizerZIndex = function(z){
        var resizer = this._local.resizer;
        if(resizer == undefined) return;
        
        var div, i;
        for(i=0; i<8; i++){
            div = resizer[i];
            if(div){
                div.style.zIndex = z;
            }
        }
    };

    thi$.setResizerDisplay = function(show){
        var resizer = this._local.resizer;
        if(resizer == undefined) return;
        
        var div, i;
        for(i=0; i<8; i++){
            div = resizer[i];
            if(div){
                div.style.display = show;
            }
        }
    };
};


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
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

js.awt.PopupLayer = function () {

    var CLASS = js.awt.PopupLayer, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;

    thi$.setFloating = function(b){
        b = b || false;
        this.def.isfloating = b;
        
        if(b === true){
            this.setPMFlag(this.def.PMFlag); 
        }else{
            this.setPMFlag(0);    
        }

        this._local.floatingSettled = true;
    };

    thi$.floatingSettled = function(){
        return this._local.floatingSettled;
    };
    
    thi$.rootLayer = function(root){
        if(root){
            this._local.root = root;
        }
        
        return this._local.root || this;  
    };
    
    /**
     * Whether current floating layer can adjust the computed perferred position
     * to make more contents can be shown. Default is true.
     * Sub class can invoke it if it is need.
     */
    thi$.setAdjustPosToFit = function(b){
        this._local.adjustPosToFit = b;
    };
    
    thi$.isAdjustPosToFit = function(){
        return this._local.adjustPosToFit !== false;
    };
    
    /**
     * When any area is narrow for current floating layer. Maybe someone need to
     * adjust its size by the current available size.
     * 
     * @param bounds: {Obejct} Runtime bounds for current floating layer
     * @param area: {Object} Rectangle of the area in which the current floating 
     *        layer is lying.
     * @param nofly: {Object} Rectangle of the nofly area
     */
    thi$.setCallback = function(bounds, area, nofly){
        // Sub class can implement it if need.
    };
    
    /**
     * For some floating layer, before it is removed, something need be done at 
     * first. If so it need to implement this function.
     */ 
    thi$.beforeRemoveLayer = function(e){
        var peer = this.getPeerComponent();
        if((this == this.rootLayer()) && peer){
            MQ.post("js.awt.event.LayerEvent", 
                    new Event("beforeRemoveLayer", e || "", this), 
                    [peer.uuid()]);    
        }
    };
    
    /**
     * For some floating layer, after it is removed, something need be done. If
     * so it need to implement this function.
     * Typically, sub class may destroy the popup layer after removed.
     */
    thi$.afterRemoveLayer = function(e){
        var peer = this.getPeerComponent();
        if((this == this.rootLayer()) && peer){
            MQ.post("js.awt.event.LayerEvent", 
                    new Event("afterRemoveLayer", e || "", this), 
                    [peer.uuid()]);
        }
    };
    
    thi$.onFocusBoxBlur = function(e){
        if(((this._local.LMFlag & CLASS.F_AUTO) !== 0)
            && this.focusBox == this.focusItem){
            this.Runtime().LM.onHide(e);
        }
    };
    
    thi$.setPMFlag = function (flag, timeout) {
        flag = Class.isNumber(flag) ? flag & 0x7F : 0x27;
        timeout = Class.isNumber(timeout) ? timeout : 2000;

        this._local.LMFlag = flag;
        this._local.LMTimeout = timeout;
        
        if ((this._local.LMFlag & CLASS.F_TIMEOUT) != 0) {
            this.attachEvent("mouseover", 0, this, this.timeoutMouseover);
            this.attachEvent("mouseout", 0, this, this.timeoutMouseout);
        } else {
            this.detachEvent("mouseover", 0, this, this.timeoutMouseover);
            this.detachEvent("mouseout", 0, this, this.timeoutMouseout);
        }
        
        if ((this._local.LMFlag & CLASS.F_FOCUSBOXBLUR) != 0){
            if(this.focusBox == undefined) {
                _createFocusBox.$bind(this)();
                DOM.appendTo(this.focusBox, this.view);
                
                Event.attachEvent(this.focusBox, "blur", 1, this, this.onFocusBoxBlur);
            }
            
            this.focusItem = this.focusBox;
            this.focusBox.focus();
        } else {
            if(this.focusItem == this.focusBox){
                this.focusItem  = null;
            }
            
            if (this.focusBox != undefined) {
                Event.detachEvent(this.focusBox, "blur", 1, this, this.onFocusBoxBlur);
                
                DOM.remove(this.focusBox, true);
            }
            
            this.focusBox = null;
        }
    };
    
    thi$.getPMFlag = function () {
        return this._local.LMFlag;
    };
    
    thi$.isHideOnMouseDown = function(){
        return (this.getPMFlag() & CLASS.F_BODYMOUSEDOWN) != 0;
    };
    
    thi$.setHideOnMouseDown = function(b){
        var flag = this.getPMFlag(), $ = CLASS.F_BODYMOUSEDOWN;
        this.setPMFlag(b ? (flag | $):(flag & ~$));
    };
    
    thi$.isHideOnClick = function(b){
        return (this.getPMFlag() & CLASS.F_BODYCLICK) != 0;
    };
    
    thi$.setHideOnClick = function(b){
        var flag = this.getPMFlag(), $ = CLASS.F_BODYCLICK;
        this.setPMFlag(b ? (flag | $):(flag & ~$));
    };
    
    thi$.isHideOnMouseWheel = function(){
        return (this.getPMFlag() & CLASS.F_BODYMOUSEWHEEL) != 0;
    };
    
    thi$.setHideOnMouseWheel = function(b){
        var flag = this.getPMFlag(), $ = CLASS.F_BODYMOUSEWHEEL;
        this.setPMFlag(b ? (flag | $):(flag & ~$));
    };
    
    thi$.isHideOnBlur = function(){
        return (this.getPMFlag() & CLASS.F_FOCUSBOXBLUR) != 0;
    };
    
    thi$.setHideOnBlur = function(b){
        var flag = this.getPMFlag(), $ = CLASS.F_FOCUSBOXBLUR;
        this.setPMFlag(b ? (flag | $):(flag & ~$));
    };
    
    thi$.isHideOnTimeout = function(){
        return (this.getPMFlag() & CLASS.F_TIMEOUT) != 0;
    };
    
    thi$.setHideOnTimeout = function(b, timeout){
        var flag = this.getPMFlag(), $ = CLASS.F_TIMEOUT;
        this.setPMFlag(b ? (flag | $):(flag & ~$), timeout);
    };

    thi$.setAutoHide = function(b){
        var flag = this.getPMFlag(), $ = CLASS.F_AUTO;
        this.setPMFlag(b ? (flag | $):(flag & ~$));
    };
    
    thi$.canHide = function (e) {
        var f, type = e.getType();
        switch (type) {
        case "mousedown":
            f = CLASS.F_BODYMOUSEDOWN;
            break;
        case "click":
            f = CLASS.F_BODYCLICK;
            break;
        case "mousewheel":
        case "DOMMouseScroll":
            f = CLASS.F_BODYMOUSEWHEEL;
            break;
        case "blur":
            f = CLASS.F_FOCUSBOXBLUR;
            break;
        case "timeout":
            f = CLASS.F_TIMEOUT;
            break;
        case "hide":
            return (this._local.LMFlag & CLASS.F_AUTO) == 0;
            break;
            // IFram which has J$VM will post message when catch mousedown
        case "message": 
        case "resize":
            return true;
            break;
        }
        
        return (f & this._local.LMFlag) !== 0;
    };
    
    thi$.isShown = function () {
        return this.Runtime().LM.indexOf(this) !== -1;
    };
    
    /**
     * @param x: {Number} x of the reference position.
     * @param y: {Number} y of the reference position.
     * @param v: {Boolean} Indicate whether the nofly area of current floating
     *        layer is vertical breakthrough.
     * @param m: {Number} The specified thickness of nofly area.
     */
    thi$.showAt = function (x, y, v, m) {
        this.Runtime().LM.showAt(this, x, y, v, m);
    };

    /**
     * @param by: {HTML DOM} The specified DOM element to specify the reference
     *        position and nofly area.
     * @param v: {Boolean} Indicate whether the nofly area of current floating
     *        layer is vertical breakthrough.
     * @param m: {Number} The specified thickness of nofly area.
     */
    thi$.showBy = function (by, v, m) {
        this.Runtime().LM.showBy(this, by, v, m);
    };
    
    thi$.hide = function (type) {
        this.setAutoHide(false);
        
        var arg = arguments ? arguments[1] : undefined,
        evt = new Event(type || "hide", arg, this);
        this.Runtime().LM.onHide(evt);
    };

    thi$.hideOthers = function (type) {
        var arg = arguments ? arguments[1] : undefined,
        evt = new Event(type || "hide", arg, this);
        this.Runtime().LM.clearStack(evt);
    };
    
    var _createFocusBox = function () {
        if (this.focusBox == undefined) {
            var focusBox = this.focusBox = document.createElement("input");
            focusBox.type = "text";
            focusBox.style.cssText = "position:absolute;left:-1px;top:-2000px;"
                + "width:1px;height:1px;";
        }
    };
    
    thi$.startTimeout = function () {
        var LM = this.Runtime().LM;

        if ((this._local.LMFlag & CLASS.F_TIMEOUT) != 0) {
            this.lmtimer = 
                LM.onHide.$delay(this, this._local.LMTimeout, new Event("timeout"));
            
            System.log.println("Create timer: " + this.lmtimer);
        }
    };
    
    thi$.timeoutMouseout = function (e) {
        if (DOM.contains(this.view, e.toElement, true)){
            return;
        }
        
        this.startTimeout();
    };
    
    thi$.timeoutMouseover = function (e) {
        if (!DOM.contains(this.view, e.toElement, true))
            return;

        var LM = this.Runtime().LM;
        if(LM.onHide.$clearTimer(this.lmtimer)){
            System.log.println("Delete timer: " + this.lmtimer);
            delete this.lmtimer;    
        }
        
    };
};

js.awt.PopupLayer.F_BODYMOUSEDOWN = 0x01 << 0;
js.awt.PopupLayer.F_BODYCLICK = 0x01 << 1;
js.awt.PopupLayer.F_BODYMOUSEWHEEL = 0x01 << 2;
js.awt.PopupLayer.F_FOCUSBOXBLUR = 0x01 << 3;
js.awt.PopupLayer.F_TIMEOUT = 0x01 << 4;
js.awt.PopupLayer.F_AUTO = 0x01 << 5;

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

$package("js.awt");

js.awt.ZOrderManager = function(){

    var CLASS = js.awt.ZOrderManager, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    thi$.isZOrder = function(){
        return this.def.zorder || false;
    };
    
    thi$.setZOrder = function(b){
        this.def.zorder = b || false;
    };

    /**
     * Moves the component up, or forward, one position in the order
     * 
     * @param comp, the component
     */
    thi$.bringCompForward = function(comp, fire){
        var stack = this.def.items, comps = _allComps.call(this), compN;
        for(var i=0, len =comps.length; i<len && len > 2; i++){
            if(comp === comps[i]){
                compN = comps[i+1];
                if(compN != undefined &&  
                   ((!comp.isAlwaysOnTop() && !compN.isAlwaysOnTop()) || 
                    (comp.isAlwaysOnTop() && compN.isAlwaysOnTop()))){
                    var b = stack.splice(i, 1)[0];
                    stack.splice(i+1, 0, b);
                    this.zOrderAdjust(fire);
                    return;
                }
            }// End if (comp === comps[i])
        }
    };
    
    /**
     * Moves the component to the first position in the order
     */
    thi$.bringCompToFront = function(comp, fire){
        var stack = this.def.items,
        b = _findComp.call(this, comp, stack);
        if(comp.isAlwaysOnTop()){
            stack.push(b);
        }else{
            // Find the first not always on top, then insert it into
            var comps = _allComps.call(this);
            if(comps.length == 0){
                stack.push(b);                
            }else{
                for(var i=comps.length-1; i>=0; i--){
                    if(!comps[i].isAlwaysOnTop()){
                        stack.splice(i+1, 0, b);
                        break;
                    }else if(i == 0){
                        stack.unshift(b);
                    }
                }
            }
        }
        
        this.zOrderAdjust(fire);
    };
    
    /**
     * Moves the component down, or back, one position in the order
     */
    thi$.sendCompBackward = function(comp, fire){
        var stack = this.def.items, comps = _allComps.call(this), compN;
        for(var len =comps.length, i=len-1; i >=0 && len > 2; i--){
            if(comp === comps[i]){
                compN = comps[i-1];
                if(compN != undefined &&  
                   ((!comp.isAlwaysOnTop() && !compN.isAlwaysOnTop()) || 
                    (comp.isAlwaysOnTop() && compN.isAlwaysOnTop()))){
                    var b = stack.splice(i, 1)[0];
                    stack.splice(i-1, 0, b);
                    this.zOrderAdjust(fire);
                    return;
                }
            }// End if (comp === comps[i])
        }
    };
    
    /**
     * Moves the component to the last position in the order
     */
    thi$.sendCompToBack = function(comp, fire){
        var stack = this.def.items,
        b = _findComp.call(this, comp, stack);
        
        if(!comp.isAlwaysOnTop()){
            stack.unshift(b);
        }else{
            // Find the first not always on top, then insert it into
            var comps = _allComps.call(this);
            for(var i=comps.length-1; i>=0; i--){
                if(!comps[i].isAlwaysOnTop()){
                    stack.splice(i+1, 0, b);
                    break;
                }
            }
        }
        
        this.zOrderAdjust(fire);
        
    };
    
    /**
     * Set component always on top
     * 
     * @param comp
     * @param alwaysOnTop, boolean
     */
    thi$.setCompAlwaysOnTop = function(comp, alwaysOnTop, fire){
        if(comp.isAlwaysOnTop() === alwaysOnTop) return;
        
        if(alwaysOnTop){
            comp.def.alwaysOnTop = true;
            this.bringCompToFront(comp, fire);
        }else{
            this.sendCompToBack(comp, fire);
            comp.def.alwaysOnTop = false;
        }
        
        this.zOrderAdjust(fire);
    };
    
    /**
     * Adjust all components position in the order
     */
    thi$.zOrderAdjust = function(fire){
        if(this.isZOrder()){
            var stack = this.items(), zbase = this.def.zbase || 0;
            for(var i=stack.length-1; i>=0; i--){
                this.getElementById(stack[i]).setZ(zbase+i-stack.length, fire);
            }
        }
    };
    
    var _findComp = function(comp, comps){
        var stack = this.def.items, b;
        for(var i=0, len = comps.length; i<len && len >= 1; i++){
            if(comp.id === comps[i]){
                b = stack.splice(i, 1)[0];
                break;
            }
        }

        return b;
    };

    var _allComps = function(){
        var ret = [];
        (function(id){
             ret.push(this.getElementById(id));
         }).$forEach(this, this.def.items);

        return ret;
    };

};


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

$package("js.awt");

/**
 * A <em>LayoutManager</em> is used to implement various layout in container.<p>
 * A layout has below properties in its model:
 * @param def :{
 *     classType : the layout class
 *     ...
 *     status : optional, an object to store the result of layout
 * }
 */
js.awt.LayoutManager = function (def){

    var CLASS = js.awt.LayoutManager, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    thi$.getLayoutInfo = function(){
        return this.def;        
    };

    thi$.layoutContainer = function(container, force){
        var comps = container.items0(), i, len, comp;
        for(i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]];
            if(comp && comp.needLayout(force)){
                comp.doLayout(force);
            }
        }
    };
    
    /**
     * Adds the specified component to the layout, using the specified
     * constraint object.
     * @param comp the component to be added
     * @param constraints  where/how the component is added to the layout.
     */
    thi$.addLayoutComponent = function(comp, constraints){
        // Should override by sub class
    };
    
    thi$.removeLayoutComponent = function(comp){
        // Implements by sub class
    };

    /**
     * Invalidates the layout, indicating that if the layout manager
     * has cached information it should be discarded.
     */
    thi$.invalidateLayout = function(container){
        // Implements by sub class          
    };
    
    /**
     * 
     * Notes: Every layout should override this method
     */
    thi$.getLayoutSize = function(container, fn, nocache){
        var comps = container.items0(),
        comp, bounds = container.getBounds(), d,
        w = 0, h = 0, i, len;
        
        for(i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]];

            if(!comp.isVisible()) continue;
            
            d = comp[fn](nocache);
            w = Math.max(w, (comp.getX() + d.width));
            h = Math.max(h, (comp.getY() + d.height));
        }

        w += bounds.MBP.BW;
        h += bounds.MBP.BH;
        
        return {width:w, height:h};
    };

    /**
     * Calculates the preferred size dimensions for the specified 
     * container, given the components it contains.
     * @param container the container to be laid out
     *  
     * @see #minimumLayoutSize
     */
    thi$.preferredLayoutSize = function(container, nocache){
        return this.getLayoutSize(container, "getPreferredSize", nocache);  
    };

    /** 
     * Calculates the minimum size dimensions for the specified 
     * container, given the components it contains.
     * @param container the component to be laid out
     * @see #preferredLayoutSize
     */
    thi$.minimumLayoutSize = function(container, nocache){
        return this.getLayoutSize(container, "getMinimumSize", nocache);
    };
    
    /** 
     * Calculates the maximum size dimensions for the specified container,
     * given the components it contains.
     * @see java.awt.Component#getMaximumSize
     */
    thi$.maximumLayoutSize = function(container, nocache){
        return this.getLayoutSize(container, "getMaximumSize", nocache);
    };
    
    /**
     * Returns the alignment along the x axis.  This specifies how
     * the component would like to be aligned relative to other 
     * components.  The value should be a number between 0 and 1
     * where 0 represents alignment along the origin, 1 is aligned
     * the furthest away from the origin, 0.5 is centered, etc.
     */
    thi$.getLayoutAlignmentX = function(){
        var align = this.def.align_x;
        return Class.isNumber(align) ? align : 0.5; 
    };

    /**
     * Returns the alignment along the y axis.  This specifies how
     * the component would like to be aligned relative to other 
     * components.  The value should be a number between 0 and 1
     * where 0 represents alignment along the origin, 1 is aligned
     * the furthest away from the origin, 0.5 is centered, etc.
     */
    thi$.getLayoutAlignmentY = function(){
        var align = this.def.align_y;
        return Class.isNumber(align) ? align : 0.5; 
    };
    
    thi$.destroy = function(){
        delete this.def;

        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);
    
    
    thi$._init = function(def){
        this.def = def || {};
        this.def.classType =  "js.awt.LayoutManager";
    };

    this._init.apply(this, arguments);

}.$extend(js.lang.Object);


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

$package("js.awt");

$import("js.awt.LayoutManager");

/**
 * A <em>LayoutManager</em> is used to implement various layout in container.<p>
 * A layout has below properties in its model:
 * @param def :{
 *     classType : the layout class
 *     ...
 *     status : optional, an object to store the result of layout
 * }
 */
js.awt.AbstractLayout = function (def){

    var CLASS = js.awt.AbstractLayout, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event,  DOM = J$VM.DOM;

    /**
     * Adds the specified component to the layout, using the specified
     * constraint object.
     * @param comp the component to be added
     * @param constraints  where/how the component is added to the layout.
     */
    thi$.addLayoutComponent = function(comp, constraints){
        var ele = comp.view;
        if(ele && ele.style){
            ele.style.position = "absolute";
        }
    }.$override(this.addLayoutComponent);

    
    thi$.destroy = function(){
        this.def = null;

        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);

    thi$._init = function(def){
        this.def = def || {};

        this.def.classType =  
            this.def.classType || "js.awt.AbstractLayout";

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.LayoutManager);


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

$package("js.awt");

/**
 * A border layout lays out a container, arranging and resizing its components to fit in 
 * five regions: north, south, east, west, and center. Each region may contain no more than 
 * one component, and is identified by a corresponding constant: NORTH, SOUTH, EAST, WEST, 
 * and CENTER.
 * 
 * @param def :{
 *     classType : the layout class
 *     vgap: 0,
 *     hgap: 0,
 *     mode: 0|1
 *     status : an object to store the result of layout
 * } 
 */
js.awt.BorderLayout = function (def){

    var CLASS = js.awt.BorderLayout, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;
    
    /**
     * Adds the specified component to the layout, using the specified constraint object. 
     * For border layouts, the constraint must be one of the following constants: 
     * NORTH, SOUTH, EAST, WEST, or CENTER.
     */
    thi$.addLayoutComponent = function(comp, constraints){
        var name = constraints || CLASS.CENTER;
        var status = this.def.status, id = comp.id;

        arguments.callee.__super__.apply(this, arguments);

        switch(name){
        case "center":
            status.center = id;
            break;
        case "north":
            status.north = id;
            break;
        case "south":
            status.south = id;
            break;
        case "east":
            status.east = id;
            break;
        case "west":
            status.west = id;
            break;
        default:
            //throw "Cannot add to layout: unknown constraint: " + name;
        }

    }.$override(this.addLayoutComponent);
    
    thi$.removeLayoutComponent = function(comp){
        var status = this.def.status, id = comp.id;
        if(id == status.center){
            status.center = null;
        }else if(id == status.north){
            status.north = null;
        }else if(id == status.south){
            status.south = null;
        }else if(id == status.east){
            status.east = null;
        }else if(id == status.west){
            status.west = null;
        }

    }.$override(this.removeLayoutComponent);
    
    thi$.invalidateLayout = function(container){
        var status = this.def.status;
        status.north = null;
        status.south = null;
        status.east  = null;
        status.west  = null;
        status.center= null;

    }.$override(this.invalidateLayout);

    thi$.layoutContainer = function(container, force){

        switch(this.def.mode){
        case 0:
            _mode0Layout.call(this, container, force);
            break;
        case 1:
            _mode1Layout.call(this, container, force);
            break;
        default:
            throw "Unsupport layout mode "+this.def.mode;
            break;
        }
    }.$override(this.layoutContainer);

    var _mode0Layout = function(container, force){
        var setting = this.def, bounds = container.getBounds(),
        vgap = setting.vgap || 0, hgap = setting.hgap || 0,
        xbase = bounds.MBP.paddingLeft, left = 0,
        ybase = bounds.MBP.paddingTop,  top = 0, 
        right = bounds.innerWidth, bottom= bounds.innerHeight,
        d, comp;
        
        if((comp = _getComp.call(this, "north", container)) != null){
            comp.setWidth(bounds.innerWidth, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            top += d.height + vgap;
        }

        if((comp = _getComp.call(this, "south", container)) != null){
            comp.setWidth(bounds.innerWidth, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase + bounds.innerHeight - d.height, 3);
            bottom -= d.height + vgap;
        }

        if((comp = _getComp.call(this, "east", container)) != null){
            comp.setHeight(bottom - top, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+right - d.width, ybase+top, 3);
            right -= d.width + hgap;
        }

        if((comp = _getComp.call(this, "west", container)) != null){
            comp.setHeight(bottom - top, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            left += d.width + hgap;
        }

        if((comp = _getComp.call(this, "center", container)) != null){
            var fire = force === true ? 0x0F : 0x07;
            comp.setSize(right-left, bottom-top, fire);
            comp.setPosition(xbase+left, ybase+top, fire);
        }
    };

    var _mode1Layout = function(container, force){
        var setting = this.def, bounds = container.getBounds(),
        vgap = setting.vgap || 0, hgap = setting.hgap || 0,
        xbase = bounds.MBP.paddingLeft, left = 0,
        ybase = bounds.MBP.paddingTop,  top = 0, 
        right = bounds.innerWidth, bottom= bounds.innerHeight,
        d, comp;
        
        if((comp = _getComp.call(this, "west", container)) != null){
            comp.setHeight(bounds.innerHeight, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            left += d.width + hgap;
        }

        if((comp = _getComp.call(this, "east", container)) != null){
            comp.setHeight(bounds.innerHeight, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+bounds.innerWidth - d.width, ybase+top, 3);
            right -= d.width + hgap;
        }

        if((comp = _getComp.call(this, "south", container)) != null){
            comp.setWidth(right - left, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+bounds.innerHeight-d.height, 3);
            bottom -= d.height + vgap;
        }

        if((comp = _getComp.call(this, "north", container)) != null){
            comp.setWidth(right - left, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            top += d.height + vgap;
        }

        if((comp = _getComp.call(this, "center", container)) != null){
            var fire = force === true ? 0x0F : 0x07;
            comp.setSize(right-left, bottom-top, fire);
            comp.setPosition(xbase+left, ybase+top, fire);
        }
    };
    
    var _getComp = function(name, container){
        var id = this.def.status[name], 
        comp = id ? container.getComponent(id) : null;

        return (comp && comp.isVisible()) ? comp : null;
    };
    
    thi$._init = function(def){
        def = def || {};
        
        def.classType = "js.awt.BorderLayout";
        def.mode = def.mode || 0;
        def.hgap = def.hgap || 0;
        def.vgap = def.vgap || 0;
        def.status = def.status || {
            north: null,
            south: null,
            east : null,
            west : null,
            center: null
        };

        arguments.callee.__super__.apply(this, arguments);        

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.AbstractLayout);

js.awt.BorderLayout.NORTH = "north";
js.awt.BorderLayout.SOUTH = "south";
js.awt.BorderLayout.EAST  = "east";
js.awt.BorderLayout.WEST  = "west";
js.awt.BorderLayout.CENTER= "center";


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

$package("js.awt");

/**
 * A layout manager that allows multiple components to be laid out either vertically 
 * or horizontally. The components will not wrap so, for example, a vertical arrangement 
 * of components will stay vertically arranged when the frame is resized.
 * 
 * @param def :{
 *     classType : the layout class
 *     setting : {axis: [0(horizontally)|1(vertically)], gap:0 }
 *     status : an object to store the result of layout
 * } 
 */
js.awt.BoxLayout = function (def){

    var CLASS = js.awt.BoxLayout, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    thi$.layoutContainer = function(container){

        var setting = this.def, bounds = container.getBounds(),
        gap = setting.gap || 0, axis = setting.axis || 0,
        space = (axis == 0) ? bounds.innerWidth : bounds.innerHeight,
        xbase = bounds.MBP.paddingLeft, left = 0,
        ybase = bounds.MBP.paddingTop,  top = 0,
        comps = container.items0(), comp,
        rects = [], d, r, c = 0;

        for(var i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]]; 

            if(!comp.isVisible()) continue;

            d = comp.getPreferredSize();
            r = {};

            if(axis == 0){
                // Horizontally
                // Calculates the top of every components
                r.top = (bounds.innerHeight - d.height)*this.getLayoutAlignmentY();
                if(!comp.isRigidHeight()){
                    r.top = 0;
                    r.height = bounds.innerHeight;
                }else{
                    r.height = d.height;
                }
                // Get width if the component is rigid width
                r.width = comp.isRigidWidth() ? d.width : null;
                if(r.width != null) {
                    space -= r.width;
                }else{
                    c += 1;
                }
            }else{
                // Vertically
                // Calculates the left of every components
                r.left = (bounds.innerWidth - d.width)*this.getLayoutAlignmentX();
                if(!comp.isRigidWidth()){
                    r.left = 0;
                    r.width = bounds.innerWidth;
                }else{
                    r.width = d.width;
                }
                // Get height if the component is rigid height
                r.height = comp.isRigidHeight() ? d.height : null;
                if(r.height != null){
                    space -= r.height;
                }else{
                    c += 1;
                }
            }

            r.comp = comp;
            rects.push(r);
        }
        
        if(rects.length > 1){
            space -= (rects.length - 1)*gap;
        }
        
        if(c > 1){
            space = Math.round(space/c);
        }

        if(c == 0){
            // All components are rigid
            if(axis == 0){
                left = Math.round(space*this.getLayoutAlignmentX());
            }else{
                top  = Math.round(space*this.getLayoutAlignmentY());
            }
        }
        
        for(i=0, len=rects.length; i<len; i++){
            r = rects[i]; comp = r.comp;
            if(axis == 0){
                if(r.width == null) r.width = space;
                comp.setBounds(xbase+left, ybase+r.top, r.width, r.height, 3);
                left += r.width + gap;
            }else{
                if(r.height== null) r.height= space;
                comp.setBounds(xbase+r.left, ybase+top, r.width, r.height, 3);
                top += r.height + gap;
            }
        }

    }.$override(this.layoutContainer);
    
    thi$._init = function(def){
        def = def || {};

        def.classType = "js.awt.BoxLayout";
        def.axis = def.axis || 0;
        def.gap  = def.gap || 0;

        arguments.callee.__super__.apply(this, arguments);        

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.AbstractLayout);


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

$package("js.awt");

/**
 * A CardLayout object is a layout manager for a container. 
 * It treats each component in the container as a card. Only one 
 * card is visible at a time, and the container acts as a stack 
 * of cards. The first component added to a CardLayout object 
 * is the visible component when the container is first displayed.

 */
js.awt.CardLayout = function (def){

    var CLASS = js.awt.CardLayout, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;


    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    /**
     * Adds the specified component to the layout, using the specified
     * constraint object.
     * @param comp the component to be added
     * @param constraints  where/how the component is added to the layout.
     */
    thi$.addLayoutComponent = function(comp, constraints){
        arguments.callee.__super__.apply(this, arguments);

        var container = comp.getContainer(), bounds;
        if(container.isDOMElement()){
            bounds = container.getBounds();
            comp.setBounds(bounds.MBP.paddingLeft, 
                           bounds.MBP.paddingTop, 
                           bounds.innerWidth, 
                           bounds.innerHeight);
        }
    }.$override(this.addLayoutComponent);

    thi$.layoutContainer = function(container){

        var comps = container.items(), bounds = container.getBounds(),
        MBP = bounds.MBP, comp, i, len;
        
        for(i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]];

            comp.setBounds(MBP.paddingLeft, MBP.paddingTop, 
                           bounds.innerWidth, bounds.innerHeight, 3);
        }
        
        if(!this._hasDisp){
            comp = container[comps[this.def.status.index]];
            if(comp){
                this.show(container, this.def.status.index);    
            }
            this._hasDisp = true;
        }

    }.$override(this.layoutContainer);
    
    /**
     * Flips to the first card of the container.
     */
    thi$.first = function(container){
        var items = container.items0(), 
        index = this.def.status.index = 0;
        this.show(container, index);
    };
    
    /**
     * Flips to the next card of the specified container. 
     * If the currently visible card is the last one, 
     * this method flips to the first card in the layout.
     */
    thi$.next = function(container){
        var items = container.items0(), index;
        if(items.length > 0){
            index = (this.def.status.index+1)%items.length;
            this.def.status.index = index;
            this.show(container, index);
        }
    };
    
    /**
     * Flips to the previous card of the specified container. 
     * If the currently visible card is the first one, 
     * this method flips to the last card in the layout.
     */
    thi$.previous = function(container){
        var items = container.items0(), index;
        if(items.length > 0){
            index = this.def.status.index - 1;
            index = index < 0 ? items.length-1 : index;
            this.def.status.index = index;
            this.show(container, index);
        }
    };
    
    /**
     * Flips to the last card of the container.
     */
    thi$.last = function(container){
        var items = container.items0(), 
        index = this.def.status.index = items.length - 1;

        this.show(container, index);
    };
    
    /**
     * Flips to the component that was added to this layout 
     * with the specified id. If no such component exists, 
     * then nothing happens.
     * 
     * @param container
     * @param index
     */
    thi$.show = function(container, index){
        if(!Class.isNumber(index)) return;

        var items = container.items0(), compid = items[index], 
        item, comp;

        this.def.status.index = index;
        
        items = container.items();
        (function(id, i){
             if(id == compid){
                 item = items.splice(i, 1)[0];    
                 throw "break";
             }
         }).$forEach(this, items);

        if(item){
            items.push(item);

            for(var i=items.length-1; i>=0; i--){
                compid = items[i];
                comp = container.getComponent(compid);
                comp.setZ(i-items.length);
                if(item == compid){
                    comp.setVisible(true);
                }else{
                    comp.setVisible(false);
                }
            }
        }
    };
    
    thi$._init = function(def){
        def = def || {};
        
        def.classType = "js.awt.CardLayout";
        def.mode = def.mode || 0;
        def.status = def.status || {};
        def.status.index = def.status.index || 0;

        arguments.callee.__super__.apply(this, arguments);        

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.AbstractLayout);


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

$package("js.awt");

/**
 * A layout manager that allows multiple components to be laid out either vertically 
 * or horizontally. The components will not wrap so, for example, a vertical arrangement 
 * of components will stay vertically arranged when the frame is resized.
 * 
 * @param def :{
 *     classType : the layout class
 *     axis: 0(horizontally)|1(vertically)|2(horizontally & multi-line)|3(vertically & multi-column), 
 *     hgap:0, 
 *     vgap:0,
 *     align_x:0.0,
 *     align_y:0.0, 
 *     status : an object to store the result of layout
 * } 
 */
js.awt.FlowLayout = function (def){

    var CLASS = js.awt.FlowLayout, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    thi$.layoutContainer = function(container){
        var setting = this.def;
        switch(setting.axis){
        case 0:
            _axis0Layout.call(this, container);
            break;
        case 1:
            _axis1Layout.call(this, container);
            break;
        case 2:
            _axis2Layout.call(this, container);
            break;
        case 3:
            _axis3Layout.call(this, container);
            break;
        default:
            throw "Unsupport axis "+setting.axis;
            break;
        }
    }.$override(this.layoutContainer);

    var _axis0Layout = function(container){
        var setting = this.def, bounds = container.getBounds(),
        gap = setting.hgap, comps = container.items0(),
        xbase = bounds.MBP.paddingLeft, left = 0,
        ybase = bounds.MBP.paddingTop,  top = 0,
        rigid = container.isRigidWidth(), comp, i, len,
        d = _axis0Size.call(
            this, container, bounds, "getPreferredSize");
        left = xbase + (rigid ? (bounds.innerWidth - d.width) * this.getLayoutAlignmentX():0);

        for(i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]];
            if(!comp.isVisible()) continue;
            
            rigid = comp.isRigidHeight();
            d = comp.getPreferredSize();
            top = ybase + (rigid ? 
                           (bounds.innerHeight-d.height)*this.getLayoutAlignmentY():0);
            comp.setBounds(left, top, d.width, (rigid ? d.height:bounds.innerHeight),3);
            left += d.width + gap;
        };
    };

    var _axis1Layout = function(container){
        var setting = this.def, bounds = container.getBounds(),
        gap = setting.vgap, comps = container.items0(),
        xbase = bounds.MBP.paddingLeft, left = 0,
        ybase = bounds.MBP.paddingTop,  top = 0,
        rigid = container.isRigidHeight(), comp, i, len,
        d = _axis1Size.call(
            this, container, bounds, "getPreferredSize");
        top = ybase + (rigid ? (bounds.innerHeight - d.height) * this.getLayoutAlignmentY():0);

        for(i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]];
            if(!comp.isVisible()) continue;

            rigid = comp.isRigidWidth();
            d = comp.getPreferredSize();
            left = xbase + (rigid ? 
                            (bounds.innerWidth-d.width)*this.getLayoutAlignmentX():0);
            comp.setBounds(left, top, (rigid ? d.width:bounds.innerWidth), d.height, 3);
            top += d.height + gap;
        }
    };

    var _axis2Layout = function(container){
        // TODO:
    };

    var _axis3Layout = function(container){
        // TODO:
    };
    
    /**
     * Gets average width of all components in axis 0 mode 
     */
    thi$.getAverageWidth= function(container){
        var d = _axis0Size.call(this, container, null, "getPreferredSize");
        return d.count > 0 ? d.width/d.count : 0;
    };

    /**
     * Gets average height of all components in axis 1 mode 
     */
    thi$.getAverageHeight= function(container){
        var d = _axis1Size.call(this, container, null, "getPreferredSize");
        return d.count > 0 ? d.height/d.count : 0;
    };
    
    var _axis0Size = function(container, bounds, fn){
        var setting = this.def, gap = setting.hgap,
        comps = container.items0(),
        d, w = 0, h = 0, n= 0, comp, i, len;
        
        for(i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]];
            if(!comp.isVisible()) continue;

            n++;
            d = comp[fn]();
            w += d.width + gap;
            h = Math.max(h, d.height);
        };

        w -= gap;

        return {
            width : w,
            height: h,
            count : n
        };
    };

    var _axis1Size = function(container, bounds, fn){
        var setting = this.def, gap = setting.vgap,
        comps = container.items0(),
        d, w = 0, h = 0, n = 0, comp, i, len;
        
        for(i=0, len=comps.length; i<len; i++){
            comp = container[comps[i]];
            if(!comp.isVisible()) continue;

            n++;
            d = comp[fn]();
            h += d.height + gap;
            w = Math.max(w, d.width);
        }

        h -= gap;

        return {
            width : w,
            height: h,
            count : n
        };
    };

    var _axis2Size = function(container, bounds, fn){
        // TODO: 
        return {
            width : 0,
            height: 0
        };
    };

    var _axis3Size = function(container, bounds, fn){
        // TODO:
        return {
            width : 0,
            height: 0
        };
    };


    thi$._init = function(def){
        def = def || {};
        
        def.classType = "js.awt.FlowLayout";
        def.axis = def.axis || 0;
        def.hgap = def.hgap || 0;
        def.vgap = def.vgap || 0;

        def.align_x = def.align_x || 0.0;
        def.align_y = def.align_y || 0.0;

        arguments.callee.__super__.apply(this, arguments);        

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.AbstractLayout);


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
 * Author: Lv xianhao
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 * 
 * Jul 1, 2012: Rewrote layout algorithm by Hu Dong by introduce js.awt.Grid class 
 */

$package("js.awt");

/**
 * A Grid layout lays out a container's components in a rectangular grid. 
 * The container is divided into many rectangles, and one component is placed 
 * in each rectangle. 
 * 
 * @param def :{
 *     classType : the layout class
 *     rowNum: m,
 *     colNum: n,
 *     rows:[{index, measure, rigid, weight, visible},{}...],
 *     cols:[{index, measure, rigid, weight, visible},{}...],
 *     cells:[
 *       {rowIndex, colIndex, rowSpan, colSpan, paddingTop...},
 *       ...
 *     ]
 * } 
 */
js.awt.GridLayout = function (def){

    var CLASS = js.awt.GridLayout, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;
    
    /** 
     * Lays out the specified container using this layout. 
     * This method reshapes the components in the specified target 
     * container in order to satisfy the constraints of the GridLayout. 
     * The grid layout determines the size of individual 
     * components by dividing the free space in the container into 
     * equal-sized portions according to the number of rows and columns 
     * in the layout. The container's free space equals the container's 
     * size minus any insets and any specified horizontal or vertical 
     * gap. All components in a grid layout are given the same size. 
     */    
    thi$.layoutContainer = function(container){
        var bounds = container.getBounds(), MBP = bounds.MBP, 
        grid = this.grid, items = container.items0(), comp, 
        constraints, rIdx, cIdx, cell, x, y, w, h, compz;
        
        grid.layout(MBP.paddingLeft, MBP.paddingTop, 
                    bounds.innerWidth, bounds.innerHeight);

        for(var i=0, len=items.length; i<len; i++){
            comp = container[items[i]];
            if(!comp.isVisible()) continue;

            constraints = comp.def.constraints;
            cell = grid.cell(constraints.rowIndex, constraints.colIndex);
            if(cell && cell.visible){
                compz = comp.getPreferredSize();
                x = cell.x + cell.paddingLeft;
                y = cell.y + cell.paddingTop;

                if(comp.isRigidWidth()){
                    x += (cell.innerWidth - compz.width)*comp.getAlignmentX();
                    w = compz.width;
                }else{
                    w = cell.innerWidth;
                }

                if(comp.isRigidHeight()){
                    y += (cell.innerHeight- compz.height)*comp.getAlignmentY();
                    h = compz.height;
                }else{
                    h = cell.innerHeight;
                }
                
                comp.setBounds(x, y, w, h, 3);
            }else{
                comp.display(false);
            }
        }

    }.$override(this.layoutContainer);

    thi$._init = function(def){
        def = def || {};

        def.classType = "js.awt.GridLayout";
        arguments.callee.__super__.apply(this, arguments);
        
        this.grid = new (Class.forName("js.awt.Grid"))(def);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.AbstractLayout);


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
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

$import("js.awt.Cover");
$import("js.awt.Element");

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

    }.$override(this.setPosition);

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

    }.$override(this.setZ);
    
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

    }.$override(this.setSize);
    
    
    thi$.setBounds = function(x, y, w, h){
        var M = this.def, bounds = this.getBounds();
        
        DOM.setBounds(this.view, x, y, w, h, bounds);
        
        M.x = bounds.x; 
        M.y = bounds.y;
        M.width = bounds.width; 
        M.height= bounds.height;
        
        this._adjust("resize");

    }.$override(this.setBounds);

    thi$.invalidateBounds = function(){
        this.view.bounds = null;
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

        var sizeChanged = function(value, sp){
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
    }.$override(this.display);

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
        arguments.callee.__super__.apply(this,arguments);
        this._adjust("remove");
    }.$override(this.removeFrom);
    
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
        if(!this.needLayout(force) || 
           (this.getStyle("display") === "none")) return false;

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
        if(this.destroied != true){
            if(this._coverView){
                this.removeCover();
            }
            
            var view = this.view;
            delete this.view;
            
            DOM.remove(view, true);

            arguments.callee.__super__.apply(this, arguments);    
        }
    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime, view){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.BaseComponent";

        arguments.callee.__super__.apply(this, arguments);
        
        if(view){
            this.view = view;
            def.className = view.clazz || def.className;
        }else{
            this.view = view = DOM.createElement(def.viewType || "DIV");
            def.className = def.className || "jsvm_comp";
            view.clazz = view.className = def.className; 
        }
        
        view = this.view;
        view.uuid = this.uuid();
        view.id = def.id || (this.classType() + "." + js.awt.Element.count);

        this.className = def.className;
        if(def.css) view.style.cssText = view.style.cssText + def.css;
        if(view.tagName != "BODY" && view.tagName != "CANVAS"
           && view.cloned != "true"){
            _preparegeom.call(this, def.NUCG);    
        }

        this._geometric = function(){
            var o = _geometric.call(this);
            delete this._geometric;
            return o;
        };
        
        if(def.useUserDefinedTip === true){
            this.setTipUserDefined(true);
        }else{
		    var tip = def.tip;
		    if(Class.isString(tip) && tip.length > 0) {
			    this.setToolTipText(tip);
		    }
        }
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Element).$implements(js.awt.Cover);



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

$package("js.awt");

$import("js.awt.BaseComponent");
$import("js.awt.Editable");
$import("js.awt.Movable");
$import("js.awt.PopupLayer");
$import("js.awt.Resizable");
$import("js.awt.Shadow");
$import("js.util.Observer");

/**
 * A <em>component</em> is an object having a graphical representation
 * that can be displayed in the browser and that can interact with the
 * user.<p>
 * 
 * The <em>model</em> of a <em>component</em> as below:<p>
 *@param def : {
 *	   classType : class type of this component
 *	   id : string to identify a component
 *	   
 * 
 *	   x : position left,
 *	   y : position top,
 *	   width : outer width of the componet,
 *	   height: outer height of the component,
 *	   miniSize: {width, height},
 *	   maxiSize: {width, height},
 *	   prefSize: {width, height},
 *	   rigid_w: true|false
 *	   rigid_h: true|false	
 *	   align_x: 0.0|0.5|1.0
 *	   align_y: 0.0|0.5|1.0
 *	   
 *	   className : style class
 *	   css: css text
 * 
 *	   state : number, see also <code>js.util.State</code>
 *	   
 *	   mover : {delay, bound ...}, see also <code>js.awt.Movable</code>
 *	   movable : true/false,
 *	   
 *	   resizer : 8 bits number to define 8 directions resize, see also 
 *				 <code>js.awt.Resizable</code>,
 *	   resizable : true/false
 * 
 *	   alwaysOnTop: true/false
 * }<p>
 * 
 * The <em>Runtime</em> is runtime context, it may includes:
 * @param Runtime :{
 *	   imgPath : The image path,
 *	   ...
 * }<p>
 * 
 * When new a <em>component</em> will create a DIV element as the <em>View</em>
 * of this component. But you also can use an existing view to instead of the
 * view.
 * @param view,	 a document element	 
 */
js.awt.Component = function (def, Runtime, view){

	var CLASS = js.awt.Component, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ;

	/**
	 * Set position of the component.<p>
	 * 
	 * @param x, the position left
	 * @param y, the position top
	 * @param fire		 1: raise <em>moved</em>  event
	 *					 2: doLayout
	 *					 4: set this position as original position
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
	 * @param fire		 1: raise <em>resized</em>	event
	 *					 2: doLayout
	 *					 4: set this size as original size
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
	
	thi$._adjust = function(cmd, show){
		switch(cmd){
		case "move":
		case "resize":
			var bounds = this.getBounds();
			this.adjustCover(bounds);
			this.adjustResizer(bounds);
			this.adjustShadow(bounds);
			break;
		case "zorder":
			var z = this.getZ();
			this.setCoverZIndex(z);
			this.setResizerZIndex(z);
			this.setShadowZIndex(z);
			break;
		case "display":
			this.setCoverDisplay(show);
			this.setResizerDisplay(show);
			this.setShadowDisplay(show);
			break;
		case "remove":
			this.removeCover();
			this.removeResizer();			 
			this.removeShadow();
			break;
		}

	}.$override(this._adjust);
	
	/**
	 * Tests whether this component has scroll bar
	 * 
	 * @return {
	 *	 hscroll: true/false, 
	 *	 vscroll: true/false
	 * }
	 */
	thi$.hasScrollbar = function(){
		return DOM.hasScrollbar(this.view);
	};

	/**
	 * Apply a style set to the component.<p>
	 * 
	 * @param styles, an object with key are style name and value are style value. 
	 */
	thi$.applyStyles = function(styles){

		if(arguments.callee.__super__.apply(this, arguments)){
			this.onGeomChanged(0x02);			 
		}

	}.$override(this.applyStyles);
	
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
	
	/**
	 * Sets container of this component
	 */
	thi$.setContainer = function(container){
		arguments.callee.__super__.apply(this, arguments);

		if(container && this.isMovable() && 
		   container instanceof js.awt.Container && 
		   container.isAutoFit()){
			var moveObj = this.getMoveObject(),
			msgType = moveObj.getMovingMsgType();
			MQ.register(msgType, this, _onMovingEvent);
			moveObj.releaseMoveObject();
			delete this.moveObj;
		}

	}.$override(this.setContainer);

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
	 * Handler of the component which is moving in an 
	 * auto fit container 
	 */
	var _onMovingEvent = function(e){
		var container = this.getContainer();
		if (container && container._local
			&& container._local.autoArrange == undefined) {
			container._local.autoArrange = container.def.autoArrange;
			container.def.autoArrange = false;
		}

		this.autoResizeContainer();
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

		dialog.show();
		return dialog;
	};
	
	/**
	 * Open confirm dialog
	 * 
	 * @param className, the definition of dialog
	 * @param rect, x, y, width and height
	 * @param def, ,an object like:{
	 *	   className: "",
	 *	   model: {
	 *		   msgSubject: "",
	 *		   msgContent: ""
	 *	   }
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
	 * When this component was add to DOM tree, then invokes
	 * this method. 
	 * 
	 * @return Must return true if did repaint.
	 * 
	 * Notes: Sub class should override this method
	 */
	thi$.repaint = function(){
		if(arguments.callee.__super__.apply(this, arguments)){
			var M = this.def;

			// Create mover for moving if need
			if(M.movable === true && !this.movableSettled()){
				this.setMovable(true);
			}
			
			// Create resizer for resizing if need
			if(M.resizable === true && !this.resizableSettled()){
				this.setResizable(true, M.resizer);
			}
			
			// For shadow
			if(M.shadow === true && !this.shadowSettled()){
				this.setShadowy(true);
			}
			
			// For floating layer
			if(M.isfloating === true && !this.floatingSettled()){
				this.setFloating(true);
			}

			if(this.resizableSettled()){
				this.addResizer();
				this.adjustResizer();
			}
			
			if(this.shadowSettled()){
				this.addShadow();
				this.adjustShadow();
			}
			
			this.showDisableCover(!this.isEnabled());

			return true;
		}

		return false;

	}.$override(this.repaint);
	
	/**
	 * @see js.awt.BaseComponent
	 */
	thi$.doLayout = function(force){
		if(arguments.callee.__super__.apply(this, arguments)){
			var ctrl = this.controller;
			if(ctrl){
				ctrl.appendTo(this.view); // Keep controller alwasy on top
				var bounds = this.getBounds(), cbounds = ctrl.getBounds(),
				x, y, w, h;
				w = ctrl.isRigidWidth() ? cbounds.width : bounds.innerWidth;
				h = ctrl.isRigidHeight()? cbounds.height: bounds.innerHeight;
				x = bounds.MBP.paddingLeft + (bounds.innerWidth - w)*ctrl.getAlignmentX();
				y = bounds.MBP.paddingTop  + (bounds.innerHeight- h)*ctrl.getAlignmentY();

				ctrl.setBounds(x, y, w, h, 7);
			}
			return true;
		}

		return false;

	}.$override(this.doLayout);
	
	/**
	 * When this component was moved to a new position will 
	 * invoke this method,
	 * 
	 * 
	 * Notes: Sub class maybe should override this method
	 */
	thi$.onMoved = function(fire){
		var container = this.getContainer();
		if (container && container._local
			&& container._local.autoArrange != undefined) {
			container.def.autoArrange = container._local.autoArrange;
			delete container._local.autoArrange;
		}
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
		var container = this.getContainer();
		if (container && container._local
			&& container._local.autoArrange != undefined) {
			container.def.autoArrange = container._local.autoArrange;
			delete container._local.autoArrange;
		}
		// Adjust the container's size to handle the scrollbars
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
	
	/**
	 * Indicate whether the state can affect the style
	 * of current Component.
	 */ 
	thi$.isStyleByState = function(){
		return !this.isStateless() 
			&& (this.def.styleByState !== false);
	};

	thi$.onStateChanged = function(e){
		if(this.isStyleByState()){
			var buf = this.__buf__.clear();
			buf.append(this.def.className).append("_")
				.append(this.getState());
			this.view.className = buf.toString();
		}		 
		
		if(this.view.parentNode){
			this.showDisableCover(!this.isEnabled());
		}
	};

	/**
	 * Override destroy method of js.lang.Object
	 */
	thi$.destroy = function(){
        if(this.destroied != true){
		    this.setShadowy(false);
		    this.setResizable(false);
		    this.setMovable(false);

		    if(this.controller){
			    this.controller.destroy();
			    delete this.controller;
		    }

		    var container = this.container;
		    if(container && container instanceof js.awt.Container){
			    container.removeComponent(this);
		    }

		    delete this.container;		  
		    delete this.peer;

		    arguments.callee.__super__.apply(this, arguments);
        }
	}.$override(this.destroy);
	
	thi$.getLastResizer = function(){
		var resizer = this._local.resizer, 
		len = resizer ? resizer.length : 0,
		el;
		
		for(var i = 0; i < len; i++){
			el = resizer[i];
			if(el){
				return el;
			}
		}
		
		return undefined;
	};

	/**
	 * When some propery of component was changed, it may cause the layout of parent component change,
	 * So we must find the parent component which take charge of the change and redo layout.
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

	thi$._init = function(def, Runtime, view){
		if(def == undefined) return;

		def.classType = def.classType || "js.awt.Component";
		
		arguments.callee.__super__.apply(this, arguments);
		view = this.view;

		var buf = this.__buf__ = new js.lang.StringBuffer();
		
		if(!this.isStateless()){
			def.state = def.state || 0;
			
			if(this.isStyleByState()){
				view.className = buf.append(def.className).append("_")
					.append(this.getState()).toString();
			}
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
	
}.$extend(js.awt.BaseComponent).$implements(
	js.util.Observer, js.awt.Shadow, 
	js.awt.Movable, js.awt.MoveObject, 
	js.awt.Resizable, js.awt.SizeObject, 
	js.awt.Editable, js.awt.PopupLayer);


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

$package("js.awt");

$import("js.awt.Component");
$import("js.awt.Containable");
$import("js.awt.ZOrderManager");

/**
 * A generic container object is a component that can contain other components.<p>
 * A container has below properties in its model:
 * @param def :{
 *     zorder : true/false
 *     layout : {classType, setting, status}, see also 
 *              <code>js.awt.Layout</code>
 *     items :array of children components ID,
 *     id : the <em>model</em> of child component.
 * 
 * }
 * @param Runtime, see also js.awt.Component
 * @param view, see also js.awt.Component
 */
js.awt.Container = function (def, Runtime, view){

    var CLASS = js.awt.Container, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM, 
        System = J$VM.System, MQ = J$VM.MQ, List = js.util.LinkedList;

    /**
     * Add the component to the container
     * 
     * @param comp, component
     */
    thi$.addComponent = function(comp, constraints){
        return this.insertComponent(undefined, comp, constraints);
    };
    
    /**
     * Insert a component to the container.
     * 
     * @param index: {Number} An integer number to indicate the insert position
     * @param comp: {Component} The component to insert
     * @constraints: {Object} The constraints of the inserting component
     */
    thi$.insertComponent = function(index, comp, constraints){
        var items = this.items0(), ref;

        if(!isNaN(index) && index >= 0 && index < items.length){
            ref = this.getElementById(items[index]);
        }
        
        if(ref){
            this.insertChildBefore(comp, ref);
        }else{
            this.appendChild(comp);
        }

        this._addComp(comp, constraints);         
        this.zOrderAdjust();

        return comp;
    };
    
    /**
     * Get the component with the specified component id
     */
    thi$.getComponent = function(id){
        return this.getElementById(id);
    };
    
    /**
     * Return all components 
     */
    thi$.getAllComponents = function(filter){
        return this.getElements(filter);
    };
    
    /**
     * Remove the component with specified component id
     * 
     * @param comp, the component or component id
     */
    thi$.removeComponent = function(comp){
        comp = this.removeChild(comp);

        if(this.layout){
            this.layout.removeLayoutComponent(comp);
        }
        if(this._local.active === comp){
            this._local.active = undefined;
        }

        this.zOrderAdjust();

        return comp;
    };

    thi$.removeAll = function(gc){
        arguments.callee.__super__.apply(this, arguments);

        if(this.layout){
            this.layout.invalidateLayout();
        }

    }.$override(this.removeAll);
    
    /**
     * Activate the component with specified component or id
     */
    thi$.activateComponent = function(e){
        if(e == undefined){
            arguments.callee.__super__.call(this);
            return;
        }

        var id, comp;
        if(e instanceof Event){
            id = arguments[1].id;
        }else if(e instanceof js.awt.Element){
            id = e.id;
        }else{
            id = e;
        }

        comp = this[id];

        if(comp === undefined) return;

        if(this.isZOrder()){
            this.bringCompToFront(comp, 0x07);
        }

        // If this container is activateman == true, then 
        // this function will change current component state 
        // to activated, and other components to un-activated.
        if(this.def.activateman == true){
            comp.setActivated(true);
            this._local.active = comp;
            (function(compid){
                 if(compid != id){
                     this.getComponent(compid).setActivated(false);
                 }
             }).$forEach(this, this.def.items);
        }

    }.$override(this.activateComponent);
    
    /**
     * Return current active component;
     */
    thi$.getActiveComponent = function(){
        return this._local.active;
    };
    
    /**
     * Set <em>LayoutManager</em> for this container
     * 
     * @see js.awt.LayoutManager
     */
    thi$.setLayoutManager = function(layout){
        if(layout instanceof js.awt.LayoutManager){
            this.layout = layout;
        }
    };
    
    /**
     * Layout components
     */
    thi$.layoutComponents = function(force){
        if(this.layout.instanceOf(js.awt.LayoutManager)){
            this.layout.layoutContainer(this, force);
        }
    };
    
    /**
     * Return the amount of the components
     */
    thi$.getComponentCount = function(){
        return this.getElementsCount();
    };
    
    /**
     * Test if contains the component
     */
    thi$.contains = function(c, containSelf){
        var id;
        switch(Class.typeOf(c)){
        case "string":
            id = c;
            break;
        case "object":
            // Maybe a js.awt.Component instance
            id = c.id;
            break;
        case "null":
        case "undefined":
            return false;
        default:
            // Maybe html element
            return arguments.callee.__super__.call(
                this, c, containSelf);
        }

        return this[id] != undefined;

    }.$override(this.contains);
    
    
    /**
     * @see js.awt.BaseComponent
     */
    thi$.getPreferredSize = function(nocache){
        var bounds, d;
        if(nocache === true){
            bounds = this.getBounds();
            d = this.layout.preferredLayoutSize(this, true);
            return {
                width: this.isRigidWidth() ? bounds.width : d.width,
                height:this.isRigidHeight()? bounds.height: d.height
            };
        }else {
            if(!this.def.prefSize){
                bounds = this.getBounds();
                d = this.layout.preferredLayoutSize(this, true);
                this.setPreferredSize(
                    this.isRigidWidth() ? bounds.width : d.width,
                    this.isRigidHeight()? bounds.height: d.height
                );
            }
            return this.def.prefSize;
        }
    }.$override(this.getPreferredSize);

    /**

     *      * @see js.awt.BaseComponent
     */
    thi$.getMinimumSize = function(nocache){
        return nocache === true ? 
            this.layout.minimumLayoutSize(this, nocache) : 
            arguments.callee.__super__.apply(this, arguments);
    }.$override(this.getMinimumSize);

    /**
     * @see js.awt.BaseComponent
     */
    thi$.getMaximumSize = function(nocache){
        return nocache === true ? 
            this.layout.maximumLayoutSize(this, nocache) : 
            arguments.callee.__super__.apply(this, arguments);
    }.$override(this.getMaximumSize);
    
    /**
     * @see js.awt.Component
     */
    thi$.repaint = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            var comps = this.items0(), i, len, comp;
            for(i=0, len= comps.length; i<len; i++){
                comp = this[comps[i]];
                comp.repaint();
            }

            return true;
        }

        return false;

    }.$override(this.repaint);
    
    /**
     * Return whether this container size is auto fit content
     */
    thi$.isAutoFit = function(){
        return this.def.autofit === true;
    };

    /**
     * 
     */
    thi$.autoResize = function(){
        if(!this.isAutoFit()) return;
        
        var bounds = this.getBounds(), 
        prefer = this.getPreferredSize(true/*nocache*/),
        w = bounds.userW, h = bounds.userH;

        w = (prefer.width > w) ? prefer.width : w;
        h = (prefer.height> h) ? prefer.height: h;

        var container = this.getContainer();
        if(container){
            container.doLayout();
        }else{
            this.setSize(w, h);            
        }
    };

    /**
     * @see js.awt.Component
     */
    thi$.doLayout = function(force){
        if(arguments.callee.__super__.apply(this, arguments)){
            this.layoutComponents(force);
            return true;
        }

        return false;
    }.$override(this.doLayout);
    
    thi$._addComp = function(comp, constraints, refComp){
        constraints = constraints || comp.def.constraints;

        if(this.layout){
            this.layout.addLayoutComponent(comp, constraints);
        }
    };
    
    /**
     * def:{
     *     items:[compid],
     *     compid:{}
     * }
     */
    thi$._addComps = function(def){
        var comps = def.items, R = this.Runtime(),
        oriComps = this._local.items;
        
        def.items = [];
        List.$decorate(def.items);

        for(var i=0, len=comps.length; i<len; i++){
            var compid = comps[i], compDef = def[compid];
            if(Class.typeOf(compDef) === "object"){
                compDef.id = compDef.id || compid;
                compDef.className = compDef.className || 
                    (this.def.className + "_" + compid);

                var comp = new (Class.forName(compDef.classType))(
                    compDef, R);
                
                this.appendChild(comp);

                this._addComp(comp, compDef.constraints);

            }
        }
    };
    
    /**
     * Override the destroy of js.awt.Component
     */
    thi$.destroy = function(){
        if(this.destroied !== true){
            this.removeAll(true);
            arguments.callee.__super__.apply(this, arguments);
        }
    }.$override(this.destroy);

    /**
     * @see js.awt.Component
     */
    thi$._init = function(def, Runtime, view){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Container";
        def.className = def.className || "jsvm_container";

        arguments.callee.__super__.apply(this, arguments);
        
        def.layout = def.layout || {};
        def.layout.classType = def.layout.classType || "js.awt.LayoutManager";
        this.setLayoutManager(
            new (Class.forName(def.layout.classType))(def.layout));
        def.activateman = Class.isBoolean(def.activateman) ? def.activateman : false;

        // Keep original order
        var oriComps = this._local.items = List.$decorate([]);
        
        // Add children components
        var comps = def.items;
        if(Class.typeOf(comps) === "array"){
            this._addComps(def);
        }else{
            def.items = List.$decorate([]);
        }
        
        this.zOrderAdjust();

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(
    js.awt.Containable, js.awt.ZOrderManager);


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

$package("js.awt");

/**
 * A HBox is a container that allows multiple components to be laid out  horizontally. 
 * The components will not wrap so.
 * 
 * @param def :{
 *     gap: 0
 * } 
 */
js.awt.HBox = function (def, Runtime){

    var CLASS = js.awt.HBox, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
        newDef.layout.axis = 0;
        System.objectCopy(newDef, def, true, true);
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

js.awt.HBox.DEFAULTDEF = function(){
    return {
        classType: "js.awt.HBox",
        className: "jsvm_hbox",
        
        layout:{
            classType: "js.awt.BoxLayout",
            axis: 0,
            gap: 0,
            align_x: 0.5,
            align_y: 0.5
        },
        
        rigid_w: false,
        rigid_h: true
    };
};
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

$package("js.awt");

/**
 * A VBox is a container that allows multiple components to be laid out vertically. 
 * The components will not wrap so.
 * 
 * @param def :{
 *     gap: 0
 * } 
 */
js.awt.VBox = function (def, Runtime){

    var CLASS = js.awt.VBox, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
        newDef.layout.axis = 1;
        System.objectCopy(newDef, def, true, true);
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

js.awt.VBox.DEFAULTDEF = function(){
    return {
        classType: "js.awt.VBox",
        className: "jsvm_vbox",
        
        layout:{
            classType: "js.awt.BoxLayout",
            axis: 1,
            gap: 0,
            align_x: 0.5,
            align_y: 0.5
        },
        
        rigid_w: true,
        rigid_h: false
    };
};
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

$package("js.awt");

/**
 * A FieldSet is a container. 
 * 
 */
js.awt.FieldSet = function (def, Runtime){

    var CLASS = js.awt.FieldSet, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        def.viewType = "FIELDSET";
        def.stateless = true;
        arguments.callee.__super__.apply(this, arguments);
       
        var legend = this.legend = DOM.createElement("LEGEND");
        
        // There is a bug of IE8. In IE8, that is very strange for the legned.
        // If I didn't set following style for the legend, it will overlap 
        // fieldset's first line contents.
        // Add by mingfa.pan, 04/25/2013.
        if(J$VM.ie && parseInt(J$VM.ie) < 9){
            legend.style.cssText = "position:absolute;left:12px;top:0px;";
        }
        
        legend.innerHTML = this.def.legendText;
        this.view.appendChild(legend);

    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
    thi$.setLegendText = function(legendText){
        this.legend.innerHTML = String.encodeHtml(legendText);
    };

}.$extend(js.awt.Container);

js.awt.FieldSet.DEFAULTDEF = function(){
    return {
        classType: "js.awt.FieldSet",
        legendText: "",
        rigid_w: false,
        rigid_h: false
    };
};

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

$package("js.awt");

/**
 * A ScrollPane is a container that allows multiple components to be laid out horizontally. 
 * The components will not wrap so.
 * 
 * @param def :{
 *     className: xxx
 *     
 * } 
 */
js.awt.ScrollPane = function (def, Runtime){

    var CLASS = js.awt.ScrollPane, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    thi$.isHScroll = function(){
        return this.def.layout.axis == 0;
    };
    
    var _addComp = function(comp, notify){
        this.cache[comp.uuid()] = comp;
        
        if(typeof comp.hoverCtrl == "function"){
            comp.hoverCtrl(false);
        }

        this.doLayout(true);
        this.scrollLast();

        if(notify !== false){
            this.notifyPeer(
                "js.awt.event.ItemEvent", new Event("add", "", comp));
        }
        
        //this.activateComponent(comp);
        return comp;
    };
    
    /**
     * @see js.awt.Container #insertComponent
     */
    thi$.insertComponent = function(index, comp, constraints, notify){
        comp = arguments.callee.__super__.apply(this, [index, comp, constraints]);
        return _addComp.call(this, comp, notify);
        
    }.$override(this.insertComponent);
    
    /**
     * @see js.awt.Container#removeComponent
     */
    thi$.removeComponent = function(comp, notify){
        if(!comp) return;

        var items = this.items(), index = items.indexOf(comp.id);
        comp = arguments.callee.__super__.apply(this, [comp]);
        
        // While destroying, we may delete the cache first.
        if(this.cache){
            delete this.cache[comp.uuid()];
        }
        this.doLayout(true);

        if(notify !== false){
            this.notifyPeer(
                "js.awt.event.ItemEvent", new Event("remove", "", comp));
        }
        
        items = this.items();
        index = index >= items.length ? items.length - 1 : index;
        if(index >= 0){
            comp = this[items[index]];
            this.activateComponent(comp);
        }

    }.$override(this.removeComponent);
    
    /**
     * @see js.awt.Container#activateComponent
     */
    thi$.activateComponent = function(comp, notify){
        if(!comp) return;

        var items = this.items0(), id;
        for(var i=0, len=items.length; i<len; i++){
            id = items[i];
            if(this[id] == comp){
                this[id].setTriggered(true); 
                this._local.active = comp;
                
                if(notify !== false){
                    this.notifyPeer(
                        "js.awt.event.ItemEvent", new Event("active", "", comp));
                }
            }else{
                this[id].setTriggered(false);
            }
        }
    }.$override(this.activateComponent);

    /**
     * Scroll to the first position
     */
    thi$.scrollFirst = function(){
        if(this.isHScroll()){
            this.view.scrollLeft = 0;    
        }else{
            this.view.scrollTop = 0;
        }
    };
    
    /**
     * Scroll to the next position
     */
    thi$.scrollNext = function(){
        var el = this.view, p, v;

        if(this.isHScroll()){
            p = el.scrollLeft + this._local.avgwidth;
            v = el.scrollWidth;
            p = p > v ? v : p;
            el.scrollLeft = p;
        }else{
            p = el.scrollTop + this._local.avgheight;
            v = el.scrollHeight;
            p = p > v ? v : p;
            el.scrollTop = p;
        }
    };

    /**
     * Scroll to the previous postion
     */
    thi$.scrollPrevious = function(){
        var el = this.view, p;

        if(this.isHScroll()){
            p = el.scrollLeft - this._local.avgwidth;
            p = p < 0 ? 0 : p;
            el.scrollLeft = p;    
        }else{
            p = el.scrollTop - this._local.avgheight;
            p = p < 0 ? 0 : p;
            el.scrollTop = p;    
        }
    };

    /**
     * Scroll to the last position
     */
    thi$.scrollLast = function(){
        if(this.isHScroll()){
            this.view.scrollLeft = this.view.scrollWidth;    
        }else{
            this.view.scrollTop = this.view.scrollHeight;
        }
    };
    
    /**
     * @see js.awt.Movable
     */    
    thi$.isMoverSpot = function(el, x, y){
        var uuid = el.uuid, item = this.cache[uuid];
        if(item && item.isMoverSpot(el, x, y)){
            this.activateComponent.$delay(this, 1, item);
            return true;
        }
        return false;
    };
    
    /**
     * @see js.awt.Movable
     */
    thi$.getMoveObject = function(e){
        var moveObj = this.moveObj;
        if(!moveObj){
            var el = e.srcElement, uuid = el.uuid, item = this.cache[uuid],
            absXY = DOM.absXY(item.view)/*e.eventXY()*/, 
            moveObjClz = Class.forName(this.def.moveObjClz);
            
            var def = System.objectCopy(item.def, {}, true);
            moveObj = this.moveObj = 
                new moveObjClz(def, this.Runtime(), item.cloneView());
            moveObj.setMovingPeer(this);
            moveObj.appendTo(document.body);
            moveObj.setPosition(absXY.x, absXY.y);
            /*moveObj.setPosition(absXY.x - 10, absXY.y - 8);*/
        }

        return moveObj;
    };

    var _getLayoutSize = function(){
        var items = this.items0(), item = this[items[items.length-1]],
        D = this.getBounds(), d, ret = {bounds: D},
        n = items.length;
        if(item){
            d = item.getBounds();
            ret.cw = d.offsetX + d.width;
            ret.ch = d.offsetY + d.height;
        }else{
            ret.cw = 0; ret.ch = 0;
        }

        ret.width = ret.cw + D.MBP.BPW;
        ret.height= ret.ch + D.MBP.BPH;

        ret.avgwidth = n > 0 ? ret.cw/n : 0; 
        ret.avgheight= n > 0 ? ret.ch/n : 0; 

        return ret;
    };

    /**
     * @see js.awt.BaseComponent
     */
    thi$.getPreferredSize = function(){
        var r = _getLayoutSize.call(this), max = this.getMaximumSize();

        if(this.isHScroll()){
            return {
                width:  Math.min(r.width, max.width),
                height: r.bounds.height
            };
        }else{
            return {
                width:  r.bounds.width,
                height: Math.min(r.height, max.height)
            };
        }

    }.$override(this.getPreferredSize);
    
    /**
     * @see js.awt.BaseComponent
     */
    thi$.doLayout = function(force){
        if(arguments.callee.__super__.apply(this, arguments)){
            var r = _getLayoutSize.call(this), max = this.getMaximumSize(), 
            width, height, oldw = this.getWidth(), oldh = this.getHeight(),
            resized = false;
            
            this._local.avgwidth = r.avgwidth;
            this._local.avgheight= r.avgheight;

            if(this.isHScroll()){
                width =  this.def.onlyMax ? max.width : Math.min(r.width, max.width);
                if(oldw != width){
                    this.setWidth(width);
                    resized = true;
                }
            }else{
                height= this.def.onlyMax ? max.height: Math.min(r.height, max.height);
                if(oldh != height){
                    this.setHeight(height);
                    resized = true;
                }
            }
            
            if(resized){
                this.notifyContainer(
                    "js.awt.event.LayoutEvent", new Event("resize","",this));
            }

            return true;
        }

        return false;

    }.$override(this.doLayout);

    var _onclick = function(e){
        var el = e.srcElement, uuid = el.uuid, item = this.cache[uuid],
        eType;

        if(item){
            eType = e.getType();

            if(eType == "click" && el === item.ctrl){
                e.setEventTarget(item);
                this.notifyPeer(
                    "js.awt.event.ItemEvent", new Event("ctrlclick", "", item));

            }else if(eType == "dblclick"){
                e.cancelBubble();
                if(item.isEditable && item.isEditable()) {
                    item.editLabel();
                }
            }
        }

        return e.cancelDefault();
    };
    
    var _onitemtextchange = function(e){
        var item = e.getEventTarget(), d;
        item.def.prefSize = undefined;
        this.doLayout(true);
        if(e.getType() == "edit"){
            this.notifyPeer(
                "js.awt.event.ItemEvent", 
                new Event("textchanged", "", item));
        }
    };

    var _onmouseover = function(e){
        // hoverOnCtrl: indicate whether the ctrl should hovered if
        // and only if the mouse is over the ctrl other than whole
        // component. Default is true.
        var hoverOnCtrl = (this.def.hoverOnCtrl !== false),
        from = e.fromElement, to = e.toElement, 
        fid = from ? from.uuid : undefined, 
        tid = to ? to.uuid : undefined,
        fitem, titem, cache = this.cache;

        if(fid !== tid){
            fitem = cache[fid];
            titem = cache[tid];
            if(fitem && fitem.isHover()){
                fitem.setHover(false);
                fitem.hoverCtrl(false);
            }
            if(titem && !titem.isHover()){
                titem.setHover(true);
                if(!hoverOnCtrl || to == titem.ctrl){
                    titem.hoverCtrl(true);
                }
            }
        }else{
            titem = cache[tid];
            if(titem && titem.isHover()){
                if(!hoverOnCtrl || to == titem.ctrl){
                    titem.hoverCtrl(true);
                }else{
                    titem.hoverCtrl(false);
                }
            }
        }
    };
    
    /**
     * Judge whether the specified item can be dropped. If true
     * calculate and return the index.
     * 
     * @param item: {Component} The specified item to drop
     * @param xy: {Object} The current mouse position
     */
    thi$.acceptInsert = function(item, xy){
        var mvId = item.id, items = this.items0(),
        insert, tmp;

        for(var i=0, len=items.length; i<len; i++){
            tmp = this[items[i]];
            
            if(tmp.id == mvId) continue;
            
            if(tmp.inside(xy.x, xy.y)){
                tmp.setActivated(true);
                insert = items.indexOf(tmp.id);
            }else{
                tmp.setActivated(false);
            }
        }            
        
        return insert;
    };
    
    /**
     * Show a custom indicator to indicate where to insert item.
     * 
     * @param b: {Boolean} true to show indicator, false to hide.
     * @param insert: {Number} The index of inserting position.
     */
    thi$.showIndicator = function(b, insert){
        //Do nothing
    };
    
    var _ondrag = function(e){
        var eType = e.getType(), moveObj = e.getEventTarget(),
        xy = e.eventXY(), mvId = moveObj.id, item = this[mvId],

        items = this.items0(), p0 = items.indexOf(mvId), 
        p1, insert, changed = false;

        switch(eType){
        case "mousemove":
            p1 = this.acceptInsert(item, xy);
            this._local.insert = Class.isNumber(p1) ? p1 : p0;

            this.showIndicator(true, this._local.insert);
            break;
        case "mouseup":
            p1 = this._local.insert;
            insert = this[items[p1]];

            if(p0 > p1){
                // Insert before p1
                items.remove0(p0);
                items.add(p1, mvId);
                this.view.removeChild(item.view);
                this.view.insertBefore(item.view, insert.view);
                changed = true;
            }else if(p0 < p1){
                // Insert after p1
                items.add(p1+1, mvId);
                items.remove0(p0);
                this.view.removeChild(item.view);
                this.view.insertBefore(item.view, insert.view.nextSibling);
                changed = true;
            }
            
            if(changed){
                this.def.items = System.arrayCopy(
                    items, 0, 
                    js.util.LinkedList.$decorate([]), 0, items.length);
                this.doLayout(true);
                this.notifyPeer("js.awt.event.ItemEvent", 
                                new Event("orderchanged","", this));
            }
            
            if(insert){
                insert.setActivated(false);
            }
            this.showIndicator(false);
            delete this._local.insert;

            break;
        }
        
    };

    /**
     * @see js.awt.BaseComponent
     */
    thi$.destroy = function(){
        delete this.cache;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true),
        hscroll = (newDef.layout.axis == 0), mover, M;
        
        newDef.className = newDef.className || 
            (hscroll ? "jsvm_hscroll" : "jsvm_vscroll");
        
        mover = newDef.mover = newDef.mover || {};
        mover.longpress = mover.longpress || 250;
        mover.freedom = !isNaN(mover.freedom) ? mover.freedom : (hscroll ? 1 : 2);

        System.objectCopy(newDef, def, true, true);
        arguments.callee.__super__.apply(this, arguments);
        
        this.cache = {};
        
        M = this.def;
        M.itemClassType = M.itemClassType || "js.awt.Item";
        M.moveObjClz = M.moveObjClz || M.itemClassType;

        this.attachEvent("mouseover", 0, this, _onmouseover);
        this.attachEvent("mouseout",  0, this, _onmouseover);
        this.attachEvent("click",     0, this, _onclick);
        this.attachEvent("dblclick",  0, this, _onclick);

        MQ.register("js.awt.event.ItemTextEvent", this, _onitemtextchange);
        if(this.isMovable()){
            MQ.register("js.awt.event.MovingEvent", this, _ondrag);
        }

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

js.awt.ScrollPane.DEFAULTDEF = function(){
    return {
        classType: "js.awt.ScrollPane",

        layout:{
            classType: "js.awt.FlowLayout",
            hgap: 0,
            vgap: 0,
            axis: 0,
            align_x: 0.0,
            align_y: 0.0
        },

        rigid_w: false,
        rigid_h: false,
        
        movable: true
    };
};


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

$package("js.awt");

/**
 * A ScrollPane is a container that allows multiple components to be laid out horizontally. 
 * The components will not wrap so.
 * 
 * @param def :{
 *     className: xxx
 *     
 * } 
 */
js.awt.TabPane = function (def, Runtime){

    var CLASS = js.awt.TabPane, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;

    /**
     * Add a panel to TabPane with speciifed tab definition.
     * 
     * @param tabDef:{
     *     className: 
     *     id: 
     *     
     *     labelText: 
     *     ...
     * }
     * 
     * @param panel, any js.awt.Component instance
     */
    thi$.addTab = function(tabDef, panel){
        tabDef.classType = tabDef.classType || "js.awt.Item";
        tabDef.className = tabDef.className || this.className + "_tab";
        tabDef.id = tabDef.id || "tab" + this.tabs.getComponentCount();
        var tab = new (Class.forName(tabDef.classType))(tabDef, this.Runtime());
        this.cache[tab.uuid()] = tab;

        this.tabs.addComponent(tab);
        this.panes.addComponent(panel);
    };
    
    thi$.removeTab = function(tabId,panId){
    	var items = this.tabs.items0(), id,
        tabs = this.tabs, panes = this.panes;
//    	for(var i=0, len=items.length; i<len; i++){
//    		id = items[i];
//    		if(id == tabId){
//    			
//    		}
//    	}
    	tabs.removeComponent(tabs[tabId]);
		panes.removeComponent(panes[panId]);
    };
    
    /**
     * Switch to tab with specified tab id
     * 
     * @param tabId
     */
    thi$.activateTab = function(tabId){
        var items = this.tabs.items0(), id,
        tabs = this.tabs, panes = this.panes;

        for(var i=0, len=items.length; i<len; i++){
            id = items[i];
            if(id == tabId){
                tabs[id].setTriggered(true);    
                panes.layout.show(this.panes, i);
            }else{
                tabs[id].setTriggered(false);
            }
        }

        var msg = {
        	activateId : tabId
        };
        
        this.activateId = tabId;
        this.notifyPeer(
            "js.awt.event.TabActivatedEvent", 
            new Event("TabActivatedEvent", msg));
    };
    
    thi$.getActivateTabId = function(){
        return this.activateId;
    };
    
    /**
     * Disable the specified tab
     */
    thi$.disableTab = function(tabId, disable){
        var tab = this.tabs[tabId];
        if(disable === false){
            tab.setEnabled(true);
        }else{
            tab.setEnabled(false);
        }
    };
    
    /**
     * Return all panels 
     */
    thi$.getAllPanels = function(){
        return this.panes.getAllComponents();
    };
    
    /**
     * Return the panel with specified tab ID
     * 
     * @param tabId
     */
    thi$.getPanelByTab = function(tabId){
        var index = this.indexOfTab(tabId),
        panelId = this.panes.items0()[index];

        return this.panes[panelId];
    };
    
    thi$.indexOfTab = function(tabId){
        var items = this.tabs.items0(), id;
        for(var i=0, len=items.length; i<len; i++){
            id = items[i];
            if(id == tabId){
                return i;
            }
        }
        return -1;
    };
    
    var _onmousedown = function(e){
        var el = e.srcElement, uuid = el.uuid, 
        tab = this.cache[uuid];

        if(tab && tab.isEnabled()){
            this.activateTab(tab.id);
        }
    };

    thi$.destroy = function(){
        delete this.cache;

        arguments.callee.__super__.apply(this, arguments);
        

    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
        System.objectCopy(newDef, def, true, true);
        
        arguments.callee.__super__.apply(this, arguments);

        this.cache = {};

        this.attachEvent("mousedown", 0, this, _onmousedown);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

js.awt.TabPane.DEFAULTDEF = function(){
    return {
        classType: "js.awt.TabPane",
        className: "jsvm_tabpane",
        
        items: ["tabs", "panes"],
        
        tabs:{
            classType: "js.awt.Container",
            constraints: "north",
            layout:{
                classType: "js.awt.FlowLayout",
                axis: 0,
                hgap: 0,
                align_x: 0.0,
                align_y: 0.0
            },
            stateless: true
        },
        
        panes:{
            classType: "js.awt.Container",
            constraints: "center",
            layout:{
                classType: "js.awt.CardLayout"
            },
            zorder: true,
            stateless: true
        },
        
        layout:{
            classType: "js.awt.BorderLayout"
        },
        
        rigid_w: false,
        rigid_h: false
    };
};


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

$package("js.awt");

$import("js.awt.Highlighter");

/**
 * @param def :{
 *	   
 *	   markable: true/false. If true will create a marker element.
 *	   iconImage: icon image name
 *	   labelText: label text
 *	   inputText: input value
 *	   controlled : true/false. If true will create a control element.
 * 
 * }
 */
js.awt.Item = function(def, Runtime, view){

	var CLASS = js.awt.Item, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ;
	
	/**
	 * @see js.awt.BaseComponent
	 */
	thi$.getPreferredSize = function(){
		if(this.def.prefSize == undefined){
			var G = this.getGeometric(), nodes = this.view.childNodes,
			ele1 = nodes[nodes.length-2], ele0 = nodes[nodes.length -1],
			width;
			
			if(ele0.tagName == "SPAN"){
				/*
				 ele0.style.width = "0px";
				 width = ele0.offsetLeft + ele0.scrollWidth;
				 */
				width = ele0.offsetLeft + DOM.getTextSize(ele0).width;
			}else{
				if(ele1.tagName == "SPAN"){
					/*
					 ele1.style.width = "0px";
					 width = ele1.offsetLeft + ele1.scrollWidth;
					 */
					width = ele1.offsetLeft + DOM.getTextSize(ele1).width;
				}else{
					width = ele1.offsetLeft + ele1.scrollWidth;					   
				}

				width += G.ctrl.MBP.marginLeft + G.ctrl.width;
			}
			width += G.bounds.MBP.BPW;

			this.setPreferredSize(
				width, 
				G.bounds.height - (G.bounds.BBM ? 0 : G.bounds.MBP.BPH));
		}

		return this.def.prefSize;
	};
	
	thi$.getIconImage = function(){
		return this.def.iconImage || "blank.gif";
	};
	
	thi$.setIconImage = function(state){
		var buf = this.__buf__.clear();
		buf.append(this.Runtime().imagePath())
			.append(state & 0x0F).append("-")
			.append(this.getIconImage());

		this.icon.src = buf.toString();
	};

	thi$.setText = function(text, edit){
		if(this.label){
			this.def.labelText = text;
			this.label.innerHTML = js.lang.String.encodeHtml(text);	   
		}else if(this.input){
			this.def.inputText = text;
			this.input.value = text;
		}

		if(edit){
			this.notifyContainer(
				"js.awt.event.ItemTextEvent", new Event(edit, {}, this));
		}
	};
	
	thi$.getText = function(){
		if(this.label){
			return this.def.labelText;
		}else if(this.input){
			return this.def.inputText;
		}
		return undefined;
	};

	thi$.isMarkable = function(){
		return this.def.markable === true;		  
	};
	
	thi$.isControlled = function(){
		return this.def.controlled === true;
	};
	
	thi$.isMarked = function(){
		return this._local.marked === true;
	};
	
	thi$.mark = function(b){
		var marker = this.marker;
		if(!marker) return;

		b = b || false;		   
		this._local.marked = b;

		if(this.isMarked()){
			marker.className = this.className + "_marker_4";
		}else{
			marker.className = this.className + "_marker_0";
		}
	};
	
	thi$.hoverCtrl = function(b){
		var ctrl = this.ctrl;
		if(!ctrl) return;
		
		if(b){
			ctrl.className = this.className + "_ctrl_2";
		}else{
			ctrl.className = this.className + "_ctrl_0";
		}
	};
	
	thi$.triggerCtrl = function(b){
		var ctrl = this.ctrl;
		if(!ctrl) return;
		
		if(b){
			ctrl.className = this.className + "_ctrl_4";
		}else{
			ctrl.className = this.className + "_ctrl_0";
		}
	};
	
	/**
	 * @see js.awt.BaseComponent#setToolTipText
	 * 
	 * @param text
	 * @param elid, can be branch, marker label and ctrl
	 */
	thi$.setToolTipText = function(text, elid){
		if(elid){
			DOM.setAttribute(this[elid], "title", text);
		}else{
			arguments.callee.__super__.apply(this, [text]);
		}
	}.$override(this.setToolTipText);
	
	/**
	 * @see js.awt.Movable
	 */	   
	thi$.isMoverSpot = function(el, x, y){
		return (el != this.branch && 
				el != this.marker && 
				el !== this.ctrl);
	};
	
	/**
	 * @see js.awt.BaseComponent
	 */
	thi$.doLayout = function(){
		var ele = this.label || this.input,
		maxWidth = this.ctrl ? this.ctrl.offsetLeft : 
			this.getBounds().innerWidth,
		width = maxWidth - ele.offsetLeft;
		width = width < 0 ? 0 : width;

		if(this.input){
			DOM.setSize(ele, width, undefined);
		}else{
			ele.style.width = width + "px";
		}

	}.$override(this.doLayout);
	
	/**
	 * @see js.awt.BaseComponent
	 */
	thi$.repaint = function(){
		// Nothing to do
	}.$override(this.repaint);
	
	thi$.destroy = function(){
		if(this.input){
			Event.detachEvent(this.input, "focus", 1,  this, _onFocus);
		}
		
		arguments.callee.__super__.apply(this, arguments);
		
	}.$override(this.destroy);
	
	thi$.isEditable = function(){
		return this.label && this.def.editable || false;
	};

	thi$.editLabel = function(){
		if(!this.isEditable()) return;
		
		var editor = 
			new (Class.forName("js.awt.LabelEditor"))(this.label, this);

		MQ.register("js.awt.event.LabelEditorEvent", this, _onedit);

		editor.doEdit();
	};
	
	var _onedit = function(e){
		var data = e.getData(); 
		this.setText(data.text, "edit");
		
		e.getEventTarget().destroy();
		MQ.cancel("js.awt.event.LabelEditorEvent", this, _onedit);
	};
	
	thi$.canCloneView = function(itemDef){
		var items = [];
		if(itemDef.markable === true){
			items.push("marker");
		}
		
		if(itemDef.iconImage){
			items.push("icon");
		}
		
		if(Class.isValid(itemDef.labelText)){
			items.push("label");
		}else{
			if(Class.isValid(itemDef.inputText)){
				items.push("input");
			}
		}
		
		if(itemDef.controlled === true){
			items.push("ctrl");
		}

		return items.length === this.def.items.length;
	};
	
	thi$.onSubmit = function(e){
		var v = this.input.value;
		this.setText(v, "input");
	};
	
	thi$.validate = function(e){
		// The keycode of mouse event for a password input box is very
		// different with a text input box
		var iptType = this.input.type || "";
		if(iptType.toLowerCase() !== "text"){
			return true;
		}
		
		var M = this.def, 
		kcode = e.keyCode, 
		isShift = (e.shiftKey === true),
		dataType = M.dataType || "", 
		allowMinus = (M.allowMinus === true), 
		value = this.input.value || "", 
		valid = false;
		
		/**
		 * 8: Backspace
		 * 46: Delete
		 * 37: <--
		 * 39: -->
		 * 13: Enter
		 * 110: .
		 * 190: .
		 * 189: -
		 * 109: - (Num Key)
		 * 48-57: 0 - 9
		 * 16: Shift (Left & Right)
		 * 20: Caps Lock
		 * 65-70: a-f / A - F
		 * 96-105: 0-9 (Num Key)
		 */		   
		if(kcode == 8 || kcode == 46 || kcode == 37 || kcode == 39 || kcode == 13){
			return true;
		}
		
		switch(dataType.toLowerCase()){
		case "hex":
			if((!isShift && kcode >= 48 && kcode <= 57) 
				|| (kcode >= 65 && kcode <= 70) || (kcode >= 96 && kcode <= 105)){
				valid = true;
			}else{
				valid = false;
			}
			break;
		case "integer":
			if(allowMinus && ((!isShift && kcode == 189) || kcode == 109) 
			   && value.length == 0){
				valid = true;
			}else if((kcode >= 96 && kcode < 106) 
					 || (!isShift && kcode > 47 && kcode < 60)){
				valid = true;
			}else{
				valid = false;
			}
			
			break;
		case "float":
			if(allowMinus && ((!isShift && kcode == 189) || kcode == 109) 
			   && value.length == 0){
				valid = true;
			}else if((kcode >= 96 && kcode < 106) 
					 || (!isShift && kcode > 47 && kcode < 60)
					 || ((kcode == 110 || (!isShift && kcode == 190)) 
						 && value.indexOf(".") == -1)){
				valid = true;
			}else{
				valid = false;
			}
			break;
		default:
			valid = true;
			break;
		}
		
		return valid;
	};
	
	var _onKeyDown = function(e){
		if(!this.validate(e)){
			return false;
		}

		if(e.keyCode === 13){
			Event.detachEvent(this.input, "blur", 1, this, _onBlur);
			this.onSubmit(e);
		}

		return true;
	};

	var _onFocus = function(e){
		if(!this._local.eventAttached){
			Event.attachEvent(this.input, 'keydown', 0, this, _onKeyDown);
			Event.attachEvent(this.input, "blur", 1, this, _onBlur);
			
			this._local.eventAttached = true;
		}
	};
	
	var _onBlur = function(e) {
		if(this._local.eventAttached){
			Event.detachEvent(this.input, 'keydown', 0, this, _onKeyDown);
			Event.detachEvent(this.input, "blur", 1, this, _onBlur);
			
			this._local.eventAttached = false;
		}

		this.onSubmit(e);
	};
	
	var _createElements = function(){
		var G = this.getGeometric(), M = this.def, 
		xbase = G.bounds.MBP.paddingLeft, ybase = G.bounds.MBP.paddingTop,
		height = G.bounds.BBM ? 
			G.bounds.height : G.bounds.height - G.bounds.MBP.BPH,
		innerHeight = height - G.bounds.MBP.BPH,
		className = this.className, body = document.body,
		items = M.items, ele, id, iid, viewType, i, len, D, 
		left = xbase, top, buf = this.__buf__;
		
		this.view.style.height = G.bounds.BBM ?
			(height + "px") : (innerHeight+"px");

		for(i=0, len=items.length; i<len; i++){
			id = items[i];
			iid = id.split(/\d+/g)[0];
			switch(iid){
			case "icon":
				viewType = "IMG";
				break;
			case "label":
				viewType = "SPAN";
				break;
			case "input":
				viewType = "INPUT";
				break;
			default:
				viewType = "DIV";
				break;
			}

			ele = DOM.createElement(viewType);
			ele.id = id;
			ele.className = className + "_" + id;
			ele.iid = iid;

			if(!G[iid]){
				ele.style.cssText = 
					"position:absolute;white-space:nowrap;visibility:hidden;";
				DOM.appendTo(ele, body);
				G[iid] = DOM.getBounds(ele);
				DOM.removeFrom(ele);
				ele.style.cssText = "";
			}else{
				ele.bounds = G[iid];
			}
			
			D = G[iid];

			buf.clear();
			buf.append("position:absolute;");
			top = ybase + (innerHeight - D.height)*0.5;
			buf.append("top:").append(top).append("px;");
			if(iid !== "ctrl"){
				buf.append("left:").append(left).append("px;");
				left += D.MBP.marginLeft + D.width + D.MBP.marginRight;				
			}else{
				buf.append("right:")
					.append(G.bounds.MBP.paddingRight).append("px;");
			}
			
			if(iid == "label"){
				buf.append("white-space:nowrap;");
			}
			
			ele.style.cssText = buf.toString();

			DOM.appendTo(ele, this.view);
		}
	};
	
	var _checkItems = function(){
		var M = this.def, items = M.items;
		if(items.length == 0){
			if(this.isMarkable()){
				items.push("marker");
			}
			
			if(M.iconImage){
				items.push("icon");
			}

			if(Class.isValid(M.labelText)){
				items.push("label");
			}else{
				if(Class.isValid(M.inputText)){
					items.push("input");
				}
			}
			
			if(this.isControlled()){
				items.push("ctrl");
			}
		}
	};

	thi$._init = function(def, Runtime, view){
		if(def == undefined) return;

		def.classType = def.classType || "js.awt.Item";
		def.className = def.className || "jsvm_item";

		arguments.callee.__super__.apply(this, [def, Runtime, view]);
		
		def.items = def.items || [];

		// Create inner elements
		if(view == undefined){
			_checkItems.call(this);
			_createElements.call(this);
		}
		
		if(!def.items.clear){
			js.util.LinkedList.$decorate(def.items);	
		}
		def.items.clear();
		
		var uuid = this.uuid(), nodes = this.view.childNodes, 
		id, i, len, node, text, ipt, placeholder;
		for(i=0, len=nodes.length; i<len; i++){
			node = nodes[i]; id = node.id;
			node.uuid = uuid;
			node.iid = (node.iid || id.split(/\d+/g)[0]);
			def.items.push(id);
			this[id] = node;
		}

		if(this.icon){
			this.setIconImage(this.isTriggered() ? 4 : 0);
			//DOM.forbidSelect(this.icon);
		}
		
		ipt = this.input;
		if(this.label || ipt){
			if(Class.isValid(def.labelText)){
				text = def.labelText;
			}else if(Class.isValid(def.inputText)){
				text = def.inputText;				 
			}else{
				text = def.text || def.name || def.dname || "Item";
			}
			
			this.setText(text);
		}
		
		if(ipt){
			placeholder = def.placeholder;
			if(J$VM.supports.placeholder && Class.isString(placeholder) 
			   && placeholder.length > 0){
				ipt.placeholder = placeholder;
			}
			
			Event.attachEvent(ipt, "focus", 1, this, _onFocus);
		}

		if(this.isMarkable()){
			this.mark(def.checked === true);
		}

	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component)
	.$implements(js.awt.Highlighter);


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
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * Define Label component
 * 
 * @param def:{
 *			  className: required, css: optional,
 * 
 *			  text: optional,
 * 
 *			  editable:optional 
 * }
 */
js.awt.Label = function(def, Runtime) {
	
	var CLASS = js.awt.Label, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ;

	thi$.getPreferredSize = function(){
		if(this.def.prefSize == undefined 
		   && this.isDOMElement()){
			
			var textSize = DOM.getTextSize(this.view),
			d = this.getBounds(),
			w = textSize.width + d.MBP.BPW,
			h = textSize.height+ d.MBP.BPH;

			this.setPreferredSize(w, h);
		}
		
		return this.def.prefSize;

	}.$override(this.getPreferredSize);
	
	thi$.getText = function() {
		return this.def.text;
	};

	/**
	 * Sets lable text, only and only if encode == false, the text
	 * won't be encoded for html.
	 */
	thi$.setText = function(text, encode) {
		this.def.text = text || "";

		var view = this.view, M = this.def, 
		v = (encode == false) ? 
			M.text : js.lang.String.encodeHtml(M.text),
		tmpEle, oTextNode;

		/*
		 * Ref: http://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx
		 * The innerHTML property is read-only on the col, colGroup, 
		 * frameSet, html, head, style, table, tBody, tFoot, tHead, 
		 * title, and tr objects
		 *
		 * However, in IE9-, if a span is the child of those DOM elements listed
		 * above, it cannot set the value with innerHTML, too.
		 */
		try {
			view.innerHTML = v;
		} catch (e){
			oTextNode = view.childNodes[0];
			tmpEle = document.createElement("SPAN");
			
			oTextNode.replaceNode(tmpEle.childNodes[0]);
		}

		if(!this.isPreferredSizeSet){
			this.def.prefSize = undefined;
			this.getPreferredSize();
		}
	};

	thi$.setEMail = function(text) {
		this.def.text = text || "";
		var mail = document.createElement("A"),
		str = js.lang.String.encodeHtml(this.def.text);
		mail.href = "mailto:" + str;
		this.view.appendChild(mail);
		mail.innerHTML = str;

		if(!this.isPreferredSizeSet){
			this.def.prefSize = undefined;
			this.getPreferredSize();
		}

	};

	thi$.isEditable = function(){
		return this.def.editable || false;
	};

	thi$.setEditable = function(b) {
		b = b || false;

		this.def.editable = b;

		if (b) {
			this.detachEvent("dblclick", 0, this, _onDblClick);
			this.attachEvent("dblclick", 0, this, _onDblClick);
		} else {
			this.detachEvent("dblclick", 0, this, _onDblClick);
		}
	};

	var _onDblClick = function(e){
		if(!this.isEditable()) return;

		e.cancelBubble();
		
		var editor = 
			new (Class.forName("js.awt.LabelEditor"))(this.view, this);

		MQ.register("js.awt.event.LabelEditorEvent", this, _onedit);

		editor.doEdit();
	};
	
	var _onedit = function(e){
		var data = e.getData(); 
		this.setText(data.text, undefined, true);
		e.getEventTarget().destroy();
		MQ.cancel("js.awt.event.LabelEditorEvent", this, _onedit);

		this.notifyContainer(
			"js.awt.event.LabelTextEvent", new Event("changed", {}, this));
		
		this.setChanged();
		this.notifyObservers();
	};

	/**
	 * @param keyword: The keyword of the <em>RegExp</em> object which is used 
	 *		  to matched.
	 * @param mode: "global|insensitive|wholeword".
	 * @param highlightClass: the style class name for highlighting text.
	 */
	thi$.highlightAll = function(keyword, mode, highlightClass) {
		var text = this.getText();
		if (!keyword || !mode || !text)
			return;

		text = js.lang.String.encodeHtml(text);
		//J$VM.System.out.println("Text:" + text);
		keyword = js.lang.String.encodeHtml(keyword);

		var kit = Class.forName("js.swt.SearchKit"),
		pattern = kit.buildRegExp(keyword, mode);
		if(!pattern){
			return;
		}
		
		var className = highlightClass;
		if (!className) {
			className = this.__buf__.clear().append(this.def.className)
				.append("_").append("highlight").toString();
		}

		var newText = text.replace(
			pattern, 
			function(m) {
				return "<span class=\"" + className + "\">" + m + "</span>";
			});

		this.view.innerHTML = newText;
		newText = null;
	};
	
	/**
	 * @param matches: <em>Array</em>, each element in it is a object maintained 
	 *		  each match's start index and its length. Its structure is as follow:
	 *		  [
	 *			{start: m, length: x},
	 *			...
	 *			{start: n, length: x}	  
	 *		  ]
	 *
	 * @param highlightClass: the style class name for highlighting text.
	 */
	thi$.highlightMatches = function(matches, highlightClass) {
		var text = this.getText();
		if (!C.isString(text)) return;

		var className = highlightClass;
		if (!className) {
			className = this.__buf__.clear().append(this.def.className)
				.append("_").append("highlight").toString();
		}

		var rpSeg = new js.lang.StringBuffer(), subStr = null,
		mCnt = matches ? matches.length : 0, aMatches = null,
		vernier = 0;
		
		for(var i = 0; i < mCnt; i++){
			aMatches = matches[i];
			if(aMatches.start > vernier){
				subStr = text.substring(vernier, aMatches.start);
				subStr = js.lang.String.encodeHtml(subStr);
				rpSeg.append(subStr);
				
				subStr = text.substr(aMatches.start, aMatches.length);
				subStr = js.lang.String.encodeHtml(subStr);
				subStr = "<span class=\"" + className + "\">" + subStr + "</span>";
				rpSeg.append(subStr);
				
				vernier = aMatches.start + aMatches.length;
			}else if(aMatches.start == vernier){
				subStr = text.substr(aMatches.start, aMatches.length);
				subStr = js.lang.String.encodeHtml(subStr);
				subStr = "<span class=\"" + className + "\">" + subStr + "</span>";
				rpSeg.append(subStr);
				
				vernier = aMatches.start + aMatches.length;
			}else{
				//Error
			}
		}
		
		if(vernier <= text.length){
			subStr = text.substr(vernier);
			subStr = js.lang.String.encodeHtml(subStr);
			rpSeg.append(subStr);
		}

		this.view.innerHTML = rpSeg.toString();
		rpSeg = null;
	};

	thi$.doLayout = function(){
		if(arguments.callee.__super__.apply(this, arguments)){
			this.view.style.lineHeight = DOM.innerHeight(this.view) + "px";
			return true;			
		}

		return false;
	}.$override(this.doLayout);

	
	thi$._init = function(def, Runtime) {
		if(def == undefined) return;

		def.classType = def.classType || "js.awt.Label";
		def.className = def.className || "jsvm_label";
		def.css = (def.css || "") + "margin:0px;white-space:nowrap;";
		def.text = typeof def.text == "string" ? def.text : "Label";
		def.viewType = "SPAN";

		arguments.callee.__super__.apply(this, arguments);
		
		this.setText(this.def.text, true);
		this.setEditable(this.def.editable);

	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.awt.Component);


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

$package("js.awt");

/**
 * A <em>Icon</em> is a <em>Component</em> which wraps a image. 
 * 
 * @param def:{
 *	   className: {String}
 *		  
 *	   useBgImage: {Boolean} Optional. true / false, indicate whether use 
 *		   background-image to present the icon.
 *	   image: {String} Optional. FileName of the icon in current component. 
 *		   If and only if the <em>useBgImage</em> is <em>false</em>, the image
 *		   will be used as the icon's src. Otherwise, it will be ignored.
 *	   
 *	   sizefixed: {Boolean} Optional. Default is false. Indicate whether the
 *		   size of the image view is fixed. If true, the image view will abound
 *		   in the component.
 *	   align_x: {Number} Optional. Default is 0.5. Indicate the horizontal align-
 *		  -ment of the image view in current Icon component. When <em>sizefixed</em>
 *		  is <em>false</em>, it will be ignored.
 *	   align_y: {Number} Optional. Default is 0.5. Indicate the vertical alignment
 *		  of the image view in current Icon component. When <em>sizefixed</em> is 
 *		  <em>false</em>, it will be ignored.
 * }
 */
js.awt.Icon = function(def, Runtime){

	var CLASS = js.awt.Icon, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System;

	thi$.setImage = function(image){
		if(!this.useBgImage 
		   && Class.isString(image) && image != this.def.image){
			this.def.image = image;
			
			var src = _buildImageSrc.call(this);
			if(src) this.imageView.src = src;
		}
	};

	thi$.setToolTipText = function(s){
		arguments.callee.__super__.apply(this, arguments);
		DOM.setAttribute(this.imageView, "title", s);

	}.$override(this.setToolTipText);

	thi$.onStateChanged = function(e){
		arguments.callee.__super__.apply(this, arguments);
		
		if(this.useBgImage){
			this.imageView.src = _buildImageSrc.call(this);
		}

	}.$override(this.onStateChanged);

	thi$.doLayout = function(){
		if(this.isDOMElement()){
			var M = this.def, box = this.getBounds(), 
			MBP = box.MBP, D = DOM.getBounds(this.imageView), 
			align_x = Class.isNumber(M.align_x) ? M.align_x : 0.5,
			align_y = Class.isNumber(M.align_y) ? M.align_y : 0.5,
			left, top;
			
			if(this.def.sizefixed !== true){
				DOM.setBounds(this.imageView, 
							  MBP.paddingLeft, MBP.paddingTop, 
							  box.innerWidth, box.innerHeight);
			}else{
				left = MBP.paddingLeft + (box.innerWidth - D.width) * align_x,
				top = MBP.paddingTop + (box.innerHeight - D.height) * align_y;
				
				DOM.setPosition(this.imageView, left, top, D);
			}
		}
	}.$override(this.doLayout);

	thi$.destroy = function(){
		var imageView = this.imageView;
		delete this.imageView;
		DOM.remove(imageView, true);

		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.destroy);

	var _buildImageSrc = function(buf){
		var image = this.def.image;
		if(!Class.isString(image) || image.length == 0){
			image = "blank.gif";
		}

		buf = buf || this.__buf__;
		buf.clear();

		buf.append(this.Runtime().imagePath());
		if(!this.isStateless()){
			buf.append(this.getState() & 0x0F).append("-");
		}
		buf.append(image);

		return buf.toString();
	};
	
	thi$._init = function(def, Runtime){
		if(def == undefined) return;

		var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
		newDef.className = newDef.className || "jsvm_icon";

		var tip = newDef.tip; 
		delete newDef.tip;
		
		System.objectCopy(newDef, def, true, true);
		arguments.callee.__super__.apply(this, arguments);
		
		var useBgImage = this.useBgImage = (def.useBgImage === true),
		viewType = useBgImage ? "DIV" : "IMG",
		image = this.imageView = DOM.createElement(viewType),
		buf = this.__buf__.clear();
		
		image.className = buf.append(this.def.className)
			.append("_img").toString();
		image.style.cssText = "position:absolute;margin:0px;";
		
		if(!useBgImage){
			var src = _buildImageSrc.call(this, buf);
			if(src) image.src = src;
		}

		DOM.appendTo(image, this.view);

		if(Class.isString(tip) && tip.length > 0){
			this.setToolTipText(tip);
		}

	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component);

js.awt.Icon.DEFAULTDEF = function(){
	return{
		classType: "js.awt.Icon",

		rigid_w: true,
		rigid_h: true,
		align_x: 0.5,
		align_x: 0.5
	};
};


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
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * Define Button component
 * 
 * @param def:{
 *   className: string, required
 * 
 *   id: request,
 *   
 *   iconImage: "",
 *   iconAlign: "left"|"right"|"top"|"bottom" 
 *   labelText: "Button",   
 * 
 *   state:optional,
 *   toggle:boolean, required
 * 
 * }
 */
js.awt.Button = function(def, Runtime){

    var CLASS = js.awt.Button, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;
    
    thi$.getMsgType = function(){
        return "js.awt.event.ButtonEvent";
    };

    thi$.setIconImage = function(state){
        var buf = this.__buf__.clear();
        buf.append(this.Runtime().imagePath())
            .append(state & 0x0F).append("-")
            .append(this.getIconImage());

        this.icon.src = buf.toString();
    };

    thi$.getIconImage = function(){
        return this.def.iconImage || "blank.gif";
    };
    
    thi$.setText = function(text){
        if(this.label){
            this.def.labelText = text;
            this.label.innerHTML = js.lang.String.encodeHtml(text);    
        }
    };
    
    thi$.getText = function(){
        if(this.label){
            return this.def.labelText;
        }

        return undefined;
    };

    thi$.isMarkable = function(){
        return this.def.markable === true;        
    };

    thi$.isMarked = function(){
        return this.def.marked === true;
    };
    
    thi$.mark = function(b){
        var marker = this.marker;
        if(!marker) return;

        b = b || false;        
        this.def.marked = b;

        if(this.isMarked()){
            marker.className = this.className + "_marker_4";
        }else{
            marker.className = this.className + "_marker_0";
        }
    };
    
    thi$.isOnMousedown = function(){
        return this._local.mousedown === true;
    };
    
    thi$.setToolTipText = function(s){
        arguments.callee.__super__.apply(this, arguments);

        if(this.icon) {
            DOM.setAttribute(this.icon, "title", s);
        }
        if(this.label){
            DOM.setAttribute(this.label, "title", s);
        }

    }.$override(this.setToolTipText);

    /**
     * @see js.awt.Component
     */
    thi$.repaint = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            this.doLayout(true);
        }
    }.$override(this.repaint);

    /**
     * @see js.awt.Component
     */
    thi$.doLayout = function(force){
        if(arguments.callee.__super__.apply(this, arguments)){
            var G0 = this.getGeometric(), B = this.getBounds(), 
            BBM = B.BBM, MBP = B.MBP, 
            innerWidth = B.innerWidth, innerHeight= B.innerHeight,
            xbase = MBP.paddingLeft, ybase = MBP.paddingTop,
            align_x = this.def.layout.align_x,
            align_y = this.def.layout.align_y,
            items = this.def.items, ele, i, len, cwidth = 0, D,
            buf = this.__buf__, left, top, uwidth;

            for(i=0, len=items.length; i<len; i++){
                ele = this[items[i]];
                D = G0[ele.iid];
                if(ele.iid == "label"){
                    cwidth += ele.scrollWidth;
                }else{
                    cwidth += ele.offsetWidth + D.MBP.marginRight;    
                }
            }
            
            cwidth = cwidth > innerWidth ? innerWidth : cwidth;
            
            left = xbase + (innerWidth - cwidth)*align_x;
            for(i=0, len=items.length; i<len; i++){
                ele = this[items[i]];
                D = G0[ele.iid];
                top = ybase + (innerHeight - D.height) * align_y;
                buf.clear().append(ele.style.cssText)
                    .append(";left:").append(left).append("px;")
                    .append("top:").append(top).append("px;");

                if(ele.iid === "label"){
                    buf.append("width:").append(cwidth+2).append("px;")
                        .append("white-space:nowrap;overflow:hidden;")
                        .append("text-overflow:ellipsis;");
                }

                ele.style.cssText = buf.toString();
                
                uwidth = D.width + D.MBP.marginRight; 
                left   += uwidth;
                cwidth -= uwidth;
            }

            _adjustEffectLayer.call(this);
            return true;
        }
        
        return false;

    }.$override(this.doLayout);

    /**
     * @see js.awt.State
     * @see js.awt.Component
     */
    thi$.onStateChanged = function(){ 
        arguments.callee.__super__.apply(this, arguments);
        
        if(this.icon){
            this.setIconImage(this.getState());
        }
    }.$override(this.onStateChanged);
    
    thi$.setEnabled = function(b){
        if(!b){
            _showEffectLayer.call(this, "normal");
        }
        
        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.setEnabled);
    
    var _showEffectLayer = function(style){
        if(!this._effectLayer || !this.isEnabled()){
            return;
        }
        
        var className = this.__buf__.clear()
            .append(this._local.effectClass)
            .append("_").append(style).toString();
        this._effectLayer.className = className;
        
        if(this.isStyleByState()){
            var state;
            switch(style){
            case "trigger":
                state = 4;
                break;
            case "hover":
                state = 2;
                break;
            default:
                break;
            }
            
            if(!isNaN(state) && state !== this.getState()){
                this.view.className = this.__buf__.clear()
                    .append(this.className).append("_")
                    .append(state).toString();
            }
        }
    };
    
    var _createEffectLayer = function(){
        var layer = this._effectLayer = DOM.createElement("DIV");
        layer.uuid = this.uuid();
        layer.className = this.__buf__.clear()
            .append(this._local.effectClass)
            .append("_").append("normal").toString();
        layer.style.cssText = "position:absolute;left:0px;top:0px;";
        DOM.appendTo(layer, this.view);
    };
    
    var _adjustEffectLayer = function(){
        if(this._effectLayer){
            // The effect layer has border
            DOM.setSize(this._effectLayer, 
                        this.view.clientWidth, this.view.clientHeight);
        }
    };

    var _onmousedown = function(e){
        _showEffectLayer.call(this, "trigger");
        
        this._local.mousedown = true;
        this.onHover(false, e.getType());
        
        e.setEventTarget(this);
        this.notifyPeer(this.getMsgType(), e);
    };

    var _onmouseup = function(e){
        if(this._local.mousedown === true){
            delete this._local.mousedown;

            _showEffectLayer.call(
                this,  
                this.isHover() ? "hover" : "normal");
            
            if(this.def.toggle === true){
                this.setTriggered(!this.isTriggered());
            }
            
            e.setEventTarget(this);
            this.notifyPeer(this.getMsgType(), e);
        }
    };
    
    thi$.onHover = function(b, eType){
        // Do something if need.        
    };

    var _onmouseover = function(e){
        if(this.contains(e.toElement, true) 
           && !this.isHover()){
            this.setHover(true);
            _showEffectLayer.call(this, "hover");
            
            this.onHover(true, e.getType());
        }
    };

    var _onmouseout = function(e){
        if(!this.contains(e.toElement, true) 
           && this.isHover()){
            delete this._local.mousedown;
            
            this.setHover(false);
            _showEffectLayer.call(
                this, 
                !this.isTriggered() ? "normal" : "trigger");
            
            this.onHover(false, e.getType());
        }
    };

    var _createElements = function(){
        var G = this.getGeometric(), className = this.className,
        body = document.body, items = this.def.items, 
        ele, id, iid, viewType, i, len;

        for(i=0, len=items.length; i<len; i++){
            id = items[i];
            iid = id.split(/\d+/g)[0];
            switch(iid){
            case "icon":
                viewType = "IMG";
                break;
            case "label":
                viewType = "SPAN";
                break;
            default:
                viewType = "DIV";
                break;
            }

            ele = DOM.createElement(viewType);
            ele.id = id;
            ele.className = className + "_" + id;
            ele.iid = iid;
            
            if(!G[iid]){
                ele.style.cssText = 
                    "position:absolute;white-space:nowrap;visibility:hidden;";
                DOM.appendTo(ele, body);
                G[iid] = DOM.getBounds(ele);
                DOM.removeFrom(ele);
                ele.style.cssText = "";
            }
            
            ele.style.cssText ="position:absolute;";
            DOM.appendTo(ele, this.view);
        }
    };

    var _checkItems = function(){
        var M = this.def, items = M.items;
        if(items.length == 0){
            if(this.isMarkable()) items.push("marker");
            if(M.iconImage) items.push("icon");
            if(M.labelText) items.push("label");
        }
    };

    thi$.destroy = function(){
        DOM.remove(this._effectLayer, true);
        delete this._effectLayer;
        
        this.detachEvent("mouseover", 0, this, _onmouseover);
        this.detachEvent("mouseout",  0, this, _onmouseout);
        this.detachEvent("mousedown", 0, this, _onmousedown);
        this.detachEvent("mouseup",   0, this, _onmouseup);
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime, view){
        if(typeof def !== "object") return;
        
        def.classType = def.classType || "js.awt.Button";
        def.className = def.className || "jsvm_button";
       
        arguments.callee.__super__.apply(this, [def, Runtime, view]);
        
        var layout = def.layout = def.layout || {};
        layout.align_x = Class.isNumber(layout.align_x) ? layout.align_x : 0.5;
        layout.align_y = Class.isNumber(layout.align_y) ? layout.align_y : 0.5;

        def.items = def.items || [];
        
        // Create inner elements
        if(view == undefined){
            _checkItems.call(this);
            _createElements.call(this);
        }
        
        if(!def.items.clear){
            js.util.LinkedList.$decorate(def.items);
        }
        def.items.clear();
        var uuid = this.uuid(), nodes = this.view.childNodes, 
        id, i, len, node;
        for(i=0, len=nodes.length; i<len; i++){
            node = nodes[i]; id = node.id;
            node.uuid = uuid;
            node.iid = (node.iid || id.split(/\d+/g)[0]);
            def.items.push(id);
            this[id] = node;
        }

        if(this.icon){
            this.setIconImage(this.isTriggered() ? 4:0);
            //DOM.forbidSelect(this.icon);
        }
        
        if(this.label){
            this.setText(def.labelText || def.text || def.name || "Button"); 
        }

        if(def.effect === true){
            this._local.effectClass = def.effectClass || "jsvm_btnEffect";
            _createEffectLayer.call(this);
        }
        
        // Set Tip
        var tip = def.tip;
        if(Class.isString(tip) && tip.length > 0) {
            this.setToolTipText(tip);
        }

        this.attachEvent("mouseover", 0, this, _onmouseover);
        this.attachEvent("mouseout",  0, this, _onmouseout);
        this.attachEvent("mousedown", 0, this, _onmousedown);
        this.attachEvent("mouseup",   0, this, _onmouseup);

    }.$override(this._init);

    this._init.apply(this, arguments);
    
}.$extend(js.awt.Component);


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
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

$import("js.awt.Button");

/**
 * Define CheckBox component
 * 
 * @param def:{
 *	 className: string, required
 * 
 *	 id: request,
 *	 
 *	 iconImage: "",
 *	 labelText: "Item",	  
 * 
 *	 state: optional,
 *	 marked : true/false,
 * 
 *	 wholeTrigger: true/false. Default is true, indicate the CheckBox will be
 *		 marked once the CheckBox is clicked. false indicate it can be marked
 *       only when the marker of the CheckBox is clicked. 
 * }
 */
js.awt.CheckBox = function(def, Runtime, view) {

	var CLASS = js.awt.CheckBox, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System;
	
	thi$.isWholeTrigger = function(){
		return this.def.wholeTrigger !== false;
	};
	
	/**
	 * @see js.awt.Button
	 * @see also js.awt.Component
	 */
	thi$.notifyPeer = function(msgID, e){
		if(e.getType() === "mouseup" && this.isWholeTrigger()){
			this.mark(!this.isMarked());
		}

		arguments.callee.__super__.apply(this,arguments);

	}.$override(this.notifyPeer);
	
	thi$.destroy = function(e){
		if(!this.isWholeTrigger()){
			this.detachEvent("click", 0, this, _onclick);
		} 
		
		arguments.callee.__super__.apply(this, arguments);		 
		
	}.$override(this.destroy);
	
	var _onclick = function(e){
		var marker = this.marker, src = e.srcElement;
		if(marker && src && marker.contains(src, true)){
			this.mark(!this.isMarked());
		}	 
	};

	thi$._init = function(def, Runtime, view) {
		if(typeof def !== "object") return;
		
		def.classType = def.classType || "js.awt.CheckBox";
		def.className = def.className || "jsvm_checkbox";
		def.css = def.css || "position:absolute;";
		def.markable = true;
		def.marked = Class.isBoolean(def.marked) ? def.marked : false;

		var layout = def.layout = def.layout || {};
		layout.align_x = Class.isNumber(layout.align_x) ? layout.align_x : 0.0;
		layout.align_y = Class.isNumber(layout.align_y) ? layout.align_y : 0.5;
		
		arguments.callee.__super__.apply(this, [def, Runtime, view]);

		this.mark(def.marked);
		
		if(!this.isWholeTrigger()){
			this.attachEvent("click", 0, this, _onclick);
		}

	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Button);


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
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

$import("js.awt.Button");

/**
 * Define RadioButton component
 * 
 * @param def:{
 *   className: string, required
 * 
 *   id: request,
 *   group: group name
 * 
 *   iconImage: "",
 *   labelText: "Item",   
 * 
 *   state:optional,
 *   marked : true/false
 * 
 * }
 */
js.awt.RadioButton = function(def, Runtime) {

    var CLASS = js.awt.RadioButton, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;
    
    /**
     * @see js.awt.Button
     */
    thi$.mark = function(b){
        arguments.callee.__super__.apply(this, arguments);

        if(this.isMarked()){
            var group = this.getGroup(), i, len, item;
            for(i=0, len=group.length; i<len; i++){
                item = group[i];
                if(item !== this){
                    item.mark(false);
                }
            }
        }        

    }.$override(this.mark);

    /**
     * @see js.awt.Button
     * @see also js.awt.Component
     */
    thi$.notifyPeer = function(msgID, e){
        if(e.getType() === "mouseup"){
            if(!this.isMarked()){
                this.mark(!this.isMarked());    
            }
        }

        arguments.callee.__super__.apply(this,arguments);

    }.$override(this.notifyPeer);

    thi$.getGroup = function(){
        return CLASS.groups[this.def.group];        
    };
    
    thi$.destroy = function(){
        var group = this.getGroup();
        group.remove(this);
        
        if(group.length === 0){
            delete CLASS.groups[this.def.group];
        }
        
        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy)

    thi$._init = function(def, Runtime, view) {
        if(typeof def !== "object") return;
        
        def.classType = def.classType || "js.awt.RadioButton";
        def.className = def.className || "jsvm_radio";
        def.css = def.css || "position:absolute;";
        def.markable = true;
        def.marked = Class.isBoolean(def.marked) ? def.marked : false;
        def.group = def.group || js.lang.Math.uuid();
        
        var layout = def.layout = def.layout || {};
        layout.align_x = Class.isNumber(layout.align_x) ? layout.align_x : 0.0;
        layout.align_y = Class.isNumber(layout.align_y) ? layout.align_y : 0.5;
        
        arguments.callee.__super__.apply(this, [def, Runtime, view]);

        CLASS.groups = CLASS.groups || {};
        var group = CLASS.groups[def.group];
        if(!group){
            group = CLASS.groups[def.group] = js.util.LinkedList.$decorate([]);
        }
        
        group.push(this);

        this.mark(def.marked);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Button);


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

$package("js.awt");
$import("js.awt.FlexibleItem");

/**
 * 
 * @param def :{
 *	   id: "MenuItem",
 *	   
 *	   iconImage: "",
 *	   labelText: "Menu",
 *	   markable: true/false,   Default is true
 *	   controlled: true/false, If has nodes, then controlles should be true
 *	   nodes:[] // sub menu
 * }
 * @param Runtime
 * @param menu
 */
js.awt.MenuItem = function (def, Runtime, menu, view){

	var CLASS = js.awt.MenuItem, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System;
	
	thi$.menuContainer = function(){
		return this.container;
	};
	
	thi$.subMenu = function(){
		return this._local.submenu;
	};
	
	thi$.setNodes = function(nodes){
		var subMenu ;
		if(Class.isArray(nodes)){
			this.def.nodes = nodes;
			
			subMenu = this.subMenu();
			if(subMenu){
				subMenu.hide();
				subMenu = this._local.submenu = null;
			}
		}
	};

	/**
	 * Show the current item's submenu, if the submenu hasn't been created,
	 * creat it. If the <em>force</em> is true, a new submenu will always be
	 * created.
	 * 
	 * @param nodes: {Array} Nodes of the submenu to creat.
	 * @param force: {Boolean} Indicate whether a new submenu will always be
	 *				 created. 
	 */ 
	thi$.showSubMenu = function(nodes, force){
		var M = this.def, menu = this.menuContainer(),
		subMenu = this.subMenu(), thickness;
		
		if(force === true && subMenu && Class.isArray(nodes)){
			subMenu.hide();
			subMenu = this._local.submenu = null;
		}
		
		if(!subMenu && Class.isArray(nodes)){
			subMenu = this._local.submenu = 
				_createSubMenu.call(this, nodes, M.menuClass);
		}
		
		if(subMenu && !subMenu.isShown()){
			thickness = M.beInMenu ? menu.getWidth() - 8 : this.getHeight();
			subMenu.showBy(this.view, M.beInMenu, thickness);
		}
	};
	
	thi$.onStateChanged = function(){
		arguments.callee.__super__.apply(this, arguments);

		if(this.isHover()){	 
			var M = this.def, menu = this.menuContainer(),
			active = menu.active, subMenu, timeout;
			
			if(active && active != this){
				subMenu = active.subMenu();
				if(subMenu && subMenu.isShown()){
					subMenu.hide("hide", this);
					active.setHover(false);
				}
			}
			if (this.isEnabled()){
				subMenu = this.subMenu();
				if(!subMenu && M.dynamic === true
				   && (typeof this.loadMenu == "function")){
					timeout = !isNaN(M.timeout) ? M.timeout : 500;
					this.loadMenu.$clearTimer();
					this.loadMenu.$delay(this, timeout);
				}else{
					this.showSubMenu(M.nodes);
				}
			}
		}
		
	}.$override(this.onStateChanged);
	
	/**
	 * @see js.awt.Component
	 */
	thi$.getPeerComponent = function(){
		var peer;
		if(this.def.beInMenu){
			peer = this.menuContainer().rootLayer().getPeerComponent();
		}else{
			peer = arguments.callee.__super__.apply(this, arguments);
		}
		
		return peer;
		
	}.$override(this.getPeerComponent);
	
	/**
	 * @see js.awt.FlexibleItem #doLayout
	 */
	thi$.doLayout = function(){
		if(this.isCustomized()){
			var customComp = this.getCustomComponent(),
			peer = customComp.getPeerComponent();
			if(!peer && DOM.isDOMElement(customComp.view)){
				customComp.setPeerComponent(this.getPeerComponent());
			}
		}
		
		arguments.callee.__super__.apply(this, arguments);
		
	}.$override(this.doLayout);
	
	var _onInput = function(e){
		e.cancelBubble();
	};

	var _createSubMenu = function(nodes, mClass){
		var M = this.def, menuC = this.menuContainer(), menuD = menuC.def,
		mClassType = M.beInMenu ? menuD.classType : (M.mClassType || "js.awt.Menu"),
		menuShadow = M.beInMenu ? menuD.shadow : (M.menuShadow !== false),
		menudef = {
			classType: mClassType,
			className: mClass || menuD.className,
			id: this.def.id,
			nodes: nodes,
			shadow: menuShadow,
			PMFlag: 0x07,
			isfloating: true
		}, pmenu, root;
		
		if(M.beInMenu){
			pmenu = menuC.parentMenu();
			root = menuC.rootLayer();
		}
		
		var submenu =new (Class.forName(mClassType))(
			menudef, this.Runtime(), pmenu, root);
		if(!M.beInMenu){
			submenu.setPeerComponent(this.getPeerComponent());
		}

		return submenu;
	};
	
	thi$.destroy = function(){
		if(this._local.submenu){
			this._local.submenu.destroy();
		}
		delete this._local.submenu;
		
		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.destroy);
	
	thi$._init = function(def, Runtime, menu, view){
		if(def == undefined) return;
		
		def.classType = def.classType || "js.awt.MenuItem";
		def.className = menu.className + "_item";
		def.beInMenu = (def.beInMenu !== false);
		def.markable =(def.markable !== false);
		def.controlled = (def.beInMenu && (Class.isArray(def.nodes) 
										   || def.dynamic === true));
		
		// By testing, when a relative div is included in another div,
		// the inner div will fetch the inner width of the outer div
		// as its width if no set any width for it.
		// So, there may not be "width:100%". Otherwise, if the menu
		// item has borders and paddings, it will exceed the outer div.
		if(def.beInMenu){
			def.css = "position:relative;";
		}
		
		arguments.callee.__super__.apply(this, [def, Runtime, view]);
		
		this.setContainer(menu);
		menu.cache[this.uuid()] = this;

		if(this.input){
			Event.attachEvent(this.input, "mousedown", 0, this, _onInput);
			Event.attachEvent(this.input, "click", 0, this, _onInput); 
		}

	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.awt.FlexibleItem);

js.awt.MenuSeparator = function(def, Runtime, menu){
	var CLASS = js.awt.MenuSeparator, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System;
	
	thi$._init = function(def, Runtime, menu){
		if(def == undefined) return;

		def.classType = "js.awt.MenuSeparator";
		def.className = menu.className + "_separator";
		def.css = "overflow:hidden;width:100%;"; // If not, IE has 13px height

		arguments.callee.__super__.apply(this, [def, Runtime]);

	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.BaseComponent);


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

$package("js.awt");

$import("js.awt.MenuItem");

/**
 * 
 * @param def :{
 *	   className: "jsvm_menu",
 *	   id: "Menu",
 *	   
 *	   iconImage: "",
 *	   labelText: "Menu",
 * 
 *	   markable: true / false, indicate whether the menu items are markable
 *	   iconic: true / false, indicate whether the menu items have icons
 *	   nodes:[] // sub menu
 * } 
 */
js.awt.Menu = function (def, Runtime, parentMenu, rootMenu){

	var CLASS = js.awt.Menu, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ;

	thi$.getPeerComponent = function(){
		var root = this.rootLayer();

		return this == root ? 
			arguments.callee.__super__.apply(this, arguments) :
			root.getPeerComponent();

	}.$override(this.getPeerComponent);

	thi$.parentMenu = function(){
		return this._local.parent;
	};

	var _setRootMenu = function(menu){
		if(menu instanceof js.awt.Menu){
			this._local.root = menu;
		}else if(!Class.isValid(menu)){
			this._local.root = this;
			MQ.register("hideMenuRoot", this, _onhideMenuRoot);
		}
	};

	var _setParentMenu = function(menu){
		if(menu instanceof js.awt.Menu){
			this._local.parent = menu;
		}else if(!Class.isValid(menu)){
			this._local.parent = this;
		}
	};

	/**
	 * Insert menu items into specified position
	 * 
	 * @param index
	 * @param itemDefs, an array of menu item definition
	 */
	thi$.insertNodes = function(index, itemDefs){
		var M = this.def, nodes = this.nodes, 
		isMarkableSetten = Class.isBoolean(M.markable),
		isIconicSetten = Class.isBoolean(M.iconic),
		ibase = index, item, refNode, itemDef, 
		clazz, i, len;

		if(!nodes){
			nodes = this.nodes = js.util.LinkedList.$decorate([]);
		}

		item = nodes.get(index);
		refNode = item ? item.view : undefined;

		for(i=0, len=itemDefs.length; i<len; i++){
			itemDef = itemDefs[i];

			if(isMarkableSetten){
				itemDef.markable = M.markable;
			}

			if(isIconicSetten){
				itemDef.iconic = M.iconic;
			}

			clazz = itemDef.classType ||
				("-" === itemDef.type ? "js.awt.MenuSeparator" : "js.awt.MenuItem");
			item = new (Class.forName(clazz))(itemDef, this.Runtime(), this);	 

			this[item.id] = item;

			nodes.add(ibase++, item);

			if(refNode){
				DOM.insertAfter(item.view, refNode);
			}else{
				DOM.appendTo(item.view, this.view);
			}

			refNode = item.view;
		};
	};

	/**
	 * Remove menu items from index to index + length
	 */
	thi$.removeNodes = function(index, length){
		var nodes = this.nodes, items = nodes.splice(index, length), item,
		cache = this.cache;
		while(items && items.length > 0){
			item = items.shift();
			delete cache[item.uuid()];
			delete this[item.id];
			item.destroy();
		}
	};

	/**
	 * Remove all menu times
	 */
	thi$.removeAllNodes = function(){
		var nodes = this.nodes;
		if(nodes){
			this.removeNodes(0, nodes.length);	  
		}
	};

	/**
	 * @see js.awt.PopupLayer
	 */
	thi$.canHide = function(e){
		var	 type = e.getType();
		switch(type){
		case "blur":
			return this.rootLayer().isHideOnBlur();
		case "mousedown":
			var el = e.srcElement;

			if(el && this.contains(el, true)){
				return false;
			}
			break;
		}

		return arguments.callee.__super__.apply(this, arguments);

	}.$override(this.canHide);	  

	/**
	 * @see js.awt.PopupLayer
	 */
	thi$.hide = function(){
		// Close my sub menu at first
		var item = this.active, subMenu = item ? item.subMenu() : undefined;
		if(item && subMenu && subMenu.isShown()){
			subMenu.hide();
			item.setHover(false);
		}
		arguments.callee.__super__.apply(this, arguments);
	}.$override(this.hide);

	/**
	 * @see js.awt.BaseComponent 
	 * @see js.awt.Component
	 */
	thi$.repaint = function(){
		if(!this._local.repaint){
			var M = this.def, bounds = this.getBounds();

			M.width = bounds.width;
			M.width -= bounds.BBM ? 0 : bounds.MBP.BPW;

			M.height = bounds.height;
			M.height-= bounds.BBM ? 0 : bounds.MBP.BPH;

			M.z = this.getStyle("z-index");

			// For shadow
			if(M.shadow === true && !this.shadowSettled()){
				this.setShadowy(true);
			}

			// For floating layer
			if(M.isfloating === true && !this.floatingSettled()){
				this.setFloating(true);	   
			}

			var nodes = this.nodes, node, i, len;
			for(i=0, len=nodes.length; i<len; i++){
				node = nodes[i];
				if(!(node instanceof js.awt.MenuSeparator)){
					node.doLayout();
					node.setEnabled(node.isEnabled());
				}
			}
			this._local.repaint = true;
		}

		if(this.shadowSettled()){
			this.addShadow();
			this.adjustShadow();
		}

		if(this.active){
			this.active.setHover(false);
			this.active = undefined;
		}

	}.$override(this.repaint);

	var _notify = function(e, item){
		/* After click a menu item, a process block may occur so that the menu
		 * cann't be hide. Maybe that is reasonable to hide it first. However, 
		 * if we hide it before notifying its peer component to do something, 
		 * the menu may be destoried. Meanwhile, the data carried by that menu 
		 * item may be destoried, too.
		 * So we copy the def of menu item and build an object as the event 
		 * target in order to avoid much change. Then we can hide menu first. 
		 * 
		 * P.S.
		 * The menu of dashboard and gadget has menu item to do something like
		 * mark. So we also need use the menu item as the event target. However,
		 * In this case, there are some memory leak risk existed.
		 */
		// e.setEventTarget(item);
		// this.notifyPeer("js.awt.event.MenuItemEvent", e);
		e.setEventTarget(System.objectCopy(item, {}));

		// Here, we will invoke the hide() to hide the menu rather than trigger
		// it by the message post. Because the message execution is asynchronously.
		// In some case, it may be block, too.		
		//MQ.post("hideMenuRoot","", [this.rootLayer().uuid()]);
		this.rootLayer().hide();

		this.notifyPeer("js.awt.event.MenuItemEvent", e);
	};

	var _onclick = function(e){
		var el = e.srcElement, uuid = el.uuid, 
		item = this.cache[uuid];

		if(item && item.isEnabled()){
			if(e.getType() == "click"){
				if(item.hitCtrl(e)){
					System.log.println("Hit the \"" + el.id + "\" ctrl.");
					e.setType("hitctrl");
				}

				_notify.call(this, e, item);
			}
		}
	};

	var _onMenuItem = function(e){
		if(e.getType() == "input"){
			_notify.call(this, e, e.getEventTarget());
		}
	};

	var _onhideMenuRoot = function(){
		this.hide();	
	};

	var _onmouseover = function(e){
		var from = e.fromElement, to = e.toElement, 
		fid = from ? from.uuid : undefined, 
		tid = to ? to.uuid : undefined,
		fitem, titem, cache = this.cache;

		if(fid !== tid){
			fitem = cache[fid];
			titem = cache[tid];
			if(fitem && fitem.isHover()){
				var subMenu = fitem.subMenu();
				if(!subMenu || !subMenu.isShown()){
					fitem.setHover(false);
					this.active = undefined;
				}
			}
			if(titem && !titem.isHover()){
				titem.setHover(true);
				this.active = titem;
			}
		}
	};


	thi$.destroy = function(){
		this.removeAllNodes();

		delete this._local.root;
		delete this._local.parent;
		delete this.cache;

		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.destroy);


	thi$._init = function(def, Runtime, parentMenu, rootMenu){
		if(def == undefined) return;

		def.classType = def.classType || "js.awt.Menu";
		def.className = def.className || "jsvm_menu";
		def.isfloating = true;
		def.PMFlag = def.PMFlag || 0x27;

		arguments.callee.__super__.apply(this, [def, Runtime]);

		_setParentMenu.call(this, parentMenu);
		_setRootMenu.call(this, rootMenu);

		this.cache = {};

		if(def.nodes && def.nodes.length > 0){
			this.insertNodes(0, def.nodes);
		}

		Event.attachEvent(this.view, "mouseover", 0, this, _onmouseover);
		Event.attachEvent(this.view, "mouseout",  0, this, _onmouseover);
		Event.attachEvent(this.view, "click",	  0, this, _onclick);

		MQ.register("js.awt.event.ItemTextEvent", this, _onMenuItem);

	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component);


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

$package("js.awt");

/**
 * @param def :{
 *	   id: ..
 *	   text: 
 *	   markable: true/false, indicates 
 * }
 */
js.awt.TreeItem = function(def, Runtime, tree, parent, view){

	var CLASS = js.awt.TreeItem, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, Permission = js.util.Permission;
	
	thi$.setText = function(text){
		this.def.text = text;
		this.label.innerHTML = js.lang.String.encodeHtml(text);
	};
	
	thi$.getText = function(){
		return this.def.text;
	};

	thi$.treeContainer = function(){
		return this.getPeerComponent();
	};

	var _setTreeContainer = function(tree){
		this.setPeerComponent(tree);
	};

	thi$.parentItem = function(){
		return this._local.parent;
	};

	var _setParentItem = function(parent){
		this._local.parent = parent || this;
	};

	thi$.hasSibling = function(){
		return this.nextSibling() != undefined;
	};

	thi$.prevSibling = function(prev){
		if(prev !== undefined){
			this._local.prev = prev;
		}
		return this._local.prev;
	};

	thi$.nextSibling = function(next){
		if(next !== undefined){
			this._local.next = next;
		}
		return this._local.next;
	};

	thi$.hasChildren = function(){
		var nodes = this.nodes;
		return (nodes && nodes.length > 0) || false;
	};
	
	thi$.canDrag = function(){
		var tree = this.treeContainer();
		return tree.canDrag(this.def);
	};

	thi$.canExpand = function(){
		var tree = this.treeContainer();
		return (tree.canExpand(this.def) || this.nodes);
	};

	thi$.isExpanded = function(){
		return this._local.expanded;	
	};
	
	thi$.isShowTip = function(){
		return this._local.showTip;
	};

	/**
	 * @see js.awt.Item
	 */
	thi$.getIconImage = function(){
		return this.treeContainer().getIconImage(this.def);
	}.$override(this.getIconImage);
	
	/**
	 * check permission, visible will' be hide.
	 */
	thi$.checkHide = function(){
		var p = parseInt(this.def.permission, 10);
		p = isNaN(p) ? 1 : p;
		this.setVisible(Permission.isVisible(p));
	};
	
	/**
	 * Insert tree items into specified position
	 * 
	 * @param index
	 * @param itemDefs, an array of tree item definition
	 */
	thi$.insertNodes = function(index, itemDefs){
		var nodes = this.nodes, ibase = index, item, prev, next, 
		itemDef, i, len;

		if(!nodes){
			nodes = this.nodes = js.util.LinkedList.$decorate([]);
		}

		for(i=0, len=itemDefs.length; i<len; i++){
			itemDef = itemDefs[i];
			itemDef.level = this.def.level + 1;
			
			if(this.isShowTip()){
				itemDef.tip = itemDef.dname;
				itemDef.showTip = true;
			}
			
			if(item && item.canCloneView(itemDef)){
				item = new js.awt.TreeItem(
					itemDef, 
					this.Runtime(), 
					this.treeContainer(), 
					this, 
					item.cloneView());
			}else{
				item = new js.awt.TreeItem(
					itemDef, 
					this.Runtime(), 
					this.treeContainer(), 
					this);
			}

			prev = ibase > 0 ? nodes.get(ibase - 1) : undefined;
			next = ibase < nodes.length ? nodes.get(ibase + 1) : undefined;

			nodes.add(ibase, item);

			if(prev){
				prev.nextSibling(item);
			}

			if(next){
				next.prevSibling(item);
			}

			item.prevSibling(prev);
			item.nextSibling(next);
			
			item.checkHide();

			ibase++;
		};
		
		// Update marker style
		for(i=0, len=nodes.length; i<len; i++){
			nodes[i].updateBranchStyle();
		}
	};
	
	/**
	 * Remove tree items from index to index + length
	 */
	thi$.removeNodes = function(index, length){
		var nodes = this.nodes, cache = this.treeContainer().cache, item;
		while(nodes.length > 0){
			item = nodes.shift();
			delete cache[item.uuid()];
			item.destroy();
		}
	};

	thi$.removeAllNodes = function(){
		var nodes = this.nodes;
		if(nodes){
			this.removeNodes(0, nodes.length);	  
		}
	};
	
	/**
	 * Gets nodes of this item
	 * 
	 * @param from, can be start TreeItem object or start index
	 * @param to, can be end TreeItem object or end index or null, 
	 * @param filter, the filter function(itemDef) which return true or false
	 * @param recursive, true or false
	 * @param ret, the return array	 
	 */
	thi$.getNodes = function(from, to, filter, recursive, ret){
		var nodes = this.nodes, 
		i0 = Class.isNumber(from) ? from : ((from == null) ? 0 : nodes.indexOf(from)), 
		i1 = Class.isNumber(to) ? to : ((to == null) ? nodes.length-1 : nodes.indexOf(to)), 
		start = i0 < i1 ? i0:i1, end = i1 > i0 ? i1 : i0, 
		i, item;

		ret = ret || [];
		for(i = start; i<=end; i++){
			item = nodes[i];
			if(typeof filter == "function"){
				if(filter(item.def)) ret.push(item);
			}else{
				ret.push(item);
			}
			if(recursive === true && item.hasChildren()){
				item.getNodes(0, null, filter, true, ret);				  
			}
		}
		return ret;
	};
	
	var _addToDOM = function(item, refNode, isLast){
		item.updateLeaderStyle();
		DOM.insertAfter(item.view, refNode);
		if(item.view.parentNode){
			item.showDisableCover(!item.isEnabled());
		}
		
		if(isLast){
			//nofity
			_afterExpand.call(this);
		}
	};
	
	var _afterExpand = function(){
		var peer = this.getPeerComponent();
		if(peer && typeof peer.onAfterExpand === "function"){
			peer.onAfterExpand();
		}
		//this.dashboard.postMQ("js.awt.event.GadgetChange", "", []);
	};
	
	thi$.isExpanding = function(){
		return this._local.expanding;
	};
	
	thi$.setExpanding = function(b){
		this._local.expanding = b;
	};

	/**
	 * Expand or Collapse an item
	 * 
	 * @param b, true for expanding and false for collapsing
	 * @param needNotify, false for don't nofity the tree to do AfterExpand,others do.
	 * @param root, mean it is the outermost layer of recursive,undefined is the outermost layer recursive
	 */	   
	thi$.expand = function(b, needNotify, root){
		if(!this.isEnabled()){
			return;
		}
		
		this.setExpanding(false);
		var nodes = this.nodes, tree = this.treeContainer(),
		className = this.branch.clazz, refNode, i, len, item;

		b = b || false;
		this._local.expanded = b;

		if(b){
			this.branch.className = className + "_4";
			this.setIconImage(4);
			
			refNode = this.view;
			if(nodes && nodes.length > 0){
				for(i=0, len=nodes.length; i<len; i++){
					item = nodes[i];
					_addToDOM.$delay(this, 1, item, refNode, ((i == len-1) && (needNotify != false)));
					refNode = item.view;
				}
			}			
		}else{
			len = nodes ? nodes.length : 0;
			for(i=len-1; i>=0; i--){
				item = nodes[i];
				if(item.isExpanded()){
					item.expand(false, undefined, item);
				}
				item.removeFrom(item.view.parentNode);
			}
			this.branch.className = className + "_0";
			this.setIconImage(0);
			//notify
			if(needNotify != false && root == undefined){
				_afterExpand.call(this);
			}
		}
	};
	
	/**
	 * Expand or collapse all items
	 * 
	 * @param b, true for expanding and false for collapsing	 
	 * @param root, mean it is the outermost layer of recursive,undefined is the outermost layer recursive
	 */
	thi$.expandAll = function(b, root){
		if(!this.isEnabled()){
			return;
		}
		
		this.expand(b, false);

		if(b){
			var nodes = this.nodes, i, len, item;
			if(nodes && this.nodes.length > 0){
				for(i=0, len=nodes.length; i<len; i++){
					item = nodes[i];
					if(item.canExpand() && !item.isExpanded()){
						item.expandAll(b, this);
					}
				}
			}			
		}
		
		//notify
		if(!root){
			_afterExpand.$delay(this, 1);
		}
	};
	
	thi$.doLayout = function(){
		if(this.label && this.controller){
			var ele = this.label, b, left;
			b = ele.scrollWidth;
			left = ele.offsetLeft;
			this.controller.setPosition(b+left);			  
		}		  
	}.$override(this.doLayout);

	thi$.updateBranchStyle = function(){
		var ex = this.canExpand(),
		ps = this.prevSibling() != undefined,
		ns = this.nextSibling() != undefined,
		b = ((ex ? 4 : 0) | (ps ? 2 : 0) | (ns ? 1 : 0)),
		bClassName = this.className + "_branch",
		branch = this.branch;
		
		if(this.isEnabled()){
			bClassName = bClassName + b;
			
			branch.clazz = bClassName;
			bClassName = bClassName + (this.isTriggered() ? "_4" : "_0");
		}else{
			branch.clazz = bClassName;
			bClassName = bClassName + "_1";
		}
		
		branch.className = bClassName;
	};
	
	thi$.updateLeaderStyle = function(){
		var p = this.parentItem(), M = this.def, level = M.level,
		comps = M.items, comp;

		for(var i=level-1; i>=0; i--){
			comp = this[comps[i]];
			if(p.hasSibling()){
				comp.className = def.className + "_leader1";
			}else{
				comp.className = def.className + "_leader0";
			}
			p = p.parentItem();
		}
	};
	
	/**
	 * @see js.awt.Item
	 */
	thi$.canCloneView = function(itemDef){
		var items = [], level = itemDef.level;

		// Leaders
		for(var i=level; i>0; i--){
			items.unshift("leader"+i);
		};
		
		items.push("branch");
		if(itemDef.markable === true) items.push("marker");
		items.push("icon");
		items.push("label");

		return items.length === this.def.items.length;

	}.$override(this.canCloneView);
	
	var _checkItems = function(def, tree, parent){
		var level = def.level, items = def.items;

		// Leaders
		for(var i=level; i>0; i--){
			items.unshift("leader"+i);
		};
		
		items.push("branch");
		if(def.markable === true) items.push("marker");
		items.push("icon");
		items.push("label");

	};

	thi$.destroy = function(){
		delete this._local.parent;
		delete this._local.prev;
		delete this._local.next;
		
		this.removeAllNodes();
		delete this.nodes;

		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.destroy);

	thi$._init = function(def, Runtime, tree, parent, view){
		if(def == undefined) return;

		_setTreeContainer.call(this, tree);

		def.classType = def.classType || "js.awt.TreeItem";
		def.className = tree.className + "_item";
		def.css = "position:relative;overflow:visible;width:100%;";
		
		if(view == undefined){
			def.items = js.util.LinkedList.$decorate([]);

			def.level = Class.isNumber(def.level) ? def.level : 0;
			_checkItems.call(this, def);
		}

		arguments.callee.__super__.apply(this, [def, Runtime, view]);

		_setParentItem.call(this, parent);
		
		tree.cache[this.uuid()] = this;
		
		this._local.showTip = def.showTip || false;

		if(def.nodes && def.nodes.length > 0){
			this.insertNodes(0, def.nodes);
		}

	}.$override(this._init);

	this._init.apply(this, arguments);


}.$extend(js.awt.Item);


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

$package("js.awt");

$import("js.awt.TreeItem");

/**
 *
 */
js.awt.TreeDataProvider = function(){

    var CLASS = js.awt.TreeDataProvider, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    /**
     * Sets expandable map for testing hether an tree item can be expanded.
     *
     * @param map, { type: true|false...}
     */
    thi$.setExpandableMap = function(map){
        this.expandMap = map;
    };

    /**
     * Tests whether the specified tree item can be expanded
     *
     * @param def, the tree item def
     * @return true/false
     *
     * Notes: Sub class should overrides this method
     */
    thi$.canExpand = function(def){
        var type = def.type, map = this.expandMap,
        b = map ? map[type] : false;

        return b || false;
    };

    /**
     * Sets dragable map for testing whether an tree item can be draged.
     *
     * @param map, { type: true|false...}
     */
    thi$.setDragableMap = function(map){
        this.dragMap = map;
    };

    /**
     * Tests whether the specified tree item can be draged
     *
     * @param def, the tree item def
     * @return true/false
     *
     * Notes: Sub class should overrides this method
     */
    thi$.canDrag = function(def){
        var type = def.type, map = this.dragMap,
        b = map ? map[type] : false;

        return b || false;
    };

    /**
     * Sets image map for getting image name according to
     * the type of a tree item.
     *
     * @param map, {type: imagename...}
     */
    thi$.setImageMap = function(map){
        this.imageMap = map;
    };

    /**
     * Gets image name from image map for the specified tree item.
     *
     * @param def, the tree item def
     * @return image name
     *
     * Notes: Sub class should overrides this method.
     */
    thi$.getIconImage = function(def){
        var type = def.type, map = this.imageMap,
        image = map ? map[type] : "blank.gif";
        return image;
    };

    /**
     * The message type is such a string that identify what kind message
     * will be posted to message receivers. Generally, message receivers
     * are drop targets.
     *
     * Notes: Sub class should implements this function.
     */
    thi$.getDragMsgType = function(){
        return "js.awt.event.TreeItemDrag";
    };

    /**
     * The mover will invoke this method to determine moving message
     * should be posted to which receivers.
     */
    thi$.getDragMsgRecvs = function(){
        return null;
    };


    /**
     * If a tree node is dynamic load, when it expands, it need
     * get new data from this provider. When the provider got data,
     * must invoke callback(data, item) to notify Tree.
     * The data must be an object like below:
     * {
     *     id:...
     *     type: ...
     *
     *     nodes:[
     *         ...
     *     ]
     * }
     *
     * Notes: Sub class should overrides this method
     */
    thi$.getData = function(itemDef, callback){
        callback({});
    };

};

/**
 *
 */
js.awt.Tree = function(def, Runtime, dataProvider){

    var CLASS = js.awt.Tree, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ,

    permission = Class.forName("js.util.Permission");

    thi$.setDataProvider = function(dataProvider){
        if(!dataProvider.instanceOf(js.awt.TreeDataProvider))
            throw "Request a js.awt.TreeDataProvider instance";

        this.dataProvider = dataProvider;
    };

    thi$.canExpand = function(itemDef){
        return this.dataProvider.canExpand(itemDef);
    };

    thi$.canDrag = function(itemDef){
        return this.dataProvider.canDrag(itemDef);
    };

    thi$.getIconImage = function(itemDef){
        return this.dataProvider.getIconImage(itemDef);
    };

    thi$.showTip = function(showTip){
        this._local.showTip = showTip;
    };

    thi$.isShowTip = function(){
        return this._local.showTip || false;
    };

    thi$.setItemEnabled = function(item, b){
        b = (b === true);
        if(item.isEnabled() === b){
            return;
        }

        if(!b && item.canExpand() && item.isExpanded()){
            this.expandAll(false, item);
        }

        item.setEnabled(b);
        item.updateBranchStyle();
    };

    /**
     * Insert tree items into specified position
     *
     * @param index
     * @param itemDefs, an array of tree item definition
     */
    thi$.insertNodes = function(index, itemDefs){
        var nodes = this.nodes, ibase = index, item, refNode,
        itemDef, i, len;

        if(!nodes){
            nodes = this.nodes = js.util.LinkedList.$decorate([]);
        }

        item = nodes.get(index);
        refNode = item ? item.view : undefined;

        for(i=0, len=itemDefs.length; i<len; i++){
            itemDef = itemDefs[i];
//            if(itemDef.isVisible == false){
//                continue;
//            }
            itemDef.level = 0;
            if(this.isShowTip()){
                itemDef.tip = itemDef.dname;
                itemDef.showTip = true;
            }
            if(i === 0){
                item = new js.awt.TreeItem(itemDef, this.Runtime(), this);
            }else{
                item = new js.awt.TreeItem(
                    itemDef,
                    this.Runtime(),
                    this,
                    undefined,
                    item.cloneView());
            }

            nodes.add(ibase++, item);

            if(refNode){
                DOM.insertAfter(item.view, refNode);
            }else{
                DOM.appendTo(item.view, this._treeView);
            }
            
            item.checkHide();

            refNode = item.view;
        };

        // Update marker style
        var marked = this.marked;
        for(i=0, len=nodes.length; i<len; i++){
            item = nodes[i];
            item.updateBranchStyle();

            if(item.isMarked()){
                marked.push(item);
            }
        }
        this._doSort();
        delete this._local.maxSize;
    };

    thi$._doSort = function(){
        var tree = this;
        var _func = function(item1, item2){
            return tree.getNodeIndex(item1) - tree.getNodeIndex(item2);
        };

        this.marked.sort(_func);
        this.selected.sort(_func);
    };

    /**
     * Remove the specified item from current tree.
     *
     * @param item: {js.awt.TreeItem} A tree item to remove.
     */
    thi$.removeNode = function(item){
        if(!item || !(item.instanceOf(js.awt.TreeItem))){
            return;
        }

        _keepScroll.call(this);

        var pitem = item.parentItem(),
        nodes = pitem ? pitem.nodes : null;

        if(Class.isArray(nodes)){
            js.util.LinkedList.$decorate(nodes);
            nodes.remove(item);
        }

        delete this.cache[item.uuid()];
        
        this.marked.remove(item);
        this.selected.remove(item);
        item.destroy();

        this._doSort();
        delete this._local.maxSize;

        _setMaxSize.$delay(this, 1);
        _keepScroll.$delay(this, 1, true);
    };

    /**
     * Remove tree items from index to index + length
     *
     * @param index: {Integer} index of each item in nodes of current tree to remove.
     * @param length: {Integer} Indicate how many items to remove.
     */
    thi$.removeNodes = function(index, length, isDestroying){
        var nodes = this.nodes || [], cnt = nodes.length,
        cache = this.cache, marked = this.marked, 
        selected = this.selected, item;

        if(!Class.isNumber(index)){
            index = 0;
        }else{
            index = index < 0
                ? 0 : (index >= cnt ? cnt - 1 : index);
        }

        if(!Class.isNumber(length)){
            length = cnt - index;
        }else{
            length = length < 0 ? 0
                : (index + length > cnt ? cnt - index : length);
        }

        _keepScroll.call(this);

        nodes = nodes.splice(index, length);
        while(nodes.length > 0){
            item = nodes.shift();
            delete cache[item.uuid()];
            
            marked.remove(item);
            selected.remove(item);
            item.destroy();
        }

        if(isDestroying === true){
            return;
        }

        this._doSort();
        delete this._local.maxSize;

        _setMaxSize.$delay(this, 1);
        _keepScroll.$delay(this, 1, true);
    };

    /**
     * Remove all tree times
     */
    thi$.removeAllNodes = function(isDestroying){
        var nodes = this.nodes;
        if(nodes){
            this.removeNodes(0, nodes.length, isDestroying);
        }
    };

    thi$.getTreeNodeByTypes = function(types, index){
        var nodes = this.nodes || [];

        if(!Class.isArray(types)
           || types.length == 0){
            return nodes[0];
        }

        if(!Class.isFunction(types.indexOf)){
            js.util.LinkedList.$decorate(types);
        }

        return _getTreeNodeByTypes.call(this, nodes, types, index);
    };

    var _getTreeNodeByTypes = function(nodes, types, index){
        var node, type, tmp;
        for(var i = 0, len = nodes.length; i < len; i++){
            node = nodes[i];
            type = node.def["type"];

            if(types.indexOf(type) !== -1){
                index--;
                if(index <= 0){
                    return node;
                }else{
                    tmp = node.nodes;
                    if(tmp && tmp.length > 0){
                        return _getTreeNodeByTypes.call(this, tmp, types, index);
                    }
                }
            }else{
                tmp = node.nodes;
                if(tmp && tmp.length > 0){
                    return _getTreeNodeByTypes.call(this, tmp, types, index);
                }
            }
        }

        return node;
    };

    /**
     * Move tree item from index1 to index2.
     */
    thi$.moveNode = function(index1, index2){
        var nodes = this.nodes, len = nodes.length;
        if(!Class.isNumber(index1) || index1 < 0 || index1 >= len
           || !Class.isNumber(index2) || index2 < 0 || index2 >= len){
            return;
        }

        var node1 = nodes[index1], node2 = nodes[index2],
        view1, view2, treeView = this._treeView;

        nodes[index1] = node2;
        nodes[index2] = node1;

        view1 = node1.view;
        view2 = node2.view;

        treeView.removeChild(view1);

        if(index1 < index2){
            DOM.insertAfter(view1, view2, treeView);
        } else {
            DOM.insertBefore(view1, view2, treeView);
        }

        this._doSort();
    };

    /**
     * Expand tree with the specified item
     *
     * @param item, with which item
     * @param needNitify, false for don't nofity the tree to do AfterExpand,others do.
     */
    thi$.expand = function(item, needNotify){
        if(item.def.isRead == false){
            return;
        }

        if(item.isExpanding()){
            return;
        }

        item.setExpanding(true);

        _keepScroll.call(this);

        if(item.isExpanded()){
            item.expand(false, needNotify);
            if(item.def.nodes == undefined){
                item.removeAllNodes();
            }
            _setMaxSize.$delay(this, 1);
            _keepScroll.$delay(this, 1, true);
        }else{
            if(item.def.nodes == undefined){
                // Ask data from dataProvider
                this.dataProvider.getData(
                    item.def,
                    _onGetData.$bind(this, item, needNotify));
            }else{
                // No need get data, so expand item directly
                item.expand(true, needNotify);
                _setMaxSize.$delay(this, 1);
                _keepScroll.$delay(this, 1, true);
            }

        }
        delete this._local.maxSize;
    };


    var _checkData = function(data){
        var p = data.permission;
        if(p){
            data.isVisible = permission.isVisible(p);
            data.isRead = permission.isRead(p);
            data.isWrite = permission.isWrite(p);
            data.isExecute = permission.isExecute(p);
        }
        if(data.nodes){
            for(var i = 0,nodes = data.nodes, len = data.nodes.length;i < len; i++){
                if(nodes[i].nodes){
                    nodes[i] = _checkData.call(this, nodes[i]);
                }else{
                    p = nodes[i].permission;
                    if(p){
                        nodes[i].isVisible = permission.isVisible(p);
                        nodes[i].isRead = permission.isRead(p);
                        nodes[i].isWrite = permission.isWrite(p);
                        nodes[i].isExecute = permission.isExecute(p);
                    }
                }
            }
        }
        return data;
    };

    var _onGetData = function(data, item, needNotify){

        data = _checkData.call(this, data);

        if(data && data.nodes){
            item.insertNodes(0, data.nodes);
            item.expand(true, needNotify);
            _setMaxSize.$delay(this, 1);
            _keepScroll.$delay(this, 1, true);
        }else{
            item.branch.className = item.className + "_branch0";
        }
    };

    /**
     * Expand or collapse all items
     *
     * @param b, true for expanding and false for collapsing
     *
     */
    thi$.expandAll = function(b, root){
        var nodes = this.nodes, i, len, item;
        if(root){
            nodes = [root];
        }

        if(nodes && nodes.length>0){
            for(i=0, len=nodes.length; i<len; i++){
                item = nodes[i];
                if(b){
                    if(item.canExpand() && !item.isExpanded()){
                        item.expandAll(b, item);
                    }
                }else{
                    if(item.canExpand() && item.isExpanded()){
                        item.expand(b);
                    }
                }
            }
        }
        _setMaxSize.$delay(this, 1);
        _keepScroll.$delay(this, 1, true);

        this.onAfterExpand.$delay(this,1);
        delete this._local.maxSize;
    };

    thi$.onAfterExpand = function(){
        var cache = this.cache,item;
        for(var uuid in cache){
            item = this.cache[uuid];
            if((!item.isEnabled()) && item.view.parentNode !== null){
                item._adjust("move");
            }
        }
    };

    /**
     * Gets all nodes which were accepted by filter
     *
     * @param, the filter function(itemDef) which return true or false
     * @param, recursive
     */
    thi$.getNodes = function(filter, recursive){
        var nodes = this.nodes, i, len, item, ret = [];
        for(i=0, len=nodes.length; i<len; i++){
            item = nodes[i];
            if(typeof filter == "function"){
                if(filter(item.def)) ret.push(item);
            }else{
                ret.push(item);
            }
            if(recursive === true && item.hasChildren()){
                item.getNodes(0, null, filter, true, ret);
            }
        }
        return ret;
    };

    /**
     * Returns all node index
     */
    thi$.getNodeIndex = function(item){
        var nodes = this.nodes;
        for(var i=0; i<nodes.length; i++){
            if(nodes[i] == item){
                return i;
            }
        }
        return -1;
    };

    /**
     * Returns all items
     */
    thi$.getAllNodes = function(){
        return this.nodes;
    };

    /**
     * Returns all selected items
     */
    thi$.getAllSelected = function(){
        return this.selected;
    };

    /**
     * Clears all selected items
     */
    thi$.clearAllSelected = function(){
        var selected = this.selected, item;
        while(selected.length > 0){
            item = selected.shift();
            item.setTriggered(false);
        }
        this._doSort();
    };

    /**
     * Returns all marked items
     */
    thi$.getAllMarked = function(){
        return this.marked;
    };

    /**
     * Clears all marked items
     */
    thi$.clearAllMarked = function(){
        var marked = this.marked, item;
        while(marked.length > 0){
            item = marked.shift();
            item.mark(false);
        }
        this._doSort();
    };

    /**
     * Mark a tree node
     *
     * @param item, tree item
     */
    thi$.markNode = function(item){
        if(!item.isMarkable()) return;

        item.mark(!item.isMarked());
        if(item.isMarked()){
            this.marked.push(item);
        }else{
            this.marked.remove(item);
        }
        this._doSort();
    };

    /**
     * @see js.awt.Movable
     */
    thi$.isMoverSpot = function(el, x, y){
        var uuid = el.uuid, item = this.cache[uuid];

        if(item){
            if (this.selected.length > 0){
                return true;
            }else{
                if(item.isMoverSpot(el) && item.canDrag()){
                    return true;
                }
            }
        }

        return false;
    };

    thi$.setMultiEnable = function(b){
        this.def.multiEnable = (b === true);
    };

    thi$.isMultiEnable = function(){
        return this.def.multiEnable;
    };

    thi$.getMoveObjectDef = function(item){
        return {};
    };

    /**
     * @see js.awt.Movable
     */
    thi$.getMoveObject = function(e){
        var moveObj = this.moveObj;
        if(!moveObj){
            var el = e.srcElement, uuid = el.uuid, item = this.cache[uuid],
            mdef, absXY = e.eventXY();

            if(item.def.isExecute == false){
                return null;
            }

            if(this.selected.length == 0){
                var state = new js.awt.State(this.getState());
                state.setHover(false);
                state.setTriggered(true);
                item.setState(state.getState());
                this.selected.push(item);
                this._doSort();
            }

            mdef = this.getMoveObjectDef() || {};
            moveObj = this.moveObj =
                new js.awt.TreeMoveObject(mdef, this.Runtime(), this);
            moveObj.setMovingPeer(this);
            moveObj.appendTo(document.body);

            /*moveObj.setPosition(absXY.x, absXY.y);*/
            moveObj.setPosition(absXY.x - 10, absXY.y - 8);
        }

        return moveObj;
    };

    /**
     * Keep and restore scroll bar position
     *
     * @param restore, true means restore
     */
    var _keepScroll = function(restore){
        var U = this._local, el = this.view;
        if(!restore){
            U.scrollLeft = el.scrollLeft;
            U.scrollTop  = el.scrollTop;
        }else{
            el.scrollLeft = U.scrollLeft;
            el.scrollTop  = U.scrollTop;
        }
    };

    /**
     * Sets treeView max size
     */
    var _setMaxSize = function(){
        var rect = _getMaxSize.call(this), box = this.getBounds(),
        cw = box.innerWidth, ch = box.innerHeight, MBP = box.MBP,
        w = rect.width >= cw ? rect.width : undefined,
        h = rect.height >= ch ? rect.height : undefined;

        this.view.style.overflow = "hidden";

        // The treeview is relative and position in the inside of padding.
        // For holding the padding of tree, we will add the right padding
        // to the content width as treeview's width. And add the bottom
        // padding to the content height as treeview's height.
        if(w != undefined){
            w += MBP.borderRightWidth + MBP.paddingRight;
        }

        if(h != undefined){
            h += MBP.borderBottomWidth + MBP.paddingBottom;
        }

        DOM.setSize(this._treeView, w, h);

        if(w == undefined){
            this._treeView.style.width = "100%";
        }
        if(h == undefined){
            this._treeView.style.height= "100%";
        }

        this.view.style.overflow = "auto";
    };

    /**
     * Gets treeView max size
     */
    var _getMaxSize = function(force){
        var treeview = this._treeView, ret = this._local.maxSize;
        if(force !== true && ret){
            return ret;
        }

        treeview.style.overflow = "hidden";
        DOM.setSize(treeview, 0, 0);
        ret = this._local.maxSize = {
            width: treeview.scrollWidth,
            height:treeview.scrollHeight
        };
        treeview.style.overflow = "visible";
        return ret;
    };

    thi$.doLayout = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            _setMaxSize.call(this);
            return true;
        }
        return false;
    }.$override(this.doLayout);

    thi$.getOptimalSize = function(){
        var size = _getMaxSize.call(this),
        bounds = this.getBounds(),
        w = size.width, h = size.height;

        w += bounds.MBP.BPW;
        h += bounds.MBP.BPH;
        return {width: w, height: h};
    };
    
	thi$.scrollTo = function(ele){
		var view = this.view, bounds, MBP, box, x, y, x0, y0, 
		scrollLeft, scrollTop;
		if(!ele || !DOM.contains(this._treeView, ele)){
			return;
		}
		
		bounds = this.getBounds();
        MBP = bounds.MBP;
		x = bounds.absX; // + MBP.borderLeftWidth + MBP.paddingLeft;
		y = bounds.absY; // + MBP.borderTopWidth + MBP.paddingTop;
		x0 = x + (bounds.clientWidth - MBP.BPW);
		y0 = y + (bounds.clientHeight - MBP.BPH);
		scrollLeft = view.scrollLeft;
		scrollTop = view.scrollTop;
		
		System.log.println("Scroll Position: (" + scrollLeft + ", " + scrollTop + ")");

		box = DOM.getBounds(ele);
		
		if(box.absX < x){
			scrollLeft -= x - box.absX;
		}else{
			if(box.absX >= x0){
				scrollLeft += box.absX - x0 + box.width;
			}
		}
		
		if(box.absY < y){
			scrollTop -= y - box.absY;
		}else{
			if(box.absY >= y0){
				scrollTop += box.absY - y0 + box.height;
			}
		}
		
		System.log.println("New Scroll Position: (" + scrollLeft + ", " + scrollTop + ")");
		
		if(scrollLeft != view.scrollLeft){
			view.scrollLeft = scrollLeft;
		}
		
		if(scrollTop != view.scrollTop){
			view.scrollTop = scrollTop;
		}
	};
    
    var _onclick = function(e){
        var isMulti = this.def.multiEnable, el = e.srcElement, uuid = el.uuid,
        item = this.cache[uuid], selected = this.selected;

        if(item && item.isEnabled()){
            if(e.getType() == "click"){
                if(el === item.branch && item.canExpand()){
                    this.clearAllSelected();
                    this.expand(item);
                    return;
                }else if(el === item.marker && item.isMarkable()){
                    this.markNode(item);
                    e.setType("markchanged");
                    e.setEventTarget(item);
                    this.notifyPeer("js.awt.event.TreeItemEvent", e);
                    return;
                }else if (item.canDrag()){
                    if(isMulti && e.ctrlKey === true){
                        item.setTriggered(!item.isTriggered());
                        if(item.isTriggered()){
                            selected.push(item);
                        }else{
                            selected.remove(item);
                        }
                    }else if(isMulti && e.shiftKey === true){
                        var first = selected.length > 0 ? selected[0] : undefined;

                        if(first == undefined){
                            first = item;
                            item.setTriggered(true);
                            selected.push(item);
                        }

                        if(first && item && first.parentItem() == item.parentItem()){
                            var nodes = first.parentItem().getNodes(first, item), node;
                            for(var i=1, len=nodes.length; i<len; i++){
                                node = nodes[i];
                                node.setTriggered(true);
                                selected.push(node);
                            }
                        }
                    }else if(item.isTriggered()){
                        this.clearAllSelected();
                    }else{
                        this.clearAllSelected();
                        item.setTriggered(true);
                        selected.push(item);
                    }
                }
                this._doSort();
                e.setType("selectchanged");
                e.setData(this.getAllSelected());
                e.setEventTarget(item);
                this.notifyPeer("js.awt.event.TreeItemEvent", e);
                return;
            }
        }

        if(this.selected.length){
            this.clearAllSelected();
            e.setType("selectchanged");
            e.setData(this.getAllSelected());
            this.notifyPeer("js.awt.event.TreeItemEvent", e);
        }
    };

    var _onmouseover = function(e){
        var from = e.fromElement, to = e.toElement,
        fid = from ? from.uuid : undefined,
        tid = to ? to.uuid : undefined,
        fitem, titem, cache = this.cache;

        if(fid !== tid){
            fitem = cache[fid];
            titem = cache[tid];
            if(fitem && fitem.isHover() && fitem.isEnabled()){
                fitem.setHover(false);
            }
            if(titem && !titem.isHover() && titem.isEnabled()){
                titem.setHover(true);
            }
        }
    };

    // Only bind to treeView to avoid autoscroll when drag an item
    var _onmousedown = function(e){
        return e.cancelDefault();
    };

    // Notify tree peer
    var _ondrag = function(e){
        this.notifyPeer("js.awt.event.TreeItemEvent", e);
    };

    thi$.destroy = function(){
        this.removeAllNodes(true);
        delete this.nodes;
        delete this.cache;
        delete this.selected;
        delete this.marked;
        delete this.dataProvider;

        DOM.remove(this._treeView, true);
        delete this._treeView;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    var _onevent = function(e){

    };

    thi$._init = function(def, Runtime, dataProvider){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Tree";
        def.className = def.className || "jsvm_tree";
        def.stateless = true;

        def.mover = def.mover || {};
        def.mover.longpress = def.mover.longpress || 250;
        def.multiEnable = (def.multiEnable === true);

        // Call base _init
        arguments.callee.__super__.apply(this, [def, Runtime]);

        // Cache all tree items
        this.cache = {};
        this.selected = js.util.LinkedList.$decorate([]);
        this.marked = js.util.LinkedList.$decorate([]);

        this.showTip(def.showTip);

        var treeView = this._treeView = DOM.createElement("DIV");
        treeView.className = this.className + "_treeview";
        treeView.style.cssText = "position:relative;width:100%;height:100%;"
            + "overflow:visible;";
        DOM.appendTo(treeView, this.view);

        this.setDataProvider(dataProvider ||
                             new js.awt.AbstractTreeDataProvider(this.Runtime()));

        if(def.nodes && def.nodes.length > 0){
            this.insertNodes(0, def.nodes);
        }

        Event.attachEvent(treeView, "mouseover", 0, this, _onmouseover);
        Event.attachEvent(treeView, "mouseout",  0, this, _onmouseover);
        Event.attachEvent(treeView, "click",     0, this, _onclick);
        Event.attachEvent(treeView, "dblclick",  0, this, _onclick);

        // Avoid autoscroll when drag item.
        Event.attachEvent(treeView, "mousedown", 1, this, _onmousedown);

        if(this.isMovable()){
            MQ.register(this.dataProvider.getDragMsgType(), this, _ondrag);
        }

        MQ.register("js.awt.event.TreeItemEvent", this, _onevent);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Component);

/**
 * This is a default TreeDataProvider
 *
 * @see js.awt.TreeDataProvider
 */
js.awt.AbstractTreeDataProvider = function(Runtime, imageMap, expandMap, dragMap){

    var CLASS = js.awt.AbstractTreeDataProvider, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    thi$.destroy = function(){
        delete this._local.Runtime;
        delete this.imageMap;
        delete this.expandMap;
        delete this.dragMap;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$._init = function(Runtime, imageMap, expandMap, dragMap){
        if(Runtime == undefined) return;

        this._local = this._local || {};

        this._local.Runtime = Runtime;
        this.setImageMap(imageMap);
        this.setExpandableMap(expandMap);
        this.setDragableMap(dragMap);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.lang.Object).$implements(js.awt.TreeDataProvider);

/**
 * @see js.awt.Movable
 * @see js.awt.MoveObject
 */
js.awt.TreeMoveObject = function(def, Runtime, tree){

    var CLASS = js.awt.TreeMoveObject, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, dataProvider;

    /**
     * @see js.awt.Movable
     */
    thi$.getMovingData = function(){
        return this.movingPeer.selected;
    };

    /**
     * @see js.awt.Movable
     */
    thi$.getMovingMsgType = function(){
        return dataProvider.getDragMsgType();
    };

    /**
     * @see js.awt.Movable
     */
    thi$.getMovingMsgRecvs = function(){
        return dataProvider.getDragMsgRecvs();
    };

    /**
     * @see js.awt.Movable
     */
    thi$.releaseMoveObject = function(){
        var tree = this.movingPeer;
        tree.clearAllSelected();

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.releaseMoveObject);

    thi$.getPreferredSize = function(nocache){
        var ret = this.def.prefSize, d, w = 0, ch, h = 0;
        if(nocache === true || !ret){
            d = this.getBounds();
            w += d.MBP.BPW;
            h += d.MBP.BPH;

            d = DOM.getBounds(this.icon);
            w += d.width + d.MBP.marginLeft + d.MBP.marginRight;
            ch = d.height;

            d = DOM.getBounds(this.label);
            w += d.width + d.MBP.marginLeft + d.MBP.marginRight;
            h += Math.max(ch, d.height);

            this.setPreferredSize(w, h);
            ret = this.def.prefSize;
        }

        return ret;

    }.$override(this.getPreferredSize);

    thi$.repaint = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            var bounds = this.getBounds(), buf = new js.lang.StringBuffer(),
            left = bounds.MBP.paddingLeft, top = bounds.MBP.paddingTop,
            width = bounds.innerWidth;

            buf.append("position:absolute;left:")
                .append(left).append("px;")
                .append("top:").append(top).append("px;");
            this.icon.style.cssText = buf.toString();

            bounds = this.icon.bounds;
            left += bounds.width + bounds.MBP.marginRight;
            width -= left;
            buf.clear().append("position:absolute;left:")
                .append(left).append("px;")
                .append("top:").append(top).append("px;width:")
                .append(width).append("px;");
            this.label.style.cssText = buf.toString();
        }
    }.$override(this.repaint);

    thi$._init = function(def, Runtime, tree){
        if(def === undefined) return;

        var selected = tree.selected;
        def.classType = "js.awt.TreeMoveObject";
        if(selected.length === 1){
            def.className = tree.className + "_moveobj0";
        }else{
            def.className = tree.className + "_moveobj1";
        }

        def.css = "position:absolute;";
        def.stateless = true;

        arguments.callee.__super__.apply(this, [def, Runtime]);

        dataProvider = tree.dataProvider;

        var item = selected[0], G = item.getGeometric(),
        icon = this.icon = item.icon.cloneNode(true),
        label = this.label = item.label.cloneNode(true),
        text = item.getText();

        icon.bounds = G.icon;
        DOM.appendTo(icon, this.view);

        // Maybe current label has been highlighted  
        label.innerHTML = js.lang.String.encodeHtml(text || "");
        DOM.appendTo(label, this.view);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(js.awt.MoveObject);


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

$package("js.awt");

js.awt.Frame = function (){

    var CLASS = js.awt.Frame, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM;

    thi$.getWindow = function(){
        if(this.instanceOf(js.awt.IFrame)){
            try{
                return this.view.contentWindow;
            } catch (x) {
                return null;
            }
        }
        return null;
    };

    thi$.getDocument = function(){
        var win = this.getWindow();
        try{
            return win ? win.document : null;
        } catch (x) {

        }
        return null;
    };

    thi$.getBody = function(){
        var doc = this.getDocument();
        return doc ? doc.body : null;
    };

    thi$.setSrc = function(url){
        this.def.src = url;
    };

    thi$.getSrc = function(){
        return this.def.src;
    };
    
    thi$.setContent = function(html, href){
        if(this.instanceOf(js.awt.IFrame)){
            var doc = this.getDocument();
            if(doc){
                doc.open();
                doc.write(html);
                doc.close();
            }
        }else{
        }
    };
    
    var _load = function(url){
        var http = J$VM.XHRPool.getXHR(true);

        http.onsuccess = function(e){
            var xhr = e.getData();
            this.setContent(xhr.responseText());
            http.close();
            return;
        }.$bind(this);

        http.onhttperr = function(e){
            var xhr = e.getData();
            // TODO: handle error
            http.close();
            return;
        }.$bind(this);

        http.open("GET", url);
    };

    thi$.load = function(){
        if(this.instanceOf(js.awt.IFrame)){
            this.view.src = this.def.src;
        }else{
            _load.call(this, this.def.src);
        }
    };
    
    /**
     * Notes: subclass should implements this method
     * 
     */
    thi$.refresh = function(){
        
    };
    
};

js.awt.ScriptScope = function(host){

    var CLASS = js.awt.ScriptScope, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    thi$.exec = function(script){
        var host = this.host;

        (function(s){
             eval(s);
         }).$delay(this, 1, script);
    };
    
    thi$.clear = function(){
        for(var p in this){
            if(this.hasOwnProperty(p)) {
                delete this.p;
            }
        }
    };

    thi$._init = function(host){
        if(host == undefined) return;

        this.host = host;        
    };

    this._init.apply(this, arguments);
    
}.$extend(js.util.EventTarget);



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

$package("js.awt");

js.awt.IFrame = function (def, Runtime){

    var CLASS = js.awt.IFrame, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;

    thi$.refresh = function(){
        var win = this.getWindow();
        if(win){
            MQ.post("refresh", "", [], win);
        }
    }.$override(this.refresh);

    var _showCover = function(){
        this.showCover(true);
    };
    
    var _hideCover = function(){
        this.showCover(false);
    };

    var _onload = function(e){
        var doc = this.getDocument();

        if(doc){
            try{
                Event.attachEvent(doc, "mousedown", 0, this, _onmousedown);
            } catch (x) {
                // Maybe cross-domain
                var err = e ? e.message : "Can't attach mousedown event to IFrame";
			    System.err.println(err);
            }
        }
        return true;
    };

    var _onunload = function(e){
        var doc = this.getDocument();

        if(doc){
            try{
                Event.detachEvent(doc, "mousedown", 0, this, _onmousedown);
            } catch (x) {
                // Nothing to do
            }
        }
        return true;
    };

    var _onmousedown = function(e){
        var win = this.getWindow();
        if(win && win.parent != win.self){
            MQ.post("js.awt.event.LayerEvent", 
                    new Event("message", "", this), 
                    [this.Runtime().uuid()]);
        }
    };

    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.IFrame";
        def.className = def.className || "jsvm_iframe";
        def.viewType = "IFRAME";

        arguments.callee.__super__.apply(this, arguments);
        this.setAttribute("frameBorder", "0");

        if(def.src){
            this.setSrc(def.src);
        }

        Event.attachEvent(this.view, "load", 0, this, _onload);
        Event.attachEvent(this.view, "unload", 0, this, _onunload);

        MQ.register(Event.SYS_EVT_MOVING,   this, _showCover);
        MQ.register(Event.SYS_EVT_MOVED,    this, _hideCover);
        MQ.register(Event.SYS_EVT_RESIZING, this, _showCover);
        MQ.register(Event.SYS_EVT_RESIZED,  this, _hideCover);
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(js.awt.Frame);


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

$package("js.awt");

js.awt.VFrame = function(def, Runtime){

    var CLASS = js.awt.VFrame, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    thi$.setContent = function(html, href){
        if(!_destroyScope.call(this)) return;

        this.scope = new js.awt.ScriptScope(
            this.getPeerComponent() || this);

        var script, testre = /<script\b[\s\S]*?>([\s\S]*?)<\/script/i;

        // Remove content within <!-- -->
        html = html.replace(/<!--[\s\S]*?-->/g, "");

        this.view.innerHTML = html.replace(
                /<script.*?>[\s\S]*?<\/.*?script>/gi, "");

        if (testre.test(html)) {
            var re = /<script\b[\s\S]*?>([\s\S]*?)<\/script/gi;
            while ((script = re.exec(html))) {
                this.scope.exec(script[1]);
            }
        }
        
        if(href == undefined){
            _convert.call(this, this.view, this.scope);    
        }

        this.scope.fireEvent("load");
    };

    var _destroyScope = function(){
        var scope = this.scope;

        if(Class.typeOf(scope) != "object") return true;

        if(typeof scope.onunload == "function"){
            if(!scope.onunload()) return false;
        }

        scope.destroy();
        this.scope = null;
        return true;
    };

    var _convert = function(o, scope) {
        var evnames = ['onchange', 'onsubmit', 'onreset', 'onselect', 'onblur',
                       'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onclick',
                       'ondblclick', 'onmousedown', 'onmousemove', 'onmouseout',
                       'onmouseover', 'onmouseup'];
        var code;
        function attachEventCode(code, scope) {
            /*
             * for IE <=7.. it may (MAY) cause conflicts if _convert is called
             * against a three containing objects with events attached
             */
            if (typeof code != "string") {
                code = code.toString();
                code = code.substr(code.indexOf("{") + 1);
                code = code.substr(0, code.lastIndexOf("}"));
            }
            return function(e) {
                e = e || window.event;
                eval("var event_attribute = function(e, scope){" + code + "}");
                return event_attribute.call(scope, e, scope);
            };
        };

        var elements = o.getElementsByTagName("*");
        for (var a = 0; a < elements.length; a++) {
            var c = elements[a];
            for (var b = 0; b < evnames.length; b++) {
                if (c.getAttribute && (code = c.getAttribute(evnames[b]))) {
                    c[evnames[b]] = attachEventCode(code, scope);
                }
            }

            if (c.tagName == 'A' && c.target == ""
                && (code = c.getAttribute("href"))) {
                if (code.toLowerCase() != 'javascript:void(0)' && code != '#') {
                    c.onclick = (function(w, c) {
                                     return function() {
                                         w.setSrc(c);
                                         w.load();
                                         return false;
                                     };
                                 })(this, code);
                }
            }
        }
    };

    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.VFrame";
        def.className = def.className || "jsvm_vframe";

        var layout = def.layout = def.layout || {};
        layout.classType = layout.classType || "js.awt.BorderLayout";

        arguments.callee.__super__.apply(this, arguments);
        
        if(def.src){
            this.setSrc(def.src);
        }
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Container).$implements(js.awt.Frame);


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
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */
$package("js.awt");

/**
 * Coordinate of nofly area:
 *	 B			   C			 
 *	 |-------------|
 *	 |			   |
 *	 |-------------|
 *	 A			   D
 */
js.awt.LayerManager = function(Runtime){
	
	var CLASS = js.awt.LayerManager, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ;
	
	thi$.removeComponent = function(comp){
		comp = arguments.callee.__super__.apply(this, arguments);
		this.stack.remove(comp); 
	}.$override(this.removeComponent);
	
	thi$.removeAll = function(){
		this.stack.clear();
		arguments.callee.__super__.apply(this, arguments);
	}.$override(this.removeAll);
	
	thi$.cleanLayers = function(e){
		if(window.parent != window.self){
			MQ.post("js.awt.event.LayerEvent", "", [], window.parent);
		}

		return this.onHide(e);
	};
	
	thi$.indexOf = function (layer) {
		return this.stack.indexOf(layer);
	};
	
	var _calHRect = function (rect, w, h) {
		var bodySize = this._bodySize, hRect = {x : 0, y : 0},
		x, y, avWidth, avHeight, 
		area/* Area: The rectangle of an area in which the current layer is lying*/;
		
		// A
		x = rect.x;
		y = rect.y + rect.height;
		avWidth = bodySize.width - x;
		avHeight = bodySize.height - y;
		area = {AID : "A", x : x, y : y, width : avWidth, height : avHeight};
		
		if (avHeight >= h && avWidth >= w) {
			hRect.x = x;
			hRect.y = y;
			hRect.area = area;
			
			return hRect;
		}
		
		var bAvRect = {
			x : x, /* Optimal horizontal offset */
			y : y, /* Optimal virtical offset */
			width : avWidth, /* Available width */
			height : avHeight, /* Available height */

			// If we are permitted to adjust the floating layer's position to show most
			//	contents, the following position will be optimum.
			x1 : avWidth >= w ? x : (x + avWidth - w), /* Optimum horizontal offset */
			y1 : avHeight >= h ? y : (y + avHeight - h), /* Optimum virtical offset */
			
			area : area
		};
		
		// D: available height is same as area A
		x = rect.x + rect.width;
		avWidth = x;
		area = {AID : "D", x : 0, y : y, width : avWidth, height : avHeight};

		if (avHeight >= h && avWidth >= w) {
			hRect.x = x - w;
			hRect.y = y;
			hRect.area = area;
			
			return hRect;
		}
		
		if(avWidth >= bAvRect.width){
			bAvRect.x = x - w;
			bAvRect.y = y;
			bAvRect.width = avWidth;

			bAvRect.x1 = bAvRect.x;
			bAvRect.area = area;
		}
		
		// B
		x = rect.x;
		y = rect.y;
		avWidth = bodySize.width - x;
		avHeight = y;
		area = {AID : "B", x : x, y : 0, width : avWidth, height : avHeight};
		
		if (avHeight >= h && avWidth >= w) {
			hRect.x = x;
			hRect.y = y - h;
			hRect.area = area;
			
			return hRect;
		}
		
		var tAvRect = {
			x : x,
			y : y - h,
			width : avWidth,
			height : avHeight,

			x1 : avWidth >= w ? x : (x + avWidth - w),
			y1 : y - h,
			
			area : area
		};
		
		// C: available height is same as area B
		x = rect.x + rect.width;
		avWidth = x; 
		area = {AID : "C", x : 0, y : 0, width : avWidth, height : avHeight};
		
		if (avHeight >= h && avWidth >= w) {
			hRect.x = x - w;
			hRect.y = y - h;
			hRect.area = area;
			
			return hRect;
		}
		
		if(avWidth >= tAvRect.width){
			tAvRect.x = x - w;
			tAvRect.y = y - h;
			tAvRect.width = avWidth;

			tAvRect.x1 = tAvRect.x;
			tAvRect.area = area;
		}

		var avRect = undefined;
		if(bAvRect.height >= h && tAvRect.height >= h){
			avRect = bAvRect.width >= tAvRect.width ? bAvRect : tAvRect;
		}else{
			var bArea = Math.min(bAvRect.width, w) * Math.min(bAvRect.height, h);
			var tArea = Math.min(tAvRect.width, w) * Math.min(tAvRect.height, h);
			avRect = bArea >= tArea ? bAvRect : tAvRect;
		}
		
		avRect.narrow = true;
		return avRect;
	};
	
	var _calVRect = function (rect, w, h) {
		var bodySize = this._bodySize, vRect = {x : 0, y : 0},
		x, y, avWidth, avHeight, 
		area/* Area: The rectangle of an area in which the current layer is lying*/;
		
		// C
		x = rect.x + rect.width;
		y = rect.y;
		avWidth = bodySize.width - x;
		avHeight = bodySize.height - y;
		area = {AID : "C", x : x, y : y, width : avWidth, height : avHeight};
		
		if (avWidth >= w && avHeight >= h) {
			vRect.x = x;
			vRect.y = y;
			vRect.area = area;
			
			return vRect;
		}
		
		var rightAvRect = {
			x : x, /* Optimal horizontal offset */
			y : y, /* Optimal virtical offset */
			width : avWidth, /* Available width */
			height : avHeight, /* Available height */

			// If we are permitted to adjust the floating layer's position to show most
			//	contents, the following position will be optimum.
			x1 : avWidth >= w ? x : (x + avWidth - w), /* Optimum horizontal offset */
			y1 : avHeight >= h ? y : (y + avHeight - h), /* Optimum virtical offset */
			
			area : area
		};
		
		// D: available width is same as area C
		y = rect.y + rect.height;
		avHeight = y;
		area = {AID : "D", x : x, y : 0, width : avWidth, height : avHeight};
		
		if (avWidth >= w && avHeight >= h) {
			vRect.x = x;
			vRect.y = y - h;
			vRect.area = area;
			
			return vRect;
		}
		
		if(avHeight > rightAvRect.height){
			rightAvRect.x = x;
			rightAvRect.y = y - h;
			rightAvRect.height = avHeight;

			rightAvRect.y1 = rightAvRect.y;
			rightAvRect.area = area;
		}
		
		// B
		x = rect.x;
		y = rect.y;
		avWidth = x;
		avHeight = bodySize.height - y;
		area = {AID : "B", x : 0, y : y, width : avWidth, height : avHeight};
		
		if (avWidth >= w && avHeight >= h) {
			vRect.x = x - w;
			vRect.y = y;
			vRect.area = area;
			
			return vRect;
		}
		
		var leftAvRect = {
			x : x - w,
			y : y,
			width : avWidth,
			height : avHeight,

			x1 : x - w,
			y1 : avHeight >= h ? y : (y + avHeight - h),
			
			area : area
		};
		
		// A: available width is same as area B
		y = rect.y + rect.height;
		avHeight = y;
		area = {AID : "A", x : 0, y : 0, width : avWidth, height : avHeight};
		
		if (avWidth >= w && avHeight >= h) {
			vRect.x = x - w;
			vRect.y = y - h;
			vRect.area = area;
			
			return vRect;
		}
		
		if (avHeight > leftAvRect.height) {
			leftAvRect.x = x - w;
			leftAvRect.y = y - h;
			leftAvRect.height = avHeight;
			
			leftAvRect.y1 = leftAvRect.y;
			leftAvRect.area = area;
		}
		
		var avRect = undefined;
		if(leftAvRect.width >= w && rightAvRect.width >= w){
			avRect = leftAvRect.height > rightAvRect.height ? leftAvRect : rightAvRect;
		}else{
			var leftArea = Math.min(leftAvRect.width, w) * Math.min(leftAvRect.height, h);
			var rightArea = Math.min(rightAvRect.width, w) * Math.min(rightAvRect.height, h);
			avRect = leftArea > rightArea ? leftAvRect : rightAvRect;
		}
		
		avRect.narrow = true;
		return avRect;
	};
	
	var _calAvaiRect = function (rect, w, h) {
		if (rect.isVertical) {
			return _calVRect.call(this, rect, w, h);
		} else {
			return _calHRect.call(this, rect, w, h);
		}
	};
	
	var _show = function (layer, rect) {
		System.log.println((new Date()).toString() + " : show " 
                           + layer.uuid() + "-" + layer.className);
		
		// When we append an DOM element to body, if we didn't set any "position"
		// or set the position as "absolute" but "top" and "left" that element also
		// be place at the bottom of body other than the (0, 0) position. Then it
		// may extend the body's size and trigger window's "resize" event.
		var styles = {
			visibility: "hidden", 
			position: "absolute", 
			left: "-10000px", 
			top: "-10000px"
		};
		layer.applyStyles(styles);
		
		if(this.indexOf(layer) < 0){
			this.addComponent(layer);
			this.stack.push(layer);
		}
		
		var size = layer.getPreferredSize() /*DOM.outerSize(layer.view)*/, 
		w = size.width, h = size.height,
		avaiRect = _calAvaiRect.call(this, rect, w, h);
		System.log.println("Available Rectangle: " + JSON.stringify(avaiRect));
		
		var x, y, bounds;
		if(avaiRect.narrow == true){
			var b = layer.isAdjustPosToFit();
			x = (!b) ? avaiRect.x : avaiRect.x1;
			y = (!b) ? avaiRect.y : avaiRect.y1;
			x = x <= 0 ? 0 : x;
			y = y <= 0 ? 0 : y;
			layer.setPosition(x, y, 1);
			
			w = Math.min(avaiRect.width, w);
			h = Math.min(avaiRect.height, h);
		}else{
			x = avaiRect.x <= 0 ? 0 : avaiRect.x;
			y = avaiRect.y <= 0 ? 0 : avaiRect.y;
			layer.setPosition(x, y, 1);
		}
		
		bounds = {x : x, y : y, width : w, height : h};
		layer.setCallback(bounds, avaiRect.area, rect);
		layer.applyStyles({visibility: "visible"});
		
		if (layer.focusBox != undefined
			&& (layer.getPMFlag() & js.awt.PopupLayer.F_FOCUSBOXBLUR) != 0) {
			layer.focusItem = layer.focusBox;
			layer.focusBox.focus();
		}
		
		layer.setAutoHide(true);
		layer.startTimeout();
	};
	
	thi$.showAt = function (layer, x, y, v, m) {
		this._bodySize = DOM.outerSize(this.view);
		v = (v === true);
		
		var nofly = {
			x : x, 
			y : y, 
			width : ((v && !isNaN(m)) ? m : 0), 
			height : ((!v && !isNaN(m)) ? m : 0),
			isVertical : v
		};
		_show.call(this, layer, nofly);
	};

	var _calNofly = function(rect, v, m){
		if(isNaN(m) || m <= 0)
			return rect;

		var bodySize = this._bodySize;
		if (v) {
			/* 
			 * If no-fly zone include by, we think the by element is in the middle/center of 
			 * no-fly zone. Otherwise, we can't calculater the no-fly rectangle.
			 * If that is not satisfying, please invoke the showAt() instead. 
			 */ 
			if ((m - rect.width) >= 2) {
				rect.x = Math.max(0, rect.x - (m - rect.width)/2);
				rect.width = m;

				/* 
				 * If the by element include no-fly zone, we think the no-fly zone is in the 
				 * middle/center of the by element. Otherwise, we can't calculater the no-fly 
				 * rectangle.
				 * If that is not satisfying, please invoke the showAt() instead. 
				 */ 
			} else if ((rect.width - m) >= 2) {
				rect.x = Math.min(bodySize.width, rect.x + (rect.width - m)/2);
				rect.width = m;
			}
		} else {
			if ((m - rect.height) >= 2){
				rect.y = Math.max(0, rect.y - (m - rect.height)/2);
				rect.height = m;
			} else if ((rect.height - m) >= 2) {
				rect.y = Math.max(bodySize.height, rect.y + (rect.height - m)/2);
				rect.height = m;
			}
		}
		
		return rect;
	};
	
	thi$.showBy = function (layer, by, v, m) {
		this._bodySize = DOM.outerSize(this.view);
		v = (v === true);
		
		var rect = DOM.outerSize(by);
		rect.x = rect.left;
		rect.y = rect.top;
		rect.isVertical = v;

		var nofly = _calNofly.call(this, rect, v, m);
		_show.call(this, layer, nofly);
	};
	
	thi$.onHide = function (e) {
		var POPUP = js.awt.PopupLayer, pop, root = this.stack[0];		
		while (this.stack.length > 0) {
			pop = this.stack[this.stack.length - 1];
			if (pop.canHide(e)) {
				pop = this.stack.pop();
				System.log.println((new Date()).toString() + " : hide " + pop.uuid() 
								   + "-" + pop.className + " on \"" + e.getType() 
								   + "\" - Flag: " + (pop.getPMFlag()).toString(2));
				if (pop != root) {
					root.focusItem = root.focusBox;
					if(root.focusBox) {
						root.focusBox.focus();
					}
				}

				pop.beforeRemoveLayer(e);
				this.removeComponent(pop);
				pop.afterRemoveLayer(e);
			} else {
				return;
			}
		}
	};

	/**
	 * One stack should have one root floating layer. When one floating layer is in stack and
	 * there is no any event or method to cause hiding it. Now if we will push another one 
	 * layer to it, we should invoke this method in our own initiative.
	 */
	thi$.clearStack = function(e){
		System.log.println((new Date()).toString() + " : clearStack " 
						   + " on \"" + (e ? e.getType() : "unknown") + "\" event.");
		
		var pop;
		while (this.stack.length > 0) {
			pop = this.stack.pop();
			
			pop.beforeRemoveLayer(e);
			this.removeComponent(pop);
			pop.afterRemoveLayer(e);
		}
	};

	thi$.destroy = function(){
		this.removeAll(true);
	}.$override(this.destroy);

	thi$._init = function(Runtime){
		var def = {
			zorder:true,
			stateless: true,
			zbase:10000
		};
		
		arguments.callee.__super__.apply(
			this, [def, Runtime, document.body]);
		
		this.stack = js.util.LinkedList.$decorate([]);

	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.Container);



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

$package("js.awt");

$import("js.awt.Container");

js.awt.Desktop = function (def, element){

    var CLASS = js.awt.Desktop, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ =J$VM.MQ, Factory = J$VM.Factory;
    
    /**
     * Popup message box
     * 
     * @see js.lang.Runtime
     */
    thi$.message = function(type, subject, content){
        var msgbox = {
            className: "msgbox",
            model:{
                msgType: type,
                msgSubject: subject || "Subject",
                msgContent: content || " "
            }
        };

        this.openDialog(
            "message",
            {},
            new js.awt.MessageBox(msgbox, this));

    }.$override(this.message);

    var _registerMessageClass = function(){
        if(Factory.hasClass("message")) return;

        Factory.registerClass(
            {
                classType : "js.awt.Dialog",
                className : "message",

                items: [ "title", "client", "btnpane"],

                title: {
                    classType: "js.awt.HBox",
                    className: "win_title",
                    constraints: "north",

                    items:["labTitle", "btnClose"],
                    
                    labTitle:{
                        classType: "js.awt.Label",
                        className: "win_title_label",
                        text : "Dialog",
                        rigid_w: false,
                        rigid_h: false
                    },

                    btnClose:{
                        classType: "js.awt.Button",
                        className: "win_title_button",
                        iconImage: "dialog_close.png"
                    }
                },

                client:{
                    classType: "js.awt.Container",
                    className: "message_client",
                    constraints: "center",
                    css: "overflow:hidden;",
                    layout:{
                        classType: "js.awt.BorderLayout"
                    }                
                },

                btnpane:{
                    classType: "js.awt.HBox",
                    className: "message_btnpane",
                    constraints: "south",

                    items:["btnCancel"],
                    
                    btnCancel:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnClose", "Close")
                    },
                    
                    layout:{
                        gap: 4,
                        align_x : 1.0,
                        align_y : 0.0
                    }
                },

                width: 330,
                height:150,
                miniSize:{width:330, height:150},
                resizable: true
            }
        );
    };

    var _registerConfirmClass = function(){
        if(Factory.hasClass("jsvmconfirm")) return;

        Factory.registerClass(
            {
                classType : "js.awt.Dialog",
                className : "jsvmconfirm",

                items: [ "title", "client", "btnpane"],

                title: {
                    classType: "js.awt.HBox",
                    className: "win_title",
                    constraints: "north",

                    items:["labTitle", "btnClose"],
                    
                    labTitle:{
                        classType: "js.awt.Label",
                        className: "win_title_label",
                        text : "Confirm",
                        rigid_w: false,
                        rigid_h: false
                    },

                    btnClose:{
                        classType: "js.awt.Button",
                        className: "win_title_button",
                        iconImage: "dialog_close.png"
                    }
                },

                client:{
                    classType: "js.awt.Container",
                    className: "message_client",
                    constraints: "center",
                    css: "overflow:hidden;",
                    layout:{
                        classType: "js.awt.BorderLayout"
                    }                
                },

                btnpane:{
                    classType: "js.awt.HBox",
                    className: "message_btnpane",
                    constraints: "south",

                    items:["btnOK", "btnCancel"],

                    btnOK:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnOK", "Yes")
                    },
                    
                    btnCancel:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnNo", "No")
                    },
                    
                    layout:{
                        gap: 4,
                        align_x : 1.0,
                        align_y : 0.0
                    }
                },

                modal: true,                
                width: 330,
                height:150,
                miniSize:{width:330, height:150},
                resizable: true
            }
        );
    };

    var _activateComponent = function(target, uuid){
        if(!target) return;
        
        if(target.activateComponent){
            target.activateComponent();
        }
    };

    var _notifyLM = function(e){
        var el = e.srcElement, target = e.getEventTarget(),
            uuid = el ? el.uuid : undefined;
        this.LM.cleanLayers(e, this);
        _activateComponent(target, uuid);
        return true;
    };
    
    var _notifyComps = function(msgid, e){
        var comps = this.getAllComponents(),
            len = comps ? comps.length : 0, 
            i, comp, recs = [];
        
        for(i = 0; i < len; i++){
            comp = comps[i];
            recs.push(comp.uuid());
        }
        
        if(recs.length > 0){
            MQ.post(msgid, e, recs);
        }
    };
    
    var _onresize = function(e){
        var M = this.def, U = this._local,
            isSpecified = U.isViewSpecified,
            d = isSpecified ? this.getBounds() 
                : DOM.innerSize(document.body),
            evt;
        
        if(U.userW != d.width || U.userH != d.height){
            evt = new Event(Event.W3C_EVT_RESIZE, 
                            {owidth: U.userW, oheight: U.userH, 
                             width: d.width, height: d.height});
            _notifyComps.call(this, "js.awt.event.WindowResized", evt);
            
            this.LM.clearStack(e);
            
            if(isSpecified){
                M.width = U.userW = d.width;
                M.height= U.userH = d.height;                  
            }else{
                this.setSize(d.width, d.height, 4);
            }

            this.doLayout.$delay(this, 1, true);
        }
    };
    
    var _forbidContextMenu = function(e){
        e.cancelBubble();
        return e.cancelDefault();
    };

    var _getMinZIndex = function(ele){
        var children = ele.children, zIndex = 0, tmp, e;
        for(var i=0, len=children.length; i<len; i++){
            e = children[i];
            tmp = parseInt(DOM.currentStyles(e, true).zIndex);
            tmp = Class.isNumber(tmp) ? tmp : 0;
            zIndex = Math.min(zIndex, tmp);
        }
        return zIndex;
    };
    
    // For testing all events bind to self.document
    var _onevents = function(e){
        var eType = e.getType(), ele, target;
        if(eType === "mouseover"){
            ele = e.toElement;
        }else if(eType === "mouseout"){
            ele = e.fromElement;
        }else{
            ele = e.srcElement;
        }

        target = this.getEventTarget(ele.uuid);
        if(target && target.fireEvent){
            target.fireEvent(e, true);
        }

        switch(eType){
        case "mousedown":
            _notifyLM.call(this, e);
            if(target && target.activateComponent){
                target.activateComponent();
            }
            break;
        case "mousewheel":
        case "DOMMouseScroll":
            _notifyLM.call(this, e);
            break;
        case "contextmenu":
            e.cancelDefault();
            break;
        }
        
        return e._default;
    };
    // End test

    /**
     * @see js.awt.BaseComponent
     */
    thi$.destroy = function(){
        this.DM.destroy();
        delete this.DM;
        
        this.LM.destroy();
        delete this.LM;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$._init = function(_def, element){
        var def = {
            classType: "js.awt.Desktop",
            className: "jsvm_desktop",
            css: "position:absolute;",
            zorder:true,
            zbase:1,
            stateless: true,
            layout:{
                classType: "js.awt.AbstractLayout"
            }
        };
        def.id = _def.id;

        var ele = element;
        if(Class.isString(ele)){
            ele = self.document.getElementById(ele);
            def.id = element;
        }
        
        arguments.callee.__super__.apply(this, [def, this, ele]);
        
        // Indicate whether a specified DOM element will be as the
        // view of current desktop.
        this._local.isViewSpecified = !!ele;

        var body = self.document.body;
        if(!this._local.isViewSpecified){
            var zIndex = _getMinZIndex.call(this, body),
                s = DOM.innerSize(body);
            this.insertBefore(body.firstChild, body);
            this.setZ(zIndex-1);
            
            this.setSize(s.width, s.height);
        }

        this.LM = new js.awt.LayerManager(this);

        var DM = this.DM = new js.awt.Container(
            {classType: "js.awt.Desktop",
             id: def.id,
             zorder:true,
             stateless: true,
             zbase: 1000
            }, this, this.view);

        DM.destroy = function(){
            this.removeAll(true);

        }.$override(DM.destroy);
        
        this.attachEvent(Event.W3C_EVT_RESIZE, 4, this, _onresize);
        
        var mousewheel = J$VM.firefox ? "DOMMouseScroll" : "mousewheel",
            doc = self.document;
        /*
         Event.attachEvent(doc, "mousedown",  0, this, _onevents);
         Event.attachEvent(doc, "mouseup",    0, this, _onevents);
         Event.attachEvent(doc, "mouseover",  0, this, _onevents);
         Event.attachEvent(doc, "mouseout",   0, this, _onevents);
         Event.attachEvent(doc, "mousemove",  0, this, _onevents);
         Event.attachEvent(doc, "contextmenu",0, this, _onevents);
         Event.attachEvent(doc, mousewheel,   0, this, _onevents);
         */

        // Bring the component to the front and notify popup LayerManager
        Event.attachEvent(body, "mousedown",  0, this, _notifyLM);

        // Notify popup LayerManager
        Event.attachEvent(body, mousewheel,   0, this, _notifyLM);

        Event.attachEvent(body, "contextmenu",0, this, _forbidContextMenu);

        MQ.register("js.awt.event.LayerEvent", this, _notifyLM);
        
        _registerMessageClass.call(this);
        _registerConfirmClass.call(this);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Container).$implements(js.lang.Runtime);


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

$package("js.awt");

$import("js.awt.Container");

js.awt.Window = function (def, Runtime, view){

    var CLASS = js.awt.Window, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ;
    
    var _getTitle = function(){
        return (this.title && this.title.labTitle) ? 
            this.title.labTitle : undefined;        
    };

    thi$.getTitle = function(){
        var title = _getTitle.call(this);
        return title ? title.getText() : null; 
    };
    
    thi$.setTitle = function(s){
        var title = _getTitle.call(this);
        if(title) title.setText(s, true);
    };
    
    thi$.isFloatTitle = function(){
        return (this.def.tstyle & 0x01) != 0;
    };
    
    /**
     * Set Title style and Button style
     * 
     * @param tstyle: 0: Always show, 1: Never show, 3: Hover show
     * @param bstyle: 0: Always show, 1: Never show, 3: Hover show
     */
    thi$.setTitleStyle = function(tstyle, bstyle){
        var title = this.title, style;
        
        if(!title) return;

        style = title.def;

        tstyle = (tstyle || 0) & 0x03; 
        bstyle = (bstyle || 0) & 0x03;

        if(style.bstyle !== bstyle){
            style.bstyle = bstyle;
            switch(bstyle){
            case 0:
            case 2:
                _showtitlebutton.call(this, true);
                break;
            case 1:
            case 3:
                _showtitlebutton.call(this, false);
                break;
            }
        }

        if(style.tstyle !== tstyle){
            style.tstyle = tstyle;

            switch(tstyle){
            case 0:
            case 2:
                title = this.delController();
                this.addComponent(title, title.def.constraints);
                title.setVisible(true);
                break;
            case 1:
            case 3:
                title = this.title = this.removeComponent("title");
                this.setController(title);
                title.setVisible(false);
                break;
            default:
                break;
            }

            if(this.isDOMElement()){
                this.doLayout(true);
            }
        }
    };

    thi$.getTitleStyle = function(){
        var style = this.title.def;
        return {
            tstyle: style.tstyle,
            bstyle: style.bstyle
        };
    };

    /**
     * @see js.awt.Cover
     */
    thi$.showLoading = function(b, styleClass){
        this.client.showLoading(b, styleClass);

    }.$override(this.showLoading);

    /**
     * @see js.awt.Movable
     */    
    thi$.isMoverSpot = function(el){
        var b = function(comp){
            return comp.contains(el, true);            
        }.$every(this, this._local.restricted);

        return b && (el.tagName != "INPUT") && (el.tagName != "TEXTAREA");

    }.$override(this.isMoverSpot);

    /**
     * Add restricted move area
     */
    thi$.addMoverRestricted = function(comp){
        this._local.restricted.push(comp);
    };
    
    /**
     * Remove restricted move area
     */
    thi$.rmvMoverRestricted = function(comp){
        this._local.restricted.remove(comp);
    };
    
    /**
     * @see js.awt.Component
     */
    thi$.needLayout = function(force){
        return arguments.callee.__super__.apply(this, arguments) || 
            this.isMaximized();        

    }.$override(this.needLayout);
    
    /**
     * @see js.awt.Component
     */
    thi$.doLayout = function(force){
        var p, ele, styles, scroll, 
            overflowX, overflowY, 
            width, height;

        if(this.needLayout(force)){
            if(this.isMaximized()){
                p = this.view.parentNode;
                scroll = DOM.hasScrollbar(p);
                styles = DOM.currentStyles(p);
                overflowX = styles.overflowX;
                overflowY = styles.overflowY;

                width = (overflowX === "hidden") ? p.clientWidth :
                    (scroll.hscroll ? p.scrollWidth : p.clientWidth);

                height= (overflowY === "hidden") ? p.clientHeight: 
                    (scroll.vscroll ? p.scrollHeight : p.clientHeight);
                
                if(this.getWidth() != width || this.getHeight() != height){
                    this.setBounds(0, 0, width, height);    
                }
                arguments.callee.__super__.apply(this, arguments);    
            }else{
                ele = this.client.view; 
                styles = DOM.currentStyles(ele);
                overflowX = styles.overflowX; 
                overflowY = styles.overflowY;
                ele.style.overflow = "hidden";
                arguments.callee.__super__.apply(this, arguments);
                ele.style.overflowX = overflowX;
                ele.style.overflowY = overflowY;
            }

            return true;
        }

        return false;

    }.$override(this.doLayout);
    
    var _setSizeTo = function(winsize){
        var d, m, r;
        winsize = winsize || "normal";
        switch(winsize){
        case "maximized":
            var p = this.view.parentNode;
            d = {x: 0, y: 0, width: p.scrollWidth, height: p.scrollHeight };
            this._local.movable = this.isMovable();
            this._local.resizable = this.isResizable();
            this._local.alwaysOnTop = this.isAlwaysOnTop();
            m = false; 
            r = false;
            break;
        case "minimized":
            d = this.getMinimumSize();
            d.x = this._local.userX;
            d.y = this._local.userY;
            this._local.movable = this.isMovable();
            this._local.resizable = this.isResizable();
            m = this.isMovable();
            r = false;
            break;
        default:
            d = { width: this._local.userW, height:this._local.userH };
            d.x = this._local.userX;
            d.y = this._local.userY;
            m = this._local.movable || this.isMovable();
            r = this._local.resizable || this.isResizable();
            break;
        }

        this.setMovable(m);
        this.setResizable(r);
        if(r){
            this.addResizer();
        }
        this.setBounds(d.x, d.y, d.width, d.height, 3);
    };

    thi$.onbtnMin = function(button){
        if(this.isMinimized()){
            // Restore
            this.setMinimized(false);
            _setSizeTo.call(this, "normal");                
        }else{
            if(this.isMaximized()){
                this.setMovable(this._local.movable);
                this.setResizable(this._local.resizable);
            }
            this.setMinimized(true);
            _setSizeTo.call(this, "minimized");            
        }
    };
    
    thi$.onbtnMax = function(button){
        if(this.isMaximized()){
            // Restore
            this.setMaximized(false);
            _setSizeTo.call(this, "normal");
            button.setTriggered(false);
            button.setToolTipText(this.Runtime().nlsText("btnMax_tip"));    
        }else{
            if(this.isMinimized()){
                this.setMovable(this._local.movable);
                this.setResizable(this._local.resizable);
            }
            this.setMaximized(true);
            _setSizeTo.call(this, "maximized");
            button.setTriggered(true);
            button.setToolTipText(this.Runtime().nlsText("btnMin_tip"));
        }
    };
    
    thi$.onbtnClose = function(button){
        this.close();
    };

    thi$.close = function(){
        
        if(typeof this.beforClose == "function"){
            this.beforClose();
        }
        
        if(this.container instanceof js.awt.Container){
            this.container.removeComponent(this);
        }
        
        this.destroy();
    };
    
    thi$.refresh = function(){
        var client = this.client;
        if(typeof client.refresh == "function"){
            client.refresh();
        }
    };
    
    thi$.onrefresh = function(target){
        this.refresh();
    };

    thi$.notifyIFrame = function(msgId, msgData){
        var win = this.client.getWindow();
        if (win) {
            MQ.post(msgId, msgData, [], win, 1);
        }
    };
    
    thi$.isMaximized = function(){
        if(typeof arguments.callee.__super__ == "function"){
            // 0.9d
            return arguments.callee.__super__.call(this);
        }else{
            return this.def.winsize == "maximized";
        }
    }.$override(this.isMaximized);
    
    thi$.setMaximized = function(b){
        if(typeof arguments.callee.__super__ == "function"){
            // 0.9d
            arguments.callee.__super__.apply(this, arguments);
        }else{
            this.def.winsize = b ? "maximized" : "normal";
        }
    }.$override(this.setMaximized);

    thi$.isMinimized = function(){
        if(typeof arguments.callee.__super__ == "function"){
            // 0.9d
            return arguments.callee.__super__.call(this);
        }else{
            return this.def.winsize == "minimized";
        }
    }.$override(this.isMinimized);
    
    thi$.setMinimized = function(b){
        if(typeof arguments.callee.__super__ == "function"){
            // 0.9d
            arguments.callee.__super__.apply(this, arguments);
        }else{
            this.def.winsize = b ? "minimized" : "normal";
        }
    }.$override(this.setMinimized);
    
    thi$.loadUrl = function(url){
        var client = this.client;
        if(client.instanceOf(js.awt.Frame)){
            client.setSrc(url);
            client.load();
        }else{
            throw "This window does not support this ability.";
        }
    };
    
    thi$.setContent = function(html, href){
        var client = this.client;
        if(client.instanceOf(js.awt.Frame)){
            client.setContent(html, href);
        }else{
            throw "This window does not support this ability.";
        }
    };
    
    var _onmouseover = function(e){
        var title = this.title;
        if(!title) return;

        var eType = e.getType(), ele = e.toElement,  
            xy = this.relative(e.eventXY()), style = this.getTitleStyle();

        switch(eType){
        case "mouseover":
            if(this.contains(ele, true) && xy.y < 50){

                if(style.tstyle === 3){
                    title.setVisible(true);
                }

                if(style.bstyle === 3){
                    if(title.contains(ele, true)){
                        _showtitlebutton.call(this, true);
                    }else{
                        _showtitlebutton.call(this, false);
                    }
                }
            }
            this.setHover(true);
            break;
        case "mouseout":
            if(!this.contains(ele, true) && ele !== this._coverView){

                if(style.tstyle === 3){
                    title.setVisible(false);
                }

                if(style.bstyle === 3){
                    _showtitlebutton.call(this, false);
                }
            }
            this.setHover(false);
            break;
        }
    };

    var _showtitlebutton = function(b){
        var title = this.title, items = title.items0(), item;
        for(var i=0, len=items.length; i<len; i++){
            item = title[items[i]];
            if(item.id.indexOf("btn") == 0){
                item.setVisible(b);
            }
        }

        if(title.isDOMElement()){
            title.doLayout(true);
        }
    };

    var _cmdDispatcher = function(e){
        switch(e.getType()){
        case "mousedown":
            this.activateComponent();
            break;
        case "mouseup":
        case "message":
            var target = e.getEventTarget(),
                func = "on"+target.id;
            if(typeof this[func] == "function"){
                this[func](target);
            }else{
                throw "Can not found function of button "+ target.id;
            }

            break;
        default:
            break;
        }
    };

    thi$.destroy = function(){
        delete this._local.restricted;
        arguments.callee.__super__.apply(this,arguments);
    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime, view){
        if(def == undefined) return;
        
        var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
        newDef.css = def.css || "";
        var titleDef = newDef.title;
        titleDef.className = titleDef.className || newDef.className + "_title";
        (function(name){
            var item = titleDef[name];
            if(name.indexOf("lab") == 0){
                item.className = item.className || titleDef.className + "_label";
                item.css = (item.css || "") + "white-space:nowrap;"
                    + "test-overflow:ellipsis;"
                    + "overflow:hidden;cursor:default;";
            }else if(name.indexOf("btn") == 0){
                item.className = item.className || titleDef.className + "_button"; 
            }
        }).$forEach(this, titleDef.items);

        newDef.client.className = newDef.client.className || newDef.className + "_client";

        System.objectCopy(newDef, def, true, true);
        arguments.callee.__super__.apply(this, arguments);
        view = this.view;
        view.style.position = "absolute";
        view.style.overflow = "hidden";

        var uuid = this.uuid();
        // For MoverSpot testing
        var restricted = this._local.restricted = js.util.LinkedList.$decorate([]);
        
        var title = this.title;
        if(title){
            title.setPeerComponent(this);
            title.view.uuid = uuid;
            (function(name){
                var item = this.title[name];
                item.setPeerComponent(this);
                item.view.uuid = uuid;
                if(name.indexOf("btn") == 0){
                    this.addMoverRestricted(item);
                    item.icon.uuid = uuid;
                }

            }).$forEach(this, title.def.items);
            
            var tstyle = title.def.tstyle, bstyle = title.def.bstyle;

            title.def.tstyle = 0;
            title.def.bstyle = 0;

            this.setTitleStyle(tstyle, bstyle);
        }

        this.client.setPeerComponent(this);
        this.client.view.uuid = uuid;
        //restricted.push(this.client); ??

        Event.attachEvent(this.view, "mouseover", 0, this, _onmouseover);
        Event.attachEvent(this.view, "mouseout",  0, this, _onmouseover);

        MQ.register("js.awt.event.ButtonEvent", this, _cmdDispatcher);
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

js.awt.Window.DEFAULTDEF = function(){
    return {
        classType : "js.awt.Window",
        className : "jsvm_win",

        items: ["title", "client"],

        title: {
            classType: "js.awt.HBox",
            constraints: "north",

            items:["labTitle", "btnMin", "btnMax", "btnClose"],
            
            labTitle:{
                classType: "js.awt.Label",
                text: "J$VM",

                rigid_w: false,
                rigid_h: false
            },
            
            btnMin:{
                classType: "js.awt.Button",
                className: "jsvm_title_button",
                iconImage: "minimize.gif"
            },

            btnMax:{
                classType: "js.awt.Button",
                className: "jsvm_title_button",
                iconImage: "maximize.png"
            },

            btnClose:{
                classType: "js.awt.Button",
                className: "jsvm_title_button",
                iconImage: "close.png"
            }
        },

        client:{
            classType: "js.awt.VFrame",
            constraints: "center",
            rigid_w: false,
            rigid_h: false
        },

        layout:{
            classType: "js.awt.BorderLayout",
            mode: 0,
            hgap: 0,
            vgap: 0
        },

        resizer: 0xFF, resizable: true,
        mover:{ bt:1.0, br:0.0, bb:0.0, bl:1.0 }, movable: true,
        shadow: true,
        
        width: 400,
        height:300,

        rigid_w: true,
        rigid_h: true,

        miniSize:{width: 72, height:24},
        prefSize:{width: 640, height:480}    
    };
};

J$VM.Factory.registerClass(js.awt.Window.DEFAULTDEF());


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

$package("js.awt");

$import("js.awt.Window");

/**
 * The DialogObject is the interface between dialog entity and 
 * dialog frame.
 */
js.awt.DialogObject = function (){

    var CLASS = js.awt.DialogObject, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM;
    
    /**
     * The data feedback to dialog opener.
     * 
     * Notes: Sub class should implements this function.
     */
    thi$.getDialogData = function(){
        return {};
    };

    /**
     * Validate dialog data
     * 
     * @param okFunc
     */
    thi$.validateData = function(okFunc){
        if(typeof okFunc == "function"){
            okFunc();
        }
    };
    
    /**
     * The message type is a such a string that identify what message
     * will be posted to dialog opener.
     * 
     * Notes: Sub class should implements this function.
     */
    thi$.getDialogMsgType = function(){
        if(!this._local.msgtype){
            this._local.msgtype = js.lang.Math.uuid();
        }

        return this._local.msgtype;
    };

    /**
     * 
     */
    thi$.getHelpID = function(){
        return "";        
    };

    /**
     * Set Dialog window title
     */    
    thi$.setTitle = function(text){
        var dialog = this.getPeerComponent();
        if(dialog instanceof js.awt.Dialog){
            dialog.setTitle(text);
        }
    };

    /**
     * Dialog invoke this method to initialize DialogObject
     */
    thi$.initialize = function(){
    };

};

/**
 * The Dialog is dialog frame, it can holds any DialogObj. 
 */
js.awt.Dialog = function (def, Runtime){

    var CLASS = js.awt.Dialog, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;

    thi$.setDialogObject = function(dialogObj, handler){
        if(!dialogObj || !dialogObj.instanceOf(js.awt.DialogObject))
            throw "Request a js.awt.DialogObj instance";

        dialogObj.id = "dialogObj";
        dialogObj.setPeerComponent(this);
        this.client.addComponent(dialogObj);

        if(handler){
            this._local.handler = handler;
            MQ.register(dialogObj.getDialogMsgType(), this.getPeerComponent(), handler);
        }
    };

    thi$.getDialogObject = function(){
        return this.client.dialogObj;
    };

    thi$.getDialogMsgType = function(){
        var dialogObj = this.client.dialogObj;
        return dialogObj ? dialogObj.getDialogMsgType() : null;
    };

    thi$.getDialogDate = function(){
        var dialogObj = this.client.dialogObj;
        return dialogObj ? dialogObj.getDialogData() : null;
    };
    
    var _showMaskCover = function(b){
        var peer = this.getPeerComponent();
        if(this.def.modal === true){
            if(peer && peer !== this.Runtime()){
                peer.showMaskCover(b);
            }
        }else{
            var event = _buildDialogEvent.call(
                this, b ? "open" : "close", false);
            this.notifyPeer(event.msgId, event);
        }
    };

    thi$.show = function(){
        _showMaskCover.call(this, true);
        
        var x = this.def.x, y = this.def.y, DM = this.Runtime().DM;

        if(x == undefined || y == undefined){
            var pox = DM.getBounds();
            x = (pox.width - this.def.width)*0.5,
            y = (pox.height- this.def.height)*0.5;

            x = x < 0 ? 0:x;
            y = y < 0 ? 0:y;
        }

        DM.addComponent(this);
        this.getDialogObject().initialize();
        if(this.btnpane){
            // Maybe dialogObject modified btnpane, 
            // so need doLayout 
            this.btnpane.doLayout(true);
        }
        this.setPosition(x, y);
    };
    
    /**
     * @see js.awt.Cover
     */
    thi$.showLoading = function(b){
        
        arguments.callee.__super__.apply(this, arguments);
        this.btnpane.showLoading(b);

    }.$override(this.showLoading);

    thi$.onbtnHelp = function(button){
        MQ.post("js.awt.event.ShowHelpEvent", 
                new Event("helpid", this.getDialogObject().getHelpID()));
    };

    thi$.onbtnApply = function(button){
        var obj = this.getDialogObject();
        obj.validateData(
            function(){
                var event = this.buildDialogEvent("apply");
                this.notifyPeer(event.msgId, event, true);
            }.$bind(this));
    };

    thi$.onbtnOK = function(button){
        var obj = this.getDialogObject();
        obj.validateData(
            function(){
                var event = this.buildDialogEvent("ok");
                this.notifyPeer(event.msgId, event, true);
                this.close();
            }.$bind(this));
    };

    thi$.onbtnCancel = function(button){
        var event = this.buildDialogEvent("cancel", false);
        this.notifyPeer(event.msgId, event, true);
        this.close();
    };

    thi$.buildDialogEvent = function(type, hasData){
        var dialogObj = this.client.dialogObj,
        msgId = dialogObj.getDialogMsgType(), 
        data, event;

        if(hasData !== false){
            data = dialogObj.getDialogData();
        }
        event = new Event(type, data, this);
        event.msgId = msgId;

        return event;
    };
    
    thi$.onbtnClose = function(button){
        
        var event = this.buildDialogEvent("close", false);
        this.notifyPeer(event.msgId, event, true);
        
        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.onbtnClose);

    thi$.close = function(){
        var peer = this.getPeerComponent();
        /*
         if(peer){
         peer.getDialogs().remove(this);
         }*/
        
        var handler = this._local.handler;
        if(typeof handler == "function"){
            MQ.cancel(this.getDialogMsgType(), peer, handler);
            delete this._local.handler;
        }

        _showMaskCover.call(this, false);

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.close);

    thi$.destroy = function(){
        var dialogObj = this.client.dialogObj;
        if(dialogObj){
            dialogObj.setPeerComponent(null);
        }

        delete this.opener;

        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);

        var btnpaneDef = newDef.btnpane, item;
        btnpaneDef.className = btnpaneDef.className || newDef.className + "_btnpane";
        (function(name){
             if(name.indexOf("btn") == 0){
                 item = btnpaneDef[name];
                 item.className = item.className || btnpaneDef.className + "_button";
             }
         }).$forEach(this, btnpaneDef.items);

        System.objectCopy(newDef, def, true, true);
        arguments.callee.__super__.apply(this, arguments);

        // For MoverSpot testing
        var restricted = this._local.restricted;

        if(this.btnpane){
            (function(name){
                 if(name.indexOf("btn") == 0){
                     item = this.btnpane[name];
                     item.setPeerComponent(this);
                     restricted.push(item);
                 }
             }).$forEach(this, this.btnpane.def.items);
        }

        restricted.push(this.client);
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Window);

js.awt.AbstractDialogObject = function(def, Runtime){

    var CLASS = js.awt.AbstractDialogObject, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM;

    /**
     * The message type is a such a string that identify what message
     * will be posted to dialog opener.
     * 
     * Notes: Sub class should implements this function.
     */
    thi$.getDialogMsgType = function(){
        if(!this._local.msgtype){
            this._local.msgtype = js.lang.Math.uuid();
        }

        return this._local.msgtype;

    }.$override(this.getDialogMsgType);

    this._init.apply(this, arguments);
    
}.$extend(js.awt.Component).$implements(js.awt.DialogObject);

js.awt.Dialog.DEFAULTDEF = function(){
    return {
        classType : "js.awt.Dialog",
        className : "jsvm_dlg",

        items: [ "title", "client", "btnpane"],

        title: {
            classType: "js.awt.HBox",
            constraints: "north",

            items:["labTitle", "btnHelp", "btnClose"],
            
            labTitle:{
                classType: "js.awt.Label",
                text : "Dialog",
                rigid_w: false,
                rigid_h: false
            },

            btnHelp:{
                classType: "js.awt.Button",
                className: "jsvm_title_button",
                iconImage: "dialog_help.png"
            },
            
            btnClose:{
                classType: "js.awt.Button",
                className: "jsvm_title_button",
                iconImage: "close.png"
            }
        },

        client:{
            classType: "js.awt.Container",
            constraints: "center",

            layout:{
                classType: "js.awt.BorderLayout"
            }
        },

        btnpane:{
            classType: "js.awt.HBox",
            constraints: "south",

            items:["btnApply", "btnOK", "btnCancel"],

            btnApply:{
                classType: "js.awt.Button",
                className: "jsvm_button",
                labelText: "Apply",
                effect: true
            },

            btnOK:{
                classType: "js.awt.Button",
                className: "jsvm_button",
                labelText: "OK",
                effect: true
            },
            
            btnCancel:{
                classType: "js.awt.Button",
                className: "jsvm_button",
                labelText: "Cancel",
                effect: true
            },

            layout:{
                gap: 4,
                align_x : 1.0,
                align_y : 0.0
            }
        },

        modal: true
    };
};

J$VM.Factory.registerClass(js.awt.Dialog.DEFAULTDEF());

js.awt.Dialog.MSGDIALOGDEF = function(){
    return{
        classType : "js.awt.Dialog",
        className : "jsvm_msg",

        items: [ "title", "client", "btnpane"],

        title: {
            classType: "js.awt.HBox",
            constraints: "north",

            items:["labTitle"],
            
            labTitle:{
                classType: "js.awt.Label",
                text : "Dialog"
            }
        },

        client:{
            classType: "js.awt.Container",
            constraints: "center",
            layout:{
                classType: "js.awt.BorderLayout",
                hgap: 0,
                vgap: 0
            }
        },

        btnpane:{
            classType: "js.awt.HBox",
            constraints: "south",

            items:["btnOK"],

            btnOK:{
                classType: "js.awt.Button",
                className: "jsvm_button",
                labelText: "Close",
                effect: true
            },
            
            layout:{
                gap: 4,
                align_x : 1.0,
                align_y : 0.0
            }
        },

        modal: false,
        width: 400,
        height:300,
        prefSize:{width: 400, height:300}
    };
};

J$VM.Factory.registerClass(js.awt.Dialog.MSGDIALOGDEF());


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

$package("js.awt");

$import("js.awt.Component");
$import("js.awt.Dialog");

/**
 * def :{
 * 
 *     model:{
 *        msgType:    info|warn|error|confirm
 *        msgSubject: Any string
 *        msgContent: Any string
 *     }
 * }
 */
js.awt.MessageBox = function(def, Runtime){

    var CLASS = js.awt.MessageBox, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ, Str = js.lang.String,
    icons = {
        info : "info.gif",
        warn : "alert.gif",
        error : "error.gif",
        confirm : "confirm.gif"
    };

    /**
     * The data feedback to dialog opener.
     * 
     * Notes: Sub class should implements this function.
     */
    thi$.getDialogData = function(){
        return this.def.model;
    }.$override(this.getDialogData);

    /**
     * @see js.awt.Component
     */
    thi$.doLayout = function(force){
        if(arguments.callee.__super__.apply(this, arguments)){
            var bounds = this.getBounds(), icon = this.icon, 
            label = this.label, text = this.text, h;
            
            DOM.setSize(label,
                        bounds.innerWidth - label.offsetLeft);
            h = icon.offsetHeight - label.offsetHeight;
            h = icon.offsetTop + (h > 0 ? h/2 : 0);
            DOM.setPosition(label, undefined, h);

            DOM.setSize(text,
                        bounds.innerWidth - text.offsetLeft, 
                        bounds.innerHeight  - text.offsetTop);

            return true;
        }

        return false;

    }.$override(this.doLayout);

    thi$.initialize = function(){
        var title = "", R = this.Runtime();
        switch(this.def.model.msgType){
        case "info":
            title = R.nlsText("msgDlgInfoTitle", "Information");
            break;
        case "warn":
            title = R.nlsText("msgDlgWarnTitle", "Warning");
            break;
        case "error":
            title = R.nlsText("msgDlgErrTitle", "Error");
            break;
        case "confirm":
            title = R.nlsText("msgDlgConfirmTitle", "Confirm");
            break;
        }
        this.setTitle(title);

    }.$override(this.initialize);

    var _createElements = function(model){
        var icon, label, text, R = this.Runtime();

        icon = this.icon = DOM.createElement("IMG");
        icon.className = "msg_icon";
        icon.src = R.imagePath() + icons[model.msgType];
        this.view.appendChild(icon);

        label = this.label = DOM.createElement("SPAN");
        label.className = "msg_subject";
        label.innerHTML = model.msgSubject;
        this.view.appendChild(label);

        text = this.text = DOM.createElement("TEXTAREA");
        text.className = "msg_content";
        text.readOnly = "true";
        text.innerHTML = model.msgContent;
        this.view.appendChild(text);
    };

    thi$._init = function(def, Runtime){

        def.classType = def.classType || "js.awt.MessageBox";
        def.className = def.className || "jsvm_msg";

        arguments.callee.__super__.apply(this, arguments);

        var model = this.def.model || {
            msgType:    "info",
            msgSubject: "Info subject",
            msgContent: "Info content"
        };

        _createElements.call(this, model);
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(js.awt.DialogObject);

js.awt.MessageBox.INFO = "info";
js.awt.MessageBox.WARN = "warn";
js.awt.MessageBox.ERROR= "error";
js.awt.MessageBox.CONFIRM = "confirm";


/**

 Copyright 2010-2013, The JSVM Project. 
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
 * File: TextField.js
 * Create: 2011-10-12
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

/**
 * A <em>TextField</em> is a <em>Component</em> which wraps an input box. 
 * 
 * @param def:{
 *     className: {String} Style class for current view, required.
 *     container: {js.awt.Component} Container of current component.
 *                    
 *     value: {String} Value of current TextField.
 *     isPassword: {Boolean} Indicate whether the current input is a password input.
 * }
 */

js.swt.TextField = function(def){
    var CLASS = js.swt.TextField, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, E = js.util.Event, 
    DOM = J$VM.DOM, System = J$VM.System;
    
    thi$.getValue = function(dataType) {
        if(typeof dataType !== "string"){
            dataType = this.def.dataType || "";
        }

        var v = this.textField.value;        
        switch(dataType.toLowerCase()){
        case "integer":
            v = parseInt(v, 10);
            break;
        case "float":
            v = parseFloat(v);
            break;
        default:
            break;
        }
        
        return v;
    };
    
    thi$.setValue = function (value, callback) {
        var v = "";
        if(value != undefined && value != null){
            v = value;
        }
        
        this._latestValue = undefined;
        this.def.value = v;
        this.textField.value = v;
        
        // Determine whether show the placeholder
        _showPlaceholder.call(this, !this.textField.value);
        
        if(callback){
            var e = new E("set", v, this);
            _onValueChanged.call(this, e);
        }
    };
    
    /**
     * @deprecated
     */
    thi$.getText = function () {
        J$VM.System.err.println("This method is deprecated, please use getValue");
        return this.getValue();
    };
    
    /**
     * @deprecated
     */
    thi$.setText = function (text) {
        J$VM.System.err.println("This method is deprecated, please use setValue");
        this.setValue(text);        
    };
    
    thi$.getEditable = function () {
        return !this.textField.readOnly;
    };
    
    thi$.setEditable = function (b) {
        this.textField.readOnly = !b;
    };
    
    thi$.setEnabled = function(b){
        arguments.callee.__super__.apply(this, arguments);
        this.textField.disabled = !b;
        
    }.$override(this.setEnabled);
    
    thi$.getEnable = function () {
        J$VM.System.err.println("This method is deprecated, please use isEnabled");
        return this.isEnabled();
    };
    
    thi$.setToolTipText = function(s){
        arguments.callee.__super__.apply(this, arguments);
        
        var rview = this.textField;
        if(rview){
            DOM.setAttribute(rview, "title", s);
        }
        
    }.$override(this.setToolTipText);
    
    thi$.delToolTipText = function(){
        arguments.callee.__super__.apply(this, arguments);
        
        var rview = this.textField;
        if(rview){
            DOM.removeAttribute(rview, "title");
        }
        
    }.$override(this.delToolTipText);
    
    thi$.setErrSign = function(b, errStyle){
        var M = this.def, U = this._local, 
        rview = this.textField, sp, sps,
        oStyles;
        
        if(b){
            U.iptClassName = null;
            U.iptStyles = null;

            if(typeof errStyle === "object"){
                oStyles = U.iptStyles = {};
                for(sp in errStyle){
                    oStyles[DOM.camelName(sp)] = DOM.getStyle(rview, sp);
                }
                
                DOM.applyStyles(rview, errStyle);
                
            }else{
                U.iptClassName = rview.className;
                
                if(Class.isString(errStyle) && errStyle.length > 0){
                    rview.className = errStyle;
                }else{
                    rview.className = M.className + "_err";
                }
            }
        }else{
            if(Class.isString(U.iptClassName)){
                rview.className = U.iptClassName;
            }
            
            oStyles = U.iptStyles;
            if(oStyles && Class.isObject(oStyles)){
                DOM.applyStyles(rview, oStyles);
            }
            
            U.iptClassName = null;
            U.iptStyles = null;
        }
    };
    
    thi$.focus = function(select){
        if(this.isEnabled()){
            if(J$VM.ie){
                this.textField.setActive();
            }
            
            this.textField.focus();
            
            if(select === true){
                this.textField.select();
            }
        }
    };
    
    thi$.blur = function(){
        if(this.isEnabled()){
            this.textField.blur();
        }
    };
    
    thi$.setMaxLength = function (num) {
        if(num > 0) {
            this.textField.maxLength = num;
        }
    };
    
    var _onPhLabelClick = function(e){
        this.focus();  
    };

    var _createPlaceholder = function(){
        var phLabel = document.createElement("span");
        phLabel.className = this.def.className + "_placeholder";
        phLabel.style.cssText = "position:absolute;left:0px;top:0px;"
            + "width:1px;height:1px;display:none;";
        phLabel.innerHTML = this.getPlaceholder() || "";
        DOM.appendTo(phLabel, this.view);
        
        E.attachEvent(phLabel, "click", 0, this, _onPhLabelClick);
        return phLabel;
    };
    
    var _adjustPlaceholder = function(){
        var sps = ["left", "top", "height", "line-height"], 
        styles = DOM.getStyles(this.textField, sps);
        
        DOM.applyStyles(this.phLabel, styles);
    };
    
    thi$.setPlaceholder = function(placeholder){
        if(Class.isString(placeholder)){
            this._local.placeholder = placeholder;
            
            if(J$VM.supports.placeholder){
                this.textField.placeholder = placeholder;
            }else{
                if(!this.phLabel){
                    this.phLabel = _createPlaceholder.call(this);
                }else{
                    this.phLabel.innerHTML = placeholder || "";
                }
                
                _adjustPlaceholder.call(this);
                _showPlaceholder.call(this, !this.textField.value);
            }
        }
    };
    
    thi$.getPlaceholder = function(){
        return this._local.placeholder;  
    };
    
    var _showPlaceholder = function(b){
        if(this.phLabel){
            this.phLabel.style.display = b ? "inline" : "none";
        }
    };
    
    var _layout = function(){
        var box = this.getBounds(), mbp = box.MBP;
        DOM.setPosition(this.textField, mbp.paddingLeft, mbp.paddingTop);
        
        // Input is special, don't use the size to subtract the pading
        var w = box.innerWidth, h = box.innerHeight, d;
        if(!isNaN(w) || !isNaN(h)){
            DOM.setSize(this.textField, w, h);
        }
        
        d = DOM.getBounds(this.textField);
        h = d.innerHeight;
        if(!isNaN(h)){
            this.textField.style.lineHeight = h + "px";
        }
        
        // Place the placeholder
        if(this.phLabel){
            _adjustPlaceholder.call(this);
        }
    };
    
    thi$.doLayout = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            _layout.call(this);
            return true;
        }
        
        return false;
        
    }.$override(this.doLayout);

    thi$.destroy = function(){
        E.detachEvent(this.textField, "selectstart", 1, this, _onselectstart);
        E.detachEvent(this.textField, "focus", 1, this, _onFocus);
        
        DOM.remove(this.textField, true);
        delete this.textField;
        
        delete this._latestValue;
        delete this._curValue; 

        arguments.callee.__super__.apply(this, arguments);
    }.$override(this.destroy);
    
    var _onselectstart = function(e) {
        e.cancelBubble();
        return true;
    };
    
    thi$.prefocus = function(e){
        // Do somthing if need  
        return;
    };
    
    var _onMouseDown = function(e){
        this.prefocus(e);
        
        this._latestValue = this._curValue = this.getValue();    
    };
    
    thi$.validate = function(e){
        // The keycode of mouse event for a password input box is very
        // different with a text input box
        if(this.isPassword){
            return true;
        }
        
        var M = this.def, dataType = M.dataType || "", 
        allowMinus = (M.allowMinus === true), isShift = (e.shiftKey === true),
        kcode = e.keyCode, value = this.textField.value || "", 
        valid = false;
        
        /**
         * 8: Backspace
         * 46: Delete
         * 37: <--
         * 39: -->
         * 13: Enter
         * 110: .
         * 190: .
         * 189: -
         * 109: - (Num Key)
         * 48-57: 0 - 9
         * 16: Shift (Left & Right)
         * 20: Caps Lock
         * 65-70: a-f / A - F
         * 96-105: 0-9 (Num Key)
         */        
        if(kcode == 8 || kcode == 46 || kcode == 37 || kcode == 39 || kcode == 13){
            return true;
        }
        
        switch(dataType.toLowerCase()){
        case "hex":
            if((!isShift && kcode >= 48 && kcode <= 57) 
                || (kcode >= 65 && kcode <= 70) || (kcode >= 96 && kcode <= 105)){
                valid = true;
            }else{
                valid = false;
            }
            break;
        case "integer":
            if(allowMinus && ((!isShift && kcode == 189) || kcode == 109) 
               && value.length == 0){
                valid = true;
            }else if((kcode >= 96 && kcode < 106) 
                     || (!isShift && kcode > 47 && kcode < 60)){
                valid = true;
            }else{
                valid = false;
            }
            
            break;
        case "float":
            if(allowMinus && ((!isShift && kcode == 189) || kcode == 109) 
               && value.length == 0){
                valid = true;
            }else if((kcode >= 96 && kcode < 106) 
                     || (!isShift && kcode > 47 && kcode < 60)
                     || ((kcode == 110 || (!isShift && kcode == 190)) 
                         && value.indexOf(".") == -1)){
                valid = true;
            }else{
                valid = false;
            }
            break;
        default:
            valid = true;
            break;
        }
        
        return valid;
    };
    
    var _onKeyDown = function(e){
        e.cancelBubble();

        if(!this.validate(e)){
            return false;
        }

        if(e.keyCode === 13){
            var rview = this.textField;
            E.detachEvent(rview, "blur", 1, this, _onBlur);
            
            var value = this.getValue();
            _submitValue.call(this, e, value);
            
            E.attachEvent(rview, "blur", 1, this, _onBlur);
        }

        return true;
    };
    
    var _onKeyUp = function(e){
        e.cancelBubble();
        
        // _onValueChanged.$clearTimer();
        // _onValueChanged.$delay(this, 500, e);
        _onValueChanged.call(this, e);
    };
    
    var _onValueChanged = function(e){
        var value = this.getValue(),
        data = {eType: e.getType(), value: value, changed: false},
        changed = (this._latestValue != value);

        // Record current value
        this._latestValue = value;
        
        if(changed){
            data.changed = true;
            this.fireEvent(
                new E(CLASS.EVT_VALUECHANGED, data, this));
            
            // @deprecated
            if(typeof this.onValueChanged == "function"){
                this.onValueChanged(value);
            }
        }
    };

    var _onFocus = function(e) {
        this._latestValue = this._curValue = this.getValue();
        
        if(!this._local.eventAttached){
            E.attachEvent(this.textField, 'keydown', 1, this, _onKeyDown);
            E.attachEvent(this.textField, 'keyup', 0, this, _onKeyUp);
            E.attachEvent(this.textField, "blur", 1, this, _onBlur);
            
            this._local.eventAttached = true;
        }
        
        // Determine whether show the placeholder
        _showPlaceholder.call(this, false);
    };
    
    var _onBlur = function(e) {
        if(this._local.eventAttached){
            E.detachEvent(this.textField, 'keydown', 1, this, _onKeyDown);
            E.detachEvent(this.textField, 'keyup', 0, this, _onKeyUp);
            E.detachEvent(this.textField, "blur", 1, this, _onBlur);
            
            this._local.eventAttached = false;
        }
        
        // Determine whether show the placeholder
        _showPlaceholder.call(this, !this.textField.value);
        
        var value = this.getValue();
        _submitValue.call(this, e, value);
    };
    
    var _submitValue = function(e, value){
        var data = {eType: e.getType(), value: value, changed: false};
        data.changed = (this._curValue != value);           
        this.fireEvent(
            new E(CLASS.EVT_SUBMIT, data, this));

        // @deprecated
        if(typeof this.onSubmitValue == "function"){
            this.onSubmitValue(data);
        }
    };
    
    var _createInput = function(def){
        var rView;
        if(this.isPassword) {
            //IE 9 didn't supported the following solution to create an input
            // rView = this.textField = document.createElement("<input type='password'>"); 

            rView = this.textField = document.createElement("input");
            rView.type = "password";
        } else {
            // rView = this.textField = document.createElement("<input type='text'>");
            rView = this.textField = document.createElement("input");
            rView.type = "text";
        }
        
        // Set className
        rView.className = this.def.className + "_input";
        
        var css = "position:absolute;left:0px;top:0px;margin:0px;"
            + "border:0px none;outline:none;",
        fCss = def.fontCss;
        
        /*
         * In IE, if an input box has no left/right padding, the cursor will be
         * invisible when it is at the left/right side of the input. So we reverse 
         * 1px padding for the left and right edge of input box.
         */
        /* var pStyle = "padding:0px;";
         if(J$VM.ie){
            pStyle = "padding:0px ";
            pStyle += CLASS.RESERVEDPADDINGLEFT + "px;";
         }
         css += pStyle; */
        
        if(Class.isString(fCss) && fCss.length > 0){
            css += fCss;
        }
        rView.style.cssText = css;
        DOM.appendTo(rView, this.view);     
        
        E.attachEvent(rView, "selectstart", 1, this, _onselectstart);
        E.attachEvent(rView, "mousedown", 0, this, _onMouseDown);
        E.attachEvent(rView, "focus", 1, this, _onFocus);
    };
    
    thi$._init = function(def, Runtime){
        if(typeof def !== "object") return;
        
        def.classType = def.classType || "js.swt.TextField";
        def.className = def.className || "jsvm_textfield";
        arguments.callee.__super__.apply(this, arguments);

        this.isPassword = (def.isPassword === true);
        _createInput.call(this, def);
        
        // Set the display contents
        this.setValue(def.value);
        
        // Set placeholder
        this.setPlaceholder(def.placeholder);
        
        this.setEnabled(def.enable !== false);       
        this.setEditable(def.editable !== false);
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
}.$extend(js.awt.Component);

js.swt.TextField.RESERVEDPADDINGLEFT = 1;

js.swt.TextField.EVT_SUBMIT = "SubmitValue";
js.swt.TextField.EVT_VALUECHANGED = "ValueChanged";

js.swt.TextField.DEFAULTDEF = function(value){
    return {
        classType: "js.swt.TextField",
        className: "jsvm_textfield",
        fontCss: undefined, /* e.g. "color:#000000;font-size:12px;" */
        
        enable: true,
        editable: true,
        isPassword: false,
        
        value: value || ""
    };
};

/**

 Copyright 2010-2013, The JSVM Project. 
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
 * File: ListItem.js
 * Create: 2012/07/09 05:31:14
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

/**
 * @param def: {
 *	   className: {String} required,
 *	   css: {String} optional
 *	   id: {String} optional,
 *	   container: {js.awt.Component),
 *
 *	   markable: {Boolean} Default is <em>false</em>. If <em>true</em>, the
 *		   item will be like a checkbox. An icon expressed checked/unchecked will be created.
 *	   removable: {Boolean} Default is false. If <em>true</em>, the item will show a remove 
 *		   button float on right.
 *	   removeIcon: {String} Name of the remove button icon, optional.
 *
 *	   enable: {Boolean} Default is <em>true</em> indicate whether item can interact with user,
 * 
 *	   showTips: {Boolean} Default is false, required. Indicate whether this item should show 
 *		   its tooltips with its display value.
 * 
 *	   model: {
 *		   dname: abbr. of displayValue,
 *		   img: abbr. of display image,
 *		   value: realValue,
 *		   marked: Default is false, optional. Indicate whether this item should be 
 *				   selected after initialization
 *	   }
 * }
 */
js.swt.ListItem = function(def, Runtime, view){
	var CLASS = js.swt.ListItem, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var C = js.lang.Class, E = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ;

	/**
	 * Make the icon as stateless
	 */	   
	thi$.setIconImage = function(){
		var buf = this.__buf__.clear();
		buf.append(this.Runtime().imagePath())
			.append(this.getIconImage());

		this.icon.src = buf.toString();
	}.$override(this.setIconImage);
	
	thi$.getModel = function(){
		return this.model;
	};
	
	thi$.isMine = function(model){
		if (!(this.model && model))
			return false;
		
		if (this.model === model)
			return true;
		
		//TODO: maybe this is not enough
		if ((this.model.value === model.value)
			&& ((this.model.dname === model.dname)
				|| (this.model.img === model.img))) {
			return true;
		}
		
		return false;
	};
	
	thi$.hasController = function(b){
		if(C.isBoolean(b)){
			this.model.noController = !b;
		}
		
		return !this.model.noController;
	};
	
	thi$.getValue = function(){
		var value = this.model ? this.model.value : null;
		return value;
	};
	
	thi$.mark = function(b){
		arguments.callee.__super__.apply(this, arguments);
		this.model.marked = this.isMarked();
	}.$override(this.mark);
	
	thi$.setSelected = function (b) {
		if (this.isMarkable()) {
			this.mark(b);
		} else {
			this._local.selected = b;
			this.model.marked = b;
			
			this.setHover(false);
			this.setTriggered(b);
		}
	};
	
	thi$.isSelected = function () {
		return this._local.selected || this.isMarked();
	};
	
	thi$.getContent = function () {
		var m = this.model || {};
		return m.dname || "";
	};
	
	thi$.isSearchable = function () {
		return C.isString(this.model.dname);
	};
	
	thi$.cloneView = function(){
		var v = arguments.callee.__super__.apply(this, arguments);
		DOM.removeFun(v);
		
		return v;
	}.$override(this.cloneView);
	
	var _preInit = function(def){
		var m = def.model;
		if(!m){
			return def;
		}
		
		var dname = m.dname,
		iconImage = m.img || m.iconImage;
		if(dname !== undefined || dname !== null){
			def.labelText = dname;
		}
		
		if(iconImage !== undefined || iconImage !== null){
			def.iconImage = iconImage;
		}
		
		def.checked = (m.marked === true);
		return def;
	};
	
	thi$._init = function(def, Runtime, view){
		if(typeof def !== "object") return;
		def.classType = def.classType || "js.swt.ListItem";
		def.className = def.className || "jsvm_listItem";
		
		this.def = def;
		this.model = def.model;
		
		var newDef = System.objectCopy(def, {}, true);
		newDef = _preInit.call(this, newDef);
		arguments.callee.__super__.apply(this, [newDef, Runtime, view]);
		
		var m = this.model;
		if(def.showTips && m){
			var tip = m.tip || m.dname || "";
			this.setToolTipText(tip);
		}

		this.setEnabled(def.enable !== false);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.Item);

/**

 Copyright 2010-2013, The JSVM Project. 
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
 * File: List.js
 * Create: 2012/04/28 01:47:36
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

/**
 * A <em>List</em> is a item container.
 * 
 * Attention: 
 *		only when <em>multiEnable</em> is <em>true</em>, the <em>multiByCheck</em> 
 *		can take effect. Otherwise it will be ignored.
 * 
 * @param def: {
 *	   className: {String} required,
 *	   css: {String} optional
 *	   id: {String} optional,
 *	   container: {js.awt.Component} requied.
 * 
 *	   multiEnable: {Boolean} Default is <em>false</em>, required,
 *	   multiByCheck: {Boolean} Default is false. When <em>multiEnable</em> is true,
 *		  if the <em>multiByCheck</em> is false, the "CTRL" and "SHIFT" keys will 
 *		  be validation. Otherwise "CTRL" and "SHIFT" keys will be used and each 
 *		  item cannot be markable. 
 * 
 *	   distinct: {Boolean} Default is false, required. Indicate whether item of	 
 *		  List is distinct. 
 *	   searchEnable: {Boolean} Default is false, required. Indicate whether the 
 *		  List can support quick search. 
 *
 *	   lazy: {Boolean} Default is false, optional. Indicate whether all items should
 *		  be loaded lazily. That is to say, all items will be added and removed 
 *		  asynchronously.
 *	
 *	   itemDefs: {Array} Definitions of items. If it is specified, the itemModels 
 *		  will be ignored. 
 *	   itemModels: {Array} Models of items, optional. Its structure is as follow:
 *	   [
 *			{dname: xxx, img: xxx (Optional), value},
 *				......
 *			{dname: xxx, img: xxx (Optional), value}	 
 *	   ] 
 * }
 */ 

$import("js.swt.ListItem");

js.swt.List = function(def, runtime){
	var CLASS = js.swt.List, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, 
	DOM = J$VM.DOM, System = J$VM.System,
	LinkedList = js.util.LinkedList, ListItem = js.swt.ListItem;
	
	thi$.item = function(uuid){
		return this._local.cache[uuid];
	};
	
	/**
	 * Returen true if items can ack their follower's interaction required,
	 * otherwise return false.
	 */
	thi$.isReady = function(){
		return this._isReady;
	};
	
	var _preSelect = function(item){
		if(!item.isSelected()){
			return;
		}
		
		var uuid = item.uuid();
		if(this.multiEnable 
		   || (this._selectedItems.length == 0)){
			this._selectedItems.addLast(uuid);	 
		}else{
			item.setSelected(false);
		}
	};
	
	/**
	 * Add a list item to the list.
	 * 
	 * @param item: {js.swt.ListItem} The item to add.
	 * @param ack: {Boolean} Indicate whether all items are added to the list 
	 *		  and they can ack their follower's interaction required.
	 * 
	 * @param force: {Boolean} Indicate whether the ack need be done however
	 *		  the specified item was/wasn't be added literally.
	 * 
	 */
	thi$.addItem = function(item, ack, force){
		if(!item || !(item instanceof ListItem) 
		   || (this.distinct && this.contains(item.def))){
			// Maybe some item has been added before the last one
			if(ack === true && force === true){ 
				_sendAck.call(this, "ACK_ADD", true);
			}	
			
			return;
		}
		
		item.setPeerComponent(this);
		DOM.appendTo(item.view, this.listView);
		
		var uuid = item.uuid();
		this._items.addLast(uuid);
		this._local.cache[uuid] = item;
		
		// Rectify the item's selected state
		_preSelect.call(this, item);
		
		// Check whether the current item searched
		this._canBeSearched = this._canBeSearched && (item.isSearchable());
		
		if(ack === true){
			// Re-calculate the size of list view
			// _invalidateSize.call(this);
			// _setAck.call(this, "ACK_ADD");

			_sendAck.call(this, "ACK_ADD", true);
		}
	};
	
	var _setItems = function(items, append){
		// When there is nothing to set, we will remove all old items
		// and then nofity.
		var len = items ? items.length : 0;
		if(!append){
			this._isReady = false;
			this.wipe();
			
			if(len == 0){
				_sendAck.call(this, "ACK_ADD", true);
			}
		}

		if(len == 0){
			return;
		}
		
		var i, item, isLast = false;
		for(i = 0; i < len; i++){
			item = items[i];
			isLast = (i == len - 1);
			
			if(this.lazy){
				this.addItem.$delay(this, 0, item, isLast, isLast);
			}else{
				this.addItem(item, isLast, isLast);
			}
		}
	};
	
	/**
	 * Replace all old items with the new items.
	 * 
	 * @param items: {Array} Objects of js.swt.ListItem to add
	 */
	thi$.setItems = function(items){
		_setItems.call(this, items, false);
	};
	
	/**
	 * Add the specified items to the list.
	 * 
	 * @param items: {Array} Objects of js.swt.ListItem to add
	 */
	thi$.addItems = function(items){
		_setItems.call(this, items, true);
	};
	
	// {dname: xxx, value: xxx}
	var _createItemDef = function (model) {
		var itemDef = {
			markable: this.multiByCheck,
			showTips: this.showTips,
			toggle: false,
			model: model
		};

		return itemDef;
	};

	/**
	 * Add one item to List with the specified definition.
	 * 
	 * @param itemDef: {Object} Definition of the item that will be added.
	 * @param ack: {Boolean} Indicate whether all items are added to the list 
	 *		  and they can ack their follower's interaction required.
	 * 
	 * @param force: {Boolean} Indicate whether the ack need be done however
	 *		  the specified item was/wasn't be added literally.
	 */
	thi$.addItemByDef = function(itemDef, ack, force){
		if(!itemDef || (this.distinct && this.contains(itemDef))){
			// Maybe some item has been added before the last one
			if(ack === true && force === true){ 
				_sendAck.call(this, "ACK_ADD", true);
			}
			
			return;
		}
		
		var itemClassName = this.def.itemClassName;
		if(!itemDef.className && itemClassName){
			itemDef.className = itemClassName;
		}
		
		// Maybe needn't to set with as 100%
		itemDef.css = "position:relative;overflow:visible;"
			+ "white-space:nowrap;";
		
		if(this.multiEnable && this.multiByCheck){
			itemDef.markable = true;
		} else {
			itemDef.markable = false;
		}
		
		var item = new ListItem(itemDef, this.Runtime()),
		uuid = item.uuid();
		item.setPeerComponent(this);
		DOM.appendTo(item.view, this.listView);
		
		this._items.addLast(uuid);
		this._local.cache[uuid] = item;
		
		// Rectify the item's selected state
		_preSelect.call(this, item);
		
		//DOM.applyStyles(item.view, {position: "relative", width: "100%"});
		
		// Check whether the current item searched.
		this._canBeSearched = this._canBeSearched && (item.isSearchable());
		
		if(ack === true){
			// Re-calculate the size of list view
			// _invalidateSize.call(this);
			// _setAck.call(this, "ACK_ADD");

			_sendAck.call(this, "ACK_ADD", true);
		}
	};

	/**
	 * Add one item to List with the specified model.
	 * 
	 * @param model: {Object} The model of the item that will be added.
	 * @param ack: {Boolean} Indicate whether the item need ack its' follower's 
	 *		  interaction required after it is added.
	 */
	thi$.addItemByModel = function(model, ack){
		if(!model){
			return;
		}

		var def = _createItemDef.call(this, model);
		this.addItemByDef(def, ack);
	};

	var _setItemsByModel = function(models, append){
		// When there is nothing to set, we will remove all old items
		// and then nofity.
		var len = models ? models.length : 0;
		if(!append){
			this._isReady = false;
			this.wipe();
			
			if(len == 0){
				_sendAck.call(this, "ACK_ADD", true);
			}
		}
		
		if(len == 0){
			return;			   
		}
		
		var i, model, def, isLast = false;
		for(i = 0; i < len; i++){
			model = models[i];
			isLast = (i == len - 1);
			
			if(!model){
				throw "Unsupport item's model " + String(model);
			}
			
			def = _createItemDef.call(this, model);
			if(this.lazy){
				this.addItemByDef.$delay(this, 0, def, isLast, isLast);
			}else{
				this.addItemByDef(def, isLast, isLast);
			}
		}
	};

	/**
	 * Replaces all old items with new ones by the specified models.
	 * 
	 * @param models: {Array} Models of items that will be added.
	 * [
	 *	   {dname: xxx, img: xxx (Optional), value},
	 *			......
	 *	   {dname: xxx, img: xxx (Optional), value}	 
	 *	]
	 */
	thi$.setItemsByModel = function(models){
		_setItemsByModel.call(this, models, false, false);
	};

	/**
	 * Add some new items to the List with the specified models
	 * 
	 * @param models: {Array} Models of items that will be added.
	 * [
	 *	   {dname: xxx, img: xxx (Optional), value},
	 *			......
	 *	   {dname: xxx, img: xxx (Optional), value}	 
	 *	]
	 */
	thi$.addItemsByModel = function(models){
		_setItemsByModel.call(this, models, true, false);
	};

	var _setItemsByDef = function(defs, append){
		// When there is nothing to set, we will remove all old items
		// and then nofity.
		var len = defs ? defs.length : 0;
		if(!append){
			this._isReady = false;
			this.wipe();
			
			if(len == 0){
				_sendAck.call(this, "ACK_ADD", true);
			}
		}

		if(len == 0){
			return;
		}

		var def, isLast = false;
		for(var i = 0; i < len; i++){
			def = defs[i];
			isLast = (i == len - 1);
			
			if(!def){
				throw "Unsupport item's difinition " + String(def);
			}
			
			if(this.lazy){
				this.addItemByDef.$delay(this, 0, def, isLast, isLast);
			}else{
				this.addItemByDef(def, isLast, isLast);
			}
		}
	};
	
	/**
	 * Replace all old items with new ones by the specified definitions.
	 * 
	 * @param defs: {Array} Definitions of items that will be added.
	 */
	thi$.setItemsByDef = function(defs){
		_setItemsByDef.call(this, defs, false, false);		
	};
	
	/**
	 * Add some new items to the list with the specified definitions.
	 * 
	 * @param defs: {Array} Definitions of items that will be added.
	 */ 
	thi$.addItemsByDef = function(defs){
		_setItemsByDef.call(this, defs, true, false);
	};
	
	/**
	 * Remove a item from the List.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @param item: {js.swt.ListItem} A item that will be removed.
	 * @param ack: {Boolean} Indicate whether some acked behaviors will be 
	 *		  done after the item is removed.
	 */ 
	thi$.remove = function(item, ack){
		if(item && (typeof item == "object")){
			var uuid = item.uuid();
			this._selectedItems.remove(uuid);
			this._items.remove(uuid);
			
			delete this._local.cache[uuid];
			item.removeFrom(this.listView);
			
			if(typeof this.onItemRemoved == "function"){
				this.onItemRemoved(item);
			}

			// Destroy the removed item
			item.destroy(); 
			item = null;
			
			if(ack === true){
				// Re-calculate the size of list view
				// _invalidateSize.call(this);
				// _setAck.call(this, "ACK_REMOVE");

				_sendAck.call(this, "ACK_REMOVE", true);
			}
		}
	};
	
	/**
	 * Remove some items from the List.
	 * 
	 * @param items: {Array} Items that will be removed.
	 * @see js.swt.List #remove
	 */ 
	thi$.removeItems = function(items){
		var len = items ? items.length : 0;
		if(len <= 0){
			return;
		}
		
		(function(len, item, idx){
			 if(this.lazy){
				 this.remove.$delay(this, 0, item, (idx == len - 1));
			 }else{
				 this.remove(item, (idx == len - 1));
			 }
		 }).$forEach(this, items, len);
	};
	
	/**
	 * Remove all items of the List.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */ 
	thi$.removeAll = function(){
		this.wipe();
		
		// Re-calculate the size of list view
		// _invalidateSize.call(this);
		// _setAck.call(this, "ACK_REMOVE");

		_sendAck.call(this, "ACK_REMOVE", true);
	};
	
	var _setAck = function(signal){
		switch(signal){
		case "ACK_ADD":
			var ready = this._isReady;
			this._isReady = true;
			
			this.fireEvent(
				new Event(CLASS.EVT_ACK_ITEMSADDED, undefined, this));
			if(!ready){
				this.fireEvent(new Event(CLASS.EVT_READY, undefined, this));
			}
			
			_layout.call(this);
			break;
			
		case "ACK_REMOVE":
			this.fireEvent(
				new Event(CLASS.EVT_ACK_ITEMSREMOVED, undefined, this));
			_layout.call(this);
			break;
			
		default:
			break;
		};
	};
	
	var _sendAck = function(signal, invalid){
		// Re-caculate the size of list view
		if(invalid === true){
			_invalidateSize.call(this);
		}
		
		_setAck.call(this, signal);
	};
	
	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */ 
	thi$.getItemsByModel = function(items, model){
		if(!model || (typeof model !== "object"))
			return null;
		
		var finds = [], 
		len = items.length, 
		item;
		for(var i = 0; i < len; i++){
			item = items[i];
			if(item.isMine(model)){
				finds.push(item);
			}
		} 
		
		return finds;	
	};

	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */ 
	thi$.getItemsByDname = function(items, dname){
		if(typeof dname !== "string")
			return null;
		
		var finds = [], 
		len = items.length, 
		item, v;
		for(var i = 0; i < len; i++){
			item = items[i];
			v = item && item.model ? item.model.dname : null;
			if(v && dname === v){
				finds.push(item);
			}
		} 
		
		return finds;
	};

	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */ 
	thi$.getItemsByValue = function(items, value){
		if(value == undefined || value == null)
			return null;
		
		var finds = [], 
		len = items.length, 
		item, v;
		for(var i = 0; i < len; i++){
			item = items[i];
			v = item ? item.getValue() : null;
			if(value === v){
				finds.push(item);
				
				if(this.distinct){
					return finds;
				}
			}
		} 
		
		return finds;
	};

	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */ 
	thi$.contains = function(itemDef){
		var m = itemDef ? itemDef.model : undefined;
		if(!m || (typeof m !== "object")){
			return false;
		}
		
		var len = this._items ? this._items.length : 0,
		item;
		for(var i = 0; i < len; i++){
			item = this.item(this._items[i]);
			if(item.isMine(m)){
				return true;
			}
		}
		
		return false;
	};
	
	// The result doesn't keep the order
	var _getInfoByUUids = function(ids, prop, distinct){
		var len = ids ? ids.length : 0, 
		rst = LinkedList.$decorate([]), item, m, v;
		for(var i = 0; i < len; i++){
			item = this.item(ids[i]);
			
			switch(prop){
			case "def":
				rst.addLast(item.def);
				break;
			case "model":
				m = item ? item.model : undefined;
				if(m && (distinct !== true 
						 || !CLASS.isModelIn(m, rst))){
					rst.addLast(m);
				}
				break;
			case "value":
				m = item ? item.model : undefined;
				v = m ? m.value : undefined;
				if(v && (distinct !== true 
						 || !rst.contains(v))){
					rst.addLast(v);
				}
				break;
			default:
				rst.addLast(item);
				break;
			}
		}
		
		return rst;
	};
	
	// The result keep the order
	var _getInfoByUUids0 = function(ids, prop, distinct){
		if(!Class.isArray(ids) || ids.length == 0){
			return [];
		}
		LinkedList.$decorate(ids);
		
		var len = this._items ? this._items.length : 0,
		rst = LinkedList.$decorate([]), 
        uuid, item, m, v, idx;
		for(var i = 0; i < len; i++){
			uuid = this._items[i];
			if(!ids.contains(uuid)){
				continue;
			}
			
			item = this.item(uuid);
			switch(prop){
			case "def":
				rst.addLast(item.def);
				break;
			case "model":
				m = item ? item.model : undefined;
				if(m && (distinct !== true 
						 || !CLASS.isModelIn(m, rst))){
					rst.addLast(m);
				}
				break;
			case "value":
				m = item ? item.model : undefined;
				v = m ? m.value : undefined;
				if(v && (distinct !== true 
						 || !rst.contains(v))){
					rst.addLast(v);
				}
				break;
			case "index":
				idx = i;
				if(distinct !== true 
				   || !rst.contains(idx)){
					rst.addLast(idx);
				}
				break;
			default:
				rst.addLast(item);
				break;
			}
		}
		
		return rst;
	};
	
	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @return a <em>js.util.LinkedList</em> which contained all
	 *		   items of the List.  
	 */
	thi$.getAll = function(){
		var len = this._items ? this._items.length : 0, 
		rst = [];
		for(var i = 0; i < len; i++){
			rst.push(this.item(this._items[i]));
		}
		
		return rst;
	};	 
	
	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @return a <em>js.util.LinkedList</em> which contained all
	 *		   items of the List.  
	 */
	thi$.getItems = function(){
		return this.getAll();
	};
	
	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @return a <em>js.util.LinkedList</em> which contained all
	 *		   items' definition of the List.  
	 */
	thi$.getItemDefs = function(){
		return _getInfoByUUids.call(this, this._items, "def");
	};
	
	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @return a <em>js.util.LinkedList</em> which contained all
	 *		   items' model of the List.  
	 */
	thi$.getItemModels = function(){
		return _getInfoByUUids.call(this, this._items, "model");
	};
	
	/**
	 * @param isOrdered: {Boolean} Indicate whether the result
	 *		  should keep the order.
	 * 
	 * @return a <em>js.util.LinkedList</em> which contained all
	 *		   selected items of the List.	
	 */
	thi$.getSelectedItems = function(isOrdered){
		var rst;
		if(isOrdered === true){
			rst = _getInfoByUUids0.call(this, this._selectedItems);
		}else{
			rst = _getInfoByUUids.call(this, this._selectedItems);
		}
		
		return rst;
	};
	
	/**
	 * @param isOrdered: {Boolean} Indicate whether the result
	 *		  should keep the order.
	 * 
	 * @return a <em>js.util.LinkedList</em> which contained defs
	 *		  of selected items in the List.  
	 */
	thi$.getSelectedDefs = function(isOrdered){
		var rst;
		if(isOrdered === true){
			rst = _getInfoByUUids0.call(this, this._selectedItems, "def");
		}else{
			rst = _getInfoByUUids.call(this, this._selectedItems, "def");
		}
		
		return rst; 
	};
	
	/**
	 * @param isOrdered: {Boolean} Indicate whether the result
	 *		  should keep the order.
	 * 
	 * @return a <em>js.util.LinkedList</em> which contained models
	 *		  of selected items in the List.  
	 */
	thi$.getSelectedModels = function(isOrdered){
		var rst;
		if(isOrdered === true){
			rst = _getInfoByUUids0.call(this, this._selectedItems, "model", true);
		}else{
			rst = _getInfoByUUids.call(this, this._selectedItems, "model", true);
		}
		
		return rst;
	};
	
	/**
	 * @return a <em>js.util.LinkedList</em> which contained indexes
	 *		  of selected items in the List.  
	 */
	thi$.getSelectedIndexes = function(){
		return _getInfoByUUids0.call(this, this._selectedItems, "index", true);
	};

	/**
	 * @param isOrdered: {Boolean} Indicate whether the result
	 *		  should keep the order.
	 * 
	 * @return an <em>Array</em> which contained all values of 
	 *		   selected items in the List.	
	 */	   
	thi$.getSelectedValues = function(isOrdered){
		var rst;
		if(isOrdered === true){
			rst = _getInfoByUUids0.call(this, this._selectedItems, "value", true);
		}else{
			rst = _getInfoByUUids.call(this, this._selectedItems, "value", true);
		}
		
		return rst;
	};

	thi$.wipe = function(){
		if(!this.listView){
			return;
		}
		
		this._local.cache = {};
		this._selectedItems = LinkedList.$decorate([]);
		this._items = LinkedList.$decorate([]);
		this.listView.innerHTML = "";
		
		// All items are new, all sizes need be ajusted.
		delete this._contentSize;
		
		if(!this.isPreferredSizeSet){
			this.def.prefSize = undefined;	  
		}
	};
	
	var _measure = function(){
		var cv = this.listView, w, h;
		cv.style.overflow = "hidden";
		cv.style.width = "0px";
		cv.style.height = "0px";
		DOM.appendTo(cv, document.body);
		
		w = cv.scrollWidth;
		h = cv.scrollHeight;

		//DOM.remove(cv);
		cv.style.overflow = "visible";
		cv.style.width = w + "px";
		cv.style.height = h + "px";
		
		DOM.appendTo(cv, this.view);
		
		this._contentSize = this._contentSize || {};
		this._contentSize.width = w;
		this._contentSize.height = h;
		
		System.log.println("List Size:" + JSON.stringify(this._contentSize));
	};
	
	/*
	 * Attention:
	 * 
	 * This method should be invoked after the list view is appended to the DOM
	 * tree. Otherwise, it will get the inaccurate values.
	 */
	var _measure$ = function(){
		var cv = this.listView, w, h;
		cv.style.overflow = "hidden";
		cv.style.width = "0px";
		cv.style.height = "0px";

		w = cv.scrollWidth;
		h = cv.scrollHeight;

		cv.style.overflow = "visible";
		cv.style.width = w + "px";
		cv.style.height = h + "px";
		
		this._contentSize = this._contentSize || {};
		this._contentSize.width = w;
		this._contentSize.height = h;
	};
	
	/* 
	 * When items are added or removed, the size of the list view 
	 * will be invalidated and must be computed.
	 * If the list is appended to the DOM tree, the preferred size
	 * could be re-calculated if need.
	 */
	var _invalidateSize = function(items){
		this._isLayoutDirty = true;
		
		// Calculate the content size of list view		  
		_measure.call(this);
		
		// Only when the list is appended to DOM tree, 
		// the calcaulation is significative.		 
		if(this.isDOMElement() && !this.isPreferredSizeSet){
			this.def.prefSize = undefined;
			this.getPreferredSize();
		}
	};
	
	var _calPreferredSize = function(){
		if(!this._contentSize){
			_measure.call(this);
			
		}
		
		var s = this._contentSize, 
		cw = s ? s.width : undefined,
		ch = s ? s.height : undefined, 
		d = this.getBounds(), mbp = d.MBP, 
		w = d.width, h = d.height;
		
		w = !isNaN(cw) ? (cw + mbp.BPW) : w;
		h = !isNaN(ch) ? (ch + mbp.BPH) : h;
		
		// That is no reason to add 2px for the preferred size.
		// However if didn't add these 2px, that will be cause the
		// scroll bar in IE 8.
		//return {width: w, height: h};
		return {width: w + 2, height: h + 2};
	};
	
	thi$.getContentSize = function(){
		if(!this._contentSize){
			_measure.call(this);
		}
		
		return this._contentSize;
	};
	
	thi$.getPreferredSize = function(){
		if(this.def.prefSize == undefined){
			var s = _calPreferredSize.call(this);
			this.setPreferredSize(s.width, s.height);
		}

		return this.def.prefSize;

	}.$override(this.getPreferredSize);
	
	var _layoutListView = function(w, h, box){
		box = box || this.getBounds();
		
		var mbp = box.MBP, 
		avaiW = w - mbp.BPW,
		avaiH = h - mbp.BPH;
		
		var cvSize = this._contentSize, cw, ch;
		cw = (cvSize.width < avaiW) 
			? "100%" : (cvSize.width + "px");
		ch = (cvSize.height < avaiH) 
			? "100%" : (cvSize.height + "px");
		
		this.listView.style.width = cw;
		this.listView.style.height = ch;
	};
	
	var _layout = function(w, h){ 
		if(!this._isLayoutDirty || !this._isReady 
		   || !this.isDOMElement()){
			return;
		}

		this._isLayoutDirty = false;
		
		var d = this.getBounds(), prefSize = this.getPreferredSize(),
		maxSize = this.isMaximumSizeSet ? this.getMaximumSize() : null, 
		minSize = this.isMinimumSizeSet ? this.getMinimumSize() : null;
		
		w = (!isNaN(w) && w > 0) ? w : (this.hauto ? prefSize.width : d.width);
		h = (!isNaN(h) && h > 0) ? h : (this.vauto ? prefSize.height : d.height);
		
		if(minSize){
			w = (!isNaN(minSize.width) && minSize.width > 0)
				? Math.max(w, minSize.width) : w;
			h = (!isNaN(minSize.height) && minSize.height > 0) 
				? Math.max(h, minSize.height) : h;
		}
		
		if(maxSize){
			w = !isNaN(maxSize.width) ? Math.min(w, maxSize.width) : w;
			h = !isNaN(maxSize.height) ? Math.min(h, maxSize.height) : h;
		}
		
		// Sizing content view
		_layoutListView.call(this, w, h, d);
		
		// Sizing List container
		this.setSize(w, h); 
	};
	
	thi$.onResized = function(){
		this._isLayoutDirty = true;
		arguments.callee.__super__.apply(this, arguments);
	}.$override(this.onResized);
	
	thi$.onGeomChanged = function(){
		this._isLayoutDirty = true;
		arguments.callee.__super__.apply(this, arguments);
	}.$override(this.onGeomChanged);
	
	thi$.doLayout = function(){
		if(arguments.callee.__super__.apply(this, arguments)){
			_layout.call(this);
			return true;
		}
		
		return false;
		
	}.$override(this.doLayout);
	
	/**
	 * Dispose the list and its items. If the <em>w/h</em> is/are specified, the
	 * outer size of current component will use those values regardless of the hauto
	 * and vauto. However, the container of items will always be autofit by items.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */
	thi$.dispose = function(w, h){
		this._isLayoutDirty = true;
		_layout.apply(this, arguments);			   
	};

	/**
	 * Theoretically, whether the current list can be searched.
	 */
	thi$.canBeSearched = function(){
		return this._canBeSearched;
	};
	
	thi$.setSearchEnable = function(b){
		var v = (b === true);
		if(this.searchEnable === v)
			return;
		
		this.searchEnable = v;
		if(this.searchEnable){
			this.searcher = this.searcher 
				|| new (Class.forName("js.swt.Searcher"))(this, this.def.searchOptions);	
		}else{
			if(this.searcher){
				this.searcher.destroy();
			}
			
			this.searcher = null;
		}
	};
	
	thi$.quickSearch = function(keyword, options){
		if(this.searcher && (typeof keyword === "string")){
			this.searcher.search(keyword, options);
		}
	};
	
	thi$.restore = function(){
		if(this.searcher){
			this.searcher.restore();
		}
	};
	
	var _selectItems = function(items){
		var len = items ? items.length : 0;
		if(len == 0)
			return;
		
		var item;
		for(var i = 0; i < len; i++){
			item = items[i];
			this.selectItem(item);
		}
	};
	
	/**
	 * Select the given item.
	 * 
	 * @param item: a <em>js.swt.ListItem</em>.
	 */
	thi$.selectItem = function(item){
		var uuid = item ? item.uuid() : undefined;
		if(uuid && !this._selectedItems.contains(uuid)){
			item.setSelected(true);
			this._selectedItems.addLast(uuid);
		}
	};
	
	var _onItemSelected = function(arg){
		this.fireEvent(new Event(CLASS.EVT_ITEMSELECTED, arg, this));
		
		// @deprecated
		if(typeof this.onSelected === "function"){
			this.onSelected(arg);
		}
	};

	/**
	 * Select all items indicated by given values.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @param values: An <em>Array</em> for values. An item whose value equals with one
	 *				  of values will be selected.
	 * @param callback: <em>true/false</em>, optional.
	 */
	thi$.setSelectedValues = function(values, callback){
		var len = values ? values.length : 0;
		if(len == 0){
			return;
		}
		
		// Unselect all
		this.unselectAll();
		
		var cnt = this.multiEnable ? len : 1, value, items;
		for(var i = 0; i < cnt; i++){
			value = values[i];
			items = this.getItemsByValue(this.getItems(), value);
			
			_selectItems.call(this, items);
		}
		
		if(callback){
			_onItemSelected.call(this, arguments[2]);
		}
	};

	/**
	 * Select all items indicated by given indexes.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @param indexes: An <em>Array</em> for indexes, each element indicate an 
	 *				   item which need be selected.	 
	 */	   
	thi$.setSelectedIndexes = function(indexes, callback){
		var len = indexes ? indexes.length : 0;
		if(len == 0){
			return;
		}
		
		// Unselect all
		this.unselectAll();

		var cnt = this.multiEnable ? len : 1,
		item, items = [];
		for(var i = 0; i < cnt; i++){
			item = this.item(this._items[indexes[i]]);
			items.push(item);
		}
		
		_selectItems.call(this, items);
		
		if(callback){
			_onItemSelected.call(this, arguments[2]);
		}
	};

	/**
	 * Select all given items.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @param items: An <em>Array</em> which maintains items, each of which
	 *				 need be selected.
	 */
	thi$.setSelectedItems = function(items, callback){
		if(!items || items.length == 0)
			return;
		
		// Unselect all
		this.unselectAll();
		
		var temp = this.multiEnable ? items : [items[0]];
		_selectItems.call(this, temp);
		
		if(callback){
			_onItemSelected.call(this, arguments[2]);
		}
	};

	/**
	 * Select all items in the list.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */
	thi$.selectAll = function(callback){
		var len = this._items.length, item;
		for(var i = 0; i < len; i++){
			item = this.item(this._items[i]);
			if(!item.isSelected()){
				this.selectItem(item);
			}
		}
		
		if(callback === true){
			_onItemSelected.call(this);
		}
	};

	var _unselectItem = function(item) {
		if(item){
			item.setSelected(false);
			this._selectedItems.remove(item.uuid());
		}
	};

	/**
	 * Unselecte the given item.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @param item: a <em>js.swt.ListItem</em>.
	 */
	thi$.unselectItem = function(item){
		if(item){
			_unselectItem.call(this, item);
		}
	};

	/**
	 * Make all items unselected.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */
	thi$.unselectAll = function(callback){
		var uuid, item;
		while(this._selectedItems.length > 0){
			uuid = this._selectedItems.getLast();
			item = this.item(uuid);
			
			_unselectItem.call(this, item);
		}
		
		if(callback === true){
			_onItemSelected.call(this, arguments[1]);
		}
	};

	/**
	 * Invert all selections:
	 *	  selected --> unselected
	 *	  unselected --> selected
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */
	thi$.invertSelection = function(){
		var len = this._items.length, item;
		for(var i = 0; i < len; i++){
			item = this.item(this._items[i]);
			
			if(item.isSelected()){
				this.unselectItem(item);
			}else{
				this.selectItem(item);
			}
		}
	};

	thi$.isAllSelected = function(){
		var itemCnt = this._items.length,
		selectedCnt = this._selectedItems.length;
		
		if (!this.multiEnable){
			return false;
		} else if (selectedCnt === itemCnt){
			return true;
		} else if (this.distinct && (selectedCnt !== itemCnt)){
			return false;
		} else {
			var item;
			for(var i = 0; i < itemCnt; i++){
				item = this.item(this._items[i]);
				if(!item.isSelected()){
					return false;
				}
			}
			
			return true;
		}
	};

	thi$.onStateChange = function(){
		if(!this.container){
			return;
		}
		
		if(this.isEnabled()){
			this.showCover(false);
		}else{
			this.showCover(true);
		}
	};

	thi$.destroy = function(){
		delete this._selectedItems;
		delete this._items;
		delete this._local.cache;
		
		if(this.searcher){
			this.searcher.destroy();
			delete this.searcher;
		}
		
		DOM.remove(this.listView, true);
		delete this.listView;
		
		arguments.callee.__super__.apply(this, arguments);
		
	}.$override(this.destroy);

	var _select = function (listItem, ctrlKey, shiftKey){
		if(!listItem){
			return;
		}
		
		if(this.multiEnable && ctrlKey){
			if(listItem.isSelected()){
				this.unselectItem(listItem);
			}else{
				this.selectItem(listItem);
			}
		}else if(this.multiEnable && shiftKey){
			if(this._selectedItems.length == 0){
				this.selectItem(listItem);
			}else{
				var fUUID = this._selectedItems.getLast(),
				from = this._items.indexOf(fUUID),
				to = this._items.indexOf(listItem.uuid()), 
				step = (to - from) / Math.abs(to - from),
				index, item;
				for(var i = 1, cnt = Math.abs(to - from); i <= cnt; i++){
					index = from + step * i;
					
					item = this.item(this._items[index]);
					this.selectItem(item);	  
				}
			}
		}else{
			this.unselectAll();
			this.selectItem(listItem);
		}
	};

	var _selectCheckableItem = function(item){
		if(!item)
			return;
		
		if(this.multiEnable){
			if(item.isSelected()){
				this.unselectItem(item);
			}else{
				this.selectItem(item);
			}
		}else{
			this.unselectAll();
			this.selectItem(item);
		}
	};
	
	thi$.showController = function(b, item){
		if(!this.controller){
			return;
		}
		
		if(b){
			this.controller.setAttribute("itemUUID", item.uuid());
			this.controller.display(true);
			
			var vb = this.getBounds(), ib = item.getBounds(), 
			s = this.controller.getPreferredSize(),
			vOffset = (ib.height - s.height) * 0.5,
			x = this.view.scrollLeft + (vb.clientWidth - s.width),
			y = this.view.scrollTop + (ib.absY - vb.absY + vb.MBP.borderTopWidth) + vOffset;

			this.controller.setBounds(x, y, s.width, s.height, 7);

		}else{
			this.controller.removeAttribute("itemUUID");
			this.controller.display(false); 
		}
	};

	var _onHover = function(e){
		var from = e.fromElement, to = e.toElement,
		fid = from ? from.uuid : "", tid = to ? to.uuid :"",
		fitem = this._local.cache[fid], titem = this._local.cache[tid];
		
		if(fitem && fitem.isHover()){
			if(to && this.controller 
			   && this.controller.contains(to, true)){
				return; 
			}
			
			fitem.setHover(false);
			this.showController(false);
		}
		
		if(titem && !titem.isHover()){
			titem.setHover(true);
			
			if(titem.hasController()){
				this.showController(true, titem);
			}
		}
	};

	var _onItemClicked = function(e){
		var src = e.srcElement, uuid = src ? src.uuid : "",
		item = this._local.cache[uuid];
		
		if(!item){
			return;
		}
		
		if (this.multiByCheck){
			_selectCheckableItem.call(this, item);
		} else {
			_select.call(this, item, e.ctrlKey || false, 
						 e.shiftKey || false);
		}
		
		if(item){
			this.fireEvent(new Event(CLASS.EVT_ITEMCLICKED, item, item));
			
			// @deprecated
			if(typeof this.onClicked == "function"){
				this.onClicked(item);
			}
		}
	};

	thi$.onItemEvent = function(e){
		var type = e.getType();
		switch(type){
		case ListItem.OP_REMOVE:
			this.remove(e.getItem());
			break;

		default:
			break;
		}
	};
	
	var _onController = function(e){
		var uuid = this.controller.getAttribute("itemUUID"),
		item = this._local.cache[uuid], evt;
		switch(e.getType()){
		case "click":
			evt = new Event("ClickController", 
							{event: e, item: item}, this.controller);
			this.notifyPeer("js.swt.event.ControllerEvent", evt);
			break;
		case "mouseout":
			if(item && item.isHover()){
				item.setHover(false);
				this.showController(false);
			}
			break;
		default:
			break;
		}
	};

	var _createController = function(def, Runtime){
		var cDef = def.controller, clz, ctrl;
		if(cDef && cDef.classType){
			ctrl = new (Class.forName(cDef.classType))(cDef, Runtime);
			ctrl.applyStyles({position: "absolute", display: "none"});
			
			ctrl.attachEvent("mouseout", 0, this, _onController);
			ctrl.attachEvent("click", 0, this, _onController);
			this.setController(ctrl);
		}
	};
	
	var _createContents = function(){
		var listView = this.listView = DOM.createElement("DIV");
		listView.style.cssText = "position:relative;top:0px;left:0px;border:0px none;"
			+ "padding:0px;margin:0px;overflow:visible;"
			+ "width:100%;height:100%;";
		
		DOM.appendTo(listView, this.view);
	};

	thi$._init = function(def, runtime){
		if(typeof def !== "object") return;

		def = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);		
		def.className = def.className || "jsvm_list";
		arguments.callee.__super__.apply(this, arguments);

		this._isReady = false;
		this._isLayoutDirty = false;
		this._canBeSearched = true;
		
		this._local.cache = {};
		this._selectedItems = LinkedList.$decorate([]);
		this._items = LinkedList.$decorate([]);

		this.lazy = (def.lazy === true);
		this.hauto = (def.hauto === true);
		this.vauto = (def.vauto === true);

		this.showTips = (def.showTips !== false);
		this.distinct = (def.distinct === true);
		this.multiEnable = (def.multiEnable === true);
		
		// Only when multiEnable is true, the item can be markable
		this.multiByCheck = (this.multiEnable && def.multiByCheck === true);
		
		_createContents.call(this);
		
		if(def.itemDefs && def.itemDefs.length > 0){
			_setItemsByDef.call(this, def.itemDefs, false, true);
		}else if(def.itemModels && def.itemModels.length > 0){
			_setItemsByModel.call(this, def.itemModels, false, true);
		}else{
			//?? When no any items, we also need to trigger the layout.
			_setAck.call(this, "ACK_ADD");
		}
		
		this.setSearchEnable(def.searchEnable);
		
		_createController.call(this, def, runtime);
		
		Event.attachEvent(this.listView, "mouseover", 0, this, _onHover);
		Event.attachEvent(this.listView, "mouseout", 0, this, _onHover);
		Event.attachEvent(this.listView, "click", 0, this, _onItemClicked);
		
		J$VM.MQ.register("js.swt.event.ListItemEvent", this, this.onItemEvent);
		
	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component);

js.swt.List.EVT_READY = "Ready";
js.swt.List.EVT_ACK_ITEMSADDED = "ItemsAdded";
js.swt.List.EVT_ACK_ITEMSREMOVED = "ItemsRemoved";
js.swt.List.EVT_ITEMSELECTED = "ItemSelected";
js.swt.List.EVT_ITEMCLICKED = "ItemClicked";

js.swt.List.DEFAULTDEF = function(){
	return {
		classTy: "js.swt.List", 
		
		multiEnable: true,
		multiByCheck: false,
		distinct: false,
		
		lazy: false,
		
		hauto: false,
		vauto: false,
		
		itemModels: [],
		itemDefs: [],
		
		align_x: 0.5,
		align_y: 0.0,
		
		rigid_w: false,
		rigid_h: false
	};	
};

/**
 * Judge whether the specified value has been in the given collection.
 * 
 * @param value: The specified value to check.
 * @param set: {Array} The reference models collection.
 */
js.swt.List.isIn = function(value, set){
	var len = set ? set.length : 0;
	for(var i = 0; i < len; i++){
		if(set[i] === value){
			return true;
		}
	}
	
	return false;
};

/*
 * Judge whether the specified models are same.
 */
js.swt.List.isSameModel = function(m1, m2){
	if (!(m1 && m2))
		return false;
	
	if (m1 === m2)
		return true;
	
	//TODO: maybe this is not enough
	if ((m1.value === m2.value)
		&& ((m1.dname === m2.dname)
			|| (m1.img === m2.img))) {
		return true;
	}
	
	return false;
};

/**
 * Judge whether the specified model has been in the given models collection.
 * 
 * @param model: {Object} The specified model to check.
 * @param set: {Array} The reference models collection.
 */
js.swt.List.isModelIn = function(model, set){
	var C = js.swt.List, len = set ? set.length : 0;
	for(var i = 0; i < len; i++){
		if(C.isSameModel(model, set[i])){
			return true;
		}
	}
	
	return false;
};

/**

 Copyright 2010-2013, The JSVM Project. 
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
 * File: DropdownList.js
 * Create: 2012/05/07 02:06:36
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

/**
 * A <em>DropdownList</em> is a <em>Container</em> which includes a <em>List</em>.
 * 
 * Attention: 
 *		only when <em>multiEnable</em> is <em>true</em>, the <em>multiByCheck</em> can
 *		take effect. Otherwise it will be ignored.
 * 
 * @param def: {
 *	   className: {String} required,
 *	   css: {String} optional
 *	   id: {String} optional,
 * 
 *	   container: {js.awt.Component} required,
 *	   multiEnable: {Boolean} Default is <em>false</em>, required, 
 *	   distinct: {Boolean} Default is false, required. Indicate whether the item of List 
 *		   is distinct. 
 *	   searchIfAllowed: {Boolean} Default is false, required. Indicate whether the DropdownList
 *		   can support quick search if it is enable. 
 *	   showItemTip: {Boolean} Default is false, required. Indicate whether each item should show 
 *		   its tooltips with the given tooltips or its display value.
 *	   searchCritical: {Number} An optional value between 1 and 100 which expresses a percent. 
 *		   When (the viewable height/total contents height) <= this percent, the DropdownList can
 *		   be enable to do quick search.
 * 
 *	   lazy: {Boolean} Default is false, optional. Indicate whether all items should
 *		  be loaded lazily. That is to say, all items will be added and removed 
 *		  asynchronously. 
 *
 *	   itemDefs: {Array} Definitions of items. If it is specified, the itemModels will be ignored.
 *	   itemModels: {Array} Models of items, optional. Its structure is as follow:
 *	   [
 *			{dname: xxx, img: xxx (Optional), value},
 *				......
 *			{dname: xxx, img: xxx (Optional), value}	 
 *	   ]
 * }
 */ 
$import("js.swt.List");

js.swt.DropdownList = function(def, Runtime){
	var CLASS = js.swt.DropdownList, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, 
	DOM = J$VM.DOM, System = J$VM.System;
	
	var searchBoxDef = {
		classType: "js.awt.HBox",
		
		align_x: 0.5, align_y: 0.0,
		rigid_w: false,	rigid_h: true,
		
		height: CLASS.DEFAULTSEARCHBOXHEIGHT,
		
		layout: {gap: 0, align_x: 1.0, align_y: 0.5},
		
		items: ["btnStrategy", "inputBox", "btnClear"],
		btnStrategy: {
			classType: "js.awt.Icon",
			image: "search.png",
			
			rigid_w: true, rigid_h: true,
			prefSize: {width: 11, height: 11},
			
			width: 11, height: 11
		},
		inputBox: {
			classType: "js.swt.TextField",
			rigid_w: false, rigid_h: false
		},
		btnClear: {
			classType: "js.awt.Icon",
			image: "clear.png",
			
			rigid_w: true,	rigid_h : true,
			prefSize: {width: 11,	height: 11},
			
			width: 11, height: 11
		}
	},
	controlBarDef = {
		classType: "js.awt.HBox",
		
		align_x: 0.5, align_y: 1.0,
		rigid_w: false, rigid_h: true,
		
		height: CLASS.DEFAULTCONTROLBARHEIGHT,

		layout: {gap: 0, align_x: 1.0, align_y: 0.5},
		items: ["label"],
		label: {
			classType: "js.awt.Label",
			rigid_w: true, rigid_h: false
		}
	};
	
	/**
	 * @see js.swt.List #setItems
	 */
	thi$.setItems = function(items){
		this.list.setItems(items);
	};
	
	/**
	 * @see js.swt.List #addItems
	 */
	thi$.addItems = function(items){
		this.list.addItems(items);
	};
	
	/**
	 * @see js.swt.List #setItemsByModel
	 */
	thi$.setItemsByModel = function(models){
		this.list.setItemsByModel(models);
	};

	/**
	 * @see js.swt.List #addItemsByModel
	 */
	thi$.addItemsByModel = function(models){
		this.list.addItemsByModel(models);
	};
	
	/**
	 * @see js.swt.List #setItemsByDef
	 */
	thi$.setItemsByDef = function(defs){
		this.list.setItemsByDef(defs);
	};
	
	/**
	 * @see js.swt.List #addItemsByDef
	 */
	thi$.addItemsByDef = function(defs){
		this.list.addItemsByDef(defs);
	};
	
	/**
	 * @see js.swt.DropdownList #removeItemsByModel
	 */
	thi$.removeItemsByDef = function(def){
		var m = def ? def.model : undefined,
		tmp;
		if(m){
			tmp = this.removeItemsByModel(m);
		}
		
		return tmp;
	};
	
	/**
	 * @see js.swt.DropdownList #removeItems
	 */	
	thi$.removeItemsByModel = function(model){
		var items = this.findItemsByModel(model),
		tmp;
		if(items && items.length > 0){
			if(this.def.multiEnable === true){
				tmp = items;
			}else{
				tmp = [items[0]];
			}
			
			this.removeItems(tmp);
		}
		
		return tmp;
	};

	/**
	 * @see js.swt.List #removeItems
	 */	
	thi$.removeItems = function(items){
		this.list.removeItems(items);
		return items;
	};
	
	/**
	 * @see <em>js.swt.List #getItems()</em>
	 */
	thi$.getItems = function(){
		return this.list.getItems();
	};
	
	/**
	 * @see <em>js.swt.List #getItemModels()</em>
	 */
	thi$.getItemModels = function(){
		return this.list.getItemModels();
	};
	
	/**
	 * @see <em>js.swt.List #getItemDefs()</em>
	 */
	thi$.getItemDefs = function(){
		return this.list.getItemDefs();
	};
	
	/**
	 * Select all items indicated by given values.
	 * 
	 * @see <em>js.swt.List #setSelectedValues</em>
	 */
	thi$.setSelectedValues = function(values, callback){
		var list = this.list;
		list.setSelectedValues.apply(list, arguments);
	};

	/**
	 * Select all items indicated by given indexes.
	 * 
	 * @see <em>js.swt.List #setSelectedIndexes</em> 
	 */	   
	thi$.setSelectedIndexes = function(indexes, callback){
		var list = this.list;
		list.setSelectedIndexes.apply(list, arguments);
	};
	
	/**
	 * Select all given items.
	 * 
	 * @see <em>js.swt.List #setSelectedItems</em>
	 */
	thi$.setSelectedItems = function(items, callback){
		var list = this.list;
		list.setSelectedItems.apply(list, arguments);
	};
		
	/**
	 * Un-select all given items.
	 * 
	 * @see <em>js.swt.List #unselectAll</em>
	 */
	thi$.unselectAll = function(callback){
		var list = this.list;
		list.unselectAll.apply(list, arguments);
	};
	
	/**
	 * Select all items indicated by given model.
	 * 
	 * @see <em>js.swt.List #setSelectedItems</em>
	 */
	thi$.setSelectedByModel = function(model, callback){
		var args = Array.prototype.slice.call(arguments, 1),
		items = this.findItemsByModel(model);
		args.unshift(items);
		
		this.setSelectedItems.apply(this, args);
	};
	
	/**
	 * @see <em>js.swt.List #getSelectedItems</em>
	 */
	thi$.getSelectedItems = function(isOrdered){
		return this.list.getSelectedItems();;
	};
	
	/**
	 * @see <em>js.swt.List #getSelectedModels</em>
	 */
	thi$.getSelectedModels = function(isOrdered){
		return this.list.getSelectedModels(isOrdered);
	};
	
	/**
	 * @see <em>js.swt.List #getSelectedIndexes</em>
	 */
	thi$.getSelectedIndexes = function(){
		return this.list.getSelectedIndexes();
	};
	
	thi$.findModelByIndex = function (index){
		var items = this.getItems();
		var len = items ? items.length : 0;
		if(isNaN(index) || len == 0 || index >= len){
			return null;
		}
		
		return items[0] ? items[0].model : null;
	};
	
	thi$.findItemsByModel = function(model){
		if(!model || (typeof model !== "object"))
			return null;
		
		return this.list.getItemsByModel(this.getItems(), model);
	};
	
	thi$.findItemsByDname = function(dname){
		if(typeof dname !== "string")
			return null;
		
		return this.list.getItemsByDname(this.getItems(), dname);
	};
	
	thi$.findModelByDname = function (dname) {
		var items = this.findItemsByDname(dname);
		return (items && items.length > 0) ? items[0].model : null;
	};
	
	thi$.findItemsByValue = function (value){
		if(value == undefined || value == null)
			return null;
		
		return this.list.getItemsByValue(this.getItems(), value);
	};
	
	thi$.findModelByValue = function (value) {
		var items = this.findItemsByValue(value);
		return items && items.length > 0 ? items[0].model : null;
	};
	
	thi$.setSearchCritical = function(num){
		num = parseInt(num);
		if(!isNaN(num) && num >= 1 && num <= 100){
			this.searchCritical = num;
		} else {
			this.searchCritical = js.swt.DropdownList.SEARCHCRITICAL;
		}
	};
	
	thi$.getSearchCritical = function(){
		return this.searchCritical;
	};

	thi$.setMinimumSize = function(w, h){
		this.def.miniSize = this.def.miniSize || {};
		
		var miniSize = this.def.miniSize, 
		ow = miniSize.width, oh = miniSize.height,
		invalidate = false;
		if(!isNaN(w) && w !== ow){
			invalidate = true;
			miniSize.width = w;
		}
		
		if(!isNaN(h) && h !== oh){
			invalidate = true;
			miniSize.height = h;
		}
		
		if(invalidate){
			this.invalidateLayout(false);
		}
		
	}.$override(this.setMinimumSize);
	
	var _calMiniHeight = function(){
		var box = this.getBounds(), mbp = box.MBP,
		gap = (this.layout && this.layout.def) ? (this.layout.def.gap || 0) : 0,
		h = 18, d;
		
		if(this.searchBox && this.searchBox.isVisible()){
			d = this.searchBox.getSize();
			h += d.height;
			
			h += gap;
		}
		
		if(this.controlBar && this.controlBar.isVisible()){
			d = this.controlBar.getSize();
			h += d.height;
			
			h += gap;
		}
		
		h += mbp.BPW;
		return h;
	};
	
	thi$.getMinimumSize = function(){
		var minH = this.def.miniSize 
			? this.def.miniSize.height : undefined;
		if(isNaN(minH)){
			minH = _calMiniHeight.call(this);
			this.setMinimumSize(undefined, minH);
		}
		
		return this.def.miniSize;

	}.$override(this.getMinimumSize);
	
	thi$.setMaximumSize = function(w, h){
		this.def.maxiSize = this.def.maxiSize || {};
		
		var maxiSize = this.def.maxiSize,
		ow = maxiSize.width, oh = maxiSize.height,
		invalidate = false;
		if(!isNaN(w) && ow !== w){
			invalidate = true;
			maxiSize.width = w;
		}
		
		if(!isNaN(h) && oh !== h){
			invalidate = true;
			this.def.maxiSize.height = h;
		}
		
		if(invalidate){
			this.invalidateLayout(false);
		}
		
	}.$override(this.setMinimumSize);
	
	thi$.getMaximumSize = function(){
		return this.def.maxiSize;
	}.$override(this.getMaximumSize);
	
	thi$.getPreferredSize = function(){
		if(this.isPreferredSizeSet){
			return this.def.prefSize;
		}
		
		if(this._local.optimalSize){
			return this._local.optimalSize;
		}else{
			return arguments.callee.__super__.apply(this, arguments);
		}
	}.$override(this.getPreferredSize);
	
	var _setSearchEnable = function(b){
		var v = (b === true);
		if(this.searchEnable === v)
			return;
		
		this.searchEnable = v;
		
		if(this.searchBox){
			this.searchBox.setVisible(v);
			this.searchBox.applyStyles({display : (v ? "block" : "none")});
		}
		
		if(this.list){
			this.list.setSearchEnable(v);
		}
	};
	
	var _layoutSearchBox = function(){
		var box = this.getBounds(), prefSize = this.list.getPreferredSize(), 
		avaiH = box.innerHeight, show = false;
		
		if(this.controlBar && this.controlBar.isVisible()){
			var d = this.controlBar.getSize();
			avaiH -= d.height;
		}
		
		if(this.searchBox && this.searchIfAllowed 
		   && this.list.canBeSearched()){
			show = ((avaiH / prefSize.height * 100) <= this.searchCritical);
		}
		
		_setSearchEnable.call(this, show);		  
	};
	
	var _setOptimalSize = function(w, h){
		if(this._local.optimalSize){
			return;
		}
		
		var s = DOM.outerSize(this.view);
		this._local.optimalSize = {
			width: (isNaN(w) ? s.width : w), 
			height: (isNaN(h) ? s.height: h)
		};
	};
	
	var _getGap = function(){
		var gap = this._local.gap;
		if(!isNaN(gap)){
			return gap;
		}
		
		gap = 0;
		if(this.layout && this.layout.def){
			gap = this.layout.def.gap || 0;
		}
		
		this._local.gap = gap;
		return this._local.gap;
	};
	
	var _isSBoxVisible = function(ah){
		var show = false, prefSize = this.list.getPreferredSize();
		if(this.searchBox && this.searchIfAllowed
		   && this.list.canBeSearched()){
			show = ((ah / prefSize.height * 100) <= this.searchCritical);
		}
		
		return show;
	};
	
	var _calLengthenDeltas = function(listW, listH){
		var rtBounds = this._local.runtimeBounds,
		area = this._local.runtimeArea, deltas;
		if(!rtBounds || !area){
			return deltas;
		}
		
		var st = CLASS.SCROLLBARTHINKNESS,
		prefSize = this.list.getPreferredSize(),
		maxiSize = this.getMaximumSize(),
		rx = rtBounds.x, ry = rtBounds.y, 
		rw = rtBounds.width, rh = rtBounds.height,
		aw = area.width, ah = area.height,
		hGap = listW - prefSize.width, 
		vGap = listH - prefSize.height,
		wDelta = hGap <= 0 ? st : (st - hGap),
		hDelta = vGap <= 0 ? st : (st - vGap),
		wAmple = false, hAmple = false,
		tmpW, tmpH;
		
		if(maxiSize){
			tmpW = maxiSize.width;
			if(!isNaN(tmpW) && tmpW < aw){
				aw = tmpW;
			}
			
			tmpH = maxiSize.height;
			if(!isNaN(tmpH) && tmpH < ah){
				ah = tmpH;
			}
		}
		
		if(wDelta <= 0){
			wDelta = 0;
			wAmple = true; //Enough to place all contents and vertical scrollbar
		}
		
		if(hDelta <= 0){
			hDelta = 0;
			hAmple = true; //Enough to place all contents and vertical scrollbar
		}
		
		switch(area.AID){
		case "A":
			tmpW = aw - rw;
			wDelta = Math.min(wDelta, tmpW);
			
			tmpH = ah - rh;
			hDelta = Math.min(hDelta, tmpH);
			break;
		case "D": //Area D
			tmpW = rx > 0 ? rx : 0;
			wDelta = 0 - Math.min(wDelta, tmpW);
			
			tmpH = ah - rh;
			hDelta = Math.min(hDelta, tmpH);
			break;
		case "B": //Area B
			tmpW = aw - rw;
			wDelta = Math.min(wDelta, tmpW);
			
			tmpH = ry > 0 ? ry : 0;
			hDelta = 0 - Math.min(hDelta, tmpH);
			break;
		case "C":
			tmpW = rx > 0 ? rx : 0;
			wDelta = 0 - Math.min(wDelta, tmpW);

			tmpH = ry > 0 ? ry : 0;
			hDelta = 0 - Math.min(hDelta, tmpH);
			break;
		}
		
		deltas = {
			wAmple: wAmple, wDelta: wDelta, maxWDelta: tmpW,
			hAmple: hAmple, hDelta: hDelta, maxHDelta: tmpH
		};
		
		return deltas;
	};
	
	var _preSize = function(){
		var matrix = this._local.matrix;
		if(matrix){
			return matrix;
		}
		
		matrix = {};
		
		var box = this.getBounds(), mbp = box.MBP,
		houter = mbp.BPW, vouter = mbp.BPH,
		prefSize = this.list.getPreferredSize(),
		miniSize = this.getMinimumSize(),
		maxiSize = this.getMaximumSize(),
		gap = _getGap.call(this),
		w = box.width, h = box.height,
		vother = 0, show = false,
		d, minW, minH, maxW, maxH, 
		rb, rw, rh;
		
		if(this.controlBar){
			d = this.controlBar.getSize();
			vother += d.height;
			
			vother += gap;
		}
		
		w = this.hauto ? prefSize.width + houter : w;
		h = this.vauto ? prefSize.height + vouter + vother : h;
		
		if(miniSize){
			minW = miniSize.width;
			minH = miniSize.height;
			
			w = (!isNaN(minW) && minW > 0) ? Math.max(w, minW) : w;
			h = (!isNaN(minH) && minH > 0) ? Math.max(h, minH) : h;
		}
		
		if(maxiSize){
			maxW = maxiSize.width;
			maxH = maxiSize.height;
		}			 
		
		rb = this._local.runtimeBounds;
		if(rb){
			rw = rb.width;
			rh = rb.height;
			
			maxW = !isNaN(maxW) ? Math.min(maxW, rw) : rw;
			maxH = !isNaN(maxH) ? Math.min(maxH, rh) : rh;
		}
		
		if(!isNaN(maxW) && maxW < w){
			w = maxW;
		}
		
		if(!isNaN(maxH) && maxH < h){
			h = maxH;
		}

		matrix.width = w;
		matrix.height = h;
		
		show = _isSBoxVisible.call(this, h - vouter - vother);
		matrix.isSBoxVisible = show;
		_setSearchEnable.call(this, show);
		
		vother = 0;
		if(this.searchBox && this.searchBox.isVisible()){
			d = this.searchBox.getSize();
			vother += d.height;
			
			vother += gap;
		}
		
		if(this.controlBar && this.controlBar.isVisible()){
			d = this.controlBar.getSize();
			vother += d.height;
			
			vother += gap;
		}
		
		matrix.listW = w - houter;
		matrix.listH = h - vouter - vother;
		
		this._local.matrix = matrix;
		return matrix;
	};
	
	var _rectifyListSize = function(s){
		if(!s.wAdjusted && !s.hAdjusted){
			return;
		}
		
		var ST = CLASS.SCROLLBARTHINKNESS,
		listBox = this.list.getBounds(),
		w = listBox.innerWidth, 
		h = listBox.innerHeight,
		listView = this.list.listView,
		vBox = DOM.getBounds(listView),
		sw = listView.scrollWidth, 
		sh = listView.scrollHeight;
		
		if(s.wAdjusted){
			w -= ST;
		}else{
			// if(J$VM.ie && !isNaN(sw) 
			//	&& sw != vBox.width){
			//	System.err.println("Width:" + vBox.width + " ScollWidth:" + sw);
			//	w = sw;
			// }else{
			w = undefined;
			// }
		}
		
		if(s.hAdjusted){
			h -= ST;
		}else{
			// if(J$VM.ie && !isNaN(sh)
			//	&& sh != vBox.height){
			//	System.err.println("Height:" + vBox.height + " ScollHeight:" + sh);
			//	h = sh;
			// }else{
			h = undefined;
			// }
		}
		
		DOM.setSize(listView, w, h, vBox);
		
		// ?? That is very strange in IE when doctype
		if(J$VM.ie && J$VM.doctype.declared){
			var lvStyle = this.list.view.style,
			overflow = this.list.getStyle("overflow");
			if(overflow === "auto"){
				lvStyle.overflow = "scroll";
				this.list.setSize(listBox.width, listBox.height);
				lvStyle.overflow = "auto";
			}
		}
	};
	
	var _layout = function(){
		if(!this._isLayoutDirty || !this.list.isReady() 
		   || !this.isDOMElement()){
			return undefined;
		}
		
		this._isLayoutDirty = false;
		
		var ST = CLASS.SCROLLBARTHINKNESS,
		matrix = _preSize.call(this),
		prefSize = this.list.getPreferredSize(),
		listW = matrix.listW, listH = matrix.listH,
		w = matrix.width, h = matrix.height, 
		deltas = _calLengthenDeltas.call(this, listW, listH),
		ample = false, delta = 0, maxDelta, deltaSize = {}, 
		rb, rx, ry, x, y;
		
		if(deltas){
			rb = this._local.runtimeBounds;
			rx = rb.x;
			ry = rb.y;
			
			if(this.hauto && (listH < prefSize.height)){
				ample = deltas.wAmple;
				delta = deltas.wDelta;
				maxDelta = deltas.maxWDelta;
				
				if(!ample && maxDelta > 0){
					if(delta < 0){
						delta = Math.abs(delta);
						x = rx - delta;
					}
					w += delta;
					
					deltaSize.wDelta = delta;
					deltaSize.wAdjusted = true;
				}else if(ample){
					// Although the space is enough to place all contents and
					// the vertical scrollbar, however the vertical scrollbar
					// occupied the space and the list need be adjusted to make
					// space for in "_rectifyListSize()".
					deltaSize.wDelta = ST;
					deltaSize.wAdjusted = true;
				}else{
					//Ignore
				}
			}
			
			if(this.vauto && (listW < prefSize.width)){
				ample = deltas.hAmple;
				delta = deltas.hDelta;
				maxDelta = deltas.maxHDelta;
				
				if(!ample && maxDelta > 0){
					if(delta < 0){
						delta = Math.abs(delta);
						y = ry - delta;
						
					}
					h += delta;
					
					deltaSize.hDelta = delta;
					deltaSize.hAdjusted = true;
				}else if(ample){
					// Although the space is enough to place all contents and
					// the horizontal scrollbar, however the vertical scrollbar
					// occupied the space and the list need be adjusted to make
					// space for in "_rectifyListSize()".
					deltaSize.hDelta = ST;
					deltaSize.hAdjusted = true;
				}else{
					//Ignore
				}
			}
		}
		
		_setOptimalSize.call(this, w, h);
		this.setBounds(x, y, w, h);
		
		return deltaSize;
	};
	
	thi$.doLayout = function(){
		// We need to invoke the "_layout" function one time
		// only if some items are changed (Added and removed). 
		var s = _layout.call(this);
		if(s){
			arguments.callee.__super__.apply(this, arguments);
			_rectifyListSize.call(this, s);
		}
	}.$override(this.doLayout);
	
	/**
	 * @see js.awt.PopupLayer #beforeRemoveLayer
	 */
	thi$.beforeRemoveLayer = function(e){	
		this.notifyPeer("js.awt.event.LayerEvent", 
						new Event("beforeRemoveLayer", e || "", this));

		this.list.showController(false);
		this.restore();
		
	}.$override(this.beforeRemoveLayer);
	
	/**
	 * @see js.awt.PopupLayer #afterRemoveLayer
	 */
	thi$.afterRemoveLayer = function(e){
		if(e && e.getType() === "resize"){
			this.invalidateLayout(false);
		}

		this.notifyPeer("js.awt.event.LayerEvent", 
						new Event("afterRemoveLayer", e || "", this));
		
	}.$override(this.afterRemoveLayer);
	
	/**
	 * @see js.awt.PopupLayer #showAt
	 */
	thi$.setCallback = function(bounds, area, nofly){
		// Need to trigger doLayout() to re-layout the searchBox,
		// list and controlBar. However, we don't need to invoke
		// "_layout" function again. 
		this._isLayoutDirty = true;
		this._local.matrix = undefined;
		this._local.runtimeBounds = bounds;
		this._local.runtimeArea = area;
		
		this.doLayout(true);
		
	}.$override(this.setCallback);

	/**
	 * @see js.awt.PopupLayer #showAt
	 */
	thi$.showAt = function(x, y, m){
		if(this == this.rootLayer()){
			this.hideOthers();
		}
		
		// ?? Whether clear here
		// this._local.runtimeBounds = undefined;
		// this._local.runtimeArea = undefined;
		
		// Force the DropdownList's nofly area 
		// as horizontal breakthrough.
		arguments.callee.__super__.apply(this, [x, y, false, m]);
		
	}.$override(this.showAt);

	/**
	 * @see js.awt.PopupLayer #showBy
	 */
	thi$.showBy = function(by, m){
		if(this == this.rootLayer()){
			this.hideOthers();
		}
		
		// ?? Whether clear here
		// this._local.runtimeBounds = undefined;
		// this._local.runtimeArea = undefined;
		
		// Force the DropdownList's nofly area 
		// as horizontal breakthrough.
		arguments.callee.__super__.apply(this, [by, false, m]);
		
	}.$override(this.showBy);
	
	thi$.setPeerComponent = function(peer){
		if(this.list){
			this.list.setPeerComponent(peer);
		}
		
		arguments.callee.__super__.apply(this, arguments);
		
	}.$override(this.setPeerComponent);
	
	thi$.destroy = function(){
		this.detachEvent("mousedown", 0, this, _onMouseDown);
		this.detachEvent("click", 0, this, _onClick);
		this.detachEvent(J$VM.firefox ? "DOMMouseScroll" : "mousewheel", 
						 0, this, _onMouseScroll);
		
		if(this.searchBox){
			this.searchBox.inputBox.detachEvent(js.swt.TextField.EVT_VALUECHANGED, 
												4, this, _search);
			this.searchBox.btnClear.detachEvent("click", 
												0, this, _onBtnClearClicked);				
			
			//this.searchBox.destroy();
			delete this.searchBox;
		}
		
		if(this.list){
			var clz = js.swt.List;
			this.list.detachEvent(clz.EVT_READY, 4, this, _onListReady);
			this.list.detachEvent(clz.EVT_ACK_ITEMSADDED, 
								  4, this, _onListItemsAdded);
			this.list.detachEvent(clz.EVT_ACK_ITEMSREMOVED, 
								  4, this, _onLisItemsRemoved);
			this.list.detachEvent(clz.EVT_ITEMSELECTED, 
								  4, this, _notifySelectChanged, "set");
			this.list.detachEvent(clz.EVT_ITEMCLICKED, 
								  4, this, _notifySelectChanged, "click");
			
			//this.list.destroy();
			delete this.list;
		}
		
		if(this.controlBar){
			var label = this.controlBar.label;
			label.detachEvent("mouseover", 0, this, _onMouseOver);
			label.detachEvent("mouseout", 0, this, _onMouseOut);
			label.detachEvent("click", false, this, _onSubmit);

			//this.controlBar.destroy();
			delete this.controlBar;
		}
		
		delete this._local.root;
		delete this._local.optimalSize;
		delete this._local.matrix;
		delete this._local.runtimeBounds;
		delete this._local.runtimeArea;
		
		arguments.callee.__super__.apply(this, arguments);
	}.$override(this.destroy);
	
	/**
	 * @see js.swt.List #quickSearch
	 */
	thi$.quickSearch = function(keyword, options){
		this.list.quickSearch(keyword, options);
	};
	
	/**
	 * @see js.swt.List #restore
	 */
	thi$.restore = function(){
		if(!this.searchEnable){
			return;
		};
		
		var inputBox = this.searchBox.inputBox;
		if(inputBox){
			inputBox.setValue("");
		}
		
		this.list.restore();
	};
	
	var _search = function(e){
		if(this.searchEnable){
			var keyword = this.searchBox.inputBox.getValue();
			this.quickSearch(keyword);
		}
	};
	
	var _onBtnClearClicked = function(e){
		this.searchBox.inputBox.setValue("");
		this.restore();
	};
	
	var _createSearchBox = function(def){
		var r = this.Runtime(), theDef;
		
		theDef = System.objectCopy(searchBoxDef, {
									   className: this.__buf__.clear().append(def.className)
										   .append("_searchBox").toString()}, true);
		var searchBox = this.searchBox = 
			new (Class.forName("js.awt.HBox"))(theDef, r);

		searchBox.inputBox.attachEvent(js.swt.TextField.EVT_VALUECHANGED, 
									   4, this, _search);
		searchBox.btnClear.attachEvent("click", 0, this, _onBtnClearClicked);
		
		theDef = null;
		this.addComponent(searchBox);
	};
	
	var _notifySelectChanged = function(e, eType){
		var data = {
			models: this.getSelectedModels(true),
			callbackInfo: e.getData()
		};
		this.notifyPeer(
			"js.swt.event.SelectChangedEvent",
			new Event(eType, data, e.getEventTarget()) 
		);
	};
	
	var _onListReady = function(e){
		this.fireEvent(e);	
	};
	
	thi$.invalidateLayout = function(doLayout){
		if(!this._isLayoutDirty){
			var M = this.def, bounds = this.view.bounds,
			userW = bounds ? bounds.userW : undefined,
			userH = bounds ? bounds.userH : undefined;
			if(!isNaN(userW) || !isNaN(userH)){
				DOM.setSize(this.view, userW, userH, bounds);
			}
			
			delete M.width;
			delete M.height;
			
			this.invalidateBounds();
		}
		
		this._isLayoutDirty = true;
		this._local.matrix = undefined;
		this._local.optimalSize = undefined;
		this._local.runtimeBounds = undefined;
		this._local.runtimeArea = undefined;
		
		if(doLayout === true){
			this.doLayout(true);
		}
	};

	var _onListItemsAdded = function(e){
		this.invalidateLayout(true);
		this.fireEvent(e);	
	};
	
	var _onLisItemsRemoved = function(e){
		this.invalidateLayout(true);
		this.fireEvent(e);	
	};
	
	var _createList = function(def){
		var listDef = {
			className: def.className + "_list",
			itemClassName: def.className + "_item",
			
			searchOptions: def.searchOptions,
			
			multiEnable: (def.multiEnable === true),
			multiByCheck: (def.multiEnable === true),
			distinct: (def.distinct === true),
			lazy: def.lazy,
			
			hauto: false,
			vauto: false,
			
			itemModels: def.itemModels,
			itemDefs: def.itemDefs,
			controller: def.controller,
			
			align_x: 0.5,
			align_y: 0.0,
			rigid_w: false,
			rigid_h: false
		};
		
		var clz = Class.forName("js.swt.List"),
		list = this.list = new (clz)(listDef, this.Runtime());
		
		// In DropdownList, list'repaint is not naught. We should depend on
		// Container(current DropdownList)'s layoutComponent method to set
		// list's size and trigger its onResized to adjust its contents' size.
		list.repaint = function(){
			// Do nothing
		}.$override(list.repaint);

		list.attachEvent(clz.EVT_READY, 4, this, _onListReady);
		list.attachEvent(clz.EVT_ACK_ITEMSADDED, 4, this, _onListItemsAdded);
		list.attachEvent(clz.EVT_ACK_ITEMSREMOVED, 4, this, _onLisItemsRemoved);
		list.attachEvent(clz.EVT_ITEMSELECTED, 4, this, _notifySelectChanged, "set");
		list.attachEvent(clz.EVT_ITEMCLICKED, 4, this, _notifySelectChanged, "click");
		
		this.addComponent(list);		
	};
	
	var _onMouseOver = function(e){
		this.controlBar.label.setHover(true);	
	};
	
	var _onMouseOut = function(e){
		this.controlBar.label.setHover(false);	 
	};
	
	var _onSubmit = function(e){
		this.controlBar.label.setHover(false);
		this.fireEvent(
			new Event(CLASS.EVT_SUBMITVALUES, undefined, this));
	};
	
	var _createControlBar = function(def){
		var r = this.Runtime(), theDef;
		
		theDef = System.objectCopy(controlBarDef, {
									   className: this.__buf__.clear().append(def.className)
										   .append("_controlBar").toString()}, true);
		theDef.label.text = r.nlsText("dBtnOK");
		var controlBar = this.controlBar = 
			new (Class.forName("js.awt.HBox"))(theDef, r);
		
		var label = controlBar.label;
		label.attachEvent("mouseover", 0, this, _onMouseOver);
		label.attachEvent("mouseout", 0, this, _onMouseOut);
		label.attachEvent("click", false, this, _onSubmit);
		
		theDef = null;
		this.addComponent(controlBar);
	};
	
	var _onMouseDown = function(e) {
		e.cancelBubble();
	};

	var _onClick = function(e){
		if(this.isfloating){
			e.cancelBubble();	
		}
	};
	
	var _onMouseScroll = function(e) {
		if(this.isfloating){
			e.cancelBubble();	
		}	 
	};
	
	thi$._init = function(def, Runtime){
		if(typeof def !== "object") return;

		def = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
		def.className = def.className || "jsvm_dropdownList";
		arguments.callee.__super__.apply(this, arguments);
		
		this._isLayoutDirty = true;
		this._local.root = this;

		this.hauto = (def.hauto === true);
		this.vauto = (def.vauto === true);
		
		this.searchIfAllowed = (def.searchIfAllowed === true);
		this.isfloating = (def.isfloating === true);
		
		this.setSearchCritical(def.searchCritical);
		
		if(this.searchIfAllowed){
			_createSearchBox.call(this, def);
		}
		
		_createList.call(this, def);
		
		if(def.multiEnable === true 
		   && def.showControlBar === true){
			_createControlBar.call(this, def);
		}
		
		_setSearchEnable.call(this, false);
		
		this.attachEvent("mousedown", 0, this, _onMouseDown);
		this.attachEvent("click", 0, this, _onClick);
		this.attachEvent(J$VM.firefox ? "DOMMouseScroll" : "mousewheel", 
						 0, this, _onMouseScroll);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.VBox);

js.swt.DropdownList.SEARCHCRITICAL = 80;
js.swt.DropdownList.DEFAULTSEARCHBOXWIDTH = 30;
js.swt.DropdownList.DEFAULTSEARCHBOXHEIGHT = 17;
js.swt.DropdownList.DEFAULTCONTROLBARHEIGHT = 16;
js.swt.DropdownList.SCROLLBARTHINKNESS = 17;
js.swt.DropdownList.DEFAULTITEMHEIGHT = 16;

js.swt.DropdownList.EVT_SUBMITVALUES = "SubmitValues";

js.swt.DropdownList.DEFAULTDEF = function(){
	return {
		classType: "js.swt.DropdownList",
		
		distinct: false,
		multiEnable: false,
		showControlBar: false,
		showItemTip: true,
		
		hauto: true,
		vauto: true,
		
		isfloating: true,
		PMFlag: 0x27,
		
		searchIfAllowed: false,
		searchCritical: 80,
		
		lazy: false,
		
		itemModels: [],
		itemDefs: [],
		
		layout: {
			gap: 5
		}
	};
};

/**

 Copyright 2010-2013, The JSVM Project. 
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
 * File: ComboBox.js
 * Create: 2012/05/08 02:55:06
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

$import("js.swt.DItem");

/**
 * @param def: {
 *     className: {String} required,
 *     css: {String} optional
 *     id: {String} optional,
 *     container: {js.awt.Component} required,
 * 
 *     effect: {Boolean} Default is <em>false</em>. Indicate whether the ComboBox has effect
 *             when hover.
 *     wholeTrigger: {Boolean} Default is <em>false</em>. Indicate whether the DropDownList 
 *             should be popuped only while the whole ComboBox is clicked.
 *     showBtnByHover: {Boolean} Default is <em>false</em>. Indicate whether the DropDown 
 *             button can be shown only when mouse is hovering on.
 *     
 *     editable: {Boolean} Default is <em>false</em>, required,
 *     multiEnable: {Boolean} Default is <em>false</em>, required,
 *     distinct: {Boolean} Default is false, required. Indicate whether item of List is distinct. 
 *     searchIfAllowed: {Boolean} Default is false, required. Indicate whether the Combobox can 
 *         support quick search if it is enable. 
 
 *     showTips: {Boolean} Default is false, required. Indicate whether combobox should show 
 *         tooltips with the specified displayTip or the current selected item. 
 *         If <em>displayTip</em> is specifed, use it. Otherwise display value or real value of 
 *         the current selected item.
 *     displayTip: {String} A string specified the tip of combobox. 
 *     showItemTip: {Boolean} Default is false, required. Indicate whether each item of combobox's
 *          DropdownList show its display value (use real value if no display value) as tip.
 
 *     searchCritical: {Number} An optional value between 1 and 100 which expresses a percent. 
 *          When (the viewable height / total contents height) <= this percent, the DropdownList 
 *          can be enable to do quick search.
 * 
 *     lazy: {Boolean} Default is false, optional. Indicate whether all items should
 *        be loaded lazily. That is to say, all items will be added and removed 
 *        asynchronously.
 * 
 *     itemDefs: {Array} Definitions of items. If it is specified, the itemModels will be ignored.
 *     itemModels: {Array} Models of items, optional. Its structure is as follow:
 *     [
 *          {dname: xxx, img: xxx (Optional), value},
 *              ......
 *          {dname: xxx, img: xxx (Optional), value}     
 *     ]
 * }
 */

js.swt.ComboBox = function(def, Runtime){
    var CLASS = js.swt.ComboBox, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, 
    LList = js.util.LinkedList, DOM = J$VM.DOM, 
    System = J$VM.System, MQ = J$VM.MQ,
    
    List = Class.forName("js.swt.List"),
    DDList = Class.forName("js.swt.DropdownList");
    
    var dItemContainerDef = {
        classType: "js.awt.HBox",

        rigid_w: false, rigid_h: false,
        layout: {
            gap: 0,
            align_x: 0.5, align_y: 0.5
        }
    },
    btnDropDownDef = {
        classType: "js.awt.Button",
        iconImage: "dropdown_new.png",

        rigid_w: true, rigid_h: false,
        effect: false
    },
    inputBoxDef = {
        classType: "js.swt.TextField",
        css: "border:0px none;",
        rigid_w: false, rigid_h: false,
        NUCG: true
    },
    sps = [
        "position", "top", "left",
        "font-family", "font-size", "font-style", "font-weight",
        "text-decoration", "text-align", "font-weight",
        "color", "background-color",
        "padding-top", "padding-right", "padding-bottom", "padding-left",
        "border-top-width", "border-right-width", 
        "border-bottom-width", "border-left-width",
        "border-top-style", "border-right-style",
        "border-bottom-style", "border-left-style",
        "border-top-color", "border-right-color",
        "border-bottom-style", "border-left-color"
    ],
    iptSps = [
        "font-family", "font-size", "font-style", "font-weight",
        "text-decoration", "text-align", "font-weight", "color", 
        "background-color"
    ];
    
    thi$.hasEffect = function(){
        return this.def.effect === true;
    };
    
    thi$.isWholeTrigger = function(){
        return this.def.wholeTrigger === true;
    };
    
    thi$.isShowBtnByHover = function(){
        return this.def.showBtnByHover === true;
    };
    
    thi$.setSubviewRoot = function(root){
        if(this.subview && root){
            this.subview.rootLayer(root);
        }else{
            this._local.subviewRoot = root;
        }
    };
    
    /**
     * @see js.swt.DropdownList #setItemsByModel
     */
    thi$.setItemsByModel = function(models){
        this._local.itemDefs = undefined;
        this._local.itemModels = models;

        _preSelect.call(this);
        
        if(this.subview){
            _showSubview.call(this, false);
            this.subview.setItemsByModel(models);
        }
    };

    /**
     * @see js.swt.DropdownList #addItemsByModel
     */
    thi$.addItemsByModel = function(models){
        if(!Class.isArray(models) || models.length == 0){
            return;
        }
        
        var ms = this._local.itemModels || [];
        this._local.itemModels = ms.concat(models);
        
        _preSelect.call(this);
        
        if(this.subview){
            _showSubview.call(this, false);
            this.subview.addItemsByModel(models);
        }
    };
    
    /**
     * @see js.swt.DropdownList #setItemsByDef
     */
    thi$.setItemsByDef = function(defs){
        this._local.itemModels = undefined;
        this._local.itemDefs = defs;
        
        _preSelect.call(this);
        
        if(this.subview){
            _showSubview.call(this, false);
            this.subview.setItemsByDef(defs);
        }
    };
    
    /**
     * @see js.swt.DropdownList #addItemsByDef
     */
    thi$.addItemsByDef = function(defs){
        if(!Class.isArray(defs) || defs.length == 0){
            return;
        }
        
        var ds = this._local.itemModels || [];
        this._local.itemDefs = ds.concat(defs);
        
        _preSelect.call(this);
        
        if(this.subview){
            _showSubview.call(this, false);
            this.subview.addItemsByDef(defs);
        }
    };
    
    /**
     * @return {Array} Items of ComboBox DropdownList.
     * @see js.swt.DropdownList #getItems
     */
    thi$.getItems = function(){
        return this.subview 
            ? this.subview.getItems() : undefined;
    };
    
    /**
     * @return {Array} Models of ComboBox DropdownList's items.
     * @see js.swt.DropdownList #getItemModels
     */
    thi$.getItemModels = function(){
        var ms = this._local.itemModels;
        if(!ms && this.subview){
            ms = this.subview.getItemModels();
        };
        
        return ms;
    };
    
    /**
     * @return {Array} Definitions of ComboBox DropdownList's items.
     * @see js.swt.DropdownList #getItemDefs
     */
    thi$.getItemDefs = function(){
        var ds = this._local.itemDefs;
        if(!ds && this.subview){
            ds = this.subview.getItemDefs();
        }
        
        return ds;
    };
    
    /**
     * Return current selected values, some of them may be not belonged to
     * any items.
     */
    thi$.getSelectedValues = function(){
        return this._local.selectedValues;     
    };
    
    var _getSelectedIndexes = function(){
        var ds = this._local.itemDefs, 
        ms = this._local.itemModels, 
        useDs = false, set;
        
        if(Class.isArray(ds) && ds.length > 0){
            useDs = true;
            set = ds;
        }else if(Class.isArray(ms) && ms.length > 0){
            useDs = false;
            set = ms;
        }

        var len = set ? set.length : 0, 
        indexes = LList.$decorate([]), 
        m;
        for(var i = 0; i < len; i++){
            m = set[i];
            m = useDs ? m.model : m;
            if(m && m.marked === true 
               && !List.isIn(i, indexes)){
                indexes.addLast(i);
            }
        } 

        return indexes;
    };
    
    /**
     * Return all selected items' index.
     */
    thi$.getSelectedIndexes = function(){
        return this.subview 
            ? this.subview.getSelectedIndexes() 
            : _getSelectedIndexes.call(this);
    };
    
    /**
     * Return crrent selection's model.
     */
    thi$.getSelectedModel = function(){
        return this.displayItem.model;
    };
    
    var _unMarkAll = function(){
        var ds = this._local.itemDefs, 
        ms = this._local.itemModels, 
        useDs = false, set;
        
        if(Class.isArray(ds) && ds.length > 0){
            useDs = true;
            set = ds;
        }else if(Class.isArray(ms) && ms.length > 0){
            useDs = false;
            set = ms;
        }
        
        var len = set ? set.length : 0, m;
        for(var i = 0; i < len; i++){
            m = useDs ? set[i].model : set[i];
            if(m){
                m.marked = false;
            }
        }
    };
    
    /**
     * Query and return all the condition-met models of items
     * by the given condition.
     * 
     * @param by: {String} The reference property of model.
     * @param values: {Array} The reference values of the 
     *        reference property in model.
     * @param findAll: {Boolean} Indicate whether all satisfied
     *        models.
     * @param distinct: {Boolean} Indicate whether each item is
     *        distinct in the result set.
     */
    thi$.findItemModels = function(by, values, findAll, distinct){
        if(!Class.isString(by) || by.length == 0 
           || !Class.isArray(values) || values.length == 0){
            return undefined;
        }
        
        var ds = this._local.itemDefs, 
        ms = this._local.itemModels, 
        useDs = false, set;
        
        if(Class.isArray(ds) && ds.length > 0){
            useDs = true;
            set = ds;
        }else if(Class.isArray(ms) && ms.length > 0){
            useDs = false;
            set = ms;
        }else{
            return undefined;
        }
        
        var len = set ? set.length : 0, rst = [], m, v;
        for(var i = 0; i < len; i++){
            m = useDs ? set[i].model : set[i];
            v = m[by];
            
            if(List.isIn(v, values)){
                if(findAll !== true){
                    rst.push(m);
                    break;
                }
                
                if(!distinct || !List.isModelIn(m, rst)){
                    rst.push(m);
                }                
            }
        }
        
        return rst;
    };
    
    /**
     * Select all items indicated by given values.
     * Attention:
     *     If an end user didn't do any selection from the DropdownList, the given values
     *     will be kept even though some of the given values wasn't belonged any item of
     *     the DropdownList.
     * 
     * @param values: {Array} An <em>Array</em> for values. An item whose value equals with one
     *                of values will be selected.
     * @param callback: {Boolean} Indicate whethe need to nofiy the value changed.
     */
    thi$.setSelectedValues = function(values, callback){
        // If combobox is in edit, quit the editing status.
        // Add by mingfa.pan, 04/11/2013
        _quitEdit.call(this);
        
        if(!values || values.length == 0){
            this.unselectAll(callback);
            return;
        }
        
        if(this.subview){
            var cInfo = {values: values, notify: callback};
            this.subview.setSelectedValues(values, true, cInfo);
        }else{
            // Mark all models' state as un-marked
            _unMarkAll.call(this);
            
            var models, model;
            if(!this.multiEnable){
                var v = values[0];
                values = [v];
                
                models = this.findItemModels("value", values, false);
                model = (models && models.length > 0) ? models[0] : undefined;          

                if (!Class.isObject(model)) {
                    model = {dname: v, value: v};
                }else{
                    model.marked = true;
                }
            }else{
                models = this.findItemModels("value", values, true, false);
                
                var len = models ? models.length : 0,
                dnames = LList.$decorate([]), m, dn;
                for(var i = 0; i < len; i++){
                    m = models[i];
                    m.marked = true;
                    
                    dn = m.dname;
                    if(dn !== undefined && dn !== null 
                       && !dnames.contains(dn)){
                        dnames.addLast(dn);
                    }
                }
                
                if(dnames.length > 0){
                    var dname = _joinTexts.call(this, dnames);
                    model = {dname: dname, value: values};
                }else{
                    model = CLASS.DEFAULTMODEL;
                }
            }
            
            // Display current selection in display item
            if(Class.isObject(model)){
                _select.call(this, model);
            }
            
            /* Attention: 
             * Some of values may be not belonged to any item. So there are two steps as follow
             * to finish selecting:
             * 1) Recorde all current selected value include the one which is not belonged to any
             *    item of DropdownList.
             * 2) Select all items. Each of them is indicated by values.
             */
            _setSelectedValues.call(this, values);
            
            if(callback === true){
                this.onSelectedChanged();
            }
        }
        
    };
    
    /**
     * Return items' models by the given indexes.
     */
    thi$.findItemModelsByIndex = function(indexes, distinct){
        if(!Class.isArray(indexes) || indexes.length == 0){
            return undefined;
        }
        var ds = this._local.itemDefs, 
        ms = this._local.itemModels, 
        useDs = false;
        
        if(Class.isArray(ds) && ds.length > 0){
            useDs = true;
        }else if(Class.isArray(ms) && ms.length > 0){
            useDs = false;
        }else{
            return undefined;            
        }
        
        // Sort indexes by numerically and ascending
        indexes = indexes.sort(function(a,b){return a-b;});
        
        var len = indexes.length, idx, m, rst = [];
        for(var i = 0; i < len; i++){
            idx = indexes[i];
            m = useDs ? ds[idx].model : ms[idx];
            
            if(m && (!distinct 
                     || !List.isModelIn(m, rst))){
                rst.push(m);
            }
        }
        
        return rst;
    };
    
    /**
     * Select all items indicated by given indexes.
     * 
     * @param indexes: {Array} An <em>Array</em> for indexes, each element indicate an 
     *                 item which need be selected.
     *   
     * @see js.swt.DropdownList #setSelectedIndexed
     */    
    thi$.setSelectedIndexes = function(indexes, callback){
        // If combobox is in edit, quit the editing status.
        // Add by mingfa.pan, 04/11/2013
        _quitEdit.call(this);
        
        if(!indexes || indexes.length == 0){
            this.unselectAll(callback);
            return;
        }
        
        if(this.subview){
            var cInfo = {indexes: indexes, notify: callback};
            this.subview.setSelectedIndexes(indexes, true, cInfo);
        }else{
            // Mark all models' state as un-marked
            _unMarkAll.call(this);
            
            var ms, m, dnames, values, dname;
            if(!this.multiEnable){
                indexes = [indexes[0]];
                
                ms = this.findItemModelsByIndex(indexes);
                m = (ms && ms.length) ? ms[0] : undefined;

                if(m){
                    m.marked = true;
                    values = [m.value];
                }else{
                    m = CLASS.DEFAULTMODEL;
                }
            }else{
                dnames = LList.$decorate([]);
                values = LList.$decorate([]);
                ms = this.findItemModelsByIndex(indexes);
                
                var len = ms ? ms.length : 0, i, d, v;
                for(i = 0; i < len; i++){
                    m = ms[i];
                    m.marked = true;
                    
                    d = m.dname;
                    v = m.value;
                    if(d !== undefined && d !== null 
                       && !dnames.contains(d)){
                        dnames.addLast(d);
                    }
                    
                    if(!values.contains(v)){
                        values.push(v);
                    }
                }
                
                if(dnames.length > 0){
                    dname = _joinTexts.call(this, dnames);
                    m = {dname: dname, value: values};
                }else{
                    m = CLASS.DEFAULTMODEL;
                }
            }
            
            // Display current selection in display item
            _select.call(this, m);
            _setSelectedValues.call(this, values);
            
            if(callback === true){
                this.onSelectedChanged();
            }
        }
    };
    
    var _isSelectedChanged = function(model){
        var latestModel = this._local.latestModel;
        if(!(latestModel && model)){
            return true;
        }
        
        if(latestModel === model){
            return false;
        }
        
        // Date type is different, or value is different
        if(((typeof latestModel.value) != (typeof model.value)) 
            || (model.value != latestModel.value)){
            return true;
        }
        
        // Maybe only need to compare the "value"
        if(model.dname != latestModel.dname){
            return true;
        }
        
        if(model.img != latestModel.img){
            return true;
        }
        
        return false;
    };
    
    var _filterItemsByModel = function(model){
        var ds = this._local.itemDefs, 
        ms = this._local.itemModels,
        set, useDef = false;
        
        if(Class.isArray(ds) && ds.length > 0){
            set = ds;
            useDef = true;
        }else if(Class.isArray(ms) && ms.length > 0){
            set = ms;
            useDef = false;
        }else{
            return undefined;
        }
        
        var indexes = [], len = set.length, m;
        for(var i = 0; i < len; i++){
            m = useDef ? set[i].model : set[i];
            if(List.isSameModel(m, model)){
                if(!this.multiEnable && indexes.length == 0){
                    m.marked = true;
                    indexes.push(i);
                }else if(this.multiEnable){
                    m.marked = true;
                    if (!List.isIn(i, indexes)){
                        indexes.push(i);
                    }
                }else{
                    m.marked = false;
                }
            }else{
                m.marked = false;
            }
        }
        
        return indexes;
    };
    
    /**
     * Un-select all given items.
     * 
     * @see <em>js.swt.DropdownList #unselectAll</em>
     */
    thi$.unselectAll = function(callback){
        if(this.subview){
            var cInfo = {notify: callback};
            this.subview.unselectAll(true, cInfo);
        }else{
            // Mark all models' state as un-marked
            _unMarkAll.call(this);
            
            _select.call(this, {dname: "", value: []});
            _setSelectedValues.call(this, []);
            
            if(callback === true){
                this.onSelectedChanged();
            }
        }
    };
    
    /**
     * @param model: {dname: xxx, value: xxx} or {img: xxx, value: xxx}
     */
    thi$.setSelectedByModel = function(model, callback){
        if(!model || (typeof model !== "object"))
            return;

        // If combobox is in edit, quit the editing status.
        // Add by mingfa.pan, 04/11/2013
        _quitEdit.call(this);

        var changed = _isSelectedChanged.call(this, model);
        if(!changed){
            return;
        }
        
        _select.call(this, model);
        _setSelectedValues.call(this, [model.value]);
        
        var indexes = _filterItemsByModel.call(this, model) || [];
        if(this.subview && indexes.length > 0){
            this.subview.setSelectedIndexes(indexes, false); 
        }
        
        if (callback === true){
            this.onSelectedChanged();
        }
    };
    
    thi$.setMsgType = function(msgType){
        if(Class.isString(msgType) && msgType.length > 0){
            this._local.msgType = msgType;
        }
    };
    
    thi$.getMsgType = function(){
        return this._local.msgType;  
    };
    
    thi$.onSelectedChanged = function(target, eType){
        var msgType = this.getMsgType(),
        values = this.getSelectedValues(),
        eData = {comboID: this.id, values: values},
        evt = new Event(eType || "Selected", eData, target || this);
        this.notifyPeer(msgType, evt);
    };
    
    /**
     * @see js.swt.DropdownList #setSearchCritical
     */
    thi$.setSearchCritical = function(num){
        if(Class.isNumber(num)){
            this._local.searchCritical = num;
            
            var subview = this.subview;
            if(subview){
                subview.setSearchCritical(num);
            }
        }
    };
    
    thi$.isSearchEnable = function(){
        return this.subview 
            ? this.subview.searchEnable : false;  
    };
    
    thi$.onMoved = function(){
        arguments.callee.__super__.apply(this, arguments);
        
        var subview = this.subview;
        if(subview){
            subview.invalidateLayout(false);
        }
    }.$override(this.onMoved);
    
    thi$.onResized = function(fire){
        arguments.callee.__super__.apply(this, arguments);
        
        var subview = this.subview;
        if(subview){
            subview.invalidateLayout(false);
        }
    }.$override(this.onResized);
    
    var _onController = function(e){
        this.notifyPeer("js.swt.event.ControllerEvent", e);
    };
    
    thi$.repaint = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            if(!this._eventAttached){
                var M = this.def;
                if(M.wholeTrigger === true){
                    this.attachEvent("click", 0, this, _onDropDown);    
                }else{
                    Event.attachEvent(this.btnDropDown.view, "click", 0, 
                                      this, _onDropDown);
                }
                
                if(M.effect === true || M.showBtnByHover === true){
                    this.attachEvent("mouseover", 0, this, _onMouseOver);
                    this.attachEvent("mouseout", 0, this, _onMouseOut);
                }
                
                MQ.register("js.swt.event.SelectChangedEvent", 
                            this, this.selectedChanged);
                MQ.register("js.swt.event.ControllerEvent",
                            this, _onController);
                MQ.register("js.awt.event.LayerEvent", 
                            this, _onLayerRemoved);
                
                this._eventAttached = true;
            }
            
            return true;
        }
        
        return false;
        
    }.$override(this.repaint);
    
    thi$.onStateChanged = function(e){
        arguments.callee.__super__.apply(this, arguments);
        
        this.btnDropDown.setState(this.getState());

    }.$override(this.onStateChanged);
    
    thi$.destroy = function(){
        this._local.itemDefs = null;
        this._local.itemModels = null;
        this._local.selectedValues = null;
        
        if(this.displayItem){
            //this.displayItem.destroy();
            delete this.displayItem;
        }
        
        var M = this.def, subview = this.subview;
        if(this._eventAttached){
            if(M.wholeTrigger === true){
                this.detachEvent("click", 0, this, _onDropDown);    
            }else{
                Event.detachEvent(this.btnDropDown.view, "click", 0, 
                                  this, _onDropDown);
            }
            
            if(M.effect === true || M.showBtnByHover === true){
                this.detachEvent("mouseover", 0, this, _onMouseOver);
                this.detachEvent("mouseout", 0, this, _onMouseOut);
            }
            
            MQ.cancel("js.swt.event.SelectChangedEvent", 
                      this, this.selectedChanged);
            MQ.cancel("js.swt.event.ControllerEvent",
                      this, _onController);
            MQ.cancel("js.awt.event.LayerEvent", 
                      this, _onLayerRemoved);
        }
        
        if(subview){
            _showSubview.call(this, false);
            subview.setPMFlag(0);
            
            subview.detachEvent(List.EVT_READY, 4, this, _onListEvent);
            subview.detachEvent(List.EVT_ACK_ITEMSADDED, 4, this, _onListEvent);
            subview.detachEvent(List.EVT_ACK_ITEMSREMOVED, 4, this, _onListEvent);
            subview.detachEvent(DDList.EVT_SUBMITVALUES, 4, this, _onListSubmit);
            
            delete this.subview;
            subview.destroy();
        }
        
        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);

    /**
     * The display item is created and removed dynamically. When its styles was controlled,
     * we need to cache those styles and aplly them when the display item is created again.
     * 
     * @styles: {Object}
     */
    thi$.setDisplayItemStyles = function(styles){
        if(typeof styles !== "object"){
            return;
        }
        
        this._latestStyles = styles;
        if(this.displayItem){
            this.displayItem.applyStyles(styles);
        }
    };
    
    thi$.setErrSign = function(b, errStyles){
        var ditem = this.displayItem, dview, U = this._local, 
        oStyles = this._latestStyles, sp, styles, isCached;
        
        if(ditem){
            dview = ditem.view;
        }else{
            dview = this.dItemContainer.view;
        }
        
        if(b){
            U.errStyles = null;
            
            if(typeof errStyles === "object"){
                styles = U.errStyles = {};
                
                if(!oStyles){
                    oStyles = this._latestStyles = {};
                }
                
                for(sp in errStyles){
                    isCached = false;    
                    
                    if(oStyles.hasOwnProperty(sp)){
                        isCached = true;
                        
                        styles[sp] = oStyles[sp];
                        oStyles[sp] = errStyles[sp];
                    }else{
                        sp = DOM.camelName(sp);
                        if(oStyles.hasOwnProperty(sp)){
                            isCached = true;
                            
                            styles[sp] = oStyles[sp];
                            oStyles[sp] = errStyles[sp];
                        }
                    }
                    
                    if(!isCached){
                        styles[sp] = DOM.getStyle(dview, sp);
                        oStyles[sp] = errStyles[sp];
                    }
                }
                
                this.setDisplayItemStyles(oStyles);
            }
        }else{
            styles = U.errStyles;
            delete U.errStyles;

            if(typeof styles === "object"){
                if(!oStyles){
                    oStyles = this._latestStyles = {};
                }
                
                for(sp in styles){
                    if(oStyles.hasOwnProperty(sp)){
                        oStyles[sp] = styles[sp];
                    }else{
                        sp = DOM.camelName(sp);
                        oStyles[sp] = styles[sp];
                    }
                }
                
                this.setDisplayItemStyles(oStyles);
            }
        }
    };
    
    thi$.doEdit = function(){
        var dContainer = this.dItemContainer, iptView = this._inputView, 
        curV = iptView.getValue(), changed = true, models, model, values,
        findInList = false;
        
        // For the blur event of an input can be caused while remove it from
        // the parent node, when we invoke the removeComponent below, TextField
        // can catch the blur event and then fire the "SubmitValue" event to 
        // trigger the "doEdit" handler to remove the _inputView again, so detach
        // event first.
        iptView.detachEvent(js.swt.TextField.EVT_SUBMIT, 4, this, this.doEdit);
        delete this._inputView;
        
        dContainer.removeComponent(iptView);
        iptView.destroy();
        
        if(Class.isString(this._latestValue) 
           && this._latestValue === curV){
            changed = false;
        }
        
        if(!changed){
            _select.call(this, this._local.latestModel);
            return;
        }
        
        if(!this.multiEnable){
            /*
             * We think the input value will be as display value of item. so if there is some
             * item with the same display value existed in the DropDownList, we will use it.
             */
            models = this.findItemModels("dname", [curV]);
            model = (models && models.length > 0) ? models[0] : undefined;
            
            if(!model){
                model = {dname: curV, value: curV};
            }else{
                findInList = true;
            }
            
            values = [model.value];
        }else{
            values = _splitText.call(this, curV);
            model = {dname: curV, value: values};
        }
        
        /*
         * Before using the input value, if there are some special bussiness logic,
         * we need to implement the rectifyInput() method to handle the input value.
         * 
         * Add on 03/18/2014, for bug #102193:
         * If find a item with the input text as dname, use it directly.
         */
        if(!findInList && (typeof this.rectifyInput == "function")){
            model = this.rectifyInput(model);
            
            if(!this.multiEnable){
                values = [model.value]; 
            }
        }
        
        // Display current selection in display item
        _select.call(this, model);
        
        /* Attention: 
         * Some of values may be not belonged to any item. So there are two steps as follow
         * to finish selecting:
         * 1) Recorde all current selected value include the one which is not belonged to any
         *    item of DropdownList.
         * 2) Select all items. Each of them is indicated by values.
         */
        _setSelectedValues.call(this, values);
        
        var subview = this.subview;
        if(subview){
            subview.setSelectedValues(values, false);
        }
        
        // Notify the selected changed
        this.onSelectedChanged();       
    };
    
    var _preIptStyles = function(sps){
        var latestStyles = this._latestStyles, styles = {}, 
        len, sp, v;
        if(!latestStyles){
            return styles;
        }

        sps = sps || iptSps;
        len = Class.isArray(sps) ? sps.length : 0;
        
        for(var i = 0; i < len; i++){
            sp = sps[i];
            v = latestStyles[sp];
            
            if(v != undefined && v != null){
                styles[sp] = v;
            }
        }
        
        return styles;
    };
    
    thi$.getEditContents = function(m){
        return Class.isObject(m) ? m.dname || "" : "";
    };
    
    var _onEdit = function(e){
        e.cancelBubble();
        
        // Hide the DropDown button if need
        if(this.isShowBtnByHover()){
            this.showBtnDropDown(false);
        }
        
        // Hide the DropdownList
        _showSubview.call(this, false);
        
        var dContainer = this.dItemContainer, 
        Clz = Class.forName("js.swt.TextField"),
        iptStyles, iptDef, input, m, v;
        
        m = this._local.latestModel = this.displayItem.model;

        // Record the styles and remove the displayItem
        _removeDisplayItem.call(this);
        
        // Create input box'
        iptStyles = _preIptStyles.call(this);
        iptStyles = DOM.toCssText(iptStyles);
        
        iptDef = {
            width: this._latestWidth,
            height: this._latestHeight
        };
        
        iptDef = System.objectCopy(inputBoxDef, iptDef, true); 
        iptDef.css = (iptDef.css || "") + iptStyles;
        iptDef.fontCss = iptStyles;
        
        input = this._inputView = 
            new (Clz)(iptDef, this.Runtime());

        v = this._latestValue = this.getEditContents(m);
        input.setValue(v);
        
        dContainer.addComponent(input);
        dContainer.doLayout(true);
        
        input.attachEvent(Clz.EVT_SUBMIT, 4, this, this.doEdit);
        input.focus(true);
    };
    
    var _removeDisplayItem = function(){
        var dContainer = this.dItemContainer, 
        ditem = this.displayItem;
        
        if(ditem){
            if(!this._latestStyles){
                this._latestStyles = ditem.getStyles(sps);
            }
            
            this._latestWidth = ditem.getWidth();
            this._latestHeight = ditem.getHeight();
            
            if(this.editable) {
                ditem.detachEvent("click", 0, this, _onEdit);
            }
            
            dContainer.removeComponent(ditem);
            ditem.destroy();
        }
        
        delete this.displayItem;
    };

    var _createDisplayItem = function(model){
        var b = (this.def.showTips !== false),
        
        cssText = DOM.toCssText(this._latestStyles),
        dItemDef = {
            classType: "js.swt.DItem",
            className: this.__buf__.clear()
                .append(this.def.className)
                .append("_dItem").toString(),
            css: cssText,
            showTips: b,
            
            rigid_w: false, rigid_h: false,
            layout: {
                align_x: 0.0, align_y: 0.5
            },
            
            model: model
        },
        
        displayItem = this.displayItem =
            new js.swt.DItem(dItemDef, this.Runtime()),
        
        tip = this.def.displayTip;
        
        if (b && (typeof tip === "string")){
            displayItem.setToolTipText(tip);
        }

        if(this.editable){
            //displayItem.attachEvent("dblclick", 0, this, _onEdit);
            displayItem.attachEvent("click", 0, this, _onEdit);
        }
        
        this.dItemContainer.addComponent(displayItem);
        
        if(displayItem.isDOMElement() 
           && ((!isNaN(this._latestWidth) && this._latestWidth > 0) 
               || (!isNaN(this._latestHeight) && this._latestHeight > 0))){
            displayItem.setSize(this._latestWidth, this._latestHeight, 3);
        }
    };

    
    thi$.rectifyModel = function(m){
        // Implement if need.
        return m;  
    };
    
    /**
     * The <em>displayItem</em> will be removed first and then added again when call this method.
     * if not, there are something wrong when do edit.
     * 
     * @param model: {dname: xxx, value: xxx} or {img: xxx, value: xxx}
     */
    var _setSelected = function(model) {
        if(!model)
            return;
        
        _removeDisplayItem.call(this);
        
        model = this.rectifyModel(model);
        _createDisplayItem.call(this, model);
    };
    
    var _wrapText = function(text, startSymbol, endSymbol /* Optional */){
        if(typeof text !== "string")
            return null;
        
        var buf = new js.lang.StringBuffer(), symbol;
        if(typeof startSymbol === "string"){
            symbol = startSymbol;
            
            buf.append(startSymbol);
        }
        
        buf.append(text);
        
        if(typeof endSymbol === "string"){
            symbol = endSymbol;
        }
        
        if(typeof symbol === "string"){
            buf.append(symbol);
        }
        
        return buf.toString();
    };
    
    var _joinTexts = function(texts){
        if(!texts || texts.length == 0)
            return "";
        
        var buf = new js.lang.StringBuffer(), text;
        for(var i = 0, len = texts.length; i < len; i++){
            if(i > 0){
                buf.append(",");
            }
            
            text = texts[i];
            text = _wrapText.call(this, text, '\"');
            buf.append(text);
        }
        
        return buf.toString();
    };
    
    var _splitText = function(text){
        if(typeof text !== "string")
            return null;
        
        var regExp = /("[^"]+")/g, matches = text.match(regExp);
        if(!matches || matches.length == 0)
            return null;
        
        var len = matches.length, segs = [], seg;
        for(var i = 0; i < len; i++){
            seg = matches[i];
            seg = seg.replace(/"/g, "");
            
            segs[i] = seg;
        }
        return segs;
    };
    
    var _setSelectedValues = function(values){
        values = Class.isArray(values) ? values : [];
        this._local.selectedValues = LList.$decorate(values);      
    };
    
    var _select = function(model){
        this._local.latestModel = model;
        _setSelected.call(this, model);
    };
    
    thi$.showSubview = function(b){
        var rst = false;
        if(b === true){
            rst = true;
            
            if(this.subview){
                if(this.subview.isShown()){
                    this.subview.hide("hide", {ignore: true});
                    
                    this._local.expectedOp = 1; 
                    this.setHover(false);
                }
                
                _showSubview.call(this, true);
            }else{
                _onDropDown.call(this);
            }
        }else{
            if(this.subview){
                _showSubview.call(this, false);
            }
        }
        
        return rst;
    };
    
    var _showSubview = function(b){
        if(!this.subview){
            return;
        }
        
        this._local.expectedOp = b ? 0 : 1;
        var isShown = this.subview.isShown();
        if(isShown == b){
            return;
        }
        
        if(b){
            if(this.isShowBtnByHover()){
                this.showBtnDropDown(true);
            }
            
            var w = DOM.outerWidth(this.view, true);
            this.subview.setMinimumSize(w);
            this.subview.showBy(this.view);
        }else{
            this.subview.hide();
        }
    };
    
    thi$.showBtnDropDown = function(b){
        var btn = this.btnDropDown; 
        if(btn.isVisible() === b 
           || (b && this._inputView)){
            return;
        }
        
        btn.setVisible(b);
        btn.display(b);
        
        if(this.isDOMElement()){
            btn.def.prefSize = null;
            this.doLayout(true);   
        }     
    };
    
    var _onDropDown = function(e){
        if(e){
            e.cancelBubble();
        }
        
        if(this._inputView){
            this.doEdit();
        }

        this._local.latestModel 
            = this.displayItem ? this.displayItem.model : null;
        
        var M = this.def;
        if(!this.subview){
            //var w = DOM.outerWidth(this.view, true);
            //M.subview.width = w;
            _createSubview.call(this, M);

            var tmp = this._local.subviewRoot;
            if(tmp){
                this.subview.rootLayer(tmp);
                delete this._local.subviewRoot;
            }
        }

        var show = (this._local.expectedOp == 0 ? false : true);
        _showSubview.call(this, show);
    };
    
    var _onMouseOver = function(e){
        if(this.subview && this.subview.isShown()){
            return;
        }
        
        if(this.isShowBtnByHover()){
            this.showBtnDropDown(true);
        }
        
        if(this.hasEffect()){
            this.setHover(true);
        }
    };
    
    var _onMouseOut = function(e){
        if(this.subview && this.subview.isShown()){
            return;
        }

        if(this.hasEffect()){
            this.setHover(false);
        }

        if(this.isShowBtnByHover()){
            this.showBtnDropDown(false);
        }
    };
    
    // When we want to select some non-existent items from the ComboBox's list
    // by invoking setSelectedValues() or setSelectedIndexes(), we will build
    // a model object as the selected with the same rules as those two methods
    // implementation:
    // a)If invoked the setSelectedValues(), use the specified values
    //   as value to build a model object.
    // b)If no model object can be returned, use the default model.
    var _buildSelectedModel = function(cInfo){
        var m;
        if(cInfo && cInfo.values){
            var set = cInfo.values, dname, v;
            if(set.length > 0){
                if(this.multiEnable){
                    dname = _joinTexts.call(this, set);
                    v = set;
                }else{
                    dname = v = set[0];
                }
                
                m = {dname: dname, value: v};
            }
        }else{
            // Whether we should use the first item as selected??
            // if(cInfo && cInfo.indexes){
            //     var ms = this.findItemModelsByIndex([0]);
            //     m = ms ? ms[0] : undefined;
            // }
        }
        
        return m || {dname: "", value: "", isDefault: true};
    };
    
    /**
     * A temporary solution to make user can custom the display value by
     * overriding this method.
     */
    thi$.extractSelectedModel = function(event){
        var data = event.getData(), models = data.models, 
        cInfo = data.callbackInfo,
        len = models ? models.length : 0,
        selectedModel;
        
        if (len == 0){
            selectedModel = _buildSelectedModel.call(this, cInfo);
        } else if (this.multiEnable){
            var dnames = LList.$decorate([]), values = LList.$decorate([]), 
            m, dname, v;
            for(var i = 0; i < len; i++){
                m = models[i];
                dname = m.dname;
                v = m.value;
                if(dname !== undefined && dname !== null 
                   && !dnames.contains(dname)){
                    dnames.addLast(dname);
                }
                
                if(v !== undefined && v !== null 
                   && !values.contains(v)){
                    values.push(v);
                }
            }
            
            dname = _joinTexts.call(this, dnames);
            selectedModel = {dname: dname, value: values};
        } else {
            selectedModel = models[0];
        }
        
        return selectedModel;
    };
    
    thi$.selectedChanged = function(event){
        var data = event.getData(), cInfo = data.callbackInfo,
        m = this.extractSelectedModel(event), vs;
        if(!m.value && m.isDefault === true){
            vs = [];
        }else{
            vs = this.multiEnable ? m.value : [m.value];
        }

        this._local.selectedValues = LList.$decorate(vs);
        _select.call(this, m);
        
        if(!this.multiEnable){
            //If it isn't single selection, hide the dropdown list.
            _showSubview.call(this, false);
        }
        
        if((event.getType() === "click") 
            || (cInfo && cInfo.notify === true)){
            this.onSelectedChanged(event.getEventTarget(), "ItemMarked");       
        }
    };
    
    /**
     * In some special cases, make the combobox be in editable state immediately.
     * 
     * @param force: {Boolean} Indicate to force the combobox be in editable state
     *        even if it isn't editiable now.
     */
    thi$.activeEdit = function(force){
        if(force === true || this.editable){
            _onEdit.call(this, new Event("activeEdit"));
        }
    };
    
    var _onListEvent = function(e){
        this.fireEvent(e);
    };
    
    var _onListSubmit = function(){
        _showSubview.call(this, false);
    };
    
    var _createSubview = function(def){
        var theDef = def.subview,
        ds = this._local.itemDefs,
        ms = this._local.itemModels;
        if(Class.isArray(ds) && ds.length > 0){
            theDef.itemDefs = ds;
        }else if(Class.isArray(ms) && ms.length > 0){
            theDef.itemModels = ms;
        } 
        
        var subview = this.subview = new DDList(theDef, this.Runtime());
        subview.setPeerComponent(this);
        subview.setAdjustPosToFit(false);
        
        subview.attachEvent(List.EVT_READY, 4, this, _onListEvent);
        subview.attachEvent(List.EVT_ACK_ITEMSADDED, 4, this, _onListEvent);
        subview.attachEvent(List.EVT_ACK_ITEMSREMOVED, 4, this, _onListEvent);
        subview.attachEvent(DDList.EVT_SUBMITVALUES, 4, this, _onListSubmit);
    };
    
    var _onLayerRemoved = function(e){
        var type = e.getType(), evt = e.getData(),
        eType = evt ? ((evt instanceof js.util.Event) 
                       ? evt.getType() : evt.type) : undefined,
        el = evt ? evt.srcElement : undefined,
        trigger = (this.def.wholeTrigger === true 
                   ? this : this.btnDropDown);
        
        this.notifyPeer("js.awt.event.LayerEvent", e);
        
        if(type == "afterRemoveLayer"){
            if(eType == "hide" && evt && evt.ignore === true){
                return;
            }

            if(eType == "hide" || eType == "message"  
               || (el && !trigger.contains(el, true))){
                this._local.expectedOp = 1; 
                this.setHover(false);
                
                if(this.isShowBtnByHover()){
                    this.showBtnDropDown(false);
                }
            }
        }
    };
    
    // If combobox is in edit, quit the editing status.
    // Add by mingfa.pan, 04/11/2013
    var _quitEdit = function(){
        var iptView = this._inputView;
        if(!this.editable || !iptView){
            return;
        }
        
        iptView.detachEvent(js.swt.TextField.EVT_SUBMIT, 4, this, this.doEdit);

        this.dItemContainer.removeComponent(iptView);
        iptView.destroy();
        delete this._inputView;
        
        _select.call(this, this._local.latestModel);
    };
    
    // Initialize selecteions
    var _preSelect = function(useDefault){
        var ds = this._local.itemDefs, 
        ms = this._local.itemModels, 
        useDs = false, set;
        
        if(Class.isArray(ds) && ds.length > 0){
            useDs = true;
            set = ds;
        }else if(Class.isArray(ms) && ms.length > 0){
            useDs = false;
            set = ms;
        }

        var len = set ? set.length : 0, 
        dnames = [], values = LList.$decorate([]), 
        tmp, m;
        for(var i = 0; i < len; i++){
            tmp = set[i];
            tmp = useDs ? tmp.model : tmp;
            if(tmp && (tmp.marked === true)){
                if(!this.multiEnable){
                    m = tmp;
                    values.push(m.value);
                    break;
                }
                
                dnames.push(tmp.dname);
                if(!values.contains(tmp.value)){
                    values.push(tmp.value);
                }
            }
        }
        
        if(this.multiEnable && (dnames.length > 0)){
            var dname = _joinTexts.call(this, dnames);
            m = {dname: dname, value: values};
        }
        
        // If combobox is in edit, quit the editing status.
        // Add by mingfa.pan, 04/11/2013
        _quitEdit.call(this);

        if(!Class.isObject(m) && useDefault === true){
            m = CLASS.DEFAULTMODEL;
            values = [];
        }
        
        if(Class.isObject(m)){
            _select.call(this, m);
            _setSelectedValues.call(this, values);
        }
    };
    
    var _preInit = function(def){
        var buf = new js.lang.StringBuffer();
        if(def && def.subview){
            this._local = this._local || {};
            this._local.subviewRoot = def.subview.root;
            delete def.subview.root;
        }

        def = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
        def.layout = def.layout 
            || {gap: 0, align_x: 0.0, align_y: 0.5};
        
        def.items = ["dItemContainer", "btnDropDown"];
        def.dItemContainer = System.objectCopy(dItemContainerDef, 
                                               {className: def.className + "_dItemContainer"}, true);
        def.btnDropDown = System.objectCopy(btnDropDownDef, 
                                            {className: def.className + "_dropdown"}, true);

        buf = undefined;
        return def;
    };
    
    thi$._init = function(def){
        if(typeof def !== "object") return;
        
        def = _preInit.call(this, def);
        arguments.callee.__super__.apply(this, arguments);
        
        // 0: Expect hide subview
        // 1: Expect popup subview
        this._local.expectedOp = 1;
        this._local.msgType = "js.swt.event.SelectedChanged";
        
        this.editable = (def.editable === true);
        this.multiEnable = (def.subview.multiEnable === true);
        this.setDisplayItemStyles(def.displayItemStyles);
        
        var ds = def.subview.itemDefs, 
        ms = def.subview.itemModels;
        if(Class.isArray(ds) && ds.length > 0){
            this._local.itemDefs = ds;
        }else if(Class.isArray(ms) && ms.length > 0){
            this._local.itemModels = ms;
        }
        
        _preSelect.call(this, true);
        
        if(def.initDDList === true){
            _createSubview.call(this, def);
        }
        
        if(this.isShowBtnByHover()){
            this.showBtnDropDown(false);
        }
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);
}.$extend(js.awt.HBox);

js.swt.ComboBox.DEFAULTMODEL = {dname: "", value: ""};
js.swt.ComboBox.DEFAULTDEF = function(){
    return {
        classType: "js.swt.ComboBox",
        className: "jsvm_comboBox",
        
        wholeTrigger: false,
        editable: false,
        effect: false,
        
        showTips: true,
        displayTip: undefined,
        
        initDDList: false,
        displayItemStyles: undefined,
        
        subview: {
            multiEnable: false,
            
            distinct: false,
            showItemTip: true,
            
            hauto: true,
            vauto: false,

            searchIfAllowed: false,     
            lazy: false,
            
            itemModels: [],
            itemDefs: []
        }
    };
};

