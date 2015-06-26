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
/**
 * @member js.lang
 * @class js.lang.System
 * @constructor
 * @singleton
 */

js.lang.System = function (env, vm){

    var props, os, lastAccessTime;

    /**
     * @method
     * Returns the current time in milliseconds.  Note that
     * while the unit of time of the return value is a millisecond,
     * the granularity of the value depends on the underlying
     * operating system and may be larger.  For example, many
     * operating systems measure time in units of tens of
     * milliseconds.
     *
     * @return  the difference, measured in milliseconds, between
     *          the current time and midnight, January 1, 1970 UTC.
     */
    this.currentTimeMillis = function(){
        return (new Date()).getTime();
    };

    /**
     * @method
     * Test the current system properties has specified property.
     *
     * @param {String} key
     * @return {Boolean}
     */
    this.hasProperty = function(key){
        return props.contains(key);
    };

    /**
     * @method
     * Determines the current system properties.
     *
     * @param {String} key
     * @return the system properties
     */
    this.getProperties = function(){
        return props;
    };

    /**
     * @method
     * Gets the system property indicated by the specified key.
     *
     * @param {String} key   the name of the system property.
     * @param {Any} defaultValue the default value if can not found this property.
     * @return     the value of the system property,
     */
    this.getProperty = function(key, defaultValue){
        return props.getProperty(key, defaultValue);
    };

    /**
     * @method
     * Sets the system property indicated by the specified key.
     *
     * @param {String} key   the name of the system property.
     * @param {Any} value the value of the system property.
     * @return     the previous value of the system property,
     */
    this.setProperty = function(key, value){
        props.setProperty(key, value);
        return this.getProperty(key);
    };

    /**
     * @method
     * Removes the system property indicated by the specified key.
     *
     * @param {String} key   the name of the system property to be removed.
     * @return     the previous string value of the system property,
     */
    this.removeProperty = function(key){
        return props.remove(key);
    };

    this.setOut = function(print){
        os = print;
    };

    /**
     * @property
     * The "standard" output stream. This stream is already
     * open and ready to accept output data. Typically this stream
     * corresponds to display output or another output destination
     * specified by the host environment or user.
     *
     * For example:
     *
     *     @example
     *     System.out.println("Hello, World");
     */
    this.out = function(){
        return {
            println : function(s){
                if(os) os.info(s);
            }
        };
    }();

    /**
     * @property
     * The "standard" error output stream. This stream is already
     * open and ready to accept output data.
     *
     * For example:
     *
     *     @example
     *     System.err.println("Hello, World");
     *
     */
    this.err = function(){
        return {
            println : function(s){
                if(os) os.error(s);
            }
        };
    }();

    /**
     * @property
     * The "standard" log output stream. This stream is already
     * open and ready to accept output data.
     *
     * For example:
     *
     *     @example
     *     System.err.println("Hello, World");
     *
     */
    this.log = function(){
        return{
            println : function(s){
                var $ = props.getProperty("j$vm_log", false);
                if(os && $ === true ) os.log(s);
            }
        };
    }();

    /**
     * @method
     * Terminates the currently running Java Virtual Machine. The
     * argument serves as a status code; by convention, a nonzero status
     * code indicates abnormal termination.
     */
    this.exit = function(){
        this.gc();
        window.open("","_self");
        window.close();
    };

    this.updateLastAccessTime = function(){
        lastAccessTime = this.currentTimeMillis();
    };

    this.getLastAccessTime = function(){
        return lastAccessTime;
    };

    this.getMaxInactiveInterval = function(){
        return this.getProperty("j$vm_max_inactive", 1800000);
    };

    this.setMaxInactiveInterval = function(interval){
        this.setProperty("j$vm_max_inactive", interval);
    };

    /**
     * Copy the source object to the destination object.
     * See also {@link #arrayCopy}
     *
     * @param {Object} src the source object, can be any type
     * @param {Object} des the destination object, can be null, undefined
     * or same type as the src object.
     * @param {Boolean} deep whether deep copy
     * @param {Boolean} merge whether merge copy
     *
     * @return {Object} the destination object
     *
     */
    this.objectCopy = function(src, des, deep, merge){
        var Class = js.lang.Class, item;
        switch(Class.typeOf(src)){
            case "object":
            des = (des === null || des === undefined) ? {} : des;

            for(var p in src){
                item = src[p];
                if(deep === true){
                    /* check if Object have _transient setting, all memeber in _transient setting
                     * will not be deep copy */
                    if (src._transient && src._transient[p]) {
                        continue;
                    }

                    switch(Class.typeOf(item)){
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

    };

    /**
     * Copy the source array to the destination array.
     * See also {@link #arrayCopy}
     *
     * @param {Array} src the source array
     * @param {Number} srcPos, the start position of the source array
     * @param {Array} des the destination array
     * @param {Number} desPos the start position of the destination array
     * @param {Number} length the amount of itmes need copy
     * @param {Boolean} deep whether deep copy
     *
     * @return {Array} the destination array
     */
    this.arrayCopy = function(src, srcPos, des, desPos, length, deep){
        var Class = js.lang.Class,
            srcIdx = srcPos, desIdx = desPos, item;

        des = (des === null || des === undefined) ? [] : des;

        for(var i=0; i<length; i++){
            if(srcIdx > src.length-1) break;

            item = src[srcIdx];

            if(deep === true){
                switch(Class.typeOf(item)){
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
            var attrs = script.attributes, uri, name, value, params, p;
            for(var i=0, len=attrs.length; i<len; i++){
                name = attrs[i].nodeName; value = attrs[i].value;
                switch(name){
                    case "src":
                    case "crs":
                    value = script.src || script.getAttribute("crs");
                    uri = new js.net.URI(value);
                    this.setProperty("j$vm_uri", uri);
                    params = uri.params;
                    for(p in params){
                        this.setProperty(p, params[p]);
                    }
                    
                    value = script.getAttribute("crs") || script.src;
                    if(value.indexOf("http") !==0){
                        // It is not an absolute path, so need construct j$vm_home
                        // with script.src and this "crs".
                        var srcpath = script.src;
                        p = srcpath.lastIndexOf("/");
                        srcpath = srcpath.substring(0, p+1);
                        value = srcpath + value;
                    }
                    // Use A tag to get a canonical path,
                    // here, jsut for compressing "../" in path.
                    p = value.lastIndexOf("/");
                    uri = document.createElement("A");
                    uri.href = value.substring(0, p+1);
                    this.setProperty("j$vm_home", uri.href);
                    vm.j$vm_home = uri.href;
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

            vm.uuid("j$vm_"+js.lang.Math.uuid());
            vm.id = vm.uuid();

        } else {
            throw new Error("Can't not found J$VM home");
        }

    };

    var _buildWorkerEnv = function(){
        var path = vm.env.uri.source,
            p = path.indexOf("classes/js/util/Worker.jz");
        vm.env.j$vm_home = vm.j$vm_home = path.substring(0, p);
        vm.uuid("j$vm_"+js.lang.Math.uuid());
        vm.id = vm.uuid();
    };

    var _checkBrowser = function(){
        /**
         * @member J$VM
         * @property {Properties} supports
         * Determines the current browser's abilities
         */
        // Check browser supports
        var supports = vm.supports
                     = {reliableMarginRight :true, supportCssFloat : true},
            buf = [], doc = document, div = doc.createElement('div'),
            ipt, obj;

        buf.push('<div style="height:30px;width:50px;left:0px;position:absolute;">');
        buf.push('<div style="height:20px;width:20px;"></div></div>');
        buf.push('<div style="float:left;"></div>');
        div.innerHTML = buf.join("");
        div.style.cssText = "position:absolute;width:100px;height:100px;"
                          + "border:5px solid black;padding:5px;"
                          + "visibility:hidden;";
        doc.body.appendChild(div);

        // Check browser supports for Input, Textarea
        ipt = doc.createElement('input');
        ipt.type = "text";
        ipt.style.cssText = "position:absolute;width:100px;height:100px;"
                          + "border:2px solid;visibility:hidden;";
        doc.body.appendChild(ipt);

        var view = doc.defaultView, cdiv = div.firstChild, ccdiv = cdiv.firstChild;
        if(view && view.getComputedStyle
                && (view.getComputedStyle(ccdiv, null).marginRight != '0px')){
            supports.reliableMarginRight = false;
        }

        /**
         * @member J$VM.supports
         * @property {Boolean} supportCssFloat
         *
         */
        supports.supportCssFloat = !!div.lastChild.style.cssFloat;
        /**
         * @member J$VM.supports
         * @property {Boolean} borderBox
         * Whether CSS box model is border-box
         */
        supports.borderBox = !(div.offsetWidth > 100);
        /**
         * @member J$VM.supports
         * @property {Boolean} borderEdg
         * Whether CSS box model is border-edge
         */
        supports.borderEdg = !(cdiv.offsetLeft == 0);
        /**
         * @member J$VM.supports
         * @property {Boolean} iptBorderBox
         * Whether BorderBox support of Input and Textarea
         */
        supports.iptBorderBox = !(ipt.offsetWidth > 100);
        /**
         * @member J$VM.supports
         * @property {Boolean} placeholder
         * Whether placeholder support of Input and Textarea
         */
        supports.placeholder = ("placeholder" in ipt);

        // Check scrollbars' thicknesses
        // Attention:
        // In firefox (win 19.0.2 1024 * 768), if there is no enough space(width, height) to show
        // the scrollbar, the scrollbar won't be display and its thickness is 0. So, the width of
        // the horizontal scrollbar should be large than (16px (left button) + 16px (right button)
        // + xpx (minwidth of the slider, maybe 2px)) and the width of div should be large than 51px
        // (include width of virtical scrollbar.)
        // Additionally, when screen resolution ratio (maybe dpi) is special, the scrollbar's thickness
        // and button may be more large. So we use a big size for div to check.
        div.innerHTML = "";
        div.style.cssText = "position:absolute;left:-550px;top:-550px;"
                          + "width:550px;height:550px;overflow:scroll;visibility:hidden;";
        obj = J$VM.DOM.hasScrollbar(div);
        /**
         * @member J$VM.supports
         * @property {Number} hscrollbar
         * Height of hscrollbar
         */
        supports.hscrollbar = obj.hbw;
        /**
         * @member J$VM.supports
         * @property {Number} vscrollbar
         * Width of vscrollbar
         */
        supports.vscrollbar = obj.vbw;

        // For IE, the dom element which has scrollbars should wider than the vscrollbar
        // and higher than the hscrollbar.

        /**
         * @member J$VM.supports
         * @property {Number} preHScrollEleH
         * For IE, the dom element which has scrollbars should wider than the vscrollbar
         * and higher than the hscrollbar.
         */
        supports.preHScrollEleH = supports.hscrollbar + (vm.ie ? 1 : 0);
        /**
         * @member J$VM.supports
         * @property {Number} preVScrollEleW
         * For IE, the dom element which has scrollbars should wider than the vscrollbar
         * and higher than the hscrollbar.
         */
        supports.preVScrollEleW = supports.vscrollbar + (vm.ie ? 1 : 0);
        /**
         * @member J$VM.supports
         * @property {Boolean} touchEnabled
         * Whether browser support touch events
         */
        supports.touchEnabled = (window.TouchEvent != undefined);
        /**
         * @member J$VM.supports
         * @property {Boolean} pointerEnabled
         * Whether browser support pointer events
         */
        supports.pointerEnabled = (window.PointerEvent != undefined);
        /**
         * @member J$VM.supports
         * @property {Boolean} mouseEnabled
         * Whether browser support mouse events
         */
        supports.mouseEnabled = (window.MouseEvent != undefined);


        // Dectect logical DPI of the browser
        div.innerHTML = "";
        div.style.cssText = "position:absolution;left:0px;top:0px;"
                          +"width:2.54cm;height:2.54cm;visibility:hidden;";
        if(!window.screen.logicalXDPI){
            var styles = doc.defaultView.getComputedStyle(div, null);
            supports.logicalXDPI = parseInt(styles["width"]);
            supports.logicalYDPI = parseInt(styles["height"]);
        }else{
            /**
             * @member J$VM.supports
             * @property {Number} logicalXDPI
             */
            supports.logicalXDPI = window.screen.logicalXDPI;
            /**
             * @member J$VM.supports
             * @property {Number} logicalYDPI
             */
            supports.logicalYDPI = window.screen.logicalYDPI;
        }

        // Check graphics, canvas, svg and vml.
        obj = doc.createElement("CANVAS");
        /**
         * @member J$VM.supports
         * @property {Boolean} canvas
         * Whether supports Canvas
         */
        supports.canvas = (typeof obj.getContext === "function");
        /**
         * @member J$VM.supports
         * @property {Boolean} svg
         * Whether supports SVG
         */
        supports.svg = (doc.SVGAngle || doc.implementation.hasFeature(
            "http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));
        div.innerHTML = "<v:shape id='vml_flag1' adj='1' />";
        obj = div.firstChild;
        obj.style.behavior = "url(#default#VML)";
        /**
         * @member J$VM.supports
         * @property {Boolean} vml
         * Whether supports VML
         */
        supports.vml = (obj ? typeof obj.adj === "object" : false);

        // IE Binary2Array
        if(typeof self.Uint8Array != "function"){
            var script = doc.createElement("script"),
                head = document.getElementsByTagName("head")[0];
            script.type = "text/vbscript";
            script.text = "Function IEBinaryToString(B)\r\n"+
                "Dim I, S\r\n"+
                "For I = 1 To LenB(B)\r\n" +
                "If I <> 1 Then S = S & \",\"\r\n" +
                "S = S & CStr(AscB(MidB(B, I, 1)))\r\n" +
                "Next\r\n"+
                "IEBinaryToString = S\r\n"+
                "End Function\r\n";
            head.appendChild(script);
            head.removeChild(script);
        }

        if(vm.firefox){
            js.util.Event.W3C_EVT_MOUSE_WHEEL = "DOMMouseScroll";
        }
        
        // Clean
        obj = null;
        doc.body.removeChild(div);
        doc.body.removeChild(ipt);
        div = view = ipt = undefined;
    };

    var _detectDoctype = function(){
        var reg = /(\"[^\"]+\")/gi,
            publicIDReg=/\s+(X?HTML)\s+([\d\.]+)\s*([^\/]+)*\//gi,
            DOCTYPEFEATURS = ["xhtml", "version", "importance"/*, "systemId"*/],
            doctype = vm.doctype = {declared: false},
            dtype, publicId, systemId;

        if(document.doctype != null){
            doctype.declared = true;

            dtype = document.doctype;
            doctype.name = dtype.name;

            publicId = dtype.publicId || "";
            systemId = dtype.systemId || "";
        }else if(typeof document.namespaces != "undefined"){
            var dt = document.all[0];

            var value = (dt.nodeType == 8 ? dt.nodeValue : "");
            if(value && (value.toLowerCase().indexOf("doctype") != -1)){
                doctype.declared = true;
                doctype.name = dt.scopeName;

                dtype = [];
                value.replace(reg,
                              function($0){
                                  if($0){
                                      $0 = $0.replace(/"|'/g, "");
                                      dtype.push($0);
                                  }
                              });

                publicId = dtype[0] || "";
                systemId = dtype[1] || "";
            }
        }

        if(doctype.declared){
            doctype.publicId = publicId = publicId.toLowerCase();
            doctype.systemId = systemId.toLowerCase();

            try{
                if(publicId.length > 0 && publicIDReg.test(publicId) && RegExp.$1){
                    doctype["xhtml"] = (RegExp.$1);
                    doctype["version"] = RegExp.$2;
                    doctype["importance"] = RegExp.$3;
                }
            }catch(e){}

            doctype.getEigenStr = function(){
                var fValues = [], v;
                if(this.declared){
                    for(var i = 0, len = DOCTYPEFEATURS.length; i < len; i++){
                        v = this[DOCTYPEFEATURS[i]];
                        if(v){
                            fValues.push(v);
                        }
                    }

                    v = fValues.length > 0 ? fValues.join("-") : "";
                }

                return v;
            };
        }

        J$VM.System.log.println("Doctype:" + JSON.stringify(doctype));
    };

    // Initialize JSVM's locale with browser's.
    var _initJSVMLocale = function(){
        var lang = (navigator.userLanguage || navigator.language).split("-");
        vm.locale = new js.util.Locale(lang[0], lang[1]);
    };
    
    var _onload = function(e){
        J$VM.System.out.println(J$VM.__product__+" "+J$VM.__version__+" loading...");

        var b = vm.storage.session.getItem("j$vm_log");
        if(b === "true"){
            vm.enableLogger();
        }else{
            vm.disableLogger();
        }

        _checkBrowser.call(this);
        _detectDoctype.call(this);
        _initJSVMLocale.call(this);

        var Runtime = vm.Runtime;
        Runtime.registerDesktop(new js.awt.Desktop(vm.Runtime));
        Runtime._execProcs();
    };

    var _onbeforeunload = function(){

    };

    var _onunload = function(e){
        J$VM.System.out.println("J$VM unload...");
        J$VM.Runtime.destroy();

        var names = ["$import", "$package", "$load_package",
                     "$postMessage","$sendMessage",
                     "J$VM","js","com","org"], name;

        for(var i=0, len=names.length; i<len; i++){
            name = names[i];
            self[name] = null;
            try{
                delete self[name];
            } catch (x) {
            }
        }
        
        try{
            self.document.innerHTML = "";            
            //CollectGarbage(); // IE
        }catch(e){};
    };

    /**
     * @member J$VM
     * @method endableLogger
     * Enable J$VM's logger
     */
    var _enableLogger = function(){
        this.setProperty("j$vm_log", true);
        J$VM.storage.session.setItem("j$vm_log", "true");
        return "J$VM logger is enabled";
    }.$bind(this);

    /**
     * @member J$VM
     * @method disableLogger
     * Disable J$VM's logger
     */
    var _disableLogger = function(){
        this.setProperty("j$vm_log", false);
        J$VM.storage.session.setItem("j$vm_log", "false");
        return "J$VM logger is disabled";
    }.$bind(this);

    var _init = function(env, vm){
        var Event = js.util.Event;
        
        props = new js.util.Properties(env);

        /**
         * @member J$VM
         * @property {js.lang.Class} Class
         */
        vm.Class = js.lang.Class;
        /**
         * @member J$VM
         * @property {js.util.Messenger} MQ
         */
        vm.MQ = new js.util.Messenger();

        /**
         * @member J$VM
         * @property {js.lang.Runtime} Runtime
         */
        vm.Runtime = new js.lang.Runtime();
        
        if(!vm.env.j$vm_isworker){
            
            vm.pkgversion = self.j$vm_pkgversion;
            try{
                delete self.j$vm_pkgversion;
            }catch(e){}
            vm.__version__ += vm.pkgversion["package.jz"];
            
            _buildEnv.call(this);

            os = self.console ? self.console : null;

            /**
             * @member J$VM
             * @property {window} [hwnd=self]
             *
             */
            vm.hwnd = self;

            /**
             * @member J$VM
             * @property {js.util.Document} DOM
             */
            vm.DOM = new js.util.Document();

            /**
             * @member J$VM
             * @property {js.awt.ComponentFactory} Factory
             */
            vm.Factory = new js.awt.ComponentFactory(this);
            
            /**
             * @member J$VM
             * @property {Object} storage
             */
            vm.storage = {
                /**
                 * @member J$VM.storage
                 * @property {js.util.Storage} local the local storage
                 */
                local  : js.util.Storage.getStorage("local"),
                /**
                 * @member J$VM.storage
                 * @property {js.util.Storage} session the session storage
                 */
                session: js.util.Storage.getStorage("session"),
                /**
                 * @member J$VM.storage
                 * @property {js.util.Storage} memory the memory storage
                 */
                memory : js.util.Storage.getStorage("memory"),
                /**
                 * @member J$VM.storage
                 * @property {js.util.Storage} cookie the cookie storage
                 */
                cookie : new js.util.CookieStorage()
            };

            /**
             * @member J$VM.storage
             * @property {js.util.Storage} cache the general cache
             */
            vm.storage.cache = new js.util.Cache();
            /**
             * @member J$VM.storage
             * @property {js.util.Storage} images the images cache
             */
            vm.storage.images= new js.util.MemoryStorage(
                this.getProperty("j$vm_images_cachesize",256));

            vm.enableLogger = _enableLogger;
            vm.disableLogger = _disableLogger;

            Event.attachEvent(vm.hwnd, Event.W3C_EVT_LOAD,   0, this, _onload);
            Event.attachEvent(vm.hwnd, Event.W3C_EVT_UNLOAD, 0, this, _onunload);

        }else{
            // Because Web Worker can not use consle to output, so we can use our MQ
            // to post message to main window.
            os = new function(){
                var post = vm.MQ.post;

                this.info = function(s){
                    post(Event.SYS_MSG_CONSOLEINF, s, [], self, 1);
                };

                this.error = function(s){
                    post(Event.SYS_MSG_CONSOLEERR, s, [], self, 1);
                };

                this.log = function(s){
                    post(Event.SYS_MSG_CONSOLELOG, s, [], self, 1);
                };

            }();

            _buildWorkerEnv.call(this);
        }
    };

    if(env != undefined && vm != undefined){
        _init.apply(this, arguments);
    }

}.$extend(js.lang.Object);
