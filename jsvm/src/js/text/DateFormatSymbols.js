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

js.text.DateFormatSymbols = function(symbols){

    var CLASS = js.text.DateFormatSymbols, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, System = J$VM.System;
    
    CLASS.Default = {
        eras : ["BC", "AD"],

        lMonths:["January", "February", "March", "April", 
                 "May", "June", "July", "August", 
                 "September", "October", "November", "December"],
        sMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
                  "Sep", "Oct", "Nov", "Dec"],

        lWeekdays:["Sunday", "Monday", "Tuesday", "Wednesday", 
                   "Thursday", "Friday", "Saturday"],
        sWeekdays:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

        ampm: ["AM", "PM"]
    };

    /**
     * Gets era strings. For example: "BC" and "AD".
     * 
     * @return the era strings array.
     */
    thi$.getEras = function(){
        return this.symbols.eras;
    };

    /**
     * Gets month strings. For example: "January", "February", etc.
     * 
     * @return the month strings array.
     */
    thi$.getMonths = function(){
        return this.symbols.lMonths;
    };


    /**
     * Gets short month strings. For example: "Jan", "Feb", etc.
     * 
     * @return the short month strings.
     */
    thi$.getShortMonths = function(){
        return this.symbols.sMonths;
    };


    /**
     * Gets weekday strings. For example: "Sunday", "Monday", etc.
     * 
     * @return the weekday strings array.
     */
    thi$.getWeekdays = function(){
        return this.symbols.lWeekdays;
    };

    /**
     * Gets short weekday strings. For example: "Sun", "Mon", etc.
     * 
     * @return the short weekday strings array.
     */
    thi$.getShortWeekdays = function(){
        return this.symbols.sWeekdays;
    };

    /**
     * Gets ampm strings. For example: "AM" and "PM".
     * 
     * @return the ampm strings array.
     */
    thi$.getAmPmStrings = function() {
        return this.symbols.ampm;
    };

    thi$._init = function(symbols){
        var syb = System.objectCopy(CLASS.Default, null, true);
        syb = System.objectCopy(symbols || {}, syb, true);

        var _ = js.util.LinkedList;
        _.$decorate(syb.eras);
        _.$decorate(syb.lMonths);
        _.$decorate(syb.sMonths);
        _.$decorate(syb.lWeekdays);
        _.$decorate(syb.sWeekdays);
        _.$decorate(syb.ampm);

        this.symbols = syb;
    };
    
    this._init.apply(this, arguments);

}.$extend(js.lang.Object);

