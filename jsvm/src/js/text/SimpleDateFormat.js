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

$package("js.text");

$import("js.text.Format");
$import("js.util.LinkedList");

js.text.SimpleDateFormat = function(pattern, DateFormatSymbols){
    
    var CLASS = js.text.SimpleDateFormat, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;

    var TOKEN = /yy(?:yy)?|M{1,}|d{1,2}|E{1,}|([Hhms])\1?|S(?:SS)?|[azZG]|"[^"]*"|'[^']*'/g;
    var TIMEZONE = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
    
    var Regx = {
        yy : "(\\d{2})", yyyy : "(\\d{4})", G : "(\\S+)",
        M  : "([1-9]|1[012])", MM : "(0[1-9]|1[012])",
        MMM : "(\\S+)", MMMM : "(\\S+)",
        d : "(3[01]|[12][0-9]|[1-9])", dd : "(0[1-9]|[12][0-9]|3[01])",
        E : "(\\S+)", EE : "(\\S+)", EEE : "(\\S+)", EEEE : "(\\S+)",
        H : "([0-9]|1[0-9]|2[0-3])", HH : "(0[0-9]|1[0-9]|2[0-3])",
        h : "([1-9]|1[012])", hh : "(0[1-9]|1[012])", a : "(\\S+)",
        m : "([0-9]|[1-5][0-9])", mm : "([0-5][0-9])",
        s : "([0-9]|[1-5][0-9])", ss : "([0-5][0-9])",
        S : "(\\d{1,3})", SSS : "(\\d{3})",
        z : "(\\S+)", Z : "([\\-\\+]\\d{2,4})"
    };
    
    var SetterOrder = js.util.LinkedList.$decorate(["y", "M", "d"]);
    
    var Getter = new function(){
        var _pad  = function(val, len){val = "000"+String(val); return val.slice(val.length - (len || 2)); };
        var _week = function(D,$,b){return b ? D.getUTCDay() : D.getDay();};
        this.yy   = function(D,$,b){return _pad(this.yyyy(D,$,b), 2);};
        this.yyyy = function(D,$,b){return _pad((b ? D.getUTCFullYear() : D.getFullYear()), 4);};
        this.M    = function(D,$,b){return ( b ? D.getUTCMonth() : D.getMonth())+1;};
        this.MM   = function(D,$,b){return _pad(this.M(D,$,b), 2);};
        this.MMM  = function(D,$,b){return $.getShortMonths()[this.M(D,$,b) - 1];};
        this.MMMM = function(D,$,b){return $.getMonths()[this.M(D,$,b) - 1];};
        this.d    = function(D,$,b){return b ? D.getUTCDate() : D.getDate();};
        this.dd   = function(D,$,b){return _pad(this.d(D,$,b), 2);};
        this.E    = function(D,$,b){return $.getShortWeekdays()[_week(D,$,b)];};
        this.EE   = function(D,$,b){return $.getShortWeekdays()[_week(D,$,b)];};
        this.EEE  = function(D,$,b){return $.getShortWeekdays()[_week(D,$,b)];};
        this.EEEE = function(D,$,b){return $.getWeekdays()[_week(D,$,b)];};
        this.H    = function(D,$,b){return b ? D.getUTCHours() : D.getHours();};
        this.HH   = function(D,$,b){return _pad(this.H(D,$,b), 2);};
        this.h    = function(D,$,b){return this.H(D,$,b) % 12 || 12;};
        this.hh   = function(D,$,b){return _pad(this.h(D,$,b), 2);};
        this.m    = function(D,$,b){return b ? D.getUTCMinutes() : D.getMinutes();};
        this.mm   = function(D,$,b){return _pad(this.m(D,$,b), 2);};
        this.s    = function(D,$,b){return b ? D.getUTCSeconds() : D.getSeconds();};
        this.ss   = function(D,$,b){return _pad(this.s(D,$,b));};
        this.S    = function(D,$,b){return b ? D.getUTCMilliseconds() : D.getMilliseconds();};
        this.SSS  = function(D,$,b){return _pad(this.S(D,$,b), 3);};
        this.a    = function(D,$,b){return $.getAmPmStrings()[this.H(D,$,b) < 12 ? 0:1];};
        this.G    = function(D,$,b){return $.getEras()[parseInt(this.yyyy(D,$,b),10) < 0 ? 0:1];};
        this.z    = function(D,$,b){return b ? "UTC" : (String(D).match(TIMEZONE) || [""]).pop().replace(/[^-+\dA-Z]/g, "");};
        this.Z    = function(D,$,b){var o = D.getTimezoneOffset(), ao = Math.abs(o);return (o > 0 ? "-" : "+") + _pad(Math.floor(ao/60)*100 + ao%60, 4);};
    };
    
    var Setter = new function(){
        /*
         * For bug #103576
         * Covert two-digital year as four-digital.
         * 
         * Ref js.text.SimpleDateFormat.java:
         * 
         * #initializeDefaultCentury()
         * #subParse()
         * 
         * Limitation:
         * When the "v === (now.getFullYear() - 80) % 100" (e.g: 34 === (2014 - 80) % 100), 
         * there are some special handle in JDK. However, it's impossible to do such thing
         * in javascript. So that, in 2014, to parse "34" as year, the 2534 will be returned,
         * but 1934 will be returned in javascript.
         */
        var _toFullYear = function(v){
            v = parseInt(v, 10);
            if(isNaN(v) || (v.toString().length > 2)){
                return v;
            }
            
            var d = new Date(), 
                defaultCenturyStartYear = d.getFullYear() - 80,
                ambiguousTwoDigitYear = defaultCenturyStartYear % 100;
            
            v += parseInt(defaultCenturyStartYear / 100) * 100 +
                (v < ambiguousTwoDigitYear ? 100 : 0);
            return v;
        };
        
        this.yy   = function(D,v,$,b){v = _toFullYear(v); return this.yyyy(D,v,$,b);};
        this.yyyy = function(D,v,$,b){var y = parseInt(v, 10); D.y = (y > 0 && D.bc) ? 0-y : y; b ? D.setUTCFullYear(D.y) : D.setFullYear(D.y); return D;};
        this.M    = function(D,v,$,b){var M = parseInt(v, 10)-1; b ? D.setUTCMonth(M) : D.setMonth(M); return D;};
        this.MM   = function(D,v,$,b){return this.M(D,v,$,b);};
        this.MMM  = function(D,v,$,b){var i = $.getShortMonths().indexOf(v); return i !=-1 ? this.M(D,i+1,$,b) : D;};
        this.MMMM = function(D,v,$,b){var i = $.getMonths().indexOf(v); return i !=-1 ? this.M(D,i+1,$,b) : D;};
        this.d    = function(D,v,$,b){var d = parseInt(v,10); b ? D.setUTCDate(d) : D.setDate(d); return D;};
        this.dd   = function(D,v,$,b){return this.d(D,v,$,b);};
        this.E    = function(D,v,$,b){return D;};
        this.EE   = function(D,v,$,b){return D;};
        this.EEE  = function(D,v,$,b){return D;};
        this.EEEE = function(D,v,$,b){return D;};
        this.H    = function(D,v,$,b){var h = parseInt(v, 10); D.h = (h < 12 && D.pm) ? (h+12)%24 : h; b ? D.setUTCHours(D.h) : D.setHours(D.h); return D;};
        this.HH   = function(D,v,$,b){return this.H(D,v,$,b);};
        this.h    = function(D,v,$,b){return this.H(D,v,$,b);};
        this.hh   = function(D,v,$,b){return this.H(D,v,$,b);};
        this.m    = function(D,v,$,b){var m = parseInt(v, 10); b ? D.setUTCMinutes(m) : D.setMinutes(m); return D;};
        this.mm   = function(D,v,$,b){return this.m(D,v,$,b);};
        this.s    = function(D,v,$,b){var s = parseInt(v, 10); b ? D.setUTCSeconds(s) : D.setSeconds(s); return D;};
        this.ss   = function(D,v,$,b){return this.s(D,v,$,b);};
        this.S    = function(D,v,$,b){var S = parseInt(v, 10); b ? D.setUTCMilliseconds(S) : D.setMilliseconds(S); return D;};
        this.SSS  = function(D,v,$,b){return this.S(D,v,$,b);};
        this.a    = function(D,v,$,b){switch($.getAmPmStrings().indexOf(v)){case 0:D.am = true;return (D.h && D.h == 12) ? this.H(D, 0, $, b) : D;case 1:D.pm = true;return D.h ? this.H(D, D.h, $, b) : D;}return D;},
        this.G    = function(D,v,$,b){if($.getEras().indexOf(v) === 0){D.bc = true; return D.y ? this.yyyy(D, D.y, $, b) : D;}return D;};
        this.z    = function(D,v,$,b){return D;};
        this.Z    = function(D,v,$,b){return D;};
    };
    
    /**
     * Set format pattern
     * 
     * @param pattern, String type
     */
    thi$.setPattern = function(pattern){
        pattern = this.pattern = pattern || "EEE MMM dd HH:mm:ss yyyy";

        CLASS.infos = CLASS.infos || {};

        var info = CLASS.infos[pattern], pIndex, str;
        if(info) return;

        info = CLASS.infos[pattern] = {};
        pIndex = info.pIndex = js.util.LinkedList.newInstance();
        
        // Escape the RegExp meta characters
        // Only parsing operation need to escape, formatting needn't
        pattern = js.lang.String.escapeRxMetaChars(pattern);
        
        str = pattern.replace(
            TOKEN, 
            function($0){
                var t = $0.charAt(0);
                $0 = ((t == 'M' || t == 'E') && $0.length > 4) ? 
                    $0.slice(0, 4) : $0;
                if(typeof Setter[$0] === "function"){
                    pIndex.push($0);
                    return Regx[$0];
                }

                if($0.length >= 2){
                    $0 = $0.replace(/"|'/g, "");
                }

                return $0;
            });

        info.dPattern = new RegExp(str);

    }.$override(this.setPattern);
    
    /**
     * Set format symbols
     * 
     * @see js.text.DateFormatSymbols
     */
    thi$.setDateFormatSymbols = function(DateFormatSymbols){
        this.symbols = DateFormatSymbols || 
            new(Class.forName("js.text.DateFormatSymbols"))();
    };

    /**
     * @see js.text.Format
     */     
    thi$.setSymbols = function(symbols){
        this.symbols = symbols || 
            new(Class.forName("js.text.DateFormatSymbols"))();

    }.$override(this.setSymbols);

    /**
     * Return a formatted string of the specified date
     * 
     * @param date, Date type, if null use current date
     * @param isUTC, boolean type, whether is UTC
     * 
     * @return String
     */
    thi$.format = function(date, isUTC){
        date = date ? date : new Date();
        if(!Class.isDate(date)){
            return date;
        }
        
        var _symbols = this.symbols;
        return this.pattern.replace(
            TOKEN, 
            function($0){
                var t = $0.charAt(0);
                $0 = ((t == 'M' || t == 'E') && $0.length > 4) ? 
                    $0.slice(0, 4) : $0;
                return (typeof Getter[$0] === "function") ? 
                    Getter[$0](date, _symbols, isUTC) : 
                    $0.slice(1, $0.length-1);
            });

    }.$override(this.format);
    
    /**
     * Return a <code>Date<code> object from a date string
     * 
     * @param datestr, String type
     * @param strict, boolean type, whether match the specified pattern strictly
     * @param isUTC, boolean type, whether is UTC
     * 
     * @return Date
     * 
     * P.S. 03/25/2014 Pan Mingfa
     * When we set value to a Date object, the order of year, month, date should
     * be followed. Otherwise, if the February is setten first, and then set 29th 
     * as date, the month will be changed as March because 1970 is not leap year
     * and the February has no 29 days. So, we need to set year first to determine
     * the leap year, and then set month and date.
     */
    thi$.parse = function(datestr, strict, isUTC){
        var info = CLASS.infos[this.pattern], 
            pIndex = info.pIndex, _symbols = this.symbols, 
            date, m = datestr.match(info.dPattern), $0, v,
            idx, mvs = [], i, len, obj;
        if(m){
            date = new Date(1970, 0, 1);
            for(i = 1, len = m.length; i < len; i++){
                $0 = pIndex[i-1];
                v = m[i];
                
                idx = SetterOrder.indexOf($0.charAt(0));
                if(idx !== -1){
                    mvs[idx] = [$0, v];
                }else{
                    date = Setter[$0](date, m[i], _symbols, isUTC);
                }
            }
            
            for(i = 0, len = mvs.length; i < len; i++){
                obj = mvs[i];
                if(obj){
                    date = Setter[obj[0]](date, obj[1], _symbols, isUTC);
                }
            }

            return date;
        }

        if(strict !== true){
            try{
                date = new Date(Date.parse(datestr));    
            } catch (x) {
                
            }
        }
        
        if(!Class.isDate(date))
            throw SyntaxError("Invalid date string");

        return date;

    }.$override(this.parse);

    this._init.apply(this, arguments);
    
}.$extend(js.text.Format);
