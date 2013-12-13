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
	var _buildTableBody = function(grid, def) {
		var R = this.Runtime(), m = grid.rowNum();
		var tbody = new (CLASS.TBody)({}, R);
		tbody.appendTo(this.view);
        var i, j, n, row, rowUuid, trow, cell, tcell, rowData, cellData, className, tempDiv;
        var cache = def.cache, data = def.data, rUuid = 'rowuuid', title = 'title';
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
				n = grid.colNum();
				for (j = 0; j < n; j++) {
					cell = grid.cell(i, j);
					cellData = rowData[j];
					if (cell && cell.visible) {
						className = cellData.className;
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
						tcell.setAttribute(title, cellData.value);
						tcell.appendTo(trow.view);
					}
				}
				cache[rowUuid] = trow;
				trow.appendTo(tbody.view);
			}
		}
	};
	    
	thi$.destroy = function() {
		this.grid.cells = [];
		this.grid.cols = [];
		this.grid.rows = [];
		delete this.grid;
		delete this.def.cache;
		delete this.def.data;
		arguments.callee.__super__.apply(this, arguments);
	}.$override(this.destroy);
   
	thi$._init = function(def, Runtime) {
		if (def == undefined) return;
		def.classType = def.classType || "js.awt.TableBody";
		def.className = def.className || "jsvm_table";
		def.viewType = "TABLE";
		this.def = def;
		arguments.callee.__super__.apply(this, arguments);
		this.grid = new (Class.forName("js.awt.Grid"))(def);
		var bounds = def.bounds;
		this.grid.layout(bounds.left, bounds.top, bounds.width, bounds.height);
		_buildTableBody.call(this, this.grid, def);
	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component);

js.awt.TableBody.TBody = function(def, Runtime) {
	var CLASS = js.awt.TableBody.TBody, thi$ = CLASS.prototype;
	if (CLASS.__defined__) {
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	thi$._init = function(def, Runtime) {
		if (def == undefined)
			return;
		def.viewType = "TBODY";
		arguments.callee.__super__.apply(this, arguments);
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
	
	thi$._init = function(def, Runtime) {
		if (def == undefined)
			return;
		def.classType = def.classType || "js.awt.TableBody.Row";
		def.className = def.className || "jsvm_table_row";
		def.viewType = "TR";
		arguments.callee.__super__.apply(this, arguments);
		var ele = this.view;
		ele.uuid = this.uuid();
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
	
	thi$.setText = function(text, encode) {
		this.def.text = text || "";
		this.view.innerHTML = this.def.text;
	};

	thi$._init = function(def, Runtime) {
		if (def == undefined) return;
		def.classType = def.classType || "js.awt.TableBody.Cell";
		def.className = def.className || "jsvm_table_cell";
		def.viewType = "TD";
		arguments.callee.__super__.apply(this, arguments);
		//var ele = this.view;
		//ele.setAttribute("rowspan", "" + def.rowSpan);
		//ele.setAttribute("colspan", "" + def.colSpan);
		//ele.uuid = def.uuid();
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
	CLASS.ROW_UUID = 'rowuuid';
	CLASS.ROW_CLASSNAME0 = 'jsvm_table_row_0';
	CLASS.ROW_CLASSNAME_HOVER = 'jsvm_table_row_hover';
	var Class = js.lang.Class, System = J$VM.System;

	thi$.destroy = function() {
		delete this.headerCache;
		delete this.colsDef;
		if(this.bodyDef){
			delete this.bodyDef.data,
			delete this.bodyDef;
		}
		delete this.cache;
		delete this.data;
		if(this.lastHeaderItem)
			delete this.lastHeaderItem;
		if(this.curRow)
			delete this.curRow;
		arguments.callee.__super__.apply(this, arguments);
	}.$override(this.destroy);

	thi$.setTableBody = function(data){
		this.data = data;
		var R = this.Runtime(), rowLen;
		var bodyHolder = this['bodyHolder'];
		this.bodyDef = null;
	    bodyHolder.removeAll(true);
	    if(data)
	    	rowLen = data.length;
	    if(rowLen > 0){
	    	var bounds = bodyHolder.getBounds(), MBP = bounds.MBP;
	    	var rowsDef = new Array(rowLen);
	    	for(i = 0; i < rowLen; i++){
	    		rowsDef[i] = {index: i, measure: 23, rigid: true};
	    	}
	    	this.bodyDef = {
				classType: "js.awt.TableBody",
				bounds: {left: MBP.paddingLeft, top: MBP.paddingTop, width: bounds.innerWidth, height: bounds.innerHeight},
	    	    id: 'tableBody',
	            rigid_w: false,
	            rigid_h: true, 
	            rowNum: rowLen,
	            colNum: this.colsDef.length,
	            rows: rowsDef,
	            cols: this.colsDef, 
	            data: data,
	            cache: this.cache
	    	};
	    	var tableBody = new js.awt.TableBody(this.bodyDef, R);
	    	bodyHolder.addComponent(tableBody);
	    	tableBody.setSize(bounds.innerWidth, rowLen * 23, 2);
	    }
	};
	
	var _sort = function(data, runtime){
		if(!this.bodyDef){
			return;
		}
		var bodyHolder = this['bodyHolder'];
		bodyHolder.removeAll(true);
		this.cache = {};
		this.bodyDef.data = data;
		this.bodyDef.cache = this.cache;
		bodyHolder.addComponent(new js.awt.TableBody(this.bodyDef, runtime));
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
		var bodyHolder = this['bodyHolder'];
		if(this.lastHeaderItem && (headerItem !== this.lastHeaderItem)){
			this.lastHeaderItem.ctrl.className = 'jsvm_table_header_ctrl';
			this._sortIndex = -1;
			this._sortAsc = false;
			this._lastIndex = -1;
		}
		if(this.data){
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
		    this.data.sort(_compare);
		    this._sortIndex = -1;
		    _sort.call(this, this.data, this.Runtime());
	    }
	};
	
	var _onRowMouseout = function(e) {
		var row = this.cache[e.srcElement.getAttribute(CLASS.ROW_UUID)];
		if (row && this.curRow !== row)
			row.view.className = CLASS.ROW_CLASSNAME0;
	};

	var _onRowMouseover = function(e) {
		var row = this.cache[e.srcElement.getAttribute(CLASS.ROW_UUID)];
		if (row && this.curRow !== row)
			row.view.className = CLASS.ROW_CLASSNAME_HOVER;
	};

	var _onClick = function(e) {
		var row = this.cache[e.srcElement.getAttribute(CLASS.ROW_UUID)];
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
		var row = this.cache[e.srcElement.getAttribute(CLASS.ROW_UUID)];
		if (this.curRow)
			this.curRow.view.className = this.curRow.def.className + '_0';
		if (row) {
			row.view.className = row.def.className + '_hover';
			this.curRow = row;
			e.setEventTarget(row.obj);
			e.setType("dblClick");
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
		def.items = ['headerHolder', 'bodyHolder'];
		var headerNames = def.headerNames;
		var columnLen = headerNames.length;
		var colsDef = this.colsDef = new Array(columnLen);
		var headerItems = new Array(columnLen); 
		var columnWeights = def.columnWeights;
		this.headerCache = {};	
		def.headerHolder = {
			classType: 'js.awt.Container',
			className: def.headerHolderClassName || 'jsvm_table_headerHolder',
			stateless: true,
			id: 'headerHolder',
			layout: {classType: "js.awt.GridLayout",
				rowNum: 1,
			    colNum: columnLen,
			    rows: [{index: 0, measure: 26, rigid: true}],
			    cols: colsDef
			},
			rigid_w: false,
			rigid_h: false,
			items: headerItems,
		    constraints:{rowIndex: 0, colIndex: 0}
		};
		for(i = 0; i < columnLen; i++){
			this.colsDef[i] = {index: i, rigid: false, weight: columnWeights[i]};
			headerItems[i] = 'header' + i;
			def.headerHolder[headerItems[i]] = {
					classType: 'js.awt.Item',
					className: 'jsvm_table_header',
					id: 'header' + i,
					index: i,
					rigid_w: false,
					rigid_h: false,
					controlled: true,
					labelText: headerNames[i].trim(),
					constraints: {rowIndex: 0, colIndex: i}
			}
		}
	
		def.bodyHolder = {
				classType: 'js.awt.Container',
				layout: {classType : "js.awt.BoxLayout"},
				id: 'bodyHolder',
				rigid_w: false,
				rigid_h: false,
				className: "jsvm_table_bodyHolder",
				constraints:{rowIndex: 1, colIndex: 0}
		};

		arguments.callee.__super__.apply(this, arguments);
		var headerHolder = this['headerHolder'];
		var bodyHolder = this['bodyHolder']; 
		headerHolder.attachEvent('click', 0, this, _onSort);
		for(i = 0; i < columnLen; i++){
			var headerItem = headerHolder[headerHolder.def.items[i]];
			this.headerCache[headerItem.uuid()] = headerItem;
		}
		this._sortIndex = -1;
		this._sortAsc = false;
		this._lastIndex = -1;
		this.lastHeaderItem = null; 
		this.cache = {};
		this.curRow = null;
		bodyHolder.attachEvent("click", 0, this, _onClick);
		bodyHolder.attachEvent("dblclick", 0, this, _onDblClick);
		bodyHolder.attachEvent('mouseover', 0, this, _onRowMouseover);
		bodyHolder.attachEvent("mouseout", 0, this, _onRowMouseout);
	}.$override(this._init);
	this._init.apply(this, arguments);
}.$extend(js.awt.Container);