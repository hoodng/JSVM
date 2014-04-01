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
        Event = js.util.Event, MQ = J$VM.MQ, DOM = J$VM.DOM;

    thi$.setMapInfo = function(){
        this.map.setMapInfo.apply(this.map, arguments);
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
    };
    
    var _onmousewheel = function(e){
        _doZoom.$clearTimer();
        var _e = e.getData();
        _doZoom.$delay(this, 300, {
            delta: _e.wheelDelta || -_e.detail,
            xy : e.eventXY()
        });
    };

    var _onmousedown = function(e){
        var xy = this._local.clickXY = e.eventXY();
        if(e.button == 1){
            Event.attachEvent(document, "mousemove", 0, this, _onmousemove);
            Event.attachEvent(document, "mouseup", 0, this, _onmouseup);
        }
    };

    var _onmousemove = function(e){
        var oxy = this._local.clickXY, xy = e.eventXY();
        this.map.transform(xy.x - oxy.x, xy.y - oxy.y);
        this._local.clickXY = xy;
    };

    var _onmouseup = function(e){
        Event.detachEvent(document, "mousemove", 0, this, _onmousemove);        
        Event.detachEvent(document, "mouseup", 0, this, _onmouseup);
    };

    var _initDef = function(def){
        def.items = ["map","g2d"];
        def["map"] = {
            classType: "org.jsvm.map.TileMapRender",
            css: "position:absolute;"
        };
        def["g2d"] = {
            classType: "js.awt.Graphics2D",
            css: "position:absolute;"
        };
    };

    thi$._init = function(def, Runtime){
        if(typeof def !== "object") return;

        _initDef.call(this, def);

        arguments.callee.__super__.apply(this, arguments);

        var mousewheel = J$VM.firefox ? "DOMMouseScroll" : "mousewheel";
        this.attachEvent(mousewheel, 0, this, _onmousewheel);
        this.attachEvent("mousedown",0, this, _onmousedown);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

