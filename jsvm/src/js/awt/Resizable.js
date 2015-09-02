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
        System = J$VM.System, MQ = J$VM.MQ,
        max = Math.max, min = Math.min, abs = Math.abs,
        ceil = Math.ceil, floor = Math.floor, round = Math.round;

    thi$.startSizing = function(e, i){
        var moveObj = this.getSizeObject(e),
            ctx = moveObj.getMoveContext();

        ctx.eventXY = e.eventXY();
        moveObj._moveCtx = ctx;        
        MQ.register("releaseSizeObject", this, _release)
    };

    thi$.processSizing = function(e, i){
        var sizeObj = this.getSizeObject(), ctx = sizeObj._moveCtx,
            thip = ctx.container, pounds = thip.getBounds(),
            bounds = sizeObj.getBounds(),
            mover = this.def.mover, grid = mover.grid, 
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
        MQ.post("releaseSizeObject", "", [this.uuid()]);
    };
    
    var _release = function(){
        if(this.sizeObj){
            this.sizeObj.releaseSizeObject();
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
                className: "jsvm--resize-cover " 
                         + DOM.combineClassName(
                             this.className, "--resize-cover", ""),
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
            
            new js.awt.Component(def, this.Runtime());
            sizeObj.insertAfter(this.view);
            sizeObj.setSizingPeer(this);
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

    var resizerbounds;

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
        if(b){
            var mover = M.mover = M.mover || {};
            mover.bt = Class.isNumber(mover.bt) ? mover.bt : 1;
            mover.br = Class.isNumber(mover.br) ? mover.br : 0;
            mover.bb = Class.isNumber(mover.bb) ? mover.bb : 0;
            mover.bl = Class.isNumber(mover.bl) ? mover.bl : 1;
            mover.grid = Class.isNumber(mover.grid) ? mover.grid : 1;
        }
    };
};
