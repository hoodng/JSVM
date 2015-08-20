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
 * File: ComboBox.js
 * Create: 2012/05/08 02:55:06
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

$import("js.swt.HItem");

/**
 * @param def: {
 *     className: {String} required,
 *     css: {String} optional
 *     id: {String} optional,
 *     container: {js.awt.Component} required,
 * 
 *     effect: {Boolean} Default is <em>false</em>. Indicate whether the ComboBox has effect
 *             when hover.
 *     wholeTrigger: {Boolean} Default is <em>false</em>. Indicate whether the DropDownList 
 *             should be popuped only while the whole ComboBox is clicked.
 *     showBtnByHover: {Boolean} Default is <em>false</em>. Indicate whether the DropDown 
 *             button can be shown only when mouse is hovering on.
 *     
 *     editable: {Boolean} Default is <em>false</em>, required,
 *     multiEnable: {Boolean} Default is <em>false</em>, required,
 *     distinct: {Boolean} Default is false, required. Indicate whether item of List is distinct. 
 *     searchIfAllowed: {Boolean} Default is false, required. Indicate whether the Combobox can 
 *         support quick search if it is enable. 
 
 *     showTips: {Boolean} Default is false, required. Indicate whether combobox should show 
 *         tooltips with the specified displayTip or the current selected item. 
 *         If <em>displayTip</em> is specifed, use it. Otherwise display value or real value of 
 *         the current selected item.
 *     displayTip: {String} A string specified the tip of combobox. 
 *     showItemTip: {Boolean} Default is false, required. Indicate whether each item of combobox's
 *          DropdownList show its display value (use real value if no display value) as tip.
 
 *     searchCritical: {Number} An optional value between 1 and 100 which expresses a percent. 
 *          When (the viewable height / total contents height) <= this percent, the DropdownList 
 *          can be enable to do quick search.
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

js.swt.ComboBox = function(def, Runtime){
    var CLASS = js.swt.ComboBox, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, 
    LList = js.util.LinkedList, DOM = J$VM.DOM, 
    System = J$VM.System, MQ = J$VM.MQ,
    
    List = Class.forName("js.swt.List"),
    DDList = Class.forName("js.swt.DropdownList");
    
    var dItemContainerDef = {
        classType: "js.awt.HBox",

        rigid_w: false, rigid_h: false,
        layout: {
            gap: 0,
            align_x: 0.5, align_y: 0.5
        }
    },
    btnDropDownDef = {
        classType: "js.awt.Button",
        iconImage: "dropdown_new.png",

        rigid_w: true, rigid_h: false,
        effect: false
    },
    inputBoxDef = {
        classType: "js.swt.TextField",
        css: "border:0px none;",
        rigid_w: false, rigid_h: false,
        NUCG: true
    },
    sps = [
        "position", "top", "left",
        "font-family", "font-size", "font-style", "font-weight",
        "text-decoration", "text-align", "font-weight",
        "color", "background-color",
        "padding-top", "padding-right", "padding-bottom", "padding-left",
        "border-top-width", "border-right-width", 
        "border-bottom-width", "border-left-width",
        "border-top-style", "border-right-style",
        "border-bottom-style", "border-left-style",
        "border-top-color", "border-right-color",
        "border-bottom-style", "border-left-color"
    ],
    iptSps = [
        "font-family", "font-size", "font-style", "font-weight",
        "text-decoration", "text-align", "font-weight", "color", 
        "background-color"
    ];
    
    thi$.hasEffect = function(){
        return this.def.effect === true;
    };
    
    thi$.isWholeTrigger = function(){
        return this.def.wholeTrigger === true;
    };
    
    thi$.isShowBtnByHover = function(){
        return this.def.showBtnByHover === true;
    };
    
    thi$.setSubviewRoot = function(root){
        if(this.subview && root){
            this.subview.rootLayer(root);
        }else{
            this._local.subviewRoot = root;
        }
    };
    
    /**
     * @see js.swt.DropdownList #setItemsByModel
     */
    thi$.setItemsByModel = function(models){
        this._local.itemDefs = undefined;
        this._local.itemModels = models;

        _preSelect.call(this);
        
        if(this.subview){
            _showSubview.call(this, false);
            this.subview.setItemsByModel(models);
        }
    };

    /**
     * @see js.swt.DropdownList #addItemsByModel
     */
    thi$.addItemsByModel = function(models){
        if(!Class.isArray(models) || models.length == 0){
            return;
        }
        
        var ms = this._local.itemModels || [];
        this._local.itemModels = ms.concat(models);
        
        _preSelect.call(this);
        
        if(this.subview){
            _showSubview.call(this, false);
            this.subview.addItemsByModel(models);
        }
    };
    
    /**
     * @see js.swt.DropdownList #setItemsByDef
     */
    thi$.setItemsByDef = function(defs){
        this._local.itemModels = undefined;
        this._local.itemDefs = defs;
        
        _preSelect.call(this);
        
        if(this.subview){
            _showSubview.call(this, false);
            this.subview.setItemsByDef(defs);
        }
    };
    
    /**
     * @see js.swt.DropdownList #addItemsByDef
     */
    thi$.addItemsByDef = function(defs){
        if(!Class.isArray(defs) || defs.length == 0){
            return;
        }
        
        var ds = this._local.itemModels || [];
        this._local.itemDefs = ds.concat(defs);
        
        _preSelect.call(this);
        
        if(this.subview){
            _showSubview.call(this, false);
            this.subview.addItemsByDef(defs);
        }
    };
    
    /**
     * @return {Array} Items of ComboBox DropdownList.
     * @see js.swt.DropdownList #getItems
     */
    thi$.getItems = function(){
        return this.subview 
            ? this.subview.getItems() : undefined;
    };
    
    /**
     * @return {Array} Models of ComboBox DropdownList's items.
     * @see js.swt.DropdownList #getItemModels
     */
    thi$.getItemModels = function(){
        var ms = this._local.itemModels;
        if(!ms && this.subview){
            ms = this.subview.getItemModels();
        };
        
        return ms;
    };
    
    /**
     * @return {Array} Definitions of ComboBox DropdownList's items.
     * @see js.swt.DropdownList #getItemDefs
     */
    thi$.getItemDefs = function(){
        var ds = this._local.itemDefs;
        if(!ds && this.subview){
            ds = this.subview.getItemDefs();
        }
        
        return ds;
    };
    
    /**
     * Return current selected values, some of them may be not belonged to
     * any items.
     */
    thi$.getSelectedValues = function(){
        return this._local.selectedValues;     
    };
    
    var _getSelectedIndexes = function(){
        var ds = this._local.itemDefs, 
        ms = this._local.itemModels, 
        useDs = false, set;
        
        if(Class.isArray(ds) && ds.length > 0){
            useDs = true;
            set = ds;
        }else if(Class.isArray(ms) && ms.length > 0){
            useDs = false;
            set = ms;
        }

        var len = set ? set.length : 0, 
        indexes = LList.$decorate([]), 
        m;
        for(var i = 0; i < len; i++){
            m = set[i];
            m = useDs ? m.model : m;
            if(m && m.marked === true 
               && !List.isIn(i, indexes)){
                indexes.addLast(i);
            }
        } 

        return indexes;
    };
    
    /**
     * Return all selected items' index.
     */
    thi$.getSelectedIndexes = function(){
        return this.subview 
            ? this.subview.getSelectedIndexes() 
            : _getSelectedIndexes.call(this);
    };
    
    /**
     * Return crrent selection's model.
     */
    thi$.getSelectedModel = function(){
        return this.displayItem.model;
    };
    
    var _unMarkAll = function(){
        var ds = this._local.itemDefs, 
        ms = this._local.itemModels, 
        useDs = false, set;
        
        if(Class.isArray(ds) && ds.length > 0){
            useDs = true;
            set = ds;
        }else if(Class.isArray(ms) && ms.length > 0){
            useDs = false;
            set = ms;
        }
        
        var len = set ? set.length : 0, m;
        for(var i = 0; i < len; i++){
            m = useDs ? set[i].model : set[i];
            if(m){
                m.marked = false;
            }
        }
    };
    
    /**
     * Query and return all the condition-met models of items
     * by the given condition.
     * 
     * @param by: {String} The reference property of model.
     * @param values: {Array} The reference values of the 
     *        reference property in model.
     * @param findAll: {Boolean} Indicate whether all satisfied
     *        models.
     * @param distinct: {Boolean} Indicate whether each item is
     *        distinct in the result set.
     */
    thi$.findItemModels = function(by, values, findAll, distinct){
        if(!Class.isString(by) || by.length == 0 
           || !Class.isArray(values) || values.length == 0){
            return undefined;
        }
        
        var ds = this._local.itemDefs, 
        ms = this._local.itemModels, 
        useDs = false, set;
        
        if(Class.isArray(ds) && ds.length > 0){
            useDs = true;
            set = ds;
        }else if(Class.isArray(ms) && ms.length > 0){
            useDs = false;
            set = ms;
        }else{
            return undefined;
        }
        
        var len = set ? set.length : 0, rst = [], m, v;
        for(var i = 0; i < len; i++){
            m = useDs ? set[i].model : set[i];
            v = m[by];
            
            if(List.isIn(v, values)){
                if(findAll !== true){
                    rst.push(m);
                    break;
                }
                
                if(!distinct || !List.isModelIn(m, rst)){
                    rst.push(m);
                }                
            }
        }
        
        return rst;
    };
    
    /**
     * Select all items indicated by given values.
     * Attention:
     *     If an end user didn't do any selection from the DropdownList, the given values
     *     will be kept even though some of the given values wasn't belonged any item of
     *     the DropdownList.
     * 
     * @param values: {Array} An <em>Array</em> for values. An item whose value equals with one
     *                of values will be selected.
     * @param callback: {Boolean} Indicate whethe need to nofiy the value changed.
     */
    thi$.setSelectedValues = function(values, callback){
        // If combobox is in edit, quit the editing status.
        // Add by mingfa.pan, 04/11/2013
        _quitEdit.call(this);
        
        if(!values || values.length == 0){
            this.unselectAll(callback);
            return;
        }
        
        if(this.subview){
            var cInfo = {values: values, notify: callback};
            this.subview.setSelectedValues(values, true, cInfo);
        }else{
            // Mark all models' state as un-marked
            _unMarkAll.call(this);
            
            var models, model;
            if(!this.multiEnable){
                var v = values[0];
                values = [v];
                
                models = this.findItemModels("value", values, false);
                model = (models && models.length > 0) ? models[0] : undefined;          

                if (!Class.isObject(model)) {
                    model = {dname: v, value: v};
                }else{
                    model.marked = true;
                }
            }else{
                models = this.findItemModels("value", values, true, false);
                
                var len = models ? models.length : 0,
                dnames = LList.$decorate([]), m, dn;
                for(var i = 0; i < len; i++){
                    m = models[i];
                    m.marked = true;
                    
                    dn = m.dname;
                    if(dn !== undefined && dn !== null 
                       && !dnames.contains(dn)){
                        dnames.addLast(dn);
                    }
                }
                
                if(dnames.length > 0){
                    var dname = _joinTexts.call(this, dnames);
                    model = {dname: dname, value: values};
                }else{
                    model = CLASS.DEFAULTMODEL;
                }
            }
            
            // Display current selection in display item
            if(Class.isObject(model)){
                _select.call(this, model);
            }
            
            /* Attention: 
             * Some of values may be not belonged to any item. So there are two steps as follow
             * to finish selecting:
             * 1) Recorde all current selected value include the one which is not belonged to any
             *    item of DropdownList.
             * 2) Select all items. Each of them is indicated by values.
             */
            _setSelectedValues.call(this, values);
            
            if(callback === true){
                this.onSelectedChanged();
            }
        }
        
    };
    
    /**
     * Return items' models by the given indexes.
     */
    thi$.findItemModelsByIndex = function(indexes, distinct){
        if(!Class.isArray(indexes) || indexes.length == 0){
            return undefined;
        }
        var ds = this._local.itemDefs, 
        ms = this._local.itemModels, 
        useDs = false;
        
        if(Class.isArray(ds) && ds.length > 0){
            useDs = true;
        }else if(Class.isArray(ms) && ms.length > 0){
            useDs = false;
        }else{
            return undefined;            
        }
        
        // Sort indexes by numerically and ascending
        indexes = indexes.sort(function(a,b){return a-b;});
        
        var len = indexes.length, idx, m, rst = [];
        for(var i = 0; i < len; i++){
            idx = indexes[i];
            m = useDs ? ds[idx].model : ms[idx];
            
            if(m && (!distinct 
                     || !List.isModelIn(m, rst))){
                rst.push(m);
            }
        }
        
        return rst;
    };
    
    /**
     * Select all items indicated by given indexes.
     * 
     * @param indexes: {Array} An <em>Array</em> for indexes, each element indicate an 
     *                 item which need be selected.
     *   
     * @see js.swt.DropdownList #setSelectedIndexed
     */    
    thi$.setSelectedIndexes = function(indexes, callback){
        // If combobox is in edit, quit the editing status.
        // Add by mingfa.pan, 04/11/2013
        _quitEdit.call(this);
        
        if(!indexes || indexes.length == 0){
            this.unselectAll(callback);
            return;
        }
        
        if(this.subview){
            var cInfo = {indexes: indexes, notify: callback};
            this.subview.setSelectedIndexes(indexes, true, cInfo);
        }else{
            // Mark all models' state as un-marked
            _unMarkAll.call(this);
            
            var ms, m, dnames, values, dname;
            if(!this.multiEnable){
                indexes = [indexes[0]];
                
                ms = this.findItemModelsByIndex(indexes);
                m = (ms && ms.length) ? ms[0] : undefined;

                if(m){
                    m.marked = true;
                    values = [m.value];
                }else{
                    m = CLASS.DEFAULTMODEL;
                }
            }else{
                dnames = LList.$decorate([]);
                values = LList.$decorate([]);
                ms = this.findItemModelsByIndex(indexes);
                
                var len = ms ? ms.length : 0, i, d, v;
                for(i = 0; i < len; i++){
                    m = ms[i];
                    m.marked = true;
                    
                    d = m.dname;
                    v = m.value;
                    if(d !== undefined && d !== null 
                       && !dnames.contains(d)){
                        dnames.addLast(d);
                    }
                    
                    if(!values.contains(v)){
                        values.push(v);
                    }
                }
                
                if(dnames.length > 0){
                    dname = _joinTexts.call(this, dnames);
                    m = {dname: dname, value: values};
                }else{
                    m = CLASS.DEFAULTMODEL;
                }
            }
            
            // Display current selection in display item
            _select.call(this, m);
            _setSelectedValues.call(this, values);
            
            if(callback === true){
                this.onSelectedChanged();
            }
        }
    };
    
    var _isSelectedChanged = function(model){
        var latestModel = this._local.latestModel;
        if(!(latestModel && model)){
            return true;
        }
        
        if(latestModel === model){
            return false;
        }
        
        // Date type is different, or value is different
        if(((typeof latestModel.value) != (typeof model.value)) 
            || (model.value != latestModel.value)){
            return true;
        }
        
        // Maybe only need to compare the "value"
        if(model.dname != latestModel.dname){
            return true;
        }
        
        if(model.img != latestModel.img){
            return true;
        }
        
        return false;
    };
    
    var _filterItemsByModel = function(model){
        var ds = this._local.itemDefs, 
        ms = this._local.itemModels,
        set, useDef = false;
        
        if(Class.isArray(ds) && ds.length > 0){
            set = ds;
            useDef = true;
        }else if(Class.isArray(ms) && ms.length > 0){
            set = ms;
            useDef = false;
        }else{
            return undefined;
        }
        
        var indexes = [], len = set.length, m;
        for(var i = 0; i < len; i++){
            m = useDef ? set[i].model : set[i];
            if(List.isSameModel(m, model)){
                if(!this.multiEnable && indexes.length == 0){
                    m.marked = true;
                    indexes.push(i);
                }else if(this.multiEnable){
                    m.marked = true;
                    if (!List.isIn(i, indexes)){
                        indexes.push(i);
                    }
                }else{
                    m.marked = false;
                }
            }else{
                m.marked = false;
            }
        }
        
        return indexes;
    };
    
    /**
     * Un-select all given items.
     * 
     * @see <em>js.swt.DropdownList #unselectAll</em>
     */
    thi$.unselectAll = function(callback){
        if(this.subview){
            var cInfo = {notify: callback};
            this.subview.unselectAll(true, cInfo);
        }else{
            // Mark all models' state as un-marked
            _unMarkAll.call(this);
            
            _select.call(this, {dname: "", value: []});
            _setSelectedValues.call(this, []);
            
            if(callback === true){
                this.onSelectedChanged();
            }
        }
    };
    
    /**
     * @param model: {dname: xxx, value: xxx} or {img: xxx, value: xxx}
     */
    thi$.setSelectedByModel = function(model, callback){
        if(!model || (typeof model !== "object"))
            return;

        // If combobox is in edit, quit the editing status.
        // Add by mingfa.pan, 04/11/2013
        _quitEdit.call(this);

        // For bug #113854 (http://redmine.jinfonet.com.cn/issues/113854)
        // The initial selected model may be generated from the itemDefs 
        // or itemModels of current definition. At this time, the current
        // ComboBox instance haven't been instantiated complete, and some
        // override operations, such as rectifyModel, haven't been executed.
        // So that the display value may not be right during the initialization
        // phase. Aut the current method must be invoked again to make the
        // logic complete.
        // var changed = _isSelectedChanged.call(this, model);
        // if(!changed){
        //  return;
        // }

        var indexes = _filterItemsByModel.call(this, model) || [];
        if(indexes.length == 0){
            // this.unselectAll(false);

            if(this.subview){
                this.subview.unselectAll(false);
            }else{
                // Mark all models' state as un-marked
                _unMarkAll.call(this);
            }
        }else{
            if(this.subview){
                this.subview.setSelectedIndexes(indexes, false); 
            }
        }
        
        _select.call(this, model);
        _setSelectedValues.call(this, [model.value]);
        
        if (callback === true){
            this.onSelectedChanged();
        }
    };

    thi$.msgType = function(msgType){
        var U = this._local;
        if(Class.isString(msgType) && msgType.length > 0){
            U.msgType = msgType;
        }  

        return U.msgType || "js.swt.event.SelectedChanged";
    };

    /**
     * @deprecated
     */ 
    thi$.setMsgType = function(msgType){
        this.msgType(msgType);
    };

    /**
     * @deprecated
     */ 
    thi$.getMsgType = function(){
        return this.msgType();
    };
    
    thi$.onSelectedChanged = function(target, eType){
        var msgType = this.msgType(),
        values = this.getSelectedValues(),
        eData = {comboID: this.id, values: values},
        evt = new Event(eType || "Selected", eData, target || this);
        this.notifyPeer(msgType, evt);
    };
    
    /**
     * @see js.swt.DropdownList #setSearchCritical
     */
    thi$.setSearchCritical = function(num){
        if(Class.isNumber(num)){
            this._local.searchCritical = num;
            
            var subview = this.subview;
            if(subview){
                subview.setSearchCritical(num);
            }
        }
    };
    
    thi$.isSearchEnable = function(){
        return this.subview 
            ? this.subview.searchEnable : false;  
    };
    
    thi$.setEditable = function(b){
        b = (b === true);
        if(this.editable === b){
            return;
        }

        this.editable = this.def.editable = b;

        var ditem = this.displayItem;
        if(ditem){
            if(b) {
                ditem.attachEvent("click", 0, this, _onEdit);
            }else{
                ditem.detachEvent("click", 0, this, _onEdit);
            }
        }
    };

    thi$.onMoved = function(){
        arguments.callee.__super__.apply(this, arguments);
        
        var subview = this.subview;
        if(subview){
            subview.invalidateLayout(false);
        }
    }.$override(this.onMoved);
    
    thi$.onResized = function(fire){
        arguments.callee.__super__.apply(this, arguments);
        
        var subview = this.subview;
        if(subview){
            subview.invalidateLayout(false);
        }
    }.$override(this.onResized);
    
    var _onController = function(e){
        this.notifyPeer("js.swt.event.ControllerEvent", e);
    };
    
    thi$.onStateChanged = function(e){
        arguments.callee.__super__.apply(this, arguments);
        
        this.btnDropDown.setState(this.getState());

    }.$override(this.onStateChanged);
    
    thi$.destroy = function(){
        this._local.itemDefs = null;
        this._local.itemModels = null;
        this._local.selectedValues = null;
        
        if(this.displayItem){
            //this.displayItem.destroy();
            delete this.displayItem;
        }
        
        var M = this.def, subview = this.subview;
        if(this._eventAttached){
            if(M.wholeTrigger === true){
                this.detachEvent("click", 0, this, _onDropDown);    
            }else{
                Event.detachEvent(this.btnDropDown.view, "click", 0, 
                                  this, _onDropDown);
            }
            
            if(M.effect === true || M.showBtnByHover === true){
                this.detachEvent("mouseover", 0, this, _onMouseOver);
                this.detachEvent("mouseout", 0, this, _onMouseOut);
            }
            
            MQ.cancel("js.swt.event.SelectChangedEvent", 
                      this, this.selectedChanged);
            MQ.cancel("js.swt.event.ControllerEvent",
                      this, _onController);
            MQ.cancel("js.awt.event.LayerEvent", 
                      this, _onLayerRemoved);
        }
        
        if(subview){
            _showSubview.call(this, false);
            subview.setPMFlag(0);
            
            subview.detachEvent(List.EVT_READY, 4, this, _onListEvent);
            subview.detachEvent(List.EVT_ACK_ITEMSADDED, 4, this, _onListEvent);
            subview.detachEvent(List.EVT_ACK_ITEMSREMOVED, 4, this, _onListEvent);
            subview.detachEvent(DDList.EVT_SUBMITVALUES, 4, this, _onListSubmit);
            
            delete this.subview;
            subview.destroy();
        }
        
        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);

    /**
     * The display item is created and removed dynamically. When its styles was controlled,
     * we need to cache those styles and aplly them when the display item is created again.
     * 
     * @styles: {Object}
     */
    thi$.setDisplayItemStyles = function(styles){
        if(typeof styles !== "object"){
            return;
        }
        
        this._latestStyles = styles;
        if(this.displayItem){
            this.displayItem.applyStyles(styles);
        }
    };
    
    thi$.setErrSign = function(b, errStyles){
        var ditem = this.displayItem, dview, U = this._local, 
        oStyles = this._latestStyles, sp, styles, isCached;
        
        if(ditem){
            dview = ditem.view;
        }else{
            dview = this.dItemContainer.view;
        }
        
        if(b){
            U.errStyles = null;
            
            if(typeof errStyles === "object"){
                styles = U.errStyles = {};
                
                if(!oStyles){
                    oStyles = this._latestStyles = {};
                }
                
                for(sp in errStyles){
                    isCached = false;    
                    
                    if(oStyles.hasOwnProperty(sp)){
                        isCached = true;
                        
                        styles[sp] = oStyles[sp];
                        oStyles[sp] = errStyles[sp];
                    }else{
                        sp = DOM.camelName(sp);
                        if(oStyles.hasOwnProperty(sp)){
                            isCached = true;
                            
                            styles[sp] = oStyles[sp];
                            oStyles[sp] = errStyles[sp];
                        }
                    }
                    
                    if(!isCached){
                        styles[sp] = DOM.getStyle(dview, sp);
                        oStyles[sp] = errStyles[sp];
                    }
                }
                
                this.setDisplayItemStyles(oStyles);
            }
        }else{
            styles = U.errStyles;
            delete U.errStyles;

            if(typeof styles === "object"){
                if(!oStyles){
                    oStyles = this._latestStyles = {};
                }
                
                for(sp in styles){
                    if(oStyles.hasOwnProperty(sp)){
                        oStyles[sp] = styles[sp];
                    }else{
                        sp = DOM.camelName(sp);
                        oStyles[sp] = styles[sp];
                    }
                }
                
                this.setDisplayItemStyles(oStyles);
            }
        }
    };
    
    thi$.doEdit = function(){
        var dContainer = this.dItemContainer, iptView = this._inputView, 
        curV = iptView.getValue(), changed = true, models, model, values,
        findInList = false;
        
        // For the blur event of an input can be caused while remove it from
        // the parent node, when we invoke the removeComponent below, TextField
        // can catch the blur event and then fire the "SubmitValue" event to 
        // trigger the "doEdit" handler to remove the _inputView again, so detach
        // event first.
        iptView.detachEvent(js.swt.TextField.EVT_SUBMIT, 4, this, this.doEdit);
        delete this._inputView;
        
        dContainer.removeComponent(iptView);
        iptView.destroy();
        
        if(Class.isString(this._latestValue) 
           && this._latestValue === curV){
            changed = false;
        }
        
        if(!changed){
            _select.call(this, this._local.latestModel);
            return;
        }
        
        if(!this.multiEnable){
            /*
             * We think the input value will be as display value of item. so if there is some
             * item with the same display value existed in the DropDownList, we will use it.
             */
            models = this.findItemModels("dname", [curV]);
            model = (models && models.length > 0) ? models[0] : undefined;
            
            if(!model){
                model = {dname: curV, value: curV};
            }else{
                findInList = true;
            }
            
            values = [model.value];
        }else{
            values = _splitText.call(this, curV);
            model = {dname: curV, value: values};
        }
        
        /*
         * Before using the input value, if there are some special bussiness logic,
         * we need to implement the rectifyInput() method to handle the input value.
         * 
         * Add on 03/18/2014, for bug #102193:
         * If find a item with the input text as dname, use it directly.
         */
        if(!findInList && (typeof this.rectifyInput == "function")){
            model = this.rectifyInput(model);
            
            if(!this.multiEnable){
                values = [model.value]; 
            }
        }
        
        // Display current selection in display item
        _select.call(this, model);
        
        /* Attention: 
         * Some of values may be not belonged to any item. So there are two steps as follow
         * to finish selecting:
         * 1) Recorde all current selected value include the one which is not belonged to any
         *    item of DropdownList.
         * 2) Select all items. Each of them is indicated by values.
         */
        _setSelectedValues.call(this, values);
        
        var subview = this.subview;
        if(subview){
            subview.setSelectedValues(values, false);
        }
        
        // Notify the selected changed
        this.onSelectedChanged();       
    };
    
    var _preIptStyles = function(sps){
        var latestStyles = this._latestStyles, styles = {}, 
        len, sp, v;
        if(!latestStyles){
            return styles;
        }

        sps = sps || iptSps;
        len = Class.isArray(sps) ? sps.length : 0;
        
        for(var i = 0; i < len; i++){
            sp = sps[i];
            v = latestStyles[sp];
            
            if(v != undefined && v != null){
                styles[sp] = v;
            }
        }
        
        return styles;
    };
    
    thi$.getEditContents = function(m){
        return Class.isObject(m) ? m.dname || "" : "";
    };
    
    var _onEdit = function(e){
        e.cancelBubble();
        
        // Hide the DropDown button if need
        if(this.isShowBtnByHover()){
            this.showBtnDropDown(false);
        }
        
        // Hide the DropdownList
        _showSubview.call(this, false);
        
        var dContainer = this.dItemContainer, 
        Clz = Class.forName("js.swt.TextField"),
        iptStyles, iptDef, input, m, v;
        
        m = this._local.latestModel = this.displayItem.model;

        // Record the styles and remove the displayItem
        _removeDisplayItem.call(this);
        
        // Create input box'
        iptStyles = _preIptStyles.call(this);
        iptStyles = DOM.toCssText(iptStyles);
        
        iptDef = {
            width: this._latestWidth,
            height: this._latestHeight
        };
        
        iptDef = System.objectCopy(inputBoxDef, iptDef, true); 
        iptDef.css = (iptDef.css || "") + iptStyles;
        iptDef.fontCss = iptStyles;
        
        input = this._inputView = 
            new (Clz)(iptDef, this.Runtime());

        v = this._latestValue = this.getEditContents(m);
        input.setValue(v);
        
        dContainer.addComponent(input);
        dContainer.doLayout(true);
        
        input.attachEvent(Clz.EVT_SUBMIT, 4, this, this.doEdit);
        input.focus(true);
    };
    
    var _removeDisplayItem = function(){
        var dContainer = this.dItemContainer, 
        ditem = this.displayItem;
        
        if(ditem){
            if(!this._latestStyles){
                this._latestStyles = ditem.getStyles(sps);
            }
            
            this._latestWidth = ditem.getWidth();
            this._latestHeight = ditem.getHeight();
            
            if(this.editable) {
                ditem.detachEvent("click", 0, this, _onEdit);
            }
            
            dContainer.removeComponent(ditem);
            ditem.destroy();
        }
        
        delete this.displayItem;
    };

    thi$.getDItemDef = function(m){
        var M = this.def, dItemDef = M.dItemDef,
        b = (M.showTips !== false),

        tdef = {
            classType: "js.swt.HItem",
            className: DOM.combineClassName(M.className, "dItem"),
            stateless: true,

            showTips: b,
            useInput: this.useInput,
            
            rigid_w: false, rigid_h: false,
            
            layout: {align_x: 0.0, align_y: 0.5}
        };

        if(Class.isObject(dItemDef)){
            tdef = System.objectCopy(dItemDef, tdef, true);
        }

        tdef.model = m;
        return tdef;
    };

    var _createDisplayItem = function(model){
        var R = this.Runtime(), M = this.def, 
        dItemDef = this.getDItemDef(model),
        displayItem, b, tip;
        
        dItemDef.css = DOM.toCssText(this._latestStyles),
        displayItem = this.displayItem =
            new (Class.forName(dItemDef.classType))(dItemDef, R),
        
        b = (M.showTips !== false);
        tip = M.displayTip;
        if (b && (typeof tip === "string")){
            displayItem.setToolTipText(tip);
        }

        if(this.editable){
            //displayItem.attachEvent("dblclick", 0, this, _onEdit);
            displayItem.attachEvent("click", 0, this, _onEdit);
        }
        
        this.dItemContainer.addComponent(displayItem);
        
        if(displayItem.isDOMElement() 
           && ((!isNaN(this._latestWidth) && this._latestWidth > 0) 
               || (!isNaN(this._latestHeight) && this._latestHeight > 0))){
            displayItem.setSize(this._latestWidth, this._latestHeight, 3);
        }
    };
    
    thi$.rectifyModel = function(m){
        // Implement if need.
        return m;  
    };
    
    /**
     * The <em>displayItem</em> will be removed first and then added again 
     * when call this method. If not, there are something wrong when do edit.
     * 
     * @param model: {dname: xxx, value: xxx} or {img: xxx, value: xxx}
     */
    var _setSelected = function(model) {
        if(!model)
            return;
        
        _removeDisplayItem.call(this);
        
        // For bug #114049 (http://redmine.jinfonet.com.cn/issues/114049)
        // 
        // Sometimes, the model to select is from the options directly. If we 
        // rectifying it directly, the oringinal item in the options will also 
        // be changed. That isn't right. So we copy it first.
        var m = System.objectCopy(model, {}, true);
        m = this.rectifyModel(m);
        _createDisplayItem.call(this, m);
    };
    
    var _wrapText = function(text, startSymbol, endSymbol /* Optional */){
        if(typeof text !== "string")
            return null;
        
        var buf = new js.lang.StringBuffer(), symbol;
        if(typeof startSymbol === "string"){
            symbol = startSymbol;
            
            buf.append(startSymbol);
        }
        
        buf.append(text);
        
        if(typeof endSymbol === "string"){
            symbol = endSymbol;
        }
        
        if(typeof symbol === "string"){
            buf.append(symbol);
        }
        
        return buf.toString();
    };
    
    var _joinTexts = function(texts){
        if(!texts || texts.length == 0)
            return "";
        
        var buf = new js.lang.StringBuffer(), text;
        for(var i = 0, len = texts.length; i < len; i++){
            if(i > 0){
                buf.append(",");
            }
            
            text = texts[i];
            text = _wrapText.call(this, text, '\"');
            buf.append(text);
        }
        
        return buf.toString();
    };
    
    var _splitText = function(text){
        if(typeof text !== "string")
            return null;
        
        var regExp = /("[^"]+")/g, matches = text.match(regExp);
        if(!matches || matches.length == 0)
            return null;
        
        var len = matches.length, segs = [], seg;
        for(var i = 0; i < len; i++){
            seg = matches[i];
            seg = seg.replace(/"/g, "");
            
            segs[i] = seg;
        }
        return segs;
    };
    
    var _setSelectedValues = function(values){
        values = Class.isArray(values) ? values : [];
        this._local.selectedValues = LList.$decorate(values);      
    };
    
    var _select = function(model){
        this._local.latestModel = model;
        _setSelected.call(this, model);
    };
    
    thi$.showSubview = function(b){
        var rst = false;
        if(b === true){
            rst = true;
            
            if(this.subview){
                if(this.subview.isShown()){
                    this.subview.hide("hide", {ignore: true});
                    
                    this._local.expectedOp = 1; 
                    this.setHover(false);
                }
                
                _showSubview.call(this, true);
            }else{
                _onDropDown.call(this);
            }
        }else{
            if(this.subview){
                _showSubview.call(this, false);
            }
        }
        
        return rst;
    };
    
    var _showSubview = function(b){
        if(!this.subview){
            return;
        }
        
        this._local.expectedOp = b ? 0 : 1;
        var isShown = this.subview.isShown();
        if(isShown == b){
            return;
        }
        
        if(b){
            if(this.isShowBtnByHover()){
                this.showBtnDropDown(true);
            }
            
            var w = DOM.outerWidth(this.view, true);
            this.subview.setMinimumSize(w);
            this.subview.showBy(this.view);
        }else{
            this.subview.hide();
        }
    };
    
    thi$.showBtnDropDown = function(b){
        var btn = this.btnDropDown; 
        if(btn.isVisible() === b 
           || (b && this._inputView)){
            return;
        }
        
        btn.setVisible(b);
        btn.display(b);
        
        if(this.isDOMElement()){
            btn.def.prefSize = null;
            this.doLayout(true);   
        }     
    };
    
    var _onDropDown = function(e){
        if(this._inputView){
            this.doEdit();
        }

        this._local.latestModel 
            = this.displayItem ? this.displayItem.model : null;
        
        var M = this.def;
        if(!this.subview){
            //var w = DOM.outerWidth(this.view, true);
            //M.subview.width = w;
            _createSubview.call(this, M);

            var tmp = this._local.subviewRoot;
            if(tmp){
                this.subview.rootLayer(tmp);
                delete this._local.subviewRoot;
            }
        }

        var show = (this._local.expectedOp == 0 ? false : true);
        _showSubview.call(this, show);
    };
    
    var _onMouseOver = function(e){
        if(this.subview && this.subview.isShown()){
            return;
        }
        
        if(this.isShowBtnByHover()){
            this.showBtnDropDown(true);
        }
        
        if(this.hasEffect()){
            this.setHover(true);
        }
    };
    
    var _onMouseOut = function(e){
        if(this.subview && this.subview.isShown()){
            return;
        }

        if(this.hasEffect()){
            this.setHover(false);
        }

        if(this.isShowBtnByHover()){
            this.showBtnDropDown(false);
        }
    };
    
    // When we want to select some non-existent items from the ComboBox's list
    // by invoking setSelectedValues() or setSelectedIndexes(), we will build
    // a model object as the selected with the same rules as those two methods
    // implementation:
    // a)If invoked the setSelectedValues(), use the specified values
    //   as value to build a model object.
    // b)If no model object can be returned, use the default model.
    var _buildSelectedModel = function(cInfo){
        var m;
        if(cInfo && cInfo.values){
            var set = cInfo.values, dname, v;
            if(set.length > 0){
                if(this.multiEnable){
                    dname = _joinTexts.call(this, set);
                    v = set;
                }else{
                    dname = v = set[0];
                }
                
                m = {dname: dname, value: v};
            }
        }else{
            // Whether we should use the first item as selected??
            // if(cInfo && cInfo.indexes){
            //     var ms = this.findItemModelsByIndex([0]);
            //     m = ms ? ms[0] : undefined;
            // }
        }
        
        return m || {dname: "", value: "", isDefault: true};
    };
    
    /**
     * A temporary solution to make user can custom the display value by
     * overriding this method.
     */
    thi$.extractSelectedModel = function(event){
        var data = event.getData(), models = data.models, 
        cInfo = data.callbackInfo,
        len = models ? models.length : 0,
        selectedModel;
        
        if (len == 0){
            selectedModel = _buildSelectedModel.call(this, cInfo);
        } else if (this.multiEnable){
            var dnames = LList.$decorate([]), values = LList.$decorate([]), 
            m, dname, v;
            for(var i = 0; i < len; i++){
                m = models[i];
                dname = m.dname;
                v = m.value;
                if(dname !== undefined && dname !== null 
                   && !dnames.contains(dname)){
                    dnames.addLast(dname);
                }
                
                if(v !== undefined && v !== null 
                   && !values.contains(v)){
                    values.push(v);
                }
            }
            
            dname = _joinTexts.call(this, dnames);
            selectedModel = {dname: dname, value: values};
        } else {
            selectedModel = models[0];
        }
        
        return selectedModel;
    };
    
    thi$.selectedChanged = function(event){
        var data = event.getData(), cInfo = data.callbackInfo,
        m = this.extractSelectedModel(event), vs;
        if(!m.value && m.isDefault === true){
            vs = [];
        }else{
            vs = this.multiEnable ? m.value : [m.value];
        }

        this._local.selectedValues = LList.$decorate(vs);
        _select.call(this, m);
        
        if(!this.multiEnable){
            //If it isn't single selection, hide the dropdown list.
            _showSubview.call(this, false);
        }
        
        if((event.getType() === "click") 
            || (cInfo && cInfo.notify === true)){
            this.onSelectedChanged(event.getEventTarget(), "ItemMarked");       
        }
    };
    
    /**
     * In some special cases, make the combobox be in editable state immediately.
     * 
     * @param force: {Boolean} Indicate to force the combobox be in editable state
     *        even if it isn't editiable now.
     */
    thi$.activeEdit = function(force){
        if(force === true || this.editable){
            _onEdit.call(this, new Event("activeEdit"));
        }
    };
    
    var _onListEvent = function(e){
        this.fireEvent(e);
    };
    
    var _onListSubmit = function(){
        _showSubview.call(this, false);
    };
    
    var _createSubview = function(def){
        var theDef = def.subview,
        ds = this._local.itemDefs,
        ms = this._local.itemModels;

        if(Class.isArray(ds) && ds.length > 0){
            theDef.itemDefs = ds;
        }else if(Class.isArray(ms) && ms.length > 0){
            theDef.itemModels = ms;
        } 
        
        var subview = this.subview = new DDList(theDef, this.Runtime());
        subview.setPeerComponent(this);
        subview.setAdjustPosToFit(false);
        
        subview.attachEvent(List.EVT_READY, 4, this, _onListEvent);
        subview.attachEvent(List.EVT_ACK_ITEMSADDED, 4, this, _onListEvent);
        subview.attachEvent(List.EVT_ACK_ITEMSREMOVED, 4, this, _onListEvent);
        subview.attachEvent(DDList.EVT_SUBMITVALUES, 4, this, _onListSubmit);
    };
    
    var _onLayerRemoved = function(e){
        var type = e.getType(), evt = e.getData(),
        eType = evt ? ((evt instanceof js.util.Event) 
                       ? evt.getType() : evt.type) : undefined,
        el = evt ? evt.srcElement : undefined,
        trigger = (this.def.wholeTrigger === true 
                   ? this : this.btnDropDown);
        
        this.notifyPeer("js.awt.event.LayerEvent", e);
        
        if(type == "afterRemoveLayer"){
            if(eType == "hide" && evt && evt.ignore === true){
                return;
            }

            if(eType == "hide" || eType == "message"  
               || (el && !trigger.contains(el, true))){
                this._local.expectedOp = 1; 
                this.setHover(false);
                
                if(this.isShowBtnByHover()){
                    this.showBtnDropDown(false);
                }
            }
        }
    };
    
    // If combobox is in edit, quit the editing status.
    // Add by mingfa.pan, 04/11/2013
    var _quitEdit = function(){
        var iptView = this._inputView;
        if(!this.editable || !iptView){
            return;
        }
        
        iptView.detachEvent(js.swt.TextField.EVT_SUBMIT, 4, this, this.doEdit);

        this.dItemContainer.removeComponent(iptView);
        iptView.destroy();
        delete this._inputView;
        
        _select.call(this, this._local.latestModel);
    };
    
    // Initialize selecteions
    var _preSelect = function(useDefault){
        var ds = this._local.itemDefs, 
        ms = this._local.itemModels, 
        useDs = false, set;
        
        if(Class.isArray(ds) && ds.length > 0){
            useDs = true;
            set = ds;
        }else if(Class.isArray(ms) && ms.length > 0){
            useDs = false;
            set = ms;
        }

        var len = set ? set.length : 0, 
        dnames = [], values = LList.$decorate([]), 
        tmp, m;
        for(var i = 0; i < len; i++){
            tmp = set[i];
            tmp = useDs ? tmp.model : tmp;
            if(tmp && (tmp.marked === true)){
                if(!this.multiEnable){
                    m = tmp;
                    values.push(m.value);
                    break;
                }
                
                dnames.push(tmp.dname);
                if(!values.contains(tmp.value)){
                    values.push(tmp.value);
                }
            }
        }
        
        if(this.multiEnable && (dnames.length > 0)){
            var dname = _joinTexts.call(this, dnames);
            m = {dname: dname, value: values};
        }
        
        // If combobox is in edit, quit the editing status.
        // Add by mingfa.pan, 04/11/2013
        _quitEdit.call(this);

        if(!Class.isObject(m) && useDefault === true){
            m = CLASS.DEFAULTMODEL;
            values = [];
        }
        
        if(Class.isObject(m)){
            _select.call(this, m);
            _setSelectedValues.call(this, values);
        }
    };
    
    var _preInit = function(def){
        if(def && def.subview){
            this._local = this._local || {};
            this._local.subviewRoot = def.subview.root;
            delete def.subview.root;
        }

        def = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
        def.layout = def.layout 
            || {gap: 0, align_x: 0.0, align_y: 0.5};
        
        def.items = ["dItemContainer", "btnDropDown"];
        
        var tmp = {className: DOM.combineClassName(def.className, "dItemContainer")};
        def.dItemContainer = System.objectCopy(dItemContainerDef, tmp, true);

        tmp = {className: DOM.combineClassName(def.className, "dropdown")};
        def.btnDropDown = System.objectCopy(btnDropDownDef, tmp, true);

        return def;
    };
    
    thi$._init = function(def){
        if(typeof def !== "object") return;
        
        def = _preInit.call(this, def);
        arguments.callee.__super__.apply(this, arguments);
        
        // 0: Expect hide subview
        // 1: Expect popup subview
        this._local.expectedOp = 1;
        this._local.msgType = "js.swt.event.SelectedChanged";
        
        this.useInput = (def.useInput === true);
        this.editable = (!this.useInput && def.editable === true);
        this.multiEnable = (def.subview.multiEnable === true);
        this.setDisplayItemStyles(def.displayItemStyles);
        
        var ds = def.subview.itemDefs, 
        ms = def.subview.itemModels;
        if(Class.isArray(ds) && ds.length > 0){
            this._local.itemDefs = ds;
        }else if(Class.isArray(ms) && ms.length > 0){
            this._local.itemModels = ms;
        }
        
        _preSelect.call(this, true);
        
        if(def.initDDList === true){
            _createSubview.call(this, def);
        }
        
        if(this.isShowBtnByHover()){
            this.showBtnDropDown(false);
        }

        // Register to listen the events and messages
        var M = this.def;
        if(M.wholeTrigger === true){
            this.attachEvent("click", 0, this, _onDropDown);       
        }else{
            Event.attachEvent(this.btnDropDown.view, "click", 0, 
                              this, _onDropDown);
        }
        
        if(M.effect === true || M.showBtnByHover === true){
            this.attachEvent("mouseover", 0, this, _onMouseOver);
            this.attachEvent("mouseout", 0, this, _onMouseOut);
        }
        
        MQ.register("js.swt.event.SelectChangedEvent", 
                    this, this.selectedChanged);
        MQ.register("js.swt.event.ControllerEvent",
                    this, _onController);
        MQ.register("js.awt.event.LayerEvent", 
                    this, _onLayerRemoved);
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.HBox);

js.swt.ComboBox.DEFAULTMODEL = {dname: "", value: ""};
js.swt.ComboBox.DEFAULTDEF = function(){
    return {
        classType: "js.swt.ComboBox",
        className: "jsvm_comboBox",
        
        wholeTrigger: false,
        editable: false,
        effect: false,
        
        showTips: true,
        displayTip: undefined,
        
        initDDList: false,
        displayItemStyles: undefined,
        
        subview: {
            multiEnable: false,
            
            distinct: false,
            showItemTip: true,
            
            hauto: true,
            vauto: false,

            searchIfAllowed: false,     
            lazy: false,
            
            itemModels: [],
            itemDefs: []
        }
    };
};
