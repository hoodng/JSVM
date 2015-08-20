<%@ include file="../entry/check.jsp"%>

<%
try{
    ActionParameterImpl Aparam = (ActionParameterImpl)env.getActionParameter();
    Aparam.setModuleName("map");
    Aparam.setActionName("RunMapAppAction");
    Aparam.setParameter("makeout", false);
    Aparam.setParameter("jrd_sync", true); 
    ActionFactory fac = ctx.getActionFactory(env.getModuleName());
    
    Action action = fac.createAction(env);
    action.doAction();
    env = (ActionEnvImpl)action.getActionEnv();
    if(env.getResult().getErrorCode() == ErrorCodes.OK){
        StringBuilder _url = new StringBuilder("index.jsp");
        _url.append("?j$vm_pid=").append(env.getPID());
        Message.sendRedirect(request, response, _url.toString());
    }else{
        throw env.getResult().getException();
    }

} catch (Throwable e) {
    WRException we = (e instanceof WRException) ? (WRException)e : new WRException(ErrorCodes.UNKNOWN, e);    
    Logger.logE(we);
    session.setAttribute("we",we);
    Message.sendRedirect(request, response, "../entry/error.jsp?noresize=true");
}finally{
    env.destroy();
}
%>

