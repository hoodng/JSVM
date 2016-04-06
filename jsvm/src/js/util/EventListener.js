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

js.util.EventListener = function (listener, handler){

    var CLASS = js.util.EventListener, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init(listener, handler);
        return;
    }
    CLASS.__defined__ = true;
    
    thi$.handleEvent = function(){
        if(typeof this.handler === "function" &&
           this.listener && this.listener.destroied != true){
            this.handler.apply(this.listener, arguments);
        }
    };

    thi$.equals = function(o){
        return o ?
            (o.listener === this.listener &&
             o.handler === this.handler) : false;
    };
    
    thi$._init = function(l, h){
        if(typeof l == "object"){
            this.listener = l;
            this.handler  = h;
            
            if(typeof l.uuid != "function"){
                var o = this.listener;

                o.hashCode = function(){
                    if(!this._hash){
                        this._hash = Math.random();
                    }
                    return this._hash;
                };

                o.uuid = function(id){
                    if(arguments.length > 0){
                        this._uuid = id;         
                    }else if(!this._uuid){
                        this._uuid = Math.uuid(this.hashCode());
                    }

                    return this._uuid;
                };
            }

            this.uuid(l.uuid());
        }
    };
    
    this._init(listener, handler);
    
}.$extend(js.lang.Object);

