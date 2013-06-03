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

        cos = Math.cos, sin = Math.sin, 
        pow = Math.pow, sqrt = Math.sqrt,
        PI = Math.PI,  TWPI = 2*PI, PI180 = PI/180, 

        BRUSH= ["LinearGradient", "RadialGradient", "Pattern"],

        STYLES = [
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
        ], LEN = STYLES.length,

        BASICSHAPES = {
            rect :   "drawRect",
            circle:  "drawCircle",
            ellipse: "drawEllipse",
            sector:  "drawSector",
            polygon: "drawPolygon", 
            image: "drawImage",
            text: "drawText",

            polyline: "drawPolyline",

            line: "drawLine",
            arc: "drawArc",
            arc1: "drawEllipticArc",
            arc2: "drawShortestArc",
            bezier2: "drawBezier2",
            bezier3: "drawBezier3",

            path: "drawPath"
        };

    
    thi$.applyStyles = function(ctx, styles){
        var i, k, v;

        for(i=0; i<LEN; i++){
            k= STYLES[i];
            v = styles[k];
            if(v !== undefined){
                ctx[k] = v;
            }
        }
        
        if(styles.font === undefined){
            var FAttrs = Font.Attrs, font;
            for(i=0; i<5; i++){
                k = FAttrs[i];
                v = styles[k];
                if(v !== undefined){
                    font = font || Font.parseFont(ctx.font);
                    font[k] = v;
                }
            }
            if(font){
                ctx.font = font.toString();
            }
        }
        
        if(styles.strokeStyle === undefined){
            for(i=0; i<3; i++){
                k = BRUSH[i];
                v = styles["stroke"+k];
                if(v !== undefined){
                    ctx.strokeStyle = this["create"+k](ctx, v);
                    break;
                }
            }
        };

        if(styles.fillStyle === undefined){
            for(i=0; i<3; i++){
                k = BRUSH[i];
                v = styles["fill"+k];
                if(v !== undefined){
                    ctx.fillStyle = this["create"+k](ctx, v);
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

    thi$.fix = function(v){
        return (v == 0) ? 0.0 : Math.floor(v)-0.5;
    };
    
    /**
     * @see js.awt.Renderer
     */
    thi$.drawShape = function(ctx, shape, hit){
        var type = shape.getType(),
            geom = shape.getShapeInfo(), 
            style= shape.getStyles(),
            trans= shape.getTransform(),
            clip = shape.getClip(),
            fn = BASICSHAPES[type];
        if(this[fn]){
            this[fn](ctx, geom, style, hit, trans, clip);
        }else{
            throw "Can not found method ["+fn+"] for this shape.";
        }
    }.$override(this.drawShape);


    thi$.setContext = function(ctx, geom, style, hit, transform, clip){
        var T = transform, color, v;

        ctx.save();
        
        if(style){
            this.applyStyles(ctx, style);
        }
        
        if(T){
            ctx.transform(T.m11, T.m12, T.m21, T.m22, T.dx, T.dy);
        }
       
        if(hit === true){
            color = style.colorKey;
            ctx.strokeStyle = ctx.fillStyle = color.rgba;

            v = style.hitLineWidth;
            if(v){
                ctx.lineWidth = v;
            }
        }
    };

    thi$.draw = function(ctx, geom, style, hit){
        var fillStroke = style.fillStroke || 1,
            fill = ((fillStroke & 2) != 0), 
            stroke = ((fillStroke & 1) != 0), opacity, v;

        if((fill || hit) && (style.close !== "open")){
            v = ctx.globalAlpha;
            if(!hit){
                opacity = style ? style.fillOpacity : undefined;
                if(Class.isNumber(opacity)){
                    ctx.globalAlpha = opacity;
                }
            }
            ctx.fill();
            ctx.globalAlpha = v;
        }

        if(stroke || hit){
            v = ctx.globalAlpha;
            if(!hit){
                opacity = style ? style.strokeOpacity : undefined;
                if(Class.isNumber(opacity)){
                    ctx.globalAlpha = opacity;
                }
            }
            ctx.stroke();
            ctx.globalAlpha = v;
        }

        ctx.restore();
    };

    thi$.drawArc = function(ctx, geom, style, hit, transform, clip){

        this.setContext(ctx, geom, style, hit, transform, clip);
        
        var fix = this.fix;

        ctx.beginPath();
        ctx.arc(fix(geom.cx), fix(geom.cy), geom.r,
                -geom.startAngle, -geom.endAngle, true);
        
        this.draw(ctx, geom, style, hit);

    };

    thi$.drawCircle = function(ctx, geom, style, hit, transform, clip){
        this.setContext(ctx, geom, style, hit, transform, clip);
        
        var fix = this.fix;
        ctx.beginPath();
        ctx.arc(fix(geom.cx), fix(geom.cy), geom.r, 0, TWPI, true);
        
        this.draw(ctx, geom, style, hit);
    };

    thi$.drawEllipse = function(ctx, geom, style, hit, transform, clip){
        this.setContext(ctx, geom, style, hit, transform, clip);
        
        var fix = this.fix,
            x = geom.cx, y = geom.cy, a = geom.rx, b = geom.ry,
            r = Math.max(a, b), ratioX = a/r, ratioY = b/r,
            cx = fix(x/ratioX), cy = fix(y/ratioY),
            x0 = fix((x+a)/ratioX);
        
        ctx.beginPath();

        ctx.scale(ratioX, ratioY);
        ctx.moveTo(x0, cy);
        ctx.arc(cx, cy, r, 0, TWPI, true);
        
        this.draw(ctx, geom, style, hit);
    };

    thi$.drawImage = function(ctx, geom, style, hit, transform, clip){
        this.setContext(ctx, geom, style, hit, transform, clip);

        var x = geom.dx, y = geom.dy, w = geom.dw, h = geom.dh, a, b, 
            e = geom.rotate, o = e + PI/2, dx, dy;

        a = w/2; b = h/2;
        dx = x + a; dy = y + b;
        w = 2*sqrt(pow(a*cos(e),2)+pow(b*sin(e),2));
        h = 2*sqrt(pow(a*cos(o),2)+pow(b*sin(o),2));
        
        ctx.translate(dx, dy);
        ctx.rotate(-e);

        x = -w/2; y = -h/2;

        ctx.beginPath();
        if(!hit){
            ctx.drawImage(geom.image, geom.sx,geom.sy, 
                          geom.sw,geom.sh, x, y, w, h);
        }else{
            ctx.rect(x, y, w, h);
        }
        
        this.draw(ctx, geom, style, hit);
    };

    thi$.drawLine = function(ctx, geom, style, hit, transform, clip){
        this.setContext(ctx, geom, style, hit, transform, clip);
        var fix = this.fix;

        ctx.beginPath();
        ctx.moveTo(fix(geom.x0), fix(geom.y0));
        ctx.lineTo(fix(geom.x1), fix(geom.y1));
        
        this.draw(ctx, geom, style, hit);
    };

    thi$.drawPolygon = function(ctx, geom, style, hit, transform, clip){
        this.setContext(ctx, geom, style, hit, transform, clip);

        var fix = this.fix, points = geom.points, p, x, y, i, len;

        ctx.beginPath();
        for(i=0, len=points.length; i<len; i++){
            p = points[i];
            x = fix(p[1]); y = fix(p[2]);
            switch(p[0]){
            case 0:
                ctx.moveTo(x, y);
                break;
            case 1:
                ctx.lineTo(x, y);
                break;
            }
        }            
        ctx.closePath();

        this.draw(ctx, geom, style, hit);

    };

    thi$.drawPolyline = function(ctx, geom, style, hit, transform, clip){
        this.setContext(ctx, geom, style, hit, transform, clip);

        var fix = this.fix, points = geom.points, p, x, y, i, len;

        ctx.beginPath();
        for(i=0, len=points.length; i<len; i++){
            p = points[i];
            x = fix(p[1]); y = fix(p[2]);
            switch(p[0]){
            case 0:
                ctx.moveTo(x, y);
                break;
            case 1:
                ctx.lineTo(x, y);
                break;
            }
        }            

        this.draw(ctx, geom, style, hit);
    };

    thi$.drawRect = function(ctx, geom, style, hit, transform, clip){

        this.setContext(ctx, geom, style, hit, transform, clip);
        
        ctx.beginPath();
        ctx.rect(this.fix(geom.x), this.fix(geom.y), geom.width, geom.height);
        
        this.draw(ctx, geom, style, hit);
    };

    thi$.drawSector = function(ctx, geom, style, hit, transform, clip){

        this.setContext(ctx, geom, style, hit, transform, clip);

        ctx.beginPath();
        
        var fix = this.fix, cx, cy, x0, y0;
        cx = fix(geom.cx);
        cy = fix(geom.cy);

        switch(geom.close){
        case "center":
            ctx.moveTo(cx, cy);
            break;
        case "short":
        case "open":
            x0 = cx + geom.r * cos(geom.startAngle);
            y0 = cy - geom.r * sin(geom.startAngle);
            ctx.moveTo(x0, y0);
            break;
        }

        ctx.arc(cx, cy, geom.r, -geom.startAngle, -geom.endAngle, true);

        switch(geom.close){
        case "center":
            ctx.lineTo(cx, cy);
            break;
        case "short":
            ctx.lineTo(x0, y0);
            break;
        case "open":
            ctx.moveTo(x0, y0);
            break;
        }
        
        this.draw(ctx, geom, style, hit);

    };


    thi$.drawText = function(ctx, geom, style, hit, transform, clip){
        this.setContext(ctx, geom, style, hit, transform, clip);

        var fix = this.fix, text = geom.text,
            x = geom.x, y = geom.y, w = geom.width, h = geom.height,
            ax = geom.align_x, ay = geom.align_y, e = geom.rotate, 
            fs, tw, th, dx, dy, a, b, o = e + PI/2;
        
        x = Class.isNumber(x) ? x : 0;
        y = Class.isNumber(y) ? y : 0;

        w = Class.isNumber(w) ? w : 160;
        h = Class.isNumber(h) ? h : 16;
        
        a = w/2; b = h/2;

        dx = x + a; dy = y + b;

        w = 2*sqrt(pow(a*cos(e),2)+pow(b*sin(e),2));
        h = 2*sqrt(pow(a*cos(o),2)+pow(b*sin(o),2));


        ctx.translate(dx, dy);        
        ctx.rotate(-e);
        
        fs = this.measureText(ctx, text);
        tw = fs.width, th = fs.height;
        
        if(tw > w){
            text = this.cutString(ctx, text, w, true);
            tw = ctx.measureText(text).width;
        }

        x = -w/2 + (w - tw)*ax;
        y = -h/2 + (h - th)*ay;
        
        var fillStroke = style.fillStroke, 
            fill = ((fillStroke & 2) != 0), 
            stroke = ((fillStroke & 1) != 0);

        if(hit !== true){
            if(fill){
                ctx.fillText(text, x, y);
            }

            if(stroke){
                ctx.strokeText(text, x, y);
            };
        }else{
            ctx.fillRect(x, y, tw, th);
        }
        
        ctx.restore();
    };

    this._init.apply(this, arguments);

}.$extend(js.awt.Renderer);


