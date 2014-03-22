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
        MAPINFO = {
            maxZoom: 17,
            zoom: 1,
            tileSize: 256,
            mapcoords:[134,454,303,102]
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
        var bound = this.getBounds(), mw, mh, dw, dh,
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

        rect[0] += dh;        
        rect[1] -= dw;
        rect[2] -= dh;
        rect[3] += dw;
        
        this._calcTiles(this.mapinfo, bound);
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
        tr = tr < 0 ? 0 : (tr >= max ? max-1 : tr);
        tb = tb < 0 ? 0 : (tb >= max ? max-1 : tb);
        tl = tl < 0 ? 0 : (tl >= max ? max-1 : tl);


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
                        image.src = this._getImageUrl(mapinfo.zoom, j, i);
                    }
                }
                image.style.left = tile.x+"px";
                image.style.top = tile.y+"px";
                image.style.visibility = "visible";
                _tiles[key] = tile; 
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
        
        if(mx < 0 || mx > 1 || my < 0 || my > 1) return;

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
            bound = this.getBounds();

        rect[3] -= offsetX;
        rect[1] -= offsetX;
        rect[0] -= offsetY;
        rect[2] -= offsetY;

        this._calcTiles(this.mapinfo, bound);        
    };

    thi$.onResized = function(){
        arguments.callee.__super__.apply(this, arguments);

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

    var _onsizing = function(){
        var bound = this.getBounds(), obound = this._local.obound;
        obound.absX = bound.absX;
        obound.absY = bound.absY;
    };

    thi$._init = function(def, Runtime){
        if(typeof def !== "object") return;

        def.css = def.css || "background-color:#e0e0e0;";
        arguments.callee.__super__.apply(this, arguments);

        this.view.style.overflow = "hidden";
        this.tileservice = def.tileservice || TileServices["GoogleMap"];
        this.tiles = {};
        this.cache = new (Class.forName("js.util.MemoryStorage"))(64);
        this.count = 0;
        this._local.obound = {absX: 0, absY: 0};
        MQ.register(Event.SYS_EVT_RESIZING, this, _onsizing);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Component);

