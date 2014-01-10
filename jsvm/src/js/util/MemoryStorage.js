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
 * Author: Pan mingfa
 * Contact: pmf.sei@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.util");

/**
 * 
 */
$import("js.util.HashMap");

js.util.MemoryStorage = function(capacity){

    var CLASS = js.util.MemoryStorage, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class;

    thi$.isMemory = true;

    thi$.length = function(){
        return this.size();
    };

    thi$.key = function(index){
        return this._keys[index];
    };

    thi$.setItem = function(key, value){
        if(this.size() >= this.capacity){
            _reduce.call(this);
        }

        this.put(key, {key:key, count:1, data:value});
    };
    
    thi$.getItem = function(key){
        var ele = this.get(key), ret;
        if(ele){
            ele.count++;
            ret = ele.data;
        }
        return ret;
    };
    
    thi$.removeItem = function(key){
        return this.remove(key);
    };

    var _reduce = function(){
        var array = this.values().sort(
            function(a, b){return a.count - b.count;}
        ), len = Math.floor(this.capacity/10), tmp;

        len = len < 1 ? 1 : len;
        while(len > 0){
            tmp = array.shift();
            this.removeItem(tmp.key);
            len--;
        }
    };
    
    thi$._init = function(capacity){
        arguments.callee.__super__.call(this);
        this.capacity = 
            Class.isNumber(capacity) ? capacity : 1024;
    }.$override(this._init);

    this._init.apply(this, arguments);
    
}.$extend(js.util.HashMap);

