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

js.awt.Bidirectional = function(){
    
    var CLASS = js.awt.Bidirectional, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    CLASS.HORIZONTAL = 0;
    CLASS.VERTICAL   = 1;

    var Class = js.lang.Class;
    
    thi$.isHorizontal = function(){
        return this.def.direction === CLASS.HORIZONTAL;
    };

    thi$.isVertical = function(){
        return !this.isHorizontal();
    };

    thi$.getStart = function(comp){
        comp = comp || this;
        return this.isHorizontal() ? 
            comp.getX() : comp.getY();
    };

    thi$.getPStart = function(comp){
        comp = comp || this;
        return this.isHorizontal() ? 
            comp.getY() : comp.getX();
    };

    thi$.getUPosition = function(comp){
        comp = comp || this;
        var p = comp.getPosition();
        if(this.isHorizontal()){
            p.start = p.x;
            p.pstart= p.y;
        }else{
            p.start = p.y;
            p.pstart= p.x;
        }

        return p;
    };

    thi$.setUPosition = function(start, pstart, fire, comp){
        comp = comp || this;
        if(this.isHorizontal()){
            comp.setPosition(start, pstart, fire);
        }else{
            comp.setPosition(pstart, start, fire);
        }
    };

    thi$.getMeasure = function(comp){
        comp = comp || this;
        return this.isHorizontal() ? 
            comp.getWidth() : comp.getHeight();
    };

    thi$.getPMeasure = function(comp){
        comp = comp || this;
        return this.isHorizontal() ? 
            comp.getHeight() : comp.getWidth();
    };

    thi$.getUSize = function(comp){
        comp = comp || this;
        var d = comp.getSize();
        if(this.isHorizontal()){
            d.measure  = d.width;
            d.pmeasure = d.height;
        }else{
            d.measure  = d.height;
            d.pmeasure = d.width;
        }
        return d;
    };

    thi$.setUSize = function(measure, pmeasure, fire, comp){
        comp = comp || this;
        if(this.isHorizontal()){
            comp.setSize(measure, pmeasure, fire);
        }else{
            comp.setSize(pmeasure, measure, fire);
        }
    };

    thi$.getUBounds = function(comp){
        comp = comp || this;
        var b = comp.getBounds(), MBP = b.MBP;
        if(this.isHorizontal()){
            b.measure = b.width;
            b.innerMeasure = b.innerWidth;
            b.pmeasure = b.height;
            b.innerPMeasure= b.innerHeight;

            MBP.borderM0 = MBP.borderLeftWidth;
            MBP.borderM1 = MBP.borderRightWidth;

            MBP.borderPM0 = MBP.borderTopWidth;
            MBP.borderPM1 = MBP.borderBottomWidth;

            MBP.BM = MBP.BW;
            
        }else{
            b.measure = b.height;
            b.innerMeasure = b.innerHeight;
            b.pmeasure = b.width;
            b.innerPMeasure= b.innerWidth;

            MBP.borderM0 = MBP.borderTopWidth;
            MBP.borderM1 = MBP.borderBottomWidth;

            MBP.borderPM0 = MBP.borderLeftWidth;
            MBP.borderPM1 = MBP.borderRightWidth;

            MBP.BM = MBP.BH;

        }
        return b;
    };

    thi$.setUBounds = function(start, pstart, measure, pmeasure, fire, comp){
        comp = comp || this;
        if(this.isHorizontal()){
            comp.setBounds(start, pstart, measure, pmeasure, fire);
        }else{
            comp.setBounds(pstart, start, pmeasure, measure, fire);
        }
    };

    thi$.setUEndStyle = function(v, comp){
        comp = comp || this;
        if(this.isHorizontal()){
            comp.view.style.right = v+"px";
        }else{
            comp.view.style.bottom= v+"px";
        }
    };

    thi$.setUMinimumSize = function(measure, pmeasure, comp){
        comp = comp || this;
        if(this.isHorizontal()){
            comp.setMinimumSize(measure, pmeasure);
        }else{
            comp.setMinimumSize(pmeasure, measure);
        }
    };

};

