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

