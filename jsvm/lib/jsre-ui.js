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
  Copyright 2008-2015, The JSVM Project. 
  All rights reserved.
  
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.awt");

js.awt.Cover = function (){

    var CLASS = js.awt.Cover, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, DOM = J$VM.DOM;

    thi$.showCover = function(b, modify, className){
        var view = this._coverView, selector;

        selector = DOM.combineClassName(
            ["jsvm_", className||""].join(" "),
            ["cover", modify? "cover--"+modify:""]);
        
        if(b){
            if(!view){
                _createView.call(this, selector);
            }
            this.adjustCover();
        }else{
            if(view && view.className === selector){
                this.removeCover();                
            }
        }
    };

    var _createView = function(selector){
        var cview = this.view, view, uuid, tip;

        uuid = this.uuid();
        view = this._coverView = DOM.cloneElement(cview, false);
        view.uuid = [uuid, "cover"].join("-");
        view.id = [this.getID(), "cover"].join("-");
        view.className = selector;
        view.style.position = "absolute";
        view.style.zIndex = this.getZ();
        if(cview === self.document.body){
            cview.appendChild(view);
        }else{
            DOM.insertAfter(view, cview);
        }
        
        tip = this.def.tip;
        if(Class.isString(tip)){
            DOM.setAttribute(view, "title", tip);
        }
    };
    
    /**
     * Show loading status in this cover
     */
    thi$.showLoading = function(b, styleClass){
        this.showCover(b, "loading", styleClass);
    };
    
    /**
     * Show cover for moving with class name "jsvm_movecover"
     */
    thi$.showMoveCover = function(b, styleClass){
        this.showCover(b, "move", styleClass);
    };

    thi$.showMaskCover = function(b, styleClass){
        this.showCover(b, "mask", styleClass);
    };

    thi$.showDisableCover = function(b, styleClass){
        this.showCover(b, "disable", styleClass);
    };

    /**
     * Adjust the postion and size of the cover
     */
    thi$.adjustCover = function(bounds){
        var view = this._coverView;
        if(!view) return;
        bounds = bounds || this.getBounds();
        if(bounds.MBP.fake) return;
        DOM.setBounds(view, bounds.x, bounds.y,
                      bounds.width, bounds.height);    
    };

    thi$.setCoverZIndex = function(z){
        var view = this._coverView;
        if(!view) return;
        view.style.zIndex = z;
    };
    
    thi$.setCoverDisplay = function(show){
        var view = this._coverView;
        if(!view) return;
        view.style.display = show;
    };

    thi$.removeCover = function(){
        var view = this._coverView;
        if(!view) return;
        DOM.remove(view, true);
        delete this._coverView;
    };

};




/**
  Copyright 2008-2015, The JSVM Project. 
  All rights reserved.
  
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.awt");

/**
 * A <code>Shodow</code> is used to support shodow of a component.
 */
js.awt.Shadow = function (){

    var CLASS = js.awt.Shadow, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, DOM = J$VM.DOM;
    
    thi$.showShadow = function(b, className){
        var view = this._shadowView, selector;
        selector = DOM.combineClassName(
            ["jsvm_", className||""].join(" "),
            ["shadow"]);
        
        if(b){
            if(!view){
                _createView.call(this, selector);
            }
            this.adjustShadow();
        }else{
            this.removeShadow();
        }
    };

    var _createView = function(selector){
        var cview = this.view, view, uuid;
        if(cview === self.document.body) return;

        uuid = this.uuid();
        view = this._shadowView = DOM.createElement("DIV");
        view.uuid = uuid;
        view.id = [this.getID(), "shadow"].join("-");
        view.className = selector;
        view.style.position = "absolute";
        view.style.zIndex = this.getZ();
        DOM.insertBefore(view, cview);
    };

    thi$.adjustShadow = function(bounds){
        var view = this._shadowView;
        if(!DOM.isDOMElement(this.view) || !view) return;
        bounds = bounds || this.getBounds();
        DOM.setBounds(view, bounds.x, bounds.y, 
                      bounds.width, bounds.height);
    };

    thi$.setShadowZIndex = function(z){
        var view = this._shadowView;
        if(!view) return;
        view.style.zIndex = z;
    };

    thi$.setShadowDisplay = function(show){
        var view = this._shadowView;
        if(!view) return;
        view.style.display = show;
    };

    thi$.removeShadow = function(){
        var view = this._shadowView;
        if(!view) return;
        DOM.remove(view, true);
        delete this._shadowView;
    };
};

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

/**
 * The MoveObject is the entity that drag and drop 
 */
js.awt.MoveObject = function(){

    var CLASS = js.awt.MoveObject, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var DOM = J$VM.DOM;
    
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
        var peer = this.getMovingPeer();
        return (this != peer && peer && peer.getMovingMsgRecvs) ?
            peer.getMovingMsgRecvs() : null;
    };
    
    /**
     * The drop target use this method to release this moving object.
     */
    thi$.releaseMoveObject = function(){
        if(this != this.movingPeer){
            this.movingPeer.moveObj = null;
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
    
    thi$.startMoving = function(e){
        var moveObj = this.getMoveObject(e), 
            ctx = moveObj.getMovingContext(), p = ctx.container.view,
            r = ctx.range, bounds = moveObj.getBounds(),
            mover = this.getMovingConstraints(),
            grid = mover.grid, bound=mover.bound,
            bt = max(mover.bt*bounds.height, bound),
            br = max(mover.br*bounds.width,  bound),
            bb = max(mover.bb*bounds.height, bound),
            bl = max(mover.bl*bounds.width,  bound);

        ctx.eventXY = e.eventXY();
        ctx.minX = grid*ceil( (r[0]+bl)/grid);
        ctx.minY = grid*ceil( (r[1]+bt)/grid);
        ctx.maxX = grid*floor((r[2]-br)/grid);
        ctx.maxY = grid*floor((r[3]-bb)/grid);
        moveObj._moveCtx = ctx;        
        moveObj.showMoveCover(true);
        MQ.register("releaseMoveObject", this, _release);        
    };

    thi$.processMoving = function(e){
        var moveObj = this.getMoveObject(e), ctx = moveObj._moveCtx,
            bounds = moveObj.getBounds(),
            mover = this.getMovingConstraints(),
            grid = mover.grid, freedom = mover.freedom,
            thip = ctx.container, p = thip.view,
            xy = e.eventXY(), oxy = ctx.eventXY,
            x = p.scrollLeft + bounds.userX + (xy.x - oxy.x),
            y = p.scrollTop + bounds.userY + (xy.y - oxy.y),
            minX = ctx.minX, minY = ctx.minY,
            maxX = ctx.maxX, maxY = ctx.maxY;

        x = x < minX ? minX : x > maxX ? maxX : x;
        y = y < minY ? minY : y > maxY ? maxY : y;
        
        if(x != bounds.x || y != bounds.y){
            // Snap to grid
            x = grid*round(x/grid);
            x = (freedom & 0x01) != 0 ? x : undefined;

            y = grid*round(y/grid);
            y = (freedom & 0x02) != 0 ? y : undefined;

            moveObj.setPosition(x, y);
            ctx.moved = true;
        }
        
        // Notify all drop targets
        var recvs = moveObj.getMovingMsgRecvs() || [];
        recvs.unshift(moveObj.getMovingPeer().uuid());
        e.setEventTarget(moveObj);
        MQ.post(moveObj.getMovingMsgType(), e, recvs);
    };
    
    thi$.endMoving = function(e){
        var moveObj = this.getMoveObject(e), ctx = moveObj._moveCtx,
            recvs = moveObj.getMovingMsgRecvs() || [];

        // Notify all drop targets
        recvs.unshift(moveObj.getMovingPeer().uuid());
        e.setEventTarget(moveObj);
        MQ.post(moveObj.getMovingMsgType(), e, recvs);

        // Release MoveObject
        MQ.post("releaseMoveObject", moveObj, [this.uuid()]);

        moveObj.showMoveCover(false);
        if(ctx.moved){
            moveObj.setPosition(moveObj.getX(), moveObj.getY(), 0x0F);
        }
        delete moveObj._moveCtx;
    };

    var _release = function(moveObj){
        moveObj.releaseMoveObject();
        if(this.moveObj){
            delete this.moveObj;            
        }
        MQ.cancel("releaseMoveObject", this, _release);
    };

    /**
     * Test if the element is a hotspot for moving.
     * 
     * @param ele, a HTMLElement
     * @param x, y
     * 
     * @return boolean
     * 
     * Notes: Sub class should override this method
     */
    thi$.isMoverSpot = function(ele, x, y){
        
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
        var moveObj = this.moveObj, B;
        if(!moveObj){
            moveObj = this.moveObj = this;
            moveObj.setMovingPeer(this);
            B = this.getBounds();
            moveObj.setBounds(B.x, B.y, B.width, B.height, 0x04);
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
        var M = this.def;
        b = b || false;
        M.movable = b;
        this.getMovingConstraints();
    };

};


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

/**
 * The SizeObject is the entity that drag to resize
 */
js.awt.SizeObject = function(){

    var CLASS = js.awt.SizeObject, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var DOM = J$VM.DOM;

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
        return (peer && peer.getSizingMsgRecvs) ?
            peer.getSizingMsgRecvs() : null;
    };

    thi$.releaseSizeObject = function(){
        if(this != this.sizingPeer){
            this.sizingPeer.sizeObj = null;
            delete this.sizingPeer;
            this.destroy();
        }else{
            this.sizingPeer = null;
        }
    };
};

/**
 * A <code>Resizable</code> is used to support resizing a component.
 * This function request a <code>resizer</code> definition as below 
 * in the def of the component.
 *
 * def.resizer : number
 *  8 bits for the 8 directions
 *  7  6  5  4  3  2  1  0
 *  N  NE E  SE S  SW W  NW
 *
 *  0 ---- 7 ---- 6
 *  |             |
 *  1             5
 *  |             |
 *  2 ---- 3 ---- 4
 *
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
        System = J$VM.System, MQ = J$VM.MQ,
        max = Math.max, min = Math.min, abs = Math.abs,
        ceil = Math.ceil, floor = Math.floor, round = Math.round;

    thi$.startSizing = function(e, i){
        var moveObj = this.getSizeObject(e),
            ctx = moveObj.getMovingContext();

        ctx.eventXY = e.eventXY();
        moveObj._moveCtx = ctx;        
        MQ.register("releaseSizeObject", this, _release)
    };

    thi$.processSizing = function(e, i){
        var sizeObj = this.getSizeObject(), ctx = sizeObj._moveCtx,
            thip = ctx.container, pounds = thip.getBounds(),
            bounds = sizeObj.getBounds(),
            mover = this.getMovingConstraints(), grid = mover.grid, 
            minSize = sizeObj.getMinimumSize(),
            maxSize = sizeObj.getMaximumSize(),
            xy = e.eventXY(), minV, maxV, v0, v1, x, y, w, h;

        x = bounds.userX; w = bounds.userW;
        y = bounds.userY; h = bounds.userH;

        xy = DOM.relative(xy.x, xy.y, pounds);

        // calc x
        switch(i){
            case 0:
            case 1:
            case 2:
            v1 = bounds.userX + bounds.userW;
            minV = mover.bl < 1 ? (v1 - maxSize.width) : 0;
            maxV = v1-max(minSize.width, bounds.MBP.BW+1);
            x = xy.x;
            x = x < minV ? minV : (x > maxV ? maxV : x);
            w = grid*ceil((v1 - x)/grid);
            x = grid*floor((v1 - w)/grid);
            break;
            case 4:
            case 5:
            case 6:
            v0 = bounds.userX;
            minV = grid*ceil(max(bounds.MBP.BW+1, minSize.width)/grid);
            maxV = grid*floor((mover.br < 1 ?
                    maxSize.width : pounds.innerWidth)/grid);
            x = bounds.userX;
            w = grid*floor((xy.x - v0)/grid);
            w = w < minV ? minV : (w > maxV ? maxV : w);
            break;
        }

        // calc y
        switch(i){
            case 0:
            case 7:
            case 6:
            v1 = bounds.userY + bounds.userH;
            minV = mover.bt < 1 ? (v1 - maxSize.height) : 0;
            maxV = v1-max(minSize.height, bounds.MBP.BH+1);
            y = xy.y;
            y = y < minV ? minV : (y > maxV ? maxV : y);
            h = grid*ceil((v1 - y)/grid);
            y = grid*floor((v1 - h)/grid);
            break;
            case 2:
            case 3:
            case 4:
            v0 = bounds.userY;
            minV = grid*ceil(max(bounds.MBP.BH+1, minSize.height)/grid);
            maxV = grid*floor((mover.bb < 1 ?
                    maxSize.height : pounds.innerHeight)/grid);
            y = bounds.userY;
            h = grid*floor((xy.y - v0)/grid);
            h = h < minV ? minV : (h > maxV ? maxV : h);
            break;
        }

        if(x != bounds.offsetX || y != bounds.offsetY){
            sizeObj.setPosition(x, y);
            ctx.moved = true;
        }
        if(w != bounds.width || h != bounds.height){
            sizeObj.setSize(w, h);
            ctx.sized = true;
        }
        
        sizeObj.getSizingPeer().adjustOutline(bounds);

        // Notify all message receivers
        var recvs = sizeObj.getSizingMsgRecvs() || [];
        recvs.unshift(sizeObj.getSizingPeer().uuid());
        e.setEventTarget(sizeObj);
        MQ.post(sizeObj.getSizingMsgType(), e, recvs);
    };

    thi$.endSizing = function(e, i){
        var sizeObj = this.getSizeObject(e), ctx = sizeObj._moveCtx,
            recvs = sizeObj.getSizingMsgRecvs() || [];

        if(ctx.sized){
            this.setSize(sizeObj.getWidth(), sizeObj.getHeight(), 0x0F);
            ctx.sized = false;
        }
        if(ctx.moved){
            this.setPosition(sizeObj.getX(), sizeObj.getY(), 0x0F);
            ctx.moved = false;
        }
        
        // Notify all message receivers
        recvs.unshift(sizeObj.getSizingPeer().uuid());
        e.setEventTarget(sizeObj);
        MQ.post(sizeObj.getSizingMsgType(), e, recvs);

        // Release SizeObject
        MQ.post("releaseSizeObject", sizeObj, [this.uuid()]);
    };
    
    var _release = function(sizeObj){
        sizeObj.releaseSizeObject();
        if(this.sizeObj){
            delete this.sizeObj;
        }
        MQ.cancel("releaseSizeObject", this, _release);
    };

    /**
     * Gets SizeObject from this component.
     *
     * @see js.awt.SizeObject
     *
     * Notes: If need sub class can override this method
     */
    thi$.getSizeObject = function(){
        var sizeObj = this.sizeObj, bounds, def;
        if(!sizeObj){
            bounds = this.getBounds();

            def = {
                classType: "js.awt.Component",
                className: DOM.combineClassName(
                    ["jsvm_", this.def.resizeClassName||""].join(" "),
                    ["cover", "cover--resize"]),
                css: "position:absolute;",
                stateless: true,
                z : this.getZ(),
                prefSize : this.getPreferredSize(),
                miniSize : this.getMinimumSize(),
                maxiSize : this.getMaximumSize()
            };
            
            sizeObj = this.sizeObj = /*this;*/
            new js.awt.Component(def, this.Runtime());
            sizeObj.insertAfter(this.view);
            sizeObj.setSizingPeer(this);
            sizeObj.setBounds(bounds.x, bounds.y,
                              bounds.width, bounds.height, 0x04);
        }

        return sizeObj;
    };

    /**
     * Tests whether this component is resizable.
     */
    thi$.isResizable = function(idx){
        var b = (this.def.resizable || false),
            resizer = this.def.resizer;
        
        if(b && Class.isNumber(idx)){
            resizer = Class.isNumber(resizer) ? resizer : 0xFF;
            b = b && ((resizer & (1<<idx)) !== 0);
        }

        return b;
    };

    /**
     * Sets whether this component is resizable.
     *
     * @param b, true is resizable, false is unable
     * @param resizer a number 0 to 255 identifies 8 directions
     */
    thi$.setResizable = function(b, resizer){
        var M = this.def;
        b = b || false;
        resizer = Class.isNumber(resizer) ? (resizer & 0x0FF) : 255;
        M.resizable = b;
        M.resizer = resizer;
        this.getMovingConstraints();
    };
};

/**
  Copyright 2008-2015, The JSVM Project. 
  All rights reserved.
  
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.awt");

/**
 * @param def:{
 *     
 * }
 */
js.awt.Outline = function(){

    var CLASS = js.awt.Outline, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, DOM = J$VM.DOM,
        LINES = ["top", "right", "bottom", "left",
                 "nw", "w", "sw", "s", "se","e","ne","n"];

    var _createView = function(i, lines, selector){
        var cview = this._coverView || this.view, view, uuid;

        uuid = this.uuid();
        view = DOM.createElement("DIV");
        view.uuid = uuid;
        view.id = [this.getID(), LINES[i]].join("-");
        view.className = selector;
        view.style.position = "absolute";
        view.style.zIndex = this.getZ();
        if(cview === self.document.body){
            cview.appendChild(view);
        }else{
            DOM.insertAfter(view, cview);            
        }
        lines.push(view);
    };

    thi$.showOutline = function(b, className){
        var views = this._outlineView, clazz, ext, selector, bounds;

        if(b){
            if(!views){
                bounds = this.getBounds();
                views = this._outlineView = [];
                clazz = ["jsvm_", className||""].join(" ");
                for(var i=0; i<12; i++){
                    if(i < 4 || this.isResizable(i-4)){
                        ext = ["outline"];
                        if(i < 4){
                            ext.push(["outline", LINES[i]].join("--"));
                        }else{
                            ext.push("outline-resizer",
                                     ["outline-resizer", LINES[i]].join("--"));
                        }
                        selector = DOM.combineClassName(clazz, ext);
                        _createView.call(this, i, views, selector);
                    }
                }
            }
            this.adjustOutline(bounds);
        }else{
            this.removeOutline();
        }
    };

    var SETBOUNDS = {
        top: function(line, lbounds, bounds){
            DOM.setBounds(line, bounds.x, bounds.y,
                          bounds.width, lbounds.height, lbounds);
        },
        right: function(line, lbounds, bounds){
            DOM.setBounds(line, (bounds.x + bounds.width-lbounds.width),
                          bounds.y, lbounds.width, bounds.height, lbounds);
        },
        bottom: function(line, lbounds, bounds){
            DOM.setBounds(line, bounds.x,
                          (bounds.y+bounds.height-lbounds.height),
                          bounds.width, lbounds.height, lbounds);
        },
        left: function(line, lbounds, bounds){
            DOM.setBounds(line, bounds.x, bounds.y, lbounds.width,
                          bounds.height, lbounds);
        },
        nw: function(line, lbounds, bounds){
            DOM.setBounds(line, bounds.x, bounds.y,
                          lbounds.width, lbounds.height, lbounds);
        },
        w: function(line, lbounds, bounds){
            if(bounds.height <= 24){
                line.style.visibility = "hidden";
            }else{
                DOM.setBounds(line, bounds.x,
                              Math.round(bounds.y+(bounds.height/2)-lbounds.height/2),
                              lbounds.width, lbounds.height, lbounds);
                line.style.visibility = "visible";
            }
        },
        sw: function(line, lbounds, bounds){
            DOM.setBounds(line, bounds.x, bounds.y+bounds.height-lbounds.height,
                          lbounds.width, lbounds.height, lbounds);
        },
        s: function(line, lbounds, bounds){
            if(bounds.width <= 24){
                line.style.visibility = "hidden";
            }else{
                DOM.setBounds(line,
                              Math.round(bounds.x + bounds.width/2 - lbounds.width/2),
                              bounds.y+bounds.height-lbounds.height,
                              lbounds.width, lbounds.height, lbounds);
                line.style.visibility = "visible";
            }
        },
        se: function(line, lbounds, bounds){
            DOM.setBounds(line, bounds.x+bounds.width-lbounds.width,
                          bounds.y+bounds.height-lbounds.height,
                          lbounds.width, lbounds.height, lbounds);
        },
        e: function(line, lbounds, bounds){
            if(bounds.height <= 24){
                line.style.visibility = "hidden";
            }else{
                DOM.setBounds(line,
                              bounds.x+bounds.width-lbounds.width,
                              Math.round(bounds.y+(bounds.height/2)-lbounds.height/2),
                              lbounds.width, lbounds.height, lbounds);
                line.style.visibility = "visible";
            }
        },
        ne: function(line, lbounds, bounds){
            DOM.setBounds(line,
                          bounds.x+bounds.width-lbounds.width,
                          bounds.y,
                          lbounds.width, lbounds.height, lbounds);
        },
        n: function(line, lbounds, bounds){
            if(bounds.width <= 24){
                line.style.visibility = "hidden";
            }else{
                DOM.setBounds(line,
                              Math.round(bounds.x + bounds.width/2 - lbounds.width/2),
                              bounds.y,
                              lbounds.width, lbounds.height, lbounds);
                line.style.visibility = "visible";
            }
        }
    };
    
    thi$.adjustOutline = function(bounds){
        var views = this._outlineView, i, len, line, id, lbounds;
        if(!DOM.isDOMElement(this.view) || !views) return;
        bounds = bounds || this.getBounds();
        for(i=0, len=views.length; i<len; i++){
            line = views[i];
            lbounds = DOM.getBounds(line);
            id = line.id.split("-");
            id = id[id.length-1];
            SETBOUNDS[id](line, lbounds, bounds);
        }
    };

    thi$.setOutlineZIndex = function(z){
        var views = this._outlineView;
        if(!views) return;
        for(var i=0, len=views.length; i<len; i++){
            views[i].style.zIndex = z;
        }
    };

    thi$.setOutlineDisplay = function(show){
        var views = this._outlineView;
        if(!views) return;
        for(var i=0, len=views.length; i<len; i++){
            views[i].style.display = show;
        }
    };

    thi$.removeOutline = function(){
        var views = this._outlineView;
        if(!views) return;
        while(views.length > 0){
            DOM.remove(views.shift(), true);
        }
        delete this._outlineView;
    };
};


/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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
			this.attachEvent("mouseover", 4, this, this.timeoutMouseover);
			this.attachEvent("mouseout",  4, this, this.timeoutMouseout);
		} else {
			this.detachEvent("mouseover", 4, this, this.timeoutMouseover);
			this.detachEvent("mouseout",  4, this, this.timeoutMouseout);
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
 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * File: ToolTip.js
 * Create: 2014/02/20 06:41:25
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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
 *     this.checkAttachEvent("mouseover", "mouseout", "mousemove");
 */
js.awt.ToolTip = function(){

    var CLASS = js.awt.ToolTip, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event,
        DOM = J$VM.DOM, System = J$VM.System, MQ = J$VM.MQ;
    
    /**
     * Set the tip object for tip layer. The tip object is the real content
     * component for showing user-defined tips. It can be any "Component", 
     * "Container" instance object.
     * 
     * @param tipObj: {Component} A Component or Container instance object.
     * @param gc: {Boolean} Indicate whether gc the old useless tipObj.
     */
    thi$.setTipObject = function(tipObj, gc){
        var U = this._local, tip = this.getTipLayer();
        U.tipObj = tipObj;
        if(!tip) return;
        tip.setTipObject(tipObj, gc);
    };
    
    thi$.getTipObject = function(e){
        var U = this._local;
        return U.tipObj; 
    };

    thi$.setTipObjByDef = function(def){
        var tipObj;
        if(!Class.isObject(def) || !def.classType) return;
        def.stateless = true;
        def.NUCG = true;
        tipObj = new (Class.forName(def.classType))(def, this.Runtime());
        this.setTipObject(tipObj, true);
    };
    
    /**
     * Set the text for the label tip. If the label tip object is not
     * existed, create it first.
     * 
     * @param labelText: {String} Text for the label tip.
     * @param styles: {Object} Optional. Some extra styles for the label 
     *        tip to apply.
     * @param extDef: {Object} Optional. Some extra definition.
     */
    thi$.setTipLabel = function(labelText, styles, extDef){
        var tipObj = this.getTipObject(), objDef;
        if(!tipObj || !(tipObj instanceof js.awt.Label)){
            objDef = {
                classType: "js.awt.Label"
            }
            if(Class.isObject(extDef)){
                System.objectCopy(extDef, objDef);
            }
            this.setTipObjByDef(objDef);
        }
        
        tipObj = this.getTipObject();
        if(Class.isObject(styles)){
            tipObj.applyStyles(styles);
        }

        tipObj.setText(labelText);
    };
        
    thi$.getTipLayer = function(){
        return this.tipLayer;
    };

    var _createTipLayer = function(tipDef){
        var M = this.def, tip;

        tip = this.tipLayer;
        if(tip) return;
        
        if(Class.isObject(tipDef)){
            tipDef = System.objectCopy(tipDef, {}, true);
        }else{
            tipDef = {shadow: true};
        }
        M.tipDef = tipDef;
        tipDef.classType = tipDef.classType || "js.awt.TipLayer";
        tipDef.id = tipDef.id || [this.getID(), "tip"].join("-");
        tipDef.uuid = tipDef.uuid || [this.uuid(), "tip"].join("-");
        tipDef.isfloating = true;
        tipDef.stateless = true;
        tip = this.tipLayer = new (Class.forName(tipDef.classType))(
            tipDef, this.Runtime());

        this.attachEvent("mouseover", 4, this, _onhover);
        this.attachEvent("mouseout",  4, this, _onhover);                 
        this.attachEvent("mousemove", 4, this, _onhover);
    };
    
    thi$.removeTipLayer = function(){
        var tip = this.tipLayer;
        if(!tip) return;
        this.detachEvent("mouseover", 4, this, _onhover);
        this.detachEvent("mouseout",  4, this, _onhover);                 
        this.detachEvent("mousemove", 4, this, _onhover);
        tip.destroy();
        delete this.tipLayer;
    };

    thi$.showTipLayer = function(b, e){
        var tip, xy;
        b = b || false;
        tip = this.getTipLayer();
        if(!tip) return;
        
        if(b){
            xy = e.eventXY();
            tip.setTipObject(this.getTipObject(e));
            tip.showAt(xy.x-2, xy.y+18, true);
        }else{
            tip.hide(e);
        }
    };
    
    var _onhover = function(e){
        if(e.getType() === Event.W3C_EVT_MOUSE_OUT){
            this.showTipLayer(false);
        }else{
            this.showTipLayer(true, e);
        }
        e.cancelBubble();
        return e.cancelDefault();
    };
    
    /**
     * Init the user-defined tip usage environment and prepare to listen
     * the mouseover, mouseout and mousemove event.
     * 
     * Here, two branch logics are existed. For the GraphicElement, the 
     * user event will be attached with the flag 4. And for Component, 
     * the DOM event will be attached with the flag 0.
     */
    thi$.setUserDefinedTip = function(b, tipDef){
        var M = this.def, U = this._local, tip;
        b = b || false;
        M.useUserDefinedTip = b;

        if(b){
            U.tipText = M.tip; // keep tip text
            this.rmvTipText();
            _createTipLayer.call(this, tipDef || M.tipDef);
        }else{
            this.setTipText(U.tipText);
            this.removeTipLayer();
        }
    };

    thi$.setTipText = function(text){
        if(!Class.isString(text) ||
           text.trim().length == 0 ) return;

        this.def.tip = text;
        DOM.setAttribute(this.view, "title", text);
        DOM.setAttribute(this._coverView, "title", text);            
    };

    thi$.rmvTipText = function(){
        this.def.tip = undefined;
        DOM.removeAttribute(this.view, "title");
        DOM.removeAttribute(this._coverView, "title");            
    };

    /**
     * @deprecated Use setTipText()
     */
    thi$.setToolTipText = function(s){
        this.setTipText(s);
    };

    /**
     * @deprecated Use rmvTipText()
     */
    thi$.delToolTipText = function(){
        this.rmvTipText();
    };
};


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

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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
    thi$.getLayoutSize = function(container, fn){
        var bounds = container.getBounds(),
            ret ={width:0, height:0};

        _calcSize.$forEach(
            this, this.getLayoutComponents(container), fn, ret);

        ret.width += bounds.MBP.BW;
        ret.height+= bounds.MBP.BH;
        
        return ret;
    };

    var _calcSize = function(fn, max, comp){
        var d = comp[fn]();
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
    thi$.preferredLayoutSize = function(container){
        return this.getLayoutSize(container, "getPreferredSize");  
    };

    /** 
     * Calculates the minimum size dimensions for the specified 
     * container, given the components it contains.
     * @param container the component to be laid out
     * @see #preferredLayoutSize
     */
    thi$.minimumLayoutSize = function(container){
        return this.getLayoutSize(container, "getMinimumSize");
    };
    
    /** 
     * Calculates the maximum size dimensions for the specified container,
     * given the components it contains.
     * @see java.awt.Component#getMaximumSize
     */
    thi$.maximumLayoutSize = function(container){
        return this.getLayoutSize(container, "getMaximumSize");
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
        $super(this);
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

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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

        $super(this);        

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
 *	   classType : the layout class
 *	   axis: 0(horizontally)|1(vertically), 
 *	   gap: 0 
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
		ybase = bounds.MBP.paddingTop,	top = 0,
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
				top	 = Math.round(space*this.getLayoutAlignmentY());
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
		def.gap	 = def.gap || 0;

		$super(this);		  

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

        $super(this);        

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

        $super(this);        

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
                    y += (cell.innerHeight - compz.height)*comp.getAlignmentY();
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
        $super(this);
        def.gridClass = def.gridClass || "js.awt.Grid";
        this.grid = new (Class.forName(def.gridClass))(def);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.AbsoluteLayout);


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
    }

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
            if(fire & 0x01){
                this.doLayout(true, bounds);
            }
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
    }

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
            bounds = {x: x, y: y, width: w, height: h}
        }

        coord = _updateCoords.call(this, M, bounds, fire);
        sized = _updateSize.call(this, M, bounds, fire);
        if(coord || sized){
            this.adjustLayers("geom", bounds);
            if(sized && (fire & 0x01)){
                this.doLayout(true, bounds);
            }
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

        coord = _updateCoords.call(this, M, bounds, fire);
        sized = _updateSize.call(this, M, bounds, fire);
        if(coord || sized){
            this.adjustLayers("geom", bounds);
            if(sized && (fire & 0x01)){
                this.doLayout(true, bounds);
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

    thi$.onresize = function(e){
        var U = this._local, userW = U.userW, userH = U.userH,
            bounds = this.getBounds(true);

        if(userW != bounds.width || userH != bounds.height){
            this.adjustLayers("sized", bounds);
            this.doLayout(true, bounds);
        }
    };
    
    thi$.doLayout = function(force, bounds){
        var U = this._local, ret = true;
        if(!this.needLayout(force)){
            ret = false;
        }else{
            bounds = bounds || this.getBounds(true);
            
            U.userX = bounds.x;
            U.userY = bounds.y;
            U.userZ = bounds.MBP.zIndex;
            U.userW = bounds.width;
            U.userH = bounds.height;

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
    
    thi$.adjustLayers = function(cmd, bounds, show){
        switch(cmd){
            case "coord":
            case "sized":
            case "geom":
            bounds = bounds || this.getBounds();
            this.adjustShadow(bounds);
            this.adjustCover(bounds);
            this.adjustOutline(bounds);
            break;
            case "zorder":
            var z = this.getZ();
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
        var mover = this.def.mover;
        if(!mover){
            mover = this.def.mover = {
                bound: 20,
                bt: 1, br: 0, bb: 0, bl: 1,
                grid: 1,
                freedom: 3
            };
        }else {
            mover.bound = 
                Class.isNumber(mover.bound) ? mover.bound : 20;
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
                0 - bounds.width,
                0 - bounds.height,
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
        
        delete this.peer;
        delete this.container;

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
        if($super(this) && (fire & 0x01)){
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
        if($super(this) && (fire & 0x01)){
            this.onResized(fire);
        }
    }.$override(this.setSize);
    

    thi$.setBounds = function(x, y, w, h, fire){
        if($super(this) && (fire & 0x01)){
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
        this.autoResizeContainer();
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
        var M = this.def, clazz;

        if(this.isStyleByState()){
            clazz = DOM.stateClassName(M.className || this.className,
                                       this.getState());
            DOM.setClassName(this.view, clazz, M.classPrefix);
        }
        
        if(this.isDOMElement()){
            this.showDisableCover(!this.isEnabled());            
        }
    };

    /**
     * Clone view from the view of this component
     */
    thi$.cloneView = function(){
        var view = DOM.cloneElement(this.view, true);
        view.cloned = true;
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
    
    thi$.getGeometric = function(className){
        var G, bounds;
        CLASS.G = CLASS.G || {};
        G = CLASS.G[className];
        if(!className){
            className = this.className;
            G = CLASS.G[className];
            if(!G){
                G = CLASS.G[className] = {};
                bounds = _geometric.call(this);
                G.bounds = System.objectCopy(bounds, {}, true);
            }
        }
        return G;
    };

    thi$.invalidateBounds = function(){
        /*
        this.view.bounds = null;
        
        // If the preferred size is not from the definition, it will be calcualted
        // with bounds. And when the bounds is invalidating, the old calculated 
        // preferred size should be invalidated, too.
        if(!this.isPreferredSizeSet){
            this.def.prefSize = null;
        }
        */
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
        var ret = false;
        if($super(this)){
            this.adjustController(bounds);            
            ret = true;
        }
        return ret;
    }.$override(this.doLayout);

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
            this.showDisableCover(true);
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
        this.activateComponent(e);
    };

    thi$.onmouseup = function(e){

    };

    thi$.onmouseover = function(e){

    };

    thi$.onmouseout = function(e){

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
        
        $super(this);

    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime, view){
        if(!Class.isObject(def)) return;
        
        def.classType = def.classType || "js.awt.Component";
        
        $super(this);

        var preView = Class.isHtmlElement(view), clazz;
        if(!preView || (view && view.cloned)){
            this.view = view = (view ||
                    DOM.createElement(def.viewType || "DIV"));
            view.id = this.id;
            if(def.css){
                view.style.cssText = view.style.cssText + def.css;
            }
            def.className = def.className || "jsvm__element";
        }else {
            this.view = view;
            def.className = view.clazz || view.className;
        }
        view.uuid = this.uuid();

        this.className = DOM.extractDOMClassName(def.className);
        if(this.isStyleByState()){
            clazz = DOM.stateClassName(def.className, this.getState());
        }else{
            clazz = this.className;
        }
        view.clazz = def.className;
        if(!preView || view.cloned){
            DOM.setClassName(view, clazz, def.classPrefix);
        }

        if(this.isDOMElement()){
            if(view !== document.body){
                _geometric.call(this, true);
            }
        }else{
            this._geometric = function(){
                delete this._geometric;
                return _geometric.call(this);
            };
        }
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Element).$implements(
    js.util.Observer, js.awt.Editable, js.awt.PopupLayer);


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

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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
        $super(this);

        if(this.layout){
            this.layout.invalidateLayout();
        }

    }.$override(this.removeAll);
    
    /**
     * Activate the component with specified component or id
     */
    thi$.activateComponent = function(e){
        if(e == undefined){
            $super(this);
        }

        var id, comp;
        if(e instanceof Event){
            id = e.getEventTarget().id;
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
            return $super(
                this, c, containSelf);
        }

        return this[id] != undefined;

    }.$override(this.contains);
    
    
    /**
     * @see js.awt.Component
     */
    thi$.getPreferredSize = function(){
        var size = this.def.prefSize;
        if(!size){
            return this.layout.preferredLayoutSize(this);
        }else{
            return $super(this);
        }
    }.$override(this.getPreferredSize);

    /**
     *  @see js.awt.Component
     */
    thi$.getMinimumSize = function(){
        var size = this.def.miniSize;
        if(!size){
            return this.layout.minimumLayoutSize(this);
        }else{
            return $super(this);
        }
    }.$override(this.getMinimumSize);

    /**
     * @see js.awt.Component
     */
    thi$.getMaximumSize = function(nocache){
        var size = this.def.maxiSize;
        if(!size){
            return this.layout.maximumLayoutSize(this);
        }else{
            return $super(this);
        }
    }.$override(this.getMaximumSize);
    
    /**
     * @see js.awt.Component
     */
    thi$.repaint = function(){
        if($super(this)){
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
        prefer = this.getPreferredSize(),
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
        if($super(this)){
            this.layoutComponents(force);
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
            oriComps = this._local.items, view = this.view,
            absLayout = this.layout instanceof js.awt.AbsoluteLayout;
        
        def.items = [];
        List.$decorate(def.items);
        this.view = self.document.createDocumentFragment();
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
        view.appendChild(this.view);
        this.view = view;
    };
    
    /**
     * Override the destroy of js.awt.Component
     */
    thi$.destroy = function(){
        if(this.destroied !== true){
            this.removeAll(true);
            $super(this);
        }
    }.$override(this.destroy);

    /**
     * @see js.awt.Component
     */
    thi$._init = function(def, Runtime, view){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Container";
        def.className = def.className || "jsvm_container";

        $super(this);
        
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

        $super(this, def, Runtime);

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
        
        $super(this);

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
		$super(this);
		
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
        comp = $super(this, index, comp, constraints);
        return _addComp.call(this, comp, notify);
        
    }.$override(this.insertComponent);
    
    /**
     * @see js.awt.Container#removeComponent
     */
    thi$.removeComponent = function(comp, notify){
        if(!comp) return;

        var items = this.items(), index = items.indexOf(comp.id);
        comp = $super(this, comp);
        
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
     * @see js.awt.Component
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
     * @see js.awt.Component
     */
    thi$.doLayout = function(force){
        if(this.isDOMElement() 
            && $super(this)){
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
     * @see js.awt.Component
     */
    thi$.destroy = function(){
        delete this.cache;

        $super(this);

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
        $super(this);
        
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

		$super(this);
		

	}.$override(this.destroy);
	
	thi$._init = function(def, Runtime){
		if(def == undefined) return;
		
		var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
		System.objectCopy(newDef, def, true, true);
		
		$super(this);

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
	System = J$VM.System, DOM = J$VM.DOM,
	
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
			styleClass = DOM.combineClassName(this.def.className, "highlight");
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
			styleClass = DOM.combineClassName(this.def.className, "highlight");
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
 * @fileOverview Define the basic Item component. 
 * 
 * For such Item, there are about two kinds of user cases:
 * 
 * 1) Use as the iterable items for tree, list and so on. It should be 
 * lightweight, high-performance. And it can be a little low flexibility. 
 * So we need to finish most of the layout things before appending it to 
 * the DOM tree. And reducing the "repaint" and "layout" things.
 * 
 * 2) Use as the standalone component like a button. It should be strict, 
 * flexibility and with smart layout. Of course it may be a little weighty
 * and low-performace.
 * 
 * However, we add the "strict" property in the definition of the item to 
 * diff such two scenes.
 */

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

	thi$.msgType = function(msgType){
		var U = this._local;
		if(Class.isString(msgType) && msgType.length > 0){
			U.msgType = msgType;
		}

		return U.msgType || "js.awt.event.StrictItemEvent";
	};
	
	/**
	 * Judge whether the current Item is strict for the non-iterative
	 * use scenes.
	 */
	thi$.isStrict = function(){
		return this.def.strict === true;  
	};

	/**
	 * @see js.awt.Component
	 */
	thi$.getPreferredSize = function(){
		var M = this.def, prefSize = M.prefSize, bounds = this.getBounds(),
		D, nodes, ele1, ele0, width;

		if(this.isPreferredSizeSet && prefSize){
			return prefSize;
		}

		if(!this.isStrict()){
			nodes = this.view.childNodes;
			ele1 = nodes[nodes.length-2];
			ele0 = nodes[nodes.length -1];

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

				D = DOM.getBounds(this.ctrl);
				width += D.MBP.marginLeft + D.width;
			}
			width += bounds.MBP.BPW;

			this.setPreferredSize(width, bounds.innerHeight);
			prefSize = M.prefSize;
		}else{
			bounds = this.getBounds();
			prefSize = {width: bounds.width, height: bounds.height};
		}

		return prefSize;
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
	 * @see js.awt.Component#setToolTipText
	 *
	 * @param text
	 * @param elid, can be branch, marker label and ctrl
	 */
	thi$.setToolTipText = function(text, elid){
		if(elid){
			DOM.setAttribute(this[elid], "title", text);
		}else{
			$super(this, text);
		}
	}.$override(this.setToolTipText);

	/**
	 * @see js.awt.Movable
	 */
	thi$.isMoverSpot = function(el, x, y){
		return el != this.branch &&	el != this.marker 
			&& el !== this.ctrl;
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Component#onStateChanged
	 */
	thi$.onStateChanged = function(){
		$super(this);		  
		
		if(this.isStrict() && this.icon){
			this.setIconImage(this.getState());
		}

	}.$override(this.onStateChanged);

	/*
	 * Do the strict layout	 
	 */
	var _doStrictLayout = function(force){
		if(!this.isDOMElement() || !this.needLayout(force)){
			return false;
		}

		var M = this.def, G = {}, bounds = this.getBounds(), MBP = bounds.MBP,
		xbase = MBP.paddingLeft, ybase = MBP.paddingTop,
		left = 0, top, space = bounds.innerWidth, layout = M.layout || {},
		gap = layout.gap || 0, hAlign = layout.align_x, vAlign = layout.align_y,
		ctrlAlign = M.ctrlAlign, items = M.items, len = items.length, 
		rects = [], rigid, ele, id, iid, d, r, h, c = 0, iSize, sv;

		if(!Class.isNumber(hAlign)){
			hAlign = 0.5;
		}

		if(!Class.isNumber(vAlign)){
			vAlign = 0.5;
		}

		if(!Class.isNumber(ctrlAlign)){
			ctrlAlign = 0.5;
		}
		
		for(var i = 0; i < len; i++){
			id = items[i];
			ele = this[id];

			d = G[id] = G[id] || DOM.getBounds(ele);
			MBP = d.MBP;
			iid = id.split(/\d+/g)[0];
			r = {};
			
			space -= MBP.marginLeft;
			switch(iid){
			case "label":
			case "input":
				rigid = (iid === "label") 
					? M.labelRigid === true 
					: M.inputRigid === true;

				if(rigid){
					r.width = d.width;
					space -= r.width;
				}else{
					r.width = null;
					c += 1;
				}

				// ?? Sometimes, no any height style setten for the label,
				// the height of bounds will be 0.
				if(d.height == 0){
					d.height = bounds.innerHeight;
				}
				break;

			case "icon":
			case "sign":
				r.width = d.width;
				
				if(iid === "icon"){
					iSize = M.iconSize || {};
				}else{
					iSize = M.signSize || {};
				}

				sv = iSize.width;
				if(!isNaN(sv) && sv > 0){
					r.width = sv;
				}
				
				sv = iSize.height;
				if(!isNaN(sv) && sv > 0){
					r.height = sv;
				}

				space -= r.width;				 
				break;

			default:
				r.width = d.width;
				space -= r.width;
				break;
			}
			space -= MBP.marginRight;
			
			r.node = ele;
			rects.push(r);
		}
		
		space -= gap * (len - 1);
		
		if(c > 1){
			space = Math.round(space / c);
		}
		
		if(c == 0){
			left = Math.round(space * hAlign);
		}

		for(i = 0, len = rects.length; i < len; i++){
			r = rects[i];
			if(r.width == null){
				r.width = space;
			}

			ele = r.node;
			id = ele.id;
			iid = id.split(/\d+/g)[0];

			d = G[id];
			MBP = d.MBP;
			h = r.height || d.height;

			left += MBP.marginLeft;

			if(iid == "ctrl" && Class.isNumber(ctrlAlign)){
				top = ybase + (bounds.innerHeight - h) * ctrlAlign;
			}else{
				if(!Class.isNumber(vAlign)){
					vAlign = 0.5;
				}
				top = ybase + (bounds.innerHeight - h) * vAlign;
			}

			if(iid == "label"){
				ele.style.lineHeight = h + "px";
			}

			DOM.setBounds(r.node, xbase + left, top, r.width, h, 0);

			left += r.width + MBP.marginRight + gap;
		}
		
		return true;
		
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Item#doLayout
	 */
	thi$.doLayout = function(){
		if(!this.isStrict()){
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
		}else{
			_doStrictLayout.apply(this, arguments);
		}

	};

	/**
	 * The js.awt.Item is prepared for those iterable cases. So it must
	 * be simple enough. And it must not be resized, moved, floating and
	 * showing shadow. However it can be disabled.
	 * 
	 * @link js.awt.Component#repaint
	 * @link js.awt.Component#repaint
	 */
	thi$.repaint = function(){
		var rst = false;
		if(!this.isStrict()){
			if(this.isDOMElement()){
				rst = true;
				this.showDisableCover(!this.isEnabled());
			}
		}else{
			rst = $super(this);
		}

		return rst;

	}.$override(this.repaint);

	thi$.destroy = function(){
		if(this.input){
			Event.detachEvent(this.input, "focus", 1,  this, _onFocus);
		}

		if(this.isStrict() && !this.isStateless()){
			this.attachEvent("mouseover", 4, this, _onHover);
			this.attachEvent("mouseout", 4, this, _onHover);

			this.attachEvent("mousedown", 4, this, _onmousedown);
			this.attachEvent("mouseup", 4, this, _onmouseup);
		}

		$super(this);

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
		var U = this._local;
		if(U.eventAttached){
			Event.detachEvent(this.input, 'keydown', 0, this, _onKeyDown);
			Event.detachEvent(this.input, "blur", 1, this, _onBlur);

			U.eventAttached = false;
		}

		this.onSubmit(e);
	};

	var _onHover = function(e){
		if(e.getType() === "mouseover"){
			if(this.contains(e.toElement, true)
			   && !this.isHover()){
				this.setHover(true);
			}
		}else{
			if(!this.contains(e.toElement, true)
			   && this.isHover()){
				this.setHover(false);
			}
		}
	};

	var _onmousedown = function(e){
		this._local.mousedown = true;

		e.setEventTarget(this);
		this.notifyPeer(this.msgType(), e);
	};

	var _onmouseup = function(e){
		if(this._local.mousedown === true){
			delete this._local.mousedown;

			if(this.def.toggle === true){
				this.setTriggered(!this.isTriggered());
			}

			e.setEventTarget(this);
			this.notifyPeer(this.msgType(), e);
		}
	};

	var _createElements = function(){
		var M = this.def, items = M.items, G = {}, bounds,
		MBP, xbase, ybase, left, top, height, innerHeight,
		D, ele, id ,iid, viewType, i, len, 
		buf = this.__buf__, uuid = this.uuid(),
		strict = this.isStrict();

		// For the iterable items, rectify the Box-model compatibility 
		// differences in advance.
		if(!strict){
			bounds = DOM.getBounds(this.view);

			if(!bounds.BBM){
				DOM.setSize(this.view, undefined, bounds.innerHeight);
				bounds = DOM.getBounds(this.view);				  
			}

			MBP = bounds.MBP;
			xbase = MBP.paddingLeft;
			ybase = MBP.paddingTop;
			left = xbase;

			innerHeight = bounds.innerHeight;
		}		 
		
		for(i = 0, len = items.length; i < len; i++){
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
			ele.className = DOM.combineClassName(this.className, id);
			ele.iid = iid;

			buf.clear();
			buf.append("position:absolute;display:block;");

			// For the iterable items, do the layout things ahead
			if(!strict){
				if(!G[iid]){
					ele.style.cssText = "display:block;";
					G[iid] = DOM.getBounds(ele);
				}

				D = G[iid];
				top = ybase + (innerHeight - D.height) * 0.5;
				buf.append("top:").append(top).append("px;");

				if(iid !== "ctrl"){
					buf.append("left:").append(left).append("px;");
					left += D.MBP.marginLeft + D.width + D.MBP.marginRight;
				}else{
					buf.append("right:")
						.append(bounds.MBP.paddingRight).append("px;");
				}
			}

			if(iid == "label"){
				buf.append("white-space:nowrap;");
			}

			ele.style.cssText = buf.toString();

			ele.uuid = uuid;
			this[id] = ele;

			DOM.appendTo(ele, this.view);
		}
	};

	var _checkItems = function(){
		var M = this.def, items = M.items;
		if(items.length > 0){
			return;
		}

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
	};

	thi$._init = function(def, Runtime, view){
		if(def == undefined) return;

		def.classType = def.classType || "js.awt.Item";
		def.className = def.className || "jsvm_item";

		$super(this, def, Runtime, view);

		var M = this.def, uuid = this.uuid(), items, nodes, id, 
		i, len, node, text, ipt, placeholder;
		if(view == undefined){
			items = M.items = M.items || [];

			_checkItems.call(this);
			_createElements.call(this);
		}else{
			items = M.items = [];

			nodes = this.view.childNodes;
			len = nodes.length;
			for(i = 0; i < len; i++){
				node = nodes[i]; 
				id = node.id;
				node.iid = (node.iid || id.split(/\d+/g)[0]);
				node.className = DOM.combineClassName(this.className, id);
				items.push(id);

				node.uuid = uuid;
				this[id] = node;
			}
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

		if(this.isStrict() && !this.isStateless()){
			this.attachEvent("mouseover", 4, this, _onHover);
			this.attachEvent("mouseout", 4, this, _onHover);

			this.attachEvent("mousedown", 4, this, _onmousedown);
			this.attachEvent("mouseup", 4, this, _onmouseup);
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
		if($super(this)){
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
		
		$super(this);
		
	}.$override(this.destroy);
	
	/**
	 * Specify a component as current item's customized contents.
	 * 
	 * @param comp: {Object} A custom component must be an object of the Component
	 *		  or Component's derived class. And it must implement an getValue method
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
		
		$super(this, def, Runtime, view);
		
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
 * Define Label component:
 * 
 * @param {Object} def Definition of the label.
 *		
 *		  @example
 *		  {
 *			  className: required, 
 *			  css: optional,
 * 
 *			  text: optional,
 * 
 *			  editable:optional 
 *		  }
 */
js.awt.Label = function(def, Runtime) {
	var CLASS = js.awt.Label, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, 
	DOM = J$VM.DOM,	System = J$VM.System, MQ = J$VM.MQ,

	StringClass = js.lang.String,

	textSps = [
		"font-family", "font-size", "font-style",
		"font-weight", "text-decoration", "text-align",
		"font-weight", "line-height"
	];

	/**
	 * Judge whethe the current label can be wrodwrap.
	 * 
	 * @return {Boolean}
	 */
	thi$.canWordwrap = function(){
		return this.def.wordwrap === true;	
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Component#getPreferredSize
	 */
	thi$.getPreferredSize = function(){
		var M = this.def, styles, args, textSize, d, w, h;
		if((!this.isPreferredSizeSet || !M.prefSize)
			&& this.isDOMElement()){

			d = this.getBounds();

			if(!this.canWordwrap()){
				styles = DOM.getStyles(this.view, textSps);

				args = [M.text, styles];
				textSize = DOM.getStringSize.apply(DOM, args);

				w = textSize.width + d.MBP.BPW;
				h = textSize.height + d.MBP.BPH;

			}else{
				w = d.width;
				h = d.height;
			}

			this.setPreferredSize(w, h);
		}

		return M.prefSize;

	}.$override(this.getPreferredSize);
	
	/**
	 * Return the text contents of current label.
	 * 
	 * @return {String}
	 */
	thi$.getText = function() {
		return this.def.text;
	};

	/**
	 * Sets lable text, only and only if encode == false, the text
	 * won't be encoded for html.
	 * 
	 * @param {String} text Text contents
	 * @param {Boolean} encode
	 */
	thi$.setText = function(text, encode) {
		text = this.def.text = text || "";

		var M = this.def, view = this.view,
		v = (encode == false) ? text
			: StringClass.encodeHtml(text, undefined, this.canWordwrap()),
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
			M.prefSize = undefined;
		}
	};

	/**
	 * Sets the email string to show with the "mailto" protocol.
	 * 
	 * @param {String} text The email address to set.
	 */
	thi$.setEMail = function(text) {
		text = this.def.text = text || "";
		
		var str = StringClass.encodeHtml(text, undefined, this.canWordwrap()),
		mail = document.createElement("A");
		mail.href = "mailto:" + str;
		this.view.appendChild(mail);
		mail.innerHTML = str;

		if(!this.isPreferredSizeSet){
			this.def.prefSize = undefined;
		}

	};

	/**
	 * Judge whether the current label can be editable.
	 * 
	 * @return {Boolean}
	 */
	thi$.isEditable = function(){
		return this.def.editable || false;
	};

	/**
	 * Enable / disable to edit the current label. If true, editing by
	 * double click will be supported.
	 * 
	 * @param {Boolean} b
	 */
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
	 * Highlight all the matched in the current label with the given searching
	 * keyword and control mode.
	 * 
	 * @param {String} keyword The keyword of the <em>RegExp</em> object 
	 *		  which is used to matched.
	 * @param {String} mode "global|insensitive|wholeword".
	 * @param {String} highlightClass The style class for highlighting text.
	 */
	thi$.highlightAll = function(keyword, mode, highlightClass) {
		var text = this.getText(), can = this.canWordwrap(), 
		kit, pattern, className, newText;
		if (!keyword || !mode || !text)
			return;

		text = StringClass.encodeHtml(text, undefined, can);
		keyword = StringClass.encodeHtml(keyword, undefined, can);

		kit = Class.forName("js.swt.SearchKit");
		pattern = kit.buildRegExp(keyword, mode);
		if(!pattern){
			return;
		}
		
		className = highlightClass;
		if (!className) {
			className = DOM.combineClassName(this.className, "highlight");
		}

		this.view.innerHTML = text.replace(
			pattern, 
			function(m) {
				return "<span class=\"" + className + "\">" + m + "</span>";
			});
	};
	
	/**
	 * Highlight all the matches in the current label accordig to the specified
	 * matched result.
	 * 
	 * @param {Array} matches Each element in it is a object maintained each
	 *		  match's start index and its length. 
	 * 
	 *		  @example Its structure is as follow:
	 *		  [
	 *			{start: m, length: x},
	 *			...
	 *			{start: n, length: x}	  
	 *		  ]
	 *
	 * @param {String} highlightClass The style class for highlighting text.
	 */
	thi$.highlightMatches = function(matches, highlightClass) {
		var text = this.getText(), can = this.canWordwrap(), className, 
		rpSeg, subStr, i, mCnt, aMatches, vernier = 0;
		if (!Class.isString(text) || text.length == 0){
			return;
		}

		className = highlightClass 
			|| DOM.combineClassName(this.className, "highlight");

		rpSeg = new js.lang.StringBuffer();
		mCnt = matches ? matches.length : 0;
		vernier = 0;
		
		for(i = 0; i < mCnt; i++){
			aMatches = matches[i];
			if(aMatches.start > vernier){
				subStr = text.substring(vernier, aMatches.start);
				subStr = StringClass.encodeHtml(subStr, undefined, can);
				rpSeg.append(subStr);
				
				subStr = text.substr(aMatches.start, aMatches.length);
				subStr = StringClass.encodeHtml(subStr, undefined, can);
				subStr = "<span class=\"" + className + "\">" + subStr + "</span>";
				rpSeg.append(subStr);
				
				vernier = aMatches.start + aMatches.length;

			}else if(aMatches.start == vernier){
				subStr = text.substr(aMatches.start, aMatches.length);
				subStr = StringClass.encodeHtml(subStr, undefined, can);
				subStr = "<span class=\"" + className + "\">" + subStr + "</span>";
				rpSeg.append(subStr);
				
				vernier = aMatches.start + aMatches.length;
			}else{
				//Error
			}
		}
		
		if(vernier <= text.length){
			subStr = text.substr(vernier);
			subStr = StringClass.encodeHtml(subStr, undefined, can);
			rpSeg.append(subStr);
		}

		this.view.innerHTML = rpSeg.toString();
		rpSeg = null;
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Component#doLayout
	 */
	thi$.doLayout = function(){
		if($super(this)){
			if(!this.canWordwrap()){
				this.view.style.lineHeight = DOM.innerHeight(this.view) + "px";
			}

			return true;			
		}

		return false;

	}.$override(this.doLayout);
	
	thi$._init = function(def, Runtime) {
		if(def == undefined) return;

		def.classType = def.classType || "js.awt.Label";
		def.className = def.className || "jsvm_label";
		def.wordwrap = (def.wordwrap === true);

		def.css = (def.css || "") + "margin:0px;" 
			+ (def.wordwrap ? "white-space:normal;" : "white-space:nowrap;");

		def.text = (typeof def.text == "string") ? def.text : "Label";
		def.viewType = "SPAN";

		$super(this);
		
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
		$super(this);
		DOM.setAttribute(this.imageView, "title", s);

	}.$override(this.setToolTipText);

	thi$.onStateChanged = function(e){
		$super(this);
		
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

		$super(this);

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
		$super(this);
		
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
 Copyright 2007-2015, The JSVM Project.
 All rights reserved.

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
 *	 className: string, required
 *
 *	 id: request,
 *
 *	 iconImage: "",
 *	 iconAlign: "left"|"right"|"top"|"bottom"
 *	 labelText: "Button",
 *
 *	 state:optional,
 *	 toggle:boolean, required
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
			marker.className = DOM.combineClassName(this.className, "marker_4");
		}else{
			marker.className = DOM.combineClassName(this.className, "marker_0");
		}
	};

	thi$.isOnMousedown = function(){
		return this._local.mousedown === true;
	};

	thi$.setTipText = function(s){
		$super(this);

		if(this.icon) {
			DOM.setAttribute(this.icon, "title", s);
		}
		if(this.label){
			DOM.setAttribute(this.label, "title", s);
		}

	}.$override(this.setTipText);

	/**
	 * @see js.awt.Component
	 */
	thi$.repaint = function(){
        var M = this.def;
        
		$super(this);
        
        if(this.icon){
			this.setIconImage(this.isTriggered() ? 4 :
                              (this.isEnabled() ? 0 : 1));
		}

		if(this.label){
			this.setText(M.labelText || M.text || M.name || "Button");
		}

		if(M.effect){
			this._local.effectClass = M.effectClass;
			_createEffectLayer.call(this);
		}

	}.$override(this.repaint);

	/**
	 * @see js.awt.Component
	 */
	thi$.doLayout = function(force){
        if(!$super(this))
            return;

		var M = this.def, G0 = this.getGeometric(), B = this.getBounds(),
			BBM = B.BBM, MBP = B.MBP,
			innerWidth = B.innerWidth, innerHeight= B.innerHeight,
			xbase = MBP.paddingLeft, ybase = MBP.paddingTop,
			align_x = M.layout.align_x,
			align_y = M.layout.align_y,
			items = M.items, ele, i, len, cwidth = 0, D,
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

	}.$override(this.doLayout);

	/**
	 * @see js.awt.State
	 * @see js.awt.Component
	 */
	thi$.onStateChanged = function(){
		$super(this);

		if(this.icon){
			this.setIconImage(this.getState());
		}
	}.$override(this.onStateChanged);

	thi$.setEnabled = function(b){
		if(!b){
			_showEffectLayer.call(this, "normal");
		}

		$super(this);

	}.$override(this.setEnabled);

	var _getEffectStyleClass = function(style){
		style = style || "normal";

		var tclazz = this._local.effectClass;
		if(tclazz){
			tclazz = DOM.combineClassName(tclazz, style);
		}else{
			tclazz = DOM.combineClassName("jsvm_btnEffect", style);

			if(this.className){
				style = "Effect" + "_" + style;
				tclazz += " " + DOM.combineClassName(this.className, style, "");
			}
		}

		return tclazz;		  
	};

	var _showEffectLayer = function(style){
		if(!this._effectLayer || !this.isEnabled()){
			return;
		}

		this._effectLayer.className 
			= _getEffectStyleClass.call(this, style);

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
				this.view.className 
					= DOM.stateClassName(this.def.className, state);
			}
		}
	};

	var _createEffectLayer = function(){
		var layer = this._effectLayer = DOM.createElement("DIV");
		layer.uuid = this.uuid();
		layer.className = _getEffectStyleClass.call(this, "normal");
		layer.style.cssText = "position:absolute;left:0px;top:0px;";
        this.view.appendChild(layer);
	};

	var _adjustEffectLayer = function(){
		if(this._effectLayer){
			// The effect layer has border
			DOM.setSize(this._effectLayer,
						this.view.clientWidth, this.view.clientHeight);
		}
	};

	thi$.onmousedown = function(e){
        e.cancelBubble();

		_showEffectLayer.call(this, "trigger");

		this._local.mousedown = true;
		this.onHover(false, e.getType());

		e.setEventTarget(this);
		this.notifyPeer(this.getMsgType(), e);

	}.$override(this.onmousedown);

	thi$.onmouseup = function(e){
        e.cancelBubble();
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
	}.$override(this.onmouseup);

	thi$.onHover = function(b, eType){
		// Do something if need.
	};

	thi$.onmouseover = function(e){
        e.cancelBubble();

		if(this.contains(e.toElement, true)
		   && !this.isHover()){
			this.setHover(true);
			_showEffectLayer.call(this, "hover");

			this.onHover(true, e.getType());
		}
	}.$override(this.onmouseover);

	thi$.onmouseout = function(e){
        e.cancelBubble();

		if(!this.contains(e.toElement, true)
		   && this.isHover()){
			delete this._local.mousedown;

			this.setHover(false);
			_showEffectLayer.call(
				this,
				!this.isTriggered() ? "normal" : "trigger");

			this.onHover(false, e.getType());
		}
	}.$override(this.onmouseout);

	var _createElements = function(){
		var G = this.getGeometric(), className = this.className,
		    items = this.def.items, ele, id, iid, viewType, i, len;

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
                G[iid] = DOM.getBounds(ele);
			}
			ele.style.position ="absolute";
			DOM.appendTo(ele, this.view);
		}
	};

	var _checkItems = function(){
		var M = this.def, items = M.items = (M.items || []);
		if(items.length == 0){
			if(this.isMarkable()) items.push("marker");
			if(M.iconImage) items.push("icon");
			if(M.labelText) items.push("label");
		}
	};

	thi$.destroy = function(){
		DOM.remove(this._effectLayer, true);
		delete this._effectLayer;

		$super(this);

	}.$override(this.destroy);

	thi$._init = function(def, Runtime, view){
		if(typeof def !== "object") return;

		def.classType = def.classType || "js.awt.Button";
		def.className = def.className || "jsvm_button";

		$super(this, def, Runtime, view);

		var layout = def.layout = def.layout || {};
		layout.align_x = Class.isNumber(layout.align_x) ? layout.align_x : 0.5;
		layout.align_y = Class.isNumber(layout.align_y) ? layout.align_y : 0.5;

		// Create inner elements
		if(!Class.isHtmlElement(view)){
			_checkItems.call(this);
			_createElements.call(this);
		}

		def.items = [];
		var uuid = this.uuid(), nodes = this.view.childNodes,
		id, i, len, node;
		for(i=0, len=nodes.length; i<len; i++){
			node = nodes[i]; id = node.id;
			node.uuid = uuid;
			node.iid = (node.iid || id.split(/\d+/g)[0]);
			def.items.push(id);
			this[id] = node;
		}

		this.setAttribute("touchcapture", "true");
        
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

		$super(this);

	}.$override(this.notifyPeer);
	
	thi$.destroy = function(e){
		if(!this.isWholeTrigger()){
			this.detachEvent("click", 4, this, _onclick);
		} 
		
		$super(this);		 
		
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
		
		$super(this, def, Runtime, view);

		this.mark(def.marked);
		
		if(!this.isWholeTrigger()){
			this.attachEvent("click", 4, this, _onclick);
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
        $super(this);

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

        $super(this);

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
        
        $super(this);
        
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
        
        $super(this, def, Runtime, view);

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
		$super(this);

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
			peer = $super(this);
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
		
		$super(this);
		
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
		
		$super(this);

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
		
		$super(this, def, Runtime, view);
		
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

		$super(this, def, Runtime);

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
			$super(this) :
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
			b = $super(this);
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
		$super(this);
	}.$override(this.hide);

	/**
	 * @see js.awt.Component
	 * @see js.awt.Component
	 */
	thi$.repaint = function(){
		if(!this._local.repaint){
			var M = this.def, bounds = this.getBounds(),
			    nodes = this.nodes, node, i, len;

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
			if(M.shadow){
				this.showShadow(true, M.shadowClassName);
			}

			// For floating layer
			if(M.isfloating === true && !this.floatingSettled()){
				this.setFloating(true);
			}

			nodes = this.nodes;
			for(i=0, len=nodes.length; i<len; i++){
				node = nodes[i];
				if(!(node instanceof js.awt.MenuSeparator)){
					node.doLayout();
					node.setEnabled(node.isEnabled());
				}
			}
			this._local.repaint = true;
		}

        this.adjustLayers("resize");

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

		$super(this);

	}.$override(this.destroy);


	thi$._init = function(def, Runtime, parentMenu, rootMenu){
		if(def == undefined) return;

		def.classType = def.classType || "js.awt.Menu";
		def.className = def.className || "jsvm_menu";
		def.isfloating = true;
		def.PMFlag = def.PMFlag || 0x27;

		$super(this, def, Runtime);

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
		this.attachEvent("mouseover", 4, this, _onmouseover);
		this.attachEvent("mouseout",  4, this, _onmouseover);
		this.attachEvent("click",	  4, this, _onclick);

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

    thi$.isMovable = function(){
        return this.treeContainer().isMovable();
    };

    thi$.spotIndex = function(){
        return 11;
    };

    thi$.isMoverSpot = function(ele, x, y){
        return this.treeContainer().isMoverSpot(ele, x, y);
    };

    thi$.getMoveObject = function(e){
        return this.treeContainer().getMoveObject(e);
    };

    thi$.getMovingConstraints = function(){
        return this.treeContainer().getMovingConstraints();
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
				// Ref: js.awt.Component#_init
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
		$super(this);

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

		$super(this);

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

		$super(this, def, Runtime, view);

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
		
		$super(this);
		
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
				// Ref: js.awt.Component#_init
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

			moveObj.setPosition(absXY.x+8, absXY.y+8, 4);
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

		$super(this);

	}.$override(this.onResized);

	thi$.doLayout = function(){
		if($super(this)){
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

		var isMulti = this.def.multiEnable, selected = this.selected, 
		tmp, doo = false;
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

			doo = true;
			e.setEventTarget(item);
		}else{
			if(selected.length > 0){
				this.clearAllSelected();

				doo = true;
			}
		}

		if(doo){
			e.setType("selectchanged");
			e.setData(this.getAllSelected());
			this.notifyPeer("js.awt.event.TreeItemEvent", e);
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


		$super(this);

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
		$super(this, def, Runtime);
		
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

		this.attachEvent("mouseover",  4, this, _onmouseover);
		this.attachEvent("mouseout",   4, this, _onmouseover);
		this.attachEvent("click",	   4, this, _onclick);
		this.attachEvent("dblclick",   4, this, _onclick);
		// Avoid autoscroll when drag item.
		this.attachEvent("mousedown",  4, this, _onmousedown);

        
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

		$super(this);

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

		$super(this);

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
		if($super(this)){
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

		$super(this, def, Runtime);

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

        $super(this);
        
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

        $super(this);
        
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
        comp = $super(this);
        this.stack.remove(comp); 
    }.$override(this.removeComponent);
    
    thi$.removeAll = function(){
        this.stack.clear();
        $super(this);
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
        
        $super(this);
        
        this.stack = js.util.LinkedList.$decorate([]);
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
}.$extend(js.awt.Container);

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

    this.onresize = function(e){
        System.updateLastAccessTime();
        $super(this);
        this.LM.clearStack(e);
        for(var appid in apps){
            this.getApp(appid).fireEvent(e);
        }
    }.$override(this.onresize);

    var _onkeyevent = function(e){
        System.updateLastAccessTime();
        MQ.post("js.awt.event.KeyEvent", e);
    };

    var drags = {}, lasts ={};
    
    var _onmousemove = function(e){
        var ele, target, drag, last, now, spot;
        System.updateLastAccessTime();

        last = lasts[e.pointerId] || 0;
        if((e.getTimeStamp().getTime() - last) <=
                System.getProperty("j$vm_threshold", 15)){
            e.cancelBubble();
            return e.cancelDefault();
        }

        ele = e.srcElement;
        target = e.getEventTarget();
        drag = drags[e.pointerId];
        if(!drag){
            if(target && target != this){
                if(target.isMovable() || target.isResizable()){
                    spot = target.spotIndex(ele, e.eventXY());
                    DOM.setDynamicCursor(ele, DOM.getDynamicCursor(spot));
                }else{
                    DOM.setDynamicCursor(ele, null);
                }

                target.fireEvent(e, true);
            }
        }else{
            if(!this._local.notified){
                MQ.post(Event.SYS_EVT_MOVING, "");
                this._local.notified = true;
            }

            DOM.setDynamicCursor(ele, DOM.getDynamicCursor(drag.spot));
            
            if(drag.spot >= 8){
                drag.target.processMoving(e);
            }else{
                drag.target.processSizing(e, drag.spot);
            }
        }

        lasts[e.pointerId] = new Date().getTime();
        e.cancelBubble();
        return e._default;
    };

    var _onmouseover = function(e){
        var ele, target, drag;

        ele = e.srcElement;
        target = e.getEventTarget();
        drag = drags[e.pointerId];
        if(!drag){
            if(target && target != this){
                target.fireEvent(e, true);
            }
        }
        e.cancelBubble();
        return e._default;
    };

    var _onmouseout = function(e){
        var ele, target, drag;

        ele = e.srcElement;
        target = e.getEventTarget();
        drag = drags[e.pointerId];
        if(!drag){
            if(target && target != this){
                target.fireEvent(e, true);
            }

            ele = e.fromElement;
            if(ele){
                DOM.setDynamicCursor(ele, null);
            }
        }
        e.cancelBubble();
        return e._default;
    };

    var _onmousedown = function(e){
        var ele, target, spot;
        System.updateLastAccessTime();        
        this.LM.cleanLayers(e, this);

        ele = e.srcElement;
        target = e.getEventTarget();
        if(target && target != this){
            target.fireEvent(e, true);

            if(e.button === 1 && !e.ctrlKey && !e.shiftKey &&
               (target.isMovable() || target.isResizable())){
                spot = target.spotIndex(ele, e.eventXY());
                if(spot >= 0){
                    var mover = target.getMovingConstraints(),
                        longpress = mover.longpress;
                    longpress = Class.isNumber(longpress) ? longpress :
                        J$VM.env["j$vm_longpress"] || 145;

                    _drag.$delay(this, longpress, e.pointerId, {
                        event: e,
                        absXY: e.eventXY(),
                        srcElement: ele,
                        target: target,
                        spot: spot
                    });
                }
            }
        }

        e.cancelBubble();
        return e._default;
    };

    var _drag = function(id, drag){
        drags[id] = drag;
        if(drag.spot >= 8){
            drag.target.startMoving(drag.event);
        }else{
            drag.target.startSizing(drag.event, drag.spot);
        }
    };

    var _onmouseup = function(e){
        var ele, target, drag;
        System.updateLastAccessTime();
        _drag.$clearTimer();

        ele = e.srcElement;
        target = e.getEventTarget();
        drag = drags[e.pointerId];
        if(!drag){
            if(target && target != this){
                target.fireEvent(e, true);
            }
        }else{
            MQ.post(Event.SYS_EVT_MOVED, "");
            this._local.notified = false;

            if(drag.spot >= 8){
                drag.target.endMoving(e);
            }else{
                drag.target.endSizing(e, drag.spot);
            }
        }

        drags[e.pointerId] = null;
        DOM.setDynamicCursor(ele, null);

        e.cancelBubble();
        return e._default;
    };

    var _onmousewheel = function(e){
        System.updateLastAccessTime();        
        this.LM.cleanLayers(e, this);
    };

    var _oncontextmenu = function(e){
        e.cancelBubble();
        return e.cancelDefault();
    };
    
    var _onclick = function(e){
        var ele, target, drag;

        ele = e.srcElement;
        target = e.getEventTarget();
        drag = drags[e.pointerId];
        if(!drag){
            if(target && target != this){
                target.fireEvent(e, true);
            }
        }
        e.cancelBubble();
        return e._default;
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

    var _onhtmlevent = function(e){
        var target;
        target = e.getEventTarget();
        if(target){
            target.fireEvent(e, false);
        }
        e.cancelBubble();
        return e._default;
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
        $super(
            this, b, style || "jsvm_desktop_mask");
        if(b){
            // The desktop's cover should be below the first-level dialog.
            // Assume that at most five levels dialogs can be opened.
            //this.setCoverZIndex(_getMaxZIndex.call(this)+1);
            this.setCoverZIndex(this.DM.def.zbase - 5);
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
            link.href = DOM.makeUrlPath(J$VM.j$vm_home,
                                        "../style/"+theme+"/"+file);
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
     * @see js.awt.Component
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

        $super(this);

    }.$override(this.destroy);

    thi$._init = function(Runtime){
        var dom = self.document, body = dom.body,        
            def = {
                classType: "js.awt.Desktop",
                id: body.id,
                uuid: "desktop",
                zorder:true,
                stateless: true,            
                zbase:1,
                __contextid__: Runtime.uuid()
            };

        $super(this, def, Runtime, body);

        // Popup Layer manager
        var LM = this.LM = new js.awt.LayerManager(
            {classType: "js.awt.LayerManager",
             id: body.id,
             uuid: "layer-manager", 
             zorder:true,
             stateless: true,
             zbase: 10000
            }, Runtime, body);

        // Popup dialog manager
        var DM = this.DM = new js.awt.Container(
            {classType: "js.awt.Container",
             id: body.id,
             uuid: "dialog-manager",
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

        _bindEvents.call(this);

        R = Runtime;

    }.$override(this._init);

    var _bindEvents = function(){
        var dom = self.document,
            EVENTS = [
                [self, Event.W3C_EVT_RESIZE,        this.onresize],
                [self, Event.W3C_EVT_MESSAGE,       _onmessage],

                [dom,  Event.W3C_EVT_KEY_DOWN,      _onkeyevent],
                [dom,  Event.W3C_EVT_KEY_UP,        _onkeyevent],
            
                [dom,  Event.W3C_EVT_MOUSE_MOVE,    _onmousemove],
                [dom,  Event.W3C_EVT_MOUSE_OVER,    _onmouseover],
                [dom,  Event.W3C_EVT_MOUSE_OUT,     _onmouseout],   
                [dom,  Event.W3C_EVT_MOUSE_DOWN,    _onmousedown],
                [dom,  Event.W3C_EVT_MOUSE_UP,      _onmouseup],
                [dom,  Event.W3C_EVT_MOUSE_CLICK,   _onclick],
                [dom,  Event.W3C_EVT_MOUSE_DBCLICK, _onclick],        
                [dom,  Event.W3C_EVT_MOUSE_WHEEL,   _onmousewheel],
                [dom,  Event.W3C_EVT_CONTEXTMENU,   _oncontextmenu],

                [dom,  Event.SYS_EVT_ELE_APPEND,    _onhtmlevent]
              //[dom,  Event.SYS_EVT_ELE_REMOVED,   _onhtmlevent],
              //[dom,  Event.SYS_EVT_ELE_POSITION,  _onhtmlevent],
              //[dom,  Event.SYS_EVT_ELE_SIZE,      _onhtmlevent],
              //[dom,  Event.SYS_EVT_ELE_ZINDEX,    _onhtmlevent],
              //[dom,  Event.SYS_EVT_ELE_ATTRS,     _onhtmlevent],
              //[dom,  Event.SYS_EVT_ELE_STYLE,     _onhtmlevent]        
            ], item;

        for(var i=0, len=EVENTS.length; i<len; i++){
            item = EVENTS[i];
            Event.attachEvent(item[0], item[1], 0, this, item[2]);
        }
    };

    this._init.apply(this, arguments);

}.$extend(js.awt.Container);


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

$import("js.awt.Container");

js.awt.Window = function (def, Runtime, view){

	var CLASS = js.awt.Window, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ,

	titleItemMap = {
		btnMin:	  {iconImage: "edit2.gif"},
		btnMax:	  {iconImage: "remove.gif"},
		btnClose: {iconImage: "sort2.png"}
	};
	
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
			return !comp.contains(el, true);			
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
		return $super(this) || 
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
				$super(this);	  
			}else{
				ele = this.client.view; 
				styles = DOM.currentStyles(ele);
				overflowX = styles.overflowX; 
				overflowY = styles.overflowY;
				ele.style.overflow = "hidden";
				$super(this);
				ele.style.overflowX = overflowX;
				ele.style.overflowY = overflowY;
			}

			return true;
		}

		return false;

	}.$override(this.doLayout);
	
	var _setSizeTo = function(winsize){
		var U = this._local, d, m, r;
		winsize = winsize || "normal";
		switch(winsize){
		case "maximized":
			var p = this.view.parentNode;
			d = {x: 0, y: 0, width: p.scrollWidth, height: p.scrollHeight };
			U.movable = this.isMovable();
			U.resizable = this.isResizable();
			U.alwaysOnTop = this.isAlwaysOnTop();
			m = false; 
			r = false;
			break;
		case "minimized":
			d = this.getMinimumSize();
			d.x = U.userX;
			d.y = U.userY;
			U.movable = this.isMovable();
			U.resizable = this.isResizable();
			m = this.isMovable();
			r = false;
			break;
		default:
			d = { width: U.userW, height:U.userH };
			d.x = U.userX;
			d.y = U.userY;
			m = U.movable || this.isMovable();
			r = U.resizable || this.isResizable();
			break;
		}

		this.setMovable(m);
		this.setResizable(r);
		this.setBounds(d.x, d.y, d.width, d.height, 3);
	};

	thi$.onbtnMin = function(button){
		var U = this._local;
		if(this.isMinimized()){
			// Restore
			this.setMinimized(false);
			_setSizeTo.call(this, "normal");				
		}else{
			if(this.isMaximized()){
				this.setMovable(U.movable);
				this.setResizable(U.resizable);
			}
			this.setMinimized(true);
			_setSizeTo.call(this, "minimized");			   
		}
	};
	
	thi$.onbtnMax = function(button){
		var U = this._local;
		if(this.isMaximized()){
			// Restore
			this.setMaximized(false);
			_setSizeTo.call(this, "normal");
			button.setTriggered(false);
			button.setToolTipText(this.Runtime().nlsText("btnMax_tip"));	
		}else{
			if(this.isMinimized()){
				this.setMovable(U.movable);
				this.setResizable(U.resizable);
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
			return $super(this);
		}else{
			return this.def.winsize == "maximized";
		}
	}.$override(this.isMaximized);
	
	thi$.setMaximized = function(b){
		if(typeof arguments.callee.__super__ == "function"){
			// 0.9d
			$super(this);
		}else{
			this.def.winsize = b ? "maximized" : "normal";
		}
	}.$override(this.setMaximized);

	thi$.isMinimized = function(){
		if(typeof arguments.callee.__super__ == "function"){
			// 0.9d
			return $super(this);
		}else{
			return this.def.winsize == "minimized";
		}
	}.$override(this.isMinimized);
	
	thi$.setMinimized = function(b){
		if(typeof arguments.callee.__super__ == "function"){
			// 0.9d
			$super(this);
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
	
    thi$.onmouseover = function(e){
        e.cancelBubble();
        var title = this.title, ele, xy, style;
        if(!title) return;

        ele = e.toElement;
        xy = this.relative(e.eventXY());
        style = this.getTitleStyle();

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

    }.$override(this.onmouseover);

    thi$.onmouseout = function(e){
        e.cancelBubble();
        var title = this.title, ele, xy, style;
        if(!title) return;

        ele = e.toElement;
        xy = this.relative(e.eventXY());
        style = this.getTitleStyle();

		if(!this.contains(ele, true) && ele !== this._coverView){

			if(style.tstyle === 3){
				title.setVisible(false);
			}

			if(style.bstyle === 3){
				this.showtitlebutton(false);
			}
		}
		this.setHover(false);

    }.$override(this.onmouseout);

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
		$super(this);

	}.$override(this.destroy);

	/**
	 * Recognize and generate the definition for the specified title item.
	 * 
	 * @param {String} iid The specified item id.
	 * @param {Object} def The current panel definition.
	 * @param {Runtime} R
	 */
	thi$.getTitleItemDef = function(iid, def, R){
		var tmp, idef;

		switch(iid){
		case "labTitle":
			idef = {
				classType: "js.awt.Label",
				
				rigid_w: false, rigid_h: false,
				align_x: 0.0, align_y: 1.0
			};
			break;
		case "btnMin":
		case "btnMax":
		case "btnClose":
			idef = {
				classType: "js.awt.Button",
				className: "jsvm_title_button",
				
				rigid_w: true, rigid_h: false
			},

			tmp = titleItemMap[iid];
			idef.iconImage = tmp.iconImage;

			if(tmp.nlsKey){
				idef.tip = R.nlsText(tmp.nlskey, tmp.defaultTip);
			}
			break;
		default:
			break;
		}

		return idef;
	};

	var _preTitleDef = function(def, R){
		var tdef = def.title || {}, 
		items = tdef.items = def.titleItems || tdef.items 
			|| ["labTitle", "btnMin", "btnMax", "btnClose"],
		iid, idef;

		tdef.classType = tdef.classType || "js.awt.HBox";

		for(var i = 0, len = items.length; i < len; i++){
			iid = items[i];
			idef = this.getTitleItemDef(iid, def, R);

			if(Class.isObject(tdef[iid])){
				idef = System.objectCopy(tdef[iid], idef);
			}
			
			tdef[iid] = idef;
		}

		idef = tdef["labTitle"];
		if(idef){
			if(Class.isString(def.titleText)){
				idef.text = def.titleText;
			}else{
				idef.text = Class.isString(idef.text) 
					? idef.text : "J$VM";
			}
		}

		return tdef;
	};

	var _preDef = function(def, R){
		var items = def.items = def.items || ["title", "client"],
		iid, idef;
		for(var i = 0, len = items.length; i < len; i++){
			iid = items[i];
			switch(iid){
			case "title":
				idef = def[iid] = _preTitleDef.apply(this, arguments);
				idef.rigid_w = (idef.rigid_w === true);
				idef.rigid_h = (idef.rigid_h !== false);
				idef.constraints = idef.constraints || "north";
				break;
			case "client":
				idef = def[iid] = def[iid] || {
					classType: "js.awt.VFrame"
				};

				idef.rigid_w = (idef.rigid_w === true);
				idef.rigid_h = (idef.rigid_h === true);
				idef.constraints = idef.constraints || "center";
				break;
			}
		}

		if(!def.layout){
			def.layout = {
				classType: "js.awt.BorderLayout",
				mode: 0,
				hgap: 0,
				vgap: 0
			};
		}

		def.resizable = (def.resizable !== false);
		def.resizer = def.resizer || 0xFF;

		def.movable = (def.movable !== false);
		def.mover = def.mover || { bt:1.0, br:0.0, bb:0.0, bl:1.0 };

		def.shadow = (def.shadow !== false);
		def.rigid_w = (def.rigid_w !== false);
		def.rigid_w = (def.rigid_w !== false);

		return def;		   
	};
	
	thi$._init = function(def, Runtime, view){
		if(def == undefined) return;
		
		def.classType = def.classType || "js.awt.Window";
		def.className = def.className || "jsvm_win";

		_preDef.apply(this, arguments);

		var tdef = def.title;
		if(tdef){
			tdef.className = tdef.className 
				|| DOM.combineClassName(def.className, "title");

			(function(iid){
				 var item = tdef[iid], clazz;
				 if(iid.indexOf("lab") == 0){
					 if(!item.className){
						 item.className = DOM.combineClassName(tdef.className, "label");
					 }

					 item.css = (item.css || "") 
						 + "white-space:nowrap;"
						 + "test-overflow:ellipsis;"
						 + "overflow:hidden;cursor:default;";
				 }else if(iid.indexOf("btn") == 0){
					 if(!item.className){
						 clazz = DOM.combineClassName(tdef.className, "button");
						 item.className = "jsvm_title_button $jsvm_title_button" 
							 + " " + clazz + " " + ("$" + clazz);
					 }
				 }else{
					 item.className = item.className 
						 || DOM.combineClassName(tdef.className, iid);
				 }

			 }).$forEach(this, tdef.items);
		}

		tdef = def.client;
		tdef.className = tdef.className 
			|| DOM.combineClassName(def.className, "client");

		def.css = "position:absolute;" + (def.css || "") 
			+ "overflow:hidden;";
		$super(this);

		// For MoverSpot testing
		var restricted = this._local.restricted = [];

		var uuid = this.uuid();
		var title = this.title;
		if(title){
			title.setPeerComponent(this);
			title.view.uuid = uuid;

			(function(name){
				 var item = this.title[name];
				 item.setPeerComponent(this);
				 if(name.indexOf("btn") == 0){
					 this.addMoverRestricted(item);
					 item.icon.uuid = item.uuid();
				 }else{
					 item.view.uuid = uuid;	 
				 }
			 }).$forEach(this, title.def.items);
			
			var tstyle = title.def.tstyle, 
			bstyle = title.def.bstyle;

			title.def.tstyle = 0;
			title.def.bstyle = 0;

			this.setTitleStyle(tstyle, bstyle);
		}

		this.client.setPeerComponent(this);
		this.client.view.uuid = uuid;
		//restricted.push(this.client); 

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

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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
        var cview = this._local.entry;
        if(this.view != cview){
            var children = cview.children;
            if(children.length === 0){
                this.appendTo(cview);
            }else{
                this.insertBefore(children[0]);
            }
        }
    };

    thi$.closeApp = function(){
        var U = this._local, cview = U.entry;
        if(this.view != cview){
            this.removeFrom(cview);
        }
        Desktop.unregisterApp(this.getAppID());
        U.closed = true;
    };

    thi$.changeTheme = function(theme, old){
        Desktop.updateTheme(theme, old);
    };

    thi$.destroy = function(){
        var U = this._local;

        if(!U.closed)this.closeApp();

        $super(this);
    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime, entryId){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Application";
        def.className = DOM.combineClassName(
            ["jsvm_", def.className||""].join(" "),
            ["entry", "app"]);
        def.id = def.uuid = entryId;
        def.__contextid__ = Runtime.uuid();

        var entry = self.document.querySelector("[jsvm_entry='"+entryId+"']");
        
        if(entry.getAttribute("jsvm_asapp")){
            $super(this, def, Runtime, entry);
        }else{
            $super(this, def, Runtime);            
        }

        this._local.entry = entry;

        this.putContextAttr("appid", this.getAppID());
        this.putContextAttr("app", this);
        
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
	System = J$VM.System, MQ = J$VM.MQ,

	DlgBtnMap = {
		btnHelp:   {nlsKey: "btnHelp",	 defaultNLS: "Help"},
		btnApply:  {nlsKey: "btnApply",	 defaultNLS: "Apply"},
		btnOK:	   {nlsKey: "btnOK",	 defaultNLS: "OK"},
		btnCancel: {nlsKey: "btnCancel", defaultNLS: "cancel"}
	};

	thi$.setDialogObject = function(dialogObj, handler){
		if(!dialogObj || !dialogObj.instanceOf(js.awt.DialogObject))
			throw "Request a js.awt.DialogObj instance";

		dialogObj.id = "dialogObj";
		dialogObj.setPeerComponent(this);
		this.client.addComponent(dialogObj,"center");

		if(handler){
			this._local.handler = handler;
			MQ.register(dialogObj.getDialogMsgType(), 
						this.getPeerComponent(), handler);
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

		$super(this);
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

		$super(this);

	}.$override(this.onbtnClose);

	thi$.close = function(){
		var peer = this.getPeerComponent(),
		handler = this._local.handler;

		if(typeof handler == "function"){
			MQ.cancel(this.getDialogMsgType(), peer, handler);
			delete this._local.handler;
		}

		_showMaskCover.call(this, false);

		$super(this);

	}.$override(this.close);

	thi$.destroy = function(){
		var dialogObj = this.client.dialogObj;
		if(dialogObj){
			dialogObj.setPeerComponent(null);
		}

		delete this.opener;

		$super(this);

	}.$override(this.destroy);

	var _preBtnpaneDef = function(def, R){
		var tdef = def.btnpane = def.btnpane 
			|| {classType: js.awt.HBox}, 
		items = tdef.items = tdef.items 
			|| ["btnApply", "btnOK", "btnCancel"],
		iid, idef, tmp, layout = tdef.layout;

		for(var i = 0, len = items.length; i < len; i++){
			iid = items[i];

			switch(iid){
			case "btnHelp":
			case "btnApply":
			case "btnOK":
			case "btnCancel":
				idef = {
					classType: "js.awt.Button",
					className: "jsvm_button",

					effect: true,
					rigid_w: true, rigid_h: true
				};

				tmp = DlgBtnMap[iid];
				idef.labelText = R.nlsText(tmp.nlsKey, tmp.defaultNLS);
				break;
			default:
				break;
			}

			if(idef){
				if(Class.isObject(tdef[iid])){
					idef = System.objectCopy(tdef[iid], idef);
				}

				tdef[iid] = idef;
			}
		}

		tdef.layout = {
			gap: 4, 
			align_x: 1.0,
			align_y: 0.5
		};

		if(layout){
			tdef.layout = System.objectCopy(layout, tdef.layout);
		}

		return tdef;
	};

	var _preDef = function(def, R){
		var items = def.items = def.items || [ "title", "client", "btnpane"],
		iid, idef, theDef;
		for(var i = 0, len = items.length; i < len; i++){
			iid = items[i];
			switch(iid){
			case "title":
				idef = def[iid] = def[iid] || {};
				idef.items = idef.items || ["labTitle", "btnHelp", "btnClose"];

				idef.rigid_w = (idef.rigid_w === true);
				idef.rigid_h = (idef.rigid_h !== false);
				idef.constraints = idef.constraints || "north";

				// Handle the title text
				idef = idef["labTitle"];
				if(idef){
					if(Class.isString(def.titleText)){
						idef.text = def.titleText;
					}else{
						idef.text = Class.isString(idef.text) 
							? idef.text : "J$VM";
					}
				}

				break;

			case "client":
				idef = def[iid] = def[iid] || {
					classType: "js.awt.Container",

					layout:{
						classType: "js.awt.BorderLayout"
					}
				};

				idef.rigid_w = (idef.rigid_w === true);
				idef.rigid_h = (idef.rigid_h === true);
				idef.constraints = idef.constraints || "center";
				break;

			case "btnpane":
				idef = def[iid] = def[iid] 
					= _preBtnpaneDef.apply(this, arguments);

				idef.rigid_w = (idef.rigid_w === true);
				idef.rigid_h = (idef.rigid_h !== false);
				idef.constraints = idef.constraints || "south";
			}
		}

		def.modal = (def.modal !== false);
		return def;
	};

	thi$._init = function(def, Runtime){
		if(def == undefined) return;

		def.classType = def.classType || "js.awt.Dialog";
		def.className = def.className || "jsvm_dlg";
		
		_preDef.apply(this, arguments);

		var tdef = def.btnpane, item;
		if(tdef){
			tdef.className = tdef.className 
				|| DOM.combineClassName(def.className, "btnpane");

			(function(name){
				 if(name.indexOf("btn") == 0){
					 item = tdef[name];
					 item.className = item.className 
						 || DOM.combine(tdef.className, "button");
				 }
			 }).$forEach(this, tdef.items);
		}
		$super(this);

		// For MoverSpot testing
		var restricted = this._local.restricted,
		btnpane = this.btnpane;

		restricted.push(this.client);

		if(btnpane){
			(function(name){
				 if(name.indexOf("btn") == 0){
					 item = this.btnpane[name];
					 item.setPeerComponent(this);
					 restricted.push(item);
				 }
			 }).$forEach(this, btnpane.def.items);
		}

	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Window);

js.awt.AbstractDialogObject = function(def, Runtime){
	var CLASS = js.awt.AbstractDialogObject, 
	thi$ = CLASS.prototype;
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

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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
		if($super(this)){
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
        DOM.setClassName(icon, "msg_icon");
		icon.src = R.imagePath() + icons[model.msgType];
		this.view.appendChild(icon);

		if(model.msgSubject){
			label = this.label = DOM.createElement("SPAN");
            DOM.setClassName(label, "msg_subject");
			label.innerHTML = model.msgSubject;
			this.view.appendChild(label);
		}

		text = this.text = DOM.createElement("TEXTAREA");
        DOM.setClassName(text, "msg_content");
		text.readOnly = "true";
		text.innerHTML = model.msgContent || "";
		this.view.appendChild(text);
	};

	thi$._init = function(def, Runtime){

		def.classType = def.classType || "js.awt.MessageBox";
		def.className = def.className || "jsvm_msg";

		$super(this);

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
        if($super(this)){
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
        $super(this);
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
        $super(this);
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
        
        $super(this);
        
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
           $super(this)){

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
        $super(this);
    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.Slipper";
        def.className = def.className || "jsvm_slipper";
        def.stateless = true;

        $super(this);
        
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
     * @see js.awt.Component
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

        $super(this);

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
        
        $super(this);

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
        $super(this);
        this.textField.disabled = !b;
        
    }.$override(this.setEnabled);
    
    thi$.getEnable = function () {
        J$VM.System.err.println("This method is deprecated, please use isEnabled");
        return this.isEnabled();
    };
    
    thi$.setToolTipText = function(s){
        $super(this);
        
        var rview = this.textField;
        if(rview){
            DOM.setAttribute(rview, "title", s);
        }
        
    }.$override(this.setToolTipText);
    
    thi$.delToolTipText = function(){
        $super(this);
        
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
        if($super(this)){
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

        $super(this);
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
        this.attachEvent("mousedown", 4, this, _onMouseDown);
        E.attachEvent(rView, "focus", 1, this, _onFocus);
    };
    
    thi$._init = function(def, Runtime){
        if(typeof def !== "object") return;
        
        def.classType = def.classType || "js.swt.TextField";
        def.className = def.className || "jsvm_textfield";
        $super(this);

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
		$super(this);
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
		var v = $super(this);
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
		$super(this, newDef, Runtime, view);
		
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
 * File: HItem.js
 * Create: 2015/07/21 03:20:16
 * Author: 
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

$import("js.awt.Item");

/**
 * @fileOverview Define the more complex item. It is horizontal and with more
 * complex layout than js.awt.Item. It can have own model. And it should be used
 * to replace js.swt.DItem and com.jinfonet.ui.CtrlItem.
 */

/**
 * @class js.swt.HItem
 * @extends js.awt.Item
 * 
 * @param {Object} def The definition for HItem.
 * 
 *		  @example
 *		  {
 *			  markable: true / false, // Indicate whether show a marker
 *			  iconImage: "xxx", // Optional
 * 
 *			  model: {	// Optional
 *				  dname: "xxx", // Optional
 *				  sign: {
 *					  type: "color" / "shape",
 *					  color: "xxx" / js.awt.Color,
 *					  opacity: 0.45,
 *					  
 *					  shape: "xxx",
 *					  real: true / false //Indicate whether the shape is real path.
 *				  },
 * 
 *				  value: {},
 *				  ...
 *			  },
 * 
 *			  labelRigid: false, // Indicate whether the label's width is rigid.
 *			  inputRigid: false, // Indicate whether the input's width is rigid.
 * 
 *			  iconSize: {width: xx, height: xx}, // Optional
 * 
 *			  controlled: true, // Indicate whether the current item has ctrl
 *			  ctrlAlign: 0.5, // 0.0 - 1.0
 * 
 *			  layout: { 
 *				  gap: 0,
 *			  
 *				  align_x: 0.5, //0.0 - 1.0
 *				  align_y: 0.5	// 0.0 - 1.0
 *			  }
 *		  }
 */
js.swt.HItem = function(def, Runtime){
	var CLASS = js.swt.HItem,
	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ;

	thi$.msgType = function(msgType){
		var U = this._local;
		if(Class.isString(msgType) && msgType.length > 0){
			U.msgType = msgType;
		}

		return U.msgType || "js.swt.event.HItemEvent";
	};
	
	thi$.isControlled = function(){
		return this.def.controlled === true;
	};
	
	/**
	 * @method
	 * @inheritdoc js.awt.Item#getPreferredSize
	 */
	thi$.getPreferredSize = function(){
		var prefSize = this.def.prefSize, size;
		if(!this.isPreferredSizeSet || !prefSize){
			size = this.getSize();
			prefSize = {
				height: size.height,
				width: size.width
			};
		}

		return prefSize;
	};	

	/**
	 * @method
	 * @inheritdoc js.awt.Component#onStateChanged
	 */
	thi$.onStateChanged = function(){
		$super(this);		  
		
		if(this.icon){
			this.setIconImage(this.getState());
		}

	}.$override(this.onStateChanged);

	/**
	 * The js.swt.HItem is different from the js.awt.Item. It should be the 
	 * normal component. So it can support resize, move and so on.
	 * 
	 * @link js.awt.Component#repaint
	 * @link js.awt.Component#repaint
	 */
	thi$.repaint = function(){
		return js.awt.Component.prototype.repaint.apply(this, arguments);
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Item#doLayout
	 */	   
	thi$.doLayout = function(force){
		if(!this.isDOMElement() || !this.needLayout(force)){
			return false;
		}

		var G = this.getGeometric(), bounds = this.getBounds(),
		xbase = bounds.MBP.paddingLeft, ybase = bounds.MBP.paddingTop,
		left = 0, M = this.def, layout = def.layout, gap = layout.gap || 0, 
		iSize, sv, space = bounds.innerWidth, hAlign = layout.align_x, 
		vAlign = layout.align_y, ctrlAlign = M.ctrlAlign, 
		items = M.items, len = items.length, rects = [], rigid,
		ele, id, iid, d, MBP, r, h, c = 0, top;
		
		for(var i = 0; i < len; i++){
			id = items[i];
			ele = this[id];

			iid = id.split(/\d+/g)[0];
			r = {};
			d = G[id];

			switch(iid){
			case "label":
			case "input":
				G[id] = d = DOM.getBounds(ele);
				
				rigid = iid === "label" 
					? M.labelRigid : M.inputRigid;
				if(rigid){
					r.width = d.width;
					space -= r.width;
				}else{
					r.width = null;
					c += 1;
				}
				break;

			case "icon":
			case "sign":
				r.width = d.width;
				
				if(iid === "icon"){
					iSize = M.iconSize || {};
				}else{
					iSize = M.signSize || {};
				}

				sv = iSize.width;
				if(!isNaN(sv) && sv > 0){
					r.width = sv;
				}
				
				sv = iSize.height;
				if(!isNaN(sv) && sv > 0){
					r.height = sv;
				}

				space -= r.width;				 
				break;

			default:
				r.width = d.width;
				space -= r.width;
				break;
			}
			
			r.node = ele;
			rects.push(r);
		}
		
		space -= gap*(len - 1);
		
		if(c > 1){
			space = Math.round(space / c);
		}
		
		if(c == 0){
			left = Math.round(space * hAlign);
		}

		for(i = 0, len = rects.length; i < len; i++){
			r = rects[i];
			if(r.width == null){
				r.width = space;
			}

			ele = r.node;
			id = ele.id;
			iid = id.split(/\d+/g)[0];
			d = G[id];
			MBP = d.MBP;
			h = r.height || d.height;

			left += MBP.marginLeft;

			if(iid == "ctrl" && Class.isNumber(ctrlAlign)){
				top = ybase + (bounds.innerHeight - h) * ctrlAlign;
			}else{
				if(Class.isNumber(vAlign)){
					top = ybase + (bounds.innerHeight - h) * vAlign;
				}else{
					top = undefined;
				}
			}

			DOM.setBounds(r.node, xbase + left, top, r.width, r.height, 0);
			left += r.width + MBP.marginRight + gap;
		}
		
		return true;
		
	}.$override(this.doLayout);

	/**
	 * @method
	 * @inheritdoc js.awt.Item#destroy
	 */
	thi$.destroy = function(){
		if(!this.isStateless()){
			this.detachEvent("mouseover", 4, this, _onHover);
			this.detachEvent("mouseout", 4, this, _onHover);

			this.detachEvent("mousedown", 4, this, _onmousedown);
			this.detachEvent("mouseup", 4, this, _onmouseup);
		}
		
		$super(this);

	}.$override(this.destroy);

	var _onHover = function(e){
		if(e.getType() === "mouseover"){
			if(this.contains(e.toElement, true)
			   && !this.isHover()){
				this.setHover(true);
			}
		}else{
			if(!this.contains(e.toElement, true)
			   && this.isHover()){
				this.setHover(false);
			}
		}
	};

	var _onmousedown = function(e){
		this._local.mousedown = true;

		e.setEventTarget(this);
		this.notifyPeer(this.msgType(), e);
	};

	var _onmouseup = function(e){
		if(this._local.mousedown === true){
			delete this._local.mousedown;

			if(this.def.toggle === true){
				this.setTriggered(!this.isTriggered());
			}

			e.setEventTarget(this);
			this.notifyPeer(this.msgType(), e);
		}
	};

	var _preDef = function(def, R){
		var m = def.model, iconImage, sign, dname;
		if(!Class.isObject(m)){
			return def;
		}

		iconImage = m.img || m.iconImage;
		if(iconImage){
			def.iconImage = iconImage;
		}

		sign = m.sign;
		if(Class.isObject(sign)){
			def.sign = sign;	
		}

		dname = m.dname;
		if(Class.isValid(dname)){
			if(def.useInput === true){
				def.inputText = dname;
				def.labelText = null;
			}else{
				def.inputText = null;
				def.labelText = dname;
			}
		}

		def.checked = (m.marked === true);

		return def;
	};

	thi$._init = function(def, Runtime, view){
		if(typeof def !== "object") return;

		def.classType = def.classType || "js.swt.HItem";
		def.className = def.className || "jsvm_item";
		def.stateless = def.stateless || false;

		var layout = def.layout = def.layout || {};
		if(!Class.isNumber(layout.align_x)){
			layout.align_x = 0.0;
		}

		if(!Class.isNumber(layout.align_y)){
			layout.align_y = 0.5;
		}

		def = _preDef.call(this, def, Runtime);
		$super(this);

		if(def.stateless !== true){
			this.attachEvent("mouseover", 4, this, _onHover);
			this.attachEvent("mouseout", 4, this, _onHover);

			this.attachEvent("mousedown", 4, this, _onmousedown);
			this.attachEvent("mouseup", 4, this, _onmouseup);
		}

		// For compatible with the old DItem
		this.model = def.model || {};

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

$import("js.swt.ListItem");

/**
 * @fileOverview Define the List. A <em>List</em> is a item container.
 */

/** 
 * @class js.swt.List
 * @extends js.awt.Container
 * 
 * @constructor Initialize the List.
 * @param {Object} The definition of the List.
 *
 *        @example 
 *        def: {
 *            className: {String} required,
 *            css: {String} optional
 *            id: {String} optional,
 *            container: {js.awt.Component} requied.
 * 
 *            multiEnable: {Boolean} Default is <em>false</em>, required,
 *            multiByCheck: {Boolean} Default is false. When <em>multiEnable</em>
 *                is true, if the <em>multiByCheck</em> is false, the "CTRL" and
 *                "SHIFT" keys will be validation. Otherwise "CTRL" and "SHIFT" 
 *                keys will be used and each item cannot be markable. 
 *            useMarkerToggle: {Boolean} Default is false, optional. Indicate 
 *                whether only when the marker of item is clicked, the item can
 *                be selected. Other than selecting it by clicking any part of 
 *                the item. When <em>multiByCheck</em> is false, it will be ignored.
 * 
 *            distinct: {Boolean} Default is false, required. Indicate whether item
 *                of List is distinct. 
 *            searchEnable: {Boolean} Default is false, required. Indicate whether 
 *                the List can support quick search. 
 *
 *            lazy: {Boolean} Default is false, optional. Indicate whether all 
 *                items should be loaded lazily. That is to say, all items will 
 *                be added and removed asynchronously.
 *  
 *            itemDefs: {Array} Definitions of items. If it is specified, the itemModels 
 *               will be ignored. 
 *            itemModels: {Array} Models of items, optional. Its structure is as follow:
 *                [
 *                  {dname: xxx, img: xxx (Optional), value},
 *                  ......
 *                  {dname: xxx, img: xxx (Optional), value}     
 *                ] 
 *        }
 * 
 *  Attention: 
 *      only when <em>multiEnable</em> is <em>true</em>, the <em>multiByCheck</em> 
 *      can take effect. Otherwise it will be ignored. In addition, only when <em>
 *      multiByCheck</em> takes effect, the <em>useMarkerToggle</em> can take effect.
 */ 
js.swt.List = function(def, runtime){
    var CLASS = js.swt.List, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    CLASS.EVT_READY = "Ready";
    CLASS.EVT_ACK_ITEMSADDED = "ItemsAdded";
    CLASS.EVT_ACK_ITEMSREMOVED = "ItemsRemoved";
    
    CLASS.EVT_ITEMSELECTED = "ItemSelected";
    CLASS.EVT_ITEMCLICKED = "ItemClicked";
    CLASS.EVT_ITEMMOVED = "ItemMoved";

    var Class = js.lang.Class, Event = js.util.Event, 
    DOM = J$VM.DOM, System = J$VM.System,

    LinkedList = js.util.LinkedList, 
    ListItem = js.swt.ListItem;
    
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
     * @param {js.swt.ListItem} item The item to add.
     * @param {Boolean} ack Indicate whether all items are added to the list 
     *        and they can ack their follower's interaction required.
     * 
     * @param {Boolean} force Indicate whether the ack need be done however
     *        the specified item was/wasn't be added literally.
     * 
     */
    thi$.addItem = function(item, ack, force){
        this.insertItem(undefined, item, ack, force);
    };

    /**
     * Insert the specified item to the list at the specified index position.
     * 
     * @param {Number} index The specified index position to insert. If a negative
     *        number is given, it is treated as "length + index".
     * @param {js.swt.ListItem} item The specified item to add.
     * @param {Boolean} ack Indicate whether all items are added to the list 
     *        and they can ack their follower's interaction required.
     * 
     * @param {Boolean} force Indicate whether the ack need be done however
     *        the specified item was/wasn't be added literally.
     */
    thi$.insertItem = function(index, item, ack, force){
        if(!item || !(item instanceof ListItem) 
           || (this.distinct && this.contains(item.def))){
            // Maybe some item has been added before the last one
            if(ack === true && force === true){ 
                _sendAck.call(this, "ACK_ADD", true);
            }   
            
            return;
        }

        var U = this._local, items = this._items, len = items.length, 
        ref, uuid = item.uuid();

        if(Class.isNumber(index)){
            if(index < 0){
                index = len + index;
            }

            if(index > len){
                index = len;
            }

            if(index < 0){
                index = 0;
            }

            ref = U.cache[items[index]];
        }

        item.setPeerComponent(this);
        DOM.insertBefore(item.view, ref ? ref.view : null, this.listView);

        if(ref){
            items.add(index, uuid);
        }else{
            items.addLast(uuid);
        }
        U.cache[uuid] = item;
        
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
     * @param {Array} items Objects of js.swt.ListItem to add
     */
    thi$.setItems = function(items){
        _setItems.call(this, items, false);
    };
    
    /**
     * Add the specified items to the list.
     * 
     * @param {Array} items Objects of js.swt.ListItem to add
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
     * Insert item to the specified position of current list with the given definition.
     * 
     * @link #insertItem
     */
    thi$.insertItemByDef = function(index, itemDef, ack, force){
        if(!itemDef || (this.distinct && this.contains(itemDef))){
            // Maybe some item has been added before the last one
            if(ack === true && force === true){ 
                _sendAck.call(this, "ACK_ADD", true);
            }
            
            return null;
        }
        
        var M = this.def, itemClassName = M.itemClassName;
        if(!itemDef.className && itemClassName){
            itemDef.className = itemClassName;
        }
        
        // Maybe needn't to set with as 100%
        itemDef.css = "position:relative;overflow:visible;"
            + "white-space:nowrap;";
        
        if(this.multiEnable){
            itemDef.markable = (this.multiByCheck === true);
            itemDef.hoverForSelected = false;
        }else{
            itemDef.markable = false;
            itemDef.hoverForSelected = (M.hoverForSelected === true);
        }
        
        var item = new ListItem(itemDef, this.Runtime());
        this.insertItem(index, item, ack, force);

        return item;
    };


    /**
     * Add one item to List with the specified definition.
     * 
     * @link #insertItemByDef
     */
    thi$.addItemByDef = function(itemDef, ack, force){
        return this.insertItemByDef(undefined, itemDef, ack, force);
    };

    /**
     * Insert item to the specified position of the List with the given model.
     * 
     * @link #insertItemByDef
     */
    thi$.insertItemByModel = function(index, model, ack){
        if(!model){
            return null;
        }

        var itemDef = _createItemDef.call(this, model);
        return this.insertItemByDef(index, itemDef, ack);
    };

    /**
     * Add one item to List with the specified model.
     * 
     * @link #insertItemByModel
     */
    thi$.addItemByModel = function(model, ack){
        return this.insertItemByModel(undefined, model, ack);
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
     * @param {Array} models Models of items that will be added.
     *        
     *        @example
     *        [
     *            {dname: xxx, img: xxx (Optional), value},
     *            ......
     *            {dname: xxx, img: xxx (Optional), value}   
     *        ]
     */
    thi$.setItemsByModel = function(models){
        _setItemsByModel.call(this, models, false, false);
    };

    /**
     * Add some new items to the List with the specified models
     * 
     * @param {Array} models Models of items that will be added.
     *        
     *        @example
     *        [
     *            {dname: xxx, img: xxx (Optional), value},
     *            ......
     *            {dname: xxx, img: xxx (Optional), value}   
     *        ]
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
     * @param {Array} defs Definitions of items that will be added.
     */
    thi$.setItemsByDef = function(defs){
        _setItemsByDef.call(this, defs, false, false);      
    };
    
    /**
     * Add some new items to the list with the specified definitions.
     * 
     * @param {Array} defs Definitions of items that will be added.
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
     * @param {js.swt.ListItem} item A item that will be removed.
     * @param {Boolean} ack Indicate whether some acked behaviors will be 
     *        done after the item is removed.
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
     * @param {Array} items Items that will be removed.
     * @link js.swt.List#remove
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
     * Return the number of items in the current list.
     * 
     * @return {Number}
     */
    thi$.getItemsCount = function(){
        return this._items.length;
    };

    /**
     * Return the item specified by the given index position.
     * 
     * @param {Number} index The index of the item to return.
     * 
     * @return {js.swt.ListItem}
     */
    thi$.getItemAt = function(index){
        return this._local.cache[this._items[index]];
    };

    /**
     * Return the current index position of the given item.
     * 
     * @param {js.swt.ListItem} item
     * 
     * @return {Number}
     */
    thi$.getItemIndex = function(item){
        return this._items.indexOf(item.uuid());
    };

    /**
     * Judge whether the specified item is the first one.
     * 
     * @param {js.swt.ListItem} item
     * @return {Boolean}
     */
    thi$.isFirstItem = function(item){
        var items = this._items;
        return items.indexOf(item.uuid()) === 0;
    };

    /**
     * Judge whether the specified item is the last one.
     * 
     * @param {js.swt.ListItem} item
     * @return {Boolean}
     */
    thi$.isLastItem = function(item){
        var items = this._items;
        return items.indexOf(item.uuid()) === (items.length - 1);
    };

    /**
     * Find and return the previous sibling item of the specified item.
     * 
     * @param {js.swt.ListItem} item
     * 
     * @return {js.awt.ListItem}
     */
    thi$.getPreSiblingItem = function(item){
        var idx = this.getItemIndex(item);
        if(idx <= 0){
            return null;
        }

        return this.getItemAt(idx - 1);        
    };

    /**
     * Find and return the next sibling item of the the specified item
     * 
     * @param {js.swt.ListItem} item
     * 
     * @return {js.swt.ListItem}
     */
    thi$.getNextSiblingItem = function(item){
        var items = this._items, idx = this.getItemIndex(item);
        if(idx < 0 || idx >= items.length - 1){
            return null;
        }
        
        return this.getItemAt(idx + 1);
    };

    /**
     * Move the specified item from one index to another.
     *
     * @param {Number} from Current index of a row to move.
     * @param {Number} to The target index to move in current view (before move).
     */
    thi$.moveItem = function(from, to){
        var cache = this._local.cache, items = this._items, 
        len = items.length, fitem, titem;
        if(to > len){
            to = len;
        }

        if(from == to || from === to - 1){
            return;
        }

        fitem = cache[items[from]];
        titem = cache[items[to]];
        if(!fitem){
            return;
        }

        items.remove0(from);
        if(from < to){
            --to;            
        }

        if(titem){
            items.add(to, fitem.uuid());
            DOM.insertBefore(fitem.view, titem.view, this.listView);
        }else{
            items.addLast(fitem.uuid());
            DOM.appendTo(fitem.view, this.listView);
        }

        // Notify about the item moving
        this.fireEvent(new Event(CLASS.EVT_ITEMMOVED, fitem, fitem));
    };

    /**
     * Shift the item specified by the given index up.
     *
     * @param {Number} index The index of the specified item to shift.
     * 
     * @link #moveItem
     */
    thi$.shiftUpItemAt = function(index){
        if(index > 0){
            this.moveItem(index, index - 1);
        }
    };

    /**
     * Shift the specified item up.
     *
     * @param {js.swt.ListItem} item
     * 
     * @link #getItemIndex
     * @link #moveItem
     */
    thi$.shiftUpItem = function(item){
        var index = this.getItemIndex(item);
        if(index !== -1){
            this.shiftUpItemAt(index);
        }
    };

    /**
     * Shift the item specified by the given index down.
     *
     * @param {Number} index The index of the specified item to shift.
     * 
     * @link #moveItem
     */
    thi$.shiftDownItemAt = function(index){
        var len = this._items.length;
        if(index < len - 1){
            this.moveItem(index + 1, index);
        }
    };

    /**
     * Shift the specified item up.
     *
     * @param {js.swt.ListItem} item
     * 
     * @link #getItemIndex
     * @link #moveItem
     */
    thi$.shiftDownItem = function(item){
        var index = this.getItemIndex(item);
        if(index !== -1){
            this.shiftDownItemAt(index);
        }
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
     * 
     * @link js.awt.Container#contains
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
     *         items of the List.  
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
     * @return {js.util.LinedList} All items of the List.  
     */
    thi$.getItems = function(){
        return this.getAll();
    };
    
    /**
     * Attention: 
     * If the "lazy" of list definition is true, this method should be invoke
     * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
     * 
     * @return {js.util.LinedList} All items' definitions of the List.  
     */
    thi$.getItemDefs = function(){
        return _getInfoByUUids.call(this, this._items, "def");
    };
    
    /**
     * Attention: 
     * If the "lazy" of list definition is true, this method should be invoke
     * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
     * 
     * @return {js.util.LinkedList} All items' model of the List.  
     */
    thi$.getItemModels = function(){
        return _getInfoByUUids.call(this, this._items, "model");
    };
    
    /**
     * @param {Boolean} isOrdered Indicate whether the result should keep the order.
     * 
     * @return {js.util.LinkedList} All selected items of the List. 
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
     * @param {Boolean} isOrdered Indicate whether the result should keep the order.
     * 
     * @return {js.util.LinkedList} The defs of all selected items in the List.  
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
     * @param {Boolean} isOrdered Indicate whether the result should keep the order.
     * 
     * @return {js.util.LinkedList} The models of all selected items in the List.  
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
     * @return {js.util.LinkedList} The indexes of all selected items in the List.  
     */
    thi$.getSelectedIndexes = function(){
        return _getInfoByUUids0.call(this, this._selectedItems, "index", true);
    };

    /**
     * @param {Boolean} isOrdered Indicate whether the result should keep the order.
     * 
     * @return {js.util.LinkedList} The values of all selected items in the List.   
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
        $super(this);

    }.$override(this.onResized);
    
    thi$.onGeomChanged = function(){
        this._isLayoutDirty = true;
        $super(this);

    }.$override(this.onGeomChanged);
    
    thi$.doLayout = function(){
        if($super(this)){
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

    /**
     * Enable / disable the search function of the list.
     * 
     * @param {Boolean} b
     */ 
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
     * @param {js.swt.ListItem} item The item to select.
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
     * @param {Array} values The given values to specify items to select. An 
     *        item whose value equals with one of values will be selected.
     * @param {Boolean} callback Optional. Indicate whether need to notify.
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
     * @param {Array} indexes The given indexes to select. Each element indicate
     *        an item which need be selected.    
     * @param {Boolean} callback Optional. Indicate whether need to notify.
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
     * @param {Array} items The given items to select, each of which need be 
     *        selected.
     * @param {Boolean} callback Optional. Indicate whether need to notify.
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
     * @param {js.swt.ListItem} item The specified item to select.
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
     *    selected --> unselected
     *    unselected --> selected
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

    /**
     * Judge whether all the items in current list is selected.
     * 
     * @return {Boolean}
     */
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
        
        $super(this);
        
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
        if(typeof this.onHovering == "function"){
            this.onHovering();
        }
        
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
        
        if(!item || !item.isEnabled()){
            return;
        }
        
        if (this.multiByCheck){
            if(!this.useMarkerToggle || src === item.marker){
                _selectCheckableItem.call(this, item);
            }
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
        listView.style.cssText = "position:relative;top:0px;left:0px;"
            + "border:0px none;padding:0px;margin:0px;overflow:visible;"
            + "width:100%;height:100%;";
        
        DOM.appendTo(listView, this.view);
    };

    thi$._init = function(def, runtime){
        if(typeof def !== "object") return;

        def = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);       
        def.className = def.className || "jsvm_list";
        $super(this);

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
        // Only when the marker of item is clicked, the item can be marked
        this.useMarkerToggle = (this.multiByCheck && def.useMarkerToggle === true);        
        
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
 * @param {String / Object /...} value The specified value to check.
 * @param {Array} set {Array} The reference models collection.
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

/**
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
 * @param {Object} model The specified model to check.
 * @param {Array} set The reference models collection.
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
 *      only when <em>multiEnable</em> is <em>true</em>, the <em>multiByCheck</em> can
 *      take effect. Otherwise it will be ignored.
 *
 * @param def: {
 *     className: {String} required,
 *     css: {String} optional
 *     id: {String} optional,
 *
 *     container: {js.awt.Component} required,
 *     multiEnable: {Boolean} Default is <em>false</em>, required,
 *     distinct: {Boolean} Default is false, required. Indicate whether the item of List
 *         is distinct.
 *     searchIfAllowed: {Boolean} Default is false, required. Indicate whether the DropdownList
 *         can support quick search if it is enable.
 *     showItemTip: {Boolean} Default is false, required. Indicate whether each item should show
 *         its tooltips with the given tooltips or its display value.
 *     searchCritical: {Number} An optional value between 1 and 100 which expresses a percent.
 *         When (the viewable height/total contents height) <= this percent, the DropdownList can
 *         be enable to do quick search.
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
        rigid_w: false, rigid_h: true,

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

            rigid_w: true,  rigid_h : true,
            prefSize: {width: 11,   height: 11},

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
            return $super(this);
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
            //  && sw != vBox.width){
            //  System.err.println("Width:" + vBox.width + " ScollWidth:" + sw);
            //  w = sw;
            // }else{
            w = undefined;
            // }
        }

        if(s.hAdjusted){
            h -= ST;
        }else{
            // if(J$VM.ie && !isNaN(sh)
            //  && sh != vBox.height){
            //  System.err.println("Height:" + vBox.height + " ScollHeight:" + sh);
            //  h = sh;
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
            $super(this);
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

    /*
     * Ref the native html "select" and "option" element, for ComboBox, 
     * when it isn't multiple, the current selected item will be hovered
     * while the dropdownlist is showing. And then the hover effect will
     * be rinsed after hovering another item.
     */
    var _reStyleSelected = function(){ 
        var list = this.list;
        if(!list || def.multiEnable === true){
            return;
        }
        
        var sitems = list.getSelectedItems(),
        item = sitems ? sitems[0] : null;
        if(item && item.isHoverForSelected()){
            item.setHover(true);
        }
    };
    
    var _rinseSelected = function(){
        var list = this.list;
        if(!list || def.multiEnable === true){
            return;
        }
        
        var sitems = list.getSelectedItems(),
        item = sitems ? sitems[0] : null;
        if(item && item.isHoverForSelected()){
            item.setHover(false);
        }
    };

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
        $super(this, x, y, false, m);
        
        // Re-highlight the current selected item
        _reStyleSelected.call(this);

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
        $super(this, by, false, m);

        // Re-highlight the current selected item
        _reStyleSelected.call(this);

    }.$override(this.showBy);

    thi$.setPeerComponent = function(peer){
        if(this.list){
            this.list.setPeerComponent(peer);
        }

        $super(this);

    }.$override(this.setPeerComponent);

    thi$.destroy = function(){
        this.detachEvent("mousedown", 0, this, _onMouseDown);
        this.detachEvent("click", 0, this, _onClick);
        this.detachEvent(J$VM.firefox ? "DOMMouseScroll" : "mousewheel",
                         0, this, _onMouseScroll);

        if(this.searchBox){
            this.searchBox.inputBox.detachEvent(js.swt.TextField.EVT_VALUECHANGED,
                                                4, this, _onKeywordChanged);
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

        $super(this);
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
        _search.$clearTimer();
        
        var keyword = this.searchBox.inputBox.getValue();
        this.quickSearch(keyword);
    };

    var _onKeywordChanged = function(e){
        if(!this.searchEnable){
            return;
        }

        // Search once while input quickly and consecutively
        _search.$clearTimer();
        _search.$delay(this, 200);
    };

    var _onBtnClearClicked = function(e){
        this.searchBox.inputBox.setValue("");
        this.restore();
    };

    var _createSearchBox = function(def){
        var r = this.Runtime(), searchBox,
        theDef = {
            className: DOM.combineClassName(def.className, "searchBox")
        };

        theDef = System.objectCopy(searchBoxDef, theDef, true);
        searchBox = this.searchBox =
            new (Class.forName("js.awt.HBox"))(theDef, r);

        searchBox.inputBox.attachEvent(js.swt.TextField.EVT_VALUECHANGED,
                                       4, this, _onKeywordChanged);
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
            userH = bounds ? bounds.userH : undefined,
            listView = this.list.view;
            
            if(!isNaN(userW) || !isNaN(userH)){
                DOM.setSize(this.view, userW, userH, bounds);
            }
            
            // listView.style.width = "100%";
            listView.style.width = "auto";
            listView.style.height = "auto";

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
            className: DOM.combineClassName(def.className, "list"),
            itemClassName: def.itemClassName 
                || DOM.combineClassName(def.className, "item"),

            searchOptions: def.searchOptions,

            hoverForSelected: Class.isBoolean(def.hoverForSelected) 
                ? def.hoverForSelected : def.multiEnable !== true,

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
        
        /*
         * Ref the native html "select" and "option" element, for ComboBox, 
         * when it isn't multiple, the current selected item will be hovered
         * while the dropdownlist is showing. And then the hover effect will
         * be rinsed after hovering another item.
         */
        list.onHovering = _rinseSelected.$bind(this);

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
        var r = this.Runtime(), controlBar, label,
        theDef = {className: DOM.combineClassName(def.className, "controlBar")};

        theDef = System.objectCopy(controlBarDef, theDef, true);
        theDef.label.text = r.nlsText("btnOK", "OK");
        controlBar = this.controlBar =
            new (Class.forName("js.awt.HBox"))(theDef, r);

        label = controlBar.label;
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
        $super(this);

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

$import("js.swt.ModelItem");

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

        // For bug #113854 (http://redmine.jinfonet.com.cn/issues/113854)
        // The initial selected model may be generated from the itemDefs 
        // or itemModels of current definition. At this time, the current
        // ComboBox instance haven't been instantiated complete, and some
        // override operations, such as rectifyModel, haven't been executed.
        // So that the display value may not be right during the initialization
        // phase. Aut the current method must be invoked again to make the
        // logic complete.
        // var changed = _isSelectedChanged.call(this, model);
        // if(!changed){
        //  return;
        // }

        var indexes = _filterItemsByModel.call(this, model) || [];
        if(indexes.length == 0){
            // this.unselectAll(false);

            if(this.subview){
                this.subview.unselectAll(false);
            }else{
                // Mark all models' state as un-marked
                _unMarkAll.call(this);
            }
        }else{
            if(this.subview){
                this.subview.setSelectedIndexes(indexes, false); 
            }
        }
        
        _select.call(this, model);
        _setSelectedValues.call(this, [model.value]);
        
        if (callback === true){
            this.onSelectedChanged();
        }
    };

    thi$.msgType = function(msgType){
        var U = this._local;
        if(Class.isString(msgType) && msgType.length > 0){
            U.msgType = msgType;
        }  

        return U.msgType || "js.swt.event.SelectedChanged";
    };

    /**
     * @deprecated
     */ 
    thi$.setMsgType = function(msgType){
        this.msgType(msgType);
    };

    /**
     * @deprecated
     */ 
    thi$.getMsgType = function(){
        return this.msgType();
    };
    
    thi$.onSelectedChanged = function(target, eType){
        var msgType = this.msgType(),
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
    
    thi$.setEditable = function(b){
        b = (b === true);
        if(this.editable === b){
            return;
        }

        this.editable = this.def.editable = b;

        var ditem = this.displayItem;
        if(ditem){
            if(b) {
                ditem.attachEvent("click", 0, this, _onEdit);
            }else{
                ditem.detachEvent("click", 0, this, _onEdit);
            }
        }
    };

    thi$.onMoved = function(){
        $super(this);
        
        var subview = this.subview;
        if(subview){
            subview.invalidateLayout(false);
        }
    }.$override(this.onMoved);
    
    thi$.onResized = function(fire){
        $super(this);
        
        var subview = this.subview;
        if(subview){
            subview.invalidateLayout(false);
        }
    }.$override(this.onResized);
    
    var _onController = function(e){
        this.notifyPeer("js.swt.event.ControllerEvent", e);
    };
    
    thi$.onStateChanged = function(e){
        $super(this);
        
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
        
        $super(this);
        
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

    thi$.getDItemDef = function(m){
        var M = this.def, dItemDef = M.dItemDef,
        b = (M.showTips !== false),

        tdef = {
            classType: "js.swt.ModelItem",
            className: DOM.combineClassName(M.className, "dItem"),
            stateless: true,

            showTips: b,
            useInput: this.useInput,
            
            rigid_w: false, rigid_h: false,
            
            layout: {align_x: 0.0, align_y: 0.5}
        };

        if(Class.isObject(dItemDef)){
            tdef = System.objectCopy(dItemDef, tdef, true);
        }

        tdef.model = m;
        return tdef;
    };

    var _createDisplayItem = function(model){
        var R = this.Runtime(), M = this.def, 
        dItemDef = this.getDItemDef(model),
        displayItem, b, tip;
        
        dItemDef.css = DOM.toCssText(this._latestStyles),
        displayItem = this.displayItem =
            new (Class.forName(dItemDef.classType))(dItemDef, R),
        
        b = (M.showTips !== false);
        tip = M.displayTip;
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
     * The <em>displayItem</em> will be removed first and then added again 
     * when call this method. If not, there are something wrong when do edit.
     * 
     * @param model: {dname: xxx, value: xxx} or {img: xxx, value: xxx}
     */
    var _setSelected = function(model) {
        if(!model)
            return;
        
        _removeDisplayItem.call(this);
        
        // For bug #114049 (http://redmine.jinfonet.com.cn/issues/114049)
        // 
        // Sometimes, the model to select is from the options directly. If we 
        // rectifying it directly, the oringinal item in the options will also 
        // be changed. That isn't right. So we copy it first.
        var m = System.objectCopy(model, {}, true);
        m = this.rectifyModel(m);
        _createDisplayItem.call(this, m);
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
        if(def && def.subview){
            this._local = this._local || {};
            this._local.subviewRoot = def.subview.root;
            delete def.subview.root;
        }

        def = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
        def.layout = def.layout 
            || {gap: 0, align_x: 0.0, align_y: 0.5};
        
        def.items = ["dItemContainer", "btnDropDown"];
        
        var tmp = {className: DOM.combineClassName(def.className, "dItemContainer")};
        def.dItemContainer = System.objectCopy(dItemContainerDef, tmp, true);

        tmp = {className: DOM.combineClassName(def.className, "dropdown")};
        def.btnDropDown = System.objectCopy(btnDropDownDef, tmp, true);

        return def;
    };
    
    thi$._init = function(def){
        if(typeof def !== "object") return;
        
        def = _preInit.call(this, def);
        $super(this);
        
        // 0: Expect hide subview
        // 1: Expect popup subview
        this._local.expectedOp = 1;
        this._local.msgType = "js.swt.event.SelectedChanged";
        
        this.useInput = (def.useInput === true);
        this.editable = (!this.useInput && def.editable === true);
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

        // Register to listen the events and messages
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
 * File: ScrollPane.js
 * Create: 2013/06/06 03:42:53
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

/**
 * A ScrollPane is a container that allows multiple components to be laid out 
 * horizontally. The components will not wrap so.
 */
js.swt.ScrollPane = function(def, Runtime){
    var CLASS = js.swt.ScrollPane,
    thi$ = CLASS.prototype;
    
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
    
    /**
     * Judge whether one component can stretch automatically accoring to the
     * runtime available space.
     */
    thi$.isAutostretch = function(){
        return this.def.autostretch === true;  
    };
    
    /**
     * Set the possible minimum and maximum space for a component when it is
     * stretched. It won't be used until the current ScrollPane is autostretch.
     * 
     * @param min: {Number} The possible minimum space for a component.
     * @param max: {Number} The possible maximum space for a component. 
     */
    thi$.setStretchRange = function(min, max){
        var M = this.def, r = M.stretchRange = M.stretchRange || {};
        if(Class.isNumber(min)){
            r.min = min;
        }
        
        if(Class.isNumber(max)){
            r.max = max;
        }
    };
    
    /**
     * Return the possible stretch range.
     */
    thi$.getStretchRange = function(){
        return this.def.stretchRange;  
    };
    
    /**
     * After add a comp to ScrollPane, it is not right to do layout directly.
     * And we recommand to drive its container to do layout first, then its
     * container can cause it to do layout.
     * 
     * @param comp: {Component} A component to add.
     * @param notify: {Boolean} Indicate to notify the operation to its peer 
     *        component. Default is true.
     * @param fireLayout: {Boolean} Indicate to fire an event for the operation 
     *        to drive its container to do layout. Default is false.
     */
    var _addComp = function(comp, notify, fireLayout){
        this.cache[comp.uuid()] = comp;
        
        if(typeof comp.hoverCtrl == "function"){
            comp.hoverCtrl(false);
        }
        
        if(notify !== false){
            this.notifyPeer(
                "js.awt.event.ItemEvent", new Event("add", "", comp));
        }
        
        if(fireLayout === true){
            this.fireEvent(new Event(CLASS.SCROLLPANEEVENT, {type: "add"}));
        }
        
        return comp;
    };
    
    /**
     * @see js.awt.Container #insertComponent
     */
    thi$.insertComponent = function(index, comp, constraints, notify, fireLayout){
        comp = $super(this, index, comp, constraints);  
        return _addComp.call(this, comp, notify, fireLayout);
        
    }.$override(this.insertComponent);
    
    /**
     * Remove an item from current ScrollPane.
     * 
     * @param comp: {Component} A component to remove.
     * @param notify: {Boolean} Indicate to notify the operation to its peer 
     *        component. Default is true.
     * @param fireLayout: {Boolean} Indicate to fire an event for the operation 
     *        to drive its container to do layout. Default is false.
     * 
     * @see js.awt.Container #removeComponent
     */
    thi$.removeComponent = function(comp, notify, fireLayout){
        if(!comp) return;
        
        var items = this.items(), index = items.indexOf(comp.id);
        comp = $super(this, comp);
        
        if(this.cache){
            delete this.cache[comp.uuid()];
        }
        
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
        
        if(fireLayout === true){
            this.fireEvent(new Event(CLASS.SCROLLPANEEVENT, {type: "remove"}));
        }
        
    }.$override(this.removeComponent);
    
    /**
     * @see js.awt.Container #activeComponent
     */
    thi$.activeComponent = function(comp){
        if(!comp) return;
        
        var items = this.items0(), id;
        for(var i=0, len=items.length; i<len; i++){
            id = items[i];
            if(this[id] == comp){
                this[id].setTriggered(true); 

                this._local.active = comp;
                this.notifyPeer(
                    "js.awt.event.ItemEvent", new Event("active", "", comp));
            }else{
                this[id].setTriggered(false);
            }
        }
        
    }.$override(this.activeComponent);
    
    /**
     * Scroll to the next position
     */
    thi$.scrollNext = function(){
        var el = this.view, p, v;
        if(this.isHScroll()){
            p = el.scrollLeft + this._local.itemMeasure;
            v = el.scrollWidth;
            p = p > v ? v : p;
            el.scrollLeft = p;
        }else{
            p = el.scrollTop + this._local.itemMeasure;
            v = el.scrollHeight;
            p = p > v ? v : p;
            el.scrollTop = p;
        }
    };
    
    /**
     * Scroll to the previous position
     */
    thi$.scrollPrevious = function(){
        var el = this.view, p;
        if(this.isHScroll()){
            p = el.scrollLeft - this._local.itemMeasure;
            p = p < 0 ? 0 : p;
            el.scrollLeft = p;
        }else{
            p = el.scrollTop - this._local.itemMeasure;
            p = p < 0 ? 0 : p;
            el.scrollTop = p;
        }
    };
    
    /**
     * Scroll to the first position.
     */
    thi$.scrollFirst = function(){
        if(this.isHScroll()){
            this.view.scrollLeft = 0;
        }else{
            this.view.scrollTop = 0;
        }
    };
    
    /**
     * Scroll to the last position.
     */
    thi$.scrollLast = function(){
        if(this.isHScroll()){
            this.view.scrollLeft = this.view.scrollWidth;
        }else{
            this.view.scrollTop = this.view.scrollHeight;
        }
    };
    
    /**
     * @see js.awt.Movable #isMoverSpot
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
     * @see js.awt.Movable #getMoveObject
     */
    thi$.getMoveObject = function(e){
        var moveObj = this.moveObj;
        if(!moveObj){
            var M = this.def, el = e.srcElement, uuid = el.uuid, 
            item = this.cache[uuid], absXY = DOM.absXY(item.view),
            def = System.objectCopy(item.def, {}, true);
            
            if(M.moveObjClz){
                def.classType = M.moveObjClz;
            }
            
            moveObj = this.moveObj 
                = new (Class.forName(def.classType))(def, this.Runtime(), item.cloneView());
            moveObj.setMovingPeer(this);
            moveObj.appendTo(document.body);
            moveObj.setPosition(absXY.x, absXY.y);
        }
        
        return moveObj;
    };
    
    thi$.getGap = function(){
        var def = this.layout.def, gap;
        if(this.isHScroll()){
            gap = def.hgap || 0;
        }else{
            gap = def.vgap || 0;
        }
        
        return gap;
    };
    
    var _getIdealMeasure = function(){
        var items = this.items0(), n = items.length, measure;
        if(n == 0){
            return measure;
        }
        
        var bounds = this.getBounds(), MBP = bounds.MBP,
        maxSize = this.getMaximumSize(), range = this.getStretchRange(),
        min = range.min, max = range.max, gap = this.getGap(), ameasure;
        
        if(this.isHScroll()){
            ameasure = maxSize.width;
            if(!Class.isNumber(ameasure)){
                return measure;
            }
            
            ameasure = ameasure - gap * (n - 1) - MBP.BPW;
            measure = Math.floor(ameasure / n); //ceil
        }else{
            ameasure = maxSize.height;
            if(!Class.isNumber(ameasure)){
                return measure;
            }
            
            ameasure = ameasure - gap * (n - 1) - MBP.BPH;
            measure = Math.floor(ameasure / n); //ceil
        }
        
        if(Class.isNumber(min) && measure >= min 
           && Class.isNumber(max) && measure <= max){
            // Keep measure
        }else if(Class.isNumber(max) && measure > max){
            measure = max;
        }else if(Class.isNumber(min) && measure < min){
            measure = min;
        }else{
            measure = undefined;
        }
        
        return measure;
    };
    
    var _stretch = function(){
        if(!this.isAutostretch()){
            return;
        }
        
        var items = this.items0(), n = items.length, 
        measure = _getIdealMeasure.call(this),
        isHScroll = this.isHScroll(),
        bounds = this.getBounds(), 
        rigid, w, h, comp, d;
        
        if(!Class.isNumber(measure)){
            return;
        }
        
        if(isHScroll){
            w = measure;
        }else{
            h = measure;
        }
        
        for(var i = 0; i < n; i++){
            comp = this[items[i]];
            if(!comp.isVisible()) continue;
            
            d = comp.getPreferredSize();
            if(isHScroll){
                rigid = comp.isRigidHeight();
                h = rigid ? d.height : bounds.innerHeight;
            }else{
                rigid = comp.isRigidWidth();
                w = rigid ? d.width : bounds.innerWidth; 
            }
            
            // comp.setSize(w, h, 0x04);
            comp.setPreferredSize(w, h);
        }
    };
    
    var _getVisibleCount = function(){
        var items = this.items0(), n = items.length, vCnt = 0,
        comp;

        for(var i = 0; i < n; i++){
            comp = this[items[i]];
            if(!comp.isVisible()) continue;

            ++vCnt;
        }

        return vCnt;        
    };
    
    var _getIdealSize = function(){
        var D = this.getBounds(), gap = this.getGap(), 
        vCnt = _getVisibleCount.call(this), 
        measure = _getIdealMeasure.call(this), idealSize;
        
        if(Class.isNumber(measure)){
            idealSize = {};
            
            if(this.isHScroll()){
                idealSize.width = measure * vCnt + gap * (vCnt - 1) + D.MBP.BPW;
                idealSize.height = D.height;
            }else{
                idealSize.width = D.width;
                idealSize.height = measure * vCnt + gap * (vCnt - 1) + D.MBP.BPH;
            }
        }
        
        return idealSize;
    };
    
    var _getIdealSize$ = function(){
        var items = this.items0(), n = items.length, D = this.getBounds(),
        gap = this.getGap(), isH = this.isHScroll(), vCnt = 0,
        comp, rigid, s, w = 0, h = 0;

        for(var i = 0; i < n; i++){
            comp = this[items[i]];
            if(!comp.isVisible()) continue;

            s = comp.getPreferredSize();            
            if(isH){
                w += s.width;
            }else{
                h += s.height;
            }
            
            ++vCnt;
        }
        
        if(isH){
            w += gap * (vCnt - 1) + D.MBP.BPW;
            h = D.height;
        }else{
            w = D.width;
            h += gap * (vCnt - 1) + D.MBP.BPH;
        }
        
        return {width: w, height: h};
    };
    
    thi$.getIdealSize = function(){
        var items = this.items0(), n = items.length, idealSize;
        if(n > 0){
            if(this.isAutostretch()){
                idealSize = _getIdealSize.call(this);
            }
            
            if(!idealSize){
                idealSize = _getIdealSize$.call(this);                
            }
        }
        
        if(!idealSize){
            idealSize = this.getPreferredSize();
        }
        
        return idealSize;
        
    };
    
    /**
     * @see js.awt.Container #getPreferredSize
     */
    thi$.getPreferredSize = function(){
        var cnt = _getVisibleCount.call(this);
        if(cnt == 0){
            return $super(this);            
        }
        
        var size = this.getIdealSize(), max = this.getMaximumSize(),
        prefSize;
        
        if(this.isHScroll()){
            this._local.itemMeasure = size.width / cnt;
            
            prefSize = {
                width: Math.min(size.width, max.width),
                height: size.height
            };    
        }else{
            this._local.itemMeasure = size.height / cnt;
            
            prefSize = {
                width: size.width,
                height: Math.min(size.height, max.height)
            };
        }
        
        return prefSize;
        
    }.$override(this.getPreferredSize);
    
    thi$.doLayout = function(force){
        if(this.isDOMElement() && this.needLayout(force)){
            _stretch.call(this);
        }

        return $super(this);        
        
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
                
                if(typeof fitem.hoverCtrl == "function"){
                    fitem.hoverCtrl(false);
                }
            }
            if(titem && !titem.isHover()){
                titem.setHover(true, e);
                
                if((!hoverOnCtrl || to == titem.ctrl) 
                    && (typeof titem.hoverCtrl == "function")){
                    titem.hoverCtrl(true);
                }
            }
        }else{
            titem = cache[tid];
            if(titem && titem.isHover() 
                && (typeof titem.hoverCtrl == "function")){
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
     * @see js.awt.Component
     */
    thi$.destroy = function(){
        delete this.cache;
        delete this._local.insert;
        
        this.detachEvent("mouseover", 0, this, _onmouseover);
        this.detachEvent("mouseout",  0, this, _onmouseover);
        this.detachEvent("click",     0, this, _onclick);
        this.detachEvent("dblclick",  0, this, _onclick);
        
        MQ.cancel("js.awt.event.ItemTextEvent", this, _onitemtextchange);
        if(this.isMovable()){
            MQ.cancel("js.awt.event.MovingEvent", this, _ondrag);
        }

        $super(this);

    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(typeof def !== "object") return;
        
        var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true),
        hscroll = (newDef.layout.axis == 0), mover, M;
        
        newDef.classType = newDef.classType || "js.swt.ScrollPane";
        newDef.className = newDef.className 
            || (hscroll ? "jsvm_hscroll" : "jsvm_vscroll");
        newDef.moveObjClz = newDef.moveObjClz || "js.awt.Item";
        
        mover = newDef.mover = newDef.mover || {};
        mover.longpress = mover.longpress || 250;
        mover.freedom = Class.isNumber(mover.freedom) 
            ? mover.freedom : (hscroll ? 1 : 2);
        
        $super(this, newDef, Runtime);
        
        this.cache = {};
        
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

js.swt.ScrollPane.SCROLLPANEEVENT = "js.awt.event.ScrollPaneEvent";
js.swt.ScrollPane.DEFAULTDEF = function(){
    return {
        classType: "js.swt.ScrollPane",
        
        layout: {
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

