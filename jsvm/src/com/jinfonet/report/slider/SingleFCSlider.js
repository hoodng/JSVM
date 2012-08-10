/**
 * Copyright (c) Jinfonet Inc. 2000-2011, All rights reserved.
 * 
 * @File: SingleFCSlider.js
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
com.jinfonet.report.slider.SingleFCSlider = function(def, Runtime){
    
    var CLASS = com.jinfonet.report.slider.SingleFCSlider, 
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
    thi$.setDataProvider = function(dataProvider){
        arguments.callee.__super__.apply(this, arguments);
        
        var showIcon = false, layout = this.layout;

        if(dataProvider){
            var meta = dataProvider.getMetaData(), sql = meta.sql;
            if(Types.DATE == sql || 
               Types.TIME == sql || 
               Types.TIMESTAMP == sql){

                showIcon = true;
            }
        }
        
        layout.grid.cols[0].visible = showIcon;
        this.icoRL.display(showIcon);

    }.$override(this.setDataProvider);

    /**
     * @see com.jinfonet.report.slider.Slider
     */    
    thi$.getPlaySlider = function(){
        return this.sldPlay;

    }.$override(this.getPlaySlider);
    
    /**
     * @see com.jinfonet.report.slider.Slider
     */    
    thi$._onChanged = function(fire){
        var sldPlay = this.sldPlay, 
        trackLen = sldPlay.getTrackLength(), 
        offset = sldPlay.getOffset(),
        tipValue = this.getTipValue(trackLen, offset);

        _moveTip.call(this, sldPlay, offset, tipValue);

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this._onChanged);
    
    var _moveTip = function(sldPlay, offset, value){
        var tip = this.lblRL;
        tip.setText(value, true);
    };

    var _onCalendarClick = function(e, icon){
        if(icon == this.icoRL){
        }else{
        }

        System.err.println("TODO: pop up calendar");
    };
    
    /**
     * @see com.jinfonet.report.slider.Slider
     */    
    thi$._initialize = function(){
        var M = this.def, U = this._local,
        sldPlay = this.sldPlay, icoRL = this.icoRL;
        
        U.durationCount = M.upper - M.lower + 1;
        U.durationCurrn = M.duration;
        
        sldPlay.onSliderChanged = this._onChanged.$bind(this);
        sldPlay.onPlay = this._onPlay.$bind(this);
        sldPlay.onStop = this._onStop.$bind(this);
        sldPlay.first();

        icoRL.attachEvent("click", 0, this, _onCalendarClick, icoRL);

        var trackLen = sldPlay.getTrackLength(), offset = sldPlay.getOffset(),
        tipValue = this.getTipValue.call(this, trackLen, offset);
        _moveTip.call(this, sldPlay, offset, tipValue);
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this._initialize);

    var _createElements = function(R){
        var M = this.def, className = this.className,
        sldPlay, icoRL, lblRL;
        
        sldPlay = new (Class.forName("js.awt.Slider"))(
            {
                className: className + "_sldplay",
                id: "sldPlay",
                
                direction: 0, // Horizontal
                type: 0, // Single
                tracemouse: 0, // @see js.awt.Slider
                duration: M.duration, // according to the FS 2 to 35s

                align_y: 0.0,
                rigid_w: false,
                height:22,
                stateless: true,
                constraints:{
                    rowIndex: 1,
                    colIndex: 0
                }
            },R);
        this.addComponent(sldPlay);
        
        icoRL = new js.awt.Icon(
            {
                id: "icoRL",
                image: "0-slider_calendar.png",
                stateless: true,
                align_y : 0.5,
                align_x : 0.0,
                width: 16, 
                height:16,
                constraints:{
                    rowIndex: 0,
                    colIndex: 0
                }
            }, R);
        this.addComponent(icoRL);

        lblRL = new js.awt.Label(
            {
                className: className + "_tip",
                id: "lblRL",
                css: "position:absolute;",
                text: " ",
                rigid_w: false,
                align_y: 0.5,
                stateless: true,
                constraints:{
                    rowIndex: 0,
                    colIndex: 1
                }
            },R);
        this.addComponent(lblRL);

    };
    
    thi$.destroy = function(){
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;
        
        def.classType = "com.jinfonet.report.slider.SingleFCSlider";
        def.className = def.className || "singleFC";
        def.stateless = true;
        def.height = 60;
        def.rigid_w = false;
        def.miniSize = {
            width: 250,
            height:60
        };
        def.layout = {
            classType: "js.awt.GridLayout",
            rowNum: 2,
            colNum: 2,
            rows:[
                {index:0, measure:21, rigid:true},
                {index:1, measure:24, rigid:true}
            ],
            cols:[
                {index:0, measure:19, rigid:true}, // Calendar icon
                {index:1, rigid:false,weight:1}   // Play slider
            ],
            cells:[
                {rowIndex:0, colIndex:0, paddingLeft:1}, // Calendar icon
                {rowIndex:0, colIndex:1, paddingLeft:1}, // Tip label
                {rowIndex:1, colIndex:0, colSpan:2} // Slider
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

