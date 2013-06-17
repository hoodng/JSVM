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

            text = text || this.getResource(filePath, !this.isString(text) , true);
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
        text = text || this.getResource(filePath, !this.isString(text), true);
        var script = document.createElement("script");
        var head = document.getElementsByTagName("head")[0];
        script.type= "text/javascript";
        script.text = text;
        head.appendChild(script);
        head.removeChild(script);

    }.$bind(this);
    

    //--MakeInterface--begin:  for make javascript interface & implement gridge by Synchronous uri.---
    var GetARGV=function(arguments){
        var i;
        var argv=[];
        for(i=0;i<arguments.length;i++){
            argv.push(arguments[i]);
        }
        return argv;
    };
    var Require=this;
    var MakeInterface=function(ClassFunction,interfacies,implementBridge){
        var i;
        var _interfaceName;
        var idx;
        var getProxyFunction=function(interfaceName){
            return function(){
                var argv=GetARGV(arguments);
                var i;
                argv.splice(0,0,interfaceName);
                return implementBridge.apply(this,argv);
            };
        };
        for(i=0;i<interfacies.length;++i){
            _interfaceName=interfacies[i];
            idx=_interfaceName.indexOf("(");
            if(idx!=-1){
                _interfaceName=_interfaceName.substring(0,idx);
            }
            ClassFunction.prototype[_interfaceName]=getProxyFunction(_interfaceName);
        }
    };

    /**
     this method make a synchronous javascript function.
     and it's all instance method will exec after depend scrips loaded.
     and make it easy debug in browser to asynchronous load depend scrips.

     @param ClassFunction , a Function , all it's instances's method will be forword ImplementFunction.
     @param ImplementFunctionName ,implement Function or implementFunction name. detail implement code should write in this function.
     @param DependScriptUris , depeand scripts 's uris. implement code will be call after these uris be loaded.
     @param interfacies , a Array . include method names. and only these name methode will be forword.
     @return , no value.

     simple code1:
     
     var ClientInterface=new Function;
     var ServiceInterface=new Function;
     var c=new ClientInterface;
     NS.Make(ClientInterface,ServiceInterface,null,[
     "test()"
     ]);
     ServiceInterface.prototype={
     "test":function(){
     return "test";
     }
     };
     return "test"==c.test();

     simple code2: ref "com.jinfonet.report.gmap.dashboard.view"
     
     */
    this.MakeInterface=function(ClassFunction,ImplementFunctionName,DependScriptUris,interfacies){
        var implementBridge=function(){
            var argv=GetARGV(arguments);
            var interfaceName=argv.shift();
            var classInstance=this;
            var ImplementFunction;
            if(ImplementFunction){
                return ImplementFunction.prototype[interfaceName].apply(classInstance,argv);
            };
            if(DependScriptUris){
                Require.LoadScriptsExt(DependScriptUris,false,function(loaded,previouslyLoaded){
                    ImplementFunction=typeof ImplementFunctionName=="string"?eval(ImplementFunctionName):ImplementFunctionName;
                    return ImplementFunction.prototype[interfaceName].apply(classInstance,argv);
                });
            }else{
                ImplementFunction=typeof ImplementFunctionName=="string"?eval(ImplementFunctionName):ImplementFunctionName;
                return ImplementFunction.prototype[interfaceName].apply(classInstance,argv);
            }

            return null;
        };

        MakeInterface(ClassFunction,interfacies,implementBridge);
    };

    //--load script support for Asynchronous/Synchronous, copy from script.js.-- code begin {
    this.LoadScriptsExt=function(srcs,synchro,callBack,isFlush){
        var idx=0;
        var _callback=function(loaded){
            if(!loaded){
                throw srcs;
            }
            idx++;
            if(idx<srcs.length){
                Require.LoadScriptExt(srcs[idx],synchro,_callback,isFlush);
            }else{
                if(callBack){
                    callBack(true);
                }
            }
        };
        this.LoadScriptExt(srcs[idx],synchro,_callback,isFlush);
    };
    var LoadedResources={};
    var HasLoaded=function(src){
        var head;
        var i;
        var c;
        if(LoadedResources[src]==1){
            return true;
        }
        head=document.getElementsByTagName("head")[0]||document.documentElement;
        for(i=0;i<head.childNodes.length;i++){
            c=head.childNodes[i];
            if((c.tagName=="SCRIPT"||c.tagName=="LINK")&&c.getAttribute("uri")==src)
                return true;
        }
        return false;
    };
    this.LoadScriptExt=function(src,synchro,callBack,isFlush){
        var script;
        var isHttp;
        var xml_http;
        var head;
        if(!isFlush&&HasLoaded(src)){
            if(callBack){
                callBack(true,true);
            }
            return true;
        }
        script=document.createElement("script");
        script.type="text/javascript";
        synchro=synchro&&(window.location.protocol!=="file:");
        if(synchro){
            xml_http=window.XMLHttpRequest&&(window.location.protocol!=="file:"||!window.ActiveXObject)?new window.XMLHttpRequest():new window.ActiveXObject("Microsoft.XMLHTTP");
            xml_http.open("GET",src,false);
            xml_http.send(null);
            if(xml_http.status!=200){
                if(callBack){
                    callBack(false);
                }
                return false;
            }else{
                script.text=xml_http.responseText;
            }
        }else{
            if(LoadedResources[src] instanceof Array){
                LoadedResources[src].push(callBack);
                return true;
            }
            script.src=src;
            var onload=function(){
                var listeners=LoadedResources[src];
                var _callBack;
                while(listeners instanceof Array&&listeners.length>0){
                    _callBack=listeners.shift();
                    if(_callBack){
                        _callBack(true);
                    }
                }
                script.onload=null;
                script.onerror=null;
                LoadedResources[src]=1;
            };
            script.onreadystatechange=function(){
                if(script.readyState=="loaded"){
                    onload();
                }
            };
            script.onload=onload;
            script.onerror=function(){
                var listeners=LoadedResources[src];
                var _callBack;
                while(listeners.length>0){
                    _callBack=listeners.shift();
                    if(_callBack){
                        _callBack(false);
                    }
                }
                script.onload=null;
                script.onerror=null;
                LoadedResources[src]=3;
            };
        }
        head=document.getElementsByTagName("head")[0]||document.documentElement;
        head.appendChild(script);
        if(synchro){
            LoadedResources[src]=1;
            if(callBack){
                callBack(true);
            }
        }else{
            LoadedResources[src]=[callBack];
        }
        return true;
    };
    // } --load script support for Asynchronous/Synchronous. code end.

    /**
     * Return the content with the specified url
     * 
     * @param url, the url to load content
     */
    this.getResource = function(url, nocache, preventInjection){
        // Synchronized request
        var xhr = new js.net.HttpURLConnection(false);
        xhr.setNoCache(nocache || false);
        xhr.open("GET", url, undefined, preventInjection == true);
        
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

