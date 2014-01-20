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

$import("js.awt.TreeItem");

/**
 *
 */
js.awt.TreeDataProvider = function(){

    var CLASS = js.awt.TreeDataProvider, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    /**
     * Sets expandable map for testing hether an tree item can be expanded.
     *
     * @param map, { type: true|false...}
     */
    thi$.setExpandableMap = function(map){
        this.expandMap = map;
    };

    /**
     * Tests whether the specified tree item can be expanded
     *
     * @param def, the tree item def
     * @return true/false
     *
     * Notes: Sub class should overrides this method
     */
    thi$.canExpand = function(def){
        var type = def.type, map = this.expandMap,
        b = map ? map[type] : false;

        return b || false;
    };

    /**
     * Sets dragable map for testing whether an tree item can be draged.
     *
     * @param map, { type: true|false...}
     */
    thi$.setDragableMap = function(map){
        this.dragMap = map;
    };

    /**
     * Tests whether the specified tree item can be draged
     *
     * @param def, the tree item def
     * @return true/false
     *
     * Notes: Sub class should overrides this method
     */
    thi$.canDrag = function(def){
        var type = def.type, map = this.dragMap,
        b = map ? map[type] : false;

        return b || false;
    };

    /**
     * Sets image map for getting image name according to
     * the type of a tree item.
     *
     * @param map, {type: imagename...}
     */
    thi$.setImageMap = function(map){
        this.imageMap = map;
    };

    /**
     * Gets image name from image map for the specified tree item.
     *
     * @param def, the tree item def
     * @return image name
     *
     * Notes: Sub class should overrides this method.
     */
    thi$.getIconImage = function(def){
        var type = def.type, map = this.imageMap,
        image = map ? map[type] : "blank.gif";
        return image;
    };

    /**
     * The message type is such a string that identify what kind message
     * will be posted to message receivers. Generally, message receivers
     * are drop targets.
     *
     * Notes: Sub class should implements this function.
     */
    thi$.getDragMsgType = function(){
        return "js.awt.event.TreeItemDrag";
    };

    /**
     * The mover will invoke this method to determine moving message
     * should be posted to which receivers.
     */
    thi$.getDragMsgRecvs = function(){
        return null;
    };


    /**
     * If a tree node is dynamic load, when it expands, it need
     * get new data from this provider. When the provider got data,
     * must invoke callback(data, item) to notify Tree.
     * The data must be an object like below:
     * {
     *     id:...
     *     type: ...
     *
     *     nodes:[
     *         ...
     *     ]
     * }
     *
     * Notes: Sub class should overrides this method
     */
    thi$.getData = function(itemDef, callback){
        callback({});
    };

};

/**
 *
 */
js.awt.Tree = function(def, Runtime, dataProvider){

    var CLASS = js.awt.Tree, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ,

    permission = Class.forName("js.util.Permission");

    thi$.setDataProvider = function(dataProvider){
        if(!dataProvider.instanceOf(js.awt.TreeDataProvider))
            throw "Request a js.awt.TreeDataProvider instance";

        this.dataProvider = dataProvider;
    };

    thi$.canExpand = function(itemDef){
        return this.dataProvider.canExpand(itemDef);
    };

    thi$.canDrag = function(itemDef){
        return this.dataProvider.canDrag(itemDef);
    };

    thi$.getIconImage = function(itemDef){
        return this.dataProvider.getIconImage(itemDef);
    };

    thi$.showTip = function(showTip){
        this._local.showTip = showTip;
    };

    thi$.isShowTip = function(){
        return this._local.showTip || false;
    };

    thi$.setItemEnabled = function(item, b){
        b = (b === true);
        if(item.isEnabled() === b){
            return;
        }

        if(!b && item.canExpand() && item.isExpanded()){
            this.expandAll(false, item);
        }

        item.setEnabled(b);
        item.updateBranchStyle();
    };

    /**
     * Insert tree items into specified position
     *
     * @param index
     * @param itemDefs, an array of tree item definition
     */
    thi$.insertNodes = function(index, itemDefs){
        var nodes = this.nodes, ibase = index, item, refNode,
        itemDef, i, len;

        if(!nodes){
            nodes = this.nodes = js.util.LinkedList.$decorate([]);
        }

        item = nodes.get(index);
        refNode = item ? item.view : undefined;

        for(i=0, len=itemDefs.length; i<len; i++){
            itemDef = itemDefs[i];
            if(itemDef.isVisible == false){
                continue;
            }
            itemDef.level = 0;
            if(this.isShowTip()){
                itemDef.tip = itemDef.dname;
                itemDef.showTip = true;
            }
            if(i === 0){
                item = new js.awt.TreeItem(itemDef, this.Runtime(), this);
            }else{
                item = new js.awt.TreeItem(
                    itemDef,
                    this.Runtime(),
                    this,
                    undefined,
                    item.cloneView());
            }

            nodes.add(ibase++, item);

            if(refNode){
                DOM.insertAfter(item.view, refNode);
            }else{
                DOM.appendTo(item.view, this._treeView);
            }

            refNode = item.view;
        };

        // Update marker style
        var marked = this.marked;
        for(i=0, len=nodes.length; i<len; i++){
            item = nodes[i];
            item.updateBranchStyle();

            if(item.isMarked()){
                marked.push(item);
            }
        }
        this._doSort();
        delete this._local.maxSize;
    };

    thi$._doSort = function(){
        var tree = this;
        var _func = function(item1, item2){
            return tree.getNodeIndex(item1) - tree.getNodeIndex(item2);
        };

        this.marked.sort(_func);
        this.selected.sort(_func);
    };

    /**
     * Remove the specified item from current tree.
     *
     * @param item: {js.awt.TreeItem} A tree item to remove.
     */
    thi$.removeNode = function(item){
        if(!item || !(item.instanceOf(js.awt.TreeItem))){
            return;
        }

        _keepScroll.call(this);

        var pitem = item.parentItem,
        nodes = pitem ? pitem.nodes : null;

        if(Class.isArray(nodes)){
            js.util.LinkedList.$decorate(nodes);
            nodes.remove(item);
        }

        delete this.cache[item.uuid()];
        
        this.marked.remove(item);
        this.selected.remove(item);
        item.destroy();

        this._doSort();
        delete this._local.maxSize;

        _setMaxSize.$delay(this, 1);
        _keepScroll.$delay(this, 1, true);
    };

    /**
     * Remove tree items from index to index + length
     *
     * @param index: {Integer} index of each item in nodes of current tree to remove.
     * @param length: {Integer} Indicate how many items to remove.
     */
    thi$.removeNodes = function(index, length, isDestroying){
        var nodes = this.nodes || [], cnt = nodes.length,
        cache = this.cache, marked = this.marked, 
        selected = this.selected, item;

        if(!Class.isNumber(index)){
            index = 0;
        }else{
            index = index < 0
                ? 0 : (index >= cnt ? cnt - 1 : index);
        }

        if(!Class.isNumber(length)){
            length = cnt - index;
        }else{
            length = length < 0 ? 0
                : (index + length > cnt ? cnt - index : length);
        }

        _keepScroll.call(this);

        nodes = nodes.splice(index, length);
        while(nodes.length > 0){
            item = nodes.shift();
            delete cache[item.uuid()];
            
            marked.remove(item);
            selected.remove(item);
            item.destroy();
        }

        if(isDestroying === true){
            return;
        }

        this._doSort();
        delete this._local.maxSize;

        _setMaxSize.$delay(this, 1);
        _keepScroll.$delay(this, 1, true);
    };

    /**
     * Remove all tree times
     */
    thi$.removeAllNodes = function(isDestroying){
        var nodes = this.nodes;
        if(nodes){
            this.removeNodes(0, nodes.length, isDestroying);
        }
    };

    thi$.getTreeNodeByTypes = function(types, index){
        var nodes = this.nodes || [];

        if(!Class.isArray(types)
           || types.length == 0){
            return nodes[0];
        }

        if(!Class.isFunction(types.indexOf)){
            js.util.LinkedList.$decorate(types);
        }

        return _getTreeNodeByTypes.call(this, nodes, types, index);
    };

    var _getTreeNodeByTypes = function(nodes, types, index){
        var node, type, tmp;
        for(var i = 0, len = nodes.length; i < len; i++){
            node = nodes[i];
            type = node.def["type"];

            if(types.indexOf(type) !== -1){
                index--;
                if(index <= 0){
                    return node;
                }else{
                    tmp = node.nodes;
                    if(tmp && tmp.length > 0){
                        return _getTreeNodeByTypes.call(this, tmp, types, index);
                    }
                }
            }else{
                tmp = node.nodes;
                if(tmp && tmp.length > 0){
                    return _getTreeNodeByTypes.call(this, tmp, types, index);
                }
            }
        }

        return node;
    };

    /**
     * Move tree item from index1 to index2.
     */
    thi$.moveNode = function(index1, index2){
        var nodes = this.nodes, len = nodes.length;
        if(!Class.isNumber(index1) || index1 < 0 || index1 >= len
           || !Class.isNumber(index2) || index2 < 0 || index2 >= len){
            return;
        }

        var node1 = nodes[index1], node2 = nodes[index2],
        view1, view2, treeView = this._treeView;

        nodes[index1] = node2;
        nodes[index2] = node1;

        view1 = node1.view;
        view2 = node2.view;

        treeView.removeChild(view1);

        if(index1 < index2){
            DOM.insertAfter(view1, view2, treeView);
        } else {
            DOM.insertBefore(view1, view2, treeView);
        }

        this._doSort();
    };

    /**
     * Expand tree with the specified item
     *
     * @param item, with which item
     * @param needNitify, false for don't nofity the tree to do AfterExpand,others do.
     */
    thi$.expand = function(item, needNotify){
        if(item.def.isRead == false){
            return;
        }

        if(item.isExpanding()){
            return;
        }

        item.setExpanding(true);

        _keepScroll.call(this);

        if(item.isExpanded()){
            item.expand(false, needNotify);
            if(item.def.nodes == undefined){
                item.removeAllNodes();
            }
            _setMaxSize.$delay(this, 1);
            _keepScroll.$delay(this, 1, true);
        }else{
            if(item.def.nodes == undefined){
                // Ask data from dataProvider
                this.dataProvider.getData(
                    item.def,
                    _onGetData.$bind(this, item, needNotify));
            }else{
                // No need get data, so expand item directly
                item.expand(true, needNotify);
                _setMaxSize.$delay(this, 1);
                _keepScroll.$delay(this, 1, true);
            }

        }
        delete this._local.maxSize;
    };


    var _checkData = function(data){
        var p = data.permission;
        if(p){
            data.isVisible = permission.isVisible(p);
            data.isRead = permission.isRead(p);
            data.isWrite = permission.isWrite(p);
            data.isExecute = permission.isExecute(p);
        }
        if(data.nodes){
            for(var i = 0,nodes = data.nodes, len = data.nodes.length;i < len; i++){
                if(nodes[i].nodes){
                    nodes[i] = _checkTreeNode.call(this, nodes[i]);
                }else{
                    p = nodes[i].permission;
                    if(p){
                        nodes[i].isVisible = permission.isVisible(p);
                        nodes[i].isRead = permission.isRead(p);
                        nodes[i].isWrite = permission.isWrite(p);
                        nodes[i].isExecute = permission.isExecute(p);
                    }
                }
            }
        }
        return data;
    };

    var _onGetData = function(data, item, needNotify){

        data = _checkData.call(this, data);

        if(data && data.nodes){
            item.insertNodes(0, data.nodes);
            item.expand(true, needNotify);
            _setMaxSize.$delay(this, 1);
            _keepScroll.$delay(this, 1, true);
        }else{
            item.branch.className = item.className + "_branch0";
        }
    };

    /**
     * Expand or collapse all items
     *
     * @param b, true for expanding and false for collapsing
     *
     */
    thi$.expandAll = function(b, root){
        var nodes = this.nodes, i, len, item;
        if(root){
            nodes = [root];
        }

        if(nodes && nodes.length>0){
            for(i=0, len=nodes.length; i<len; i++){
                item = nodes[i];
                if(b){
                    if(item.canExpand() && !item.isExpanded()){
                        item.expandAll(b, item);
                    }
                }else{
                    if(item.canExpand() && item.isExpanded()){
                        item.expand(b);
                    }
                }
            }
        }
        _setMaxSize.$delay(this, 1);
        _keepScroll.$delay(this, 1, true);

        this.onAfterExpand.$delay(this,1);
        delete this._local.maxSize;
    };

    thi$.onAfterExpand = function(){
        var cache = this.cache,item;
        for(var uuid in cache){
            item = this.cache[uuid];
            if((!item.isEnabled()) && item.view.parentNode !== null){
                item._adjust("move");
            }
        }
    };

    /**
     * Gets all nodes which were accepted by filter
     *
     * @param, the filter function(itemDef) which return true or false
     * @param, recursive
     */
    thi$.getNodes = function(filter, recursive){
        var nodes = this.nodes, i, len, item, ret = [];
        for(i=0, len=nodes.length; i<len; i++){
            item = nodes[i];
            if(typeof filter == "function"){
                if(filter(item.def)) ret.push(item);
            }else{
                ret.push(item);
            }
            if(recursive === true && item.hasChildren()){
                item.getNodes(0, null, filter, true, ret);
            }
        }
        return ret;
    };

    /**
     * Returns all node index
     */
    thi$.getNodeIndex = function(item){
        var nodes = this.nodes;
        for(var i=0; i<nodes.length; i++){
            if(nodes[i] == item){
                return i;
            }
        }
        return -1;
    };

    /**
     * Returns all items
     */
    thi$.getAllNodes = function(){
        return this.nodes;
    };

    /**
     * Returns all selected items
     */
    thi$.getAllSelected = function(){
        return this.selected;
    };

    /**
     * Clears all selected items
     */
    thi$.clearAllSelected = function(){
        var selected = this.selected, item;
        while(selected.length > 0){
            item = selected.shift();
            item.setTriggered(false);
        }
        this._doSort();
    };

    /**
     * Returns all marked items
     */
    thi$.getAllMarked = function(){
        return this.marked;
    };

    /**
     * Clears all marked items
     */
    thi$.clearAllMarked = function(){
        var marked = this.marked, item;
        while(marked.length > 0){
            item = marked.shift();
            item.mark(false);
        }
        this._doSort();
    };

    /**
     * Mark a tree node
     *
     * @param item, tree item
     */
    thi$.markNode = function(item){
        if(!item.isMarkable()) return;

        item.mark(!item.isMarked());
        if(item.isMarked()){
            this.marked.push(item);
        }else{
            this.marked.remove(item);
        }
        this._doSort();
    };

    /**
     * @see js.awt.Movable
     */
    thi$.isMoverSpot = function(el, x, y){
        var uuid = el.uuid, item = this.cache[uuid];

        if(item){
            if (this.selected.length > 0){
                return true;
            }else{
                if(item.isMoverSpot(el) && item.canDrag()){
                    return true;
                }
            }
        }

        return false;
    };

    thi$.setMultiEnable = function(b){
        this.def.multiEnable = (b === true);
    };

    thi$.isMultiEnable = function(){
        return this.def.multiEnable;
    };

    thi$.getMoveObjectDef = function(item){
        return {};
    };

    /**
     * @see js.awt.Movable
     */
    thi$.getMoveObject = function(e){
        var moveObj = this.moveObj;
        if(!moveObj){
            var el = e.srcElement, uuid = el.uuid, item = this.cache[uuid],
            mdef, absXY = e.eventXY();

            if(item.def.isExecute == false){
                return null;
            }

            if(this.selected.length == 0){
                var state = new js.awt.State(this.getState());
                state.setHover(false);
                state.setTriggered(true);
                item.setState(state.getState());
                this.selected.push(item);
                this._doSort();
            }

            mdef = this.getMoveObjectDef() || {};
            moveObj = this.moveObj =
                new js.awt.TreeMoveObject(mdef, this.Runtime(), this);
            moveObj.setMovingPeer(this);
            moveObj.appendTo(document.body);

            /*moveObj.setPosition(absXY.x, absXY.y);*/
            moveObj.setPosition(absXY.x - 10, absXY.y - 8);
        }

        return moveObj;
    };

    /**
     * Keep and restore scroll bar position
     *
     * @param restore, true means restore
     */
    var _keepScroll = function(restore){
        var U = this._local, el = this.view;
        if(!restore){
            U.scrollLeft = el.scrollLeft;
            U.scrollTop  = el.scrollTop;
        }else{
            el.scrollLeft = U.scrollLeft;
            el.scrollTop  = U.scrollTop;
        }
    };

    /**
     * Sets treeView max size
     */
    var _setMaxSize = function(){
        var rect = _getMaxSize.call(this), box = this.getBounds(),
        cw = box.innerWidth, ch = box.innerHeight, MBP = box.MBP,
        w = rect.width >= cw ? rect.width : undefined,
        h = rect.height >= ch ? rect.height : undefined;

        this.view.style.overflow = "hidden";

        // The treeview is relative and position in the inside of padding.
        // For holding the padding of tree, we will add the right padding
        // to the content width as treeview's width. And add the bottom
        // padding to the content height as treeview's height.
        if(w != undefined){
            w += MBP.borderRightWidth + MBP.paddingRight;
        }

        if(h != undefined){
            h += MBP.borderBottomWidth + MBP.paddingBottom;
        }

        DOM.setSize(this._treeView, w, h);

        if(w == undefined){
            this._treeView.style.width = "100%";
        }
        if(h == undefined){
            this._treeView.style.height= "100%";
        }

        this.view.style.overflow = "auto";
    };

    /**
     * Gets treeView max size
     */
    var _getMaxSize = function(force){
        var treeview = this._treeView, ret = this._local.maxSize;
        if(force !== true && ret){
            return ret;
        }

        treeview.style.overflow = "hidden";
        DOM.setSize(treeview, 0, 0);
        ret = this._local.maxSize = {
            width: treeview.scrollWidth,
            height:treeview.scrollHeight
        };
        treeview.style.overflow = "visible";
        return ret;
    };

    thi$.doLayout = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            _setMaxSize.call(this);
            return true;
        }
        return false;
    }.$override(this.doLayout);

    thi$.getOptimalSize = function(){
        var size = _getMaxSize.call(this),
        bounds = this.getBounds(),
        w = size.width, h = size.height;

        w += bounds.MBP.BPW;
        h += bounds.MBP.BPH;
        return {width: w, height: h};
    };

    var _onclick = function(e){
        var isMulti = this.def.multiEnable, el = e.srcElement, uuid = el.uuid,
        item = this.cache[uuid], selected = this.selected;

        if(item && item.isEnabled()){
            if(e.getType() == "click"){
                if(el === item.branch && item.canExpand()){
                    this.clearAllSelected();
                    this.expand(item);
                    return;
                }else if(el === item.marker && item.isMarkable()){
                    this.markNode(item);
                    e.setType("markchanged");
                    e.setEventTarget(item);
                    this.notifyPeer("js.awt.event.TreeItemEvent", e);
                    return;
                }else if (item.canDrag()){
                    if(isMulti && e.ctrlKey === true){
                        item.setTriggered(!item.isTriggered());
                        if(item.isTriggered()){
                            selected.push(item);
                        }else{
                            selected.remove(item);
                        }
                    }else if(isMulti && e.shiftKey === true){
                        var first = selected.length > 0 ? selected[0] : undefined;

                        if(first == undefined){
                            first = item;
                            item.setTriggered(true);
                            selected.push(item);
                        }

                        if(first && item && first.parentItem() == item.parentItem()){
                            var nodes = first.parentItem().getNodes(first, item), node;
                            for(var i=1, len=nodes.length; i<len; i++){
                                node = nodes[i];
                                node.setTriggered(true);
                                selected.push(node);
                            }
                        }
                    }else if(item.isTriggered()){
                        this.clearAllSelected();
                    }else{
                        this.clearAllSelected();
                        item.setTriggered(true);
                        selected.push(item);
                    }
                }
                this._doSort();
                e.setType("selectchanged");
                e.setData(this.getAllSelected());
                e.setEventTarget(item);
                this.notifyPeer("js.awt.event.TreeItemEvent", e);
                return;
            }
        }

        if(this.selected.length){
            this.clearAllSelected();
            e.setType("selectchanged");
            e.setData(this.getAllSelected());
            this.notifyPeer("js.awt.event.TreeItemEvent", e);
        }
    };

    var _onmouseover = function(e){
        var from = e.fromElement, to = e.toElement,
        fid = from ? from.uuid : undefined,
        tid = to ? to.uuid : undefined,
        fitem, titem, cache = this.cache;

        if(fid !== tid){
            fitem = cache[fid];
            titem = cache[tid];
            if(fitem && fitem.isHover() && fitem.isEnabled()){
                fitem.setHover(false);
            }
            if(titem && !titem.isHover() && titem.isEnabled()){
                titem.setHover(true);
            }
        }
    };

    // Only bind to treeView to avoid autoscroll when drag an item
    var _onmousedown = function(e){
        return e.cancelDefault();
    };

    // Notify tree peer
    var _ondrag = function(e){
        this.notifyPeer("js.awt.event.TreeItemEvent", e);
    };

    thi$.destroy = function(){
        this.removeAllNodes(true);
        delete this.nodes;
        delete this.cache;
        delete this.selected;
        delete this.marked;
        delete this.dataProvider;

        DOM.remove(this._treeView, true);
        delete this._treeView;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    var _onevent = function(e){

    };

    thi$._init = function(def, Runtime, dataProvider){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Tree";
        def.className = def.className || "jsvm_tree";
        def.stateless = true;

        def.mover = def.mover || {};
        def.mover.longpress = def.mover.longpress || 250;
        def.multiEnable = (def.multiEnable === true);

        // Call base _init
        arguments.callee.__super__.apply(this, [def, Runtime]);

        // Cache all tree items
        this.cache = {};
        this.selected = js.util.LinkedList.$decorate([]);
        this.marked = js.util.LinkedList.$decorate([]);

        this.showTip(def.showTip);

        var treeView = this._treeView = DOM.createElement("DIV");
        treeView.className = this.className + "_treeview";
        treeView.style.cssText = "position:relative;width:100%;height:100%;"
            + "overflow:visible;";
        DOM.appendTo(treeView, this.view);

        this.setDataProvider(dataProvider ||
                             new js.awt.AbstractTreeDataProvider(this.Runtime()));

        if(def.nodes && def.nodes.length > 0){
            this.insertNodes(0, def.nodes);
        }

        Event.attachEvent(treeView, "mouseover", 0, this, _onmouseover);
        Event.attachEvent(treeView, "mouseout",  0, this, _onmouseover);
        Event.attachEvent(treeView, "click",     0, this, _onclick);
        Event.attachEvent(treeView, "dblclick",  0, this, _onclick);

        // Avoid autoscroll when drag item.
        Event.attachEvent(treeView, "mousedown", 1, this, _onmousedown);

        if(this.isMovable()){
            MQ.register(this.dataProvider.getDragMsgType(), this, _ondrag);
        }

        MQ.register("js.awt.event.TreeItemEvent", this, _onevent);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Component);

/**
 * This is a default TreeDataProvider
 *
 * @see js.awt.TreeDataProvider
 */
js.awt.AbstractTreeDataProvider = function(Runtime, imageMap, expandMap, dragMap){

    var CLASS = js.awt.AbstractTreeDataProvider, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    thi$.destroy = function(){
        delete this._local.Runtime;
        delete this.imageMap;
        delete this.expandMap;
        delete this.dragMap;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$._init = function(Runtime, imageMap, expandMap, dragMap){
        if(Runtime == undefined) return;

        this._local = this._local || {};

        this._local.Runtime = Runtime;
        this.setImageMap(imageMap);
        this.setExpandableMap(expandMap);
        this.setDragableMap(dragMap);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.lang.Object).$implements(js.awt.TreeDataProvider);

/**
 * @see js.awt.Movable
 * @see js.awt.MoveObject
 */
js.awt.TreeMoveObject = function(def, Runtime, tree){

    var CLASS = js.awt.TreeMoveObject, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, dataProvider;

    /**
     * @see js.awt.Movable
     */
    thi$.getMovingData = function(){
        return this.movingPeer.selected;
    };

    /**
     * @see js.awt.Movable
     */
    thi$.getMovingMsgType = function(){
        return dataProvider.getDragMsgType();
    };

    /**
     * @see js.awt.Movable
     */
    thi$.getMovingMsgRecvs = function(){
        return dataProvider.getDragMsgRecvs();
    };

    /**
     * @see js.awt.Movable
     */
    thi$.releaseMoveObject = function(){
        var tree = this.movingPeer;
        tree.clearAllSelected();

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.releaseMoveObject);

    thi$.getPreferredSize = function(nocache){
        var ret = this.def.prefSize, d, w = 0, ch, h = 0;
        if(nocache === true || !ret){
            d = this.getBounds();
            w += d.MBP.BPW;
            h += d.MBP.BPH;

            d = DOM.getBounds(this.icon);
            w += d.width + d.MBP.marginLeft + d.MBP.marginRight;
            ch = d.height;

            d = DOM.getBounds(this.label);
            w += d.width + d.MBP.marginLeft + d.MBP.marginRight;
            h += Math.max(ch, d.height);

            this.setPreferredSize(w, h);
            ret = this.def.prefSize;
        }

        return ret;

    }.$override(this.getPreferredSize);

    thi$.repaint = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            var bounds = this.getBounds(), buf = new js.lang.StringBuffer(),
            left = bounds.MBP.paddingLeft, top = bounds.MBP.paddingTop,
            width = bounds.innerWidth;

            buf.append("position:absolute;left:")
                .append(left).append("px;")
                .append("top:").append(top).append("px;");
            this.icon.style.cssText = buf.toString();

            bounds = this.icon.bounds;
            left += bounds.width + bounds.MBP.marginRight;
            width -= left;
            buf.clear().append("position:absolute;left:")
                .append(left).append("px;")
                .append("top:").append(top).append("px;width:")
                .append(width).append("px;");
            this.label.style.cssText = buf.toString();
        }
    }.$override(this.repaint);

    thi$._init = function(def, Runtime, tree){
        if(def === undefined) return;

        var selected = tree.selected;
        def.classType = "js.awt.TreeMoveObject";
        if(selected.length === 1){
            def.className = tree.className + "_moveobj0";
        }else{
            def.className = tree.className + "_moveobj1";
        }

        def.css = "position:absolute;";
        def.stateless = true;

        arguments.callee.__super__.apply(this, [def, Runtime]);

        dataProvider = tree.dataProvider;

        var item = selected[0], G = item.getGeometric(),
        icon = this.icon = item.icon.cloneNode(true),
        label = this.label = item.label.cloneNode(true);

        icon.bounds = G.icon;
        DOM.appendTo(icon, this.view);

        DOM.appendTo(label, this.view);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(js.awt.MoveObject);

