/**
 * Copyright (c) Jinfonet Inc. 2000-2013, All rights reserved.
 * 
 * @File: PaintTool.js
 * @Create: 2014-04-20
 * @Author: xinlin.mei@china.jinfonet.com
 */
$package("org.jsvm.map");

org.jsvm.map.PaintTool = function() {
    var CLASS = org.jsvm.map.PaintTool, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    };
    CLASS.__defined__ = true;

    var Class = js.lang.Class, System = J$VM.System,
    Matrix= Class.forName("js.math.Matrix");
    
    thi$.getPaintToolData = function(){
        return this._local.paintToolData;
    };
    
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
     *   }
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
            def = _getRectDef(rect);
            
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



    thi$.initDrawPolygon = function(graphic, shapeDef){
        if(!shapeDef) var shapeDef = {};
        
        if(!this._local.paintToolData){
            this._local.paintToolData = {
                polygons: {},
                drawing: ""  
            };
        }
        
        shapeDef = System.objectCopy(shapeDef,{
            strokeStyle: "#f06eaa",
            strokeOpacity: 0.5,
            fillStyle: "f06eaa",
            fillOpacity: 0.2,
            lineWidth: 4,
            points: [],
            
            capture: true
        },true, true);
        
        shapeDef.fillStroke = 2;
        
        var polygon = graphic.drawPolygon(shapeDef),
            uuid = polygon.uuid();
            
        polygon.def.group = uuid;
                
        this._local.paintToolData.polygons[uuid] = {
            graphic: graphic,
            polygon: polygon,
            lines: [],
            points: [],
            vertices: [],
            midpoints: [],
        };
        this._local.paintToolData.drawing = uuid;
        
        return uuid;
    };
    
    /**
     * @param {Array} point: the coordinates of a point.([x, y])
     */
    thi$.drawPolygon = function(point){
        var line, len, vertice, layer, pts,
            U = this._local.paintToolData,
            group = U.drawing,
            tmpLine = U.tmpLine,
            tmpData = U.polygons[group],
            
            vertices = tmpData.vertices,
            polygon = tmpData.polygon,
            points = tmpData.points,
            lines = tmpData.lines,
            G = tmpData.graphic,
            
            polygonDef = polygon.def;
        
        points.push(point);
        len = points.length;
        
        // draw polygon.
        polygonDef.points.push([1, point[0], point[1]]);
        polygonDef.points[0][0] = 0;
        
        // draw line.
        if(len > 1){
            line = _drawLine.call(this, G, points[len-2], points[len-1], polygonDef);
            lines.push(line);

            vertice = vertices[len-2];
            layer = vertice.getLayer();
            layer.removeChild(vertice);
            layer.appendChild(vertice);
        }
        
        
        if(!tmpLine){
            this._local.paintToolData.tmpLine = 
                            _drawLine.call(this, G, points[0],points[0], polygonDef);
        }
        
        vertice = G.drawCircle({
            cx: point[0],
            cy: point[1],
            r: 5,
            strokeStyle: "rgba(0,0,0,.4);",
            fillStyle: "#FFFFFF", 
            fillStroke: 3,
            capture: true,
            
            layer: polygonDef.layer,
            group: group,
            isVertice: true
        });
        vertices.push(vertice);

        return tmpData;
    };
    
    thi$.finishPolygon = function(){
        var U = this._local.paintToolData,
            group = U.drawing,
            tmpLine = U.tmpLine,
            tmpData = U.polygons[group],
            
            vertices = tmpData.vertices,
            polygon = tmpData.polygon,
            points = tmpData.points,
            lines = tmpData.lines,
            G = tmpData.graphic,
            
            layer = tmpLine.getLayer(),
            len = points.length,
            line, i;
        
        if(points.length < 3) return false;
                
        polygon.def["strokeStyle"] = "#0033ff";
        polygon.def["strokeOpacity"] = 0.5;
        polygon.def["fillStyle"] = "#0033ff";
        polygon.def["fillOpacity"] = 0.2;
        polygon.def["fillStroke"] = 3;
        
        this.removeShape(tmpLine, layer);
        for(i = 0; i < vertices.length; i++){
            this.removeShape(vertices[i], layer);
        }
        for(i = 0; i < lines.length; i++){
            this.removeShape(lines[i], layer);
        }
        
        delete tmpData.lines;
        tmpData.vertices = [];
        this._local.paintToolData.tmpLine = null;
                
        return polygon.def.group;
    };
    
    /***
     * @param {String} group : the id of polygon
     * 
     * @param {Boolean} b : true only remove vertices and midpoint.(defalut is false)
     * 
     */
    thi$.modifyPolygon = function(group, b){
        var U = this._local.paintToolData,
            tmpData = U.polygons[group],
            
            midpoints = tmpData.midpoints,
            vertices = tmpData.vertices,
            points = tmpData.points,
            G = tmpData.graphic,
            
            vertice, midpoint, layer,
            p1, p2, cx, cy, i;
        
        layer = tmpData.polygon.getLayer();
        for(i = midpoints.length; i > 0; i--){
            this.removeShape(midpoints.shift(), layer);
        }
        for(i = vertices.length; i > 0; i--){
            this.removeShape(vertices.shift(), layer);
        }
        
        if(b)return false;
        
        for(i = 0; i < points.length; i++){
            p1 = points[i];
            p2 = points[i+1];
            if(!p2){
                p2 = points[0];
            }
            
            // draw vertices
            vertice = G.drawCircle({
                cx: p1[0],
                cy: p1[1],
                r: 5,
                strokeStyle: "rgba(0,0,0,.4);",
                fillStyle: "#FFFFFF",
                fillStroke: 3,
                capture: true,
                
                layer: layer.id,
                group: group,
                isVertice: true
            });
            vertices.push(vertice);
            
            // draw midpoints
            cx = (p1[0]+p2[0])/2;
            cy = (p1[1]+p2[1])/2;
            
            midpoint = G.drawCircle({
                cx: cx,
                cy: cy,
                r: 5,
                strokeStyle: "rgba(0,0,0,.4);",
                fillStyle: "#FFFFFF",
                fillStroke: 3,
                capture: true,
                fillOpacity: 0.5,
                layer: layer.id,
                group: group,
                
                isMidpoint: true
            });
            midpoints.push(midpoint);
        }
    };
    
    /***
     *  remove a vertice from the polygon which is modified.
     * 
     *  @param {Object} vertice: the shape object of a vertice.
     * 
     */
    thi$.rmPtFromPolygon = function(vertice){
        var group = vertice.def.group,
            tmpData = this._local.paintToolData.polygons[group],
            midpoints = tmpData.midpoints,
            polygon = tmpData.polygon,
            points = tmpData.points,
            idx;
            
        if(points.length < 4) return false;
                
        idx = _getIndexOfPoints([vertice.def.cx, vertice.def.cy], points);
        
        points.splice(idx, 1);
        polygon.def.points.splice(idx, 1);
        
        this.modifyPolygon(group);
    };
    
    /***
     * move a vertice to the (dx, dy).
     * 
     * @param {Object} vertice: a shape object of circle and it must be a vertice. 
     *      
     */
    thi$.moveVertice = function(vertice, dx, dy){
        if(!vertice.def.isVertice) return false;
        
        var U = this._local.paintToolData,
            group = vertice.def.group,
            tmpData = U.polygons[group],
            midpoints = tmpData.midpoints,
            polygon = tmpData.polygon,
            points = tmpData.points,
            x = vertice.def.cx,
            y = vertice.def.cy,
            idx , n;
            
        idx = _getIndexOfPoints([x, y], points);

        points[idx] = [x+dx, y+dy];
        
        polygon.def.points[idx][1] = x+dx;
        polygon.def.points[idx][2] = y+dy;
        
        vertice.def.cx = x+dx;
        vertice.def.cy = y+dy;
        
        n = idx-1 < 0 ? points.length-1 : idx-1;
        midpoints[idx].def.cx += dx/2;
        midpoints[idx].def.cy += dy/2;
        
        midpoints[n].def.cx += dx/2;
        midpoints[n].def.cy += dy/2;
    };
    
    /**
     *  add a vertice. 
     * 
     *  @param {Object} midpoint: a shape object of circle.
     */
    thi$.addVertice = function(midpoint){
        if(!midpoint.def.isMidpoint) return false;
        
        var group = midpoint.def.group,
            U = this._local.paintToolData,
            tmpData = U.polygons[group],
            
            midpoints = tmpData.midpoints,
            polygon = tmpData.polygon,
            points = tmpData.points,
            G = tmpData.graphic,
            
            idx, x, y;
            
        x = midpoint.def.cx;
        y = midpoint.def.cy;
            
        idx = midpoints.indexOf(midpoint);
        
        points.splice(idx+1, 0, [x, y]);
        polygon.def.points.splice(idx+1, 0, [1, x, y]);
        this.modifyPolygon(polygon.def.group);
        
        return tmpData.vertices[idx+1];
    };
    
    /**
     * delete a polygon.
     * 
     * @param {String} group: the id of a polygon.
     * 
     */ 
    thi$.delPolygon = function(group){
        var U = this._local.paintToolData,
            tmpData = U.polygons[group],
            midpoints, vertices, polygon, points, layer, i;
            
        if(!tmpData)return false;
            
        midpoints = tmpData.midpoints;
        vertices = tmpData.vertices;
        polygon = tmpData.polygon;
        points = tmpData.points;
        layer = polygon.getLayer();
            
        for(i = 0; i < vertices.length; i++){
            this.removeShape(vertices[i], layer);
            this.removeShape(midpoints[i], layer);
        }
        this.removeShape(polygon, layer);
        
        delete this._local.paintToolData.polygons[group];
    };
    
    // translate the polygons.
    thi$.translatePolygon = function(dx, dy){
        var matrix = new Matrix({M:[
            [1, 0, 0],
            [0, 1, 0],
            [dx,dy,1]
        ]});
        
        this.transformPolygon(matrix);
    };
    
    // zoom the polygons
    thi$.zoomPolygon = function(multiple, point){
        var m = multiple, p = point,
            matrix = new Matrix({M:[
            [m, 0, 0],
            [0, m, 0],
            [(1-m)*p[0], (1-m)*p[1], 1]
        ]});
        
        this.transformPolygon(matrix);
    };
    
    thi$.transformPolygon = function(matrix){
        var i, p, def, len, pts, polygon,
            vertices, midpoints, lines,
            U = this._local.paintToolData,
            polygons = U.polygons,
            tmpLine = U.tmpLine;
        
        for(p in polygons){
            polygon = polygons[p].polygon;
            vertices = polygons[p].vertices;
            midpoints = polygons[p].midpoints;
            points = polygons[p].points;
            lines = polygons[p].lines;
            
            len = points.length;
            pts = polygon.def.points;
            for(i = 0; i < len; i++){
                // transform the points.
                points[i] = _getNewCoord(points[i], matrix);
               
                // transform the vertices.
                if(vertices.length > 0){
                    def = vertices[i].def;
                    def.cx = points[i][0];
                    def.cy = points[i][1];
                }
                
                // transform the midpoint.
                if(midpoints.length > 0){
                    def = midpoints[i].def;
                    p = _getNewCoord([def.cx, def.cy], matrix);
                    def.cx = p[0];
                    def.cy = p[1];
                }
                
                //  transform the polygon.
                pts[i][1] = points[i][0];
                pts[i][2] = points[i][1];
            };
            
            // transform the lines.
            for(i = 0; lines && i < lines.length; i++){
                def = lines[i].def;
                
                def.x0 = points[i][0];
                def.y0 = points[i][1];
                
                if(points[i+1]){
                    def.x1 = points[i+1][0];
                    def.y1 = points[i+1][1]; 
                }else{
                    def.x1 = points[0][0];
                    def.y1 = points[0][1];
                }
                
            }
                        
            // transform the tmpLine.
            if(tmpLine){
                def = tmpLine.def;
            
                def.x0 = points[len-1][0];
                def.y0 = points[len-1][1];
            }
        }        
    };
    
    /***
     * draw a line.
     * 
     * @param {Object} G: the object of graphic2D
     * @param {Array} p1/p2: the point,([x, y])
     * @param {Object} def: the definition of this line.
     * 
     */
    var _drawLine = function(G, p1, p2, def){
        def = System.objectCopy(def, {
            x0: p1[0],
            y0: p1[1],
            x1: p2[0],
            y1: p2[1]
        },true);
        def.fillStroke = 1;
        return G.drawLine(def);
    };
    
    // remove a shape object.
    thi$.removeShape = function(shape, layer){
        if(!shape) return false;
        layer = layer || shape.getLayer();
        layer.removeChild(shape);
        shape.destroy();
    };
    
    // get the definition of a rectangle.
    var _getRectDef = function(shape){
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
    
    // get the index of a point which is in a points.
    var _getIndexOfPoints = function(point, points){
        for(var i = 0; i < points.length; i++){
            if(point[0] == points[i][0] && point[1] == points[i][1]){
                return i;
            }
        }
        return -1;
    };
    
    var _getNewCoord = function(point, matrix){
        var coord,
        T = new Matrix(
            {M:[[point[0], point[1], 1]]});
            
        coord = Matrix.multiply(T,matrix);
        
        return [coord.M[0][0], coord.M[0][1]];
    };
};
