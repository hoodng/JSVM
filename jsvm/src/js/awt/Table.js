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
 * The TableModel interface specifies the methods the Table will use to 
 * interrogate a tabular data model.
 * 
 */ 
js.awt.TableModel = function(){

    var CLASS = js.awt.Table, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    /**
     * Adds a listener to the list that's notified each time a change to
     * the data model occurs.
     */
    thi$.addModelListener = function(listener){
    };
    
    /**
     * Removes a listener from the list that's notified each time a change to 
     * the data model occurs.
     */
    thi$.removeModelListener = function(listener){
    };
    
    /**
     * Returns the number of columns in the model
     */
    thi$.getColumnCount = function(){
    };
    
    /**
     * Returns the name of the column at colIndex.
     */
    thi$.getColumnName = function(colIndex){
    };
    
    /**
     * Returns the number of rows in the model
     */
    thi$.getRowCount = function(){
    };
    
    /**
     * Returns the value for the cell at colIndex and rowIndex
     */
    thi$.getVauleAt = function(rowIndex, colIndex){
    };

    /**
     * Returns true if the cell at rowIndex and colIndex is editable.
     */    
    thi$.isCellEditable = function(rowIndex, colIndex){
    };
    
    /**
     * Sets the value in the cell at colIndex and rowIndex to value
     */
    thi$.setValueAt = function(value, rowIndex, colIndex){
    };

};

/**
 *  
 * The Table is used to display regular two-dimensional tables of cells
 * 
 * @param def :{
 *     className: xxx
 *     
 * } 
 */
js.awt.Table = function (def, Runtime){

    var CLASS = js.awt.Table, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    /**
     * Build table from a js.awt.Grid
     * 
     * @see js.awt.Grid
     */
    thi$.buildTable = function(grid){
        var R = this.Runtime(), 
        row, cell, i, j, m, n, trow, tcell;
        this.grid = grid;

        for(i=0, m=grid.rowNum(); i<m; i++){
            row = grid.row(i);

            trow = undefined;

            if(row.visible){
                trow = row.trow = new (CLASS.Row)(
                    {uuid:row.uuid()}, R);
            }

            for(j=0, n=grid.colNum(); j<n; j++){
                cell = grid.cell(i, j);
                if(trow && cell && cell.visible){
                    tcell = cell.tcell = new (CLASS.Cell)(
                        {uuid: cell.uuid(),
                         rowspan: cell.rowSpan, 
                         colspan:cell.colSpan}, R);
                    
                    tcell.appendTo(trow.view);
                }
            }

            if(trow){
                trow.appendTo(this.view);
            }
        }
                       
 
    };
    
    thi$.destroy = function(){
        delete this.grid;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.Table";
        def.className = def.className || "jsvm_table";
        
        def.viewType = "TABLE";
        
        arguments.callee.__super__.apply(this, arguments);

        var grid = new (Class.forName("js.awt.Grid"))(this.def);
        this.buildTable(grid);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Component);

js.awt.Table.Row = function(def, Runtime){

    var CLASS = js.awt.Table.Row, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    thi$.repaint = function(){
        // Nothing todo
    }.$override(this.repaint);
    
    thi$.doLayout = function(){
        // Nothing todo
    }.$override(this.doLayout);

    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.Table.Row";
        def.className = def.className || "jsvm_table_row";
        
        def.viewType = "TR";
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
}.$extend(js.awt.Component);

js.awt.Table.Cell = function(def, Runtime){

    var CLASS = js.awt.Table.Cell, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    thi$.repaint = function(){
        // Nothing todo
    }.$override(this.repaint);
    
    thi$.doLayout = function(){
        // Nothing todo
    }.$override(this.doLayout);

    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.Table.Cell";
        def.className = def.className || "jsvm_table_cell";
        
        def.viewType = "TD";
        
        arguments.callee.__super__.apply(this, arguments);
        
        var ele = this.view;
        ele.setAttribute("rowspan",""+def.rowspan);
        ele.setAttribute("colspan",""+def.colspan);

    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
}.$extend(js.awt.Component);

