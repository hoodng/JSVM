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
 *     id: 
 *     className:
 *     
 *     type: 1: Date picker, 2: Time picker, 3: DateTime picker
 * 
 * }
 */
js.awt.DatePicker = function(def, Runtime){

    var CLASS = js.awt.DatePicker, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, 
    System = J$VM.System, MQ = J$VM.MQ,

    Spinner = Class.forName("js.awt.FieldSpinner"),
    Calendar= Class.forName("js.awt.Calendar"),
    YFormat = Class.forName("js.text.YearFormat"),
    MFormat = Class.forName("js.text.MonthFormat"),
    HFormat = Class.forName("js.text.HourFormat"),
    SFormat = Class.forName("js.text.MinuteFormat");
    
    thi$.getMsgType = function(){
        return "js.awt.event.DatePickerEvent";
    };
    
    thi$.getPickerType = function(){
        return this.def.type;
    };

    var _createElements = function(def){
        var R = this.Runtime(), type = def.type,
        fYear, fMonth, fDate, fHour, fMinute, fSecond, rdoAM, rdoPM,
        date = def.date;
        
        date = Class.isDate(date) ? date : new Date();

        if((type & 0x01) != 0){
            fMonth = new Spinner(
                {
                    id: "fMonth",
                    cyclic: true,
                    constraints:{rowIndex:0, colIndex:0}
                }, R);
            fMonth.setPeerComponent(this);
            fMonth.setFormater(new MFormat("MMMM"));
            fMonth.initialize(0, 11, date.getMonth());
            this.addComponent(fMonth);

            fYear = new Spinner(
                {
                    id: "fYear",
                    cyclic: true,
                    constraints:{rowIndex:0, colIndex:5}
                }, R);
            fYear.setPeerComponent(this);
            fYear.setFormater(new YFormat("yyyy"));
            fYear.initialize(1, 9999, date.getFullYear());
            this.addComponent(fYear);

            fDate = new Calendar(
                {
                    id: "fDate",
                    date: date,
                    rigid_w: false,
                    rigid_h: false,
                    constraints:{rowIndex:1, colIndex:0}
                }, R);
            fDate.setPeerComponent(this);
            this.addComponent(fDate);
        }
        
        if((type & 0x02) != 0){
            fHour = new Spinner(
                {
                    id: "fHour",
                    cyclic: true,
                    align_y: 1.0,
                    constraints:{rowIndex:2, colIndex:0}
                }, R);
            fHour.setPeerComponent(this);
            fHour.setFormater(new HFormat("HH"));
            fHour.initialize(0, 23, date.getHours());
            this.addComponent(fHour);

            // For the ":"            
            this.addComponent(new js.awt.Label(
                                  {text:":", 
                                   height: 20,
                                   align_x: 0.5,
                                   align_y: 0.5,
                                   constraints:{rowIndex:2, colIndex:1} 
                                  }, R));

            fMinute = new Spinner(
                {
                    id: "fMinute",
                    cyclic: true,
                    align_y: 1.0,
                    constraints:{rowIndex:2, colIndex:2}
                }, R);
            fMinute.setPeerComponent(this);
            fMinute.setFormater(new SFormat("mm"));
            fMinute.initialize(0, 59, date.getMinutes());
            this.addComponent(fMinute);
            
            // For the ":"
            this.addComponent(new js.awt.Label(
                                  {text:":", 
                                   height: 20,
                                   align_x: 0.5,
                                   align_y: 0.5,
                                   constraints:{rowIndex:2, colIndex:3} 
                                  }, R));
            fSecond = new Spinner(
                {
                    id: "fSecond",
                    cyclic: true,
                    align_y: 1.0,
                    constraints:{rowIndex:2, colIndex:4}
                }, R);
            fSecond.setPeerComponent(this);
            fSecond.setFormater(new SFormat("ss"));
            fSecond.initialize(0, 59, date.getSeconds());
            this.addComponent(fSecond);
            
            rdoAM = new js.awt.RadioButton(
                {
                    id: "rdoAM",
                    labelText: "AM",
                    group: "AM_PM",
                    align_x: 1.0,
                    align_y: 1.0,
                    rigid_w: false,
                    constraints:{rowIndex:2, colIndex:5} 
                }, R);
            rdoAM.setPeerComponent(this);
            this.addComponent(rdoAM);
            
            rdoPM = new js.awt.RadioButton(
                {
                    id: "rdoPM",
                    labelText: "PM",
                    group: "AM_PM",
                    align_x: 1.0,
                    align_y: 1.0,
                    rigid_w: false,
                    constraints:{rowIndex:2, colIndex:6} 
                }, R);
            rdoPM.setPeerComponent(this);
            this.addComponent(rdoPM);

        }
        
    };
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.DatePicker";
        def.className = def.className || "jsvm_datepicker";
        
        def.type = Class.isNumber(def.type) ? def.type : 3;

        def.layout = {
            classType: "js.awt.GridLayout",
            rowNum: 3,
            colNum: 7,
            rows:[
                {index:0, measure:24,  rigid:true, 
                 visible: (def.type & 0x01) != 0},

                {index:1, weight: 1.0, rigid:false,
                 visible: (def.type & 0x01) != 0},

                {index:2, measure:24,  rigid:true, 
                 visible: (def.type & 0x02) != 0}
            ],
            cols:[
                {index:1, measure:10, rigid: true},
                {index:3, measure:10, rigid: true}
            ],
            cells:[
                {rowIndex:0, colIndex:0, colSpan:5, paddingRight: 10},
                {rowIndex:0, colIndex:5, colSpan:2},
                {rowIndex:1, colIndex:0, colSpan:7},
                {rowIndex:2, colIndex:5, paddingLeft: 5},
                {rowIndex:2, colIndex:6, paddingLeft: 5}
            ]
        };
        
        arguments.callee.__super__.apply(this, arguments); 
        
        _createElements.call(this, def);
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

