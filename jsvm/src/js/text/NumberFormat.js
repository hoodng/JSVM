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

$import("js.text.Format");
/**
 * 
 */
js.text.NumberFormat = function(pattern, symbols){

    var CLASS = js.text.NumberFormat, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;

    /**
     * @see js.text.Format
     */    
    thi$.setPattern = function(pattern){
        var syb = this.symbols,
        grouping= syb.getGroupingSeparator(),
        minus   = syb.getMinusSign(), 
        decimal = syb.getDecimalSeparator(), 
        percent = syb.getPercent(),
        permill = syb.getPerMill(),
        digit   = syb.getDigit(),
        zero    = syb.getZeroDigit(),
        buf     = [];

        pattern = this.pattern = pattern || function(){
            // "#,###.##"
            buf.push(digit, grouping, digit,digit, digit, decimal, digit,digit);
            return buf.join("");
        };
        
        CLASS.infos = CLASS.infos || {};

        var info = CLASS.infos[pattern];
        if(info) return;
        
        info = CLASS.infos[pattern] = {};

        var phase = 0, 

        prefix  = info.prefix = [],
        surfix  = info.surfix = [],
        integer = info.integer= [],
        fraction= info.fraction=[];
        
        for(var i=0, len=pattern.length; i<len; i++){
            var c = pattern.charAt(i);
            switch(c){
            case digit:
            case zero:
            case grouping:
                if(phase == 0 || phase == 1){
                    phase = 1;
                    integer.push(c);
                }else if(phase == 2){
                    fraction.push(c);
                }else{
                    throw "Malformed pattern "+pattern;
                }
                break;
            case decimal:
                if(phase == 1 || phase == 0){
                    phase = 2;
                }else if(phase == 2){
                    throw "Malformed pattern "+pattern;
                }
                break;
            case percent:
                if(phase == 1 || phase == 2){
                    phase = 3;
                    info.percent = c;
                }
                surfix.push(c);
                break;
            case permill:
                if(phase == 1 || phase == 2){
                    phase = 3;
                    info.permill = c;
                }
                surfix.push(c);
                break;
            default:
                if(phase == 0){
                    prefix.push(c);
                }else{
                    phase = 3;
                    surfix.push(c);
                }
                break;
            }
        }
        
        for(i=integer.length-1; i>=0; i--){
            if(integer[i] != grouping) {
                continue;
            }else{
                info.groupsize = integer.length-1-i;
                break;
            }
        }
        
        
    }.$override(this.setPattern);
    
    /**
     * @see js.text.Format
     */     
    thi$.setSymbols = function(symbols){
        this.symbols = symbols || 
            new(Class.forName("js.text.NumberFormatSymbols"))();

    }.$override(this.setSymbols);

    /**
     * @see js.text.Format
     */
    thi$.format = function(value){
        if(!Class.isNumber(value)) return "NaN";

        var info= CLASS.infos[this.pattern], 
        syb     = this.symbols,
        grouping= syb.getGroupingSeparator(),
        minus   = syb.getMinusSign(), 
        decimal = syb.getDecimalSeparator(), 
        percent = syb.getPercent(),
        permill = syb.getPerMill(),
        digit   = syb.getDigit(),
        zero    = syb.getZeroDigit(),
        intl    = syb.getInternationalCurrencySymbol(),
        buf     = [],

        d = _parse.call(this, value.toString()),
        f0 = d.fraction.length, f1 = info.fraction.length, 
        i = parseInt(d.integer.join("")), s = i<0 ? -1:1,
        f = _digits2Number(d.fraction),
        b = Math.pow(10, f0), c;
        
        value = (Math.abs(i)*b)+f;
        value = info.percent ? value*100 : info.permill ? value*1000 : value;
        if(f1 < f0){
            value = Math.round(value/Math.pow(10, f0-f1));
            value /= Math.pow(10, f1);
        }else{
            value /= b;
        }

        d = _parse.call(this, value.toString());

        // Surfix
        var surfix = info.surfix; 
        for(i=surfix.length-1; i>=0; i--){
            c = surfix[i];
            buf.unshift(c);
        }

        // Fraction part
        for(i=info.fraction.length-1; i>=0; i--){
            c = d.fraction[i];
            if(c){
                buf.unshift(c);
            }else if(info.fraction[i] == zero){
                buf.unshift("0");
            }
            if(i==0){
                buf.unshift(decimal);
            }
        }

        // Integer part
        b = info.groupsize || Number.MAX_VALUE;
        for(i=d.integer.length-1; i>=0; i--){
            c = d.integer[i];
            buf.unshift(c);

            b--;

            if(b==0 && i>0){
                buf.unshift(grouping);
                b = info.groupsize;
            }
        }

        // Prefix
        var prefix = info.prefix;
        for(i=prefix.length-1; i>=0; i--){
            c = prefix[i];
            if(c == intl){
                buf.unshift(syb.getCurrencySymbol());
            }else{
                buf.unshift(c);
            }
        }

        buf.unshift(s == -1 ? minus : "");
        
        return buf.join("");;
        
    }.$override(this.format);

    var _parse = function(str){
        var syb = this.symbols,
        grouping = syb.getGroupingSeparator(),
        minus = syb.getMinusSign(), 
        decimal = syb.getDecimalSeparator(), 
        percent = syb.getPercent(),
        permill = syb.getPerMill(),
        
        ret = {
            isNaN: true,
            integer: [],
            fraction: []
        },
        integer =  ret.integer, 
        fraction = ret.fraction,
        
        c, phase = 0;
        
        for(var i=0, len=str.length; i<len; i++){
            c = str.charAt(i);
            switch(c){
            case "+":
            case minus:
                if(phase == 0){
                    integer.push(c);
                }else{
                    // For now, don't support Exponent
                    return ret;
                }
                break;
            case "0": case "1": case "2": case "3": case "4": 
            case "5": case "6": case "7": case "8": case "9":
                if(phase == 0){
                    integer.push(c);
                }else if(phase == 1){
                    fraction.push(c);
                }else{
                    return ret;
                }
                break;
            case decimal:
                if(phase == 0){
                    phase = 1;
                }else{
                    return ret;                    
                }
                break;
            case percent:
                if(phase != 2){
                    ret.percent = c;
                    phase = 2;
                }else{
                    return ret;
                }
                break;
            case permill:
                if(phase != 2){
                    ret.permill = c;
                    phase = 2;
                }else{
                    return ret;
                }
                break;
            default:
                break;
            }
        }

        ret.isNaN = false;

        return ret;
    };
    
    var _digits2Number = function(array){
        var ret = 0;
        for(var i=0, len=array.length; i<len; i++){
            ret += (array[i]*Math.pow(10, len-1-i));
        }
        return ret;
    };

    /**
     * @see js.text.Format
     */
    thi$.parse = function(str){
        if(!Class.isString(str)) return Number.NaN;

        var d = _parse.call(this, str);
        if(d.isNaN){
            return NaN;
        }

        var integerStr = d.integer.join(""), 
        i = parseInt(integerStr), 
        s = integerStr.indexOf("-") != -1 ? -1 : 1,
        f = _digits2Number(d.fraction), 
        b = Math.pow(10, d.fraction.length);

        f = s*(Math.abs(i*b)+f)/b;
        
        f = d.percent ? f/100 : (d.permill ? f/1000 : f);
        
        return f;
        
    }.$override(this.parse);
    
    thi$._init = function(pattern, symbols){
        this.setSymbols(symbols);
        this.setPattern(pattern);
    };
    
    this._init.apply(this, arguments);

}.$extend(js.text.Format);

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

