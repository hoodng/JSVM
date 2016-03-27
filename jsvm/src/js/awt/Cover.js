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
			if(view && view.clazz === selector){
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
		view.className = view.clazz = selector;
		view.style.position = "absolute";
		view.style.zIndex = this.getZ()+1;
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
	thi$.showLoading = function(b, styleClass, iconic){
		var modify = iconic !== false ? "loading" : "loading--noicon";
		this.showCover(b, modify, styleClass);
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
		var view = this.view, cview = this._coverView, 
		ele, box, xy, x, y, className;
		if(!cview){
			return;
		}

		bounds = bounds || this.getBounds();

		className = cview.clazz;
		if(!this.isVisible()){
			className += " " + DOM.combineClassName(className, this.getState());
		}
		cview.className = className;

        if(view === document.body){
            x = 0; y = 0;
        }else{
            x = bounds.offsetX;
            y = bounds.offsetY;
        }

		DOM.setBounds(cview, x, y, bounds.width, bounds.height);   
	};

	thi$.setCoverZIndex = function(z){
		var view = this._coverView;
		if(!view) return;
		view.style.zIndex = z+1;
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
		this._coverView = null;
	};

	/**
	 * Check whether the current component is covered.
	 * 
	 * @return {Boolean}
	 */
	thi$.isCovered = function(){
		var cover = this._coverView;
		return !!(cover && cover.parentNode);
	};

};
