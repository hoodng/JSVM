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

        if(!J$VM.System.checkThreshold(e.getTimeStamp().getTime())) 
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
        this.def = this.def || {resizer: 255};
        this._local = this._local || {};
        b = b || false;
        
        var M = this.def;

        M.resizable = b;
        M.resizer = Class.isNumber(resizer) ? (resizer & 0x0FF) : 255;
        M.mover = M.mover || {};
        M.mover.grid = M.mover.grid || 1;

        if(b){
            _createResizer.call(this, this.def.resizer);
            if(this.isDOMElement()){
                this.addResizer();
                this.adjustResizer();
            }
        }else{
            this.def.resizable = false;
            this.removeResizer(true);
        }
        
        resizerbounds = resizerbounds || {
            BBM: J$VM.supports.borderBox,
            MBP: {BW: 0, BH: 0, PW: 0, PH: 0, BPW: 0, BPH: 0}
        };
        
        this._local.resizableSettled = true;
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

