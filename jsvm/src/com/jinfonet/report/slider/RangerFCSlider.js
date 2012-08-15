/**
 * Copyright (c) Jinfonet Inc. 2000-2011, All rights reserved.
 * 
 * @File: RangerFCSlider.js
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
com.jinfonet.report.slider.RangerFCSlider = function(def, Runtime){
    
    var CLASS = com.jinfonet.report.slider.RangerFCSlider, 
    thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ, 
    SQLTypes = Class.forName("js.sql.Types");

    /**
     * @see com.jinfonet.report.slider.Slider
     */    
    thi$.setDataProvider = function(dataProvider){
        arguments.callee.__super__.apply(this, arguments);
        
        var showIcon = false, layout = this.layout;

        if(dataProvider){
            var meta = dataProvider.getMetaData(), sql = meta.sql;
            if(SQLTypes.DATE == sql || 
               SQLTypes.TIME == sql || 
               SQLTypes.TIMESTAMP == sql){

                showIcon = true;
            }

            this.getPlaySlider().setDataCount(dataProvider.Count());
        }
        
        layout.grid.cols[0].visible = showIcon;
        this.icoRL.display(showIcon);
        
        layout.grid.cols[4].visible = showIcon;
        this.icoRR.display(showIcon);

        this.doLayout(true);

    }.$override(this.setDataProvider);

    /**
     * @see com.jinfonet.report.slider.Slider
     */    
    thi$.getPlaySlider = function(){
        return this.sldPlay;

    }.$override(this.getPlaySlider);

    thi$._onChanged = function(fire){
        var sldPlay = this.sldPlay, chkAll = this.chkAll,
        trackLen = sldPlay.getTrackLength(), offset = sldPlay.getOffset();
        
        if(offset.offset0p == 0 && offset.offset1p == 1){
            if(!chkAll.isMarked()){
                chkAll.mark(true);
            }
        }else{
            chkAll.mark(false);
        }

        var tip0Value = this.getTipValue(trackLen, offset),
        tip1Value = this.getTipValue(trackLen, offset, true);
        _moveTip.call(this, sldPlay, offset, tip0Value, tip1Value);
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this._onChanged);
    
    var _moveTip = function(sldPlay, offset, v0, v1){
        this.lblRL.setText(v0, true);
        this.lblRR.setText(v1, true);
    };
    
    var _onCheckAll = function(e){
        var eType = e.getType(), chkbox = e.getEventTarget();
        if(eType == "mouseup"){
            if(chkbox.isMarked()){
                this.setOffset(0, 1);
            }
        }
    };
    
    var _onCalendarClick = function(e, icon){
        if(icon == this.icoRL){
        }else{
        }

        System.err.println("TODO: pop up calendar");
    };
    
    thi$._initialize = function(){
        var M = this.def, U = this._local,
        sldPlay = this.sldPlay, chkAll = this.chkAll,
        icoRL = this.icoRL, icoRR = this.icoRR;
        
        U.durationCount = M.upper - M.lower + 1;
        U.durationCurrn = M.duration;
        
        sldPlay.onSliderChanged = this._onChanged.$bind(this);
        sldPlay.onPlay = this._onPlay.$bind(this);
        sldPlay.onStop = this._onStop.$bind(this);
        sldPlay.first();

        MQ.register(chkAll.getMsgType(), this, _onCheckAll);
        
        icoRL.attachEvent("click", 0, this, _onCalendarClick, icoRL);
        icoRR.attachEvent("click", 0, this, _onCalendarClick, icoRR);

        var trackLen = sldPlay.getTrackLength(), offset = sldPlay.getOffset(),
        tip0Value = this.getTipValue(trackLen, offset),
        tip1Value = this.getTipValue(trackLen, offset, true);
        _moveTip.call(this, sldPlay, offset, tip0Value, tip1Value);

        if(offset.offset0p == 0 && offset.offset1p == 1){
            if(!chkAll.isMarked()){
                chkAll.mark(true);
            }
        }else{
            chkAll.mark(false);
        }
        
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this._initialize);

    var _createElements = function(R){
        var M = this.def, className = this.className,
        sldPlay, sldSpeed, lblRL, lblRR, icoRL, icoRR, chkAll;
        
        sldPlay = new (Class.forName("js.awt.Slider"))(
            {
                className: className + "_sldplay",
                id: "sldPlay",
                
                direction: 0, // Horizontal
                type: 1, // Ranger
                tracemouse: 0, // @see js.awt.Slider
                duration: M.duration, 

                align_y: 0.5,
                rigid_w: false,
                height:14,
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
                id: "lblRL",
                css: "text-align:left;",
                text: "lblRL",
                rigid_w: false,
                align_y: 0.5,
                stateless: true,
                constraints:{
                    rowIndex: 0,
                    colIndex: 1
                }
            },R);
        this.addComponent(lblRL);
        
        lblRR = new js.awt.Label(
            {
                id: "lblRR",
                css:"text-align:right;",
                text: "lblRR",
                rigid_w: false,
                align_y: 0.5,
                stateless: true,
                constraints:{
                    rowIndex: 0,
                    colIndex: 3
                }
            },R);
        this.addComponent(lblRR);

        icoRR = new js.awt.Icon(
            {
                id: "icoRR",
                image: "0-slider_calendar.png",
                stateless: true,
                align_y: 0.5,
                align_x: 1.0,
                width: 16, 
                height:16,
                constraints:{
                    rowIndex: 0,
                    colIndex: 4
                }
            }, R);
        this.addComponent(icoRR);
        
        chkAll = new js.awt.CheckBox(
            {
                id: "chkAll",
                labelText:"All ",
                marked: true,
                rigid_w: false,
                height: 16,
                constraints:{
                    rowIndex: 2,
                    colIndex: 0
                }
            },R);
        chkAll.setPeerComponent(this);
        this.addComponent(chkAll);

    };
    
    thi$.destroy = function(){
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);
    
    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        def.classType = "com.jinfonet.report.slider.RangerFCSlider";
        def.className = def.className || "rangerFC";
        def.stateless = true;
        def.height = 60;
        def.rigid_w = false;
        def.miniSize = {
            width: 250,
            height:60
        };
        def.layout = {
            classType: "js.awt.GridLayout",
            rowNum: 3,
            colNum: 5,
            rows:[
                {index:0, measure:21, rigid:true},
                {index:1, measure:18, rigid:true},
                {index:2, measure:21, rigid:true}
            ],
            cols:[
                {index:0, measure:19, rigid:true}, // Calendar icon
                {index:1, rigid:false,weight:0.5},   // Tip label
                {index:2, measure:0, rigid:true},   // Play slider
                {index:3, rigid:false,weight:0.5},   // Tip label
                {index:4, measure:19, rigid:true} // Calendar icon
            ],
            cells:[
                {rowIndex:0, colIndex:0, paddingLeft: 1}, // icoRL
                {rowIndex:0, colIndex:1, paddingLeft: 1}, // lblRL
                {rowIndex:0, colIndex:3, paddingRight:1}, // lblRR
                {rowIndex:0, colIndex:4, paddingRight:1}, // icoRR

                {rowIndex:1, colIndex:0, colSpan:5}, // Slider

                {rowIndex:2, colIndex:0, colSpan:2}  // Check all
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

