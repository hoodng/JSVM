/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
 Redistribution and use in source and binary forms, with or without modification, 
 are permitted provided that the following conditions are met:
 
 1. Redistributions of source code must retain the above copyright notice, 
 this list of conditions and the following disclaimer.
 
 2. Redistributions in binary form must reproduce the above copyright notice, 
 this list of conditions and the following disclaimer in the 
 documentation and/or other materials provided with the distribution.
 
 3. Neither the name of the JSVM nor the names of its contributors may be 
 used to endorse or promote products derived from this software 
 without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
 INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
 BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
 OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 OF THE POSSIBILITY OF SUCH DAMAGE.

 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 */

js.lang.Runtime = function(){

	var CLASS = js.lang.Runtime, thi$ = CLASS.prototype;
	if(CLASS.__defined__) return;
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event;
	
	thi$.getProperty = function(key, defValue){
		return this._local[key] || defValue;
	};
	
	thi$.setProperty = function(key, value){
		this._local[key] = value;
	};

	thi$.PID = function(pid){
		if(pid != undefined){
			this.setProperty("pid", pid);
		}
		return this.getProperty("pid", "");
	};

	thi$.userInfo = function(userinfo){
		if(Class.isObject(userinfo)){
			this.setProperty("userinfo", userinfo);
			
			// Re-intialize the runtime locale
			_initLocale.call(this);
		}
		return this.getProperty("userinfo");
	};
	
	/**
	 * In fact, there are two locales in jsvm. One is J$VM.locale, it always be
	 * initialized with current browser client's language. Another is runtime
	 * locale, it always be intialized with userinfo from server. However if there
	 * is no language information in the userinfo, we will inialize the runtime 
	 * locale with J$VM.locale. And we always assure the same language and country
	 * in userinfo and locale.
	 * Those two loacales may be same or different.
	 * 
	 * @param locale: {js.util.Locale} The locale object to set.
	 */
	thi$.locale = function(locale){
		if(locale && locale instanceof js.util.Locale){
			this.setProperty("locale", locale);
		}
		return this.getProperty("locale");
	};
	
	thi$.getLocal = function(){
		var userinfo = this.userInfo();
		if(!userinfo){
			userinfo = this._local.userinfo = {};  
		}
		
		if(!Class.isString(userinfo.lang)){
			var lang = J$VM.locale.getLanguage(),
			country = J$VM.locale.getCountry();
			
			userinfo.lang = lang;
			userinfo.country = country;

			_initLocale.call(this);
		}
		
		return this.locale().toString();
	};

	thi$.dateSymbols = function(symbols){
		if(Class.isObject(symbols)){
			this.setProperty("dateSymbols", symbols);
		}

		return this.getProperty(
			"dateSymbols", 
			Class.forName("js.text.resources."+this.getLocal()).dateSymbols);
	};
	
	thi$.numberSymbols = function(symbols){
		if(Class.isObject(symbols)){
			this.setProperty("numrSymbols", symbols);
		}

		return this.getProperty(
			"numrSymbols",
			Class.forName("js.text.resources."+this.getLocal()).numrSymbols);
	};

	/**
	 * Set i18n dictionary 
	 * 
	 * @param dict, i18n dictionary
	 */
	thi$.setDict = function(dict){
		this.setProperty("dict", (dict || {}));
	};
	
	/**
	 * Returen i18n dictionary.
	 */
	thi$.getDict = function(){
		return this.getProperty("dict", {});
	};

	/**
	 * Return i18n text with the specified key
	 * 
	 * @param key, the text id
	 * @return i18n text of the key
	 */
	thi$.nlsText = function(key, defaultText){
		var dict = this.getDict();

		return dict[key] || defaultText || key;
	};
	
	thi$.prefer = function(prefer){
		if(Class.isObject(prefer)){
			this.setProperty("prefer", prefer);
		}
		return this.getProperty("prefer", {});
	};

	thi$.datePattern = function(){
		var common = this.prefer().common;
		return common ? common.dateFormat : "yyyy-MM-dd";
	};

	thi$.timePattern = function(){
		var common = this.prefer().common;
		return common ? common.timeFormat : "HH:mm:ss";
	};

	thi$.timestampPattern = function(){
		var common = this.prefer().common;
		return common ? common.timestampFormat : "yyyy-MM-dd HH:mm:ss";
	};

	thi$.themes = function(themes){
		if(Class.isArray(themes)){
			this.setProperty("themes", themes);
		}
		return this.getProperty("themes", ["default"]);
	};

	thi$.theme = function(theme){
		if(Class.isString(theme)){
			this.setProperty("theme", theme);
			_updateJ$VMCSS.call(this);
		}
		return this.getProperty("theme", "default");
	};
	
	thi$.imagePath = function(imagePath){
		if(Class.isString(imagePath)){
			this.setProperty("imagePath", imagePath);
		}
		
		return this.getProperty(
			"imagePath", 
			J$VM.env.j$vm_home+"/../style/"+this.theme()+"/images/");
	};

	thi$.postEntry = function(entry){
		if(Class.isString(entry)){
			this.setProperty("postEntry", entry);
			this.servlet = entry;
		}
		return this.getProperty("postEntry", ".vt");
	};

	thi$.getsEntry = function(entry){
		if(Class.isString(entry)){
			this.setProperty("getsEntry", entry);
			this.getpath = entry;
		}
		return this.getProperty("getsEntry", "/vt");
	};
	

	thi$.mode = function(mode){
		if(Class.isNumber(mode)){
			this.setProperty("mode", mode);
		}
		return this.getProperty("mode", 0);
	};

	thi$.isEditMode = function(){
		return (this.mode() & 0x01) != 0;
	};

	/**
	 * Show message on console or popup a message box
	 * 
	 * @param type, info | warn | error
	 * @param subject, any string
	 * @param content, any string
	 * 
	 * @see js.awt.MessageBox
	 */
	thi$.message = function(type, subject, content){
		switch(type){
		case "info":
			J$VM.System.out.println(subject+": "+content);
			break;
		case "warn":
			J$VM.System.err.println(subject+": "+content);
			break;
		case "error":
			J$VM.System.err.println(subject+": "+content);
			break;
		default:
			throw "Unsupport message type "+ type;
			break;
		}
	};

	var _updateJ$VMCSS = function(){
		var style = document.getElementById("j$vm_css"),
		stylePath = J$VM.env.j$vm_home + "/../style/"+this.theme()+"/", 
		cssText = Class.getResource(stylePath + "jsvm.css", true);
		
		if(!style){
			style = document.createElement("style");
			style.id   = "j$vm_css";
			style.title= "j$vm_css";
			style.type = "text/css";
		}else{
			style.parentNode.removeChild(style);
		}

		cssText = cssText.replace(/images\//gi, stylePath+"images/");
		if(style.styleSheet){
			// IE
			try{
				style.styleSheet.cssText = cssText;				   
			} catch (x) {

			}
		}else{
			// Others
			style.innerHTML = cssText;
		}

		var jsvm = document.getElementById("j$vm");
		jsvm.parentNode.insertBefore(style, jsvm);
	};
	
	var _loadJ$VMCSS = function(){
		var style = document.getElementById("j$vm_css");
		if(!style){
			_updateJ$VMCSS.call(this);
		}
	};
	
	// Initialize locale with userinfo
	var _initLocale = function(){
		var userinfo = this.userInfo(), locale = this.locale();
		if(!locale){
			locale = this._local.locale = new js.util.Locale();
		}
		
		if(userinfo){
			locale.setLanguage(userinfo.lang);
			locale.setCountry(userinfo.country);
		}
		
		return locale;
	};
	
	thi$.initialize = function(env){
		var System = J$VM.System;
		System.objectCopy(System.getProperties(), this._local, true);
		System.objectCopy(env || {}, this._local);
		
		_initLocale.call(this);
		_loadJ$VMCSS.call(this);
	};

};

js.lang.NoUIRuntime = function(){
	
	var CLASS = js.lang.NoUIRuntime, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	thi$._init = function(){
		arguments.callee.__super__.apply(this, arguments);
		
		this._local = {};

	}.$override(this._init);

	this._init.apply(this, arguments);
	
}.$extend(js.util.EventTarget).$implements(js.lang.Runtime);

