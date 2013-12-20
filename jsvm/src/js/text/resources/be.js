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
 * Author: hudong@dong.hu@china,jinfonet.com
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.text.resources");

js.text.resources.be = new function(){

    this.locale = "be";
    
    this.dateSymbols = {

        eras : ["да н.е.","н.е."],

        lMonths:["студзеня","лютага","сакавіка","красавіка","мая","чрвеня","ліпеня","жніўня","верасня","кастрычніка","лістапада","снежня",""],

        sMonths:["стд","лют","скв","крс","май","чрв","лпн","жнв","врс","кст","ліс","снж",""],

        lWeekdays:["нядзеля","панядзелак","аўторак","серада","чацвер","пятніца","субота"],

        sWeekdays:["нд","пн","ат","ср","чц","пт","сб"],

        ampm: ["AM","PM"]
    };

    this.numrSymbols = {

        zero: "0",

        grouping: " ",

        decimal: ",",
        
        perMill: "‰",
        
        percent: "%",
        
        digit: "#",
        
        minus: "-",
        
        currency: "XXX",
        
        intlCurrency: "XXX",

        currencySymbol: "¤"

    };

}();

