/**

 Copyright 2010-2011, The JSVM Project.
 All rights reserved.

 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

var j$vm_home = "../../../";

var isworker = function(){
    try{return (window) ? false : true;} catch (x) {return true;}
}();

var _onmessage = function(e){
    if(isworker){
        eval(e.data);
    }else{
        var _e = e.getData();
        if(_e.source == self) return;

        eval(_e.data);
    }

    thi$.run.call(thi$);
};

var _terminate = function(){
    self.onmessage = null;
};

if(isworker){
    self.importScripts(j$vm_home+"lib/jsre-core.jz");
    self.onmessage = _onmessage;
}else{
    var E = js.util.Event;
    E.attachEvent(window, E.W3C_EVT_MESSAGE, 0, this, _onmessage);
    self.terminate = _terminate;
}

