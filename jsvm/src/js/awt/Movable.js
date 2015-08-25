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

    var DOM = J$VM.DOM,
        max = Math.max, min = Math.min, round = Math.round,
        floor = Math.floor, ceil = Math.ceil;
    
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

    var isScroll = {"auto" : true, "scroll": true};

    /**
     * @return {Object} {
     *  container: container element
     *  range:[minX, minY, maxX, maxY]
     * }
     */
    thi$.getMoveRange = function(){
        var autoFit = false, bounds,
            pview = DOM.offsetParent(this.view), cview,
            pcomp = DOM.getEventTarget(pview), mgl, mgt

        if(pcomp){
            autoFit = pcomp.isAutoFit ? pcomp.isAutoFit() : false;
        }

        bounds = this.getBounds();
        mgl = bounds.MBP.marginLeft;
        mgt = bounds.MBP.marginTop;

        cview = autoFit ? DOM.offsetParent(pview) : pview;

        return{
            container: cview,
            range:[
                0-mgl - bounds.width,
                0-mgt - bounds.height,
                autoFit ? max(pview.scrollWidth, pview.offsetWidth) - mgl :
                    max(cview.scrollWidth, cview.offsetWidth) - mgl,
                autoFit ? max(pview.scrollHeight,pview.offsetHeight)- mgt :
                    max(cview.scrollHeight,cview.offsetHeight)- mgt
            ]
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
        this.detachEvent("mouseup", 4, this, _onmouseup1);

        this.attachEvent("mousemove", 4, this, _onmousemove);
        this.attachEvent("mouseup", 4, this, _onmouseup);                

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

    thi$._startmoving = function(e){
        var U = this._local, moveObj = this.getMoveObject(e), 
            moveRange = moveObj.getMoveRange(), r = moveRange.range,
            bounds = moveObj.getBounds(), mover = this.def.mover,
            grid = mover.grid, bound=mover.bound,
            bt = max(mover.bt*bounds.height, bound),
            br = max(mover.br*bounds.width, bound),
            bb = max(mover.bb*bounds.height, bound),
            bl = max(mover.bl*bounds.width, bound);
        
        moveObj.minX = grid*ceil( (r[0]+bl)/grid);
        moveObj.minY = grid*ceil( (r[1]+bt)/grid);
        moveObj.maxX = grid*floor((r[2]-br)/grid);
        moveObj.maxY = grid*floor((r[3]-bb)/grid);
        moveObj.cview= moveRange.container;
        
        moveObj.showMoveCover(true);

        U.eventXY = e.eventXY();
        U.eventXY.x += (moveObj.cview.scrollLeft- moveObj.getX());
        U.eventXY.y += (moveObj.cview.scrollTop - moveObj.getY());
        
        MQ.register("releaseMoveObject", this, _release);        
    };

    thi$._domoving = function(e){
        var U = this._local, moveObj = this.getMoveObject(e),
            bounds = moveObj.getBounds(), mover = this.def.mover,
            grid = mover.grid, freedom = mover.freedom,
            p = moveObj.cview, xy = e.eventXY(), oxy = U.eventXY,
            x = xy.x + p.scrollLeft - oxy.x ,
            y = xy.y + p.scrollTop - oxy.y,
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
    };
    
    thi$._endmoving = function(e){
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
    };

    var _onmousedown = function(e){

        var targ = e.srcElement;
        if(targ.nodeType == 3){
            // Safari bug ?
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

            this.attachEvent("mouseup", 4, this, _onmouseup1);
            _doSelect.$delay(this, longpress, e);
        }
    };

    var _onmouseup1 = function(e){
        if(!_doSelect.$clearTimer()){
            this.detachEvent("mouseup", 4, this, _onmouseup1);
        }
    };
    

    var _onmousemove =function(e){

        if(!System.checkThreshold(e.getTimeStamp().getTime(), 
                                  this.def.mover.threshold)) 
            return;
        System.err.pritnln("mouse moveing...");
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
    };

    var _onmouseup =function(e){
        _doSelect.$clearTimer();

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

        this.detachEvent("mousemove", 4, this, _onmousemove);
        this.detachEvent("mouseup", 4, this, _onmouseup);                
    };

    var _release = function(){
        if(this.moveObj){
            delete this.moveObj.cview;
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
        return this.spotIndex(ele, {x:x, y:y}) === 8;
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
        
        U.movableSettled = true;
    };
    
    thi$.movableSettled = function(){
        return this._local.movableSettled || false;
    };

};

