/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.util");

/**
 * A <em>Locale</em> object represents a specific geographical, political,
 * or cultural region.
 */
js.util.Locale = function(language, country){
	var CLASS = js.util.Locale,	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var C = js.lang.Class, System = J$VM.System;
	
	/**
	 * Return the special symbols with the specified locale. If no type
	 * given, return all symbols of the current locale.
	 *
	 * @param locael: {js.util.Locale} The Locale to ref.
	 * @param type: {String} The type of symbols to fetch.
	 */
	CLASS.getSymbols = function(locale, type){
		var res, symbols;
		if(locale && (locale instanceof CLASS)){
			res = C.forName("js.text.resources." + locale.toString());
			
			if(C.isString(type)){
				symbols = res ? res[type] : null;				  
			}else{
				symbols = res;
			}
		}
		
		return symbols;
	};
	
	CLASS.getDateSymbols = function(locale){
		return CLASS.getSymbols(locale, "dateSymbols");	
	};

	CLASS.getNumberSymbols = function(locale){
		return CLASS.getSymbols(locale, "numrSymbols");
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
	 *		  numeric-3 area code.
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
		    country = this.getCountry();
        return [language, country].join(country ? "_":"");
	};
	
	thi$._init = function(language, country){
		if(!C.isString(language) && !C.isString(country)){
            var nav = self.navigator, lang =
                nav.browserLanguage || nav.language;
            
            lang = lang.replace("-","_").split("_");
            language = lang[0];
            country = lang.length > 1 ? lang[1] : "";
		}
		
		this.setLanguage(language);
		this.setCountry(country);
	};
	
	this._init.apply(this, arguments);
};

