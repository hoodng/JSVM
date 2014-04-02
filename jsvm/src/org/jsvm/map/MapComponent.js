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
        MapMath = Class.forName("org.jsvm.map.MapMath");

    thi$.setMapInfo = function(){
        this.map.setMapInfo.apply(this.map, arguments);
    };

    thi$.showGeoCode = function(geoCode, shape){
        var G = this.g2d, M = this.map, L = G.curLayer();

        if(L.marker){
            L.removeChild("marker");
        }

        if(!geoCode){
            this.geoCode = null;
            this.marker = null;
            G.draw();
            return;
        }

        this.geoCode = geoCode;

        var mapinfo = M.getMapInfo(),
            rect = mapinfo.mapcoords,
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
        G.draw();
    };

    thi$.doLayout = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            var bounds = this.getBounds(), MBP = bounds.MBP;
            this.map.setSize(bounds.innerWidth, bounds.innerHeight, 7);
            this.g2d.setSize(bounds.innerWidth, bounds.innerHeight, 7);
        }
    }.$override(this.doLayout);

    var _doZoom = function(data){
        var delta = data.delta, 
            dp = this.relative(data.xy),
            zoom = this.map.getZoom();
        if(delta > 0){
            // zoom in
            zoom += 1;
            zoom = Math.min(zoom, this.map.getMaxZoom());
        }else{
            // zoom out
            zoom -= 1;
            zoom = Math.max(zoom, 0);
        }
        this.map.zoom(zoom, dp.x, dp.y);
        if(this.marker){
            this.showGeoCode(this.geoCode, this.marker.def);
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

        shape = G.detectShape(rxy.x, rxy.y);
        if(shape == null){
            U.dragEle= this.map;
        }else if(shape === this.marker) {
            U.dragEle= this.marker;
            U.inDrag = false;
        }
    };

    var _onmousedown = function(e){
        var G = this.g2d, 
            xy = e.eventXY(), rxy = G.relative(xy);
        if(e.button == 1){
            _detectMove.$delay(
                this, 
                System.getProperty("j$vm_longpress", 145), e);
        }
    };

    var _onmousemove = function(e){
        _detectMove.$clearTimer();
        var U = this._local, oxy = U.eventXY, xy = e.eventXY(),
            dx, dy, moveObj;
        if(!U.notified){
            MQ.post(Event.SYS_EVT_MOVING,"");
            U.notified = true;
        }
        
        dx = xy.x - oxy.x; dy = xy.y - oxy.y;
        moveObj = U.dragEle;
        if(moveObj === this.map){
            moveObj.transform(dx, dy);
            if(this.marker){
                this.marker.translate(dx, dy);
            }
        }else if(moveObj === this.marker){
            moveObj.translate(dx, dy);
        }

        U.eventXY = xy;
    };

    var _onmouseup = function(e){
        var U = this._local, M = this.map, 
            mk = this.marker, geoCode = this.geoCode;

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
            geoCode.lng = MapMath.inverseMercatorX(xy.x);
            geoCode.lat = MapMath.inverseMercatorY(xy.y);
            this.fireEvent(new Event("geocodechanged", geoCode, this), true);
        }
        
        U.dragEle = undefined;
    };

    var _onMapMousemove = function(e){
        var M = this.map;
        if(this._local.inDrag != true && M.isReady()){
            var XY = M.getMercatorXY(M.relative(e.eventXY())),
                lng, lat;
            lng = MapMath.inverseMercatorX(XY.x),
            lat = MapMath.inverseMercatorY(XY.y);
            this.board.setData({
                Longitude: lng.$format("###.######"),
                Latitude: lat.$format("###.######")
            });
        }
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

}.$extend(js.awt.Container);

