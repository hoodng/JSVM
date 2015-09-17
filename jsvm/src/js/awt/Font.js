/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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
        var buf = [], v, h;

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

        v = parseInt(this.fontSize);
        v = Class.isNumber(v) ? v : 10;
        v += "px";
        
        h = parseInt(this.lineHeight);
        if(Class.isNumber(h)){
            v += ("/" + h + "px");
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

(function(CLASS){

    CLASS.Attrs = [
        "fontStyle", 
        "fontVariant", 
        "fontWeight", 
        "fontSize", 
        "fontFamily"];

    CLASS.Style = {
        normal: "normal",
        italic: "italic",
        oblique: "oblique"
    };

    CLASS.Variant = {
        normal: "normal",
        "small-caps": "small-caps"
    };

    CLASS.Weight = {
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
    CLASS.parseFont = function(str){
        var s = str.split(" "), font = new (CLASS)(),
            tmp, v;
        
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
            if(CLASS.Weight[tmp]){
                font.fontWeight = CLASS.Weight[tmp];
            }else if (CLASS.Variant[tmp]){
                font.fontVariant = tmp;
            }else if(CLASS.Style[tmp]){
                font.fontStyle = tmp;
            }
        }

        if(s.length > 0){
            tmp = s.pop();
            if (CLASS.Variant[tmp]){
                font.fontVariant = tmp;
            }else if(CLASS.Style[tmp]){
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
     * Initialize a font object with the specified font styles.
     */
    CLASS.initFont = function(fontStyles){
        var font;
        if(typeof fontStyles == "object"){
            font = new (CLASS)(
                fontStyles["fontFamily"],
                fontStyles["fontSize"], 
                fontStyles["fontStyle"],
                fontStyles["fontWeight"], 
                fontStyles["fontVariant"],
                fontStyles["lineHeight"]);
        }else{
            font = new (CLASS)();
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
    CLASS.FFCANVASFONTWEIGHTS = {
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

    /**
     * convert from FontDef.java
     */
    CLASS.STYLE_BOLD = 1 << 0;

    CLASS.STYLE_ITALIC = 1 << 1;

    CLASS.isFontBold = function(fontStyle){
        return (fontStyle & CLASS.STYLE_BOLD) != 0;
    };

    CLASS.isFontItalic = function(fontStyle){
        return (fontStyle & CLASS.STYLE_ITALIC) != 0;
    };

    CLASS.getFontStyle = function(isBold, isItalic){
        var fontStyle = 0;

        if (isBold) {
            fontStyle |= CLASS.STYLE_BOLD;
        } else {
            fontStyle &= ~CLASS.STYLE_BOLD;
        }
        if (isItalic) {
            fontStyle |= CLASS.STYLE_ITALIC;
        } else {
            fontStyle &= ~CLASS.STYLE_ITALIC;
        }
        return fontStyle;
    };

})(js.awt.Font);