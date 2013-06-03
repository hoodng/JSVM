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
 * Source code availability: http://github.com/jsvm
 */

$package("js.awt");

/**
 * 
 */
js.awt.Drawable = function(){

    var CLASS = js.awt.Drawable, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;

    var _checkEnv = function(){
        this._local = this._local || {};
    };
    
    thi$.isDirty = function(){
        _checkEnv.call(this);

        return this._local.dirty || false;
    };

    thi$.setDirty = function(dirty){
        _checkEnv.call(this);
        
        this._local.dirty = Class.isBoolean(dirty) ? dirty : true;
    };

    thi$.beforeDraw = function(paper, callback){
        this.drawing(paper, callback);
    };

    thi$.draw = function(paper, callback){
        if(!this.isVisible()){
            this.invisibleReturn(paper,callback);
        }else if(!this.isDirty()){
            this.nondirtyReturn(paper, callback);
        }else {
            this.beforeDraw(paper, callback);
        }
    };

    thi$.drawing = function(paper, callback){
        this.afterDraw(paper, callback);
    };

    thi$.invisibleReturn = function(paper, callback){
        this.afterDraw(paper, callback);
    };

    thi$.nondirtyReturn = function(paper, callback){
        this.afterDraw(paper, callback);
    };

    thi$.afterDraw = function(paper, callback){
        this.setDirty(false);
        if(callback){
            callback(this);
        }
    };
};


