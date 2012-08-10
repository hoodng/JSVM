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

/**
 * A <em>Icon</em> is a <em>Component</em> which wraps a image. 
 * 
 * @param def:{
 *     className: string,
 *        
 *     image: string
 * }
 */
js.awt.Icon = function(def, Runtime){

    var CLASS = js.awt.Icon, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;

    thi$.setImage = function(image){
        if(Class.isString(image) && image != this.def.image){
            this.def.image = image;
            
            var src = _buildImageSrc.call(this);
            if(src) this.imageView.src = src;
        }
    };

    thi$.setToolTipText = function(s){
        arguments.callee.__super__.apply(this, arguments);
        DOM.setAttribute(this.imageView, "title", s);

    }.$override(this.setToolTipText);

    thi$.onStateChanged = function(e){
        arguments.callee.__super__.apply(this, arguments);

        this.imageView.src = _buildImageSrc.call(this);

    }.$override(this.onStateChanged);

    thi$.doLayout = function(){
        if(this.isDOMElement()){
            var box = this.getBounds();
            DOM.setBounds(this.imageView, 
                          box.paddingLeft, box.paddingTop, 
                          box.innerWidth, box.innerHeight);
        }
    }.$override(this.doLayout);

    thi$.destroy = function(){
        DOM.remove(this.imageView, true);
        delete this.imageView;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    var _buildImageSrc = function(buf){
        var image = this.def.image;
        if(!Class.isString(image) || image.length == 0){
            image = "blank.gif";
        }

        buf = buf || this.__buf__;
        buf.clear();

        buf.append(this.Runtime().imagePath());
        if(!this.isStateless()){
            buf.append(this.getState() & 0x0F).append("-");
        }
        buf.append(image);

        return buf.toString();
    };
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        var newDef = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);
        newDef.className = newDef.className || "jsvm_icon";

        var tip = newDef.tip; delete newDef.tip;
        System.objectCopy(newDef, def, true, true);
        arguments.callee.__super__.apply(this, arguments);
        
        var image = this.imageView = DOM.createElement("IMG"),
        buf = this.__buf__.clear();
        image.className = buf.append(this.def.className)
            .append("_img");
        image.style.cssText = "position:absolute;margin:0px;";
        var src = _buildImageSrc.call(this, buf);
        if(src) image.src = src;

        DOM.appendTo(image, this.view);


        if(Class.isString(tip) && tip.length > 0){
            this.setToolTipText(tip);
        }

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Component);

js.awt.Icon.DEFAULTDEF = function(){
    return{
        classType: "js.awt.Icon",

        rigid_w: true,
        rigid_h: true,
        align_x: 0.5,
        align_x: 0.5
    };
};

