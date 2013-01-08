/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * @File: Locale.js
 * @Create: 2012/12/26 06:22:48
 * @Author: mingfa.pan@china.jinfonet.com
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

js.util.Locale.getDateSymbols = function(locale){
    var res, symbols;
    if(locale && locale instanceof js.util.Locale){
        res = js.lang.Class.forName("js.text.resources." + locale.toString());
        symbols = res ? res.dateSymbols : undefined;
    }
    
    return symbols;
};

js.util.Locale.getNumberSymbols = function(locale){
    var res, symbols;
    if(locale && locale instanceof js.util.Locale){
        res = js.lang.Class.forName("js.text.resources." + locale.toString());
        symbols = res ? res.numrSymbols : undefined;
    }
    
    return symbols;
};
