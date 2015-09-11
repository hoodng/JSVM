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

$package("js.awt.shape");

$import("js.awt.GraphicShape");

/**
 *
 * { cx: x of center
 *   cy: y of center
 *   r: radius,
 *   ends: the number of ends, for example 3 for triangle, 5 for pentango,
 *         10 for star and so on.
 *   offset: Deg, the first point offset degree
 *   rscale: even ends radius scale to odd ends radius
 * }
 *
 */
js.awt.shape.RPolygon = function(def, Graphics2D, Renderer){

    var CLASS = js.awt.shape.RPolygon, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System,
        Graph = Class.forName("js.awt.Graphics2D"),
        Trig  = Class.forName("js.math.Trig"); 

    var _calcPoints = function(){
        var M = this.def, points = M.points = [],
            r = M.r, r0 = r * M.rscale, cx = M.cx, cy = M.cy, 
            deg = M.offset, step = 360/M.ends, p;

        for(var i=0; i<M.ends; i++){
            p = Trig.XYOfTheta(Trig.Deg2Rad(deg), 
                               (i%2 == 0 ? r : r0), cx, cy);
            points.push([1, p.x, p.y]);
            deg += step;
        }
        
        points[0][0] = 0;
    };

    thi$.getShapeInfo = function(){
        var M = this.def;
        if(this.isDirty()){
            _calcPoints.call(this);
        }

        return {
            points: M.points
        };
    };

    thi$._init = function(def, Graphics2D, Renderer){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.shape.RPolygon";
        def.type = "polygon";

        $super(this);
        
        var tmp;

        tmp = def.ends;
        tmp = Class.isNumber(tmp) ? tmp : 3;
        this.defAttr("ends", (tmp < 3 ? 3 : tmp));

        tmp = def.offset;
        this.defAttr("offset", Class.isNumber(tmp)? tmp : 90);

        tmp = def.rscale;
        this.defAttr("rscale", Class.isNumber(tmp)? tmp : 1);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.GraphicShape);

