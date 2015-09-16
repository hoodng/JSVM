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

js.awt.Cover = function (){

    var CLASS = js.awt.Cover, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, DOM = J$VM.DOM;

    thi$.showCover = function(b, modify, className){
        var view = this._coverView, selector;

        selector = DOM.combineClassName(
            ["jsvm_", className || this.className].join(" "),
            ["cover", modify ? "cover--" + modify : ""]);
        
        if(b){
            if(!view){
                _createView.call(this, selector);
            }
            this.adjustCover();
        }else{
            if(view && view.className === selector){
                this.removeCover();                
            }
        }
    };

    var _createView = function(selector){
        var cview = this.view, view, uuid, tip;

        uuid = this.uuid();
        view = this._coverView = DOM.cloneElement(cview, false);
        view.uuid = [uuid, "cover"].join("-");
        view.id = [this.getID(), "cover"].join("-");
        view.className = selector;
        view.style.position = "absolute";
        view.style.zIndex = this.getZ();
        if(cview === self.document.body){
            cview.appendChild(view);
        }else{
            DOM.insertAfter(view, cview);
        }
        
        tip = this.def.tip;
        if(Class.isString(tip)){
            DOM.setAttribute(view, "title", tip);
        }
    };
    
    /**
     * Show loading status in this cover
     */
    thi$.showLoading = function(b, styleClass){
        this.showCover(b, "loading", styleClass);
    };
    
    /**
     * Show cover for moving with class name "jsvm_movecover"
     */
    thi$.showMoveCover = function(b, styleClass){
        this.showCover(b, "move", styleClass);
    };

    thi$.showMaskCover = function(b, styleClass){
        this.showCover(b, "mask", styleClass);
    };

    thi$.showDisableCover = function(b, styleClass){
        this.showCover(b, "disable", styleClass);
    };

    /**
     * Adjust the postion and size of the cover
     */
    thi$.adjustCover = function(bounds){
        var view = this._coverView, abs, x, y;
        if(!view) return;
        bounds = bounds || this.getBounds();
        if(bounds.MBP.fake) return;
        abs = (bounds.MBP.position === "absolute");
        if(abs){
            x = bounds.x;
            y = bounds.y;
        }else{
            x = bounds.absX;
            y = bounds.absY;
        }
        
        DOM.setBounds(view, x, y, bounds.width, bounds.height);   
    };

    thi$.setCoverZIndex = function(z){
        var view = this._coverView;
        if(!view) return;
        view.style.zIndex = z;
    };
    
    thi$.setCoverDisplay = function(show){
        var view = this._coverView;
        if(!view) return;
        view.style.display = show;
    };

    thi$.removeCover = function(){
        var view = this._coverView;
        if(!view) return;
        DOM.remove(view, true);
        delete this._coverView;
    };

};



