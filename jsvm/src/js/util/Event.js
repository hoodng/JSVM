/**
  Copyright 2008-2015, The JSVM Project. 
  All rights reserved.
  
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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
        return this._default;
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
    };

    var _makeMouseEvent = function(type, touch){
        var mouseEv = document.createEvent("MouseEvent");
        mouseEv.initMouseEvent(type, true, true, window, 1,
                               touch.screenX, touch.screenY,
                               touch.clientX, touch.clientY,
                               false, false, false, false, 0, null);
        return mouseEv;
    };

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
    $.W3C_EVT_MOUSE_DBCLICK = "dblclick";
    $.W3C_EVT_MOUSE_WHEEL   = "mousewheel";

    $.W3C_EVT_DRAGSTART     = "dragstart";
    $.W3C_EVT_DRAGEND       = "dragend";
    $.W3C_EVT_DRAGENTER     = "dragenter";
    $.W3C_EVT_DRAGLEAVE     = "dragleave";
    $.W3C_EVT_DRAGOVER      = "dragover";
    $.W3C_EVT_DROP          = "drop";        
    
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
    
    $.SYS_EVT_ELE_APPEND   = "elementappend";
    $.SYS_EVT_ELE_REMOVED  = "elementremoved";
    $.SYS_EVT_ELE_POSITION = "positionchanged";
    $.SYS_EVT_ELE_SIZE     = "sizechanged";
    $.SYS_EVT_ELE_ZINDEX   = "zindexchanged";
    $.SYS_EVT_ELE_ATTRS    = "attrschanged";
    $.SYS_EVT_ELE_STYLE    = "stylechanged";
    
    // Message of J$VM system
    $.SYS_MSG_CONSOLEINF    = "console_inf";
    $.SYS_MSG_CONSOLEERR    = "console_err";
    $.SYS_MSG_CONSOLELOG    = "console_log";

})();
