/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
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
        $super(this);
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

    thi$.replace = function(e, newE){
        var idx = this.indexOf(e);
        if(idx != -1){
            this.splice(idx, 1, newE);
        }
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
