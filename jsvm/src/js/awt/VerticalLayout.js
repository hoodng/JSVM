$package("js.awt");
$import("js.awt.LayoutManager");

js.awt.VerticalLayout = function (def){
	var Class=js.lang.Class,Event=js.util.Event,DOM=J$VM.DOM,System=J$VM.System;
	var CLASS=js.awt.VerticalLayout,thi$=CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	var LinkedList=Class.forName("js.util.LinkedList");
	thi$._init = function(def){
	}.$override(this._init);
	thi$.layoutContainer = function(container, force){
		var bounds=container.getBounds();
		var MBP=bounds.MBP;
		var startX=MBP.paddingLeft;//MBP.borderLeftWidth
		var startY=MBP.paddingTop;//MBP.borderTopWidth+
//		var startX = 0;
//		var startY = 0;
		var innerWidth=bounds.innerWidth;
		var innerHeight=bounds.innerHeight;
		
		this.refresh(container,startX,startY,innerWidth,innerHeight,container._local.def.padding,container._local.defaultCellObjectRefresh);
	}.$override(this.layoutContainer);
	this._init.apply(this, arguments);

//-------------------------------------------------------------------------------------------------------
	thi$.plan=function(container,startX,startY,cw,ch,padding){
		var size=container._local.children.length;
		var lo=container._local.def;
		var cells=container._local.cells;
		var padding=padding||0;
		var total=(lo.horizontal?cw:ch)-padding*2;
		var totalSpace=0;
		var i;
		var cell;
		var p=padding;
		var s;
		var cellObject;
		
		for(i=0;i<size;++i){
			cell=cells[i];
			if(typeof cell.space=="string"){
				total-=parseInt(cell.space);
			}else{
				if(cell.space>0){
					totalSpace+=cell.space;
				}else{
					
				}
			}
		}
		for(i=0;i<size;++i){
			cell=cells[i];
			if(typeof cell.space =="string"){
				s=parseInt(cell.space);
			}else{
				if(cell.space>0){
					s=Math.floor(total*(cell.space/totalSpace));
				}else{
					cell.invisible=true;
					continue;
				}
			}
			cell.invisible=false;
			if(lo.horizontal){
				cell.height=ch-2*cell.padding-padding*2;
				cell.top=startX+0+cell.padding+padding;
				cell.left=startY+p+cell.padding;
				cell.width=s-2*cell.padding;
			}else{
				cell.width=cw-2*cell.padding-padding*2;
				cell.left=startX+cell.padding+padding;
				cell.top=startY+p+cell.padding;
				cell.height=s-2*cell.padding;
			}
			p+=Math.floor(s);
		}
	};
	thi$.place=function(container,defaultCellObjectRefresh){
		if(defaultCellObjectRefresh){
			var cells=container._local.cells;
			var i;
			var cell;
			var nextScalableCell;
			var j;
			for(i=0;i<cells.length;++i){
				cell=cells[i];
				nextScalableCell=null;
				j=i+1;
				while(j<cells.length){
					if(typeof cells[j].space=="number"){
						if(cells[j].space>0){
							nextScalableCell=cells[j];
							break;
						}
					}
					j++;
				}
				defaultCellObjectRefresh(cell,nextScalableCell,i);
			}
		}
	};
	thi$.refresh=function(container,startX,startY,cw,ch,padding,defaultCellObjectRefresh){
		this.plan(container,startX,startY,cw,ch,padding);
		this.place(container,defaultCellObjectRefresh);
	};
}.$extend(js.awt.LayoutManager);

