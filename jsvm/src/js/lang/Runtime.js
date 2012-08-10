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

    thi$.PID = function(pid){
        if(pid != undefined){
            this._local.pid = pid;
        }
        return this._local.pid;
    };

    thi$.userInfo = function(userinfo){
        if(Class.is(userinfo, "object")){
            this._local.userinfo = userinfo;
        }
        return this._local.userinfo;
    };

    thi$.dateSymbols = function(symbols){
        if(Class.is(symbols, "object")){
            this._local.symbols = symbols;
        }

        return this._local.symbols || 
            Class.forName("js.text.DateFormatSymbols").Default;        
    };

    /**
     * Set i18n dictionary 
     * 
     * @param dict, i18n dictionary
     */
    thi$.setDict = function(dict){
        this._local.dict = dict || {};
    };
    
    /**
     * Returen i18n dictionary.
     */
    thi$.getDict = function(){
        if(!this._local.dict){
            this._local.dict = {};
        }

        return this._local.dict;
    };

    /**
     * Return i18n text with the specified key
     * 
     * @param key, the text id
     * @return i18n text of the key
     */
    thi$.nlsText = function(key, defaultText){
        var dict = this._local.dict;
        return  dict ? 
            (dict[key] || (defaultText || key)) : 
            (defaultText || key);
    };
    
    thi$.prefer = function(prefer){
        if(Class.isObject(prefer)){
            this._local.prefer = prefer;
        }
        return this._local.prefer;
    };

    thi$.themes = function(themes){
        if(Class.isArray(themes)){
            this._local.themes = themes;
        }
        return this._local.themes;
    };

    thi$.theme = function(theme){
        if(Class.isString(theme)){
            this._local.theme = theme;
            // TODO: Notify server ?
        }

        return this._local.theme || "default";
    };
    
    thi$.imagePath = function(imagePath){
        if(Class.isString(imagePath)){
            this._local.imagePath = imagePath;
        }

        return this._local.imagePath || 
            "../../style/"+this.theme()+"/images/";
    };

    thi$.postEntry = function(entry){
        if(Class.isString(entry)){
            this.servlet = this._local.postEntry = entry;
        }
        return this._local.postEntry;
    };

    thi$.getsEntry = function(entry){
        if(Class.isString(entry)){
            this.getpath = this._local.getsEntry = entry;
        }
        return this._local.getsEntry;
    };
    
    thi$.getProperty = function(key, defValue){
        return this._local[key] || defValue;
    };
    
    thi$.setProperty = function(key, value){
        this._local[key] = value;
    };

    thi$.mode = function(mode){
        if(Class.isNumber(mode)){
            this._local.mode = mode;
        }
        return this._local.mode || 0;
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

};

js.lang.NoUIRuntime = function(){
    
    var CLASS = js.lang.NoUIRuntime, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;


    
}.$extend(js.util.EventTarget).$implements(js.lang.Runtime);

