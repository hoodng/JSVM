/**
 Copyright 2007-2015, The JSVM Project.
 All rights reserved.

 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("org.jsvm");

org.jsvm.DummyConnection = function(id, data){

    var CLASS = org.jsvm.DummyConnection, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    thi$.getData = function(){
        return this;
    };

    thi$.responseJSON = function(){
        return this.data;
    };

    thi$.close = function(){
        delete this.data;
    };

    thi$.uuid = function(){
        return this.__uuid__;
    };

    thi$._init = function(id, data){
        this.__uuid__ = id;
        this.data = data;
    };

    this._init.apply(this, arguments);
};

/**
 *
 */
org.jsvm.BlockingAction = new function(){

    var Class = js.lang.Class, System = J$VM.System,
        Event = js.util.Event, Q = new js.util.HashMap(),
        Q2 = new js.util.HashMap(), running = false,
        DummyConnection = org.jsvm.DummyConnection;

    this.post = function(ticket, recv){
        if(!recv)return;
        Q.put(ticket, recv);

        if(!running){
            _schedule(500);
        }
    };

    var _schedule = function(delay){
        if(Q.size() == 0){
            running = false;
        }else{
            running = true;
            _dispatch.$delay(this, delay);
        }
    }.$bind(this);

    var _dispatch = function(){
        if(Q.size() == 0){
            running = false;
            return;
        }
        
        var http = J$VM.XHRPool.getXHR(false),
            recv = Q.values()[0], data, results, p,
            params = {
                $:['webos', 'GetPendingResultsAction',{}]
            };
        if(recv.params.j$vm_pid){
            params.j$vm_pid = recv.params.j$vm_pid;
        }
        http.open("POST", recv.entry, params);
        data = http.responseJSON();
        if(data.err == 0){
            if(data.ticket == undefined && data.obj){
                results = data.obj;
                for(p in results){
                    Q2.put(p, results[p]);
                }
            }
        }
        http.close();

        if(Q2.size() > 0){
            if(Q.size() - Q2.size() > 0){
                _dispatch.$delay(this, 500);
            }

            var tickets = Q2.keys();
            for(var i=0, len=tickets.length; i<len; i++){
                p = tickets[i];
                recv = Q.remove(p);
                if(recv){
                    data = Q2.remove(p);
                    recv.handler.$delay(
                        this,
                        0,
                        new DummyConnection(recv.uuid, data));
                }
            }
        }

        _schedule(System.getProperty("j$vm_pending", 1000));

    }.$bind(this);

    var _init = function(){
        _schedule(0);
    }.call(this);

}();
