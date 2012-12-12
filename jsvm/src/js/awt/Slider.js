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

$import("js.awt.Bidirectional");

/**
 * @param def:{
 *     className: 
 *     id:
 *     
 *     direction: 0: horizontal, 1: vertical
 *     type: 0: single, 1: range
 *     
 *     duration: number of seconds
 * 
 *     tracemouse: 0: slipper center trace mouse
 *         1: slipper endpoint trace mouse, and keep range no change
 *         3: slipper endpoint trace mouse, another endpoint is fixed, 
 *            the range will changed.
 *          
 * }
 */
js.awt.Slider = function(def, Runtime){

    var CLASS = js.awt.Slider, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    thi$.isSingle = function(){
        return this.def.type === 0;
    };

    thi$.setDuration = function(duration){
	    //var trackLen = this.getTrackLength(),
		//    grid = this.def.mover.grid;
	    //this.def.duration = duration > trackLen/(grid*10) ?
		//    duration : trackLen/(grid*10) ;
        this.def.duration = duration;
    };
    
    thi$.getDuration = function(){
        return this.def.duration;
    };
    
    thi$.isPlaying = function(){
        return this.playing || false;
    };

    /**
     * If data count less than the track pixels, the slipper
     * will be snaped to grid.
     */    
    thi$.setDataCount = function(count){
        
        //if( !Class.isNumber(count) || count <= 0 )
            //throw "The data count must large than 0";
        

        this.datacount = count;
        _setMoverGrid.call(this, count);
    };
    
    /**
     * Return track length in pixel
     */
    thi$.getTrackLength = function(){
        return this.trackLen;
    };
    
    /**
     * Move the slipper to the begin of the track
     */
    thi$.first = function(){
        if(this.isFirst == true) return;
        var o = this.getOffset();
        this.setOffset(0, o.offset1p-o.offset0p);
    };
    
    /**
     * Move the slipper to the end of the track
     */
    thi$.last = function(){
        if(this.isLast == true) return;
        var o = this.getOffset();
        this.setOffset(o.offset0p+1-o.offset1p, 1);
    };

    /**
     * Return the slipper offset in track in pixel
     */
    thi$.getOffset = function(){
		
        var slipper = this.slipper, trackLen = this.getTrackLength(),
        grid = this.def.mover.grid, count = this.datacount,
        offset0 = slipper.getOffset0() - slipper.offset0,
        offset1 = slipper.getOffset1() - slipper.offset0,
        offset0p = offset0/trackLen,
        offset1p = offset1/trackLen,

        index0 = grid > 1 ? Math.round(offset0*(count-1)/trackLen) :
                          Class.isBigInt(count) ? 
                                  count.minus(1).multiply(offset0).divid(trackLen).round() :
                                  Math.round(offset0p*(count-1)),

        index1 = grid > 1 ? Math.round(offset1*(count-1)/trackLen) : 
                            Class.isBigInt(count) ? 
                                  count.minus(1).multiply(offset1).divid(trackLen).round() :
                                  Math.round(offset1p*(count-1));
        
        if(this.isPlaying()){
            index0 = grid > 1 ? Math.floor( offset0*(count-1)/trackLen ) : 
                Math.floor( offset0p*(count-1) ),
            index1 = grid > 1 ? Math.floor( offset1*(count-1)/trackLen ) : 
                Math.floor( offset1p*(count-1) );
        }
        
        return{
            offset0 : offset0,
            offset1 : offset1,
            offset0p: offset0p,
            offset1p: offset1p,
            index0 : index0,
            index1 : index1,
            count: count
        };
    };

    /**
     * Sets the slipper offset0 with percentage of track length
     *  
     * @param offset0 the percentage of track length, 0 to 1
     * @param offset1 the percentage of track length, 0 to 1
     */
    thi$.setOffset = function(offset0, offset1, doLayout){
        var slipper = this.slipper, trackLen = this.trackLen,
        p0 = Math.round(trackLen*offset0),
        p1 = Math.round(trackLen*offset1);

        if(this.isSingle()){
            slipper.setUPosition(p0, null, 0x07);    
        }else{
            var S = slipper.getSizeByRange(p1-p0);
            slipper.setUBounds(p0, null, S.measure, undefined, 0x07);
        }

        _layout.call(this, this.getUBounds(), doLayout !== false ? 1 :0);

    };

    thi$.play = function(b){
        b = b || false;
        
        if(this.playing == b) return;

        if(b){
            var o = this.getOffset();
            if(o.offset0p == 1) return; // End

            var t0 = new Date().getTime();
            this.timer = 
                _play.$delay(this, 0, o.offset0, t0);
            if(typeof this.onPlay == "function"){
                this.onPlay();
            }
        }else{
            _play.$clearTimer(this.timer);
            delete this.timer;
            this.playing = false;
            if(typeof this.onStop == "function"){
                this.onStop();
            }
        }
    };
    
	var _play = function(b, t0){
	
        //delete this.timer;
        this.playing = true;
		
		var o = this.getOffset();

        var slipper = this.slipper, 
        c = this.getTrackLength(),
        d = this.getDuration()*1000,
        // b + v*T
        p = o.offset0 + 1;

        p = p > c ? c : p;
        this.setOffset(p/c, null, true);

        if(p < c){
            this.timer = _play.$delay(this, d/c, b, t0);
        }else{
            this.play(false);
        }
    };
	/**
    var _play = function(b, t0){
        delete this.timer;
        this.playing = true;

        var slipper = this.slipper, 
        c = this.getTrackLength(),
        d = this.getDuration()*1000,
        // b + v*T
        p = b + (c/d)*(new Date().getTime()-t0);

        p = p > c ? c : p;
        this.setOffset(p/c, null, true);

        if(p < c){
            this.timer = _play.$delay(this, 10, b, t0);
        }else{
            this.play(false);
        }
    };
	/**/

    /**
     * @see js.awt.Container
     */
    thi$.doLayout = function(force){
        if(arguments.callee.__super__.apply(this, arguments)){
            var bounds = this.getUBounds();
            
            if(this.offset){
                // Adjust scale
                var slipper = this.slipper, o = this.offset;
                
                this.trackLen = bounds.innerMeasure - 
                    (slipper.offset0-slipper.offset1);
                
                if(Class.isNumber(this.datacount) || Class.isBigInt(this.datacount)){
                    _setMoverGrid.call(this, this.datacount);
                }
                
                this.setOffset(o.offset0p, o.offset1p, false);
            }
            
            _layout.call(this, bounds, 0);
            
            return true;
        }
        return false;
    }.$override(this.doLayout);

    var _layout = function(bounds, fire){
        var slipper = this.slipper, off0, off1, p;
        bounds = bounds || this.getUBounds();
        
        _layout0.call(this, bounds);

        this.isFirst = false;
        this.isLast  = false;
        p = slipper.getStart();
        if(p == 0){
            this.isFirst = true;
        }else if(p >= this.maxOffset){
            this.isLast = true;
        }

        if(typeof this.onSliderChanged == "function"){
            var U = this._local;
            off0 = slipper.getOffset0();
            off1 = slipper.getOffset1();
            
            //new
            //if(off0 != U.off0 || off1 != U.off1 || (fire & 0x01) != 0){
                this.onSliderChanged(fire);
                U.off0 = off0; U.off1 = off1;
            //}
        }
        
        // Resume paused play
        if(fire == 1 && this.paused == true){
            this.paused = false;
            this.play(true);
        }
    };

    var _layout0 = function(D){
        var slipper = this.slipper,
        slipperS = (D.innerPMeasure - slipper.getPMeasure())*0.5,
        offset0 = slipper.getOffset0(), offset1 = slipper.getOffset1(),
        track0 = this.track0, track1 = this.track1, track2 = this.track2, 
        trackS = (D.innerPMeasure - this.getPMeasure(track0))*0.5,
        trackBg = this.trackbg, trackBgB = this.getUSize(trackBg);
        
        slipper.setUPosition(null, slipperS);
        
        this.setUPosition((D.innerMeasure - trackBgB.measure)*0.5,
                          (D.innerPMeasure- trackBgB.pmeasure)*0.5, null, trackBg);
        
        this.setUBounds(slipper.offset0, trackS, offset0-slipper.offset0, 
                        undefined, null, track0);
        if(track2){
            this.setUBounds(offset0, trackS, offset1-offset0, undefined, null, track2);
        }
        this.setUBounds(offset1, trackS, D.innerMeasure-offset1+slipper.offset1, 
                        undefined, null, track1);
        
        this.trackLen = D.innerMeasure - (slipper.offset0-slipper.offset1);
        this.maxOffset= D.innerMeasure - slipper.getMeasure();
        this.offset = this.getOffset();
    };

    /**
     * @see js.awt.Movable
     */
    thi$.isMoverSpot = function(el, x, y){
        
        if(this.isPlaying()) {
            this.paused = true;

            this.play(false);
        }

        if(el.className.indexOf("resizer") != -1) return false;

        this.moveSlipper = false;
        
        var slipper = this.slipper;
        if(slipper.contains(el, true)) {
            // If mousedown in on the slipper, do we need 
            // stop play ?  
            this.paused = false;
            this.moveSlipper = true;
            return true;
        }

        var xy = this.relative({x:x, y:y}), bounds = this.getUBounds(), 
        offset0 = slipper.getOffset0(), offset1 = slipper.getOffset1(),
        offset, max, v, m, pm, grid = this.def.mover.grid, 
        needLayout = true;

        if(this.isHorizontal()){
            xy.m  = grid*Math.round(xy.x/grid);
            xy.pm = xy.y;
        }else{
            xy.m  = grid*Math.round(xy.y/grid);
            xy.pm = xy.x;
        }
		
        switch(this.def.tracemouse){
        case 0:
            offset = Math.floor(slipper.offset0 + (offset1-offset0)/2);
            max = bounds.innerMeasure - slipper.getMeasure();
            //m = xy.m - offset;
			m = xy.m;
            m = m < 0 ? 0 : (m > max ? max : m);
            slipper.setUPosition(m, null, 7);
            break;
        case 1:
            if(xy.m < offset0){
                m = xy.m - slipper.offset0;
                m = m < 0 ? 0 : m;
            }else if(xy.m > offset1){
                max = bounds.innerMeasure - slipper.getMeasure();
                m = xy.m - slipper.getMeasure() - slipper.offset1;
                m = m > max ? max : m;
            }else{
                m = null;
            }
            slipper.setUPosition(m, null, 7);
            break;
        case 3:
            if(xy.m < offset0){
                m = xy.m - slipper.offset0;
                m = m < 0 ? 0 : m;
                v = slipper.getSizeByRange(offset1-m-slipper.offset0).measure;
            }else if(xy.m > offset1){
                m = null;
                max = bounds.innerMeasure - (-slipper.offset1);
                xy.m = xy.m > max ? max : xy.m;
                v = slipper.getSizeByRange(xy.m - offset0).measure;
            }else{
                m = null;
                v = undefined;
            }
            slipper.setUBounds(m, null, v, undefined, 7);
            break;
        default:
            needLayout = false;
            break;
        }

        if(needLayout){
            _layout.call(this, bounds, 1);    
        }
        
        
        return true;
    };
	/**/

    /**
     * @see js.awt.Movable
     */
    thi$.getMoveObject = function(e){
        var moveObj = this.moveObj;
        if(!moveObj){
            moveObj = this.slipper;
            moveObj.setMovingPeer(this);

            if(Class.isNumber(this.datacount) || Class.isBigInt(this.datacount)){
                _setMoverGrid.call(this, this.datacount);
            }
        }

        return moveObj;
    };
    
    /**
     * If data count < track's pixel, the slipper should be 
     * snaped to grid
     */
    var _setMoverGrid = function(count){
        var grid;
        if(count > 1){
            grid = this.getTrackLength()/(count-1);
            grid = Class.isNumber(grid) ? (grid < 1 ? 1 : grid) : 1;
            this.def.mover.grid = grid;
            
            if(!this.isSingle()){
                //System.err.println(this.getTrackLength());
                //this.slipper.def.mover.grid = grid;
            } 
        }
        else if(count == 1){
            this.def.mover.grid = 1;
        }
    };

    /**
     * @see js.awt.Movable
     */
    thi$.setMovable = function(b){
        arguments.callee.__super__.apply(this, arguments);
        if(b === true){
            MQ.register(this.slipper.getMovingMsgType(), this, _onmoving);
        }else{
            MQ.cancel("js.awt.event.SliderMovingEvent", this, _onmoving);
        }
    }.$override(this.setMovable);

    var _onmoving = function(e){
        var slipper = this.slipper, el = e.srcElement,
        fire = (this.moveSlipper == true && e.getType() == "mouseup") ? 1 : 0;
        _layout.call(this, this.getUBounds(), fire);
    };

    var _onsizing = function(e){
        _layout.call(this, 
                     this.getUBounds(), 
                     (e.getType() == "mouseup") ? 1 : 0);
    };

    var _createElements = function(){
        var R = this.Runtime(), trackbg, track0, track1, track2, slipper;
        
        trackbg = new js.awt.Component(
            {
                className: this.className + "_trackbg",
                id: "trackbg",
                css: "position:absolute;overflow:hidden;",
                stateless: true
            }, R);

        this.addComponent(trackbg);

        
        // For the left(up) track
        track0 = new js.awt.Component(
            {
                className: this.className + "_track0",
                id: "track0",
                css: "position:absolute;overflow:hidden;",
                stateless: true
            }, R);

        this.addComponent(track0);
        
        // For the right(down) track
        track1 = new js.awt.Component(
            {
                className: this.className + "_track1",
                id: "track1",
                css: "position:absolute;overflow:hidden;",
                stateless: true
            }, R);

        this.addComponent(track1);

        // For the middle track of ranger slider    
        if(!this.isSingle()){
            track2 = new js.awt.Component(
                {
                    className: this.className + "_track2",
                    id: "track2",
                    css: "position:absolute;overflow:hidden;",
                    stateless: true
                }, R);
            this.addComponent(track2);
        }
        
        // For the slipper
        slipper = new js.awt.Slipper(
            {
                type: this.def.type,
                direction: this.def.direction,
                className: this.className + "_slipper",
                id: "slipper",
                css: "position:absolute;overflow:hidden;",
                stateless: true
            },R);

        slipper.setPeerComponent(this);
        this.addComponent(slipper);
    };
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.Slider";
        def.className = def.className || "jsvm_slider";
        def.type   = Class.isNumber(def.type) ? def.type : 0;
        def.css = (def.css || "") + "overflow:" + (def.type == 0?"hidden;":"visable;");
        def.direction = Class.isNumber(def.direction) ? def.direction : 0;
        def.duration = Class.isNumber(def.duration) ? def.duration : 1;
        def.tracemouse = Class.isNumber(def.tracemouse) ? def.tracemouse : 0;
        
        arguments.callee.__super__.apply(this, arguments);
        
        _createElements.call(this);

        var M = this.def, mover = M.mover = M.mover || {};
        mover.bound = 0;
        mover.grid = 1;
        mover.bt = mover.br = mover.bb = mover.bl = 1;
        mover.freedom = this.isHorizontal() ? 1:2;
        this.setMovable(true);

        if(!this.isSingle()){
            MQ.register(this.slipper.getSizingMsgType(), this, _onsizing);
        }
        else{
            if(M.tracemouse == 1 || M.tracemouse == 3){
                M.tracemouse = 0;
            }
        }

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Container).$implements(js.awt.Bidirectional);

/**
 * @param def:{
 *     className: 
 * 
 *     type: 0: single, 1: ranger
 *     direction: 0: horizontal, 1: vertical
 * }
 */
js.awt.Slipper = function(def, Runtime){

    var CLASS = js.awt.Slipper, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    thi$.isSingle = function(){
        return this.def.type === 0;    
    };
    
    /**
     * Return the offset0 position of this slipper
     */
    thi$.getOffset0 = function(){
        return this.getStart() + this.offset0;
    };

    /**
     * Return the offset1 position of this slipper
     */
    thi$.getOffset1 = function(){
        return this.getStart() + this.getMeasure() - (-this.offset1);
    };

    /**
     * @see js.awt.Container
     */    
    thi$.doLayout = function(force){
        if(this._local.doneLayout !== true &&
           arguments.callee.__super__.apply(this, arguments)){

            _layout.call(this, this.getUBounds());
            return true;
        }
        return false;
    }.$override(this.doLayout);

    var _layout = function(D){
        var ctrl0 = this.ctrl0, ctrl1 = this.ctrl1, w;
        if(this.isSingle()){
            var x = (D.innerMeasure - this.getMeasure(ctrl0))*0.5;
            this.setUBounds(x, 0, undefined, D.innerPMeasure, null, ctrl0);
            this.offset0 = D.measure/2; 
            this.offset1 = 0 - this.offset0;
        }else{
            this.setUBounds(0,0, undefined, D.innerPMeasure, null, ctrl0);
            w = this.getMeasure(ctrl0);
            this.offset0 = D.MBP.borderM0 + w;
            
            this.setUBounds(null, 0, undefined, D.innerPMeasure, null, ctrl1);
            this.setUEndStyle(0, ctrl1);
            this.offset1 = 0 - D.MBP.borderM1 - this.getMeasure(ctrl1);

            if(this.def.miniSize == undefined){
                w += this.getMeasure(ctrl1);
                // Keep 1px for ranger ?
                this.setUMinimumSize(D.MBP.BM + w, D.pmeasure);
            }
        }
        this._local.doneLayout = true; 
    };
    
    /**
     * @see js.awt.MoveObject
     */
    thi$.getMovingMsgType = function(){
        return "js.awt.event.SliderMovingEvent";    
    };

    /**
     * @see js.awt.SizeObject
     */
    thi$.getSizingMsgType = function(){
        return "js.awt.event.SliderSizingEvent";
    };

    /**
     * @see js.awt.Resizable
     */
    thi$.getSizeObject = function(){    
        var sizeObj = this.sizeObj;
        if(!sizeObj){
            sizeObj = this.sizeObj = this;
            sizeObj.setSizingPeer(this);
        }
        return sizeObj;
    }.$override(this.getSizeObject);

    thi$.getSizeByRange = function(range){
        var ret;
        if(this.isSingle()){
            ret = this.getUSize();
        }else{
            var D = this.getBounds(), c0 = this.ctrl0, c1 = this.ctrl1,
            width = range + c0.getWidth() + c1.getWidth() + D.MBP.BW,
            height= range + c0.getHeight()+ c1.getHeight()+ D.MBP.BH;
            if(this.isHorizontal()){
                ret = {
                    width:  width,
                    height: D.height,

                    measure:width,
                    pmeasure: D.height
                };
            }else{
                ret = {
                    width:  D.width,
                    height: height,

                    measure:height,
                    pmeasure: D.width
                };
            }
        }

        return ret;
    };

    var _onsizing = function(e){
        this.notifyPeer(this.getSizingMsgType(), e, true);
    };
    
    var _createElements = function(){
        var ctrl0, ctrl1, R = this.Runtime();
        ctrl0 = new js.awt.Component(
            {
                className: this.className + "_ctrl0",
                id: "ctrl0",
                css: "position:absolute;overflow:hidden;",
                stateless: true
            }, R);
        this.addComponent(ctrl0);

        if(!this.isSingle()){
            ctrl1 = new js.awt.Component(
                {
                    className: this.className + "_ctrl1",
                    id: "ctrl1",
                    css: "position:absolute;overflow:hidden;",
                    stateless: true
                }, R);
            this.addComponent(ctrl1);
        }
    };

    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.Slipper";
        def.className = def.className || "jsvm_slipper";
        def.stateless = true;

        arguments.callee.__super__.apply(this, arguments);
        
        _createElements.call(this);
        
        if(!this.isSingle()){
            // For ranger type, supports resize
            this.SpotSize = {
                lw: 10, l2w: 20, pw: 0, p2w:0
            };

            this.setResizable(
                true, 
                this.isHorizontal() ? 0x22 : 0x88);

            MQ.register(this.getSizingMsgType(), this, _onsizing);
        }
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
}.$extend(js.awt.Container).$implements(js.awt.Bidirectional);

