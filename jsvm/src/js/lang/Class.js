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

    this.packages = [];
    
    /**
     * Create namespace with specified Java like package name
     *
     * @param packageName
     */
    $package = this.definePackage = function(packageName){
        if(_modules[packageName]) return;

        var names = packageName.split("."), parent=self, name, i, len;
        
        for(i=0, len=names.length; i<len; i++){
            name = names[i];
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
    $import = this.importClass = function(className){
        var clazz = _checkClass(className), filePath;
        if (clazz != undefined) return clazz;
        
        try{
            filePath = _makeFilePath(className);
            _loadClass(filePath);
            clazz = _modules[className] = _checkClass(className);
        } catch (ex) {
            J$VM.System.err.println(
                "Can't load "+className+" from "+ filePath);
        }

        return clazz;
    };

    var _checkClass = function(className){
        if(!className) return undefined;
        
        var clazz = _modules[className], names, name, i, len;

        if(clazz === undefined){
            names = className.split(".");
            clazz = self;
            for(i=0, len=names.length; i<len; i++){
                name = names[i];
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

    var _makeFilePath = function(className){
        var buf = [], names, i, len;

        buf.push(J$VM.env.j$vm_home);
        buf.push("classes");

        names = className.split(".");
        for(i=0, len=names.length; i<len; i++){
            buf.push("/");
            buf.push(names[i]);
        }
        buf.push(".jz");

        return buf.join('');
        
    }.$bind(this);

    /**
     * Load a javascript class with specified file path
     *
     * @param className
     */
    $load_package = this.loadClass = function(filePath, className){
        if(className === undefined || _checkClass(className) == undefined){
            try{
                _loadClass(filePath);
            } catch (ex) {
                J$VM.System.err.println("Can't load class from "+filePath);
            }
        }
    };

    var _loadClass = function(filePath){
        if(!J$VM.env.j$vm_isworker){
            var storage = J$VM.storage.cache, text, cached, incache = false,
                key = filePath.substring(J$VM.env.j$vm_home.length);

            cached = storage.getItem(key);

            if(cached){
                if(cached.build && cached.build === J$VM.pkgversion[key]){
                    text = cached.text;
                    incache = true;
                }
            }

            text = this.loadScript(!text ? filePath : null, text);

            if(!incache){
                try{
                    storage.setItem(key,
                                    {build:J$VM.pkgversion[key],
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
        var b = !text;
        text = text || this.getResource(filePath, !this.isString(text));
        var script = document.createElement("script");
        var head = document.getElementsByTagName("head")[0];
        script.type= "text/javascript";
        script.text = text;
        head.appendChild(script);
        head.removeChild(script);
        
        if(b){
            this.packages.push(filePath);
        }
        
        return text;
    };

    /**
     * Return the content with the specified url
     *
     * @param url, the url to load content
     */
    this.getResource = function(url, nocache){
        // Synchronized request
        var xhr = J$VM.XHRPool.getXHR(false), text, ex;
        xhr.setNoCache(nocache || false);
        xhr.open("GET", url, undefined);

        if(xhr.exception == undefined && xhr.readyState() == 4 &&
           (xhr.status() == 200 || xhr.status() == 304)){
            text =  xhr.responseText();
            xhr.close();
            return text;
        }

        ex = xhr.exception;
        xhr.close();
        throw ex;
    };

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

    };

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
        return _typeof(o);
    };
    
    var _typeof = function(o){
        var s = Object.prototype.toString.call(o);
        return s.substring(8, s.length-1).toLowerCase();
    };

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
        return this.typeOf(o) === "date" && !isNaN(o);
    };

    /**
     * Test if the specified object is an BigInt
     */
    this.isBigInt = function(o){
        return js.text && js.text.BigIntTools 
            && (typeof o == "object") 
            && (o instanceof js.text.BigIntTools.BigInt);
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
        return this.typeOf(o) === "string";
    };

    /**
     * Test if the specified object is a number
     */
    this.isNumber = function(o){
        return this.typeOf(o) === "number" && !isNaN(o);
    };

    /**
     * Test if the specified object is an object
     */
    this.isObject = function(o){
        return this.typeOf(o) === "object";
    };

    /**
     * Test if the specified object is a pure object other than a Class object.
     */
    this.isPureObject = function(o){
        return this.isObject(o) && (o.constructor === Object);  
    };

    /**
     * Test if the specified object is a Boolean
     */
    this.isBoolean = function(o){
        return this.typeOf(o) === "boolean";
    };

    /**
     * Test if the specified object is null
     */
    this.isNull = function(o){
        return this.typeOf(o) === "null";
    };

    /**
     * Test if the specified object is undefined
     */
    this.isUndefined = function(o){
        return this.typeOf(o) === "undefined";
    };

    /**
     * Test if the specified object is a function
     */
    this.isFunction = function(o){
        return this.typeOf(o) === "function";
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
        return this.typeOf(o).indexOf("html") === 0;
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
     * Check whether the specified object is one of the given type.
     * 
     * @param {String / Object / ...}  o The object to check.
     * @param {String} type The specified type to ref.
     * 
     * @return {Boolean} true is the object is of the given type.
     */
    this.is = function(o, type){
        var b = false;
        if(!this.isString(type) || type.length == 0){
            return this.isValid(o);
        }

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

    /**
     * Check whether the specified element is in the given collection.
     * The collection may be the array or object. If the collection is
     * object, the method will check whether the specified element is
     * its own property.
     * 
     * @param {String / Object / ...} e The specified element to check.
     * @param {Array / Object} set The given collection to ref.
     */
    this.isIn = function(e, set){
        var b = false;
        if(!this.isValid(e)){
            return b;
        }

        switch(this.typeOf(set)){
        case "object":
            b = set.hasOwnProperty("" + e);
            break;
        case "array":
            if(typeof set.contains !== "function"){
                js.util.LinkedList.$decorate(set);
            }
            b = set.contains(e);
            break;
        default:
            break;
        }

        return b;
    };
}();
