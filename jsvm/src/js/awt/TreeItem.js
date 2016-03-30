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
 * @param def :{
 *     id: ..
 *     text:
 *     markable: true/false, indicates
 * }
 */
js.awt.TreeItem = function(def, Runtime, tree, parent, view){

    var CLASS = js.awt.TreeItem, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    thi$.setText = function(text){
        this.def.text = text;
        this.label.innerHTML = js.lang.String.encodeHtml(text);
    };

    thi$.getText = function(){
        return this.def.text;
    };

    thi$.treeContainer = function(){
        return this.getPeerComponent();
    };

    var _setTreeContainer = function(tree){
        this.setPeerComponent(tree);
    };

    thi$.isMovable = function(){
        return this.treeContainer().isMovable() && this.canDrag();
    };

    thi$.spotIndex = function(){
        return 11;
    };

    thi$.isMoverSpot = function(ele, x, y){
        return this.isMovable();
    };

    thi$.getMoveObject = function(e){
        return this.treeContainer().getMoveObject(e);
    };

    thi$.getMovingConstraints = function(){
        return this.treeContainer().getMovingConstraints();
    };

    thi$.parentItem = function(){
        return this._local.parent;
    };

    var _setParentItem = function(parent){
        this._local.parent = parent || this;
    };

    thi$.hasSibling = function(){
        return this.nextSibling() != undefined;
    };

    thi$.prevSibling = function(prev){
        if(prev !== undefined){
            this._local.prev = prev;
        }
        return this._local.prev;
    };

    thi$.nextSibling = function(next){
        if(next !== undefined){
            this._local.next = next;
        }
        return this._local.next;
    };

    thi$.hasChildren = function(){
        var nodes = this.nodes;
        return (nodes && nodes.length > 0) || false;
    };

    thi$.canDrag = function(){
        var tree = this.treeContainer();
        return tree.canDrag(this.def);
    };

    thi$.canExpand = function(){
        var tree = this.treeContainer();
        return (tree.canExpand(this.def) || this.nodes);
    };

    thi$.isExpanded = function(){
        return this._local.expanded;
    };

    thi$.isShowTip = function(){
        return this._local.showTip;
    };

    thi$.alwaysRemoveChild = function(){
        var tree = this.treeContainer();
        return tree.alwaysRemoveChild();
    };

    /**
     * @see js.awt.Item
     */
    thi$.getIconImage = function(){
        return this.treeContainer().getIconImage(this.def);
    }.$override(this.getIconImage);

    /**
     * @method
     * @inheritdoc js.awt.Item#isIconStateless
     */
    thi$.isIconStateless = function(){
        var tree = this.treeContainer();
        return tree.isIconStateless(this.def);
    };

    /**
     * Insert tree items into specified position
     *
     * @param index
     * @param itemDefs, an array of tree item definition
     */
    thi$.insertNodes = function(index, itemDefs){
        var nodes = this.nodes, ibase = index, item, refItem,
        prev, next, itemDef, cview, clazz, i, len,
        tree = this.treeContainer(), isVisible;

        if(!nodes){
            nodes = this.nodes = js.util.LinkedList.$decorate([]);
        }

        for(i=0, len=itemDefs.length; i<len; i++){
            itemDef = itemDefs[i];
            itemDef.level = this.def.level + 1;

            isVisible = tree.isNodeVisible(itemDef) && this.isVisible();
            if(!isVisible){
                if(!tree.isAlwaysCreate()){ // skip this item
                    continue;
                }else{ // make item invisible
                    itemDef.state = 16;
                }
            }

            if(this.isShowTip()){
                itemDef.tip = itemDef.tip || itemDef.dname;
                itemDef.showTip = true;
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
                clazz = tree.def.className || tree.className;
                clazz = itemDef.className = DOM.combineClassName(clazz, "item");
            }

            refItem = item;
            if(!cview){
                item = new js.awt.TreeItem(
                    itemDef,
                    this.Runtime(),
                    tree,
                    this);
            }else{
                // Ref: js.awt.Component#_init
                cview.clazz = clazz;

                item = new js.awt.TreeItem(
                    itemDef,
                    this.Runtime(),
                    tree,
                    this,
                    cview);
            }

            prev = ibase > 0 ? nodes.get(ibase - 1) : undefined;
            next = ibase < nodes.length ? nodes.get(ibase + 1) : undefined;

            nodes.add(ibase, item);

            if(prev){
                prev.nextSibling(item);
            }

            if(next){
                next.prevSibling(item);
            }

            item.prevSibling(prev);
            item.nextSibling(next);

            ibase++;
        };

        // Update marker style
        for(i=0, len=nodes.length; i<len; i++){
            nodes[i].updateBranchStyle();
        }
    };

    /**
     * Remove tree items from index to index + length
     */
    thi$.removeNodes = function(index, length){
        var nodes = this.nodes || [], cnt = nodes.length,
        tree = this.treeContainer(), cache = tree.cache,
        marked = tree.marked, selected = tree.selected,
        item;

        if(!Class.isNumber(index)){
            index = 0;
        }else{
            index = index < 0 ? 0 : (index >= cnt ? cnt - 1 : index);
        }

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
    };

    thi$.removeAllNodes = function(){
        var nodes = this.nodes;
        if(nodes){
            this.removeNodes(0, nodes.length);
        }
    };

    /**
     * Gets nodes of this item
     *
     * @param from, can be start TreeItem object or start index
     * @param to, can be end TreeItem object or end index or null,
     * @param filter, the filter function(itemDef) which return true or false
     * @param recursive, true or false
     * @param ret, the return array
     */
    thi$.getNodes = function(from, to, filter, recursive, ret){
        var nodes = this.nodes,
        i0 = Class.isNumber(from) ? from : ((from == null) ? 0 : nodes.indexOf(from)),
        i1 = Class.isNumber(to) ? to : ((to == null) ? nodes.length-1 : nodes.indexOf(to)),
        start = i0 < i1 ? i0:i1, end = i1 > i0 ? i1 : i0,
        i, item;

        ret = ret || [];
        for(i = start; i<=end; i++){
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

    var _addToDOM = function(item, refNode, isLast){
        if(item.destroied === true){
            return;
        }

        item.updateLeaderStyle();
        DOM.insertAfter(item.view, refNode);

        if(item.view.parentNode){
            item.showDisableCover(!item.isEnabled());
        }

        if(isLast){
            //nofity
            _afterExpand.call(this);
        }
    };

    var _afterExpand = function(){
        var peer = this.getPeerComponent();
        if(peer && typeof peer.onAfterExpand === "function"){
            peer.onAfterExpand();
        }
        //this.dashboard.postMQ("js.awt.event.GadgetChange", "", []);
    };

    thi$.isExpanding = function(){
        return this._local.expanding;
    };

    thi$.setExpanding = function(b){
        this._local.expanding = b;
    };

    /**
     * Expand or Collapse an item
     *
     * @param b, true for expanding and false for collapsing
     * @param needNotify, false for don't nofity the tree to do AfterExpand,others do.
     * @param root, mean it is the outermost layer of recursive,undefined is the outermost layer recursive
     */
    thi$.expand = function(b, needNotify, root){
        if(!this.isEnabled()){
            return;
        }

        this.setExpanding(false);

        var tree = this.treeContainer(), className = this.branch.clazz,
        nodes = this.nodes || [], len = nodes.length, refNode, i, item;

        b = b || false;
        this._local.expanded = b;

        if(b){
            this.branch.className = DOM.combineClassName(className, "4");
            this.setIconImage(4);
            refNode = this.view;

            for(i = 0; i < len; i++){
                item = nodes[i];
                _addToDOM.$delay(this, 1, item, refNode,
                                 ((i == len-1) && (needNotify != false)));
                refNode = item.view;
            }
        }else{
            // If the "alwaysRemoveChild" adjustment return true, that will
            // indicate all sub-nodes always need be fetch again while an item
            // is expanding and the sub-items also need be removd while the
            // parent item is collapsing. So that, the 'nodes' of current item
            // are always changing. The length of the 'nodes' is decreasing.
            // Loop from len - 1 will be better.
            for(i = len - 1; i >= 0; i--){
                item = nodes[i];
                if(item.isExpanded()){
                    item.expand(false, undefined, item);
                }
                if(this.alwaysRemoveChild()){
                    tree.removeNode(item);

                }else{
                    item.removeFrom(item.view.parentNode);
                }
            }

            if(this.alwaysRemoveChild()){
                delete this.def.nodes;
            }

            this.branch.className = DOM.combineClassName(className, "0");
            this.setIconImage(0);
            //notify
            if(needNotify != false && root == undefined){
                _afterExpand.call(this);
            }
        }
    };

    /**
     * Expand or collapse all items
     *
     * @param b, true for expanding and false for collapsing
     * @param root, mean it is the outermost layer of recursive,undefined is the outermost layer recursive
     */
    thi$.expandAll = function(b, root){
        if(!this.isEnabled()){
            return;
        }

        this.expand(b, false);

        if(b){
            var nodes = this.nodes, i, len, item;
            if(nodes && this.nodes.length > 0){
                for(i=0, len=nodes.length; i<len; i++){
                    item = nodes[i];
                    if(item.canExpand() && !item.isExpanded()){
                        item.expandAll(b, this);
                    }
                }
            }
        }

        //notify
        if(!root){
            _afterExpand.$delay(this, 1);
        }
    };

    thi$.doLayout = function(){
        if(this.label && this.controller){
            var ele = this.label, b, left;
            b = ele.scrollWidth;
            left = ele.offsetLeft;
            this.controller.setPosition(b+left);
        }
    }.$override(this.doLayout);

    thi$.adjustCover = function(bounds){
        $super(this);

        if(this._coverView){
            this._coverView.style.width = "100%";
        }

    }.$override(this.adjustCover);

    thi$.updateBranchStyle = function(){
        var ex = this.canExpand(),
        ps = this.prevSibling() != undefined,
        ns = this.nextSibling() != undefined,
        b = ((ex ? 4 : 0) | (ps ? 2 : 0) | (ns ? 1 : 0)),
        bClassName = DOM.combineClassName(this.className, "branch"),
        branch = this.branch;

        if(this.isEnabled()){
            bClassName = DOM.combineClassName(bClassName, b, "");

            branch.clazz = bClassName;
            bClassName = DOM.combineClassName(bClassName,
                                              (this.isTriggered() ? "4" : "0"));
        }else{
            branch.clazz = bClassName;
            bClassName = DOM.combineClassName(bClassName, "1");
        }

        branch.className = bClassName;
    };

    thi$.updateLeaderStyle = function(){
        var p = this.parentItem(), M = this.def, level = M.level,
        comps = M.items, comp;

        for(var i=level-1; i>=0; i--){
            comp = this[comps[i]];
            if(p.hasSibling()){
                comp.className = DOM.combineClassName(this.className, "leader1");
            }else{
                comp.className = DOM.combineClassName(this.className, "leader0");
            }
            p = p.parentItem();
        }
    };

    /**
     * @see js.awt.Item
     */
    thi$.canCloneView = function(itemDef){
        var items = [], indent = itemDef.indent, level = itemDef.level;

        // Indent in the same level
        if(indent > 0){
            for(var i = indent; i > 0; i--){
                items.unshift("leader");
            }
        }

        // Leaders
        for(var i=level; i>0; i--){
            items.unshift("leader"+i);
        };

        items.push("branch");
        if(itemDef.markable === true){
            items.push("marker");
        }

        if(itemDef.iconic !== false){
            items.push("icon");
        }
        items.push("label");

        return items.length === this.def.items.length;

    }.$override(this.canCloneView);

    var _checkItems = function(def, tree, parent){
        var indent = def.indent, level = def.level, items = def.items;

        // Indent in the same level
        if(indent > 0){
            for(var i = indent; i > 0; i--){
                items.unshift("leader");
            }
        }

        // Leaders
        for(var i=level; i>0; i--){
            items.unshift("leader"+i);
        };

        items.push("branch");
        if(def.markable === true){
            items.push("marker");
        }

        if(def.iconic !== false){
            items.push("icon");
        }
        items.push("label");

    };

    thi$.destroy = function(){
        delete this._local.parent;
        delete this._local.prev;
        delete this._local.next;

        this.removeAllNodes();
        delete this.nodes;

        $super(this);

    }.$override(this.destroy);

    thi$._init = function(def, Runtime, tree, parent, view){
        if(def == undefined) return;

        _setTreeContainer.call(this, tree);

        def.classType = def.classType || "js.awt.TreeItem";
        def.className = def.className
            || DOM.combineClassName(tree.def.className || tree.className, "item");
        def.css = "position:relative;overflow:visible;width:100%;";

        if(view == undefined){
            def.items = js.util.LinkedList.$decorate([]);

            def.level = Class.isNumber(def.level) ? def.level : 0;
            _checkItems.call(this, def);
        }

        $super(this, def, Runtime, view);

        _setParentItem.call(this, parent);

        tree.cache[this.uuid()] = this;

        this._local.showTip = def.showTip || false;

        if(def.nodes && def.nodes.length > 0){
            this.insertNodes(0, def.nodes);
        }

    }.$override(this._init);

    this._init.apply(this, arguments);


}.$extend(js.awt.Item);
