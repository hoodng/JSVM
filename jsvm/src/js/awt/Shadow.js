/**
  Copyright 2008-2015, The JSVM Project. 
  All rights reserved.
  
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.awt");

/**
 * A <code>Shodow</code> is used to support shodow of a component.
 */
js.awt.Shadow = function (){

    var CLASS = js.awt.Shadow, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, DOM = J$VM.DOM;
    
    thi$.showShadow = function(b, className){
        var view = this._shadowView, selector;
        selector = DOM.combineClassName(
            ["jsvm_", className||""].join(" "),
            ["shadow"]);
        
        if(b){
            if(!view){
                _createView.call(this, selector);
            }
            this.adjustShadow();
        }else{
            this.removeShadow();
        }
    };

    var _createView = function(selector){
        var cview = this.view, view, uuid;
        if(cview === self.document.body) return;

        uuid = this.uuid();
        view = this._shadowView = DOM.createElement("DIV");
        view.uuid = uuid;
        view.id = [this.getID(), "shadow"].join("-");
        view.className = selector;
        view.style.position = "absolute";
        view.style.zIndex = this.getZ();
        DOM.insertBefore(view, cview);
    };

    thi$.adjustShadow = function(bounds){
        var view = this.view, sview = this._shadowView,
            ele, box, xy, x, y;

        if(!sview || !DOM.isDOMElement(sview)) return;
        
        bounds = bounds || this.getBounds();
        ele = DOM.getOffsetParent(view);
        if(ele === view){
            x = 0;
            y = 0;
        }else{
            box = DOM.getBounds(ele);
            xy = DOM.relative(bounds.absX, bounds.absY, box);
            x = xy.x;
            y = xy.y;
        }
        
        DOM.setBounds(sview, x, y, bounds.width, bounds.height);   
    };

    thi$.setShadowZIndex = function(z){
        var view = this._shadowView;
        if(!view) return;
        view.style.zIndex = z;
    };

    thi$.setShadowDisplay = function(show){
        var view = this._shadowView;
        if(!view) return;
        view.style.display = show;
    };

    thi$.removeShadow = function(){
        var view = this._shadowView;
        if(!view) return;
        DOM.remove(view, true);
        delete this._shadowView;
    };
};
