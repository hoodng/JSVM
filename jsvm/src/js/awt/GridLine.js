/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * @File: GridLine.js
 * @Create: 2013/02/07 03:09:07
 * @Author: mingfa.pan@china.jinfonet.com
 */

$package("js.awt");
$import("js.awt.Grid");

js.awt.GridLine = function(){
	var CLASS = js.awt.GridLine,
	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, System = J$VM.System;

	/**
	 * Return the grid used by the subclass. Subclas must implement
	 * this method to return the right grid object.
	 * 
	 * @return {js.awt.Grid}
	 */	   
	thi$.getGrid = function(){
		return undefined;  
	};
	
	thi$.lineThinkness = function(thinkness){
		if(!isNaN(thinkness)){
			this._local.lineThinkness = thinkness;
		}
		
		return this._local.lineThinkness || 3;
	};
	
	/**
	 * Show and hide all GridLines.
	 */
	thi$.showGridLines = function(b, lineDef){
		var grid = this.getGrid();
		if(grid && Class.isFunction(grid.getLineMatrixes)){
			if(b){
				_createGridLines.call(this, grid, lineDef || {});
			}else{
				_removeGridLines.call(this);
			}
		}
	};

	var _creatLine = function(def, x, y, w, h, isV, m){
		var styleClass = def.className 
			|| ((def.prefixClass || this.className) + (isV ? "_vline" : "_hline")),
		lineDef = {
			classType: def.classType || "js.awt.HotSpotLine",
			className: styleClass,
			
			x: x, y: y,
			width: w, height: h,
			
			stateless: true,
			isVirtical: isV,
			
			movable: def.movable === true,
			model: m
		}, mover;
		
		if(lineDef.movable){
			mover = lineDef.mover = def.mover || {};
			mover.freedom = isV ? 1 : 2;
		}
		
		return new (Class.forName(lineDef.classType))(lineDef, this.Runtime());
	};
	
	var _createGridLines = function(grid, def){
		var lineMatrixes = grid.getLineMatrixes(),
		hlines = lineMatrixes.hlines, 
		vlines = lineMatrixes.vlines,
		lines = this._local.gridLines = [],
		frag = document.createDocumentFragment(),
		thinkness = this.lineThinkness(),
		delta = thinkness / 2,
		isClosed = (def.closed !== false),
		matrix, xs, ys, x, y, w, h, area, i, len;
		
		// Draw horizontal lines
		i = isClosed ? 0 : 1;
		len = isClosed ? hlines.length : hlines.length - 1;
		for(; i < len; i++){
			matrix = hlines[i];
			y = matrix.y - delta;
			xs = matrix.xs;

			for(var j = 0, n = xs.length; j < n; j++){
				area = xs[j];
				if(area){
					x = area.x0;
					w = area.x1 - x;
					h = thinkness;
					line = _creatLine.call(this, def, x, y, w, h, false, {index: i});
					line.setMovable(true);
					line.setPeerComponent(this);
					line.appendTo(frag);
					
					lines.push(line);
				}
			}
		}
		
		i = isClosed ? 0 : 1;
		len = isClosed ? vlines.length : vlines.length - 1;
		for(; i < len; i++){
			matrix = vlines[i];
			x = matrix.x - delta;
			ys = matrix.ys;

			for(var j = 0, n = ys.length; j < n; j++){
				area = ys[j];
				if(area){
					y = area.y0;
					w = thinkness;
					h = area.y1 - y;
					line = _creatLine.call(this, def, x, y, w, h, true, {index: i});
					line.setMovable(true);
					line.setPeerComponent(this);
					line.appendTo(frag);
					
					lines.push(line);
				}
			}
		}
		
		this.view.appendChild(frag);
	};

	var _removeGridLines = function(){
		var lines = this._local.gridLines, 
		len = lines ? lines.length : 0, line;
		
		for(var i = 0; i < len; i++){
			line = lines[i];
			// line.removeFrom(container.view);				   
			line.destroy();
		}
	};
};
