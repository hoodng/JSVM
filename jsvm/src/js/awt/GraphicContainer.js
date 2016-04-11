/**

  Copyright 2010-2011, The JSVM Project. 
  All rights reserved.
  
 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

$import("js.awt.Containable");
$import("js.awt.GraphicElement"); 
$import("js.awt.ZOrderManager");

/**
 * 
 */
js.awt.GraphicContainer = function(def, Grahpics2D){

    var CLASS = js.awt.GraphicContainer, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event,
        System = J$VM.System, MQ = J$VM.MQ,
        G = Class.forName("js.awt.Graphics2D");

    /**
     * Return the GraphicLayer that this group belong to
     */
    thi$.getLayer = function(){
        var p = this.getContainer();
        while(p && !p.instanceOf(js.awt.GraphicLayer)){
            p = p.getContainer();
        }
        return p;
    }.$override(this.getLayer);

    /**
     * Return the Renderer of this type layer
     */
    thi$.getRenderer = function(){
        return this.getLayer().getRenderer();
    };

    /**
     * Get context of this layer
     */
    thi$.getContext = function(hit){
        
    };

    thi$.repaint = function(){

    };

    /**
     * Sets style.display = none/blcok
     */
    thi$.display = function(show){
        if(show === false){
            this.view.style.display = "none";
        }else{
            this.view.style.display = "block";
        }
    }.$override(this.display);

    /**
     * @see js.awt.Containable
     */
    thi$._insert = function(){
        var ele = $super(this);

        if(ele.instanceOf(js.awt.GraphicElement)){
            var cache = this.getLayer().cachedShapes();
            cache[ele.colorKey().uuid] = ele;
        }

        this.fireEvent(new Event(
            G.Events.ITEMS_CHANGED,{}, this), true);

        return ele;

    }.$override(this._insert);

    /**
     * @see js.awt.Containable
     */
    thi$.removeChild = function(){
        var ele = $super(this);

        if(ele && ele.instanceOf(js.awt.GraphicElement)){
            var layer = this.getLayer(), cache = layer ? layer.cachedShapes() : null;
            if(cache){
                delete cache[ele.colorKey().uuid];
            }
        }
        
        this.fireEvent(new Event(
            G.Events.ITEMS_CHANGED,{}, this), true);

        return ele;

    }.$override(this.removeChild);

    /**
     * @see js.awt.Containable
     */
    thi$.removeAll = function(gc){
        var items = this.items() || [], i, len, ele, 
            layer = this.getLayer(), 
            cache = layer ? layer.cachedShapes() : null;

        if(cache){
            for(i=0, len=items.length; i<len; i++){
                ele = this[items[i]];
                if(ele && ele.colorKey){
                    delete cache[ele.colorKey().uuid];
                }
            }
        }

        $super(this);

        this.fireEvent(new Event(
            G.Events.ITEMS_CHANGED,{}, this), true);

    }.$override(this.removeAll);
    
    thi$.destroy = function(){
        this.removeAll(true);
        $super(this);
        
    }.$override(this.destroy);

    thi$._init = function(def, Grahpics2D){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.GraphicContainer";
        
        var tmp = def.zorder;
        def.zorder = Class.isBoolean(tmp) ? tmp : true;

        $super(this);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.GraphicElement).$implements(js.awt.Containable, js.awt.ZOrderManager);

