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

$import("js.awt.Bidirectional");
$import("js.util.Counter");

/**
 * @param def:{
 *     className: 
 *     id:
 *     
 *     lower: 1,
 *     upper: 100
 *     index: index of counter
 * 
 *     accel:{
 *         delay: The delay time (milliseconds) of start accelerator
 *         repeat: The delay time of repeat
 *         inc: The increment of repeat
 *     },
 *         
 *     cyclic: boolean
 * 
 *     direction: 0: horizontal, 1: vertical
 *     
 * }
 */
js.awt.Spinner = function(def, Runtime){

    var CLASS = js.awt.Spinner, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ, BASE = 50000;

    thi$.getMsgType = function(){
        return "js.awt.event.SpinnerEvent";
    };
    
    thi$.setRange = function(lower, upper){
        var M = this.def;

        lower = Class.isNumber(lower) ? lower : 
            Class.isNumber(M.lower) ? M.lower : 0;
        upper = Class.isNumber(upper) ? upper : 
            Class.isNumber(M.upper) ? M.upper : 99;

        if(lower < upper){
            M.lower = lower;
            M.upper = upper;
        }else{
            M.lower = upper;
            M.upper = lower;
        }
        
        this.setCount(M.upper - M.lower + 1);
    };
    
    thi$.getRange = function(){
        var M = this.def;

        return {lower: M.lower, upper: M.upper};
    };
    
    thi$.setPos = function(index){
        index = Class.isNumber(index) ? index : 0;
        arguments.callee.__super__.call(this, index);

    }.$override(this.setPos);

    thi$.getValue = function(){
        return this.def.lower + this.getPos();        
    };

    thi$.setCyclic = function(b){
        this.def.cyclic = b || false;
    };

    thi$.isCyclic = function(){
        return this.def.cyclic;
    };
    
    /**
     * @see js.awt.Container
     */    
    thi$.doLayout = function(force){
        if(arguments.callee.__super__.apply(this, arguments)){

            _layout.call(this, this.getUBounds());
            return true;
        }
        return false;
    }.$override(this.doLayout);

    var _layout = function(D){
        var ctrl0 = this.ctrl0, ctrl1 = this.ctrl1, w;

        this.setUBounds(0,0, undefined, D.innerPMeasure, null, ctrl0);
        w = this.getMeasure(ctrl0);
        this.offset0 = D.MBP.borderM0 + w;
        
        this.setUBounds(null, 0, undefined, D.innerPMeasure, null, ctrl1);
        this.setUEndStyle(0, ctrl1);
        this.offset1 = 0 - D.MBP.borderM1 - this.getMeasure(ctrl1);

        if(this.def.miniSize == undefined){
            w += this.getMeasure(ctrl1);
            this.setUMinimumSize(D.MBP.BM + 1 + w, D.pmeasure);
        }
    };
    
    var _createElements = function(){
        var ctrl0, ctrl1, R = this.Runtime();
        this.cache = {};
        this.diff  = BASE;
        
        ctrl0 = new js.awt.Component(
            {
                className: this.className + "_ctrl0",
                id: "ctrl0",
                css: "position:absolute;overflow:hidden;"
            }, R);
        this.addComponent(ctrl0);
        this.cache[ctrl0.uuid()] = ctrl0;

        ctrl1 = new js.awt.Component(
            {
                className: this.className + "_ctrl1",
                id: "ctrl1",
                css: "position:absolute;overflow:hidden;"
            }, R);
        this.addComponent(ctrl1);
        this.cache[ctrl1.uuid()] = ctrl1;

        this.attachEvent("mouseover", 0, this, _onmouseover);
        this.attachEvent("mouseout",  0, this, _onmouseover);
        this.attachEvent("mousedown", 0, this, _onmousedown);
        this.attachEvent("mouseup",   0, this, _onmouseup);
    };

    var _onmouseover = function(e){
        var from = e.fromElement, to = e.toElement,
        fid = from ? from.uuid : undefined, tid = to ? to.uuid : undefined,
        fobj, tobj, cache = this.cache;

        if(fid != tid){
            fobj = cache[fid]; tobj = cache[tid];
            if(fobj && fobj.isHover() && fobj.isEnabled()){
                fobj.setHover(false);
                _incCounter.$clearTimer(this.timer);
            }
            if(tobj && !tobj.isHover() && tobj.isEnabled()){
                tobj.setHover(true);
            }
        }
    };

    var _onmousedown = function(e){
        this.diff = BASE;

        _incCounter.$clearTimer(this.timer);

        var src = e.srcElement,
        eid = src ? src.uuid : undefined, eobj = this.cache[eid];
        if(eobj && eobj.isEnabled()){
            this.timer = 
                _incCounter.$delay(this, this.def.accel.delay, eobj);
        }
    };

    var _onmouseup = function(e){
        _incCounter.$clearTimer(this.timer);
        
        var src = e.srcElement,
        eid = src ? src.uuid : undefined, eobj = this.cache[eid];
        if(eobj && eobj.isEnabled()){
            _incCounter.call(this, eobj, false);    
        }
    };

    var _incCounter = function(ctrl, repeat){
        var accel = this.def.accel, type, cyclic = this.isCyclic(),
        count = this.getCount(), p = this.getPos();

        if(ctrl === this.ctrl0){
            if(this.isHorizontal()){
                p = _decrease.call(this, cyclic, accel.inc, count, p);
                type = Class.isNumber(p) ? "decrease" : null;
            }else{
                p = _increase.call(this, cyclic, accel.inc, count, p);
                type = Class.isNumber(p) ? "increase" : null;
            }
        }else if(ctrl === this.ctrl1){
            if(this.isHorizontal()){
                p = _increase.call(this, cyclic, accel.inc, count, p);
                type = Class.isNumber(p) ? "increase" : null;
            }else{
                p = _decrease.call(this, cyclic, accel.inc, count, p);
                type = Class.isNumber(p) ? "decrease" : null;
            }
        }
        
        if(type){
            if(repeat !== false){
                this.notifyPeer(
                    this.getMsgType(),
                    new Event(
                        type, 
                        {pos: p, 
                         count: count,
                         diff: this.diff - BASE}, 
                        this),
                    true);

                this.timer = _incCounter.$delay(this, accel.repeat, ctrl);

            }else{
                this.notifyPeer(
                    this.getMsgType(),
                    new Event(
                        "changed", 
                        {pos: p, 
                         count: count,
                         diff: this.diff - BASE}, 
                        this), 
                    true);
            }
        }        
    };

    var _increase = function(cyclic, d, count, p){
        if(cyclic || (!cyclic && p < count-1)){
            this.diff++;
            return this.increase(d);    
        }
        return null;
    };

    var _decrease = function(cyclic, d, count, p){
        if(cyclic || (!cyclic && p > 0)){
            this.diff--;
            return this.decrease(d);  
        }
        return null;
    };

    thi$.destroy = function(){
        delete this.cache;

        arguments.callee.__super__.apply(this,arguments);

    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.Spinner";
        def.className = def.className || "jsvm_vspinner";
        def.direction = Class.isNumber(def.direction) ? def.direction : 1;
        def.cyclic = def.cyclic || false;
        def.stateless = true;

        arguments.callee.__super__.apply(this, arguments);
        
        _createElements.call(this);

        var M = this.def;
        this.setRange(M.lower, M.upper);
        this.setPos(M.index);
        
        var accel = M.accel = M.accel || {};
        accel.delay = Class.isNumber(accel.delay) ? accel.delay : 350;
        accel.repeat= Class.isNumber(accel.repeat)? accel.repeat: 150;
        accel.inc = Class.isNumber(accel.inc) ? accel.inc : 1;

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Container).$implements(
    js.util.Counter, js.awt.Bidirectional);

