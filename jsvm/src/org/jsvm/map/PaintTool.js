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
 * Author: Mei XinLin
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */
$package("org.jsvm.map");

org.jsvm.map.PaintTool = function() {
    var CLASS = org.jsvm.map.PaintTool, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    };
    CLASS.__defined__ = true;

    var Class = js.lang.Class,
    Matrix= Class.forName("js.math.Matrix");
    
    /***
     * Modify the shape of a specify rectangle.
     * 
     * @param {Array} arr: [north, east, south, west]
     *      north is a vector. If the direction of north is as same as y-axis, north is positive.
     * 
     * @return {
     *      leftLineChange {Boolean}: true, the rectangle's left line become the right line.
     * 
     *      topLineChange {Boolean}
     * 
     *      rect: {Object} the rectangle object.
     *         }
     */
    thi$.modifyRect = function(rect, arr){
        var info = {},
            x1, x2, y1, y2, 
            w, h, def = rect.def;
       
        x1 = def.x + arr[3];
        x2 = def.x + def.width + arr[1]; 
        y1 = def.y + arr[0];
        y2 = def.y + def.height + arr[2];
        
        w = def.width + arr[1] - arr[3];
        h = def.height - arr[0] + arr[2];

        rect.def.width = Math.abs(w);
        rect.def.height = Math.abs(h);
        
        if(x1 < x2){
            rect.def.x = x1;
        }else{
            rect.def.x = x2;
            info.leftLineChange = true;
        }
        
        if(y1 < y2){
            rect.def.y = y1;
        }else{
            rect.def.y = y2;
            info.topLineChange = true;
        }
        
        info.rect = rect;
        
        return info;
    };
    
    /***
     * Get some infomation of a point in the rectangle.
     * 
     * @param {Object} p: {x: ,y: } it is a point.
     * 
     * @param {Object} rect: a rectangle object.
     * 
     * @param {Number} bw: the width of border.
     * 
     * @return {
     *     inShape {Boolean}: is the point in this rectangle.
     * 
     *     inBorder {Object}: which border is this point in the rectangle.
     *      {
     *          eastwest {String}: "east", "west" or "".
     * 
     *          northsouth {String}: "north", "south" or "".
     *     }
     * }
     * 
     */
    
    thi$.ptInRect = function(p, rect, bw){
        var dxe, dxw, dyn, dys, 
            xp = p.x, yp = p.y,
            eastwest, northsouth, 
            info = {inShape: false},
            def = _getShapeDef(rect);
            
        bw = bw || def.lineWidth;
        bw = bw > 0 ? bw/2 : 0;
        
        if(xp >= def.x - bw && xp <= def.x + def.width + bw
                && yp >= def.y - bw && yp <= def.y + def.height + bw){
            info.inShape = true;
        }else{
            return info;
        }
        
        dxe = def.x + def.width - xp;
        dxw = xp - def.x;
        dyn = yp - def.y;
        dys = def.y + def.height -yp;
        
        if(dyn <= bw){
            if(dxw <= bw){
                eastwest = "west";
                northsouth = "north";
            }else if(dxe <= bw){
                eastwest = "east";
                northsouth = "north";
            }else{
                eastwest = "";
                northsouth = "north";
            }
        }else if(dys <= bw){
            if(dxw <= bw){
                eastwest = "west";
                northsouth = "south";
            }else if(dxe <= bw){
                eastwest = "east";
                northsouth = "south";
            }else{
                eastwest = "";
                northsouth = "south";
            }
        }else{
            if(dxw <= bw){
                eastwest = "west";
                northsouth = "";
            }else if(dxe <= bw){
                eastwest = "east";
                northsouth = "";
            }else{
                eastwest = "";
                northsouth = "";            }
        }
        info["inBorder"] = {eastwest: eastwest, northsouth: northsouth};
        
        return info;
    };
    
    //  Use mouse to modify the shape of a specify rectangle.
    //  @see org.jsvm.map.MapComponent
    thi$.dragResizeRect = function(dx, dy, pointInfo, rect){
        var info,
        northsouth = pointInfo.inBorder.northsouth,
        eastwest = pointInfo.inBorder.eastwest,
        position = northsouth + eastwest;
                    
        switch(position){
            case "north":
                info = this.modifyRect(rect, [dy,0,0,0]);
                break;
            case "east":
                info = this.modifyRect(rect, [0,dx,0,0]);
                break;
            case "south":
                info = this.modifyRect(rect, [0,0,dy,0]);
                break;
            case "west":
                info = this.modifyRect(rect, [0,0,0,dx]);
                break;
            case "northeast":
                info = this.modifyRect(rect, [dy,dx,0,0]);
                break;
            case "southeast":
                info = this.modifyRect(rect, [0,dx,dy,0]);
                break;
            case "southwest":
                info = this.modifyRect(rect, [0,0,dy,dx]);
                break;
            case "northwest":
                info = this.modifyRect(rect, [dy,0,0,dx]);
                break;
        }
        
        if(info.topLineChange){
            pointInfo.inBorder.northsouth = 
                    (northsouth =="south" ? "north" : "south");
        }
        
        if(info.leftLineChange){
            pointInfo.inBorder.eastwest = 
                    (eastwest == "east" ? "west" : "east");
        }

        return {rect: info.rect, pointInfo: pointInfo};
    };

    thi$.startPolygon = function(point, id){
        _stopOtherDraw.call(this, "Polygan");
        
        this._local.tmpData = {firstPoint: point, lastPoint:[], shapes: []};
        this._local.shapeID = id; 
        this._local.state = "drawing";
    };
    
    thi$.drawPolygon = function(points){
        var shapes = this._local.tmpData.shapes;
        
        this.removeShape(shapes.pop());
        
        for(var i = 0; i < points.length - 1; i++){
            line = this.drawLine(points[i], points[i+1], id);
            shapes.push(line);
        }
        
        this._local.tmpData.lastPoint = points.pop();
    };
    
    thi$.finishPolygan = function(points){
        this.drawPolygon(points);        
    };
    
    thi$.drawLine = function(p1, p2, group){
        var G = this._local.graphic,
        def = this._local.shapeDef;
        
        def.group = group;
        def.x0 = p1[0];
        def.y0 = p1[1];
        def.x1 = p2[0];
        def.y1 = p2[1];
                    
        return G.drawLine();
    };
    
    thi$.removeShape = function(shape){
        if(shape){
            var layer = shape.getLayer();
            
            layer.removeChild(shape);
            shape.destroy();
        }
    };
    
    var _stopOtherDraw = function(shapeTye){
       var state = this._local.state,
       type = this._local.shapeType;
       
       if(state == "drawing" && type != shapeTye){
           this["complete"+type]();
       }
    };
    
    var _getShapeDef = function(shape){
        var p, def = shape.def,
            matrix = shape.getMatrix();
            
        def = {
            x: def.x,
            y: def.y,
            width: def.width,
            height: def.height
        };
        
        if(matrix.Aij(0,0) != 1 || matrix.Aij(1,1) != 1){
            p = _getNewCoord([def.x, def.y], matrix);
            
            def.x = p[0];
            def.y = p[1];
            def.width = def.width * matrixAij(0,0);
            def.height = def.height * matrixAij(1,1);
            
        }else if(matrix.Aij(2,0) != 0 || matrix.Aij(2,1) != 0){
            p = _getNewCoord([def.x, def.y], matrix);
            
            def.x = p[0];
            def.y = p[1];
        }
        
        return def;
    };
    
    var _getNewCoord = function(point, matrix){
        var coord,
        T = new Matrix(
            {M:[[point[0], point[1], 1]]});
            
        coord = Matrix.multiply(T,matrix);
        
        return [coord.M[0][0], coord.M[0][1]];
    };

};
