<%response.setHeader("Content-Type", "application/x-javascript; charset=utf-8");%>
<%@ include file="../../jsvm/jsre.js" %>

(function(){

  var env = {
    j$vm_pid: "s001122334455",
    getsEntry: "./vt",
    postEntry: "./s001122334455.vt",
    theme: "default",

    heartbeat: 15000,

    j$vm_max_inactive: 600000
  };


  J$VM.Runtime.exec(function(){
    var Class = js.lang.Class, System = J$VM.System;

    Class.forName("com.jinfonet.Runtime").call(this);
    this.initialize(env);

    this.registerService(
      new (Class.forName("com.jinfonet.ServiceProxy"))({}, this));

  });

})();
