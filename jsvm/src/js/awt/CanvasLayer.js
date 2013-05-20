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

/**
 * 
 */
js.awt.CanvasLayer = function(def, Runtime){

    var CLASS = js.awt.CanvasLayer, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, 
        System = J$VM.System, MQ = J$VM.MQ, DOM = J$VM.DOM,
        Color = Class.forName("js.awt.Color"), 
        Font = Class.forName("js.awt.Font"),
        cos = Math.cos, sin = Math.sin, pow = Math.pow, sqrt = Math.sqrt,
        PI = Math.PI, TWPI = 2*PI, PI180 = PI/180, 
        FONT = ["fontStyle", "fontVariant", "fontWeight", "fontSize", "fontFamily"],
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


    thi$.getContext = function(){
        return this.relContext();
    }.$override(this.getContext);

    thi$.relContext = function(){
        var U = this._local, ctx = U.relContext;
        if(!ctx){
            ctx = U.relContext = this.relCanvas.getContext("2d");
        }
        return ctx;
    };

    thi$.hitContext = function(){
        var U = this._local, ctx = U.hitContext;
        if(!ctx){
            ctx = U.hitContext = this.hitCanvas.getContext("2d");
        }
        return ctx;
    };

    var _beforeDraw = function(shape, ctx, hit){
        ctx.save();
        
        var attrs = shape.getAttrs(), T = shape.getTransform(), 
            v, color;

        this.setContextAttrs(attrs, ctx);
        
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

    var _afterDraw = function(shape, ctx, hit){
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

    thi$.drawArc = function(shape, hit){
        var G = (hit === true) ? this.hitContext() : this.relContext(),
            arc = shape.getArc(), cx, cy, x0, y0;
        
        _beforeDraw.call(this, shape, G, hit);
        
        G.beginPath();

        cx = fix(arc.cx);
        cy = fix(arc.cy);
        

        switch(arc.close){
        case "center":
            G.moveTo(cx, cy);
            break;
        case "short":
        case "open":
            x0 = cx + arc.radius * cos(arc.startAngle);
            y0 = cy - arc.radius * sin(arc.startAngle);

            G.moveTo(x0, y0);
            break;
        }

        G.arc(cx, cy, arc.radius, -arc.startAngle, -arc.endAngle, true);

        switch(arc.close){
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

        _afterDraw.call(this, shape, G, hit);

    };

    thi$.drawCircle = function(shape, hit){
        var G = (hit === true) ? this.hitContext() : this.relContext(),
            c = shape.getCircle();
        
        _beforeDraw.call(this, shape, G, hit);
        
        G.beginPath();
        G.arc(fix(c.cx), fix(c.cy), c.radius, 0, TWPI);
        
        _afterDraw.call(this, shape, G, hit);
    };

    thi$.drawEllipse = function(shape, hit){
        var G = (hit === true) ? this.hitContext() : this.relContext(),
            c = shape.getEllipe(), x = c.cx, y = c.cy, a=c.ra, b=c.rb, 
            r = Math.max(a,b), ratioX = a/r, ratioY = b/r;
        
        _beforeDraw.call(this, shape, G, hit);
        
        G.beginPath();
        G.scale(ratioX, ratioY);
        G.moveTo((x+a)/ratioX, y/ratioY);
        G.arc(x/ratioX, y/ratioY, r, 0, TWPI);
        
        _afterDraw.call(this, shape, G, hit);
    };

    thi$.drawImage = function(shape, hit, callback){
        var G = (hit === true) ? this.hitContext() : this.relContext();

        if(hit !== true){
            shape.getImage(_drawImage.$bind(this, shape, callback));
        }else{
            _beforeDraw.call(this, shape, G, hit);

            G.beginPath();
            var M = shape.getAttrs();
            G.rect(M.x, M.y, M.width, M.height);

            _afterDraw.call(this, shape, G, hit);
        };
    };

    var _drawImage = function(data, shape, callback){
        var G = this.relContext(), c = data, M = shape.getAttrs(),
            x = c.dx, y = c.dy, w = c.dw, h = c.dh, a, b, e = c.rotate,
            o = e + PI/2, dx, dy;
        
        M.x = x, M.y = y, M.width = w, M.height = h;

        _beforeDraw.call(this, shape, G);
        
        a = w/2; b = h/2;
        dx = x + a; dy = y + b;
        w = 2*sqrt(pow(a*cos(e),2)+pow(b*sin(e),2));
        h = 2*sqrt(pow(a*cos(o),2)+pow(b*sin(o),2));
        
        G.translate(dx, dy);
        G.rotate(-e);
        
        x = -w/2; y = -h/2;

        G.beginPath();
        G.drawImage(c.image, c.sx,c.sy, c.sw,c.sh, x, y, w, h);
        
        _afterDraw.call(this, shape, G);

        callback(data, shape);
    };

    thi$.drawLine = function(shape, hit){
        var G = (hit === true) ? this.hitContext() : this.relContext(),
            c = shape.getLine(), x0 = c.x0, y0 = c.y0, x1 = c.x1, y1 = c.y1; 
        
        _beforeDraw.call(this, shape, G, hit);
        
        G.beginPath();
        G.moveTo(fix(x0), fix(y0));
        G.lineTo(fix(x1), fix(y1));
        
        _afterDraw.call(this, shape, G, hit);
    };

    thi$.drawPolygon = function(shape, hit){
        var G = (hit === true) ? this.hitContext() : this.relContext(),
            c = shape.getLines(), cmds = c.cmds, coords = c.coords, 
            p, x, y, i, len;
        
        _beforeDraw.call(this, shape, G, hit);

        G.beginPath();
        
        for(i=0, len=cmds.length; i<len; i++){
            p = coords[i];
            switch(cmds[i]){
            case 0:
                G.moveTo(fix(p[0]), fix(p[1]));
                break;
            case 1:
                G.lineTo(fix(p[0]), fix(p[1]));
                break;
            case 2:
                G.arc(p[0], p[1], p[2], p[3], p[4], p[5]);
                break;
            case 3:
                G.arcTo(p[0], p[1], p[2], p[3], p[4]);
                break;
            }
        }
        G.closePath();

        _afterDraw.call(this, shape, G, hit);
    };

    thi$.drawPolyline = function(shape, hit){
        var G = (hit === true) ? this.hitContext() : this.relContext(),
            c = shape.getLines(), cmds = c.cmds, coords = c.coords, 
            p, x, y, i, len;
        
        _beforeDraw.call(this, shape, G, hit);

        G.beginPath();
        
        for(i=0, len=cmds.length; i<len; i++){
            p = coords[i];
            x = fix(p[0]); y = fix(p[1]);
            switch(cmds[i]){
            case 0:
                G.moveTo(x, y);
                break;
            case 1:
                G.lineTo(x, y);
                break;
            }
        }

        _afterDraw.call(this, shape, G, hit);
    };

    thi$.drawRect = function(shape, hit){
        var G = (hit === true) ? this.hitContext() : this.relContext(),
            rect = shape.getRect();
        
        _beforeDraw.call(this, shape, G, hit);
        
        G.beginPath();
        G.rect(fix(rect.x), fix(rect.y), rect.width, rect.height);
        
        _afterDraw.call(this, shape, G, hit);
    };

    thi$.drawText = function(shape, hit){
        var G = (hit === true) ? this.hitContext() : this.relContext(),
            rect = shape.getText(), text = rect.text, bounds,
            x = rect.x, y = rect.y, w = rect.width, h = rect.height,
            ax = rect.align_x, ay = rect.align_y, e = rect.rotate, 
            fs, tw, th, dx, dy, a, b, o = e + PI/2;
        
        x = Class.isNumber(x) ? x : 0;
        y = Class.isNumber(y) ? y : 0;
        if(!Class.isNumber(w) || !Class.isNumber(h)){
            bounds = this.getBounds();
        }
        w = Class.isNumber(w) ? w : bounds.innerWidth;
        h = Class.isNumber(h) ? h : bounds.innerHeight;
        
        a = w/2; b = h/2;

        dx = x + a; dy = y + b;

        w = 2*sqrt(pow(a*cos(e),2)+pow(b*sin(e),2));
        h = 2*sqrt(pow(a*cos(o),2)+pow(b*sin(o),2));

        _beforeDraw.call(this, shape, G, hit);

        G.translate(dx, dy);        
        G.rotate(-e);
        
        fs = this.measureText(text);
        tw = fs.width, th = fs.height;
        
        if(tw > w){
            text = this.cutString(text, w, true, G);
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

    this.setContextAttrs = function(attrs, ctx){
        ctx = ctx || this.relContext();

        var i, k, v;
        for(i=0; i<ATTRSLEN; i++){
            k= CTXATTRS[i];
            v = attrs[k];
            if(v !== undefined){
                ctx[k] = v;
            }
        }
        
        if(attrs.font === undefined){
            var font = Font.parseFont(ctx.font);
            for(i=0; i<5; i++){
                k = FONT[i];
                v = attrs[k];
                if(v !== undefined){
                    font[k] = v;
                }
            }

            ctx.font = font.toString();
        }
        
        if(attrs.strokeStyle === undefined){
            for(i=0; i<3; i++){
                k = BRUSH[i];
                v = attrs["stroke"+k];
                if(v !== undefined){
                    attrs.strokeStyle = this["create"+k](v, ctx);
                    break;
                }
            }
        };

        if(attrs.fillStyle === undefined){
            for(i=0; i<3; i++){
                k = BRUSH[i];
                v = attrs["fill"+k];
                if(v !== undefined){
                    attrs.fillStyle = this["create"+k](v, ctx);
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
    thi$.createLinearGradient = function(v, ctx){
        ctx = ctx || this.relContext();
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
    thi$.createRadialGradient = function(v, ctx){
        ctx = ctx || this.relContext();
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
    thi$.createPattern = function(v, ctx){
        ctx = ctx || this.relContext();
        var g = ctx.createPattern(v.image, v.repeat);
        return g;
    };

    thi$.getImageData = function(x, y, w, h, ctx){
        ctx = ctx || this.relContext();
        return ctx.getImageData(x, y, w, h);
    };

    thi$.cutString = function(text, width, omit, ctx){
        ctx = ctx || this.relContext();

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

    thi$.measureText = function(text, font, ctx){
        ctx = ctx || this.relContext();

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

    }.$override(this.measureText);

    var fix = function(v){
        return (v == 0) ? 0.0 : Math.floor(v)-0.5;
    };

    thi$.erase = function(){
        var D = this.getBounds();
        this.relContext().clearRect(D.x, D.y, D.width, D.height);
        this.hitContext().clearRect(D.x, D.y, D.width, D.height);
    };

    thi$.redraw = function(n){
        n = n || 0;

        if(n == 0){
            this.erase();
        }

        var shape, shapes = this.items();
        for(var i=n, len=shapes.length; i<len; i++){
            shape = this[shapes[i]];
            if(shape && shape.draw){
                shape.draw();
            }
        }
    };

    var _detectShape = function(x, y){
        var cache = this.getContainer().cachedShapes(),
            image = this.getImageData(x,y,1,1, this.hitContext()), 
            px = image.data, colorKey, shape;
        if(px[3] != 0){
             colorKey = new Color(px[0], px[1], px[2], px[3]).toString("rgba");
            shape = cache[colorKey];
        }
        return shape;
    };

    var _onmousemove = function(e){
        var mp = this.relative(e.eventXY()), shape;
        shape = _detectShape.call(this, mp.x, mp.y);
        if(shape) System.err.println(shape.id);
    };

    /**
     * @see js.awt.Container
     */
	thi$.insertComponent = function(index, comp, constraints){
        var cache, shape = arguments.callee.__super__.apply(this, arguments);
        if(shape && shape.colorKey){
            cache = this.getContainer().cachedShapes();
            cache[shape.colorKey().rgba] = shape;
            index = Class.isNumber(index) ? index : this.getComponentCount() - 1;
            this.redraw(index);
        }
        return shape;
    }.$override(this.insertComponent);

    /**
     * @see js.awt.Container
     */
	thi$.removeComponent = function(comp){
        var cache, shape = arguments.callee.__super__.apply(this, arguments);
        if(shape && shape.colorKey){
            cache = this.getContainer().cachedShapes();
            delete cache[shape.colorKey().rgba];
            this.redraw(0);
        }
        return shape;
    }.$override(this.removeComponent);

    /**
     * @see js.awt.Container
     */
    thi$.setSize = function(w, h, fire){
        arguments.callee.__super__.apply(this, arguments);
        _setSize.call(this);
    }.$override(this.setSize);

    /**
     * @see js.awt.Container
     */
    thi$.setBounds = function(x, y, w, h, fire){
        arguments.callee.__super__.apply(this, arguments);
        _setSize.call(this);
    }.$override(this.setBounds);

    var _setSize = function(){
        var rel = this.relCanvas, hit = this.hitCanvas;
        hit.width = rel.width;
        hit.height= rel.height;
        this.redraw(0);
    };

    thi$.destroy = function(){
        delete this.relCanvas;
        delete this.hitCanvas;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
		if(def == undefined) return;

        def.classType = def.classType || "js.awt.CanvasLayer";
        def.viewType = "CANVAS";
        arguments.callee.__super__.apply(this, arguments);
        
        this.relCanvas = this.view;
        this.hitCanvas = DOM.createElement("CANVAS");

        this.attachEvent("mousemove", 0, this, _onmousemove);
        
        // DEBUG:
        this.hitCanvas.style.cssText = "position:absolute;right:0;top:0;";
        document.body.appendChild(this.hitCanvas);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.GraphicLayer);


