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

/**
 *
 */
org.jsvm.HeartBeat = function(Runtime){

    var Class = js.lang.Class, System = J$VM.System, Event = js.util.Event,
        pid = Runtime.PID(), uuid = this.uuid(),
        TIMEFORMAT = "yyyy-MM-dd HH:mm:ss.SSSZ",
        MSGID = this.MSG_HEARTBEAT = "j$vm.heartbeat";
    
    var Runnable = function(servlet, period){
        this.context = {
            servlet : servlet,
            period : period
        };

        this.run = function(){
            $import("org.jsvm.Action");

            this.doAction = function(){
                var success = function(http){
                    var result = http.responseJSON();
                    if(result.err === "C0080017"){
                        J$VM.MQ.post("HeartbeatStop", null, null, self);
                    }else{
                        this.doAction.$delay(this, this.context.period);
                        J$VM.MQ.post("HeartbeatResume", result, null, self);
                    }
                    http.close();
                };

                var error ;
                var timeout=function(http){
                    http.close();
                    this.doAction.$delay(this, this.context.period);
                    J$VM.MQ.post("HeartbeatPause", null, null, self);
                };
                error=timeout;

                var action = new org.jsvm.Action(
                    this.context.servlet, "webos", "HeartBeatAction");
                action.uuid("heartbeat");
                action.doAction({}, this, success,error,timeout);
            };

            this.doAction();
        };

    };

    var proxy = this, HBT = this.heartbeat = new js.lang.Thread(
        new Runnable(Runtime.postEntry(), Runtime.getProperty("heartbeat")));

    var _log = function(msg, pid, err){
        if(err){
            System.err.println([msg, pid, " on ",
                (new Date()).$format(TIMEFORMAT)].join(""));
        }else if(System.isLogEnabled()){
            System.log.println([msg, pid, " on ",
                (new Date()).$format(TIMEFORMAT)].join(""));
        }
    };

    HBT.onHeartbeatResume = function(result){
        this.pauseCount = 0;

        _log("J$VM heartbeat resume for ", pid);

        var interval = System.getMaxInactiveInterval();
        if(interval > 0 &&
           System.currentTimeMillis() - System.getLastAccessTime() > interval){
            proxy.doAction("Logout", {}, "webos");
        } else {
            J$VM.MQ.post(MSGID, new Event("recv", result), [uuid]);
        }
    };

    HBT.onHeartbeatPause = function(){
        var count = this.pauseCount;

        count = Class.isNumber(count) ? count+1 : 0;

        if(count > 3){
            this.onHeartbeatStop();
            return;
        }

        this.pauseCount = count;

        _log("J$VM heartbeat pause for ", pid, true);
    };

    HBT.onHeartbeatStop = function(){
        this.stop();

        if(!Runtime.isEmbedded()){
            J$VM.MQ.post(MSGID, new Event("stop", null), [uuid]);
        }

        _log("J$VM heartbeat stop for ", pid, true);
    };

    HBT.start();
};
