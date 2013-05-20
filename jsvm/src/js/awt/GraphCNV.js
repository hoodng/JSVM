
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
 * 
 */
js.awt.GraphCNV = function(def, Runtime, view){

    var CLASS = js.awt.GraphCNV, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ,
        PI = Math.PI, cos = Math.cos, sin = Math.sin;

    /**
     * @see js.awt.Graphics2D
     */
    thi$.setPen = function(id){
        arguments.callee.__super__.apply(this, arguments);
        
        var pen = this.getPen(), canvas = this.canvas;

        canvas.lineWidth = pen.lineWidth;
        canvas.strokeStyle = pen.strokeStyle;
        canvas.lineCap = pen.lineCap;
        canvas.lineJoin= pen.lineJoin;
        canvas.miterLimit = pen.miterLimit;
        
    }.$override(this.setPen);
    
    /**
     * @see js.awt.Graphics2D
     */
    thi$.setBrush = function(id){
        arguments.callee.__super__.apply(this, arguments);
        
        var brush = this.getBrush(), canvas = this.canvas;

        canvas.fillStyle = brush.fillStyle;

    }.$override(this.setBrush);

    /**
     * @see js.awt.Graphics2D
     */
    thi$.setFont = function(id){
        arguments.callee.__super__.apply(this, arguments);
        
        var font = this.getFont(), canvas = this.canvas;

        canvas.font = font.toString();

    }.$override(this.setFont);

    /**
     * @see js.awt.Graphics2D
     */
    thi$.drawRect = function(rect, fill, pen, brush, op){
        return _drawShape.call(
            this, arguments.callee.__super__.apply(this, arguments));
    }.$override(this.drawRect);
    
    /**
     * Draw raw rectangle
     */
    thi$.drawRect0 = function(rect, fill, pen, brush, op){
        var G = this.canvas;
        
        fill = fill || false;
        pen = pen || this.curPen;
        brush = brush || this.curBrush;
        
        G.save();
        
        this.setPen(pen);
        this.setBrush(brush);

        if(op){
            G.globalCompositeOperation = op;
        }

        G.beginPath();
        G.rect(fix(rect.x), fix(rect.y), rect.w, rect.h);
        G.stroke();

        if(fill){
            G.closePath();
            G.fill();
        }

        G.restore();
    };

    /**
     * @see js.awt.Graphics2D
     */
    thi$.drawLine = function(line, fill, pen, brush, op){
        return _drawShape.call(
            this, arguments.callee.__super__.apply(this, arguments));
    }.$override(this.drawLine);

    /**
     * Draw raw lines
     */
    thi$.drawLine0 = function(line, fill, pen, brush, op){
        var G = this.canvas;
        
        fill = fill || false;
        pen = pen || this.curPen;
        brush = brush || this.curBrush;
        
        G.save();
        
        this.setPen(pen);
        this.setBrush(brush);

        if(op){
            G.globalCompositeOperation = op;
        }

        line = line || {};
        var cmds = line.cmds || [], cords = line.cords || [], 
            i, len, p, x, y;

        G.beginPath();
        for(i=0, len=cmds.length; i<len; i++){
            p = cords[i];
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
        G.stroke();
        
        if(fill){
            G.closePath();
            G.fill();
        }

        G.restore();
    };

    /**
     * @see js.awt.Graphics2D
     */
    thi$.drawEllipse = function(data, fill, pen, brush, op){
        return _drawShape.call(
            this, arguments.callee.__super__.apply(this, arguments));
    }.$override(this.drawEllipse);
    
    thi$.drawEllipse0 = function(data, fill, pen, brush, op){
        var G = this.canvas;
        
        fill = fill || false;
        pen = pen || this.curPen;
        brush = brush || this.curBrush;
        
        G.save();
        
        this.setPen(pen);
        this.setBrush(brush);

        if(op){
            G.globalCompositeOperation = op;
        }

        var x = data.x, y = data.y, 
            a = data.radius[0], b = data.radius[1], 
            r = Math.max(a,b), ratioX = a/r, ratioY = b/r;
        
        G.scale(ratioX, ratioY);
        G.beginPath();
        G.moveTo((x+a)/ratioX,(y/ratioY));
        G.arc(x/ratioX, y/ratioY, r, 0, 2 * PI);
        G.stroke();

        if(fill){
            G.closePath();
            G.fill();
        }

        G.restore();
    };

    /**
     * @see js.awt.Graphics2D
     */
    thi$.drawArc = function(data, fill, pen, brush, op){
        return _drawShape.call(
            this, arguments.callee.__super__.apply(this, arguments));
    }.$override(this.drawArc);


    thi$.drawArc0 = function(data, fill, pen, brush, op){
        var G = this.canvas;
        
        fill = fill || false;
        pen = pen || this.curPen;
        brush = brush || this.curBrush;
        
        G.save();
        
        this.setPen(pen);
        this.setBrush(brush);

        if(op){
            G.globalCompositeOperation = op;
        }
        
        var cx, cy, r, s, e;

        cx = data.x;
        cy = data.y;
        r  = data.radius;
        s  = Class.isNumber(data.start) ? data.start : 0;
        e  = Class.isNumber(data.end) ? data.end : 2 * PI;
        
        G.beginPath();

        if(fill){
            G.moveTo(cx, cy);
        }
        
        G.arc(cx, cy, r, -s, -e, true);

        G.stroke();

        if(fill){
            G.closePath();
            G.fill();
        }

        G.restore();
    };

    /**
     * @see js.awt.Graphics2D
     */
    thi$.drawPolygon = function(data, fill, pen, brush, op){
        return _drawShape.call(
            this, arguments.callee.__super__.apply(this, arguments));
    }.$override(this.drawPolygon);

    thi$.drawPolygon0 = function(data, fill, pen, brush, op){
        var G = this.canvas;
        
        fill = fill || false;
        pen = pen || this.curPen;
        brush = brush || this.curBrush;
        
        G.save();
        
        this.setPen(pen);
        this.setBrush(brush);

        if(op){
            G.globalCompositeOperation = op;
        }

        data = data || {};
        var cmds = data.cmds || [], cords = data.cords || [], 
            i, len, p, x, y;

        G.beginPath();
        for(i=0, len=cmds.length; i<len; i++){
            p = cords[i];
            switch(cmds[i]){
            case 0: // moveTo
                G.moveTo(fix(p[0]), fix(p[1]));
                break;
            case 1: // lineTo
                G.lineTo(fix(p[0]), fix(p[1]));
                break;
            case 2: // arc
                // see Canvas API
                G.arc(p[0], p[1], p[2], p[3], p[4], p[5]);
                break;
            case 3: // arcTo
                // see Canvas API
                G.arcTo(p[0], p[1], p[2], p[3], p[4]);
            }
        }
        G.stroke();
        
        if(fill){
            G.closePath();
            G.fill();
        }

        G.restore();
    };

    /**
     * @see js.awt.Graphics2D
     */
    thi$.drawText = function(data, fill, font, pen, brush, op){
        return _drawShape.call(
            this, arguments.callee.__super__.apply(this, arguments));
    }.$override(this.drawText);

    thi$.drawText0 = function(data, fill, font, pen, brush, op){
        var G = this.canvas;
        
        fill = fill || false;
        pen = pen || this.curPen;
        brush = brush || this.curBrush;
        font = font || this.curFont;

        G.save();

        this.setPen(pen);
        this.setBrush(brush);
        this.setFont(font);

        if(op){
            G.globalCompositeOperation = op;
        }

        data = data || {};
        
        G.textBaseline = "top";
        G.textAlign = "left";

        var bounds = this.getBounds(), text = data.text,
            x = data.x, y = data.y, 
            w = data.width, h = data.height,
            ax = data.align_x, ay = data.align_y, 
            e = data.rotate, fw, fh,
            fs = this.measureText(text);
        
        x = Class.isNumber(x) ? x : 0; 
        y = Class.isNumber(y) ? y : 0;
        w = Class.isNumber(w) ? w : bounds.innerWidth;
        h = Class.isNumber(h) ? h : bounds.innerHeight;
        ax= Class.isNumber(ax) ? ax : 0.0;
        ay= Class.isNumber(ay) ? ay : 0.5;
        fw= fs.width; 
        fh= fs.height;

        e = Class.isNumber(e) ? e : 0;
        
        /* 
         *   A
         *    +--------+
         *    |   o ---|---> X
         *    +---+----+
         *        |     B
         *        v
         *        Y
         */
        var dx = x + w/2, dy = y + h/2, 
            a = w/2, b = h/2, o = e + PI/2;

        G.translate(dx, dy);        
        G.rotate(-e);
        
        w = 2*Math.sqrt(Math.pow(a*cos(e),2)+Math.pow(b*sin(e),2));
        h = 2*Math.sqrt(Math.pow(a*cos(o),2)+Math.pow(b*sin(o),2));
        
        if(fw > w){
            text = this.cutString(text, w, true);
            fw = G.measureText(text).width;
        }

        x = -w/2 + (w - fw)*ax;
        y = -h/2 + (h - fh)*ay;
        
        if(fill){
            G.fillText(text, x, y);
        }else{
            G.strokeText(text, x, y);
        };
        
        G.restore();
    };

    var _drawShape = function(shape){
        shape.dev = "canvas";
        shape.draw(this);
        return shape;
    };

    var fix = function(v){
        return (v == 0) ? 0.0 : Math.floor(v)-0.5;
    };

    /**
     * @see js.awt.Graphics2D
     */
    thi$.createLinearGradient = function(x0, y0, x1, y1){
        arguments.callee.__super__.apply(this, arguments);

        return this.canvas.createLinearGradient(x0, y0, x1, y1);

    }.$override(this.createLinearGradient);

    /**
     * @see js.awt.Graphics2D
     */
    thi$.createRadialGradient = function(x0, y0, r0, x1, y1, r1){
        arguments.callee.__super__.apply(this, arguments);

        return this.canvas.createRadialGradient(x0, y0, r0, x1, y1, r1);

    }.$override(this.createRadialGradient);

    /**
     * @see js.awt.Graphics2D
     */
    thi$.createPattern = function(image, repeat){
        arguments.callee.__super__.apply(this, arguments);

        return this.canvas.createPattern(image, repeat);

    }.$override(this.createPattern);
    

    /**
     * @see js.awt.Graphics2D
     *
     * @return {width: height}
     */
    thi$.measureText = function(text, font){
        var G = this.canvas, ret = {};

        text = text || "";
        font = font || this.curFont;

        G.save();
        this.setFont(font);
        
        var _font = this.getFont();
        ret.height = _font.size;
        ret.width = G.measureText(text).width;

        G.restore();

        return ret;

    }.$override(this.measureText);

    thi$.cutString = function(text, width, omit){
        var G = this.canvas, i=1, s = text,
            w = G.measureText(text).width;
        
        while(w > width && s !== "..." && s !== ""){
            s = s.substr(0, text.length-i); 
            s += omit ? "..." : "";
            w = G.measureText(s).width;
            i++;
        }
        return s;
    };

    /**
     * Override js.awt.Component
     */
    thi$.doLayout = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            var shapes = this._local.shapes, i, len, shape;
            for(i=0, len=shapes.length; i<len; i++){
                shape = shapes[i];
                shape.draw(this);
            }
        }
    }.$override(this.doLayout);
    
    /**
     * Override destroy method of js.lang.Object
     */
    thi$.destroy = function(){
        delete this.canvas;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);
    
    thi$._config = function(){
        if(this.canvas){
            this.setPen(this.registerPen(thi$.DEFAULT_PEN));
            this.setBrush(this.registerBrush(thi$.DEFAULT_BRUSH));
            this.setFont(this.registerFont(thi$.DEFAULT_FONT));
        }
    }.$override(this._config);
    
    thi$._init = function(def, Runtime){
        if(typeof def !== "object") return;

        def.classType = def.classType || "js.awt.GraphCNV";
        def.viewType = def.viewType || "CANVAS";
        
        arguments.callee.__super__.apply(this, arguments);

        this.canvas = this.view.getContext("2d");

        this._config();
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Graphics2D);

