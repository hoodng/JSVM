/**
 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * File: TipLayer.js
 * Create: 2014/02/20 06:41:25
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */
$package("js.awt");

$import("js.awt.Component");

js.awt.TipLayer = function(def, Runtime){

    var CLASS = js.awt.TipLayer, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments); 
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event,
        DOM = J$VM.DOM, System = J$VM.System, MQ = J$VM.MQ;
	
	/**
	 * Set the tip object for current tip layer. If a old tip object is existed
	 * and not same as the new given object, remove if first. Otherwise, use the
	 * old one directly.
	 * 
	 * @param tipObj: {Component} A Component or Container instance object.
	 */
	thi$.setTipObject = function(tipObj, gc){
        this.releaseTipObject(gc);
        if(!tipObj) return;

        this.tipObj = tipObj;        
        if(tipObj.view){
            tipObj.view.style.position = "absolute";
			tipObj.appendTo(this.view);
        }
	};

	thi$.getTipObject = function(){
		return this.tipObj;	 
	};
    
	/**
	 * Attention:
	 * 
	 * The tipObj is not created by tip layer. So tip layer won't
	 * take responsibility for destroy it.
	 */
	thi$.releaseTipObject = function(gc){
		var tipObj = this.tipObj;
        if(!tipObj) return;
        if(gc){
            tipObj.destroy(gc);
        }else{
            tipObj.removeFrom(this.view);            
        }
        delete this.tipObj;
	};
		
	thi$.doLayout = function(force){
	    var tipObj, bounds, MBP;
        if(!arguments.callee.__super__.apply(this, arguments))
            return false;
        
		tipObj = this.tipObj;
        if(!tipObj) return true;
        
        bounds = this.getBounds();
		MBP = bounds.MBP;
		tipObj.setPosition(MBP.borderLeftWidth + MBP.paddingLeft, 
						   MBP.borderTopWidth + MBP.paddingTop);
		tipObj.doLayout(true);
		
		bounds = tipObj.getBounds();
		this.setSize(bounds.width + MBP.BPW,
                     bounds.height + MBP.BPH, 4);
		return true;

	}.$override(this.doLayout);
	
	thi$.destroy = function(){
		this.releaseTipObject();
		arguments.callee.__super__.apply(this, arguments);
	}.$override(this.destroy);
	
	thi$._init = function(def, Runtime){
		if(typeof def !== "object") return;
		
		def.classType = def.classType || "js.awt.TipLayer";
		def.className = DOM.combineClassName(
            ["jsvm_", def.className||""].join(" "),
            ["tip-layer"]);

		def.isfloating = true;
		def.stateless = true;
		
		arguments.callee.__super__.apply(this, arguments);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.Component);

