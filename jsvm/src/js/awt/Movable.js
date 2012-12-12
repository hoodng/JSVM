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
 * Source code availability: http://jzvm.googlecode.com
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
    System = J$VM.System, MQ = J$VM.MQ;
    
    var _doSelect = function(e){
        
        MQ.register("releaseMoveObject", this, _releaseMoveObject);

        Event.attachEvent(document, "mousemove", 0, this, _onmousemove);
        Event.attachEvent(document, "mouseup", 0, this, _onmouseup);
        
        Event.detachEvent(this.view, "mousemove", 0, this, _onmousemv1);
        Event.detachEvent(this.view, "mouseup",   0, this, _onmouseup1);

        var moveObj = this.getMoveObject(e), 
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
        bt = Math.max(mover.bt*mH, bound),
        br = Math.max(mover.br*mW, bound),
        bb = Math.max(mover.bb*mH, bound),
        bl = Math.max(mover.bl*mW, bound),
        pview = DOM.offsetParent(moveObj.view),
        cview = isAutoFit ? DOM.offsetParent(pview) : pview,
        pbounds = DOM.getBounds(pview);

        moveObj.minX = grid*Math.ceil((0 - marginLf - mW + bl)/grid);
        moveObj.minY = grid*Math.ceil((0 - marginTp - mH + bt)/grid);
        
        maxX = (!isAutoFit || rigidW) ? 
            (!hscroll ? pbounds.width - pbounds.MBP.BW - marginLf - br:
             Math.max(pview.scrollWidth, pbounds.width) - marginLf - br) :
        Math.max(cview.scrollWidth, cview.offsetWidth) - marginLf - br;
        moveObj.maxX = grid*Math.floor(maxX/grid);

        maxY = (!isAutoFit || rigidH) ?
            (!vscroll ? pbounds.height-pbounds.MBP.BH - marginTp - bb:
             Math.max(pview.scrollHeight, pbounds.height) - marginTp - bb) :
        Math.max(cview.scrollHeight, cview.offsetHeight) - marginTp - bb;
        moveObj.maxY = grid*Math.floor(maxY/grid);

        moveObj.showMoveCover(true);
        moveObj.cview = cview;

        this._local.clickXY.x += (cview.scrollLeft- moveObj.getX());
        this._local.clickXY.y += (cview.scrollTop - moveObj.getY());
        
    };

    var _onmousedown = function(e){
        // Notify popup LayerManager 
        e.setEventTarget(this);
        MQ.post("js.awt.event.LayerEvent", e, [this.Runtime().uuid()]);
        this.fireEvent(e);

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

            e.cancelBubble();
        }

        return e.cancelDefault;

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

        if(!System.checkThreshold(e.getTimeStamp().getTime())) 
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
            x = grid*Math.round(x/grid);
            x = (freedom & 0x01) != 0 ? x : undefined;

            y = grid*Math.round(y/grid);
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

        return e.cancelDefault();
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

