/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.awt");

js.awt.PopupLayer = function () {

	var CLASS = js.awt.PopupLayer, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ,

	EvtFlagMap = {
		mousedown: CLASS.F_BODYMOUSEDOWN,
		click: CLASS.F_BODYCLICK,
		mousewheel: CLASS.F_BODYMOUSEWHEEL,
		DOMMouseScroll: CLASS.F_BODYMOUSEWHEEL,
		blur: CLASS.F_FOCUSBOXBLUR,
		timeout: CLASS.F_TIMEOUT
	};

	thi$.setFloating = function(b){
		b = b || false;
		this.def.isfloating = b;
		
		if(b === true){
			this.setPMFlag(this.def.PMFlag); 
		}else{
			this.setPMFlag(0);	  
		}

		this._local.floatingSettled = true;
	};

	thi$.floatingSettled = function(){
		return this._local.floatingSettled;
	};
	
	thi$.rootLayer = function(root){
		if(root){
			this._local.root = root;
		}
		
		return this._local.root || this;  
	};
	
	/**
	 * When the current floating layer appended, something may need be do at first.
	 */	   
	thi$.onLayerAppended = function(){
		// Subclass can implement it if need.  
	};

	/**
	 * Whether current floating layer can adjust the computed perferred position
	 * to make more contents can be shown. Default is true.
	 * Sub class can invoke it if it is need.
	 */
	thi$.setAdjustPosToFit = function(b){
		this._local.adjustPosToFit = b;
	};
	
	thi$.isAdjustPosToFit = function(){
		return this._local.adjustPosToFit !== false;
	};
	
	/**
	 * When any area is narrow for current floating layer. Maybe someone need to
	 * adjust its size by the current available size.
	 * 
	 * @param bounds: {Obejct} Runtime bounds for current floating layer
	 * @param area: {Object} Rectangle of the area in which the current floating 
	 *		  layer is lying.
	 * @param nofly: {Object} Rectangle of the nofly area
	 */
	thi$.setCallback = function(bounds, area, nofly){
		// Sub class can implement it if need.
	};
	
	/**
	 * For some floating layer, before it is removed, something need be done at 
	 * first. If so it need to implement this function.
	 */ 
	thi$.beforeRemoveLayer = function(e){
		var peer = this.getPeerComponent();
		if((this == this.rootLayer()) && peer){
			MQ.post("js.awt.event.LayerEvent", 
					new Event("beforeRemoveLayer", e || "", this), 
					[peer.uuid()]);	   
		}
	};
	
	/**
	 * For some floating layer, after it is removed, something need be done. If
	 * so it need to implement this function.
	 * Typically, sub class may destroy the popup layer after removed.
	 */
	thi$.afterRemoveLayer = function(e){
		var peer = this.getPeerComponent();
		if((this == this.rootLayer()) && peer){
			MQ.post("js.awt.event.LayerEvent", 
					new Event("afterRemoveLayer", e || "", this), 
					[peer.uuid()]);
		}
	};
	
	thi$.onFocusBoxBlur = function(e){
		if(((this._local.LMFlag & CLASS.F_AUTO) !== 0)
			&& this.focusBox == this.focusItem){
			this.LM().onHide(e);
		}
	};
	
	thi$.setPMFlag = function (flag, timeout) {
		flag = Class.isNumber(flag) ? flag & 0x7F : 0x27;
		timeout = Class.isNumber(timeout) ? timeout : 2000;

		this._local.LMFlag = flag;
		this._local.LMTimeout = timeout;
		
		if ((this._local.LMFlag & CLASS.F_TIMEOUT) != 0) {
			this.attachEvent("mouseover", 4, this, this.timeoutMouseover);
			this.attachEvent("mouseout",  4, this, this.timeoutMouseout);
		} else {
			this.detachEvent("mouseover", 4, this, this.timeoutMouseover);
			this.detachEvent("mouseout",  4, this, this.timeoutMouseout);
		}
		
		if ((this._local.LMFlag & CLASS.F_FOCUSBOXBLUR) != 0){
			if(this.focusBox == undefined) {
				_createFocusBox.$bind(this)();
				DOM.appendTo(this.focusBox, this.view);
				
				Event.attachEvent(this.focusBox, "blur", 1, this, this.onFocusBoxBlur);
			}
			
			this.focusItem = this.focusBox;
			this.focusBox.focus();
		} else {
			if(this.focusItem == this.focusBox){
				this.focusItem	= null;
			}
			
			if (this.focusBox != undefined) {
				Event.detachEvent(this.focusBox, "blur", 1, this, this.onFocusBoxBlur);
				
				DOM.remove(this.focusBox, true);
			}
			
			this.focusBox = null;
		}
	};
	
	thi$.getPMFlag = function () {
		return this._local.LMFlag;
	};
	
	thi$.isHideOnMouseDown = function(){
		return (this.getPMFlag() & CLASS.F_BODYMOUSEDOWN) != 0;
	};
	
	thi$.setHideOnMouseDown = function(b){
		var flag = this.getPMFlag(), $ = CLASS.F_BODYMOUSEDOWN;
		this.setPMFlag(b ? (flag | $):(flag & ~$));
	};
	
	thi$.isHideOnClick = function(b){
		return (this.getPMFlag() & CLASS.F_BODYCLICK) != 0;
	};
	
	thi$.setHideOnClick = function(b){
		var flag = this.getPMFlag(), $ = CLASS.F_BODYCLICK;
		this.setPMFlag(b ? (flag | $):(flag & ~$));
	};
	
	thi$.isHideOnMouseWheel = function(){
		return (this.getPMFlag() & CLASS.F_BODYMOUSEWHEEL) != 0;
	};
	
	thi$.setHideOnMouseWheel = function(b){
		var flag = this.getPMFlag(), $ = CLASS.F_BODYMOUSEWHEEL;
		this.setPMFlag(b ? (flag | $):(flag & ~$));
	};
	
	thi$.isHideOnBlur = function(){
		return (this.getPMFlag() & CLASS.F_FOCUSBOXBLUR) != 0;
	};
	
	thi$.setHideOnBlur = function(b){
		var flag = this.getPMFlag(), $ = CLASS.F_FOCUSBOXBLUR;
		this.setPMFlag(b ? (flag | $):(flag & ~$));
	};
	
	thi$.isHideOnTimeout = function(){
		return (this.getPMFlag() & CLASS.F_TIMEOUT) != 0;
	};
	
	thi$.setHideOnTimeout = function(b, timeout){
		var flag = this.getPMFlag(), $ = CLASS.F_TIMEOUT;
		this.setPMFlag(b ? (flag | $):(flag & ~$), timeout);
	};

	thi$.setAutoHide = function(b){
		var flag = this.getPMFlag(), $ = CLASS.F_AUTO;
		this.setPMFlag(b ? (flag | $):(flag & ~$));
	};
	
	thi$.canHide = function (e) {
		var type = e.getType(), el, f, 
		b = true;

		switch (type) {
		case "mousedown":
		case "mousewheel":
		case "DOMMouseScroll":
			el = e.srcElement;
			if(el && this.view 
			   && DOM.contains(this.view, el, true)){
				b = false; 
			}else{
				f = EvtFlagMap[type];
			}
			break;
		case "click":
		case "blur":
		case "timeout":
			f = EvtFlagMap[type];
			break;
		case "hide":
			b = (this._local.LMFlag & CLASS.F_AUTO) == 0;
			break;
			// IFram which has J$VM will post message when catch mousedown
		case "message": 
		case "resize":
			b = true;
			break;
		}

		if(f){
			b = (f & this._local.LMFlag) !== 0;
		}

		return b;
	};
	
	thi$.isShown = function () {
		return this.LM().indexOf(this) !== -1;
	};
	
	/**
	 * @param x: {Number} x of the reference position.
	 * @param y: {Number} y of the reference position.
	 * @param v: {Boolean} Indicate whether the nofly area of current floating
	 *		  layer is vertical breakthrough.
	 * @param m: {Number} The specified thickness of nofly area.
	 */
	thi$.showAt = function (x, y, v, m) {
		this.LM().showAt(this, x, y, v, m);
	};

	/**
	 * @param by: {HTML DOM} The specified DOM element to specify the reference
	 *		  position and nofly area.
	 * @param v: {Boolean} Indicate whether the nofly area of current floating
	 *		  layer is vertical breakthrough.
	 * @param m: {Number} The specified thickness of nofly area.
	 */
	thi$.showBy = function (by, v, m) {
		this.LM().showBy(this, by, v, m);
	};
	
	thi$.hide = function (type) {
		this.setAutoHide(false);
		
		var arg = arguments ? arguments[1] : undefined,
		evt = new Event(type || "hide", arg, this);
		this.LM().onHide(evt);
	};

	thi$.hideOthers = function (type) {
		var arg = arguments ? arguments[1] : undefined,
		evt = new Event(type || "hide", arg, this);
		this.LM().clearStack(evt);
	};
	
	var _createFocusBox = function () {
		if (this.focusBox == undefined) {
			var focusBox = this.focusBox = document.createElement("input");
			focusBox.type = "text";
			focusBox.style.cssText = "position:absolute;left:-1px;top:-2000px;"
				+ "width:1px;height:1px;";
		}
	};
	
	thi$.startTimeout = function () {
		var LM = this.LM();

		if ((this._local.LMFlag & CLASS.F_TIMEOUT) != 0) {
			this.lmtimer = 
				LM.onHide.$delay(this, this._local.LMTimeout, new Event("timeout"));
			
			System.log.println("Create timer: " + this.lmtimer);
		}
	};
	
	thi$.timeoutMouseout = function (e) {
		if (DOM.contains(this.view, e.toElement, true)){
			return;
		}
		
		this.startTimeout();
	};
	
	thi$.timeoutMouseover = function (e) {
		if (!DOM.contains(this.view, e.toElement, true))
			return;

		var LM = this.LM();
		if(LM.onHide.$clearTimer(this.lmtimer)){
			System.log.println("Delete timer: " + this.lmtimer);
			delete this.lmtimer;	
		}
	};

	thi$.LM = function(){
		return this.Runtime().getDesktop().LM;
	};
};

(function(){
	 var CLASS = js.awt.PopupLayer;
	 CLASS.F_BODYMOUSEDOWN = 0x01 << 0;
	 CLASS.F_BODYCLICK = 0x01 << 1;
	 CLASS.F_BODYMOUSEWHEEL = 0x01 << 2;
	 CLASS.F_FOCUSBOXBLUR = 0x01 << 3;
	 CLASS.F_TIMEOUT = 0x01 << 4;
	 CLASS.F_AUTO = 0x01 << 5;
 })();



