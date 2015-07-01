/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * @File: Application.js
 * @Create: 2014/01/20
 * @Author: dong.hu@china.jinfonet.com
 */

$package("com.jinfonet");

$import("com.jinfonet.JConstant");
$import("com.jinfonet.CrossWinInteractive");

/**
 * Attention:
 * According to the implementation of the "_onmessage()" function 
 * in System.js, the application can't listen messages from the 
 * current application itself.
 */
com.jinfonet.Application = function(def, Runtime, entryId){

	var CLASS = com.jinfonet.Application, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
        this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	CLASS.HBT_SESSION_EXPIRED = "session-expired";
	CLASS.HBT_SVR_DISCONNECTED = "server-disconnected";

	CLASS.ACTION_RST_FLAG_SUCCESS = 1;
	CLASS.ACTION_RST_FLAG_ERROR = 0;
	CLASS.ACTION_RST_FLAG_HTTPERROR = -1;
	CLASS.ACTION_RST_FLAG_HTTPTIMEOUT = -2; 
	
	var Class = js.lang.Class, Event = js.util.Event, 
	System = J$VM.System, MQ = J$VM.MQ,
		JConstant = Class.forName("com.jinfonet.JConstant");
	
	thi$.getProduct = function(){
		return "jreport";		 
	};

	/**
	 * @method
	 * @inheritdoc com.jinfonet.CrossWindow#getMsgHeader
	 */ 
	thi$.getMsgHeader = function(){
		return {
			product: this.getProduct(),
			appID: this.id
		};
	};

	/**
	 * Notify something to parent when the current application
	 * is loaded.
	 */
	thi$.doOnAppLoaded = function(info){
		info = info || {};
		
		this.postMsgToPwin(JConstant.CWMSG_APPLOAD, info);
	};

	/**
	 * Notify something to parent when the current application
	 * is closed.
	 */
	thi$.doOnAppClosed = function(info){
		info = info || {};
		
		this.postMsgToPwin(JConstant.CWMSG_APPCLOSE, info);
	};

	/**
	 * Indicate whether the current VA is embedded in another page.
	 */	   
	thi$.setEmbedded = function(b){
		this._local.isEmbedded = b;
	};
	
	thi$.isEmbedded = function(){
		return this._local.isEmbedded === true;
	};
	
	/**
	 * Expect to refresh current open reports. Subclass should implements 
	 * it to do the right things.
	 */	   
	thi$.refreshApp = function(msg){
		// Implement by subclass if need
	};
	
	/**
	 * An interface function to handle the "JConstant.CROSS_WIN_MSG" messages.
	 * Subclass should override it if need.
	 */
	thi$.onCrossWinMsg = function(e){
		var msg = e.message || {}, data = msg.body || {},
		op = data.op;
		
		System.log.println("Cross window message: " + JSON.stringify(msg));
		
		if(data.type === JConstant.CWMSG_TYPE_SIMPLEOP){
			switch(op){
			case JConstant.CWMSG_SIMPLEOP_CLOSE:
				this.closeApp(msg);
				break;
			case JConstant.CWMSG_SIMPLEOP_REFRESH:
				this.refreshApp(msg);
				break;
			}
		}
	};

	/**
	 * Handle the message from the parent window object in which a page with 
	 * current application is embedded.
	 */
	thi$.onHandshake = function(e){
		J$VM.System.log.println("From parent window: " 
								+ JSON.stringify(e.message || {}));
		
		this.setEmbedded(true);
	};
	
	var _onCloseAppMsg = function(e){
		System.log.println("Cross window message: " 
						   + JSON.stringify(e.message || {}));
		
		this.closeApp(e.message);		 
	};
	
	var _onRefreshAppMsg = function(e){
		System.log.println("Cross window message: " 
						   + JSON.stringify(e.message || {}));
		
		this.refreshApp(e.message);	   
	};
	
	thi$.onShowHelp = function(e){
		// Implement by subclass
	};
	
	/**
	 * Startup the current application to prepare context and start listening
	 * the cross-window message.
	 */
	thi$.startApp = function(doLoadedNotify){
        arguments.callee.__super__.apply(this, arguments);
        		
		MQ.register(JConstant.CROSS_WIN_MSG, this, this.onCrossWinMsg);
		MQ.register(JConstant.CWMSG_HANDSHAKE, this, this.onHandshake);
		
		// Register to drive current application to do something (e.g. 
		// close and refresh itself) by listening the cross-window message
		// from other window.
		MQ.register(JConstant.CWMSG_CLOSEAPP, this, _onCloseAppMsg);
		MQ.register(JConstant.CWMSG_REFRESHAPP, this, _onRefreshAppMsg);

		// Sample for handle the message that need feed back		 
		// MQ.register("SampleFeedbackMsg", this, function(e){
		//				   // 1. Do something according to the message
		//				   // 2. Invoke the feedback function
		//				   this.feedback();
		//			   });
		
		// Post from every dialog, to update help 
		MQ.register("js.awt.event.ShowHelpEvent", this, this.onShowHelp);

		if(doLoadedNotify === true){
			this.doOnAppLoaded();
		}
        
	}.$override(this.startApp);

	/**
	 * Close down current application to clean the context env.
	 */ 
	thi$.closeApp = function(){
		MQ.cancel(JConstant.CROSS_WIN_MSG, this, this.onCrossWinMsg);
		MQ.cancel(JConstant.CWMSG_HANDSHAKE, this, this.onHandshake);
		
		MQ.cancel(JConstant.CWMSG_CLOSEAPP, this, _onCloseAppMsg);
		MQ.cancel(JConstant.CWMSG_REFRESHAPP, this, _onRefreshAppMsg);
		
		MQ.cancel("js.awt.event.ShowHelpEvent", this, this.onShowHelp);

        arguments.callee.__super__.apply(this, arguments);
        
	}.$override(this.closeApp);

	/**
	 * Reserve the interface to help the subsequent developer to do what
	 * they want after closing the prompt dialogs.
	 * 
	 * @param {String} flag The constants of Application to indicate what
	 *		  the connection exceptions thrown.
	 * @param {js.awt.Event} e Optional. The event of closing the prompt dialogs.
	 */
	thi$.onConnectionException = function(flag, e){
        System.log.println("Connection Exception: " + flag);
		this.postMsgToPwin(JConstant.CWMSG_CONNECTION_EXCEPTION, {flag: flag});	 
	};

	/**
	 * Do somthing after action returned.
	 * 
	 * @param {String} actionName Name of current action.
	 * @param {Number} rstFlag The action result flag.
	 */
	thi$.doAfterAction = function(actionName, rstFlag){
		// Implement by subclass if need
	};

	/**
	 * Application doAction entry
	 */
	thi$.doAction = function(func, params, module, callback) {
		var Rt = this.Runtime(), actionName = func + "Action",
		action = this.getAction(module || "dashboard", actionName),
		funcName = "on" + func, result, fn, rstFlag;

		System.log.println("Do action " + actionName + " with " + JSON.stringify(params));		  

		action.doAction(
			params, 
			this, 
			function(http){
				// success
				result = http.responseJSON();
				if(result.err == 0) {
					rstFlag = CLASS.ACTION_RST_FLAG_SUCCESS;					   

					if(typeof callback == "function"){
						(function(v){
							 callback(v);
						 }).$delay(this, 1, result.obj || {});
					}else{
						fn = this[funcName];
						if(typeof fn === "function") {
							fn.$delay(this, 0, result.obj);
						}
					}
				}else {
					rstFlag = CLASS.ACTION_RST_FLAG_ERROR;
					Rt.message("error", result.err, result.msg);
				}
				http.close();
				
				// Do something others, e.g. to hide loading
				this.doAfterAction(actionName, rstFlag);

			}, function(http){
				// HTTP error
				if(http.status()<100||http.status()>=600){
					Rt.message("warn", "HTTP " + http.status(),
							   Rt.nlsText("httpAccessDeny", 
										  "The required server resources cannot be accessed."));
				}else{
					Rt.message("warn", "HTTP " + http.status(), http.statusText());
				}
				http.close();
				
				// Do something others, e.g. to hide loading
				this.doAfterAction(actionName, CLASS.ACTION_RST_FLAG_HTTPERROR);				 

			}, function(http){
				// timeout
				Rt.message("warn", Rt.nlsText("httpTimeout", "HTTP timeout"), "");
				http.close();
				
				// Do something others, e.g. to hide loading
				this.doAfterAction(actionName, CLASS.ACTION_RST_FLAG_HTTPTIMEOUT);				   
			});
	};

	/**
	 * Application doSyncAction entry
	 */
	thi$.doSyncAction = function(func, params, module) {
		var action = this.getAction(module || "dashboard", func + "Action"),
		http, ret;
		http = action.doSyncAction(params);
		ret = http.responseJSON();
		http.close();
		return ret;
	};
	
	/**
	 * Returns a new Action object
	 */
	thi$.getAction = function(module, action){
		return new (Class.forName("com.jinfonet.Action"))(
			this.Runtime().postEntry(), module, action);
	};
	
	/**
	 * Update the current UserInfo with the given info.
	 * 
	 * @param info: {Object} The given info to update.
	 * @param prop: {String} The name of target property in UserInfo.
	 */
	thi$.updateUserInfo = function(info, prop){
		if(!Class.isObject(info)){
			return;
		}
		
		var RT = this.Runtime(), userInfo = RT.userInfo(),
		pobj, pn;
		
		if(prop){
			pobj = userInfo[prop];
			if(!pobj){
				pobj = userInfo[prop] = {};
			}
		}else{
			pobj = userInfo;
		}
		
		for(pn in info){
			pobj[pn] = info[pn];
		}
		
		RT.userInfo(userInfo);
	};

	/**
	 * Create and open the FrameDialog with the given arguments.
	 * 
	 * @param {Object} dlgObjDef The  definition information for the
	 *		  DialogObject object.
	 * 
	 *		  @example
	 *		  {
	 *			  url: "xxx/action.do",
	 *			  dlgArgs: dialog arguments // Optional, pure object without any dom and function.
	 *		  }	 
	 * 
	 * @param {Object} extDlgDef The additional definition information for the dialog to open.
	 *		  Always it will include the size of dialog.
	 * @param {Function} okHandler The handler function for the "OK" button.
	 * @param {Function} cancelHandler The handler function for the "Cancel" button.
	 * @param {Function} otherHandler The handler function for the other operation.
	 *	
	 * @link com.jinfonet.common.FrameDialog.openDialog
	 */	   
	thi$.openFrameDialog = function(dlgObjDef, extDlgDef, okHandler, cancelHandler, otherHandler){
		var handler = function(e){
			var type = e.getType(), data = e.getData();
			switch(e.getType()){
			case "ok":
				if(typeof okHandler == "function"){
					okHandler(data);
				}
				break;
			case "cancel":
				if(typeof cancelHandler == "function"){
					cancelHandler(data);
				}
				break;
			default:
				if(typeof otherHandler == "function"){
					otherHandler(data);
				}
				break;
			}
		}; 

		var FrameDialogObj = Class.forName("com.jinfonet.common.FrameDialogObj"),
		FrameDialog = Class.forName("com.jinfonet.common.FrameDialog"),

		dlgObj = new FrameDialogObj(dlgObjDef, this.Runtime());

		return FrameDialog.openDialog(this, extDlgDef, dlgObj, handler, 
									  window.self, arguments[5]);
	};

    
    this._init.apply(this, arguments);

}.$extend(js.awt.Application).$implements(com.jinfonet.CrossWinInteractive);
