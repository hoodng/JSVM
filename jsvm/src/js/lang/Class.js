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

    this.loadImage = function(image, url){
        var Base64 = this.forName("js.util.Base64"), xhr;
        if(J$VM.safari){
            xhr = J$VM.XHRPool.getXHR(true);
            xhr.setRequestHeader("responseType", "arraybuffer");
            xhr.onsuccess = function(e){
                var buf, dataUrl;
                xhr = e.getData(); 
                buf = xhr.response();
                dataUrl = ["data:",xhr.contentType(),";base64,"];
                dataUrl.push(Base64.encodeArray(buf, Base64.standardB64));
                dataUrl = dataUrl.join("");
                image.src = dataUrl;
                xhr.close();
            };
            xhr.open("GET", url, undefined);
        }else{
            image.crossOrigin = "anonymous";
            image.src = url;
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

