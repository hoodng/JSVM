
$package("js.awt");
js.awt.VerticalPanels=function(def,Runtime){
	var CLASS = js.awt.VerticalPanels;
	var thi$=CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	var Class=js.lang.Class,Event=js.util.Event,DOM=J$VM.DOM,System=J$VM.System,MQ=J$VM.MQ;
	var LinkedList=Class.forName("js.util.LinkedList");
	var HeaderSpace=60;
	var layoutDef={};
	
	//System.out.println("---1 Class:"+Class);
	var VerticalLayout=Class.forName("js.awt.VerticalLayout");
	//System.out.println("---2 "+VerticalLayout);
	var verticalLayoutManager=new VerticalLayout(layoutDef);
	//System.out.println("---3");
	
	// weight : default is 5 if do'nt set or <=0
	//
	var _onclick=function(e,btnRight,window0){
		//var btnRight=e.getEventTarget();
		var title=window0.title;
		//~ title.getSize()
		var titleHeight=title.getSize().height;
		var window0Height=window0.getSize().height;
		//alert("window0Height:"+window0Height+" titleHeight:"+titleHeight);
		var comp=window0._local.userComp;
		var idx=this._local.children.indexOf(comp);
		
		if(!btnRight._local.oldSpace){
			var oldSpace=this.setSpace(idx,""+titleHeight+"px");
			btnRight._local.oldSpace=oldSpace;
		}else{
			var oldSpace=btnRight._local.oldSpace;
			this.setSpace(idx,oldSpace);
			btnRight._local.oldSpace=null;
		}
		this.doLayout(true);
	};
	
	 thi$.get=function(idx){
		var c=this._local.cells[idx];
		return c;
	};
	thi$.setSpace=function(idx,space){
		var c=this.get(idx);
		var oldSpace=c.space;
		c.space=space;
		return oldSpace;
	};
	
	thi$._showHide=function(idx,hidden){
		var oldContext=this._local.oldContexts.get(idx);
		if(hidden){
			oldContext.oldSpace=this.setSpace(idx,0);
		}else{
			if(oldContext.oldSpace!=null){
				this.setSpace(idx,oldContext.oldSpace);
			}
			oldContext.oldSpace=null;
		}
	};
	thi$.show=function(idx){
		this._showHide(idx,false);
	};
	thi$.hide=function(idx){
		this._showHide(idx,true);
	};
	thi$.getViewComponentsSize=function(){
		return this._local.cells.length;
	};
	var createChildWindow=function(comp,titleText){
		var window0=new js.awt.Window({
			css:"background-color:white;border:0px solid #CCCCCC;",
			items:["title","client"],
			title:{
				css:"background-color:#DCDCDC;",
				classType: "js.awt.HBox",
				constraints:"north",
				hovershow: true,
				hovershowbutton: true,
				items:["btnRight","labTitle"],
				labTitle:{
					classType: "js.awt.Label",
					css:"padding: 0px 2px 0px 4px;",
					text:titleText
				},
				btnRight:{
					classType: "js.awt.Button",
					className: "jsvm_title_button",
					iconImage: "vpanels.png",
					toggle:true,
					effect:false
				}
			},
			client:{
				classType:"js.awt.Container",
				constraints:"center",
				layout:{
					classType:"js.awt.BoxLayout"
				},
				css:"padding:0px;"
			},
			movable:false,
			shadow:false
		},Runtime);
		var clientContainer=window0.client;
		var btnRight=window0.title.btnRight;
		
		window0.onbtnRight=_onclick.$bind(this,btnRight,window0);
		
		//btnRight.attachEvent("click",0, this, _onclick,btnRight,window0);
		
		comp.view.style.position="absolute";
		comp.view.style.width="100%";
		comp.view.style.height="100%";
		comp.view.style.left="0px";
		comp.view.style.top="0px";
		clientContainer.addComponent(comp,null);
		window0._local.userComp=comp;
		return window0;
	};

	thi$.addViewComponent=function(comp,weights,hasTitle,titleText){
		//System.out.println("layout add ...");
		var _comp;
		if(hasTitle){
			//_comp=createChildWindow(comp,titleText);
			_comp = createChildWindow.call(this, comp, titleText);
		}else{
			_comp=comp;
		}
		_comp.view.style.position = "absolute";
		
		this._local.children.push(comp);
		
		var cell={};
		if(weights==null){
			cell.space=5;
		}else{
			cell.space=weights;
		}
		//~ cell.space=weights&&weights>0?weights:5;
		cell.padding=0;
		cell.obj=_comp;
		var idx=this._local.cells.length;
		this._local.cells.push(cell);
		var oldMaxSize=null,oldMinSize=null;
		//try{
		//	oldMaxSize=_comp.getMaximumSize();
		//	oldMinSize=_comp.getMinimumSize();
		//}catch(e){}
		var oldContext={
			oldResizable:_comp.def.resizer,
			oldResizer:_comp.def.resizer,
			oldMaxSize:oldMaxSize,
			oldMinSize:oldMinSize,
			onResized:_comp.onResized,
			"hasTitle":hasTitle,
			"_comp":_comp
		};
		this._local.oldContexts.push(oldContext);
		this.addComponent(_comp,null);
		return idx;
	};

	thi$.removeViewComponent=function(comp){
		var idx=this._local.children.indexOf(comp);
		this._local.children.remove0(idx);
		this._local.cells.remove0(idx);
		var oldContext=this._local.oldContexts.remove0(idx);
		var _comp=oldContext._comp;
		_comp.setResizable(false);
		_comp.setResizable(oldContext.oldResizable,oldContext.oldResizer);
		_comp.addResizer();
		_comp.adjustResizer();
		//_comp.setMaximumSize(oldContext.oldMaxSize.width,oldContext.oldMaxSize.height);
		//_comp.setMinimumSize(oldContext.oldMinSize.width,oldContext.oldMinSize.height);
		_comp.onResized=oldContext.onResized;
		this.removeComponent(_comp);
		if(_comp.hasTitle){
			return _comp.client.removeComponent(comp);
		}else{
			return comp;
		}
	};

	CLASS.DEFAULTDEF={zorder:true};
	var getOnresized=function(comp,cell,nextScalableCell,vpanels,idx){
		return function(fire){
			var cellToHeight=comp.getBounds().height;
			var cellFromHeight=cell.height;
			var diffHeight=cellToHeight-cellFromHeight;
			var diffSpace=diffHeight*cell.space/cellFromHeight;
			cell.space+=diffSpace;
			nextScalableCell.space-=diffSpace;
			//var totalSpace=cell.space+nextCell.space;
			vpanels.doLayout(true);
			return false;
		};
	};
	thi$._init = function(def, Runtime){
		def=def||{};
		if(!def.css){
			def.css="";
		}
		if(def.css.indexOf("background-color")==-1){
			def.css["background-color"]="#C3C5C8";
		}
		
		def.zorder=true;
		def.movable=false;
		this._local=this._local||{};
		arguments.callee.__super__.apply(this, arguments);
		this.setLayoutManager(verticalLayoutManager);
		this._local.def={
			horizontal:false,
			padding:0
		};
		this._local.children=new LinkedList();
		this._local.cells=new LinkedList();
		this._local.oldContexts=new LinkedList();
		var vpanels=this;
		this._local.defaultCellObjectRefresh=function(cell,nextScalableCell,idx){
			//System.out.println("layout Plan comp:");
			var fire = 3;
			var comp=cell.obj;
			var oldContext=vpanels._local.oldContexts.get(idx);
			if(cell.invisible){
				comp.display(false);
				comp.onResized=null;
			}else{
				comp.display(true);
				comp.setResizable(false);
				//~ comp.setPosition(cell.left,cell.top, fire);
				//~ comp.setSize(cell.width,cell.height, fire);
				comp.onResized=oldContext.onResized;
				comp.setBounds(cell.left,cell.top,cell.width,cell.height, fire);
				//~ comp.doLayout(true);
				if(typeof cell.space=="number"&&nextScalableCell!=null){
					comp.setMaximumSize(null,cell.height+nextScalableCell.height-HeaderSpace);
					comp.setMinimumSize(null,HeaderSpace);
					//System.out.println("setResizable-----");
					comp.setResizable(true,8);
					comp.addResizer();
					comp.adjustResizer();
					comp.onResized=getOnresized(comp,cell,nextScalableCell,vpanels,idx);
				}else{
					//~ comp.onResized=oldContext.onResized;
				}
			}
		};
	}.$override(this._init);
	

	//~ thi$.getAllPanels = function(){
		//~ return this.getAllComponents();
	//~ };

	thi$.destroy=function(){
		this._local.children.clear();
		this._local.children=null;
		this._local.cells.clear();
		this._local.cells=null;
		this._local.oldContexts.clear();
		this._local.oldContexts=null;
		this._local.defaultCellObjectRefresh=null;
		arguments.callee.__super__.apply(this, arguments);
	}.$override(this.destroy);

	this._init.apply(this, arguments);
	
}.$extend(js.awt.Container);
