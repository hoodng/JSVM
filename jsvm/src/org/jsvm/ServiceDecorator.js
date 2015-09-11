/**
 Copyright 2007-2015, The JSVM Project.
 All rights reserved.

 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("org.jsvm");

$import("org.jsvm.Action");
$import("org.jsvm.HeartBeat");


org.jsvm.ServiceDecorator = function(){

    var CLASS = org.jsvm.ServiceDecorator, thi$ = this;
    
    var Class = js.lang.Class, Event = js.util.Event, 
        System = J$VM.System, MQ = J$VM.MQ, R,
        TIMEFORMAT="yyyy-MM-dd HH:mm:ss.SSSZ";

    /**
     * Returns a new Action object
     */
    thi$.getAction = function(module, action){
        module = module || "webos";
        action = action.endsWith("Action") ? action : action+"Action";

        return new (Class.forName("org.jsvm.Action"))(
            R.postEntry(), module, action);
    };

    var _log = function(dir, id, module, action, params){
        if(System.isLogEnabled()){
            var msg = [dir, id, " ",
                (new Date()).$format(TIMEFORMAT), " ",module, ".", action].join("");
            System.log.println(msg);
            System.log.println(params);
        }
    }

    /**
     * Runtime doSyncAction entry
     */
    thi$.doSyncAction = function(func, params, module) {
        var action = this.getAction(module, func), http, ret,
            ctx = {
                id: action.uuid(),
                module: action.module,
                action: action.action,
                params: System.objectCopy(params, {})
            }
        
        _log("SYNC:", ctx.id, ctx.module, ctx.action, ctx.params);
        
        http = action.doSyncAction(params);
        try{
            ret = http.responseJSON();            
        } catch (x) {
            ret = {err: http.status(), msg:http.statusText()}
        }finally{
            http.close();
            _log("RECV:", ctx.id, ctx.module, ctx.action, ret);
        }
        return ret;
    };

    /**
     * Runtime doAction entry
     */
    thi$.doAction = function(func, params, module, callback) {
        var action = this.getAction(module, func),
            ctx = {
                id: action.uuid(),
                module: action.module,
                action: action.action,
                params: System.objectCopy(params, {})
            }

        _log("ASYN:", ctx.id, ctx.module, ctx.action, ctx.params);

        action.doAction(params, this,
                        _success.$bind(this, callback, ctx),
                        _httperr.$bind(this, callback, ctx),
                        _timeout.$bind(this, callback, ctx));
    };

    
    var _success = function(http, callback, ctx){
        var result = http.responseJSON();

        _log("RECV:", ctx.id, ctx.module, ctx.action, result);

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

        _log("RECV:", ctx.id, ctx.module, ctx.action, result);

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

        _log("RECV:", ctx.id, ctx.module, ctx.action, result);

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
            {objdef:{
                platform: navigator.platform,
                userAgent: navigator.userAgent,
                logicalXDPI: J$VM.supports.logicalXDPI,
                logicalYDPI: J$VM.supports.logicalYDPI 
            }},
            "webos");
    };

    var _onheartbeat = function(e){
        var apps, appid, app, fn;
        if("recv" !== e.getType()) return;
        
        apps = R.getDesktop().getApps();
        for(appid in apps){
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

        $super(this);
        
    }.$override(this.destroy);

    (function(){
        R = this.Runtime();
        
        // Report browser infomation
        _browserInfo.call(this);

        (Class.forName("org.jsvm.HeartBeat")).call(this, R);
        System.out.println("Heartbeat established.");

        MQ.register(this.MSG_HEARTBEAT, this, _onheartbeat);        

    }).call(this);
};

(function(){
    var CLASS = org.jsvm.ServiceDecorator;
    CLASS.HTTPERR = "B0000001"; // http error
    CLASS.TIMEOUT = "B0000002"; // http timeout
})();

