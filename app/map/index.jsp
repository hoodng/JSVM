<!DOCTYPE html >
<%@ include file="check.jsp"%>
<html class="jsvm--full-h">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
  <title>JMap Studio</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  <script id="j$vm" type="text/javascript" src="../entry/jsvm.jsp?j$vm_pid=<%=pid%>"
          crs="../../jsvm/" 
          classpath="lib/jsre-ui.jz;
                     lib/jsre-gks.jz;
                     lib/service.jz;
                     lib/ace/ace.jz;
                     "></script> 
  <script type="text/javascript" src="../../jsvm/src/com/jinfonet/common/ResourceTree.js"></script>  
  <script type="text/javascript" src="../../jsvm/src/com/jinfonet/map/GeoTree.js"></script> 
  <script type="text/javascript" src="../../jsvm/src/com/jinfonet/map/UIGenerator.js"></script> 
  <script type="text/javascript" src="../../jsvm/src/com/jinfonet/map/GISInfoPanel.js"></script>
  <script type="text/javascript" src="../../jsvm/src/com/jinfonet/map/MapApp.js"></script>
  <script type="text/javascript" src="../../jsvm/src/org/jsvm/map/MapComponent.js"></script>
  <script type="text/javascript" src="../../jsvm/src/com/jinfonet/common/editor/JSONEditor.js"></script>                     
</head>
<body class="jsvm--full-h jsvm--noborder jsvm--nomargin jsvm--nopadding jsvm--font jsvm__body" 
      jsvm_entry="mapstudio">
</body>

  <script type="text/javascript">
    J$VM.exec("mapstudio", function(){
        var Class = js.lang.Class, Event = js.util.Event, MQ = J$VM.MQ,
        System = J$VM.System, Desktop = this.getDesktop();
                  
        Desktop.registerStyleFiles(["va.css","gmap.css"]);
        Desktop.updateTheme(this.theme());
        
        this.createApp({classType: "com.jinfonet.map.MapApp"}).startApp();

    });
</script>
</head>
<body >
</body>

</html>

