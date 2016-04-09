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
        var image = def["iconImage"] || def["image"],
        map = this.imageMap;
        if(!image){
            image = map ? map[def.type] : "blank.gif";
        }

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

    thi$.msgType = function(msgType){
        var U = this._local;
        if(Class.isString(msgType) && msgType.length > 0){
            U.msgType = msgType;
        }

        return U.msgType || "js.awt.event.TreeItemEvent";
    };

    /**
     * @method
     * @inheritdoc js.awt.Element#notifyPeer
     */
    thi$.notifyPeer = function(msgId, event, sync){
        if(event){
            event.srcTree = this;
        }

        $super(this);

    }.$override(this.notifyPeer);

    /**
     * Find and return the previous same-level sibling of the specified
     * tree item.
     *
     * @param {js.awt.TreeItem} item
     *
     * @return {js.awt.TreeItem}
     */
    thi$.getPrevSiblingItem = function(item){
        var prevItem = item.prevSibling(), ele;
        if(!prevItem){
            ele = item.view.previousSibling;
            if(ele && ele.uuid){
                prevItem = this.cache[ele.uuid];
            }

            if(prevItem && prevItem.def.level !== item.def.level){
                prevItem = null;
            }
        }

        return prevItem;
    };

    /**
     * Find and return the next same-level sibling of the specified
     * tree item.
     *
     * @param {js.awt.TreeItem} item
     *
     * @return {js.awt.TreeItem}
     */
    thi$.getNextSiblingItem = function(item){
        var nextItem = item.nextSibling(), ele;
        if(!nextItem){
            ele = item.view.nextSibling;
            if(ele && ele.uuid){
                nextItem = this.cache[ele.uuid];
            }

            if(nextItem && nextItem.def.level !== item.def.level){
                nextItem = null;
            }
        }

        return nextItem;
    };

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

    thi$.setAlwaysRemoveChild = function(bool){
        this._local.alwaysRemoveChild = bool;
    };

    thi$.alwaysRemoveChild = function(){
        return this._local.alwaysRemoveChild;
    };

    /**
     * If the specified item is stateless, its icon must be stateless.
     * If the "iconStateless" of the item is specified by definition,
     * the value of which will be used. Otherwise, if the "iconStateless"
     * of the tree is specified, the value will be used.
     *
     * In other words, item's stateless > item's iconStateless > tree's
     * iconStateless.
     */
    thi$.isIconStateless = function(itemDef){
        var stateless = (itemDef.stateless === true);
        if(!stateless){
            if(itemDef.hasOwnProperty("iconStateless")){
                stateless = (itemDef.iconStateless === true);
            }else{
                stateless = (this.def.iconStateless === true);
            }
        }

        return stateless;
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
     * Check node's permission, judge whether the specified node
     * will be visible.
     */
    thi$.isNodeVisible = function(nodeDef){
        var p = parseInt(nodeDef.permission, 10);
        return permission.isVisible(isNaN(p) ? 1 : p);
    };

    thi$.isAlwaysCreate = function(){
        return this.def.alwaysCreate !== false;
    };

    /**
     * Insert tree items into specified position
     *
     * @param index
     * @param itemDefs, an array of tree item definition
     */
    thi$.insertNodes = function(index, itemDefs){
        var nodes = this.nodes, ibase = index, item, refItem, cview, refNode,
        itemDef, clazz, i, len, isVisible;

        if(!nodes){
            nodes = this.nodes = js.util.LinkedList.$decorate([]);
        }

        item = nodes.get(index);
        refNode = item ? item.view : undefined;

        for(i=0, len=itemDefs.length; i<len; i++){
            itemDef = itemDefs[i];
            // if(itemDef.isVisible == false){
            //     continue;
            // }

            itemDef.level = 0;
            if(this.isShowTip()){
                itemDef.tip = itemDef.tip || itemDef.dname;
                itemDef.showTip = true;
            }

            isVisible = this.isNodeVisible(itemDef);
            if(!isVisible){
                if(!this.isAlwaysCreate()){ // skip this item
                    continue;
                }else{ // make item invisible
                    itemDef.state = 16;
                }
            }

            // Add for support inserting the different structure and different
            // style nodes. Such as, inserting the fake nodes of the markable
            // nodes, then each of the fake nodes won't be markable.
            cview = null;
            if(item && item.canCloneView(itemDef)){
                cview = item.cloneView();
            }else{
                if(refItem && refItem.canCloneView(itemDef)){
                    cview = refItem.cloneView();
                }
            }

            clazz = itemDef.className;
            if(!clazz){
                clazz = this.def.className || this.className;
                clazz = itemDef.className = DOM.combineClassName(clazz, "item");
            }

            refItem = item;
            if(!cview){
                item = new js.awt.TreeItem(itemDef, this.Runtime(), this);
            }else{
                // Ref: js.awt.Component#_init
                cview.clazz = clazz;

                item = new js.awt.TreeItem(
                    itemDef,
                    this.Runtime(),
                    this,
                    undefined,
                    cview);
            }

            nodes.add(ibase++, item);

            if(refNode){
                DOM.insertAfter(item.view, refNode);
            }else{
                DOM.appendTo(item.view, this._treeView);
            }

            //item.checkHide();

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

        var pitem = item.parentItem(),
        nodes = pitem ? pitem.nodes : null;

        if(Class.isArray(nodes)){
            js.util.LinkedList.$decorate(nodes);
            nodes.remove(item);
        }

        item.removeAllNodes();
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
            item.removeAllNodes();
            delete cache[item.uuid()];

            item.mark(false);
            marked.remove(item);

            item.setTriggered(false);
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
        this.marked.clear();
        this.selected.clear();

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
        if(!item || item.def.isRead == false){
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
        if(!data) return undefined;
        var p = data.permission, nodes, node, len;
        if(p){
            data.isVisible = permission.isVisible(p);
            data.isRead = permission.isRead(p);
            data.isWrite = permission.isWrite(p);
            data.isExecute = permission.isExecute(p);
        }

        nodes = data.nodes;
        len = Class.isArray(nodes) ? nodes.length : 0;
        for(var i = 0; i < len; i++){
            node = nodes[i];
            if(node.nodes){
                nodes[i] = _checkData.call(this, node);
            }else{
                p = node.permission;
                if(p){
                    node.isVisible = permission.isVisible(p);
                    node.isRead = permission.isRead(p);
                    node.isWrite = permission.isWrite(p);
                    node.isExecute = permission.isExecute(p);
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
            item.branch.className
                = DOM.combineClassName(item.className, "branch0");
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
                // item._adjust("move");
                item.adjustLayers("coord");
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
            item.setHover(false);
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
    thi$.clearAllMarked = function(doSort){
        var marked = this.marked, item;
        while(marked.length > 0){
            item = marked.shift();
            item.mark(false);
        }

        if(doSort !== false){
            this._doSort();
        }
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
        var moveObj = this.moveObj, item, iidef, mdef, mClz,
            absXY, size, bounds, state;
        if(!moveObj){
            absXY = e.eventXY();

            item = this.cache[e.srcElement.uuid];
            iidef = item.def;
            if(iidef.isExecute == false){
                return null;
            }

            if(this.selected.length == 0){
                state = new js.awt.State(this.getState());
                state.setHover(false);
                state.setTriggered(true);
                item.setState(state.getState());
                this.selected.push(item);
                this._doSort();
            }

            mdef = this.getMoveObjectDef(item) || {};
            mClz = mdef.classType;
            if(Class.isString(mClz) && mClz.length > 0){
                mClz = Class.forName(mClz);
            }
            mClz = mClz || js.awt.TreeMoveObject;
            moveObj = this.moveObj
                = new mClz(mdef, this.Runtime(), this);
            moveObj.setMovingPeer(this);
            moveObj.appendTo(document.body);
            
            size = moveObj.getPreferredSize();
            moveObj.setBounds(absXY.x + 8, absXY.y + 8,
                              size.width, size.height, 4);
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

    var _adjustTreeView = function(){
        var bounds = DOM.getBounds(this._treeShell),
        MBP = bounds.MBP;
        DOM.setSize(this._treeView,
                    bounds.width - MBP.BPW,
                    bounds.height - MBP.BPH);
    };

    /**
     * Sets treeView max size
     */
    var _setMaxSize = function(){
        var rect = _getMaxSize.call(this), box = this.getBounds(),
        cw = box.innerWidth, ch = box.innerHeight,

        treeShell = this._treeShell,
        supports = J$VM.supports,

        w, h, wrest, hrest;

        if(rect.width >= cw){ // Has hscrollbar
            w = rect.width;
            wrest = 0;
        }else{
            w = cw;
            wrest = cw - rect.width;
        }

        if(rect.height >= ch){ // Has vscrollbar
            h = rect.height;
            hrest = 0;
        }else{
            h = ch;
            hrest = ch - rect.height;
        }

        // Only have one scrollbar
        if(wrest > 0 || hrest > 0){
            // If the tree will have hscrollbar and the hight has surplus,
            // to compensate the space of hscrollbar with the rest available
            // height.
            if(wrest == 0 && hrest > 0){
                h -= Math.min(hrest, supports.hscrollbar);
            }

            // If the tree will have vscrollbar and the width has surplus,
            // to compensate the space of vscrollbar with the rest available
            // width.
            if(hrest == 0 && wrest > 0){
                w -= Math.min(wrest, supports.vscrollbar);
            }
        }

        this.view.style.overflow = "hidden";

        DOM.setSize(treeShell, w, h);

        _adjustTreeView.call(this);

        this.view.style.overflow = "auto";
    };

    /**
     * Gets treeView max size
     */
    var _getMaxSize = function(force){
        var treeview = this._treeView, ret = this._local.maxSize,
        bounds;
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

        bounds = DOM.getBounds(this._treeShell);
        ret.width += bounds.MBP.BPW;
        ret.height += bounds.MBP.BPH;

        return ret;
    };

    thi$.onResized = function(fire){
        delete this._local.maxSize;

        $super(this);

    }.$override(this.onResized);

    thi$.doLayout = function(){
        if($super(this)){
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

    thi$.scrollTo = function(ele){
        var view = this.view, bounds, MBP, box, x, y, x0, y0,
        scrollLeft, scrollTop;
        if(!ele || !DOM.contains(this._treeView, ele)){
            return;
        }

        bounds = this.getBounds();
        MBP = bounds.MBP;
        x = bounds.absX; // + MBP.borderLeftWidth + MBP.paddingLeft;
        y = bounds.absY; // + MBP.borderTopWidth + MBP.paddingTop;
        x0 = x + (bounds.clientWidth - MBP.BPW);
        y0 = y + (bounds.clientHeight - MBP.BPH);
        scrollLeft = view.scrollLeft;
        scrollTop = view.scrollTop;

        System.log.println("Scroll Position: (" + scrollLeft + ", " + scrollTop + ")");

        box = DOM.getBounds(ele);

        if(box.absX < x){
            scrollLeft -= x - box.absX;
        }else{
            if(box.absX >= x0){
                scrollLeft += box.absX - x0 + box.width;
            }
        }

        if(box.absY < y){
            scrollTop -= y - box.absY;
        }else{
            if(box.absY >= y0){
                scrollTop += box.absY - y0 + box.height;
            }
        }

        System.log.println("New Scroll Position: (" + scrollLeft + ", " + scrollTop + ")");

        if(scrollLeft != view.scrollLeft){
            view.scrollLeft = scrollLeft;
        }

        if(scrollTop != view.scrollTop){
            view.scrollTop = scrollTop;
        }
    };

    /**
     * Select the specified tree item.
     *
     * @param {js.awt.TreeItem} item The specified tree item to select.
     * @param {js.awt.Event} e The event whcich trigger the selecting operation.
     */
    thi$.selectItem = function(item, e){
        /*
         * While the external application is selecting a tree item by invoking
         * this API manually, the e argument may not exist. For supporting to
         * handle the "selectchanged" msg with the consistent codes, we fake
         * the event object for it.
         */
        if(!e){
            e = new Event("selectchanged", {}, this);
            e.srcElement = item ? item.view : this._treeView;
        }

        var isMulti = this.def.multiEnable, selected = this.selected,
        tmp, doo = false;
        if(item && item.isEnabled()){
            if (item.canDrag()){
                if(isMulti && e.ctrlKey === true){
                    item.setTriggered(!item.isTriggered());
                    if(item.isTriggered()){
                        selected.push(item);
                    }else{
                        selected.remove(item);
                    }
                }else if(isMulti && e.shiftKey === true){
                    // Accoding to the multiple select logic of OS file explorer,
                    // use the last one of the latest selection as the start
                    // of current slection.
                    var first = selected.length > 0
                        ? selected[selected.length - 1] : undefined;

                    if(first == undefined){
                        item.setTriggered(true);
                        selected.push(item);
                    }else{
                        this.clearAllSelected();
                    }

                    if(first && item){
                        if(first.parentItem() == item.parentItem()){
                            var nodes = first.parentItem().getNodes(first, item), node;
                            for(var i=0, len=nodes.length; i<len; i++){
                                node = nodes[i];
                                node.setTriggered(true);
                                selected.push(node);
                            }
                        }else{
                            item.setTriggered(true);
                            selected.push(item);
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

            doo = true;
            e.setEventTarget(item);
        }else{
            if(selected.length > 0){
                this.clearAllSelected();

                doo = true;
            }
        }

        if(doo){
            e.setType("selectchanged");
            e.setData(this.getAllSelected());
            this.notifyPeer(this.msgType(), e);
        }
    };

    var _doSelect = function(e){
        var el = e.srcElement, item = this.cache[el.uuid];
        this.selectItem(item, e);
    };

    var _onclick = function(e){
        var el = e.srcElement, uuid = el.uuid,
        item = this.cache[uuid];

        if(item && item.isEnabled()){
            if(e.getType() == "click"){
                if(el === item.branch && item.canExpand()){
                    this.clearAllSelected();
                    this.expand(item);
                }else if(el === item.marker && item.isMarkable()){
                    this.markNode(item);
                    e.setType("markchanged");
                    e.setEventTarget(item);
                    this.notifyPeer(this.msgType(), e);
                }
            }
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
        var xy = e.eventXY(), el, uuid, item;
        if(DOM.isInScrollbar(xy.x, xy.y, this.view, this.getBounds())){
            return e.cancelDefault();
        }

        // Extract the item selecting login from _onclick by Chen Chao & Pan Mingfa
        // in 2014-06-18.
        //
        // For the old logic, the item only can be selected while it is clicked.
        // So that when we start to drag an item directly by mousedown, the current
        // "selected" will be from the latest selection except the current trigger
        // one and the moving data of the moveObject will be wrong.
        el = e.srcElement;
        item = this.cache[el.uuid];
        if(item && el === item.branch){
            return e.cancelDefault();
        }
        _doSelect.call(this, e);

        return e.cancelDefault();
    };

    thi$.destroy = function(){
        this.removeAllNodes(true);
        delete this.nodes;
        delete this.cache;
        delete this.selected;
        delete this.marked;
        delete this.dataProvider;

        var ele = this._treeView;
        delete this._treeView;
        DOM.remove(ele, true);

        ele = this._treeShell;
        delete this._treeShell;
        DOM.remove(ele, true);


        $super(this);

    }.$override(this.destroy);

    var _ondrag = function(e){
        this.notifyPeer(this.msgType(), e);
    };

    thi$.spotIndex = function(ele){
        var item = ele ? this.cache[ele.uuid] : null;
        return (item && item.canDrag()) ? item.spotIndex(ele) : -1;
    };

    thi$._init = function(def, Runtime, dataProvider){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Tree";
        def.className = def.className || "jsvm_tree";
        def.stateless = true;

        def.mover = def.mover || {};
        def.mover.longpress = def.mover.longpress || 10;
        def.multiEnable = (def.multiEnable === true);

        // Call base _init
        $super(this, def, Runtime);

        this._local.alwaysRemoveChild = def.alwaysRemoveChild;

        // Cache all tree items
        this.cache = {};
        this.selected = js.util.LinkedList.$decorate([]);
        this.marked = js.util.LinkedList.$decorate([]);

        this.showTip(def.showTip);

        var treeShell = this._treeShell = DOM.createElement("DIV");
        treeShell.className = DOM.combineClassName(this.className, "treeshell");
        treeShell.style.cssText = "position:relative;width:100%;height:100%;"
            + "overflow:visible;";
        DOM.appendTo(treeShell, this.view);

        var treeView = this._treeView = DOM.createElement("DIV");
        treeView.style.cssText = "position:relative;overflow:visible;"
            + "border:0 none;padding:0px;";
        DOM.appendTo(treeView, treeShell);

        this.setDataProvider(dataProvider ||
                             new js.awt.AbstractTreeDataProvider(this.Runtime()));

        if(def.nodes && def.nodes.length > 0){
            this.insertNodes(0, def.nodes);
        }

        this.attachEvent("mouseover",  0, this, _onmouseover);
        this.attachEvent("mouseout",   0, this, _onmouseover);
        this.attachEvent("click",      0, this, _onclick);
        this.attachEvent("dblclick",   0, this, _onclick);

        // Avoid autoscroll when drag item.
        this.attachEvent("mousedown",  0, this, _onmousedown);


        if(this.isMovable()){
            MQ.register(this.dataProvider.getDragMsgType(), this, _ondrag);
        }

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(js.awt.TreeDataFilter);

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
        delete this.imageMap;
        delete this.expandMap;
        delete this.dragMap;

        $super(this);

    }.$override(this.destroy);

    thi$._init = function(Runtime, imageMap, expandMap, dragMap){
        if(Runtime == undefined) return;

        this._local = this._local || {};

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

        $super(this);

    }.$override(this.releaseMoveObject);

    thi$.getPreferredSize = function(nocache){
        var ret = this.def.prefSize, ele, d,
            w = 0, h = 0, ch = 0;
        if(nocache === true || !ret){
            d = this.getBounds();
            w += d.MBP.BPW;
            h += d.MBP.BPH;

            ele = this.icon;
            if(ele){
                d = DOM.getBounds(ele);
                w += d.width + d.MBP.marginLeft + d.MBP.marginRight;
                ch = d.height;
            }

            ele = this.label;
            d = DOM.getBounds(ele);
            w += d.width + d.MBP.marginLeft + d.MBP.marginRight;
            h += Math.max(ch, d.height);

            ret = {width: w, height: h};
        }

        return ret;

    }.$override(this.getPreferredSize);

    thi$.repaint = function(){
        if($super(this)){
            var bounds = this.getBounds(), buf = new js.lang.StringBuffer(),
            left = bounds.MBP.paddingLeft, top = bounds.MBP.paddingTop,
            width = bounds.innerWidth, icon = this.icon;

            if(icon){
                buf.append("position:absolute;left:")
                    .append(left).append("px;")
                    .append("top:").append(top).append("px;");
                this.icon.style.cssText = buf.toString();

                bounds = this.icon.bounds;
                left += bounds.width + bounds.MBP.marginRight;
                width -= left;
            }

            buf.clear().append("position:absolute;left:")
                .append(left).append("px;").append("top:")
                .append(top).append("px;").append("width:")
                .append(width).append("px;");
            this.label.style.cssText = buf.toString();
        }

    }.$override(this.repaint);

    thi$._init = function(def, Runtime, tree){
        if(def === undefined) return;

        def.classType = "js.awt.TreeMoveObject";

        var treeClazz = tree.def.className || tree.className,
        selected = tree.selected;
        if(selected.length === 1){
            def.className = DOM.combineClassName(treeClazz, "moveobj0");
        }else{
            def.className = DOM.combineClassName(treeClazz, "moveobj1");
        }
        
        def.css = "position:absolute;";
        def.stateless = true;

        $super(this, def, Runtime);

        dataProvider = tree.dataProvider;

        var item = selected[0], icon = item ? item.icon : null,
        label, text = item.getText(), D;

        if(icon){
            D = DOM.getBounds(icon);

            icon = this.icon = icon.cloneNode(true);
            icon.bounds = System.objectCopy(D || {}, {}, true);
            DOM.appendTo(icon, this.view);
        }

        // Maybe current label has been highlighted
        label = this.label = item.label.cloneNode(true);
        label.innerHTML = js.lang.String.encodeHtml(text || "");
        DOM.appendTo(label, this.view);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(js.awt.MoveObject);
