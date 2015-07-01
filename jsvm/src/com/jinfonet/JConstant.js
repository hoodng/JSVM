/**
 * Copyright (c) Jinfonet Inc. 2000-2013, All rights reserved.
 * 
 * File: JConstant.js
 * Create: 2013/12/17 03:36:07
 * Author: mingfa.pan@china.jinfonet.com
 */

$package("com.jinfonet");

com.jinfonet.JConstant = new (function(){
	this.PRODUCT_PAGEREPORT = "pagereport";
	this.PRODUCT_WEBREPORT = "webreport";
	this.PRODUCT_DASHBOARD = "dashboard";
	this.PRODUCT_VA = "va";
	this.PRODUCT_MAPSTUDIO = "mapstudio";
	
	this.RESTYPEICONMAP = {
		dashboard: "dashboard.png",
		webreport: "wls.gif",
		clxreport : "clx.gif",
		xmlreport : "xml.gif",
		rptreport : "rpt.gif",
		pagereport: "cls.gif",
		va: "icon-va.png"
	};
	
	this.PAGEREPORT_RESOURCE_RPT_SUFFIX = ".rpt";
	this.PAGEREPORT_RESOURCE_CLS_SUFFIX = ".cls";
	this.PAGEREPORT_RESOURCE_CLX_SUFFIX = ".clx";
	this.PAGEREPORT_RESOURCE_CLS_XML_SUFFIX = ".cls.xml";
	this.WEBREPORT_RESOURCE_WLS_SUFFIX = ".wls";
	this.DASHBOARD_RESOURCE_DSH_SUFFIX = ".dsh";
	this.DASHBOARD_RESOURCE_LC_SUFFIX = ".lc";
	this.VA_RESOURCE_VA_SUFFIX = ".va";
	
	
	// ID of the common cross-window message
	this.CROSS_WIN_MSG	  = "com.jinfonet.CrossWindowMsg";

	// ID of the cross-window message from other window 
	// for notifying the connection exceptions.
	this.CWMSG_CONNECTION_EXCEPTION = "com.jinfonet.cwmsg.ConnectionException";
	
	// ID of the cross-window message from the parent window
	// for notifying current application about that it is 
	// embedding.
	this.CWMSG_HANDSHAKE  = "com.jinfonet.cwmsg.Handshake";
	
	// ID of the message from other window for notifying
	// current application to close self
	this.CWMSG_CLOSEAPP	  = "com.jinfonet.cwmsg.CloseApp";
	
	// ID of the message from other window for notifying
	// current application to refresh self
	this.CWMSG_REFRESHAPP = "com.jinfonet.cwmsg.RefreshApp";
	
	// ID of the message for current application to notifying
	// other window it is loaded
	this.CWMSG_APPLOAD	  = "com.jinfonet.cwmsg.AppLoad";
	
	// ID of the message for current application to notifying
	// other window it is closed
	this.CWMSG_APPCLOSE	  = "com.jinfonet.cwmsg.AppClose";
	
	
	this.CWMSG_TYPE_DOCNAME = "docName";
	this.CWMSG_TYPE_STATUS = "status";
	
	this.CWMSG_TYPE_SIMPLEOP = "simpleop";
	this.CWMSG_SIMPLEOP_NEW = "new";
	this.CWMSG_SIMPLEOP_OPEN = "open";	  
	this.CWMSG_SIMPLEOP_CLOSE = "close";
	this.CWMSG_SIMPLEOP_REFRESH = "refresh";

	
	// For dialog operation
	this.CWMSG_TYPE_DLGARGS = "dialogarguments";

	this.CWMSG_TYPE_DIALOGOP = "dialogop";
	this.CWMSG_DIALOGOP_OK = "dlgok";
	this.CWMSG_DIALOGOP_CANCEL = "dlgcancel";
	this.CWMSG_DIALOGOP_HELP = "dlghelp";
	this.CWMSG_DIALOGOP_CLOSE = "dlgclose";
	this.CWMSG_DIALOGOP_POPUP = "dlgpopup";
	this.CWMSG_DIALOGOP_RESIZE = "dlgresize";
	this.CWMSG_DIALOGOP_MSG = "dlgmessage";
	
	// dsh's help id: web report's
	this.DSHWSDLGHELPIDMAP = {
		"70015": "60077" // For MultiValuePickerDlgObj
	};
	
	this.DSHPGDLGHELPIDMAP = {
		"70015": "40077" // For MultiValuePickerDlgObj
	};
	
	// Some names of server preference items refs jet.cs.util.APIConst 
	this.SHOW_LOADING_ICON = "show_loading_icon";
	this.ENABLE_IE_NAVIGATE2 = "enable_IE_Navigate2";

})();
