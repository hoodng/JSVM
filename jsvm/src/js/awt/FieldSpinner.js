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
 * Author: hudong@dong.hu@china,jinfonet.com
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.awt");

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
 *     cyclic: boolean,
 * 
 *     editable: boolean
 * }
 * 
 */
js.awt.FieldSpinner = function(def, Runtime){

    var CLASS = js.awt.FieldSpinner, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, 
    System = J$VM.System, MQ = J$VM.MQ;

    thi$.getMsgType = function(){
        return "js.awt.event.FieldEvent";
    };

    thi$.setText = function(text){
        this.label.setText(text);
    };

    thi$._onSpinnerEvent = function(e){
        var data = e.getData();
        this.setText(data.pos+"");

        e.setEventTarget(this);
        this.notifyPeer(this.getMsgType(), e);
    };

    var _createElements = function(def){
        var R = this.Runtime(), label, spinner;
        label = new js.awt.Label(
            {
                className: this.className + "_label",
                id: "label",
                rigid_w : false,
                editable: def.editable
            }, R);
        this.addComponent(label);
        
        spinner = new (Class.forName("js.awt.Spinner"))(
            {
                id: "spinner",
                rigid_h: false,
                lower: def.lower,
                upper: def.upper,
                index: def.index,
                cyclic: def.cyclic,
                accel: def.accel,
                direction : 1
            }, R);
        this.addComponent(spinner);

        this.setText(spinner.getValue()+"");

        spinner.setPeerComponent(this);
        MQ.register(spinner.getMsgType(), this, this._onSpinnerEvent);
        
    };
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.FieldSpinner";
        def.className = def.className || "jsvm_fieldspinner";
        
        arguments.callee.__super__.apply(this, arguments);
        
        _createElements.call(this, def);
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.HBox);

