/**

 Copyright 2007-2015, The JSVM Project.
 All rights reserved.

 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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

    var DOM = J$VM.DOM, Event = js.util.Event;

    thi$.eventXY = function(){
        return {x: this.clientX, y: this.clientY};
    };

    thi$.offsetXY = function(){
        return {x: this.offsetX, y: this.offsetY};
    };

    thi$.cancelBubble = function(){
        var _e = this._event;

        if(!(_e instanceof js.util.Event)){
            if(_e.stopPropagation){
                _e.stopPropagation();
            }else{
                try{// Try only for the IE
                    _e.cancelBubble = true;} catch (x) {}
            }
        }
        
        $super(this);

    }.$override(this.cancelBubble);

    thi$.cancelDefault = function(){
        var _e = this._event;

        if(!(_e instanceof js.util.Event)){
            if(_e.preventDefault){
                _e.preventDefault();
            }else{
                try{// Try only for the IE
                    _e.returnValue = false;} catch (x) {}
            }
        }
        
        return $super(this);

    }.$override(this.cancelDefault);

    var isOver = function(type){
        return Event.W3C_EVT_MOUSE_OVER === type;
    };

    var isOut = function(type){
        return Event.W3C_EVT_MOUSE_OUT === type;
    };

    var keys = [
        "altKey", "ctrlKey", "shiftKey", "metaKey", "keyCode",
        "button", "pointerId", "pointerType",
        "clientX", "clientY", "offsetX", "offsetY",
        "srcElement", "fromElement", "toElement",
        "_type", "_data", "_target"
    ], keyslen = keys.length;
    
    thi$.clone = function(type, data, target){
        var evt = new (CLASS)(this), i, key;
        for(i=0; i<keyslen; i++){
            key = keys[i];
            evt[key] = this[key];
        }
        
        if(type){
            evt.setType(type);            
        }

        if(data){
            evt.setData(data);
        }

        if(target){
            evt.setEventTarget(target);
        }
        
        return evt;
    };

    thi$._init = function(e){
        var _e = this._event = e || window.event;

        if(e instanceof js.awt.Event){
            $super(this, _e.type, e._event);
            return;
        }
        
        $super(this, _e.type, _e);

        var ie = (_e.stopPropagation == undefined),
            ff = (J$VM.firefox != undefined),
            domE =  document.documentElement,
            body =  document.body;

        this.altKey   = _e.altKey   || false;
        this.ctrlKey  = _e.ctrlKey  || false;
        this.shiftKey = _e.shiftKey || false;
        this.metaKey  = _e.metaKey  || false;

        this.keyCode  = ie ? _e.keyCode : _e.which;

        // Left:1, Right:2, Middle:4
        this.button = _e.buttons != undefined ?
            _e.buttons : _e.button;

        this.pointerId = _e.pointerId || 0;
        this.pointerType = _e.pointerType ||
            (_e.type.startsWith("touch") ? "touch" : "mouse");

        this.clientX = !isNaN(_e.pageX) ? _e.pageX
                     : (_e.clientX + domE.scrollLeft - body.clientLeft);
        this.clientY = !isNaN(_e.pageY) ? _e.pageY
                     : (_e.clientY + domE.scrollTop - body.clientTop);

        this.offsetX = ff ? _e.layerX : _e.offsetX;
        this.offsetY = ff ? _e.layerY : _e.offsetY;

        this.srcElement = ie ? _e.srcElement : _e.target;

        this.fromElement= ie ? _e.fromElement :
            (isOver(_e.type) ? _e.relatedTarget :
             (isOut(_e.type)  ? _e.target : undefined));
        
        this.toElement  = ie ? _e.toElement :
            (isOut(_e.type) ? _e.relatedTarget :
             (isOver(_e.type) ? _e.target : undefined));

        this.setEventTarget(DOM.getComponent(this.srcElement));
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.util.Event);
