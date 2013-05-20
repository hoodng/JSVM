/**
 * Copyright (c) Jinfonet Inc. 2000-2011, All rights reserved.
 * 
 * @File: Component.js
 * @Create: 2010-11-17
 * @Author: dong.hu@china.jinfonet.com
 */

$package("js.awt");

js.awt.State = function() {

    var CLASS = js.awt.State, thi$ = CLASS.prototype;
    if(CLASS.__defined__) {
        this._init0.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var C = js.lang.Class, E = js.util.Event;
    
    thi$.isStateless = function(){
        return this.def.stateless || false;
    };
    
    thi$.getState = function() {
        return this.def.state;
    };

    thi$.setState = function(state) {
        if(!this.isStateless()) {
            this.def.state = state & 0x7F;
            if(C.isFunction(this.onStateChanged)) {
                this.onStateChanged(this.getState());
            }
        }
    };

    thi$.isEnabled = function(){
        return (this.getState() & CLASS.D) == 0;
    };

    thi$.setEnabled = function(b){
        var state = this.getState(), $ = CLASS.D;
        this.setState(b ? (state & ~$):(state | $));
    };
    
    /**
     * @deprecated
     */
    thi$.setEnable = function(b) {
        J$VM.System.err.println("This method is deprecated, please use setEnabled");
        return this.setEnabled(b);
    };
    
    thi$.isHover = function(){
        return (this.getState() & CLASS.H) != 0;
    };

    thi$.setHover = function(b){
        var state = this.getState(), $ = CLASS.H;
        this.setState(b ? (state | $):(state & ~$));
    };
    
    /**
     * @deprecated
     */
    thi$.isMouseOver = function() {
        J$VM.System.err.println("This method is deprecated, please use isHover");
        return this.isHover();
    };

    /**
     * @deprecated
     */
    thi$.setMouseOver = function(b) {
        J$VM.System.err.println("This method is deprecated, please use setHover");
        return this.setHover(b);
    };

    thi$.isActivated = function(){
        return (this.getState() & CLASS.A) != 0;
    };

    thi$.setActivated = function(b){
        var state = this.getState(), $ = CLASS.A;
        this.setState(b ? (state | $):(state & ~$));
    };

    thi$.isTriggered = function(){
        return (this.getState() & CLASS.T) != 0;
    };
    
    thi$.setTriggered = function(b){
        var state = this.getState(), $ = CLASS.T;
        this.setState(b ? (state | $):(state & ~$));
    };

    /**
     * @deprecated
     */
    thi$.isTrigger = function() {
        J$VM.System.err.println("This method is deprecated, please use isTriggered.");
        return this.isTriggered();
    };
    
    /**
     * @deprecated
     */
    thi$.setTrigger = function(b) {
        J$VM.System.err.println("This method is deprecated, please use setTriggered.");
        return this.setTriggered(b);
    };

    thi$.isVisible = function() {
        return (this.getState() & CLASS.V) == 0;
    };

    thi$.setVisible = function(b) {
        var state = this.getState(), $ = CLASS.V;
        this.setState(b ? (state & ~$):(state | $));
    };

    thi$.isMaximized = function() {
        return (this.getState() & CLASS.X) != 0;
    };

    thi$.setMaximized = function(b) {
        var state = this.getState(), $ = CLASS.X;
        this.setState(b ? (state | $):(state & ~$));
    };

    thi$.isMinimized = function() {
        return (this.getState() & CLASS.I) != 0;
    };

    thi$.setMinimized = function(b) {
        var state = this.getState(), $ = CLASS.I;
        this.setState(b ? (state | $):(state & ~$));
    };

    if(this instanceof js.util.EventTarget){
        this.declareEvent(E.SYS_EVT_STATECHANGED);
    }
    
    thi$._init0 = function(def){
        this.def = def || {};
    };
    
    this._init0.apply(this, arguments);
};

js.awt.State.D = 0x01 << 0; // Disable/Enable
js.awt.State.O = 0x01 << 1; // MouseOver/MouseOut
js.awt.State.T = 0x01 << 2; // Trigger/Un-trigger
js.awt.State.A = 0x01 << 3; // Actived/Deactived
js.awt.State.V = 0x01 << 4; // Hidden/Visible
js.awt.State.X = 0x01 << 5; // Maximized/Normal
js.awt.State.I = 0x01 << 6; // Iconified/Normal

js.awt.State.H = 0x01 << 1;
