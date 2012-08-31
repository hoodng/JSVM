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

js.lang.System = function (env, vm){

    var props, os;

    this.currentTimeMillis = function(){
        return (new Date()).getTime();
    };

    this.getProperties = function(){
        return props;
    };

    this.getProperty = function(key, defaultValue){
        return props.getProperty(key, defaultValue);
    };

    this.setProperty = function(key, value){
        props.setProperty(key, value);
    };

    this.setOut = function(print){
        os = print;
    };

    this.out = function(){
        return {
            println : function(s){
                if(os) os.info(s);
            }
        };
    }();

    this.err = function(){
        return {
            println : function(s){
                if(os) os.error(s);
            }
        };
    }();

    this.log = function(){
        return{
            println : function(s){
                var $ = props.getProperty("j$vm_log", false);
                if(os && $ === true ) os.log(s);
            }
        };
    }();
    
    this.exit = function(){
        this.gc();
        
        if(self.opener){
            window.close();        
        }else{
            self.opener = self;
            window.close();
        }
    };
    
    /**
     * Copy the source object to the destination object.
     * 
     * @param src, the source object, can be any type
     * @param des, the destination object, can be null, undefined 
     * or same type as the src object.
     * @param deep, whether deep copy
     * @param merge, whether merge copy
     * 
     * @see arrayCopy(src, srcPos, des, desPos, length, deep)
     */
    this.objectCopy = function(src, des, deep, merge){
        var typeOf = js.lang.Class.typeOf, t = typeOf(src), item;
        switch(t){
        case "object":
            des = (des === null || des === undefined) ? {} : des;

            for(var p in src){
                item = src[p];
                if(deep === true){
                    switch(typeOf(item)){
                    case "object":
                        if(merge === true){
                            des[p] = this.objectCopy(item, des[p], deep, merge);
                        }else{
                            des[p] = this.objectCopy(item, null, deep);    
                        }
                        break;
                    case "array":
                        des[p] = 
                            this.arrayCopy(item, 0, [], 0, item.length, deep);
                        break;
                    default:
                        des[p] = item;
                    }
                }else{
                    des[p] = item;    
                }
            }
            break;
        case "array":
            des = this.arrayCopy(src, 0, des, 0, src.length, deep);
            break;
        default:
            des = src;
            break;
        }

        return des;

    }.$bind(this);
    
    /**
     * Copy the source array to the destination array.
     * 
     * @param src, the source array
     * @param srcPos, the start position of the source array
     * @param des, the destination array
     * @param desPos, the start position of the destination array
     * @param length, the amount of itmes need copy
     * @param deep, whether deep copy
     * 
     * @see objectCopy(src, des, deep)
     */
    this.arrayCopy = function(src, srcPos, des, desPos, length, deep){
        var typeOf = js.lang.Class.typeOf,
        srcIdx = srcPos, desIdx = desPos, item;
        
        des = (des === null || des === undefined) ? [] : des;

        for(var i=0; i<length; i++){
            if(srcIdx > src.length-1) break;

            item = src[srcIdx];

            if(deep === true){
                switch(typeOf(item)){
                case "object":
                    des[desIdx++] = 
                        this.objectCopy(item, null, deep);
                    break;
                case "array":
                    des[desIdx++] = 
                        this.arrayCopy(item, 0, [], 0, item.length, deep);
                    break;
                default:
                    des[desIdx++] = item;
                    break;
                }
            }else{
                des[desIdx++] = item;
            }

            srcIdx ++;
        }

        return des;

    }.$bind(this);
    
    this.gc = function(){
        if(J$VM.ie){
            CollectGarbage();
        }
    };
    
    var last = 0;
    this.checkThreshold = function(now, newThreshold){
        if((now - last) > 
            (newThreshold ? newThreshold : 
             this.getProperty("j$vm_threshold", 45))){
            last = now;
            return true;
        }

        return false;
    };

    var _buildEnv = function(){
        var script = document.getElementById("j$vm");
        if (script) {
            var attrs = script.attributes, name, value;
            for(var i=0, len=attrs.length; i<len; i++){
                name = attrs[i].nodeName; value = attrs[i].nodeValue;
                switch(name){
                case "src":
                case "crs":
                    var p = value.lastIndexOf("/");
                    this.setProperty("j$vm_home", value.substring(0,p));
                    break;
                case "classpath":
                    value = value.replace(/(\s*)/g, "");
                    this.setProperty("j$vm_classpath", value);
                    break;
                default:
                    if(name.indexOf("-d") == 0 || 
                       name.indexOf("-D") == 0){
                        var tmp = parseInt(value);
                        value = isNaN(tmp) ? 
                            (value === "true" ? true :
                             (value === "false" ? false : value)) : tmp;

                        this.setProperty(name.substring(2).toLowerCase(), value);
                    }
                    break;
                }
            }
            
            vm.uuid(js.lang.Math.uuid());
            vm.id = vm.uuid();

        } else {
            throw new Error("Can't not found J$VM home");
        }

    };

    var _buildWorkerEnv = function(){
        var path = vm.env.uri.path;
        var p = path.indexOf("/classes/js/util/Worker.jz");
        p = p == -1 ? path.indexOf("/src/js/util/Worker.js") : p;
        vm.env.j$vm_home = path.substring(0, p);
        vm.uuid(js.lang.Math.uuid());
    };

    var _checkBrowser = function(){
        // Check browser supports
        vm.supports = {reliableMarginRight :true, supportCssFloat : true};
        var buf = [], doc = document, div = doc.createElement('div');
        buf.push('<div style="height:30px;width:50px;left:0px;">');
        buf.push('<div style="height:20px;width:20px;"></div></div>');
        buf.push('<div style="float:left;"></div>');
        div.innerHTML = buf.join("");
        div.style.cssText = "position:absolute;width:100px;height:100px;"
            + "border:5px solid black;padding:5px;"
            + "visibility:hidden;";
        doc.body.appendChild(div);
        
        var view = doc.defaultView, ccdiv = div.firstChild.firstChild;
        if(view && view.getComputedStyle 
           && (view.getComputedStyle(ccdiv, null).marginRight != '0px')){
            vm.supports.reliableMarginRight = false;
        }

        vm.supports.supportCssFloat = !!div.lastChild.style.cssFloat;
        vm.supports.borderBox = !(div.offsetWidth > 100);

        doc.body.removeChild(div);
        div = view = undefined;
    };
    
    var _detectDoctype = function(){
        var re=/\s+(X?HTML)\s+([\d\.]+)\s*([^\/]+)*\//gi, 
        doctype = vm.doctype = {declared: false};

        if(typeof document.namespaces != "undefined"){
            value = document.all[0].nodeType == 8
                ? document.all[0].nodeValue : null;
            if(value && (value.toLowerCase().indexOf("doctype") != -1)){
                doctype.declared = true;
            }
        }else{
            if(document.doctype != null){
                doctype.declared = true;
                value = document.doctype.publicId;
            }
        }
        
        try{
            if(doctype.declared && re.test(value) && RegExp.$1){
                doctype["xhtml"] = (RegExp.$1).toUpperCase();
                doctype["version"] = RegExp.$2;
                doctype["importance"] = RegExp.$3;
            }
        }catch(e){}
    };
    
    var _onload = function(e){
        J$VM.System.out.println("J$VM load...");

        _checkBrowser.call(this);
        _detectDoctype.call(this);

        var Event = js.util.Event, dom = vm.hwnd.document;
        Event.attachEvent(dom, "keydown", 0, this, _onkeyevent);
        Event.attachEvent(dom, "keyup",   0, this, _onkeyevent);

        var proc, scope, i, len, body;;
        for(i=0, len=scopes.length; i<len; i++){
            proc = scopes[i];
            scope = vm.runtime[proc.id];
            if(scope === undefined){
                scope = vm.runtime[proc.id] = function(){
                    var clazz = js.lang.Class.forName("js.awt.Desktop");
                    return clazz ? new (clazz)(proc.container) : 
                        new js.lang.NoUIRuntime();
                }();
                scope.id = proc.id;
            }
            
            proc.fn.call(scope, this);
        }
    };

    this.forceInit = function(){
        _onload.call(this);
    };
    
    var _onbeforeunload = function(){
        
    };

    var _onunload = function(e){
        J$VM.System.out.println("J$VM unload...");

        var Event = js.util.Event, dom = vm.hwnd.document;
        var scopes = vm.runtime, scopeName, scope;
        for(scopeName in scopes){
            scope = scopes[scopeName];
            if(js.lang.Class.isFunction(scope.beforeUnload)){
                scope.beforeUnload.call(scope);
            }
            scope.destroy();
        }
        delete vm.runtime;

        this.gc();

        J$VM = undefined;
        js = undefined;
        com = undefined;

        dom.body.innerHTML = "";
    };
    
    var bodyW, bodyH;
    var _onresize = function(e){
        var DOM = J$VM.DOM,
        bounds = DOM.getBounds(document.body);
        if(bounds.width != bodyW || bounds.height != bodyH){
            bodyW = bounds.width;
            bodyH = bounds.height;
            var scopes = vm.runtime, scopeName, scope;
            for(scopeName in scopes){
                scope = scopes[scopeName];
                scope.fireEvent.call(scope, e);
            }
        }
    };

    var _onmessage = function(e){
        var _e = e.getData();
        if(_e.source == self) return;
        
        var msg;
        try{
            msg = JSON.parse(_e.data);    
        } catch (x) {
        }
        
        if(js.lang.Class.isArray(msg)){
            e.message = msg[1];
            J$VM.MQ.post(msg[0], e, msg[2], null, msg[4]);    
        }
    };

    var _onkeyevent = function(e){
        J$VM.MQ.post("js.awt.event.KeyEvent", e);        
    };

    var scopes = [];
    var _exec = function(instName, fn, containerElement){
        if(vm.runtime === undefined){
            vm.runtime = {};
        }
        
        scopes.push({id: instName, fn: fn, container: containerElement});
    };
    
    var _boot = function(env){
        var Class = js.lang.Class, mainClass,
        mainClasName = this.getProperty("mainclass"),
        mainFuncName = this.getProperty("mainfunction");

        if(mainClasName){
            mainClass = Class.forName(mainClasName);
            if(!mainClass) return;
            J$VM.exec(mainClasName, 
                      function(){
                          this.initialize();
                          (new mainClass()).main(this);
                      });
        }else if(typeof window[mainFuncName] == "function"){
            J$VM.exec(mainFuncName, 
                      function(){
                          this.initialize();
                          window[mainFuncName].call(this, this);
                      });
        }

        this.objectCopy((env || {}), props);

    };
    
    var _init = function(env, vm){
        var E = js.util.Event;
        props = new js.util.Properties(env);

        vm.Class = js.lang.Class;
        vm.MQ = new js.util.Messenger();
        
        if(!vm.env.j$vm_isworker){
            _buildEnv.call(this);

            os = self.console ? self.console : null;
            vm.hwnd = self;
            vm.DOM = new js.util.Document();

            vm.storage = {
                local  : js.util.Storage.getStorage("local"),
                session: js.util.Storage.getStorage("session"),
                cookie : new js.util.CookieStorage()
            };

            vm.exec = function(instName, fn, containerElement){
                if(typeof fn != "function") 
                    throw "The second parameter must be a function";

                return _exec.call(this,instName, fn, containerElement);

            }.$bind(this);
            
            vm.boot = function(){
                return _boot.apply(this, arguments);
            }.$bind(this);

            E.attachEvent(vm.hwnd, E.W3C_EVT_LOAD,   0, this, _onload);
            //E.attachEvent(vm.hwnd, "beforeunload", 0, this, _onbeforeunload);
            E.attachEvent(vm.hwnd, E.W3C_EVT_UNLOAD, 0, this, _onunload);
            E.attachEvent(vm.hwnd, E.W3C_EVT_RESIZE, 0, this, _onresize);
            E.attachEvent(vm.hwnd, E.W3C_EVT_MESSAGE,0, this, _onmessage);

        }else{
            // Because Web Worker can not use consle to output, so we can use our MQ
            // to post message to main window.
            os = new function(){
                var post = vm.MQ.post;

                this.info = function(s){
                    post(E.SYS_MSG_CONSOLEINF, s, [], self, 1);
                };

                this.error = function(s){
                    post(E.SYS_MSG_CONSOLEERR, s, [], self, 1);
                };

                this.log = function(s){
                    post(E.SYS_MSG_CONSOLELOG, s, [], self, 1);
                };
                
            }();

            _buildWorkerEnv.call(this);
        }
    };
    
    if(env != undefined && vm != undefined){
        _init.apply(this, arguments);
    }

}.$extend(js.lang.Object);

