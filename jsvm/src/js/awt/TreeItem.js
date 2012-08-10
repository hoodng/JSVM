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
    
    /**
     * @see js.awt.Item
     */
    thi$.getIconImage = function(){
        return this.treeContainer().getIconImage(this.def);
    }.$override(this.getIconImage);
    
    /**
     * Insert tree items into specified position
     * 
     * @param index
     * @param itemDefs, an array of tree item definition
     */
    thi$.insertNodes = function(index, itemDefs){
        var nodes = this.nodes, ibase = index, item, prev, next, 
        itemDef, i, len;

        if(!nodes){
            nodes = this.nodes = js.util.LinkedList.$decorate([]);
        }

        for(i=0, len=itemDefs.length; i<len; i++){
            itemDef = itemDefs[i];
            itemDef.level = this.def.level + 1;
            
            if(item && item.canCloneView(itemDef)){
                item = new js.awt.TreeItem(
                    itemDef, 
                    this.Runtime(), 
                    this.treeContainer(), 
                    this, 
                    item.cloneView());
            }else{
                item = new js.awt.TreeItem(
                    itemDef, 
                    this.Runtime(), 
                    this.treeContainer(), 
                    this);
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
        var nodes = this.nodes, cache = this.treeContainer().cache, item;
        while(nodes.length > 0){
            item = nodes.shift();
            delete cache[item.uuid()];
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
    
    var _addToDOM = function(item, refNode){
        item.updateLeaderStyle();
        DOM.insertAfter(item.view, refNode);
    };

    /**
     * Expand or Collapse an item
     * 
     * @param b, true for expanding and false for collapsing
     */    
    thi$.expand = function(b){
        var nodes = this.nodes, tree = this.treeContainer(),
        className = this.branch.clazz, refNode, i, len, item;

        b = b || false;
        this._local.expanded = b;

        if(b){
            this.branch.className = className + "_4";
            this.setIconImage(4);
            
            refNode = this.view;
            for(i=0, len=nodes.length; i<len; i++){
                item = nodes[i];
                _addToDOM.$delay(this, 1, item, refNode);
                refNode = item.view;
            }
        }else{
            for(i=nodes.length-1; i>=0; i--){
                item = nodes[i];
                if(item.isExpanded()){
                    item.expand(false);
                }
                item.removeFrom(item.view.parentNode);
            }
            this.branch.className = className + "_0";
            this.setIconImage(0);
        }
    };
    
    /**
     * Expand or collapse all items
     * 
     * @param b, true for expanding and false for collapsing
     */
    thi$.expandAll = function(b){
        this.expand(b);

        if(b){
            var nodes = this.nodes, i, len, item;
            for(i=0, len=nodes.length; i<len; i++){
                item = nodes[i];
                if(item.canExpand() && !item.isExpanded()){
                    item.expandAll(b);
                }
            }
        }
    };

    thi$.updateBranchStyle = function(){
        var ex = this.canExpand(),
        ps = this.prevSibling() != undefined,
        ns = this.nextSibling() != undefined,
        b = ((ex ? 4:0) | (ps ? 2:0) | (ns ? 1:0)),
        branch = this.branch;
        
        var className = this.className + "_branch" + b;
        branch.clazz = className;
        if(this.isTriggered()){
            branch.className = className + "_4";
        }else{
            branch.className = className + "_0";
        }
    };

    thi$.updateLeaderStyle = function(){
        var p = this.parentItem(), M = this.def, level = M.level,
        comps = M.items, comp;

        for(var i=level-1; i>=0; i--){
            comp = this[comps[i]];
            if(p.hasSibling()){
                comp.className = def.className + "_leader1";
            }else{
                comp.className = def.className + "_leader0";
            }
            p = p.parentItem();
        }
    };
    
    /**
     * @see js.awt.Item
     */
    thi$.canCloneView = function(itemDef){
        var items = [], level = itemDef.level;

        // Leaders
        for(var i=level; i>0; i--){
            items.unshift("leader"+i);
        };
        
        items.push("branch");
        if(itemDef.markable === true) items.push("marker");
        items.push("icon");
        items.push("label");

        return items.length === this.def.items.length;

    }.$override(this.canCloneView);
    
    var _checkItems = function(def, tree, parent){
        var level = def.level, items = def.items;

        // Leaders
        for(var i=level; i>0; i--){
            items.unshift("leader"+i);
        };
        
        items.push("branch");
        if(def.markable === true) items.push("marker");
        items.push("icon");
        items.push("label");

    };

    thi$.destroy = function(){
        delete this._local.parent;
        delete this._local.prev;
        delete this._local.next;
        
        this.removeAllNodes();
        delete this.nodes;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$._init = function(def, Runtime, tree, parent, view){
        if(def == undefined) return;

        _setTreeContainer.call(this, tree);

        def.classType = def.classType || "js.awt.TreeItem";
        def.className = tree.className + "_item";
        def.css = "position:relative;overflow:visible;width:100%;";
        
        if(view == undefined){
            def.items = js.util.LinkedList.$decorate([]);

            def.level = Class.isNumber(def.level) ? def.level : 0;
            _checkItems.call(this, def);
        }

        arguments.callee.__super__.apply(this, [def, Runtime, view]);

        _setParentItem.call(this, parent);
        
        tree.cache[this.uuid()] = this;

        if(def.nodes && def.nodes.length > 0){
            this.insertNodes(0, def.nodes);
        }

    }.$override(this._init);

    this._init.apply(this, arguments);


}.$extend(js.awt.Item);

