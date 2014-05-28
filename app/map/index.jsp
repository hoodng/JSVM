<!DOCTYPE html >
<%@ include file="check.jsp"%>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
  <title>JMap Studio</title>
  <link rel="stylesheet" type="text/css" href="../../style/<%= theme%>/va.css"/>
  <link rel="stylesheet" type="text/css" href="../../style/<%= theme%>/gmap.css"/>

  <script id="j$vm" type="text/javascript" src="../../jsvm/jsvm.jsp?j$vm_pid=<%=jet.server.util.WebSecurityUtil.escapeJavaScript(pid)%>" 
          classpath="lib/../jsre-ui.js;lib/ace/ace.js"></script>
  <style>__PSEUDO__ {background-color:gray;}</style>
  
  <script type="text/javascript" src="../../jsvm/src/com/jinfonet/common/ResourceTree.js"></script>  
  <script type="text/javascript" src="../../jsvm/src/com/jinfonet/map/GeoTree.js"></script> 
  <script type="text/javascript" src="../../jsvm/src/com/jinfonet/map/GISInfoPanel.js"></script>
  <script type="text/javascript" src="../../jsvm/src/com/jinfonet/map/MapApp.js"></script>
  <script type="text/javascript" src="../../jsvm/src/org/jsvm/map/MapComponent.js"></script>
  <script type="text/javascript" src="../../jsvm/src/com/jinfonet/common/editor/JSONEditor.js"></script>
    
  <script type="text/javascript">
    J$VM.exec("MapStudio", function(System){

        var Class = js.lang.Class, Event = js.util.Event, 
        System = J$VM.System, MQ = J$VM.MQ;
                  
        var env = {
            pid: "<%=jet.server.util.WebSecurityUtil.escapeJavaScript(pid)%>",
            getsEntry: "<%=servletPrefix%>vt",
            postEntry: "<%=jet.server.util.WebSecurityUtil.escapeJavaScript(pid)%>.vt",

            userinfo: <%= userinfo.toString()%>,
            
            prefer: <%= prefer.toString()%>,
            theme: "<%= theme%>",
            
            dict: <%= ctx.getDictJSONObject(pid)%>,
            
            mode: <%= mode%>,

            heartbeat: <%= ctx.getHeartBeatPeriod()%>,

            license: <%=license.toJSONObject()%>,
            
            NLSTextDict : <%= ctx.getGlobalNLSTextDict().toString()%>,
            NLSFontDict : <%= ctx.getGlobalNLSFontDict().toString()%>
            
        };

        this.initialize(env);
        
        // Define map application UI
        new (Class.forName("com.jinfonet.map.UIGenerator"))(this);
        var def = J$VM.Factory.getClass("mapApp");
        var app = new (Class.forName("com.jinfonet.map.MapApp"))(def, this);
        this.addComponent(app);

    });
</script>
</head>
<body >
</body>

</html>

