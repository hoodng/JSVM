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
    thi$.activateComponent = function(comp){
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
        if(arguments.callee.__super__.apply(this, arguments)){
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
        eType;

        if(item){
            eType = e.getType();

            if(eType == "click" && el === item.ctrl){
                e.setEventTarget(item);
                this.notifyPeer(
                    "js.awt.event.ItemEvent", new Event("ctrlclick", "", item));

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

