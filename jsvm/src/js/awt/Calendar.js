/**
 * 
 */
 
 $package("js.awt");

/**
 * Parameter def can be a date string, or it can also
 * be an JSON object. For example, we can initialize 
 * it as follow:
 *         var date = new js.awt.Calendar("10/24/2011");
 * or we can initialize an instance as the following
 * way:
 *         var date = new js.awt.Calendar({
 *             pattern : // e.g. "yyyy-MM-dd",
 *             renderTo : // HTML element or js.awt.Component object,
 *             preValue : // "2011-10-24",
 *             buttons : // There could be three buttons at the most, including OK, Cancel and Today. You customize them by
 *                          composing the values like js.awt.Calendar.OK | js.awt.Calendar.TODAY. if you don't want any button,
 *                          it should be js.awt.Calendar.config.NONE. This value will be set to the combination of 
 *                          js.awt.Calendar.config.OK | js.awt.Calendar.config.CANCEL by default.
 *             showTime : // true or false,
 *             lang : {
 *                 months : ["一月","二月","三月",......],
 *                weeks : ["周一","周二","周三",......],
 *                todayLabel : "默认为今天",
 *                prevLabel : "默认为上次",
 *                am : "上午",
 *                pm: "下午",
 *                ok : "确定",
 *                cancel : "取消",
 *                today : "今天"
 *             },
 *             this._onClick : // event handler
 *             this._onChange : // event handler
 *         });
 */
js.awt.Calendar = function(def, expProvider, runtime) {
    this._config = undefined;
    this._All_days = [];
    this._value = undefined;
    this._is24 = false;
    this._valueJSONObj = undefined;
        
    this._isAm = true;
    
    this._theDayClicked = 0;
    this._days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    this._cellClicked = null;
    this._compSet = {};
    this._default_ = false;
    
    this._checkbox = null;
    
    this._dateExpProvider;
    
    this._leftPanel = new js.awt.Container({
        className : "leftPanel"
    }); 
    this._rightPanel = null;
    this._mainPanel = null;
    this._btnContainer = null;
    this._expandButton = null;
    
    this._treeCon = null;
    
    this._expViewVisible = true;
    
    this._model = {
        date : null,
        dflt : null,
        expr : {
            name : 0,
            expr : null
        }
    };
    
    this.__thi$__ = this;
    
    this._model_backup = J$VM.System.objectCopy(this._model, this._model_backup, true);
    //this._model_backup = js.lang.Object.copy(this._model_backup, this._model, true);
    
    this._expression = null;
    this._expList = null;
    this._expView = null;
    this._preview = null;
    
    var CLASS = js.awt.Calendar, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        if (typeof def === "object") {
            this._doInit.call(this, def, expProvider, runtime);
        }
        return;
    }
    CLASS.__defined__ = true;
    
    
    thi$._updateValue = function() {
        this._valueJSONObj = undefined;
        var hours = this._value.getHours();
        this._valueJSONObj = {
                y : this._value.getFullYear(),
                M : this._value.getMonth(),
                d : this._value.getDate(),
                h : (this._is24 ? hours : (hours == 0 ? 12
                    : ((hours <= 12 && hours > 0) ? hours : hours - 12))),
                m : this._value.getMinutes(),
                s : this._value.getSeconds()
            };
            
        if (this._config.showExpressionView 
            && this._dateExpProvider != null 
            && this._expView != null) {
            var exp = this._expView.value;
            if (exp) {
                exp = exp.replace(/^\s+|\s+$/, "");
                if (exp != "") {
                    var fmt = this.pattern();
                    var dt = new (js.lang.Class.forName("js.text.SimpleDateFormat"))(fmt);
                    if (this._preview != null) this._preview.value = "";
                    this._dateExpProvider.checkExp(exp, this._config.pattern, dt.format(this._value));
                }
            }
        }
    }.$bind(this);
    
    thi$._onClick = function(cell) {
        this._model.date = this._value.getTime();
        
        if (typeof this._config["onClick"] == "function") {
            this._config["onClick"].$bind(this)(this, this.getValue());
        }
        
    };
    
    thi$._onChange = function(cell) {
        this._model_backup = J$VM.System.objectCopy(this._model, this._model_backup, true);
        //this._model_backup = js.lang.Object.copy(this._model_backup, this._model, true);
        if (typeof this._config["onChange"] == "function") {
            this._config["onChange"].$bind(this)(this, this.getValue());
        }
        this.hide(false);
    };
    
    thi$._onCancel = function() {
        this._model = {
            date : null,
            dflt : null,
            expr : {
                name : 0,
                expr : null
            }
        };
        this._default_ = false;
        this._checkbox.setCheck(false);
        this._value = new Date();
        if (this._config.showExpressionView) {
            this._expView.value = "";
            if (this._preview != null) this._preview.value = "";
            this._expList.selectedIndex = 0;
            this._expList.options[0].setAttribute("selected", true);
        }
        if(typeof this._config["onCancel"] == "function") {
            this._config["onCancel"].$bind(this)();
        }
    };
    
    thi$._isToday = function(y, m, d) {
        var date = null, today = new Date();
        date = new Date(y, m, d);
        return (!isNaN(date) && date.getFullYear() == today.getFullYear()
                && date.getMonth() == today.getMonth() && date.getDate() == today
                .getDate());
    };
    
    thi$._createElement = function(tagName) {
        return document.createElement(tagName);
    };
    
    thi$._onCellClick = function(e, cell) {
        e.cancelBubble();
        var val = parseInt(cell.getAttribute("__value__"));
        if (val == 0)
            return;
        var vj = this._valueJSONObj;
        if (this._cellClicked != null) {
            if (!this._isToday(vj.y, vj.M, parseInt(this._cellClicked
                    .getAttribute("__value__"))))
                this._cellClicked.className = "calendarCellNormal";
        }
        if (!this._isToday(vj.y, vj.M, val)) {
            cell.className = "calendarCellClicked";
        }
        this._cellClicked = cell;
        this._theDayClicked = val;
        this._value.setDate(this._theDayClicked);
        this._updateValue();
        
        this._onClick(cell);
    };
    
    thi$._onCellDblClick = function(e, cell) {
        if (this._config.dblclickEnable) {
            this._onChange(cell);
        }
    };
    
    thi$._onCellOver = function(e, cell) {
        var val = parseInt(cell.getAttribute("__value__")), 
            vj = this._valueJSONObj;
        if (val == this._theDayClicked || val == 0
                || this._isToday(vj.y, vj.M, val))
            return;
        cell.className = "calendarCellOver";
    };
    
    thi$._onCellOut = function(e, cell) {
        var val = parseInt(cell.getAttribute("__value__")), 
            vj = this._valueJSONObj;
        if (val == this._theDayClicked || val == 0
                || this._isToday(vj.y, vj.M, val))
            return;
        cell.className = "calendarCellNormal";
    };
    
    thi$._createHeader = function() {
        var header = new js.awt.Container({
            className : "calendarHeadContainer"
        });
        
        var monthSelector = this._createElement("select");
        for (var i = 0; i < this._config.lang.months.length; i++) {
            var option = this._createElement("option");
            option.setAttribute("value", i);
            option.innerHTML = this._config.lang.months[i];
            monthSelector.appendChild(option);
        }
        J$VM.$attachEvent(monthSelector, "change", false, this, function(e) {
            e.cancelBubble();
            var ms = monthSelector;
            var m = parseInt(ms.options[ms.selectedIndex].getAttribute("value"));
            this._value.setMonth(m);
            this._updateValue();
            this._updateUI();
        });
        var ms = monthSelector, vj = this._valueJSONObj;
        ms.options[vj.M].setAttribute("checked", true);
        ms.selectedIndex = vj.M;
        
        var yearSpinner = new js.awt.Spinner({
            value : this._value.getFullYear(),
            max : 9999,
            min : 1,
            className : "calendarYearSpinner",
            css : "position:absolute;"
        }, this.Runtime());
        
        yearSpinner.onValueChanged = function(ys) {
            this._value.setFullYear(ys.getValue());
            this._updateValue();
            this._updateUI();
        }.$bind(this);
        
        this._compSet.MS = monthSelector;
        this._compSet.ys = yearSpinner;
        
        header.view.appendChild(monthSelector);
        header.addComponent(yearSpinner);
        //yearSpinner.setPosition(124, 5);
        //this.addComponent(header);
        this._leftPanel.addComponent(header);
    };
    
    thi$._createTable = function() {
        var tbody = new js.awt.Container({
            className : "calendarBodyContainer"
        });
        
        var row = null, cell = null;
        for (var i = 0; i < 7; i++) {
            row = new js.awt.Container({
                className : "calendarRowContainer"
            });
            
            for (var j = 0; j < 7; j++) {
                cell = this._createElement("div");
                cell.className = "calendarCellNormal";
                
                if (i == 0) {
                    cell.innerHTML = this._config.lang.weeks[j];
                } else {
                    this._All_days.push(cell);
                    J$VM.$attachEvent(cell, "click", true, this,
                                      this._onCellClick.$bind(this, cell));
                    J$VM.$attachEvent(cell, "dblclick", true, this, 
                                      this._onCellDblClick.$bind(this, cell));
                    J$VM.$attachEvent(cell, "mouseover", true, this, 
                                      this._onCellOver.$bind(this, cell));
                    J$VM.$attachEvent(cell, "mouseout", true, this, 
                                      this._onCellOut.$bind(this, cell));
                }
                
                row.view.appendChild(cell);
            }
            tbody.addComponent(row);
        }
        
        //this.addComponent(tbody);
        this._leftPanel.addComponent(tbody);
    };
    
    thi$._hasTime = function(pattern) {
        var _t = ["HH:mm:ss", "HH:mm:ss.SSS", "H:mm:ss", "H:mm:ss.SSS",
                  "hh:mm:ss", "hh:mm:ss.SSS", "h:mm:ss", "h:mm:ss.SSS"];
        for (var i = 0; i < _t.length; i++) {
            if (pattern.indexOf(_t[i]) !== -1) {
                return true;
            }
        }
        return false;
    };
    
    thi$._is24Hours = function(str) {
        var _t = ["AM", "am", "PM", "pm", "A", "a", "P", "p"];
        for (var i = 0; i < _t.length; i++) {
            if (str.indexOf(_t[i]) !== -1) {
                return false;
            }
        }
        return true;
    };
    
    thi$._createTimePicker = function() {
        if (!this._config.showTime)
            return;
        
        var timeContainer = new js.awt.Container({
            className : "calendarTimeContainer"
        });
        
        var hs = null, ms = null, ss = null, label1 = null, label2 = null, 
            radioAM = null, radioPM = null, option = null;
        
        var pv = this._config.preValue.date, _hs = 12;
        
        var isPvString = !(pv instanceof Date) && !(typeof pv === "number");
        if (isPvString && pv && this._is24Hours(pv)) {
            _hs = 24;
            this._is24 = true;
        } else {
            var ptn = this._config.pattern;
            if (this._hasTime(ptn) && this._is24Hours(ptn)) {
                _hs = 24;
                this._is24 = true;
            }
        }
        
        hs = this._createElement("select");
        for (var i = 0; i < _hs/*24*/; i++) {
            option = this._createElement("option");
            option.setAttribute("value", (_hs == 24 ? i : (i + 1)));
            option.innerHTML = _hs == 24 ? i : (i + 1);
            hs.appendChild(option);
        }
        J$VM.$attachEvent(hs, "change", true, this, function(e) {
            // TODO
            e.cancelBubble();
            var v = parseInt(hs.options[hs.selectedIndex].getAttribute("value"));
            var vs = this._is24 ? v : (this._isAm ? (v == 12 ? 0 : v) : (v == 12 ? v : (v + 12) % 24));
            this._value.setHours(vs);
            this._model.date = this._value.getTime();
            this._updateValue();
        });
        
        ms = this._createElement("select");
        for (var i = 0; i < 60; i++) {
            option = this._createElement("option");
            option.setAttribute("value", i);
            option.innerHTML = i;
            ms.appendChild(option);
        }
        J$VM.$attachEvent(ms, "change", true, this, function(e) {
            // TODO
            e.cancelBubble();
            var v = ms.options[ms.selectedIndex].getAttribute("value");
            this._value.setMinutes(parseInt(v));
            this._model.date = this._value.getTime();
            this._updateValue();
        });
        
        ss = this._createElement("select");
        for (var i = 0; i < 60; i++) {
            option = this._createElement("option");
            option.setAttribute("value", i);
            option.innerHTML = i;
            ss.appendChild(option);
        }
        J$VM.$attachEvent(ss, "change", true, this, function(e) {
            // TODO
            e.cancelBubble();
            var v = ss.options[ss.selectedIndex].getAttribute("value");
            this._value.setSeconds(parseInt(v));
            this._model.date = this._value.getTime();
            this._updateValue();
        });
        
        label1 = this._createElement("span");
        label1.innerHTML = ":";
        label2 = this._createElement("span");
        label2.innerHTML = ":";
        
        radioAM = new js.awt.RadioButton({
            name : "AmPm" + this.uuid(),
            className : "calendarRadioAmPm",
            text : this._config.lang.am,
            css : "position:relative;float:left;",
            state : _hs == 24 ? 0x01 : ~(0x01)
        });
        radioPM = new js.awt.RadioButton({
            name : "AmPm" + this.uuid(),
            className : "calendarRadioAmPm",
            text : this._config.lang.pm,
            css : "position:relative;float:left;",
            state : _hs == 24 ? 0x01 : ~(0x01)
        });
        
        radioAM.onCheckedChange = function() {
            this._isAm = true;
            var obj = this._compSet.hs;
            var v = parseInt(obj.options[obj.selectedIndex]
                    .getAttribute("value"));
            this._value.setHours(v == 12 && !this._is24 ? 0 : v);
            this._model.date = this._value.getTime();
            
            this._updateValue();
        }.$bind(this);
        radioPM.onCheckedChange = function() {
            this._isAm = false;
            var obj = this._compSet.hs;
            var v = parseInt(obj.options[obj.selectedIndex]
                    .getAttribute("value"));
            this._value.setHours(v == 12 && !this._is24 ? v : (v + 12) % 24);
            this._model.date = this._value.getTime();
            this._updateValue();
        }.$bind(this);
        
        this._compSet.hs = hs;
        this._compSet.ms = ms;
        this._compSet.ss = ss;
        this._compSet.ram = radioAM;
        this._compSet.rpm = radioPM;
        
        var vj = this._valueJSONObj;
        var hIdx = this._is24 ? vj.h : (vj.h == 0 ? vj.h + 11 : vj.h - 1);
        hs.options[hIdx].setAttribute("checked", true);
        hs.selectedIndex = hIdx;
        ms.options[vj.m].setAttribute("checked", true);
        ms.selectedIndex = vj.m;
        ss.options[vj.s].setAttribute("checked", true);
        ss.selectedIndex = vj.s;
        
        if (_hs == 24) {
            /*
            radioAM.setEnabled(false);
            radioPM.setEnabled(false);
            */
            radioAM.checkBtn.disabled = true;
            radioPM.checkBtn.disabled = true;
        } else {
            if (isPvString && pv && (pv.indexOf("PM") != -1 || pv.indexOf("P") != -1
                || pv.indexOf("pm") != -1 || pv.indexOf("p") != -1)) {
                radioPM.setCheck(true);
            } else {
                if (this._value.getHours() < 12) {
                    radioAM.setCheck(true);
                } else {
                    radioPM.setCheck(true);
                }
            }
        }
        
        var hmsC = new js.awt.Container({
            className : "calendarHmsContainer",
            css : "position:absolute;float:left;"
        }), ampm = new js.awt.Container({
            className : "calendarAmpmContainer",
            css : "position:relative;float:left;"
        }), amc = new js.awt.Container({
            className : "amc",
            css : "position:absolute;float:left;"
        }), pmc = new js.awt.Container({
            className : "amc",
            css : "position:relative;float:left;"
        });
        
        hmsC.view.appendChild(hs);
        hmsC.view.appendChild(label1);
        hmsC.view.appendChild(ms);
        hmsC.view.appendChild(label2);
        hmsC.view.appendChild(ss);
        
        //ampm.addComponent(amc);
        //ampm.addComponent(pmc);
        ampm.addComponent(radioAM);
        ampm.addComponent(radioPM);
        radioPM.setPosition(0, 0);
        
        /*
        ampm.view.appendChild(radioAM.view);
        ampm.view.appendChild(radioPM.view);
        * */
        
        timeContainer.addComponent(hmsC);
        timeContainer.addComponent(ampm);
        
        ampm.setPosition(130, 0);
        
        //this.addComponent(timeContainer);
        this._leftPanel.addComponent(timeContainer);
    };
    
    thi$._createFooter = function() {
        if (this._config.enableUseTodayAsDefault) {
            this._checkbox = new js.awt.Checkbox({
                className : "calendarFooterCheckbox",
                text : this._config.lang.todayLabel
            });
            
            //this.addComponent(this._checkbox);
            this._leftPanel.addComponent(this._checkbox);
            this._checkbox.onCheckedChange = function() {
                this._default_ = this._checkbox.isChecked;
                this._model.dflt = this._default_;
            
                if (typeof this._config["onCheckboxClick"] == "function") {
                    this._config["onCheckboxClick"](this._default_);
                }
            }.$bind(this);
        
            if (this._config.checked) {
                this._checkbox.setCheck(this._config.checked);
            } else {
                //
            }
        }
        
        this._btnContainer = new js.awt.Container({
            className : "calendarFooterBtnContainer"
        });
        
        if (this._config.showExpressionView) {
            this._expandButton = new js.awt.Button({
                className : "expandButton",
                toggle : true,
                backImg : "expression.gif",
                imgPath : this._config.imgPath ? this._config.imgPath : "../../images/common/"
            });
            
            J$VM.$attachEvent(this._expandButton.view, "click", true, this, function(e) {
                e.cancelBubble();
                var v = this._expViewVisible;
                this._rightPanel.view.style.display = v ? "none" : "block";
                this._mainPanel.view.style.width = (v ? 234 : 584) + "px";
                this.view.style.width = (v ? 234 : 584) + "px";
                this._expViewVisible = !v;
            });
            
            if (!this._config.expressionViewVisible) {
                this._expandButton.onclick();
            }
            
            this._btnContainer.addComponent(this._expandButton);
            //this._expandButton.setPosition(0, 0);
        }
        
        if (!this._config.hiddenButtons) {
            
            var btnOK = new js.awt.Button({
                className : "calendarFooterButton",
                text : this._config.lang.ok
            }), btnCancel = new js.awt.Button({
                className : "calendarFooterButton",
                text : this._config.lang.cancel
            });
            
            btnOK.setText(this._config.lang.ok);
            btnCancel.setText(this._config.lang.cancel);
            
            this._btnContainer.addComponent(btnCancel);
            this._btnContainer.addComponent(btnOK);
            //btnOK.setPosition(0, 0);
            //btnCancel.setPosition(0, 0);
            //this.addComponent(this._btnContainer);
            //this._leftPanel.addComponent(this._btnContainer);
            
            J$VM.$attachEvent(btnOK.view, "click", true, this, function(e) {
                e.cancelBubble();
                this._onChange();
            });
            J$VM.$attachEvent(btnCancel.view, "click", true, this, function(e) {
                // TODO
                e.cancelBubble();
                this.hide(false);
                this._onCancel();
            });
        }
    };
    
    thi$._createCalendar = function() {
        this._createHeader();
        this._createTable();
        this._createTimePicker();
        this._createFooter();
        
        this._createExpressionView();
        
        var upCon = new js.awt.Container({ className : "calendarMainPanel" });
        
        upCon.addComponent(this._leftPanel);
        if (this._rightPanel != null && this._rightPanel instanceof js.awt.Container) {
            upCon.addComponent(this._rightPanel);
            if (this._expViewVisible) {
                upCon.view.style.width = "584px";
                this.view.style.width = "584px";
            }
        } else {
            upCon.view.style.width = "234px";
            this.view.style.width = "234px";
        }
        this.addComponent(upCon);
        
        this._mainPanel = upCon;
        this.addComponent(this._btnContainer);
        
        this._updateUI();
    };
    
    thi$._updateUI = function() {
        var _day_ = null;
        this._cellClicked = null;
        for ( var i = 0; i < this._All_days.length; i++) {
            _day_ = this._All_days[i];
            _day_.setAttribute("__value__", 0);
            _day_.className = "calendarCellNormal";
            _day_.innerHTML = "";
        }

        var vj = this._valueJSONObj, first = (new Date(vj.y, vj.M, 1)).getDay();
        var _days_ = (vj.M == 1 && (vj.y % 400 == 0 || vj.y % 100 != 0
                && vj.y % 4 == 0)) ? this._days[vj.M] + 1 : this._days[vj.M];
        var tag = 0, pointer = tag + first, _date_ = 0;
        while (tag < _days_) {
            _day_ = this._All_days[pointer];
            _date_ = pointer - first + 1;
            _day_.setAttribute("__value__", _date_);
            _day_.innerHTML = _date_;

            if (this._isToday(vj.y, vj.M, _date_)) {
                _day_.className = "calendarCellToday";
            } else if (_date_ == this._theDayClicked) {
                _day_.className = "calendarCellClicked";
                this._cellClicked = _day_;
            }
            pointer += 1;
            tag += 1;
        }
        
    };
    
    thi$._prepare = function(def) {
        this._config = J$VM.System.objectCopy(js.awt.Calendar.config, this._config, true);
        this._config = J$VM.System.objectCopy(def, this._config, true);
        //this._config = js.lang.Object.copy(this._config, js.awt.Calendar.config, true);
        
        this._expViewVisible = this._config.expressionViewVisible;
        
        this._default_ = this._config.checked;
        
        if (this._default_) {
            this._value = new Date();
        } else if (this._config.preValue.date) {
            if (this._config.preValue.date instanceof Date) {
                this._value = this._config.preValue.date;
            } else if (typeof this._config.preValue.date == "number") {
                this._value = new Date(this._config.preValue.date);
            } else /*if (this._config.preValue.date instanceof string)*/ {
                if (this._config.preValue.date.length > 0 && !this._default_) {
                    var fmt = new (js.lang.Class.forName("js.text.SimpleDateFormat"))(this._config.pattern);
                    
                    this._value = fmt.parse(this._config.preValue.date);
                } else {
                    this._value = new Date();
                }
            }
        } else {
            this._value = new Date();
        }        
        this._theDayClicked = this._value.getDate();
        this._model.date = this._value.getTime();
        this._model.dflt = this._default_;
        
        this._updateValue();
    };
    
    thi$._beforeshow = function(bool) {
        if (this._config.showExpressionView) {
            if (this._expView != null) this._expView.value = "";
            if (this._preview != null) this._preview.value = "";
        }
        this.setValue(new Date());
        this._model = J$VM.System.objectCopy(this._model_backup, this._model, true);
        //this._model = js.lang.Object.copy(this._model, this._model_backup, true);
        if (typeof this._model.dflt === "boolean") {
            if (this._model.dflt === false) {
                if (this._model.date != null && this._model.date != undefined) {
                    this.setValue(this._model.date);
                }
            }
            if (this._config.enableUseTodayAsDefault && this._checkbox != null) {
                this._checkbox.setCheck(this._model.dflt);
            }
            
        } else {
            if (this._model.date != null && this._model.date != undefined) {
                this.setValue(new Date(this._model.date));
            }
            if (this._config.enableUseTodayAsDefault && this._checkbox != null) {
                this._checkbox.setCheck(false);
            }
        }
        
        if (this._config.showExpressionView) {
            var expr = this._model.expr;
            if (typeof expr.name === "number") {
                this._expList.selectedIndex = expr.name;
                this._expList.options[expr.name].setAttribute("selected", true);
            }
            if (expr.expr != null && typeof expr.expr === "string"
                && expr.expr.replace(/^\s+|\s+$/, "") !== "") {
                this._expView.value = expr.expr;
                this._expression = expr.expr;
                if (this._dateExpProvider) {
                    var fmt = /*this._config.pattern*/this.pattern();
                    var dt = new (js.lang.Class.forName("js.text.SimpleDateFormat"))(fmt);
                    if (this._preview != null) this._preview.value = "";
                    this._dateExpProvider.checkExp(expr.expr, this._config.pattern, dt.format(this._value));
                }
            } else {
                this._expView.value = "";
                if (this._preview != null) this._preview.value = "";
            }
        }
        
    };
    
    thi$._postProcess = function() {
        if (!this._config.bind && !this._config.renderTo)
            return;
        var anchor = this._config.bind || this._config.renderTo;
        
        if (anchor instanceof js.awt.Component) {
            //anchor.view.appendChild(this.view);
            if (this._config.showWhenBindClicked) {
                J$VM.$attachEvent(anchor.view, "click", true, this, 
                     function(e) {
                        e.cancelBubble();
                        var show = this.isShow();
                        if (show) {
                            this.hide();
                            return;
                        }
                        this.showBy(anchor);
                });
            }
        } else/* if (anchor instanceof HTMLElement)*/ {
            if (anchor.tagName == "INPUT") {
                //anchor.setAttribute("readonly", true);
                
                if (this._config.showIcon) {
                    var img = this._createElement("img");
                    img.setAttribute("src", this._config.imgPath + this._config.imgName);
                    var p = anchor.parentNode;
                    if (p.lastChild == anchor) {
                        p.appendChild(img);
                    } else {
                        p.insertBefore(img, anchor.nextSibling);
                    }
                    J$VM.$attachEvent(img, "click", true, this, function(e) {
                        e.cancelBubble();
                        var show = this.isShow();
                        if (show) {
                            this.hide();
                            return;
                        }
                        this.showBy(anchor);
                    });
                }
                
                //p.appendChild(this.view);
                document.body.appendChild(this.view);
                
                if (this._config.showWhenBindClicked) {
                    J$VM.$attachEvent(anchor, "click", true, this, 
                        function(e) {
                           e.cancelBubble();
                           var show = this.isShow();
                            if (show) {
                                this.hide();
                                return;
                            }
                            this.showBy(anchor);
                    });
                }
                
            }
        }
    };
    
    thi$._createExpressionView = function() {
        if (!this._config.showExpressionView)
           return;
        var _expContainer = new js.awt.Container({
            className : "expressionContainer"
        });
        var temp = null;
        
        // Create expression tree
        this._treeCon = new js.awt.Container({
            className : "expressionTreeContainer",
            css : "display : none;"
        });
        
        var nodeDef = {           
            className : "rstree_item",
            imgPath : this._config.imgPath,
            iconImg : "function.gif",
            expandImg : "expandf.gif",
            canExpand : true,
            canDrag : false,
            rootDrag : false
        };
        
        var expStore = new js.awt.TreeDataStore();
            expStore.getData = function(path){          
        }.$bind(expStore);
        
        expStore.getImageNameBy = function(){
            return "function.gif";
        };
        var exptree = new js.awt.Tree({
             id : "expressiontree",
             imgPath : this._config.imgPath,
             container : this.view,
             parentComp : this
        },nodeDef,this._dateExpProvider.getExpTree(),expStore, this);
        this._treeCon.addComponent(exptree);
        _expContainer.addComponent(this._treeCon);
        /**
         * Add for IE bug
         */
         var sp = document.createElement("div");
         sp.style.cssText = "font-size:0px;width:100%;height:5px;";
         _expContainer.view.appendChild(sp);
        // step 1
        temp = new js.awt.Container({ className : "expListContainer" });
        temp.addComponent(new js.awt.Label({
            className : "expLabel",
            text : "Template:"
        }));
        this._expList = this._createElement("select");
        
        var expList = this._dateExpProvider.getExpList(this._config.dateType || this._config.showTime);
        
        if (expList) {
            for (var i = 0; i < expList.length; i++) {
                var e = expList[i];
                var o = this._createElement("option");
                
                o.setAttribute("value", e.value);
                o.innerHTML = e.text;
                this._expList.appendChild(o);
            }
        }
        
        J$VM.$attachEvent(this._expList, "change", true, this, function(e) {
            // TODO
            e.cancelBubble();
            var v = this._expList.options[this._expList.selectedIndex].getAttribute("value");
            this._expView.value = v;
            if (v == "")
                return;
            this._model.expr = {name : /*this._expList.selectedIndex*/0, expr : v};
            
            //this._dateExpProvider.checkExp(v);
            var fmt = /*this._config.pattern*/this.pattern();
            var dt = new (js.lang.Class.forName("js.text.SimpleDateFormat"))(fmt);
            if (this._preview != null) this._preview.value = "";
            this._dateExpProvider.checkExp(v, this._config.pattern, dt.format(this._value));
            
        });
        J$VM.$attachEvent(this._expList, "focus", true, this, function(e) {
            // TODO
            e.cancelBubble();
            this._treeCon.view.style.display = "none";
        });
        temp.view.appendChild(this._expList);
        
        var bt = new js.awt.Button({
            className : "expressionTreeButton",
            imgPath : this._config.imgPath,
            iconImage : "dot.gif"
        }, this.Runtime());
        bt.view.title = "Select Expression";
        J$VM.$attachEvent(bt.view, "click", true, this, function(e) {
            // TODO
            e.cancelBubble();
            var dis = this._treeCon.view.style.display;
            this._treeCon.view.style.display = dis == "none" ? "block" : "none";
            this._treeCon.expressiontree.layout();
        });
        temp.addComponent(bt);
        _expContainer.addComponent(temp);
        // end of step 1
        
        // step 2
        temp = new js.awt.Container({ className : "expTextareaContainer" });
        temp.addComponent(new js.awt.Label({
            className : "expLabel",
            text : "Expression:"
        }));
        this._expView = this._createElement("textarea");
        J$VM.$attachEvent(this._expView, "keyup", true, this, function(e) {
            // TODO
            e.cancelBubble();
            this._expView.setAttribute("edited", "yes");
            var exp = this._expView.value.replace(/^\s+|\s+$/, "");
            if (!exp || exp == null || exp == "") {
                this._expList.selectedIndex = 0;
                this._model.expr = {name : 0, expr : null};
                this._expList.options[0].setAttribute("selected", true);
            }
        });
        J$VM.$attachEvent(this._expView, "blur", true, this, function(e) {
            // TODO
            e.cancelBubble();
            var edited = this._expView.getAttribute("edited");
            if (edited === "yes") {
                // TODO
                var exp = this._expView.value.replace(/^\s+|\s+$/, "");
                this._model.expr.expr = exp;
                var fmt = /*this._config.pattern*/this.pattern();
                var dt = new (js.lang.Class.forName("js.text.SimpleDateFormat"))(fmt);
                if (this._preview != null) this._preview.value = "";
                if (exp != "") {
                    this._dateExpProvider.checkExp(exp, this._config.pattern, dt.format(this._value));
                }
            }
            this._expView.setAttribute("edited", "no");
        });
        J$VM.$attachEvent(this._expView, "selectstart", true, this, function(e) {
            // TODO
            e.cancelBubble();
            return true;
        });
        temp.view.appendChild(this._expView);
        _expContainer.addComponent(temp);
        
        var _expression_ = (this._config.preValue 
                         && this._config.preValue.exp
                         && this._config.preValue.exp.expression) ? 
                         this._config.preValue.exp.expression : "";
        this._expView.value = _expression_;
        
        if (_expression_.replace(/^\s+|\s+$/, "") != "") {
            this._model.expr.expr = _expression_;
            var fmt = /*this._config.pattern*/this.pattern();
            var dt = new (js.lang.Class.forName("js.text.SimpleDateFormat"))(fmt);
            if (this._preview != null) this._preview.value = "";
            this._dateExpProvider.checkExp(_expression_.replace(/^\s+|\s+$/, ""), 
                                           this._config.pattern, 
                                           dt.format(this._value));
            
        }
        
        // end of step 2
        
        // step 3
        temp = new js.awt.Container({ className : "expPreviewContainer" });
        temp.addComponent(new js.awt.Label({
            className : "expLabel",
            text : "Preview:"
        }));
        this._preview = this._createElement("textarea");
        this._preview.setAttribute("readonly", true);
        temp.view.appendChild(this._preview);
        _expContainer.addComponent(temp);
        // end of step 3
        
        _expContainer.view.style.display = this._expViewVisible ? "block" : "none";
        
        this._rightPanel = _expContainer;
    };
    
    thi$.onNodeClick = function(e) {
        e = e.model;
        if (e.type == "folder")
           return;
           
        var rd = this._getCursorPosition(this._expView);
        this._replaceText(this._expView, rd, e.value);
        this._treeCon.view.style.display = "none";
        var exp = this._expView.value;
        this._model.expr.expr = exp;
        this._expList.options[this._expList.selectedIndex].removeAttribute("selected");
        this._expList.selectedIndex = 0;
        
        var fmt = /*this._config.pattern*/this.pattern();
        var dt = new (js.lang.Class.forName("js.text.SimpleDateFormat"))(fmt);
        if (this._preview != null) this._preview.value = "";
        this._dateExpProvider.checkExp(exp, this._config.pattern, dt.format(this._value));
    };
    
    thi$.setExpValue = function(obj) {
        this._preview.value = obj;
    }.$bind(this);
    
    thi$.setExpression = function(exp) {
        if (!exp || (exp = exp.replace(/^\s+|\s+$/, "")) == ""
            || !this._config.showExpressionView) {
            return;
        }
        
        this._expView.value = exp;
        this._model.expr.expr = exp;
        if (this._dateExpProvider) {
            var fmt = /*this._config.pattern*/this.pattern();
            var dt = new (js.lang.Class.forName("js.text.SimpleDateFormat"))(fmt);
            if (this._preview != null) this._preview.value = "";
            this._dateExpProvider.checkExp(exp, this._config.pattern, dt.format(this._value));
            //this._dateExpProvider.checkExp(exp);
        }
    };
    
    thi$._getCursorPosition = function(textarea) {
        var rangeData = { text : "", start : 0, end : 0 };
        textarea.focus();
        if (textarea.setSelectionRange) { // W3C
            rangeData.start= textarea.selectionStart;
            rangeData.end = textarea.selectionEnd;
            rangeData.text = (rangeData.start != rangeData.end) ? 
               textarea.value.substring(rangeData.start, rangeData.end): "";
        } else if (document.selection) { // IE
            var i,
                oS = document.selection.createRange(),
                // Don't: oR = textarea.createTextRange()
                oR = document.body.createTextRange();
            oR.moveToElementText(textarea);
    
            rangeData.text = oS.text;
            rangeData.bookmark = oS.getBookmark();
    
            // object.moveStart(sUnit [, iCount])
            // Return Value: Integer that returns the number of units moved.
            for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i ++) {
                // Why? You can alert(textarea.value.length)
                if (textarea.value.charAt(i) == '\n') {
                    i ++;
                }
            }
            rangeData.start = i;
            rangeData.end = rangeData.text.length + rangeData.start;
        }
    
        return rangeData;
    };
    
    thi$._setCursorPosition = function(textarea, rangeData) {
        if(!rangeData) {
            alert("You must get cursor position first.")
        }
        if (textarea.setSelectionRange) { // W3C
            textarea.focus();
            textarea.setSelectionRange(rangeData.start, rangeData.end);
        } else if (textarea.createTextRange) { // IE
            var oR = textarea.createTextRange();
            // Fixbug :
            // In IE, if cursor position at the end of textarea, the this._setCursorPosition function don't work
            if(textarea.value.length === rangeData.start) {
                oR.collapse(false)
                oR.select();
            } else {
                oR.moveToBookmark(rangeData.bookmark);
                oR.select();
            }
        }
    };
    
    thi$._replaceText = function(textarea, rangeData, text) {
        var oValue, nValue, oR, sR, nStart, nEnd, st;
        this._setCursorPosition(textarea, rangeData);
        
        if (textarea.setSelectionRange) { // W3C
            oValue = textarea.value;
            nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end);
            nStart = nEnd = rangeData.start + text.length;
            st = textarea.scrollTop;
            textarea.value = nValue;
            // Fixbug:
            // After textarea.values = nValue, scrollTop value to 0
            if(textarea.scrollTop != st) {
                textarea.scrollTop = st;
            }
            textarea.setSelectionRange(nStart, nEnd);
        } else if (textarea.createTextRange) { // IE
            sR = document.selection.createRange();
            sR.text = text;
            sR.setEndPoint('StartToEnd', sR);
            sR.select();
        }
    };
    
    thi$.getDateObject = function() {
        return this._value;
    };
    
    thi$.getValue = function(mask, utc) {
        var retObj = {
            date : {
                dateObj : this._value,
                value : this._value.getTime() 
            },
            useTodayAsDefault : this._default_
        };
        if (this._config.showExpressionView) {
            var exp = this._expView.value.replace(/\s+|\s+$/, "");
            if (exp && exp != null && exp != "") {
                retObj.exp = {
                    name : this._expList.options[this._expList.selectedIndex].innerHTML,
                    expression : exp
                };
            }
        }
        return retObj;
        
    };
    
    thi$.setValue = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        var cs = this._compSet;
        
        if (this._config.showTime) {
            if (this._is24) {
                cs.ram.setEnabled(false);
                cs.rpm.setEnabled(false);
            }
            cs.ram.setCheck(false);
            cs.rpm.setCheck(false);
        }
        
        if (args.length == 3) {
            this._value = new Date(args[0] /* year */, args[1] -1 /* month */,
                    args[2] /* date */
            );
            this._updateValue();
            var _ms = cs.MS, vj = this._valueJSONObj;
            _ms.options[vj.M].setAttribute("checked", true);
            _ms.selectedIndex = vj.M;
            this._theDayClicked = vj.d;
            
            if (this._config.showTime) {
                cs.hs.options[(this._is24 ? 23 : 11)].setAttribute("checked", true);
                cs.hs.selectedIndex = (this._is24 ? 23 : 11);
                cs.ms.options[0].setAttribute("checked", true);
                cs.ms.selectedIndex = 0;
                cs.ss.options[0].setAttribute("checked", true);
                cs.ss.selectedIndex = 0;
            }
            
            this._compSet.ys.setValue(args[0]);
        } else if (args.length == 6) {
            this._value = new Date(args[0], /* year */
            args[1] - 1, /* month */
            args[2], /* date */
            args[3], /* hours */
            args[4], /* minutes */
            args[5] /* seconds */
            );
            
            this._updateValue();
            var _ms = cs.MS, vj = this._valueJSONObj;
            _ms.options[vj.M].setAttribute("checked", true);
            _ms.selectedIndex = vj.M;
            this._theDayClicked = vj.d;
            
            if (this._config.showTime) {
                cs.hs.options[(this._is24 ? vj.h : vj.h - 1)].setAttribute(
                        "checked", true);
                cs.hs.selectedIndex = (this._is24 ? vj.h : vj.h - 1);
                cs.ms.options[vj.m].setAttribute("checked", true);
                cs.ms.selectedIndex = vj.m;
                cs.ss.options[vj.s].setAttribute("checked", true);
                cs.ss.selectedIndex = vj.s;
            }
            
            if (!this._is24 && this._config.showTime) {
                if (this._value.getHours() > 12) {
                    cs.rpm.setCheck(true);
                } else {
                    cs.ram.setCheck(true);
                }
            }
            
            cs.ys.setValue(vj.y);
            
        } else if (args.length == 1) {
            if (args[0] instanceof Date) {
                this._value = args[0];
            } else {
                if (typeof args[0] === "number") {
                    this._value = new Date(args[0]);
                } else {
                     var fmt = new (js.lang.Class.forName("js.text.SimpleDateFormat"))(this._config.pattern);
                    this._value = fmt.parse(args[0]);
                }
            }
            
            this._updateValue();
            var _ms = cs.MS, vj = this._valueJSONObj;
            _ms.options[vj.M].setAttribute("checked", true);
            _ms.selectedIndex = vj.M;
            this._theDayClicked = vj.d;
            
            if (this._config.showTime) {
                cs.hs.options[(this._is24 ? vj.h : vj.h - 1)].setAttribute(
                        "checked", true);
                cs.hs.selectedIndex = (this._is24 ? vj.h : vj.h - 1);
                cs.ms.options[vj.m].setAttribute("checked", true);
                cs.ms.selectedIndex = vj.m;
                cs.ss.options[vj.s].setAttribute("checked", true);
                cs.ss.selectedIndex = vj.s;
            }
            
            if (!this._is24 && this._config.showTime) {
                if (this._value.getHours() >= 12) {
                    cs.rpm.setCheck(true);
                } else {
                    cs.ram.setCheck(true);
                }
            }
            
            cs.ys.setValue(vj.y);
        }
        
    };
    
    thi$.toHtmlString = function() {
        return this.view.outerHTML;
    };
    
    thi$.destroy = function() {
        arguments.callee.__super__.apply(this, arguments);
        var o = this.__thi$__;
        for (var e in o) {
            if (o[e] instanceof js.awt.Component) {
                o[e].destroy();
            }
            o[e] = null;
        }
    }.$override(this.destroy);
    
    thi$.pattern = function(userPattern) {
        if (typeof userPattern === "boolean")
            return this._config.pattern;
        if (this._config.dateType == "DateTime") {
            return "MM/dd/yyyy HH:mm:ss";
        } else if (this._config.dateType == "Time") {
            return "HH:mm:ss";
        }
        if (this._config.showTime) {
            return "MM/dd/yyyy HH:mm:ss";
        }
        return "MM/dd/yyyy";
    };
    
   thi$.setCheck = function(bool) {
        this._default_ = typeof bool == "boolean" ? bool : this._default_;
        this._model.dflt = this._default_;
        if (this._default_) {
            this._checkbox.setCheck(true);
            this.setValue(new Date());
        } else {
            this._checkbox.setCheck(false);
        }
    };
    
    thi$.isCheckboxChecked = function() {
        return this._checkbox.isChecked;
    };
    
    thi$._init = function(def, expProvider, runtime) {
        this._dateExpProvider = expProvider;
        if(this._dateExpProvider) {
            this._dateExpProvider.onCheckExp = this.setExpValue;
        }
        this._prepare(def);
        
        arguments.callee.__super__.call(this, this._config, runtime);
        
        this._createCalendar();
        this._postProcess();
        this._model_backup = J$VM.System.objectCopy(this._model, this._model_backup, true);
        //this._model_backup = js.lang.Object.copy(this._model_backup, this._model, true);
        
    }.$override(this._init);
    
    thi$._doInit = function(def, expProvider, runtime) {
        def.css = "visibility:hidden;";
        
        this._init.call(this, def, expProvider, runtime);
        
        J$VM.$attachEvent(this.view, "click", true, this, function(e) {
            // TODO
            e.cancelBubble();
            if (this._config.showExpressionView) {
                this._treeCon.view.style.display = "none";
            }
        });
        J$VM.$attachEvent(this.view, "mousedown", true, this, function(e) {
            // TODO
            e.cancelBubble();
        });
        J$VM.$attachEvent(this.view, "mousepress", true, this, function(e) {
            // TODO
            e.cancelBubble();
        });
        if (J$VM.firefox) {
            J$VM.$attachEvent(this.view, "DOMMouseScroll", 0, this, function(e) {
                // TODO
                e.cancelBubble();
            });
        } else {
            J$VM.$attachEvent(this.view, "mousewheel", true, this, function(e) {
                // TODO
                e.cancelBubble();
            });
        }
    };
    
    if (typeof def == "object") {
        this._doInit.call(this, def, expProvider, runtime);
    }
    
    thi$.showAt = function(x, y, v, m) {
        this._beforeshow();
        arguments.callee.__super__.apply(this, arguments);
    }.$override(this.showAt);
    
    /**
     * this._model shoud be a json as below:
     * {
     *      checked : true/false,
     *      date : xxx,
     *      expName : xxx,
     *      expr : xxx
     * }
     */
    thi$.showBy = function(by, _model, v, m) {
        if (typeof _model === "object") {
            this._model.dflt = typeof _model.checked == "boolean" ? _model.checked : this._model.dflt;
            this._model.date = typeof _model.date != "undefined" ? _model.date : this._model.date;
            this._model.expr.expr = typeof _model.expr == "string" ? _model.expr : this._model.expr.expr;
            
            this._model_backup = J$VM.System.objectCopy(this._model, this._model_backup, true);
            //this._model_backup = js.lang.Object.copy(this._model_backup, this._model, true);
        }
        this._beforeshow();
        arguments.callee.__super__.apply(this, [by, v, m]);
    }.$override(this.showBy);
    
    
}.$extend(js.awt.Container);

js.awt.Calendar.config = {
        className : "universalCalendar",
        pattern     : "yyyy-MM-dd",
        bind : undefined,
        showWhenBindClicked : true,
        preValue : {},
        hiddenButtons : false,
        showTime : false,
        showIcon : true,
        dblclickEnable : true,
        checked  : false,
        isfloating : true,
        showExpressionView : true,
        expressionViewVisible : true,
        enableUseTodayAsDefault : true,
        lang     : {
             months         : [ "January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November",
                                "December" ],
             weeks         : [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
             todayLabel     : "Use Today() as Default",
             prevLabel     : "Use Previously Selected",
             am             : "AM",
             pm             : "PM",
             ok             : "OK",
             cancel         : "Cancel"
        }
};

js.awt.Calendar.getAbsoluteX = function(e) {
    return J$VM.DOM.absX(e);
};

js.awt.Calendar.getAbsoluteY = function(e) {
    return J$VM.DOM.absY(e);
};

