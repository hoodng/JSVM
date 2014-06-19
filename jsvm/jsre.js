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
 * @class J$VM
 * Define J$VM name-space and run-time environment
 * @singleton
 */
J$VM = new function (){

    this.__product__ = "J$VM";

    this.__version__ = "0.9.s1f8d5a1be63a7339";
    /**
     * @property {Object}
     */
    this.env = {
        j$vm_log: false,
        j$vm_ajax_nocache: true,
        j$vm_ajax_timeout: 600000,
        j$vm_ajax_concurrent: 8,
        j$vm_timeslice: 20,
        j$vm_threshold: 45,
        j$vm_longpress: 90
    };

    /**
     * @method
     * Test whether the J$VM is working in Web Worker
     *
     * @return {Boolean}
     */
    this.env.j$vm_isworker = function(){
        try{
            return (window) ? false : true;
        } catch (x) {
            return true;
        }
    }();

    js = {lang:{}};

    /**
     * @member Function.prototype
     * Provides inheritance to javascript class.
     *
     * For example:
     *
     *     @example
     *     var A = function(){
     *     };
     *
     *     // B will extends A
     *
     *     var B = function(){
     *
     *     }.$extend(A)
     *
     *     new B() instanceof A // true
     *
     * @param {function} superC super class
     * @return {function} A class which extends from superC
     *
     */
    Function.prototype.$extend = function(superC){
        var proto;
        if(typeof superC === "function"){
            proto = this.prototype = new (superC)();
            proto.constructor = superC;
        }else if(typeof superC === "object"){
            proto = this.prototype = superC;
            proto.constructor = superC.constructor;
        }else{
            throw new Error("Parameter 'superC' must be a function or object");
        }

        return this;
    };

    /**
     * @member Function.prototype
     * Provides implement interface to javascript class.
     *
     * For example:
     *
     *     @example
     *     var IA = function(){
     *                  this.funA = function(){
     *                  };
     *     };
     *
     *     var IB = function(){
     *                  this.funB = function(){
     *                  };
     *     };
     *
     *     var C = function(){
     *
     *     }.$implements(IA, IB);
     *
     *     var t = new C();
     *     t.instanceOf(IA) // true
     *     t.instanceOf(IB) // true
     *
     * @param {function} superCs interfaces
     * @return {function} A class which implements superCs interfaces.
     */
    Function.prototype.$implements = function(superCs){
        var proto = this.prototype, superC,
            imps = proto.__imps__ = [].concat(proto.__imps__ || []);

        for(var i=0, len=arguments.length; i<len; i++){
            superC = arguments[i];
            if(typeof superC == "function"){
                imps.push(superC);
                superC.$decorate(proto);
            }
        }

        return this;
    };

    /**
     * @member Function.prototype
     * Use this class to decorate an object, same as copy all methods in this class
     * to the object.
     *
     * For example:
     *
     *     @example
     *     var IA = function(){
     *                  this.funA = function(){
     *                  };
     *     };
     *
     *     var IB = function(){
     *                  this.funB = function(){
     *                  };
     *     };
     *
     *     var o = new IB();
     *
     *     IA.$decorate(o);
     *
     *     o.funA(); // do funA
     *     o.funB(); // do funB
     *
     * @param {Object} o The object need to be decorated
     * @param {map} replaceMap
     * @return {Object} The object which has been decorated use this class.
     */
    Function.prototype.$decorate = function(o, replaceMap){
        if(o === undefined){
            throw new Error("Parameter 'o' must be an object");
        }

        var p, proto = this.prototype;
        if(this.__defined__ == undefined) new (this)();

        replaceMap = replaceMap || {};
        for(p in proto){
            if(proto.hasOwnProperty(p) &&
               "constructor" != p &&
               "__imps__" != p &&
               (!o.hasOwnProperty(p) || replaceMap[p] == true)){
                o[p] = proto[p];
            }
        }

        return o;
    };

    /**
     * @member Function.prototype
     * Bind a function to the specified scope.
     *
     * @param {Object} thi$ The runtime scope that this function bind to.
     * @param ... Other parameters need pass to this function
     */
    Function.prototype.$bind = function(thi$){
        var fn = this, args = Array.prototype.slice.call(arguments, 1);

        return function(){
            var $args = args.slice(0);
            $args = Array.prototype.slice.call(arguments, 0).concat($args);
            return fn.apply(thi$, $args);
        };

    };

    /**
     * @member Function.prototype
     * Bind a function to the specified scope as an event listener
     *
     * @param {Object} thi$ The runtime scope that this listener bind to.
     * @param {function} eClass The event class, by default you can use <code>js.util.Event</code>
     * @param ... Other parameters need pass to the listener
     */
    Function.prototype.$listen = function(thi$, eClass){
        var fn = this, args = Array.prototype.slice.call(arguments, 2);

        var agent = function(e){
            var $args = args.slice(0);
            var _e = (typeof eClass === "function") ? new (eClass)(e) : e;
            $args.unshift(_e);
            return fn.apply(thi$, $args);
        };

        agent.__host__ = fn;
        return agent;
    };

    /**
     * @member Function.prototype
     * Delay a function with specified timeout.
     * For example:
     *
     *    @example
     *     var fun = function(){
     *         // do something
     *     };
     *
     *     // The function fun will be delay 20 millisecons to executing.
     *     fun.$delay(this, 20, param1...);
     *
     * @param {Object} thi$ The runtime scope of the delayed function bind to.
     * @param {Number} timeout The timeout of delay
     * @param ... Other parameters need pass to delayed function.
     * @return {Timer} A timer
     */
    Function.prototype.$delay = function(thi$, timeout){
        var fn = this, args = Array.prototype.slice.call(arguments, 2);

        fn.__timer__ = fn.__timer__ || [];

        var _timer = setTimeout(
            function(){
                fn.$clearTimer(_timer);
                fn.apply(thi$, args);
            }, timeout);

        fn.__timer__.push(_timer);

        return _timer;
    };

    /**
     * @member Function.prototype
     * Clear timer on a function
     * For example:
     *
     *    @example
     *     var fun = function(){
     *         // do something
     *     };
     *
     *     // The function fun will be delay 20 millisecons to executing.
     *     fun.$delay(this, 20, param1...);
     *
     *     // Clear timer of this function
     *     fun.$clearTimer();
     *
     * @param {Timer} timer The timer which return by call {@link #$delay}
     * @return {Boolean} Return true if the timer is cleared else return false.
     */
    Function.prototype.$clearTimer = function(timer){
        var timers = this.__timer__, index = -1, ret = false;
        if(timers && timers.length > 0){
            if(timer != undefined && timer != null){
                for(var i=0, len=timers.length; i<len; i++){
                    if(timers[i] === timer){
                        index = i;
                        break;
                    }
                }
                if(index != -1){
                    timers.splice(index, 1);
                    clearTimeout(timer);
                    ret = true;
                }
            }else{
                clearTimeout(timers.shift());
                ret = true;
            }
        }
        return ret;
    };

    /**
     * @member Function.prototype
     * Override a function.
     * For example:
     *
     *     @example
     *     this.fun = function(txt){
     *         // do A thing
     *     };
     *
     *     this.fun = function(txt){
     *
     *          // You can call super do A before do B
     *          arguments.callee.__super__.apply(this, arguments);
     *
     *          // do B thing
     *
     *          // Or you can call super do A after do B
     *          arguments.callee.__super__.apply(this, arguments);
     *
     *      }.$override(this.fun);
     *
     * @param {function} func The super function.
     * @return {function} The overrided function.
     */
    Function.prototype.$override = function(func){
        this.__super__ = func;
        return this;
    };

    /**
     * @member Function.prototype
     * Calls a function for each element in a set.
     * For example:
     *
     *     @example
     *     var array = [1,2,3];
     *
     *     var fun = function(item, index, set){
     *         // do A thing
     *     }.$forEach(this, array);
     *
     *
     * @param {Object} thi$ The runtime scope of this function
     * @param {Array/Map} set Can be an array or a map
     * @param ... Other arguments need pass to this function
     */
    Function.prototype.$forEach = function(thi$, set){
        var fn = this, i, len,
            $args = Array.prototype.slice.call(arguments, 2);

        switch(js.lang.Class.typeOf(set)){
            case "array":
            for(i=0, len=set.length; i<len; i++){
                try{
                    fn.apply(thi$, $args.concat(set[i], i, set));
                } catch (x) {
                    if("break" === x){
                        break;
                    }else{
                        throw x;
                    }
                }
            }
            break;
            case "object":
            for(i in set){
                try{
                    fn.apply(thi$, $args.concat(set[i], i, set));
                } catch (x) {
                    if("break" === x){
                        break;
                    }else{
                        throw x;
                    }
                }
            }
            break;
            default:
            break;
        }
    };

    /**
     * @member Function.prototype
     * Calls a function for each element in a set, and returns a set that contains
     * the results
     *
     * @param {Object} thi$ The runtime scope of this function
     * @param {Array/Map} set Can be an array or a map
     * @param ... Other arguments need pass to this function
     *
     * @return {Array/Map} Array or Map follow the input "set"
     */
    Function.prototype.$map = function(thi$, set){
        var fn = this, ret = js.lang.Class.isArray(set) ? [] :{},
            $args = Array.prototype.slice.call(arguments, 2);

        (function(v, i, set){
            ret[i] = fn.apply(thi$, $args.concat(v,i,set));
        }).$forEach(thi$, set);

        return ret;
    };


    /**
     * @member Function.prototype
     * Returns the elements of a set that meet the condition specified
     * in this function.
     *
     * @param {Object} thi$ The runtime scope of this function
     * @param {Array/Map} set Can be an array or a map
     * @param ... Other arguments need pass to this function
     *
     * @return {Array/Map} Array or Map follow the input "set"
     */
    Function.prototype.$filter = function(thi$, set){
        var fn = this, isArray = js.lang.Class.isArray(set),
            ret = isArray ? [] : {},
            $args = Array.prototype.slice.call(arguments, 2);

        (function(v, i, set){
            if(fn.apply(thi$, $args.concat(v, i, set))){
                isArray ? ret.push(v) : ret[i] = v;
            }
        }).$forEach(thi$, set);

        return ret;
    };

    /**
     * @member Function.prototype
     * Checks whether a defined callback function returns true for
     * any element of a set.
     *
     * @param {Object} thi$ The runtime scope of this function
     * @param {Array/Map} set Can be an array or a map
     * @param ... Other arguments need pass to this function
     *
     * @return {Boolean} true if the callbackfn function returns true for any set element;
     * otherwise, false.
     */
    Function.prototype.$some = function(thi$, set){
        var fn = this, ret = false,
            $args = Array.prototype.slice.call(arguments, 2);

        (function(v, i, set){
            if(fn.apply(thi$, $args.concat(v, i, set))){
                ret = true;
                throw "break";
            }
        }).$forEach(thi$, set);

        return ret;
    };

    /**
     * @member Function.prototype
     * Checks whether a defined callback function returns true for all
     * elements in a set.
     *
     * @param {Object} thi$ The runtime scope of this function
     * @param {Array/Map} set Can be an array or a map
     * @param ... Other arguments need pass to this function
     *
     * @return {Boolean} true if the callbackfn function returns true for all set elements;
     * otherwise, false. If the set is has no elements, the every method returns
     * true.
     */
    Function.prototype.$every = function(thi$, set){
        var fn = this, ret = true,
            $args = Array.prototype.slice(arguments, 2);

        (function(v, i, set){
            if(fn.apply(thi$, $args.concat(v, i, set))){
                ret = false;
                throw "break";
            }
        }).$forEach(thi$, set);

        return ret;
    };

    /**
     * @member Function.prototype
     * Delay the logic in a loop
     *
     * For example:
     *
     *     @example
     *     var ctx = {
     *         count: 0
     *     };
     *
     *     var foo = function(i, ctx){
     *         System.err.println(i);
     *         ctx.count += i;
     *     };
     *
     *     for(var i=0, len=10; i<len; i++){
     *         foo(i, ctx);
     *     }
     *
     *     // If you want to delay foo one by one, then use $delayLoop instead of for loop as
     *     // below:
     *
     *     foo.$delayLoop(this, 1000, {index:0, length:10, step:1}, ctx);
     *
     * @param {Object} thi$ The runtime scope of this function
     * @param {Number} timeout The timeout of delay, @see Function.$delay
     * @param {Object} iterator A simple object, within 3 keys index, length and step
     * @param {Object} context The context of this function
     * @param {function} callback The callback function when loop is finished
     */
    Function.prototype.$delayLoop = function(thi$, timeout, iterator, context, callback){
        var fn = this;
        if(iterator.index == iterator.length){
            if(callback){
                callback.call(thi$, context);
            }
        }else{
            (function(){
                fn.call(thi$, iterator, context);
                iterator.index += iterator.step;
                fn.$delayLoop(thi$, timeout, iterator, context, callback);
            }).$delay(thi$, timeout);
        }
    };

}();

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

js.lang.Class = new function (){

    var _modules = {};

    /**
     * Create namespace with specified Java like package name
     * 
     * @param packageName
     */
    this.definePackage = function(packageName){
        if(_modules[packageName]) return;
        
        var names = packageName.split(".");
        var parent= self;
        for(var i=0, len=names.length; i<len; i++){
            var name = names[i];
            if(parent[name] === undefined){
                parent[name] = {};
            }
            parent = parent[name];
        }

        _modules[packageName] = parent;
    };
    
    /**
     * Load a javascript class with specified Java like class name
     * 
     * @param className
     */
    this.importClass = function(className){
        var clazz = _checkClass(className);
        if (clazz != undefined) return clazz;
        
        var buf = [];
        buf.push(J$VM.env.j$vm_home);
        buf.push("/classes");
        
        var names = className.split(".");
        for(var i=0, len=names.length; i<len; i++){
            buf.push("/");
            buf.push(names[i]);
        }
        buf.push(".jz");

        var filePath = buf.join('');
        try{
            _loadClass(filePath, className);
            clazz = _modules[className] = _checkClass(className);
        } catch (ex) {
            J$VM.System.err.println("Can't load "+className+" from "+filePath);
        }

        return clazz;
    };

    var _checkClass = function(className){
        var clazz = _modules[className];
        
        if(clazz === undefined){
            var names = className.split(".");
            clazz = self;
            for(var i=0, len=names.length; i<len; i++){
                var name = names[i];
                if(clazz[name] === undefined){
                    clazz = undefined;
                    break;
                }
                clazz = clazz[name];
            }
            _modules[className] = clazz;
        }        
        
        return clazz;

    }.$bind(this);

    /**
     * Load a javascript class with specified file path
     * 
     * @param className
     */
    this.loadClass = function(filePath){
        try{
            _loadClass(filePath);
        } catch (ex) {
            J$VM.System.err.println("Can't load class from "+filePath);
        }        
    };
    
    var _loadClass = function(filePath, className){
        if(!J$VM.env.j$vm_isworker){
            var storage = J$VM.storage.cache, text, incache = false,
                cached = storage.getItem(className || filePath);

            if(cached){
                if(cached.build === J$VM.__version__){
                    text = cached.text;
                    incache = true;
                }
            }

            text = text || this.getResource(filePath, !this.isString(text));
            this.loadScript(filePath, text);

            if(!incache){
                try{
                    storage.setItem(className || filePath, 
                                    {build:J$VM.__version__,
                                     text: text});
                } catch (x) {
                    J$VM.System.err.println(x);
                }
            }
        }else{
            importScripts(filePath);
        }

    }.$bind(this);

    this.loadScript = function(filePath, text){
        text = text || this.getResource(filePath, !this.isString(text));
        var script = document.createElement("script");
        var head = document.getElementsByTagName("head")[0];
        script.type= "text/javascript";
        script.text = text;
        head.appendChild(script);
        head.removeChild(script);

    }.$bind(this);

    /**
     * Return the content with the specified url
     * 
     * @param url, the url to load content
     */
    this.getResource = function(url, nocache){
        // Synchronized request
        var xhr = J$VM.XHRPool.getXHR(false);
        xhr.setNoCache(nocache || false);
        xhr.open("GET", url, undefined);
        
        if(xhr.exception == undefined && xhr.readyState() == 4 &&
           (xhr.status() == 200 || xhr.status() == 304)){
            var text =  xhr.responseText();
            xhr.close();
            return text;            
        }
        
        var ex = xhr.exception;
        xhr.close();
        throw ex;

    }.$bind(this);

    /**
     * Return the class with the specified class name
     * 
     * @param className
     */
    this.forName = function(className){
        var clazz = _checkClass(className);
        
        if(clazz === undefined){
            clazz = this.importClass(className);
        }
        
        return clazz;

    }.$bind(this);

    this.loadImageFromUrl = function(image, url, callback, proxy){
        var Q;
        Q = image.Q = [];
        Q.push([this, image, callback]);
        image.onload = _imageOnLoad.$bind(image);
        image.onreadystatechange = _imageOnStat.$bind(image);
        this._loadImage(image, url, proxy);
    };

    this.loadImage = function(url, callback, clone, proxy){
        var cache = J$VM.storage.images, Q, image, dataUrl = true;

        if(url.indexOf("data:") != 0){
            dataUrl = false;
            image = cache.getItem(url) || document.getElementById(url);
        }

        clone = clone || false;

        if(!this.isHtmlElement(image)){
            image = J$VM.DOM.createElement("IMG");
            cache.setItem(url, image);
            this.loadImageFromUrl(image, url, callback, proxy);
            return;
        }else if(image && image.onload != null){
            if(clone){
                Q = image.Q;
                Q.push([this, image, callback]);
                return;
            }else{
                image = J$VM.DOM.createElement("IMG");
                this.loadImageFromUrl(image, url, callback, proxy);
                return;
            }
        }

        if(clone){
            _onload.call(this, image, callback);
        }else{
            image = J$VM.DOM.createElement("IMG");
            this.loadImageFromUrl(image, url, callback);
        }
    };

    this._loadImage = function(image, url, proxy){
        if(url.indexOf("data:") != 0){
            url = new js.net.URI(url);
            if(url.isSameOrigin() || proxy !== true){
                image.src = url.toURI();
            }else{
                var goProxy = ["webos","HttpProxyGetAction",{target:url.toURI()}];
                image.src = ".vt?$="+js.util.Base64.encode(JSON.stringify(goProxy));
            }
        }else{
            image.src = url;
        }
    };

    var _imageOnLoad = function(){
        var Q = this.Q, req;
        while(Q.length > 0){
            req = Q.shift();
            _onload.apply(req.shift(), req);
        }

        this.onload = null;
        this.onreadystatechange = null;
    };

    var _imageOnStat = function(){
        if(this.readyState == "loaded" || 
           this.readyState == "complete"){
            _imageOnLoad.call(this);
        };
    };

    var _onload = function(image, callback){
        if(typeof callback === "function"){
            callback(image);
        }
    };
    
    /**
     * Return the type of the specified object
     * 
     * typeOf("te") === "string"
     * typeOf(1234) === "number"
     * typeOf(true) === "boolean"
     * typeOf({})   === "object"
     * typeOf([])   === "array"
     * typeOf(null) === "null"
     * typeOf( )    === "undefined"
     * typeOf(window) === "global"
     * typeOf(function(){}) === "function"
     * typeOf(document) === "htmldocument"
     * 
     */
    this.typeOf = function(o){
        return (o === null) ? "null" : 
            (o === undefined) ? "undefined" :
            this.isHtmlElement(o) ? 
            "html"+o.tagName.toLowerCase()+"element" :
            this.isBigInt(o) ? "bigint" :
            (function(){
                var s = Object.prototype.toString.call(o);
                return s.substring(8, s.length-1).toLowerCase();
            })();
    }.$bind(this);

    /**
     * Test if the specified object is a Date.
     * 
     * Specially in Firefox, Chrome and Safari, when we attempt to 
     * parse an invalid date string as a Date object. An valid Date 
     * object will be returned but it indicates an invalid Date.
     * 
     * e.g. 
     * new Date("13").toString(); //"Invalid Date"
     * 
     * e.g.
     * var d = new Date("January 1, 2012 16:00:00 AM");
     * this.typeof(d) == "date"; //true
     * isNaN(d); //true
     */
    this.isDate = function(o){
        return (this.typeOf(o) == "date" && !isNaN(o));
    };
    
    /**
     * Test if the specified object is an BigInt
     */
    this.isBigInt = function(o){
        if(!js.text) return false;
        if(!js.text.BigIntTools) return false;
        return typeof o == "object" && o instanceof js.text.BigIntTools.BigInt;
    };

    /**
     * Test if the specified object is an Array
     */
    this.isArray = function(o){
        return this.typeOf(o) === "array";
    };

    /**
     * Test if the specified object is a string
     */
    this.isString = function(o){
        return this.typeOf(o) == "string";
    };

    /**
     * Test if the specified object is a number
     */
    this.isNumber = function(o){
        return !isNaN(o) && this.typeOf(o) == "number";
    };

    /**
     * Test if the specified object is an object
     */
    this.isObject = function(o){
        return this.typeOf(o) == "object";
    };
    
    /**
     * Test if the specified object is a Boolean
     */
    this.isBoolean = function(o){
        return this.typeOf(o) == "boolean";        
    };

    /**
     * Test if the specified object is null
     */
    this.isNull = function(o){
        return this.typeOf(o) == "null";
    };

    /**
     * Test if the specified object is undefined
     */
    this.isUndefined = function(o){
        return this.typeOf(o) == "undefined";
    };

    /**
     * Test if the specified object is a function
     */
    this.isFunction = function(o){
        return this.typeOf(o) == "function";
    };

    /**
     * Test if the specified object is a valid value, that means
     * it is not null or undefined
     */
    this.isValid = function(o){
        return (o != null) && (o != undefined);
    };

    /**
     * Test if the specified object is a html element
     */
    this.isHtmlElement = function(o){
        return o ? !!o.tagName : false;
    };
    
    /**
     * Checks if the given string is the valid JSON string.
     *
     * @param str: String to check type of.
     */
    this.isJSON = function(str) {
        if(!this.isString(str) || str.length == 0)
            return false;

        try {
            var obj = JSON.parse(str);
            return true;
        }catch(e) {
            return false;
        }
    };
    
    /**
     * Checks if a object is of a specific type for example an array.
     * 
     * @param o: Object to check type of.
     * @param type: Optional type to check for.
     * 
     * @return true/false if the object is of the specified type.
     */
    this.is = function(o, type){
        if(!type)
            return o !== undefined && o !== null;
        
        var b = false;
        type = type.toLowerCase();
        switch(type){
        case "number":
            b = this.isNumber(o);
            break;
        case "date":
            b = this.isDate(o);
            break;
        default:
            b = (this.typeOf(o) === type);
            break;
        }
        
        return b;
    };
    
}();

$package = js.lang.Class.definePackage;
$import  = js.lang.Class.importClass;


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

js.lang.Math = new function (){
    var count = 0;

    this.random = function(n){
        return n ? Math.floor(Math.random()*n+1) : Math.random();    
    };
    
    this.uuid = function(hash){
        hash = hash || (new Date().getTime()+this.gCount());
        return "s"+hash.toString(16);
    };

    this.gCount = function(){
        return count++;
    };

}();



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
 * @class js.lang.Object
 * Define the root object of J$VM objects.
 *
 * @constructor
 * @extends Object
 */
js.lang.Object = function (o){
    
    var CLASS = js.lang.Object, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        // TODO:
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Math = js.lang.Math;
    
    /**
     * Return hash code of this object
     * @return {Number}
     */
    thi$.hashCode = function(){
        this.__hash__ = this.__hash__ || 
            (new Date().getTime()+Math.gCount());

        return this.__hash__;
    };
    
    /**
     * Test whether this object equals to the specified object.
     * @param {Object} o The test object
     * @return {Boolean}
     */
    thi$.equals = function(o){
        return o === this;
    };

    /**
     * Return the string of this object
     * @return {String}
     */
    thi$.toString = function(){
        return (typeof this) + "@" + this.uuid();
    };
    
    /**
     * Set/Get the unique ID of this object.
     * @param {String} id Set id as unique ID to this object
     * @return {String}
     */
    thi$.uuid = function(id){
        if(Class.isString(id)){
            this.__uuid__ = id;
        }

        this.__uuid__ = this.__uuid__ ||
            Math.uuid(this.hashCode());

        return this.__uuid__;
    };

    /**
     * Test whether this object is instance of a class
     * @param {Class} clazz The test class
     * @return {Boolean} 
     */
    thi$.instanceOf = function(clazz){
        var imps = this.__imps__;
        if(imps){
            for(var i=0, len=imps.length; i<len; i++){
                if(clazz === imps[i]){
                    return true;
                }
            }
        }

        return this instanceof clazz;
    };
    
    /**
     * Destroy this object
     */
    thi$.destroy = function(){
        J$VM.MQ.remove(this.uuid());
        var p, v;
        for(p in this){
            v = this[p];
            delete this[p];
        }
        this.destroied = true;
    };

}.$extend(Object);



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

js.lang.String = new function(){

	var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;

	var REGX_HTML_DECODE = /&\w+;|&#(\d+);|<br\/>/g;

	var REGX_TRIM = /(^\s*)|(\s*$)/g;
	
	var REGX_REGEXP_METACHARS = /[\^\$\.\*\+\?\|\\\(\)\[\]\{\}]/g;
	
	var REGX_REGEXP_ESCAPEDMETACHARS = /\\([\^\$\.\*\+\?\|\\\(\)\[\]\{\}])/g;
	
	var HTML_DECODE = {
		"&lt;"	: "<", 
		"&gt;"	: ">", 
		"&amp;" : "&", 
		"&nbsp;": " ", 
		"&quot;": "\"", 
		"&copy;": "©",
		"<br/>" : String.fromCharCode(0x0A)
		// Add more
	};

	var TAGTEST = {
		script: /<script\b[\s\S]*?>([\s\S]*?)<\/script/i,
		pre: /<pre\b[\s\S]*?>([\s\S]*?)<\/pre/i,
		TEXTAREA: /<TEXTAREA\b[\s\S]*?>([\s\S]*?)<\/TEXTAREA/i
	};
	
	var REGX_MEATACHARS_ESCAPE = {
		"^" : "\\\^", 
		"$" : "\\\$",
		"(" : "\\\(", 
		")" : "\\\)", 
		"[" : "\\\[", 
		"{" : "\\\{", 
		"." : "\\\.", 
		"*" : "\\\*", 
		"\\": "\\\\", 
		"|" : "\\\|", 
		"<" : "\\\<", 
		">" : "\\\>", 
		"+" : "\\\+", 
		"?" : "\\\?"
	};
	
	var REGX_MEATACHARS_UNESCAPE = {
		"\\\^" : "^", 
		"\\\$" : "$",
		"\\\(" : "(", 
		"\\\)" : ")", 
		"\\\[" : "[", 
		"\\\{" : "{", 
		"\\\." : ".", 
		"\\\*" : "*", 
		"\\\\" : "\\", 
		"\\\|" : "|", 
		"\\\<" : "<", 
		"\\\>" : ">", 
		"\\\+" : "+", 
		"\\\?" : "?"
	};
	
	this.encodeHtml = String.prototype.encodeHtml = 
		function(s, nobreak){
			s = (s != undefined) ? s : this.toString();
			return (typeof s != "string") ? s :
				s.replace(REGX_HTML_ENCODE, 
						  function($0){
							  var c = $0.charCodeAt(0), r = ["&#"];
							  if(c == 0x0D || c == 0x0A){
								  if(nobreak !== true){
									  return "<br/>";
								  }
							  }

							  c = (c == 0x20) ? 0xA0 : c;
							  r.push(c); r.push(";");
							  return r.join("");
						  });
		};

	this.decodeHtml = String.prototype.decodeHtml = 
		function(s, nobreak){
			s = (s != undefined) ? s : this.toString();
			return (typeof s != "string") ? s :
				s.replace(REGX_HTML_DECODE,
						  function($0, $1){
							  var c = HTML_DECODE[$0];
							  if(c == undefined){
								  // Maybe is Entity Number
								  if(!isNaN($1)){
									  c = String.fromCharCode(
										  ($1 == 160) ? 32 : $1);
								  }else{
									  c = $0;
								  }
							  }
							  return c;
						  });
		};

	/**
	 * Escape regular expression's meta-characters as literal characters.
	 */
	this.escapeRegExp = String.prototype.escapeRegExp = 
		function(s){
			s = (s != undefined) ? s : this.toString();
			return (typeof s != "string") ? s :
				s.replace(REGX_REGEXP_METACHARS, 
						  function($0){
							  return "\\" + $0;
						  });
		};

	this.unescapeRegExp = String.prototype.unescapeRegExp = 
		function(s){
			s = (s != undefined) ? s : this.toString();
			return (typeof s != "string") ? s :
				s.replace(REGX_REGEXP_ESCAPEDMETACHARS,
						  function($0, ch){
							  return ch;
						  });
			
		};
	
	
	/**
	 * For using regular expression to eacapse is inefficient, we add another
	 * method here to do it.
	 * 
	 */
	this.escapeRxMetaChars = String.prototype.escapeRxMetaChars = function(s, emap){
		if(!s || typeof s != "string"){
			return s;
		}
		
		var buf = [], ch, ech;
		for(var i = 0; i < s.length; i++){
			ch = s.charAt(i);
			
			ech = emap ? emap[ch] : null;
			if(typeof ech != "string"){
				ech = REGX_MEATACHARS_ESCAPE[ch];
			}
			
			if(ech){
				buf.push(ech);
			}else{
				buf.push(ch);
			}
		}
		
		return buf.join("");
	};
	
	this.unescapeRxMetaChars = String.prototype.unescapeRxMetaChars = function(s){
		if(!s || typeof s != "string" 
		   || s.indexOf("\\") == -1){
			return s;
		}
		
		var buf = [], ch, prech;
		for(var i = 0; i < s.length; i++){
			ch = s.charAt(i);
			if(ch !== "\\"){
				if(prech){
					ch = prech + ch;
					ch = REGX_MEATACHARS_UNESCAPE[ch] || ch;
					
					prech = null;
				}
				
				buf.push(ch);
			}else{
				prech = ch;
			}
		}
		
		return buf.join("");
	};
	
	this.trim = String.prototype.trim = function(s){
		s = (s != undefined) ? s : this.toString();
		return (typeof s != "string") ? s :
			s.replace(REGX_TRIM, "");
	};

	this.fetchJSON = String.prototype.fetchJSON = function(tag, s){
		tag = tag || "pre";
		s = (s != undefined) ? s : this.toString();
		var tester = TAGTEST[tag], ret;
		if(tester.test(s)){
			ret = tester.exec(s);
		}
		return ret ? ret[1].trim(): s;
	};

	String.prototype.hashCode = function(){
		var hash = this._hash, _char;
		if(hash == undefined || hash == 0){
			hash = 0;
			for (var i = 0, len=this.length; i < len; i++) {
				_char = this.charCodeAt(i);
				hash = 31*hash + _char;
				hash = hash & hash; // Convert to 32bit integer
			}
			hash = hash & 0x7fffffff;
			this._hash = hash;
		}

		return this._hash;	
	};

}();


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

js.lang.StringBuffer = function (s){
    
    var CLASS = js.lang.StringBuffer, thi$ = CLASS.prototype;
    if(CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    /**
     * Append a string to this buffer
     * 
     * @param s, the string need append to the buffer
     * @return this buffer instance
     */
    thi$.append = function(s){
        this._buf.push(s);
        return this;
    };
    
    /**
     * Clear the string buffer
     * 
     * @return this buffer instance
     */
    thi$.clear = function(){
        this._buf.splice(0, this._buf.length);
        return this;
    };

    /**
     * Return the string of this buffer
     */
    thi$.toString = function(){
        return this._buf.join("");
    };

    thi$._init = function(s){
        this._buf = [];
        if(s) this._buf.push(s);
    };

    this._init.apply(this, arguments);

}.$extend(js.lang.Object);



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

$package("js.util");

js.util.LinkedList = function (array){

    var CLASS = js.util.LinkedList, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init(array);
        return;
    }
    CLASS.__defined__ = true;

    thi$.getFirst = function(){
        if(this.length == 0)
            throw new Error("NoSuchElementException");

        return this[0];
    };

    thi$.getLast = function(){
        if(this.length == 0)
            throw new Error("NoSuchElementException");
        
        return this[this.length-1];
    };

    thi$.addFirst = function(e){
        this.add(0, e);
    };

    thi$.push = function(e){
        arguments.callee.__super__.apply(this, arguments);
        return this;
    }.$override(this.push);


    thi$.addLast = function(e){
        this.push(e);
    };

    thi$.removeFirst = function(){
        return this.shift();
    };

    thi$.removeLast = function(){
        return this.pop();  
    };

    thi$.add = function(index, e){
        this.splice(index, 0, e);
    };

    thi$.set = function(index, e){
        var oldVal = this[index];
        this[index] = e;
        return oldVal;
    };

    thi$.get = function(index){
        return this[index];
    };

    thi$.remove0 = function(index){
        var e = this.get(index);
        this.splice(index, 1);
        return e;
    };

    thi$.remove = function(e){
        var idx = this.indexOf(e);
        return (idx != -1) ? this.remove0(idx) : null;
    };

    thi$.indexOf = function(e){
        for(var i=0, len=this.length; i<len; i++){
            var _e = this[i];
            if(e instanceof js.lang.Object && 
               _e instanceof js.lang.Object){
                if(_e.equals(e)) return i;
            }else{
                if(_e === e){
                    return i;
                }
            }
        }
        return -1;
    };

    thi$.contains = function(e){
        return this.indexOf(e) != -1;
    };

    thi$.clear = function(){
        this.splice(0, this.length);
        return this;
    };

    thi$._init = function(array){
        if(array && js.lang.Class.isArray(array))
            this.addLast.$forEach(this, array);
    };

    this._init(array);

}.$extend(Array);

js.util.LinkedList.newInstance = function(array){
    var o = js.lang.Class.isArray(array) ? array : [];
    return js.util.LinkedList.$decorate(o);
};

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

$package("js.util");

$import("js.util.LinkedList");

js.util.HashMap = function (map){

    var CLASS = js.util.HashMap, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class;

    thi$.put = function(key, value){
        if(!Class.isString(key) && !Class.isNumber(key))
            throw "The key must be a string or number";
        
        this._vals[key] = value;
        if(!this._keys.contains(key)){
            this._keys.addLast(key);
        }
    };
    
    thi$.size = function(){
        return this._keys.length;
    };
    
    thi$.contains = function(key){
        return this._keys.contains(key);
    };
    
    thi$.get = function(key){
        return this._vals[key];
    };
    
    thi$.remove = function(key){
        var e;
        this._keys.remove(key);
        e = this._vals[key];
        delete this._vals[key];
        return e;
    };
    
    thi$.keys = function(){
        var ret = [], keys = this._keys;
        for(var i=0, len=keys.length; i<len; i++){
            ret.push(keys[i]);
        }
        return ret;
    };
    
    thi$.values = function(){
        var ret = [], keys = this._keys, vals = this._vals;
        for(var i=0, len=keys.length; i<len; i++){
            ret.push(vals[keys[i]]);
        }
        return ret;
    };
    
    thi$.addAll = function(map){
        for(var p in map){
            this.put(p, map[p]);
        }
    };
    
    thi$.clear = function(){
        this._vals = {};
        this._keys = js.util.LinkedList.newInstance();
    };
    
    thi$._init = function(map){
        this._vals = map || {};
        this._keys = js.util.LinkedList.newInstance();

        var _keys = this._keys, _vals = this._vals;
        for(var p in _vals){
            if(_vals.hasOwnProperty(p))_keys.push(p);
        }
    };

    this._init.apply(this, arguments);    

}.$extend(js.lang.Object);


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

$package("js.util");

js.util.Properties = function (map){

    var CLASS = js.util.Properties, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    thi$.getProperty = function(key, defaultValue){
        var tmp = this.get(key);
        return tmp == undefined ? defaultValue : tmp;
    };
    
    thi$.setProperty = function(key, value){
        this.put(key, value);
    };

    this._init.apply(this, arguments);
    
}.$extend(js.util.HashMap);

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

$package("js.util");

js.util.Observable = function (def, Runtime){

    var CLASS = js.util.Observable, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, 
        List = js.util.LinkedList;

    thi$.addObserver = function(observer){
        var svrs = this.__observers__;

        if(observer && observer.update && !svrs.contains(observer)){
            svrs.addLast(observer);
        }
    };
    
    thi$.deleteObserver = function(observer){
        this.__observers__.remove(observer);
    };
    
    thi$.deleteObservers = function(){
        this.__observers__.clear();
    };
    
    thi$.notifyObservers = function(data){
        if(!this.hasChanged()) return;

        (function(observer){
            observer.update(this, data);
        }).$forEach(this, this.__observers__);    
    };
    
    thi$.hasChanged = function(){
        return this._local.changed;
    };
    
    thi$.setChanged = function(){
        this._local.changed = true;    
    };
    
    thi$.clearChanged = function(){
        this._local.changed = false;
    };

    thi$.destroy = function(){
        delete this.__observers__;
        delete this._local;

        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(def === undefined) return;

        this.__observers__ = List.$decorate([]);
        var U = this._local = this._local || {};
        U.changed = false;
    };

    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);



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

$package("js.util");

js.util.Observer = function (){

    var CLASS = js.util.Observer, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    thi$.update = function(observable, data){
        // TODO: sub class should overwrite this method
    };

};

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

$package("js.util");

js.util.Event = function (eventType, eventData, eventTarget){

    var CLASS = js.util.Event, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init(eventType, eventData, eventTarget);
        return;
    }
    CLASS.__defined__ = true;

    thi$.getType = function(){
        return this._type;
    };

    thi$.setType = function(type){
        this._type = type;
    };

    thi$.getTimeStamp = function(){
        return this._time;
    };

    thi$.getData = function(){
        return this._data;
    };

    thi$.setData = function(data){
        this._data = data;
    };

    thi$.getEventTarget = function(){
        return this._target;
    };

    thi$.setEventTarget = function(eventTarget){
        this._target = eventTarget;
    };

    thi$.cancelBubble = function(){
        this._bubble = false;
    };

    thi$.cancelDefault = function(){
        this._default = false;
        return false;
    };

    thi$._init = function(eventType, eventData, eventTarget){
        this.setType(eventType);
        this.setData(eventData);
        this.setEventTarget(eventTarget);

        this._time = new Date();

        this._bubble = true;
        this._default= true;
    };

    this._init(eventType, eventData, eventTarget);

}.$extend(js.lang.Object);


js.util.Event.FLAG = {
    EXCLUSIVE  : 0x01 << 0,
    CAPTURED   : 0x01 << 1,
    CUSTOMIZED : 0x01 << 2,

    check : function(f){
        var o = { exclusive:false, captured:false, customized:false };
        if(typeof f === "number"){
            o.exclusive  = (f & this.EXCLUSIVE) != 0;
            o.captured   = (f & this.CAPTURED)  != 0;
            o.customized = (f & this.CUSTOMIZED)!= 0;
        } else {
            o.exclusive = (f === true);
        }

        return o;
    }
};

/**
 * Attach event listener to DOM element
 *
 * @param dom, element which captured event
 * @param eventType, such as "click", "mouseover" etc.
 * @param flag,
 * @param listener, the object of the handler
 * @param handler
 * @param ..., other parameters need pass to handler
 *
 * @see Function.prototype.$listen(listener, eventType, eventClass)
 * @see detachEvent(dom, eventType, flag, listener, handler)
 */
js.util.Event.attachEvent = function(dom, eventType, flag, listener, handler){
    var fn, args = Array.prototype.slice.call(arguments, 5),
        check = js.util.Event.FLAG.check(flag),
        eClass = check.customized ? null : js.awt.Event;

    args.unshift(listener, eClass);
    fn = handler.$listen.apply(handler, args);
    fn.check = check;

    dom.__handlers__ = dom.__handlers__ || {};
    dom.__handlers__[eventType] = dom.__handlers__[eventType] ||
        js.util.LinkedList.$decorate([]);
    dom.__handlers__[eventType].push(fn);

    if(check.exclusive){
        dom["on"+eventType] = fn;
    }else{
        if(dom.addEventListener){
            dom.addEventListener(eventType, fn, check.captured);
        }else{
            // IE
            dom.attachEvent("on"+eventType, fn);
        }
    }

    return fn;
};

/**
 * Detach event listener from DOM element
 *
 * @see attachEvent(dom, eventType, flag, thi$, handler)
 */
js.util.Event.detachEvent = function(dom, eventType, flag, listener, handler){
    var fn, agents, check;

    dom.__handlers__ = dom.__handlers__ || {};
    dom.__handlers__[eventType] = dom.__handlers__[eventType] ||
        js.util.LinkedList.$decorate([]);
    agents = dom.__handlers__[eventType];

    for(var i=0, len=agents.length; i<len; i++){
        fn = agents[i];
        if(fn &&
           ((handler === fn.__host__) || (handler === undefined))){
            check = fn.check;

            if(check.exclusive){
                dom["on"+eventType] = null;
            }else{
                if(dom.removeEventListener){
                    dom.removeEventListener(eventType, fn, check.captured);
                }else{
                    // IE
                    dom.detachEvent("on"+eventType, fn);
                }
            }
            delete fn.__host__;
            delete fn.check;
            agents.remove0(i);
        }
    }

    if(agents.length == 0){
        delete dom.__handlers__[eventType];
    }
};

js.util.Event.intercept = function(){

    var ELES = [document, (window.HTMLElement || window.Element),
                window.HTMLCanvasElement, window.SVGElement],
        CLASS = js.util.Event;

    var _supportedEventType = function(type){
        return (type.indexOf("mouse") != -1) ||
            (type.indexOf("pointer") != -1);
    };

    var _interceptAddListener = function(ele){
        if(ele == undefined || ele == null) return;

        var o = ele.prototype || ele;
        if(o.addEventListener && !o.addEventListener.__super__){
            o.addEventListener = function(type, func, capture){
                var superFn = arguments.callee.__super__, dom = this;
                if(_supportedEventType(type)){
                    _eventBinder(dom, type, func, capture, superFn, true);
                }else{
                    superFn.apply(dom, arguments);
                }
            }.$override(o.addEventListener);
        }
    };

    var _interceptRmvListener = function(ele){
        if(ele == undefined || ele == null) return;

        var o = ele.prototype || ele;
        if(o.removeEventListener && !o.removeEventListener.__super__){
            o.removeEventListener = function(type, func, capture){
                var superFn = arguments.callee.__super__, dom = this;
                if(_supportedEventType(type)){
                    _eventBinder(dom, type, func, capture, superFn, false);
                }else{
                    superFn.apply(dom, arguments);
                }
            }.$override(o.removeEventListener);
        }
    };

    var _TOUCHMAP = {mousedown: "touchstart",
                     mousemove: "touchmove",
                     mouseup: "touchend"};

    var _eventBinder = function(dom, type, func, capture, superFn, add){
        var supports = J$VM.supports;
        if(supports.pointerEnabled){
            superFn.call(dom, type.replace("mouse", "pointer"), func, capture);
        }else{
            superFn.call(dom, type.replace("pointer", "mouse"), func, capture);

            if(supports.touchEnabled){
                var touchType = _TOUCHMAP[type];
                if(touchType != undefined){
                    if(add == true){
                        CLASS.attachEvent(dom, touchType, 0, CLASS, _touchHandler);
                    }else{
                        CLASS.detachEvent(dom, touchType, 0, CLASS, _touchHandler);
                    }
                }
            }
        }
    };

    var _touchHandler = function(e){
        e.cancelDefault();
        alert(e);
        alert("hello");
    };

    _interceptAddListener.$forEach(this, ELES);
    _interceptRmvListener.$forEach(this, ELES);
};

// Event of W3C
js.util.Event.W3C_EVT_LOAD          = "load";
js.util.Event.W3C_EVT_UNLOAD        = "unload";
js.util.Event.W3C_EVT_RESIZE        = "resize";

js.util.Event.W3C_EVT_SELECTSTART   = "selectstart";
js.util.Event.W3C_EVT_MESSAGE       = "message";
js.util.Event.W3C_EVT_ERROR         = "error";

js.util.Event.W3C_EVT_MOUSE_DOWN    = "mousedown";
js.util.Event.W3C_EVT_MOUSE_UP      = "mouseup";
js.util.Event.W3C_EVT_MOUSE_MOVE    = "mousemove";
js.util.Event.W3C_EVT_MOUSE_OVER    = "mouseover";
js.util.Event.W3C_EVT_MOUSE_CLICK   = "click";
js.util.Event.W3C_EVT_MOUSE_DBCLICK = "dbclick";

// Event of J$VM system
js.util.Event.SYS_EVT_STATECHANGED  = "statechanged";
js.util.Event.SYS_EVT_SUCCESS       = "success";
js.util.Event.SYS_EVT_HTTPERR       = "httperr";
js.util.Event.SYS_EVT_TIMEOUT       = "timeout";
js.util.Event.SYS_EVT_MOVING        = "moving";
js.util.Event.SYS_EVT_MOVED         = "moved";
js.util.Event.SYS_EVT_RESIZING      = "resizing";
js.util.Event.SYS_EVT_RESIZED       = "resized";
js.util.Event.SYS_EVT_ZINDEXCHANGED = "zindexchanged";
js.util.Event.SYS_EVT_GEOMCHANGED   = "geomchanged";

// Message of J$VM system
js.util.Event.SYS_MSG_CONSOLEINF    = "console_inf";
js.util.Event.SYS_MSG_CONSOLEERR    = "console_err";
js.util.Event.SYS_MSG_CONSOLELOG    = "console_log";

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

$package("js.util");

js.util.EventListener = function (listener, handler){

    var CLASS = js.util.EventListener, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init(listener, handler);
        return;
    }
    CLASS.__defined__ = true;
    
    thi$.handleEvent = function(){
        if(typeof this.handler === "function"){
            this.handler.apply(this.listener, arguments);
        }
    };

    thi$.equals = function(o){
        return o ?
            (o.listener === this.listener &&
             o.handler === this.handler) : false;
    };
    
    thi$._init = function(l, h){
        if(typeof l == "object" && typeof h == "function"){

            this.listener = l;
            this.handler  = h;
            
            if(typeof l.uuid != "function"){
                var o = this.listener;

                o.hashCode = function(){
                    if(!this._hash){
                        this._hash = js.lang.Math.random(new Date().getTime());
                    }
                    return this._hash;
                };

                o.uuid = function(id){
                    if(arguments.length > 0){
                        this._uuid = id;         
                    }else if(!this._uuid){
                        this._uuid = js.lang.Math.uuid(this.hashCode());
                    }

                    return this._uuid;
                };
            }

            this.uuid(l.uuid());
        }
    };
    
    this._init(listener, handler);
    
}.$extend(js.lang.Object);


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

$package("js.util");

$import("js.util.Observable");

js.util.EventTarget = function (def, Runtime){

    var CLASS = js.util.EventTarget, thi$ = CLASS.prototype;
    if(CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, 
        List = js.util.LinkedList,
        // Global targets
        gTargets = {};

    var _getListeners = function(eventType){
        var hName = "on"+eventType, listeners = this[hName];

        if(!Class.isArray(listeners)){
            listeners = this[hName] = List.$decorate([]);
        }
        
        return listeners;
    };

    thi$.addEventListener = function(eventType, fn, captured){
        _getListeners.call(this, eventType).push(fn);
    };

    thi$.removeEventListener = function(eventType, fn, captured){
        _getListeners.call(this, eventType).remove(fn);
    };

    var _prepareArgs = function(eventType, flag, listener, handler){
        var check = Event.FLAG.check(flag),
            args = Array.prototype.slice.call(arguments, 0);
        
        if(check.customized){
            args.unshift(this);
        }else{
            if(this.view != undefined){
                args.unshift(this.view);
            }else{
                args.unshift(this);
            }
        }

        return args;        
    };

    /**
     * This method allows the registration of event listeners on the event 
     * target.
     * 
     * @param eventType the event type for which the user is registering
     * @param flag Optional, 0x01: Exclusive, 0x02: Capture, the default is 0
     * @param listener, the listener scope
     * @param handler, the event handler
     * 
     * @see detachEvent(eventType, flag, listener, handler);
     */
    thi$.attachEvent = function(eventType, flag, listener, handler){
        Event.attachEvent.apply(this, _prepareArgs.apply(this, arguments));
    };
    
    /**
     * This method allows the removal of event listeners from the event 
     * target.
     * 
     * @see attachEvent(eventType, flag, listener, handler);
     */
    thi$.detachEvent = function(eventType, flag, listener, handler){
        Event.detachEvent.apply(this, _prepareArgs.apply(this, arguments));
    };

    /**
     * This method allows to declare the event type that can be fired by the 
     * event target.
     * 
     * @param evType event type
     */
    thi$.declareEvent = function(eventType){
        this["on"+eventType] = null;
    };
    
    /**
     * The method allows the event target fire event to the event listeners 
     * synchronously. That says, this method will be blocked till to all 
     * listeners were invoked.
     * 
     * @param evt <code>js.util.Event</code> instance
     * 
     * @see dispatchEvent(evt);
     */
    thi$.fireEvent = function(evt, bubble){
        var eType, isEventObj;
        
        if(evt.instanceOf && evt.instanceOf(Event)){
            isEventObj = true;
            eType = evt.getType();
        }else if(Class.isString(evt)) {
            eType = evt;
        }

        var listeners = this["on"+eType];
        switch(Class.typeOf(listeners)){
        case "function":
            listeners.call(this, evt);
            break;
        case "array":
            for(var i=0, len=listeners.length; i<len; i++){
                listeners[i](evt);
            }
            break;
        default:
            break;
        }

		// Bubble event
        if(isEventObj && (bubble === true) && 
           (evt._bubble === true)){
            var p = this.getContainer ? this.getContainer() : undefined;
            if(p && p.fireEvent){
                p.fireEvent(evt, bubble);
            }
        }
    };

    thi$.canCapture = function(){
        var cap = this.def ? this.def.capture : false, parent;
        cap = cap || false;
        if(cap){
            parent = this.getContainer ? this.getContainer() : null;
            cap = cap && ((parent && parent.canCapture) ? parent.canCapture() : false);
        }
        return cap;
    };
    
    /**
     * Return event target with specified uuid
     */
    thi$.getEventTarget = function(uuid){
        return gTargets[uuid];
    };

    thi$.destroy = function(){
        var eType, handlers = this.__handlers__;

        if(handlers){
            for(eType in handlers){
                this.detachEvent(eType, 4);
            }
            delete this.__handlers__;
        }
        
        handlers = this.view ? this.view.__handlers__ : undefined;
        if(handlers){
            for(eType in handlers){
                this.detachEvent(eType, 0);
                this.detachEvent(eType, 1);
            }
            this.view.__handlers__ = null;          
        }
        
        delete gTargets[this.uuid()];
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(def === undefined) return;

        arguments.callee.__super__.apply(this, arguments);

        gTargets[this.uuid()] = this;

    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
}.$extend(js.util.Observable);


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

$package("js.util");

js.util.Messenger = function (){
    var Q, running = false;
    
    /**
     * Subscribe a message to the receiver
     * 
     * @param msgId, the id uniquely identified a message type
     * @param recevier, the message receiver
     * @param handler, the handler of the receiver to handle the message 
     * 
     * @see cancel(msgId, receiver, handler)
     */
    this.register = function(msgId, receiver, handler){
        var recvs = this.table[msgId];
        if(recvs === undefined){
            recvs = js.util.LinkedList.newInstance([]);
            this.table[msgId] = recvs;
        }
        
        var recv = new js.util.EventListener(receiver, handler);
        if(!recvs.contains(recv)){
            recvs.push(recv);
        }
    };
    
    /**
     * Cancel a message subscribe
     * 
     * @param msgId, the id uniquely identified a message type
     * @param receiver, the message receiver
     * @param handler, the handler of the receiver to handle the message 
     * 
     * @see register(msgId, receiver, handler)
     */
    this.cancel = function(msgId, receiver, handler){
        var recvs = this.table[msgId];
        if(recvs === undefined) return;
        
        var recv = new js.util.EventListener(receiver, handler);
        var p = recvs.indexOf(recv);
        if(p != -1){
            recvs.remove0(p);
            if(recvs.length === 0){
                delete this.table[msgId];
            }
        }
    };
    
    /**
     * Remove all subscribes of the specified receiver 
     * 
     * @param receiverId, the id that uniquely identified a recevier
     */
    this.remove = function(receiverId){
        
        var indexOf = function(list, id){
            for(var i=0, len=list.length; i<len; i++){
                if(list[i].uuid() === id) return i;
            }
            return -1;
        };

        var table = this.table, recvs, idx, p;
        for(p in table){
            recvs = table[p];
            while((idx = indexOf(recvs, receiverId)) != -1){
                recvs.remove0(idx);
            }
            if(recvs.length == 0){
                delete this.table[p];
            }
        }
    };
    
    /**
     * Post a message to Messenger
     * Call this method, the message will be put in message queue 
     * and return immediately
     * 
     * @param msgId, the message id
     * @param msgData, the message content
     * @param recvs, specify who will receive this message
     * @param device, the id uniquely identified a J$VM
     * @param priority, 0 for urgent and 1 for grneral message
     */
    this.post = function(msgId, msgData, recvs, device, priority){
        // We store the message as [msgId, msgData, recvs, device, priority]
        var msg = [msgId, msgData, 
                   js.lang.Class.typeOf(recvs) === "array" ? recvs : [],
                   device === undefined ? null : device,
                   priority === 0 ? 0 : (priority === 1 ? 1 : 1)];

        Q[msg[4]].push(msg);

        if(!running){
            _schedule();
        }
    };
    
    var _schedule = function(){
        if(Q.isEmpty()){
            running = false;
        }else{
            running = true;
            _dispatch.$delay(this, 0);
        }
    }.$bind(this);
    
    var _dispatch = function(){
        var msg = Q.get();
        if(js.lang.Class.typeOf(msg) != "array"){
            _schedule();
            return;
        }

        var device = msg[3], g, 
            recvs = this.table[msg[0]], recv;
        
        if(device != null){
            // Forward to other device
            msg[3] = null;
            if(J$VM.env.j$vm_isworker){
                device.postMessage(JSON.stringify(msg));
            }else{
                device.postMessage(JSON.stringify(msg), "*");    
            }

        }else if(recvs != undefined && recvs.length > 0){

            for(var i=0, len=msg[2].length; i<len; i++){
                if(g === undefined) g = {};
                g[msg[2][i]] = true;
            }
            
            for(i=0, len=recvs.length; i<len; i++){
                recv = recvs[i];

                if(g != undefined){
                    if(g[recv.uuid()]){
                        recv.handleEvent.$delay(recv, 0, msg[1]);
                    }
                }else{
                    recv.handleEvent.$delay(recv, 0, msg[1]);
                }
            }
            
        }

        _schedule();

    }.$bind(this);
    
    /**
     * Send a message to other subscribers
     * Call this method will be blocked to all reltated subscribers 
     * handle the message.
     * 
     * @see post(msgId, msgData, recvs, device, priority)
     */
    this.send = function(msgId, msgData, rcvs, device, priority){
        priority = priority === 0 ? 0 : (priority === 1 ? 1 : 1),
        device = device === undefined ? null : device,
        rcvs = js.lang.Class.typeOf(rcvs) === "array" ? rcvs : [];
        
        var recvs = this.table[msgId], recv, g;
        
        if(device != null){
            // Forward to other device
            if(J$VM.env.j$vm_isworker){
                device.postMessage(JSON.stringify(
                    [priority, null, rcvs, msgId, msgData]));
            }else{
                device.postMessage(JSON.stringify(
                    [priority, null, rcvs, msgId, msgData]), "*");    
            }

            // There are some issues at here ! Can not send message cross device

        }else if(recvs != undefined && recvs.length > 0){

            for(var i=0, len=rcvs.length; i<len; i++){
                if(g === undefined) g = {};
                g[rcvs[i]] = true;
            }
            
            for(i=0, len=recvs.length; i<len; i++){
                recv = recvs[i];
                
                if(g != undefined){
                    if(g[recv.uuid()]){
                        recv.handleEvent(msgData);    
                    }
                    
                }else{
                    recv.handleEvent(msgData);
                }
            }
        }
    };
    
    var _init = function(){

        // Subscribe infomation
        this.table = {};
        
        // Message queue for post
        Q = [[],[]];
        Q.isEmpty = function(){
            return (this[0].length + this[1].length) == 0;
        };
        Q.get = function(){
            var o = this[0].shift();
            o = (o === undefined) ? this[1].shift() : o;
            return o;
        };

        _schedule();

    }.call(this);

}.$extend(js.lang.Object);

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

$package("js.util");

js.util.Document = function (){

	var CLASS = js.util.Document, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event, cache = {},
	
	// Attributes Compatibility Table: Left - W3C, Right - IE 7
	// 1) In HTML documents, the name is case-insensitive in Firefox, Opera, 
	//	  Google Chrome, Safari and in Internet Explorer from version 8.
	// 2) In Internet Explorer earlier than version 8, the default is that 
	//	  the name is case-sensitive in HTML documents but these settings can 
	//	  be modified by the caseSens parameter of the setAttribute method.
	// 3) In Internet Explorer earlier than version 8, the corresponding JavaScript 
	//	  property name (camelCase name) needs to be specified.
	ATTRIBUTESCT = {
		acceptcharset: "acceptCharset",
		accesskey: "accessKey",
		allowtransparency: "allowTransparency",
		bgcolor: "bgColor",
		cellpadding: "cellPadding",
		cellspacing: "cellSpacing",
		"class": "className",
		colspan: "colSpan",
		checked: "defaultChecked",
		selected: "defaultSelected",
		"for": "htmlFor" ,
		frameborder: "frameBorder",
		hspace: "hSpace",
		longdesc: "longDesc",
		maxlength: "maxLength",
		marginwidth: "marginWidth",
		marginheight: "marginHeight",
		noresize: "noResize",
		noshade: "noShade",
		readonly: "readOnly",
		rowspan: "rowSpan",
		tabindex: "tabIndex",
		valign: "vAlign",
		vspace: "vSpace"
	},
	BOOLATTRREGEXP = /^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noshade|nowrap|readonly|selected)$/,
	DOCTYPECT = {
		"html-4.01": {bodysize: false},
		"html-4.01-transitional": {bodysize: true}
	};

	/**
	 * Create a DOM element
	 * 
	 */
	thi$.createElement = function(type){
		var el = document.createElement(type);
		if(el.tagName == "IMG"){
			this.forbidSelect(el);
		}
		return el;
	};
	
	var REGX_CAMEL = /[A-Z]/g, REGX_HYPHEN = /-([a-z])/ig,
	textSps = ["font-family", "font-size", "font-style", 
			   "font-weight", "text-decoration", "text-align", "font-weight"],	  
	camelMap = {}, hyphenMap = {};

	/**
	 * Convert hyphen style name to camel style name
	 * 
	 * @param s, name string
	 * 
	 * @return string
	 */ 
	thi$.camelName = function(s){
		var _s = camelMap[s];
		if(_s != undefined) return _s;

		_s = s.replace(REGX_HYPHEN, 
					   function(a, l){return l.toUpperCase();});
		
		camelMap[s] = _s;
		if(_s !== s){
			hyphenMap[_s]=	s;
		}

		return _s;		
	};

	/**
	 * Convert camel style name to hyphen style name
	 * 
	 * @param s, name string
	 * 
	 * @return string
	 */ 
	thi$.hyphenName = function(s){
		var _s = hyphenMap[s];
		if(_s !== undefined) return _s;

		_s = s.replace(REGX_CAMEL, 
					   function(u){return "-" + u.toLowerCase();});
		
		hyphenMap[s] = _s;
		if(_s !== s){
			camelMap[_s]=  s;
		}

		return _s;		
	};
	
	thi$.offsetParent = function(ele){
		var body = document.body, p = ele.offsetParent;
		if(!p || !this.contains(body, p, true)){
			p = body;
		}
		
		return p;
	};

	/**
	 * Returns current styles of the specified element
	 * 
	 */	   
	thi$.currentStyles = function(el, isEle){
		var defaultView = document.defaultView, ret;
		isEle = isEle === undefined ? this.isDOMElement(el) : isEle;
		
		if(isEle){
			if(defaultView && defaultView.getComputedStyle){
				// W3C
				ret = defaultView.getComputedStyle(el, null);
			}else{
				// IE
				ret = el.currentStyle;
			}
		}else {
			ret = {};
		}

		return ret;
	};


	var _pretreatProp = function (sp) {
		if(sp == "float") {
			return J$VM.supports.supportCssFloat ? 
				"cssFloat" : "styleFloat";
		} else {		
			return this.camelName(sp);
		}

	};
	
	/**
	 * Return the computed style of the element.
	 * 
	 * @param el, the DOM element
	 * @param sp, the style property name
	 */
	thi$.getStyle = function(el, sp){
		if(el == document) 
			return null;

		var defaultView = document.defaultView;
		var cs, prop = _pretreatProp.call(this, sp);
		
		if(defaultView && defaultView.getComputedStyle){
			var out = el.style[prop];
			if(!out) {
				cs = defaultView.getComputedStyle(el, "");
				out = cs ? cs[prop] : null;
			}
			
			if(prop == "marginRight" && out != "0px" && 
			   !J$VM.supports.reliableMarginRight){
				var display = el.style.display;
				el.style.display = 'inline-block';
				out = defaultView.getComputedStyle(el, "").marginRight;
				el.style.display = display; 
			}
			
			return out;
		} else {
			if ( sp == "opacity") {
				if (el.style.filter.match) {
					var matches = el.style.filter.match(/alpha\(opacity=(.*)\)/i);
					if(matches){
						var fv = parseFloat(matches[1]);
						if(!isNaN(fv)){
							return fv ? fv / 100 : 0;
						}
					}
				}
				return 1;
			}
			
			return el.style[prop] || ((cs = el.currentStyle) ? cs[prop] : null);
		}
	};
	
	/**
	 * Return the computed styles of the element
	 * 
	 * @param el, the DOM element
	 * @param sps, the array of style property name
	 */
	thi$.getStyles = function(el, sps){
		var styles = {};
		(function(styles, el, sp){
			 styles[this.camelName(sp)] = this.getStyle(el, sp);	  
		 }).$forEach(this, sps || [], styles, el);
		
		return styles;
	};
	
	/**
	 * Fetch and return the value of attribute from the specified
	 * DOM element. 
	 * 
	 * @param el: {DOM} Specified DOM element
	 * @param attr: {String} Specified attribute name to fetch
	 * 
	 * @return {String} Value fo the specified attribute. Return
	 *		  "" if not found.
	 */	   
	thi$.getAttribute = function(el, attr){
		if(!el || el.nodeType !== 1 || !attr){
			return "";
		}
		
		var tmp = attr.toLowerCase(), prop = tmp, v;
		if(J$VM.ie && parseInt(J$VM.ie) < 8){
			prop = ATTRIBUTESCT[attr] || ATTRIBUTESCT[tmp] || attr;
		}else{
			prop = tmp;
		}
		
		if(J$VM.ie){
			v = el[prop];
		}
		
		if(!v){
			v = el.getAttribute(attr);
		}
		
		// Check boolean attributes
		if(BOOLATTRREGEXP.test(tmp)){
			if(el[prop] === true && v === ""){
				return tmp;
			}
			
			return v ? tmp : "";
		}
		
		return v ? "" + v : "";
	};
	
	/**
	 * Judge whether the specified DOM element has the specified
	 * attribute. 
	 * 
	 * @param attr: {String} Name of the specified attribute.
	 */
	thi$.hasAttribute = function(el, attr){
		if(el.hasAttribute){
			return el.hasAttribute(attr);
		}

		return el.getAttribute(attr) != null;
	};
	
	/**
	 * Set value of given attribute for the specified DOM element.
	 * If the attribute is boolen kind, when only when the given 
	 * value is true/"true" it will be setten otherwise the specified
	 * attribute will be removed.
	 */
	thi$.setAttribute = function(el, attr, value){
		if(!el || el.nodeType !== 1 || !attr){
			return;
		}
		
		var prop = attr.toLowerCase(), v;
		if(J$VM.ie && parseInt(J$VM.ie) < 8){
			attr = ATTRIBUTESCT[attr] || ATTRIBUTESCT[prop] || attr;
		}else{
			attr = prop;			
		}
		
		if(BOOLATTRREGEXP.test(prop)){
			if(Class.isString(value)){
				v = (value.toLowerCase() === "true");
			}else{
				v = (value === true);
			}
			
			if(v){
				el.setAttribute(attr, "" + v);
			}else{
				el.removeAttribute(attr);
			}
			
			return;
		}
		
		v = Class.isValid(value) ? "" + value : "";
		if(v.length > 0){
			el.setAttribute(attr, v);
		}else{
			el.removeAttribute(attr);		 
		}
	};
	
	thi$.removeAttribute = function(el, attr){
		if(!el || el.nodeType !== 1 || !attr){
			return;
		}
		
		var prop = attr.toLowerCase();
		if(J$VM.ie && parseInt(J$VM.ie) < 8){
			attr = ATTRIBUTESCT[attr] || ATTRIBUTESCT[prop] || attr;
		}else{
			attr = prop;
		}

		el.removeAttribute(attr);
	};

	thi$.setAttributes = function(el, attrObj){
		if(!el || el.nodeType !== 1 
		   || (typeof attrObj !== "object")){
			return;
		}
		
		var attr;
		for(attr in attrObj){
			this.setAttribute(el, attr, attrObj[attr]);
		}
	};
	
	/**
	 * Apply opacity to the DOM element. 
	 * For IE, apply it by setting the alpha filter.
	 * 
	 * @param el, the Dom element
	 * @param value, the opacity will be used
	 */
	thi$.setOpacity = function(el, value){
		var style = el.style,
		currentStyle = el.currentStyle;
		
		if(J$VM.ie && parseInt(J$VM.ie) < 10) {
			var opacity = isNaN(value) ? "" : "alpha(opacity=" + value * 100 + ")";
			var filter = currentStyle && currentStyle.filter || style.filter || "";
			filter = filter.replace(/alpha\(opacity=(.*)\)/i, "")
				.replace(/(^\s*)|(\s*$)/g, "");

			// Force IE to layout by setting the zoom level
			style.zoom = 1;
			
			// Set the opacity by setting the alpha filter
			var filterVal = new js.lang.StringBuffer();
			filterVal = filterVal.append(filter);
			filterVal = filter.length > 0 ? filterVal.append(" ") : filterVal;
			filterVal = filterVal.append(opacity);
			
			style.filter = filterVal.toString();
		} else {
			style.opacity = value;
		}
	};
	
	/**
	 * Clear the setten opacity from the DOM element.
	 * 
	 * @param el, the DOM element
	 */
	thi$.clearOpacity = function(el){
		var style = el.style;
		if(J$VM.ie && parseInt(J$VM.ie) < 10){
			var filter = style.filter;
			style.filter = filter ? filter.replace(/alpha\(opacity=(.*)\)/i, "")
				.replace(/(^\s*)|(\s*$)/g, "") : "";
		}else{
			style.opacity = style['-moz-opacity'] = style['-khtml-opacity'] = "";
		}
	};
	
	/**
	 * Apply style for the DOM element
	 * 
	 * @param el: the DOM element
	 * @param sp: name of the specified style to apply
	 * @param value: the vlaue of the specified style to apply
	 */	 
	thi$.setStyle = function(el, sp, value){
		if(sp.toLowerCase() == "opacity"){
			this.setOpacity(el, value);
		}else{
			sp = _pretreatProp.call(this, sp);
			el.style[sp] = value;
		};
	};

	/**
	 * Apply styles to the DOM element
	 * 
	 * @param el, the DOM element
	 * @param styles, the style set
	 */	   
	thi$.applyStyles = function(el, styles){
		(function(el, value, sp){
			 this.setStyle(el, sp, value);
		 }).$map(this, styles || {}, el);
	};
	
	thi$.parseNumber = function(value){
		var i = Class.isValid(value) ? parseInt(value) : 0;
		if(Class.isNumber(i)) return i;
		switch(value.toLowerCase()){
		case "thin": return 1;
		case "medium": return 3;
		case "thick": return 5;
		default: return 0;
		}
	};

	/**
	 * Get border width of this element
	 * 
	 * @param el the element
	 * @param currentStyles @see this.currentStyles()
	 * @param isEle	 whether the element is a DOM element
	 * 
	 * @return {borderTopWidth, borderRightWidth, 
	 * borderBottomWidth, borderLeftWidth}
	 */
	thi$.getBorderWidth = function(el, currentStyles, isEle){
		var bounds = el.bounds; if(!bounds) bounds = el.bounds = {};
		
		if(!bounds.MBP || !bounds.MBP.borderTopWidth){
			var MBP = bounds.MBP = bounds.MBP || {};

			isEle  = isEle === undefined ?	this.isDOMElement(el) : isEle;
			currentStyles = currentStyles || this.currentStyles(el, isEle);

			var bs = currentStyles["borderTopStyle"].toLowerCase();
			MBP.borderTopWidth = 
				((!bs || bs === "none") ? 
				 0 : this.parseNumber(currentStyles["borderTopWidth"]));
			
			bs = currentStyles["borderRightStyle"].toLowerCase();
			MBP.borderRightWidth = 
				((!bs || bs === "none") ? 
				 0 : this.parseNumber(currentStyles["borderRightWidth"]));
			
			bs = currentStyles["borderBottomStyle"].toLowerCase();
			MBP.borderBottomWidth = 
				((!bs || bs === "none") ? 
				 0 : this.parseNumber(currentStyles["borderBottomWidth"]));
			
			bs = currentStyles["borderLeftStyle"].toLowerCase();
			MBP.borderLeftWidth = 
				((!bs || bs === "none") ? 
				 0 : this.parseNumber(currentStyles["borderLeftWidth"]));
		}

		return bounds.MBP;
	};

	/**
	 * Return padding width of the element
	 * 
	 * @param el the element
	 * @param currentStyles @see this.currentStyles()
	 * @param isEle	 whether the element is a DOM element
	 * 
	 * @return {paddingTop, paddingRight, paddingBottom, paddingLeft}
	 */
	thi$.getPadding = function(el, currentStyles, isEle){
		var bounds = el.bounds; if(!bounds) bounds = el.bounds = {};

		if(!bounds.MBP || !bounds.MBP.paddingTop){
			var MBP = bounds.MBP = bounds.MBP || {};
			isEle  = isEle === undefined ?	this.isDOMElement(el) : isEle;
			currentStyles = currentStyles || this.currentStyles(el, isEle);

			MBP.paddingTop	 = this.parseNumber(currentStyles["paddingTop"]);
			MBP.paddingRight = this.parseNumber(currentStyles["paddingRight"]);
			MBP.paddingBottom= this.parseNumber(currentStyles["paddingBottom"]);
			MBP.paddingLeft	 = this.parseNumber(currentStyles["paddingLeft"]);
		}

		return bounds.MBP;
	};

	/**
	 * Return margin width of the element
	 * 
	 * @param el the element
	 * @param currentStyles @see this.currentStyles()
	 * @param isEle	 whether the element is a DOM element
	 * 
	 * @return {marginTop, marginRight, marginBottom, marginLeft}
	 */
	thi$.getMargin = function(el, currentStyles, isEle){
		var bounds = el.bounds; if(!bounds) bounds = el.bounds = {};

		if(!bounds.MBP || !bounds.MBP.marginTop){
			var MBP = bounds.MBP = bounds.MBP || {};
			isEle  = isEle === undefined ?	this.isDOMElement(el) : isEle;
			currentStyles = currentStyles || this.currentStyles(el, isEle);

			MBP.marginTop	= this.parseNumber(currentStyles["marginTop"]);
			MBP.marginRight = this.parseNumber(currentStyles["marginRight"]);
			MBP.marginBottom= this.parseNumber(currentStyles["marginBottom"]);
			MBP.marginLeft	= this.parseNumber(currentStyles["marginLeft"]);
		}

		return bounds.MBP;
	};
	
	thi$.getBoundRect = function(el, isEle){
		isEle = isEle === undefined ? this.isDOMElement(el) : isEle;

		return isEle ? el.getBoundingClientRect() : 
			{ left: 0, top: 0, bottom: 0, right: 0 };
	};
	
	var _computeByBody = function(){
		var doctype = J$VM.doctype, fValues = [], 
		b = true, v, table;
		if(doctype.declared){
			v = doctype.getEigenStr();
			if(v){
				table = DOCTYPECT[v];
				b = table ? (table["bodysize"] || false) : false;
			}else{
				b = false;
			}
		}
		
		return b;
	};

	/**
	 * Return the outer (outer border) size of the element
	 * 
	 * @return {width, height}
	 */
	thi$.outerSize = function(el, isEle){
		if(el.tagName !== "BODY"){
			var r = this.getBoundRect(el, isEle);
			return {left: r.left, 
					top: r.top, 
					width: r.right-r.left, 
					height:r.bottom-r.top };
		}else{
			var b = _computeByBody.call(this);
			return {
				left: 0, 
				top:  0,
				width: b ? document.body.clientWidth : 
					document.documentElement.clientWidth,
				height: b ? document.body.clientHeight : 
					document.documentElement.clientHeight};
		}
	};

	/**
	 * Return outer (outer border) width of the element
	 * 
	 */
	thi$.outerWidth = function(el, isEle){
		return this.outerSize(el, isEle).width;
	};
	
	/**
	 * Return outer (outer border) height of the element
	 * 
	 */
	thi$.outerHeight = function(el, isEle){
		return this.outerSize(el, isEle).height;
	};

	/**
	 * Return the inner (content area) size of the element
	 * 
	 * @return {width, height}
	 */
	thi$.innerSize = function(el, currentStyles, isEle){
		var o = this.outerSize(el, isEle),
		b = this.getBorderWidth(el, currentStyles, isEle),
		p = this.getPadding(el, currentStyles, isEle);
		
		return{
			width:	o.width - b.borderLeftWidth - b.borderRightWidth - 
				p.paddingLeft - p.paddingRight,

			height: o.height- b.borderTopWidth	- b.borderBottomWidth-
				p.paddingTop - p.paddingBottom
		};
	};
	
	/**
	 * Return the inner (content area) width of the element
	 */
	thi$.innerWidth = function(el, currentStyles, isEle){
		return this.innerSize(el, currentStyles, isEle).width;
	};
	
	/**
	 * Return the inner (content area) height of the element
	 */
	thi$.innerHeight = function(el, currentStyles, isEle){
		return this.innerSize(el, currentStyles, isEle).height;
	};
	
	/**
	 * Set outer size of the element
	 * 
	 * @param el
	 * @param w width
	 * @param h height
	 * @param bounds @see getBounds(el)
	 */
	thi$.setSize = function(el, w, h, bounds){

		bounds = bounds || this.getBounds(el);
		var BBM = bounds.BBM, styleW, styleH, 
		isCanvas = (el.tagName === "CANVAS");

		if(BBM){
			styleW = w;
			styleH = h;
		}else{
			styleW = w - bounds.MBP.BPW;
			styleH = h - bounds.MBP.BPH;
		}
		
		if(Class.isNumber(styleW) && styleW >= 0){
			bounds.width = w;	 
			bounds.innerWidth = w - bounds.MBP.BPW;

			if(isCanvas){
				el.width = styleW;
			}else{
				el.style.width = styleW + "px";
			}
		}

		if(Class.isNumber(styleH) && styleH >= 0){
			bounds.height= h;
			bounds.innerHeight = h - bounds.MBP.BPH;

			if(isCanvas){
				el.height = styleH;
			}else{
				el.style.height = styleH + "px";
			}
		}
	};
	
	/**
	 * Return absolute (x, y) of this element
	 * 
	 * @return {x, y}
	 * 
	 * @see absX()
	 * @see absY()
	 */
	thi$.absXY = function(el, isEle){
		var r = this.getBoundRect(el, isEle);
		return { x: r.left, y: r.top };
	};
	
	/**
	 * Return absolute left (outer border to body's outer border) of this 
	 * element 
	 */
	thi$.absX = function(el, isEle){
		return this.absXY(el, isEle).x;
	};
	
	/**
	 * Return absolute top (outer border to body's outer border) of this 
	 * element 
	 */
	thi$.absY = function(el, isEle){
		return this.absXY(el, isEle).y;
	};
	
	/**
	 * Return offset (x, y) of this element
	 * 
	 * @return {x, y}
	 * 
	 * @see offsetX()
	 * @see offsetY()
	 */
	thi$.offsetXY = function(el){
		return {x: el.offsetLeft, y: el.offsetTop };
	};

	/**
	 * Return offset left (outer border to offsetParent's outer border) of 
	 * this element
	 */
	thi$.offsetX  = function(el){
		return this.offsetXY(el).x;
	};
	
	/**
	 * Return offset top (outer border to offsetParent's outer border) of 
	 * this element
	 */
	thi$.offsetY = function(el){
		return this.offsetXY(el).y;
	};

	/**
	 * Set the position of the element
	 * 
	 * @param el, element
	 * @param x, left position in pixel
	 * @param y, top position in pixel
	 */
	thi$.setPosition = function(el, x, y, bounds){
		bounds = bounds || this.getBounds(el);
		
		if(Class.isNumber(x)){
			bounds.x = x;
			el.style.left = x + "px";
		}

		if(Class.isNumber(y)){
			bounds.y = y;
			el.style.top =	y + "px";
		}
	};
	
	/**
	 * Return box model of this element
	 */
	thi$.getBounds = function(el){
		var isEle = _checkElement.call(this, el), 
		outer = this.outerSize(el, isEle),
		bounds = el.bounds = el.bounds || {};
		
		if(bounds.BBM === undefined){
			// BBM: BorderBoxModel
			if(Class.typeOf(el) === "htmlinputelement" ||
			   Class.typeOf(el) === "htmltextareaelement"){
				bounds.BBM = J$VM.supports.iptBorderBox;
			}else{
				bounds.BBM = J$VM.supports.borderBox;
			}

			var currentStyles = this.currentStyles(el, isEle);
			this.getMargin(el, currentStyles, isEle);
			this.getPadding(el, currentStyles, isEle);
			this.getBorderWidth(el, currentStyles, isEle);
			// Above 3 invokes will generates bounds.MBP
			var MBP = bounds.MBP; // MBP: Margin-Border-Padding
			MBP.BW = MBP.borderLeftWidth + MBP.borderRightWidth;
			MBP.BH = MBP.borderTopWidth + MBP.borderBottomWidth;
			MBP.PW = MBP.paddingLeft + MBP.paddingRight;
			MBP.PH = MBP.paddingTop + MBP.paddingBottom;
			MBP.MW = MBP.marginLeft + MBP.marginRight;
			MBP.MH = MBP.marginTop + MBP.marginBottom;
			MBP.BPW= MBP.BW + MBP.PW;
			MBP.BPH= MBP.BH + MBP.PH;
		}
		
		bounds.width = outer.width;
		bounds.height= outer.height;

		bounds.absX	 = outer.left;
		bounds.absY	 = outer.top;
		
		return bounds;
	};
	
	/**
	 * Set box model to this element
	 * 
	 * @see getBounds(el);
	 */
	thi$.setBounds = function(el, x, y, w, h, bounds){
		this.setPosition(el, x, y, bounds);
		this.setSize(el, w, h, bounds);
	};

	/**
	 * Returns whether an element has scroll bar
	 * 
	 * @return {
	 *	 hscroll: true/false
	 *	 vscroll: true/false
	 * }
	 */
	thi$.hasScrollbar = function(el){
		var MBP = this.getBounds(el).MBP,
		vbw = el.offsetWidth - el.clientWidth - MBP.BW,
		hbw = el.offsetHeight- el.clientHeight- MBP.BH;

		return {
			vbw: vbw, hbw: hbw,
			vscroll: vbw > 1,
			hscroll: hbw > 1
		};
	};
	
	/**
	 * Unbind listeners for the given DOM.
	 */
	thi$.removeFun = function(el){
		if(!el) return;

		if(el.nodeType == 1){
			var handlers = el.__handlers__, eventType;
			if(handlers){
				for(eventType in handlers){
					Event.detachEvent(el, eventType);
				}
			}

			el.__handlers__ = undefined;
			el.bounds = undefined;
		}
		
		var a = el.attributes, i, l, n;
		if(a){
			for(i=a.length-1; i>=0; i--){
				n = a[i].name;
				if(typeof el[n] === "function"){
					el[n] = null;
				}
			}
		}
		a = el.childNodes;
		if(a){
			for(i=0, l=a.length; i<l; i++){
				arguments.callee(a.item(i));
			}
		}
	};

	/**
	 * Remove child from DOM tree and driver browser to collect garbage.
	 */
	thi$.remove = function(){
		var p; 
		return function(el, gc){
			if(!el) return;

			if(gc){
				this.removeFun(el);

				if(Class.typeOf(el) != "htmlbodyelement"){
					p = p || document.createElement("DIV");
					p.appendChild(el);
					p.innerHTML = "";
				}
			}				 

			if(el.parentNode) {
				el.parentNode.removeChild(el);
			}
		};

	}(); 
	
	/**
	 * Remove the element from the parent node
	 */
	thi$.removeFrom = function(el, parentNode){
		if(!el) return;

		parentNode = parentNode || el.parentNode;
		parentNode.removeChild(el);
	};

	/**
	 * Append the element to the parent node
	 */
	thi$.appendTo = function(el, parentNode){
		parentNode.appendChild(el);
	};
	
	/**
	 * Insert the element before refNode
	 */
	thi$.insertBefore = function(el, refNode, parentNode){
		parentNode = parentNode || refNode.parentNode;
		if(refNode){
			parentNode.insertBefore(el, refNode);	 
		}else{
			parentNode.appendChild(el);
		}
	};
	
	/**
	 * Insert the element after refNode
	 */
	thi$.insertAfter = function(el, refNode){
		this.insertBefore(el, refNode.nextSibling, refNode.parentNode);
	};
	
	/**
	 * Check if the child node is the descendence node of this element.<p>
	 * 
	 * @param el, the element that is being compared
	 * @param child, the element that is begin compared against
	 * @param containSelf, whether contains the scenario of parent == child
	 */
	thi$.contains = function(el, child, containSelf){
		if(el == null || el == undefined || 
		   child == null || child == undefined){
			return false;
		}
		if(el.compareDocumentPosition){
			// W3C
			var res = el.compareDocumentPosition(child);
			if(containSelf && res === 0){
				return true;
			}else{
				return res === 0x14;
			}
		}else{
			// IE
			if(containSelf && el === child){
				return true;
			}else{
				return el.contains(child);
			}
		}
	};
	
	/**
	 * Test if an element has been a DOM element.
	 */
	thi$.isDOMElement = function(el){
		return this.contains(document.body, el, true);
	};
	
	var _checkElement = function(el){
		if(!this.isDOMElement(el)){
			var err = "The element "+(el.id || el.name)+" is not a DOM element.";
			// throw err;
			J$VM.System.err.println(err);
			return false;
		}
		return true;
	};

	var _breakEventChian = function(e){
		if(e.getType() == "selectstart"){
			var el = e.srcElement, elType = Class.typeOf(el);
			if(elType == "htmlinputelement" || 
			   elType == "htmltextareaelement"){
				return true;
			}
		}
		e.cancelBubble();
		return e.cancelDefault();
	};
	/**
	 * Forbid select the element
	 * 
	 * @param el, the element that is fobidden.
	 */
	thi$.forbidSelect = function(el){
		if(typeof document.onselectstart != "function"){
			Event.attachEvent(document, "selectstart", 1, this, _breakEventChian);
		}
		if(typeof el.ondragstart != "function"){
			Event.attachEvent(el, "dragstart", 1, this, _breakEventChian);	  
		}
	};
	
	/**
	 * Transform styles to the CSSText string.
	 * 
	 * @param styles: {Object} key/value pairs of styles.
	 */
	thi$.toCssText = function(styles){
		if(typeof styles !== "object"){
			return "";
		}

		var buf = new js.lang.StringBuffer(), p, v;
		for(p in styles){
			v = styles[p];
			
			if(v !== null && v !== undefined){
				p = this.hyphenName(p);
				
				buf.append(p).append(":").append(v).append(";");
			}
		}
		
		return buf.toString();
	};

	/**
	 * Join the given ordered styles to the CSSText string.
	 * 
	 * @param styleMap: {HashMap} The ordered key/value pairs of styles
	 */	   
	thi$.joinMapToCssText = function(styleMap){
		var HashMap = Class.forName("js.util.HashMap"),
		buf, keys, p, v;
		if(!styleMap || !(styleMap instanceof HashMap)){
			return "";
		}
		
		buf = new js.lang.StringBuffer();
		keys = styleMap.keys();
		for(var i = 0, len = keys.length; i < len; i++){
			p = keys[i];
			v = styleMap.get(p);
			
			if(v !== null && v !== undefined){
				p = this.hyphenName(p);
				
				buf.append(p).append(":").append(v).append(";");
			}
		}
		
		return buf.toString();
	};
	
	/**
	 * Parse the given CSSText as HashMap. With the HashMap,
	 * the order of style names will be kept.
	 * 
	 * @param css: {String} The CSSText string to parse.
	 * 
	 * @return {js.util.HashMap} The ordered styles.
	 */
	thi$.parseCssText = function(css){
		var String = js.lang.String,
		styleMap = new (Class.forName("js.util.HashMap"))(),
		frags, len, tmp, style, value;
		if(!Class.isString(css) || css.length == 0){
			return styleMap;
		}

		frags = css.split(";");
		len = Class.isArray(frags) ? frags.length : 0;
		for(var i = 0; i < len; i++){
			tmp = frags[i];
			tmp = tmp ? tmp.split(":") : null;
			
			if(Class.isArray(tmp)){
				style = tmp[0];
				value = tmp[1];
				
				if(Class.isString(style) && style.length > 0){
					style = String.trim(style);
					value = (Class.isString(value)) 
						? String.trim(value) : "";
					
                    if(style){
                        styleMap.put(style, value);
                    }
				}
			}
		}
		
		return styleMap;
	};
	
	/**
	 * Remove style declaration with the specified style name from 
	 * the given CSSText string, then return the result CSSText string.
	 * 
	 * @param css: {String} The CSSText string to remove from.
	 * @param style: {String} The name of style to remove.
	 * 
	 * @return {String} The result CSSText string.
	 */
	thi$.rmStyleFromCssText = function(css, style){
		if(!Class.isString(css) || css.length == 0
		   || !Class.isString(style) || style.length == 0){
			return css;
		}
		
		var styleMap = this.parseCssText(css);
		if(!styleMap.contains(style)){
			style = this.hyphenName(style);
		}
		
		styleMap.remove(style);
		return this.joinMapToCssText(styleMap);		   
	};
	
	/**
	 * Calculate the text size of the specified span node.
	 * 
	 * @param str: {String} The text to measure, it must not be encoded.
	 * @param styles: {Object} Some styles which can impact the string size, 
	 *		  include font-size, font-weight, font-family, etc. 
	 * 
	 */
	thi$.getStringSize = function(str, styles){
		var System = J$VM.System,
		specialStyles = {
			display: "inline", 
			"white-space": "nowrap",
			position: "absolute",
			left: "-10000px",
			top: "-10000px"
		}, textNode, s;
		
		styles = System.objectCopy(styles || {}, {});
		styles = System.objectCopy(specialStyles, styles);
		
		textNode = this.createElement("SPAN");
		textNode.style.cssText = this.toCssText(styles);
		textNode.innerHTML = js.lang.String.encodeHtml(str);

		this.appendTo(textNode, document.body);
		s = this.outerSize(textNode);
		this.remove(textNode, true);
		textNode = null;
		
		// For ie, the width of a text to fetch isn't often enough for placing
		// the text. Here, we add 1px to make it better.
		if(J$VM.ie){
			s.width += 1;
		}
		
		return s;
	};
	
	/**
	 * Calculate the text size of the specified span node.
	 * 
	 * @param ele: A DOM node with text as display content,
	 *		  include "SPAN", "INPUT", "TEXTAREA"
	 */
	thi$.getTextSize = function(ele){
		var tagName = ele ? ele.tagName : null,
		str, styles;
		switch(tagName){
		case "SPAN":
			str = js.lang.String.decodeHtml(ele.innerHTML);
			break;
		case "INPUT":
		case "TEXTAREA":
			str = ele.value;
			break;
		default:
			break;
		}
		
		if(!Class.isValid(str)){
			return {width: 0, height: 0};
		}
		
		styles = this.getStyles(ele, textSps);
		return this.getStringSize(str, styles);
	};
	
	/**
	 * Set the given HTML content inside the given element.
	 * 
	 * @param e: {DOM} A given DOM element into which the given HTML content will be set.
	 * @param html: {Strin} HTML content to set.
	 */
	thi$.setHTML = function(el, html){
		if(J$VM.ie){
			// Remove children, IE keeps empty text nodes in DOM
			while(el.firstChild){
				el.removeChild(el.firstChild);
			}

			try{
				// IE will remove comments from the beginning unless 
				// place the contents with something.
				el.innerHTML = "<br />" + html;
				el.removeChild(el.firstChild);
			} catch (e) {
				// IE sometimes produce an unknown runtime error on innerHTML 
				// if it's an block element within a block element.
				var tempDiv = this.create("div");
				tempDiv.innerHTML = "<br />" + html;

				// Add all children from div to target element except br
				var children = tempDiv.childNodes, 
				len = children ? children.length : 0;
				for(var i = 1; i < len; i++){
					el.appendChild(children[i]);
				}
			}
		} else {
			el.innerHTML = html;
		}

		return el;
	};
	
	/**
	 * Add styles specified the given CSS codes to current document or 
	 * the specified document at runtime.
	 * If only one argument is given, which should be the CSS codes. If
	 * two are given, the first should be the specified CSS codes, and 
	 * the second should be a document object.
	 * 
	 * @param css: {String} CSS codes to add
	 * @param doc: {HTMLDocument} Optional. A document object
	 */
	thi$.addStyle = function(css, doc){
		doc = doc || document;
		if(!css || !doc){
			return;			   
		}
		
		var head = doc.getElementsByTagName("head")[0],
		styleElements = head.getElementsByTagName("style"),
		styleElement, media, tmpEl;
		if (styleElements.length == 0) {
			if (J$VM.ie) {
				doc.createStyleSheet();
			} else { //w3c
				tmpEl = doc.createElement('style');
				tmpEl.setAttribute("type", "text/css");
				head.appendChild(tmpEl);
			}
		}
		
		styleElement = styleElements[0];
		media = styleElement.getAttribute("media");
		if (media != null && !/screen/.test(media.toLowerCase())) {
			styleElement.setAttribute("media", "screen");
		}
		
		if (J$VM.ie) {
			styleElement.styleSheet.cssText += css;
		} else if (J$VM.firefox) {
			styleElement.innerHTML += css; //Firefox supports adding style by innerHTML
		} else {
			styleElement.appendChild(doc.createTextNode(css));
		}
	};

}.$extend(js.lang.Object);


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
 * Author: Pan mingfa
 * Contact: pmf.sei@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.util");

/**
 * 
 */
$import("js.util.HashMap");

js.util.MemoryStorage = function(capacity){

    var CLASS = js.util.MemoryStorage, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class;

    thi$.isMemory = true;

    thi$.length = function(){
        return this.size();
    };

    thi$.key = function(index){
        return this._keys[index];
    };

    thi$.setItem = function(key, value){
        if(this.size() >= this.capacity){
            _reduce.call(this);
        }

        this.put(key, {key:key, count:1, data:value});
    };
    
    thi$.getItem = function(key){
        var ele = this.get(key), ret;
        if(ele){
            ele.count++;
            ret = ele.data;
        }
        return ret;
    };
    
    thi$.removeItem = function(key){
        var o = this.remove(key);
        return o ? o.data : undefined;
    };

    var _reduce = function(){
        var array = this.values().sort(
            function(a, b){return a.count - b.count;}
        ), len = Math.floor(this.capacity/10), tmp;

        len = len < 1 ? 1 : len;
        while(len > 0){
            tmp = array.shift();
            this.removeItem(tmp.key);
            len--;
        }
    };
    
    thi$._init = function(capacity){
        arguments.callee.__super__.call(this);
        this.capacity = 
            Class.isNumber(capacity) ? capacity : 1024;
    }.$override(this._init);

    this._init.apply(this, arguments);
    
}.$extend(js.util.HashMap);


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
 * Author: Pan mingfa
 * Contact: pmf.sei@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.util");

/**
 * <em>Storage</em> is a encapsulation of HTML WebStorage object.
 * We strongly recommend sb to instantiate this class by invoking the static method
 * <em>getStorage()</em>. 
 * 
 * @param storage: <em>window.sessionStorage</em> or
 *                 <em>window.localStorage</em>
 */
js.util.Storage = function(storage){

    var CLASS = js.util.Storage, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class;

    var _check = function(){
        var hasStorage = (this._storage != null && this._storage != undefined);

        if(arguments.length > 0){
            var key = arguments[0];
            if(typeof key === "string" && key.length > 0){
                return hasStorage;
            }else{
                return false;
            }
        }
        
        return hasStorage;
    };
    
    thi$.keys = function(){
        var keys = [];
        
        if(!this._storage.isMemory){
            for(var i = 0, len= this.length(); i < len; i++){
                keys[i] = this._storage.key(i);                
            }
        }else{
            keys = this._storage.keys();
        }

        return keys;
    };

    thi$.length = function(){
        var sto = this._storage;
        return _check() ? 
            (sto.isMemory ? sto.size() : sto.length) : 0;
    };
    
    thi$.key = function(index){
        return _check() ? this._storage.key(index) : undefined;        
    };

    thi$.setItem = function(key, value){
        if(!_check.call(this,key)) return;
        
        var sto = this._storage;
        
        sto.removeItem(key);

        switch(Class.typeOf(value)){
        case "string":
            sto.setItem(key, value);
            break;
        case "object":
        case "array":
            if(sto.isMemory){
                sto.setItem(key, value);
            }else{
                sto.setItem(key, JSON.stringify(value));                
            }
            break;
        default:
            break;
        }
    };
    
    thi$.getItem = function(key){
        if(!_check.call(this, key)) return null;
        
        var value =  this._storage.getItem(key);
        if(value){
            if(Class.typeOf(value) == "string" && 
               (value.indexOf("{") == 0 || value.indexOf("[") == 0))
                value =  JSON.parse(value);
        }
        
        return value;
    };
    
    thi$.removeItem = function(key){
        if(!_check.call(this, key)) return;

        this._storage.removeItem(key);
    };
    
    thi$.clear = function(){
        if(!_check.call(this)) return;

        this._storage.clear();
    };

    thi$._init = function(storage){
        this._storage = storage;
    };

    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);

/**
 * An static method to instatiate the web storage. For avoiding some syntax 
 * errors and exception, we will instatiate an <em>MemoryStorage</em> instead
 * when HTML5 WebStorage has been supported by browser.
 * 
 * @param type: <em>"local"</em>, <em>"session"</em> and so on. It indicates
 *              which storage will be created.
 */
js.util.Storage.getStorage = function(type) {
    var _storage, _storageObj;

    switch(type){
    case "local":
        try{
            _storage = window.localStorage; 
        } catch (x) {}
        
        break;
    case "session":
        try{
            _storage = window.sessionStorage;
        } catch (e) {}

        break;
    case "memory":
    default:
        _storage = new js.util.MemoryStorage();
        break;
    }
    
    _storageObj = new js.util.Storage(_storage || new js.util.MemoryStorage());

    return _storageObj;
};

js.util.Cache = function(){

    var CLASS = js.util.Cache, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var local, session, memory;

    thi$.setItem = function(key, value){
        try{
            local.setItem(key, value);
        } catch (e1) {
            try{
                session.setItem(key, value);
            } catch (e2) {
                memory.setItem(key, value);
            }
        }
    };
    
    thi$.getItem = function(key){
        var value = memory.getItem(key);
        value = value ? value : session.getItem(key);
        value = value ? value : local.getItem(key);
        return value;
    };

    thi$._init = function(){
        local  = J$VM.storage.local;
        session= J$VM.storage.session;
        memory = J$VM.storage.memory;
    };
    
    this._init.apply(this, arguments);

}.$extend(js.lang.Object);

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

$package("js.util");

js.util.Cookie = function (k, v, e, p, d, s){

    var CLASS = js.util.Cookie, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    thi$.getName = function(){
        return this._name;
    };

    thi$.getValue = function(){
        return this._value;
    };

    thi$.setValue = function(v){
        this._value = v;
    };

    thi$.getMaxAge = function(){
        return this._maxAge;
    };

    thi$.setMaxAge = function(expiry){
        this._maxAge = (typeof expiry === "number" && !isNaN(expiry)) ? 
            expiry*1000 : undefined;
    };

    thi$.getPath = function(){
        return this._path;
    };

    thi$.setPath = function(uri){
        this._path = (typeof uri === "string") ? uri : "/";
    };

    thi$.getDomain = function(){
        return this._domain;
    };

    thi$.setDomain = function(pattern){
        this._domain = (typeof pattern === "string") ? 
            pattern.toLowerCase() : undefined;
    };

    thi$.setSecure = function(s){
        this._secure = (s === true) ? true : undefined;
    };

    thi$.toString = function(){
        var buf = new js.lang.StringBuffer();
        buf.append(this._name).append("=")
            .append(this._value ? escape(this._value) : "");
        if(typeof this._maxAge === "number"){
            var exp = new Date();
            exp.setTime(exp.getTime() + this._maxAge);
            buf.append(";expire=").append(exp.toGMTString());
        }
        if(this._path){
            buf.append(";path=").append(this._path);
        }
        if(this._domain){
            buf.append(";domain=").append(this._domain);
        }
        if(this._secure === true){
            buf.append(";secure").append(this._secure);
        }

        return buf.toString();
    };
    
    thi$._init = function(k, v, e, p, d, s){
        this._name = k;

        this.setValue(v);
        this.setMaxAge(e);
        this.setPath(p);
        this.setDomain(d);

    };

    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);


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

$package("js.util");

$import("js.util.Cookie");

js.util.CookieStorage = function (){

    var CLASS = js.util.CookieStorage, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this.parseCookies();
        return;
    }
    CLASS.__defined__ = true;
    
    var cookies;

    /**
     * Set a cookie
     * 
     */
    thi$.setCookie = function(name, value, expire, path, domain, secure){
        this.add(new js.util.Cookie(
                     name, value, expire, path, domain, secure));
    };
    
    /**
     * Return a cookie value
     * 
     */
    thi$.getCookie = function(name){
        var cookie = this.get(name);
        return cookie ? cookie.getValue() : undefined;
    };

    /**
     * Delete a cookie
     * 
     */
    thi$.delCookie = function(name){
        var cookie = this.get(name);
        if(cookie){
            this.remove(cookie);
        }
    };

    /**
     * Add a cookie
     * 
     * @param cookie, the <code>js.util.Cookie</code> instance
     * @param uri, preserved
     */
    thi$.add = function(cookie, uri){
        document.cookie = cookie.toString();    
        this.parseCookies();
    };
    
    /**
     * Return a <code>js.util.Cookie</code> with the 
     * specified cookie name 
     */
    thi$.get = function(name){
        return cookies[name];
    };

    /**
     * Remove a cookie
     * 
     * @param cookie,the <code>js.util.Cookie</code> instance
     * @param uri, preserved
     */
    thi$.remove = function(cookie, uri){
        cookie.setMaxAge(-1);
        this.add(cookie, uri);
    };

    thi$.parseCookies = function(){
        cookies = cookies || {};
        for(var p in cookies) delete cookies[p];

        var vs = document.cookie.split(";"), item, n, v;
        for(var i=0, len=vs.length; i<len; i++){
            item = vs[i].split("=");
            n = item[0]; v = unescape(item[1]);
            cookies[n] = new js.util.Cookie(n, v);
        }
    };

    this.parseCookies();

}.$extend(js.lang.Object);


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
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.util");

/**
 * A <em>Locale</em> object represents a specific geographical, political,
 * or cultural region.
 */
js.util.Locale = function(language, country){
	var CLASS = js.util.Locale,	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var C = js.lang.Class, System = J$VM.System;
	
	/**
	 * Return the special symbols with the specified locale. If no type
	 * given, return all symbols of the current locale.
	 *
	 * @param locael: {js.util.Locale} The Locale to ref.
	 * @param type: {String} The type of symbols to fetch.
	 */
	CLASS.getSymbols = function(locale, type){
		var res, symbols;
		if(locale && (locale instanceof CLASS)){
			res = C.forName("js.text.resources." + locale.toString());
			
			if(C.isString(type)){
				symbols = res ? res[type] : undefined;				  
			}else{
				symbols = res;
			}
		}
		
		return symbols;
	};
	
	CLASS.getDateSymbols = function(locale){
		return CLASS.getSymbols(locale, "dateSymbols");	
	};

	CLASS.getNumberSymbols = function(locale){
		return CLASS.getSymbols(locale, "numrSymbols");
	};
	
	
	/**
	 * Sets the language of current Locale. Language always be lower case. 
	 * If the specified language isn't be the valid string, a blank string 
	 * will be used.	 
	 * 
	 * @param language: {String} 2 or 3 letter language code.
	 */
	thi$.setLanguage = function(language){
		this.language = C.isString(language) ? language : "";
	};
	
	/**
	 * Returns the language code of this Locale.
	 *
	 * @return The language code, or the empty string if none is defined.
	 */
	thi$.getLanguage = function(){
		return this.language ? this.language.toLowerCase() : "";
	};
	
	/**
	 * Sets the country for the Locale. Country always be upper case.
	 * If the specified country isn't be the valid string, a blank string
	 * will be used.
	 * 
	 * @param country: {String} An ISO 3166 alpha-2 country code or a UN M.49 
	 *		  numeric-3 area code.
	 */
	thi$.setCountry = function(country){
		this.country = C.isString(country) ? country : "";	
	};
	
	/**
	 * Returns the country code of this Locale.
	 * 
	 * @return The country code, or the empty string if none is defined.
	 */
	thi$.getCountry = function(){
		return this.country ? this.country.toUpperCase() : "";
	};
	
	thi$.equals = function(locale){
		return locale && (locale.getLanguage() === this.getLanguage()) 
			&& (locale.getCountry() === this.getCountry());
	};
	
	thi$.toString = function(){
		var language = this.getLanguage(), 
		country = this.getCountry(),
		symbol = (language && country) ? "_" : "",
		buf = [];
		
		buf.push(language);
		buf.push(symbol);
		buf.push(country);
		
		return buf.join("");
	};
	
	thi$._init = function(language, country){
		if(!C.isString(language) && !C.isString(country)){
			return;
		}
		
		this.setLanguage(language);
		this.setCountry(country);
	};
	
	this._init.apply(this, arguments);
};


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

$package("js.net");

/**
 * 
 * @param url, the url string
 * @param ..., if arguments.length > 1, then regard as constructs a hierarchical 
 * URI from the given components. The arguments are (scheme, userInfo, host, port, 
 * path, query, fragment)
 */
js.net.URI = function (url){

	var CLASS = js.net.URI, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Keys = ["source", "scheme", "userInfo", "user", "password", 
				"host", "port", "path", "query", "fragment"],	  
	schemeRegExp = /^(?:([-+a-zA-Z0-9]+):\/\/|\/\/)/i,
	userInfoRegExp = /^(?:([^:@\/?\s]+))(:(?:[^:@\/?\s]+))?@/i,
	hostRegExp = /^((?:[^;:@=\/\?\.\s]+\.)+[A-Za-z0-9\-]{1,}|localhost)/i,

	// For matching cusotm host names mapping ips in OS' hosts file.
	// Such as "http://xx:8888", "xx" mapping "127.0.0.1".
	regNameRegExp = /^([^;:@=\/\?\#\.\s]+)/i,
	noSchemeRegNameRegExp = /^([^;:@=\/\?\#\.\s]+)(?=:\d+)/i,
	
	portRegExp = /^:(\d+)/,
	pathRegExp = /^\.*\/[^?#]*/i,
	queryRegExp = /^\?([^#]*)/i,
	fragmentRegExp = /^#(.+)/i,
	
	QueryRegExp = new RegExp("(?:^|&)([^&=]*)=?([^&]*)","g"),
	
	regExps = [schemeRegExp, userInfoRegExp, hostRegExp, portRegExp, 
			   pathRegExp, queryRegExp, fragmentRegExp],
	REGX_PATH = /(.*[/|\\])(.*)/;
	
	thi$.parseURI = function(uri){
		if(!uri) return;
		
		var curUri = uri, regExp,
		parseFun = function($0, $1, $2, $3){
			switch(regExp){
			case schemeRegExp:
				this.scheme = $1;
				break;
			case userInfoRegExp:
				this.userInfo = $0;
				this.user = $1;
				this.password = $2 ? $2.substring(1) : $2; //$3
				break;
			case hostRegExp:
			case regNameRegExp:
			case noSchemeRegNameRegExp:
				this.host = $0;
				break;
			case portRegExp:
				this.port = $1;
				break;
			case pathRegExp:
				this.path = $0;
				break;
			case queryRegExp:
				this.query = $1;
				break;
			case fragmentRegExp:
				this.fragment = $1;
				break;
			default:
				break;
			}
			
			return "";
		};
		
		var i = 0;
		while(curUri && i < 7){
			regExp = regExps[i];
			curUri = curUri.replace(regExp, parseFun.$bind(this));
			
			if(regExp == hostRegExp && !this.host){
				regExp = this.scheme ? regNameRegExp : noSchemeRegNameRegExp;
				curUri = curUri.replace(regExp, parseFun.$bind(this));
			}
			
			++i;
		}
		
		// If and only if the rest part of the given uri doesn't contains
		// the "?", "#" and no any query and fragment were parsed, the rest
		// part will be the relative uri path string.
		if(curUri && (curUri.search(/\?#/i) == -1)
		   && this.path == undefined && this.query == undefined 
		   && this.fragment == undefined){
			this.path = curUri;
		}
		
		this.source =  uri;
	};
	
	thi$.parseParams = function(query){
		var params = {};
		if(query){
			query.replace(QueryRegExp, 
						  function($0, $1, $2){
							  if($1) params[$1] = $2;
						  });
		}
		return params;
	};
	
	
	thi$.toURI = function(){
		var curUri = J$VM.System.getProperty("uri") || new (CLASS)(document.URL),
		uri = "", query = "", hasQF = false, tmp;
		if(this.host){
			uri += (this.scheme || "http") + "://";
			uri += this.userInfo || "";
			uri += this.host;
			
			if(this.port){
				uri += ":" + this.port;
			}

			if(this.path){
				uri += this.path;
				hasQF = true;
			}
		}else{
			if(this.path){
				uri += curUri.scheme + "://" + (curUri.userInfo || "") + curUri.host;
				if(curUri.port){
					uri += ":" + curUri.port;
				}
				
				if(this.path.indexOf("/") == 0){
					uri += this.path;
				}else{
					tmp = (curUri.path || "").match(REGX_PATH);
					uri += (tmp[1] || "/") + this.path;
				}
				
				hasQF = true;
			}
		}
		
		// Only when the path is existed,  the query and fragment
		// will be significant.	 
		if(hasQF){
			for(var key in this.params){
				query += key + "=" + this.params[key] + "&";
			}
			
			if(query){
				query = query.substring(0, query.length - 1);
				uri += "?" + query;
			}
			
			if(this.fragment){
				uri += "#" + this.fragment;
			}
		}
		
		return uri;
	};

	thi$.isSameOrigin = function(s){
		var uri = new (CLASS)(s || document.URL);
		return this.scheme == uri.scheme &&
			this.host == uri.host &&
			this.port == uri.port;
	};
	
	thi$._init = function(){
		if(arguments.length === 1){
			this.scheme = this.userInfo = this.user = this.password 
				= this.host = this.port = this.path = this.query 
				= this.fragment = undefined;
			var A, uri = "";
			try{
				uri = decodeURI(arguments[0]);
				if(J$VM.env.j$vm_isworker !== true){
					A = document.createElement("A");
					A.href = uri;
					uri = A.href;
				}
			}catch(ex){
				throw ex;
			}
			this.parseURI(uri);
		}else{
			this.scheme	  = arguments[0];
			this.userInfo = arguments[1];
			this.host	  = arguments[2];
			this.port	  = arguments[3];
			this.path	  = arguments[4];
			this.query	  = arguments[5];
			this.fragment = arguments[6];
		}

		this.params = this.parseParams(this.query);
	};

	this._init.apply(this, arguments);

}.$extend(js.lang.Object);


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

$package("js.net");

js.net.XHRPROVIDER = {

    progid: undefined,

    progids:["MSXML2.XMLHTTP.6.0",
             "MSXML2.XMLHTTP",
             "Microsoft.XMLHTTP"]
};

js.net.XHRPool = new function(){

    J$VM.XHRPool = this;
    this.pool = [];
    
    var Q = [], running = false;

    this.getXHR = function(isAsync){
        var xhr, i, len, pool = this.pool, 
            max = J$VM.System.getProperty("j$vm_ajax_concurrent", 8),
            ie = (J$VM.ie !== undefined);
        
        for(i=0, len=pool.length; i<len; i++){
            xhr = pool[i];
            if(!xhr.isOccupy() && !ie){
                break;
            }else{
                xhr = undefined;
            }
        }
        
        if(!xhr){
            // Can not found available xhr, then create a new instance.
            if(!isAsync || max < 0 || this.pool.length < max){
                xhr = new js.net.HttpURLConnection(isAsync);
                if(!ie){
                    pool.push(xhr);
                }
            }else{
                xhr = (J$VM.ie === undefined) ? 
                    new js.net.HttpURLConnection(isAsync, true) :
                    new js.net.HttpURLConnection(isAsync);
            }
        }

        //xhr = new js.net.HttpURLConnection(isAsync);
        xhr.setAsync(isAsync);
        xhr.occupy();

        return xhr;
    };

    this.getQ = function(){
        return Q;
    };

    this.post = function(req){
        Q.push(req);
        if(!running){
            _schedule(0);
        }
    };

    var _schedule = function(delay){
        if(Q.length == 0){
            running = false;
        }else{
            running = true;
            _dispatch.$delay(this, delay);
        }
    }.$bind(this);

    var _dispatch = function(){
        var xhr = this.getXHR(true), req, data;
        
        if(xhr.isBlocking()){
            _schedule(100);
            return;
        }

        req = Q.shift();
        req._xhr = xhr._xhr;
        req._blocking = false;
        req.xhr = xhr;
        data = req.data;
        req.open(data.method, data.url, data.params, data.withCookie);
        _schedule(100);

    }.$bind(this);

    var _init = function(){
        _schedule(0);
    }.call(this);

}();

js.net.HttpURLConnection = function (isAsync, blocking){

    var CLASS = js.net.HttpURLConnection, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init(isAsync, blocking);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, 
        PV = js.net.XHRPROVIDER;

    thi$.isAsync = function(){
        return this._async || false;
    };

    thi$.setAsync = function(isAsync){
        this._async = isAsync || false;
        
        if(this._async){
            this.declareEvent(Event.SYS_EVT_SUCCESS);
            this.declareEvent(Event.SYS_EVT_HTTPERR);
        }else{
            delete this["on"+Event.SYS_EVT_SUCCESS];
            delete this["on"+Event.SYS_EVT_HTTPERR];
        }
    };

    thi$.isNoCache = function(){
        return this._nocache || false;
    };

    thi$.setNoCache = function(isNoCache){
        this._nocache = isNoCache || false; 
        var date;
        if(this._nocache){
            date = "Thu, 01 Jan 1970 00:00:00 GMT"; 
        }else{
            date = "Fri, 01 Jan 2900 00:00:00 GMT";
        }
        //this.setRequestHeader("If-Modified-Since", date);
    };

    thi$.setRequestHeader = function(key, value){
        this._headers = this._headers || {};
        this._headers[key] = value;
    };

    thi$.getTimeout = function(){
        return this._timeout;
    };

    thi$.setTimeout = function(v){
        this._timeout = v;
    };

    thi$.isBlocking = function(){
        return this._blocking === true;
    };

    thi$.isOccupy = function(){
        return (this._occupy && true); 
    };

    thi$.occupy = function(){
        this._usecount ++;
        this._occupy = true;
    };

    thi$.contentType = function(){
        return this._xhr.contentType || this.getResponseHeader("Content-Type");
    };

    thi$.getResponseHeader = function(key){
        return this._xhr.getResponseHeader(key);
    };

    thi$.getAllResponseHeaders = function(){
        return this._xhr.getAllResponseHeaders();
    };

    thi$.response = function(){
        var b;
        if(typeof self.Uint8Array == "undefined"){
            b = IEBinaryToString(this._xhr.responseBody).split(",");
            for(var i=0, len=b.length; i<len; i++){
                b[i] = parseInt(b[i]);
            }
        }else{
            b = new Uint8Array(this._xhr.response);
        }
        return b;
    };

    thi$.responseText = function(){
        return this._xhr.responseText;
    };

    thi$.responseXML = function(){
        return this._xhr.responseXML;
    };

    thi$.responseJSON = function(){
        var json, text = this.responseText();
        try{
            json = JSON.parse(text);
        }catch(x){
            json = {
                err: -1,
                exception: x,
                text: text
            };
        }
        return json;
    };

    thi$.status = function(){
        return this._xhr.status;
    };

    thi$.statusText = function(){
        return this._xhr.statusText;
    };
    
    thi$.readyState = function(){
        return this._xhr.readyState;
    };
    
    /**
     * Open url by method and with params
     */
    thi$.open = function(method, url, params, withCookie){
        J$VM.System.updateLastAccessTime();

        if(this.isBlocking()){
            this.data = {
                method: method,
                url: url,
                params: params,
                withCookie: withCookie
            };
            J$VM.XHRPool.post(this);
            return;
        }

        var _url, query = _makeQueryString.call(this, params),
            xhr = this._xhr, async = this.isAsync();

        switch(method.toUpperCase()){
        case "GET":
            _url = (query != null) ? [url, "?", query].join("") : url;
            query = null;
            break;
        case "POST":
            _url = url;
            this.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            break;
        default:
            // TODO in the furture ?
            break;
        }
        
        if(async){
            xhr.onreadystatechange = function(){
                if(xhr.isTimeout) return;

                switch(xhr.readyState){
                case 2:
                case 3:
                    var status = 200;
                    try{// IE access status on state 2, 3 will throws exception.
                        status = xhr.status;
                    } catch (x) {
                    }

                    if(status != 200 && status != 304){
                        _stopTimeout.call(this);
                        this.fireEvent(new Event(Event.SYS_EVT_HTTPERR, this, this));
                    }
                    break;
                case 4:
                    _stopTimeout.call(this);

                    switch(xhr.status){
                    case 200:
                    case 304:
                        this.fireEvent(new Event(Event.SYS_EVT_SUCCESS, this, this));
                        break;
                    default:
                        this.fireEvent(new Event(Event.SYS_EVT_HTTPERR, this, this));
                        break;
                    }
                    break;
                default:
                    _stopTimeout.call(this);
                    break;
                }
            }.$bind(this);
        }
        
        this.timer = _checkTimeout.$delay(this, this.getTimeout());

        xhr.open(method, _url, async);
        _setRequestHeader.call(this, xhr, this._headers);
        if(withCookie == true){
            xhr.withCredentials = true;
        }
        xhr.send(query);
    };
    
    /**
     * Close this connection
     */
    thi$.close = function(){
        if(this._xhr){
            _stopTimeout.call(this);
            var xhr = this._xhr;

            try{
                xhr.onreadystatechange = null;
                xhr.response = null;
                xhr.responseText = null;
                xhr.responseXML = null;
            } catch (x) {
            }
        }

        this["on"+Event.SYS_EVT_SUCCESS] = null;
        this["on"+Event.SYS_EVT_HTTPERR] = null;
        this["on"+Event.SYS_EVT_TIMEOUT] = null;
        this._headers = {};
        this._occupy = false;

        if(this._blocked === true){
            this.xhr.close();
            delete this.xhr;
            delete this.data;
            delete this._blocked;
        }
    };
    
    var _checkTimeout = function(){
        var xhr = this._xhr;
        if(xhr){
            xhr.isTimeout = true;
            xhr.abort();
            this.fireEvent(new Event(Event.SYS_EVT_TIMEOUT, this, this));
        }
    };

    var _stopTimeout = function(){
        _checkTimeout.$clearTimer(this.timer);
        delete this.timer;
    };

    var _makeQueryString = function(params){
        if(params === null || 
           params === undefined || 
           typeof params != "object") return null;
        
        var buf = new js.lang.StringBuffer();
        for(var p in params){
            buf.append(p).append("=").append(params[p]).append("&");
        }

        return buf.toString();
    };
    
    var _setRequestHeader = function(_xhr, map){
        if(map){
            for(var p in map){
                if(p === "responseType"){
                    try{
                        _xhr.responseType = map[p];
                    }catch(e){}
                }else{
                    try{
                        _xhr.setRequestHeader(p, map[p]);
                    }catch(e){
                    }
                }
            }
        }
    };

    var _createXHR = function(){
        var xhr;

        if(self.XMLHttpRequest != undefined){
            xhr = new XMLHttpRequest();
        }else{
            // IE
            if(PV.progid != undefined){
                xhr = new ActiveXObject(PV.progid);
            }else{
                for(var i=0; i<PV.progids.length; i++){
                    PV.progid = PV.progids[i];
                    try{
                        xhr = new ActiveXObject(PV.progid);
                        break;
                    } catch (x) {
                        // Nothing to do
                    }
                }// For
            }// progid
        }
        return xhr;
    };

    thi$._init = function(isAsync, blocking){
        this.setAsync(isAsync);

        if(blocking !== true){
            this._xhr = _createXHR();
        }else{
            this._blocked = true;
        }
        this._blocking = blocking;
        this._usecount = 0;
        this.setTimeout(J$VM.System.getProperty("j$vm_ajax_timeout", 6000000));
        this.declareEvent(Event.SYS_EVT_TIMEOUT);
    }.$override(this._init);

    this._init(isAsync, blocking);

}.$extend(js.util.EventTarget);


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

$package("js.awt");

$import("js.util.Event");

/**
 * This Event class is used to wrap the native DOM event and provides
 * an uniform event interface.
 */
js.awt.Event = function(e){

    var CLASS = js.awt.Event, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    thi$.eventXY = function(){
        return {x: this.clientX, y: this.clientY};
    };

    thi$.offsetXY = function(){
        return {x: this.offsetX, y: this.offsetY};
    };

    thi$.cancelBubble = function(){
        var _e = this._event;

        if(_e.stopPropagation){
            _e.stopPropagation();
        }else{
            try{// Try only for the IE
                _e.cancelBubble = true;
            } catch (x) {

            }

        }

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.cancelBubble);

    thi$.cancelDefault = function(){
        var _e = this._event;

        if(_e.preventDefault){
            _e.preventDefault();
        }else{
            try{// Try only for the IE
                _e.returnValue = false;
            } catch (x) {

            }

        }

        return arguments.callee.__super__.apply(this, arguments);

    }.$override(this.cancelDefault);

    /**
     *
     */
    thi$.isPointerDown = function(){
        var type = this.getType();
        return type == "pointerdown" || "mousedown";
    };

    /**
     *
     */
    thi$.isPointerMove = function(){
        var type = this.getType();
        return type == "pointermove" || "mousemove";
    };

    /**
     *
     */
    thi$.isPointerUp = function(){
        var type = this.getType();
        return type == "pointerup" || "mouseup";
    };

    /**
     *
     */
    thi$.isPointerOver = function(){
        var type = this.getType();
        return type == "pointerover" || "mouseover";
    };

    /**
     *
     */
    thi$.isPointerOut = function(){
        var type = this.getType();
        return type == "pointerout" || "mouseout";
    };

    /**
     *
     */
    thi$.isPointerEnter = function(){
        var type = this.getType();
        return type == "pointerenter" || "mouseenter";
    };

    /**
     *
     */
    thi$.isPointerLeave = function(){
        var type = this.getType();
        return type == "pointerleave" || "mouseleave";
    };

    /**
     *
     */
    thi$.isPointerCancel = function(){
        var type = this.getType();
        return type == "pointercancel";
    };


    thi$._init = function(e){
        var _e = this._event = e || window.event;

        arguments.callee.__super__.call(this, _e.type, _e);

        var ie = (_e.stopPropagation == undefined),
            ff = (J$VM.firefox != undefined);

        this.altKey   = _e.altKey   || false;
        this.ctrlKey  = _e.ctrlKey  || false;
        this.shiftKey = _e.shiftKey || false;
        this.metaKey  = _e.metaKey  || false;

        this.keyCode  = ie ? _e.keyCode : _e.which;

        // Left:1, Right:2, Middle:4
        switch(_e.button){
        case 0:
            this.button = 1;
            break;
        case 1:
            this.button = ie ? 1 : 4;
            break;
        default:
            this.button = _e.button;
            break;
        }

        this.pageX = _e.pageX;
        this.pageY = _e.pageY;

        this.clientX = !isNaN(_e.pageX) ? _e.pageX
            : (_e.clientX + document.documentElement.scrollLeft - document.body.clientLeft);
        this.clientY = !isNaN(_e.pageY) ? _e.pageY
            : (_e.clientY + document.documentElement.scrollTop - document.body.clientTop);

        this.offsetX = ff ? _e.layerX : _e.offsetX;
        this.offsetY = ff ? _e.layerY : _e.offsetY;

        this.srcElement = ie ? _e.srcElement : _e.target;

        this.fromElement= ie ? _e.fromElement :
            (this.isPointerOver() ? _e.relatedTarget :
             (this.isPointerOut()  ? _e.target : undefined));
        this.toElement  = ie ? _e.toElement :
            (this.isPointerOut() ? _e.relatedTarget :
             (this.isPointerOver() ? _e.target : undefined));

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.util.Event);

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

$package("js.awt");

js.awt.ComponentFactory = function(System){

    var CLASS = js.awt.ComponentFactory, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init();
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class;

    thi$.registerClass = function(wClass){
        var className = wClass.className;
        if(this._classes[className] == undefined){
            this._classes[className] = wClass;
        }else{
            throw new Error("The class definition "+className+" is existed.");
        }
        return className;
    };
    
    thi$.unRegisterClass = function(className){
        delete this._classes[className];
    };
    
    thi$.getClass = function(className, nocache){
        var _wClass = this._classes[className], wClass;
        if(_wClass == undefined) 
            throw "Can not found the wClass with name "+className;
        
        return nocache === true ? 
            _wClass : System.objectCopy(_wClass, {}, true);
    };
    
    thi$.hasClass = function(className){
        return Class.isObject(this._classes[className]);
    };

    thi$.createComponent = function(className, opitons, Runtime){
        var comp, wClass = this.getClass(className);

        wClass = System.objectCopy(opitons, wClass, true);
        comp = new (Class.forName(wClass.classType))(wClass, Runtime);

        return comp;
    };

    thi$._init = function(){
        this._classes = {};
    };

    this._init();
};


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

js.lang.Runtime = function(){

    var CLASS = js.lang.Runtime, thi$ = CLASS.prototype;
    if(CLASS.__defined__) return;
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event;
    
    var _synProperties = function(key, value){
        if(!key) return;
        
        var env = J$VM.env, System = J$VM.System;
        if(env && env.hasOwnProperty(key)){
            env[key] = value;
        }
        
        if(System.hasProperty(key)){
            System.setProperty(key, value);            
        }
    };
    
    var _invalidateProperty = function(key){
        if(!key) return;
        
        delete this._local[key];
        
        if(J$VM.env){
            delete J$VM.env[key];
        }
        
        J$VM.System.removeProperty(key);
    };
    
    thi$.getProperty = function(key, defValue){
        return this._local[key] || 
            J$VM.System.getProperty(key, defValue);
    };
    
    thi$.setProperty = function(key, value){
        this._local[key] = value;
        
        _synProperties.apply(this, arguments);
    };

    thi$.PID = function(pid){
        if(pid != undefined){
            this.setProperty("pid", pid);
        }
        return this.getProperty("pid", "");
    };

    thi$.userInfo = function(userinfo){
        if(Class.isObject(userinfo)){
            this.setProperty("userinfo", userinfo);
            
            // Re-intialize the runtime locale
            _initLocale.call(this);
        }
        
        return this.getProperty("userinfo");
    };
    
    /**
     * In fact, there are two locales in jsvm. One is J$VM.locale, it always be
     * initialized with current browser client's language. Another is runtime
     * locale, it always be intialized with userinfo from server. However if there
     * is no language information in the userinfo, we will inialize the runtime 
     * locale with J$VM.locale. And we always assure the same language and country
     * in userinfo and locale.
     * Those two loacales may be same or different.
     * 
     * @param locale: {js.util.Locale} The locale object to set.
     */
    thi$.locale = function(locale){
        if(locale && locale instanceof js.util.Locale){
            this.setProperty("locale", locale);
        }
        return this.getProperty("locale");
    };
    
    thi$.getLocal = function(){
        var userinfo = this.userInfo();
        if(!userinfo){
            userinfo = this._local.userinfo = {};  
        }
        
        if(!Class.isString(userinfo.lang)){
            var lang = J$VM.locale.getLanguage(),
            country = J$VM.locale.getCountry();
            
            userinfo.lang = lang;
            userinfo.country = country;

            _initLocale.call(this);
        }
        
        return this.locale().toString();
    };
    
    /**
     * Set content locale with the specified Locale, or the specified 
     * Language and Country.
     */
    thi$.setContentLocale = function(){
        var Locale = js.util.Locale, len = arguments.length, 
        arg0, locale;
        if(len === 0){
            return;            
        }
        
        arg0 = arguments[0];
        if(arg0 instanceof Locale){
            locale = arg0;
        }else{
            if(Class.isString(arg0) && arg0.length > 0){ // As language
                locale = new Locale(arg0, arguments[1]);          
            }
        }
        
        if(locale){
            this.setProperty("content_locale", locale);
        }
    };
    
    var _initContentLocale = function(){
        var userinfo = this.userInfo() || {},
        prefer = userinfo.prefer || {},
        cLang = prefer["rpt_lang"],
        cCountry = prefer["rpt_country"],
        locale;
        
        if(Class.isString(cLang) && cLang.length > 0){
            locale = new js.util.Locale(cLang, cCountry);              
        }
        
        return locale;
    };

    /**
     * If there is a customized content locale, return it.
     * Other to return the rpt locale.
     * 
     * The rpt locale can be updated in runtime, didn't 
     * cache it.
     */    
    thi$.getContentLocale = function(){
        return this.getProperty("content_locale") 
            || _initContentLocale.call(this);
    };

    /**
     * Return date symbols of the current locale.
     */ 
    thi$.dateSymbols = function(symbols){
        if(Class.isObject(symbols)){
            this.setProperty("dateSymbols", symbols);
        }

        return this.getProperty(
            "dateSymbols", 
            Class.forName("js.text.resources."+this.getLocal()).dateSymbols);
    };

    /**
     * Return number symbols of the current locale.
     */ 
    thi$.numberSymbols = function(symbols){
        if(Class.isObject(symbols)){
            this.setProperty("numrSymbols", symbols);
        }

        return this.getProperty(
            "numrSymbols",
            Class.forName("js.text.resources."+this.getLocal()).numrSymbols);
    };

    /**
     * Fetch date symbols of the specified locale.
     */    
    thi$.getDateSymbolsByLocale = function(locale){
        return js.util.Locale.getDateSymbols(locale);
    };
    
    /**
     * Fetch number symbols of the specified locale.
     */
    thi$.getNumberSymbolsByLocale = function(locale){
        return js.util.Locale.getNumberSymbols(locale);
    };

    /**
     * Set i18n dictionary 
     * 
     * @param dict, i18n dictionary
     */
    thi$.setDict = function(dict){
        var d = this.getProperty("dict");
        dict = dict || {};
        if(d == undefined){
            this.setProperty("dict", dict);
        }else{
            J$VM.System.objectCopy(dict, d, false, true);
        }
    };
    
    /**
     * @see jet.server.jrc.resource.nls.GlobalNLSDictionary.getText()
     * 
     * Get globel nls text value.
     * @param language String, language info of locale
     * @param country String, country info of locale
     * @param orgText String, the text need do NLS
     * @return nlsText
     */
    thi$.getGlobleNLSText = function(language, country, orgText) {
        var NLSTextDict = this.getProperty('NLSTextDict'),
        locale = new (Class.forName('js.util.Locale'))(language,country),
        rst = null;
        
        while(NLSTextDict && true){
            var nlsInfo = NLSTextDict[locale.toString()];
            rst = nlsInfo ? nlsInfo[orgText] : null;
            if(rst != null){
                return rst;
            }
            
            locale = _getParentLocale(locale);
            if(locale == null){
                break;
            }
        }
        
        return orgText;
    };
    
    /**
     * @see jet.server.jrc.resource.nls.GlobalNLSDictionary.getFont()
     * 
     * Get globel nls text value.
     * @param language String, language info of locale
     * @param country String, country info of locale
     * @param fontName String, the fontName need do NLS
     * @param ptFontSize Number, the fontSize in point that need do NLS
     * @return Object {fontName : nls fontName, fontSize : nls fontSize in point}
     */
    thi$.getGlobleNLSFont = function(language, country, fontName, ptFontSize) {
        var NLSFontDict = this.getProperty('NLSFontDict'),
        locale = new (Class.forName('js.util.Locale'))(language,country),
        rst = null;
        
        while(NLSFontDict && true){
            var nlsInfo = NLSFontDict[locale.toString()];
            if(nlsInfo){
                rst = nlsInfo[fontName + '_' + ptFontSize];
                if(rst == null){
                    rst = nlsInfo[fontName + '_' + 0];
                }
            }
            if(rst != null){
                return rst;
            }
            
            locale = _getParentLocale(locale);
            if(locale == null){
                break;
            }
        }
        
        return {
            fontName:fontName,
            fontSize:ptFontSize
        };
    };
    
    var _getParentLocale = function(locale){
        var Locale = Class.forName("js.util.Locale"), 
        country = locale.getCountry(),
        language = locale.getLanguage();
        
        if(country != null && country.length > 0){
            return new Locale(language);
        }else if(language != null && language.length > 0){
            return new Locale('','');
        }
        
        return null;
    };
    
    
    /**
     * Returen i18n dictionary.
     */
    thi$.getDict = function(){
        return this.getProperty("dict", {});
    };

    /**
     * Return i18n text with the specified key
     * 
     * @param key, the text id
     * @return i18n text of the key
     */
    thi$.nlsText = function(key, defaultText){
        var dict = this.getDict(), v = dict[key];
        return v ? (Class.isString(v) ? v : v.text) : (defaultText || key);
    };
    
    thi$.prefer = function(prefer){
        if(Class.isObject(prefer)){
            this.setProperty("prefer", prefer);
        }
        return this.getProperty("prefer", {});
    };

    thi$.datePattern = function(){
        var common = this.prefer().common;
        return common ? common.dateFormat : "yyyy-MM-dd";
    };

    thi$.timePattern = function(){
        var common = this.prefer().common;
        return common ? common.timeFormat : "HH:mm:ss";
    };

    thi$.timestampPattern = function(){
        var common = this.prefer().common;
        return common ? common.timestampFormat : "yyyy-MM-dd HH:mm:ss";
    };

    thi$.themes = function(themes){
        if(Class.isArray(themes)){
            this.setProperty("themes", themes);
        }
        return this.getProperty("themes", ["default"]);
    };

    thi$.theme = function(theme){
        if(Class.isString(theme)){
            this.setProperty("theme", theme);
            _updateJ$VMCSS.call(this);
        }
        return this.getProperty("theme", "default");
    };
    
    thi$.imagePath = function(imagePath){
        if(Class.isString(imagePath)){
            this.setProperty("imagePath", imagePath);
        }
        
        return this.getProperty(
            "imagePath", 
            J$VM.env.j$vm_home+"/../style/"+this.theme()+"/images/");
    };

    thi$.postEntry = function(entry){
        if(Class.isString(entry)){
            this.setProperty("postEntry", entry);
            this.servlet = entry;
        }
        return this.getProperty("postEntry", ".vt");
    };

    thi$.getsEntry = function(entry){
        if(Class.isString(entry)){
            this.setProperty("getsEntry", entry);
            this.getpath = entry;
        }
        return this.getProperty("getsEntry", "/vt");
    };
    

    thi$.mode = function(mode){
        if(Class.isNumber(mode)){
            this.setProperty("mode", mode);
        }
        return this.getProperty("mode", 0);
    };

    thi$.isEditMode = function(){
        return (this.mode() & 0x01) != 0;
    };
    
    thi$.getLicense = function(){
        return this.getProperty("license");  
    };
    
    thi$.isProductEnabled = function(product){
        var license, enabled = false;
        if(Class.isString(product) && product.length > 0){
            license = this.getLicense() || {};
            enabled = (license[product + "_enabled"] === true);
        }
        
        return enabled;
    };
    
    /**
     * Show message on console or popup a message box
     * 
     * @param type, info | warn | error
     * @param subject, any string
     * @param content, any string
     * 
     * @see js.awt.MessageBox
     */
    thi$.message = function(type, subject, content){
        switch(type){
        case "info":
            J$VM.System.out.println(subject+": "+content);
            break;
        case "warn":
            J$VM.System.err.println(subject+": "+content);
            break;
        case "error":
            J$VM.System.err.println(subject+": "+content);
            break;
        default:
            throw "Unsupport message type "+ type;
            break;
        }
    };

    var _updateJ$VMCSS = function(){
        var style = document.getElementById("j$vm_css"),
        stylePath = J$VM.env.j$vm_home + "/../style/"+this.theme()+"/", 
        cssText = Class.getResource(stylePath + "jsvm.css", true);
        
        if(!style){
            style = document.createElement("style");
            style.id   = "j$vm_css";
            style.title= "j$vm_css";
            style.type = "text/css";
        }else{
            style.parentNode.removeChild(style);
        }

        cssText = cssText.replace(/images\//gi, stylePath+"images/");
        if(style.styleSheet){
            // IE
            try{
                style.styleSheet.cssText = cssText;                
            } catch (x) {

            }
        }else{
            // Others
            style.innerHTML = cssText;
        }

        var jsvm = document.getElementById("j$vm");
        jsvm.parentNode.insertBefore(style, jsvm);
    };
    
    var _loadJ$VMCSS = function(){
        var style = document.getElementById("j$vm_css");
        if(!style){
            _updateJ$VMCSS.call(this);
        }
    };
    
    // Initialize locale with userinfo
    var _initLocale = function(){
        var userinfo = this.userInfo() || {}, locale = this.locale(),
        lang = userinfo.lang, country = userinfo.country;
        
        if(!locale){
            locale = this._local.locale = new js.util.Locale();
        }
        
        if(lang && (lang !== locale.language 
                    || country !== locale.country)){
            locale.setLanguage(lang);
            locale.setCountry(country);
            
            _invalidateProperty.call(this, "dateSymbols");
            _invalidateProperty.call(this, "numrSymbols");
        }
        
        return locale;
    };
    
    thi$.initialize = function(env){
        var System = J$VM.System;
        //System.objectCopy(System.getProperties(), this._local, true);
        System.objectCopy(env || {}, this._local);
        
        _initLocale.call(this);
        _loadJ$VMCSS.call(this);
    };

    thi$.Runtime = function(){
        return this;
    };

    thi$.isEmbedded = function(){
        return false;
    };
};

js.lang.NoUIRuntime = function(){
    
    var CLASS = js.lang.NoUIRuntime, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    thi$._init = function(){
        arguments.callee.__super__.apply(this, arguments);
        
        this._local = {};

    }.$override(this._init);

    this._init.apply(this, arguments);
    
}.$extend(js.util.EventTarget).$implements(js.lang.Runtime);


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
        var typeOf = js.lang.Class.typeOf, t = typeOf(src), item;
        switch(t){
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
        try{
            CollectGarbage();
        }catch(e){};
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
            var attrs = script.attributes, name, value, params;
            for(var i=0, len=attrs.length; i<len; i++){
                name = attrs[i].nodeName; value = attrs[i].nodeValue;
                switch(name){
                case "src":
                case "crs":
                    var p = value.lastIndexOf("/");
                    this.setProperty("j$vm_home", value.substring(0,p));
                    params = new js.net.URI(value).params;
                    for(p in params){
                        this.setProperty(p, params[p]);
                    }
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

        obj = null;

        // Clean
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

        var Event = js.util.Event, dom = vm.hwnd.document;
        Event.intercept();

        Event.attachEvent(vm.hwnd, Event.W3C_EVT_RESIZE, 0, this, _onresize);
        Event.attachEvent(vm.hwnd, Event.W3C_EVT_MESSAGE,0, this, _onmessage);
        Event.attachEvent(dom, "keydown", 0, this, _onkeyevent);
        Event.attachEvent(dom, "keyup",   0, this, _onkeyevent);
        Event.attachEvent(dom, Event.W3C_EVT_MOUSE_MOVE, 0, this, _onmouseevent);

        var proc, scope, i, len, body;
        for(i=0, len=scopes.length; i<len; i++){
            proc = scopes[i];
            scope = vm.runtime[proc.id];
            if(scope === undefined){
                scope = vm.runtime[proc.id] = function(){
                    var clazz = js.awt.Desktop;
                    return clazz ? new (clazz)({id:proc.id},proc.container) :
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
            try{
                scope.destroy();
            }catch(e){
            }
        }
        delete vm.runtime;

        this.gc();
        document.body.innerHTML="";
    };

    var bodyW, bodyH;
    var _onresize = function(e){
        this.updateLastAccessTime();

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
        this.updateLastAccessTime();
        J$VM.MQ.post("js.awt.event.KeyEvent", e);
    };

    var _onmouseevent = function(e){
        this.updateLastAccessTime();
    };

    /**
     * @member J$VM
     * @method exec
     *
     */
    var scopes = [];
    var _exec = function(instName, fn, containerElement){
        if(vm.runtime === undefined){
            vm.runtime = {};
        }

        scopes.push({id: instName, fn: fn, container: containerElement});
    }.$bind(this);

    /**
     * @member J$VM
     * @method boot
     *
     */
    var _boot = function(env){
        var Class = js.lang.Class, mainClass,
            mainClasName = this.getProperty("mainclass"),
            mainFuncName = this.getProperty("mainfunction"),
            desktop = this.getProperty("desktop"),
            rtName = desktop;

        if(mainClasName){
            mainClass = Class.forName(mainClasName);
            if(!mainClass) return;
            desktop = desktop ? desktop : mainClasName;
            J$VM.exec(mainClasName,
                      function(){
                          this.initialize();
                          (new mainClass()).main(this);
                      },desktop);
        }else if(typeof window[mainFuncName] == "function"){
            J$VM.exec(mainFuncName,
                      function(){
                          this.initialize();
                          window[mainFuncName].call(this, this);
                      },desktop);
        }else if(rtName){
            J$VM.exec(rtName,
                      function(){
                          this.initialize();
                      },desktop);
        }

        env = env || {};
        for(var p in env){
            this.setProperty(p, env[p]);
        }

    }.$bind(this);

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
        var E = js.util.Event;
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

        if(!vm.env.j$vm_isworker){
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

            vm.Factory = new js.awt.ComponentFactory(this);

            vm.exec = _exec;
            vm.boot = _boot;
            vm.enableLogger = _enableLogger;
            vm.disableLogger = _disableLogger;

            E.attachEvent(vm.hwnd, E.W3C_EVT_LOAD,   0, this, _onload);
            E.attachEvent(vm.hwnd, E.W3C_EVT_UNLOAD, 0, this, _onunload);

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
 * The <code>Thread</code> for easily using Web Worker, and for the
 * IE8/9 use a iframe simulate Web Worker
 * 
 * Runnable :{
 *     context: xxx,
 *     run : function
 * }
 * 
 */
js.lang.Thread = function(Runnable){

    var CLASS = js.lang.Thread, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, 
        System = J$VM.System, MQ = J$VM.MQ;

    var _onmessage = function(e){
        var evt = e.getData(), data;
        if(evt.source == self) return;
        
        try{
            data = JSON.parse(evt.data);
        } catch (x) {
            data = evt.data;
        }
        
        if(Class.isArray(data)){
            // [msgId, msgData, [recvs], null, pri]

            switch(data[0]){
            case Event.SYS_MSG_CONSOLEINF:
                System.out.println(data[1]);
                break;
            case Event.SYS_MSG_CONSOLEERR:
                System.err.println(data[1]);
                break;
            case Event.SYS_MSG_CONSOLELOG:
                System.log.println(data[1]);
                break;
            default:
                var fun = "on"+data[0];
                if(typeof this[fun] == "function"){
                    this[fun](data[1]);
                }
            }
        }else{
            if(typeof this.onmessage == "function"){
                this.onmessage(data);
            }
        }
    };

    var _onerror = function(e){
        var evt = e.getData(), data;
        if(evt.source == self) return;
        System.err.println(evt.data);
    };
    
    /**
     * Submit new task to the thread
     * 
     * @param task It should be a <code>Runnable</code> or a 
     * <code>context</code> in <code>Runnable</code>
     * @param isRunnable indicates whether the first parameter "task"
     * is a <code>Runnable</code>
     */
    thi$.submitTask = function(task, isRunnable){
        if(task == undefined || task == null) return;
        isRunnable = isRunnable || false;
        
        var context, run, worker = this._worker;
        if(isRunnable){
            context = task.context;
            run = task.run;
        }else{
            context = task;
            run = this._runnable.run;
        }

        var buf = new js.lang.StringBuffer();
        buf.append("var thi$ = {");
        buf.append("context:").append(JSON.stringify(context));
        buf.append(",run:").append(run);
        buf.append("}");

        var msg = buf.toString();
        //System.err.println("Thread post msg: "+msg);
        if(this._realWorker === true){
            worker.postMessage(msg);
        }else{
            // IE must
            worker.postMessage(msg, "*");
        }

    };
    
    /**
     * Start the thread
     */
    thi$.start = function(){
        this.submitTask(this._runnable, true);
    };
    
    /**
     * Stop the thread
     */
    thi$.stop = function(){
        if(this._worker.terminate){
            this._worker.terminate();
        }else{
            // For the iframe worker, what should be we do ?
        }
    };

    thi$._init = function(Runnable){
        this._runnable = Runnable || {
            context:{}, 
            
            run:function(){
                J$VM.System.out.println("Web Worker is running");
            }};
        
        var path = J$VM.env["j$vm_home"]+"/classes/js/util/",
            uri = new js.net.URI(path);
        
        if(self.Worker && uri.isSameOrigin() ){
            this._worker = new Worker(path+"Worker.jz");
            this._realWorker = true;
        }else{
            // iframe ?
            var iframe = document.createElement("iframe");
            iframe.style.cssText = "visibility:hidden;border:0;width:0;height:0;";
            document.body.appendChild(iframe);
            var text = new js.lang.StringBuffer();
            text = text.append("<!DOCTYPE html>\n<html><head>")
                .append("<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>")
                .append("</head></html>").toString();

            var doc = iframe.contentWindow.document, head, script;
            doc.open();
            doc.write(text);
            doc.close();

            head = doc.getElementsByTagName("head")[0];
            text = Class.getResource(J$VM.env["j$vm_home"]+"/jsre.js", true);
            script = doc.createElement("script");
            script.type = "text/javascript";
            script.id = "j$vm";
            // Becase we don't use src to load the iframe, but the J$VM will use
            // "src" attribute to indicates j$vm home. So we use a special attribute
            // name "crs" at here. @see also js.lang.System#_buildEnv 
            script.setAttribute("crs",J$VM.env["j$vm_home"]+"/jsre.js");
            script.setAttribute("classpath","");
            script.text = text;
            text = Class.getResource(path + "Worker.jz", true);
            script.text += text;
            head.appendChild(script);
            head.removeChild(script);

            this._worker = iframe.contentWindow;
            this._realWorker = false;
        }

        Event.attachEvent(this._worker, Event.W3C_EVT_MESSAGE, 0, this, _onmessage);
        Event.attachEvent(this._worker, Event.W3C_EVT_ERROR, 0, this, _onerror);

    };

    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);


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
 * @class J$VM
 * Define J$VM name-space and run-time environment
 * @singleton
 */
(function(){
    js.lang.Object.$decorate(this);

    /**
     * @property {String} ie
     * If browser is IE, this property is version of IE.
     */

    /**
     * @property {String} firefox
     * If browser is Firefox, this property is version of Firefox.
     */

    /**
     * @property {String} chrome
     * If browser is Chrome, this property is version of Chrome.
     */

    /**
     * @property {String} safari
     * If browser is Safari, this property is version of Safari.
     */

    /**
     * @property {String} opera
     * If browser is Opera, this property is version of Opera.
     */
    // Check browser type
    // Ref: User Agent (http://msdn.microsoft.com/en-us/library/ie/ms537503(v=vs.85).aspx)
    // Ref: Trident token (http://msdn.microsoft.com/library/ms537503.aspx)
    var ua = navigator.userAgent.toLowerCase(), ieTridents, trident, s, b;
    if("ActiveXObject" in self){
        // ierv: The revision token indicates the version of IE.
        // It can be affected by the current document mode of IE.
        b = (s = ua.match(/msie ([\d.]+)/)) ? this.ierv = s[1] :
            (s = ua.match(/rv:([\d.]+)/)) ? this.ierv = s[1] : 0;

        // ie: Indicate the really version of current IE browser.
        // Up to now, no any other user-defined can affect it.
        ieTridents = {"trident/7.0": 11, "trident/6.0": 10, "trident/5.0": 9, "trident/4.0": 8};
        trident = (s = ua.match(/(trident\/[\d.]+)/)) ? s[1] : undefined;
        this.ie = ieTridents[trident] || this.ierv;
    }else{
        b = (s = ua.match(/firefox\/([\d.]+)/)) ? this.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? this.chrome = s[1] :
            (s = ua.match(/opera.([\d.]+)/)) ? this.opera = s[1] :
            (s = ua.match(/version\/([\d.]+).*safari/)) ? this.safari = s[1] : 0;
    }

    /**
     * @property {Boolean}
     *
     */
    this.secure = /^https/i.test(location.protocol);
    /**
     * @property {Boolean}
     * The browser is cookie enabled
     */
    this.cookieEnabled = navigator.cookieEnabled;

    // Support J$VM system properties which are from URL
    var env = this.env, uri = new js.net.URI(location.href),
        params = uri.params, value, tmp, p;
    env["uri"] = uri;
    for(p in params){
        if(p.indexOf("j$vm_") == 0){
            value = params[p], tmp = parseInt(value);
            value = isNaN(tmp) ?
                (value === "true" ? true :
                 (value === "false" ? false : value)) : tmp;

            env[p] = value;
        }
    }

    // Initialize global variables
    /**
     * @member J$VM
     * @property {js.lang.System}
     */
    this.System = new js.lang.System(env, this);

    // Global functions for Flash
    /**
     * @member window
     * @method
     * Post message use J$VM message system
     * See also {@link J$VM.MQ#post}
     */
    $postMessage = J$VM.MQ.post;
    /**
     * @member window
     * @method
     * Send message use J$VM message system
     * See also {@link J$VM.MQ#send}
     */
    $sendMessage = J$VM.MQ.send;

    // Global functions
    // Should be replaced by invoing $postMessage and $sendMessage
    j$postMessage = function(msg){
        //below codes added by Lu YuRu, maybe flash slider needs,
        //but some logic miss in flash code, no one can explain it now.
        //Now Flash chart not need, so we clear the code.

        //var str = msg[4];
        //str = js.lang.Class.forName("js.util.Base64").decode(str);
        //msg[4] = JSON.parse(str);

        J$VM.MQ.post(msg[3], msg[4], msg[2], msg[1], msg[0]);
    };
    j$sendMessage = function(msg){
        J$VM.MQ.send(msg[3], msg[4], msg[2], msg[1], msg[0]);
    };

    /**
     * @member J$VM
     * @method
     * Attach an event to an object.
     *
     * See also {@link js.util.Event#attachEvent}
     */
    this.$attachEvent = js.util.Event.attachEvent;

    /**
     * @member J$VM
     * @method
     * Detach an event from an object.
     *
     * See also {@link js.util.Event#detachEvent}
     */
    this.$detachEvent = js.util.Event.detachEvent;

    // Defined some speparaters for js code
    this.SPE1 = "RR2kfidRR";
    this.SPE2 = "RR3uiokRR";

    // Load the third party library from classpath
    var home = env.j$vm_home, file,
        libs = env.j$vm_classpath ? env.j$vm_classpath.split(";") : [];
    if(self.JSON == undefined){
        libs.unshift("lib/json2.js");
    }
    (function(file){
        if(file.length === 0) return;

        if("lib/json2.js" == file){
            this.Class.loadScript(home+ "/" + file);
        }else{
            this.Class.loadClass(home + "/" + file);
        }
    }).$forEach(this, libs);

}).call(self.J$VM);

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
 * Author: hoo@hoo-desktop
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.text");

/**
 * 
 */
js.text.Format = function(pattern, symbols){

    var CLASS = js.text.Format, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    thi$._pad = function(val, len){
        val = "000"+String(val);
        return val.slice(val.length - (len || 2));
    };

    /**
     * Set format pattern
     * 
     * @param pattern pattern string
     */    
    thi$.setPattern = function(pattern){
        this.pattern = pattern;
    };
    
    /**
     * Set symbols for formatting or parsing a value
     * 
     * @param symbols, symbols table
     */
    thi$.setSymbols = function(symbols){
        this.symbols = symbols;
    };
    
    /**
     * Return a formatted string of a specified value
     * 
     * Notes: Subclass should override this method
     * 
     * @param value
     */
    thi$.format = function(value){
        return value ? value.toString() : value;
    };
    
    /**
     * Return an object from value string
     * 
     * Notes: Subclass should override this method
     * 
     * @param strValue
     */
    thi$.parse = function(strValue){
        return strValue;
    };
    
    thi$._init = function(pattern, symbols){
        this.setPattern(pattern);
        this.setSymbols(symbols);
    };
    
    this._init.apply(this, arguments);

}.$extend(js.lang.Object);


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

js.text.DateFormatSymbols = function(symbols){

    var CLASS = js.text.DateFormatSymbols, thi$ = CLASS.prototype;
    if(CLASS.__defined){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined = true;

    var Class = js.lang.Class, System = J$VM.System;
    
    CLASS.Default = {
        eras : ["BC", "AD"],

        lMonths:["January", "February", "March", "April", 
                 "May", "June", "July", "August", 
                 "September", "October", "November", "December"],
        sMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
                  "Sep", "Oct", "Nov", "Dec"],

        lWeekdays:["Sunday", "Monday", "Tuesday", "Wednesday", 
                   "Thursday", "Friday", "Saturday"],
        sWeekdays:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

        ampm: ["AM", "PM"]
    };

    /**
     * Gets era strings. For example: "BC" and "AD".
     * 
     * @return the era strings array.
     */
    thi$.getEras = function(){
        return this.symbols.eras;
    };

    /**
     * Gets month strings. For example: "January", "February", etc.
     * 
     * @return the month strings array.
     */
    thi$.getMonths = function(){
        return this.symbols.lMonths;
    };


    /**
     * Gets short month strings. For example: "Jan", "Feb", etc.
     * 
     * @return the short month strings.
     */
    thi$.getShortMonths = function(){
        return this.symbols.sMonths;
    };


    /**
     * Gets weekday strings. For example: "Sunday", "Monday", etc.
     * 
     * @return the weekday strings array.
     */
    thi$.getWeekdays = function(){
        return this.symbols.lWeekdays;
    };

    /**
     * Gets short weekday strings. For example: "Sun", "Mon", etc.
     * 
     * @return the short weekday strings array.
     */
    thi$.getShortWeekdays = function(){
        return this.symbols.sWeekdays;
    };

    /**
     * Gets ampm strings. For example: "AM" and "PM".
     * 
     * @return the ampm strings array.
     */
    thi$.getAmPmStrings = function() {
        return this.symbols.ampm;
    };

    thi$._init = function(symbols){
        var syb = System.objectCopy(CLASS.Default, null, true);
        syb = System.objectCopy(symbols || {}, syb, true);

        var _ = js.util.LinkedList;
        _.$decorate(syb.eras);
        _.$decorate(syb.lMonths);
        _.$decorate(syb.sMonths);
        _.$decorate(syb.lWeekdays);
        _.$decorate(syb.sWeekdays);
        _.$decorate(syb.ampm);

        this.symbols = syb;
    };
    
    this._init.apply(this, arguments);

}.$extend(js.lang.Object);

js.text.DefaultDateSymbols = new js.text.DateFormatSymbols();
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

        buf.unshift(s == -1 ? minus : " ");
        
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
$import("js.util.LinkedList");

js.text.SimpleDateFormat = function(pattern, DateFormatSymbols){
	
	var CLASS = js.text.SimpleDateFormat, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, System = J$VM.System;

	var TOKEN = /yy(?:yy)?|M{1,}|d{1,2}|E{1,}|([Hhms])\1?|S(?:SS)?|[azZG]|"[^"]*"|'[^']*'/g;
	var TIMEZONE = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
	
	var Regx = {
		yy : "(\\d{2})", yyyy : "(\\d{4})", G : "(\\S+)",
		M  : "([1-9]|1[012])", MM : "(0[1-9]|1[012])",
		MMM : "(\\S+)", MMMM : "(\\S+)",
		d : "(3[01]|[12][0-9]|[1-9])", dd : "(0[1-9]|[12][0-9]|3[01])",
		E : "(\\S+)", EE : "(\\S+)", EEE : "(\\S+)", EEEE : "(\\S+)",
		H : "([0-9]|1[0-9]|2[0-3])", HH : "(0[0-9]|1[0-9]|2[0-3])",
		h : "([1-9]|1[012])", hh : "(0[1-9]|1[012])", a : "(\\S+)",
		m : "([0-9]|[1-5][0-9])", mm : "([0-5][0-9])",
		s : "([0-9]|[1-5][0-9])", ss : "([0-5][0-9])",
		S : "(\\d{1,3})", SSS : "(\\d{3})",
		z : "(\\S+)", Z : "([\\-\\+]\\d{2,4})"
	};
    
    var SetterOrder = js.util.LinkedList.$decorate(["y", "M", "d"]);
	
	var Getter = new function(){
		var _pad  = function(val, len){val = "000"+String(val); return val.slice(val.length - (len || 2)); };
		var _week = function(D,$,b){return b ? D.getUTCDay() : D.getDay();};
		this.yy	  = function(D,$,b){return _pad(this.yyyy(D,$,b), 2);};
		this.yyyy = function(D,$,b){return _pad((b ? D.getUTCFullYear() : D.getFullYear()), 4);};
		this.M	  = function(D,$,b){return ( b ? D.getUTCMonth() : D.getMonth())+1;};
		this.MM	  = function(D,$,b){return _pad(this.M(D,$,b), 2);};
		this.MMM  = function(D,$,b){return $.getShortMonths()[this.M(D,$,b) - 1];};
		this.MMMM = function(D,$,b){return $.getMonths()[this.M(D,$,b) - 1];};
		this.d	  = function(D,$,b){return b ? D.getUTCDate() : D.getDate();};
		this.dd	  = function(D,$,b){return _pad(this.d(D,$,b), 2);};
		this.E	  = function(D,$,b){return $.getShortWeekdays()[_week(D,$,b)];};
		this.EE	  = function(D,$,b){return $.getShortWeekdays()[_week(D,$,b)];};
		this.EEE  = function(D,$,b){return $.getShortWeekdays()[_week(D,$,b)];};
		this.EEEE = function(D,$,b){return $.getWeekdays()[_week(D,$,b)];};
		this.H	  = function(D,$,b){return b ? D.getUTCHours() : D.getHours();};
		this.HH	  = function(D,$,b){return _pad(this.H(D,$,b), 2);};
		this.h	  = function(D,$,b){return this.H(D,$,b) % 12 || 12;};
		this.hh	  = function(D,$,b){return _pad(this.h(D,$,b), 2);};
		this.m	  = function(D,$,b){return b ? D.getUTCMinutes() : D.getMinutes();};
		this.mm	  = function(D,$,b){return _pad(this.m(D,$,b), 2);};
		this.s	  = function(D,$,b){return b ? D.getUTCSeconds() : D.getSeconds();};
		this.ss	  = function(D,$,b){return _pad(this.s(D,$,b));};
		this.S	  = function(D,$,b){return b ? D.getUTCMilliseconds() : D.getMilliseconds();};
		this.SSS  = function(D,$,b){return _pad(this.S(D,$,b), 3);};
		this.a	  = function(D,$,b){return $.getAmPmStrings()[this.H(D,$,b) < 12 ? 0:1];};
		this.G	  = function(D,$,b){return $.getEras()[parseInt(this.yyyy(D,$,b),10) < 0 ? 0:1];};
		this.z	  = function(D,$,b){return b ? "UTC" : (String(D).match(TIMEZONE) || [""]).pop().replace(/[^-+\dA-Z]/g, "");};
		this.Z	  = function(D,$,b){var o = D.getTimezoneOffset(), ao = Math.abs(o);return (o > 0 ? "-" : "+") + _pad(Math.floor(ao/60)*100 + ao%60, 4);};
	};
    
	var Setter = new function(){
        /*
         * For bug #103576
         * Covert two-digital year as four-digital.
         * 
         * Ref js.text.SimpleDateFormat.java:
         * 
         * #initializeDefaultCentury()
         * #subParse()
         * 
         * Limitation:
         * When the "v === (now.getFullYear() - 80) % 100" (e.g: 34 === (2014 - 80) % 100), 
         * there are some special handle in JDK. However, it's impossible to do such thing
         * in javascript. So that, in 2014, to parse "34" as year, the 2534 will be returned,
         * but 1934 will be returned in javascript.
         */
        var _toFullYear = function(v){
            v = parseInt(v, 10);
            if(isNaN(v) || (v.toString().length > 2)){
                return v;
            }
            
            var d = new Date(), 
            defaultCenturyStartYear = d.getFullYear() - 80,
            ambiguousTwoDigitYear = defaultCenturyStartYear % 100;
            
            v += parseInt(defaultCenturyStartYear / 100) * 100 +
                (v < ambiguousTwoDigitYear ? 100 : 0);
            return v;
        };
        
		this.yy	  = function(D,v,$,b){v = _toFullYear(v); return this.yyyy(D,v,$,b);};
		this.yyyy = function(D,v,$,b){var y = parseInt(v, 10); D.y = (y > 0 && D.bc) ? 0-y : y; b ? D.setUTCFullYear(D.y) : D.setFullYear(D.y); return D;};
		this.M	  = function(D,v,$,b){var M = parseInt(v, 10)-1; b ? D.setUTCMonth(M) : D.setMonth(M); return D;};
		this.MM	  = function(D,v,$,b){return this.M(D,v,$,b);};
		this.MMM  = function(D,v,$,b){var i = $.getShortMonths().indexOf(v); return i !=-1 ? this.M(D,i+1,$,b) : D;};
		this.MMMM = function(D,v,$,b){var i = $.getMonths().indexOf(v); return i !=-1 ? this.M(D,i+1,$,b) : D;};
		this.d	  = function(D,v,$,b){var d = parseInt(v,10); b ? D.setUTCDate(d) : D.setDate(d); return D;};
		this.dd	  = function(D,v,$,b){return this.d(D,v,$,b);};
		this.E	  = function(D,v,$,b){return D;};
		this.EE	  = function(D,v,$,b){return D;};
		this.EEE  = function(D,v,$,b){return D;};
		this.EEEE = function(D,v,$,b){return D;};
		this.H	  = function(D,v,$,b){var h = parseInt(v, 10); D.h = (h < 12 && D.pm) ? (h+12)%24 : h; b ? D.setUTCHours(D.h) : D.setHours(D.h); return D;};
		this.HH	  = function(D,v,$,b){return this.H(D,v,$,b);};
		this.h	  = function(D,v,$,b){return this.H(D,v,$,b);};
		this.hh	  = function(D,v,$,b){return this.H(D,v,$,b);};
		this.m	  = function(D,v,$,b){var m = parseInt(v, 10); b ? D.setUTCMinutes(m) : D.setMinutes(m); return D;};
		this.mm	  = function(D,v,$,b){return this.m(D,v,$,b);};
		this.s	  = function(D,v,$,b){var s = parseInt(v, 10); b ? D.setUTCSeconds(s) : D.setSeconds(s); return D;};
		this.ss	  = function(D,v,$,b){return this.s(D,v,$,b);};
		this.S	  = function(D,v,$,b){var S = parseInt(v, 10); b ? D.setUTCMilliseconds(S) : D.setMilliseconds(S); return D;};
		this.SSS  = function(D,v,$,b){return this.S(D,v,$,b);};
		this.a	  = function(D,v,$,b){switch($.getAmPmStrings().indexOf(v)){case 0:D.am = true;return (D.h && D.h == 12) ? this.H(D, 0, $, b) : D;case 1:D.pm = true;return D.h ? this.H(D, D.h, $, b) : D;}return D;},
		this.G	  = function(D,v,$,b){if($.getEras().indexOf(v) === 0){D.bc = true; return D.y ? this.yyyy(D, D.y, $, b) : D;}return D;};
		this.z	  = function(D,v,$,b){return D;};
		this.Z	  = function(D,v,$,b){return D;};
	};
	
	/**
	 * Set format pattern
	 * 
	 * @param pattern, String type
	 */
	thi$.setPattern = function(pattern){
		pattern = this.pattern = pattern || "EEE MMM dd HH:mm:ss yyyy";

		CLASS.infos = CLASS.infos || {};

		var info = CLASS.infos[pattern], pIndex, str;
		if(info) return;

		info = CLASS.infos[pattern] = {};
		pIndex = info.pIndex = js.util.LinkedList.newInstance();
        
        // Escape the RegExp meta characters
        // Only parsing operation need to escape, formatting needn't
        pattern = js.lang.String.escapeRxMetaChars(pattern);
		
		str = pattern.replace(
			TOKEN, 
			function($0){
				var t = $0.charAt(0);
				$0 = ((t == 'M' || t == 'E') && $0.length > 4) ? 
					$0.slice(0, 4) : $0;
				if(typeof Setter[$0] === "function"){
					pIndex.push($0);
					return Regx[$0];
				}

				if($0.length >= 2){
					$0 = $0.replace(/"|'/g, "");
				}

				return $0;
			});

		info.dPattern = new RegExp(str);

	}.$override(this.setPattern);
	
	/**
	 * Set format symbols
	 * 
	 * @see js.text.DateFormatSymbols
	 */
	thi$.setDateFormatSymbols = function(DateFormatSymbols){
		this.symbols = DateFormatSymbols || 
			new(Class.forName("js.text.DateFormatSymbols"))();
	};

	/**
	 * @see js.text.Format
	 */		
	thi$.setSymbols = function(symbols){
		this.symbols = symbols || 
			new(Class.forName("js.text.DateFormatSymbols"))();

	}.$override(this.setSymbols);

	/**
	 * Return a formatted string of the specified date
	 * 
	 * @param date, Date type, if null use current date
	 * @param isUTC, boolean type, whether is UTC
	 * 
	 * @return String
	 */
	thi$.format = function(date, isUTC){
		date = date ? date : new Date();
		if(!Class.isDate(date)){
			return date;
		}
		
		var _symbols = this.symbols;
		return this.pattern.replace(
			TOKEN, 
			function($0){
				var t = $0.charAt(0);
				$0 = ((t == 'M' || t == 'E') && $0.length > 4) ? 
					$0.slice(0, 4) : $0;
				return (typeof Getter[$0] === "function") ? 
					Getter[$0](date, _symbols, isUTC) : 
					$0.slice(1, $0.length-1);
			});

	}.$override(this.format);
	
	/**
	 * Return a <code>Date<code> object from a date string
	 * 
	 * @param datestr, String type
	 * @param strict, boolean type, whether match the specified pattern strictly
	 * @param isUTC, boolean type, whether is UTC
	 * 
	 * @return Date
     * 
     * P.S. 03/25/2014 Pan Mingfa
     * When we set value to a Date object, the order of year, month, date should
     * be followed. Otherwise, if the February is setten first, and then set 29th 
     * as date, the month will be changed as March because 1970 is not leap year
     * and the February has no 29 days. So, we need to set year first to determine
     * the leap year, and then set month and date.
	 */
	thi$.parse = function(datestr, strict, isUTC){
		var info = CLASS.infos[this.pattern], 
		pIndex = info.pIndex, _symbols = this.symbols, 
		date, m = datestr.match(info.dPattern), $0, v,
		idx, mvs = [], i, len, obj;
		if(m){
			date = new Date(1970, 0, 1);
			for(i = 1, len = m.length; i < len; i++){
				$0 = pIndex[i-1];
				v = m[i];
				
				idx = SetterOrder.indexOf($0.charAt(0));
				if(idx !== -1){
					mvs[idx] = [$0, v];
				}else{
					date = Setter[$0](date, m[i], _symbols, isUTC);
				}
			}
			
			for(i = 0, len = mvs.length; i < len; i++){
				obj = mvs[i];
				if(obj){
					date = Setter[obj[0]](date, obj[1], _symbols, isUTC);
				}
			}

			return date;
		}

		if(strict !== true){
			try{
				date = new Date(Date.parse(datestr));	 
			} catch (x) {
				
			}
		}
		
		if(!Class.isDate(date))
			throw SyntaxError("Invalid date string");

		return date;

	}.$override(this.parse);

	this._init.apply(this, arguments);
	
}.$extend(js.text.Format);


if(Date.SF === undefined){
	Date.SF = new js.text.SimpleDateFormat();

	Date.prototype.$format = function(pattern, isUTC){
		if(pattern) Date.SF.setPattern(pattern);
		return Date.SF.format(this, isUTC);
	};

	Date.$parse = function(datestr, pattern, symbols, isUTC){
		if(pattern) Date.SF.setPattern(pattern);
		if(symbols) Date.SF.setSymbols(symbols);
		return Date.SF.parse(datestr, isUTC);
	};
}

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

        buf.unshift(s == -1 ? minus : " ");
        
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


