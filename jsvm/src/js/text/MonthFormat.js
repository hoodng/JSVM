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
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.text");

$import("js.text.Format");
/**
 * 
 */
js.text.MonthFormat = function(pattern, symbols){

    var CLASS = js.text.MonthFormat, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class;

    /**
     * Set format pattern
     * 
     * @param pattern pattern string
     */    
    thi$.setPattern = function(pattern){
        this.pattern = pattern || "MM";
    };
    
    /**
     * @see js.text.Format
     */     
    thi$.setSymbols = function(symbols){
        this.symbols = 
            new(Class.forName("js.text.DateFormatSymbols"))(symbols);

    }.$override(this.setSymbols);

    /**
     * Return a formatted string of a specified value
     * 
     * Notes: Subclass should override this method
     * 
     * @param value
     */
    thi$.format = function(value){
        var ret;
        switch(this.pattern){
        case "M":
            ret = (value + 1)+"";
            break;
        case "MM":
            ret = this._pad((value+1), 2);
            break;
        case "MMM":
            ret = this.symbols.getShortMonths()[value];
            break;
        default:
            ret = this.symbols.getMonths()[value];            
            break;
        }
        return ret;
    };
    
    this._init.apply(this, arguments);

}.$extend(js.text.Format);

