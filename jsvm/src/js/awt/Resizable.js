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
        max = Math.max, min = Math.min, 
        ceil = Math.ceil, floor = Math.floor, round = Math.round;

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

    var DW = [-1,-1,-1,+0,+1,+1,+1,+0],
        DH = [-1,+0,+1,+1,+1,+0,-1,-1];

    var diffW = function(i, eventXY, startXY){
        return DW[i]*(eventXY.x - startXY.x);
    };

    var diffH = function(i, eventXY, startXY){
        return DH[i]*(eventXY.y - startXY.y);
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

    thi$.startSizing = function(e, i){
        var moveObj = this.getSizeObject(e),
            ctx = moveObj.getMoveContext();

        ctx.eventXY = e.eventXY();
        moveObj._moveCtx = ctx;        
        MQ.register("releaseSizeObject", this, _release)
    };

    thi$.processSizing = function(e, i){
        var sizeObj = this.getSizeObject(), ctx = sizeObj._moveCtx,
            bounds = sizeObj.getBounds(), mover = this.def.mover,
            grid = this.def.mover.grid, thip = ctx.container,
            xy = e.eventXY(), oxy = ctx.eventXY,
            miniSize = sizeObj.getMinimumSize(),
            maxiSize = sizeObj.getMaximumSize(),
            minW, minH, maxW, maxH, w, h, x, y;

        minW = grid*ceil(  miniSize.width/grid);
        minH = grid*ceil( miniSize.height/grid);
        maxW = grid*floor( maxiSize.width/grid);
        maxH = grid*floor(maxiSize.height/grid);
        w = grid*round((bounds.userW + diffW(i, xy, oxy))/grid)
        h = grid*round((bounds.userH + diffH(i, xy, oxy))/grid),

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
            ctx.moved = true;
        }
        if(w != box.width || h != box.height){
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
        var sizeObj = this.getSizeObject(e),
            ctx = sizeObj._moveCtx,
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
            
            new js.awt.Component(def, this.Runtime());
            sizeObj.insertAfter(this.view);
            sizeObj.setSizingPeer(this);
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
