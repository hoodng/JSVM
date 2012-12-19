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
 * Author: hudong@HuDong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.awt");

$import("js.awt.Bidirectional");
/**
 * 
 */
js.awt.SpinPane = function(def, Runtime){

    var CLASS = js.awt.SpinPane, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
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
        var ctrl0 = this.ctrl0, ctrl1 = this.ctrl1, pane = this.pane, w;

        this.setUBounds(0,0, undefined, D.innerPMeasure, null, ctrl0);
        w = this.getMeasure(ctrl0);
        this.offset0 = D.MBP.borderM0 + w;
        
        this.setUBounds(null, 0, undefined, D.innerPMeasure, null, ctrl1);
        this.setUEndStyle(0, ctrl1);
        this.offset1 = 0 - D.MBP.borderM1 - this.getMeasure(ctrl1);

        this.setUSize(D.innerMeasure, D.innerPMeasure, 3, pane);

        if(this.def.miniSize == undefined){
            w += this.getMeasure(ctrl1);
            this.setUMinimumSize(D.MBP.BM + 1 + w, D.pmeasure);
        }
    };

    var _createElements = function(){
        var ctrl0, ctrl1, pane, R = this.Runtime();
        this.cache = {};
        
        var pdef = this.def.pane;
        pdef.className = this.className + "_pane";
        pdef.id = "pane";
        pdef.movable = false;
        pdef.stateless = true;
        pdef.css = "position:absolute;overflow:hidden;";
        pane = new js.awt.ScrollPane(pdef, R);
        this.addComponent(pane);
        this.cache[pane.uuid()] = pane;

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

            }
            if(tobj && !tobj.isHover() && tobj.isEnabled()){
                tobj.setHover(true);
            }
        }
    };

    var _onmousedown = function(e){
        var src = e.srcElement,
        eid = src ? src.uuid : undefined, eobj = this.cache[eid];
        if(eobj && eobj.isEnabled()){
            System.err.println(eobj.id+" mousedn");
        }
    };

    var _onmouseup = function(e){
        var src = e.srcElement,
        eid = src ? src.uuid : undefined, eobj = this.cache[eid];
        if(eobj && eobj.isEnabled()){
            switch(eobj.id){
                case "ctrl0":
                this.pane.scrollPrevious();
                break;
                case "ctrl1":
                this.pane.scrollNext();
                break;
            }
        }
    };

    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.SpinPane";
        def.className = def.className || "jsvm_hspinpane";
        def.direction = Class.isNumber(def.direction) ? def.direction : 0;
        def.stateless = true;
        def.pane = def.pane || js.awt.ScrollPane.DEFAULTDEF();

        arguments.callee.__super__.apply(this, arguments);

        _createElements.call(this);
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Container).$implements(js.awt.Bidirectional);

