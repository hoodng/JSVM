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
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.util");

/**
 * A <em>Locale</em> object represents a specific geographical, political,
 * or cultural region.
 */
js.util.Locale = function(language, country){
    var CLASS = js.util.Locale,
    thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var C = js.lang.Class, System = J$VM.System;


	CLASS.getDateSymbols = function(locale){
		var res, symbols;
		if(locale && locale instanceof CLASS){
			res = C.forName("js.text.resources." + locale.toString());
			symbols = res ? res.dateSymbols : undefined;
		}
		
		return symbols;
	};

	CLASS.getNumberSymbols = function(locale){
		var res, symbols;
		if(locale && locale instanceof CLASS){
			res = C.forName("js.text.resources." + locale.toString());
			symbols = res ? res.numrSymbols : undefined;
		}
		
		return symbols;
	};

    /**
     * Sets the language of current Locale. Language always be lower case. 
     * If the specified language isn't be the valid string, a blank string 
     * will be used.     
     * 
     * @param language: {String} 2 or 3 letter language code.
     */
    thi$.setLanguage = function(language){
        this.language = C.isString(language) ? language : "";
    };
    
    /**
     * Returns the language code of this Locale.
     *
     * @return The language code, or the empty string if none is defined.
     */
    thi$.getLanguage = function(){
        return this.language ? this.language.toLowerCase() : "";
    };
    
    /**
     * Sets the country for the Locale. Country always be upper case.
     * If the specified country isn't be the valid string, a blank string
     * will be used.
     * 
     * @param country: {String} An ISO 3166 alpha-2 country code or a UN M.49 
     *        numeric-3 area code.
     */
    thi$.setCountry = function(country){
        this.country = C.isString(country) ? country : "";  
    };
    
    /**
     * Returns the country code of this Locale.
     * 
     * @return The country code, or the empty string if none is defined.
     */
    thi$.getCountry = function(){
        return this.country ? this.country.toUpperCase() : "";
    };
    
    thi$.equals = function(locale){
        return locale && (locale.getLanguage() === this.getLanguage()) 
            && (locale.getCountry() === this.getCountry());
    };
    
    thi$.toString = function(){
        var language = this.getLanguage(), 
        country = this.getCountry(),
        symbol = (language && country) ? "_" : "",
        buf = [];
        
        buf.push(language);
        buf.push(symbol);
        buf.push(country);
        
        return buf.join("");
    };
    
    thi$._init = function(language, country){
        if(!C.isString(language) && !C.isString(country)){
            return;
        }
        
        this.setLanguage(language);
        this.setCountry(country);
    };
    
    this._init.apply(this, arguments);
};

