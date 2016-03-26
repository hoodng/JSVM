/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * @File: NavigateUtil.js
 * @Create: 2012-12-10
 * @Author: mucong.zhao@china.jinfonet.com
 * 
 * @Edit: 2013-4-11
 * @By: zhouhong.su@china.jinfonet.com
 * 
 */

$package("js.util");

js.util.NavigateUtil =  new function(){
	
	var shellObj;
	
    /**
     * Navigates the browser to a location
     * @param url     : the URL, or the full path to the file location, 
     *                  or a PIDL that represents a folder in the Shell namespace.
     * 
     * @param flags   : 0x1    | Open the resource or file in a new window.
     *                  0x2    | Do not add the resource or file to the history list. The new 
     *                         | page replaces the current page in the list.
     *                  0x4    | Not be supported.
     *                  0x8    | Not be supported.
     *                  0x10   | If the navigation fails, the autosearch functionality attempts to
     *                         | navigate common root domains (.com, .edu, and so on). If this 
     *                         | also fails, the URL is passed to a search engine.
     *                  0x20   | Causes the current Explorer Bar to navigate to the given item.
     *                  0x40   | If the navigation fails when a hyperlink is being followed, this
     *                         | constant specifies that the resource should then be bound to the
     *                         | moniker using the BINDF_HYPERLINK(see MSDN) flag.
     *                  0x80   | Force the URL into the restricted zone.
     *                  0x0100 | Use the default Popup Manager to block pop-up windows.
     *                  0x0200 | Block files that normally trigger a file download dialog box. 
     *                  0x0400 | Prompt for the installation of Microsoft ActiveX controls.
     *                  0x0800 | Open the resource or file in a new tab. Allow the destination 
     *                         | window to come to the foreground, if necessary.(IE7)
     *                  0x1000 | Open the resource or file in a new background tab; the currently
     *                         | active window and/or tab remains open on top.(IE7)
     *                  0x2000 | Maintain state for dynamic navigation based on the filter string
     *                         | entered in the search band text box (wordwheel). Restore the 
     *                         | wordwheel text when the navigation completes.(IE7)
     *                  0x4000 | Open the resource as a replacement for the current or target tab.
     *                         | The existing tab is closed while the new tab takes its place in 
     *                         | the tab bar and replaces it in the tab group, if any. Browser 
     *                         | history is copied forward to the new tab.(IE8)
     *                  0x8000 | Block cross-domain redirect requests. The navigation triggers the
     *                         | DWebBrowserEvents2::RedirectXDomainBlocked(see MSDN) event 
     *                         | if blocked.(IE8)
     *                  0x10000| Open the resource in a new tab that becomes 
     *                           the foreground tab.(IE8 or later)
     * 
     * @param target  : windowName, _parent, _self, _top, _blank 
     * @param postData: postData is sent to the server as part of a HTTP POST transaction. A POST
     *                  transaction typically is used to send data collected by an HTML form.
     * @param headers : contains additional HTTP headers to send to the server. These headers are
     *                  added to the default Windows Internet Explorer headers.
     */
    this.navigate2 = function(url, flags, target, postData, headers) {
        if(!J$VM.ie){
            return;
        }
        
        var IWB2;

        switch(target){
        case "_blank":
            IWB2 = new ActiveXObject("InternetExplorer.Application");
            IWB2.Visible = true;
            break;
        case "_parent":
        case "_self":
        case "_top":
        case "":
            target = undefined;
        default:
            IWB2 = this.getCurrentIWB2();
            break;
        }

        // Do navigate
        IWB2.Navigate2(url, flags, target, postData, headers);
	    
        if(!this.isCurrentIWB2(IWB2)){
            IWB2.Quit();
        }

    };
    
    this.isCurrentIWB2 = function(IWB2){
    	//if(IWB2.Document && IWB2.Document.Script){
    	try{
    		var IWB2ID = IWB2.Document.Script.IWB2ID;
    		return window.IWB2ID === IWB2ID;
    	}
    	catch(e){
    		return false;
    	}
    };
    
    this.getCurrentIWB2 = function(){
    	var IWB2ID = _createIWB2ID.call(this);
    	window.IWB2ID = IWB2ID;
    	return _getCurrentIWB2.call(this, IWB2ID);
    };
    
    var _getCurrentIWB2 = function(IWB2ID){
    	var currentIWB2, currentWindow;
        var shellWindows = _getShellObj.call(this).windows();
    	
        if(shellWindows){
        	for (var i = 0; i < shellWindows.Count; i++){
        		ieObj = shellWindows.Item(i);
                if (ieObj && ieObj.Name === "Windows Internet Explorer"){
                	if(this.isCurrentIWB2(ieObj)){
                		currentIWB2 = ieObj;
                    	break;
                	}
                }
            }
        }
    	
    	return currentIWB2;
    };
    
    var _createIWB2ID = function(){
    	var id = "";
    	var date = new Date();
    	
    	id = _getGUID.call(this) + "-" + date.valueOf();
    	
    	return id;
    };
    
    var _getGUID = function(){
    	var guid = "", n;
        for (var i = 1; i <= 32; i++){
          n = Math.floor(Math.random()*16.0).toString(16);
          guid += n;
          if((i==8)||(i==12)||(i==16)||(i==20)){
        	  guid += "-";
          }
        }
        return guid;    
    };
    
    /**
     * @returns {
     *     tab: the Windows Internet Explorer IWebBrowser2 instance (ie tab)
     *     window: the Windows Explorer IWebBrowser2 instance (maybe ie window)
     *     winControl: the Microsoft Web Browser Control IWebBrowser2 instance (maybe the top ie controller)
     *  }
     *
    this.getIEWindowsIWB2 = function(){
    	var ieWins = {
    			tab: [],
    			window: [],
    			winControl: []
    	};
    	var ieObj;
    	var shellWindows = _getShellObj.call(this).windows();
    	
    	if(shellWindows){
        	for (var i = 0; i < shellWindows.Count; i++){
        		ieObj = shellWindows.Item(i);
        		
                if (ieObj){
                	switch(ieObj.Name){
                	case "Windows Internet Explorer":
                		ieWins.tab.push(ieObj);
                		break;
                	case "Windows Explorer":
                		ieWins.window.push(ieObj);
                		break;
                	case "Microsoft Web Browser Control":
                		ieWins.winControl.push(ieObj);
                		break;
                	}
                }
            }
        }
    	
    	return ieWins;
    };
    /**/
    
    /**
     * get windows shell.application instance
     */
    var _getShellObj = function(){
    	if(shellObj)  return shellObj;
    	
    	shellObj = new ActiveXObject("Shell.Application");
    	
    	return shellObj;
    };
    
    //"CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"   same as new ActiveXObject("Shell.Explorer")
    //"CLSID:0002DF01-0000-0000-C000-000000000046"   same as new ActiveXObject("InternetExplorer.Application")
}();
