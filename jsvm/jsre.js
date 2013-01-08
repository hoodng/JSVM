
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

/**
 * Define J$VM name-space and run-time environment
 */
J$VM = new function (){
    this.__product__ = "J$VM";
    this.__version__ = "0.9.s2db5f6c9016e6ab7";

    this.env = {
        j$vm_log: false,
        j$vm_ajax_nocache: true,
        j$vm_ajax_timeout: 600000,
        j$vm_timeslice: 20,
        j$vm_threshold: 45,
        j$vm_longpress: 90
    };
    
    /**
     * Test whether the J$VM is working in Web Worker
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
     * Provides inheritance to javascript class.<p>
     * For example:
     * A = function(){
     * };
     * 
     * // B will extends A
     * 
     * B = function(){
     * 
     * }.$extend(A)
     * 
     * new B() instanceof A // true
     * 
     * @param superC, super class
     * @return 
     * 
     */
    Function.prototype.$extend = function(superC){
        if(typeof superC === "function"){
            var proto = this.prototype = new (superC)();
            proto.constructor = superC;
            //proto.constructor.$decorate(proto);
        }else if(typeof superC === "object"){
            var proto = this.prototype = superC;
            proto.constructor = superC.constructor;
            //proto.constructor.$decorate(proto);
        }else{
            throw new Error("superC must be a function or object");
        }

        return this;
    };
    
    /**
     * Provides implement interface to javascript class.<p>
     * For example:
     * 
     * IA = function(){
     *     this.funA = function(){
     *     };
     * };
     * 
     * IB = function(){
     *      this.funB = function(){
     *      };
     * };
     * 
     * C = function(){
     *    
     * }.$implements(IA, IB);
     * 
     * var t = new C();
     * t.instanceOf(IA) // true
     * t.instanceOf(IB) // true
     */
    Function.prototype.$implements = function(superCs){
        var proto = this.prototype, superC,
        imps = proto.__imps__ = /*proto.__imps__ ||*/ [];
        
        for(var i=0, len=arguments.length; i<len; i++){
            superC = arguments[i];
            if(typeof superC == "function"){
                imps.push(superC);
                superC.$decorate(proto);
            }
        }

        return this;
    };

    Function.prototype.$decorate = function(o){
        var p, proto = this.prototype;
        if(this.__defined__ == undefined) new (this)();

        for(p in proto){
            if(proto.hasOwnProperty(p) && 
               "constructor" != p && 
               "__imps__" != p &&
               !o.hasOwnProperty(p)){
                o[p] = proto[p];    
            }
        }

        return o;
    };

    /**
     * Bind a function to the specified scope.
     * 
     * @param thi$, the runtime scope that this function bind to.
     * @param ..., other parameters need pass to this function
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
     * Bind a function to the specified scope as an event listener
     * 
     * @param thi$, the runtime scope that this listener bind to.
     * @param eClass, the event class, by default you can use js.util.Event
     * @param ..., other parameters need pass to the listener
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
     * Delay a function with specified timeout.<p>
     * For example:
     * 
     * var fun = function(){
     *     // do something
     * };
     * 
     * // The function fun will be delay 20 millisecons to executing.
     * fun.$delay(this, 20, param1...);
     * 
     * @param thi$, the runtime scope of the delayed function bind to.
     * @param timeout
     * @param ... other parameters need pass to delayed function.
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
     * Clear timer on a function
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
     * Override a function.<p>
     * For example:
     * 
     * this.fun = function(txt){
     *     // do A thing  
     * };
     * 
     * this.fun = function(txt){
     * 
     *     // You can call super do A before do B
     *     arguments.callee.__super__.apply(this, arguments);
     * 
     *     // do B thing
     * 
     *     // Or you can call super do A after do B
     *     arguments.callee.__super__.apply(this, arguments);
     * 
     * }.$override(this.fun);
     * 
     * @param func, the super function.
     * 
     * @return the overrided function that has a <em>__super__</em> property 
     * point to the super function.
     */
    Function.prototype.$override = function(func){
        this.__super__ = func;
        return this;
    };

    /**
     * Calls a function for each element in a set<p>
     * 
     * @param thi$, the runtime scope of this function
     * @param set, can be an array or an object
     * @param ..., other arguments need pass to this function
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
                    if("break" === x) 
                        break;
                }
            }
            break;
        case "object":
            for(i in set){
                try{
                    fn.apply(thi$, $args.concat(set[i], i, set));   
                } catch (x) {
                    if("break" === x)
                        break;
                }
            }
            break;
        default:
            break;
        }
    };
    
    /**
     * Calls a function for each element in a set, and returns a set that contains 
     * the results<p>
     * 
     * @param thi$, the runtime scope of this function
     * @param set, can be an array or an object
     * @param ..., other arguments need pass to this function
     * 
     * @return array or object follow the input "set"
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
     * Returns the elements of a set that meet the condition specified 
     * in this function<p>
     * 
     * @param thi$, the runtime scope of this function
     * @param set, can be an array or an object
     * @param ..., other arguments need pass to this function
     * 
     * @return array or object follow the input "set"
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
     * Checks whether a defined callback function returns true for 
     * any element of a set.<p>
     * 
     * @param thi$, the runtime scope of this function
     * @param set, can be an array or an object
     * @param ..., other arguments need pass to this function
     * 
     * @return true if the callbackfn function returns true for any set element; 
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
     * Checks whether a defined callback function returns true for all 
     * elements in a set.<p>
     * 
     * @param thi$, the runtime scope of this function
     * @param set, can be an array or an object
     * @param ..., other arguments need pass to this function
     * 
     * @return true if the callbackfn function returns true for all set elements; 
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

            text = text || this.getResource(filePath, true);
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
        text = text || this.getResource(filePath, true);
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
    this.getResource = function(url, nocache){
        // Synchronized request
        var xhr = new js.net.HttpURLConnection(false);
        xhr.setNoCache(nocache || false);
        xhr.open("GET", url);
        
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
 * Source code availability: http://jzvm.googlecode.com
 */

js.lang.Math = new function (){
    var count = 0;

    this.random = function(n){
        return n ? Math.floor(Math.random()*n+1) : Math.random();    
    };
    
    this.uuid = function(hash){
        hash = hash || (new Date().getTime()+count++);
        return "s"+hash.toString(16);
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
 * Source code availability: http://jzvm.googlecode.com
 */

js.lang.Object = function (o){
    
    var CLASS = js.lang.Object, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        // TODO:
        return;
    }
    CLASS.__defined__ = true;

    thi$.hashCode = function(){
        if(this._hash == undefined){
            this._hash = js.lang.Math.random(new Date().getTime());
        }
        
        return this._hash;
    };
    
    thi$.equals = function(o){
        return o === this;
    };

    thi$.toString = function(){
        return (typeof this) + "@" + this.uuid();
    };
    
    thi$.uuid = function(id){
        if(id !== undefined){
            this._uuid = id;
        }else if(this._uuid == undefined){
            this._uuid = js.lang.Math.uuid(this.hashCode());
        }

        return this._uuid;
    };

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

    thi$.destroy = function(){
        J$VM.MQ.remove(this.uuid());
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
 * @File: String.js 
 * @Create: 2010-11-17 
 * @Author: dong.hu@china.jinfonet.com
 */

js.lang.String = new function(){

    var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;

    var REGX_HTML_DECODE = /&\w+;|&#(\d+);|<br\/>/g;

    var REGX_TRIM = /(^\s*)|(\s*$)/g;
    
    var REGX_REGEXP_METACHARS = /[\^\$\.\*\+\?\|\\\(\)\[\]\{\}]/g;
    
    var REGX_REGEXP_ESCAPEDMETACHARS = /\\([\^\$\.\*\+\?\|\\\(\)\[\]\{\}])/g;
    
    var HTML_DECODE = {
        "&lt;"  : "<", 
        "&gt;"  : ">", 
        "&amp;" : "&", 
        "&nbsp;": " ", 
        "&quot;": "\"", 
        "&copy;": "©",
        "<br/>" : String.fromCharCode(0x0A)
        // Add more
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
    
    this.trim = String.prototype.trim = function(s){
        s = (s != undefined) ? s : this.toString();
        return (typeof s != "string") ? s :
            s.replace(REGX_TRIM, "");
    };

    this.matchBrackets = String.prototype.matchBrackets = 
        function(lC, rC, s) {
            lC = lC || "{"; rC = rC || "}";
            s = (s !== undefined) ? s : this.toString();
            var ks=0,dqs=0,sqs=0,res=[],n="",b="",st=-1,en=-1;
            for(var i=0;i< s.length;i++){
                if(i!==0){
                    b = n;
                }
                n= s.charAt(i);
                if(st!==-1 && (i-1)>=0 &&b==='\\'){
                    continue;
                }
                if(dqs||sqs){
                    if(n==="'")
                        if(sqs>0)sqs--;
                    else if(n==='"')
                        if(dqs>0)dqs--;
                }else{
                    if(n===lC){
                        if(!ks){
                            st=i;
                        }
                        ks++;
                    }else if(n===rC){
                        ks--;
                        if(!ks){
                            en=i;
                        }
                    }else if(n==='"'){
                        dqs++;
                    }else if(n==="'"){
                        sqs++;
                    }
                }
                if(st!==-1&&en!==-1){
                    res.push(s.substring(st,(parseInt(en)+1)));
                    st=en=-1;
                }
            }
            return res;
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
 * Source code availability: http://jzvm.googlecode.com
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
 * Source code availability: http://jzvm.googlecode.com
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
        if(array && js.lang.Class.isArray(Array))
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
 * Source code availability: http://jzvm.googlecode.com
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
 * Source code availability: http://jzvm.googlecode.com
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
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.util");

js.util.Observable = function (){

    var CLASS = js.util.Observable, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    thi$.addObserver = function(observer){
        if(!(observer.instanceOf(js.util.Observer))) return;
        
        if(!this._obs.contains(observer)){
            this._obs.addLast(observer);
        }
    };
    
    thi$.deleteObserver = function(observer){
        if(!(observer.instanceOf(js.util.Observer)) ) return;
        
        this._obs.remove(observer);
    };
    
    thi$.deleteObservers = function(){
        this._obs.clear();
    };
    
    thi$.notifyObservers = function(data){
        if(!this.hasChanged()) return;

        (function(observer){
             observer.update.$delay(observer, 0, this, data);
         }).$forEach(this, this._obs);    
    };
    
    thi$.hasChanged = function(){
        return this._changed;
    };
    
    thi$.setChanged = function(){
        this._changed = true;    
    };
    
    thi$.clearChanged = function(){
        this._changed = false;
    };

    thi$.destroy = function(){
        this._obs.clear();
        delete this._obs;

        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);

    thi$._init = function(){
        this._obs = js.util.LinkedList.$decorate([]);
        this._changed = false;
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
 * Source code availability: http://jzvm.googlecode.com
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
 * Source code availability: http://jzvm.googlecode.com
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
    
    thi$._init = function(eventType, eventData, eventTarget){
        this.setType(eventType);
        this.setData(eventData);
        this.setEventTarget(eventTarget);

        this._time = new Date();
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
 * Source code availability: http://jzvm.googlecode.com
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
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.util");

$import("js.util.Observable");

js.util.EventTarget = function (){

    var CLASS = js.util.EventTarget, thi$ = CLASS.prototype;
    if(CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event,  A = js.util.LinkedList;

    var _getListeners = function(eventType){
        var hName = "on"+eventType, listeners = this[hName];

        if(!Class.isArray(listeners)){
            listeners = this[hName] = A.$decorate([]);
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
    thi$.fireEvent = function(evt){
        var eventType = evt instanceof Event ? 
            evt.getType() : evt.toString();

        var listeners = this["on"+eventType];
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
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);
    
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
 * Source code availability: http://jzvm.googlecode.com
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
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.util");

js.util.Document = function (){

    var CLASS = js.util.Document, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, cache = {},
    
    // Attributes Compatibility Table: Left - W3C, Right - IE
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
            hyphenMap[_s]=  s;
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
		if(J$VM.ie){
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
		if(J$VM.ie){
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
        el.removeAttribute(attr);
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
        
        if(J$VM.ie) {
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
        if(J$VM.ie){
            var filter = style.filter;
            style.filter = filter ? filter.replace(/alpha\(opacity=(.*)\)/i, "")
                .replace(/(^\s*)|(\s*$)/g, "") : "";
        }else{
            style.opacity = style['-moz-opacity'] = style['-khtml-opacity'] = "";
        }
    };

    /**
     * Apply styles to the DOM element
     * 
     * @param el, the DOM element
     * @param styles, the style set
     */    
    thi$.applyStyles = function(el, styles){
        (function(el, value, sp){
             if(sp.toLowerCase() == "opacity"){
                 this.setOpacity(el, value);
             }else{
                 sp = _pretreatProp.call(this, sp);
                 el.style[sp] = value;
             };
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
     * @param isEle  whether the element is a DOM element
     * 
     * @return {borderTopWidth, borderRightWidth, 
     * borderBottomWidth, borderLeftWidth}
     */
    thi$.getBorderWidth = function(el, currentStyles, isEle){
        var bounds = el.bounds; if(!bounds) bounds = el.bounds = {};
        
        if(!bounds.MBP || !bounds.MBP.borderTopWidth){
            var MBP = bounds.MBP = bounds.MBP || {};

            isEle  = isEle === undefined ?  this.isDOMElement(el) : isEle;
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
     * @param isEle  whether the element is a DOM element
     * 
     * @return {paddingTop, paddingRight, paddingBottom, paddingLeft}
     */
    thi$.getPadding = function(el, currentStyles, isEle){
        var bounds = el.bounds; if(!bounds) bounds = el.bounds = {};

        if(!bounds.MBP || !bounds.MBP.paddingTop){
            var MBP = bounds.MBP = bounds.MBP || {};
            isEle  = isEle === undefined ?  this.isDOMElement(el) : isEle;
            currentStyles = currentStyles || this.currentStyles(el, isEle);

            MBP.paddingTop   = this.parseNumber(currentStyles["paddingTop"]);
            MBP.paddingRight = this.parseNumber(currentStyles["paddingRight"]);
            MBP.paddingBottom= this.parseNumber(currentStyles["paddingBottom"]);
            MBP.paddingLeft  = this.parseNumber(currentStyles["paddingLeft"]);
        }

        return bounds.MBP;
    };

    /**
     * Return margin width of the element
     * 
     * @param el the element
     * @param currentStyles @see this.currentStyles()
     * @param isEle  whether the element is a DOM element
     * 
     * @return {marginTop, marginRight, marginBottom, marginLeft}
     */
    thi$.getMargin = function(el, currentStyles, isEle){
        var bounds = el.bounds; if(!bounds) bounds = el.bounds = {};

        if(!bounds.MBP || !bounds.MBP.marginTop){
            var MBP = bounds.MBP = bounds.MBP || {};
            isEle  = isEle === undefined ?  this.isDOMElement(el) : isEle;
            currentStyles = currentStyles || this.currentStyles(el, isEle);

            MBP.marginTop   = this.parseNumber(currentStyles["marginTop"]);
            MBP.marginRight = this.parseNumber(currentStyles["marginRight"]);
            MBP.marginBottom= this.parseNumber(currentStyles["marginBottom"]);
            MBP.marginLeft  = this.parseNumber(currentStyles["marginLeft"]);
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
            width:  o.width - b.borderLeftWidth - b.borderRightWidth - 
                p.paddingLeft - p.paddingRight,

            height: o.height- b.borderTopWidth  - b.borderBottomWidth-
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
        var BBM = bounds.BBM, styleW, styleH;

        if(BBM){
            styleW = w;
            styleH = h;
        }else{
            styleW = w - bounds.MBP.BPW;
            styleH = h - bounds.MBP.BPH;
        }

        if(Class.isNumber(styleW) && styleW >= 0){
            bounds.width = w;    
            el.style.width = styleW + "px";
        }

        if(Class.isNumber(styleH) && styleH >= 0){
            bounds.height= h;
            el.style.height = styleH + "px";
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
            el.style.top =  y + "px";
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
            MBP.BPW= MBP.BW + MBP.PW;
            MBP.BPH= MBP.BH + MBP.PH;
        }
        
        bounds.width = outer.width;
        bounds.height= outer.height;

        bounds.absX  = outer.left;
        bounds.absY  = outer.top;
        
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
     *   hscroll: true/false
     *   vscroll: true/false
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
        
        if(typeof styles !== "object"){
            return "";
        }
        
        var buf = new js.lang.StringBuffer(), p, v;
        for(p in styles){
            v = styles[p];
            p = this.hyphenName(p);
            
            buf.append(p).append(":").append(v).append(";");
        }
        
        return buf.toString();
    };
    
    /**
     * Calculate the text size of the specified span node.
     * 
     * @param span: A "SPAN" DOM node.
     */
    thi$.getTextSize = function(span){
        if(!span || span.tagName !== "SPAN"){
            return {width: 0, height: 0};
        }
        
        var styles = {
            display: "inline", 
            "white-space": "nowrap",
            position: "absolute",
            left: "-10000px",
            top: "-10000px"
        };
        styles = J$VM.System.objectCopy(styles, 
                                        this.getStyles(span, textSps) || {});
        
        var textNode = this.createElement("SPAN");
        textNode.innerHTML = span.innerHTML;
        textNode.style.cssText = this.toCssText(styles);
        this.appendTo(textNode, document.body);
        
        var s = this.outerSize(textNode);
        this.remove(textNode, true);
        textNode = null;
        
        return s;
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
 * @File: MemoryStorage.js
 * @Create: 2011/11/04 03:57:36
 * @Author: pmf.sei@gmail.com
 */

$package("js.util");

/**
 * When window has no sessionStorage or localStorage, we use a
 * memory storage instead.
 */
$import("js.util.HashMap");

js.util.MemoryStorage = function(){

    var CLASS = js.util.MemoryStorage, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    thi$.isMemory = true;

    thi$.length = function(){
        return this.size();
    };

    thi$.key = function(index){
        return this._keys[index];
    };

    thi$.setItem = function(key, value){
        this.put(key, value);
    };
    
    thi$.getItem = function(key){
        return this.get(key);
    };
    
    thi$.removeItem = function(key){
        return this.remove(key);
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
 * @File: Storage.js
 * @Create: 2011-10-28
 * @Author: pmf.sei@gmail.com
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
        value = value ? value : local.getItem(key);
        value = value ? value : session.getItem(key);
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
 * Source code availability: http://jzvm.googlecode.com
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
    
    thi$._init = function(k, v, e){
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
 * Source code availability: http://jzvm.googlecode.com
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
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
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
	userInfoRegExp = /^(?:([^:@\s]+))(:(?:[^:@\s]+))?@/i,
	hostRegExp = /^((?:[^;:@=\/\?\.\s]+\.)+[A-Za-z0-9\-]{1,}|localhost)/i,

	// For matching cusotm host names mapping ips in OS' hosts file.
	// Such as "http://xx:8888", "xx" mapping "127.0.0.1".
	regNameRegExp = /^([^;:@=\/\?\#\.\s]+)/i,
	noSchemeRegNameRegExp = /^([^;:@=\/\?\#\.\s]+)(?=:\d+)/i,
	
	portRegExp = /^:(\d+)/,
	pathRegExp = /^\/[^?#]*/i,
	queryRegExp = /^\?([^#]*)/i,
	fragmentRegExp = /^#(.+)/i,
	
	QueryRegExp = new RegExp("(?:^|&)([^&=]*)=?([^&]*)","g"),
	
	regExps = [schemeRegExp, userInfoRegExp, hostRegExp, portRegExp, 
			   pathRegExp, queryRegExp, fragmentRegExp],
	REGX_PATH = /(.*[/|\\])(.*)/;
	
	var _parseURI = function(uri){
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
		var curUri = J$VM.System.getProperty("uri") || new js.net.URI(document.URL),
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
	
	thi$._init = function(){
		if(arguments.length === 1){
			this.scheme = this.userInfo = this.user = this.password 
				= this.host = this.port = this.path = this.query 
				= this.fragment = undefined;
			
			var uri = decodeURI(arguments[0]);
			_parseURI.call(this, uri);
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
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.net");

js.net.XHRPROVIDER = {

    progid: undefined,

    progids:["MSXML2.XMLHTTP.6.0",
             "MSXML2.XMLHTTP",
             "Microsoft.XMLHTTP"]
};

js.net.HttpURLConnection = function (isAsync){

    var Class = js.lang.Class, Event = js.util.Event;

    var CLASS = js.net.HttpURLConnection, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init(isAsync != undefined ? isAsync : true);
        return;
    }
    CLASS.__defined__ = true;

    thi$.isAsync = function(){
        return this._async || false;
    };

    thi$.setAsync = function(isAsync){
        this._async = isAsync || false;
        
        if(this._async){
            this.declareEvent(Event.SYS_EVT_SUCCESS);
            this.declareEvent(Event.SYS_EVT_HTTPERR);
        }
    };

    thi$.isNoCache = function(){
        return this._nocache || false;
    };

    thi$.setNoCache = function(isNoCache){
        this._nocache = isNoCache || false; 
        var date;
        if(this._nocache){
            date = "Thu, 01-Jan-1970 00:00:00 GMT"; 
        }else{
            date = "Fri, 01-Jan-2900 00:00:00 GMT";
        }
        this.setRequestHeader("If-Modified-Since", date);        
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

    thi$.getResponseHeader = function(key){
        return this._xhr.getResponseHeader(key);
    };

    thi$.getAllResponseHeaders = function(){
        return this._xhr.getAllResponseHeaders();
    };

    thi$.responseText = function(){
        return this._xhr.responseText;
    };

    thi$.responseXML = function(){
    	//For IBM WebSeal Issue
        return this._xhr.responseXML.replace(/<script[^>]*?>[\s\S]*?document.cookie[\s\S]*?<\/script>/, '');
    };

    thi$.responseJSON = function(){
    	//For IBM WebSeal Issue
        return JSON.parse(this._xhr.responseText.replace(/<script[^>]*?>[\s\S]*?document.cookie[\s\S]*?<\/script>/, ''));
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
    thi$.open = function(method, url, params){
        var _url, query = _makeQueryString.$bind(this)(params),
        xhr = this._xhr, async = this.isAsync();

        switch(method.toUpperCase()){
        case "GET":
            _url = (query != null) ? [url, "?", query].join("") : url;
            query = null;
            break;
        case "POST":
            _url = url;
            this.setRequestHeader("Content-Type",
                                  "application/x-www-form-urlencoded");
            break;
        default:
            // TOOD in the furture ?
            break;
        }
        
        if(async){
            xhr.onreadystatechange = function(){
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
        _setRequestHeader.$bind(this)(xhr, this._headers);
        xhr.send(query);

    };
    
    /**
     * Close this connection
     */
    thi$.close = function(){
        _stopTimeout.call(this);
        try{
            this._xhr.onreadystatechange = null;            
        } catch (x) {

        }
        this._xhr = null;
        this._headers = null;
    };
    
    var _checkTimeout = function(){
        if(this._xhr){
            this._xhr.abort();
            this.fireEvent(new Event(Event.SYS_EVT_TIMEOUT, this, this));
        }
    };

    var _stopTimeout = function(){
        _checkTimeout.$clearTimer(this.timer);
        delete this.timer;
    };

    var _makeQueryString = function(params){
        if(typeof params != "object") return null;
        
        var buf = new js.lang.StringBuffer();
        for(var p in params){
            buf.append(p).append("=").append(params[p]).append("&");
        }

        return buf.toString();
    };
    
    var _setRequestHeader = function(_xhr, map){
        if(map){
            for(var p in map){
                _xhr.setRequestHeader(p, map[p]);
            }
        }
    };

    thi$._init = function(isAsync){
        if(XMLHttpRequest != undefined){
            this._xhr = new XMLHttpRequest();
        }else{
            // IE
            var $ = js.net.XHRPROVIDER;
            if($.progid != undefined){
                this._xhr = new ActiveXObject($.progid);
            }else{
                for(var i=0; i<$.progids.length; i++){
                    $.progid = $.progids[i];
                    try{
                        this._xhr = new ActiveXObject($.progid);
                        break;
                    } catch (x) {
                        // Nothing to do
                    }
                }// For
            }// progid
        }// XMLHttpRequest

        this.setAsync(isAsync);
        this.setNoCache(J$VM.System.getProperty("j$vm_ajax_nocache", true));
        this.setTimeout(J$VM.System.getProperty("j$vm_ajax_timeout", 6000000));
        this.declareEvent(Event.SYS_EVT_TIMEOUT);
    };

    this._init(isAsync != undefined ? isAsync : true);

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
 * Source code availability: http://jzvm.googlecode.com
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
 * Source code availability: http://jzvm.googlecode.com
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
    };
    
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
        return false;
    };

    thi$._init = function(e){
        var _e = this._event = e || window.event,
        events = J$VM.events = J$VM.events || [];
        events.unshift(_e);
        if(events.length > 2){
            events.pop();
        }
        
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

        this.clientX = !isNaN(_e.pageX) ? _e.pageX 
            : (_e.clientX + document.documentElement.scrollLeft - document.body.clientLeft);
        this.clientY = !isNaN(_e.pageY) ? _e.pageY 
            : (_e.clientY + document.documentElement.scrollTop - document.body.clientTop);
        
        this.offsetX = ff ? _e.layerX : _e.offsetX;
        this.offsetY = ff ? _e.layerY : _e.offsetY;
        
        this.srcElement = ie ? _e.srcElement : _e.target;

        var type = this.getType();
        this.fromElement= ie ? _e.fromElement : 
            ((type == "mouseover")? _e.relatedTarget : 
             (type == "mouseout"  ? _e.target : undefined));
        this.toElement  = ie ? _e.toElement :
            ((type == "mouseout") ? _e.relatedTarget :
             (type == "mouseover" ? _e.target : undefined));

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
 * Source code availability: http://jzvm.googlecode.com
 */

js.lang.Runtime = function(){

	var CLASS = js.lang.Runtime, thi$ = CLASS.prototype;
	if(CLASS.__defined__) return;
	CLASS.__defined__ = true;

	var Class = js.lang.Class, Event = js.util.Event;
	
	thi$.getProperty = function(key, defValue){
		return this._local[key] || defValue;
	};
	
	thi$.setProperty = function(key, value){
		this._local[key] = value;
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

	thi$.dateSymbols = function(symbols){
		if(Class.isObject(symbols)){
			this.setProperty("dateSymbols", symbols);
		}

		return this.getProperty(
			"dateSymbols", 
			Class.forName("js.text.resources."+this.getLocal()).dateSymbols);
	};
	
	thi$.numberSymbols = function(symbols){
		if(Class.isObject(symbols)){
			this.setProperty("numrSymbols", symbols);
		}

		return this.getProperty(
			"numrSymbols",
			Class.forName("js.text.resources."+this.getLocal()).numrSymbols);
	};

	/**
	 * Set i18n dictionary 
	 * 
	 * @param dict, i18n dictionary
	 */
	thi$.setDict = function(dict){
		this.setProperty("dict", (dict || {}));
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
		var dict = this.getDict();

		return dict[key] || defaultText || key;
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
		var userinfo = this.userInfo(), locale = this.locale();
		if(!locale){
			locale = this._local.locale = new js.util.Locale();
		}
		
		if(userinfo){
			locale.setLanguage(userinfo.lang);
			locale.setCountry(userinfo.country);
		}
		
		return locale;
	};
	
	thi$.initialize = function(env){
		var System = J$VM.System;
		System.objectCopy(System.getProperties(), this._local, true);
		System.objectCopy(env || {}, this._local);
		
		_initLocale.call(this);
		_loadJ$VMCSS.call(this);
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
        var buf = [], doc = document, div = doc.createElement('div'), ipt;
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
            vm.supports.reliableMarginRight = false;
        }

        vm.supports.supportCssFloat = !!div.lastChild.style.cssFloat;
        vm.supports.borderBox = !(div.offsetWidth > 100);
        vm.supports.borderEdg = !(cdiv.offsetLeft == 0);

        // Check BorderBox support of Input and Textarea
        vm.supports.iptBorderBox = !(ipt.offsetWidth > 100);
        
        // Check placeholder support of Input and Textarea
        vm.supports.placeholder = ("placeholder" in ipt); 
        
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

        _checkBrowser.call(this);
        _detectDoctype.call(this);
        _initJSVMLocale.call(this);

        var Event = js.util.Event, dom = vm.hwnd.document;
        Event.attachEvent(vm.hwnd, Event.W3C_EVT_RESIZE, 0, this, _onresize);
        Event.attachEvent(vm.hwnd, Event.W3C_EVT_MESSAGE,0, this, _onmessage);
        Event.attachEvent(dom, "keydown", 0, this, _onkeyevent);
        Event.attachEvent(dom, "keyup",   0, this, _onkeyevent);

        var proc, scope, i, len, body;;
        for(i=0, len=scopes.length; i<len; i++){
            proc = scopes[i];
            scope = vm.runtime[proc.id];
            if(scope === undefined){
                scope = vm.runtime[proc.id] = function(){
                    var clazz = js.awt.Desktop;
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

        document.body.innerHTML = "";
        if(J$VM.ie == undefined){
            document.write("<html><head></head></html>");
        }
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
                memory : js.util.Storage.getStorage("memory"),
                cookie : new js.util.CookieStorage()
            };

            vm.storage.cache = new js.util.Cache();

            vm.Factory = new js.awt.ComponentFactory(this);

            vm.exec = function(instName, fn, containerElement){
                if(typeof fn != "function") 
                    throw "The second parameter must be a function";

                return _exec.call(this,instName, fn, containerElement);

            }.$bind(this);
            
            vm.boot = function(){
                return _boot.apply(this, arguments);
            }.$bind(this);

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
 * Source code availability: http://jzvm.googlecode.com
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
        if(self.Worker){
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
        
        var path = J$VM.env["j$vm_home"]+"/classes/js/util/";

        if(self.Worker){
            this._worker = new Worker(path+"Worker.jz");
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
 * Source code availability: http://jzvm.googlecode.com
 */

/**
 * Define J$VM name-space and run-time environment
 */
(function(){
     js.lang.Object.$decorate(this);

     // Check browser type
     var ua = navigator.userAgent.toLowerCase(), s;
     var b = (s = ua.match(/msie ([\d.]+)/)) ? this.ie = s[1] :
         (s = ua.match(/firefox\/([\d.]+)/)) ? this.firefox = s[1] :
         (s = ua.match(/chrome\/([\d.]+)/)) ? this.chrome = s[1] :
         (s = ua.match(/opera.([\d.]+)/)) ? this.opera = s[1] :
         (s = ua.match(/version\/([\d.]+).*safari/)) ? this.safari = s[1] : 0;

     this.secure = /^https/i.test(location.protocol);
     
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
     this.System = new js.lang.System(env, this);

     // Global functions for Flash
     $postMessage = J$VM.MQ.post;
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
     
     this.$attachEvent = js.util.Event.attachEvent;
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


