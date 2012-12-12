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

js.lang.Object = function (o){
    
    var CLASS = js.lang.Object, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        // TODO:
        return;
    }
    CLASS.__defined__ = true;

    thi$.hashCode = function(){
        if(this._hash == undefined){
            this._hash = js.lang.Math.random(new Date().getTime());
        }
        
        return this._hash;
    };
    
    thi$.equals = function(o){
        return o === this;
    };

    thi$.toString = function(){
        return (typeof this) + "@" + this.uuid();
    };
    
    thi$.uuid = function(id){
        if(id !== undefined){
            this._uuid = id;
        }else if(this._uuid == undefined){
            this._uuid = js.lang.Math.uuid(this.hashCode());
        }

        return this._uuid;
    };

    thi$.instanceOf = function(clazz){
        var imps = this.__imps__;
        if(imps){
            for(var i=0, len=imps.length; i<len; i++){
                if(clazz === imps[i]){
                    return true;
                }
            }
        }

        return this instanceof clazz;
    };

    thi$.destroy = function(){
        J$VM.MQ.remove(this.uuid());
    };

}.$extend(Object);


