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

/**
 * @param def:{
 *     className: 
 *     id:
 *     
 *     type: 0: single, 1: range
 *     
 *     duration: number of seconds
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
            slipper.setPosition(p0, null, 0x04);
            _updateTrack.call(this, p0, this.getBounds());
        }else{
            var w = slipper.getSizeByRange(p1-p0);
            slipper.setBounds(p0, null, w, null, 0x04);
        }

        _layout.call(this, this.getBounds(), doLayout !== false ? 1 :0);

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
     * @see js.awt.Container
     */
    thi$.doLayout = function(force){
        if($super(this)){
            this.slipper.doLayout(true);
            
            var bounds = this.getBounds();
            
            if(this.offset){
                // Adjust scale
                var slipper = this.slipper, o = this.offset;
                
                this.trackLen = bounds.innerWidth - 
                    (slipper.offset0 - slipper.offset1);
                
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
        
        bounds = bounds || this.getBounds();
        
        this.trackLen = bounds.innerWidth -
            (slipper.offset0-slipper.offset1);
        this.maxOffset= bounds.innerWidth -
            slipper.getWidth();
        this.offset = this.getOffset();

        this.isFirst = false;
        this.isLast  = false;
        p = slipper.getX();
        if(p == 0){
            this.isFirst = true;
        }else if(p >= this.maxOffset){
            this.isLast = true;
        }
    };
    
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

    var _onMoving = function(e){
        var data = e.getData();
        if(this.isSingle()){
            _updateTrack.call(this, data.nx, this.getBounds());
        }
        
        e.cancelBubble();
    };

    var _updateTrack = function(x, bounds){
        var track = this._track;
        track.style.borderLeftWidth = x+"px";
        track.bounds = null;
        DOM.setSize(track, bounds.innerWidth);
    };

    var _onMoveEnd = function(e){
        this.offset = this.getOffset();

        if(Class.isFunction(this.onSliderChanged)){
            var U = this._local, slipper = this.slipper;
            U.off0 = slipper.getOffset0();
            U.off1 = slipper.getOffset1();
            this.onSliderChanged.$delay(this, 1);
        }
        e.cancelBubble();
    };

    var _onTraceMouse = function(e){
        var xy = e.eventXY, bounds = this.getBounds();
        xy = DOM.relative(xy.x, xy.y, bounds);
        
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
                mover:{grid:1, bt:1, br:1, bb:1, bl:1, freedom: 1,
                       longpress: 10}
            },R);

        slipper.setPeerComponent(this);
        this.view.appendChild(slipper.view);
    };
    
    thi$.destroy = function(){
        
        this.slipper.$destroy();
        this.slipper = null;
        this._track = null;
        this._track0 = null;

        this.detachEvent("elementMoving", 4, this, _onMoving);
        this.detachEvent("elementMoveEnd",4, this, _onMoveEnd);
        this.detachEvent("elementResizeEnd", 4, this, _onMoveEnd);
        /*
        this.detachEvent(Event.W3C_EVT_MOUSE_DOWN,
                         4, this, _onTraceMouse);*/
        
        $super(this);
        
    }.$override(this.destroy);

    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.Slider";
        def.type   = Class.isNumber(def.type) ? def.type : 0;
        def.duration = Class.isNumber(def.duration) ? def.duration : 1;
        
        $super(this);
        
        _createElements.call(this);

        this.attachEvent("elementMoving", 4, this, _onMoving);
        this.attachEvent("elementMoveEnd",4, this, _onMoveEnd);
        this.attachEvent("elementResizeEnd", 4, this, _onMoveEnd);
        /*
        this.attachEvent(Event.W3C_EVT_MOUSE_DOWN,
                         4, this, _onTraceMouse);*/

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Component);

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
        return this.getX() + this.offset0;
    };

    /**
     * Return the offset1 position of this slipper
     */
    thi$.getOffset1 = function(){
        return this.getX() + this.getWidth() + this.offset1;
    };

    thi$.getWidth = function(){
        return this.getBounds().offsetWidth;
    };

    /**
     * @see js.awt.Container
     */    
    thi$.doLayout = function(force){
        var bounds, mbp, w;
        if($super(this)){
            bounds = this.getBounds();
            if(this.isSingle()){
                this.offset0 = bounds.offsetWidth/2;
                this.offset1 = -this.offset0;
            }else{
                mbp = bounds.MBP;
                w = DOM.getBounds(this.ctrl0).offsetWidth;
                this.offset0 = mbp.borderLeftWidth + w;
                this.offset1 = -(mbp.borderRightWidth + w);
                
            }
            return true;
        }
        return false;
    }.$override(this.doLayout);

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
        var D = this.getBounds(), d;
        if(this.isSingle()){
            return D.offsetWidth
        }

        d = DOM.getBounds(this.ctrl0);
        return range + 2*d.width + D.MBP.BW

    };

    var w = 3, w2 = w*2;

    thi$.showResizeCapture = function(e){
        var xy = e.eventXY(), bounds = this.getBounds(),
            idxes = DOM.offsetIndexes(xy.x, xy.y, bounds),
            idx = idxes[2], d, spot, ret = false;

        if(idx < 3){
            d = DOM.getBounds(this.ctrl0);
            bounds = {
                x : d.absX - w, y: d.absY - w,
                width: d.width + w2, height: d.height + w2
            }
            spot = 1;
        }else if(idx > 3 && idx < 8){
            d = DOM.getBounds(this.ctrl1);
            bounds = {
                x : d.absX - w, y: d.absY - w,
                width: d.width + w2, height: d.height + w2
            }
            spot = 5;
        }

        if(d){
            DOM.showMouseCapturer(bounds, this.uuid(), spot);
            ret = true;
        }

        return ret;
    };

    /*
    thi$.showMoveCapture = function(e){
        if(this.isSingle()){
            var d = this.getBounds();
            DOM.showMouseCapturer({
                x: d.absX - w , y: d.absY - w,
                width: d.width + w2,
                height:d.height+ w2
            }, this.uuid(), 8);
            
            return true;
        }
        return false;
    };*/
    
    var _createElements = function(){
        var view = this.view, uuid, className, ctrl0, ctrl1;
        if(!this.isSingle()){
            className = this.className;
            uuid = this.uuid();
            
            this.ctrl0 = ctrl0 = DOM.createElement("DIV");
            ctrl0.id = [uuid, "ctrl0"].join("-");
            ctrl0.uuid = uuid;
            ctrl0.className = [className, "_ctrl0"].join("");
            view.appendChild(ctrl0);

            this.ctrl1 = ctrl1 = DOM.createElement("DIV");
            ctrl1.id = [uuid, "ctrl1"].join("-");
            ctrl1.uuid = uuid;
            ctrl1.className = [className,"_ctrl1"].join("");
            view.appendChild(ctrl1);
        }
    };
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = def.classType || "js.awt.Slipper";
        def.className = def.className || "jsvm_slipper";
        def.stateless = true;

        def.movable = true;
        if(def.type !== 0){
            // Range type
            def.resizable= true;
            def.resizer = 0x22;
        }
        
        $super(this);
        
        _createElements.call(this);
        
    }.$override(this._init);
    
    this._init.apply(this, arguments);
    
}.$extend(js.awt.Component);

