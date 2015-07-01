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

js.lang.Runtime = function(){

    var CLASS = js.lang.Runtime, thi$ = CLASS.prototype;
    if(CLASS.__defined__) {
        this._init.apply(this, arguments);        
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event;

    thi$.registerService = function(service){
        this._service = service;
    };
    
    thi$.getService = function(){
        return this._service || new js.lang.Service({}, this);
    };

    thi$.registerDesktop = function(desktop){
        this._desktop = desktop;
    }
    
    thi$.getDesktop = function(){
        return this._desktop;
    };

    var procs = [];
    thi$.exec = function(fn, params){
        var args = Array.prototype.slice.call(arguments, 1);
        if(Class.isFunction(fn)){
            procs.push({fn: fn, args:args});
        }else if(Class.isString(fn) && Class.isFunction(self[fn])){
            procs.push({fn: self[fn], args:args});
        }
    };

    thi$._execProcs = function(){
        var proc;
        while(procs.length > 0){
            proc = procs.shift();
            (function(proc){
                proc.fn.apply(this, proc.args);                
            }).$delay(this, 0, proc);
        }
    };

    /**
     * Test if this J$VM is embedded in a iframe 
     */
    thi$.isEmbedded = function(){
        return self != self.parent;
    };

    /**
     * Test whether current J$VM has same PID with parent J$VM
     */
    thi$.isSamePID = function(){
        if(this.isEmbedded()){
            var pJ$VM = self.parent.J$VM;
            return pJ$VM && (pJ$VM.Runtime.PID() == this.PID());
        }
        return false;
    }

    thi$.getProperty = function(key, defValue){
        return J$VM.System.getProperty(key, defValue);
    };
    
    thi$.setProperty = function(key, value){
        J$VM.System.setProperty(key, value);
    };

    thi$.prefer = function(prefer){
        if(Class.isObject(prefer)){
            this.setProperty("prefer", prefer);
        }
        return this.getProperty("prefer", {});
    };

    thi$.themes = function(themes){
        if(Class.isArray(themes)){
            this.setProperty("themes", themes);
        }
        return this.getProperty("themes", ["default"]);
    };

    thi$.theme = function(theme){
        if(Class.isString(theme)){
            this.setProperty("theme", theme);
        }
        return this.getProperty("theme", "default");
    };

    var _isAbsPath = function(url){
        return url.indexOf("http") === 0;
    };
    
    thi$.imagePath = function(imagePath){
        if(Class.isString(imagePath)){
            if(!_isAbsPath(imagePath)){
                imagePath = J$VM.DOM.makeUrlPath(
                    J$VM.env.j$vm_home, imagePath);
            }
            this.setProperty("imagePath", imagePath);
        }
        
        return this.getProperty(
            "imagePath", J$VM.DOM.makeUrlPath(
                J$VM.env.j$vm_home, "../style/"+this.theme()+"/images/"));
    };

    thi$.PID = function(pid){
        if(Class.isString(pid)){
            this.setProperty("j$vm_pid", pid);
        }
        
        return this.getProperty("j$vm_pid", "");
    };

    thi$.postEntry = function(entry){
        if(Class.isString(entry)){
            if(!_isAbsPath(entry)){
                entry = J$VM.DOM.makeUrlPath(J$VM.env.j$vm_home, entry);
            }
            this.setProperty("postEntry", entry);
        }
        
        return this.getProperty("postEntry", J$VM.DOM.makeUrlPath(
            J$VM.env.j$vm_home, "../../"+this.PID()+".vt"));
    };

    thi$.getsEntry = function(entry){
        if(Class.isString(entry)){
            if(!_isAbsPath(entry)){
                entry = J$VM.DOM.makeUrlPath(J$VM.env.j$vm_home, entry);
            }
            this.setProperty("getsEntry", entry);
        }

        return this.getProperty("getsEntry", J$VM.DOM.makeUrlPath(
            J$VM.env.j$vm_home, "../../vt"));
    };

    thi$.initialize = function(env){
        J$VM.System.getProperties().addAll(env || {});

        if(env.postEntry){
            this.postEntry(env.postEntry);
        }

        if(env.getsEntry){
            this.getsEntry(env.getsEntry);
        }

        if(env.imagePath){
            this.imagePath(env.imagePath);
        }

        if(this._desktop){
            this._desktop.updateTheme(this.theme());
        }
    };
    
    thi$.destroy = function(){
        if(this._service){
            this._service.destroy();
            this._service = null;
        }

        if(this._desktop){
            this._desktop.destroy();
            this._desktop = null;
        }
        
        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);

    thi$._init = function(){
        this.uuid("runtime");
        arguments.callee.__super__.call(this, [{}, this]);
        
    }.$override(this._init);

    this._init.apply(this, arguments);
    
}.$extend(js.util.EventTarget);
