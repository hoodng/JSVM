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

(function(){
    var $ = js.util.Event;

    $.FLAG = {
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

    var _touchRelevant = function(dom, type){
        return J$VM.DOM.getAttribute(dom, "touchcapture") === "true" &&
            (type.startsWith("mouse") || type.endsWith("click"));
    }

    var _makeMouseEvent = function(type, touch){
        var mouseEv = document.createEvent("MouseEvent");
        mouseEv.initMouseEvent(type, true, true, window, 1,
                               touch.screenX, touch.screenY,
                               touch.clientX, touch.clientY,
                               false, false, false, false, 0, null);
        return mouseEv;
    }

    var _touch2mouse = function(e){
        e.cancelBubble();

        var e0 = e._event, touch = e0.changedTouches[0],
            target = touch.target, evts = [];

        switch(e0.type){
            case "touchstart":
            evts.push(_makeMouseEvent("mouseover", touch));
            evts.push(_makeMouseEvent("mousedown", touch));
            break;
            case "touchend":
            evts.push(_makeMouseEvent("mouseup", touch));
            evts.push(_makeMouseEvent("mouseout", touch));
            evts.push(_makeMouseEvent("click", touch));
            break;
            case "touchmove":
            evts.push(_makeMouseEvent("mousmove", touch));
            break;
            default:
            break;
        }

        while(evts.length > 0){
            target.dispatchEvent.$delay(target, 0, evts.shift());
        }

        e.cancelDefault();
    };

    var _interceptTouch = function(dom, type, bind){
        if(J$VM.supports.touchEnabled != true) return;

        var ttype;

        switch(type){
            case "mousedown":
            case "mouseover":
            case "click":
            case "dblclick":
            ttype = "touchstart";
            break;
            case "mouseout":
            case "mouseup":
            case "click":
            case "dblclick":
            ttype = "touchend";
            break;
            case "mousemove":
            case "mousewheel":
            ttype = "touchmove";
            break;
        }

        if(bind === true){
            $.attachEvent(dom, ttype, 0, $, _touch2mouse);
        }else{
            $.detachEvent(dom, ttype, 0, $, _touch2mouse);
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
    $.attachEvent = function(dom, eventType, flag, listener, handler){
        var fn, args = Array.prototype.slice.call(arguments, 5),
            check = $.FLAG.check(flag),
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
                if(_touchRelevant(dom, eventType)){
                    _interceptTouch(dom, eventType, true);
                }
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
    $.detachEvent = function(dom, eventType, flag, listener, handler){
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
                        if(_touchRelevant(dom, eventType)){
                            _interceptTouch(dom, eventType, false);
                        }
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
    $.W3C_EVT_LOAD          = "load";
    $.W3C_EVT_UNLOAD        = "unload";
    $.W3C_EVT_RESIZE        = "resize";

    $.W3C_EVT_SELECTSTART   = "selectstart";
    $.W3C_EVT_CONTEXTMENU   = "contextmenu";    
    $.W3C_EVT_MESSAGE       = "message";
    $.W3C_EVT_ERROR         = "error";

    $.W3C_EVT_MOUSE_DOWN    = "mousedown";
    $.W3C_EVT_MOUSE_UP      = "mouseup";
    $.W3C_EVT_MOUSE_MOVE    = "mousemove";
    $.W3C_EVT_MOUSE_OVER    = "mouseover";
    $.W3C_EVT_MOUSE_OUT     = "mouseout";    
    $.W3C_EVT_MOUSE_CLICK   = "click";
    $.W3C_EVT_MOUSE_DBCLICK = "dbclick";
    $.W3C_EVT_MOUSE_WHEEL   = "mousewheel";

    $.W3C_EVT_KEY_DOWN      = "keydown";
    $.W3C_EVT_KEY_UP        = "keyup";

    // Event of J$VM system
    $.SYS_EVT_STATECHANGED  = "statechanged";
    $.SYS_EVT_SUCCESS       = "success";
    $.SYS_EVT_HTTPERR       = "httperr";
    $.SYS_EVT_TIMEOUT       = "timeout";
    $.SYS_EVT_MOVING        = "moving";
    $.SYS_EVT_MOVED         = "moved";
    $.SYS_EVT_RESIZING      = "resizing";
    $.SYS_EVT_RESIZED       = "resized";
    $.SYS_EVT_ZINDEXCHANGED = "zindexchanged";
    $.SYS_EVT_GEOMCHANGED   = "geomchanged";

    // Message of J$VM system
    $.SYS_MSG_CONSOLEINF    = "console_inf";
    $.SYS_MSG_CONSOLEERR    = "console_err";
    $.SYS_MSG_CONSOLELOG    = "console_log";

})();
