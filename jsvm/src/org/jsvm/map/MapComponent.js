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

$package("org.jsvm.map");

$import("js.awt.Container");
$import("js.awt.Graphics2D");
$import("org.jsvm.map.TileMapRender");
$import("org.jsvm.map.PaintTool");

/**
 * 
 */
org.jsvm.map.MapComponent = function(def, Runtime){
    var CLASS = org.jsvm.map.MapComponent,
        thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System, 
        Event = js.util.Event, MQ = J$VM.MQ, DOM = J$VM.DOM,
        MapMath = Class.forName("org.jsvm.map.MapMath"),
        DBLPATTERN = "###.######";

    thi$.setMapInfo = function(mapinfo){
        mapinfo = mapinfo || {
            maxZoom: 17,
            zoom: 2,
            tileSize: 256,
            mapcoords:[0, 1023, 1023, 0]
        };
        this.map.setMapInfo.call(this.map, mapinfo);
    };

    thi$.autoFit = function(autoFit, geoCode){
        var U = this._local;
        U.autoFit = autoFit;
        if(U.autoFit == true){
            if(geoCode){
                this.setMapInfo(this.map.getIdeaMapInfo(geoCode));
            }
        }else{
            this.setMapInfo();
        }
    };

    thi$.showGeoCode = function(geoCode, shape){
        var G = this.g2d, M = this.map, L = G.curLayer(),
            mapinfo;

        L.removeChild("marker");
        L.removeChild("boundingbox");

        if(!geoCode){
            this.geoCode = null;
            this.marker = null;
            this.boundingbox = null;
            _showMapinfo.call(this, {lng:0.0, lat:0.0});
        }else{
            this.geoCode = geoCode;
            mapinfo = M.getMapInfo();
            _drawBoundingBox.call(this, G, mapinfo, geoCode);
            _drawMarker.call(this, G, mapinfo, geoCode, shape);
            _showMapinfo.call(this, {lng:geoCode.lng, lat:geoCode.lat});
        }

        G.draw();
    };

    var _drawMarker = function(G, mapinfo, geoCode, shape){
        var rect = mapinfo.mapcoords,
            size = mapinfo.tileSize << mapinfo.zoom,
            x = MapMath.lng2pixel(geoCode.lng, size) - rect[3],
            y = MapMath.lat2pixel(geoCode.lat, size) - rect[0];

        shape = shape || {type: "circle",
                          r: 7,
                          fillStroke: 2,
                          fillStyle: "#FF0000",
                          fillOpacity: 0.8,
                          capture: true};
        shape.id = "marker";
        shape.cx = x;
        shape.cy = y;
        this.marker = G.drawShape(shape.type, shape);
    };

    var _drawBoundingBox = function(G, mapinfo, geoCode, shape){
        var rect = mapinfo.mapcoords, 
            bound = geoCode.boundingbox,
            size = mapinfo.tileSize << mapinfo.zoom,
            t = MapMath.lat2pixel(bound[0], size) - rect[0],
            r = MapMath.lng2pixel(bound[1], size) - rect[3],
            b = MapMath.lat2pixel(bound[2], size) - rect[0],
            l = MapMath.lng2pixel(bound[3], size) - rect[3];

        shape = shape || {type: "rect",
                          strokeStyle: "#ffd070",
                          fillStroke: 3,
                          fillStyle: "#ffdf7c",
                          fillOpacity: 0.3,
                          capture: true,
                          lineWidth: 2};
        shape.id = "boundingbox";
        shape.x = l;
        shape.y = t;
        shape.width = r-l;
        shape.height = b-t;
        
        this.boundingbox = G.drawRect(shape);
    };
    
    thi$.doLayout = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            var bounds = this.getBounds(), MBP = bounds.MBP;
            this.map.setSize(bounds.innerWidth, bounds.innerHeight, 7);
            this.g2d.setSize(bounds.innerWidth, bounds.innerHeight, 7);
        }
    }.$override(this.doLayout);

    var _doZoom = function(data){
        var delta = data.delta, multiple = 1,
            dp = this.relative(data.xy),
            zoom = this.map.getZoom();
        if(delta > 0 && zoom != this.map.getMaxZoom()){
            // zoom in
            zoom += 1;
            multiple = 2;
            
        }else if(delta < 0 && zoom != 0){
            // zoom out
            zoom -= 1;
            multiple = 0.5;
        }
        this.map.zoom(zoom, dp.x, dp.y);
        
        if(this.geoCode){
            this.showGeoCode(this.geoCode, this.marker.def);            
        }else{
            _showMapinfo.call(this);
        }
        
        if(this._local.drawPolygon){
            this.zoomPolygon(multiple, [dp.x, dp.y]);
            this.g2d.drawing();
        }
    };
    
    var _onmousewheel = function(e){
        _doZoom.$clearTimer();
        var _e = e.getData();
        _doZoom.$delay(this, 300, {
            delta: _e.wheelDelta || -_e.detail,
            xy : e.eventXY()
        });
    };

    var _detectMove = function(e){
        var U = this._local, G = this.g2d, 
            xy = U.eventXY = e.eventXY(), 
            rxy = G.relative(xy), shape;

        Event.attachEvent(document, "mousemove", 0, this, _onmousemove);
        Event.attachEvent(document, "mouseup", 0, this, _onmouseup);
        U.inDrag = true;
        U.dragEle = null;

        shape = G.detectShape(rxy.x, rxy.y);
        if(shape == null){
            U.dragEle= this.map;
        }else if(Runtime.isEditMode()){
            if(shape == this.marker){
                U.dragEle= this.marker;
                U.inDrag = false;
            }else if(shape == this.boundingbox){
                U.resizeInfo = this.ptInRect(rxy, shape, 12);
                U.dragEle= this.boundingbox;
                U.inDrag = false;
            }else if(U.drawPolygon === "modify"){
                if(shape.def.type == "circle"){
                    if(shape.def.isMidpoint){
                        shape = this.addVertice(shape);
                        G.draw();
                        U.moved = true;
                    }
                    U.dragEle = shape;
                    U.inDrag = false;
                }else if(shape.def.type == "polygon"){
                    this.selectPolygon(shape.def.group);
                }
            }
        }
    };

    var _onmousedown = function(e){
        var U = this._local, G = this.g2d, group,
            xy = e.eventXY(), rxy = G.relative(xy);
        if(e.button == 1){
            if(U.drawPolygon){
                _detectMove.call(this, e);
            }else{
                _detectMove.$delay(
                    this, 
                    System.getProperty("j$vm_longpress", 145), e);
            }
        }else if(e.button == 2){
            group = this.finishPolygon();
            if(group){
                this.selectPolygon(group);
                U.drawPolygon = "modify";
                G.draw();
                this.detachEvent("mousemove", 0, this, _drawTmpLine);
            }
        }
    };
    
    var _onmousemove = function(e){
        _detectMove.$clearTimer();
        var U = this._local, oxy = U.eventXY, xy = e.eventXY(),
            G = this.g2d, dx, dy, moveObj, info, info2, point;
        if(!U.notified){
            MQ.post(Event.SYS_EVT_MOVING,"");
            U.notified = true;
        }
        
        dx = xy.x - oxy.x; dy = xy.y - oxy.y;
        moveObj = U.dragEle;
        if(moveObj === this.marker){
            moveObj.translate(dx, dy);
        }else if(moveObj === this.boundingbox){
            info = U.resizeInfo;
            if(info.inBorder.eastwest == "" 
                    && info.inBorder.northsouth == ""){
                moveObj.translate(dx, dy);
            }else{
                info2 = this.dragResizeRect(dx, dy, info, moveObj);
                U.resizeInfo = info2.pointInfo;
                G.drawing();
            }
        }else if(moveObj && moveObj.def.type == "circle"){
            this.moveVertice(moveObj, dx, dy);
            G.drawing();
        }else{
            this.map.transform(dx, dy);
            if(this.marker){
                this.marker.translate(dx, dy);
            } 
            if(this.boundingbox){
                this.boundingbox.translate(dx,dy);
            }
            if(this._local.drawPolygon){
                this.translatePolygon(dx, dy);
                this.g2d.drawing();
            }
        }
        U.eventXY = xy;
        
        if(dx != 0 || dy != 0){
            U.moved = true;
        }
    };

    var _onmouseup = function(e){
        var U = this._local, M = this.map, G = this.g2d,
            mk = this.marker, bbox = this.boundingbox,
            geoCode = this.geoCode, xy = U.eventXY = e.eventXY(), 
            rxy = G.relative(xy), shape, group, tmp;

        _detectMove.$clearTimer();
        MQ.post(Event.SYS_EVT_MOVED, "");

        Event.detachEvent(document, "mousemove", 0, this, _onmousemove);        
        Event.detachEvent(document, "mouseup", 0, this, _onmouseup);
        U.notified = false;
        U.inDrag = false;
        
        if(U.dragEle && U.dragEle === mk){
            var def = mk.def, TR = mk.getTransform(), xy;
            def.cx += TR.dx;
            def.cy += TR.dy;
            mk.setTransform(1,0,0,1,0,0);
            xy = M.getMercatorXY({x:def.cx, y:def.cy});
            geoCode.lng = parseFloat(MapMath.inverseMercatorX(xy.x).$format(DBLPATTERN));
            geoCode.lat = parseFloat(MapMath.inverseMercatorY(xy.y).$format(DBLPATTERN));
            this.fireEvent(new Event("geocodechanged", geoCode, this), true);
        }else if(U.dragEle && U.dragEle === bbox){
            _boundingBoxChanged.call(this);
        }
        
        if(!U.moved){
            shape = G.detectShape(rxy.x, rxy.y);
            if(U.drawPolygon === "drawing"){
                tmp = this.getPaintToolData();
                vertices = tmp.polygons[tmp.drawing].vertices;
                
                if(shape && shape === vertices[0]){
                    group = this.finishPolygon();
                    if(group){
                        this.selectPolygon(group);
                        U.drawPolygon = "modify";
                        this.detachEvent("mousemove", 0, this, _drawTmpLine);
                    }
                }else{
                    this.drawPolygon([rxy.x, rxy.y]);
                }
            }else if(U.drawPolygon === "modify" 
                    && shape &&  shape.def.isVertice === true){
                this.rmPtFromPolygon(shape);
            }
            G.draw();
        }
                
        U.moved = false;
        U.dragEle = undefined;
    };

    var _onMapMousemove = function(e){
        var M = this.map;
        if(this._local.inDrag != true && M.isReady()){
            var XY = M.getMercatorXY(M.relative(e.eventXY())),
                lng, lat;
            lng = MapMath.inverseMercatorX(XY.x),
            lat = MapMath.inverseMercatorY(XY.y);
            _showMapinfo.call(this, {lng: lng, lat:lat});
        }
    };
    
    var _showMapinfo = function(data){
        data = data || this.board.getData();
        if(data.Longitude){
            data.lng = parseFloat(data.Longitude);
            data.lat = parseFloat(data.Latitude);
        }
        this.board.setData({
            Longitude: data.lng.$format(DBLPATTERN),
            Latitude:  data.lat.$format(DBLPATTERN),
            "Zoom level": " "+this.map.mapinfo.zoom
            //"rect[0]" : this.map.mapinfo.mapcoords[0],
            //"rect[1]" : this.map.mapinfo.mapcoords[1],
            //"rect[2]" : this.map.mapinfo.mapcoords[2],
            //"rect[3]" : this.map.mapinfo.mapcoords[3]
        });
    };
        
    var _boundingBoxChanged = function(){
        var t, r, b, l, xy1, xy2,x1, x2, 
            U = this._local, M = this.map,
            bbox = this.boundingbox, geoCode = this.geoCode,
            def = bbox.def, mapinfo = M.mapinfo, TR = bbox.getTransform();
            
        def.x += TR.dx;
        def.y += TR.dy;
        bbox.setTransform(1,0,0,1,0,0);
        
        // the boundingbox can not across two map.
        x1 = -mapinfo.mapcoords[3];
        x2 = x1 + (mapinfo.tileSize << mapinfo.zoom);
        if(def.x + def.width > x2 && def.x < x2){
            def.width = x2 - def.x;
        }else if(def.x < x1 && def.x + def.width > x1){
            def.width = def.width + def.x - x1;
            def.x = x1;
        }
        
        xy1 = M.getMercatorXY({x: def.x, y: def.y});
        xy2 = M.getMercatorXY({x: def.x+def.width, y: def.y+def.height});
        geoCode.boundingbox[0] = parseFloat(MapMath.inverseMercatorY(xy1.y).$format(DBLPATTERN));
        geoCode.boundingbox[1] = parseFloat(MapMath.inverseMercatorX(xy2.x).$format(DBLPATTERN));
        geoCode.boundingbox[2] = parseFloat(MapMath.inverseMercatorY(xy2.y).$format(DBLPATTERN));
        geoCode.boundingbox[3] = parseFloat(MapMath.inverseMercatorX(xy1.x).$format(DBLPATTERN));
        
        this.fireEvent(new Event("geocodechanged", geoCode, this), true);
    };
    
    thi$.startDrawPolygon = function(){
        this.initDrawPolygon(this.g2d);
        this._local.drawPolygon = "drawing";
        this.attachEvent("mousemove", 0, this, _drawTmpLine);
    };
    
    var _drawTmpLine = function(e){
        var tmpData = this.getPaintToolData(),
            line = tmpData.tmpLine,
            points = tmpData.polygons[tmpData.drawing].points, 
            U = this._local, oxy = U.eventXY, xy = e.eventXY(),
            G = this.g2d, dx, dy, len;
            
        len = points.length;
        
        if(line){
            dx = xy.x - oxy.x; dy = xy.y - oxy.y; 
            line.def.x0 = points[len-1][0];
            line.def.y0 = points[len-1][1];
            line.def.x1 = e.offsetX;
            line.def.y1 = e.offsetY;
            G.drawing();
        }
        
    };
    
    /**
     * @param {String} group: the id of a polygon.
     */
    thi$.selectPolygon = function(group){
        var polygons = this.getPaintToolData().polygons,
            selectGroup = this._local.selectedPolygon;
        if(selectGroup === group) return false;
        
        if(polygons[selectGroup]){
            this.modifyPolygon(selectGroup, true);
        }
        
        this.modifyPolygon(group);
        this._local.selectedPolygon = group;
        
        this.g2d.draw();
    };
    
    thi$.delSelectedPolygon = function(){
        this.delPolygon(this._local.selectedPolygon);
        this.g2d.draw();
    };
    
    /***
     * 
     * @param {Object} def: include "strokeStyle", "strokeOpacity",
     *                              "fillStyle","fillOpacity" and "lineWidth"
     */
    thi$.changePolygonDef = function(def){
        var polygons = this.getPaintToolData().polygons,
            polygon = polygons[this._local.selectedPolygon];
            
        if(!polygon) return false;
        
        for(p in def){
            polygon.polygon.def[p] = def[p];
        }
        this.g2d.drawing();
    };
    
    /**
     * get some data of polygon, like the polygon's longitude and latitude.
     */
    thi$.getPolygonData = function(){
        var obj, xy, points, point, 
            lng, lat, arr = [], M = this.map,
            polygons = this.getPaintToolData().polygons;
        
        for(p in polygons){
            obj = {
                id: p,
                points: []
            };
            points = polygons[p].points;
            for(var i = 0; i < points.length; i++){
                xy = M.getMercatorXY({x: points[i][0], y: points[i][1]});
                lng = parseFloat(MapMath.inverseMercatorX(xy.x).$format(DBLPATTERN));
                lat = parseFloat(MapMath.inverseMercatorY(xy.y).$format(DBLPATTERN));
                
                obj.points.push({lng: lng, lat: lat});
            }
            arr.push(obj);
        }
        return arr;
    };

    var _initDef = function(def){
        def.items = ["map","g2d", "board"];
        def["map"] = {
            classType: "org.jsvm.map.TileMapRender",
            stateless: true,
            css: "position:absolute;"
        };
        def["g2d"] = {
            classType: "js.awt.Graphics2D",
            stateless: true,
            css: "position:absolute;",
            capture: true
        };
        def["board"] = {
            classType: "js.awt.Board",
            stateless: true,
            css: "position:absolute;left:5px;",
            data:{
                Longitude: "000.000000",
                Latitude: "000.000000"
            }
        };
    };

    thi$._init = function(def, Runtime){
        if(typeof def !== "object") return;

        _initDef.call(this, def);

        arguments.callee.__super__.apply(this, arguments);

        var mousewheel = J$VM.firefox ? "DOMMouseScroll" : "mousewheel";
        this.attachEvent(mousewheel, 0, this, _onmousewheel);
        this.attachEvent("mousedown",0, this, _onmousedown);
        this.attachEvent("mousemove", 0, this, _onMapMousemove);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Container).$implements(org.jsvm.map.PaintTool);

