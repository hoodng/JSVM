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
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("com.jinfonet");

com.jinfonet.RuntimeDecorator = function(env){

    var CLASS = com.jinfonet.RuntimeDecorator, thi$ = this;

    var Class = js.lang.Class, Event = js.util.Event,
        System = J$VM.System, Factory = J$VM.Factory;

    /**
     * Popup message box
     *
     * @see js.lang.Runtime
     */
    thi$.message = function(type, subject, content, title, rect, handler){
        var msgbox = {
            className: "msgbox",
            model:{
                msgType: type,
                title: title || "",
                msgSubject: subject || "",
                msgContent: content || " "
            }
        };

        this.getDesktop().openDialog(
            "message",
            rect || {},
            new js.awt.MessageBox(msgbox, this),
            handler);

    };
    

    var _registerMessageClass = function(){
        if(Factory.hasClass("message")) return;

        Factory.registerClass(
            {
                classType : "js.awt.Dialog",
                className : "message",

                items: [ "title", "client", "btnpane"],

                title: {
                    classType: "js.awt.HBox",
                    className: "win_title",
                    constraints: "north",

                    items:["labTitle", "btnClose"],

                    labTitle:{
                        classType: "js.awt.Label",
                        className: "win_title_label",
                        text : "Dialog",
                        rigid_w: false,
                        rigid_h: false
                    },

                    btnClose:{
                        classType: "js.awt.Button",
                        className: "win_title_button",
                        iconImage: "dialog_close.png"
                    }
                },

                client:{
                    classType: "js.awt.Container",
                    className: "message_client",
                    constraints: "center",
                    css: "overflow:hidden;",
                    layout:{
                        classType: "js.awt.BorderLayout"
                    }
                },

                btnpane:{
                    classType: "js.awt.HBox",
                    className: "message_btnpane",
                    constraints: "south",

                    items:["btnOK"],

                    btnOK:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnOK", "OK")
                    },

                    layout:{
                        gap: 4,
                        align_x : 1.0,
                        align_y : 0.0
                    }
                },

                width: 330,
                height:150,
                miniSize:{width:330, height:150},
                resizable: true
            }
        );
    };

    var _registerConfirmClass = function(){
        if(Factory.hasClass("jsvmconfirm")) return;

        Factory.registerClass(
            {
                classType : "js.awt.Dialog",
                className : "jsvmconfirm",

                items: [ "title", "client", "btnpane"],

                title: {
                    classType: "js.awt.HBox",
                    className: "win_title",
                    constraints: "north",

                    items:["labTitle", "btnClose"],

                    labTitle:{
                        classType: "js.awt.Label",
                        className: "win_title_label",
                        text : "Confirm",
                        rigid_w: false,
                        rigid_h: false
                    },

                    btnClose:{
                        classType: "js.awt.Button",
                        className: "win_title_button",
                        iconImage: "dialog_close.png"
                    }
                },

                client:{
                    classType: "js.awt.Container",
                    className: "message_client",
                    constraints: "center",
                    css: "overflow:hidden;",
                    layout:{
                        classType: "js.awt.BorderLayout"
                    }
                },

                btnpane:{
                    classType: "js.awt.HBox",
                    className: "message_btnpane",
                    constraints: "south",

                    items:["btnOK", "btnCancel"],

                    btnOK:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnOK", "OK")
                    },

                    btnCancel:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnCancel", "Cancel")
                    },

                    layout:{
                        gap: 4,
                        align_x : 1.0,
                        align_y : 0.0
                    }
                },

                modal: true,
                width: 330,
                height:150,
                miniSize:{width:330, height:150},
                resizable: true
            }
        );
    };

    var _registerConfirm2Class = function(){
        if(Factory.hasClass("jsvmconfirm2")) return;

        Factory.registerClass(
            {
                classType : "js.awt.Dialog",
                className : "jsvmconfirm2",

                items: [ "title", "client", "btnpane"],

                title: {
                    classType: "js.awt.HBox",
                    className: "win_title",
                    constraints: "north",

                    items:["labTitle", "btnClose"],

                    labTitle:{
                        classType: "js.awt.Label",
                        className: "win_title_label",
                        text : "Confirm",
                        rigid_w: false,
                        rigid_h: false
                    },

                    btnClose:{
                        classType: "js.awt.Button",
                        className: "win_title_button",
                        iconImage: "dialog_close.png"
                    }
                },

                client:{
                    classType: "js.awt.Container",
                    className: "message_client",
                    constraints: "center",
                    css: "overflow:hidden;",
                    layout:{
                        classType: "js.awt.BorderLayout"
                    }
                },

                btnpane:{
                    classType: "js.awt.HBox",
                    className: "message_btnpane",
                    constraints: "south",

                    items:["btnYes", "btnNo", "btnCancel"],

                    btnYes:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnYes", "Yes")
                    },

                    btnNo:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnNo", "No")
                    },

                    btnCancel:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnCancel", "Cancel")
                    },

                    layout:{
                        gap: 4,
                        align_x : 1.0,
                        align_y : 0.0
                    }
                },

                modal: true,
                width: 354,
                height: 150,
                miniSize: {width:354, height:150},
                resizable: true
            }
        );
    };

    var _invalidateProperty = function(key){
        if(!key) return;
        System.removeProperty(key);
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
    
    /**
     * Set content locale with the specified Locale, or the specified 
     * Language and Country.
     */
    thi$.setContentLocale = function(){
        var Locale = js.util.Locale, len = arguments.length, 
            arg0, locale;
        if(len === 0){
            return;            
        }
        
        arg0 = arguments[0];
        if(arg0 instanceof Locale){
            locale = arg0;
        }else{
            if(Class.isString(arg0) && arg0.length > 0){ // As language
                locale = new Locale(arg0, arguments[1]);          
            }
        }
        
        if(locale){
            this.setProperty("content_locale", locale);
        }
    };
    
    var _initContentLocale = function(){
        var userinfo = this.userInfo() || {},
            prefer = userinfo.prefer || {},
            cLang = prefer["rpt_lang"],
            cCountry = prefer["rpt_country"],
            locale;
        
        if(Class.isString(cLang) && cLang.length > 0){
            locale = new js.util.Locale(cLang, cCountry);              
        }
        
        return locale;
    };

    /**
     * If there is a customized content locale, return it.
     * Other to return the rpt locale.
     * 
     * The rpt locale can be updated in runtime, didn't 
     * cache it.
     */    
    thi$.getContentLocale = function(){
        return this.getProperty("content_locale") 
            || _initContentLocale.call(this);
    };

    /**
     * Return date symbols of the current locale.
     */ 
    thi$.dateSymbols = function(symbols){
        if(Class.isObject(symbols)){
            this.setProperty("dateSymbols", symbols);
        }

        return this.getProperty(
            "dateSymbols", 
            Class.forName("js.text.resources."+this.getLocal()).dateSymbols);
    };

    /**
     * Return number symbols of the current locale.
     */ 
    thi$.numberSymbols = function(symbols){
        if(Class.isObject(symbols)){
            this.setProperty("numrSymbols", symbols);
        }

        return this.getProperty(
            "numrSymbols",
            Class.forName("js.text.resources."+this.getLocal()).numrSymbols);
    };

    /**
     * Fetch date symbols of the specified locale.
     */    
    thi$.getDateSymbolsByLocale = function(locale){
        return js.util.Locale.getDateSymbols(locale);
    };
    
    /**
     * Fetch number symbols of the specified locale.
     */
    thi$.getNumberSymbolsByLocale = function(locale){
        return js.util.Locale.getNumberSymbols(locale);
    };

    /**
     * Set i18n dictionary 
     * 
     * @param dict, i18n dictionary
     */
    thi$.setDict = function(dict){
        var d = this.getProperty("dict");
        dict = dict || {};
        if(d == undefined){
            this.setProperty("dict", dict);
        }else{
            System.objectCopy(dict, d, false, true);
        }
    };
    
    /**
     * @see jet.server.jrc.resource.nls.GlobalNLSDictionary.getText()
     * 
     * Get globel nls text value.
     * @param language String, language info of locale
     * @param country String, country info of locale
     * @param orgText String, the text need do NLS
     * @return nlsText
     */
    thi$.getGlobleNLSText = function(language, country, orgText) {
        var NLSTextDict = this.getProperty('NLSTextDict'),
            locale = new (Class.forName('js.util.Locale'))(language,country),
            rst = null;
        
        while(NLSTextDict && true){
            var nlsInfo = NLSTextDict[locale.toString()];
            rst = nlsInfo ? nlsInfo[orgText] : null;
            if(rst != null){
                return rst;
            }
            
            locale = _getParentLocale(locale);
            if(locale == null){
                break;
            }
        }
        
        return orgText;
    };
    
    /**
     * @see jet.server.jrc.resource.nls.GlobalNLSDictionary.getFont()
     * 
     * Get globel nls text value.
     * @param language String, language info of locale
     * @param country String, country info of locale
     * @param fontName String, the fontName need do NLS
     * @param ptFontSize Number, the fontSize in point that need do NLS
     * @return Object {fontName : nls fontName, fontSize : nls fontSize in point}
     */
    thi$.getGlobleNLSFont = function(language, country, fontName, ptFontSize) {
        var NLSFontDict = this.getProperty('NLSFontDict'),
            locale = new (Class.forName('js.util.Locale'))(language,country),
            rst = null;
        
        while(NLSFontDict && true){
            var nlsInfo = NLSFontDict[locale.toString()];
            if(nlsInfo){
                rst = nlsInfo[fontName + '_' + ptFontSize];
                if(rst == null){
                    rst = nlsInfo[fontName + '_' + 0];
                }
            }
            if(rst != null){
                return rst;
            }
            
            locale = _getParentLocale(locale);
            if(locale == null){
                break;
            }
        }
        
        return {
            fontName:fontName,
            fontSize:ptFontSize
        };
    };
    
    var _getParentLocale = function(locale){
        var Locale = Class.forName("js.util.Locale"), 
            country = locale.getCountry(),
            language = locale.getLanguage();
        
        if(country != null && country.length > 0){
            return new Locale(language);
        }else if(language != null && language.length > 0){
            return new Locale('','');
        }
        
        return null;
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
        var dict = this.getDict(), v = dict[key];
        return v ? (Class.isString(v) ? v : v.text) : (defaultText || key);
    }.$override(this.nlsText);
    

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

    thi$.mode = function(mode){
        if(Class.isNumber(mode)){
            this.setProperty("mode", mode);
        }
        return this.getProperty("mode", 0);
    };

    thi$.isEditMode = function(){
        return (this.mode() & 0x01) != 0;
    };
    
    thi$.getLicense = function(){
        return this.getProperty("license");  
    };
    
    thi$.isProductEnabled = function(product){
        var license, enabled = false;
        if(Class.isString(product) && product.length > 0){
            license = this.getLicense() || {};
            enabled = (license[product + "_enabled"] === true);
        }
        
        return enabled;
    };
    
    // Initialize locale with userinfo
    var _initLocale = function(){
        var userinfo = this.userInfo() || {}, locale = this.locale(),
            lang = userinfo.lang, country = userinfo.country;
        
        if(!locale){
            locale = new js.util.Locale();
            this.setProperty("locale", locale);
        }
        
        if(lang && (lang !== locale.language 
                  || country !== locale.country)){
            locale.setLanguage(lang);
            locale.setCountry(country);
            
            _invalidateProperty.call(this, "dateSymbols");
            _invalidateProperty.call(this, "numrSymbols");
        }
        
        return locale;
    };

    (function(env){
        this.initialize(env);

        _initLocale.call(this);

        _registerMessageClass.call(this);
        _registerConfirmClass.call(this);

        // Confirm message box with "Yes", "No" and "Cancel"
        // Widely used in WebReport Studio for insteading jConfirm2
        _registerConfirm2Class.call(this);
        
    }).call(this, env);
    
};
