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
