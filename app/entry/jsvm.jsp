<%@ include file="check.jsp" %>
<%response.setHeader("Content-Type", "application/x-javascript; charset=utf-8");%>
<%@ include file="../../jsvm/jsre.js" %>
(function(){

     var env = {
         pid: "<%=jet.server.util.WebSecurityUtil.escapeJavaScript(pid)%>",
         getsEntry: "<%=servletPrefix%>vt",
         postEntry: "<%=jet.server.util.WebSecurityUtil.escapeJavaScript(pid)%>.vt",
            
         userinfo: <%= userinfo.toString()%>,
            
         prefer: <%= prefer.toString()%>,
         themes: <%= new JSONArray(themes).toString()%>,
         theme: "<%= theme%>",
            
         dict: <%= ctx.getDict(locale).toString()%>,
            
         heartbeat: <%= ctx.getHeartBeatPeriod()%>,
         
         j$vm_max_inactive: <%=ctx.getMaxInactiveInterval()%>,
         
         mode: <%= mode%>,

         fontNames: <%= FontNames.toJSONObject(FontNames.getSupportedFontNames()).toString()%>,
         fontSizes: <%= FontSizes.toJSONObject(FontSizes.getSignificativeFontSizes()).toString()%>,

         exportFormats: <%= new JSONArray(FormatTypes.getAllFormats()).toString() %>,
         pageTypes: <%= new JSONArray(PageTypes.getAllPrintPageTypes()).toString() %>,
         
         formats: <%= ClientContext.getFormats()%>
     };
     
     env.dateformat = env.formats.dateformat;
     env.timeformat = env.formats.timeformat;
     env.datetimeformat = env.formats.datetime;
     
     J$VM.boot(env);
     
 })();
