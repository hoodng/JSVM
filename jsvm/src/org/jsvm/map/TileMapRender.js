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

$import("js.awt.Component");

org.jsvm.map.TileServices = {
    "GoogleMap":{
        name: "GoogleMap Road Map",
        server: [
            "http://mts0.googleapis.com/vt?lyrs=m@0&z=${z}&x=${x}&y=${y}",
            "http://mts1.googleapis.com/vt?lyrs=m@0&z=${z}&x=${x}&y=${y}",
            "http://mts2.googleapis.com/vt?lyrs=m@0&z=${z}&x=${x}&y=${y}",
            "http://mts3.googleapis.com/vt?lyrs=m@0&z=${z}&x=${x}&y=${y}"
        ]
    },
    
    "GoogleSat":{
        name: "GoogleMap Satellite Map",
        server: [
            "http://mt0.googleapis.com/vt?lyrs=s@0,m@0&z=${z}&x=${x}&y=${y}",
            "http://mt1.googleapis.com/vt?lyrs=s@0,m@0&z=${z}&x=${x}&y=${y}",
            "http://mt2.googleapis.com/vt?lyrs=s@0,m@0&z=${z}&x=${x}&y=${y}",
            "http://mt3.googleapis.com/vt?lyrs=s@0,m@0&z=${z}&x=${x}&y=${y}"
        ]
    },
    
    "GoogleTrn":{
        name: "GoogleMap Terrain Map",
        server: [
            "http://mt0.google.com/vt?lyrs=t@0,r@0&z=${z}&x=${x}&y=${y}",
            "http://mt1.google.com/vt?lyrs=t@0,r@0&z=${z}&x=${x}&y=${y}",
            "http://mt2.google.com/vt?lyrs=t@0,r@0&z=${z}&x=${x}&y=${y}",
            "http://mt3.google.com/vt?lyrs=t@0,r@0&z=${z}&x=${x}&y=${y}"
        ]
    },
    
    "OpenStreetMap":{
        name: "OpenStreetMap Map",
        server: [
            "http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
            "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
            "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"
        ]
    },
    
    "CycleMap":{
        name: "OpenStreetMap Cycle Map",
        server: [
            "http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
            "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",    
            "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"
        ]
    },
    
    "TransportMap":{
        name: "OpenStreetMap Transport Map",
        server: [
            "http://a.tile2.opencyclemap.org/transport/${z}/${x}/${y}.png",
            "http://b.tile2.opencyclemap.org/transport/${z}/${x}/${y}.png",    
            "http://c.tile2.opencyclemap.org/transport/${z}/${x}/${y}.png"
        ]
    },
    
    "MapQuestMap":{
        name: "MapQuest Map",
        server: [
            "http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
            "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
            "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
            "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png"
        ]
    },
    
    "MapQuestSat":{
        name: "MapQuest Satellite Map",
        server: [
            "http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
            "http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
            "http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
            "http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png"
        ]
    },

    "MapBoxMap":{
        name: "MapBox Map",
        server: [
            "http://a.tiles.mapbox.com/v3/hoodng.i07o8plf/${z}/${x}/${y}.png/",
            "http://b.tiles.mapbox.com/v3/hoodng.i07o8plf/${z}/${x}/${y}.png/",
            "http://c.tiles.mapbox.com/v3/hoodng.i07o8plf/${z}/${x}/${y}.png/",
            "http://d.tiles.mapbox.com/v3/hoodng.i07o8plf/${z}/${x}/${y}.png/"
        ]
    },

    "MapBoxSat":{
        name: "MapBox Satellite Map",
        server: [
            "http://a.tiles.mapbox.com/v3/hoodng.i07o8plf/${z}/${x}/${y}.png/",
            "http://b.tiles.mapbox.com/v3/hoodng.i07o8plf/${z}/${x}/${y}.png/",
            "http://c.tiles.mapbox.com/v3/hoodng.i07o8plf/${z}/${x}/${y}.png/",
            "http://d.tiles.mapbox.com/v3/hoodng.i07o8plf/${z}/${x}/${y}.png/"
        ]
    },

    "MapBoxTer":{
        name: "MapBox Terrian Map",
        server: [
            "http://a.tiles.mapbox.com/v3/hoodng.i096lhfd/${z}/${x}/${y}.png/",
            "http://b.tiles.mapbox.com/v3/hoodng.i096lhfd/${z}/${x}/${y}.png/",
            "http://c.tiles.mapbox.com/v3/hoodng.i096lhfd/${z}/${x}/${y}.png/",
            "http://d.tiles.mapbox.com/v3/hoodng.i096lhfd/${z}/${x}/${y}.png/"
        ]
    }
};

/**
 * 
 */
org.jsvm.map.TileMapRender = function(def, Runtime){
    var CLASS = org.jsvm.map.TileMapRender,
        thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System, 
        Event = js.util.Event, MQ = J$VM.MQ, DOM = J$VM.DOM,
        TileServices = org.jsvm.map.TileServices,
        MapMath = Class.forName("org.jsvm.map.MapMath"),
        MAPINFO = {
            maxZoom: 17,
            zoom: 1,
            tileSize: 256,
            mapcoords:[0, 511, 511, 0]
        };
    
    /**
     * {
     *    maxZoom: 17,
     *    zoom: 0,
     *    tile: 256,
     *    rect_map:[top, right, bottom, left],
     *    
     * }
     */
    thi$.setMapInfo = function(mapinfo, service){
        if(service){
            this.tileservice = service;
        }
        this.mapinfo = mapinfo || System.objectCopy(MAPINFO, {});
        var bound = this.getBounds(), mw, mh, dw, dh, cx, cy,
            rect = this.mapinfo.mapcoords,
            size = this.mapinfo.tileSize << this.mapinfo.zoom;
        
        if(bound.width >= size){
            rect[3] = 0;
            rect[1] = size-1;
        }

        if(bound.height >= size){
            rect[0] = 0;
            rect[2] = size-1;
        }

        mw = rect[1]-rect[3]+1;
        mh = rect[2]-rect[0]+1;
        dw = (mw - bound.width) /2.0;
        dh = (mh - bound.height)/2.0;

        rect[1] -= dw;
        rect[3] += dw;
        rect[0] += dh;
        rect[2] -= dh;    

        if(bound.width < size){
            if(rect[3]<0.0){
                rect[3] = 0;
                rect[1] = bound.width;
            }else if(rect[1] > size){
                rect[1] = size - 1;
                rect[3] = rect[1] - bound.width;
            }
        }

        if(bound.height < size){
            if(rect[0] < 0){
                rect[0] = 0;
                rect[2] = bound.height;
            }else if(rect[2] > size){
                rect[2] = size - 1;
                rect[0] = rect[2] - bound.height;
            }
        }

        cx = (rect[1] - rect[3])/2.0;
        cy = (rect[2] - rect[0])/2.0;
        this.zoom(this.mapinfo.zoom, cx, cy);

    };

    thi$.getMapInfo = function(){
        return this.mapinfo;
    };

    thi$.isReady = function(){
        return this.mapinfo != undefined;
    };

    thi$.getMapCoords = function(){
        return this.getMapInfo().mapcoords;
    };

    thi$.getMercatorXY = function(xy){
        var mapinfo = this.mapinfo, rect = mapinfo.mapcoords,
            size = mapinfo.tileSize << mapinfo.zoom,

            mx = (xy.x + rect[3])/size, my = (xy.y + rect[0])/size;
                    while(mx < 0){
                mx += 1;
            }

            while(mx > 1){
                mx -= 1;
            }

		    my = my < 0 ? 0 : (my > 1 ? 1 : my);
        
        return {x: mx, y:my };
    };

    var _onloadCallback = function(image){
        image.style.visibility = "visible";
    };

    thi$._calcTiles = function(mapinfo, bound){
        var rect = mapinfo.mapcoords, max = 1 << mapinfo.zoom,
            size = mapinfo.tileSize, tile, key, image,
            tt = Math.floor(rect[0]/size),
            tr = Math.floor(rect[1]/size),
            tb = Math.floor(rect[2]/size),
            tl = Math.floor(rect[3]/size),
            tiles = this.tiles, _tiles = {}, 
            cache = this.cache;
        
        tt = tt < 0 ? 0 : (tt >= max ? max-1 : tt);
        tb = tb < 0 ? 0 : (tb >= max ? max-1 : tb);

        this.areas = [];

        for(var i=tt; i<=tb; i++){
            for(var j=tl; j<=tr; j++){
                key = [mapinfo.zoom, j, i].join("-");
                tile = tiles[key];
                if(tile){
                    delete tiles[key];
                }else{
                    tile = {tx: j, ty: i};
                }
                tile.x = j*size - rect[3];
                tile.y = i*size - rect[0];
                image = tile.image;
                if(!image){
                    image = tile.image = this._getCachedImage(key);
                    if(DOM.getAttribute(image, "__key__") != key){
                        image.src = this._getImageUrl(
                            mapinfo.zoom, (j<0 ? Math.abs(max+j) : j)%max, i);
                    }
                }
                image.style.left = tile.x+"px";
                image.style.top = tile.y+"px";
                image.style.visibility = "visible";
                _tiles[key] = tile; 

                if(i == tt){
                    _split.call(this, j, size, max);
                }
            }
        }

        for(key in tiles){
            tile = tiles[key];
            image = tile.image;
            if(image){
                image.style.visibility = "hidden";
                DOM.setAttribute(image, "__key__", key);
                cache.setItem(key, image);
            }
        }

        var obound = this._local.obound;
        obound.absX =  bound.absX;
        obound.absY =  bound.absY;

        this.tiles = _tiles;
    };

    var _split = function(j, size, max){
        var tx = (j < 0 ? Math.abs(max+j) : j)%max,
            areas = this.areas;
        if(areas.length == 0){
            if(j < 0){
                if(tx == 0){
                    areas.push({x: j*size});
                }else{
                    areas.push({x: (j-tx)*size});
                }
            }else{
                areas.push({x: 0});
            }
        }else if(tx == 0){
            areas.push({x: j*size});
        }
    };

    thi$._getImageUrl = function(zoom, x, y){
        var servers = this.tileservice.server,
            entry = servers[this.count++%servers.length];
        return entry.replace("${z}", zoom).replace("${x}", x).replace("${y}", y);
    };

    thi$._getCachedImage = function(key){
        var cache = this.cache, img = cache.removeItem(key);
        if(!img){
            img = J$VM.DOM.createElement("IMG");
            img.style.position = "absolute";
            img.style.width = "256px";
            img.style.height= "256px";
            img.style.visibility = "hidden";
            img.className="map";
            img.src="data:image/png;base64,R0lGODlhAQABAIAAAP8zzAAAACH5BAEAAAAALAAAAAABAAEAQAIChFEAOwA=";
            this.view.appendChild(img);
        }
        return img;
    };

    thi$.getZoom = function(){
        return this.mapinfo.zoom;
    };

    thi$.getMaxZoom = function(){
        return this.mapinfo.maxZoom;
    };

    thi$.zoom = function(zoom, dx, dy, rBase, bBase){
        var mapinfo = this.mapinfo, rect = mapinfo.mapcoords,
            bound = this.getBounds(), k1, k2, mx, my,
            cx = rBase ? rect[1] - dx : rect[3] + dx, 
            cy = bBase ? rect[2] - dy : rect[0] + dy;

        k1 = mapinfo.tileSize << mapinfo.zoom, 
        k2 = mapinfo.tileSize << zoom, 
        mx = cx/k1, my = cy/k1;

        while(mx < 0){
            mx += 1;
        }

        while(mx > 1){
            mx -= 1;
        }

        my = my < 0 ? 0 : (my > 1 ? 1 : my);

        if(rBase){
            rect[1] = mx * k2 + dx;
            rect[3] = rect[1] - bound.width + 1;
        }else{
            rect[3] = mx * k2 - dx;
            rect[1] = rect[3] + bound.width - 1;
        }

        if(bBase){
            rect[2] = my * k2 + dy;
            rect[0] = rect[2] - bound.height + 1;
        }else{
            rect[0] = my * k2 - dy;
            rect[2] = rect[0] + bound.height - 1;
        }

        mapinfo.zoom = zoom;
        mapinfo.rBase = rBase;
        mapinfo.bBase = bBase;
        this._calcTiles(this.mapinfo, bound);        
    };

    thi$.transform = function(offsetX, offsetY){
        var mapinfo = this.mapinfo, rect = mapinfo.mapcoords,
            cx, cy, dx, dy;
        
        dx = rect[3];
        dy = rect[0];

        rect[0] -= offsetY;
        rect[1] -= offsetX;
        rect[2] -= offsetY;
        rect[3] -= offsetX;

        cx = (rect[1] - rect[3])/2.0;
        cy = (rect[2] - rect[0])/2.0;
        this.zoom(mapinfo.zoom, cx, cy);
        
        dx -= rect[3];
        dy -= rect[0];

        return {dx: dx, dy:dy};
    };

    thi$.onResized = function(){
        var mapinfo = this.mapinfo, cbound = this.getBounds(),
            obound, rect, cx, cy, rBase, bBase;
        if(mapinfo){
            obound = this._local.obound;
            rect = mapinfo.mapcoords;
            cx = (rect[1] - rect[3])/2.0;
            cy = (rect[2] - rect[0])/2.0;
            rBase = (cbound.absX != obound.absX);
            bBase = (cbound.absY != obound.absY);
            this.zoom(mapinfo.zoom, cx, cy, rBase, bBase);
        }

        $super(this);

    }.$override(this.onResized);

    thi$.getRenderInfo = function(){
        var bound = this.getBounds(), MBP = bound.MBP;
        return {
            x: bound.absX,
            y: bound.absY,
            width: bound.width,
            height: bound.height,
            padding:[MBP.paddingTop, 
                     MBP.paddingRight, 
                     MBP.paddingBottom, 
                     MBP.paddingLeft],
            resolution: J$VM.supports.logicalXDPI
        };
    };

    thi$.getIdeaMapInfo = function(geoCode, zoom){
        var mapinfo = this.mapinfo, 
            rect = geoCode.boundingbox,
            bound = this.getBounds(), 
            size, x, y, ret = {
                maxZoom: mapinfo.maxZoom,
                tileSize: mapinfo.tileSize,
                mapcoords:[0, 0, 0, 0]
            }, mt, mr, mb, ml, vw, vh, mw, mh, dw, dh;

        ret.zoom = Math.min(
            (Class.isNumber(zoom) ? zoom : 4), 
            this.calcZoom(rect));
        size = mapinfo.tileSize << ret.zoom;
        
        mt = MapMath.lat2pixel(rect[0], size);
        mr = MapMath.lng2pixel(rect[1], size);
        mb = MapMath.lat2pixel(rect[2], size);
        ml = MapMath.lng2pixel(rect[3], size);
		vw = bound.width;
		vh = bound.height;
		
        if (vw >= size) {
			ml = 0;
			mr = size - 1;
		}

		if (vh >= size) {
			mt = 0;
			mb = size - 1;
        }
        
		mw = mr - ml + 1;
		mh = mb - mt + 1;
		dw = (mw - vw) / 2.0;
		dh = (mh - vh) / 2.0;

		mt += dh;
		mb -= dh;
		ml += dw;
		mr -= dw;

		if (vw < size) {
			if (ml < 0.0) {
				ml = 0;
				mr = vw;
			} else if (mr > size) {
				mr = size - 1;
				ml = mr - vw;
			}
		}

		if (vh < size) {
			if (mt < 0.0) {
				mt = 0;
				mb = vh;
			} else if (mb > size) {
				mb = size - 1;
				mt = mb - vh;
			}
		}

        rect = ret.mapcoords;
        rect[0] = mt;
        rect[1] = mr;
        rect[2] = mb;
        rect[3] = ml;
        
        return ret;
    };


	thi$.calcZoom = function(rect) {
		var mapinfo = this.mapinfo, bound  = this.getBounds(),
		    d = MapMath.MIN_DIFF,
		    lngMd = Math.abs(MapMath.mercatorX(rect[1])
				             - MapMath.mercatorX(rect[3])),
            latMd = Math.abs(MapMath.mercatorY(rect[2])
				             - MapMath.mercatorY(rect[0])),
            wZoom, hZoom;

		lngMd = lngMd < d ? d : lngMd;
		latMd = latMd < d ? d : latMd;

        wZoom = _calcZoom0.call(this, lngMd, bound.innerWidth, mapinfo.tileSize);
		hZoom = _calcZoom0.call(this, latMd, bound.innerHeight,mapinfo.tileSize);

		return Math.min(wZoom, hZoom);
	};

	var _calcZoom0 = function(md, v, tileSize) {
		var zoom = 0, w = md * tileSize;
		while (w < v) {
			w = md * (tileSize << ++zoom);
		}
		zoom = (zoom == 0) ? 0 : zoom - 1;
		return zoom;
	};

    thi$.repeatXPoint = function(point, areas){
        var p, ret = [];
        areas = areas || this.areas;

        for(var i=0, len=areas.length; i<len; i++){
            ret.push([point[0]+areas[i].x, point[1]]);
        }
        return ret;
    };

    thi$.repeatXPoly = function(poly){
        var areas = this.areas, i, len, p, ret=[];

        for(i=0, len=areas.length; i<len; i++){
            ret.push([]);
        }

        for(i=0, len=poly.length; i<len; i++){
            p = this.repeatXPoint(poly[i], areas);
            for(var j=0, jen=p.length; j<jen; j++){
                ret[j].push(p[j]);
            }
        }
        return ret;
    };

    var _onsizing = function(){
        var bound = this.getBounds(), obound = this._local.obound;
        obound.absX = bound.absX;
        obound.absY = bound.absY;
    };

    thi$._init = function(def, Runtime){
        if(typeof def !== "object") return;

        def.css = def.css || "background-color:#e0e0e0;";
        $super(this);

        this.view.style.overflow = "hidden";
        this.tileservice = def.tileservice || TileServices["MapBoxTer"];
        this.tiles = {};
        this.cache = new (Class.forName("js.util.MemoryStorage"))(128);
        this.count = 0;
        this._local.obound = {absX: 0, absY: 0};
        MQ.register(Event.SYS_EVT_RESIZING, this, _onsizing);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Component);

