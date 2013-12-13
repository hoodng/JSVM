<%@ include file="../app/entry/check.jsp" %>
<%response.setHeader("Content-Type", "application/x-javascript; charset=utf-8");%>
<%@ include file="jsre.js" %>
(function(){

     var env = {
         getsEntry: "<%=servletPrefix%>vt",
         postEntry: ".vt",
            
         userinfo: <%= userinfo.toString()%>,
            
         prefer: <%= prefer.toString()%>,
         themes: <%= new JSONArray(themes).toString()%>,
         theme: "<%= theme%>",
            
         dict: <%= ctx.getDict(locale).toString()%>,
            
         mode: <%= mode%>,

         fontNames: <%= FontNames.toJSONObject(FontNames.getSupportedFontNames()).toString()%>,
         fontSizes: <%= FontSizes.toJSONObject(FontSizes.getSignificativeFontSizes()).toString()%>,

         exportFormats: <%= new JSONArray(FormatTypes.getAllFormats()).toString() %>,
         pageTypes: <%= new JSONArray(PageTypes.getAllPrintPageTypes()).toString() %>,
         
         formats: <%= ClientContext.getDateFormats()%>
     };
     
     env.dateformat = env.formats.dateformat;
     env.timeformat = env.formats.timeformat;
     env.datetimeformat = env.formats.datetime;
     
     J$VM.boot(env);

 })();
