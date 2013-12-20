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

js.awt.ZOrderManager = function(){

    var CLASS = js.awt.ZOrderManager, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    thi$.isZOrder = function(){
        return this.def.zorder || false;
    };
    
    thi$.setZOrder = function(b){
        this.def.zorder = b || false;
    };

    /**
     * Moves the component up, or forward, one position in the order
     * 
     * @param comp, the component
     */
    thi$.bringCompForward = function(comp, fire){
        var stack = this.def.items, comps = _allComps.call(this), compN;
        for(var i=0, len =comps.length; i<len && len > 2; i++){
            if(comp === comps[i]){
                compN = comps[i+1];
                if(compN != undefined &&  
                   ((!comp.isAlwaysOnTop() && !compN.isAlwaysOnTop()) || 
                    (comp.isAlwaysOnTop() && compN.isAlwaysOnTop()))){
                    var b = stack.splice(i, 1)[0];
                    stack.splice(i+1, 0, b);
                    this.zOrderAdjust(fire);
                    return;
                }
            }// End if (comp === comps[i])
        }
    };
    
    /**
     * Moves the component to the first position in the order
     */
    thi$.bringCompToFront = function(comp, fire){
        var stack = this.def.items,
        b = _findComp.call(this, comp, stack);
        if(comp.isAlwaysOnTop()){
            stack.push(b);
        }else{
            // Find the first not always on top, then insert it into
            var comps = _allComps.call(this);
            if(comps.length == 0){
                stack.push(b);                
            }else{
                for(var i=comps.length-1; i>=0; i--){
                    if(!comps[i].isAlwaysOnTop()){
                        stack.splice(i+1, 0, b);
                        break;
                    }else if(i == 0){
                        stack.unshift(b);
                    }
                }
            }
        }
        
        this.zOrderAdjust(fire);
    };
    
    /**
     * Moves the component down, or back, one position in the order
     */
    thi$.sendCompBackward = function(comp, fire){
        var stack = this.def.items, comps = _allComps.call(this), compN;
        for(var len =comps.length, i=len-1; i >=0 && len > 2; i--){
            if(comp === comps[i]){
                compN = comps[i-1];
                if(compN != undefined &&  
                   ((!comp.isAlwaysOnTop() && !compN.isAlwaysOnTop()) || 
                    (comp.isAlwaysOnTop() && compN.isAlwaysOnTop()))){
                    var b = stack.splice(i, 1)[0];
                    stack.splice(i-1, 0, b);
                    this.zOrderAdjust(fire);
                    return;
                }
            }// End if (comp === comps[i])
        }
    };
    
    /**
     * Moves the component to the last position in the order
     */
    thi$.sendCompToBack = function(comp, fire){
        var stack = this.def.items,
        b = _findComp.call(this, comp, stack);
        
        if(!comp.isAlwaysOnTop()){
            stack.unshift(b);
        }else{
            // Find the first not always on top, then insert it into
            var comps = _allComps.call(this);
            for(var i=comps.length-1; i>=0; i--){
                if(!comps[i].isAlwaysOnTop()){
                    stack.splice(i+1, 0, b);
                    break;
                }
            }
        }
        
        this.zOrderAdjust(fire);
        
    };
    
    /**
     * Set component always on top
     * 
     * @param comp
     * @param alwaysOnTop, boolean
     */
    thi$.setCompAlwaysOnTop = function(comp, alwaysOnTop, fire){
        if(comp.isAlwaysOnTop() === alwaysOnTop) return;
        
        if(alwaysOnTop){
            comp.def.alwaysOnTop = true;
            this.bringCompToFront(comp, fire);
        }else{
            this.sendCompToBack(comp, fire);
            comp.def.alwaysOnTop = false;
        }
        
        this.zOrderAdjust(fire);
    };
    
    /**
     * Adjust all components position in the order
     */
    thi$.zOrderAdjust = function(fire){
        if(this.isZOrder()){
            var stack = this.items(), zbase = this.def.zbase || 0;
            for(var i=stack.length-1; i>=0; i--){
                this.getElementById(stack[i]).setZ(zbase+i-stack.length, fire);
            }
        }
    };
    
    var _findComp = function(comp, comps){
        var stack = this.def.items, b;
        for(var i=0, len = comps.length; i<len && len >= 1; i++){
            if(comp.id === comps[i]){
                b = stack.splice(i, 1)[0];
                break;
            }
        }

        return b;
    };

    var _allComps = function(){
        var ret = [];
        (function(id){
             ret.push(this.getElementById(id));
         }).$forEach(this, this.def.items);

        return ret;
    };

};

