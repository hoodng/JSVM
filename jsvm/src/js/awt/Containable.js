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
        
        // @link js.lang.Object#setContextID
        var eleDef = ele.def;
        if(!eleDef["__contextid__"]){
            ele.setContextID(this.uuid());
        }

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

    /**
     * Replace id of the element with the new one.
     * 
     * @param {String} id The id of the element to handle.
     * @param {String} newid
     */     
    thi$.replaceElementId = function(id, newid){
        _check.call(this);

        var ele = this[id];
        delete this[id];

        this[newid] = ele;
        if(ele){
            if(ele.id){
                ele.id = newid;
            }

            if(ele.view){
                ele.view.id = newid;
            }
        }

        this.def.items.replace(id, newid);
        this._local.items.replace(id, newid);
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
                this.removeChild(ele);
                if(gc == true){
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
