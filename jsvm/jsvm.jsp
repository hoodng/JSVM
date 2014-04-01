<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<% 
String queryString = request.getQueryString();
response.sendRedirect("../app/entry/jsvm.jsp?"+jet.server.util.WebSecurityUtil.escapeJavaScript(queryString));
%>
