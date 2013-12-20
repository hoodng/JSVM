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

js.util.LinkedList = function (array){

    var CLASS = js.util.LinkedList, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init(array);
        return;
    }
    CLASS.__defined__ = true;

    thi$.getFirst = function(){
        if(this.length == 0)
            throw new Error("NoSuchElementException");

        return this[0];
    };

    thi$.getLast = function(){
        if(this.length == 0)
            throw new Error("NoSuchElementException");
        
        return this[this.length-1];
    };

    thi$.addFirst = function(e){
        this.add(0, e);
    };

    thi$.push = function(e){
        arguments.callee.__super__.apply(this, arguments);
        return this;
    }.$override(this.push);


    thi$.addLast = function(e){
        this.push(e);
    };

    thi$.removeFirst = function(){
        return this.shift();
    };

    thi$.removeLast = function(){
        return this.pop();  
    };

    thi$.add = function(index, e){
        this.splice(index, 0, e);
    };

    thi$.set = function(index, e){
        var oldVal = this[index];
        this[index] = e;
        return oldVal;
    };

    thi$.get = function(index){
        return this[index];
    };

    thi$.remove0 = function(index){
        var e = this.get(index);
        this.splice(index, 1);
        return e;
    };

    thi$.remove = function(e){
        var idx = this.indexOf(e);
        return (idx != -1) ? this.remove0(idx) : null;
    };

    thi$.indexOf = function(e){
        for(var i=0, len=this.length; i<len; i++){
            var _e = this[i];
            if(e instanceof js.lang.Object && 
               _e instanceof js.lang.Object){
                if(_e.equals(e)) return i;
            }else{
                if(_e === e){
                    return i;
                }
            }
        }
        return -1;
    };

    thi$.contains = function(e){
        return this.indexOf(e) != -1;
    };

    thi$.clear = function(){
        this.splice(0, this.length);
        return this;
    };

    thi$._init = function(array){
        if(array && js.lang.Class.isArray(array))
            this.addLast.$forEach(this, array);
    };

    this._init(array);

}.$extend(Array);

js.util.LinkedList.newInstance = function(array){
    var o = js.lang.Class.isArray(array) ? array : [];
    return js.util.LinkedList.$decorate(o);
};
