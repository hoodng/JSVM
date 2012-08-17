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

    thi$.setDate = function(date){
        _update.call(this, date);
    };

	var _update = function(date){
	    var cells = this.cells,
		dates = _getDaysOfCurrentMonth.call(this, date);

		for(var i=0; i<42; i++){
        	cells[7+i].setDate(dates[i], this.month);
		}
	};

    var _getDaysOfCurrentMonth = function(date){
        var month = date.getMonth(), dates;
        if(month == this.month){
            dates = this.dates;
        }else{
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

    var _createElements = function(def){
        var R = this.Runtime(),
		dateSymbols = def.dateSymbols || R.dateSymbols(),
        cellClassType = def.cellClassType = 
            def.cellClassType || "js.awt.CalendarBaseCell",
        cellClass = Class.forName(cellClassType),
        cells = this.cells = new Array(49), cell;
        
        for(var i=0; i<49; i++){
            cell = new cellClass(
                {
					dateSymbols: dateSymbols,

                    rigid_w : false,
                    rigid_h : false,
                    constraints:{
                        rowIndex: Math.floor(i/7),
                        colIndex: i%7
                    }

                }, R);
			cells[i] = cell;

			if(i < 7) cell.setWeek(i);

            this.addComponent(cell);
        }

    };

    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.stateless = true;
        def.className = def.className || "jsvm_calendar";

        def.layout = {
            classType : "js.awt.GridLayout",
            rowNum: 7,
            colNum: 7
        };

        arguments.callee.__super__.apply(this, arguments);

        _createElements.call(this, this.def);

        

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
    thi$.setDate = function(date, month){
        arguments.callee.__super__.apply(this, arguments);

		var className = this.className, today, day;

        if(date.getMonth() != month){
			this.view.className = className + " outrangecell";
		}else{
			today = new Date();
			if(date.getFullYear() == today.getFullYear() &&
			   date.getMonth() == today.getMonth() &&
			   date.getDate() == today.getDate()){
				this.view.className = className + " todaycell";				
			}
		}

        day = date.getDate();
        this.setText(day+"");

    }.$override(this.setDate);

    /**
     * @see js.awt.CalendarCell
     */
    thi$.setWeek = function(week){
        arguments.callee.__super__.apply(this, arguments);
        
		this.view.className = this.className + " weekcell";
		
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

