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
        return this;
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
            this.movingPeer = null;
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

    CLASS.EVT_MOVE_START = "elementMoveStart";
    CLASS.EVT_MOVING     = "elementMoving";
    CLASS.EVT_MOVE_END   = "elementMoveEnd";

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ,
        max = Math.max, min = Math.min, 
        ceil = Math.ceil, floor = Math.floor, round = Math.round;
    
    thi$.startMoving = function(e, i){
        var moveObj = this.getMoveObject(e), 
            ctx = moveObj.getMovingContext(),
            pounds = ctx.container.getBounds(),
            bounds = moveObj.getBounds(),r = ctx.range,
            mover = this.getMovingConstraints(),
            thip = ctx.container, p = thip.view;

        ctx.eventXY = e.eventXY();
        ctx.minX = mover.bl >= 1 ? max(0, r[0]) : max(-0xFFFF, r[0]);
        ctx.minY = mover.bt >= 1 ? max(0, r[1]) : max(-0xFFFF, r[1]);
        ctx.maxX = mover.br >= 1 ?
            min((pounds.scrollWidth - bounds.width), r[2]): min(0xFFFF,r[2]);
        ctx.maxY = mover.bb >= 1 ?
            min((pounds.scrollHeight- bounds.height),r[3]): min(0xFFFF,r[3]);
        
        ctx.data = {
            event: e,
            ox: bounds.x,
            oy: bounds.y,
            oz: moveObj.getZ()
        };

        moveObj._moveCtx = ctx;
        moveObj.setZ(DOM.getMaxZIndex(document.body)+1);
        moveObj.showMoveCover(true);
        if(moveObj._coverView){
            DOM.setDynamicCursor(moveObj._coverView, i);
        }
        
        MQ.register("releaseMoveObject", this, _release);

        this.fireEvent(new Event(
            CLASS.EVT_MOVE_START, ctx.data, this), true);        
    };

    thi$.processMoving = function(e){
        var moveObj = this.getMoveObject(e), ctx = moveObj._moveCtx,
            bounds = moveObj.getBounds(), data = ctx.data,
            mover = this.getMovingConstraints(),
            grid = mover.grid, freedom = mover.freedom,
            thip = ctx.container, p = thip.view,
            xy = e.eventXY(), oxy = ctx.eventXY,
            x = bounds.userX + (xy.x - oxy.x),
            y = bounds.userY + (xy.y - oxy.y),
            minX = ctx.minX, minY = ctx.minY,
            maxX = ctx.maxX, maxY = ctx.maxY,
            changed;

        x = x < minX ? minX : x > maxX ? maxX : x;
        y = y < minY ? minY : y > maxY ? maxY : y;

        if(x != bounds.x || y != bounds.y){
            // Snap to grid
            x = grid*round(x/grid);
            x = (freedom & 0x01) != 0 ? x : undefined;

            y = grid*round(y/grid);
            y = (freedom & 0x02) != 0 ? y : undefined;

            changed = moveObj.setPosition(x, y);

            data.nx = x;
            data.ny = y;

            ctx.moved = true;
        }

        data.event = e;
        if(ctx.moved){
            this.fireEvent(new Event(
                CLASS.EVT_MOVING, data, this), true);
        }
        
        // Notify all drop targets
        var recvs = moveObj.getMovingMsgRecvs() || [];
        recvs.unshift(moveObj.getMovingPeer().uuid());
        e.setData(data);
        e.setEventTarget(moveObj);
        MQ.post(moveObj.getMovingMsgType(), e, recvs);
    };
    
    thi$.endMoving = function(e){
        var moveObj = this.getMoveObject(e), ctx = moveObj._moveCtx,
            recvs = moveObj.getMovingMsgRecvs() || [], x, y,
            data = ctx.data, changed;

        data.event = e;

        moveObj.setZ(data.oz);
        
        moveObj.showMoveCover(false);
        if(ctx.moved){
            x = moveObj.getX(); y = moveObj.getY();
            data.moved = true;
            data.nx = x;
            data.ny = y;
            moveObj.setPosition(x, y, 0x0F);
        }

        this.fireEvent(new Event(
            CLASS.EVT_MOVE_END, data, this), true);
        
        // Notify all drop targets
        recvs.unshift(moveObj.getMovingPeer().uuid());
        e.setEventTarget(moveObj);
        MQ.post(moveObj.getMovingMsgType(), e, recvs);

        // Release MoveObject
        MQ.post("releaseMoveObject", moveObj, [this.uuid()]);
        moveObj._moveCtx = null;
    };

    var _release = function(moveObj){
        moveObj.releaseMoveObject();
        if(this.moveObj){
            this.moveObj = null;
        }
        MQ.cancel("releaseMoveObject", this, _release);
    };

    /**
     * Test if the element is a hotspot for moving.
     * 
     * @return boolean
     * 
     */
    thi$.isMoverSpot = function(){
        return (this._moveTarget && this._moveTarget.isMovable());
    };

    thi$.getMoveTarget = function(){
        return this._moveTarget || this;
    };

    thi$.setMoveTarget = function(target){
        this._moveTarget = target;
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
        return !this.isCovered() && (this.def.movable === true);
    };
    
    /**
     * Sets whether this component is movable.
     * 
     * @param b, true is movable, false is unable.
     */
    thi$.setMovable = function(b, mover){
        var M = this.def;
        b = b || false;
        M.movable = b;
        if(Class.isObject(mover)){
            M.mover = mover;
        }
        this.getMovingConstraints();
    };

    thi$.showMoveCapture = function(e){
        return false;
    };    
    
};
