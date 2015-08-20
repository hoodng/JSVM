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

    CLASS.D = 0x01 << 0; // Disable/Enable
    CLASS.H = 0x01 << 1; // MouseOver/MouseOut
    CLASS.T = 0x01 << 2; // Trigger/Un-trigger
    CLASS.A = 0x01 << 3; // Actived/Deactived
    CLASS.V = 0x01 << 4; // Hidden/Visible
    CLASS.X = 0x01 << 5; // Maximized/Normal
    CLASS.I = 0x01 << 6; // Iconified/Normal
    
    var Class = js.lang.Class;
    
    thi$.isStateless = function(){
        return this.def.stateless || false;
    };
    
    thi$.getState = function() {
        return this.def.state;
    };

    thi$.setState = function(state) {
        if(!this.isStateless()) {
            this.def.state = state & 0x7F;
            if(Class.isFunction(this.onStateChanged)) {
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
    
    thi$.isHover = function(){
        return (this.getState() & CLASS.H) != 0;
    };

    thi$.setHover = function(b){
        var state = this.getState(), $ = CLASS.H;
        this.setState(b ? (state | $):(state & ~$));
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
        this.declareEvent(Event.SYS_EVT_STATECHANGED);
    }

    thi$._init0 = function(def){
        this.def = def || {};
    };
    
    this._init0.apply(this, arguments);
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

js.awt.Editable = function(){

    var CLASS = js.awt.Editable, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }

    var Class = js.lang.Class;
    
    thi$.getProperties = function(category){
        return {};
    };

    thi$.apply = function(category, properties){
        
    };

    /**
     * Return Editor def
     */
    thi$.getEditorDef = function(){
    };

    /**
     * 
     */
    thi$.enterEdit = function(data){
        var def = this.getEditorDef(), editor;
        if(!def) return;
        
        editor = new (Class.forName(def.classType))(def, this.Runtime());
        editor.initEdit(data, this);
        editor.show();
        
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
        
        styleClass = styleClass || DOM.combineClassName(this.className, "loading");
        _showCover.call(this, b, styleClass);
    };
    
    /**
     * Show cover for resizing with class name "jsvm_resizecover"
     */
    thi$.showResizeCover = function(b){
        b = b || false;
        if(b && this._coverView) return;

        var styleClass = DOM.combineClassName(this.className, "resizecover");
        _showCover.call(this, b, styleClass);
    };

    /**
     * Show cover for moving with class name "jsvm_movecover"
     */
    thi$.showMoveCover = function(b){
        b = b || false;
        if(b && this._coverView) return;

        var styleClass = DOM.combineClassName(this.className, "movecover");
        _showCover.call(this, b, styleClass);
    };

    thi$.showMaskCover = function(b, styleClass){
        b = b || false;
        if(b && this._coverView) return;

        styleClass = styleClass || DOM.combineClassName(this.className, "mask");
        _showCover.call(this, b, styleClass);
    };

    thi$.showDisableCover = function(b){
        b = b || false;
        if(b && this._coverView) return;

        var styleClass = DOM.combineClassName(this.className, "disable");
        _showCover.call(this, b, styleClass);
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
        var cover = this._coverView, body = self.document.body;

        if(b){
            if(cover == undefined){
                cover = this._coverView = DOM.createElement("DIV");
                cover.className = style;
                cover.style.cssText = "position:absolute;";             

                var el = (typeof this.getLastResizer == "function") ?
                    (this.getLastResizer() || this.view) :this.view;
                
                if(el !== body){
                    DOM.insertAfter(cover, el);
                }else{
                    body.appendChild(cover);
                }
            }

            this.adjustCover();
            
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
            this._coverView = undefined;
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

        var pview = DOM.offsetParent(moveObj.view), 
            cview = isAutoFit ? DOM.offsetParent(pview) : pview,
            pbounds = DOM.getBounds(pview),
            mover = this.def.mover, grid = mover.grid, bound=mover.bound;

        moveObj.cview = cview;
        if(moveObj.getMoveRange){
            var range = moveObj.getMoveRange();
            moveObj.minX = grid*ceil( (range[0]+bound)/grid);
            moveObj.minY = grid*ceil( (range[1]+bound)/grid);
            moveObj.maxX = grid*floor((range[2]-bound)/grid);
            moveObj.maxY = grid*floor((range[3]-bound)/grid);
        }else{
            var bounds = moveObj.getBounds(), maxX, maxY,
                mW = bounds.width, mH = bounds.height, 
                marginLf = bounds.MBP.marginLeft,
                marginTp = bounds.MBP.marginTop,
                bt = max(mover.bt*mH, bound),
                br = max(mover.br*mW, bound),
                bb = max(mover.bb*mH, bound),
                bl = max(mover.bl*mW, bound);

            moveObj.minX = grid*ceil((0 - marginLf - mW + bl)/grid);
            moveObj.minY = grid*ceil((0 - marginTp - mH + bt)/grid);
            
            maxX = (!isAutoFit || rigidW) ? 
                (!hscroll ? pbounds.width - pbounds.MBP.BW - marginLf - br:
                 max(pview.scrollWidth, pbounds.width) - marginLf - br) :
            max(cview.scrollWidth, cview.offsetWidth) - marginLf - br;
            moveObj.maxX = maxX;

            maxY = (!isAutoFit || rigidH) ?
                (!vscroll ? pbounds.height-pbounds.MBP.BH - marginTp - bb:
                 max(pview.scrollHeight, pbounds.height) - marginTp - bb) :
            max(cview.scrollHeight, cview.offsetHeight) - marginTp - bb;
            moveObj.maxY = maxY;
        }
        
        moveObj.showMoveCover(true);

        U.clickXY.x += (cview.scrollLeft- moveObj.getX());
        U.clickXY.y += (cview.scrollTop - moveObj.getY());
        
    };

    var _onmousedown = function(e){
        this.fireEvent(e);
        // Notify popup LayerManager 
        e.setEventTarget(this);
        MQ.post("js.awt.event.LayerEvent", e,
                [this.Runtime().getDesktop().uuid()]);

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
        var peer = this.getSizingPeer();
        return peer ? peer.getSizingMsgRecvs() : null;
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
                                       this.def.mover.threshold)){
            return e.cancelDefault();
        }

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
        maxW = grid*Math.floor(maxiW(i, box, pox, maxiSize.width)/grid - 1),
        maxH = grid*Math.floor(maxiH(i, box, pox, maxiSize.height)/grid - 1);

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

        var sizeObj = this.getSizeObject(),
            recvs = sizeObj.getSizingMsgRecvs() || [];
        
        this.showCover(false);
        if(sizeObj._sized){
            sizeObj.setSize(sizeObj.getWidth(), sizeObj.getHeight(), 0x0F);
            delete sizeObj._sized;
        }
        if(sizeObj._moved){
            sizeObj.setPosition(sizeObj.getX(), sizeObj.getY(), 0x0F);
            delete sizeObj._moved;
        }
        
        // Notify all message receivers
        recvs.unshift(sizeObj.getSizingPeer().uuid());
        e.setEventTarget(sizeObj);
        MQ.post(sizeObj.getSizingMsgType(), e, recvs);

        // Release SizeObject
        MQ.post("releaseSizeObject", "", [this.uuid()]);

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

        var target = e.getEventTarget(),
        x, y, w, h;

        if(e.isPointerUp()){
            x = target.getX(); y = target.getY();
            w = target.getWidth(); h = target.getHeight();

            if(x != this.getX() || y != this.getY()){
                this.setPosition(x, y, 0x0F);
            }

            if(w != this.getWidth() || h != this.getHeight()){
                this.setSize(w, h, 0x0F);
            }

            /**
             * After moving / resizing, if the sizing peer is itself,
             * the new position / size will be used directly. Here, 
             * we provide the simple way to do some right things.
             */
            if(Class.isFunction(this.onUDFResized)){
                this.onUDFResized(e);
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
        var sizeObj = this.sizeObj, bounds, tdef;
        if(!sizeObj){
            bounds = this.getBounds();
            tdef = {
                classType: "js.awt.Component",
                className: "jsvm_resize_cover " 
                    + DOM.combineClassName(this.className, "--resize-cover", ""),
                css: "position:absolute;",
                stateless: true,

                x : bounds.offsetX,
                y : bounds.offsetY,
                z : this.getZ(),
                width: bounds.width,
                height:bounds.height,

                prefSize : this.getPreferredSize(),
                miniSize : this.getMinimumSize(),
                maxiSize : this.getMaximumSize()
            };
            
            sizeObj = this.sizeObj = /*this;*/
            
            new js.awt.Component(tdef, this.Runtime());

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
	System = J$VM.System, MQ = J$VM.MQ,

	EvtFlagMap = {
		mousedown: CLASS.F_BODYMOUSEDOWN,
		click: CLASS.F_BODYCLICK,
		mousewheel: CLASS.F_BODYMOUSEWHEEL,
		DOMMouseScroll: CLASS.F_BODYMOUSEWHEEL,
		blur: CLASS.F_FOCUSBOXBLUR,
		timeout: CLASS.F_TIMEOUT
	};

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
	 * When the current floating layer appended, something may need be do at first.
	 */	   
	thi$.onLayerAppended = function(){
		// Subclass can implement it if need.  
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
	 *		  layer is lying.
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
			this.LM().onHide(e);
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
				this.focusItem	= null;
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
		var type = e.getType(), el, f, 
		b = true;

		switch (type) {
		case "mousedown":
		case "mousewheel":
		case "DOMMouseScroll":
			el = e.srcElement;
			if(el && this.view 
			   && DOM.contains(this.view, el, true)){
				b = false; 
			}else{
				f = EvtFlagMap[type];
			}
			break;
		case "click":
		case "blur":
		case "timeout":
			f = EvtFlagMap[type];
			break;
		case "hide":
			b = (this._local.LMFlag & CLASS.F_AUTO) == 0;
			break;
			// IFram which has J$VM will post message when catch mousedown
		case "message": 
		case "resize":
			b = true;
			break;
		}

		if(f){
			b = (f & this._local.LMFlag) !== 0;
		}

		return b;
	};
	
	thi$.isShown = function () {
		return this.LM().indexOf(this) !== -1;
	};
	
	/**
	 * @param x: {Number} x of the reference position.
	 * @param y: {Number} y of the reference position.
	 * @param v: {Boolean} Indicate whether the nofly area of current floating
	 *		  layer is vertical breakthrough.
	 * @param m: {Number} The specified thickness of nofly area.
	 */
	thi$.showAt = function (x, y, v, m) {
		this.LM().showAt(this, x, y, v, m);
	};

	/**
	 * @param by: {HTML DOM} The specified DOM element to specify the reference
	 *		  position and nofly area.
	 * @param v: {Boolean} Indicate whether the nofly area of current floating
	 *		  layer is vertical breakthrough.
	 * @param m: {Number} The specified thickness of nofly area.
	 */
	thi$.showBy = function (by, v, m) {
		this.LM().showBy(this, by, v, m);
	};
	
	thi$.hide = function (type) {
		this.setAutoHide(false);
		
		var arg = arguments ? arguments[1] : undefined,
		evt = new Event(type || "hide", arg, this);
		this.LM().onHide(evt);
	};

	thi$.hideOthers = function (type) {
		var arg = arguments ? arguments[1] : undefined,
		evt = new Event(type || "hide", arg, this);
		this.LM().clearStack(evt);
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
		var LM = this.LM();

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

		var LM = this.LM();
		if(LM.onHide.$clearTimer(this.lmtimer)){
			System.log.println("Delete timer: " + this.lmtimer);
			delete this.lmtimer;	
		}
	};

	thi$.LM = function(){
		return this.Runtime().getDesktop().LM;
	};
};

(function(){
	 var CLASS = js.awt.PopupLayer;
	 CLASS.F_BODYMOUSEDOWN = 0x01 << 0;
	 CLASS.F_BODYCLICK = 0x01 << 1;
	 CLASS.F_BODYMOUSEWHEEL = 0x01 << 2;
	 CLASS.F_FOCUSBOXBLUR = 0x01 << 3;
	 CLASS.F_TIMEOUT = 0x01 << 4;
	 CLASS.F_AUTO = 0x01 << 5;
 })();




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
 * File: ToolTip.js
 * Create: 2014/02/20 06:41:25
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * An interface for showing user-defined tooltips.
 * 
 * Attention:
 * 
 * If the user-defined tooltips will be shown for GraphicElement, its "Graphic2D" 
 * ancestor object must invoke the "checkAttachEvent" method to make the "mouseover",
 * "mouseout", "mousemove" can be fired and listened, as follow:
 *	   this.checkAttachEvent("mouseover", "mouseout", "mousemove");
 */
js.awt.ToolTip = function(){
	var CLASS = js.awt.ToolTip, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		return;
	}
	CLASS.__defined__ = true;
	
	CLASS.DEFAULTTOOLTIPID =  "__J$VMTOOLTIP__";
	
	var Class = js.lang.Class, Event = js.util.Event, 
	System = J$VM.System, MQ = J$VM.MQ;
	
	thi$.layerDef = function(def){
		var U = this._local, cdef = U.layerDef;
		if(Class.isObject(def)){
			cdef = U.layerDef = System.objectCopy(def, {}, true);			 
		}
		
		return cdef || {shadow: true};
	};
	
	/**
	 * Set the tip object for tip layer. The tip object is the real content
	 * component for showing user-defined tips. It can be any "Component", 
	 * "Container" instance object.
	 * 
	 * @param tipObj: {Component} A Component or Container instance object.
	 * @param gc: {Boolean} Indicate whether gc the old useless tipObj.
	 */
	thi$.setTipObj = function(tipObj, gc){
		var tipLayer = this.tipLayer, oTipObj;
		if(tipLayer){
			delete this._local.tipObj;
			oTipObj = tipLayer.setTipObj(tipObj, gc);
			
			if(gc === true && oTipObj && !oTipObj.destroied 
			   && Class.isFunction(oTipObj.destroy)){
				oTipObj.destroy();
			}
		}else{
			this._local.tipObj = tipObj;
		}
	};
	
	thi$.getTipObj = function(){
		var tipLayer = this.tipLayer, U = this._local,
		tipObj = tipLayer ? tipLayer.tipObj : null;
		return tipObj || U.tipObj;
	};
	
	var _createTipObjByDef = function(def){
		var classType = def ? def.classType : null,
		tipClz = Class.isString(classType) 
			? Class.forName(def.classType) : null,
		tipObj;	  
		if(!tipClz){
			return tipObj;
		}
		
		def.stateless = true;
		def.NUCG = true;
		def.className = def.className || "jsvm_tipObj";
		
		tipObj = new (tipClz)(def, this.Runtime());
		return tipObj;
	};
	
	/**
	 * Set the tip object by the specified definition. The real tip object
	 * will be created with the given definition.
	 * 
	 * @param def: {Object} Definition for the tip object.
	 */ 
	thi$.setTipObjByDef = function(def){
		var tipObj = _createTipObjByDef.call(this, def);
		this.setTipObj(tipObj, true);
		
		return tipObj;
	};

	/**
	 * Set the text for the label tip. If the label tip object is not
	 * existed, create it first.
	 * 
	 * @param labelText: {String} Text for the label tip.
	 * @param styles: {Object} Optional. Some extra styles for the label 
	 *		  tip to apply.
	 * @param extDef: {Object} Optional. Some extra definition.
	 */
	thi$.setTipLabel = function(labelText, styles, extDef){
		// Creat it when show
		this._local.tipLabelArgs 
			= Array.prototype.slice.call(arguments, 0);
	};
	
	/**
	 * Maybe, sometimes we need to adjust the tip contents accordint to the 
	 * runtime event position. Then we can use it.
	 */
	thi$.adjustTipObj = function(e){
		return false;  
	};
	
	var _initTipLabel = function(labelText, styles, extDef){
		var LabelClz = js.awt.Label, tipLabel = this.getTipObj(), tdef;
		if(!tipLabel || !(tipLabel instanceof LabelClz)){
			tdef = {
				id: "tipObj",
				classType: "js.awt.Label",
				className: "jsvm_tipObj",

				NUCG: true,
				stateless: true		   
			};
			
			if(extDef && Class.isObject(extDef)){
				System.objectCopy(extDef, tdef);
			}
			
			tdef.classType = "js.awt.Label";
			tipLabel = _createTipObjByDef.call(this, tdef);
			tipLabel.doLayout = function(){
				return;
			};
		}
		
		if(styles && Class.isObject(styles)){
			tipLabel.applyStyles(styles);
		}
		
		tipLabel.setText(labelText);
		
		return tipLabel;
	};
	
	var _initTipObj = function(){
		var U = this._local, tipObj = this.getTipObj(),
		args = U.tipLabelArgs;
		
		// Destroy cache
		//delete U.tipLabelArgs;
		
		if(Class.isArray(args) && args.length > 0){
			tipObj = _initTipLabel.apply(this, args);
		}
		
		return tipObj;
	};
	
	var _getTipLayer = function(){
		var M = this.def, tipLayer = this.tipLayer, 
		tipLayers, tipId, tdef;
		if(tipLayer){
			return tipLayer;
		}
		
		tipLayers = CLASS.TIPLAYERS;
		if(!tipLayers){
			tipLayers = CLASS.TIPLAYERS = {cnt: 0};
		}
		
		tipId = M.tipId;
		if(!tipId){
			tipId = M.tipId = this.hasOwnTip() 
				? this.uuid() + "_tip" : CLASS.DEFAULTTOOLTIPID;
		}
		
		tipLayer = tipLayers[tipId];
		if(tipLayer){
			tipLayer["__refCnt__"] += 1;
			return tipLayer;
		}
		
		tdef = this.layerDef();
		tdef.id = tipId;
		tipLayer = this.tipLayer 
			= new (Class.forName("js.awt.TipLayer"))(tdef, this.Runtime());
		tipLayer["__refCnt__"] = 1;
		
		tipLayers.cnt += 1;
		tipLayers[tipLayer.id] = tipLayer;
		return tipLayer;
	};

	
	thi$.showTipLayer = function(b, e){
		var U = this._local, tipLayer = this.tipLayer, tipObj, xy;
		if(b){
			if(!tipLayer){
				tipLayer = this.tipLayer = _getTipLayer.call(this);
			}

			tipObj = _initTipObj.call(this);
			if(tipObj){
				tipLayer.setTipObj(tipObj, true);
			}
			
			if(this.adjustTipObj(e) 
			   && tipLayer.isDOMElement()){
				tipLayer.doLayout(true); 
			}

			xy = e.eventXY();
			tipLayer.showAt(xy.x - 2, xy.y + 18, true);
		}else{
			if(tipLayer){
				tipLayer.hide(e);
			}
		}
	};
	
	var _onhover = function(e){
		if(e.getType() === "mouseover"){
			this.showTipLayer(true, e);
		}else{
			this.showTipLayer(false);
		}
	};
	
	var _onmousemv = function(e){
		var tipLayer = this.tipLayer, xy;
		if(tipLayer && tipLayer.isShown()){
			this.showTipLayer(true, e);
		}
	};
	
	thi$.gcTipLayer = function(){
		var M = this.def, tipLayer = this.tipLayer, 
		tipLayers = CLASS.TIPLAYERS, tipId, tipObj;
		
		delete this.tipLayer;
		if(!tipLayer){
			return;
		}
		
		tipId = M.tipId;
		tipLayer["__refCnt__"] -= 1;

		if(tipLayer["__refCnt__"] == 0){
			delete tipLayers[tipId];
			tipLayers.cnt -= 1;
			
			tipObj = tipLayer.removeTipObj();
			if(tipObj && !tipObj.destroied 
			   && Class.isFunction(tipObj.destroy)){
				tipObj.destroy();
			}
			
			
			tipLayer.destroy();
		}
		
		if(tipLayers.cnt == 0){
			delete CLASS.TIPLAYERS;
		}
	};
	
	/**
	 * Init the user-defined tip usage environment and prepare to listen
	 * the mouseover, mouseout and mousemove event.
	 * 
	 * Here, two branch logics are existed. For the GraphicElement, the 
	 * user event will be attached with the flag 4. And for Component, 
	 * the DOM event will be attached with the flag 0.
	 */
	thi$.setTipUserDefined = function(b){
		b = (b === true);
		
		this.def = this.def || {};
		this._local = this._local || {};
		
		var M = this.def, U = this._local, flag = this.view ? 0 : 4, 
		tip, tipLayer;

		M.useUserDefinedTip = b;
		if(b){
			tip = U.nativeTip = M.tip;
			if(Class.isString(tip) && tip.length > 0
			   && Class.isFunction(this.delToolTipText)){
				this.delToolTipText();				  
			}
			
			if(U.attachedFlag !== flag){
				if(!isNaN(U.attachedFlag)){
					this.detachEvent("mouseover", U.attachedFlag, this, _onhover);
					this.detachEvent("mouseout", U.attachedFlag, this, _onhover);				  
					this.detachEvent("mousemove", U.attachedFlag, this, _onmousemv);
				}
				
				this.attachEvent("mouseover", flag, this, _onhover);
				this.attachEvent("mouseout", flag, this, _onhover);
				this.attachEvent("mousemove", flag, this, _onmousemv);
				
				U.attachedFlag = flag;
			}
		}else{
			delete U.layerDef;
			delete U.tipLabelArgs;
			
			tipLayer = this.tipLayer;
			if(tipLayer){
				tipLayer.hide();
				this.gcTipLayer();
			}

			tip = U.nativeTip;
			if(Class.isString(tip) && tip.length > 0 
			   && Class.isFunction(this.setToolTipText)){
				this.setToolTipText(tip);
			}
			
			if(!isNaN(U.attachedFlag)){
				this.detachEvent("mouseover", U.attachedFlag, this, _onhover);
				this.detachEvent("mouseout", U.attachedFlag, this, _onhover);				  
				this.detachEvent("mousemove", U.attachedFlag, this, _onmousemv);

				delete U.attachedEventFlag;
			}
		}
	};
	
	thi$.isTipUserDefined = function(){
		return this.def.useUserDefinedTip;
	};
	
	thi$.hasOwnTip = function(){
		return this.def.hasOwnTip === true;
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

    thi$.getLayoutComponents = function(container){
        var ret = [];

        _filter.$forEach(
            this, container.getLayoutComponents(), container, ret);
        return ret;
    };

    var _filter = function(container, array, id){
        var comp = container.getComponent(id);
        if(comp && comp.isVisible()){
            array.push(comp);
        }
    };

    thi$.layoutContainer = function(container, force){
        _doLayout.$forEach(
            this, this.getLayoutComponents(container), force);
    };

    var _doLayout = function(force, comp){
        comp.doLayout(force);
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
        var bounds = container.getBounds(),
            ret ={width:0, height:0};

        _calcSize.$forEach(
            this, this.getLayoutComponents(container), fn, nocache, ret);

        ret.width += bounds.MBP.BW;
        ret.height+= bounds.MBP.BH;
        
        return ret;
    };

    var _calcSize = function(fn, nocache, max, comp){
        var d = comp[fn](nocache);
        max.width = Math.max(max.width, (comp.getX() + d.width));
        max.height= Math.max(max.height,(comp.getY() + d.height));
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
        this.def = null;
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
 * }
 */
js.awt.AbsoluteLayout = function (def){

    var CLASS = js.awt.AbsoluteLayout, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event,  DOM = J$VM.DOM;

    thi$._init = function(def){
        this.def = def || {};

        this.def.classType =  
            this.def.classType || "js.awt.AbsoluteLayout";

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
    
    thi$.layoutContainer = function(container, force){
        var items = this.getLayoutComponents(container), comps = {}, comp;
        for(var i=0, len=items.length; i<len; i++){
            comp = items[i];
            comps[comp.def.constraints] = comp;
        }
        
        switch(this.def.mode){
        case 0:
            _mode0Layout.call(this, container, comps, force);
            break;
        case 1:
            _mode1Layout.call(this, container, comps, force);
            break;
        default:
            throw "Unsupport layout mode "+this.def.mode;
            break;
        }
    }.$override(this.layoutContainer);

    var _mode0Layout = function(container, comps, force){
        var setting = this.def, bounds = container.getBounds(),
        vgap = setting.vgap || 0, hgap = setting.hgap || 0,
        xbase = bounds.MBP.paddingLeft, left = 0,
        ybase = bounds.MBP.paddingTop,  top = 0, 
        right = bounds.innerWidth, bottom= bounds.innerHeight,
        d, comp;
        
        if((comp = comps["north"])){
            comp.setWidth(bounds.innerWidth, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            top += d.height + vgap;
        }

        if((comp = comps["south"])){
            comp.setWidth(bounds.innerWidth, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase + bounds.innerHeight - d.height, 3);
            bottom -= d.height + vgap;
        }

        if((comp = comps["east"])){
            comp.setHeight(bottom - top, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+right - d.width, ybase+top, 3);
            right -= d.width + hgap;
        }

        if((comp = comps["west"])){
            comp.setHeight(bottom - top, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            left += d.width + hgap;
        }

        if((comp = comps["center"])){
            var fire = force === true ? 0x0F : 0x07;
            comp.setSize(right-left, bottom-top, fire);
            comp.setPosition(xbase+left, ybase+top, fire);
        }
    };

    var _mode1Layout = function(container, comps, force){
        var setting = this.def, bounds = container.getBounds(),
        vgap = setting.vgap || 0, hgap = setting.hgap || 0,
        xbase = bounds.MBP.paddingLeft, left = 0,
        ybase = bounds.MBP.paddingTop,  top = 0, 
        right = bounds.innerWidth, bottom= bounds.innerHeight,
        d, comp;
        
        if((comp = comps["west"])){
            comp.setHeight(bounds.innerHeight, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            left += d.width + hgap;
        }

        if((comp = comps["east"])){
            comp.setHeight(bounds.innerHeight, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+bounds.innerWidth - d.width, ybase+top, 3);
            right -= d.width + hgap;
        }

        if((comp = comps["south"])){
            comp.setWidth(right - left, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+bounds.innerHeight-d.height, 3);
            bottom -= d.height + vgap;
        }

        if((comp = comps["north"])){
            comp.setWidth(right - left, 3);
            d = comp.getBounds();
            comp.setPosition(xbase+left, ybase+top, 3);
            top += d.height + vgap;
        }

        if((comp = comps["center"])){
            var fire = force === true ? 0x0F : 0x07;
            comp.setSize(right-left, bottom-top, fire);
            comp.setPosition(xbase+left, ybase+top, fire);
        }
    };
    
    thi$._init = function(def){
        def = def || {};
        
        def.classType = "js.awt.BorderLayout";
        def.mode = def.mode || 0;
        def.hgap = def.hgap || 0;
        def.vgap = def.vgap || 0;

        arguments.callee.__super__.apply(this, arguments);        

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.AbsoluteLayout);

(function(){
    var CLASS = js.awt.BorderLayout;
    
    CLASS.NORTH = "north";
    CLASS.SOUTH = "south";
    CLASS.EAST  = "east";
    CLASS.WEST  = "west";
    CLASS.CENTER= "center";
    
})();


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
 *     axis: 0(horizontally)|1(vertically), 
 *     gap: 0 
 * } 
 */
js.awt.BoxLayout = function (def){

    var CLASS = js.awt.BoxLayout, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class;

    thi$.layoutContainer = function(container){

        var setting = this.def, bounds = container.getBounds(),
        gap = setting.gap || 0, axis = setting.axis || 0,
        space = (axis == 0) ? bounds.innerWidth : bounds.innerHeight,
        xbase = bounds.MBP.paddingLeft, left = 0,
        ybase = bounds.MBP.paddingTop,  top = 0,
        comps = this.getLayoutComponents(container), comp,
        rects = [], d, r, c = 0;

        for(var i=0, len=comps.length; i<len; i++){
            comp = comps[i];

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

    };
    
    thi$._init = function(def){
        def = def || {};

        def.classType = "js.awt.BoxLayout";
        def.axis = def.axis || 0;
        def.gap  = def.gap || 0;

        arguments.callee.__super__.apply(this, arguments);        

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.AbsoluteLayout);


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

    };

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
        if(!Class.isNumber(index)) return null;

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

        return item;
    };
	
	/**
	 * Return the index of current shown component.
	 */
	thi$.getShownIndex = function(){
		return this.def.status.index;
	};
	
	/**
	 * Return the current shown component.
	 */
	thi$.getShownComp = function(container){
		var items = container.items0(),
		index = this.def.status.index,
		compid = items[index];
		
		return container.getComponent(compid);
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

}.$extend(js.awt.AbsoluteLayout);


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
        left = xbase + (rigid ?
                        (bounds.innerWidth - d.width) * this.getLayoutAlignmentX():0);

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
        top = ybase + (rigid ?
                       (bounds.innerHeight - d.height) * this.getLayoutAlignmentY():0);

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

}.$extend(js.awt.AbsoluteLayout);




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

    };

    thi$._init = function(def){
        def = def || {};

        def.classType = "js.awt.GridLayout";
        arguments.callee.__super__.apply(this, arguments);
        
        this.grid = new (Class.forName("js.awt.Grid"))(def);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.AbsoluteLayout);


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

$import("js.awt.State");
$import("js.awt.ToolTip");
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

                absX : abs.X,
                absY : abs.Y
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
        var M = this.def;

        M.x = Class.isNumber(x) ? x : this.getX();
        M.y = Class.isNumber(y) ? y : this.getY();
        M.width = Class.isNumber(w) ? w : this.getWidth();
        M.height= Class.isNumber(h) ? h : this.getHeight();
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
                this.isRigidWidth() ? d.width : d.MBP.BPW, 
                this.isRigidHeight()? d.height: d.MBP.BPH);
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
            this.setMaximumSize(Number.MAX_VALUE, Number.MAX_VALUE);
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

    thi$.doLayout = function(){

    };

    thi$.destroy = function(){
        if(this.destroied != true){
            delete this.peer;
            delete this.container;
            
            if(this.isTipUserDefined()){
                this.setTipUserDefined(false);
            }
            
            arguments.callee.__super__.apply(this, arguments);
        }
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
        
        if(def.prefSize){
            this.isPreferredSizeSet = true;
        }
        
        if(def.miniSize){
            this.isMinimumSizeSet = true;
        }
        
        if(def.maxiSize){
            this.isMaximumSizeSet = true;
        }        
        
        if(def.useUserDefinedTip === true){
            this.setTipUserDefined(true);
        }
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.util.EventTarget).$implements(js.awt.State, js.awt.ToolTip);

js.awt.Element.count = 0;


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
        
        // If the preferred size is not from the definition, it will be calcualted
        // with bounds. And when the bounds is invalidating, the old calculated 
        // preferred size should be invalidated, too.
        if(!this.isPreferredSizeSet){
            this.def.prefSize = null;
        }
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
            return sp.match(/[wW]idth|margin|border|padding/) != undefined;
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
     * @method
     * 
     * Override to use the tooltip of current component also as the tooltip
     * of its disable cover.
     * 
     * Ref: http://redmine.jinfonet.com.cn/issues/59362
     */
    thi$.showDisableCover = function(b){

        arguments.callee.__super__.apply(this, arguments);        

        var cover = this._coverView, tip = this.getAttribute("title");
        if(cover && tip){
            DOM.setAttribute(cover, "title", tip);
        }

    }.$override(this.showDisableCover);

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
        if(!this.needLayout(force) || !this.isDOMElement() 
            || (this.getStyle("display") === "none")) {
                return false;
        }

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
        var G = this.getGeometric(this.className);
        return System.objectCopy(MBP, {});
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
        
        var tclazz = def.className;
        if(tclazz){
            tclazz = DOM.extractDOMClassName(tclazz);
        }

        if(view){
            this.view = view;
            def.className = view.clazz || def.className;
        }else{
            this.view = view = DOM.createElement(def.viewType || "DIV");
            def.className = def.className || "jsvm__element";
            view.clazz = view.className = view.className 
                + (tclazz ? (" " + tclazz) : "");
        }
        
        view = this.view;
        view.uuid = this.uuid();
        if(view.tagName != "BODY"){
            view.id = def.id 
                || (this.classType() + "." + js.awt.Element.count);            
        }


        this.className = tclazz;
        if(def.css) view.style.cssText = view.style.cssText + def.css;
        if(view.tagName != "BODY" && view.tagName != "CANVAS"
           && view.cloned != "true"){
            _preparegeom.call(this);    
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
 *     classType : class type of this component
 *     id : string to identify a component
 *     
 * 
 *     x : position left,
 *     y : position top,
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
 *     className : style class
 *     css: css text
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
 * }<p>
 * 
 * The <em>Runtime</em> is runtime context, it may includes:
 * @param Runtime :{
 *     imgPath : The image path,
 *     ...
 * }<p>
 * 
 * When new a <em>component</em> will create a DIV element as the <em>View</em>
 * of this component. But you also can use an existing view to instead of the
 * view.
 * @param view,  a document element  
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
     *   hscroll: true/false, 
     *   vscroll: true/false
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
            this.view.className = DOM.stateClassName(
                this.def.className || this.className, this.getState());
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

        if(!this.isStateless()){
            def.state = def.state || 0;
            
            if(this.isStyleByState()){
                view.className = DOM.stateClassName(def.className, this.getState());
            }
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

/**
 * 
 */
js.awt.Containable = function(){

    var CLASS = js.awt.Containable, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, 
        DOM = J$VM.DOM, System = J$VM.System, MQ = J$VM.MQ,
        List= js.util.LinkedList;

    var _check = function(){
        var M = this.def, U = this._local;
        
        M.items = M.items || [];
        if(!M.items.remove0){
            List.$decorate(M.items);
        }

        U.items = U.items || [];
        if(!U.items.remove0){
            List.$decorate(U.items);
        }
    };

    thi$.appendChild = function(ele){
        _check.call(this);

        var M = this.def, U = this._local,
            id = ele.id, 
            index = M.items.length, 
            index0 = U.items.length;

        return this._insert(M, U, index, index0, id, ele, null);

    };

    thi$.insertChildBefore = function(ele, ref){
        _check.call(this);
        
        var M = this.def, U = this._local,
            id = ele.id, rid = this.getID(ref),
            index = M.items.indexOf(rid),
            index0= U.items.indexOf(rid);

        ref = this[rid];

        index = index > 0 ? index  : 0;
        index0= index0> 0 ? index0 : 0;

        return this._insert(M, U, index, index0, id, ele, ref);

    };

    thi$.insertChildAfter = function(ele, ref){
        _check.call(this);
        
        var M = this.def, U = this._local,
            id = ele.id, rid = this.getID(ref),
            index = M.items.indexOf(rid),
            index0= U.items.indexOf(rid);

        ref = this[M.items[index + 1]]; // ref = this[rid];
        if(ref && ref.isAlwaysOnTop() && index === M.items.length-1){
            throw "Reference child ["+rid+"] is always on top";
        }
        
        index = index > 0 ? (index + 1) : M.items.length;
        index0= index0> 0 ? (index0+ 1) : U.items.length;

        return this._insert(M, U, index, index0, id, ele, ref);

    };

    thi$._insert = function(M, U, index, index0, id, ele, ref){
        M.items.add(index, id);
        M[id] = ele.def;
        
        U.items.add(index0, id);
        this[id] = ele;

        ele.setContainer(this);
        
        // @link js.lang.Object#setContextID
        var eleDef = ele.def;
        if(!eleDef["__contextid__"]){
            ele.setContextID(this.uuid());
        }

        if(Class.isHtmlElement(ele.view)){
            if(ref && ref.view){
                ele.insertBefore(ref.view, this.view);
            }else{
                ele.appendTo(this.view);
            }
        }

        return ele;
    };

    thi$.removeChild = function(ele){
        _check.call(this);
        
        var M = this.def, U = this._local,
            id = this.getID(ele); 
        
        ele = this[id];
        if(ele === undefined) return undefined;

        M.items.remove(id);
        delete M[id];

        U.items.remove(id);
        delete this[id];

        delete ele.container;

        if(Class.isHtmlElement(ele.view)){
            ele.removeFrom(this.view);
        }
        
        return ele;
    };

    thi$.getElementById = function(id){
        return this[id];
    };

    /**
     * Replace id of the element with the new one.
     * 
     * @param {String} id The id of the element to handle.
     * @param {String} newid
     */     
    thi$.replaceElementId = function(id, newid){
        _check.call(this);

        var ele = this[id];
        delete this[id];

        this[newid] = ele;
        if(ele){
            if(ele.id){
                ele.id = newid;
            }

            if(ele.view){
                ele.view.id = newid;
            }
        }

        this.def.items.replace(id, newid);
        this._local.items.replace(id, newid);
    };

    thi$.getElements = function(filter){
        filter = filter || function(ele){
            return true;
        };

        var ret = [], items = this.items0(), ele;
        for(var i=0, len=items.length; i<len; i++){
            ele = this[items[i]];
            if(filter(ele)){
                ret.push(ele);
            }
        }
        return ret;
    };

    thi$.getElementsCount = function(){
        return this.def.items.length;
    };

    /**
     * Gets the component id list in current order
     */
    thi$.items = function(){
        return this.def.items || [];
    };

    /**
     * Gets the component id list in original order
     */
    thi$.items0 = function(){
        return this._local.items || [];
    };

    thi$.indexOf = function(ele){
        var id = this.getID(ele);
        return this.items().indexOf(id);
    };

    /**
     * Remove all elements in this container
     * 
     * @param gc, whether do gc
     */
    thi$.removeAll = function(gc){
        _check.call(this);

        var M = this.def, U = this._local,
            items = this.items0(), id, ele;
        
        while(items.length > 0){
            id = items[0];
            ele = this[id];
            
            if(ele){
                this.removeChild(ele);
                if(gc == true){
                    ele.destroy();
                }
            }
            
            // TODO:
            // For Component, in its destroy method, it can be removed from
            // its container. Meanwhile, clean the cached id. 
            // But for GraphicContainer, it doesn't do that. So we do following
            // thing to keep it work right.
            items.remove(id);
            delete this[id];
        }

        M.items.clear();
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
     * @constraints: {Object | String} The layout constraints of the inserting component
     */
    thi$.insertComponent = function(index, comp, constraints){
        var items = this.items0(), ref;

        if(constraints){
            comp.def.constraints = constraints;            
        }

        if(!isNaN(index) && index >= 0 && index < items.length){
            ref = this.getElementById(items[index]);
        }

        if(this.layout instanceof js.awt.AbsoluteLayout){
            comp.view.style.position = "absolute";
        }
      
        if(ref){
            this.insertChildBefore(comp, ref);
        }else{
            this.appendChild(comp);
        }

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
            return undefined;
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

        if(comp === undefined){
             return undefined;
        }

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
        
        return id;

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
     * Return all need layout components id
     */
    thi$.getLayoutComponents = function(){
        return this.items0();
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
     *  @see js.awt.BaseComponent
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
            if(this.isCovering()){
                this.adjustCover(this.getBounds());
            }
            return true;
        }

        return false;
    }.$override(this.doLayout);
    
    /**
     * def:{
     *     items:[compid],
     *     compid:{}
     * }
     */
    thi$._addComps = function(def){
        var comps = def.items, R = this.Runtime(),
            oriComps = this._local.items,
            absLayout = this.layout instanceof js.awt.AbsoluteLayout;
        
        def.items = [];
        List.$decorate(def.items);

        for(var i=0, len=comps.length; i<len; i++){
            var compid = comps[i], compDef = def[compid];
            if(Class.isObject(compDef)){
                compDef.id = compDef.id || compid;
                compDef.className = compDef.className ||
                    DOM.combineClassName(this.def.className, compid);

                var comp = new (Class.forName(compDef.classType))(
                    compDef, R);
                
                if(absLayout){
                    comp.view.style.position = "absolute";
                }

                this.appendChild(comp);
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
        
        var layout = def.layout = (def.layout || {});
        layout.classType = layout.classType || "js.awt.LayoutManager";
        this.setLayoutManager(
            new (Class.forName(layout.classType))(layout));
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
	
	thi$.setLegendText = function(legendText){
		this.legend.innerHTML = String.encodeHtml(legendText);
	};
	
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
		def.classType = def.classType || "js.awt.FieldSet";
		def.className = def.className || "jsvm_fieldset";
		def.stateless = (def.stateless !== false);
		def.viewType = "FIELDSET";
		arguments.callee.__super__.apply(this, arguments);
		
		var legend = this.legend = DOM.createElement("LEGEND");
		legend.className = this.className + "_legend";
		
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
        if(this.isDOMElement() 
            && arguments.callee.__super__.apply(this, arguments)){
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
        eType, evt;

        if(item){
            eType = e.getType();

            if(eType == "click"){
                e.setEventTarget(item);
                
                evt = new Event(el === item.ctrl 
                    ? "ctrlclick" : "itemclick", "", item);
                this.notifyPeer("js.awt.event.ItemEvent", evt);
                
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
 *	   className: xxx
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

	CLASS.EVT_TABACTIVATED = "TabActivatedEvent";
	CLASS.EVT_TABDISABLED = "TabDisabledEvent";

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ;

	thi$.msgType = function(msgType){
		var U = this._local;
		if(Class.isString(msgType) && msgType.length > 0){
			U.msgType = msgType;
		}

		return U.msgType || "js.awt.event.TabActivatedEvent";
	};


	/**
	 * Add a panel to TabPane with speciifed tab definition.
	 * 
	 * @param tabDef:{
	 *	   className: 
	 *	   id: 
	 *	   
	 *	   labelText: 
	 *	   ...
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

		tabs.removeComponent(tabs[tabId]);
		panes.removeComponent(panes[panId]);
	};
	
	/**
	 * Switch to tab with specified tab id
	 * 
	 * @param tabId
	 */
	thi$.activateTab = function(tabId){
		var items = this.tabs.items0(), id, tabs = this.tabs, 
		panes = this.panes, evt;

		for(var i=0, len=items.length; i<len; i++){
			id = items[i];
			if(id == tabId){
				tabs[id].setTriggered(true);	
				panes.layout.show(this.panes, i);
			}else{
				tabs[id].setTriggered(false);
			}
		}

		this.activateId = tabId;

		evt = new Event(CLASS.EVT_TABACTIVATED, {activateId: tabId}, this);
		this.notifyPeer(this.msgType(), evt);
	};
	
	thi$.getActivateTabId = function(){
		return this.activateId;
	};

	/**
	 * Judge whether all the tabs is disabled.
	 */
	thi$.isAllTabDisabled = function(){
		var tabs = this.tabs, items = tabs.items0(),
		tab, b = true;

		for(var i = 0, len = items.length; i < len; i++){
			tab = tabs[items[i]];
			if(tab && tab.isEnabled()){
				b = false;
				break;
			}
		}

		return b;
	};
	
	/**
	 * Disable the specified tab
	 */
	thi$.disableTab = function(tabId, disable){
		var tab = this.tabs[tabId], panes = this.panes, 
		enable, b, data, evt;

		// Disable the specified tab
		enable = (disable !== true);
		if(tab.isEnabled() !== enable){
			tab.setEnabled(enable);
		}

		// If the specified tab is activated, to de-activate it.
		// And then re-activate the first enabled one.
		if(tabId === this.activateId){
			tab.setTriggered(false);

			this.activateFirstTab();
		}

		// If all tabs are disabled, to disable the panes.
		b = this.isAllTabDisabled();
		if(panes.isEnabled() === b){
			panes.setEnabled(b);
			panes.showDisableCover(b);
		}

		// Notify the changed
		data = {
			tabId: tabId,
			isAllTabDisabled: b	 
		};
		evt = new Event(CLASS.EVT_TABDISABLED, data, this);
		this.notifyPeer(this.msgType(), evt);
	};
	
	/**
	 * Return all tabs.
	 */
	thi$.getAllTabs = function(){
		return this.tabs.getAllComponents();
	};
	
	/**
	 * Return all panels 
	 */
	thi$.getAllPanels = function(){
		return this.panes.getAllComponents();
	};
	
	/**
	 * Activate the first enabled tab.
	 */
	thi$.activateFirstTab = function(){
		var tabs = this.tabs, items = tabs.items0(),
		id, tab, rst, b = true;

		for(var i = 0, len = items.length; i < len; i++){
			id = items[i];
			tab = tabs[id];

			if(tab && tab.isEnabled()){
				this.activateTab(id);
				break;
			}

			tab = null;
		}

		return tab;
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
	
	/**
	 * Return the tab with the specified panel ID.
	 * 
	 * @param panId
	 */
	thi$.getTabByPanel = function(panId){
		var index = this.indexOfPanel(panId),
		tabId = this.tabs.items0()[index];

		return this.tabs[tabId];
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
	
	thi$.indexOfPanel = function(panId){
		var items = this.panes.items0(), id;
		for(var i = 0, len = items.length; i < len; i++){
			id = items[i];
			if(id == panId){
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
 * File: SearchKit.js
 * Create: 2011-09-30
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

/**
 * <em>SearchKit</em> is an utility class for text searching.
 */

js.swt.SearchKit = function(){
};

/**
 * An useful method to help us build the regular expression with the
 * given <em>keyword</em> and match <em>options</em>.
 */
js.swt.SearchKit.buildRegExp = function(keyword, options){
    if(!keyword || keyword.length == 0)
        return null;
    
    // Escape regular expression's meta-characters.
    //J$VM.System.out.println("Before escaping: " + keyword);
    keyword = (js.lang.Class.forName("js.lang.String")).escapeRegExp(keyword);
    //J$VM.System.out.println("After escaping: " + keyword);

    // var unescaped = (js.lang.Class.forName("js.lang.String")).unescapeRegExp(keyword);
    // J$VM.System.out.println("Unescaped: " + unescaped);
    
    if(typeof options !== "object"){
        options = {
            global: true,
            casesensitive: true,
            matchword: false,
            wholeword: false
        };
    }
    
    //"wholeword" and "matchword" search options need wait for <Enter> key is pressed
    if(options["wholeword"] === true){
        keyword = "\^" + keyword + "\$";
    }else{
        if(options["matchword"] === true){
            keyword = "\\b" + keyword + "\\b";
        }
    }
    
    //global search option
    var reopts = "";
    if(options["global"] !== false){
        reopts += "g";
    }
    
    //case insensitive option
    if(options["insensitive"] !== false){
        reopts += "i";
    }
    
    var regExp = new RegExp(keyword, reopts);
    return regExp;
};

/**
 * Search and return all text matches in a text collection by the
 * given <em>pattern</em>.
 *
 * @param textSet: a string collection.
 * @param pattern: a <em>RegExp</em> object. If it is not a valid RegExp
 *                 object, an error will be thrown.
 *  
 * @return an object: {
 *     pattern: a <em>RegExp</em> object which is the current matched 
 *              regular expression,
 *     matches: a <em>js.util.HashMap</em> object. In it, the key is 
 *              the <em>index</em> of a text with matched string in the 
 *              <em>textSet</em>. Each <em>value</em> is an array of all 
 *              matches' start index and length in the text indicated by 
 *              the <em>key</em>. 
 *    }
 *    
 *    Its structure is as follow:
 *    {
 *        pattern: {RegExp},
 *        matches: {
 *           0 : [{start: x, lenght: x}, ..., {start: x, length: x}],
 *           ......
 *           n : [{start: x, length: x}, ..., {start: x, length: x}] 
 *        }
 *    }
 */
js.swt.SearchKit.search = function(textSet, keyword, options){
    var SKit = js.swt.SearchKit,
    pattern = SKit.buildRegExp(keyword, options);
    
    return SKit.searchByPattern(textSet, pattern);
};

/**
 * Search and return all text matches in a text collection by the
 * given <em>pattern</em>.
 *
 * @param textSet: a string collection.
 * @param pattern: a <em>RegExp</em> object. If it is not a valid RegExp
 *                 object, an error will be thrown.
 *  
 * @return an object: {
 *     pattern: a <em>RegExp</em> object which is the current matched 
 *              regular expression,
 *     matches: a <em>js.util.HashMap</em> object. In it, the key is 
 *              the <em>index</em> of a text with matched string in the 
 *              <em>textSet</em>. Each <em>value</em> is an array of all 
 *              matches' start index and length in the text indicated by 
 *              the <em>key</em>. 
 *    }
 *    
 *    Its structure is as follow:
 *    {
 *        pattern: {RegExp},
 *        matches: {
 *           0 : [{start: x, lenght: x}, ..., {start: x, length: x}],
 *           ......
 *           n : [{start: x, length: x}, ..., {start: x, length: x}] 
 *        }
 *    }
 */
js.swt.SearchKit.searchByPattern = function(textSet, pattern){
    var SKit = js.swt.SearchKit,
    len = textSet ? textSet.length : 0,
    matches, text, textMatches;
    
    if(len == 0)
        return null;
    
    matches = new js.util.HashMap();
    for(var i = 0; i < len; i++){
        text = textSet[i];
        textMatches = SKit.searchInTextByPattern(text, pattern);
        
        if(textMatches && textMatches.length > 0){
            matches.put(i, textMatches);
        }
    }
    
    return {pattern: pattern, matches: matches};
};

/**
 * Search all matches and return each match's index and length in 
 * <em>text</em> with the given searching <em>options</em>.
 *
 * The searching <em>options</em> as below:<p>
 * @param options: "global|ignore|wholeword". Detains as below: <br>
 *          <em>global</em>: match all <br>
 *          <em>ignore</em>: case insensitive <br>
 *          <em>wholeword</em>: match the whole word, need wait for 
 *                              <Enter> key is pressed <p>
 * 
 * @return <em>Array</em>, each element in it is a object maintained 
 *         each match's start index and its length. Its structure is as fo
 *         -llow:
 *         [
 *          {start: m, length: x},
 *          ...
 *          {start: n, length: x}     
 *         ]
 */ 
js.swt.SearchKit.searchInText = function(text, keyword, options){
    var SKit = js.swt.SearchKit,
    pattern = SKit.buildRegExp(keyword, options);
    
    return SKit.searchInTextByPattern(text, pattern);
};


/**
 * Return all matchces' index and its length of <em>text</em> with the 
 * given <em>pattern</em>.
 * 
 * @param text: a text string.
 * @param pattern: a <em>RegExp</em> object. If it is not a valid RegExp
 *                 object, an error will be thrown.
 * @return <em>Array</em>, each element in it is a object maintained each 
 *         match's start index and its length. Its structure is as follow:
 *         [
 *          {start: m, length: x},
 *          ...
 *          {start: n, length: x}     
 *         ]
 */
js.swt.SearchKit.searchInTextByPattern = function(text, pattern){
    if(!text || (text.length == 0) || !pattern)
        return null;
    
    if(!(pattern instanceof RegExp)){
        throw new Error("The pattern is not a valid RegExp.");    
    }
    
    /*
     * Comment by mingfa.pan to void an issue as follow:
     * In IE/FF/Chrome and so on, if I have following items: 
     *      "item1", "item2", "item3", "item4", "item5", "item6" 
     * And a pattern line (/i/ig) or (/e/ig) for all items.
     * Then when we use the test() method to test each item above,
     * "item2", "item4", "item6" will make a "false" be returned.
     * 
     * P.S. at 2011-10-24 14:00
     * For this issue, we need to reset the pattern's lastIndex 
     * property to 0. Because this property returns an integer that 
     * specifies the character position immediately after the last 
     * match found by exec( ) or test( ) methods.
     * 
     * If someone found in the last match, the lastIndex will be set
     * to an integer value. It may affect the following match. However,
     * exec( ) and test( ) will reset lastIndex to 0 if they do not get
     * a match.
     */
    // var isMatched = pattern.test(text);
    // if(isMatched){
    var matches = [];
    text.replace(pattern, function(m, i){
                     matches.push({start: i, length: m.length});
                 });
    
    return matches;
    // } else {
    // return null;
    // }
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
 * File: Highlighter.js
 * Create: 2014/01/20 08:07:00
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * An utility to help the component that with the label in to highlight
 * its text contents.
 */
js.awt.Highlighter = function(){
	var CLASS = js.awt.Highlighter,
	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, String = js.lang.String,
	Math = js.lang.Math, StringBuffer = js.lang.StringBuffer,
	System = J$VM.System,
	
	SKit = Class.forName("js.swt.SearchKit");
	
	thi$.setKeepNative = function(b){
		this.def.keepNative = (b === true);	 
	};
	
	thi$.isKeepNative = function(){
		return (this.def.keepNative === true);	
	};

	thi$.getContent = function(){
		if(!this.label){
			return null;
		}
		
		if(typeof this.getText === "function"){
			return this.getText();
		}
		
		return "";
	};
	
	/*
	 * If <em>label</em> is created, use the given text as its
	 * display text.
	 */
	var _setText = function(text, encode) {
		if(this.label){
			this.label.innerHTML = (encode === false) 
				? text : String.encodeHtml(text);
		}
	};
	
	/**
	 * @param keyword: {String} The keyword of the <em>RegExp</em> object which is 
	 *		  used to matched.
	 * @param options: {Object} Include global, insensitive and whole word setting.
	 * @param highlightClass: {String} The specified style 
	 *		  className for highlight.
	 * 
	 * @return {Array} All highlighted span elements.
	 */
	thi$.highlight = function (keyword, options, highlightClass) {
		if (!this.label || !keyword || !options){
			return null;
		}
		
		var pattern = SKit.buildRegExp(keyword, options);
		return this.highlightByPattern(pattern, highlightClass);
	};
	
	var _getHighlightElements = function(ids){
		var len = Class.isArray(ids) ? ids.length : 0,
		pele = this.view, uuid = this.uuid(), 
		doms = [], id, ele;
		
		for(var i = 0; i < len; i++){
			id = ids[i];
			
			if(pele.querySelector){
				ele = pele.querySelector("#" + id);
			}else{
				ele = document.getElementById(id);
			}
			
			if(ele){
				ele.uuid = uuid;
				doms.push(ele);
			}
		}
		
		return doms;
	};
	
	/**
	 * Highlight all matches with the specified style class
	 * according to the given regular expression.
	 * 
	 * @param pattern: {RegExp} Regular expression to match.
	 * @param highlightClass: {String} The specified style 
	 *		  className for highlight.
	 * 
	 * @return {Array} All highlighted span elements.
	 */
	thi$.highlightByPattern = function(pattern, highlightClass){
		var text = this.getContent(), styleClass, ids = [],
		newText, hid, tmp;
		if(!text || !(pattern instanceof RegExp)){
			return null;
		}
		
		text = String.encodeHtml(text);
		//System.err.println("Text: " + text);
		
		styleClass = highlightClass;
		if(!Class.isString(styleClass) || styleClass.length == 0){
			styleClass = this.__buf__.clear().append(this.def.className)
				.append("_").append("highlight").toString();
		}
		
		newText = text.replace(
			pattern,
			function(m){
				hid = Math.uuid();
				ids.push(hid);
				
				return '<span id=\"' + hid + '\" class=\"' + styleClass + '\">' + m + '</span>';
			}
		);
		
		_setText.call(this, newText, false);
		
		hid = null;
		newText = null;
		
		return _getHighlightElements.call(this, ids);
	};
	
	/**
	 * Highlight all matches according to the given match result.
	 * 
	 * @param matches: {Array} Each element in it is a object maintained the
	 *		  match's start index and its length. Its structure is as follow:
	 *		  [
	 *			{start: m, length: x},
	 *			...
	 *			{start: n, length: x}
	 *		  ]
	 * @param highlightClass: {String} The specified style 
	 *		  className for highlight.
	 * 
	 * @return {Array} All highlighted span elements.
	 */
	thi$.highlightByMatches = function (matches, highlightClass) {
		var mCnt = Class.isArray(matches) ? matches.length : 0,
		text = this.getContent(), styleClass, rpSeg, subStr, 
		aMatches, vernier, hid, ids;
		
		if(mCnt == 0 || !Class.isString(text)){
			return null;
		}
		
		styleClass = highlightClass;
		if(!Class.isString(styleClass) || styleClass.length == 0){
			styleClass = this.__buf__.clear().append(this.def.className)
				.append("_").append("highlight").toString();
		}
		
		ids = [];
		vernier = 0;
		rpSeg = new StringBuffer();
		
		for(var i = 0; i < mCnt; i++){
			aMatches = matches[i];
			if(aMatches.start > vernier){
				subStr = text.substring(vernier, aMatches.start);
				subStr = String.encodeHtml(subStr);
				rpSeg.append(subStr);
				
				subStr = text.substr(aMatches.start, aMatches.length);
				vernier = aMatches.start + aMatches.length;
				
			}else if(aMatches.start == vernier){
				subStr = text.substr(aMatches.start, aMatches.length);
				vernier = aMatches.start + aMatches.length;
			}else{
				subStr = null;
			}
			
			if(subStr){
				hid = Math.uuid();
				ids.push(hid);
				
				subStr = String.encodeHtml(subStr);
				subStr = '<span id=\"' + hid + '\" class=\"' + styleClass + '\">' + subStr + '</span>';
				rpSeg.append(subStr);
			}
		}
		
		if(vernier <= text.length){
			subStr = text.substr(vernier);
			subStr = String.encodeHtml(subStr);
			rpSeg.append(subStr);
		}
		
		_setText.call(this, rpSeg.toString(), false);
		rpSeg = null;
		
		return _getHighlightElements.call(this, ids);
	};
	
	thi$.clearHighlight = function(highlightClass) {
		if(!this.label){
			return;
		}
		
		_setText.call(this, this.getContent(), !this.isKeepNative());
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

	thi$.isIconStateless = function(){
		var M = this.def;
		return M.stateless === true
			|| M.iconStateless === true;
	};

	thi$.setIconImage = function(state){
		if(!this.icon){
			return;
		}

		var buf = this.__buf__.clear();
		buf.append(this.Runtime().imagePath());

		if(!this.isIconStateless()){
			buf.append(state & 0x0F).append("-");
		}

		buf.append(this.getIconImage());

		this.icon.src = buf.toString();
	};

	var _paintColorSign = function(signObj){
		var R = this.Runtime(), color = signObj.color, 
		opacity = signObj.opacity, styles, cview;

		if(!color){
			return;
		}
		
		if(js.awt.Color && (color instanceof js.awt.Color)){
			color = color.toString("hex");
		}
		
		if (color.toLowerCase() == "transparent"
			|| color.toLowerCase() == "rgba(0, 0, 0, 0)") {
			styles = {
				"background-image": "url(" + R.imagePath()
					+ "transparent.gif)"
			};
		} else {
			styles = {"background-color": color};
		}	
		
		if(Class.isNumber(opacity) && opacity >= 0){
			if(opacity > 1){
				opacity = opacity / 100;
			}
			
			styles["opacity"] = opacity;
		}
		
		DOM.applyStyles(this.sign, styles);
	};

	var _paintShapeSign = function(signObj){
		var R = this.Runtime(), shape = signObj.shape,
		styles;
		if(!shape){
			return;
		}
		
		if(signObj.real !== true){
			shape = R.imagePath() + shape;
		}

		styles = {
			backgroundImage: shape,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center"
		};

		DOM.applyStyles(this.sign, styles);
	};

	thi$.paintSign = function(){
		var signObj = this.def.sign;
		if(!this.sign || !Class.isObject(signObj)){
			return;
		}

		switch(signObj.type){
		case "color":
			_paintColorSign.call(this, signObj);
			break;
		case "shape":
			_paintShapeSign.call(this, signObj);
			break;
		default:
			break;
		}
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
		this.def.checked = b;

		if(this.isMarked()){
			marker.className = DOM.combineClassName(this.className, "marker_4");
		}else{
			marker.className = DOM.combineClassName(this.className, "marker_0");
		}
	};

	thi$.hoverCtrl = function(b){
		var ctrl = this.ctrl;
		if(!ctrl) return;

		if(b){
			ctrl.className = DOM.combineClassName(this.className, "ctrl_2");
		}else{
			ctrl.className = DOM.combineClassName(this.className, "ctrl_0");
		}
	};

	thi$.triggerCtrl = function(b){
		var ctrl = this.ctrl;
		if(!ctrl) return;

		if(b){
			ctrl.className = DOM.combineClassName(this.className, "ctrl_4");
		}else{
			ctrl.className = DOM.combineClassName(this.className, "ctrl_0");
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
	 * The js.awt.Item is prepared for those iterable cases. So it must
	 * be simple enough. And it must not be resized, moved, floating and
	 * showing shadow. However it can be disabled.
	 * 
	 * @link js.awt.BaseComponent#repaint
	 * @link js.awt.Component#repaint
	 */
	thi$.repaint = function(){
		var rst = js.awt.BaseComponent.prototype.repaint.apply(this, arguments);
		if(rst){
			this.showDisableCover(!this.isEnabled());
		}

		return rst;
	};

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

		if(typeof itemDef.sign === "object"){
			items.push("sign");
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
			ele.className = DOM.combineClassName(className, id);
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

			if(M.sign){
				items.push("sign");
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
			node.className = DOM.combineClassName(this.className, id);
			def.items.push(id);
			this[id] = node;
		}

		if(this.icon){
			this.setIconImage(this.isTriggered() ? 4 : 0);
			//DOM.forbidSelect(this.icon);
		}

		if(this.sign){
			this.paintSign();
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
 * Author:	Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * @param def: {Object} Definition of current item, include:
 *	   id: {String} 
 *	   iconImage: {String} Optional. Image filename for the icon.
 *	   labelText: {String} Optional. Textual content for current item. 
 *	   
 *	   markable: {Boolean} Default is true.
 *	   iconic: {Boolean} Indicate whether an icon existed for current item.
 *	   custom: {Object} Specify a component as current item's main contents. It's prior.
 *			   If the custom is specified, the given textual content will be ignored.
 *			   Otherwise an input or label will be created.
 */
js.awt.FlexibleItem = function(def, Runtime){
	var CLASS = js.awt.FlexibleItem,
	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event,
	DOM = J$VM.DOM, System = J$VM.System;
	
	thi$.isCustomized = function(){
		return this._local.customized;	
	};
	
	/**
	 * @see js.awt.Item #getPreferredSize
	 */
	thi$.getPreferredSize = function(){
		if(this.def.prefSize == undefined){
			var customComp = this.getCustomComponent(),
			G = this.getGeometric(), nodes = this.view.childNodes,
			leftmostCtrl = this._local.leftmostCtrl || this.ctrl,
			len = nodes.length, overline = false, width = 0, preEle, ele, s;
			
			for(var i = 0; i < len; i++){
				ele = nodes[i];
				if(leftmostCtrl && ele == leftmostCtrl){
					break;
				}
				
				if(customComp && customComp.view == ele){
					if(!overline){
						overline = true;
						width += ele.offsetLeft;
					}
					s = customComp.getPreferredSize();
					width += s.width;
				}else{
					if(ele.tagName == "SPAN" || ele.tagName == "INPUT"){
						if(!overline){
							overline = true;
							width += ele.offsetLeft;
						}
						
						if(ele.tagName == "SPAN"){
							width += DOM.getTextSize(ele).width;   
						}else{
							width += ele.scrollWidth;
						}
					}
				}
			}
			
			var w = this._local.ctrlsWidth, D = G.ctrl;
			if(!isNaN(s)){
				width += s;
			}
			
			if(D){
				width += D.MBP.marginLeft + D.width + D.MBP.marginRight;
			}
			
			width += G.bounds.MBP.BPW;
			this.setPreferredSize(width, G.bounds.height);
		}
		
		return this.def.prefSize;
		
	}.$override(this.getPreferredSize);
	
	/**
	 * @see js.awt.Item #isMoverSpot
	 */
	thi$.isMoverSpot = function(el, x, y){
		if(arguments.callee.__super__.apply(this, arguments)){
			var extraCtrls = this._local.extraCtrls,
			ids = extraCtrls ? extraCtrls.keys() : [], ctrl;
			for(var i = 0, len = ids; i < len; i++){
				ctrl = this[ids[i]];
				if(el === ctrl){
					return false;
				}
			}
			
			if(this.customComponent 
			   && this.customComponent.contains(el, true)){
				return false;
			}
		}
		
		return true;
		
	}.$override(this.isMoverSpot);
	
	/**
	 * @see js.awt.Item #doLayout
	 */
	thi$.doLayout = function(force){
		if(!this.isDOMElement() || !this.needLayout(force)){
			return false;
		}
		
		var customComp = this.getCustomComponent(), 
		leftmostCtrl = this._local.leftmostCtrl,
		ele = (customComp && customComp.view) 
			? customComp.view : (this.input || this.label),
		leftEle, rightEle, w, width, D;

		if(ele){
			leftEle = ele.previousSibling;
			rightEle = leftmostCtrl || this.ctrl;
			w = rightEle 
				? rightEle.offsetLeft : this.getBounds().innerWidth;
			
			if(customComp && customComp.view){
				var G = this.getGeometric(), MBP = G.bounds.MBP,
				ybase = MBP.paddingTop,
				h = G.bounds.BBM ? 
					G.bounds.height : G.bounds.height - MBP.BPH,
				innerHeight = h - MBP.BPH, x, y;

				if(leftEle){
					D = G[leftEle.id] || DOM.getBounds(leftEle);
					x = leftEle.offsetLeft + D.width + D.MBP.marginRight;
				}else{
					x = MBP.borderLeftWidth + MBP.paddingRight;
				}

				D = customComp.getBounds();
				y = ybase + (innerHeight - D.height)*0.5;

				width = Math.max(w - x, 0);
				customComp.setBounds(x, y, width, undefined);

				// Trigger custom component's doLayou
				customComp.doLayout(true);
			}else{
				width = Math.max(w - ele.offsetLeft, 0);

				if(this.input){
					DOM.setSize(ele, width, undefined);
				}else{
					ele.style.width = width + "px";
				}
			}
		}
		
		return true;
		
	}.$override(this.doLayout);

	thi$.destroy = function(){
		delete this._local.leftmostCtrl;
		delete this._local.extraCtrls;
		
		arguments.callee.__super__.apply(this, arguments);
		
	}.$override(this.destroy);
	
	/**
	 * Specify a component as current item's customized contents.
	 * 
	 * @param comp: {Object} A custom component must be an object of the BaseComponent
	 *		  or BaseComponent's derived class. And it must implement an getValue method
	 *		  to return the item's value.
	 */
	thi$.setCustomComponent = function(comp){
		if(!comp || !comp.view 
		   || !Class.isFunction(comp.getValue)){
			return;
		}
		
		var customComponent = this._local.customComponent,
		ctrl = this._local.leftmostCtrl || this.ctrl, peer;
		if(customComponent){
			DOM.remove(customComponent.view, true);
		}else{
			this._local.customComponent = comp;
		}
		
		comp.applyStyles({position: "absolute"});
		DOM.insertBefore(comp.view, ctrl, this.view);
		comp.setContainer(this);
		
		var uuid = this.uuid(), items = this.def.items,
		nodes = comp.view.childNodes || [], node, id, 
		i = 0, len = nodes.length;
		while(i <= len){
			if(i == len){
				node = comp.view;
				
				id = node.id = "custom";
				items.push(id);
				this[id] = node;
			}else{
				node = nodes[i];
				id = node.id;
			}
			
			node.uuid = uuid;
			node.iid = (node.iid || id.split(/\d+/g)[0]);
			
			++i;
		}
		
		if(DOM.isDOMElement(comp.view)){
			this.doLayout(true);
		}
	};
	
	/**
	 * Return the customized component of current item.
	 */
	thi$.getCustomComponent = function(){
		return this._local.customComponent;	 
	};
	
	/**
	 * Judge whethe the current event hit some extra ctrl.
	 * 
	 * @param e: {js.awt.Event}
	 */	   
	thi$.hitCtrl = function(e){
		var src = e.srcElement, extraCtrls = this._local.extraCtrls, 
		ids = extraCtrls ? extraCtrls.keys() : undefined, id, ele, ctrl;
		if(!src || !ids || ids.length == 0) {
			return false;
		}
		
		for(var i = 0, len = ids.length; i < len; i++){
			id = ids[i];
			ele = this[id];
			
			if(ele && DOM.contains(ele, src, true)){
				// ctrl = extraCtrls.get(id);
				return true;
			}
		}
		
		return false;
	};

	var _createExtraCtrls = function(){
		var M = this.def, buf = this.__buf__,
		ctrls = M.ctrls, len = ctrls.length;
		if(len == 0){
			return;
		}

		var G = this.getGeometric(), ybase = G.bounds.MBP.paddingTop,
		height = G.bounds.BBM ? 
			G.bounds.height : G.bounds.height - G.bounds.MBP.BPH,
		innerHeight = height - G.bounds.MBP.BPH, anchor = this.ctrl,
		ctrlsWidth = 0, align = 0.5, top = 0, right = 0, 
		el, iid, D, styleW, styleH;
		
		if(this.ctrl){
			right = G.bounds.MBP.paddingRight 
				+ G.ctrl.MBP.marginLeft + G.ctrl.width + G.ctrl.MBP.marginRight; 
		}
		
		var extraCtrls = this._local.extraCtrls = new js.util.HashMap(),
		ctrl, ctrlId, uuid = this.uuid(), items = M.items;
		for(var i = len - 1; i >= 0; i--){
			ctrl = ctrls[i];
			ctrlId = ctrl.id || ("ctrl" + i);
			iid = ctrlId.split(/\d+/g)[0];

			if(ctrlId !== "ctrl"){
				extraCtrls.put(ctrlId, ctrl);
				
				el = DOM.createElement("DIV");
				el.id = ctrlId;
				el.iid = iid;
				el.uuid = uuid;
				el.className = ctrl.className || (this.className + "_extra");
				
				buf.clear();
				buf.append("position:absolute;");
				
				if(ctrl.image){
					buf.append("background-image: url(")
						.append(this.Runtime().imagePath() + ctrl.image).append(");")
						.append("background-repeat:no-repeat;background-position:center;");
				}
				
				if(ctrl.css){
					buf.append(css);
				}				 
				el.style.cssText = buf.toString();
				
				DOM.appendTo(el, document.body);
				DOM.setSize(el, ctrl.width, ctrl.height);
				D = G[ctrlId] = DOM.getBounds(el);
				styleW = DOM.getStyle(el, "width");
				styleH = DOM.getStyle(el, "height");
				DOM.removeFrom(el);
				
				if(styleW){
					buf.append("width:").append(styleW).append(";");
				}
				
				if(styleH){
					buf.append("height:").append(styleH).append(";");
				}
				
				align = (ctrl.align && !isNaN(ctrl.align)) ? ctrl.align : align; 
				top = ybase + (innerHeight - D.height) * align;
				buf.append("top:").append(top).append("px;");
				buf.append("right:").append(right).append("px;");
				el.style.cssText = buf.toString();
				
				DOM.insertBefore(el, anchor, this.view);
				anchor = el;
				
				// The leftmost ctrl which will be used to calculate the lable 
				// or input width in doLayout
				this._local.leftmostCtrl = el;

				items.push(ctrlId);
				this[ctrlId] = el;
				
				ctrlsWidth = D.MBP.marginLeft + D.width + D.MBP.marginRight;
				right += ctrlsWidth;
			}else{
				System.err.println("The \"ctrl\" has been reserved for special purpose.");
			}
			
			// Cache this value for calculate the prefered size
			this._local.ctrlsWidth = ctrlsWidth;
		}
	};
	
	var _createCustomComponent = function(){
		var M = this.def, custom = M.custom,
		comp = new (Class.forName(custom.classType))(custom, this.Runtime());

		this.setCustomComponent(comp);
	};
	
	var _checkItems = function(def){
		var items = def.items, custom = def.custom,
		customized = false;
		
		if(Class.isObject(custom) 
		   && Class.isString(custom.classType)){
			customized = this._local.customized = true;
		}
		
		if(items.length > 0){
			return def;
		}
		
		if(def.markable === true){
			items.push("marker");
		}
		
		if(def.iconic !== false){
			items.push("icon");
		}
		
		if(!customized){
			if(Class.isValid(def.inputText)){
				items.push("input");
			}else{
				items.push("label");
			}
		}
		
		if(def.controlled === true){
			items.push("ctrl");
		}
		
		return def;
	};
	
	thi$._init = function(def, Runtime, view){
		if(typeof def !== "object") return;
		
		this._local = this._local || {};
		def.classType = def.classType || "js.awt.FlexibleItem";
		def.markable = Class.isBoolean(def.markable) ? def.markable : true;
		
		if(view == undefined){
			def.items = js.util.LinkedList.$decorate([]);
			_checkItems.call(this, def);
		}
		
		arguments.callee.__super__.apply(this, [def, Runtime, view]);
		
		if(this.isCustomized()){
			_createCustomComponent.call(this);
		}
		
		if(Class.isArray(def.ctrls)){
			_createExtraCtrls.call(this);
		}
		
		if(this.isMarkable()){
			this.mark(def.checked);
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
            marker.className = DOM.combineClassName(this.className, "_marker_4", "");
        }else{
            marker.className = DOM.combineClassName(this.className, "_marker_0", "");
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

            left = xbase + (innerWidth - cwidth) * align_x;
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
            ele.className = DOM.combineClassName(className, id);
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
            this.setIconImage(this.isTriggered() ? 4 : (this.isEnabled() ? 0 : 1));
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

        this.setAttribute("touchcapture", "true");
        this.attachEvent("mouseover", 0, this, _onmouseover);
        this.attachEvent("mouseout",  0, this, _onmouseout);
        this.attachEvent("mousedown", 0, this, _onmousedown);
        this.attachEvent("mouseup",   0, this, _onmouseup);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Component);

js.awt.Button.eventDispatcher = function(e){
    var Class = js.lang.Class, System = J$VM.System,
        target, func;
    
    switch(e.getType()){
    case "mousedown":
        if(Class.isFunction(this.activateComponent)){
            this.activateComponent();            
        }
        break;
    case "mouseup":
    case "message":
        target = e.getEventTarget();
        func = this["on" + target.id];
        func = Class.isFunction(func) ? func : this.onbtnDispatcher;
        if(Class.isFunction(func)){
            func.call(this, target, e);
        }else{
            System.err.println("Can not found function for button "+ target.id);
        }
        break;
    default:
        break;
    }
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
	
	thi$.hasNodes = function(){
		var nodes = this.def.nodes;
		return Class.isArray(nodes) && this.def.nodes.length > 0;
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
				DOM.appendTo(item.view, this._menuView);
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
		var b = true;
		if(e.getType() === "blur"){
			b = this.rootLayer().isHideOnBlur();
		}else{
			b = arguments.callee.__super__.apply(this, arguments);
		}

		return b;

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
			var M = this.def, bounds = this.getBounds(),
			nodes = this.nodes, node;

			var clientH = document.documentElement.clientHeight,
			height = this.def.height ? this.def.height : bounds.height;

			if(height > clientH){
				this.setY(0);
				this.view.style.height = "100%";
				this.applyStyles({overflow: "auto"});
			}

			M.width = bounds.width;
			M.width -= bounds.BBM ? 0 : bounds.MBP.BPW;

			var scrollbar = this.hasScrollbar();
			if(scrollbar.vscroll){
				M.width = M.width - scrollbar.vbw;
			}
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

		if(item && item.hasNodes()){
			item.showSubMenu();
			return;
		}
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
		delete this._local.menuView;
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

		var menuView = this._menuView = DOM.createElement("DIV");
		menuView.className = this.className + "_menuview";
		menuView.style.cssText = "position:relative;width:100%;height:100%;";
		DOM.appendTo(menuView, this.view);

		this.cache = {};

		if(def.nodes && def.nodes.length > 0){
			this.insertNodes(0, def.nodes);
		}

		this.setAttribute("touchcapture", "true");
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
	System = J$VM.System;

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

	thi$.alwaysRemoveChild = function(){
		var tree = this.treeContainer();
		return tree.alwaysRemoveChild();
	};

	/**
	 * @see js.awt.Item
	 */
	thi$.getIconImage = function(){
		return this.treeContainer().getIconImage(this.def);
	}.$override(this.getIconImage);

	/**
	 * @method
	 * @inheritdoc js.awt.Item#isIconStateless
	 */
	thi$.isIconStateless = function(){
		var tree = this.treeContainer();
		return tree.isIconStateless(this.def);
	};

	/**
	 * Insert tree items into specified position
	 *
	 * @param index
	 * @param itemDefs, an array of tree item definition
	 */
	thi$.insertNodes = function(index, itemDefs){
		var nodes = this.nodes, ibase = index, item, refItem,
		prev, next, itemDef, cview, clazz, i, len,
		tree = this.treeContainer(), isVisible;

		if(!nodes){
			nodes = this.nodes = js.util.LinkedList.$decorate([]);
		}

		for(i=0, len=itemDefs.length; i<len; i++){
			itemDef = itemDefs[i];
			itemDef.level = this.def.level + 1;

			isVisible = tree.isNodeVisible(itemDef) && this.isVisible();
			if(!isVisible){
				if(!tree.isAlwaysCreate()){ // skip this item
					continue;
				}else{ // make item invisible
					itemDef.state = 16;
				}
			}

			if(this.isShowTip()){
				itemDef.tip = itemDef.dname;
				itemDef.showTip = true;
			}

			// Add for support inserting the different structure and different
			// style nodes. Such as, inserting the fake nodes of the markable
			// nodes, then each of the fake nodes won't be markable.
			cview = null;
			if(item && item.canCloneView(itemDef)){
				cview = item.cloneView();
			}else{
				if(refItem && refItem.canCloneView(itemDef)){
					cview = refItem.cloneView();
				}
			}

			clazz = itemDef.className;
			if(!clazz){
				clazz = tree.def.className || tree.className;
				clazz = itemDef.className = DOM.combineClassName(clazz, "item");
			}

			refItem = item;
			if(!cview){
				item = new js.awt.TreeItem(
					itemDef,
					this.Runtime(),
					tree,
					this);
			}else{
				// Ref: js.awt.BaseComponent#_init
				cview.clazz = clazz;

				item = new js.awt.TreeItem(
					itemDef,
					this.Runtime(),
					tree,
					this,
					cview);
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
		var nodes = this.nodes || [], cnt = nodes.length,
		tree = this.treeContainer(), cache = tree.cache, 
		marked = tree.marked, selected = tree.selected, 
		item;

		if(!Class.isNumber(index)){
			index = 0;
		}else{
			index = index < 0 ? 0 : (index >= cnt ? cnt - 1 : index);
		}

		nodes = nodes.splice(index, length);
		while(nodes.length > 0){
			item = nodes.shift();
			item.removeAllNodes();
			delete cache[item.uuid()];

			item.mark(false);
			marked.remove(item);

			item.setTriggered(false);
			selected.remove(item);

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
		if(item.destroied === true){
			return;
		}
		
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

		var tree = this.treeContainer(), className = this.branch.clazz,
		nodes = this.nodes || [], len = nodes.length, refNode, i, item;

		b = b || false;
		this._local.expanded = b;

		if(b){
			this.branch.className = DOM.combineClassName(className, "4");
			this.setIconImage(4);
			refNode = this.view;

			for(i = 0; i < len; i++){
				item = nodes[i];
				_addToDOM.$delay(this, 1, item, refNode,
								 ((i == len-1) && (needNotify != false)));
				refNode = item.view;
			}
		}else{
			// If the "alwaysRemoveChild" adjustment return true, that will
			// indicate all sub-nodes always need be fetch again while an item
			// is expanding and the sub-items also need be removd while the
			// parent item is collapsing. So that, the 'nodes' of current item
			// are always changing. The length of the 'nodes' is decreasing.
			// Loop from len - 1 will be better.
			for(i = len - 1; i >= 0; i--){
				item = nodes[i];
				if(item.isExpanded()){
					item.expand(false, undefined, item);
				}
				if(this.alwaysRemoveChild()){
					tree.removeNode(item);

				}else{
					item.removeFrom(item.view.parentNode);
				}
			}

			if(this.alwaysRemoveChild()){
				delete this.def.nodes;
			}

			this.branch.className = DOM.combineClassName(className, "0");
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

	thi$.adjustCover = function(bounds){
		arguments.callee.__super__.apply(this, arguments);

		if(this._coverView){
			this._coverView.style.width = "100%";
		}

	}.$override(this.adjustCover);

	thi$.updateBranchStyle = function(){
		var ex = this.canExpand(),
		ps = this.prevSibling() != undefined,
		ns = this.nextSibling() != undefined,
		b = ((ex ? 4 : 0) | (ps ? 2 : 0) | (ns ? 1 : 0)),
		bClassName = DOM.combineClassName(this.className, "branch"),
		branch = this.branch;

		if(this.isEnabled()){
			bClassName = DOM.combineClassName(bClassName, b, "");

			branch.clazz = bClassName;
			bClassName = DOM.combineClassName(bClassName, 
											  (this.isTriggered() ? "4" : "0"));
		}else{
			branch.clazz = bClassName;
			bClassName = DOM.combineClassName(bClassName, "1");
		}

		branch.className = bClassName;
	};

	thi$.updateLeaderStyle = function(){
		var p = this.parentItem(), M = this.def, level = M.level,
		comps = M.items, comp;

		for(var i=level-1; i>=0; i--){
			comp = this[comps[i]];
			if(p.hasSibling()){
				comp.className = DOM.combineClassName(this.className, "leader1");
			}else{
				comp.className = DOM.combineClassName(this.className, "leader0");
			}
			p = p.parentItem();
		}
	};

	/**
	 * @see js.awt.Item
	 */
	thi$.canCloneView = function(itemDef){
		var items = [], indent = itemDef.indent, level = itemDef.level;

		// Indent in the same level
		if(indent > 0){
			for(var i = indent; i > 0; i--){
				items.unshift("leader");
			}
		}

		// Leaders
		for(var i=level; i>0; i--){
			items.unshift("leader"+i);
		};

		items.push("branch");
		if(itemDef.markable === true){
			items.push("marker");
		}

		if(itemDef.iconic !== false){
			items.push("icon");
		}
		items.push("label");

		return items.length === this.def.items.length;

	}.$override(this.canCloneView);

	var _checkItems = function(def, tree, parent){
		var indent = def.indent, level = def.level, items = def.items;

		// Indent in the same level
		if(indent > 0){
			for(var i = indent; i > 0; i--){
				items.unshift("leader");
			}
		}

		// Leaders
		for(var i=level; i>0; i--){
			items.unshift("leader"+i);
		};

		items.push("branch");
		if(def.markable === true){
			items.push("marker");
		}

		if(def.iconic !== false){
			items.push("icon");
		}
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
		def.className = def.className 
			|| DOM.combineClassName(tree.def.className || tree.className, "item");
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
		var image = def["iconImage"] || def["image"],
		map = this.imageMap;
		if(!image){
			image = map ? map[def.type] : "blank.gif"; 
		}

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
	 *	   id:...
	 *	   type: ...
	 *
	 *	   nodes:[
	 *		   ...
	 *	   ]
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

	/**
	 * @method
	 * @inheritdoc js.awt.Element#notifyPeer
	 */
	thi$.notifyPeer = function(msgId, event, sync){
		if(event){
			event.srcTree = this;
		}
		
		arguments.callee.__super__.apply(this, arguments);
		
	}.$override(this.notifyPeer);

	/**
	 * Find and return the previous same-level sibling of the specified 
	 * tree item.
	 * 
	 * @param {js.awt.TreeItem} item
	 * 
	 * @return {js.awt.TreeItem}
	 */
	thi$.getPrevSiblingItem = function(item){
		var prevItem = item.prevSibling(), ele;
		if(!prevItem){
			ele = item.view.previousSibling;
			if(ele && ele.uuid){
				prevItem = this.cache[ele.uuid];
			}

			if(prevItem && prevItem.def.level !== item.def.level){
				prevItem = null;
			}
		}

		return prevItem;
	};

	/**
	 * Find and return the next same-level sibling of the specified 
	 * tree item.
	 * 
	 * @param {js.awt.TreeItem} item
	 * 
	 * @return {js.awt.TreeItem}
	 */
	thi$.getNextSiblingItem = function(item){
		var nextItem = item.nextSibling(), ele;
		if(!nextItem){
			ele = item.view.nextSibling;
			if(ele && ele.uuid){
				nextItem = this.cache[ele.uuid];
			}

			if(nextItem && nextItem.def.level !== item.def.level){
				nextItem = null;
			}
		}

		return nextItem;
	};
	
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
	
	thi$.setAlwaysRemoveChild = function(bool){
		this._local.alwaysRemoveChild = bool;
	};
	
	thi$.alwaysRemoveChild = function(){
		return this._local.alwaysRemoveChild;
	};
	
	/**
	 * If the specified item is stateless, its icon must be stateless.
	 * If the "iconStateless" of the item is specified by definition,
	 * the value of which will be used. Otherwise, if the "iconStateless"
	 * of the tree is specified, the value will be used.
	 * 
	 * In other words, item's stateless > item's iconStateless > tree's 
	 * iconStateless.
	 */
	thi$.isIconStateless = function(itemDef){
		var stateless = (itemDef.stateless === true);
		if(!stateless){
			if(itemDef.hasOwnProperty("iconStateless")){
				stateless = (itemDef.iconStateless === true);
			}else{
				stateless = (this.def.iconStateless === true);
			}
		}
		
		return stateless;
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
	 * Check node's permission, judge whether the specified node
	 * will be visible.
	 */ 
	thi$.isNodeVisible = function(nodeDef){
		var p = parseInt(nodeDef.permission, 10);
		return permission.isVisible(isNaN(p) ? 1 : p);
	};
	
	thi$.isAlwaysCreate = function(){
		return this.def.alwaysCreate !== false;
	};

	/**
	 * Insert tree items into specified position
	 *
	 * @param index
	 * @param itemDefs, an array of tree item definition
	 */
	thi$.insertNodes = function(index, itemDefs){
		var nodes = this.nodes, ibase = index, item, refItem, cview, refNode,
		itemDef, clazz, i, len, isVisible;

		if(!nodes){
			nodes = this.nodes = js.util.LinkedList.$decorate([]);
		}

		item = nodes.get(index);
		refNode = item ? item.view : undefined;

		for(i=0, len=itemDefs.length; i<len; i++){
			itemDef = itemDefs[i];
			// if(itemDef.isVisible == false){
			//	   continue;
			// }

			itemDef.level = 0;
			if(this.isShowTip()){
				itemDef.tip = itemDef.dname;
				itemDef.showTip = true;
			}

			isVisible = this.isNodeVisible(itemDef);
			if(!isVisible){
				if(!this.isAlwaysCreate()){ // skip this item
					continue;
				}else{ // make item invisible
					itemDef.state = 16;
				}
			}

			// Add for support inserting the different structure and different
			// style nodes. Such as, inserting the fake nodes of the markable 
			// nodes, then each of the fake nodes won't be markable.
			cview = null;
			if(item && item.canCloneView(itemDef)){
				cview = item.cloneView();
			}else{
				if(refItem && refItem.canCloneView(itemDef)){
					cview = refItem.cloneView();
				}
			}

			clazz = itemDef.className;
			if(!clazz){
				clazz = this.def.className || this.className;
				clazz = itemDef.className = DOM.combineClassName(clazz, "item");
			}

			refItem = item;
			if(!cview){
				item = new js.awt.TreeItem(itemDef, this.Runtime(), this);
			}else{
				// Ref: js.awt.BaseComponent#_init
				cview.clazz = clazz;

				item = new js.awt.TreeItem(
					itemDef,
					this.Runtime(),
					this,
					undefined,
					cview);
			}

			nodes.add(ibase++, item);

			if(refNode){
				DOM.insertAfter(item.view, refNode);
			}else{
				DOM.appendTo(item.view, this._treeView);
			}

			//item.checkHide();

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

		item.removeAllNodes();
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
			item.removeAllNodes();
			delete cache[item.uuid()];

			item.mark(false);
			marked.remove(item);

			item.setTriggered(false);
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
		this.marked.clear();
		this.selected.clear();

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
		if(!item || item.def.isRead == false){
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
		if(!data) return undefined;
		var p = data.permission, nodes, node, len;
		if(p){
			data.isVisible = permission.isVisible(p);
			data.isRead = permission.isRead(p);
			data.isWrite = permission.isWrite(p);
			data.isExecute = permission.isExecute(p);
		}
		
		nodes = data.nodes;
		len = Class.isArray(nodes) ? nodes.length : 0;
		for(var i = 0; i < len; i++){
			node = nodes[i];
			if(node.nodes){
				nodes[i] = _checkData.call(this, node);
			}else{
				p = node.permission;
				if(p){
					node.isVisible = permission.isVisible(p);
					node.isRead = permission.isRead(p);
					node.isWrite = permission.isWrite(p);
					node.isExecute = permission.isExecute(p);
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
			item.branch.className 
				= DOM.combineClassName(item.className, "branch0");
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
			item.setHover(false);
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
	thi$.clearAllMarked = function(doSort){
		var marked = this.marked, item;
		while(marked.length > 0){
			item = marked.shift();
			item.mark(false);
		}
		
		if(doSort !== false){
			this._doSort();
		}
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
			iidef = item.def, mdef, mClz, absXY = e.eventXY();

			if(iidef.isExecute == false){
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

			mdef = this.getMoveObjectDef(item) || {};
			mClz = mdef.classType;
			if(Class.isString(mClz) && mClz.length > 0){
				mClz = Class.forName(mClz);
			}
			mClz = mClz || js.awt.TreeMoveObject;
			moveObj = this.moveObj = new mClz(mdef, this.Runtime(), this);
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
			U.scrollTop	 = el.scrollTop;
		}else{
			el.scrollLeft = U.scrollLeft;
			el.scrollTop  = U.scrollTop;
		}
	};

	var _adjustTreeView = function(){
		var bounds = DOM.getBounds(this._treeShell),
		MBP = bounds.MBP;
		DOM.setSize(this._treeView,
					bounds.width - MBP.BPW,
					bounds.height - MBP.BPH);
	};

	/**
	 * Sets treeView max size
	 */
	var _setMaxSize = function(){
		var rect = _getMaxSize.call(this), box = this.getBounds(),
		cw = box.innerWidth, ch = box.innerHeight,

		treeShell = this._treeShell,
		supports = J$VM.supports,

		w, h, wrest, hrest;

		if(rect.width >= cw){ // Has hscrollbar
			w = rect.width;
			wrest = 0;
		}else{
			w = cw;
			wrest = cw - rect.width;
		}

		if(rect.height >= ch){ // Has vscrollbar
			h = rect.height;
			hrest = 0;
		}else{
			h = ch;
			hrest = ch - rect.height;
		}

		// Only have one scrollbar
		if(wrest > 0 || hrest > 0){
			// If the tree will have hscrollbar and the hight has surplus,
			// to compensate the space of hscrollbar with the rest available
			// height.
			if(wrest == 0 && hrest > 0){
				h -= Math.min(hrest, supports.hscrollbar);
			}

			// If the tree will have vscrollbar and the width has surplus,
			// to compensate the space of vscrollbar with the rest available
			// width.
			if(hrest == 0 && wrest > 0){
				w -= Math.min(wrest, supports.vscrollbar);
			}
		}

		this.view.style.overflow = "hidden";

		DOM.setSize(treeShell, w, h);

		_adjustTreeView.call(this);

		this.view.style.overflow = "auto";
	};

	/**
	 * Gets treeView max size
	 */
	var _getMaxSize = function(force){
		var treeview = this._treeView, ret = this._local.maxSize,
		bounds;
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

		bounds = DOM.getBounds(this._treeShell);
		ret.width += bounds.MBP.BPW;
		ret.height += bounds.MBP.BPH;

		return ret;
	};

	thi$.onResized = function(fire){
		delete this._local.maxSize;

		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.onResized);

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
	
	/**
	 * Select the specified tree item.
	 * 
	 * @param {js.awt.TreeItem} item The specified tree item to select.
	 * @param {js.awt.Event} e The event whcich trigger the selecting operation.
	 */
	thi$.selectItem = function(item, e){
		/*
		 * While the external application is selecting a tree item by invoking
		 * this API manually, the e argument may not exist. For supporting to
		 * handle the "selectchanged" msg with the consistent codes, we fake
		 * the event object for it.	  
		 */
		if(!e){
			e = new Event("selectchanged", {}, this);
			e.srcElement = item ? item.view : this._treeView;
		}

		var isMulti = this.def.multiEnable, selected = this.selected, tmp;
		if(item && item.isEnabled()){
			if (item.canDrag()){
				if(isMulti && e.ctrlKey === true){
					item.setTriggered(!item.isTriggered());
					if(item.isTriggered()){
						selected.push(item);
					}else{
						selected.remove(item);
					}
				}else if(isMulti && e.shiftKey === true){
					// Accoding to the multiple select logic of OS file explorer,
					// use the last one of the latest selection as the start
					// of current slection.
					var first = selected.length > 0 
						? selected[selected.length - 1] : undefined;

					if(first == undefined){
						item.setTriggered(true);
						selected.push(item);
					}else{
						this.clearAllSelected();
					}

					if(first && item){
						if(first.parentItem() == item.parentItem()){
							var nodes = first.parentItem().getNodes(first, item), node;
							for(var i=0, len=nodes.length; i<len; i++){
								node = nodes[i];
								node.setTriggered(true);
								selected.push(node);
							}
						}else{
							item.setTriggered(true);
							selected.push(item);
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
		}else{
			if(selected.length > 0){
				this.clearAllSelected();

				e.setType("selectchanged");
				e.setData(this.getAllSelected());
				this.notifyPeer("js.awt.event.TreeItemEvent", e);
			}
		}
	};
	
	var _doSelect = function(e){
		var el = e.srcElement, item = this.cache[el.uuid];
		this.selectItem(item, e);
	};

	var _onclick = function(e){
		var el = e.srcElement, uuid = el.uuid,
		item = this.cache[uuid];

		if(item && item.isEnabled()){
			if(e.getType() == "click"){
				if(el === item.branch && item.canExpand()){
					this.clearAllSelected();
					this.expand(item);
				}else if(el === item.marker && item.isMarkable()){
					this.markNode(item);
					e.setType("markchanged");
					e.setEventTarget(item);
					this.notifyPeer("js.awt.event.TreeItemEvent", e);
				}
			}
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
		// Extract the item selecting login from _onclick by Chen Chao & Pan Mingfa
		// in 2014-06-18.
		// 
		// For the old logic, the item only can be selected while it is clicked.
		// So that when we start to drag an item directly by mousedown, the current
		// "selected" will be from the latest selection except the current trigger
		// one and the moving data of the moveObject will be wrong.
		var el = e.srcElement, uuid = el.uuid,
		item = this.cache[uuid];
		if(item && el === item.branch){
			return e.cancelDefault();
		}
		_doSelect.call(this, e);

		return e.cancelDefault();		  
	};

	thi$.destroy = function(){
		this.removeAllNodes(true);
		delete this.nodes;
		delete this.cache;
		delete this.selected;
		delete this.marked;
		delete this.dataProvider;

		var ele = this._treeView;
		delete this._treeView;
		DOM.remove(ele, true);

		ele = this._treeShell;
		delete this._treeShell;
		DOM.remove(ele, true);


		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.destroy);

	var _ondrag = function(e){
		this.notifyPeer("js.awt.event.TreeItemEvent", e);
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
		
		this._local.alwaysRemoveChild = def.alwaysRemoveChild;

		// Cache all tree items
		this.cache = {};
		this.selected = js.util.LinkedList.$decorate([]);
		this.marked = js.util.LinkedList.$decorate([]);

		this.showTip(def.showTip);

		var treeShell = this._treeShell = DOM.createElement("DIV");
		treeShell.className = DOM.combineClassName(this.className, "treeshell");
		treeShell.style.cssText = "position:relative;width:100%;height:100%;"
			+ "overflow:visible;";
		DOM.appendTo(treeShell, this.view);

		var treeView = this._treeView = DOM.createElement("DIV");
		treeView.style.cssText = "position:relative;overflow:visible;"
			+ "border:0 none;padding:0px;";
		DOM.appendTo(treeView, treeShell);

		this.setDataProvider(dataProvider ||
							 new js.awt.AbstractTreeDataProvider(this.Runtime()));

		if(def.nodes && def.nodes.length > 0){
			this.insertNodes(0, def.nodes);
		}

		Event.attachEvent(treeView, "mouseover", 0, this, _onmouseover);
		Event.attachEvent(treeView, "mouseout",	 0, this, _onmouseover);
		Event.attachEvent(treeView, "click",	 0, this, _onclick);
		Event.attachEvent(treeView, "dblclick",	 0, this, _onclick);

		// Avoid autoscroll when drag item.
		Event.attachEvent(treeView, "mousedown", 1, this, _onmousedown);

		if(this.isMovable()){
			MQ.register(this.dataProvider.getDragMsgType(), this, _ondrag);
		}

	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(js.awt.TreeDataFilter);

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
		delete this.imageMap;
		delete this.expandMap;
		delete this.dragMap;

		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.destroy);

	thi$._init = function(Runtime, imageMap, expandMap, dragMap){
		if(Runtime == undefined) return;

		this._local = this._local || {};

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
			width = bounds.innerWidth, icon = this.icon;
			
			if(icon){
				buf.append("position:absolute;left:")
					.append(left).append("px;")
					.append("top:").append(top).append("px;");
				this.icon.style.cssText = buf.toString();

				bounds = this.icon.bounds;
				left += bounds.width + bounds.MBP.marginRight;
				width -= left;
			}

			buf.clear().append("position:absolute;left:")
				.append(left).append("px;").append("top:")
				.append(top).append("px;").append("width:")
				.append(width).append("px;");
			this.label.style.cssText = buf.toString();
		}

	}.$override(this.repaint);

	thi$._init = function(def, Runtime, tree){
		if(def === undefined) return;

		def.classType = "js.awt.TreeMoveObject";

		var treeClazz = tree.def.className || tree.className,
		selected = tree.selected;
		if(selected.length === 1){
			def.className = DOM.combineClassName(treeClazz, "moveobj0");
		}else{
			def.className = DOM.combineClassName(treeClazz, "moveobj1");
		}

		def.css = "position:absolute;";
		def.stateless = true;

		arguments.callee.__super__.apply(this, [def, Runtime]);

		dataProvider = tree.dataProvider;

		var item = selected[0], G = item.getGeometric(),
		icon, label, text = item.getText();
		
		if(item.icon){
			icon = this.icon = item.icon.cloneNode(true);

			icon.bounds = G.icon;
			DOM.appendTo(icon, this.view);
		}

		// Maybe current label has been highlighted
		label = this.label = item.label.cloneNode(true);
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

    thi$.onload = function(e){
        var doc = this.getDocument();

        if(doc){
            try{
                Event.attachEvent(doc, "mousedown", 0, this, this.onmousedown);
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
                Event.detachEvent(doc, "mousedown", 0, this, this.onmousedown);
            } catch (x) {
                // Nothing to do
            }
        }
        return true;
    };

    thi$.onmousedown = function(e){
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
        def.css = "border:0px none;" + (def.css || "");

        arguments.callee.__super__.apply(this, arguments);
        
        this.setAttribute("frameBorder", "0");

        if(def.src){
            this.setSrc(def.src);
        }

        Event.attachEvent(this.view, "load", 0, this, this.onload);
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
 *   B             C             
 *   |-------------|
 *   |             |
 *   |-------------|
 *   A             D
 */
js.awt.LayerManager = function(def, Runtime, view){
    
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
            //  contents, the following position will be optimum.
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
            //  contents, the following position will be optimum.
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

			// Do somthing while the layer is appended
			layer.onLayerAppended();
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

    thi$._init = function(def, Runtime, view){
        
        arguments.callee.__super__.apply(this, arguments);
        
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

js.awt.Desktop = function (Runtime){

    var CLASS = js.awt.Desktop, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ =J$VM.MQ, R;


    var _activateComponent = function(target, uuid){
        if(!target) return;

        if(target.activateComponent){
            target.activateComponent();
        }
    };

    var _notifyLM = function(e){
        if(e){
            var el = e.srcElement, target = e.getEventTarget(),
                uuid = el ? el.uuid : undefined;
            this.LM.cleanLayers(e, this);
            _activateComponent(target, uuid);
        }
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

    var bodyW, bodyH;
    var _onresize = function(e){
        System.updateLastAccessTime();

        var bounds = DOM.getBounds(document.body), evt;
        if(bounds.width != bodyW || bounds.height != bodyH){
            evt = new Event(Event.W3C_EVT_RESIZE,
                            {owidth: bodyW, oheight: bodyH,
                             width: bounds.width, height: bounds.height});
            
            _notifyComps.call(this, "js.awt.event.WindowResized", evt);

            this.LM.clearStack(e);

            bodyW = bounds.width;
            bodyH = bounds.height;

            for(var appid in apps){
                this.getApp(appid).fireEvent(e);
            }
        }
    };

    var _onkeyevent = function(e){
        System.updateLastAccessTime();
        MQ.post("js.awt.event.KeyEvent", e);
    };

    var _onmouseevent = function(e){
        System.updateLastAccessTime();
        MQ.post("js.awt.event.MouseEvent", e);
        
        switch(e.getType()){
            case Event.W3C_EVT_MOUSE_DOWN:
            case Event.W3C_EVT_MOUSE_WHEEL:
            return _notifyLM.call(this, e);

            case Event.W3C_EVT_CONTEXTMENU:
            e.cancelBubble();
            return e.cancelDefault();
            
            default:
            break;
        }
    };
    
    var _onmessage = function(e){
        var _e = e.getData();
        if(_e.source == self) return;

        var msg;
        try{
            msg = JSON.parse(_e.data);
        } catch (x) {
        }

        if(Class.isArray(msg)){
            e.message = msg[1];
            MQ.post(msg[0], e, msg[2], null, msg[4]);
        }
    };

    var apps = {};

    thi$.getApps = function(){
        return apps;
    };
    
    thi$.getApp = function(id){
        return apps[id];
    }

    thi$.registerApp = function(id, app){
        apps[id] = app;
    };

    thi$.unregisterApp = function(id){
        delete apps[id];
    };
    
    thi$.showCover = function(b, style){
        arguments.callee.__super__.call(
            this, b, style || "jsvm_desktop_mask");
        if(b){
            this.setCoverZIndex(_getMaxZIndex.call(this)+1);
        }
    }.$override(this.showCover);

    
    var _getMaxZIndex = function(){
        var children = this.view.children, zIndex = 0, tmp, e;
        for(var i=0, len=children.length; i<len; i++){
            e = children[i];
            tmp = parseInt(DOM.currentStyles(e, true).zIndex);
            tmp = Class.isNumber(tmp) ? tmp : 0;
            zIndex = Math.max(zIndex, tmp);
        }
        return zIndex;
    };

    var styles = ["jsvm.css"];
    /**
     * @param files {Array} Array of style file names
     */
    thi$.registerStyleFiles = function(files){
        if(Class.isArray(files)){
            for(var i=0, len=files.length; i<len; i++){
                styles.push(files[i]);
            }

            this.updateTheme(R.theme());
        }
    };

    thi$.updateTheme = function(theme, old){
        for(var i=0, len=styles.length; i<len; i++){
            this.updateThemeCSS(theme, styles[i]);
        }
        this.applyCSS();
        this.updateThemeImages(theme, old);
    };

    var IMGSREG = /images\//gi;
    
    thi$.updateThemeCSS = function(theme, file){
        var stylePath = DOM.makeUrlPath(J$VM.j$vm_home, "../style/" + theme + "/"),
            styleText = Class.getResource(stylePath + file, true);

        styleText = styleText.replace(IMGSREG, stylePath+"images/");
        this.applyCSSCode(file, styleText);
    };

    thi$.updateThemeLinks = function(theme, old, file){
        var dom = self.document, links, link, src, path, found;
        
        path = DOM.makeUrlPath(J$VM.j$vm_home,
                               "../style/"+ old +"/");

        links = dom.getElementsByTagName("link");
        for(var i=0, len=links.length; i<len; i++){
            link = links[i];
            src = decodeURI(link.href);
            if (src && src.indexOf(path) != -1){
                src = src.replace(old, theme);
                link.href = src;
                found = true;
            }
        }

        if(!found){
            link = dom.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = DOM.makeUrlPath(J$VM.j$vm_home, "../style/"+theme+"/"+file);
            DOM.insertBefore(link, dom.getElementById("j$vm"));
        }
    };

    thi$.updateThemeImages = function(theme, old){
        var dom = self.document, links, link, src, path;
        
        path = DOM.makeUrlPath(J$VM.j$vm_home,
                               "../style/"+ old +"/images/");
        
        links = dom.getElementsByTagName("img");
        for(var i=0, len=links.length; i<len; i++){
            link = links[i];
            src = decodeURI(link.src);
            if (src && src.indexOf(path) != -1){
                src = src.replace(old, theme);
                link.src = src;
            }
        }
    };

    thi$.cssIds = [];
    thi$.cssCodes = {};
    /**
     * Apply a stylesheet with id and css code
     * 
     * @param id {String} id of the style tag
     * @param css {String} CSS code
     */
    thi$.applyCSSCode = function(id, css){
        var sheets = this.cssIds, set = this.cssCodes;

        if(set[id] === undefined){
            sheets.push(id);
        }
        set[id] = css;
    };

    thi$.applyCSS = function(){
        var styleSheet, sheets=this.cssIds,
            set = this.cssCodes, buf, css;
        
        styleSheet = DOM.getStyleSheetBy("j$vm-css");

        buf = [];
        for(var i=0, len=sheets.length; i<len; i++){
            buf.push(set[sheets[i]]);
        }
        css = buf.join("\r\n");

        styleSheet.applyCSS(css);
    };
    
    /**
     * @see js.awt.BaseComponent
     */
    thi$.destroy = function(){
        var id, app;
        for(id in apps){
            app = apps[id];
            app.closeApp();
            app.destroy();
        }
        apps = null;

        this.DM.destroy();
        this.DM = null;

        this.LM.destroy();
        this.LM = null;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$._init = function(Runtime){
        var dom = self.document, body = dom.body,        
            def = {
                classType: "js.awt.Desktop",
                className: body.className,
                id: body.id,
                uuid: "desktop",
                zorder:true,
                stateless: true,            
                zbase:1,
                __contextid__: Runtime.uuid()
            };

        arguments.callee.__super__.apply(this, [def, Runtime, body]);

        // Popup Layer manager
        var LM = this.LM = new js.awt.LayerManager(
            {classType: "js.awt.LayerManager",
             className: body.className,
             id: body.id,
             zorder:true,
             stateless: true,
             zbase: 10000
            }, Runtime, body);

        // Popup dialog manager
        var DM = this.DM = new js.awt.Container(
            {classType: "js.awt.Container",
             className: body.className,
             id: body.id,
             zorder:true,
             stateless: true,
             zbase: 1000
            }, Runtime, body);

        DM.destroy = function(){
            this.removeAll(true);

        }.$override(DM.destroy);

        var styleText = Class.getResource(
            J$VM.j$vm_home + "../style/jsvm_reset.css", true);
        this.applyCSSCode("jsvm_reset.css", styleText);
        
        Event.attachEvent(self, Event.W3C_EVT_RESIZE, 0, this, _onresize);
        Event.attachEvent(self, Event.W3C_EVT_MESSAGE,0, this, _onmessage);

        Event.attachEvent(dom,  Event.W3C_EVT_KEY_DOWN,   0, this, _onkeyevent);
        Event.attachEvent(dom,  Event.W3C_EVT_KEY_UP,     0, this, _onkeyevent);
        
        Event.attachEvent(dom,  Event.W3C_EVT_MOUSE_MOVE, 0, this, _onmouseevent);
        Event.attachEvent(dom,  Event.W3C_EVT_MOUSE_DOWN, 0, this, _onmouseevent);       
        Event.attachEvent(dom,  Event.W3C_EVT_MOUSE_WHEEL,0, this, _onmouseevent);
        Event.attachEvent(dom,  Event.W3C_EVT_CONTEXTMENU,0, this, _onmouseevent);
        
        MQ.register("js.awt.event.LayerEvent", this, _notifyLM);

        R = Runtime;

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
                this.showtitlebutton(true);
                break;
            case 1:
            case 3:
                this.showtitlebutton(false);
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
                        this.showtitlebutton(true);
                    }else{
                        this.showtitlebutton(false);
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
                    this.showtitlebutton(false);
                }
            }
            this.setHover(false);
            break;
        }
    };

    thi$.showtitlebutton = function(b){
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

    thi$.destroy = function(){
        delete this._local.restricted;
        arguments.callee.__super__.apply(this,arguments);
    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime, view){
        if(def == undefined) return;
        
        var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
        newDef.css = def.css || "";

        var titleDef = newDef.title;
        titleDef.className = titleDef.className 
            || DOM.combineClassName(newDef.className, "title");

        (function(name){
             var item = titleDef[name];
             if(name.indexOf("lab") == 0){
                 item.className = item.className 
                     || DOM.combineClassName(titleDef.className, "label");
                 item.css = (item.css || "") + "white-space:nowrap;"
                     + "test-overflow:ellipsis;"
                     + "overflow:hidden;cursor:default;";
             }else if(name.indexOf("btn") == 0){
                 item.className = item.className 
                     || DOM.combineClassName(titleDef.className, "button"); 
             }
         }).$forEach(this, titleDef.items);

        newDef.client.className = newDef.client.className 
            || DOM.combineClassName(newDef.className, "client");

        System.objectCopy(newDef, def, true, true);
        arguments.callee.__super__.apply(this, arguments);
        view = this.view;
        view.style.position = "absolute";
        view.style.overflow = "hidden";

        // For MoverSpot testing
        var restricted = this._local.restricted = js.util.LinkedList.$decorate([]);

        var uuid = this.uuid();
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

        MQ.register("js.awt.event.ButtonEvent",
                    this, js.awt.Button.eventDispatcher);
        
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
 * Author: Hu dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * 
 */
js.awt.Application = function(def, Runtime, entryId){

    var CLASS = js.awt.Application, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ, Desktop;

    thi$.getAppID = function(){
        return this.uuid();
    };

    thi$.startApp = function(){
        if(this.view != this._local.entry){
            this.appendTo(this._local.entry);            
        }
    };

    thi$.closeApp = function(){
        if(this.view != this._local.entry){
            this.removeFrom(this._local.entry);
        }
        Desktop.unregisterApp(this.getAppID());
    };

    thi$.run = function(fn){
        if(Class.isFunction(fn)){
            fn.call(this);
        }
        this.startApp();
    };

    thi$.changeTheme = function(theme, old){
        Desktop.updateTheme(theme, old);
    };

    var _onresize = function(e){
        if(Class.isFunction(this.onresize)){
            this.onresize(e);
        }else{
            this.doLayout(true);
        }
        return e.cancelBubble();
    };

    thi$.destroy = function(){
        this.closeApp();
        
        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime, entryId){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Application";
        def.className = def.className || "jsvm_app";
        def.className = "jsvm__entry " + def.className;
        def.id = def.uuid = entryId;
        def.__contextid__ = Runtime.uuid();

        var entry = self.document.querySelector("[jsvm_entry='"+entryId+"']");
        
        if(entry.getAttribute("jsvm_asapp")){
            arguments.callee.__super__.call(this, def, Runtime, entry);
        }else{
            arguments.callee.__super__.call(this, def, Runtime);            
        }

        this._local.entry = entry;

        this.putContextAttr("appid", this.getAppID());
        this.putContextAttr("app", this);
        
        this.attachEvent(Event.W3C_EVT_RESIZE, 4, this, _onresize);
        MQ.register("js.awt.event.ButtonEvent",
                    this, js.awt.Button.eventDispatcher);

        Desktop = Runtime.getDesktop();
        
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
        this.client.addComponent(dialogObj,"center");

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
            var event = this.buildDialogEvent(b ? "show" : "hide", false);
            this.notifyPeer(event.msgId, event);
        }
    };

    thi$.show = function(){
        _showMaskCover.call(this, true);

        var x = this.def.x, y = this.def.y,
            DM = this.Runtime().getDesktop().DM,
            pox = DM.getBounds();
        
        if(x == undefined){
            x = (pox.width - this.def.width)*0.5;
            x = x < 0 ? 0:x; 
        }
        
        if(y == undefined){
            y = (pox.height- this.def.height)*0.5;
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

    /**
     * Handler for buttons except "btnOK", "btnCancel", "btnApply",
     * "btnClose", "btnHelp".
     * 
     * Subclass and the dialog instance ojbect can override it if
     * need.
     */
    thi$.onbtnDispatcher = function(button){
        var btnId = button.id || "", idx = btnId.indexOf("btn"),
            cmd, event;

        if(idx >= 0){
            cmd = btnId.substr(idx + 3);
            cmd = cmd.toLowerCase();
        }

        event = this.buildDialogEvent(cmd || btnId, true);
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
        var peer = this.getPeerComponent(),
            handler = this._local.handler;

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
    var R = J$VM.Runtime;
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
                labelText: R.nlsText("btnApply", "Apply"),
                effect: true
            },

            btnOK:{
                classType: "js.awt.Button",
                className: "jsvm_button",
                labelText: R.nlsText("btnOK", "OK"),
                effect: true
            },

            btnCancel:{
                classType: "js.awt.Button",
                className: "jsvm_button",
                labelText: R.nlsText("btnCancel", "Cancel"),
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
    var R = J$VM.Runtime;
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
                labelText: R.nlsText("btnOK", "OK"),
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
 *	   model:{
 *		  msgType:	  info|warn|error|confirm
 *		  msgSubject: Any string
 *		  msgContent: Any string
 *	   }
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
			label = this.label, text = this.text, h, top;
			
			if(label){
				DOM.setSize(label,
							bounds.innerWidth - label.offsetLeft);
				h = icon.offsetHeight - label.offsetHeight;
				h = icon.offsetTop + (h > 0 ? h/2 : 0);
				DOM.setPosition(label, undefined, h);
			}else{
				h = icon.offsetHeight > text.offsetHeight; 
				top = icon.offsetTop + (h > 0 ? h / 2 : 0);
				DOM.setPosition(text, undefined, top);
			}

			DOM.setSize(text,
						bounds.innerWidth - text.offsetLeft, 
						bounds.innerHeight	- text.offsetTop);

			return true;
		}

		return false;

	}.$override(this.doLayout);

	thi$.initialize = function(){
		var m = this.def.model, title = m.title, R = this.Runtime();
		if(!title){
			switch(m.msgType){
			    case CLASS.INFO:
				title = R.nlsText("msgDlgInfoTitle", "Information");
				break;
			    case CLASS.WARN:
				title = R.nlsText("msgDlgWarnTitle", "Warning");
				break;
			    case CLASS.ERROR:
				title = R.nlsText("msgDlgErrTitle", "Error");
				break;
			    case CLASS.CONFIRM:
                title = R.nlsText("msgDlgConfirmTitle", "Confirm");
                break;
            }
		}
		this.setTitle(title || "");

	}.$override(this.initialize);

	var _createElements = function(model){
		var icon, label, text, R = this.Runtime();

		icon = this.icon = DOM.createElement("IMG");
		icon.className = "msg_icon";
		icon.src = R.imagePath() + icons[model.msgType];
		this.view.appendChild(icon);

		if(model.msgSubject){
			label = this.label = DOM.createElement("SPAN");
			label.className = label.className + " msg_subject";
			label.innerHTML = model.msgSubject;
			this.view.appendChild(label);
		}

		text = this.text = DOM.createElement("TEXTAREA");
		text.className = text.className + " msg_content";
		text.readOnly = "true";
		text.innerHTML = model.msgContent || "";
		this.view.appendChild(text);
	};

	thi$._init = function(def, Runtime){

		def.classType = def.classType || "js.awt.MessageBox";
		def.className = def.className || "jsvm_msg";

		arguments.callee.__super__.apply(this, arguments);

		var model = this.def.model || {
			msgType:	"info",
			msgSubject: "Info subject",
			msgContent: "Info content"
		};

		_createElements.call(this, model);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(js.awt.DialogObject);

(function(){
    var CLASS = js.awt.MessageBox;
    CLASS.INFO = "info";
    CLASS.WARN = "warn";
    CLASS.ERROR= "error";
    CLASS.CONFIRM = "confirm";
})();


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
 * For examples: var color1 = new js.awt.Color(51, 61, 71); var color2 = new
 * js.awt.Color("#333D47"); var color3 = new js.awt.Color(0x333D47);
 */
js.awt.Color = function(r, g, b, a) {
    
    var CLASS = js.awt.Color, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;

    //HSL from 0 to 240;
    CLASS.DEFAULT_MIN_LUM = 180;
    CLASS.DEFAULT_MAX_LUM = 230;

    //RGB results from 0 to 255
    CLASS.RGB2HSL = function(R, G, B) {
        var vmax, vmin, delta;

        R = R / 255; G = G / 255; B = B / 255;

        vmin = Math.min(R, G, B);
        vmax = Math.max(R, G, B);
        delta = vmax - vmin;
        
        var h, s, l, dr, dg, db;
        l = (vmax+vmin) / 2;
        
        if (0 == delta) {
            h = 0;
            s = 0;
        } else {
            if (l < 0.5) {
                s = delta / (vmax+vmin);
            } else {
                s = delta / (2-vmax-vmin);
            }

            dr = (((vmax-R)/6) + (delta/2))/delta;
            dg = (((vmax-G)/6) + (delta/2))/delta;
            db = (((vmax-B)/6) + (delta/2))/delta;

            if (R == vmax)
                h = db - dg;
            else if (G == vmax)
            h = (1.0/3.0) + dr - db;
            else if (B == vmax)
            h = (2.0/3.0) + dg - dr;

            if (h < 0)
                h += 1;
            if (h > 1)
                h -= 1;
        }   
        
        h = Math.round(h*240);
        s = Math.round(s*240);
        l = Math.round(l*240);
        
        return {H: h, S: s, L: l};
    };

    CLASS.HSL2RGB = function(H, S, L) {
        H = H / 240; S = S / 240; L = L / 240;
        
        var r, g, b, temp1, temp2;
        if (S == 0) {
            r = L * 255;    //RGB results from 0 to 255
            g = L * 255;
            b = L * 255;
        } else {
            if (L < 0.5){
                temp2 = L * (1 + S);
            } else {
                temp2 = (L + S) - (S * L); 
            }
            
            temp1 = 2 * L - temp2;
            
            r = 255 * _Hue2RGB(temp1, temp2, H + (1 / 3)); 
            g = 255 * _Hue2RGB(temp1, temp2, H); 
            b = 255 * _Hue2RGB(temp1, temp2, H - (1 / 3));
        }
        
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
        
        return {R: r, G: g, B: b};
    };

    var _Hue2RGB = function(v1, v2, vH) {
        if (vH < 0) vH += 1;

        if (vH > 1) vH -= 1;
        
        if ((6 * vH) < 1) 
            return v1 + (v2 - v1) * 6 * vH; 
        if ((2 * vH) < 1) 
            return v2; 
        if ((3 * vH) < 2) 
            return v1 + (v2 - v1) * ((2 / 3) - vH) * 6; 
        
        return v1;
    };

    CLASS.parseColorString = function(s){
        var v = 0xFF000000;
        if (s.indexOf("#") == 0) {
            v = parseInt(s.substring(1), 16);
        }else if(s.toLowerCase() == "transparent" || s.indexOf("rgba") == 0){
            v = 0x00FF << 24;        
        }else if(s.indexOf("rgb") == 0){
            s = s.substring(s.indexOf("(")+1, s.indexOf(")"));
            var arr = s.split(","),
            r = parseInt(arr[0]),
            g = parseInt(arr[1]),
            b = parseInt(arr[2]),
            a = parseInt(arr[3]) || 0;

            v = _makeValue(r,g,b,a);
        }

        return v;
    };

    CLASS.randomColor = function(uuid, type){
        uuid = uuid || js.lang.Math.uuid();
        var v = parseInt(uuid.substring(1), 16),
            c = new js.awt.Color(v), ret;
        
        if(c.A() == 0){
            c.value |= 0x01<<24;
        }

        type = type || "obj";

        switch(type){
        case "obj":
            ret = c;
            break;
        default:
            ret = c.toString(type);
            break;
        }
        return ret;
    };

    /**
     * @param sColor: start Color
     * @param eColor: stop Color
     * @param min
     * @param max
     * @param value
     *
     * @return Color
     */
    CLASS.gradient = function(sColor, eColor, min, max, value){
        sColor = Class.isObject(sColor) ? sColor : new CLASS(sColor);
        eColor = Class.isObject(eColor) ? eColor : new CLASS(eColor);
        
        var Rs = sColor.R(), Re = eColor.R(),
            Gs = sColor.G(), Ge = eColor.G(),
            Bs = sColor.B(), Be = eColor.B(),
            As = sColor.A(), Ae = eColor.A(),

            Rn = Re - Rs, Gn = Ge - Gs, Bn = Be - Bs, An = Ae - As,
            range = max != min ? max - min : 1, 
            v = value - min,
            s = v/range,
            
            r = Rs + s * Rn,
            g = Gs + s * Gn,
            b = Bs + s * Bn,
            a = As + s * An;

        return new CLASS(r,g,b,a);
    };


    var _makeValue = function(r,g,b,a){
        a = Class.isNumber(a) ? a : 0x00;

        return ((a & 0x00FF) << 24) | 
            ((r & 0x00FF) << 16) | 
            ((g & 0x00FF) << 8)  | 
            ((b & 0x00FF) << 0);
    };

    thi$.setRGBA = function(r, g, b, a) {
        this.value = _makeValue(r,g,b,a);
    };

    thi$.getRGB = function() {
        return this.value;
    };

    thi$.R = function() {
        return (this.value >> 16) & 0x00FF;
    };

    thi$.G = function() {
        return (this.value >> 8) & 0x00FF;
    };

    thi$.B = function() {
        return (this.value >> 0) & 0x00FF;
    };

    thi$.A = function() {
        return (this.value >> 24) & 0x00FF;
    };
    
    thi$.getHSL = function() {
        return CLASS.RGB2HSL(this.R(), this.G(), this.B());
    };

    thi$.toString = function(type) {
        var ret, buf, tmp, s;

        type = type || "hex";

        switch(type){
        case "hex":
            if (this.A() != 0) {
                ret =  "Transparent";
            } else {
                tmp = this.value & 0x00FFFFFF;
                s = "00000" + tmp.toString(16);
                ret = "#" + s.substring(s.length - 6);
            }
            break;
        case "rgb":
            buf = new js.lang.StringBuffer("rgb(");
            buf.append(this.R()).append(",")
                .append(this.G()).append(",")
                .append(this.B()).append(")");
            ret = buf.toString();
            break;
        case "rgba":
            buf = new js.lang.StringBuffer("rgba(");
            buf.append(this.R()).append(",")
                .append(this.G()).append(",")
                .append(this.B()).append(",")
                .append(this.A()).append(")");
            ret = buf.toString();
            break;
        case "uuid":
            tmp = Math.abs(this.value);
            s = "0000000" + tmp.toString(16);
            ret = "s" + s.substring(s.length - 8); 
            break;
        }
        return ret;
    };

    thi$._init = function() {
        var s;
        switch (arguments.length) {
        case 1 :
            s = arguments[0];
            if (Class.isNumber(s)) {
                this.value = s & 0x0000FFFFFFFF;
            } else if (Class.isString(s)) {
                s = s.trim();
                this.value = CLASS.parseColorString(s);
            } else {
                this.value = 0xFF000000;
            }
            break;
        case 3 :
        case 4 :
            this.setRGBA(arguments[0], arguments[1], arguments[2], arguments[3]);
            break;
        default :
            this.value = 0xFF000000;
        }
    };

    this._init.apply(this,arguments);

};

new js.awt.Color(0);

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
 * 
 */
js.awt.Font = function(family, size, style, weight, variant){

    var CLASS = js.awt.Font, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;

    
    thi$.toString = function(){
        var buf = [], v, h;

        v = this.fontStyle;
        if(v && v !== "normal"){
            buf.push(v);
        }

        v = this.fontVariant;
        if(v && v !== "normal"){
            buf.push(v);
        }

        v = this.fontWeight;
        if(v && v !== "normal"){
            buf.push(CLASS.Weight[v]);
        }

        v = parseInt(this.fontSize);
        v = Class.isNumber(v) ? v : 10;
        v += "px";
        
        h = parseInt(this.lineHeight);
        if(Class.isNumber(h)){
            v += ("/" + h + "px");
        }
        buf.push(v);
        
        v = this.fontFamily;
        v = v || "sans-serif";
        buf.push(v);

        return buf.join(" ");
    };

    thi$._init = function(family, size, style, weight, variant, lineHeight){
        this.fontFamily = family;
        this.fontSize   = size;
        this.lineHeight = lineHeight;
        this.fontStyle  = style;
        this.fontWeight = weight;
        this.fontVariant= variant;
    };
    
    this._init.apply(this, arguments);
};

js.awt.Font.Attrs = [
    "fontStyle", 
    "fontVariant", 
    "fontWeight", 
    "fontSize", 
    "fontFamily"];

js.awt.Font.Style = {
    normal: "normal",
    italic: "italic",
    oblique: "oblique"
};

js.awt.Font.Variant = {
    normal: "normal",
    "small-caps": "small-caps"
};

js.awt.Font.Weight = {
    normal: "normal",
    bold: "bold",
    bolder: "bolder",
    lighter: "ligher",
    "100": "normal",
    "200": "normal",
    "300": "normal",
    "400": "normal",
    "500": "normal",
    "600": "bold",
    "700": "bold",
    "800": "bold",
    "900": "bold"
};

/**
 * Parse js.awt.Font from css font string which like:
 * 
 * font-style font-variant font-weight font-size/line-height font-family
 *
 * "italic small-caps bold 16px Arial"
 */
js.awt.Font.parseFont = function(str){
    var s = str.split(" "), Font = js.awt.Font, 
        tmp, v, font = new Font();
    
    if(s.length > 0){
        font.fontFamily = s.pop();
    }

    if(s.length > 0){
        tmp = s.pop();
        tmp = tmp.split("/");
        font.fontSize = parseInt(tmp[0]);
        if(tmp.length > 1){
            font.lineHeight = parseInt(tmp[1]);
        }
    }
    
    if(s.length > 0){
        tmp = s.pop();
        if(Font.Weight[tmp]){
            font.fontWeight = Font.Weight[tmp];
        }else if (Font.Variant[tmp]){
            font.fontVariant = tmp;
        }else if(Font.Style[tmp]){
            font.fontStyle = tmp;
        }
    }

    if(s.length > 0){
        tmp = s.pop();
        if (Font.Variant[tmp]){
            font.fontVariant = tmp;
        }else if(Font.Style[tmp]){
            font.fontStyle = tmp;
        }
    }

    if(s.length > 0){
        tmp = s.pop();
        font.fontStyle = tmp;
    }

    return font;
};

/**
 * Initialize a font object with the specified font styles.
 */
js.awt.Font.initFont = function(fontStyles){
    var Font = js.awt.Font, font;
    if(typeof fontStyles == "object"){
        font = new Font(fontStyles["fontFamily"], fontStyles["fontSize"], 
                        fontStyles["fontStyle"], fontStyles["fontWeight"], 
                        fontStyles["fontVariant"], fontStyles["lineHeight"]);
    }else{
        font = new Font();
    }
    
    return font;
};


/**
 * Ref: https://developer.mozilla.org/en-US/docs/CSS/font-weight
 * 
 * 100, 200, 300, 400, 500, 600, 700, 800, 900
 * Numeric font weights for fonts that provide more than just normal and bold. 
 * If the exact weight given is unavailable, then 600-900 use the closest available 
 * darker weight (or, if there is none, the closest available lighter weight), 
 * and 100-500 use the closest available lighter weight (or, if there is none, 
 * the closest available darker weight). This means that for fonts that provide only 
 * normal and bold, 100-500 are normal, and 600-900 are bold.
 */
js.awt.Font.FFCANVASFONTWEIGHTS = {
    "normal": "normal",
    "bold": "bold",
    "lighter": "lighter",
    "bolder": "bolder",
    "100": "normal",
    "200": "normal",
    "300": "normal",
    "400": "normal",
    "500": "normal",
    "600": "bold",
    "700": "bold",
    "800": "bold",
    "900": "bold"
};

/**
 * convert from FontDef.java
 */
js.awt.Font.STYLE_BOLD = 1 << 0;
js.awt.Font.STYLE_ITALIC = 1 << 1;

js.awt.Font.isFontBold = function(fontStyle){
    return (fontStyle & js.awt.Font.STYLE_BOLD) != 0;
};

js.awt.Font.isFontItalic = function(fontStyle){
    return (fontStyle & js.awt.Font.STYLE_ITALIC) != 0;
};

js.awt.Font.getFontStyle = function(isBold,isItalic){
    var fontStyle = 0;
    var Font = js.awt.Font;
    if (isBold) {
        fontStyle |= Font.STYLE_BOLD;
    } else {
        fontStyle &= ~Font.STYLE_BOLD;
    }
    if (isItalic) {
        fontStyle |= Font.STYLE_ITALIC;
    } else {
        fontStyle &= ~Font.STYLE_ITALIC;
    }
    return fontStyle;
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
 * @param def:{
 *     rowNum: m,
 *     colNum: n,
 *     rows:[{index, measure, rigid, weight, visible},{}...],
 *     cols:[{index, measure, rigid, weight, visible},{}...],
 *     cells:[
 *       {rowIndex, colIndex, rowSpan, colSpan, paddingTop...},
 *       ...
 *     ],
 *     cellpadding: [t, r, b, l]
 * }
 */
js.awt.Grid = function(def){

    var CLASS = js.awt.Grid, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Object = js.lang.Object,
        System = J$VM.System;
    
    thi$.rowNum = function(){
        return this.rows.length;
    };
    
    thi$.colNum = function(){
        return this.cols.length;
    };
    
    thi$.row = function(index){
        return this.rows[index];
    };
    
    thi$.column = function(index){
        return this.cols[index];
    };
    
    thi$.cell = function(rowIndex, colIndex){
        return this.acells[rowIndex][colIndex];
    };
    
    /**
     * Extract cells array to valid cells list
     */
    thi$.extractCells = function(force){
        var cells = (force === true) ? null : this.cells;

        if(!Class.isArray(cells)){
            cells = [];
            var acells = this.acells,
                rowNum = this.rowNum(),
                colNum = this.colNum(), 
                i, j, cell;
            
            for(i=0; i<rowNum; i++){
                for(j=0; j<colNum; j++){
                    cell = acells[i][j];
                    if(Class.isObject(cell)){
                        cell.rowIndex = i;
                        cell.colIndex = j;
                        cells.push(cell);
                    }
                } 
            }

            this.cells = cells;
        }

        return cells;
    };
    
    /**
     * Expand valid cells list to a rowNum x colNum cells array 
     */
    thi$.expandCells = function(force){
        var acells = (force === true) ? null :  this.acells;

        if(!Class.isArray(acells)){
            var rowNum = this.rowNum(), colNum = this.colNum(),
                cells = this.cells, cell, i, ilen;

            acells = new Array(rowNum);
            for(i=0; i<rowNum; i++){
                acells[i] = new Array(colNum);
            }
            
            for(i=0, ilen=cells.length; i<ilen; i++){
                cell = cells[i];
                acells[cell.rowIndex][cell.colIndex] = cell;
            }

            this.acells = acells;
        }

        return acells;
    };

    /**
     * Set attributes of a specified row.
     * 
     * @param index, row index
     * @param attrs, an object which include one or more following attributes 
     * "rigid", "measure", "weight", "visible". 
     */
    thi$.rowAttrs = function(index, attrs){
        _dimAttrs.call(this, this.rows, index, attrs);
    };

    /**
     * Set attributes of a specified column.
     * 
     * @param index, column index
     * @param attrs, an object which include one or more following attributes 
     * "rigid", "measure", "weight", "visible". 
     */
    thi$.colAttrs = function(index, attrs){
        _dimAttrs.call(this, this.cols, index, attrs);
    };

    var _dimAttrs = function(dims, index, attrs){
        var dim, p;
        if(Class.isObject(attrs) && 
           (index>=0 && index < dims.length)){
            dim = dims[index];
            for(p in attrs){
                if(attrs.hasOwnProperty(p)){
                    switch(p){
                    case "rigid":
                        if(dim.rigid !== attrs.rigid){
                            dim.rigid = attrs.rigid;
                            dims.dirty |= 0x01; // need re-calc weight
                        }
                        break;
                    case "visible":
                        if(dim.visible !== attrs.visible){
                            dim.visible = attrs.visible;
                            dims.dirty |= 0x01; // need re-calc weight
                        }
                        break;
                    default:
                        dim[p] = attrs[p];                  
                    }
                }
            }
        }
    };

    // Judge and merge areas of line segments with the same starting point. 
    var _mergeArea = function(set, index, area, isV){
        var preIndex, preArea, nextIndex, nextArea, p0, p1;
        for(var i = index; i >= 0; i--){
            preArea = set[i];
            if(preArea){
                preIndex = i;                
                break;
            }
        }
        
        for(var j = index + 1, len = set.length; j < len; j--){
            nextArea = set[j];
            if(nextArea){
                nextIndex = j;
                break;
            }
        }
        
        p0 = isV ? "y0" : "x0";
        p1 = isV ? "y1" : "x1";
        
        if((preArea && preArea[p0] <= area[p0]
            && preArea[p1] >= area[p1])){
            // Do nothing            
        }else if(preArea && preArea[p1] >= area[p0] 
                 && nextArea && nextArea[p0] <= area[p1]){
            preArea[p1] = nextArea[p1];
            set.splice(nextIndex, 1);
        }else if(preArea && preArea[p1] >= area[p0]){
            preArea[p1] = area[p1];
        }else if(nextArea && nextArea[p0] <= area[p1]){
            area[p1] = nextArea[p1];
            set.splice(nextIndex, 1);
            set[index] = area;
        }else{
            set[index] = area;
        }
        
        return set;
    };
    
    
    var _getHLineMatrix = function(lineMatrixes, cell){
        var rIndex = cell.rowIndex, cIndex = cell.colIndex,
            hlines = lineMatrixes.hlines, rowSpan = cell.rowSpan,
            x0 = cell.x, x1 = x0 + cell.width, 
            y0 = cell.y, y1 = y0 + cell.height,
            index, hline, xs;
        
        index = rIndex;
        hline = hlines[index] = hlines[index] || {y: y0, xs: []};
        xs = hline.xs;
        _mergeArea.call(this, xs, cIndex, {x0: x0, x1: x1}, false);
        
        index = rIndex + rowSpan;
        hline = hlines[index] = hlines[index] || {y: y1, xs: []};
        xs = hline.xs;
        _mergeArea.call(this, xs, cIndex, {x0: x0, x1: x1}, false);
    };
    
    var _getVLineMatrix = function(lineMatrixes, cell){
        var rIndex = cell.rowIndex, cIndex = cell.colIndex,
            vlines = lineMatrixes.vlines, colSpan = cell.colSpan,
            x0 = cell.x, x1 = x0 + cell.width, 
            y0 = cell.y, y1 = y0 + cell.height,
            index, vline, ys;
        
        index = cIndex;
        vline = vlines[index] = vlines[index] || {x: x0, ys: []};
        ys = vline.ys;
        _mergeArea.call(this, ys, rIndex, {y0: y0, y1: y1}, true);
        
        index = cIndex + colSpan;
        vline = vlines[index] = vlines[index] || {x: x1, ys: []};
        ys = vline.ys;
        _mergeArea.call(this, ys, rIndex, {y0: y0, y1: y1}, true);
    };
    
    var _getLineMatrix = function(lineMatrixes, cell){
        switch(lineMatrixes.level){
        case 0:
            _getHLineMatrix.apply(this, arguments);
            _getVLineMatrix.apply(this, arguments);
            break;
        case 1:
            _getHLineMatrix.apply(this, arguments);
            break;
        case 2:
            _getVLineMatrix.apply(this, arguments);
            break;
        default:
            break;
        }
    };
    
    var _compress = function(lines, prop){
        var len = lines ? lines.length : 0,
        line, p0, ps, pa, tmp, cnt;
        for(var i = 0; i < len; i++){
            line = lines[i];
            ps = line[prop];

            cnt = ps.length;
            if(cnt <= 1) continue;
            
            tmp = line[prop] = [];
            for(var j = 0; j < cnt; j++){
                pa = ps[j];
                if(pa){
                    tmp.push(pa);
                }
            }
        }
    };
    
    /**
     * Calculate and return all matrixes of lines.
     * 
     * lineMatrixes: {
     *     hlines: [
     *        {y: 0, xs:[{x0, x1}, {x0, x1}, ...]},
     *        ......
     *        {y: n, xs:[{x0, x1}, {x0, x1}, ...]}
     *     ],
     *     vlines: [
     *        {x: 0, ys:[{y0, y1}, {y0, y1}, ...]},
     *        ......
     *        {x: n, ys:[{y0, y1}, {y0, y1}, ...]} 
     *     ]
     * }
     * 
     * @param level: {0, 1, 2} 0 indicate the horizontal line matrixes
     *        to extract; 1 indicate the vertical line matrixes to extract;
     *        0 indicate all line matrixes to extract.
     * @param force: {Boolean} A boolean value to indicate whether the
     *        old matrixes ignored.
     */
    thi$.getLineMatrixes = function(level, force){
        if(level !== 1 && level !== 2){
            level = 0;
        }
        
        var lineMatrixes = this.lineMatrixes, cells = this.extractCells(),
        hlines, vlines;
        if(force !== true && lineMatrixes 
           && lineMatrixes.level == level){
            return lineMatrixes;
        }
        
        switch(level){
        case 1:
            lineMatrixes = {hlines: []};
            break;
        case 2:
            lineMatrixes = {vlines: []};
            break;
        default:
            lineMatrixes = {hlines: [], vlines: []};
            break;
        }
        
        lineMatrixes.level = level;
        this.lineMatrixes = lineMatrixes;
        
        for(var i = 0, len = cells.length; i < len; i++){
            _getLineMatrix.call(this, lineMatrixes, cells[i]);
        }
        
        hlines = lineMatrixes.hlines;
        if(hlines && hlines.length > 0){
            _compress.call(this, hlines, "xs");
        }
        
        vlines = lineMatrixes.vlines;
        if(vlines && vlines.length > 0){
            _compress.call(this, vlines, "ys");
        }
        
        // J$VM.System.err.println(lineMatrixes);
        return lineMatrixes;
    };

    thi$.layout = function(xbase, ybase, width, height){

        this.update();

        // Calculates height of every row
        _calcDimsMeasure.call(this, this.rows, ybase, height);

        // Calculates width of every column
        _calcDimsMeasure.call(this, this.cols, xbase, width);
        
        // Calculates width and height of every cell
        _calcCellsMeasure.call(this);
        
        // Invalidate lineMatrixes
        delete this.lineMatrixes;
    };

    /**
     * Update grid model
     *
     */
    thi$.update = function(){
        
        // Adjust weight
        if(this.rows.dirty & 0x01 !== 0){
            _adjustWeight.call(this, this.rows);
        }
        if(this.cols.dirty & 0x01 !== 0){
            _adjustWeight.call(this, this.cols);
        }

        if(this.acells){
            // Generate this.cells
            this.extractCells(true);
        }
    };

    var _adjustWeight = function(dims){

        var dim, i, len, weight = 1.0, v, tmps=[];

        for(i=0, len=dims.length; i<len; i++){
            dim = dims[i];

            if(!dim.rigid && dim.visible){
                v = dim.weight;
                if(Class.isNumber(v)){
                    weight -= v;
                }else{
                    tmps.push(dim);
                }
            }
        }

        if(tmps.length > 0){
            weight /= tmps.length;

            while(tmps.length > 0){
                tmps.shift().weight = weight;
            }
        }

        dims.dirty &= ~0x01;

    };
    
    var _initDims = function(dims, dimDefs){
        var dlen = dims.length, dimDef, dim, i, len, index, v;

        dims.dirty = 0;

        if(Class.isArray(dimDefs)){
            for(i=0, len=dimDefs.length; i<len; i++){
                dimDef = dimDefs[i];
                index = dimDef.index;
                if(index >=0 && index <dlen){
                    v = dimDef.measure;
                    dims[index] = {
                        visible: !(dimDef.visible === false),
                        measure: Class.isNumber(v) ? v : 0,
                        weight: dimDef.weight,
                        rigid: (dimDef.rigid === true)
                    };
                }
            }
        }

        for(i=0; i<dlen; i++){
            dim = dims[i];
            if(dim === undefined){
                dim = dims[i] = {visible:true, rigid:false};
            }
        }

        _adjustWeight.call(this, dims);
    };

    var _initCells = function(cells, cellDefs){
        var rows = this.rows, cols = this.cols, 
            m = rows.length, n = cols.length,
            cellDef, cell, i, j, len, rspan, cspan, 
            pt, pr, pb, pl, ri, cj, visible, 
            padding = this.cellpadding;

        // Initialize cell definition according to the definition
        if(Class.isArray(cellDefs)){
            for(i=0, len=cellDefs.length; i<len; i++){
                cellDef = cellDefs[i];
                ri = cellDef.rowIndex, cj = cellDef.colIndex;

                if(ri >=0 && ri < m && cj >=0 && cj < n){

                    rspan = cellDef.rowSpan; 
                    cspan = cellDef.colSpan;

                    pt = cellDef.paddingTop;
                    pr = cellDef.paddingRight;
                    pb = cellDef.paddingBottom;
                    pl = cellDef.paddingLeft;

                    cells[ri][cj] = {
                        rowSpan: Class.isNumber(rspan) ? rspan : 1,
                        colSpan: Class.isNumber(cspan) ? cspan : 1,
                        paddingTop: Class.isNumber(pt) ? pt : padding[0],
                        paddingRight: Class.isNumber(pr) ? pr : padding[1],
                        paddingBottom: Class.isNumber(pb) ? pb : padding[2],
                        paddingLeft: Class.isNumber(pl) ? pl : padding[3]
                    };
                }
            }
        }
        
        // Merge cell definition and initialize cell
        for(i=0; i<m; i++){
            for(j=0; j<n; j++){
                cell = cells[i][j];

                if(cell === null) continue;

                if(cell === undefined){
                    cell = cells[i][j] = {
                        rowSpan:1, 
                        colSpan:1,
                        paddingTop: padding[0],
                        paddingRight: padding[1],
                        paddingBottom: padding[2],
                        paddingLeft: padding[3]                     
                    };
                }

                visible = false;
                rspan = cell.rowSpan - 1;
                while(rspan >= 0){
                    cspan = cell.colSpan - 1;
                    while(cspan >= 0){
                        if(rspan !=0 || cspan != 0){
                            ri = i+rspan; cj = j+cspan;
                            cells[ri][cj] = null;
                            visible = visible || 
                                (rows[ri].visible && cols[cj].visible);
                        }
                        cspan--;
                    }
                    rspan--;
                }
                
                cell.visible = (visible || (rows[i].visible && cols[j].visible));
            }
        }
    };

    var _calcDimsMeasure = function(dims, base, total){
        var dim, i, len = dims.length, tmps = [];
        for(i=0; i<len; i++){
            dim = dims[i];
            if(!dim.visible) continue;

            if(dim.rigid){
                total -= dim.measure;
            }else{
                tmps.push(dim);
            }
        }
        
        var rest = total, v;
        while(tmps.length > 0){
            dim = tmps.shift();
            v = Math.round(total*dim.weight);
            rest -= v;
            dim.measure = v;
        }
        if(Class.isNumber(v)){
            dim.measure = (v + rest);
        }
        
        for(i=0; i<len; i++){
            dim = dims[i];
            dim.offset = base;
            base += dim.visible ? dim.measure : 0;
        }
    };
    
    var _calcCellsMeasure = function(){
        var cells = this.extractCells(), 
            cell, dim, span, offset, v, i, j, len;

        for(i=0, len=cells.length; i<len; i++){
            cell = cells[i];
            
            // For width
            offset = -1; v = 0;
            span = cell.colSpan;
            for(j=0; j<span; j++){
                dim = this.column(cell.colIndex + j);
                if(dim.visible === true){
                    v += dim.measure;

                    if(offset < 0){
                        offset = dim.offset;
                    }
                }
            }
            cell.x = offset;
            cell.width = v;
            cell.innerWidth = v - cell.paddingLeft - cell.paddingRight;

            // For height
            offset = -1; v = 0;
            span = cell.rowSpan;
            for(j=0; j<span; j++){
                dim = this.row(cell.rowIndex + j);
                if(dim.visible === true){
                    v += dim.measure;

                    if(offset < 0){
                        offset = dim.offset;
                    }
                }
            }
            cell.y = offset;
            cell.height = v;
            cell.innerHeight = v - cell.paddingTop - cell.paddingBottom;
        }
        
    };

    thi$._init = function(def){
        if(def == undefined) return;
        
        var m, n;
        
        this.cellpadding = def.cellpadding || [0,0,0,0];

        // Init rows
        m = def.rowNum;
        m = Class.isNumber(m) ? (m > 0 ? m : 1) : 1;
        this.rows = new Array(m);
        _initDims.call(this, this.rows, def.rows);
        
        // Init columns
        n = def.colNum;
        n = Class.isNumber(n) ? (n > 0 ? n : 1) : 1;
        this.cols = new Array(n);
        _initDims.call(this, this.cols, def.cols);
        
        // Init cells
        this.acells = new Array(m);
        for(var i=0; i<m; i++) this.acells[i] = new Array(n);
        _initCells.call(this, this.acells, def.cells);

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

js.awt.Bidirectional = function(){
    
    var CLASS = js.awt.Bidirectional, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    CLASS.HORIZONTAL = 0;
    CLASS.VERTICAL   = 1;

    var Class = js.lang.Class;
    
    thi$.isHorizontal = function(){
        return this.def.direction === CLASS.HORIZONTAL;
    };

    thi$.isVertical = function(){
        return !this.isHorizontal();
    };

    thi$.getStart = function(comp){
        comp = comp || this;
        return this.isHorizontal() ? 
            comp.getX() : comp.getY();
    };

    thi$.getPStart = function(comp){
        comp = comp || this;
        return this.isHorizontal() ? 
            comp.getY() : comp.getX();
    };

    thi$.getUPosition = function(comp){
        comp = comp || this;
        var p = comp.getPosition();
        if(this.isHorizontal()){
            p.start = p.x;
            p.pstart= p.y;
        }else{
            p.start = p.y;
            p.pstart= p.x;
        }

        return p;
    };

    thi$.setUPosition = function(start, pstart, fire, comp){
        comp = comp || this;
        if(this.isHorizontal()){
            comp.setPosition(start, pstart, fire);
        }else{
            comp.setPosition(pstart, start, fire);
        }
    };

    thi$.getMeasure = function(comp){
        comp = comp || this;
        return this.isHorizontal() ? 
            comp.getWidth() : comp.getHeight();
    };

    thi$.getPMeasure = function(comp){
        comp = comp || this;
        return this.isHorizontal() ? 
            comp.getHeight() : comp.getWidth();
    };

    thi$.getUSize = function(comp){
        comp = comp || this;
        var d = comp.getSize();
        if(this.isHorizontal()){
            d.measure  = d.width;
            d.pmeasure = d.height;
        }else{
            d.measure  = d.height;
            d.pmeasure = d.width;
        }
        return d;
    };

    thi$.setUSize = function(measure, pmeasure, fire, comp){
        comp = comp || this;
        if(this.isHorizontal()){
            comp.setSize(measure, pmeasure, fire);
        }else{
            comp.setSize(pmeasure, measure, fire);
        }
    };

    thi$.getUBounds = function(comp){
        comp = comp || this;
        var b = comp.getBounds(), MBP = b.MBP;
        if(this.isHorizontal()){
            b.measure = b.width;
            b.innerMeasure = b.innerWidth;
            b.pmeasure = b.height;
            b.innerPMeasure= b.innerHeight;

            MBP.borderM0 = MBP.borderLeftWidth;
            MBP.borderM1 = MBP.borderRightWidth;

            MBP.borderPM0 = MBP.borderTopWidth;
            MBP.borderPM1 = MBP.borderBottomWidth;

            MBP.BM = MBP.BW;
            
        }else{
            b.measure = b.height;
            b.innerMeasure = b.innerHeight;
            b.pmeasure = b.width;
            b.innerPMeasure= b.innerWidth;

            MBP.borderM0 = MBP.borderTopWidth;
            MBP.borderM1 = MBP.borderBottomWidth;

            MBP.borderPM0 = MBP.borderLeftWidth;
            MBP.borderPM1 = MBP.borderRightWidth;

            MBP.BM = MBP.BH;

        }
        return b;
    };

    thi$.setUBounds = function(start, pstart, measure, pmeasure, fire, comp){
        comp = comp || this;
        if(this.isHorizontal()){
            comp.setBounds(start, pstart, measure, pmeasure, fire);
        }else{
            comp.setBounds(pstart, start, pmeasure, measure, fire);
        }
    };

    thi$.setUEndStyle = function(v, comp){
        comp = comp || this;
        if(this.isHorizontal()){
            comp.view.style.right = v+"px";
        }else{
            comp.view.style.bottom= v+"px";
        }
    };

    thi$.setUMinimumSize = function(measure, pmeasure, comp){
        comp = comp || this;
        if(this.isHorizontal()){
            comp.setMinimumSize(measure, pmeasure);
        }else{
            comp.setMinimumSize(pmeasure, measure);
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

$import("js.awt.Bidirectional");

/**
 * @param def:{
 *     className: 
 *     id:
 *     
 *     direction: 0: horizontal, 1: vertical
 *     type: 0: single, 1: range
 *     
 *     duration: number of seconds
 * 
 *     tracemouse: 0: slipper center trace mouse
 *         1: slipper endpoint trace mouse, and keep range no change
 *         3: slipper endpoint trace mouse, another endpoint is fixed, 
 *            the range will changed.
 *          
 * }
 */
js.awt.Slider = function(def, Runtime){

    var CLASS = js.awt.Slider, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    thi$.isSingle = function(){
        return this.def.type === 0;
    };

    thi$.setDuration = function(duration){
        //var trackLen = this.getTrackLength(),
        //    grid = this.def.mover.grid;
        //this.def.duration = duration > trackLen/(grid*10) ?
        //    duration : trackLen/(grid*10) ;
        this.def.duration = duration;
    };
    
    thi$.getDuration = function(){
        return this.def.duration;
    };
    
    thi$.isPlaying = function(){
        return this.playing || false;
    };

    /**
     * If data count less than the track pixels, the slipper
     * will be snaped to grid.
     */    
    thi$.setDataCount = function(count){
        
        //if( !Class.isNumber(count) || count <= 0 )
        //throw "The data count must large than 0";
        

        this.datacount = count;
        _setMoverGrid.call(this, count);
    };
    
    /**
     * Return track length in pixel
     */
    thi$.getTrackLength = function(){
        return this.trackLen;
    };
    
    /**
     * Move the slipper to the begin of the track
     */
    thi$.first = function(){
        if(this.isFirst == true) return;
        var o = this.getOffset();
        this.setOffset(0, o.offset1p-o.offset0p);
    };
    
    /**
     * Move the slipper to the end of the track
     */
    thi$.last = function(){
        if(this.isLast == true) return;
        var o = this.getOffset();
        this.setOffset(o.offset0p+1-o.offset1p, 1);
    };

    /**
     * Return the slipper offset in track in pixel
     */
    thi$.getOffset = function(){
        
        var slipper = this.slipper, trackLen = this.getTrackLength(),
        grid = this.def.mover.grid, count = this.datacount,
        offset0 = slipper.getOffset0() - slipper.offset0,
        offset1 = slipper.getOffset1() - slipper.offset0,
        offset0p = offset0/trackLen,
        offset1p = offset1/trackLen,

        index0 = grid > 1 ? Math.round(offset0*(count-1)/trackLen) :
            Class.isBigInt(count) ? 
            count.minus(1).multiply(offset0).divid(trackLen).round() :
            Math.round(offset0p*(count-1)),

        index1 = grid > 1 ? Math.round(offset1*(count-1)/trackLen) : 
            Class.isBigInt(count) ? 
            count.minus(1).multiply(offset1).divid(trackLen).round() :
            Math.round(offset1p*(count-1));
        
        if(this.isPlaying()){
            index0 = grid > 1 ? Math.floor( offset0*(count-1)/trackLen ) : 
                Math.floor( offset0p*(count-1) ),
            index1 = grid > 1 ? Math.floor( offset1*(count-1)/trackLen ) : 
                Math.floor( offset1p*(count-1) );
        }
        
        return{
            offset0 : offset0,
            offset1 : offset1,
            offset0p: offset0p,
            offset1p: offset1p,
            index0 : index0,
            index1 : index1,
            count: count
        };
    };

    /**
     * Sets the slipper offset0 with percentage of track length
     *  
     * @param offset0 the percentage of track length, 0 to 1
     * @param offset1 the percentage of track length, 0 to 1
     */
    thi$.setOffset = function(offset0, offset1, doLayout){
        var slipper = this.slipper, trackLen = this.trackLen,
        p0 = Math.round(trackLen*offset0),
        p1 = Math.round(trackLen*offset1);

        if(this.isSingle()){
        	if(offset0 !== 0 && p0 === 0){
        		p0 = 1;
        	}
            slipper.setUPosition(p0, null, 0x07);    
        }else{
            var S = slipper.getSizeByRange(p1-p0);
            slipper.setUBounds(p0, null, S.measure, undefined, 0x07);
        }

        _layout.call(this, this.getUBounds(), doLayout !== false ? 1 :0);

    };

    thi$.play = function(b){
        b = b || false;
        
        if(this.playing == b) return;

        if(b){
            var o = this.getOffset();
            if(o.offset0p == 1) return; // End

            var t0 = new Date().getTime();
            this.timer = 
                _play.$delay(this, 0, o.offset0, t0);
            if(typeof this.onPlay == "function"){
                this.playing = true;
                this.onPlay();
            }
        }else{
            _play.$clearTimer(this.timer);
            delete this.timer;
            this.playing = false;
            if(typeof this.onStop == "function"){
                this.onStop();
            }
        }
    };
    
    var _play = function(b, t0){
        
        //delete this.timer;
        this.playing = true;
        
        var o = this.getOffset();

        var slipper = this.slipper, 
        c = this.getTrackLength(),
        d = this.getDuration()*1000,
        // b + v*T
        p = o.offset0 + 1;

        p = p > c ? c : p;
        this.setOffset(p/c, null, true);

        if(p < c){
            this.timer = _play.$delay(this, d/c, b, t0);
        }else{
            this.play(false);
        }
    };
    /**
     var _play = function(b, t0){
     delete this.timer;
     this.playing = true;

     var slipper = this.slipper, 
     c = this.getTrackLength(),
     d = this.getDuration()*1000,
     // b + v*T
     p = b + (c/d)*(new Date().getTime()-t0);

     p = p > c ? c : p;
     this.setOffset(p/c, null, true);

     if(p < c){
     this.timer = _play.$delay(this, 10, b, t0);
     }else{
     this.play(false);
     }
     };
     /**/

    /**
     * @see js.awt.Container
     */
    thi$.doLayout = function(force){
        if(arguments.callee.__super__.apply(this, arguments)){
            var bounds = this.getUBounds();
            
            if(this.offset){
                // Adjust scale
                var slipper = this.slipper, o = this.offset;
                
                this.trackLen = bounds.innerMeasure - 
                    (slipper.offset0-slipper.offset1);
                
                if(Class.isNumber(this.datacount) || Class.isBigInt(this.datacount)){
                    _setMoverGrid.call(this, this.datacount);
                }
                
                this.setOffset(o.offset0p, o.offset1p, false);
            }
            
            _layout.call(this, bounds, 0);
            
            return true;
        }
        return false;
    }.$override(this.doLayout);

    var _layout = function(bounds, fire){
        var slipper = this.slipper, off0, off1, p;
        bounds = bounds || this.getUBounds();
        
        _layout0.call(this, bounds);

        this.isFirst = false;
        this.isLast  = false;
        p = slipper.getStart();
        if(p == 0){
            this.isFirst = true;
        }else if(p >= this.maxOffset){
            this.isLast = true;
        }

        if(typeof this.onSliderChanged == "function"){
            var U = this._local;
            off0 = slipper.getOffset0();
            off1 = slipper.getOffset1();
            
            //new
            //if(off0 != U.off0 || off1 != U.off1 || (fire & 0x01) != 0){
            this.onSliderChanged(fire);
            U.off0 = off0; U.off1 = off1;
            //}
        }
        
        // Resume paused play
        if(fire == 1 && this.paused == true){
            this.paused = false;
            this.play(true);
        }
    };

    var _layout0 = function(D){
        var slipper = this.slipper,
        slipperS = (D.innerPMeasure - slipper.getPMeasure())*0.5,
        offset0 = slipper.getOffset0(), offset1 = slipper.getOffset1(),
        track0 = this.track0, track1 = this.track1, track2 = this.track2, 
        trackS = (D.innerPMeasure - this.getPMeasure(track0))*0.5,
        trackBg = this.trackbg, trackBgB = this.getUSize(trackBg);
        
        slipper.setUPosition(null, slipperS);
        
        this.setUPosition((D.innerMeasure - trackBgB.measure)*0.5,
                          (D.innerPMeasure- trackBgB.pmeasure)*0.5, null, trackBg);
        
        this.setUBounds(slipper.offset0, trackS, offset0-slipper.offset0, 
                        undefined, null, track0);
        if(track2){
            this.setUBounds(offset0, trackS, offset1-offset0, undefined, null, track2);
        }
        this.setUBounds(offset1, trackS, D.innerMeasure-offset1+slipper.offset1, 
                        undefined, null, track1);
        
        this.trackLen = D.innerMeasure - (slipper.offset0-slipper.offset1);
        this.maxOffset= D.innerMeasure - slipper.getMeasure();
        this.offset = this.getOffset();
    };

    /**
     * @see js.awt.Movable
     */
    thi$.isMoverSpot = function(el, x, y){
        
        if(this.isPlaying()) {
            this.paused = true;

            this.play(false);
        }

        if(el.className.indexOf("resizer") != -1) return false;

        this.moveSlipper = false;
        
        var slipper = this.slipper;
        if(slipper.contains(el, true)) {
            // If mousedown in on the slipper, do we need 
            // stop play ?  
            this.paused = false;
            this.moveSlipper = true;
            return true;
        }

        var xy = this.relative({x:x, y:y}), bounds = this.getUBounds(), 
        offset0 = slipper.getOffset0(), offset1 = slipper.getOffset1(),
        offset, max, v, m, pm, grid = this.def.mover.grid, 
        needLayout = true;

        if(this.isHorizontal()){
            xy.m  = grid*Math.round(xy.x/grid);
            xy.pm = xy.y;
        }else{
            xy.m  = grid*Math.round(xy.y/grid);
            xy.pm = xy.x;
        }
        
        switch(this.def.tracemouse){
        case 0:
            offset = Math.floor(slipper.offset0 + (offset1-offset0)/2);
            max = bounds.innerMeasure - slipper.getMeasure();
            //m = xy.m - offset;
            m = xy.m;
            m = m < 0 ? 0 : (m > max ? max : m);
            slipper.setUPosition(m, null, 7);
            break;
        case 1:
            if(xy.m < offset0){
                m = xy.m - slipper.offset0;
                m = m < 0 ? 0 : m;
            }else if(xy.m > offset1){
                max = bounds.innerMeasure - slipper.getMeasure();
                m = xy.m - slipper.getMeasure() - slipper.offset1;
                m = m > max ? max : m;
            }else{
                m = null;
            }
            slipper.setUPosition(m, null, 7);
            break;
        case 3:
            if(xy.m < offset0){
                m = xy.m - slipper.offset0;
                m = m < 0 ? 0 : m;
                v = slipper.getSizeByRange(offset1-m-slipper.offset0).measure;
            }else if(xy.m > offset1){
                m = null;
                max = bounds.innerMeasure - (-slipper.offset1);
                xy.m = xy.m > max ? max : xy.m;
                v = slipper.getSizeByRange(xy.m - offset0).measure;
            }else{
                m = null;
                v = undefined;
            }
            slipper.setUBounds(m, null, v, undefined, 7);
            break;
        default:
            needLayout = false;
            break;
        }

        if(needLayout){
            _layout.call(this, bounds, 1);    
        }
        
        
        return true;
    };
    /**/

    /**
     * @see js.awt.Movable
     */
    thi$.getMoveObject = function(e){
        var moveObj = this.moveObj;
        if(!moveObj){
            moveObj = this.slipper;
            moveObj.setMovingPeer(this);

            if(Class.isNumber(this.datacount) || Class.isBigInt(this.datacount)){
                _setMoverGrid.call(this, this.datacount);
            }
        }

        return moveObj;
    };
    
    /**
     * If data count < track's pixel, the slipper should be 
     * snaped to grid
     */
    var _setMoverGrid = function(count){
        var grid;
        if(count > 1){
            grid = this.getTrackLength()/(count-1);
            grid = Class.isNumber(grid) ? (grid < 1 ? 1 : grid) : 1;
            this.def.mover.grid = grid;
            
            if(!this.isSingle()){
                //System.err.println(this.getTrackLength());
                //this.slipper.def.mover.grid = grid;
            } 
        }
        else if(count == 1){
            this.def.mover.grid = 1;
        }
    };

    /**
     * @see js.awt.Movable
     */
    thi$.setMovable = function(b){
        arguments.callee.__super__.apply(this, arguments);
        if(b === true){
            MQ.register(this.slipper.getMovingMsgType(), this, _onmoving);
        }else{
            MQ.cancel("js.awt.event.SliderMovingEvent", this, _onmoving);
        }
    }.$override(this.setMovable);

    var _onmoving = function(e){
        var slipper = this.slipper, el = e.srcElement,
        fire = (this.moveSlipper == true && e.getType() == "mouseup") ? 1 : 0;
        _layout.call(this, this.getUBounds(), fire);
    };

    var _onsizing = function(e){
        _layout.call(this, 
                     this.getUBounds(), 
                     (e.getType() == "mouseup") ? 1 : 0);
    };

    var _createElements = function(){
        var R = this.Runtime(), trackbg, track0, track1, track2, slipper;
        
        trackbg = new js.awt.Component(
            {
                className: this.className + "_trackbg",
                id: "trackbg",
                css: "position:absolute;overflow:hidden;",
                stateless: true
            }, R);

        this.addComponent(trackbg);

        
        // For the left(up) track
        track0 = new js.awt.Component(
            {
                className: this.className + "_track0",
                id: "track0",
                css: "position:absolute;overflow:hidden;",
                stateless: true
            }, R);

        this.addComponent(track0);
        
        // For the right(down) track
        track1 = new js.awt.Component(
            {
                className: this.className + "_track1",
                id: "track1",
                css: "position:absolute;overflow:hidden;",
                stateless: true
            }, R);

        this.addComponent(track1);

        // For the middle track of ranger slider    
        if(!this.isSingle()){
            track2 = new js.awt.Component(
                {
                    className: this.className + "_track2",
                    id: "track2",
                    css: "position:absolute;overflow:hidden;",
                    stateless: true
                }, R);
            this.addComponent(track2);
        }
        
        // For the slipper
        slipper = new js.awt.Slipper(
            {
                type: this.def.type,
                direction: this.def.direction,
                className: this.className + "_slipper",
                id: "slipper",
                css: "position:absolute;overflow:hidden;",
                stateless: true
            },R);

        slipper.setPeerComponent(this);
        this.addComponent(slipper);
    };
    
    thi$.destroy = function(){
        MQ.cancel("js.awt.event.SliderMovingEvent", this, _onmoving);
        MQ.cancel(this.slipper.getSizingMsgType(), this, _onsizing);
        arguments.callee.__super__.apply(this, arguments);
    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.Slider";
        def.className = def.className || "jsvm_slider";
        def.type   = Class.isNumber(def.type) ? def.type : 0;
        def.css = (def.css || "") + "overflow:" + (def.type == 0?"hidden;":"visable;");
        def.direction = Class.isNumber(def.direction) ? def.direction : 0;
        def.duration = Class.isNumber(def.duration) ? def.duration : 1;
        def.tracemouse = Class.isNumber(def.tracemouse) ? def.tracemouse : 0;
        
        arguments.callee.__super__.apply(this, arguments);
        
        _createElements.call(this);

        var M = this.def, mover = M.mover = M.mover || {};
        mover.bound = 0;
        mover.grid = 1;
        mover.bt = mover.br = mover.bb = mover.bl = 1;
        mover.freedom = this.isHorizontal() ? 1:2;
        this.setMovable(true);

        if(!this.isSingle()){
            MQ.register(this.slipper.getSizingMsgType(), this, _onsizing);
        }
        else{
            if(M.tracemouse == 1 || M.tracemouse == 3){
                M.tracemouse = 0;
            }
        }

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Container).$implements(js.awt.Bidirectional);

/**
 * @param def:{
 *     className: 
 * 
 *     type: 0: single, 1: ranger
 *     direction: 0: horizontal, 1: vertical
 * }
 */
js.awt.Slipper = function(def, Runtime){

    var CLASS = js.awt.Slipper, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    thi$.isSingle = function(){
        return this.def.type === 0;    
    };
    
    /**
     * Return the offset0 position of this slipper
     */
    thi$.getOffset0 = function(){
        return this.getStart() + this.offset0;
    };

    /**
     * Return the offset1 position of this slipper
     */
    thi$.getOffset1 = function(){
        return this.getStart() + this.getMeasure() - (-this.offset1);
    };

    /**
     * @see js.awt.Container
     */    
    thi$.doLayout = function(force){
        if(this._local.doneLayout !== true &&
           arguments.callee.__super__.apply(this, arguments)){

            _layout.call(this, this.getUBounds());
            return true;
        }
        return false;
    }.$override(this.doLayout);

    var _layout = function(D){
        var ctrl0 = this.ctrl0, ctrl1 = this.ctrl1, w;
        if(this.isSingle()){
            var x = (D.innerMeasure - this.getMeasure(ctrl0))*0.5;
            this.setUBounds(x, 0, undefined, D.innerPMeasure, null, ctrl0);
            this.offset0 = D.measure/2; 
            this.offset1 = 0 - this.offset0;
        }else{
            this.setUBounds(0,0, undefined, D.innerPMeasure, null, ctrl0);
            w = this.getMeasure(ctrl0);
            this.offset0 = D.MBP.borderM0 + w;
            
            this.setUBounds(null, 0, undefined, D.innerPMeasure, null, ctrl1);
            this.setUEndStyle(0, ctrl1);
            this.offset1 = 0 - D.MBP.borderM1 - this.getMeasure(ctrl1);

            if(this.def.miniSize == undefined){
                w += this.getMeasure(ctrl1);
                // Keep 1px for ranger ?
                this.setUMinimumSize(D.MBP.BM + w, D.pmeasure);
            }
        }
        this._local.doneLayout = true; 
    };
    
    /**
     * @see js.awt.MoveObject
     */
    thi$.getMovingMsgType = function(){
        return "js.awt.event.SliderMovingEvent";    
    };

    /**
     * @see js.awt.SizeObject
     */
    thi$.getSizingMsgType = function(){
        return "js.awt.event.SliderSizingEvent";
    };

    /**
     * @see js.awt.Resizable
     */
    thi$.getSizeObject = function(){    
        var sizeObj = this.sizeObj;
        if(!sizeObj){
            sizeObj = this.sizeObj = this;
            sizeObj.setSizingPeer(this);
        }
        return sizeObj;
    }.$override(this.getSizeObject);

    thi$.getSizeByRange = function(range){
        var ret;
        if(this.isSingle()){
            ret = this.getUSize();
        }else{
            var D = this.getBounds(), c0 = this.ctrl0, c1 = this.ctrl1,
            width = range + c0.getWidth() + c1.getWidth() + D.MBP.BW,
            height= range + c0.getHeight()+ c1.getHeight()+ D.MBP.BH;
            if(this.isHorizontal()){
                ret = {
                    width:  width,
                    height: D.height,

                    measure:width,
                    pmeasure: D.height
                };
            }else{
                ret = {
                    width:  D.width,
                    height: height,

                    measure:height,
                    pmeasure: D.width
                };
            }
        }

        return ret;
    };

    var _onsizing = function(e){
        this.notifyPeer(this.getSizingMsgType(), e, true);
    };
    
    var _createElements = function(){
        var ctrl0, ctrl1, R = this.Runtime();
        ctrl0 = new js.awt.Component(
            {
                className: this.className + "_ctrl0",
                id: "ctrl0",
                css: "position:absolute;overflow:hidden;",
                stateless: true
            }, R);
        this.addComponent(ctrl0);

        if(!this.isSingle()){
            ctrl1 = new js.awt.Component(
                {
                    className: this.className + "_ctrl1",
                    id: "ctrl1",
                    css: "position:absolute;overflow:hidden;",
                    stateless: true
                }, R);
            this.addComponent(ctrl1);
        }
    };
    
    thi$.destroy = function(){
        MQ.cancel(this.getSizingMsgType(), this, _onsizing);
        arguments.callee.__super__.apply(this, arguments);
    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.Slipper";
        def.className = def.className || "jsvm_slipper";
        def.stateless = true;

        arguments.callee.__super__.apply(this, arguments);
        
        _createElements.call(this);
        
        if(!this.isSingle()){
            // For ranger type, supports resize
            this.SpotSize = {
                lw: 10, l2w: 20, pw: 0, p2w:0
            };

            this.setResizable(
                true, 
                this.isHorizontal() ? 0x22 : 0x88);

            MQ.register(this.getSizingMsgType(), this, _onsizing);
        }
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
}.$extend(js.awt.Container).$implements(js.awt.Bidirectional);


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
 * 
 * @param def :{
 *     className: xxx
 *     
 * } 
 */
js.awt.Scrollbar = function (def, Runtime){

    var CLASS = js.awt.Scrollbar, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ, WIN_MAX_SIZE = 8192;
    
    thi$.isHorizontal = function(){
        return this.def.axis === 0;
    };

    /**
     * Set data size
     *
     *   |--------------------max--------------------|
     *   |------window------|
     *   |--view--|
     *
     * @param max, {w:maxW, h:maxH}. the data max size
     * @param win, {w:winW, h:winH}. the data window size
     */
    thi$.setDataSize = function(max, win, limitW, limitH){
        var isH = this.isHorizontal(), bounds = this.getBounds();

        win = win || { w:max.w, h:max.h };
        win.w = Math.max(Math.min(win.w, limitW || WIN_MAX_SIZE), 
                         bounds.innerWidth);
        win.h = Math.max(Math.min(win.h, limitH || WIN_MAX_SIZE), 
                         bounds.innerHeight);
        
        // Make two braces if max size large than the data 
        // window size.
        var U = this._local, brace = this.brace;
        if(!brace){
            brace = this.brace = DOM.createElement("DIV");
            brace.className = isH ? "xbrace" : "ybrace";
            brace.style.cssText = "position:absolute;";
            DOM.insertBefore(brace, this.view.firstChild, this.view);
        }
        
        if(isH){
            DOM.setSize(brace, max.w, 1);            
        }else{
            DOM.setSize(brace, 1, max.h);
        }

        U.paper = {
            maxW: max.w,
            maxH: max.h,
            winW: win.w,
            winH: win.h
        };
        
        Event.attachEvent(this.view, "scroll", 1, this, _onscroll);
    };

    var _onscroll = function(e){
        var U = this._local, scroll = U.scroll, view = this.view, 
        bounds = this.getBounds(), MBP = bounds.MBP, paper = U.paper, 
        vieW = bounds.clientWidth - (MBP.paddingLeft+MBP.paddingRight),
        vieH = bounds.clientHeight- (MBP.paddingTop+MBP.paddingBottom),
        maxW = paper.maxW, maxH = paper.maxH,
        winW = paper.winW, winH = paper.winH,
        Xw = scroll.Xw, Yw = scroll.Yw, Xv, X1, Yv, Y1, reload = false;

        Xv = Math.min(maxW - vieW, view.scrollLeft);
        Yv = Math.min(maxH - vieH, view.scrollTop);
        
        X1 = _getWinPs(maxW, winW, vieW, Xv, Xw);
        Y1 = _getWinPs(maxH, winH, vieH, Yv, Yw);
        
        if(X1 != Xw){
            reload = true;
            Xw = scroll.Xw = X1;
        }
        if(Y1 != Yw){
            reload = true;
            Yw = scroll.Yw = Y1;
        }
        
        this.fireEvent(new Event("scroll",{
                                     scrollLeft: Xv,
                                     scrollTop:  Yv,
                                     Xw: Xw,
                                     Yw: Yw,
                                     reload: reload
                                 }, this));
    };

    var _getWinPs = function(M, W, V, vp, wp){
        return (vp >= 0 && vp <= (W-V)) ? 0 :
            ((vp >= (M-W) && vp <= (M-V)) ? M-W : 
             (vp < wp || vp >= wp+W-V) ? vp-(W-V)/2 : wp);
    };

    /**
     * @see js.awt.BaseComponent
     */
    thi$.destroy = function(){
        var brace, scroll = false;
        brace = this.brace;
        if(brace){
            scroll = true;
            DOM.removeFrom(brace, this.view);
            delete this.brace;
        }

        if(scroll){
            Event.detachEvent(this.view, "scroll", 1, this, _onscroll);
        }

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        var axis = def.axis, css;
        if(axis !== 0 && axis !== 1){
            axis = def.axis = 0;
        }
        
        css = (axis === 0) 
            ? "overflow-x:scroll;overflow-y:hidden;"
            : "overflow-x:hidden;overflow-y:scroll;";
        def.css = css + (def.css || "");
        
        arguments.callee.__super__.apply(this, arguments);

        var U = this._local;
        U.scroll = {Xw:0, Yw: 0};

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Component);





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
	
	var Class = js.lang.Class, E = js.util.Event, DOM = J$VM.DOM,
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
		if(Class.isBoolean(b)){
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
	
	thi$.isHoverForSelected = function(){
		return this.def.hoverForSelected === true;
	};
	
	thi$.setSelected = function (b) {
		if (this.isMarkable()) {
			this.mark(b);
		} else {
			this._local.selected = b;
			this.model.marked = b;
			
			if(this.isHoverForSelected()){
				this.setHover(b);
			}else{
				this.setHover(false);
				this.setTriggered(b);
			}
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
		return Class.isString(this.model.dname);
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
		
		var sign = m.sign, dname = m.dname,
		iconImage = m.img || m.iconImage;

		if(Class.isObject(sign)){
			def.sign = sign;	
		}
		
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
		
		var newDef = System.objectCopy(def, {}, true);
		this.model = newDef.model;
		
		newDef = _preInit.call(this, newDef);
		arguments.callee.__super__.apply(this, [newDef, Runtime, view]);
		
		var m = this.model;
		if(newDef.showTips && m){
			var tip = m.tip || m.dname || "";
			this.setToolTipText(tip);
		}

		this.setEnabled(newDef.enable !== false);
		if(newDef.checked){
			this.setSelected(true);
		}
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.Item);

