/**
 * 
 * Copyright 2010-2011, The JSVM Project. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of the JSVM nor the names of its contributors may be used
 * to endorse or promote products derived from this software without specific
 * prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * 
 * 
 * Author: Hu Dong Contact: jsvm.prj@gmail.com License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.awt");

/**
 * The TableModel interface specifies the methods the Table will use to
 * interrogate a tabular data model.
 * 
 */
js.awt.TableModel = function() {

	var CLASS = js.awt.TableModel, thi$ = CLASS.prototype;
	if (CLASS.__defined__) {
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class;

	/**
	 * Adds a listener to the list that's notified each time a change to the
	 * data model occurs.
	 */
	thi$.addModelListener = function(listener) {
	};

	/**
	 * Removes a listener from the list that's notified each time a change to
	 * the data model occurs.
	 */
	thi$.removeModelListener = function(listener) {
	};

	/**
	 * Returns the number of columns in the model
	 */
	thi$.getColumnCount = function() {
	};

	/**
	 * Returns the name of the column at colIndex.
	 */
	thi$.getColumnName = function(colIndex) {
	};

	/**
	 * Returns the number of rows in the model
	 */
	thi$.getRowCount = function() {
	};

	/**
	 * Returns the value for the cell at colIndex and rowIndex
	 */
	thi$.getVauleAt = function(rowIndex, colIndex) {
	};

	/**
	 * Returns true if the cell at rowIndex and colIndex is editable.
	 */
	thi$.isCellEditable = function(rowIndex, colIndex) {
	};

	/**
	 * Sets the value in the cell at colIndex and rowIndex to value
	 */
	thi$.setValueAt = function(value, rowIndex, colIndex) {
	};

};

/**
 * 
 * The Table is used to display regular two-dimensional tables of cells
 * 
 * @param def :{
 *            className: xxx
 *  }
 */
js.awt.TableBody = function(def, Runtime) {
	var CLASS = js.awt.TableBody, thi$ = CLASS.prototype;
	if (CLASS.__defined__) {
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, System = J$VM.System;
	
	/**
	 * Build table from a js.awt.Grid
	 * 
	 * @see js.awt.Grid
	 */
	thi$.buildTableBody = function(grid, def) {
		//System.out.println(document.documentMode);
		var R = this.Runtime(), m = grid.rowNum();
        var i, j, m, n, row, rowUuid, trow, cell, tcell, rowData, cellData, className;
        var cache = def.cache, data = def.data, rUuid = 'rowuuid';
    	for (i = 0; i < m; i++) {
			row = grid.row(i);
			trow = undefined;
			rowData = data.get(i);
			if (row.visible) {
				trow = row.trow = new (CLASS.Row)(row, R);
				trow.obj = rowData[rowData.length - 1];
			}
			if (trow) {
				rowUuid = trow.view.uuid;
				var n = grid.colNum(), tempDiv;
				for (j = 0; j < n; j++) {
					cell = grid.cell(i, j);
					cellData = rowData[j];
					if (cell && cell.visible) {
						className = cellData.className
						if(cellData.isNoWrap){
							if(className)
								tempDiv = "<div class=\"" + className + "\" rowuuid=\""  +  rowUuid + "\" >" + cellData.value + "</div>";
							} else if(className)
								cell.className = className;
						tcell = cell.tcell = new (CLASS.Cell)(cell, R);
						if(tempDiv){
							tcell.view.innerHTML = tempDiv;
							tempDiv = null;
						} else {
							tcell.setText(cellData.value);
						}					
						tcell.setAttribute(rUuid, rowUuid);
						tcell.appendTo(trow.view);
					}
				}
				cache[rowUuid] = trow;
				trow.appendTo(this.view);
			}
		}
	};
	    
	thi$.destroy = function() {
		delete this.grid;
		arguments.callee.__super__.apply(this, arguments);
	}.$override(this.destroy);
   
	thi$._init = function(def, Runtime) {
		if (def == undefined) return;
		def.classType = def.classType || "js.awt.TableBody";
		def.className = def.className || "jsvm_table";
		def.viewType = "TABLE";
		arguments.callee.__super__.apply(this, arguments);
		this.grid = new (Class.forName("js.awt.Grid"))(this.def);
		var bounds = def.bounds;
		this.grid.layout(bounds.left, bounds.top, bounds.width, bounds.height);
		this.buildTableBody(this.grid, this.def);
	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component);

js.awt.TableBody.Row = function(def, Runtime) {

	var CLASS = js.awt.TableBody.Row, thi$ = CLASS.prototype;
	if (CLASS.__defined__) {
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM, System = J$VM.System, MQ = J$VM.MQ;

	thi$._init = function(def, Runtime) {
		if (def == undefined)
			return;
		def.classType = def.classType || "js.awt.TableBody.Row";
		def.className = def.className || "jsvm_table_row";
		def.viewType = "TR";
		arguments.callee.__super__.apply(this, arguments);
		var ele = this.view;
		ele.uuid = def.uuid();
	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component);

js.awt.TableBody.Cell = function(def, Runtime) {

	var CLASS = js.awt.TableBody.Cell, thi$ = CLASS.prototype;
	if (CLASS.__defined__) {
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, System = J$VM.System;

	thi$.setText = function(text, encode) {
		this.def.text = text || "";
		this.view.innerHTML = this.def.text;

	};

	thi$._init = function(def, Runtime) {
		if (def == undefined)
			return;

		def.classType = def.classType || "js.awt.TableBody.Cell";
		def.className = def.className || "jsvm_table_cell";
		def.viewType = "TD";
		arguments.callee.__super__.apply(this, arguments);
		var ele = this.view;
		ele.setAttribute("rowspan", "" + def.rowSpan);
		ele.setAttribute("colspan", "" + def.colSpan);
		ele.uuid = def.uuid();
	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component);

/**
 * 
 * The Table is used to display regular two-dimensional tables of cells
 * 
 * @param def :{
 *            className: xxx
 *  }
 */
js.awt.Table = function(def, Runtime) {
	var CLASS = js.awt.Table, thi$ = CLASS.prototype;
	if (CLASS.__defined__) {
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	var Class = js.lang.Class, System = J$VM.System;
	
    thi$.layoutComponents = function(force){
    	arguments.callee.__super__.apply(this, arguments);
    	if(this.data){
    		var rowLen = this.data.length;
          	var isScroll = (rowLen * 23) > (this.getBounds().innerHeight - 26);
          	var headerHolder = this.getComponent('headerHolder');
          	if(!isScroll) {
          		if(this.scrollItem){        			
          			headerHolder.removeComponent(this.scrollItem);
          			headerHolder.def.layout.colNum--;
          			headerHolder.layout.grid._init(headerHolder.def.layout);
          			headerHolder.doLayout(true);
          			var bodyHolder = this['bodyHolder'];
          			var tableBody = bodyHolder['tableBody'];
          			if(tableBody) {
          				bodyHolder.removeComponent(tableBody);
          				tableBody.destroy();
          				bodyHolder.addComponent(new js.awt.TableBody(this.bodyDef, this.Runtime()));
          			}
          		} else {
          			var bodyHolder = this['bodyHolder'];
          			var tableBody = bodyHolder['tableBody'];
          			if(tableBody) {
          				bodyHolder.removeComponent(tableBody);
          				tableBody.destroy();
          				bodyHolder.addComponent(new js.awt.TableBody(this.bodyDef, this.Runtime()));
          			}
          		}
          	} else if(this.scrollItem) {
          		if(headerHolder.def.layout.colNum == this.def.headerNames.length){
          			headerHolder.def.layout.cols[headerHolder.def.layout.colNum] = 
          				{index: this.def.headerNames.length, rigid: true, measure: 16};
          			headerHolder.def.layout.colNum++;
          			headerHolder.layout.grid._init(headerHolder.def.layout);
          			headerHolder.addComponent(this.scrollItem);
          			headerHolder.doLayout(true);
          			headerHolder.def.layout.cols.pop();
          		} else {
          			var bodyHolder = this['bodyHolder'];
          			var tableBody = bodyHolder['tableBody'];
          			if(tableBody) {
          				bodyHolder.removeComponent(tableBody);
          				tableBody.destroy();
          				this.bodyDef.bounds.width -= 17;
          				bodyHolder.addComponent(new js.awt.TableBody(this.bodyDef, this.Runtime()));
          			}
          		}
          	}
          }
    }.$override(this.layoutComponents);
   
	thi$.destroy = function() {
		delete this.headerCache;
		delete this.cache;
		arguments.callee.__super__.apply(this, arguments);
	}.$override(this.destroy);

	thi$.setTableBody = function(data){
		this.data = data;
		var R = this.Runtime();
	    this.removeAll(true);
	    this.headerCache = {};	
	    var rowLen = 0;
	    if(data)
	    	rowLen = data.length;
		var isScroll = (rowLen * 23) > (this.getBounds().innerHeight - 26);
		var headerNames = this.def.headerNames;
		var columnLen = headerNames.length;
		var colsDef; 
		if(isScroll){
			colsDef = new Array(columnLen + 1);
			colsDef[columnLen] = {index: columnLen, rigid: true, measure: 16};
		} else {
			colsDef = new Array(columnLen);
		}
		var columnWeights = this.def.columnWeights;
		for(i = 0; i < columnLen; i++){
			colsDef[i] = {index: i, rigid: false, weight: columnWeights[i]};
		}
		var headerHolder = new js.awt.Container({
			stateless: true,
			id: 'headerHolder',
			layout: {classType: "js.awt.GridLayout",
				rowNum: 1,
		        colNum: colsDef.length,
		        rows: [{index: 0, measure: 26, rigid: true}],
		        cols: colsDef
			},
			rigid_w: false,
			rigid_h: false,
	        constraints:{rowIndex: 0, colIndex: 0}
		}, R);
	
		for (i = 0; i < columnLen; i++) {
			var headerItem = new js.awt.Item({
				className: "jsvm_table_header",
				index: i,
				rigid_w: false,
				rigid_h: false,
				controlled: true,
				labelText: headerNames[i],
				constraints: {rowIndex: 0, colIndex: i}
			}, R);
			this.headerCache[headerItem.uuid()] = headerItem;
			headerHolder.addComponent(headerItem);			
		}
	
		if(isScroll){
			this.scrollItem = new js.awt.Component({
				className: "jsvm_table_header",
				rigid_w: true,
				rigid_h: true,
				width: 26,
				height: 26,
				constraints: {rowIndex: 0, colIndex: columnLen}
			}, R);
			headerHolder.addComponent(this.scrollItem);		
		} else if(this.scrollItem){
			delete this.scrollItem;
		}
	
		headerHolder.attachEvent('click', 0, this, _onSort);
		this.addComponent(headerHolder);
		var bodyHolder = new js.awt.Container({
					layout: {classType : "js.awt.BoxLayout"},
					id: 'bodyHolder',
					rigid_w: false,
					rigid_h: false,
					className: "jsvm_table_bodyHolder",
					constraints:{rowIndex: 1, colIndex: 0}
				}, R);
		this.addComponent(bodyHolder);
		this.doLayout();
	    if(rowLen > 0){
		var bounds = bodyHolder.getBounds(), MBP = bounds.MBP;
		var rowsDef = new Array(rowLen);
		for(i = 0; i < rowLen; i++){
			rowsDef[i] = {index: i, measure: 23, rigid: true};
		}
		var width = bounds.innerWidth;
		if(isScroll) {
			colsDef.pop();
			width -= 17;
		}
		this.bodyDef = {
				classType: "js.awt.TableBody",
				bounds: {left: MBP.paddingLeft, top: MBP.paddingTop, width: width, height: bounds.innerHeight},
	    	    id: 'tableBody',
	            rigid_w: false,
	            rigid_h: true, 
	            rowNum: rowLen,
	            colNum: columnLen,
	            rows: rowsDef,
	            cols: colsDef, 
	            data: data,
	            cache: this.cache
		};
		bodyHolder.addComponent(new js.awt.TableBody(this.bodyDef, R));
	    }
	};
	
	var _sort = function(data, runtime){
		var bodyHolder = this['bodyHolder'];
		bodyHolder.removeAll(true);
		this.bodyDef.data = data;
		bodyHolder.addComponent(new js.awt.TableBody(this.bodyDef, runtime));
	};
	
	thi$.clearTableBody = function(def, R) {
		this['bodyHolder'].removeAll(true);
	};
	
	thi$.clearSort = function() {
		this._sortIndex = -1;
		this._sortAsc = false;
		this._lastIndex = -1;
		if(this.lastHeaderItem){
			this.lastHeaderItem.ctrl.className = 'jsvm_table_header_ctrl';
		}
	};
	
	var _onSort = function(e){
		var headerItem = this.headerCache[e.srcElement.uuid];
		if(this.lastHeaderItem && (headerItem !== this.lastHeaderItem)){
			this.lastHeaderItem.ctrl.className = 'jsvm_table_header_ctrl';
			this._sortIndex = -1;
			this._sortAsc = false;
			this._lastIndex = -1;
		}
		if(this.bodyHolder.tableBody){
			this._sortIndex = headerItem.def.index;
			if (this._lastIndex == -1 || this._lastIndex != 0) {
				this._sortAsc = false; 
				headerItem.ctrl.className = 'jsvm_table_header_ctrl_2';
			} else {
				if(this._sortAsc) {
					headerItem.ctrl.className = 'jsvm_table_header_ctrl_2';
				} else {
					headerItem.ctrl.className = 'jsvm_table_header_ctrl_1';
				}
				this._sortAsc = !this._sortAsc;
			}
			this._lastIndex = 0;
			this.lastHeaderItem = headerItem;
		    var _compare = function(a, b) {
		    	var x = a[this._sortIndex].value, y = b[this._sortIndex].value;
		    	var e = /^\d+\s+(kb|KB)$/ig.test(x) && /^\d+\s+(kb|KB)$/ig.test(y);
		    	if (this._sortAsc) {
		    		if (e)
		    			return eval(parseFloat(x) > parseFloat(y)) ? 1 : -1;
		    		return x > y ? 1 : -1;
		    	} else {
		    		if (e)
		    			return eval(parseFloat(x) < parseFloat(y)) ? 1 : -1;
		    		return x < y ? 1 : -1;
		    	}
		    }.$bind(this);
		    var def = this.bodyHolder.tableBody.def;
		    def.data.sort(_compare);
		    this._sortIndex = -1;
		    _sort.call(this, def.data, this.Runtime());
	    }
	};
	
	var _onRowMouseout = function(e) {
		var row = this.cache[e.srcElement.getAttribute('rowuuid')];
		if (row && this.curRow !== row)
			row.view.className = row.def.className + '_0';
	};

	var _onRowMouseover = function(e) {
		var row = this.cache[e.srcElement.getAttribute('rowuuid')];
		if (row && this.curRow !== row)
			row.view.className = row.def.className + '_hover';
	};

	var _onClick = function(e) {
		var row = this.cache[e.srcElement.getAttribute('rowuuid')];
		if (this.curRow)
			this.curRow.view.className = this.curRow.def.className + '_0';
		if (row) {
			row.view.className = row.def.className + '_hover';
			this.curRow = row;
			e.setEventTarget(row.obj);
			e.setType("click");
			this.notifyPeer("js.awt.event.TableItemEvent", e);
		}
	};
	
	var _onDblClick = function(e) {
		var row = this.cache[e.srcElement.getAttribute('rowuuid')];
		if (this.curRow)
			this.curRow.view.className = this.curRow.def.className + '_0';
		if (row) {
			row.view.className = row.def.className + '_hover';
			this.curRow = row;
			e.setEventTarget(row.obj);
			e.setType("dbClick");
			this.notifyPeer("js.awt.event.TableItemEvent", e);
		}
	};
	
	thi$._init = function(def, Runtime) {
		if (def == undefined) return;
		def.layout = { 
				classType: "js.awt.GridLayout",
 	            rowNum: 2,
 	            colNum: 1,
 	            rows: [{index:0, measure:26, rigid:true},
 	                   {index:1, rigid:false, weight: 1.0}
 	            ]};
		arguments.callee.__super__.apply(this, arguments);
		this._sortIndex = -1;
		this._sortAsc = false;
		this._lastIndex = -1;
		this.lastHeaderItem = null; 
		this.bodyHolder = null;
		this.bodyDef = null;
		this.cache = {};
		this.curRow = null;
		this.attachEvent("click", 0, this, _onClick);
		this.attachEvent("dblclick", 0, this, _onDblClick);
		this.attachEvent('mouseover', 0, this, _onRowMouseover);
		this.attachEvent("mouseout", 0, this, _onRowMouseout);
	}.$override(this._init);
	this._init.apply(this, arguments);
}.$extend(js.awt.Container);