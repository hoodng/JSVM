/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

js.lang.StringBuffer = function (s){
    
    var CLASS = js.lang.StringBuffer, thi$ = CLASS.prototype;
    if(CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    /**
     * Append a string to this buffer
     * 
     * @param s, the string need append to the buffer
     * @return this buffer instance
     */
    thi$.append = function(s){
        this._buf.push(s);
        return this;
    };
    
    /**
     * Clear the string buffer
     * 
     * @return this buffer instance
     */
    thi$.clear = function(){
        this._buf.splice(0, this._buf.length);
        return this;
    };

    /**
     * Return the string of this buffer
     */
    thi$.toString = function(){
        return this._buf.join("");
    };

    thi$._init = function(s){
        this._buf = [];
        if(s) this._buf.push(s);
    };

    this._init.apply(this, arguments);

}.$extend(js.lang.Object);


