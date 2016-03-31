/**

  Copyright 2007-2015, The JSVM Project. 
  All rights reserved.
  
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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

    thi$.getMoveGrid = function(){
        return this.slipper.def.mover.grid;
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
            grid = this.getMoveGrid(), count = this.datacount,
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
            if(offset0 !== 0 && p0 === 0){
                p0 = 1;
            }
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
                this.playing = true;
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
        if($super(this)){
            this.slipper.doLayout(true);
            
            var bounds = this.getUBounds();
            
            if(this.offset){
                // Adjust scale
                var slipper = this.slipper, o = this.offset;
                
                this.trackLen = bounds.innerMeasure - 
                    (slipper.offset0-slipper.offset1);
                
                if(Class.isNumber(this.datacount) ||
                   Class.isBigInt(this.datacount)){
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
            track0 = this._track0, track = this._track;
        debugger;
        slipper.setUPosition(null, slipperS);
        this.trackLen = D.innerMeasure - (slipper.offset0-slipper.offset1);
        this.maxOffset= D.innerMeasure - slipper.getMeasure();
        this.offset = this.getOffset();
    };

    var _onmousedown = function(e){
//        debugger;
    };
    
    /**
     * @see js.awt.Movable
     */
    thi$.isMoverSpot1 = function(el, x, y){
        
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
     * If data count < track's pixel, the slipper should be 
     * snaped to grid
     */
    var _setMoverGrid = function(count){
        var grid, mover = this.slipper.def.mover;
        if(count > 1){
            grid = this.getTrackLength()/(count-1);
            grid = Class.isNumber(grid) ? (grid < 1 ? 1 : grid) : 1;
            mover.grid = grid;
        }else if(count == 1){
            mover.grid = 1;
        }
    };

    var _onmoving = function(e){
        /*
        var fire = (this.moveSlipper == true &&
                    e.getType() == "mouseup") ? 1 : 0;
        _layout.call(this, this.getUBounds(), fire);
        */
    };

    var _onMoving = function(e){
        var data = e.getData(), bounds = this.getBounds(),
            track = this._track, measure;
        if(this.isSingle()){
            track.style.borderLeftWidth = data.nx+"px";
            track.bounds = null;
            DOM.setSize(track, bounds.innerWidth);
        }
        e.cancelBubble();
    };

    var _onMoveEnd = function(e){
        
        e.cancelBubble();
    };

    var _createElements = function(){
        var R = this.Runtime(), uuid = this.uuid(),
            track0, track,slipper;

        track0 = this._tack0 = DOM.createElement("DIV");
        track0.uuid = uuid;
        track0.className = [this.className, "_track0"].join("");
        this.view.appendChild(track0);
        
        track = this._track = DOM.createElement("DIV");
        track.id = [uuid, "track"].join("-");
        track.uuid = uuid;
        track.className = [this.className, "_track"].join("");
        this.view.appendChild(track);

        // For the slipper
        slipper = this.slipper = new js.awt.Slipper(
            {
                type: this.def.type,
                direction: this.def.direction,
                className: [this.className,"_slipper"].join(""),
                id: [uuid,"slipper"].join("-"),
                stateless: true,
                movable: true,
                mover:{
                    grid:1,
                    bt:1,
                    br:1,
                    bb:1,
                    bl:1,
                    freedom: this.isHorizontal() ? 1:2
                }
            },R);

        slipper.setPeerComponent(this);
        this.view.appendChild(slipper.view);
    };
    
    thi$.destroy = function(){
        this.detachEvent(Event.W3C_EVT_MOUSE_DOWN, 4, this, _onmousedown);
        MQ.cancel(this.slipper.getMovingMsgType(), this, _onmoving);
        MQ.cancel(this.slipper.getSizingMsgType(), this, _onmoving);
        $super(this);
    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.Slider";
        def.type   = Class.isNumber(def.type) ? def.type : 0;
        def.direction = Class.isNumber(def.direction) ? def.direction : 0;
        def.duration = Class.isNumber(def.duration) ? def.duration : 1;
        def.tracemouse = Class.isNumber(def.tracemouse) ? def.tracemouse : 0;
        
        $super(this);
        
        _createElements.call(this);

        var M = this.def, slipper = this.slipper, uuid = this.uuid();
        
        slipper.getMovingMsgRecvs =
            slipper.getSizingMsgRecvs = function(){
                return [uuid];
            };

        MQ.register(this.slipper.getMovingMsgType(), this, _onmoving);
        
        if(!this.isSingle()){
        //    MQ.register(this.slipper.getSizingMsgType(), this, _onmoving);
        }
        else{
            if(M.tracemouse == 1 || M.tracemouse == 3){
                M.tracemouse = 0;
            }
        }

        this.attachEvent("elementMoving", 4, this, _onMoving);
        this.attachEvent("elementMoveEnd",4, this, _onMoveEnd);
        this.attachEvent(Event.W3C_EVT_MOUSE_DOWN, 4, this, _onmousedown);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(js.awt.Bidirectional);

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
        debugger;
        if(this._local.doneLayout !== true &&
           $super(this)){

            _layout.call(this, this.getUBounds());
            return true;
        }
        return false;
    }.$override(this.doLayout);

    var _layout = function(D){
        var b = this.isHorizontal(), d, w;
        if(this.isSingle()){
            this.offset0 = D.measure/2; 
            this.offset1 = -this.offset0;
        }else{
            d = DOM.getBounds(this.ctrl0);
            w = b ? d.width : d.height;
            this.offset0 = D.MBP.borderM0 + w;
            this.offset1 = 0 - D.MBP.borderM1 - w;

            if(this.def.miniSize == undefined){
                // Keep 1px for ranger ?
                this.setUMinimumSize(D.MBP.BM + 2*w + 1, D.pmeasure);
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
            var d = DOM.getBounds(this.ctrl0), 
                D = this.getBounds(), 
                width = range + 2*d.width + D.MBP.BW,
                height= range + 2*d.height+ D.MBP.BH;
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

    thi$.showResizeCapture = function(e){
        var xy = e.eventXY(), bounds = this.getBounds(),
            idxes = DOM.offsetIndexes(xy.x, xy.y, bounds),
            b = this.isHorizontal(), idx = idxes[2],
            d, spot, ret = false;

        if(idx < 3){
            d = DOM.getBounds(this.ctrl0);
            bounds = {
                x : d.absX - 2, y: d.absY - 2,
                width: d.width + 4, height: d.height + 4
            }
            spot = b ? 1 : 7;
            
        }else if(idx > 3 && idx < 8){
            d = DOM.getBounds(this.ctrl1);
            bounds = {
                x : d.absX - 2, y: d.absY - 2,
                width: d.width + 4, height: d.height + 4
            }
            spot = b ? 5 : 3;
        }

        if(d){
            DOM.showMouseCapturer(bounds, this.uuid(), spot);
            ret = true;
        }

        return ret;
    };
    
    var _createElements = function(){
        var view = this.view, uuid, className, d, ctrl0, ctrl1;
        if(!this.isSingle()){
            className = this.className;
            uuid = this.uuid();
            //d = this.isHorizontal() ? "--h":"--v";
            d = "";
            
            this.ctrl0 = ctrl0 = DOM.createElement("DIV");
            ctrl0.id = [uuid, "ctrl0"].join("-");
            ctrl0.uuid = uuid;
            ctrl0.className = [className, "_ctrl0",d].join("");
            view.appendChild(ctrl0);

            this.ctrl1 = ctrl1 = DOM.createElement("DIV");
            ctrl1.id = [uuid, "ctrl1"].join("-");
            ctrl1.uuid = uuid;
            ctrl1.className = [className,"_ctrl1",d].join("");
            view.appendChild(ctrl1);
        }
    };
    
    thi$.destroy = function(){
        MQ.cancel(this.getSizingMsgType(), this, _onsizing);
        $super(this);
    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.Slipper";
        def.className = def.className || "jsvm_slipper";
        def.stateless = true;

        def.movable = true;
        if(def.type !== 0){
            // Range type
            def.resizable= true;
            def.resizer = def.direction === 0 ? 0x22 : 0x88;
        }
        
        $super(this);
        
        _createElements.call(this);
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
}.$extend(js.awt.Component).$implements(js.awt.Bidirectional);

