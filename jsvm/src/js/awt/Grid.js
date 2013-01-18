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
    
    var Class = js.lang.Class, Object = js.lang.Object;
    
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
        var dlen = dims.length, dimDef, dim, weight = 1.0, 
        i, len, index, v, tmps = [];

        if(Class.isArray(dimDefs)){
            for(i=0, len=dimDefs.length; i<len; i++){
                dimDef = dimDefs[i];
                index = dimDef.index;
                if(index >=0 && index <dlen){
                    dims[index] = {
                        visible: !(dimDef.visible === false),
                        measure: Class.isNumber(dimDef.measure) ? dimDef.measure : 0,
                        weight: dimDef.weight,
                        rigid: (dimDef.rigid === true)
                    };
                }
            }
        }

        for(i=0; i<dlen; i++){
            dim = dims[i];
            if(dim === undefined){
                dim = dims[i] = {visible:true, rigid:false};
            }
            
            
            Object.$decorate(dim);

            if(!dim.rigid && dim.visible){
                v = dim.weight;
                if(Class.isNumber(v)){
                    weight -= v;
                }else{
                    tmps.push(dim);
                }
            }
        }

        if(tmps.length > 0){
            weight /= tmps.length;

            while(tmps.length > 0){
                tmps.shift().weight = weight;
            }
        }
    };

    var _initCells = function(cells, cellDefs){
        var rows = this.rows, cols = this.cols, 
        m = rows.length, n = cols.length,
        cellDef, cell, i, j, len, rspan, cspan, 
        ri, cj, visible, padding = this.cellpadding;

        // Initialize cell definition according to the definition
        if(Class.isArray(cellDefs)){
            for(i=0, len=cellDefs.length; i<len; i++){
                cellDef = cellDefs[i];
                ri = cellDef.rowIndex, cj = cellDef.colIndex;
                if(ri >=0 && ri < m && cj >=0 && cj < n){
                    cells[ri][cj] = {
                        rowSpan: Class.isNumber(cellDef.rowSpan) ? cellDef.rowSpan : 1,
                        colSpan: Class.isNumber(cellDef.colSpan) ? cellDef.colSpan : 1,
                        paddingTop: Class.isNumber(cellDef.paddingTop) ? cellDef.paddingTop : padding[0],
                        paddingRight: Class.isNumber(cellDef.paddingRight) ? cellDef.paddingLeft : padding[1],
                        paddingBottom: Class.isNumber(cellDef.paddingBottom) ? cellDef.paddingBottom : padding[2],
                        paddingLeft: Class.isNumber(cellDef.paddingLeft) ? cellDef.paddingLeft : padding[3]
                    };
                }
            }
        }
        
        // Merge cell definition and initialize cell
        for(i=0; i<m; i++){
            for(j=0; j<n; j++){
                cell = cells[i][j];

                if(cell === null) continue;

                if(cell === undefined){
                    cell = cells[i][j] = {
                        rowSpan:1, 
                        colSpan:1,
                        paddingTop: padding[0],
                        paddingRight: padding[1],
                        paddingBottom: padding[2],
                        paddingLeft: padding[3]                     
                    };
                }

                Object.$decorate(cell);

                visible = false;
                rspan = cell.rowSpan - 1;
                while(rspan >= 0){
                    cspan = cell.colSpan - 1;
                    while(cspan >= 0){
                        if(rspan !=0 || cspan != 0){
                            ri = i+rspan; cj = j+cspan;
                            cells[ri][cj] = null;
                            visible = visible || 
                                (rows[ri].visible && cols[cj].visible);
                        }
                        cspan--;
                    }
                    rspan--;
                }
                
                cell.visible = (visible || (rows[i].visible && cols[j].visible));
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
    
    
    var _calcCellsMeasure = function(m, n){
        var cells = this.cells, cell, i, j;

        for(i=0; i<m; i++){
            for(j=0; j<n; j++){
                cell = cells[i][j];
                if(cell){
                    _calcCellBounds.call(this, cell, i, j);
                }
            }
        }
    };

    var _calcCellBounds = function(cell, rIdx, cIdx){
        var rows = this.rows, cols= this.cols, 
        index, span, dim, v, offset, i;
        
        // For width
        span = cell.colSpan;
        v = 0; offset = null;
        for(i=0; i<span; i++){
            dim = cols[cIdx + i];
            if(dim.visible){
                v += dim.measure;

                if(offset === null){
                    offset = dim.offset;
                }
            }
        }

        cell.x = offset;
        cell.width = v;
        cell.innerWidth = v - cell.paddingLeft - cell.paddingRight;
        
        // For height
        span = cell.rowSpan; 
        v = 0; offset = null;
        for(i=0; i<span; i++){
            dim = rows[rIdx + i];
            if(dim.visible){
                v += dim.measure;

                if(offset === null){
                    offset = dim.offset;
                }
            }
        }

        cell.y = offset;
        cell.height = v;
        cell.innerHeight = v - cell.paddingTop - cell.paddingBottom;
    };

    
    thi$._init = function(def){
        if(def == undefined) return;
        
        var m, n;
        
        this.cellpadding = def.cellpadding || [0,0,0,0];

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
        _initCells.call(this, this.cells, def.cells);

    };
    
    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);

