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
 * Author: hoo@hoo-desktop
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.text");

/**
 * 
 */
js.text.Format = function(pattern, symbols){

    var CLASS = js.text.Format, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    thi$._pad = function(val, len){
        val = "000"+String(val);
        return val.slice(val.length - (len || 2));
    };

    /**
     * Set format pattern
     * 
     * @param pattern pattern string
     */    
    thi$.setPattern = function(pattern){
        this.pattern = pattern;
    };
    
    /**
     * Set symbols for formatting or parsing a value
     * 
     * @param symbols, symbols table
     */
    thi$.setSymbols = function(symbols){
        this.symbols = symbols;
    };
    
    /**
     * Return a formatted string of a specified value
     * 
     * Notes: Subclass should override this method
     * 
     * @param value
     */
    thi$.format = function(value){
        return value ? value.toString() : value;
    };
    
    /**
     * Return an object from value string
     * 
     * Notes: Subclass should override this method
     * 
     * @param strValue
     */
    thi$.parse = function(strValue){
        return strValue;
    };
    
    thi$._init = function(pattern, symbols){
        this.setPattern(pattern);
        this.setSymbols(symbols);
    };
    
    this._init.apply(this, arguments);

}.$extend(js.lang.Object);

(function(){

    js.text.DefaultNumberSymbols = new js.text.NumberFormatSymbols();

    if(Number.DF === undefined){
        Number.DF = new js.text.NumberFormat();

        Number.prototype.$format = function(pattern){
            if(pattern) Number.DF.setPattern(pattern);
            return Number.DF.format(this);
        };

        Number.$parse = function(str, pattern, symbols){
            if(symbols) Number.DF.setSymbols(symbols);
            if(pattern) Number.DF.setPattern(pattern);
            return Number.DF.parse(str);
        };
    }

    js.text.DefaultDateSymbols = new js.text.DateFormatSymbols();
    
    if(Date.SF === undefined){
	    Date.SF = new js.text.SimpleDateFormat();

	    Date.prototype.$format = function(pattern, isUTC){
		    if(pattern) Date.SF.setPattern(pattern);
		    return Date.SF.format(this, isUTC);
	    };

	    Date.$parse = function(datestr, pattern, symbols, isUTC){
		    if(pattern) Date.SF.setPattern(pattern);
		    if(symbols) Date.SF.setSymbols(symbols);
		    return Date.SF.parse(datestr, isUTC);
	    };
    }
    
}).$delay(this, 0);
