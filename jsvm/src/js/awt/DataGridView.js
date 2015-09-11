/**
 * @File DataGridView.js
 * @Create 2012-08-31
 * @author fengbo.wang@china.jinfonet.com
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

js.awt.DataGridRowCell = function (def, Runtime) {
	var CLASS = js.awt.DataGridRowCell, thi$ = CLASS.prototype;
	if (CLASS.__defined__) {
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
    var Class = js.lang.Class,DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ;
	
	thi$.destroy = function() {
        MQ.cancel("js.awt.event.ButtonEvent",this,_mouseup);
        var ele = this.ele;
        if(Class.isHtmlElement(ele)){
            DOM.remove(ele, true);
        }else if(ele && typeof ele.destroy == "function"){
            ele.destroy(true);
        }
        delete this.ele;
        $super(this);
	}.$override(this.destroy);

    var _mouseup=function(e){
        var m=e.getEventTarget()||"",type = e.getType()||"";
        if(type != "mouseup"){
            return;
        }
        if(!this.type)
            MQ.post("headCheckValueChange",{colindex:m.id.split(/\D+/g)[1],value:m.isMarked()},this);
        else
            MQ.post("rowCheckValueChange",{id:m.id,value:m.isMarked()},this);
    };

    thi$.onResized=function(e){
        var peer=this.getPeerComponent();
        var cells=peer.cells;
        var index=this.def.index;
        var w=this.getBounds().width;
        var row_w=peer.head.getWidth();
        if(cells.length>0){
            var d=w-cells[0][index].getWidth();
            for(var i in cells){
                cells[i][index].setWidth(w);
                cells[i][index].def.prefSize=undefined;
            }
            this.def.prefSize=undefined;
            peer.setWidth(peer.getWidth()+d,7);
            System.err.println("newWidth:"+(row_w+d));
        }
    }.$override(this.onResized);

    var _createHeadElement = function (def) {
        def.text = def.text || "Column";this.type=0;
        var cType = def.cType, ele;
        switch (cType) {
            case "check":
                ele = new js.awt.CheckBox({id:def.id,
                    layout:{align_x:0.5,align_y:0.5}});
                ele.setPeerComponent(this);
                this.addComponent(ele);
                break;
            default :
                ele=DOM.createElement("span");
                ele.innerHTML=def.text;
                ele.style.cssText="padding:0px 5px 0px 5px;";
                DOM.appendTo(ele,this.view);
                break;
        }
        this.ele=ele;
    };

    var _createNormalElement=function(def){
        var cType=def.cType,ele;this.type=1;
        def.text=((def.text===""||def.text===undefined)?"Null":def.text);
        switch (cType){
            case "check":
                ele=new js.awt.CheckBox({id:def.id,
                    layout:{align_x:0.5,align_y:0.5}});
                var v=Class.isBoolean(def.text)?def.text:false;
                ele.setPeerComponent(this);
                ele.mark(v);
                this.addComponent(ele);
                break;
            case "color":
                ele=DOM.createElement("DIV");
                var c=def.text?"background-color:"+def.text+";":"";
                ele.style.cssText="border:1px solid #ccc;width:10px;height:10px;position:absolute;"+c;
                DOM.appendTo(ele,this.view);
                break;
            case "money":
                break;
            default :
                ele=DOM.createElement("SPAN");
                ele.innerHTML=def.text;
                ele.style.cssText="padding:0px 5px 0px 5px;";
                DOM.appendTo(ele,this.view);
                break;
        }
        this.ele=ele;
    };

    thi$.setValue=function(value){
        var cType=this.def.cType||"",ele;
        switch (cType){
            case "check":
                var v=Class.isBoolean(value)?value:false;
                this.ele.mark(v);
                break;
            case "color":
                this.ele.style.backgroundColor=value;
                break;
            case "money":
                break;
            default :
                this.ele.innerHTML=value;
                break;
        }
    };

    thi$.getValue=function(){
        var cType=this.def.cType||"",ele;
        switch (cType){
            case "check":
                return this.ele.isMarked();
            case "color":
                return this.ele.style.backgroundColor;
            case "money":
                break;
            default :
                return this.ele.innerHTML;
        }
    };

    thi$.doLayout=function(e){
        if($super(this)){
            this.view.style.lineHeight = DOM.innerHeight(this.view) + "px";
            if(this.def.cType==="color" && this.ele){
                var bounds = this.getBounds(),
                w = bounds.width,h=bounds.height,
                x=parseInt((w-12)/2),y=parseInt((h-12)/2);
                this.ele.style.top=y + "px";
                this.ele.style.left = x+ "px";
            }
            return true;
        }
        return false;
    }.$override(this.doLayout);

	thi$._init = function(def, Runtime) {
		if (def === undefined) return;
		def.classType = def.classType || " js.awt.DataGridRowCell";
		def.className = def.className || "jsvm_DataGridRowCell";
        def.cType=def.cType||"string";
        def.layout={
            classType:"js.awt.BorderLayout",
            align_x:0.5
        };
		$super(this);
        if(def.id.indexOf("dgv_head")>=0)
            _createHeadElement.$bind(this).call(this,def);
        else
            _createNormalElement.$bind(this).call(this,def);

        MQ.register("js.awt.event.ButtonEvent",this,_mouseup);
	}.$override(this._init);

	this._init.apply(this, arguments);
}.$extend(js.awt.Container);

js.awt.DataGridRow=function(def, Runtime) {
	var CLASS = js.awt.DataGridRow, thi$ = CLASS.prototype;
	if (CLASS.__defined__) {
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
    var System = J$VM.System;

	thi$._init = function(def, Runtime) {
		if (def === undefined) return;
		def.classType = def.classType || " js.awt.DataGridRow";
		def.className = def.className || "jsvm_datagridrow";
		def.layout={
			gap: 0,
			align_x : 0.0,
			align_y : 0.5
		};
		$super(this);
	}.$override(this._init);

    thi$.doLayout=function(e){
        if($super(this)){
//            System.err.println("row"+this.getBounds().width);
//            var all=this.getAllComponents();
//            for (var i in all)
//                System.out.println("col"+i+":"+all[i].getBounds().width);
            return true;
        }
        return false;
    }.$override(this.doLayout);

	this._init.apply(this, arguments);
	
}.$extend(js.awt.HBox);


js.awt.DataGridRowHodler=function(def, Runtime) {
    var CLASS = js.awt.DataGridRowHodler, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    var Class = js.lang.Class, System = J$VM.System;

    thi$.destroy = function() {
        $super(this);
    }.$override(this.destroy);

    thi$.refresh=function(){
        this.doLayout(true);
    };

    thi$.doLayout=function(e){
        if($super(this)){
            var p=this.getPeerComponent();
            if(p.cells){
                var r= p.cells.length || 1,h=p.rows_h*r,max= p.def.height- p.head_h;
                if(p.def.autoSize){
                    p.view.style.height= (h+p.head_h) +"px";
                    this.view.style.height= h +"px";
                }else if(h> max){
                    this.view.style.height=max+"px";
//                    this.applyStyles({overflow:"hidden"});
//                    p.applyStyles({overflowX:"hidden",overflowY:"scroll"});
                }
            }else{
                this.view.style.height= p.rows_h + "px";
                p.view.style.height= p.def.height || (p.rows_h+ p.head_h +"px");
            }
            return true;
        }
        return false;
    }.$override(this.doLayout);

//    thi$.onResized=function(e){
//        var cells=this.getPeerComponent().cells;
//        for(var i in cells)
//            cells[i].setWidth(this.getBounds().width);
//        $super(this);
//    }.$override(this.onResized);

    thi$._init = function(def, Runtime) {
        if (def === undefined) def = {};
        def.classType = def.classType || " js.awt.DataGridRowHodler";
        def.className = def.className || "jsvm_datagridrowhodler";
        def.layout={
            gap: 0,
            align_x : 0,
            align_y : 0
        };
        $super(this);
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.VBox);

js.awt.DataGridView=function(def, Runtime,model) {
	var CLASS = js.awt.DataGridView, thi$ = CLASS.prototype;
	if (CLASS.__defined__) {
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ;
    var css="top:0px;left:0px;height:0px;width:3px;cursor: e-resize;position:absolute;";

	var _createHeads=function(model){
		var colType=js.awt.DataGridRowCell;
        this.heads=heads=[];
        this.dataFileNames=dataFileNames=[];
		for(var i in model.heads){
			var newDef=model[model.heads[i]];
            var x=newDef.align_x||0;
            var align="text-align:"+((x>0)?(x>0.5)?"right":"center":"left")+";";
            newDef.height=newDef.height||26;
			newDef.css="overflow:hidden;border:1px solid #ccc;"+align;
            newDef.id="dgv_head_"+i;
            newDef.index=i;
//            newDef.resizable=true;
            newDef.resizer=32;
			var hcell=new colType(newDef,this);
			this.head.addComponent(hcell);
            hcell.setPeerComponent(this);
            dataFileNames[newDef.dataFieldName||("Column"+i)]=i;
            heads.push(hcell);
		}
	};

    /*
     * can recive two type of the data : Double Dimensional Array  and JSON Array
     * Double Dimensional Array depends on the data order
     * JSON Array depends on the dataFileName of the head.
     * continue.....
     */
    thi$.addValues=function(values){
        var rows=this.cells,heads=this.heads,colType=js.awt.DataGridRowCell,rowType=js.awt.DataGridRow;
        if(Class.typeOf(values)==="array"){
            var type=Class.typeOf(values[0]);
            if(type==="array"){
                for(var i in values){
                    var cols=[],temp=values[i];
                    if(temp){
                        var row=new rowType({
                            className:"jsvm_datagridrow",
                            classType:"js.awt.DataGridRow",
                            rigid_w:false,
                            height:this.rows_h
                        },this);
                        for(var j in heads){
                            var x=heads[j].def.align_x|| 0,align="text-align:"+((x>0)?(x>0.5)?"right":"center":"left")+";";
                            var cell=new colType({
                                classType:"js.awt.DataGridRowCell",
                                text:Class.isValid(temp[j])?temp[j]:"Null",
                                css:this.gridLine+align,
                                id:"datacol"+(rows.length)+":"+j,
                                cType:heads[j].def.cType,
                                width:heads[j].def.width,
                                height:this.rows_h
                            },this);
                            cols.push(cell);
                            row.addComponent(cell);
                        }
                        rows.push(cols);
                        this.body.addComponent(row);
//                        row.setPeerComponent(this.body);
                    }
                }
                this.body.refresh();
            }else if(type==="object"){
                for(var i in values){
                    var cols=[],temp=values[i];
                    if(temp){
                        var row=new rowType({
                            className:"jsvm_datagridrow",
                            classType:"js.awt.DataGridRow",
                            rigid_w:false,
                            height:this.rows_h
                        },this);
                        for(var j in dataFileNames){
                            var cIndex=dataFileNames[j];
                            var x=heads[cIndex].def.align_x|| 0,align="text-align:"+((x>0)?(x>0.5)?"right":"center":"left")+";";
                            var cell=new colType({
                                classType:"js.awt.DataGridRowCell",
                                text:Class.isValid(temp[j])? temp[j]:"Null",
                                css:this.gridLine+align,
                                id:"datacol"+(rows.length)+":"+cIndex,
                                cType:heads[cIndex].def.cType,
                                width:heads[cIndex].def.width,
                                height:this.rows_h
                            },this);
                            cols.push(cell);
                            row.addComponent(cell);
                        }
                        rows.push(cols);
                        this.body.addComponent(row);
//                        row.setPeerComponent(this.body);
                    }
                }
                this.body.refresh();
            }
        }
    };

    thi$.addNewRow=function(value){
        var rows=this.cells;
        var heads=this.heads;
        var colType=js.awt.DataGridRowCell;
        var rowType=js.awt.DataGridRow;
        var cols=[];
        var row=new rowType({
            className:"jsvm_datagridrow",
            classType:"js.awt.DataGridRow",
            rigid_w:false,
            height:this.rows_h
        },this);
        for(var j in heads){
            var x=heads[j].def.align_x||0;
            var align="text-align:"+((x>0)?(x>0.5)?"right":"center":"left")+";";
            var cell=new colType({
                classType:"js.awt.DataGridRowCell",
                text:value?Class.isValid(value[j])?value[j]:"Null":"",
                css:this.gridLine+align,
                id:"datacol"+(rows.length)+":"+j,
                cType:heads[j].def.cType,
                width:heads[j].def.width,
                height:this.rows_h
            },this);
            cols.push(cell);
            row.addComponent(cell);
        }
        rows.push(cols);
        this.body.addComponent(row);
        this.body.refresh();
        return cols;
    };

    thi$.removeAllValues=function(){
        this.body.removeAll(true);
        this.cells.splice(0,this.cells.length);
    };

    thi$.refresh=function(){
        this.doLayout(true);
    };
	
	thi$.destroy = function() {
		delete this.cells;
        delete this.heads;
        delete this.dataFileNames;
        delete this.rows_h;
        delete this.head_h;
        MQ.cancel("headCheckValueChange",this,_checkValueChange);
        $super(this);
	}.$override(this.destroy);

    var _checkValueChange=function(e){
        var cells =this.cells;
        for(var i in cells){
            cells[i][e.colindex].setValue(e.value);
        }
    };

    thi$.doLayout=function (e){

        if($super(this)){
//            delete this.head.prefSize;
//            System.err.println(this.head.getPreferredSize().width);
            if(this.head){
                var total=0;
                for(var i in this.heads){
                    total+=this.heads[i].getBounds().width;
                }
                this.head.view.style.width=total+"px";
                this.body.view.style.width=total+"px";
                this.view.style.width=total+"px";
            }
            return true;
        }
        return false;
    }.$override(this.doLayout);

    var rt=null;
    var sw=0;
    var _colResizeStart=function (e){
//        this.head.doLayout(true);
        rt= e.getEventTarget();
        sw=rt.getBounds().width;
    };
    var _colResizeEnd=function (e){
        var ew=rt.getSizeObject().getWidth();
        System.err.println(ew-sw);
        var d=ew-sw;
        rt.def.prefSize=undefined;
        rt.setWidth(ew);
        this.head.setSize(this.head.getWidth()+d,this.head.getHeight());
        this.head.doLayout(true);
//        this.doLayout(true);
        rt=null;
    };

    var _checkRowValueChanged=function(data){
        var col=data.id.split(/\D+/g)[2];
        if(data.value){
            var allChecked=true;
            for(var i in this.cells){
                if(!this.cells[i][col].getValue()){
                    allChecked=false;
                    break;
                }
            }
            if(allChecked)
                this.heads[col].setValue(allChecked);
        }else if(this.heads[col].getValue()){
            this.heads[col].setValue(false);
        }
    }

    /*
     *  def is the description of the datagridview as normal .Spacial:{
     *      rows_h: the height of each row.
     *      head_h: the height of column header.
     *      showHead: as you know.
     *      showGridLine: the line of every cells but column header.
     *  }
     *  model is the description of the column header.
     *  model contains: {
     *      text : the text of head ;
     *      cType : the type of head , value like:[string](default),[color],[check];
     *      align_x : Horizontal Alignment , value like : [0](left,default),[0.5](center),[1](right)
     *      width : the width of the head,
     *      dataFieldName : if you want to append JSON object into the row which is depend on dataFieldName.
     *  }
     */

	thi$._init = function(def, Runtime,model) {
		if (def === undefined) return;
		def.classType = def.classType || " js.awt.DataGridView";
		def.className = def.className || "jsvm_datagridview";

		def.showHead=def.showHead||def.showHead === undefined;
        def.autoSize=def.autoSize||def.autoSize === undefined;

        this.model=model;
        this.rows_h=def.rows_h||20;
        this.head_h=def.head_h||26;

		def.layout={
			classType:"js.awt.BorderLayout"
		};
        def.items=["head","body"];
        def.head={
            classType:"js.awt.DataGridRow",
            constraints:"north",
            height:this.head_h,
            rigid_w:false,
            css:"background: url(/webos/style/default/images/title_background.png);"
        };
        def.body={
            classType:"js.awt.DataGridRowHodler",
            constraints:"center",
//            css:"border:1px solid blue;",
            width:def.width,
            rigid_w:false,
            rigid_h:true
        };
		$super(this);
        this.cells=[];
        this.h_gridLine=[];
        _createHeads.call(this,def.model);
		if(!def.showHead){
            this.head.setVisible(false);
            this.head.display(false);
        }
        this.gridLine=def.showGridLine?"border:1px solid #ccc;":"padding:1px;";
        this.body.setPeerComponent(this);
        MQ.register("headCheckValueChange",this,_checkValueChange);
        MQ.register("rowCheckValueChange",this,_checkRowValueChanged);
//        MQ.register(Event.SYS_EVT_RESIZED,this,_colResizeEnd.$bind(this));
//        MQ.register("js.awt.event.LayerEvent",this,_colResizeStart.$bind(this));
	}.$override(this._init);

	this._init.apply(this, arguments);
	
}.$extend(js.awt.Container);
 
