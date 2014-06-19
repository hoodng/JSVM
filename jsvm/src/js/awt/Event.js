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

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.cancelBubble);

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

        return arguments.callee.__super__.apply(this, arguments);

    }.$override(this.cancelDefault);

    /**
     *
     */
    thi$.isPointerDown = function(){
        var type = this.getType();
        return type == "pointerdown" || "mousedown";
    };

    /**
     *
     */
    thi$.isPointerMove = function(){
        var type = this.getType();
        return type == "pointermove" || "mousemove";
    };

    /**
     *
     */
    thi$.isPointerUp = function(){
        var type = this.getType();
        return type == "pointerup" || "mouseup";
    };

    /**
     *
     */
    thi$.isPointerOver = function(){
        var type = this.getType();
        return type == "pointerover" || "mouseover";
    };

    /**
     *
     */
    thi$.isPointerOut = function(){
        var type = this.getType();
        return type == "pointerout" || "mouseout";
    };

    /**
     *
     */
    thi$.isPointerEnter = function(){
        var type = this.getType();
        return type == "pointerenter" || "mouseenter";
    };

    /**
     *
     */
    thi$.isPointerLeave = function(){
        var type = this.getType();
        return type == "pointerleave" || "mouseleave";
    };

    /**
     *
     */
    thi$.isPointerCancel = function(){
        var type = this.getType();
        return type == "pointercancel";
    };


    thi$._init = function(e){
        var _e = this._event = e || window.event;

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

        this.pageX = _e.pageX;
        this.pageY = _e.pageY;

        this.clientX = !isNaN(_e.pageX) ? _e.pageX
            : (_e.clientX + document.documentElement.scrollLeft - document.body.clientLeft);
        this.clientY = !isNaN(_e.pageY) ? _e.pageY
            : (_e.clientY + document.documentElement.scrollTop - document.body.clientTop);

        this.offsetX = ff ? _e.layerX : _e.offsetX;
        this.offsetY = ff ? _e.layerY : _e.offsetY;

        this.srcElement = ie ? _e.srcElement : _e.target;

        this.fromElement= ie ? _e.fromElement :
            (this.isPointerOver() ? _e.relatedTarget :
             (this.isPointerOut()  ? _e.target : undefined));
        this.toElement  = ie ? _e.toElement :
            (this.isPointerOut() ? _e.relatedTarget :
             (this.isPointerOver() ? _e.target : undefined));

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.util.Event);
