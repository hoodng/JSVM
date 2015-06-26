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

$package("js.awt");

js.awt.Frame = function (){

    var CLASS = js.awt.Frame, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM;

    thi$.getWindow = function(){
        if(this.instanceOf(js.awt.IFrame)){
            try{
                return this.view.contentWindow;
            } catch (x) {
                return null;
            }
        }
        return null;
    };

    thi$.getDocument = function(){
        var win = this.getWindow();
        try{
            return win ? win.document : null;
        } catch (x) {

        }
        return null;
    };

    thi$.getBody = function(){
        var doc = this.getDocument();
        return doc ? doc.body : null;
    };

    thi$.setSrc = function(url){
        this.def.src = url;
    };

    thi$.getSrc = function(){
        return this.def.src;
    };
    
    thi$.setContent = function(html, href){
        if(this.instanceOf(js.awt.IFrame)){
            var doc = this.getDocument();
            if(doc){
                doc.open();
                doc.write(html);
                doc.close();
            }
        }else{
        }
    };
    
    var _load = function(url){
        var http = J$VM.XHRPool.getXHR(true);

        http.onsuccess = function(e){
            var xhr = e.getData();
            this.setContent(xhr.responseText());
            http.close();
            return;
        }.$bind(this);

        http.onhttperr = function(e){
            var xhr = e.getData();
            // TODO: handle error
            http.close();
            return;
        }.$bind(this);

        http.open("GET", url);
    };

    thi$.load = function(){
        if(this.instanceOf(js.awt.IFrame)){
            this.view.src = this.def.src;
        }else{
            _load.call(this, this.def.src);
        }
    };
    
    /**
     * Notes: subclass should implements this method
     * 
     */
    thi$.refresh = function(){
        
    };
    
};

js.awt.ScriptScope = function(host){

    var CLASS = js.awt.ScriptScope, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ;
    
    thi$.exec = function(script){
        var host = this.host;

        (function(s){
            eval(s);
        }).$delay(this, 1, script);
    };
    
    thi$.clear = function(){
        for(var p in this){
            if(this.hasOwnProperty(p)) {
                delete this.p;
            }
        }
    };

    thi$._init = function(host){
        if(host == undefined) return;

        this.host = host;        
    };

    this._init.apply(this, arguments);
    
}.$extend(js.util.EventTarget);

