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

$package("js.awt.shape");

$import("js.awt.GraphicShape");

/**
 * 
 */
js.awt.shape.Image = function(def, Graphics2D, Renderer){

    var CLASS = js.awt.shape.Image, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System, DOM = J$VM.DOM,
        Graph = Class.forName("js.awt.Graphics2D");

    thi$.getShapeInfo = function(){
        var M = this.def, U = this._local, 
            u = this.defAttr("angleUnit") || Graph.RAD,
            e = M.rotate, image = U.image || M.image, ret;

        e = Class.isNumber(e) ? Graph.deg2rad(e, u) : 0;
        
        return {
            image: image,
            sx: Class.isNumber(M.sx) ? M.sx : 0,
            sy: Class.isNumber(M.sy) ? M.sy : 0,
            sw: Class.isNumber(M.sw) ? M.sw : image.width,
            sh: Class.isNumber(M.sh) ? M.sh : image.height,

            dx: Class.isNumber(M.x) ? M.x : 0,
            dy: Class.isNumber(M.y) ? M.y : 0,
            dw: Class.isNumber(M.width) ? M.width : image.width,
            dh: Class.isNumber(M.height) ? M.height : image.height,

            rotate: e
        };
    };


    thi$.beforeDraw = function(layer, callback){
        _loadImage.call(this, layer, callback);
    }.$override(this.beforeDraw);

    var _loadImage = function(layer, callback){
        var M = this.def, imgId = M.image, image = imgId;

        if(Class.isString(imgId)){
            Class.loadImage(imgId, function(img){
                _onload.call(this, imgId, img, layer, callback);
            }.$bind(this), true, true);
            return;
        }
        _onload.call(this, imgId, image, layer, callback);
    };

    var _onload = function(imgId, image, layer, callback){
        this._local.image = image;
        this.drawing(layer, callback);
    };

    thi$._init = function(def, Graphics2D, Renderer){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.shape.Image";
        def.type = "image";

        $super(this);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.GraphicShape);

