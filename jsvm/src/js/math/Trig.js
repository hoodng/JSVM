/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.math");

/**
 * 
 */
js.math.Trig = new (function(){
    
	var Class = js.lang.Class, PI180 = Math.PI / 180, 
		    sin = Math.sin, cos = Math.cos, 
		    asin = Math.asin, acos = Math.acos, atan = Math.atan, 
		    sqrt = Math.sqrt, abs = Math.abs,PI = Math.PI;

    this.Deg2Rad = function(deg){
        return deg*PI180;
    };

    this.Rad2Deg = function(rad){
        return rad/PI180;
    };

    this.XYOfTheta = function(theta, r, cx, cy){
        cx = Class.isNumber(cx) ? cx : 0;
        cy = Class.isNumber(cy) ? cy : 0;

        return {
            x: cx + cos(theta)*r,
            y: cy - sin(theta)*r
        };
    };
    /**
     * def:{
     *   o1[x,y,r]
     *   o2[x,y,r]
     * }
     */                    
    this.calTangency = function( o1, o2) {
        var o1x = o1.x,o1y = o1.y,o2x = o2.x,o2y = o2.y,o2r = o2.r,
        x0, y0, x1, y1, L, r1, r2, dx, dy, 
        sin$, cos$, dr, slope, $, MAng, MCord, M,a,b,c,d;
        r1 = o1.r;
        r2 = o2.r;
        slope = atan((o2.y - o1.y) / (o2.x - o1.x));        
        $ = -slope;                
        //Horizontal rotate
        MAng = [[cos($), -sin($)], [sin($), cos($)]], 
        MCord = [[o1.x,o2.x], [o1.y,o2.y]], 
        M = this.rotateMatrix(MAng, MCord, $);
        //Retrive Matrix
        o1.x = M.M[0][0],
        o2.x = M.M[0][1],
        o1.y = M.M[1][0],
        o2.y = M.M[1][1];
        //Caculate tangent        
        x0 = o1.x;        
        y0 = o1.y;        
        x1 = o2.x;        
        y1 = o2.y;            
        dx = abs(x1 - x0);
        dy = abs(y1 - y0);
        dr = abs(r1 - r2);
        L = sqrt(dx * dx + dy * dy);
        //Restore o1,o2 coordinate
        o1.x = o1x,
        o1.y = o1y,
        o2.x = o2x,
        o2.y = o2y;
        if (r1 < r2) {                        
            cos$ = dr / L;
            sin$ = (sqrt(L * L - (dr * dr))) / L;
            a = {
                x: x1 - r2 * cos$,
                y: y1 + r2 * sin$
            }, 
            b = {
                x: x0 - r1 * cos$,
                y: y1 + r1 * sin$
            }, 
            c = {
                x: b.x,
                y: y1 - r1 * sin$
            }, 
            d = {
                x: a.x,
                y: y0 - r2 * sin$
            };        
        } else {                        
            cos$ = abs((r1 - r2)) / L;
            sin$ = (sqrt(L * L - (dr * dr))) / L;
            a = {
                x: x0 + r1 * cos$,
                y: y0 - r1 * sin$
            }, 
            b = {
                x: x1 + r2 * cos$,
                y: y1 - r2 * sin$
            }, 
            c = {
                x: b.x,
                y: y1 + r2 * sin$
            }, 
            d = {
                x: a.x,
                y: y0 + r1 * sin$
            };
        }
        //Restore rotate    
        $ = -$, 
        MAng = [[cos($), -sin($)], [sin($), cos($)]];
        MCord = [[a.x, b.x, c.x, d.x], [a.y, b.y, c.y, d.y]];
        //Retrive Matrix
        M = this.rotateMatrix(MAng, MCord, $);
        a = {
            x: M.M[0][0],
            y: M.M[1][0]
        }, 
        b = {
            x: M.M[0][1],
            y: M.M[1][1]
        }, 
        c = {
            x: M.M[0][2],
            y: M.M[1][2]
        }, 
        d = {
            x: M.M[0][3],
            y: M.M[1][3]
        };      
        //retrun tangent points       
        return {
            A: a,
            B: b,
            C: c,
            D: d,
            slope: slope
        };
    };
    this.rotateMatrix = function(MAng, MCord, $) {
        var Matrix = Class.forName("js.math.Matrix"),         
        k = MAng.length, 
        j = MCord.length, 
        M0 = new Matrix(
        {
            M: MAng,
            m: k,
            n: j
        }, this), 
        M1 = new Matrix(
        {
            M: MCord,
            m: k,
            n: j
        }, this), 
        M2 = js.math.Matrix.multiply(M0, M1);
        return M2;
    };
})();
