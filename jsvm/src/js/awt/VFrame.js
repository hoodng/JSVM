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

js.awt.VFrame = function(def, Runtime){

    var CLASS = js.awt.VFrame, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    thi$.setContent = function(html, href){
        if(!_destroyScope.call(this)) return;

        this.scope = new js.awt.ScriptScope(
            this.getPeerComponent() || this);

        var script, testre = /<script\b[\s\S]*?>([\s\S]*?)<\/script/i;

        // Remove content within <!-- -->
        html = html.replace(/<!--[\s\S]*?-->/g, "");

        this.view.innerHTML = html.replace(
                /<script.*?>[\s\S]*?<\/.*?script>/gi, "");

        if (testre.test(html)) {
            var re = /<script\b[\s\S]*?>([\s\S]*?)<\/script/gi;
            while ((script = re.exec(html))) {
                this.scope.exec(script[1]);
            }
        }
        
        if(href == undefined){
            _convert.call(this, this.view, this.scope);    
        }

        this.scope.fireEvent("load");
    };

    var _destroyScope = function(){
        var scope = this.scope;

        if(Class.typeOf(scope) != "object") return true;

        if(typeof scope.onunload == "function"){
            if(!scope.onunload()) return false;
        }

        scope.destroy();
        this.scope = null;
        return true;
    };

    var _convert = function(o, scope) {
        var evnames = ['onchange', 'onsubmit', 'onreset', 'onselect', 'onblur',
                       'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onclick',
                       'ondblclick', 'onmousedown', 'onmousemove', 'onmouseout',
                       'onmouseover', 'onmouseup'];
        var code;
        function attachEventCode(code, scope) {
            /*
             * for IE <=7.. it may (MAY) cause conflicts if _convert is called
             * against a three containing objects with events attached
             */
            if (typeof code != "string") {
                code = code.toString();
                code = code.substr(code.indexOf("{") + 1);
                code = code.substr(0, code.lastIndexOf("}"));
            }
            return function(e) {
                e = e || window.event;
                eval("var event_attribute = function(e, scope){" + code + "}");
                return event_attribute.call(scope, e, scope);
            };
        };

        var elements = o.getElementsByTagName("*");
        for (var a = 0; a < elements.length; a++) {
            var c = elements[a];
            for (var b = 0; b < evnames.length; b++) {
                if (c.getAttribute && (code = c.getAttribute(evnames[b]))) {
                    c[evnames[b]] = attachEventCode(code, scope);
                }
            }

            if (c.tagName == 'A' && c.target == ""
                && (code = c.getAttribute("href"))) {
                if (code.toLowerCase() != 'javascript:void(0)' && code != '#') {
                    c.onclick = (function(w, c) {
                                     return function() {
                                         w.setSrc(c);
                                         w.load();
                                         return false;
                                     };
                                 })(this, code);
                }
            }
        }
    };

    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.VFrame";
        def.className = def.className || "jsvm_vframe";

        var layout = def.layout = def.layout || {};
        layout.classType = layout.classType || "js.awt.BorderLayout";

        arguments.callee.__super__.apply(this, arguments);
        
        if(def.src){
            this.setSrc(def.src);
        }
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Container).$implements(js.awt.Frame);

