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
 * 
 */
js.awt.Containable = function(){

    var CLASS = js.awt.Containable, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, 
        DOM = J$VM.DOM, System = J$VM.System, MQ = J$VM.MQ,
        List= js.util.LinkedList;

    var _check = function(){
        var M = this.def, U = this._local;
        
        M.items = M.items || [];
        if(!M.items.remove0){
            List.$decorate(M.items);
        }

        U.items = U.items || [];
        if(!U.items.remove0){
            List.$decorate(U.items);
        }
    };

    thi$.appendChild = function(ele){
        _check.call(this);

        var M = this.def, U = this._local,
            id = ele.id, 
            index = M.items.length, 
            index0 = U.items.length;

        return this._insert(M, U, index, index0, id, ele, null);

    };

    thi$.insertChildBefore = function(ele, ref){
        _check.call(this);
        
        var M = this.def, U = this._local,
            id = ele.id, rid = this.getID(ref),
            index = M.items.indexOf(rid),
            index0= U.items.indexOf(rid);

        ref = this[rid];

        index = index > 0 ? index  : 0;
        index0= index0> 0 ? index0 : 0;

        return this._insert(M, U, index, index0, id, ele, ref);

    };

    thi$.insertChildAfter = function(ele, ref){
        _check.call(this);
        
        var M = this.def, U = this._local,
            id = ele.id, rid = this.getID(ref),
            index = M.items.indexOf(rid),
            index0= U.items.indexOf(rid);

        ref = this[M.items[index + 1]]; // ref = this[rid];
        if(ref && ref.isAlwaysOnTop() && index === M.items.length-1){
            throw "Reference child ["+rid+"] is always on top";
        }
        
        index = index > 0 ? (index + 1) : M.items.length;
        index0= index0> 0 ? (index0+ 1) : U.items.length;

        return this._insert(M, U, index, index0, id, ele, ref);

    };

    thi$._insert = function(M, U, index, index0, id, ele, ref){
        M.items.add(index, id);
        M[id] = ele.def;
        
        U.items.add(index0, id);
        this[id] = ele;

        ele.setContainer(this);

        if(Class.isHtmlElement(ele.view)){
            if(ref && ref.view){
                ele.insertBefore(ref.view, this.view);
            }else{
                ele.appendTo(this.view);
            }
        }

        return ele;
    };

    thi$.removeChild = function(ele){
        _check.call(this);
        
        var M = this.def, U = this._local,
            id = this.getID(ele); 
        
        ele = this[id];
        if(ele === undefined) return undefined;

        M.items.remove(id);
        delete M[id];

        U.items.remove(id);
        delete this[id];

        delete ele.container;

        if(Class.isHtmlElement(ele.view)){
            ele.removeFrom(this.view);
        }
        
        return ele;
    };

    thi$.getElementById = function(id){
        return this[id];
    };

    thi$.getElements = function(filter){
        filter = filter || function(ele){
            return true;
        };

        var ret = [], items = this.items0(), ele;
        for(var i=0, len=items.length; i<len; i++){
            ele = this[items[i]];
            if(filter(ele)){
                ret.push(ele);
            }
        }
        return ret;
    };

    thi$.getElementsCount = function(){
        return this.def.items.length;
    };

    /**
     * Gets the component id list in current order
     */
    thi$.items = function(){
        return this.def.items || [];
    };

    /**
     * Gets the component id list in original order
     */
    thi$.items0 = function(){
        return this._local.items || [];
    };

    thi$.indexOf = function(ele){
        var id = this.getID(ele);
        return this.items().indexOf(id);
    };

    /**
     * Remove all elements in this container
     * 
     * @param gc, whether do gc
     */
    thi$.removeAll = function(gc){
        _check.call(this);

        var M = this.def, U = this._local,
            items = this.items0(), id, ele;
        
        while(items.length > 0){
            id = items[0];
            ele = this[id];
            
            if(ele){
                if(gc !== true){
                    this.removeChild(ele);
                }else{
                    ele.destroy();
                }
            }
            
            // TODO:
            // For Component, in its destroy method, it can be removed from
            // its container. Meanwhile, clean the cached id. 
            // But for GraphicContainer, it doesn't do that. So we do following
            // thing to keep it work right.
            items.remove(id);
            delete this[id];
        }

        M.items.clear();
    };

};
