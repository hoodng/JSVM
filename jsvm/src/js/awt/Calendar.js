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

/**
 * Calendar control
 * 
 * @param def:{
 *     className: xxx
 *     id: 
 *     dateSymbols: @see js.lang.Runtime
 * }
 * @param Runtime
 * @param date, Date object
 */
js.awt.Calendar = function(def, Runtime){

    var CLASS = js.awt.Calendar, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ, 
    Calendar = Class.forName("js.util.Calendar");

    thi$.getMsgType = function(){
        return "js.awt.event.CalendarChanged";
    };

    thi$.getDayStyleClass = function(date){
        var names=[], day;

        if(date.getMonth() != this.month){
            names.push("outmonth");
        }else{
            if(Calendar.compareDate(date, new Date()) == 0){
                names.push("today");
            }
        }

        if(Calendar.compareDate(date, this.getDate()) == 0){
            names.push("selectday");
        }

        day = date.getDay();
        if(day == 0){
            names.push("sunday");
        }else if(day == 6){
            names.push("saturday");
        }

        return names.join(" ");
        
    };

    thi$.setDate = function(date, notify){
        date = Class.isDate(date) ? 
            new Date(date.getTime()) : new Date();
        
        _update.call(this, date);

        if(notify === true){
            this.notifyPeer(
                this.getMsgType(), 
                new Event("changed", this.getDate(), this));
        }
    };

    thi$.getDate = function(){
        return this.date;
    };


    var _update = function(date){
        var dates = _getDaysOfCurrentMonth.call(this, date), 
        temp;

        this.date = date;
        for(var i=0; i<42; i++){
            temp = dates[i];
            temp.uuid = "cell"+(7+i);
            this[temp.uuid].setDate(
                temp, this.getDayStyleClass(temp));
        }
    };

    var _getDaysOfCurrentMonth = function(date){
        var year = date.getFullYear(), 
        month = date.getMonth(), dates;

        if(year == this.year && month == this.month){
            dates = this.dates;
        }else{
            this.year  = year;
            this.month = month;

            var calendar = new Calendar(date), n=41;
            calendar.setDate(calendar.getFirstDayOfCurrentMonth());
            calendar.setDate(calendar.getFirstDayOfCurrentWeek());

            dates = [];

            dates.push(new Date(calendar.getTimeInMillis()));
            while(n-- > 0){
                calendar.add(Calendar.DATE, 1);
                dates.push(new Date(calendar.getTimeInMillis()));
            }

            this.dates = dates;
        }

        return dates;
    };

    var _onmouseover = function(e){
        var from = e.fromElement, to = e.toElement, 
        fid = from ? from.uuid : undefined, 
        tid = to ? to.uuid : undefined,
        fitem, titem, cache = this.cache;

        if(fid !== tid){
            fitem = cache[fid];
            titem = cache[tid];
            if(fitem && fitem.hasStyleClass("hovercell")){
                fitem.removeStyleClass("hovercell");
            }
            if(titem && !titem.hasStyleClass("hovercell")){
                titem.appendStyleClass("hovercell");
            }
        }
    };

    var _onclick = function(e){
        var ele = e.srcElement, eid = ele ? ele.uuid : undefined,
        cache = this.cache, item = cache[eid];
        if(item){
            this.setDate(item.getDate(), true);
        }
    };

    var _createElements = function(def){
        var R = this.Runtime(),
        dateSymbols = def.dateSymbols || R.dateSymbols(),
        cellClassType = def.cellClassType = 
            def.cellClassType || "js.awt.CalendarBaseCell",
        cellClass = Class.forName(cellClassType),
        cache = this.cache = {}, cell, cellid;
        
        for(var i=0; i<49; i++){
            cellid = "cell"+i;
            cell = new cellClass(
                {
                    id: cellid,
                    uuid: cellid,
                    dateSymbols: dateSymbols,
                    rigid_w : false,
                    rigid_h : false,
                    constraints:{
                        rowIndex: Math.floor(i/7),
                        colIndex: i%7
                    }

                }, R);

            if(i < 7) {
                cell.setWeek(i);
            }else{
                cache[cellid] = cell;                
            }

            this.addComponent(cell);
        }

        this.attachEvent("mouseover", 0, this, _onmouseover);
        this.attachEvent("mouseout",  0, this, _onmouseover);
        this.attachEvent("click",     0, this, _onclick);
    };

    thi$.destroy = function(){
        arguments.callee.__super__.apply(this, arguments);

        delete this.cache;

        this.detachEvent("mouseover", 0, this, _onmouseover);
        this.detachEvent("mouseout",  0, this, _onmouseover);
        this.detachEvent("click",     0, this, _onclick);
        
    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = "js.awt.Calendar";
        def.className = def.className || "jsvm_calendar";
        def.stateless = true;

        def.layout = {
            classType : "js.awt.GridLayout",
            rowNum: 7,
            colNum: 7
        };

        arguments.callee.__super__.apply(this, arguments);

        _createElements.call(this, this.def);
        
        this.setDate(this.def.date, true);

    }.$override(this._init);

    this._init.apply(this, arguments);
    
}.$extend(js.awt.Container);

js.awt.CalendarCell = function(){

    var CLASS = js.awt.CalendarCell, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;

    thi$.setDate = function(date){
        this.date = date;
    };

    thi$.getDate = function(){
        return this.date;
    };

    thi$.setWeek = function(week){
        this.week = week;
    };

    thi$.getWeek = function(){
        return this.week;
    };
    
};

js.awt.CalendarBaseCell = function(def, Runtime){

    var CLASS = js.awt.CalendarBaseCell, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;

    /**
     * @see js.awt.CalendarCell
     */
    thi$.setDate = function(date, className){
        arguments.callee.__super__.apply(this, arguments);

        if(Class.isString(className)){
            this.clearStyleClass();
            this.appendStyleClass(className);            
        }

        this.setText(date.getDate()+"");

    }.$override(this.setDate);

    /**
     * @see js.awt.CalendarCell
     */
    thi$.setWeek = function(week){
        arguments.callee.__super__.apply(this, arguments);
        
        this.appendStyleClass("weekcell");
        
        if(Class.isNumber(week)){
            week = this.def.dateSymbols.sWeekdays[week];
        }

        this.setText(week);

    }.$override(this.setWeek);
    

    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        def.className = def.className || "jsvm_calendar_cell";
        def.text = def.text || " ";
        def.stateless = true;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this._init);

    this._init.apply(this, arguments);
    
}.$extend(js.awt.Label).$implements(js.awt.CalendarCell);

