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
