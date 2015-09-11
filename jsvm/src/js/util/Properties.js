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

js.util.Properties = function (map){

    var CLASS = js.util.Properties, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    thi$.getProperty = function(key, defaultValue){
        var tmp = this.get(key);
        return tmp == undefined ? defaultValue : tmp;
    };
    
    thi$.setProperty = function(key, value){
        this.put(key, value);
    };

    this._init.apply(this, arguments);
    
}.$extend(js.util.HashMap);
