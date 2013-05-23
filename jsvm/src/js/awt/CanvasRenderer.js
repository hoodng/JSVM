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
 * Source code availability: http://github.com/jsvm
 */

$package("js.awt");

$import("js.awt.Renderer");

/**
 * 
 */
js.awt.CanvasRenderer = function(config){

    var CLASS = js.awt.CanvasRenderer, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System,
        Color = Class.forName("js.awt.Color"), 
        Font = Class.forName("js.awt.Font"),

        cos = Math.cos, 
        sin = Math.sin, 
        pow = Math.pow, 
        sqrt = Math.sqrt,
        PI = Math.PI, 
        TWPI = 2*PI, 
        PI180 = PI/180, 

        BRUSH= ["LinearGradient", "RadialGradient", "Pattern"],

        CTXATTRS = [
            "globalAlpha",
            "globalCompositeOperation",
            "fillStyle",
            "strokeStyle",
            "lineCap",
            "lineJoin",
            "lineWidth",
            "miterLimit",
            "shadowBlur",
            "shadowColor",
            "shadowOffsetX",
            "shadowOffsetY",
            "font",
            "textAlign",
            "textBaseline"
        ], ATTRSLEN = CTXATTRS.length;

    
    thi$.setContextAttrs = function(ctx, attrs){
        var i, k, v;

        for(i=0; i<ATTRSLEN; i++){
            k= CTXATTRS[i];
            v = attrs[k];
            if(v !== undefined){
                ctx[k] = v;
            }
        }
        
        if(attrs.font === undefined){
            var FAttrs = Font.Attrs, font;
            for(i=0; i<5; i++){
                k = FAttrs[i];
                v = attrs[k];
                if(v !== undefined){
                    font = font || Font.parseFont(ctx.font);
                    font[k] = v;
                }
            }
            if(font){
                ctx.font = font.toString();
            }
        }
        
        if(attrs.strokeStyle === undefined){
            for(i=0; i<3; i++){
                k = BRUSH[i];
                v = attrs["stroke"+k];
                if(v !== undefined){
                    attrs.strokeStyle = this["create"+k](ctx, v);
                    break;
                }
            }
        };

        if(attrs.fillStyle === undefined){
            for(i=0; i<3; i++){
                k = BRUSH[i];
                v = attrs["fill"+k];
                if(v !== undefined){
                    attrs.fillStyle = this["create"+k](ctx, v);
                    break;
                }
            }
        };
        
    };

    /**
     * @param v:{
     *     x0:
     *     y0:
     *     x1:
     *     y1:
     *     colors:[[offset, color],[]...]
     * }
     */
    thi$.createLinearGradient = function(ctx, v){
        var g = ctx.createLinearGradient(v.x0, v.y0, v.x1, v.y1),
            colors = v.colors, i, len, c;
        for(i=0, len=colors.length; i<len; i++){
            c = colors[i];
            g.addColorStop(c[0], c[1]);
        }
        return g;
    };

    /**
     * @param v:{
     *     x0:
     *     y0:
     *     r0:
     *     x1:
     *     y1:
     *     r1: 
     *     colors:[[offset, color],[]...]
     * }
     */
    thi$.createRadialGradient = function(ctx, v){
        var g = ctx.createRadialGradient(v.x0, v.y0, v.r0, v.x1, v.y1, v.r1),
            colors = v.colors, i, len, c;
        for(i=0, len=colors.length; i<len; i++){
            c = colors[i];
            g.addColorStop(c[0], c[1]);
        }
        return g;
    };

    
    /**
     * @param v:{
     *     image:
     *     repeat:
     * }
     */
    thi$.createPattern = function(ctx, v){
        var g = ctx.createPattern(v.image, v.repeat);
        return g;
    };

    thi$.cutString = function(ctx, text, width, omit){

        var i=1, s = text,
            w = ctx.measureText(text).width;
        
        while(w > width && s !== "..." && s !== ""){
            s = s.substr(0, text.length-i); 
            s += omit ? "..." : "";
            w = ctx.measureText(s).width;
            i++;
        }
        return s;
    };

    thi$.measureText = function(ctx, text, font){
        var save = (font !== undefined), ret;
        
        if(save){
            ctx.save();
            ctx.font = font;
        }

        ret = {
            width:  ctx.measureText(text).width,
            height: parseInt(ctx.font.match(/\s*\d+px/)[0])
        };
        
        if(save){
            ctx.restore();
        }

        return ret;

    };

    var fix = function(v){
        return (v == 0) ? 0.0 : Math.floor(v)-0.5;
    };

    var _beforeDraw = function(ctx, shape, hit){
        ctx.save();
        
        var attrs = shape.getAttrs(), T = shape.getTransform(), 
            v, color;

        this.setContextAttrs(ctx, attrs);
        
        ctx.transform(T.m11, T.m12, T.m21, T.m22, T.dx, T.dy);
        
        if(hit === true){
            color = shape.colorKey();
            ctx.strokeStyle = ctx.fillStyle = color.rgba;

            v = attrs.hitLineWidth;
            if(v){
                ctx.lineWidth = v;
            }
        }
    };

    var _afterDraw = function(ctx, shape, hit){
        var attrs = shape.getAttrs(), v;

        if((shape.isFill() || hit === true) && 
           shape.getAttrs().close !== "open"){

            v = ctx.globalAlpha;
            if(hit !== true && attrs.fillOpacity !== undefined){
                ctx.globalAlpha = attrs.fillOpacity;
            }

            ctx.fill();

            ctx.globalAlpha = v;
        }

        if(shape.isStroke() || hit === true){

            v = ctx.globalAlpha;

            if(hit !== true && attrs.strokeOpacity !== undefined){
                ctx.globalAlpha = attrs.strokeOpacity;
            }
            ctx.stroke();

            ctx.globalAlpha = v;
        }

        ctx.restore();
    };

    
    /**
     * 
     */
    thi$.drawArc = function(ctx, shape, hit){
        var G = ctx, D = shape.getArc(), cx, cy, x0, y0;
        
        _beforeDraw.call(this, G, shape, hit);
        
        G.beginPath();

        cx = fix(D.cx);
        cy = fix(D.cy);

        switch(D.close){
        case "center":
            G.moveTo(cx, cy);
            break;
        case "short":
        case "open":
            x0 = cx + D.radius * cos(D.startAngle);
            y0 = cy - D.radius * sin(D.startAngle);
            G.moveTo(x0, y0);
            break;
        }

        G.arc(cx, cy, D.radius, -D.startAngle, -D.endAngle, true);

        switch(D.close){
        case "center":
            G.lineTo(cx, cy);
            break;
        case "short":
            G.lineTo(x0, y0);
            break;
        case "open":
            G.moveTo(x0, y0);
            break;
        }

        _afterDraw.call(this, G, shape, hit);

    };

    thi$.drawCircle = function(ctx, shape, hit){
        var G = ctx, D = shape.getCircle();
        
        _beforeDraw.call(this, G, shape, hit);
        
        G.beginPath();
        G.arc(fix(D.cx), fix(D.cy), D.radius, 0, TWPI);
        
        _afterDraw.call(this, G, shape, hit);
    };

    thi$.drawEllipse = function(ctx, shape, hit){
        var G = ctx, D = shape.getEllipe(), 
            x = D.cx, y = D.cy, a=D.ra, b=D.rb, 
            r = Math.max(a,b), ratioX = a/r, ratioY = b/r;
        
        _beforeDraw.call(this, G, shape, hit);
        
        G.beginPath();
        G.scale(ratioX, ratioY);
        G.moveTo((x+a)/ratioX, y/ratioY);
        G.arc(x/ratioX, y/ratioY, r, 0, TWPI);
        
        _afterDraw.call(this, G, shape, hit);
    };

    thi$.drawImage = function(ctx, shape, hit, callback){
        var G = ctx;

        if(hit !== true){
            shape.getImage(_drawImage.$bind(this, ctx, shape, callback));
        }else{
            _beforeDraw.call(this, G, shape, hit);

            G.beginPath();
            var M = shape.getAttrs();
            G.rect(M.x, M.y, M.width, M.height);

            _afterDraw.call(this, G, shape, hit);
        };
    };

    var _drawImage = function(data, ctx, shape, callback){
        var G = ctx, c = data, M = shape.getAttrs(),
            x = c.dx, y = c.dy, w = c.dw, h = c.dh, a, b, e = c.rotate,
            o = e + PI/2, dx, dy;
        
        M.x = x, M.y = y, M.width = w, M.height = h;

        _beforeDraw.call(this, G, shape);
        
        a = w/2; b = h/2;
        dx = x + a; dy = y + b;
        w = 2*sqrt(pow(a*cos(e),2)+pow(b*sin(e),2));
        h = 2*sqrt(pow(a*cos(o),2)+pow(b*sin(o),2));
        
        G.translate(dx, dy);
        G.rotate(-e);
        
        x = -w/2; y = -h/2;

        G.beginPath();
        G.drawImage(c.image, c.sx,c.sy, c.sw,c.sh, x, y, w, h);
        
        _afterDraw.call(this, G, shape);

        callback(data, shape);
    };

    thi$.drawLine = function(ctx, shape, hit){
        var G = ctx, D = shape.getLine(), 
            x0 = D.x0, y0 = D.y0, x1 = D.x1, y1 = D.y1; 
        
        _beforeDraw.call(this, G, shape, hit);
        
        G.beginPath();
        G.moveTo(fix(x0), fix(y0));
        G.lineTo(fix(x1), fix(y1));
        
        _afterDraw.call(this, G, shape, hit);
    };

    thi$.drawPolygon = function(ctx, shape, hit){
        var G = ctx, D = shape.getPoints(), 
            points = D.points, p, x, y, i, len;
        
        _beforeDraw.call(this, G, shape, hit);

        G.beginPath();
        
        for(i=0, len=points.length; i<len; i++){
            p = points[i];
            switch(p[0]){
            case 0:
                G.moveTo(fix(p[1]), fix(p[2]));
                break;
            case 1:
                G.lineTo(fix(p[1]), fix(p[2]));
                break;
            case 2: // @see arc
                G.arc(p[1], p[2], p[3], p[4], p[5], p[6]);
                break;
            case 3: // @see arcTo
                G.arcTo(p[1], p[2], p[3], p[4], p[5]);
                break;
            }
        }
        G.closePath();

        _afterDraw.call(this, G, shape, hit);
    };

    thi$.drawPolyline = function(ctx, shape, hit){
        var G = ctx, D = shape.getPoints(), 
            points = D.points, p, x, y, i, len;
        
        _beforeDraw.call(this, G, shape, hit);

        G.beginPath();
        
        for(i=0, len=points.length; i<len; i++){
            p = points[i];
            x = fix(p[1]); y = fix(p[2]);
            switch(p[0]){
            case 0:
                G.moveTo(x, y);
                break;
            case 1:
                G.lineTo(x, y);
                break;
            }
        }

        _afterDraw.call(this, G, shape, hit);
    };

    thi$.drawRect = function(ctx, shape, hit){
        var G = ctx, D= shape.getRect();
        
        _beforeDraw.call(this, G, shape, hit);
        
        G.beginPath();
        G.rect(fix(D.x), fix(D.y), D.width, D.height);
        
        _afterDraw.call(this, G, shape, hit);
    };


    thi$.drawText = function(ctx, shape, hit){
        var G = ctx, D = shape.getText(), text = D.text,
            x = D.x, y = D.y, w = D.width, h = D.height,
            ax = D.align_x, ay = D.align_y, e = D.rotate, 
            fs, tw, th, dx, dy, a, b, o = e + PI/2;
        
        x = Class.isNumber(x) ? x : 0;
        y = Class.isNumber(y) ? y : 0;

        w = Class.isNumber(w) ? w : 160;
        h = Class.isNumber(h) ? h : 16;
        
        a = w/2; b = h/2;

        dx = x + a; dy = y + b;

        w = 2*sqrt(pow(a*cos(e),2)+pow(b*sin(e),2));
        h = 2*sqrt(pow(a*cos(o),2)+pow(b*sin(o),2));

        _beforeDraw.call(this, G, shape, hit);

        G.translate(dx, dy);        
        G.rotate(-e);
        
        fs = this.measureText(G, text);
        tw = fs.width, th = fs.height;
        
        if(tw > w){
            text = this.cutString(G, text, w, true);
            tw = G.measureText(text).width;
        }

        x = -w/2 + (w - tw)*ax;
        y = -h/2 + (h - th)*ay;
        
        if(hit !== true){
            if(shape.isFill()){
                G.fillText(text, x, y);
            }

            if(shape.isStroke()){
                G.strokeText(text, x, y);
            };
        }else{
            G.fillRect(x, y, tw, th);
        }
        
        G.restore();
    };

    this._init.apply(this, arguments);

}.$extend(js.awt.Renderer);


