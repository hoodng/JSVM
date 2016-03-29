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

    CLASS.EVT_RESIZE_START = "elementResizeStart";
    CLASS.EVT_RESIZING     = "elementResizing";
    CLASS.EVT_RESIZE_END   = "elementResizeEnd";

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ,
        max = Math.max, min = Math.min, abs = Math.abs,
        ceil = Math.ceil, floor = Math.floor, round = Math.round;

    thi$.startSizing = function(e, i){
        var moveObj = this.getSizeObject(e),
            ctx = moveObj.getMovingContext(),
            bounds = moveObj.getBounds();

        ctx.eventXY = e.eventXY();
        ctx.data = {
            event: e,
            ox: bounds.x,
            oy: bounds.y,
            ow: bounds.width,
            oh: bounds.height
        };
        
        moveObj._moveCtx = ctx;        
        MQ.register("releaseSizeObject", this, _release);
        DOM.setDynamicCursor(moveObj.view, i);

        this.fireEvent(new Event(
            CLASS.EVT_RESIZE_START, ctx.data, this), true);
    };

    thi$.processSizing = function(e, i){
        var sizeObj = this.getSizeObject(), ctx = sizeObj._moveCtx,
            thip = ctx.container, pounds = thip.getBounds(),
            bounds = sizeObj.getBounds(), 
            mover = this.getMovingConstraints(), grid = mover.grid, 
            minSize = sizeObj.getMinimumSize(),
            maxSize = sizeObj.getMaximumSize(),
            xy = e.eventXY(), minV, maxV, v0, v1, 
            x, y, w, h, data = ctx.data, changed;

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
                               maxSize.width : pounds.scrollWidth)/grid);
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
                               maxSize.height : pounds.scrollHeight)/grid);
            y = bounds.userY;
            h = grid*floor((xy.y - v0)/grid);
            h = h < minV ? minV : (h > maxV ? maxV : h);
            break;
        }

        if(x != bounds.offsetX || y != bounds.offsetY){
            changed = sizeObj.setPosition(x, y);
            ctx.moved = true;
            data.nx = x;
            data.ny = y;
        }
        if(w != bounds.width || h != bounds.height){
            changed = sizeObj.setSize(w, h);
            ctx.sized = true;
            data.nw = w;
            data.nh = h;
        }

        sizeObj.getSizingPeer().adjustOutline(bounds);

        data.event = e;
        if(ctx.moved || ctx.sized){
            this.fireEvent(new Event(
                CLASS.EVT_RESIZING, data, this), true);
        }
        
        // Notify all message receivers
        var recvs = sizeObj.getSizingMsgRecvs() || [];
        recvs.unshift(sizeObj.getSizingPeer().uuid());
        e.setData(data);
        e.setEventTarget(sizeObj);
        MQ.post(sizeObj.getSizingMsgType(), e, recvs);
    };

    thi$.endSizing = function(e, i){
        var sizeObj = this.getSizeObject(e), ctx = sizeObj._moveCtx,
            recvs = sizeObj.getSizingMsgRecvs() || [], x, y, w, h, 
            data = ctx.data, changed;

        data.event = e;

        if(ctx.sized){
            w = sizeObj.getWidth(); h = sizeObj.getHeight();
            data.sized = true;
            data.nw = w;
            data.nh = h;
            if(ctx.syncchange){
                this.setSize(w, h, 0x0F);
            }
            ctx.sized = false;
        }

        if(ctx.moved){
            x = sizeObj.getX(); y = sizeObj.getY();
            data.moved = true;
            data.nx = x;
            data.ny = y;
            if(ctx.syncchange){
                this.setPosition(x, y, 0x0F);
            }
            ctx.moved = false;
        }

        this.fireEvent(new Event(
            CLASS.EVT_RESIZE_END, data, this), true);
        
        // Notify all message receivers
        recvs.unshift(sizeObj.getSizingPeer().uuid());
        e.setData(data);
        e.setEventTarget(sizeObj);
        MQ.post(sizeObj.getSizingMsgType(), e, recvs);

        // Release SizeObject
        MQ.post("releaseSizeObject", sizeObj, [this.uuid()]);
    };
    
    var _release = function(sizeObj){
        sizeObj.releaseSizeObject();
        if(this.sizeObj){
            this.sizeObj = null;
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
        var sizeObj = this.sizeObj, bounds, def, view, xy;
        if(!sizeObj){
            view = this.view;
            bounds = this.getBounds();
            xy = DOM.relative(bounds.absX, bounds.absY,
                              DOM.getBounds(DOM.getOffsetParent(view)));

            def = {
                classType: "js.awt.Component",
                className: DOM.combineClassName(
                    ["jsvm_", this.def.resizeClassName||""].join(" "),
                    ["cover", "cover--resize"]),
                css: "position:absolute;",
                stateless: true,
                z : this.getZ()+1,
                prefSize : this.getPreferredSize(),
                miniSize : this.getMinimumSize(),
                maxiSize : this.getMaximumSize()
            };
            
            sizeObj = this.sizeObj = /*this;*/
            new js.awt.Component(def, this.Runtime());
            sizeObj.insertAfter(view);
            sizeObj.setSizingPeer(this);
            sizeObj.setBounds(xy.x, xy.y,
                              bounds.width, bounds.height, 0x04);

            sizeObj.getMovingContext =
                this.getMovingContext.$bind(this);
            sizeObj.getMovingConstraints =
                this.getMovingConstraints.$bind(this);
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

    var RS = 5, RS2 = RS * 2, RS4 = RS2 * 2;
    
    var resizerBounds = [
        // 0
        function(bounds){
            return {
                x: bounds.absX - RS,
                y: bounds.absY - RS,
                width: RS2,
                height: RS2
            };
        },
        // 1
        function(bounds){
            return {
                x: bounds.absX - RS,
                y: bounds.absY + RS,
                width: RS2,
                height: bounds.height - RS2
            };
        },
        // 2
        function(bounds){
            return {
                x: bounds.absX - RS,
                y: bounds.absY + bounds.height - RS,
                width: RS2,
                height: RS2
            };
        },
        // 3
        function(bounds){
            return {
                x: bounds.absX + RS,
                y: bounds.absY + bounds.height - RS,
                width: bounds.width - RS2,
                height: RS2
            };
        },
        // 4
        function(bounds){
            return {
                x: bounds.absX + bounds.width  - RS,
                y: bounds.absY + bounds.height - RS,
                width: RS2,
                height: RS2
            };
        },
        // 5
        function(bounds){
            return {
                x: bounds.absX + bounds.width - RS,
                y: bounds.absY + RS,
                width: RS2,
                height: bounds.height - RS2
            };
        },
        // 6
        function(bounds){
            return {
                x: bounds.absX + bounds.width - RS,
                y: bounds.absY - RS,
                width: RS2,
                height: RS2
            };
        },
        // 7
        function(bounds){
            return {
                x: bounds.absX + RS,
                y: bounds.absY - RS,
                width: bounds.width - RS2,
                height: RS2
            };
        }
    ];

    thi$.showResizeCapture = function(e){
        var xy = e.eventXY(), bounds = this.getBounds(),
            idxes = DOM.offsetIndexes(xy.x, xy.y, bounds),
            idx = idxes[2], ret = false;

        idx =  idx < 8 ? (this.isResizable(idx) ? idx : -1) : -1;
        if(idx >= 0){
            DOM.showMouseCapturer(resizerBounds[idx](bounds),
                                  this.uuid(), idx);
            ret = true;
        }

        return ret;
    };
    
};
