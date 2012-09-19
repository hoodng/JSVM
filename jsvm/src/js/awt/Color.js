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
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.awt");

/**
 * For examples: var color1 = new js.awt.Color(51, 61, 71); var color2 = new
 * js.awt.Color("#333D47"); var color3 = new js.awt.Color(0x333D47);
 */
js.awt.Color = function(r, g, b, a) {
    
    var CLASS = js.awt.Color, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;

    //HSL from 0 to 240;
    CLASS.DEFAULT_MIN_LUM = 180;
    CLASS.DEFAULT_MAX_LUM = 230;

    //RGB results from 0 to 255
    CLASS.RGB2HSL = function(R, G, B) {
        var vmax, vmin, delta;

        R = R / 255; G = G / 255; B = B / 255;

        vmin = Math.min(R, G, B);
        vmax = Math.max(R, G, B);
        delta = vmax - vmin;
        
        var h, s, l, dr, dg, db;
        l = (vmax+vmin) / 2;
        
        if (0 == delta) {
            h = 0;
            s = 0;
        } else {
            if (l < 0.5) {
                s = delta / (vmax+vmin);
            } else {
                s = delta / (2-vmax-vmin);
            }

            dr = (((vmax-R)/6) + (delta/2))/delta;
            dg = (((vmax-G)/6) + (delta/2))/delta;
            db = (((vmax-B)/6) + (delta/2))/delta;

            if (R == vmax)
                h = db - dg;
            else if (G == vmax)
            h = (1.0/3.0) + dr - db;
            else if (B == vmax)
            h = (2.0/3.0) + dg - dr;

            if (h < 0)
                h += 1;
            if (h > 1)
                h -= 1;
        }   
        
        h = Math.round(h*240);
        s = Math.round(s*240);
        l = Math.round(l*240);
        
        return {H: h, S: s, L: l};
    };

    CLASS.HSL2RGB = function(H, S, L) {
        H = H / 240; S = S / 240; L = L / 240;
        
        var r, g, b, temp1, temp2;
        if (S == 0) {
            r = L * 255;    //RGB results from 0 to 255
            g = L * 255;
            b = L * 255;
        } else {
            if (L < 0.5){
                temp2 = L * (1 + S);
            } else {
                temp2 = (L + S) - (S * L); 
            }
            
            temp1 = 2 * L - temp2;
            
            r = 255 * _Hue2RGB(temp1, temp2, H + (1 / 3)); 
            g = 255 * _Hue2RGB(temp1, temp2, H); 
            b = 255 * _Hue2RGB(temp1, temp2, H - (1 / 3));
        }
        
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
        
        return {R: r, G: g, B: b};
    };

    var _Hue2RGB = function(v1, v2, vH) {
        if (vH < 0) vH += 1;

        if (vH > 1) vH -= 1;
        
        if ((6 * vH) < 1) 
            return v1 + (v2 - v1) * 6 * vH; 
        if ((2 * vH) < 1) 
            return v2; 
        if ((3 * vH) < 2) 
            return v1 + (v2 - v1) * ((2 / 3) - vH) * 6; 
        
        return v1;
    };

    CLASS.parseColorString = function(s){
        var v = 0xFF000000;
        if (s.indexOf("#") == 0) {
            v = parseInt(s.substring(1), 16);
        }else if(s.toLowerCase() == "transparent" || s.indexOf("rgba") == 0){
            v = 0x00FF << 24;        
        }else if(s.indexOf("rgb") == 0){
            s = s.substring(s.indexOf("(")+1, s.indexOf(")"));
            var arr = s.split(","),
            r = parseInt(arr[0]),
            g = parseInt(arr[1]),
            b = parseInt(arr[2]),
            a = parseInt(arr[3]) || 0;

            v = _makeValue(r,g,b,a);
        }

        return v;
    };

    var _makeValue = function(r,g,b,a){
        a = Class.isNumber(a) ? a : 0x00;

        return ((a & 0x00FF) << 24) | 
            ((r & 0x00FF) << 16) | 
            ((g & 0x00FF) << 8)  | 
            ((b & 0x00FF) << 0);
    };

    thi$.setRGBA = function(r, g, b, a) {
        this.value = _makeValue(r,g,b,a);
    };

    thi$.getRGB = function() {
        return this.value;
    };

    thi$.R = function() {
        return (this.value >> 16) & 0x00FF;
    };

    thi$.G = function() {
        return (this.value >> 8) & 0x00FF;
    };

    thi$.B = function() {
        return (this.value >> 0) & 0x00FF;
    };

    thi$.A = function() {
        return (this.value >> 24) & 0x00FF;
    };
    
    thi$.getHSL = function() {
        return CLASS.RGB2HSL(this.R(), this.G(), this.B());
    };

    thi$.toString = function() {
        if (this.A() != 0) {
            return "Transparent";
        } else {
            var temp = this.value & 0x00FFFFFF,
            s = "00000" + temp.toString(16);
            return "#" + s.substring(s.length - 6);
        }
    };

    thi$._init = function() {
        var s;
        switch (arguments.length) {
        case 1 :
            s = arguments[0];
            if (Class.isNumber(s)) {
                this.value = s;
            } else if (Class.isString(s)) {
                s = s.trim();
                this.value = CLASS.parseColorString(s);
            } else {
                this.value = 0xFF000000;
            }
            break;
        case 3 :
        case 4 :
            this.setRGBA(arguments[0], arguments[1], arguments[2], arguments[3]);
            break;
        default :
            this.value = 0xFF000000;
        }
    };

    this._init.apply(this,arguments);

};

