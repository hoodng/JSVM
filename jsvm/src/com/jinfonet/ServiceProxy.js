/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * @File: Application.js
 * @Create: 2014/01/20
 * @Author: dong.hu@china.jinfonet.com
 */

$package("com.jinfonet");

$import("com.jinfonet.Action");
$import("com.jinfonet.HeartBeat");


com.jinfonet.ServiceProxy = function(Runtime){

	var CLASS = com.jinfonet.ServiceProxy, thi$ = this;
	
	var Class = js.lang.Class, Event = js.util.Event, 
	    System = J$VM.System, MQ = J$VM.MQ, R;

	/**
	 * Returns a new Action object
	 */
	thi$.getAction = function(module, action){
        module = module || "webos";
        action = action.endsWith("Action") ? action : action+"Action";

		return new (Class.forName("com.jinfonet.Action"))(
			R.postEntry(), module, action);
	};

    var _log = function(module, action, params){
        var buf = ["Do"];
        buf.push(module+"."+action);
        buf.push("with");
        buf.push(JSON.stringify(params));
        System.log.println(buf.join(" "));
    }

	/**
	 * Runtime doSyncAction entry
	 */
	thi$.doSyncAction = function(func, params, module) {
		var action = this.getAction(module, func), http, ret,
            ctx = {
                module: action.module,
                action: action.action,
                params: System.objectCopy(params, {})
            }
        
        if(System.isLogEnabled()){
            _log(ctx.module, ctx.action, ctx.params);            
        }
        
		http = action.doSyncAction(params);
		ret = http.responseJSON();
		http.close();
		return ret;
	};

	/**
	 * Runtime doAction entry
	 */
	thi$.doAction = function(func, params, module, callback) {
        var action = this.getAction(module, func),
            ctx = {
                module: action.module,
                action: action.action,
                params: System.objectCopy(params, {})
            }

        if(System.isLogEnabled()){
            _log(ctx.module, ctx.action, ctx.params);            
        }

        action.doAction(params, this,
                        _success.$bind(this, callback, ctx),
                        _httperr.$bind(this, callback, ctx),
                        _timeout.$bind(this, callback, ctx));
	};

    
    var _success = function(http, callback, ctx){
        var result = http.responseJSON();
        
        if(Class.isFunction(callback)){
            (function(result){
                callback(result.obj||{}, result.err, result.msg, ctx);
            }).$delay(this, 0, result);
        }
        
        if(result.err != 0){
            R.message("error", result.err, result.msg);
        }
        http.close();
    };

    var _httperr = function(http, callback, ctx){
        var status = http.status(),
        result = {
            err: CLASS.HTTPERR,
            msg: "HTTP "+status+": "
        };

		if(status<100 || status>=600){
            result.msg = result.msg +
				R.nlsText("httpAccessDeny", 
						  "The required server resources cannot be accessed.");
		}else{
            result.msg = result.msg + http.statusText();
		}

        if(Class.isFunction(callback)){
            (function(result){
                callback(result.obj||{}, result.err, result.msg, ctx);
            }).$delay(this, 0, result);
        }
        
        R.message("warn", result.err, result.msg);
		http.close();
    };

    var _timeout = function(http, callback, ctx){
        var result = {
            err: CLASS.TIMEOUT,
            msg: R.nlsText("httpTimeout", "HTTP timeout")
        };

        if(Class.isFunction(callback)){
            (function(result){
                callback(result.obj||{}, result.err, result.msg, ctx);
            }).$delay(this, 0, result);
        }
        
        R.message("warn", result.err, result.msg);
		http.close();
    };
    
	var _browserInfo = function(){
		this.doSyncAction(
            "ClientInfoAction",
			{jrd_objdef:{
				platform: navigator.platform,
				userAgent: navigator.userAgent,
				logicalXDPI: J$VM.supports.logicalXDPI,
				logicalYDPI: J$VM.supports.logicalYDPI 
			}},
			"webos");
	};

    var _onheartbeat = function(e){
        var apps = R.getDesktop().getApps(), app, fn;
        for(var appid in apps){
            app = apps[appid];
            fn = app.onHeartbeat;
            if(Class.isFunction(fn)){
                fn.$delay(app, 0, e.getData());
            }
        }
    };

    thi$.destroy = function(){
        this.heartbeat.stop();
        this.heartbeat = null;

        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);

    (function(Runtime){
        R = Runtime;
        
        // Report browser infomation
        _browserInfo.call(this);
        
        (Class.forName("com.jinfonet.HeartBeat")).call(this, Runtime);
        System.out.println("Heartbeat established.");

        MQ.register(this.MSG_HEARTBEAT, this, _onheartbeat);        

    }).call(this, this.Runtime());
};

(function(){
    var CLASS = com.jinfonet.ServiceProxy;
    CLASS.HTTPERR = "B0000001"; // http error
    CLASS.TIMEOUT = "B0000002"; // http timeout
})();

