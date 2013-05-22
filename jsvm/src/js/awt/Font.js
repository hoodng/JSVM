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

$package("js.awt");

/**
 * 
 */
js.awt.Font = function(family, size, style, weight, variant){

    var CLASS = js.awt.Font, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;

    
    thi$.toString = function(){
        var buf = [], v;

        v = this.fontStyle;
        if(v && v !== "normal"){
            buf.push(v);
        }

        v = this.fontVariant;
        if(v && v !== "normal"){
            buf.push(v);
        }

        v = this.fontWeight;
        if(v && v !== "normal"){
            buf.push(CLASS.Weight[v]);
        }

        v = this.fontSize;
        v = Class.isNumber(v) ? v : 10;
        v += "px";
        if(this.lineHeight){
            v += ("/" + this.lineHeight + "px");
        }
        buf.push(v);
        
        v = this.fontFamily;
        v = v || "sans-serif";
        buf.push(v);

        return buf.join(" ");
    };

    thi$._init = function(family, size, style, weight, variant, lineHeight){
        this.fontFamily = family;
        this.fontSize   = size;
        this.lineHeight = lineHeight;
        this.fontStyle  = style;
        this.fontWeight = weight;
        this.fontVariant= variant;
    };
    
    this._init.apply(this, arguments);
};

js.awt.Font.Attrs = [
    "fontStyle", 
    "fontVariant", 
    "fontWeight", 
    "fontSize", 
    "fontFamily"];

js.awt.Font.Style = {
    normal: "normal",
    italic: "italic",
    oblique: "oblique"
};

js.awt.Font.Variant = {
    normal: "normal",
    "small-caps": "small-caps"
};

js.awt.Font.Weight = {
    normal: "normal",
    bold: "bold",
    bolder: "bolder",
    lighter: "ligher",
    "100": "normal",
    "200": "normal",
    "300": "normal",
    "400": "normal",
    "500": "normal",
    "600": "bold",
    "700": "bold",
    "800": "bold",
    "900": "bold"
};

/**
 * Parse js.awt.Font from css font string which like:
 * 
 * font-style font-variant font-weight font-size/line-height font-family
 *
 * "italic small-caps bold 16px Arial"
 */
js.awt.Font.parseFont = function(str){
    var s = str.split(" "), Font = js.awt.Font, 
        tmp, v, font = new Font();
    
    if(s.length > 0){
        font.fontFamily = s.pop();
    }

    if(s.length > 0){
        tmp = s.pop();
        tmp = tmp.split("/");
        font.fontSize = parseInt(tmp[0]);
        if(tmp.length > 1){
            font.lineHeight = parseInt(tmp[1]);
        }
    }
    
    if(s.length > 0){
        tmp = s.pop();
        if(Font.Weight[tmp]){
            font.fontWeight = Font.Weight[tmp];
        }else if (Font.Variant[tmp]){
            font.fontVariant = tmp;
        }else if(Font.Style[tmp]){
            font.fontStyle = tmp;
        }
    }

    if(s.length > 0){
        tmp = s.pop();
        if (Font.Variant[tmp]){
            font.fontVariant = tmp;
        }else if(Font.Style[tmp]){
            font.fontStyle = tmp;
        }
    }

    if(s.length > 0){
        tmp = s.pop();
        font.fontStyle = tmp;
    }

    return font;
};


/**
 * Ref: https://developer.mozilla.org/en-US/docs/CSS/font-weight
 * 
 * 100, 200, 300, 400, 500, 600, 700, 800, 900
 * Numeric font weights for fonts that provide more than just normal and bold. 
 * If the exact weight given is unavailable, then 600-900 use the closest available 
 * darker weight (or, if there is none, the closest available lighter weight), 
 * and 100-500 use the closest available lighter weight (or, if there is none, 
 * the closest available darker weight). This means that for fonts that provide only 
 * normal and bold, 100-500 are normal, and 600-900 are bold.
 */
js.awt.Font.FFCANVASFONTWEIGHTS = {
    "normal": "normal",
    "bold": "bold",
    "lighter": "lighter",
    "bolder": "bolder",
    "100": "normal",
    "200": "normal",
    "300": "normal",
    "400": "normal",
    "500": "normal",
    "600": "bold",
    "700": "bold",
    "800": "bold",
    "900": "bold"
};
