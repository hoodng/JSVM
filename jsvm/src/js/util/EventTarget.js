/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */
$package("js.util");

$import("js.util.Observable");

js.util.EventTarget = function (def, Runtime){

    var CLASS = js.util.EventTarget, thi$ = CLASS.prototype;
    if(CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event,
        List = js.util.LinkedList,
    
        PreclusiveMouseKeyEvents = {
            mouseover: true,
            mousedown: true,
            mouseup: true,
            mouseout: true,
            mousemove: true,
            mousewheel: true,
            dommousescroll: true,            

            click: true,
            dblclick: true,

            keydown: true,
            keyup: true
        };

    var _getListeners = function(eventType){
        var hName = "on"+eventType, listeners = this[hName];

        if(!Class.isArray(listeners)){
            listeners = this[hName] = List.$decorate([]);
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
	 * Judge whether the specified event is preclusive to fire while the
	 * current event target is covered.
	 *
	 * @param {js.util.Event} e
	 */
	thi$.isPreclusiveEvent = function(e){
		var type = e.getType();
		return PreclusiveMouseKeyEvents[type.toLowerCase()];
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
	thi$.fireEvent = function(evt, bubble){
		var eType, handlers;

		if(!(evt instanceof Event)){
			throw "The evt must be an js.awt.Event object.";
		}

		eType = evt.getType();

		// If the current component is covered, it shouldn't reponse to
		// the native mouse and key events.
		if(!Class.isFunction(this.isCovered) ||
        !this.isCovered() || !this.isPreclusiveEvent(evt)){
			handlers = this["on" + eType];

			switch(Class.typeOf(handlers)){
			    case "function":
				handlers.call(this, evt);
				break;
			    case "array":
				for(var i=0, len=handlers.length; i<len; i++){
					handlers[i].call(this, evt);
				}
				break;
			    default:
				break;
			}
		}

		// Bubble event
		if(bubble === true && evt._bubble === true){
			var src = this.view || evt.srcElement, target;
			do {
				src = src ? src.parentNode : null;
				target = src ? J$VM.DOM.getComponent(src) : null;
			} while (target && target === this);

			if(target && target.fireEvent){
				target.fireEvent(evt, bubble);
			}
		}
	};

    thi$.canCapture = function(){
        var cap = this.def ? this.def.capture : false, parent;
        cap = cap || false;
        if(cap){
            parent = this.getContainer ? this.getContainer() : null;
            cap = cap && ((parent && parent.canCapture) ?
                          parent.canCapture() : false);
        }
        return cap;
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

        $super(this);

    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(!Class.isObject(def)) return;
        // TODO ?
        $super(this, def, Runtime);
    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
}.$extend(js.util.Observable);

