/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 *
 * @File: HeartBeat.js
 * @Create: 2013/12/03 07:24:14
 */

$package("com.jinfonet");

/**
 *
 */
com.jinfonet.HeartBeat = function(Runtime){

    var Class = js.lang.Class, System = J$VM.System, Event = js.util.Event,
        pid = Runtime.PID(), uuid = this.uuid();

    var MSGID = this.MSG_HEARTBEAT = "j$vm.heartbeat";
    
    var Runnable = function(servlet, period){
        this.context = {
            servlet : servlet,
            period : period
        };

        this.run = function(){
            $import("com.jinfonet.Action");

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

                var action = new com.jinfonet.Action(
                    this.context.servlet, "webos", "HeartBeatAction");

                action.doAction({}, this, success,error,timeout);
            };

            this.doAction();
        };

    };

    var proxy = this, HBT = this.heartbeat = new js.lang.Thread(
        new Runnable(Runtime.postEntry(), Runtime.getProperty("heartbeat")));

    HBT.onHeartbeatResume = function(result){
        this.pauseCount = 0;

        System.log.println(
            "J$VM heartbeat resume for " +
                pid + " on " + (new Date()).toString());

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
        
        System.err.println(
            "J$VM heartbeat pause for " +
                pid + " on " + (new Date()).toString());
    };

    HBT.onHeartbeatStop = function(){
        this.stop();

        if(!Runtime.isEmbedded()){
            J$VM.MQ.post(MSGID, new Event("stop", null), [uuid]);
        }
        
        System.err.println(
            "J$VM heartbeat stop for " +
                pid + " on " + (new Date()).toString());
    };

    HBT.start();
};
