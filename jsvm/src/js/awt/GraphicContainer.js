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

$package("js.awt");

$import("js.awt.Containable"); 
$import("js.awt.Element"); 
$import("js.util.Observer");
$import("js.awt.GraphicShape");
$import("js.awt.ZOrderManager");

/**
 * 
 */
js.awt.GraphicContainer = function(def, Runtime){

    var CLASS = js.awt.GraphicContainer, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ;

    /**
     * Return the Grahpics2D container that this group belong to
     */
    thi$.getGraphic = function(){
        var p = this.getContainer();
        while(p.classType() !== "js.awt.Graphics2D"){
            p = p.getContainer();
        }
        return p;
    };

    thi$.isCapture = function(){
        var cap = this.def.capture || false;
        return cap & this.getContainer().isCapture();
    };

    /**
     * @see js.util.Observer
     */
    thi$.update = function(observable, data){
        this.setChanged();
        this.notifyObservers(this);
    }.$override(this.update);

    /**
     * @see js.awt.Containable
     */
    thi$._insert = function(){
        var ele = arguments.callee.__super__.apply(this, arguments);
        if(ele.addObserver){
            ele.addObserver(this);
        }
        
        if(ele.instanceOf(js.awt.GraphicShape)){
            var cache = this.getGraphic().cachedShapes();
            cache[ele.colorKey().rgba] = ele;
        }

        this.update();
        
        return ele;

    }.$override(this._insert);

    /**
     * @see js.awt.Containable
     */
    thi$.removeChild = function(){
        var ele = arguments.callee.__super__.apply(this, arguments);
        if(ele.deleteObserver){
            ele.deleteObserver(this);
        }

        if(ele.instanceOf(js.awt.GraphicShape)){
            var cache = this.getGraphic().cachedShapes();
            delete cache[ele.colorKey().rgba];
        }

        this.update();
        
        return ele;

    }.$override(this.removeChild);

    /**
     * @see js.awt.Containable
     */
    thi$.removeAll = function(){
        var items = this.items(), i, len, ele, 
            cache = this.getGraphic().cachedShapes();
        
        for(i=0, len=items.length; i<len; i++){
            ele = this[items[i]];
            if(ele.colorKey){
                delete cache[ele.colorKey().rgba];
            }
        }

        arguments.callee.__super__.apply(this, arguments);

        this.update();

    }.$override(this.removeAll);

    thi$.setAttr = function(key, value){
        arguments.callee.__super__.apply(this, arguments);
        this.update();
    }.$override(this.setAttr);

    thi$.getAttr = function(key){
        var v = arguments.callee.__super__.apply(this, arguments), p;
        if(!v){
            p = this.getContainer();
            v = p ? p.getAttr(key) : undefined;
        }
        return v;
    }.$override(this.getAttr);

    thi$.repaint = function(){
    };

    thi$.draw = function(){
        _checkDrawEnd.call(this);
    };

    var _onDrawEnd = function(e){
        var U = this._local;

        U.dirtyCount--;
        
        _checkDrawEnd.call(this);
    };

    var _checkDrawEnd = function(){
        if(this._local.dirtyCount === 0){
            this.notifyContainer(
                "graphic.draw.end", 
                new Event("group.draw", {}, this));
        }
    };

    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.GraphicContainer";
        
        var zorder = def.zorder;
        def.zorder = Class.isBoolean(zorder) ? zorder : true;

        arguments.callee.__super__.apply(this, arguments);

        this.def.items = [];
        this._local.items = [];
        
        MQ.register("graphic.draw.end", this, _onDrawEnd);
        
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Element).$implements(
    js.awt.Containable, js.awt.ZOrderManager, js.util.Observer);

