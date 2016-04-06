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

$import("js.awt.Component");
$import("js.awt.Containable");
$import("js.awt.ZOrderManager");

/**
 * A generic container object is a component that can contain other components.<p>
 * A container has below properties in its model:
 * @param def :{
 *     zorder : true/false
 *     layout : {classType, setting, status}, see also 
 *              <code>js.awt.Layout</code>
 *     items :array of children components ID,
 *     id : the <em>model</em> of child component.
 * 
 * }
 * @param Runtime, see also js.awt.Component
 * @param view, see also js.awt.Component
 */
js.awt.Container = function (def, Runtime, view){
    
    var CLASS = js.awt.Container, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM, 
    System = J$VM.System, MQ = J$VM.MQ, List = js.util.LinkedList;

    /**
     * Add the component to the container
     * 
     * @param comp, component
     */
    thi$.addComponent = function(comp, constraints){
        return this.insertComponent(undefined, comp, constraints);
    };
    
    /**
     * Insert a component to the container.
     * 
     * @param index: {Number} An integer number to indicate the insert position
     * @param comp: {Component} The component to insert
     * @constraints: {Object | String} The layout constraints of the inserting component
     */
    thi$.insertComponent = function(index, comp, constraints){
        var items = this.items0(), ref;

        if(constraints){
            comp.def.constraints = constraints;            
        }

        if(!isNaN(index) && index >= 0 && index < items.length){
            ref = this.getElementById(items[index]);
        }

        if(this.layout instanceof js.awt.AbsoluteLayout){
            comp.view.style.position = "absolute";
        }
        
        if(ref){
            this.insertChildBefore(comp, ref);
        }else{
            this.appendChild(comp);
        }

        this.zOrderAdjust();

        return comp;
    };
    
    /**
     * Get the component with the specified component id
     */
    thi$.getComponent = function(id){
        return this.getElementById(id);
    };
    
    /**
     * Return all components 
     */
    thi$.getAllComponents = function(filter){
        return this.getElements(filter);
    };
    
    /**
     * Remove the component with specified component id
     * 
     * @param comp, the component or component id
     */
    thi$.removeComponent = function(comp){
        comp = this.removeChild(comp);

        if(this._local.active === comp){
            this._local.active = undefined;
        }

        this.zOrderAdjust();

        return comp;
    };

    thi$.removeAll = function(gc){
        $super(this, gc);

        if(this.layout){
            this.layout.invalidateLayout();
        }

    }.$override(this.removeAll);
    
    /**
     * Activate the component with specified component or id
     * 
     * @param {js.awt.Element / String} e A component or its id
     */
    thi$.activateComponent = function(e){
        var id, comp;
        if(e instanceof Event){
            id = e.getEventTarget().id;
        }else if(e instanceof js.awt.Element){
            id = e.id;
        }else{
            id = e;
        }

        comp = this[id];

        if(comp === undefined){
            return undefined;
        }

        if(this.isZOrder()){
            this.bringCompToFront(comp, 0x07);
        }

        // If this container is activateman == true, then 
        // this function will change current component state 
        // to activated, and other components to un-activated.
        if(this.def.activateman == true){
            comp.setActivated(true);
            this._local.active = comp;
            
            (function(compid){
                 if(compid != id){
                     this.getComponent(compid).setActivated(false);
                 }
             }).$forEach(this, this.def.items);
        }

        this.activate();
        
        return id;

    };
    
    /**
     * Return current active component;
     */
    thi$.getActiveComponent = function(){
        return this._local.active;
    };
    
    /**
     * Set <em>LayoutManager</em> for this container
     * 
     * @see js.awt.LayoutManager
     */
    thi$.setLayoutManager = function(layout){
        if(layout instanceof js.awt.LayoutManager){
            this.layout = layout;
        }
    };
    
    /**
     * Layout components
     */
    thi$.layoutComponents = function(force){
        if(this.layout.instanceOf(js.awt.LayoutManager)){
            this.layout.layoutContainer(this, force);
        }
    };

    /**
     * Return all need layout components id
     */
    thi$.getLayoutComponents = function(){
        return this.items0();
    };
    
    /**
     * Return the amount of the components
     */
    thi$.getComponentCount = function(){
        return this.getElementsCount();
    };

    /**
     * Test if contains the component
     */
    thi$.contains = function(c, containSelf){
        var id;
        switch(Class.typeOf(c)){
        case "string":
            id = c;
            break;
        case "object":
            // Maybe a js.awt.Component instance
            id = c.id;
            break;
        case "null":
        case "undefined":
            return false;
        default:
            // Maybe html element
            return $super(
                this, c, containSelf);
        }

        return this[id] != undefined;

    }.$override(this.contains);

    /**
     * @see js.awt.Element#elementFromPoint
     */
    thi$.elementFromPoint = function(x, y, nothese){
        var ret = null, ids, i, comp;
        if((!nothese || !nothese.$contains(this)) &&
            this.inside(x, y)){
            ids = this.items();
            for(i=ids.length-1; i>=0; i--){
                comp = this.getElementById(ids[i]);
                if(!comp) continue;
                if(nothese && nothese.$contains(comp)) continue;
                ret = comp.elementFromPoint(x, y, nothese);
                if(ret) break;
            }
            ret = (ret || this); 
        }
        return ret;
    }.$override(this.elementFromPoint);

    /**
     * @see js.awt.Element#elementsFromPoint
     */
    thi$.elementsFromPoint = function(x, y, nothese, result){
        var ret = null, ids, i, comp;

        result = result || [];
        if((!nothese || !nothese.$contains(this)) &&
            this.inside(x, y)){

            result.push(this);

            ids = this.items();
            for(i=ids.length-1; i>=0; i--){
                comp = this.getElementById(ids[i]);
                if(nothese && nothese.$contains(comp)) continue;
                comp.elementsFromPoint(x, y, nothese, result);
            }
        }

        return result;

    }.$override(this.elementsFromPoint);

    /**
     * For container, if some children are container, when the parent container
     * starts to doing layout, the child container's getPreferredSize will be
     * invoked base on current layout result. However, current child container's
     * layout didn't be done. The calculated result will be wrong.
     * 
     * @method
     * @inheritdoc js.awt.Component#getPreferredSize
     */
    thi$.getPreferredSize = function(){
        // var size = this.def.prefSize, 
        // didLayout = this._local.didLayout;
        // if(!size && didLayout){
        //     return this.layout.preferredLayoutSize(this);
        // }else{
        //     return $super(this);
        // }
        
        return $super(this);

    }.$override(this.getPreferredSize);

    /**
     *  @see js.awt.Component
     */
    thi$.getMinimumSize = function(){
        var size = this.def.miniSize, 
        didLayout = this._local.didLayout;
        if(!size && didLayout){
            return this.layout.minimumLayoutSize(this);
        }else{
            return $super(this);
        }
    }.$override(this.getMinimumSize);

    /**
     * @see js.awt.Component
     */
    thi$.getMaximumSize = function(nocache){
        var size = this.def.maxiSize,
        didLayout = this._local.didLayout;;
        if(!size && didLayout){
            return this.layout.maximumLayoutSize(this);
        }else{
            return $super(this);
        }
    }.$override(this.getMaximumSize);

    /**
     * Calculate and return the size which is enough for placing all the
     * visible components
     * 
     * @return {Object}
     */
    thi$.getScrollSize = function(){
        var D = this.getBounds(), MBP = D.MBP, items = this.items0(),
        x0 = D.absX, y0 = D.absY, x1 = x0, y1 = y0, i, len, comp, box;

        for(i = 0, len = items.length; i < len; i++){
            comp = this[items[i]];
            if(!comp || !comp.isVisible()){
                continue;
            }

            box = comp.getBounds();
            x1 = Math.max(x1, box.absX + box.width);
            y1 = Math.max(y1, box.absY + box.height);
        }

        return {
            width: x1 - x0 + MBP.paddingRight + MBP.borderRightWidth,
            height: y1 - y0 + MBP.paddingBottom + MBP.borderBottomWidth  
        };
    };
    
    /**
     * @see js.awt.Component
     */
    thi$.repaint = function(){
        if($super(this)){
            var comps = this.items0(), i, len, comp;
            for(i=0, len= comps.length; i<len; i++){
                comp = this[comps[i]];
                comp.repaint();
            }

            return true;
        }

        return false;

    }.$override(this.repaint);
    
    /**
     * Return whether this container size is auto fit content
     */
    thi$.isAutoFit = function(){
        return this.def.autofit === true;
    };

    /**
     * 
     */
    thi$.autoResize = function(){
        if(!this.isAutoFit()) return;
        
        var bounds = this.getBounds(), 
        prefer = this.getPreferredSize(),
        w = bounds.userW, h = bounds.userH;

        w = (prefer.width > w) ? prefer.width : w;
        h = (prefer.height> h) ? prefer.height: h;

        var container = this.getContainer();
        if(container){
            container.doLayout();
        }else{
            this.setSize(w, h);    
        }
    };

    /**
     * @see js.awt.Component
     */
    thi$.doLayout = function(force, bounds, noupdate){
        if($super(this)){
            this.layoutComponents(force);
            return true;
        }
        return false;
    }.$override(this.doLayout);
    
    /**
     * def:{
     *     items:[compid],
     *     compid:{}
     * }
     */
    thi$._addComps = function(def){
        var comps = def.items, R = this.Runtime(),
        oriComps = this._local.items, view = this.view,
        absLayout = this.layout instanceof js.awt.AbsoluteLayout;
        
        def.items = [];
        List.$decorate(def.items);
        this.view = self.document.createDocumentFragment();
        for(var i=0, len=comps.length; i<len; i++){
            var compid = comps[i], compDef = def[compid], comp;
            if(Class.isObject(compDef)){
                compDef.id = compDef.id || compid;
                compDef.className = compDef.className ||
                    DOM.combineClassName(this.def.className, compid);
                comp = new (Class.forName(compDef.classType))(
                    compDef, R);
                
                if(absLayout){
                    comp.view.style.position = "absolute";
                }

                this.appendChild(comp);
            }
        }
        view.appendChild(this.view);
        this.view = view;
    };
    
    /**
     * Override the destroy of js.awt.Component
     */
    thi$.destroy = function(){
        if(this.destroied !== true){
            this.removeAll(true);
            $super(this);
        }
    }.$override(this.destroy);

    /**
     * @see js.awt.Component
     */
    thi$._init = function(def, Runtime, view){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Container";
        def.className = def.className || "jsvm_container";

        $super(this);
        
        var layout = def.layout = (def.layout || {});
        layout.classType = layout.classType || "js.awt.LayoutManager";

        this.setLayoutManager(
            new (Class.forName(layout.classType))(layout));
        def.activateman = Class.isBoolean(def.activateman) 
            ? def.activateman : false;

        // Keep original order
        var oriComps = this._local.items = List.$decorate([]);
        
        // Add children components
        var comps = def.items;
        if(Class.typeOf(comps) === "array"){
            this._addComps(def);
        }else{
            def.items = List.$decorate([]);
        }
        
        this.zOrderAdjust();

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(
    js.awt.Containable, js.awt.ZOrderManager);

