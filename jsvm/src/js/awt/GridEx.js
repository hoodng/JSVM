/**
  Copyright 2008-2015, The JSVM Project. 
  All rights reserved.
  
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.awt");

/**
 * @param def:{
 *     rowNum: m,
 *     colNum: n,
 *     rows:[{idx, rigid, measure, visible},{}...],
 *     cols:[{idx, rigid, measure, visible},{}...],
 *     cells:[
 *       {rowIdx, colIdx, rowSpan, colSpan},
 *       ...
 *     ]
 * }
 */
js.awt.GridEx = function(def){

    var CLASS = js.awt.GridEx, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    CLASS.MSG_CHANGED = "js.awt.GridEx.changed";
    
    var Class = js.lang.Class, J$Math = js.lang.Math,
        START = 0, END = 2,
        XD = 0, YD = 1, CS = 2,
        X0 = 0, Y0 = 1, X1 = 2, Y1 = 3, 
    // row is the result of inRange with old index
    // col is the result of inRange with new index
        MOVEADJ = [
            // 0: left out of range
            [[0,   0],[-1,  0],[-1,  0],[-1, -1],[-1, -1]],
            // 1: start of range
            [[null,0],[null,0],[null,0],[null,0],[0,   0]],
            // 2: in range
            [[+1,  0],[+1,  0],[0,   0],[0,  -1],[0,  -1]],
            // 3: end of range
            [[0,   0],[0,null],[0,null],[0,null],[0,null]],
            // 4: right out of range
            [[+1, +1],[+1, +1],[0,  +1],[0,  +1],[0,   0]],
            // 5: insert to range
            [[+1, +1],[+1, +1],[0,  +1],[0,  +1],[0,   0]],        
            // 6: remove from range
            [[-1, -1],[0,  -1],[0,  -1],[0,   0],[0,   0]]
        ],
    // [x, y, cell]
        DIRTY = [0x01<<0, 0x01<<1, 0x01<<2];

    //// Dimentions ////////////////////////////////////////////////////
    var _makeDim = function(def, dir){
        def = def || {};

        var dims = this.dims[dir], total = dims.total,
            dim = {uuid: def.uuid || J$Math.uuid()};

        dim.visible = Class.isBoolean(def.visible) ?
            def.visible : true;
        
        if(this.forlayout){
            dim.rigid = def.rigid || false;
            if(def.measure){
                dim.measure = def.measure;
                if(total){
                    dim.weight = dim.measure/total;
                }
            }else if(def.weight){
                dim.weight = dim.def_weight = def.weight;                
            }else{
                dim.measure = this.min_cellsize[dir];
                if(total){
                    dim.weight = dim.measure/total;
                }
            }
        }else{
            dim.rigid = true;
            dim.measure = def.measure || this.def_cellsize[dir];
            dim.weight = dim.def_weight = 0;
        }

        return dim;
    };

    var _initDims = function(dimDefs, dir){
        var dims = this.dims[dir], map = this.dimap,
            dim, i, len, forlayout = this.forlayout,
            flexes=[], v, weight = 1.0;

        dimDefs = dimDefs || [];

        for(i=0, len=dimDefs.length; i<len; i++){
            dim = dimDefs[i];
            dims[dim.index] = _makeDim.call(this, dim, dir);
        }

        for(i=0, len=dims.length; i<len; i++){
            dim = dims[i];
            if(!dim){
                dim = dims[i] = _makeDim.call(this, null, dir);
            }
            map[dim.uuid] = i;

            if(!forlayout || dim.rigid || !dim.visible) continue;

            v = dim.def_weight;
            if(Class.isNumber(v)){
                weight -= v;
                dim.weight = v;
            }else{
                flexes.push(dim);
            }
        }

        len = flexes.length;
        if(!forlayout || len === 0) return;

        if(weight <= 0) throw new Error(
            "The grid space is not enough.");

        v = weight/len;
        weight = Math.floor(v*10000)/10000;
        v -= weight;

        while(flexes.length > 0){
            dim = flexes.shift();
            dim.weight = weight;
        }

        dim.weight += v;
    };

    var _layoutDims = function(base, total, dir){
        var dims = this.dims[dir], dim, i, len = dims.length,
            forlayout = this.forlayout, flexes = [], rest, v;

        dims.base = base;
        dims.total = total;
        for(i=0; i<len; i++){
            dim = dims[i];
            if(!dim.visible) continue;

            if(forlayout){
                if(dim.rigid){
                    dim.offset = base;
                    v = dim.measure;
                    dim.weight = v/dims.total;
                    base  += v;
                    total -= v;
                }else{
                    flexes.push(dim);
                }
            }else{
                dim.offset = base;
                v = dim.measure;
                base += v;
            }
        }

        if(forlayout){
            rest = total;
            while(flexes.length > 0){
                dim = flexes.shift();
                dim.offset = base;
                v = Math.round(total*dim.weight);
                dim.measure = v;
                dim.weight = v/dims.total;
                base += v;
                rest -= v;
            }

            if(Class.isNumber(v)){
                rest += v;
                dim.measure = rest;
                dim.weight = rest/dims.total;
            }
        }

        this.setDirty(false, DIRTY[dir]);
    };

    var _insertDim = function(dim, to, keeplayout, dir){
        var cells = _allCells.call(this), idx;

        if(to.length === 1) return;

        _shiftDim.call(this, dim, to, keeplayout, dir);
        idx = _id2idx.call(this, dim.uuid);
        _adjustCells.call(this, cells, -5, idx, dir);
    };

    var _removeDim = function(dim, keeplayout, dir){
        var cells = _allCells.call(this), idx;

        if(this.dims[dir].length === 1) return;

        idx = _id2idx.call(this, dim.uuid);
        _shiftDim.call(this, dim, null, keeplayout, dir);
        _adjustCells.call(this, cells, -6, idx, dir);
    };
    
    var _adjustCells = function(cells, oidx, nidx, dir){
        var end = dir+END, max = this.dims[dir].length,
            cell, range, rf, cf, r, v;

        while(cells.length > 0){
            cell = cells.shift();
            range = cell.range;
            rf = inRange(range, oidx, dir);
            cf = inRange(range, nidx, dir)
            r = MOVEADJ[rf][cf];
            v = r[dir>>1];
            if(v === null){
                range[dir] = nidx;
            }else{
                range[dir] += v;
                v = range[dir];
                range[dir] = v < 0 ? 0 : v;
            }

            v = r[end>>1];
            if(v === null){
                range[end] = nidx;
            }else{
                range[end] += v;
                v = range[end];
                range[end] = v < 0 ? 0 : v;
            }
            _updateCell.call(this, cell);
        }
    };

    var _shiftDim = function(dim, to, keeplayout, dir){
        var dims = this.dims[dir], idx, delta, insert = !!to;

        if(insert){
            idx = _id2idx.call(this, to[0].uuid);
            _shareSpace.call(this, -dim.measure,
                             dims[idx], keeplayout, dir);
            dims.splice(idx+1, 0, dim);
        }else{
            idx = _id2idx.call(this, dim.uuid);
            delta = idx === 0 ? 0 : -1;
            delete this.dimap[dim.uuid];
            dims.splice(idx, 1);
            _shareSpace.call(this, dim.measure,
                             dims[idx+delta], keeplayout, dir);
        }
        
        mapIndex(this.dimap, dims, idx);
        _layoutDims.call(this, dims.base, dims.total, dir);
        this.setDirty(true, DIRTY[CS]);
    };

    var _shareSpace = function(measure, dim, keeplayout, dir){
        var dims = this.dims[dir], flexes, total, i;

        if(!this.forlayout) return;

        total = dims.total;
        if(keeplayout){
            // If the dim is flexible, then all measure assign to it.
            if(dim && !dim.rigid){
                dim.weight = (dim.measure + measure)/total;
                return;
            }
        }else{
            flexes = flexCountOf(dims);
            if(flexes <= 0) return;
            measure = measure/flexes;
        }

        // If keeplayout sharing the measure to the first flexible 
        // dim from behind of dims, else sharing the measure to all 
        // flexible dims.
        for(i=dims.length-1; i>=0; i--){
            dim = dims[i];
            if(!dim.rigid && dim.visible){
                dim.weight = (dim.measure + measure)/total;
                if(keeplayout) break;
            }
        }
    };

    var flexCountOf = function(dims){
        var dim,  i, len, count=0;
        for(i=0, len=dims.length; i<len; i++){
            dim = dims[i];
            if(dim.rigid || !dim.visible) continue;
            count += 1;
        }
        return count;
    };

    var inRange = function(r, i, dir){
        var io=r[dir], ix = r[dir+END], ret;
        if(i < 0){
            ret = Math.abs(i);
        }else if(i < io){
            ret = 0;
        }else if(i === io){
            ret = 1;
        }else if(i > io && i < ix){
            ret = 2;
        }else if(i === ix){
            ret = 3;
        }else{
            ret = 4;
        }
        return ret;
    };

    var _id2idx = function(id){
        return this.dimap[id.split("-")[0]];
    };

    var _position2dims = function(offset, dir){
        var dims = this.dims[dir], dim, i, len=dims.length,
            delta = this.snapdelta, v, ret = [];

        for(i=0; i<len; i++){
            dim = dims[i];
            v = dim.offset;
            if(offset <= (v+delta) && offset >= (v-delta)){
                ret.push(dim);
                break;
            }else if( offset > v+delta &&
                      offset < dim.offset+dim.measure-delta){
                ret.push(dim, dims[i+1]);
                break;
            }
        }

        return ret;
    };

    var _compress0 = function(dir){
        var dims = this.dims[dir], i, len, dim;
        for(i=0, len=dims.length; i<len; i++){
            dim = dims[i];
            if(dim.measure !=0) continue;
            _removeDim.call(this, dim, true, dir);
            len -= 1;
        }
    };

    var mapIndex = function(map, dims, from){
        for(var i=from, len=dims.length; i<len; i++){
            map[dims[i].uuid] = i;
        }
    };

    thi$.rowNum = function(){
        return this.dims[YD].length;
    };

    thi$.colNum = function(){
        return this.dims[XD].length;
    };

    thi$.row = function(index){
        return this.dims[YD][index];
    };

    thi$.col = function(index){
        return this.dims[XD][index];
    };

    thi$.column = function(index){
        return this.col(index);
    };
    
    thi$.insertRow = function(index, def, keeplayout){
        var dims = this.dims[YD];
        _insertDim.call(this ,_makeDim.call(this, def, YD),
                        [dims[index], dims[index+1]],
                        keeplayout, YD);
    };

    thi$.insertCol = function(index, def, keeplayout){
        var dims = this.dims[XD];
        _insertDim.call(this, _makeDim.call(this, def, XD),
                        [dims[index], dims[index+1]],
                        keeplayout, XD);
    };

    thi$.removeRow = function(index, keeplayout){
        _removeDim.call(this, this.dims[YD][index], keeplayout, YD);
    };

    thi$.removeCol = function(index, keeplayout){
        _removeDim.call(this, this.dims[XD][index], keeplayout, XD);
    };

    thi$.moveDim = function(id, offset, dir){
        var dims = this.dims[dir], dim, oidx, nidx,  
            measure, to, cells = _allCells.call(this);

        oidx = _id2idx.call(this, id);
        dim = dims[oidx];

        // remove the dim
        _shiftDim.call(this, dim, to, true, dir);

        // insert the dim to new position
        to =  _position2dims.call(this, offset, dir);
        if(to.length === 1){
            to[1] = dims[oidx];
            measure = to[0].measure;
        }else{
            offset = Math.round(offset);
            measure = to[1] ? to[1].offset - offset :
                to[0].offset + to[0].measure - offset;
        }
        dim.measure = measure;
        dim.weight = measure/dims.total;
        _shiftDim.call(this, dim, to, true, dir);
        nidx = _id2idx.call(this, dim.uuid);

        // adjust all cells
        if(nidx != oidx){
            _adjustCells.call(this, cells, oidx, nidx, dir);
        }

        // remove dims which measure == 0
        _compress0.call(this, dir);
    };

    //// Cells /////////////////////////////////////////////////////////
    var _getCell = function(x, y, def){
        var dims = this.dims, Xs = dims[XD], Ys = dims[YD],
            id, cell, range, rspan, cspan;

        if(x >= Xs.length || y >= Ys.length)
            return null;

        id = cellid(Xs[x].uuid, Ys[y].uuid);
        cell = _updateCell.call(this, this.cells[id], id);
        
        if(!cell && _merged.call(this, x, y)) return null;

        if(!cell){
            def = def || {};
            rspan = def.rowSpan || 1;
            cspan = def.colSpan || 1;

            cell = _updateCell.call(this,{
                uuid: id,
                range:[x, y, x+cspan, y+rspan]
            }, id);
        }

        return cell;
    };

    var _updateCell = function(cell, id){
        var dims = this.dims, Xs = dims[XD], Ys = dims[YD],
            cells = this.cells, range, x0, y0,rspan, cspan;

        if(!cell) return cell;

        if(cells[cell.uuid]){
            delete cells[cell.uuid];
        }
        
        range = cell.range;
        x0 = range[X0]; y0 = range[Y0];
        id = id || cellid(Xs[x0].uuid, Ys[y0].uuid);        
        cell.uuid = id;
        cell.visible = _visible.call(this, range);
        // Only the cells which rowSpan > 1 or colSpan > 1 will
        // be stored in this.cells.
        rspan = range[Y1] - y0;
        cspan = range[X1] - x0;
        if(rspan !=0 && cspan != 0 && (rspan > 1 || cspan > 1)){
            cells[id] = cell;
        }
        return cell;
    };

    var _initCells = function(cellDefs){
        var cell, def, x, y, i, len;

        if(!Class.isArray(cellDefs)) return;

        for(i=0, len=cellDefs.length; i<len; i++){
            def = cellDefs[i];
            x = def.colIndex; y = def.rowIndex;
            cell = _getCell.call(this, x, y, def);
            if(!cell){
                throw new Error(
                    ["Grid cell[",y,",",x,"] define error."].join(""));
            }
        }
    };

    var _layoutCell = function(cell, dir){
        var bounds = cell.bounds = (cell.bounds || []),
            end = dir+END, range = cell.range, 
            idx0 = range[dir], idx1 = range[end],
            offset = -1, measure = 0, span, dims, dim, i;

        dims = this.dims[dir];
        span = idx1 - idx0;
        for(i=0; i<span; i++){
            dim = dims[idx0+i];
            if(dim.visible){
                if(offset < 0 ){
                    offset = dim.offset;
                }
                measure += dim.measure;
            }
        }
        bounds[dir] = offset;
        bounds[end] = offset + measure;

        if(dir === XD){
            cell.x = offset;
            cell.width = measure;
            cell.colSpan = span;
        }else{
            cell.y = offset;
            cell.height= measure;
            cell.rowSpan = span;
        }

        return cell;
    };

    var cellid = function(x, y){ return [y, x].join(":");};
    
    var _merged = function(x, y){
        var cells = this.cells, id, cell, r, ret = false;

        for(id in cells){
            cell = cells[id];
            r = cell.range;
            if(x >= r[X0] && x < r[X1] &&
                    y >= r[Y0] && y < r[Y1]){
                ret = true;
                break;
            }
        }

        return ret;
    };

    var _visible = function(r){
        var dims = this.dims, Xs = dims[XD], Ys = dims[YD],
            x, xlen, y, ylen, visible = false;

        for(y=r[Y0], ylen=r[Y1]; y<ylen; y++){
            for(x=r[X0], xlen=r[X1]; x<xlen; x++){
                visible = visible || (Xs[x].visible && Ys[y].visible);
            }
        }

        return visible;
    };

    thi$.cell = function(rowIndex, colIndex){
        var cell = _getCell.call(this, colIndex, rowIndex),
            lastlayout=this.lastlayout, cache;

        if(cell && Class.isNumber(lastlayout)){
            cache = this.cellcache;
            if(lastlayout != cache.lastlayout){
                cache = this.cellcache = {};
                cache.lastlayout = lastlayout;
            }

            if(!cache[cell.uuid]){
                _layoutCell.call(this, cell, XD);
                _layoutCell.call(this, cell, YD);
                cache[cell.uuid] = cell;
            }else{
                cell = cache[cell.uuid];
            }
        }

        return cell;
    };

    thi$.getCellById = function(id){
        var ids = id.split(":");
        return this.cell(_id2idx.call(this, ids[0]),
            _id2idx.call(this, ids[1]));
    };

    thi$.getCellByPosition = function(x, y){
        var xs = _position2dims.call(this, x, XD),
            ys = _position2dims.call(this, y, YD);
        return this.cell(_id2idx.call(this, ys[0].uuid),
            _id2idx.call(this, xs[0].uuid));
    };

    var _allCells = function(){
        var i, ilen, j, jlen, cell, ret = [];
        for(i=0, ilen=this.rowNum(); i<ilen; i++){
            for(j=0, jlen=this.colNum(); j<jlen; j++){
                cell = _getCell.call(this, j, i);
                if(cell){
                    ret.push(cell);
                }
            }
        }
        return ret;
    };
    
    thi$.getAllCells = function(){
        var i, ilen, j, jlen, cell, ret = [];
        for(i=0, ilen=this.rowNum(); i<ilen; i++){
            for(j=0, jlen=this.colNum(); j<jlen; j++){
                cell = this.cell(i, j);
                if(cell){
                    ret.push(cell);
                }
            }
        }
        return ret;
    };

    var zorder = function(r){
        return r[YD] << 16 + r[XD];
    };

    var area = function(r){
        return (r[X1]-r[X0]) * (r[Y1]-r[Y1]);
    };

    var _byZ = function(c1, c2){
        var z = zorder, $ = this;
        return z(c1.range) - z(c2.range);
    };

    thi$.canMerge = function(cell, cells){
        var R = [0,0,0,0], r, i, len, s=0;

        cells = cells.concat(cell);
        cells.sort(_byZ.$bind(this));

        for(i=0, len=cells.length; i<len; i++){
            cell = cells[i];
            r = cell.range;

            if(i === 0){
                R[X0] = r[X0]; R[Y0] = r[Y0];
            }else if(i === len - 1){
                R[X1] = r[X1]; R[Y1] = r[Y1];
            }
            
            s += area(r);
        }
        
        return s === area(R);
    };

    thi$.merge = function(cells){
        var r, x0, y0, x1, y1, i, len,
            gcells, cell, id;

        if(cells.length == 0) return null;

        gcells = this.cells; 
        cells.sort(_byZ.$bind(this));
        
        for(i=0, len=cells.length; i<len; i++){
            cell = cells[i];
            r = cell.range;

            if(i === 0){
                x0 = r[X0]; y0 = r[Y0];
            }else if(i === len - 1){
                x1 = r[X1]; y1 = r[Y1];
            }
            
            id = cell.uuid;
            delete gcells[id];
        }

        cell = _getCell.call(
            this, x0, y0, {rowSpan: (y1-y0), colSpan:(x1-x0)});

        this.setDirty(true, DIRTY[CS]);

        return cell;
    };
    
    thi$.canUnMerge = function(cell){
        var r = cell.range;
        return (r[Y1]-r[Y0] > 1) || (r[X1]-r[X0] > 1);
    };

    thi$.unmerge = function(cell){
        if(!this.canUnMerge(cell)) return;

        var id = cell.uuid;
        delete this.cells[id];

        this.setDirty(true, DIRTY[CS]);
    };

    thi$.splitCell = function(cell, rowNum, colNum){
        if(rowNum < 2 && colNum < 2) return;

        var dims = this.dims, Xs = dims[XD], Ys = dims[YD],
            range = cell.range, cb = cell.bounds,
            x0 = range[X0], y0 = range[Y0],
            G = new CLASS({rowNum: rowNum, colNum: colNum}),
            cells, from;

        // prepare a sub grid
        G.row(0).uuid = Ys[y0].uuid;
        G.col(0).uuid = Xs[x0].uuid;
        G.setDirty(true, DIRTY[XD|YD]);
        G.layout(cb[X0], cb[Y0], cb[X1]-cb[X0], cb[Y1]-cb[Y0]);

        // split cell with sub grid
        _splitDims.call(this, G, XD);
        _splitDims.call(this, G, YD);

        // add sub cells
        cells = G.getAllCells();
        while(cells.length > 0){
            cell  = cells.shift();
            range = cell.range;

            from = _id2idx.call(this, G.col(range[X0]).uuid);
            _addSubCell.call(this, cell, from, XD);

            from = _id2idx.call(this, G.row(range[Y0]).uuid);
            _addSubCell.call(this, cell, from, YD);

            cell.uuid = cellid(Xs[range[X0]].uuid, Ys[range[Y0]].uuid);
            _updateCell.call(this, cell, cell.uuid);
        }
        
        this.setDirty(true, DIRTY[CS]);
    };

    var _addSubCell = function(cell, from, dir){
        var dims = this.dims[dir], end = dir+END,
            range, bounds, dim, i, len, delta, f;

        range = cell.range;
        bounds= cell.bounds;
        delta = bounds[end] - this.snapdelta;
        range[dir] = from;
        for(i=range[dir], len=dims.length; i<len; i++){
            dim = dims[i];
            range[end] = i;
            if(dim.offset >= delta){
                f = true;
                break;
            }
        }
        if(!f){
            range[end] += 1;
        }
    }

    var _splitDims = function(G, dir){
        var dims = G.dims[dir], dim, i, len, to, measure;
        
        for(i=1, len=dims.length; i<len; i++){
            dim = dims[i];
            to = _position2dims.call(this, dim.offset, dir);
            if(to.length === 1){
                dim.uuid = to[0].uuid;
                measure = dim.measure;
            }else{
                if(to[1]){
                    measure = to[1].offset-dim.offset;
                }else{
                    measure = (len-i)*dim.measure;
                }
            }

            dim = _makeDim.call(
                this, {uuid: dim.uuid, measure: measure}, dir);
            _insertDim.call(this, dim, to, true, dir);
        }
    };

    //// Lines /////////////////////////////////////////////////////////
    var _getAllLines = function(){
        var mapX={}, mapY={}, cells = this.getAllCells();

        while(cells.length > 0){
            _cellLine.call(this, cells.shift(), mapX, mapY);
        }
        return [
            _dimLines.call(this, [], mapX, XD),
            _dimLines.call(this, [], mapY, YD)];
    };

    var _cellLine = function(cell, xmap, ymap){
        var dims = this.dims, Xs = dims[XD], Ys = dims[YD],
            idx = cell.range[X0], idy = cell.range[Y0],
            xid = Xs[idx].uuid, yid = Ys[idy].uuid,
            xlines = xmap[xid] = (xmap[xid] || []),
            ylines = ymap[yid] = (ymap[yid] || []),
            cb = cell.bounds;

        xlines.push({
            id: xid, dir: XD, edge: idx === 0 ? 1 : 0,
            bounds:[cb[X0],cb[Y0],cb[X0],cb[Y1]]
        });

        ylines.push({
            id: yid, dir: YD, edge: idy === 0 ? 1 : 0,
            bounds:[cb[X0],cb[Y0],cb[X1],cb[Y0]]
        });
    };

    var _dimLines = function(lines, map, dir){
        var dims = this.dims, Xs = dims[XD], Ys = dims[YD],
            x0, y0, x1, y1, k, i, len, line;

        for(k in map){
            lines = lines.concat(mergeLines(map[k], dir));
        }

        x0 = Xs[0].offset; y0 = Ys[0].offset;
        x1 = Xs[Xs.length-1]; x1 = x1.offset + x1.measure;
        y1 = Ys[Ys.length-1]; y1 = y1.offset + y1.measure;

        if(dir === XD){
            lines.push({id: "Xn", edge: 1, dir: XD,
                bounds:[x1, y0, x1, y1]});
        }else{
            lines.push({id: "Yn", edge: 1, dir: YD,
                bounds:[x0, y1, x1, y1]});
        }

        lines.sort(byLinePostion[dir]);
        return _minmaxRange.call(this, lines, dir);
    };

    var _minmaxRange = function(lines, dir){
        var dims = this.dims[dir], idx, i, len, line,
            eCells, sCells, cell, bounds;
        for(i=0, len=lines.length; i<len; i++){
            line = lines[i];
            if(line.edge) continue;

            idx = _id2idx.call(this, line.id);
            eCells = sortCells(
                _releatedCells.call(this, END,   idx, dir), END,   dir);
            cell = eCells[eCells.length-1];
            bounds = cell.bounds;
            line.minX = bounds[X0];
            line.minY = bounds[Y0];

            sCells = sortCells(
                _releatedCells.call(this, START, idx, dir), START, dir);
            cell = sCells[0];
            bounds = cell.bounds;
            line.maxX = bounds[X1];
            line.maxY = bounds[Y1];
        }
        return lines;
    }

    var _releatedCells = function(start, idx, dir){
        var dims = this.dims[dir], p = dir+start,
            i, j, len, x, y, cell, ret=[],
            from = (start === START) ? idx : 0;

        for(i=0, len=this.dims[dir^1].length; i<len; i++){
            for(j=from; j<=idx; j++){
                x = i; y = j;
                if(dir === YD){
                    // swap x and y index
                    x = x ^ y; y = x ^ y; x = x ^ y;
                }
                cell = this.cell(x, y);
                if(cell && cell.range[p] === idx){
                    ret.push(cell);
                }
            }
        }
        return ret;
    };

    var sortCells = function(cells, start, dir){
        cells.sort(byCellPosition[(start | dir)]);
        return cells;
    };

    var byCellPosition = [
        function(c1, c2){return (c1.bounds[X1]) - (c2.bounds[X1]);},
        function(c1, c2){return (c1.bounds[Y1]) - (c2.bounds[Y1]);},
        function(c1, c2){return c1.bounds[X0] - c2.bounds[X0];},
        function(c1, c2){return c1.bounds[Y0] - c2.bounds[Y0];}];

    var byLinePostion = [
        function(l1, l2){return l1.bounds[X0]-l2.bounds[X0];},
        function(l1, l2){return l1.bounds[Y0]-l2.bounds[Y0];}
    ];
    
    var mergeLines = function(lines, dir){
        var ret = [], odir = dir^1, oend = odir+END, count = 0,
            line0, line1;

        lines.sort(byLinePostion[odir]);
        line0 = lines.shift();
        line0.id = [line0.id, count++].join("-");
        ret.push(line0);
        while(lines.length > 0){
            line1 = lines.shift();
            if(line0.bounds[oend] === line1.bounds[odir]){
                line0.bounds[oend] = line1.bounds[oend];
            }else{
                line0 = line1;
                line0.id = [line0.id, count++].join("-");
                ret.push(line0);
            }
        }
        return ret;
    };

    thi$.getAllLines = function(){
        var lastlayout=this.lastlayout, cache, ret;

        if(Class.isNumber(lastlayout)){
            cache = this.linecache = (this.linecache || {});
            if(lastlayout != cache.lastlayout){
                cache = this.linecache = {};
                cache.lastlayout = lastlayout;
            }
            if(!cache.lines){
                cache.lines = _getAllLines.call(this);
            }
            ret = cache.lines;
        }

        return ret;
    };

    //// Layout ////////////////////////////////////////////////////////
    thi$.setDirty = function(b, mask){
        var v = this.state;
        this.state = b ? (v | mask) : (v & ~mask);
        if(b && this.state != 0){
            this.update();
        }
    };
    
    var notifyPeer = function(peer, msg){
        if(peer && Class.isFunction(peer.uuid)){
            J$VM.MQ.post(CLASS.MSG_CHANGED, msg, [peer.uuid()]);
        }
    };

    thi$.isDirty = function(mask){
        return (this.state & mask) != 0;
    };

    thi$.update = function(){
        var dims = this.dims, Xs = dims[XD], Ys = dims[YD];
        return this.layout(Xs.base, Ys.base, Xs.total, Ys.total);
    };
    
    thi$.layout = function(xbase, ybase, width, height){
        if(!Class.isNumber(xbase) || !Class.isNumber(ybase) ||
               !Class.isNumber(width) || !Class.isNumber(height)) {
            return false;
        }

        var dims = this.dims, Xs = dims[XD], Ys = dims[YD],
            relayout=false;
        
        if(this.isDirty(DIRTY[XD]|DIRTY[YD])){
            this.dimp = {};
            mapIndex(this.dimap, Xs, 0);
            mapIndex(this.dimap, Ys, 0);
        }

        if(this.isDirty(DIRTY[XD]) ||
           xbase != Xs.base || width != Xs.total){
            _layoutDims.call(this, xbase, width, XD);
            relayout = true;
        }

        if(this.isDirty(DIRTY[YD]) ||
           ybase != Ys.base || height != Ys.total){
            _layoutDims.call(this, ybase, height, YD);
            relayout = true;   
        }

        if(this.isDirty(DIRTY[CS])){
            this.setDirty(false, DIRTY[CS]);
            relayout = true;
        }

        if(relayout){
            this.lastlayout = (new Date()).getTime();
            notifyPeer(this.peer,{type:"layout"});
        }
        
        return relayout;
    };

    thi$.setPeerComponent = function(peer){
        this.peer = peer;
    };

    thi$.getLayoutBounds = function(){
        var dims = this.dims, Xs = dims[XD], Ys = dims[YD];
        return { x: Xs.base, y:Ys.base,
            width: Xs.total, height: Ys.total
        };
    };

    thi$.destroy = function(){
        this.dims = null;
        this.dimap= null;
        this.cells= null;
        this.cellcache = null;
        this.linecache = null;
        this.def_cellsize = null;
        this.min_cellsize = null;
        this.peer = null;
        arguments.callee.__super__.apply(this, arguments);
    }.$override(this.destroy);

    thi$._init = function(def){
        def = def || {};
        //    0     0      0    0
        // layout  cell   cols rows 
        this.state = 0x07; // dirty flag
        // When forlayout = false, this grid works like execl sheet.
        var forlayout =this.forlayout = Class.isBoolean(def.forlayout) ?
            def.forlayout : true;

        this.def_cellsize = [def.colsize || 80, def.rowsize || 20];
        this.min_cellsize = [def.mincol || 5, def.minrow || 5];
        this.snapdelta = def.snapdelta || 3;

        var dims = this.dims = [null, null];
        this.dimap = {}; // dimId: dimIndex

        var m=def.rowNum, n=def.colNum;
        n = Class.isNumber(n) ? (n > 0 ? n : 1) : 1;
        dims[XD] = new Array(n);
        _initDims.call(this, def.cols, XD);

        m = Class.isNumber(m) ? (m > 0 ? m : 1) : 1;
        dims[YD] = new Array(m);
        _initDims.call(this, def.rows, YD);

        this.cells = {}; this.cellcache = {};
        _initCells.call(this, def.cells);
    };
    
    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);
