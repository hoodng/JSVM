/**
 * Copyright (c) Jinfonet Inc. 2000-2011, All rights reserved.
 * 
 * @File: MontionSlider.js
 * @Create: Jul 28, 2012
 * @Author: dong.hu@china.jinfonet.com
 */

$package("com.jinfonet.report.slider");

$import("com.jinfonet.report.slider.Slider");

/**
 * @param def:{
 *     className: ""
 *     id:
 *     
 *     lower: Default is 2 seconds
 *     upper: Default is 35 seconds
 *     duration: Default is 10 seconds
 * }
 */
com.jinfonet.report.slider.MontionSlider = function(def, Runtime){
    
    var CLASS = com.jinfonet.report.slider.MontionSlider, 
    thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;

    /**
     * @see com.jinfonet.report.slider.Slider
     */    
    thi$.getPlaySlider = function(){
        return this.sldPlay;

    }.$override(this.getPlaySlider);

    /**
     * @see com.jinfonet.report.slider.Slider
     */    
    thi$.setDuration = function(duration){
        var M = this.def, U = this._local; 
        this.sldSpeed.setOffset(
            1-(duration-M.lower+1)/U.durationCount, null);

    }.$override(this.setDuration);
    
    /**
     * @see com.jinfonet.report.slider.Slider
     */
    thi$.play = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            this.btnPlay.setTriggered(true);
            return true;
        }
        return false;
    }.$override(this.play);

    /**
     * @see com.jinfonet.report.slider.Slider
     */    
    thi$.stop = function(){
        if(arguments.callee.__super__.apply(this, arguments)){
            this.btnPlay.setTriggered(false);
            return true;
        }
        return false;
    }.$override(this.stop);

    /**
     * @see com.jinfonet.report.slider.Slider
     */    
    thi$._onChanged = function(fire){
        var btnPlay = this.btnPlay, sldPlay = this.sldPlay, 
        trackLen = sldPlay.getTrackLength(), offset = sldPlay.getOffset();

        if(!sldPlay.isLast && !sldPlay.isPlaying()){
            btnPlay.setTriggered(false);
            btnPlay.setEnabled(true);
        }
        
        var tipValue = this.getTipValue(trackLen, offset);
        _moveTip.call(this, sldPlay, offset, tipValue);
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this._onChanged);
    
    /**
     * @see com.jinfonet.report.slider.Slider
     */    
    thi$._onPlay = function(){
        var btnPlay = this.btnPlay;

        if(!btnPlay.isTriggered()){
            btnPlay.setTriggered(true);
        }
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this._onPlay);
    
    /**
     * @see com.jinfonet.report.slider.Slider
     */    
    thi$._onStop = function(){
        var btnPlay = this.btnPlay;

        if(btnPlay.isTriggered()){
            btnPlay.setTriggered(false);
        }

        if(this.isLast()){
            btnPlay.setEnabled(false);
        }
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this._onStop);

    var _moveTip = function(sldPlay, offset, value){
        var tip = this.tipLabel;
        tip.setText(value, true);

        var tipB = tip.getBounds(),
        minX = sldPlay.getX(), 
        maxX = minX + sldPlay.getWidth() - tipB.width,
        x = minX + offset.offset0 - tipB.width/2, 
        y = sldPlay.getY() - tipB.height;

        x = x < minX ? minX : (x > maxX ? maxX : x);
        
        tip.setPosition(x, y);
    };
    
    var _onButtonEvent = function(e){
        var eType = e.getType(), button = e.getEventTarget();
        
        if(eType == "mouseup" && button == this.btnPlay){
            
            if(!this.isPlaying()){
                this.play();
            }else{
                this.stop();
            }
        }
    };

    var _onSpeedChanged = function(fire){
        var M = this.def, U = this._local,
        sldPlay = this.sldPlay, sldSpeed = this.sldSpeed;

        if(sldPlay.isPlaying()){
            sldPlay.play(false);
            sldPlay.paused = true;
        }

        var o =  sldSpeed.getOffset(); 
        U.durationCurrn = M.upper - Math.floor(o.offset0p*U.durationCount);
        sldPlay.setDuration(U.durationCurrn);

        if(sldPlay.paused === true){
            sldPlay.play(true);
        }
    };
    
    thi$._initialize = function(){
        var M = this.def, U = this._local,
        sldPlay = this.sldPlay, 
        sldSpeed = this.sldSpeed, 
        btnPlay = this.btnPlay;
        
        U.durationCount = M.upper - M.lower + 1;
        U.durationCurrn = M.duration;
        
        MQ.register("js.awt.event.ButtonEvent", this, _onButtonEvent);

        sldPlay.onSliderChanged = this._onChanged.$bind(this);
        sldPlay.onPlay = this._onPlay.$bind(this);
        sldPlay.onStop = this._onStop.$bind(this);

        sldSpeed.onSliderChanged = _onSpeedChanged.$bind(this);

        this.setDuration(M.duration);

        sldPlay.first();        
        var trackLen = sldPlay.getTrackLength(), offset = sldPlay.getOffset(),
        tipValue = this.getTipValue.call(this, trackLen, offset);
        _moveTip.call(this, sldPlay, offset, tipValue);
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this._initialize);

    var _createElements = function(R){
        var M = this.def, className = this.className,
        btnPlay, sldPlay, sldSpeed, lblSlow, lblFast, tipLabel;
        
        btnPlay = new js.awt.Button(
            {
                className: className + "_btnplay",
                id: "btnPlay",
                toggle: true,
                width: 37, 
                height:37,
                align_y: 0.5,
                constraints:{
                    rowIndex: 0,
                    colIndex: 0
                }
            }, R);
        btnPlay.setPeerComponent(this);
        this.addComponent(btnPlay);
        
        sldPlay = new (Class.forName("js.awt.Slider"))(
            {
                className: className + "_sldplay",
                id: "sldPlay",
                
                direction: 0, // Horizontal
                type: 0, // Single
                tracemouse: 0, // @see js.awt.Slider
                duration: M.duration, // according to the FS 2 to 35s

                align_y: 0.6,
                rigid_w: false,
                height:22,
                stateless: true,
                constraints:{
                    rowIndex: 0,
                    colIndex: 1
                }
            },R);
        this.addComponent(sldPlay);
        
        lblSlow = new js.awt.Label(
            {
                className: className + "_lblspeed",
                id: "lblSlow",
                css: "text-align:right;",
                text: R.nlsText("lblSlow","Slow"),
                rigid_w: false,
                align_y: 0.5,
                align_x: 1,
                stateless: true,
                constraints:{
                    rowIndex: 0,
                    colIndex: 2
                }
            },R);
        this.addComponent(lblSlow);
        
        sldSpeed = new (Class.forName("js.awt.Slider"))(
            {
                className: className + "_sldspeed",
                id: "sldSpeed",
                
                direction: 0, // Horizontal
                type: 0, // Single
                tracemouse: 0, // @see js.awt.Slider

                align_y: 0.5,
                width: 42,
                height:22,
                stateless: true,
                constraints:{
                    rowIndex: 0,
                    colIndex: 3
                }
            },R);
        this.addComponent(sldSpeed);

        lblFast = new js.awt.Label(
            {
                className: className + "_lblspeed",
                id: "lblFast",
                text: R.nlsText("lblFast","Fast"),
                rigid_w: false,
                align_y: 0.5,
                align_x: 0,
                stateless: true,
                constraints:{
                    rowIndex: 0,
                    colIndex: 4
                }
            },R);
        this.addComponent(lblFast);
        
        // The tip label won't add to this container
        tipLabel = this.tipLabel = new js.awt.Label(
            {
                className: className + "_tip",
                id: "tipLabel",
                css: "position:absolute;",
                text: " ",
                rigid_w: false,
                stateless: true
            },R);
        tipLabel.appendTo(this.view);
    };
    
    thi$.destroy = function(){
        this.tipLabel.destroy();
        delete this.tipLabel;
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = "com.jinfonet.report.slider.MontionSlider";
        def.className = def.className || "montionplayer";
        def.stateless = true;
        def.height = 57;
        def.rigid_w = false;
        def.miniSize = {
            width: 250,
            height:57
        };
        def.layout = {
            classType: "js.awt.GridLayout",
            rowNum: 1,
            colNum: 5,
            rows:[
                {index:0, measure:57, rigid:true}
            ],
            cols:[
                {index:0, measure:47, rigid:true}, // Play button
                {index:1, rigid:false,weight:1},   // Play slider
                {index:2, measure:40, rigid:true}, // Slow label
                {index:3, measure:52, rigid:true}, // Speed slider
                {index:4, measure:40, rigid:true}  // Fast label
            ],
            cells:[
                {rowIndex:0, colIndex:0, paddingRight:10}, // Play button
                {rowIndex:0, colIndex:1, paddingRight:5}, // Play slider
                {rowIndex:0, colIndex:2}, // Slow label
                {rowIndex:0, colIndex:3, paddingLeft:5, paddingRight:5}, // Speed slider
                {rowIndex:0, colIndex:4}  // Fast label
            ]
        };
        
        arguments.callee.__super__.apply(this, arguments);
        
        var M = this.def;
        M.lower = Class.isNumber(M.lower) ? M.lower : 2;
        M.upper = Class.isNumber(M.upper) ? M.upper : 35;
        M.duration = Class.isNumber(M.duration) ? M.duration : 10;
        
        _createElements.call(this, Runtime);
        
    }.$override(this._init);

    this._init.apply(this, arguments);
    
}.$extend(com.jinfonet.report.slider.Slider);

