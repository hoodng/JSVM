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
 * Source code availability: http://github.com/jsvm
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
                path.push(lnodes.length-1);
            }
            U.paths.push(path);
        }        
    };

    thi$.getPath = function(index){
        var U = this._local, ret = [], i, len,
            levels = U.levels, paths = U.paths, 
            path = paths[index];
        
        for(i=0, len=path.length; i<len; i++){
            ret.push(levels[i][path[i]]);
        }

        return ret;
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
