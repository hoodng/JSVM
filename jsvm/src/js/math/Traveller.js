/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.math");

/**
 * 
 */
js.math.Traveller = new (function(){

    this.trave = function(handler, node, level){
        var nodes;

        level = level || 0;

        handler.apply(node, level);
        
        if(handler.isLeaf()) return;

        nodes = handler.getMembers();
        for(var i=0, len=nodes.length; i<len; i++){
            this.trave(handler, nodes[i], level+1);
        }
    };

})();

js.math.TraveHandler = function(data){

    var CLASS = js.math.TraveHandler, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;

    thi$.apply = function(node, level){
        this.node = node;

        var U = this._local, levels = U.levels,
            lnodes = levels[level], path, i;

        if(!lnodes){
            lnodes = levels[level] = [];
        }
        
        lnodes.push(node);
        
        if(this.isLeaf()){
            path = [];
            for(i=0; i<=level; i++){
                lnodes = levels[i];
                path.push(lnodes[lnodes.length-1]);
            }
            U.paths.push(path);
        }        
    };

    thi$.getPath = function(index){
        return this._local.paths[index];
    };

    thi$.getDeepth = function(){
        var U = this._local, levels = U.levels;
        return levels.length;
    };

    thi$.getBreadth = function(){
        var U = this._local, paths = U.paths;
        return paths.length;
    };

    thi$.isLeaf = function(){
        var nodes = this.getMembers();
        return !Class.isArray(nodes);
    };

    thi$.getMembers = function(){
        return this.node.nodes;
    };

    thi$._init = function(data){
        if(data === undefined) return;

        this._local = {};
        
        var U = this._local;
        U.levels = [];
        U.paths  = [];
    };

    this._init.apply(this, arguments);
    
};
