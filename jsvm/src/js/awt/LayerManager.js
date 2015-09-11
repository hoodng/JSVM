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
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */
$package("js.awt");

/**
 * Coordinate of nofly area:
 *   B             C             
 *   |-------------|
 *   |             |
 *   |-------------|
 *   A             D
 */
js.awt.LayerManager = function(def, Runtime, view){
    
    var CLASS = js.awt.LayerManager, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ;
    
    thi$.removeComponent = function(comp){
        comp = $super(this);
        this.stack.remove(comp); 
    }.$override(this.removeComponent);
    
    thi$.removeAll = function(){
        this.stack.clear();
        $super(this);
    }.$override(this.removeAll);
    
    thi$.cleanLayers = function(e){
        if(window.parent != window.self){
            MQ.post("js.awt.event.LayerEvent", "", [], window.parent);
        }

        return this.onHide(e);
    };
    
    thi$.indexOf = function (layer) {
        return this.stack.indexOf(layer);
    };
    
    var _calHRect = function (rect, w, h) {
        var bodySize = this._bodySize, hRect = {x : 0, y : 0},
            x, y, avWidth, avHeight, 
            area/* Area: The rectangle of an area in which the current layer is lying*/;
        
        // A
        x = rect.x;
        y = rect.y + rect.height;
        avWidth = bodySize.width - x;
        avHeight = bodySize.height - y;
        area = {AID : "A", x : x, y : y, width : avWidth, height : avHeight};
        
        if (avHeight >= h && avWidth >= w) {
            hRect.x = x;
            hRect.y = y;
            hRect.area = area;
            
            return hRect;
        }
        
        var bAvRect = {
            x : x, /* Optimal horizontal offset */
            y : y, /* Optimal virtical offset */
            width : avWidth, /* Available width */
            height : avHeight, /* Available height */

            // If we are permitted to adjust the floating layer's position to show most
            //  contents, the following position will be optimum.
            x1 : avWidth >= w ? x : (x + avWidth - w), /* Optimum horizontal offset */
            y1 : avHeight >= h ? y : (y + avHeight - h), /* Optimum virtical offset */
            
            area : area
        };
        
        // D: available height is same as area A
        x = rect.x + rect.width;
        avWidth = x;
        area = {AID : "D", x : 0, y : y, width : avWidth, height : avHeight};

        if (avHeight >= h && avWidth >= w) {
            hRect.x = x - w;
            hRect.y = y;
            hRect.area = area;
            
            return hRect;
        }
        
        if(avWidth >= bAvRect.width){
            bAvRect.x = x - w;
            bAvRect.y = y;
            bAvRect.width = avWidth;

            bAvRect.x1 = bAvRect.x;
            bAvRect.area = area;
        }
        
        // B
        x = rect.x;
        y = rect.y;
        avWidth = bodySize.width - x;
        avHeight = y;
        area = {AID : "B", x : x, y : 0, width : avWidth, height : avHeight};
        
        if (avHeight >= h && avWidth >= w) {
            hRect.x = x;
            hRect.y = y - h;
            hRect.area = area;
            
            return hRect;
        }
        
        var tAvRect = {
            x : x,
            y : y - h,
            width : avWidth,
            height : avHeight,

            x1 : avWidth >= w ? x : (x + avWidth - w),
            y1 : y - h,
            
            area : area
        };
        
        // C: available height is same as area B
        x = rect.x + rect.width;
        avWidth = x; 
        area = {AID : "C", x : 0, y : 0, width : avWidth, height : avHeight};
        
        if (avHeight >= h && avWidth >= w) {
            hRect.x = x - w;
            hRect.y = y - h;
            hRect.area = area;
            
            return hRect;
        }
        
        if(avWidth >= tAvRect.width){
            tAvRect.x = x - w;
            tAvRect.y = y - h;
            tAvRect.width = avWidth;

            tAvRect.x1 = tAvRect.x;
            tAvRect.area = area;
        }

        var avRect = undefined;
        if(bAvRect.height >= h && tAvRect.height >= h){
            avRect = bAvRect.width >= tAvRect.width ? bAvRect : tAvRect;
        }else{
            var bArea = Math.min(bAvRect.width, w) * Math.min(bAvRect.height, h);
            var tArea = Math.min(tAvRect.width, w) * Math.min(tAvRect.height, h);
            avRect = bArea >= tArea ? bAvRect : tAvRect;
        }
        
        avRect.narrow = true;
        return avRect;
    };
    
    var _calVRect = function (rect, w, h) {
        var bodySize = this._bodySize, vRect = {x : 0, y : 0},
            x, y, avWidth, avHeight, 
            area/* Area: The rectangle of an area in which the current layer is lying*/;
        
        // C
        x = rect.x + rect.width;
        y = rect.y;
        avWidth = bodySize.width - x;
        avHeight = bodySize.height - y;
        area = {AID : "C", x : x, y : y, width : avWidth, height : avHeight};
        
        if (avWidth >= w && avHeight >= h) {
            vRect.x = x;
            vRect.y = y;
            vRect.area = area;
            
            return vRect;
        }
        
        var rightAvRect = {
            x : x, /* Optimal horizontal offset */
            y : y, /* Optimal virtical offset */
            width : avWidth, /* Available width */
            height : avHeight, /* Available height */

            // If we are permitted to adjust the floating layer's position to show most
            //  contents, the following position will be optimum.
            x1 : avWidth >= w ? x : (x + avWidth - w), /* Optimum horizontal offset */
            y1 : avHeight >= h ? y : (y + avHeight - h), /* Optimum virtical offset */
            
            area : area
        };
        
        // D: available width is same as area C
        y = rect.y + rect.height;
        avHeight = y;
        area = {AID : "D", x : x, y : 0, width : avWidth, height : avHeight};
        
        if (avWidth >= w && avHeight >= h) {
            vRect.x = x;
            vRect.y = y - h;
            vRect.area = area;
            
            return vRect;
        }
        
        if(avHeight > rightAvRect.height){
            rightAvRect.x = x;
            rightAvRect.y = y - h;
            rightAvRect.height = avHeight;

            rightAvRect.y1 = rightAvRect.y;
            rightAvRect.area = area;
        }
        
        // B
        x = rect.x;
        y = rect.y;
        avWidth = x;
        avHeight = bodySize.height - y;
        area = {AID : "B", x : 0, y : y, width : avWidth, height : avHeight};
        
        if (avWidth >= w && avHeight >= h) {
            vRect.x = x - w;
            vRect.y = y;
            vRect.area = area;
            
            return vRect;
        }
        
        var leftAvRect = {
            x : x - w,
            y : y,
            width : avWidth,
            height : avHeight,

            x1 : x - w,
            y1 : avHeight >= h ? y : (y + avHeight - h),
            
            area : area
        };
        
        // A: available width is same as area B
        y = rect.y + rect.height;
        avHeight = y;
        area = {AID : "A", x : 0, y : 0, width : avWidth, height : avHeight};
        
        if (avWidth >= w && avHeight >= h) {
            vRect.x = x - w;
            vRect.y = y - h;
            vRect.area = area;
            
            return vRect;
        }
        
        if (avHeight > leftAvRect.height) {
            leftAvRect.x = x - w;
            leftAvRect.y = y - h;
            leftAvRect.height = avHeight;
            
            leftAvRect.y1 = leftAvRect.y;
            leftAvRect.area = area;
        }
        
        var avRect = undefined;
        if(leftAvRect.width >= w && rightAvRect.width >= w){
            avRect = leftAvRect.height > rightAvRect.height ? leftAvRect : rightAvRect;
        }else{
            var leftArea = Math.min(leftAvRect.width, w) * Math.min(leftAvRect.height, h);
            var rightArea = Math.min(rightAvRect.width, w) * Math.min(rightAvRect.height, h);
            avRect = leftArea > rightArea ? leftAvRect : rightAvRect;
        }
        
        avRect.narrow = true;
        return avRect;
    };
    
    var _calAvaiRect = function (rect, w, h) {
        if (rect.isVertical) {
            return _calVRect.call(this, rect, w, h);
        } else {
            return _calHRect.call(this, rect, w, h);
        }
    };
    
    var _show = function (layer, rect) {
        System.log.println((new Date()).toString() + " : show " 
                          + layer.uuid() + "-" + layer.className);
        
        // When we append an DOM element to body, if we didn't set any "position"
        // or set the position as "absolute" but "top" and "left" that element also
        // be place at the bottom of body other than the (0, 0) position. Then it
        // may extend the body's size and trigger window's "resize" event.
        var styles = {
            visibility: "hidden", 
            position: "absolute", 
            left: "-10000px", 
            top: "-10000px"
        };
        layer.applyStyles(styles);
        
        if(this.indexOf(layer) < 0){
            this.addComponent(layer);
            this.stack.push(layer);

			// Do somthing while the layer is appended
			layer.onLayerAppended();
		}
        
        var size = layer.getPreferredSize() /*DOM.outerSize(layer.view)*/, 
            w = size.width, h = size.height,
            avaiRect = _calAvaiRect.call(this, rect, w, h);
        System.log.println("Available Rectangle: " + JSON.stringify(avaiRect));
        
        var x, y, bounds;
        if(avaiRect.narrow == true){
            var b = layer.isAdjustPosToFit();
            x = (!b) ? avaiRect.x : avaiRect.x1;
            y = (!b) ? avaiRect.y : avaiRect.y1;
            x = x <= 0 ? 0 : x;
            y = y <= 0 ? 0 : y;
            layer.setPosition(x, y, 1);
            
            w = Math.min(avaiRect.width, w);
            h = Math.min(avaiRect.height, h);
        }else{
            x = avaiRect.x <= 0 ? 0 : avaiRect.x;
            y = avaiRect.y <= 0 ? 0 : avaiRect.y;
            layer.setPosition(x, y, 1);
        }
        
        bounds = {x : x, y : y, width : w, height : h};
        layer.setCallback(bounds, avaiRect.area, rect);
        layer.applyStyles({visibility: "visible"});
        
        if (layer.focusBox != undefined
          && (layer.getPMFlag() & js.awt.PopupLayer.F_FOCUSBOXBLUR) != 0) {
            layer.focusItem = layer.focusBox;
            layer.focusBox.focus();
        }
        
        layer.setAutoHide(true);
        layer.startTimeout();
    };
    
    thi$.showAt = function (layer, x, y, v, m) {
        this._bodySize = DOM.outerSize(this.view);
        v = (v === true);
        
        var nofly = {
            x : x, 
            y : y, 
            width : ((v && !isNaN(m)) ? m : 0), 
            height : ((!v && !isNaN(m)) ? m : 0),
            isVertical : v
        };
        _show.call(this, layer, nofly);
    };

    var _calNofly = function(rect, v, m){
        if(isNaN(m) || m <= 0)
            return rect;

        var bodySize = this._bodySize;
        if (v) {
            /* 
             * If no-fly zone include by, we think the by element is in the middle/center of 
             * no-fly zone. Otherwise, we can't calculater the no-fly rectangle.
             * If that is not satisfying, please invoke the showAt() instead. 
             */ 
            if ((m - rect.width) >= 2) {
                rect.x = Math.max(0, rect.x - (m - rect.width)/2);
                rect.width = m;

                /* 
                 * If the by element include no-fly zone, we think the no-fly zone is in the 
                 * middle/center of the by element. Otherwise, we can't calculater the no-fly 
                 * rectangle.
                 * If that is not satisfying, please invoke the showAt() instead. 
                 */ 
            } else if ((rect.width - m) >= 2) {
                rect.x = Math.min(bodySize.width, rect.x + (rect.width - m)/2);
                rect.width = m;
            }
        } else {
            if ((m - rect.height) >= 2){
                rect.y = Math.max(0, rect.y - (m - rect.height)/2);
                rect.height = m;
            } else if ((rect.height - m) >= 2) {
                rect.y = Math.max(bodySize.height, rect.y + (rect.height - m)/2);
                rect.height = m;
            }
        }
        
        return rect;
    };
    
    thi$.showBy = function (layer, by, v, m) {
        this._bodySize = DOM.outerSize(this.view);
        v = (v === true);
        
        var rect = DOM.outerSize(by);
        rect.x = rect.left;
        rect.y = rect.top;
        rect.isVertical = v;

        var nofly = _calNofly.call(this, rect, v, m);
        _show.call(this, layer, nofly);
    };
    
    thi$.onHide = function (e) {
        var POPUP = js.awt.PopupLayer, pop, root = this.stack[0];       
        while (this.stack.length > 0) {
            pop = this.stack[this.stack.length - 1];
            if (pop.canHide(e)) {
                pop = this.stack.pop();
                System.log.println((new Date()).toString() + " : hide " + pop.uuid() 
                                  + "-" + pop.className + " on \"" + e.getType() 
                                  + "\" - Flag: " + (pop.getPMFlag()).toString(2));
                if (pop != root) {
                    root.focusItem = root.focusBox;
                    if(root.focusBox) {
                        root.focusBox.focus();
                    }
                }

                pop.beforeRemoveLayer(e);
                this.removeComponent(pop);
                pop.afterRemoveLayer(e);
            } else {
                return;
            }
        }
    };

    /**
     * One stack should have one root floating layer. When one floating layer is in stack and
     * there is no any event or method to cause hiding it. Now if we will push another one 
     * layer to it, we should invoke this method in our own initiative.
     */
    thi$.clearStack = function(e){
        System.log.println((new Date()).toString() + " : clearStack " 
                          + " on \"" + (e ? e.getType() : "unknown") + "\" event.");
        
        var pop;
        while (this.stack.length > 0) {
            pop = this.stack.pop();
            
            pop.beforeRemoveLayer(e);
            this.removeComponent(pop);
            pop.afterRemoveLayer(e);
        }
    };

    thi$.destroy = function(){
        this.removeAll(true);
    }.$override(this.destroy);

    thi$._init = function(def, Runtime, view){
        
        $super(this);
        
        this.stack = js.util.LinkedList.$decorate([]);
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
}.$extend(js.awt.Container);
