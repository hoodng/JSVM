/**
 * Copyright (c) Jinfonet Inc. 2000-2011, All rights reserved.
 * 
 * @File: Slider.js
 * @Create: Jul 28, 2012
 * @Author: dong.hu@china.jinfonet.com
 */

$package("com.jinfonet.report.slider");

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
com.jinfonet.report.slider.Slider = function(def, Runtime){
    
    var CLASS = com.jinfonet.report.slider.Slider, 
    thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;
    
    thi$.getMsgType = function(){
        return "com.jinfonet.event.SliderEvent";        
    };

    thi$.setDataProvider = function(dataProvider){
        if(this.dataProvider){
            this.dataProvider.destroy();
            delete this.dataProvider;
        }

        this.dataProvider = dataProvider;
    };

    thi$.getDataProvider = function(){
        return this.dataProvider;
    };
    
    thi$.getPlaySlider = function(){
        
    };
    
    thi$.isFirst = function(){
        return this.getPlaySlider().isFirst;
    };
    
    thi$.isLast = function(){
        return this.getPlaySlider().isLast;
    };
    
    thi$.first = function(){
        this.getPlaySlider().first();
    };
    
    thi$.last = function(){
        this.getPlaySlider().last();
    };
    
    thi$.getDuration = function(){
        return this.getPlaySlider().getDuration();
    };
    
    thi$.setDuration = function(duration){
        this.getPlaySlider().setDuration(duration);
    };
    
    thi$.getOffset = function(){
        return this.getPlaySlider().getOffset();
    };
    
    thi$.setOffset = function(offset0, offset1){
        var slider = this.getPlaySlider();
        slider.setOffset.apply(slider, arguments);
    };
    
    thi$.getTrackLength = function(){
        return this.getPlaySlider().getTrackLength();
    };
    
    thi$.isPlaying = function(){
        return this.getPlaySlider().isPlaying();
    };
    
    thi$.play = function(){
        var sldPlay = this.getPlaySlider();
        if(!sldPlay.isLast){
            sldPlay.play(true);
            return true;
        }
        return false;
    };
    
    thi$.stop = function(){
        var sldPlay = this.getPlaySlider();
        if(sldPlay.isPlaying()){
            sldPlay.play(false);    
            return true;
        }
        return false;
    };
    
    thi$.getTipValue = function(trackLen, offset, second){
        var provider = this.dataProvider, index, ret;
        if(provider){
            index = (second !== true) ? 
                offset.index0 : offset.index1;

            ret = provider.getDispValueByIndex(index);
        }else{
            index = (second !== true) ? 
                offset.offset0 : offset.offset1;

            ret = trackLen+":"+index;
        }
        return ret;
    };

    thi$._onChanged = function(fire){
        if((fire & 0x01) != 0){
            _notifyPeer.call(this, "changed");    
        }else{
            _notifyPeer.call(this, "changing");    
        }
    };
    
    thi$._onPlay = function(){
        _notifyPeer.call(this, "play");
    };
    
    thi$._onStop = function(){
        _notifyPeer.call(this, "stop");
    };
    
    var _notifyPeer = function(type){
        this.notifyPeer(
            this.getMsgType(), new Event(type, "", this), true);
    };
    
    thi$.doLayout = function(force){
        if(arguments.callee.__super__.apply(this, arguments)){
            if(this._local.inited !== true){
                this._initialize();
            }
            return true;
        }
        return false;
    }.$override(this.doLayout);

    thi$._initialize = function(){

        var dataProvider = this.dataProvider, count;
        if(dataProvider){
            count = dataProvider.Count();
            this.getPlaySlider().setDataCount(count);
        }

        this._local.inited = true;
    };

    thi$.destroy = function(){
        delete this.dataProvider;

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    this._init.apply(this, arguments);
    
}.$extend(js.awt.Container);

