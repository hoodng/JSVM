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
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.util");

/**
 * 
 */
js.util.StyleSheet = function(nativeSheet){

    var CLASS = js.util.StyleSheet, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;
    
    /**
     * @param style {
     *     borderLeftWidth: "10px" // or border-left-width : "10px"
     * }
     * 
     * @return "border-left-width:10px;"
     */
    CLASS.styleToString = function(style){
        var p, v,ret = [];
        if(Class.isObject(style)){
            for(p in style){
                v = style[p];
                p = DOM.hyphenName(p);
                ret.push(p,":",v,";");
            }
        }
        return ret.join("");
    };

    thi$.getRule = function(selector){
        var rule = this.rules[selector];
        if(!rule){
            
        }
    };
    
    /**
     * @param name, selector name
     * @param style {
     *   border-width: 10px
     * }
     */
    thi$.addRule = function(name, style){
        var sheet = this.sheet, 
        rules = sheet.cssRules || sheet.rules,
        cssText = CLASS.styleToString(style);

        if(sheet.addRule){
            // IE
            sheet.addRule(name, cssText);
        }else{
            // Others
            sheet.insertRule(
                [name, "{", cssText, "}"].join(""), 
                sheet.cssRules.length-1);
        }

        this.rules[name] = rules[rules.length-1].style;
    };

    thi$.delRule = function(selector){
        var sheet = this.sheet;
        
        delete this.rules[selector];
    };
    
    var _parseSheet = function(sheet, rules){
        var cssrules = sheet.cssRules || sheet.rules, rule, i, len,
        selector, tmpA, j, jn;

        for(i=0, len=cssrules.length; i<len; i++){
            rule = cssrules[i];
            tmpA = rule.selectorText.split(",");
            for(j=0, jn=tmpA.length; j<jn; j++){
                selector = tmpA[j].trim();
                if(selector.length >0){
                    rules[selector] = {
                        selector: selector,
                        style: rule.style
                    };
                }
            }
        }
    };
    
    thi$.destroy = function(){
        delete this.sheet;
        delete this.rules;
        
        arguments.callee.__super__.apply(this, arguments);
    }.$override(this.destroy);

    thi$._init = function(nativeSheet){
        this.sheet= nativeSheet;
        this.name = nativeSheet.title;
        this.rules = {};
        _parseSheet.call(this, nativeSheet, this.rules);
    };
    
    this._init.apply(this, arguments);

}.$extend(js.lang.Object);
