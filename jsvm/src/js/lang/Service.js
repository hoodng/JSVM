/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

js.lang.Service = function(def, Runtime){

    var CLASS = js.lang.Service, thi$ = CLASS.prototype;
    if(CLASS.__defined__) {
		this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event;


    thi$.destroy = function(){
        $super(this);
    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(def === undefined) return;

        this.uuid("service");
        def.__contextid__ = "runtime";
        
        $super(this);
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.util.EventTarget);




