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
 * File: DropdownList.js
 * Create: 2012/05/07 02:06:36
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

/**
 * A <em>DropdownList</em> is a <em>Container</em> which includes a <em>List</em>.
 *
 * Attention:
 *      only when <em>multiEnable</em> is <em>true</em>, the <em>multiByCheck</em> can
 *      take effect. Otherwise it will be ignored.
 *
 * @param def: {
 *     className: {String} required,
 *     css: {String} optional
 *     id: {String} optional,
 *
 *     container: {js.awt.Component} required,
 *     multiEnable: {Boolean} Default is <em>false</em>, required,
 *     distinct: {Boolean} Default is false, required. Indicate whether the item of List
 *         is distinct.
 *     searchIfAllowed: {Boolean} Default is false, required. Indicate whether the DropdownList
 *         can support quick search if it is enable.
 *     showItemTip: {Boolean} Default is false, required. Indicate whether each item should show
 *         its tooltips with the given tooltips or its display value.
 *     searchCritical: {Number} An optional value between 1 and 100 which expresses a percent.
 *         When (the viewable height/total contents height) <= this percent, the DropdownList can
 *         be enable to do quick search.
 *
 *     lazy: {Boolean} Default is false, optional. Indicate whether all items should
 *        be loaded lazily. That is to say, all items will be added and removed
 *        asynchronously.
 *
 *     itemDefs: {Array} Definitions of items. If it is specified, the itemModels will be ignored.
 *     itemModels: {Array} Models of items, optional. Its structure is as follow:
 *     [
 *          {dname: xxx, img: xxx (Optional), value},
 *              ......
 *          {dname: xxx, img: xxx (Optional), value}
 *     ]
 * }
 */
$import("js.swt.List");

js.swt.DropdownList = function(def, Runtime){
    var CLASS = js.swt.DropdownList, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event,
    DOM = J$VM.DOM, System = J$VM.System;

    var searchBoxDef = {
        classType: "js.awt.HBox",

        align_x: 0.5, align_y: 0.0,
        rigid_w: false, rigid_h: true,

        height: CLASS.DEFAULTSEARCHBOXHEIGHT,

        layout: {gap: 0, align_x: 1.0, align_y: 0.5},

        items: ["btnStrategy", "inputBox", "btnClear"],
        btnStrategy: {
            classType: "js.awt.Icon",
            image: "search.png",

            rigid_w: true, rigid_h: true,
            prefSize: {width: 11, height: 11},

            width: 11, height: 11
        },
        inputBox: {
            classType: "js.swt.TextField",
            rigid_w: false, rigid_h: false
        },
        btnClear: {
            classType: "js.awt.Icon",
            image: "clear.png",

            rigid_w: true,  rigid_h : true,
            prefSize: {width: 11,   height: 11},

            width: 11, height: 11
        }
    },
    controlBarDef = {
        classType: "js.awt.HBox",

        align_x: 0.5, align_y: 1.0,
        rigid_w: false, rigid_h: true,

        height: CLASS.DEFAULTCONTROLBARHEIGHT,

        layout: {gap: 0, align_x: 1.0, align_y: 0.5},
        items: ["label"],
        label: {
            classType: "js.awt.Label",
            rigid_w: true, rigid_h: false
        }
    };

    /**
     * @see js.swt.List #setItems
     */
    thi$.setItems = function(items){
        this.list.setItems(items);
    };

    /**
     * @see js.swt.List #addItems
     */
    thi$.addItems = function(items){
        this.list.addItems(items);
    };

    /**
     * @see js.swt.List #setItemsByModel
     */
    thi$.setItemsByModel = function(models){
        this.list.setItemsByModel(models);
    };

    /**
     * @see js.swt.List #addItemsByModel
     */
    thi$.addItemsByModel = function(models){
        this.list.addItemsByModel(models);
    };

    /**
     * @see js.swt.List #setItemsByDef
     */
    thi$.setItemsByDef = function(defs){
        this.list.setItemsByDef(defs);
    };

    /**
     * @see js.swt.List #addItemsByDef
     */
    thi$.addItemsByDef = function(defs){
        this.list.addItemsByDef(defs);
    };

    /**
     * @see js.swt.DropdownList #removeItemsByModel
     */
    thi$.removeItemsByDef = function(def){
        var m = def ? def.model : undefined,
        tmp;
        if(m){
            tmp = this.removeItemsByModel(m);
        }

        return tmp;
    };

    /**
     * @see js.swt.DropdownList #removeItems
     */
    thi$.removeItemsByModel = function(model){
        var items = this.findItemsByModel(model),
        tmp;
        if(items && items.length > 0){
            if(this.def.multiEnable === true){
                tmp = items;
            }else{
                tmp = [items[0]];
            }

            this.removeItems(tmp);
        }

        return tmp;
    };

    /**
     * @see js.swt.List #removeItems
     */
    thi$.removeItems = function(items){
        this.list.removeItems(items);
        return items;
    };

    /**
     * @see <em>js.swt.List #getItems()</em>
     */
    thi$.getItems = function(){
        return this.list.getItems();
    };

    /**
     * @see <em>js.swt.List #getItemModels()</em>
     */
    thi$.getItemModels = function(){
        return this.list.getItemModels();
    };

    /**
     * @see <em>js.swt.List #getItemDefs()</em>
     */
    thi$.getItemDefs = function(){
        return this.list.getItemDefs();
    };

    /**
     * Select all items indicated by given values.
     *
     * @see <em>js.swt.List #setSelectedValues</em>
     */
    thi$.setSelectedValues = function(values, callback){
        var list = this.list;
        list.setSelectedValues.apply(list, arguments);
    };

    /**
     * Select all items indicated by given indexes.
     *
     * @see <em>js.swt.List #setSelectedIndexes</em>
     */
    thi$.setSelectedIndexes = function(indexes, callback){
        var list = this.list;
        list.setSelectedIndexes.apply(list, arguments);
    };

    /**
     * Select all given items.
     *
     * @see <em>js.swt.List #setSelectedItems</em>
     */
    thi$.setSelectedItems = function(items, callback){
        var list = this.list;
        list.setSelectedItems.apply(list, arguments);
    };

    /**
     * Un-select all given items.
     *
     * @see <em>js.swt.List #unselectAll</em>
     */
    thi$.unselectAll = function(callback){
        var list = this.list;
        list.unselectAll.apply(list, arguments);
    };

    /**
     * Select all items indicated by given model.
     *
     * @see <em>js.swt.List #setSelectedItems</em>
     */
    thi$.setSelectedByModel = function(model, callback){
        var args = Array.prototype.slice.call(arguments, 1),
        items = this.findItemsByModel(model);
        args.unshift(items);

        this.setSelectedItems.apply(this, args);
    };

    /**
     * @see <em>js.swt.List #getSelectedItems</em>
     */
    thi$.getSelectedItems = function(isOrdered){
        return this.list.getSelectedItems();;
    };

    /**
     * @see <em>js.swt.List #getSelectedModels</em>
     */
    thi$.getSelectedModels = function(isOrdered){
        return this.list.getSelectedModels(isOrdered);
    };

    /**
     * @see <em>js.swt.List #getSelectedIndexes</em>
     */
    thi$.getSelectedIndexes = function(){
        return this.list.getSelectedIndexes();
    };

    thi$.findModelByIndex = function (index){
        var items = this.getItems();
        var len = items ? items.length : 0;
        if(isNaN(index) || len == 0 || index >= len){
            return null;
        }

        return items[0] ? items[0].model : null;
    };

    thi$.findItemsByModel = function(model){
        if(!model || (typeof model !== "object"))
            return null;

        return this.list.getItemsByModel(this.getItems(), model);
    };

    thi$.findItemsByDname = function(dname){
        if(typeof dname !== "string")
            return null;

        return this.list.getItemsByDname(this.getItems(), dname);
    };

    thi$.findModelByDname = function (dname) {
        var items = this.findItemsByDname(dname);
        return (items && items.length > 0) ? items[0].model : null;
    };

    thi$.findItemsByValue = function (value){
        if(value == undefined || value == null)
            return null;

        return this.list.getItemsByValue(this.getItems(), value);
    };

    thi$.findModelByValue = function (value) {
        var items = this.findItemsByValue(value);
        return items && items.length > 0 ? items[0].model : null;
    };

    thi$.setSearchCritical = function(num){
        num = parseInt(num);
        if(!isNaN(num) && num >= 1 && num <= 100){
            this.searchCritical = num;
        } else {
            this.searchCritical = js.swt.DropdownList.SEARCHCRITICAL;
        }
    };

    thi$.getSearchCritical = function(){
        return this.searchCritical;
    };

    thi$.setMinimumSize = function(w, h){
        this.def.miniSize = this.def.miniSize || {};

        var miniSize = this.def.miniSize,
        ow = miniSize.width, oh = miniSize.height,
        invalidate = false;
        if(!isNaN(w) && w !== ow){
            invalidate = true;
            miniSize.width = w;
        }

        if(!isNaN(h) && h !== oh){
            invalidate = true;
            miniSize.height = h;
        }

        if(invalidate){
            this.invalidateLayout(false);
        }

    }.$override(this.setMinimumSize);

    var _calMiniHeight = function(){
        var box = this.getBounds(), mbp = box.MBP,
        gap = (this.layout && this.layout.def) ? (this.layout.def.gap || 0) : 0,
        h = 18, d;

        if(this.searchBox && this.searchBox.isVisible()){
            d = this.searchBox.getSize();
            h += d.height;

            h += gap;
        }

        if(this.controlBar && this.controlBar.isVisible()){
            d = this.controlBar.getSize();
            h += d.height;

            h += gap;
        }

        h += mbp.BPW;
        return h;
    };

    thi$.getMinimumSize = function(){
        var minH = this.def.miniSize
            ? this.def.miniSize.height : undefined;
        if(isNaN(minH)){
            minH = _calMiniHeight.call(this);
            this.setMinimumSize(undefined, minH);
        }

        return this.def.miniSize;

    }.$override(this.getMinimumSize);

    thi$.setMaximumSize = function(w, h){
        this.def.maxiSize = this.def.maxiSize || {};

        var maxiSize = this.def.maxiSize,
        ow = maxiSize.width, oh = maxiSize.height,
        invalidate = false;
        if(!isNaN(w) && ow !== w){
            invalidate = true;
            maxiSize.width = w;
        }

        if(!isNaN(h) && oh !== h){
            invalidate = true;
            this.def.maxiSize.height = h;
        }

        if(invalidate){
            this.invalidateLayout(false);
        }

    }.$override(this.setMinimumSize);

    thi$.getMaximumSize = function(){
        return this.def.maxiSize;
    }.$override(this.getMaximumSize);

    thi$.getPreferredSize = function(){
        if(this.isPreferredSizeSet){
            return this.def.prefSize;
        }

        if(this._local.optimalSize){
            return this._local.optimalSize;
        }else{
            return $super(this);
        }
    }.$override(this.getPreferredSize);

    var _setSearchEnable = function(b){
        var v = (b === true);
        if(this.searchEnable === v)
            return;

        this.searchEnable = v;

        if(this.searchBox){
            this.searchBox.setVisible(v);
            this.searchBox.applyStyles({display : (v ? "block" : "none")});
        }

        if(this.list){
            this.list.setSearchEnable(v);
        }
    };

    var _layoutSearchBox = function(){
        var box = this.getBounds(), prefSize = this.list.getPreferredSize(),
        avaiH = box.innerHeight, show = false;

        if(this.controlBar && this.controlBar.isVisible()){
            var d = this.controlBar.getSize();
            avaiH -= d.height;
        }

        if(this.searchBox && this.searchIfAllowed
           && this.list.canBeSearched()){
            show = ((avaiH / prefSize.height * 100) <= this.searchCritical);
        }

        _setSearchEnable.call(this, show);
    };

    var _setOptimalSize = function(w, h){
        if(this._local.optimalSize){
            return;
        }

        var s = DOM.outerSize(this.view);
        this._local.optimalSize = {
            width: (isNaN(w) ? s.width : w),
            height: (isNaN(h) ? s.height: h)
        };
    };

    var _getGap = function(){
        var gap = this._local.gap;
        if(!isNaN(gap)){
            return gap;
        }

        gap = 0;
        if(this.layout && this.layout.def){
            gap = this.layout.def.gap || 0;
        }

        this._local.gap = gap;
        return this._local.gap;
    };

    var _isSBoxVisible = function(ah){
        var show = false, prefSize = this.list.getPreferredSize();
        if(this.searchBox && this.searchIfAllowed
           && this.list.canBeSearched()){
            show = ((ah / prefSize.height * 100) <= this.searchCritical);
        }

        return show;
    };

    var _calLengthenDeltas = function(listW, listH){
        var rtBounds = this._local.runtimeBounds,
        area = this._local.runtimeArea, deltas;
        if(!rtBounds || !area){
            return deltas;
        }

        var st = CLASS.SCROLLBARTHINKNESS,
        prefSize = this.list.getPreferredSize(),
        maxiSize = this.getMaximumSize(),
        rx = rtBounds.x, ry = rtBounds.y,
        rw = rtBounds.width, rh = rtBounds.height,
        aw = area.width, ah = area.height,
        hGap = listW - prefSize.width,
        vGap = listH - prefSize.height,
        wDelta = hGap <= 0 ? st : (st - hGap),
        hDelta = vGap <= 0 ? st : (st - vGap),
        wAmple = false, hAmple = false,
        tmpW, tmpH;

        if(maxiSize){
            tmpW = maxiSize.width;
            if(!isNaN(tmpW) && tmpW < aw){
                aw = tmpW;
            }

            tmpH = maxiSize.height;
            if(!isNaN(tmpH) && tmpH < ah){
                ah = tmpH;
            }
        }

        if(wDelta <= 0){
            wDelta = 0;
            wAmple = true; //Enough to place all contents and vertical scrollbar
        }

        if(hDelta <= 0){
            hDelta = 0;
            hAmple = true; //Enough to place all contents and vertical scrollbar
        }

        switch(area.AID){
        case "A":
            tmpW = aw - rw;
            wDelta = Math.min(wDelta, tmpW);

            tmpH = ah - rh;
            hDelta = Math.min(hDelta, tmpH);
            break;
        case "D": //Area D
            tmpW = rx > 0 ? rx : 0;
            wDelta = 0 - Math.min(wDelta, tmpW);

            tmpH = ah - rh;
            hDelta = Math.min(hDelta, tmpH);
            break;
        case "B": //Area B
            tmpW = aw - rw;
            wDelta = Math.min(wDelta, tmpW);

            tmpH = ry > 0 ? ry : 0;
            hDelta = 0 - Math.min(hDelta, tmpH);
            break;
        case "C":
            tmpW = rx > 0 ? rx : 0;
            wDelta = 0 - Math.min(wDelta, tmpW);

            tmpH = ry > 0 ? ry : 0;
            hDelta = 0 - Math.min(hDelta, tmpH);
            break;
        }

        deltas = {
            wAmple: wAmple, wDelta: wDelta, maxWDelta: tmpW,
            hAmple: hAmple, hDelta: hDelta, maxHDelta: tmpH
        };

        return deltas;
    };

    var _preSize = function(){
        var matrix = this._local.matrix;
        if(matrix){
            return matrix;
        }

        matrix = {};

        var box = this.getBounds(), mbp = box.MBP,
        houter = mbp.BPW, vouter = mbp.BPH,
        prefSize = this.list.getPreferredSize(),
        miniSize = this.getMinimumSize(),
        maxiSize = this.getMaximumSize(),
        gap = _getGap.call(this),
        w = box.width, h = box.height,
        vother = 0, show = false,
        d, minW, minH, maxW, maxH,
        rb, rw, rh;

        if(this.controlBar){
            d = this.controlBar.getSize();
            vother += d.height;

            vother += gap;
        }

        w = this.hauto ? prefSize.width + houter : w;
        h = this.vauto ? prefSize.height + vouter + vother : h;

        if(miniSize){
            minW = miniSize.width;
            minH = miniSize.height;

            w = (!isNaN(minW) && minW > 0) ? Math.max(w, minW) : w;
            h = (!isNaN(minH) && minH > 0) ? Math.max(h, minH) : h;
        }

        if(maxiSize){
            maxW = maxiSize.width;
            maxH = maxiSize.height;
        }

        rb = this._local.runtimeBounds;
        if(rb){
            rw = rb.width;
            rh = rb.height;

            maxW = !isNaN(maxW) ? Math.min(maxW, rw) : rw;
            maxH = !isNaN(maxH) ? Math.min(maxH, rh) : rh;
        }

        if(!isNaN(maxW) && maxW < w){
            w = maxW;
        }

        if(!isNaN(maxH) && maxH < h){
            h = maxH;
        }

        matrix.width = w;
        matrix.height = h;

        show = _isSBoxVisible.call(this, h - vouter - vother);
        matrix.isSBoxVisible = show;
        _setSearchEnable.call(this, show);

        vother = 0;
        if(this.searchBox && this.searchBox.isVisible()){
            d = this.searchBox.getSize();
            vother += d.height;

            vother += gap;
        }

        if(this.controlBar && this.controlBar.isVisible()){
            d = this.controlBar.getSize();
            vother += d.height;

            vother += gap;
        }

        matrix.listW = w - houter;
        matrix.listH = h - vouter - vother;

        this._local.matrix = matrix;
        return matrix;
    };

    var _rectifyListSize = function(s){
        if(!s.wAdjusted && !s.hAdjusted){
            return;
        }

        var ST = CLASS.SCROLLBARTHINKNESS,
        listBox = this.list.getBounds(),
        w = listBox.innerWidth,
        h = listBox.innerHeight,
        listView = this.list.listView,
        vBox = DOM.getBounds(listView),
        sw = listView.scrollWidth,
        sh = listView.scrollHeight;

        if(s.wAdjusted){
            w -= ST;
        }else{
            // if(J$VM.ie && !isNaN(sw)
            //  && sw != vBox.width){
            //  System.err.println("Width:" + vBox.width + " ScollWidth:" + sw);
            //  w = sw;
            // }else{
            w = undefined;
            // }
        }

        if(s.hAdjusted){
            h -= ST;
        }else{
            // if(J$VM.ie && !isNaN(sh)
            //  && sh != vBox.height){
            //  System.err.println("Height:" + vBox.height + " ScollHeight:" + sh);
            //  h = sh;
            // }else{
            h = undefined;
            // }
        }

        DOM.setSize(listView, w, h, vBox);

        // ?? That is very strange in IE when doctype
        if(J$VM.ie && J$VM.doctype.declared){
            var lvStyle = this.list.view.style,
            overflow = this.list.getStyle("overflow");
            if(overflow === "auto"){
                lvStyle.overflow = "scroll";
                this.list.setSize(listBox.width, listBox.height);
                lvStyle.overflow = "auto";
            }
        }
    };

    var _layout = function(){
        if(!this._isLayoutDirty || !this.list.isReady()
           || !this.isDOMElement()){
            return undefined;
        }

        this._isLayoutDirty = false;

        var ST = CLASS.SCROLLBARTHINKNESS,
        matrix = _preSize.call(this),
        prefSize = this.list.getPreferredSize(),
        listW = matrix.listW, listH = matrix.listH,
        w = matrix.width, h = matrix.height,
        deltas = _calLengthenDeltas.call(this, listW, listH),
        ample = false, delta = 0, maxDelta, deltaSize = {},
        rb, rx, ry, x, y;

        if(deltas){
            rb = this._local.runtimeBounds;
            rx = rb.x;
            ry = rb.y;

            if(this.hauto && (listH < prefSize.height)){
                ample = deltas.wAmple;
                delta = deltas.wDelta;
                maxDelta = deltas.maxWDelta;

                if(!ample && maxDelta > 0){
                    if(delta < 0){
                        delta = Math.abs(delta);
                        x = rx - delta;
                    }
                    w += delta;

                    deltaSize.wDelta = delta;
                    deltaSize.wAdjusted = true;
                }else if(ample){
                    // Although the space is enough to place all contents and
                    // the vertical scrollbar, however the vertical scrollbar
                    // occupied the space and the list need be adjusted to make
                    // space for in "_rectifyListSize()".
                    deltaSize.wDelta = ST;
                    deltaSize.wAdjusted = true;
                }else{
                    //Ignore
                }
            }

            if(this.vauto && (listW < prefSize.width)){
                ample = deltas.hAmple;
                delta = deltas.hDelta;
                maxDelta = deltas.maxHDelta;

                if(!ample && maxDelta > 0){
                    if(delta < 0){
                        delta = Math.abs(delta);
                        y = ry - delta;

                    }
                    h += delta;

                    deltaSize.hDelta = delta;
                    deltaSize.hAdjusted = true;
                }else if(ample){
                    // Although the space is enough to place all contents and
                    // the horizontal scrollbar, however the vertical scrollbar
                    // occupied the space and the list need be adjusted to make
                    // space for in "_rectifyListSize()".
                    deltaSize.hDelta = ST;
                    deltaSize.hAdjusted = true;
                }else{
                    //Ignore
                }
            }
        }

        _setOptimalSize.call(this, w, h);
        this.setBounds(x, y, w, h);

        return deltaSize;
    };

    thi$.doLayout = function(){
        // We need to invoke the "_layout" function one time
        // only if some items are changed (Added and removed).
        var s = _layout.call(this);
        if(s){
            $super(this);
            _rectifyListSize.call(this, s);
        }
    }.$override(this.doLayout);

    /**
     * @see js.awt.PopupLayer #beforeRemoveLayer
     */
    thi$.beforeRemoveLayer = function(e){
        this.notifyPeer("js.awt.event.LayerEvent",
                        new Event("beforeRemoveLayer", e || "", this));

        this.list.showController(false);
        this.restore();

    }.$override(this.beforeRemoveLayer);

    /**
     * @see js.awt.PopupLayer #afterRemoveLayer
     */
    thi$.afterRemoveLayer = function(e){
        if(e && e.getType() === "resize"){
            this.invalidateLayout(false);
        }

        this.notifyPeer("js.awt.event.LayerEvent",
                        new Event("afterRemoveLayer", e || "", this));

    }.$override(this.afterRemoveLayer);

    /**
     * @see js.awt.PopupLayer #showAt
     */
    thi$.setCallback = function(bounds, area, nofly){
        // Need to trigger doLayout() to re-layout the searchBox,
        // list and controlBar. However, we don't need to invoke
        // "_layout" function again.
        this._isLayoutDirty = true;
        this._local.matrix = undefined;
        this._local.runtimeBounds = bounds;
        this._local.runtimeArea = area;

        this.doLayout(true);

    }.$override(this.setCallback);

    /*
     * Ref the native html "select" and "option" element, for ComboBox, 
     * when it isn't multiple, the current selected item will be hovered
     * while the dropdownlist is showing. And then the hover effect will
     * be rinsed after hovering another item.
     */
    var _reStyleSelected = function(){ 
        var list = this.list;
        if(!list || def.multiEnable === true){
            return;
        }
        
        var sitems = list.getSelectedItems(),
        item = sitems ? sitems[0] : null;
        if(item && item.isHoverForSelected()){
            item.setHover(true);
        }
    };
    
    var _rinseSelected = function(){
        var list = this.list;
        if(!list || def.multiEnable === true){
            return;
        }
        
        var sitems = list.getSelectedItems(),
        item = sitems ? sitems[0] : null;
        if(item && item.isHoverForSelected()){
            item.setHover(false);
        }
    };

    /**
     * @see js.awt.PopupLayer #showAt
     */
    thi$.showAt = function(x, y, m){
        if(this == this.rootLayer()){
            this.hideOthers();
        }

        // ?? Whether clear here
        // this._local.runtimeBounds = undefined;
        // this._local.runtimeArea = undefined;

        // Force the DropdownList's nofly area
        // as horizontal breakthrough.
        $super(this, x, y, false, m);
        
        // Re-highlight the current selected item
        _reStyleSelected.call(this);

    }.$override(this.showAt);

    /**
     * @see js.awt.PopupLayer #showBy
     */
    thi$.showBy = function(by, m){
        if(this == this.rootLayer()){
            this.hideOthers();
        }

        // ?? Whether clear here
        // this._local.runtimeBounds = undefined;
        // this._local.runtimeArea = undefined;

        // Force the DropdownList's nofly area
        // as horizontal breakthrough.
        $super(this, by, false, m);

        // Re-highlight the current selected item
        _reStyleSelected.call(this);

    }.$override(this.showBy);

    thi$.setPeerComponent = function(peer){
        if(this.list){
            this.list.setPeerComponent(peer);
        }

        $super(this);

    }.$override(this.setPeerComponent);

    thi$.destroy = function(){
        this.detachEvent("mousedown", 0, this, _onMouseDown);
        this.detachEvent("click", 0, this, _onClick);
        this.detachEvent(J$VM.firefox ? "DOMMouseScroll" : "mousewheel",
                         0, this, _onMouseScroll);

        if(this.searchBox){
            this.searchBox.inputBox.detachEvent(js.swt.TextField.EVT_VALUECHANGED,
                                                4, this, _onKeywordChanged);
            this.searchBox.btnClear.detachEvent("click",
                                                0, this, _onBtnClearClicked);

            //this.searchBox.destroy();
            delete this.searchBox;
        }

        if(this.list){
            var clz = js.swt.List;
            this.list.detachEvent(clz.EVT_READY, 4, this, _onListReady);
            this.list.detachEvent(clz.EVT_ACK_ITEMSADDED,
                                  4, this, _onListItemsAdded);
            this.list.detachEvent(clz.EVT_ACK_ITEMSREMOVED,
                                  4, this, _onLisItemsRemoved);
            this.list.detachEvent(clz.EVT_ITEMSELECTED,
                                  4, this, _notifySelectChanged, "set");
            this.list.detachEvent(clz.EVT_ITEMCLICKED,
                                  4, this, _notifySelectChanged, "click");

            //this.list.destroy();
            delete this.list;
        }

        if(this.controlBar){
            var label = this.controlBar.label;
            label.detachEvent("mouseover", 0, this, _onMouseOver);
            label.detachEvent("mouseout", 0, this, _onMouseOut);
            label.detachEvent("click", false, this, _onSubmit);

            //this.controlBar.destroy();
            delete this.controlBar;
        }

        delete this._local.root;
        delete this._local.optimalSize;
        delete this._local.matrix;
        delete this._local.runtimeBounds;
        delete this._local.runtimeArea;

        $super(this);
    }.$override(this.destroy);

    /**
     * @see js.swt.List #quickSearch
     */
    thi$.quickSearch = function(keyword, options){
        this.list.quickSearch(keyword, options);
    };

    /**
     * @see js.swt.List #restore
     */
    thi$.restore = function(){
        if(!this.searchEnable){
            return;
        };

        var inputBox = this.searchBox.inputBox;
        if(inputBox){
            inputBox.setValue("");
        }

        this.list.restore();
    };

    var _search = function(e){
        _search.$clearTimer();
        
        var keyword = this.searchBox.inputBox.getValue();
        this.quickSearch(keyword);
    };

    var _onKeywordChanged = function(e){
        if(!this.searchEnable){
            return;
        }

        // Search once while input quickly and consecutively
        _search.$clearTimer();
        _search.$delay(this, 200);
    };

    var _onBtnClearClicked = function(e){
        this.searchBox.inputBox.setValue("");
        this.restore();
    };

    var _createSearchBox = function(def){
        var r = this.Runtime(), searchBox,
        theDef = {
            className: DOM.combineClassName(def.className, "searchBox")
        };

        theDef = System.objectCopy(searchBoxDef, theDef, true);
        searchBox = this.searchBox =
            new (Class.forName("js.awt.HBox"))(theDef, r);

        searchBox.inputBox.attachEvent(js.swt.TextField.EVT_VALUECHANGED,
                                       4, this, _onKeywordChanged);
        searchBox.btnClear.attachEvent("click", 0, this, _onBtnClearClicked);

        theDef = null;
        this.addComponent(searchBox);
    };

    var _notifySelectChanged = function(e, eType){
        var data = {
            models: this.getSelectedModels(true),
            callbackInfo: e.getData()
        };
        this.notifyPeer(
            "js.swt.event.SelectChangedEvent",
            new Event(eType, data, e.getEventTarget())
        );
    };

    var _onListReady = function(e){
        this.fireEvent(e);
    };

    thi$.invalidateLayout = function(doLayout){
        if(!this._isLayoutDirty){
            var M = this.def, bounds = this.view.bounds,
            userW = bounds ? bounds.userW : undefined,
            userH = bounds ? bounds.userH : undefined,
            listView = this.list.view;
            
            if(!isNaN(userW) || !isNaN(userH)){
                DOM.setSize(this.view, userW, userH, bounds);
            }
            
            // listView.style.width = "100%";
            listView.style.width = "auto";
            listView.style.height = "auto";

            delete M.width;
            delete M.height;

            this.invalidateBounds();
        }

        this._isLayoutDirty = true;
        this._local.matrix = undefined;
        this._local.optimalSize = undefined;
        this._local.runtimeBounds = undefined;
        this._local.runtimeArea = undefined;

        if(doLayout === true){
            this.doLayout(true);
        }
    };

    var _onListItemsAdded = function(e){
        this.invalidateLayout(true);
        this.fireEvent(e);
    };

    var _onLisItemsRemoved = function(e){
        this.invalidateLayout(true);
        this.fireEvent(e);
    };

    var _createList = function(def){
        var listDef = {
            className: DOM.combineClassName(def.className, "list"),
            itemClassName: def.itemClassName 
                || DOM.combineClassName(def.className, "item"),

            searchOptions: def.searchOptions,

            hoverForSelected: Class.isBoolean(def.hoverForSelected) 
                ? def.hoverForSelected : def.multiEnable !== true,

            multiEnable: (def.multiEnable === true),
            multiByCheck: (def.multiEnable === true),
            distinct: (def.distinct === true),
            lazy: def.lazy,

            hauto: false,
            vauto: false,

            itemModels: def.itemModels,
            itemDefs: def.itemDefs,
            controller: def.controller,

            align_x: 0.5,
            align_y: 0.0,
            rigid_w: false,
            rigid_h: false
        };
        
        var clz = Class.forName("js.swt.List"),
        list = this.list = new (clz)(listDef, this.Runtime());

        // In DropdownList, list'repaint is not naught. We should depend on
        // Container(current DropdownList)'s layoutComponent method to set
        // list's size and trigger its onResized to adjust its contents' size.
        list.repaint = function(){
            // Do nothing
        }.$override(list.repaint);
        
        /*
         * Ref the native html "select" and "option" element, for ComboBox, 
         * when it isn't multiple, the current selected item will be hovered
         * while the dropdownlist is showing. And then the hover effect will
         * be rinsed after hovering another item.
         */
        list.onHovering = _rinseSelected.$bind(this);

        list.attachEvent(clz.EVT_READY, 4, this, _onListReady);
        list.attachEvent(clz.EVT_ACK_ITEMSADDED, 4, this, _onListItemsAdded);
        list.attachEvent(clz.EVT_ACK_ITEMSREMOVED, 4, this, _onLisItemsRemoved);
        list.attachEvent(clz.EVT_ITEMSELECTED, 4, this, _notifySelectChanged, "set");
        list.attachEvent(clz.EVT_ITEMCLICKED, 4, this, _notifySelectChanged, "click");

        this.addComponent(list);
    };

    var _onMouseOver = function(e){
        this.controlBar.label.setHover(true);
    };

    var _onMouseOut = function(e){
        this.controlBar.label.setHover(false);
    };

    var _onSubmit = function(e){
        this.controlBar.label.setHover(false);
        this.fireEvent(
            new Event(CLASS.EVT_SUBMITVALUES, undefined, this));
    };

    var _createControlBar = function(def){
        var r = this.Runtime(), controlBar, label,
        theDef = {className: DOM.combineClassName(def.className, "controlBar")};

        theDef = System.objectCopy(controlBarDef, theDef, true);
        theDef.label.text = r.nlsText("btnOK", "OK");
        controlBar = this.controlBar =
            new (Class.forName("js.awt.HBox"))(theDef, r);

        label = controlBar.label;
        label.attachEvent("mouseover", 0, this, _onMouseOver);
        label.attachEvent("mouseout", 0, this, _onMouseOut);
        label.attachEvent("click", false, this, _onSubmit);

        theDef = null;
        this.addComponent(controlBar);
    };

    var _onMouseDown = function(e) {
        e.cancelBubble();
    };

    var _onClick = function(e){
        if(this.isfloating){
            e.cancelBubble();
        }
    };

    var _onMouseScroll = function(e) {
        if(this.isfloating){
            e.cancelBubble();
        }
    };

    thi$._init = function(def, Runtime){
        if(typeof def !== "object") return;

        def = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
        def.className = def.className || "jsvm_dropdownList";
        $super(this);

        this._isLayoutDirty = true;
        this._local.root = this;

        this.hauto = (def.hauto === true);
        this.vauto = (def.vauto === true);

        this.searchIfAllowed = (def.searchIfAllowed === true);
        this.isfloating = (def.isfloating === true);

        this.setSearchCritical(def.searchCritical);

        if(this.searchIfAllowed){
            _createSearchBox.call(this, def);
        }

        _createList.call(this, def);

        if(def.multiEnable === true
           && def.showControlBar === true){
            _createControlBar.call(this, def);
        }

        _setSearchEnable.call(this, false);

        this.attachEvent("mousedown", 0, this, _onMouseDown);
        this.attachEvent("click", 0, this, _onClick);
        this.attachEvent(J$VM.firefox ? "DOMMouseScroll" : "mousewheel",
                         0, this, _onMouseScroll);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.VBox);

js.swt.DropdownList.SEARCHCRITICAL = 80;
js.swt.DropdownList.DEFAULTSEARCHBOXWIDTH = 30;
js.swt.DropdownList.DEFAULTSEARCHBOXHEIGHT = 17;
js.swt.DropdownList.DEFAULTCONTROLBARHEIGHT = 16;
js.swt.DropdownList.SCROLLBARTHINKNESS = 17;
js.swt.DropdownList.DEFAULTITEMHEIGHT = 16;

js.swt.DropdownList.EVT_SUBMITVALUES = "SubmitValues";

js.swt.DropdownList.DEFAULTDEF = function(){
    return {
        classType: "js.swt.DropdownList",

        distinct: false,
        multiEnable: false,
        showControlBar: false,
        showItemTip: true,

        hauto: true,
        vauto: true,

        isfloating: true,
        PMFlag: 0x27,

        searchIfAllowed: false,
        searchCritical: 80,

        lazy: false,

        itemModels: [],
        itemDefs: [],

        layout: {
            gap: 5
        }
    };
};
