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
 * @param def:{
 *     rowNum: m,
 *     colNum: n,
 *     rows:[{index, measure, rigid, weight, visible},{}...],
 *     cols:[{index, measure, rigid, weight, visible},{}...],
 *     cells:[
 *       {rowIndex, colIndex, rowSpan, colSpan, paddingTop...},
 *       ...
 *     ],
 *     cellpadding: [t, r, b, l]
 * }
 */
js.awt.Grid = function(def){

    var CLASS = js.awt.Grid, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class;
    
    thi$.rowNum = function(){
        return this.rows.length;
    };
    
    thi$.colNum = function(){
        return this.cols.length;
    };
    
    thi$.row = function(index){
        return this.rows[index];
    };
    
    thi$.column = function(index){
        return this.cols[index];
    };
    
    thi$.cell = function(rowIndex, colIndex){
        return this.cells[rowIndex][colIndex];
    };
    
    thi$.layout = function(xbase, ybase, width, height){

        // Calculates height of every row
        _calcDimsMeasure.call(this, this.rows, ybase, height);

        // Calculates width of every column
        _calcDimsMeasure.call(this, this.cols, xbase, width);
        
        // Calculates width and height of every cell
        _calcCellsMeasure.call(this, this.rowNum(), this.colNum());
        
    };
    
    var _initDims = function(dims, dimDefs){
        var defs = new Array(dims.length), dimDef, dim, weight = 1.0, 
        i, len, v, tmps = [];
        
        if(Class.isArray(dimDefs)){
            for(i=0, len=dimDefs.length; i<len; i++){
                dimDef = dimDefs[i];
                defs[dimDef.index] = dimDef;
            }
        }

        for(i=0, len=defs.length; i<len; i++){
            dimDef = defs[i];
            if(!dimDef){
                dimDef = {index: i};
            }

            dim = dims[i] = new (CLASS.Dimension)(dimDef);
            if(!dim.rigid && dim.visible){
                v = dim.weight;
                if(Class.isNumber(v)){
                    weight -= v;
                }else{
                    tmps.push(dim);
                }
            }
        };
        
        if(tmps.length > 0){
            weight /= tmps.length;

            while(tmps.length > 0){
                tmps.shift().weight = weight;
            }
        }
    };

    var _calcDimsMeasure = function(dims, base, total){
        var dim, i, len = dims.length, tmps = [];
        for(i=0; i<len; i++){
            dim = dims[i];
            if(!dim.visible) continue;

            if(dim.rigid){
                total -= dim.measure;
            }else{
                tmps.push(dim);
            }
        }
        
        var rest = total, v;
        while(tmps.length > 0){
            dim = tmps.shift();
            v = Math.round(total*dim.weight);
            rest -= v;
            dim.measure = v;
        }
        if(Class.isNumber(v)){
            dim.measure = (v + rest);
        }
        
        for(i=0; i<len; i++){
            dim = dims[i];
            dim.offset = base;
            base += dim.visible ? dim.measure : 0;
        }
    };
    
    var _initCells = function(cells, def){
        var defs, cellDefs = def.cells, cellDef, cell, 
        i, j, rspan, cspan, ri, cj, padding = def.cellpadding,
        m = this.rowNum(), n = this.colNum(), visible;

        defs = new Array(m);
        for(i=0; i<m; i++) defs[i]  = new Array(n);

        // Initialize cell definition according to the definition
        if(Class.isArray(cellDefs)){
            for(i=0; i<cellDefs.length; i++){
                cellDef = cellDefs[i];
                if(!Class.isNumber(cellDef.rowSpan)){
                    cellDef.rowSpan = 1;
                }
                if(!Class.isNumber(cellDef.colSpan)){
                    cellDef.colSpan = 1;
                }
                defs[cellDef.rowIndex][cellDef.colIndex] = cellDef;
            }
        }
        
        // Merge cell definition and initialize cell
        for(i=0; i<m; i++){
            for(j=0; j<n; j++){
                cellDef = defs[i][j];
                if(cellDef === null) continue;

                if(cellDef === undefined){
                    cellDef = {
                        rowIndex:i, 
                        colIndex:j, 
                        rowSpan:1, 
                        colSpan:1,
                        paddingTop: padding[0],
                        paddingRight: padding[1],
                        paddingBottom: padding[2],
                        paddingLeft: padding[3]                     
                    };
                }
                
                visible = false;
                rspan = cellDef.rowSpan - 1;
                while(rspan >= 0){
                    cspan = cellDef.colSpan - 1;
                    while(cspan >= 0){
                        if(rspan !=0 || cspan != 0){
                            ri = i+rspan; cj = j+cspan;
                            defs[ri][cj] = null;
                            visible = visible || 
                                (this.row(ri).visible && this.column(cj).visible);
                        }
                        cspan--;
                    }
                    rspan--;
                }
                
                cell = new (CLASS.Cell)(cellDef);
                cell.visible = 
                    (visible || (this.row(i).visible && this.column(j).visible));
                cells[i][j] = cell;
            }
        }

    };
    
    var _calcCellsMeasure = function(m, n){
        var cells = this.cells, cell, i, j;

        for(i=0; i<m; i++){
            for(j=0; j<n; j++){
                cell = cells[i][j];
                if(cell){
                    cell.calcBounds(this);
                }
            }
        }
    };
    
    thi$._init = function(def){
        if(def == undefined) return;
        
        var m, n;
        
        def.cellpadding = def.cellpadding || [0,0,0,0];

        // Init rows
        m = def.rowNum;
        m = Class.isNumber(m) ? (m > 0 ? m : 1) : 1;
        this.rows = new Array(m);
        _initDims.call(this, this.rows, def.rows);
        
        // Init columns
        n = def.colNum;
        n = Class.isNumber(n) ? (n > 0 ? n : 1) : 1;
        this.cols = new Array(n);
        _initDims.call(this, this.cols, def.cols);
        
        // Init cells
        this.cells = new Array(m);
        for(var i=0; i<m; i++) this.cells[i] = new Array(n);
        _initCells.call(this, this.cells, def);

    };
    
    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);

/**
 * @param def:{
 *     index: row/column index
 *     measure: width or height of a rigid dimension
 *     rigid: true/false
 *     weight: 0 to 1
 *     visible: true/false
 * }
 */
js.awt.Grid.Dimension = function(def){

    var CLASS = js.awt.Grid.Dimension, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class;
    
    thi$._init = function(def){
        if(def == undefined) return;

        this.index = def.index;

        this.rigid = (def.rigid === true);
        this.measure = 0;
        this.weight = def.weight;
        if(this.rigid === true){
            this.weight = 0.0;
            if(Class.isNumber(def.measure)){
                this.measure = def.measure;
            }
        }
        
        this.visible = !(def.visible === false);
    };
    
    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);

/**
 * @param def:{
 *     rowIndex: Must
 *     colIndex: Must
 *     rowSpan:  Optional, the default value is 1
 *     colSpan:  Optional, the default value is 1
 * 
 *     paddingTop:   Optional
 *     paddingRight: Optional
 *     paddingBottom:Optional 
 *     paddingLeft:  Optional
 * }
 */
js.awt.Grid.Cell = function(def){

    var CLASS = js.awt.Grid.Cell, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class;
    
    thi$.calcBounds = function(G){
        var index, span, dim, v, offset, i;
        
        // For width
        index = this.colIndex; span = this.colSpan;
        v = 0; offset = null;
        for(i=0; i<span; i++){
            dim = G.column(index + i);
            if(dim.visible){
                v += dim.measure;

                if(offset === null){
                    offset = dim.offset;
                }
            }
        }

        this.x = offset;
        this.width = v;
        this.innerWidth = v - this.PW;
        
        // For height
        index = this.rowIndex; span = this.rowSpan; 
        v = 0; offset = null;
        for(i=0; i<span; i++){
            dim = G.row(index + i);
            if(dim.visible){
                v += dim.measure;

                if(offset === null){
                    offset = dim.offset;
                }
            }
        }

        this.y = offset;
        this.height = v;
        this.innerHeight = v - this.PH;
        
    };
    
    thi$._init = function(def){
        if(def == undefined) return;
        
        this.rowIndex = def.rowIndex;
        this.colIndex = def.colIndex;

        this.rowSpan = Class.isNumber(def.rowSpan) ? def.rowSpan : 1;
        this.colSpan = Class.isNumber(def.colSpan) ? def.colSpan : 1;
        
        this.paddingTop    = def.paddingTop    || 0;
        this.paddingRight  = def.paddingRight  || 0;
        this.paddingBottom = def.paddingBottom || 0;
        this.paddingLeft   = def.paddingLeft   || 0;

        this.PW = this.paddingLeft + this.paddingRight;
        this.PH = this.paddingTop  + this.paddingBottom;
    };
    
    this._init.apply(this, arguments);

}.$extend(js.lang.Object);

