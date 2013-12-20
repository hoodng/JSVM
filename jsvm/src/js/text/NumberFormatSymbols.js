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
js.text.NumberFormatSymbols = function(symbols){

    var CLASS = js.text.NumberFormatSymbols, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;

    CLASS.Default = {
        zero: "0",

        grouping: ",",

        decimal: ".",
        
        perMill: "\u2030", //
        
        percent: "%",
        
        digit: "#",
        
        minus: "-",
        
        currency: "$",
        
        intlCurrency: "\u00A4"
    };
    
    /**
     * Gets the character used for zero. Different for Arabic, etc.
     */
    thi$.getZeroDigit = function(){
        return this.symbols.zero;
    };
    
    /**
     * Gets the character used for thousands separator. Different for French, etc.
     */
    thi$.getGroupingSeparator = function(){
        return this.symbols.grouping;
    };

    /**
     * Gets the character used for decimal sign. Different for French, etc.
     */
    thi$.getDecimalSeparator = function() {
        return this.symbols.decimal;
    };
    
    /**
     * Gets the character used for per mille sign. Different for Arabic, etc.
     */
    thi$.getPerMill = function() {
        return this.symbols.perMill;
    };
    
    /**
     * Gets the character used for percent sign. Different for Arabic, etc.
     */
    thi$.getPercent = function() {
        return this.symbols.percent;
    };

    
    /**
     * Gets the character used for a digit in a pattern.
     */
    thi$.getDigit= function() {
        return this.symbols.digit;
    };
    
    /**
     * Gets the character used to represent minus sign. If no explicit
     * negative format is specified, one is formed by prefixing
     * minusSign to the positive format.
     */
    thi$.getMinusSign = function() {
        return this.symbols.minus;
    };
    
    /**
     * Returns the currency symbol for the currency of these
     * DecimalFormatSymbols in their locale.
     */
    thi$.getCurrencySymbol = function(){
        return this.symbols.currency;
    };
    
    /**
     * Returns the ISO 4217 currency code of the currency of these
     * DecimalFormatSymbols.
     */
    thi$.getInternationalCurrencySymbol = function(){
        return this.symbols.intlCurrency;
    };

    thi$._init = function(symbols){
        var syb = System.objectCopy(CLASS.Default, null);
        syb = System.objectCopy(symbols || {}, syb);
        
        this.symbols = syb;
    };
    
    this._init.apply(this, arguments);

}.$extend(js.lang.Object);

js.text.DefaultNumberSymbols = new js.text.NumberFormatSymbols();