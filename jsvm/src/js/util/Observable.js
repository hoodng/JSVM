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

js.util.Observable = function (def, Runtime){

    var CLASS = js.util.Observable, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, 
        List = js.util.LinkedList;

    thi$.addObserver = function(observer){
        var svrs = this.__observers__;

        if(observer && observer.update && !svrs.contains(observer)){
            svrs.addLast(observer);
        }
    };
    
    thi$.deleteObserver = function(observer){
        this.__observers__.remove(observer);
    };
    
    thi$.deleteObservers = function(){
        this.__observers__.clear();
    };
    
    thi$.notifyObservers = function(data){
        if(!this.hasChanged()) return;

        (function(observer){
            observer.update(this, data);
        }).$forEach(this, this.__observers__);    
    };
    
    thi$.hasChanged = function(){
        return this._local.changed;
    };
    
    thi$.setChanged = function(){
        this._local.changed = true;    
    };
    
    thi$.clearChanged = function(){
        this._local.changed = false;
    };

    thi$.Runtime = function(){
        return this._local.Runtime;
    };

    thi$.destroy = function(){
        this.__observers__ = null;
        this._local = null;

        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(def === undefined) return;

        this.__observers__ = List.$decorate([]);
        var U = this._local = this._local || {};
        U.Runtime = Runtime;
        U.changed = false;
        
        // Cache current object
        // @link js.lang.Object#setContextID
        this.setContextID(def["__contextid__"]);
    };

    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);


