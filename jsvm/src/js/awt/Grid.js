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
    
    var Class = js.lang.Class, Object = js.lang.Object,
        System = J$VM.System;
    
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
        return this.acells[rowIndex][colIndex];
    };
    
    /**
     * Extract cells array to valid cells list
     */
    thi$.extractCells = function(force){
        var cells = (force === true) ? null : this.cells;

        if(!Class.isArray(cells)){
            cells = [];
            var acells = this.acells,
                rowNum = this.rowNum(),
                colNum = this.colNum(), 
                i, j, cell;
            
            for(i=0; i<rowNum; i++){
                for(j=0; j<colNum; j++){
                    cell = acells[i][j];
                    if(Class.isObject(cell)){
                        cell.rowIndex = i;
                        cell.colIndex = j;
                        cells.push(cell);
                    }
                } 
            }

            this.cells = cells;
        }

        return cells;
    };
    
    /**
     * Expand valid cells list to a rowNum x colNum cells array 
     */
    thi$.expandCells = function(force){
        var acells = (force === true) ? null :  this.acells;

        if(!Class.isArray(acells)){
            var rowNum = this.rowNum(), colNum = this.colNum(),
                cells = this.cells, cell, i, ilen;

            acells = new Array(rowNum);
            for(i=0; i<rowNum; i++){
                acells[i] = new Array(colNum);
            }
            
            for(i=0, ilen=cells.length; i<ilen; i++){
                cell = cells[i];
                acells[cell.rowIndex][cell.colIndex] = cell;
            }

            this.acells = acells;
        }

        return acells;
    };

    /**
     * Set attributes of a specified row.
     * 
     * @param index, row index
     * @param attrs, an object which include one or more following attributes 
     * "rigid", "measure", "weight", "visible". 
     */
    thi$.rowAttrs = function(index, attrs){
        _dimAttrs.call(this, this.rows, index, attrs);
    };

    /**
     * Set attributes of a specified column.
     * 
     * @param index, column index
     * @param attrs, an object which include one or more following attributes 
     * "rigid", "measure", "weight", "visible". 
     */
    thi$.colAttrs = function(index, attrs){
        _dimAttrs.call(this, this.cols, index, attrs);
    };

    var _dimAttrs = function(dims, index, attrs){
        var dim, p;
        if(Class.isObject(attrs) && 
           (index>=0 && index < dims.length)){
            dim = dims[index];
            for(p in attrs){
                if(attrs.hasOwnProperty(p)){
                    switch(p){
                    case "rigid":
                        if(dim.rigid !== attrs.rigid){
                            dim.rigid = attrs.rigid;
                            dims.dirty |= 0x01; // need re-calc weight
                        }
                        break;
                    case "visible":
                        if(dim.visible !== attrs.visible){
                            dim.visible = attrs.visible;
                            dims.dirty |= 0x01; // need re-calc weight
                        }
                        break;
                    default:
                        dim[p] = attrs[p];                  
                    }
                }
            }
        }
    };

    // Judge and merge areas of line segments with the same starting point. 
    var _mergeArea = function(set, index, area, isV){
        var preIndex, preArea, nextIndex, nextArea, p0, p1;
        for(var i = index; i >= 0; i--){
            preArea = set[i];
            if(preArea){
                preIndex = i;                
                break;
            }
        }
        
        for(var j = index + 1, len = set.length; j < len; j--){
            nextArea = set[j];
            if(nextArea){
                nextIndex = j;
                break;
            }
        }
        
        p0 = isV ? "y0" : "x0";
        p1 = isV ? "y1" : "x1";
        
        if((preArea && preArea[p0] <= area[p0]
            && preArea[p1] >= area[p1])){
            // Do nothing            
        }else if(preArea && preArea[p1] >= area[p0] 
                 && nextArea && nextArea[p0] <= area[p1]){
            preArea[p1] = nextArea[p1];
            set.splice(nextIndex, 1);
        }else if(preArea && preArea[p1] >= area[p0]){
            preArea[p1] = area[p1];
        }else if(nextArea && nextArea[p0] <= area[p1]){
            area[p1] = nextArea[p1];
            set.splice(nextIndex, 1);
            set[index] = area;
        }else{
            set[index] = area;
        }
        
        return set;
    };
    
    var _getLineMatrix = function(lineMatrixes, cell){
        var rIndex = cell.rowIndex, cIndex = cell.colIndex,
            hlines = lineMatrixes.hlines, vlines = lineMatrixes.vlines,
            rowSpan = cell.rowSpan, colSpan = cell.colSpan,
            x0 = cell.x, x1 = x0 + cell.width, 
            y0 = cell.y, y1 = y0 + cell.height,
            index, hline, vline, xs, ys;
        
        index = rIndex;
        hline = hlines[index] = hlines[index] || {y: y0, xs: []};
        xs = hline.xs;
        _mergeArea.call(this, xs, cIndex, {x0: x0, x1: x1}, false);
        
        index = rIndex + rowSpan;
        hline = hlines[index] = hlines[index] || {y: y1, xs: []};
        xs = hline.xs;
        _mergeArea.call(this, xs, cIndex, {x0: x0, x1: x1}, false);
        
        index = cIndex;
        vline = vlines[index] = vlines[index] || {x: x0, ys: []};
        ys = vline.ys;
        _mergeArea.call(this, ys, rIndex, {y0: y0, y1: y1}, true);
        
        index = cIndex + colSpan;
        vline = vlines[index] = vlines[index] || {x: x1, ys: []};
        ys = vline.ys;
        _mergeArea.call(this, ys, rIndex, {y0: y0, y1: y1}, true);
    };
    
    /**
     * Calculate and return all matrixes of lines.
     * 
     * lineMatrixes: {
     *     hlines: [
     *        {y: 0, xs:[{x0, x1}, {x0, x1}, ...]},
     *        ......
     *        {y: n, xs:[{x0, x1}, {x0, x1}, ...]}
     *     ],
     *     vlines: [
     *        {x: 0, ys:[{y0, y1}, {y0, y1}, ...]},
     *        ......
     *        {x: n, ys:[{y0, y1}, {y0, y1}, ...]} 
     *     ]
     * }
     * 
     * @param force: {Boolean} A boolean value to indicate whether the
     *        old matrixes ignored.
     */
    thi$.getLineMatrixes = function(force){
        var lineMatrixes = this.lineMatrixes, cells = this.extractCells();
        if(force !== true && lineMatrixes){
            return lineMatrixes;
        }
        
        lineMatrixes = this.lineMatrixes = {hlines: [], vlines: []};
        for(var i = 0, len = cells.length; i < len; i++){
            _getLineMatrix.call(this, lineMatrixes, cells[i]);
        }
        
        // J$VM.System.err.println(lineMatrixes);
        return lineMatrixes;
    };

    thi$.layout = function(xbase, ybase, width, height){

        this.update();

        // Calculates height of every row
        _calcDimsMeasure.call(this, this.rows, ybase, height);

        // Calculates width of every column
        _calcDimsMeasure.call(this, this.cols, xbase, width);
        
        // Calculates width and height of every cell
        _calcCellsMeasure.call(this);
        
        // Invalidate lineMatrixes
        delete this.lineMatrixes;
    };

    /**
     * Update grid model
     *
     */
    thi$.update = function(){
        
        // Adjust weight
        if(this.rows.dirty & 0x01 !== 0){
            _adjustWeight.call(this, this.rows);
        }
        if(this.cols.dirty & 0x01 !== 0){
            _adjustWeight.call(this, this.cols);
        }

        if(this.acells){
            // Generate this.cells
            this.extractCells(true);
        }
    };

    var _adjustWeight = function(dims){

        var dim, i, len, weight = 1.0, v, tmps=[];

        for(i=0, len=dims.length; i<len; i++){
            dim = dims[i];

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

        dims.dirty &= ~0x01;

    };
    
    var _initDims = function(dims, dimDefs){
        var dlen = dims.length, dimDef, dim, i, len, index, v;

        dims.dirty = 0;

        if(Class.isArray(dimDefs)){
            for(i=0, len=dimDefs.length; i<len; i++){
                dimDef = dimDefs[i];
                index = dimDef.index;
                if(index >=0 && index <dlen){
                    v = dimDef.measure;
                    dims[index] = {
                        visible: !(dimDef.visible === false),
                        measure: Class.isNumber(v) ? v : 0,
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
        }

        _adjustWeight.call(this, dims);
    };

    var _initCells = function(cells, cellDefs){
        var rows = this.rows, cols = this.cols, 
            m = rows.length, n = cols.length,
            cellDef, cell, i, j, len, rspan, cspan, 
            pt, pr, pb, pl, ri, cj, visible, 
            padding = this.cellpadding;

        // Initialize cell definition according to the definition
        if(Class.isArray(cellDefs)){
            for(i=0, len=cellDefs.length; i<len; i++){
                cellDef = cellDefs[i];
                ri = cellDef.rowIndex, cj = cellDef.colIndex;

                if(ri >=0 && ri < m && cj >=0 && cj < n){

                    rspan = cellDef.rowSpan; 
                    cspan = cellDef.colSpan;

                    pt = cellDef.paddingTop;
                    pr = cellDef.paddingRight;
                    pb = cellDef.paddingBottom;
                    pl = cellDef.paddingLeft;

                    cells[ri][cj] = {
                        rowSpan: Class.isNumber(rspan) ? rspan : 1,
                        colSpan: Class.isNumber(cspan) ? cspan : 1,
                        paddingTop: Class.isNumber(pt) ? pt : padding[0],
                        paddingRight: Class.isNumber(pr) ? pr : padding[1],
                        paddingBottom: Class.isNumber(pb) ? pb : padding[2],
                        paddingLeft: Class.isNumber(pl) ? pl : padding[3]
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
    
    var _calcCellsMeasure = function(){
        var cells = this.extractCells(), 
            cell, dim, span, offset, v, i, j, len;

        for(i=0, len=cells.length; i<len; i++){
            cell = cells[i];
            
            // For width
            offset = -1; v = 0;
            span = cell.colSpan;
            for(j=0; j<span; j++){
                dim = this.column(cell.colIndex + j);
                if(dim.visible === true){
                    v += dim.measure;

                    if(offset < 0){
                        offset = dim.offset;
                    }
                }
            }
            cell.x = offset;
            cell.width = v;
            cell.innerWidth = v - cell.paddingLeft - cell.paddingRight;

            // For height
            offset = -1; v = 0;
            span = cell.rowSpan;
            for(j=0; j<span; j++){
                dim = this.row(cell.rowIndex + j);
                if(dim.visible === true){
                    v += dim.measure;

                    if(offset < 0){
                        offset = dim.offset;
                    }
                }
            }
            cell.y = offset;
            cell.height = v;
            cell.innerHeight = v - cell.paddingTop - cell.paddingBottom;
        }
        
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
        this.acells = new Array(m);
        for(var i=0; i<m; i++) this.acells[i] = new Array(n);
        _initCells.call(this, this.acells, def.cells);

    };
    
    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);
