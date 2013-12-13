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
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.awt");

js.awt.PopupLayer = function () {

    var CLASS = js.awt.PopupLayer, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;

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
        
        return this._local.root;  
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
     *        layer is lying.
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
            this.Runtime().LM.onHide(e);
        }
    };
    
    thi$.setPMFlag = function (flag, timeout) {
        flag = Class.isNumber(flag) ? flag & 0x7F : 0x27;
        timeout = Class.isNumber(timeout) ? timeout : 2000;

        this._local.LMFlag = flag;
        this._local.LMTimeout = timeout;
        
        if ((this._local.LMFlag & CLASS.F_TIMEOUT) != 0) {
            this.attachEvent("mouseover", 0, this, this.timeoutMouseover);
            this.attachEvent("mouseout", 0, this, this.timeoutMouseout);
        } else {
            this.detachEvent("mouseover", 0, this, this.timeoutMouseover);
            this.detachEvent("mouseout", 0, this, this.timeoutMouseout);
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
                this.focusItem  = null;
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
        var f, type = e.getType();
        switch (type) {
        case "mousedown":
            f = CLASS.F_BODYMOUSEDOWN;
            break;
        case "click":
            f = CLASS.F_BODYCLICK;
            break;
        case "mousewheel":
        case "DOMMouseScroll":
            f = CLASS.F_BODYMOUSEWHEEL;
            break;
        case "blur":
            f = CLASS.F_FOCUSBOXBLUR;
            break;
        case "timeout":
            f = CLASS.F_TIMEOUT;
            break;
        case "hide":
            return (this._local.LMFlag & CLASS.F_AUTO) == 0;
            break;
            // IFram which has J$VM will post message when catch mousedown
        case "message": 
        case "resize":
            return true;
            break;
        }
        
        return (f & this._local.LMFlag) !== 0;
    };
    
    thi$.isShown = function () {
        return this.Runtime().LM.indexOf(this) !== -1;
    };
    
    /**
     * @param x: {Number} x of the reference position.
     * @param y: {Number} y of the reference position.
     * @param v: {Boolean} Indicate whether the nofly area of current floating
     *        layer is vertical breakthrough.
     * @param m: {Number} The specified thickness of nofly area.
     */
    thi$.showAt = function (x, y, v, m) {
        this.Runtime().LM.showAt(this, x, y, v, m);
    };

    /**
     * @param by: {HTML DOM} The specified DOM element to specify the reference
     *        position and nofly area.
     * @param v: {Boolean} Indicate whether the nofly area of current floating
     *        layer is vertical breakthrough.
     * @param m: {Number} The specified thickness of nofly area.
     */
    thi$.showBy = function (by, v, m) {
        this.Runtime().LM.showBy(this, by, v, m);
    };
    
    thi$.hide = function (type) {
        this.setAutoHide(false);
        
        var arg = arguments ? arguments[1] : undefined,
        evt = new js.util.Event(type || "hide", arg, this);
        this.Runtime().LM.onHide(evt);
    };

    thi$.hideOthers = function () {
        this.Runtime().LM.clearStack();
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
        var LM = this.Runtime().LM;

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

        var LM = this.Runtime().LM;
        if(LM.onHide.$clearTimer(this.lmtimer)){
            System.log.println("Delete timer: " + this.lmtimer);
            delete this.lmtimer;    
        }
        
    };
};

js.awt.PopupLayer.F_BODYMOUSEDOWN = 0x01 << 0;
js.awt.PopupLayer.F_BODYCLICK = 0x01 << 1;
js.awt.PopupLayer.F_BODYMOUSEWHEEL = 0x01 << 2;
js.awt.PopupLayer.F_FOCUSBOXBLUR = 0x01 << 3;
js.awt.PopupLayer.F_TIMEOUT = 0x01 << 4;
js.awt.PopupLayer.F_AUTO = 0x01 << 5;
