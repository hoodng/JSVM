<%@ include file="../entry/check.jsp"%>
<%        
    java.util.Map dsbPrefer = (java.util.Map)prefer.get("dashboard");

    if(dsbPrefer == null){
        dsbPrefer = new KVMapDef();
        prefer.put("dashboard", dsbPrefer);
    }
    
    mode = userinfo.isAdmin() ? 1 : 0;
    
    if(mode == 0 || mode == 2){
        java.util.Map viewMode = (java.util.Map)dsbPrefer.get("viewMode");
        theme = viewMode != null ? (String)viewMode.get("theme") : "default";
    }else if(mode == 1){
        java.util.Map editMode = (java.util.Map)dsbPrefer.get("editMode");
        theme = editMode != null ? (String)editMode.get("theme") : "default";
    }

%>