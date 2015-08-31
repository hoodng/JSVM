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

    this.__version__ = "0.9.";
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

    var slice = Array.prototype.slice;

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

    (function(){

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
        this.$extend = function(superC){
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
        this.$implements = function(superCs){
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
        this.$decorate = function(o, replaceMap){
            if(o === undefined){
                throw new Error("Parameter 'o' must be an object");
            }

            var p, proto = this.prototype;
            if(this.__defined__ == undefined) new (this)();

            replaceMap = replaceMap || {};
            for(p in proto){
                if(proto.hasOwnProperty(p) && "__imps__" != p 
                    && (!o.hasOwnProperty(p) || replaceMap[p] == true)){
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
        this.$bind = function(thi$){
            var fn = this, args = slice.call(arguments, 1);

            return function(){
                var $args = args.slice(0);
                $args = slice.call(arguments, 0).concat($args);
                return fn.apply(thi$, $args);
            };

        };

        /**
         * @member Function.prototype
         * Bind a function to the specified scope as an event listener
         *
         * @param {Object} thi$ The runtime scope that this listener bind to.
         * @param {function} eClass The event class, by default you can use 
         * <code>js.util.Event</code>
         * @param ... Other parameters need pass to the listener
         */
        this.$listen = function(thi$, eClass){
            var fn = this, args = slice.call(arguments, 2);

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
        this.$delay = function(thi$, timeout){
            var fn = this, args = slice.call(arguments, 2);

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
        this.$clearTimer = function(timer){
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
        this.$override = function(func){
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
        this.$forEach = function(thi$, set){
            var fn = this, i, len, $args = slice.call(arguments, 2),
                hasOwnProperty = Object.prototype.hasOwnProperty;

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
                    if(!hasOwnProperty.call(set, i))
                        continue;

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
        this.$map = function(thi$, set){
            var fn = this, ret = js.lang.Class.isArray(set) ? [] :{},
                $args = slice.call(arguments, 2);

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
        this.$filter = function(thi$, set){
            var fn = this, isArray = js.lang.Class.isArray(set),
                ret = isArray ? [] : {},
                $args = slice.call(arguments, 2);

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
        this.$some = function(thi$, set){
            var fn = this, ret = false,
                $args = slice.call(arguments, 2);

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
        this.$every = function(thi$, set){
            var fn = this, ret = true,
                $args = slice.call(arguments, 2);

            (function(v, i, set){
                if(!fn.apply(thi$, $args.concat(v, i, set))){
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
         *     // If you want to delay foo one by one, then use $delayLoop instead of 
         *     // for loop as below:
         *
         *     foo.$delayLoop(this, 1000, {index:0, length:10, step:1}, ctx);
         *
         * @param {Object} thi$ The runtime scope of this function
         * @param {Number} timeout The timeout of delay, @see Function.$delay
         * @param {Object} iterator A simple object, within 3 keys index, length and step
         * @param {Object} context The context of this function
         * @param {function} callback The callback function when loop is finished
         */
        this.$delayLoop = function(thi$, timeout, iterator, context, callback){
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

        this.$async = function(thi$){
            var fn = this, args = slice.call(arguments, 1);
            Q.submit(function(){
                fn.apply(thi$, args.concat(slice.call(arguments)));
            });
        };
        
    }).call(Function.prototype);
    
    var Q = new function(){
        var curTask, scheduled;

        this.submit = function(fn){
            /*
             * state, 0: pendding, 1: doing, 2: done
             * 
             */
            var task = {state:0, fn:fn, data:null,
                        prev:null, next:null};

            if(!curTask){
                curTask = task;
            }else if(curTask.state === 1){
                task.next = curTask;
                curTask.prev = task;
                curTask = task;
                scheduled = false;
            }else{
                var preTask = curTask;

                while(preTask.next !== null){
                    preTask = preTask.next;

                    if(preTask.state === 1){
                        preTask.prev.next = task;
                        task.prev = preTask.prev;
                        task.next = preTask;
                        preTask.prev = task;
                        break;
                    }
                }
                
                if(preTask.state !== 1){
                    preTask.next = task;
                    task.prev = preTask;
                }
            }

            if(!scheduled){
                scheduled = true;
                _run.$delay(this, 0);                
            }
        };

        var _clean = function(set){
            for(var p in set){
                if(set.hasOwnProperty(p))
                    set[p] = null;
            }
        };

        var _run = function(){
            var task;
            
            switch(curTask.state){
                case 0: // "Pendding" state
                curTask.state = 1; // change to "Doing" state
                curTask.fn({data: curTask.data,
                            callback:_callback.$bind(this)});
                break;
                
                case 2: // "Done" state
                if(curTask.next){
                    task = curTask.next;
                    if(task.state === 0){
                        task.data = curTask.data;
                        task.prev = null;
                        _clean(curTask);
                        curTask = task;
                        _run.call(this);
                    }else{
                        // task.state === 1
                        // change to "Done" state directly.
                        task.state = 2;
                        task.data = curTask.data;
                        task.prev = null;
                        _clean(curTask);                        
                        curTask = task;
                        _run.call(this);
                    }
                }else{
                    scheduled = false;
                }
                break;
                
                default: // "Doing" state
                throw "Unexcept state: "+curTask.state;
                break;
            }
        };

        var _callback = function(data){
            curTask.state = 2; // change to "Done" state
            curTask.data = data;
            _run.call(this);
        };
        
    }();

    
}();
