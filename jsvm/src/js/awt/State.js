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
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.awt");

js.awt.State = function (def){

    var CLASS = js.awt.State, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init0.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var C = js.lang.Class, E = js.util.Event;

    thi$.isStateless = function(){
        return this.def.stateless || false;
    };

    thi$.getState = function(){
        return this.def.state;
    };

    thi$.setState = function(state){
        if(!this.isStateless()){
            this.def.state = state & 0x1F;
            if(C.isFunction(this.onStateChanged)){
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

    thi$.isHover = function(){
        return (this.getState() & CLASS.H) != 0;
    };

    thi$.setHover = function(b){
        var state = this.getState(), $ = CLASS.H;
        this.setState(b ? (state | $):(state & ~$));
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

    thi$.isVisible = function() {
        return (this.getState() & CLASS.V) == 0;
    };

    thi$.setVisible = function(b) {
        var state = this.getState(), $ = CLASS.V;
        this.setState(b ? (state & ~$):(state | $));
    };

    thi$._init0 = function(def){
        this.def = def || {};
    };

    this._init0.apply(this, arguments);
};

/** Hover:1, Normal:0 */
js.awt.State.H = 0x01 << 0;

/** Activated:1, Normal:0 */
js.awt.State.A = 0x01 << 1;

/** Triggered:1, Normal:0 */
js.awt.State.T = 0x01 << 2;

/** Disabled:1, Normal:0 */
js.awt.State.D = 0x01 << 3;

/** Unvisible:1, Normal:0*/
js.awt.State.V = 0x01 << 4;

