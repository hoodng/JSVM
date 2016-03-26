/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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

    var _last = 0;
    this.updateLastAccessTime = function(){
        var now = this.currentTimeMillis();
        if(self.parent !== self && now - _last > 1000){
            _last = now;
            J$VM.MQ.post("j$vm_activating", null, [], self.parent);
        }
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
                    /* check if Object have _transient setting, all memeber 
                     * in _transient setting will not be deep copy */
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
        var path = self.j$vm_home, p;
        if(path.startsWith("../")){
            path = vm.env.uri.source;
            p = path.indexOf("classes/js/util/Worker.jz");
            path = path.substring(0, p);
        }

        vm.env.j$vm_home = vm.j$vm_home = path;
        vm.uuid("j$vm_"+js.lang.Math.uuid());
        vm.id = vm.uuid();
    };

    var _onload = function(e){
        J$VM.System.out.println(
            [J$VM.__product__, J$VM.__version__, "loading..."].join(" "));

        var b = vm.storage.session.getItem("j$vm_log");
        if(b === "true"){
            vm.enableLogger();
        }else{
            vm.disableLogger();
        }
        
        J$VM.DOM.checkDoctype();
        J$VM.DOM.checkBrowser();
        
        vm.locale = new js.util.Locale();

        var Runtime = vm.Runtime;
        if(js.awt.Desktop){
            Runtime.registerDesktop(new js.awt.Desktop(vm.Runtime));
        }
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

    this.isLogEnabled = function(){
        return this.getProperty("j$vm_log") == true;
    };

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
        vm.MQ = new js.util.Messenger(this);

        /**
         * @member J$VM
         * @property {js.lang.Runtime} Runtime
         */
        vm.Runtime = new js.lang.Runtime(this);
        
        if(!vm.env.j$vm_isworker){
            
            vm.pkgversion = self.j$vm_pkgversion || {};
            try{
                delete self.j$vm_pkgversion;
            }catch(e){}
            vm.__version__ += vm.pkgversion["package.jz"] || Math.uuid();
            
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

            /**
             * @member J$VM
             * @function enableLogger
             */
            vm.enableLogger = _enableLogger;

            /**
             * @member J$VM
             * @function disableLogger
             */
            vm.disableLogger = _disableLogger;

            /**
             * @member J$VM.Runtime
             * @function exec
             */
            vm.exec = vm.Runtime.exec;

            Event.attachEvent(self, Event.W3C_EVT_LOAD,   0, this, _onload);
            Event.attachEvent(self, Event.W3C_EVT_UNLOAD, 0, this, _onunload);

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
