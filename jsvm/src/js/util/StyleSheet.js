/**

  Copyright 2010-2011, The JSVM Project. 
  All rights reserved.
  
 *
 * Author: hudong@dong.hu@china,jinfonet.com
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
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
        System = J$VM.System, J$VMCSS = "/***__j$vm-css__***/";
    
    thi$.applyCSS = function(css){
        var styleEle = DOM.getStyleSheetElement(this.nativeSheet);

        if(styleEle.styleSheet){
            // IE ?
            try{
                styleEle.styleSheet.cssText =
                    comboCSSCode(styleEle.styleSheet.cssText, css);
            } catch (x) {

            }
        }else{
            // W3C
            styleEle.textContent = comboCSSCode(styleEle.textContent, css); 
            
        }

        this._syncUpdate();
    };

    var comboCSSCode = function(ori, css){
        var codes = ori.split(J$VMCSS),ret=[];
        for(var i=0, len=codes.length; i<len; i++){
            if(i==0){
                ret.push(codes[0]);
                ret.push(J$VMCSS);
                ret.push(css);
                ret.push(J$VMCSS);
            }else if(i==1){
                continue;
            }else{
                ret.push(codes[i]);
            }
        }
        return ret.join("\r\n");
    };
    
    thi$.getRule = function(selector){
        return this.rules[selector];
    };
    
    /**
     * @param selector, selector name
     * @param style {
     *   border-width: 10px
     * }
     */
    thi$.addRule = function(selector, style){
        style = style || {};
        
        var rule = this.getRule(selector), sheet, rules, cssText;
        if(Class.isObject(rule)){
            cssText = DOM.toCssText(style);
            rule.style.cssText = cssText;
        }else{
            sheet = this.nativeSheet;
            rules = sheet.cssRules || sheet.rules;
            cssText = DOM.toCssText(style);

            if(sheet.insertRule){
                // W3C
                sheet.insertRule(
                    [selector, "{", cssText, "}"].join(""), 
                    rules.length);
                
            }else if(sheet.addRule){
                // IE
                sheet.addRule(selector, cssText, rules.length);            
            }
            
            rule = this.rules[selector] = {selector: selector,
                                           style:rules[rules.length-1].style};
        }

        return rule;
    };

    var _parseSheet = function(sheet, rules){
        var cssrules = sheet.cssRules || sheet.rules,
            rule, i, len, selector;
        
        for(i=0, len=cssrules.length; i<len; i++){
            rule = cssrules[i];
            selector = rule.selectorText;
            rules[selector] = {
                selector: selector,
                style: rule.style
            }
        }
    };
    
    thi$.destroy = function(){
        this.nativeSheet = null;
        this.id = null;
        this.href = null;        
        this.rules = null;
    };

    thi$._syncUpdate = function(){
        var nativeSheet = DOM._findNativeStyleSheet(this.id, this.href);
        if(nativeSheet !== this.nativeSheet){
            this._init(nativeSheet);
        }
        return this;
    };

    thi$._init = function(nativeSheet){
        this.nativeSheet = nativeSheet;
        this.id = DOM.getStyleSheetElement(nativeSheet).id;
        this.href = nativeSheet.href;
        this.rules = {};
        
        _parseSheet.call(this, nativeSheet, this.rules);
    };
    
    this._init.apply(this, arguments);

}.$extend(js.lang.Object);
