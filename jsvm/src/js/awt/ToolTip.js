/**
 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * File: ToolTip.js
 * Create: 2014/02/20 06:41:25
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.awt");

/**
 * An interface for showing user-defined tooltips.
 * 
 * Attention:
 * 
 * If the user-defined tooltips will be shown for GraphicElement, its "Graphic2D" 
 * ancestor object must invoke the "checkAttachEvent" method to make the "mouseover",
 * "mouseout", "mousemove" can be fired and listened, as follow:
 *     this.checkAttachEvent("mouseover", "mouseout", "mousemove");
 */
js.awt.ToolTip = function(){

    var CLASS = js.awt.ToolTip, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event,
        DOM = J$VM.DOM, System = J$VM.System, MQ = J$VM.MQ;
    
    /**
     * Set the tip object for tip layer. The tip object is the real content
     * component for showing user-defined tips. It can be any "Component", 
     * "Container" instance object.
     * 
     * @param tipObj: {Component} A Component or Container instance object.
     * @param gc: {Boolean} Indicate whether gc the old useless tipObj.
     */
    thi$.setTipObject = function(tipObj, gc){
        var U = this._local, tip = this.getTipLayer();
        U.tipObj = tipObj;
        if(!tip) return;
        tip.setTipObject(tipObj, gc);
    };
    
    thi$.getTipObject = function(e){
        var U = this._local;
        return U.tipObj; 
    };

    thi$.setTipObjByDef = function(def){
        var tipObj;
        if(!Class.isObject(def) || !def.classType) return;
        def.stateless = true;
        def.NUCG = true;
        tipObj = new (Class.forName(def.classType))(def, this.Runtime());
        this.setTipObject(tipObj, true);
    };
    
    /**
     * Set the text for the label tip. If the label tip object is not
     * existed, create it first.
     * 
     * @param labelText: {String} Text for the label tip.
     * @param styles: {Object} Optional. Some extra styles for the label 
     *        tip to apply.
     * @param extDef: {Object} Optional. Some extra definition.
     */
    thi$.setTipLabel = function(labelText, styles, extDef){
        var tipObj = this.getTipObject(), objDef;
        if(!tipObj || !(tipObj instanceof js.awt.Label)){
            objDef = {
                classType: "js.awt.Label"
            }
            if(Class.isObject(extDef)){
                System.objectCopy(extDef, objDef);
            }
            this.setTipObjByDef(objDef);
        }
        
        tipObj = this.getTipObject();
        if(Class.isObject(styles)){
            tipObj.applyStyles(styles);
        }

        tipObj.setText(labelText);
    };
        
    thi$.getTipLayer = function(){
        return this.tipLayer;
    };

    var _createTipLayer = function(tipDef){
        var M = this.def, tip;

        tip = this.tipLayer;
        if(tip) return;
        
        if(Class.isObject(tipDef)){
            tipDef = System.objectCopy(tipDef, {}, true);
        }else{
            tipDef = {shadow: true};
        }
        M.tipDef = tipDef;
        tipDef.classType = tipDef.classType || "js.awt.TipLayer";
        tipDef.id = tipDef.id || [this.getID(), "tip"].join("-");
        tipDef.uuid = tipDef.uuid || [this.uuid(), "tip"].join("-");
        tipDef.isfloating = true;
        tipDef.stateless = true;
        tip = this.tipLayer = new (Class.forName(tipDef.classType))(
            tipDef, this.Runtime());

        this.attachEvent("mouseover", 4, this, _onhover);
        this.attachEvent("mouseout",  4, this, _onhover);                 
        this.attachEvent("mousemove", 4, this, _onhover);
    };
    
    thi$.removeTipLayer = function(){
        var tip = this.tipLayer;
        if(!tip) return;
        this.detachEvent("mouseover", 4, this, _onhover);
        this.detachEvent("mouseout",  4, this, _onhover);                 
        this.detachEvent("mousemove", 4, this, _onhover);
        tip.destroy();
        delete this.tipLayer;
    };

    thi$.showTipLayer = function(b, e){
        var tip, xy;
        b = b || false;
        tip = this.getTipLayer();
        if(!tip) return;
        
        if(b){
            xy = e.eventXY();
            tip.setTipObject(this.getTipObject(e));
            tip.showAt(xy.x-2, xy.y+18, true);
        }else{
            tip.hide(e);
        }
    };
    
    var _onhover = function(e){
        if(e.getType() === Event.W3C_EVT_MOUSE_OUT){
            this.showTipLayer(false);
        }else{
            this.showTipLayer(true, e);
        }
        e.cancelBubble();
        return e.cancelDefault();
    };
    
    /**
     * Init the user-defined tip usage environment and prepare to listen
     * the mouseover, mouseout and mousemove event.
     * 
     * Here, two branch logics are existed. For the GraphicElement, the 
     * user event will be attached with the flag 4. And for Component, 
     * the DOM event will be attached with the flag 0.
     */
    thi$.setUserDefinedTip = function(b, tipDef){
        var M = this.def, U = this._local, tip;
        b = b || false;
        M.useUserDefinedTip = b;

        if(b){
            U.tipText = M.tip; // keep tip text
            this.rmvTipText();
            _createTipLayer.call(this, tipDef || M.tipDef);
        }else{
            this.setTipText(U.tipText);
            this.removeTipLayer();
        }
    };

    thi$.setTipText = function(text){
        if(!Class.isString(text) ||
           text.trim().length == 0 ) return;

        this.def.tip = text;
        DOM.setAttribute(this.view, "title", text);
        DOM.setAttribute(this._coverView, "title", text);            
    };

    thi$.rmvTipText = function(){
        this.def.tip = undefined;
        DOM.removeAttribute(this.view, "title");
        DOM.removeAttribute(this._coverView, "title");            
    };

    /**
     * @deprecated Use setTipText()
     */
    thi$.setToolTipText = function(s){
        this.setTipText(s);
    };

    /**
     * @deprecated Use rmvTipText()
     */
    thi$.delToolTipText = function(){
        this.rmvTipText();
    };
};

