
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
    this.__version__ = "0.9.${build}";

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
        var proto = this.prototype, superC;
        proto.__imps__ = proto.__imps__ || [];
        
        for(var i=0, len=arguments.length; i<len; i++){
            superC = arguments[i];
            if(typeof superC != "function") continue;
            
            proto.__imps__.push(superC);
            superC.$decorate(proto);
        }

        return this;
    };

    Function.prototype.$decorate = function(o){
        var p, proto = this.prototype;
        if(this.__defined__ == undefined) new (this)();

        for(p in proto){
            if(proto.hasOwnProperty(p) && "constructor" != p && 
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

        fn.__timer__.push(
            setTimeout(
                function(){
                    fn.$clearTimer();
                    fn.apply(thi$, args);
                }, timeout));

        return fn.__timer__[fn.__timer__.length-1];
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

