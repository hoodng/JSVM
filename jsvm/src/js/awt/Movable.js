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
            delete this.movingPeer;            
            this.destroy();
        }else{
            this.movingPeer = null;
        }
    };

    var isScroll = {auto: true, visible: true, scroll: true};

    /**
     * @return {Object} {
     *  container: container element
     *  range:[minX, minY, maxX, maxY]
     * }
     */
    thi$.getMoveContext = function(){
        var autofit = false, thip, bounds, pounds,
            styles, hscroll, vscroll;

        thip = DOM.getEventTarget(
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
            ctx = moveObj.getMoveContext(), p = ctx.container.view,
            r = ctx.range, bounds = moveObj.getBounds(),
            mover = this.def.mover, grid = mover.grid, bound=mover.bound,
            bt = max(mover.bt*bounds.height, bound),
            br = max(mover.br*bounds.width,  bound),
            bb = max(mover.bb*bounds.height, bound),
            bl = max(mover.bl*bounds.width,  bound);

        ctx.minX = grid*ceil( (r[0]+bl)/grid);
        ctx.minY = grid*ceil( (r[1]+bt)/grid);
        ctx.maxX = grid*floor((r[2]-br)/grid);
        ctx.maxY = grid*floor((r[3]-bb)/grid);
        ctx.eventXY = e.eventXY();
        ctx.eventXY.x += (p.scrollLeft- moveObj.getX());
        ctx.eventXY.y += (p.scrollTop - moveObj.getY());
        moveObj._moveCtx = ctx;        
        moveObj.showMoveCover(true);
        MQ.register("releaseMoveObject", this, _release);        
    };

    thi$.processMoving = function(e){
        var moveObj = this.getMoveObject(e), ctx = moveObj._moveCtx,
            bounds = moveObj.getBounds(), mover = this.def.mover,
            grid = mover.grid, freedom = mover.freedom,
            thip = ctx.container, p = thip.view,
            xy = e.eventXY(), oxy = ctx.eventXY,
            x = p.scrollLeft + xy.x - oxy.x ,
            y = p.scrollTop  + xy.y - oxy.y,
        
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
        MQ.post("releaseMoveObject", "", [this.uuid()]);

        moveObj.showMoveCover(false);
        if(ctx.moved){
            moveObj.setPosition(moveObj.getX(), moveObj.getY(), 0x0F);
        }
        delete moveObj._moveCtx;
    };

    var _release = function(){
        if(this.moveObj){
            this.moveObj.releaseMoveObject();
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
        var M = this.def;
        b = b || false;
        M.movable = b;
        if(b){
            var mover = M.mover = M.mover || {};
            mover.bound = 
                Class.isNumber(mover.bound) ? mover.bound : 20;
            mover.bt = Class.isNumber(mover.bt) ? mover.bt : 1;
            mover.br = Class.isNumber(mover.br) ? mover.br : 0;
            mover.bb = Class.isNumber(mover.bb) ? mover.bb : 0;
            mover.bl = Class.isNumber(mover.bl) ? mover.bl : 1;
            mover.grid = Class.isNumber(mover.grid) ? mover.grid : 1;
            mover.freedom = Class.isNumber(mover.freedom) ? mover.freedom : 3;
        }
    };
};

