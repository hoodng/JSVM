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


  J$VM.exec(null, function(){
    var Class = js.lang.Class;

    Class.forName("org.jsvm.RuntimeDecorator").call(J$VM.Runtime, env);
    Class.forName("org.jsvm.ServiceDecorator").call(J$VM.Runtime.getService());
    this.getDesktop().updateTheme(this.theme());
  });

})();
