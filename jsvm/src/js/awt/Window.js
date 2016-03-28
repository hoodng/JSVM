/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.awt");

$import("js.awt.Container");

js.awt.Window = function (def, Runtime, view){

	var CLASS = js.awt.Window, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
	System = J$VM.System, MQ = J$VM.MQ,

	titleItemMap = {
		btnMin:	  {iconImage: "edit2.gif"},
		btnMax:	  {iconImage: "remove.gif"},
		btnClose: {iconImage: "sort2.png"}
	};
	
	var _getTitle = function(){
		return (this.title && this.title.labTitle) ? 
			this.title.labTitle : undefined;		
	};

	thi$.getTitle = function(){
		var title = _getTitle.call(this);
		return title ? title.getText() : null; 
	};
	
	thi$.setTitle = function(s){
		var title = _getTitle.call(this);
		if(title) title.setText(s, true);
	};
	
	thi$.isFloatTitle = function(){
		return (this.def.tstyle & 0x01) != 0;
	};
	
	/**
	 * Set Title style and Button style
	 * 
	 * @param tstyle: 0: Always show, 1: Never show, 3: Hover show
	 * @param bstyle: 0: Always show, 1: Never show, 3: Hover show
	 */
	thi$.setTitleStyle = function(tstyle, bstyle){
		var title = this.title, style;
		
		if(!title) return;

		style = title.def;

		tstyle = (tstyle || 0) & 0x03; 
		bstyle = (bstyle || 0) & 0x03;

		if(style.bstyle !== bstyle){
			style.bstyle = bstyle;
			switch(bstyle){
			case 0:
			case 2:
				this.showtitlebutton(true);
				break;
			case 1:
			case 3:
				this.showtitlebutton(false);
				break;
			}
		}

		if(style.tstyle !== tstyle){
			style.tstyle = tstyle;

			switch(tstyle){
			case 0:
			case 2:
				title = this.delController();
				this.addComponent(title, title.def.constraints);
				title.setVisible(true);
				break;
			case 1:
			case 3:
				title = this.title = this.removeComponent("title");
				this.setController(title);
				title.setVisible(false);
				break;
			default:
				break;
			}

			if(this.isDOMElement()){
				this.doLayout(true);
			}
		}
	};

	thi$.getTitleStyle = function(){
		var style = this.title.def;
		return {
			tstyle: style.tstyle,
			bstyle: style.bstyle
		};
	};

	/**
	 * @see js.awt.Cover
	 */
	thi$.showLoading = function(b, styleClass){
		this.client.showLoading(b, styleClass);

	}.$override(this.showLoading);

	/**
	 * @see js.awt.Component
	 */
	thi$.needLayout = function(force){
		return $super(this) || 
			this.isMaximized();		   

	}.$override(this.needLayout);
	
	/**
	 * @see js.awt.Component
	 */
	thi$.doLayout = function(force){
		var p, ele, styles, scroll, 
		overflowX, overflowY, 
		width, height;

		if(this.needLayout(force)){
			if(this.isMaximized()){
				p = this.view.parentNode;
				scroll = DOM.hasScrollbar(p);
				styles = DOM.currentStyles(p);
				overflowX = styles.overflowX;
				overflowY = styles.overflowY;

				width = (overflowX === "hidden") ? p.clientWidth :
					(scroll.hscroll ? p.scrollWidth : p.clientWidth);

				height= (overflowY === "hidden") ? p.clientHeight: 
					(scroll.vscroll ? p.scrollHeight : p.clientHeight);
				
				if(this.getWidth() != width || this.getHeight() != height){
					this.setBounds(0, 0, width, height);	
				}
				$super(this);	  
			}else{
				ele = this.client.view; 
				styles = DOM.currentStyles(ele);
				overflowX = styles.overflowX; 
				overflowY = styles.overflowY;
				ele.style.overflow = "hidden";
				$super(this);
				ele.style.overflowX = overflowX;
				ele.style.overflowY = overflowY;
			}

			return true;
		}

		return false;

	}.$override(this.doLayout);
	
	var _setSizeTo = function(winsize){
		var U = this._local, d, m, r;
		winsize = winsize || "normal";
		switch(winsize){
		case "maximized":
			var p = this.view.parentNode;
			d = {x: 0, y: 0, width: p.scrollWidth, height: p.scrollHeight };
			U.movable = this.isMovable();
			U.resizable = this.isResizable();
			U.alwaysOnTop = this.isAlwaysOnTop();
			m = false; 
			r = false;
			break;
		case "minimized":
			d = this.getMinimumSize();
			d.x = U.userX;
			d.y = U.userY;
			U.movable = this.isMovable();
			U.resizable = this.isResizable();
			m = this.isMovable();
			r = false;
			break;
		default:
			d = { width: U.userW, height:U.userH };
			d.x = U.userX;
			d.y = U.userY;
			m = U.movable || this.isMovable();
			r = U.resizable || this.isResizable();
			break;
		}

		this.setMovable(m);
		this.setResizable(r);
		this.setBounds(d.x, d.y, d.width, d.height, 3);
	};

	thi$.onbtnMin = function(button){
		var U = this._local;
		if(this.isMinimized()){
			// Restore
			this.setMinimized(false);
			_setSizeTo.call(this, "normal");				
		}else{
			if(this.isMaximized()){
				this.setMovable(U.movable);
				this.setResizable(U.resizable);
			}
			this.setMinimized(true);
			_setSizeTo.call(this, "minimized");			   
		}
	};
	
	thi$.onbtnMax = function(button){
		var U = this._local, R = this.Runtime();
		if(this.isMaximized()){
			// Restore
			this.setMaximized(false);
			_setSizeTo.call(this, "normal");
			button.setTriggered(false);
			button.setTipText(R.nlsText("btnMax_tip"));	
		}else{
			if(this.isMinimized()){
				this.setMovable(U.movable);
				this.setResizable(U.resizable);
			}
			this.setMaximized(true);
			_setSizeTo.call(this, "maximized");
			button.setTriggered(true);
			button.setTipText(R.nlsText("btnMin_tip"));
		}
	};
	
	thi$.onbtnClose = function(button){
		this.close();
	};

	thi$.close = function(){
		if(typeof this.beforClose == "function"){
			this.beforClose();
		}
		
		if(this.container instanceof js.awt.Container){
			this.container.removeComponent(this);
		}
		
		this.destroy();
	};
	
	thi$.refresh = function(){
		var client = this.client;
		if(typeof client.refresh == "function"){
			client.refresh();
		}
	};
	
	thi$.onrefresh = function(target){
		this.refresh();
	};

	thi$.notifyIFrame = function(msgId, msgData){
		var win = this.client.getWindow();
		if (win) {
			MQ.post(msgId, msgData, [], win, 1);
		}
	};
	
	thi$.loadUrl = function(url){
		var client = this.client;
		if(client.instanceOf(js.awt.Frame)){
			client.setSrc(url);
			client.load();
		}else{
			throw "This window does not support this ability.";
		}
	};
	
	thi$.setContent = function(html, href){
		var client = this.client;
		if(client.instanceOf(js.awt.Frame)){
			client.setContent(html, href);
		}else{
			throw "This window does not support this ability.";
		}
	};
	
    thi$.onmouseover = function(e){
        // e.cancelBubble();
        var title = this.title, ele, xy, style;
        if(!title) return;

        ele = e.toElement;
        xy = this.relative(e.eventXY());
        style = this.getTitleStyle();

		if(this.contains(ele, true) && xy.y < 50){

			if(style.tstyle === 3){
				title.setVisible(true);
			}

			if(style.bstyle === 3){
				if(title.contains(ele, true)){
					this.showtitlebutton(true);
				}else{
					this.showtitlebutton(false);
				}
			}
		}
		this.setHover(true);

    }.$override(this.onmouseover);

    thi$.onmouseout = function(e){
        // e.cancelBubble();
        var title = this.title, ele, xy, style;
        if(!title) return;

        ele = e.toElement;
        xy = this.relative(e.eventXY());
        style = this.getTitleStyle();

		if(!this.contains(ele, true) && ele !== this._coverView){

			if(style.tstyle === 3){
				title.setVisible(false);
			}

			if(style.bstyle === 3){
				this.showtitlebutton(false);
			}
		}
		this.setHover(false);

    }.$override(this.onmouseout);

	thi$.showtitlebutton = function(b){
		var title = this.title, items = title.items0(), item;
		for(var i=0, len=items.length; i<len; i++){
			item = title[items[i]];
			if(item.id.indexOf("btn") == 0){
				item.setVisible(b);
			}
		}

		if(title.isDOMElement()){
			title.doLayout(true);
		}
	};

	thi$.destroy = function(){
		delete this._local.restricted;
		$super(this);

	}.$override(this.destroy);

	/**
	 * Recognize and generate the definition for the specified title item.
	 * 
	 * @param {String} iid The specified item id.
	 * @param {Object} def The current panel definition.
	 * @param {Runtime} R
	 */
	thi$.getTitleItemDef = function(iid, def, R){
		var tmp, idef;

		switch(iid){
		case "labTitle":
			idef = {
				classType: "js.awt.Label",
				
				rigid_w: false, rigid_h: false,
				align_x: 0.0, align_y: 1.0
			};
			break;
		case "btnMin":
		case "btnMax":
		case "btnClose":
			idef = {
				classType: "js.awt.Button",
				className: "jsvm_title_button",
				
				rigid_w: true, rigid_h: false
			},

			tmp = titleItemMap[iid];
			idef.iconImage = tmp.iconImage;

			if(tmp.nlsKey){
				idef.tip = R.nlsText(tmp.nlskey, tmp.defaultTip);
			}
			break;
		default:
			break;
		}

		return idef;
	};

	var _preTitleDef = function(def, R){
		var tdef = def.title || {}, 
		items = tdef.items = def.titleItems || tdef.items 
			|| ["labTitle", "btnMin", "btnMax", "btnClose"],
		iid, idef;

		tdef.classType = tdef.classType || "js.awt.HBox";

		for(var i = 0, len = items.length; i < len; i++){
			iid = items[i];
			idef = this.getTitleItemDef(iid, def, R);

			if(Class.isObject(tdef[iid])){
				idef = System.objectCopy(tdef[iid], idef);
			}
			
			tdef[iid] = idef;
		}

		idef = tdef["labTitle"];
		if(idef){
			if(Class.isString(def.titleText)){
				idef.text = def.titleText;
			}else{
				idef.text = Class.isString(idef.text) 
					? idef.text : "J$VM";
			}
		}

		return tdef;
	};

	var _preDef = function(def, R){
		var items = def.items = def.items || ["title", "client"],
		iid, idef;
		for(var i = 0, len = items.length; i < len; i++){
			iid = items[i];
			switch(iid){
			case "title":
				idef = def[iid] = _preTitleDef.apply(this, arguments);
				idef.rigid_w = (idef.rigid_w === true);
				idef.rigid_h = (idef.rigid_h !== false);
				idef.constraints = idef.constraints || "north";
				break;
			case "client":
				idef = def[iid] = def[iid] || {
					classType: "js.awt.VFrame"
				};

				idef.rigid_w = (idef.rigid_w === true);
				idef.rigid_h = (idef.rigid_h === true);
				idef.constraints = idef.constraints || "center";
				break;
			}
		}

		if(!def.layout){
			def.layout = {
				classType: "js.awt.BorderLayout",
				mode: 0,
				hgap: 0,
				vgap: 0
			};
		}

		def.resizable = (def.resizable !== false);
		def.resizer = def.resizer || 0xFF;

		def.movable = (def.movable !== false);
		def.mover = def.mover || { bt:1.0, br:0.0, bb:0.0, bl:1.0 };

		def.shadow = (def.shadow !== false);
		def.rigid_w = (def.rigid_w !== false);
		def.rigid_w = (def.rigid_w !== false);

		return def;		   
	};
	
	thi$._init = function(def, Runtime, view){
		if(def == undefined) return;
		
		def.classType = def.classType || "js.awt.Window";
		def.className = def.className || "jsvm_win";

		_preDef.apply(this, arguments);

		var tdef = def.title;
		if(tdef){
			tdef.className = tdef.className 
				|| DOM.combineClassName(def.className, "title");

			(function(iid){
				 var item = tdef[iid], clazz;
				 if(iid.indexOf("lab") == 0){
					 if(!item.className){
						 item.className = DOM.combineClassName(tdef.className, "label");
					 }

					 item.css = (item.css || "") 
						 + "white-space:nowrap;"
						 + "test-overflow:ellipsis;"
						 + "overflow:hidden;cursor:default;";
				 }else if(iid.indexOf("btn") == 0){
					 if(!item.className){
						 clazz = DOM.combineClassName(tdef.className, "button");
						 item.className = "jsvm_title_button $jsvm_title_button" 
							 + " " + clazz + " " + ("$" + clazz);
					 }
				 }else{
					 item.className = item.className 
						 || DOM.combineClassName(tdef.className, iid);
				 }

			 }).$forEach(this, tdef.items);
		}

		tdef = def.client;
		tdef.className = tdef.className 
			|| DOM.combineClassName(def.className, "client");

		def.css = "position:absolute;" + (def.css || "") 
			+ "overflow:hidden;";
		$super(this);

		var target = this, title = this.title;
		if(title){
			title.setPeerComponent(target);
            title.setMoveTarget(target);
			(function(name){
				 var item = this.title[name];
				 item.setPeerComponent(this);
				 if(name.indexOf("btn") == 0){
					 item.icon.uuid = item.uuid();
				 }else{
                     item.setMoveTarget(target);
				 }
			 }).$forEach(this, title.def.items);
			
			var tstyle = title.def.tstyle, 
			bstyle = title.def.bstyle;

			title.def.tstyle = 0;
			title.def.bstyle = 0;

			this.setTitleStyle(tstyle, bstyle);
		}

		this.client.setPeerComponent(this);

		MQ.register("js.awt.event.ButtonEvent",
					this, js.awt.Button.eventDispatcher);
		
	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Container);

js.awt.Window.DEFAULTDEF = function(){
	return {
		classType : "js.awt.Window",
		className : "jsvm_win",

		items: ["title", "client"],

		title: {
			classType: "js.awt.HBox",
			constraints: "north",

			items:["labTitle", "btnMin", "btnMax", "btnClose"],
			
			labTitle:{
				classType: "js.awt.Label",
				text: "J$VM",

				rigid_w: false,
				rigid_h: false
			},
			
			btnMin:{
				classType: "js.awt.Button",
				className: "jsvm_title_button",
				iconImage: "minimize.gif"
			},

			btnMax:{
				classType: "js.awt.Button",
				className: "jsvm_title_button",
				iconImage: "maximize.png"
			},

			btnClose:{
				classType: "js.awt.Button",
				className: "jsvm_title_button",
				iconImage: "close.png"
			}
		},

		client:{
			classType: "js.awt.VFrame",
			constraints: "center",
			rigid_w: false,
			rigid_h: false
		},

		layout:{
			classType: "js.awt.BorderLayout",
			mode: 0,
			hgap: 0,
			vgap: 0
		},

		resizer: 0xFF, resizable: true,
		mover:{ bt:1.0, br:0.0, bb:0.0, bl:1.0 }, movable: true,
		shadow: true,
		
		width: 400,
		height:300,

		rigid_w: true,
		rigid_h: true,

		miniSize:{width: 72, height:24},
		prefSize:{width: 640, height:480}	 
	};
};

J$VM.Factory.registerClass(js.awt.Window.DEFAULTDEF());

