/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: mingfa.pan@china,jinfonet.com
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

$import("js.swt.ComboBox");

js.awt.DTComboBox = function(def, Runtime){
	var CLASS = js.awt.DTComboBox, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event,
	System = J$VM.System, MQ = J$VM.MQ;
	
	thi$.setValue = function(v){
		this.setSelectedValues([v]);
	};
	
	thi$.getValue = function(){
		var vs = this.getSelectedValues();
		return Class.isArray(vs) ? vs[0] : undefined;
	};
	
	thi$.setFormater = function(formater){
		this.formater = formater;
	};
	
	thi$.getFormater = function(){
		return this.formater;
	};
	
	thi$.setStepper = function(stepper){
		var M = this.def;
		if(Class.isNumber(stepper)){
			M.stepper = stepper;
		}
	};
	
	thi$.getStepper = function(){
		return this.def.stepper;
	};
	
	thi$.setPos = function(index){
		if(!Class.isNumber(index) || index < 0){
			return;
		}
		
		var ms = this.getItemModels() || [], m;
		for(var i = 0, len = ms.length; i < len; i++){
			m = ms[i];
			if(m && m.pos === index){
				this.setSelectedIndexes([i]);
			}
		}
	};
	
	thi$.getPos = function(){
		var m = this.getSelectedModel();
		return m.pos;
	};

	var _getItemsInRange = function(lower, upper){
		var formater = this.formater, stepper = this.getStepper(),
		items = [], fv, m;
		while(lower <= upper){
			fv = formater ? formater.format(lower) : lower;
			items.push({dname: fv, value: fv, pos: lower});
			
			lower += stepper;
		}
		
		return items;
	};
	
	var _updateItems = function(){
		var M = this.def,
		ms = _getItemsInRange.call(this, M.lower, M.upper);
		
		this.setItemsByModel(ms);
	};
	
	thi$.setRange = function(lower, upper){
		var M = this.def, itemModels;
		
		lower = Class.isNumber(lower) ? lower 
			: Class.isNumber(M.lower) ? M.lower : 0;
		upper = Class.isNumber(upper) ? upper
			: Class.isNumber(M.upper) ? M.upper : 99;
		
		if(lower < upper){
			M.lower = lower;
			M.upper = upper;
		}else{
			M.lower = upper;
			M.upper = lower;
		}
		
		// Init items of DropdownList
		_updateItems.call(this);
	};
	
	thi$.getRange = function(){
		var M = this.def;
		return {lower: M.lower, upper: M.upper};
	};
	
	thi$.initialize = function(lower, upper, index){
		this.setRange(lower, upper);
		this.setPos(index);
	};
	
	thi$.onSelectedChanged = function(target, eType){
		var eData = {
			comboID: this.id, 
			value: this.getValue(),
			pos: this.getPos()
		},
		evt = new Event(eType || "Selected", eData, this);
		this.notifyPeer(this.getMsgType(), evt);
		
	}.$override(this.onSelectedChanged);
	
	thi$._init = function(def, Runtime){
		if(typeof def !== "object") return;
		
		def.stepper = Class.isNumber(def.stepper) ? def.stepper : 1;
		$super(this);
		
		this.setMsgType("js.awt.event.FieldEvent");
		this.initialize(def.lower, def.upper);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.swt.ComboBox);

/**
 * @param def:{
 *	   id: 
 *	   className:
 * 
 *	   date:
 *	   
 *	   dateSymbols:
 * 
 *	   type: 1: Date picker, 2: Time picker, 3: DateTime picker
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

	Calendar = Class.forName("js.util.Calendar"), 
	YFormat	 = Class.forName("js.text.YearFormat"),
	MFormat	 = Class.forName("js.text.MonthFormat"),
	HFormat	 = Class.forName("js.text.HourFormat"),
	SFormat	 = Class.forName("js.text.MinuteFormat"),
	
	cDef = {
		classType: "js.awt.DTComboBox",
		className: "jsvm_simpleCombo",
		
		rigid_w: true, rigid_h: true,
		width: 80, height: 18,
		
		align_x: 0.0, align_y: 0.5,
		
		wholeTrigger: true,
		subview: {
			hauto: true,
			vauto: true,
			
			maxiSize: {height: 180}
		}
	};
	
	thi$.getMsgType = function(){
		return "js.awt.event.DatePickerEvent";
	};
	
	thi$.getPickerType = function(){
		return this.def.type;
	};
	
	/**
	 * Indicate whether use 24 hour format fot time picker.
	 * 
	 * @param b: {Boolean} true to use 24 hour format.
	 * @param force: {Boolean} force to set the use24H again.
	 */
	thi$.set24HFormat = function(b, force){
		b = (b === true);
		
		var M = this.def, selector = this.tfSelector,
		hformat;
		if(force === true || M.use24H !== b){
			M.use24H = b;
			_updateTimePicker.call(this);
			
			if(selector){
				hformat = b ? "24h" : "12h";
				selector.setSelectedValues([hformat]);
			}
		}
	};
	
	thi$.is24HFormat = function(){
		return this.def.use24H;
	};
	
	var _updateDatePicker = function(calendar, date){
		calendar = calendar || this.calendar;
		
		if(this.fYear){
			this.fYear.setPos(calendar.get(Calendar.YEAR));
		}
		
		if(this.fMonth){
			this.fMonth.setPos(calendar.get(Calendar.MONTH));
		}
		
		if(this.fDate){
			date = date || calendar.getDate();
			this.fDate.setDate(date);
		}
	};
	
	var _updateTimePicker = function(calendar){
		calendar = calendar || this.calendar;
		
		var use24H = this.is24HFormat(), hformater, hour, v0, v1,
		fHour = this.fHour, pos, rdoAM, rdoPM, visible, vstyle;
		if(fHour){
			v0 = use24H ? 0 : 1;
			v1 = use24H ? 23 : 12;
			hformater = new HFormat(use24H ? "H" : "h");
			hour = calendar.get(Calendar.HOUR_OF_DAY);
			pos = parseInt(hformater.format(hour));

			fHour.setFormater(hformater);
			fHour.initialize(v0, v1, pos);
			
			rdoAM = this.rdoAM;
			rdoPM = this.rdoPM;
			
			if(hour < 12){
				rdoAM.mark(true);
			}else{
				rdoPM.mark(true);
			}
			
			visible = !use24H;
			if(this._local.APMVisible !== visible){
				this._local.APMVisible = visible;
				
				vstyle = {visibility: visible ? "visible" : "hidden"};
				rdoAM.applyStyles(vstyle);
				rdoPM.applyStyles(vstyle);
			}
		}
		
		if(this.fMinute){
			this.fMinute.setPos(calendar.get(Calendar.MINUTE));
		}
		
		if(this.fSecond){
			this.fSecond.setPos(calendar.get(Calendar.SECOND));
		}
	};
	
	thi$.setDate = function(date, notify){
		var calendar = this.calendar;
		if(!calendar){
			calendar = new Calendar(date);
			this.calendar = calendar;
		}else{
			calendar.setDate(date);			   
		}
		
		_updateDatePicker.call(this, calendar, date);
		_updateTimePicker.call(this, calendar);
		
		if(notify == true){
			this.notifyPeer(
				this.getMsgType(), 
				new Event("changed", calendar.getDate(), this),
				true);
		}
	};

	thi$.getDate = function(){
		return this.calendar.getDate();
	};
	
	var _setHours = function(val){
		var use24H = this.is24HFormat(), calendar = this.calendar,
		hformater;
		if(use24H){ // 0 ~ 23
			hformater = new HFormat("H");
			val = parseInt(hformater.format(val));
		}else{ // 1 ~ 12
			if(this.rdoAM.isMarked()){
				if(val == 12){ // AM 12 ==> 00; AM 1 ~ 11 ==> 1 ~ 11
					val = 0;
				}
			}else{
				if(val < 12){ // PM 1 ~ 11 ==> 13 ~ 23; PM 12 ==> 12
					val = val + 12; 
				}
			}
		}

		calendar.set(Calendar.HOUR_OF_DAY, val);			
	};
	
	var _onFieldChanged = function(e){
		var eType = e.getType(), data = e.getData(), val = data.pos, 
		base, objid = e.getEventTarget().id,
		calendar = this.calendar;

		switch(objid){
		case "fYear":
			calendar.add(Calendar.YEAR, data.diff);
			break;
		case "fMonth":
			calendar.set(Calendar.MONTH, val);
			break;
		case "fHour":
			_setHours.call(this, val);
			break;
		case "fMinute":
			calendar.set(Calendar.MINUTE, val);
			break;
		case "fSecond":
			calendar.set(Calendar.SECOND, val);
			break;
		}
		
		this.setDate(calendar.getDate(), true);
	};

	var _onDateChanged = function(e){
		var calendar = this.calendar, date = e.getData();
		if(e.getType() == "changed"){
			date.setHours(calendar.get(Calendar.HOUR_OF_DAY));
			date.setMinutes(calendar.get(Calendar.MINUTE));
			date.setSeconds(calendar.get(Calendar.SECOND));
			date.setMilliseconds(calendar.get(Calendar.MILLISECOND));

			this.setDate(date, true);			 
		}
	};
	
	var _onTimeFormatChanged = function(e){
		var data = e.getData(), tformat = data.values[0],
		use24H = (tformat === "24h"), M = this.def,
		calendar = this.calendar;
		
		if(M.use24H !== use24H){
			M.use24H = use24H;		  
			_updateTimePicker.call(this, calendar);
			
			this.notifyPeer(
				this.getMsgType(), 
				new Event("changed", calendar.getDate(), this),
				true);
		}
	};
	
	var _onAMPMChanged = function(e){
		var calendar = this.calendar, hformater,
		fHour = this.fHour, val;

		if(e.getType() == "mouseup"){
			_setHours.call(this, fHour.getPos());

			this.notifyPeer(
				this.getMsgType(), 
				new Event("changed", calendar.getDate(), this),
				true);
		}
	};
	
	var _createElements = function(def){
		var R = this.Runtime(), type = def.type, fdef,
		fYear, fMonth, fDate, tfdef, tfSelector, tFormatCombo, 
		fHour, fMinute, fSecond, rdoAM, rdoPM, use24H = def.use24H,
		date = def.date, symbols = def.dateSymbols,
		
		DTComboBox = Class.forName("js.awt.DTComboBox"),
		Spinner = Class.forName("js.awt.FieldSpinner"),
		ACalendar= Class.forName("js.awt.Calendar");

		this.mdiff = 10000;
		this.ydiff = 10000;

		date = Class.isDate(date) ? new Date(date.getTime()) : new Date();
		symbols = symbols ? symbols : R.dateSymbols();

		if((type & 0x01) != 0){
			// Month Selector
			fdef = System.objectCopy(cDef, {id: "fMonth"}, true);
			fdef.rigid_w = false;
			fdef.height = 20;
			fdef.align_y = 0.0;
			fdef.constraints = {rowIndex: 0, colIndex: 0};
			
			fMonth = new DTComboBox(fdef, R);
			fMonth.setSubviewRoot(this);
			fMonth.setPeerComponent(this);

			fMonth.setFormater(new MFormat("MMMM", symbols));
			fMonth.initialize(0, 11, date.getMonth());
			this.addComponent(fMonth);
			
			// Year Spinner
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
			
			// Calendar
			fDate = new ACalendar(
				{
					id: "fDate",
					date: date,
					dateSymbols: symbols,
					rigid_w: false,
					rigid_h: false,
					constraints:{rowIndex:1, colIndex:0}
				}, R);
			fDate.setPeerComponent(this);
			this.addComponent(fDate);
			
			// For user pick day
			MQ.register(fDate.getMsgType(), this, _onDateChanged);
		}
		
		if((type & 0x02) != 0){
			// 12 / 24 hour format selector
			tfdef = {
				text: R.nlsText("timeFormatSelectorLabel", "Display Time Format:"), 
				height: 20,

				align_x: 0.0, align_y: 0.5,
				constraints:{rowIndex:2, colIndex:0} 
			};
			this.addComponent(new js.awt.Label(tfdef, R));
			
			tfdef = {
				id: "tfSelector",
				classType: "js.swt.ComboBox",
				className: "jsvm_simpleCombo",
				
				rigid_w: false, rigid_h: true,
				height: 18,
				
				wholeTrigger: true,				
				subview: {
					hauto: true,
					vauto: true,
					
					itemModels: [
						{
							dname: R.nlsText("timeFormat12hour", "12 hour"), 
							value: "12h"
						},
						{
							dname: R.nlsText("timeFormat24hour", "24 hour"), 
							value: "24h"
						}
					]
				},
				
				align_x: 0.0, align_y: 0.5,
				constraints:{rowIndex:2, colIndex:5}
			};
			tfSelector = new (Class.forName(tfdef.classType))(tfdef, R);
			tfSelector.setPeerComponent(this);
			tfSelector.setSubviewRoot(this);
			this.addComponent(tfSelector);
			
			// Hour selector
			fdef = System.objectCopy(cDef, {id: "fHour"}, true);
			fdef.rigid_w = false;
			fdef.constraints = {rowIndex: 3, colIndex: 0};
			
			fHour = new DTComboBox(fdef, R);
			fHour.setSubviewRoot(this);
			fHour.setPeerComponent(this);
			
			fHour.setFormater(new HFormat("h"));
			fHour.initialize(0, 23, date.getHours());
			this.addComponent(fHour);

			// For the ":"			  
			this.addComponent(new js.awt.Label(
								  {text:":", 
								   height: 20,
								   align_x: 0.5,
								   align_y: 0.5,
								   constraints:{rowIndex:3, colIndex:1} 
								  }, R));
			
			// Minute Selector
			fdef = System.objectCopy(cDef, {id: "fMinute"}, true);
			fdef.rigid_w = false;
			fdef.constraints = {rowIndex: 3, colIndex: 2};

			fMinute = new DTComboBox(fdef, R);
			fMinute.setSubviewRoot(this);
			fMinute.setPeerComponent(this);

			fMinute.setFormater(new SFormat("m"));
			fMinute.initialize(0, 59, date.getMinutes());
			this.addComponent(fMinute);
			
			// For the ":"
			this.addComponent(new js.awt.Label(
								  {text:":", 
								   height: 20,
								   align_x: 0.5,
								   align_y: 0.5,
								   constraints:{rowIndex:3, colIndex:3} 
								  }, R));
			
			// Second Selector
			fdef = System.objectCopy(cDef, {id: "fSecond"}, true);
			fdef.rigid_w = false;
			fdef.constraints = {rowIndex: 3, colIndex: 4};

			fSecond = new DTComboBox(fdef, R);
			fSecond.setSubviewRoot(this);
			fSecond.setPeerComponent(this);

			fSecond.setFormater(new SFormat("s"));
			fSecond.initialize(0, 59, date.getSeconds());
			this.addComponent(fSecond);
			
			// AM Radio
			rdoAM = new js.awt.RadioButton(
				{
					id: "rdoAM",
					labelText: symbols.ampm[0],
					group: "AM_PM",
					align_x: 0.5,
					align_y: 1.0,
					width: 50,
					rigid_w: true,
					constraints:{rowIndex:3, colIndex:5} 
				}, R);
			rdoAM.setPeerComponent(this);
			this.addComponent(rdoAM);
			
			// PM Radio
			rdoPM = new js.awt.RadioButton(
				{
					id: "rdoPM",
					labelText: symbols.ampm[1],
					group: "AM_PM",
					align_x: 0.5,
					align_y: 1.0,
					rigid_w: false,
					constraints:{rowIndex:3, colIndex:6} 
				}, R);
			rdoPM.setPeerComponent(this);
			this.addComponent(rdoPM);

			if(date.getHours() < 12){
				rdoAM.mark(true);
			}else{
				rdoPM.mark(true);
			}

			MQ.register(tfSelector.getMsgType(), this, _onTimeFormatChanged);
			MQ.register(rdoPM.getMsgType(), this, _onAMPMChanged);
		}

		MQ.register("js.awt.event.FieldEvent", this, _onFieldChanged);

		this.setDate(date);
	};
	
	thi$._init = function(def, Runtime){
		if(def == undefined) return;

		def.classType = def.classType || "js.awt.DatePicker";
		def.className = def.className || "jsvm_datepicker";
		
		def.type = Class.isNumber(def.type) ? def.type : 3;
		
		def.layout = {
			classType: "js.awt.GridLayout",
			rowNum: 4,
			colNum: 7,
			rows:[
				{index:0, measure:24,  rigid:true, 
				 visible: (def.type & 0x01) != 0},

				{index:1, weight: 1.0, rigid:false,
				 visible: (def.type & 0x01) != 0},

				{index:2, measure:26,  rigid:true, 
				 visible: (def.type & 0x02) != 0},
				
				{index:3, measure:24,  rigid:true, 
				 visible: (def.type & 0x02) != 0}
			],
			cols:[
				{index:0, weight:0.166, rigid:false},
				{index:1, measure:10, rigid: true},
				{index:2, weight:0.166, rigid:false},
				{index:3, measure:10, rigid: true},
				{index:4, weight:0.166, rigid:false}
			],
			cells:[
				{rowIndex:0, colIndex:0, colSpan:5},
				{rowIndex:0, colIndex:5, colSpan:2, paddingLeft:10},
				{rowIndex:1, colIndex:0, colSpan:7},
				{rowIndex:2, colIndex:0, colSpan:5},
				{rowIndex:2, colIndex:5, colSpan:2, paddingLeft: 4},
				{rowIndex:3, colIndex:5, paddingLeft: 10},
				{rowIndex:3, colIndex:6, paddingLeft: 5}
			]
		};
		
		$super(this); 
		
		_createElements.call(this, def);

		this.set24HFormat(def.use24H, true);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.awt.Container);

