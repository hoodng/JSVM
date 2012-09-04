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

js.awt.ComponentFactory = function(System){

    var CLASS = js.awt.ComponentFactory, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init();
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class;

    thi$.registerClass = function(wClass){
        var className = wClass.className;
        if(this._classes[className] == undefined){
            this._classes[className] = wClass;
        }else{
            throw new Error("The class definition "+className+" is existed.");
        }
        return className;
    };
    
    thi$.getClass = function(className, nocache){
        var _wClass = this._classes[className], wClass;
        if(_wClass == undefined) 
            throw "Can not found the wClass with name "+className;
        
        return nocache === true ? 
            _wClass : System.objectCopy(_wClass, {}, true);
    };
    
    thi$.hasClass = function(className){
        return Class.isObject(this._classes[className]);
    };

    thi$.createComponent = function(className, opitons, Runtime){
        var comp, wClass = this.getClass(className);

        wClass = System.objectCopy(opitons, wClass, true);
        comp = new (Class.forName(wClass.classType))(wClass, Runtime);

        return comp;
    };

    thi$._init = function(){
        this._classes = {};
    };

    this._init();
};

