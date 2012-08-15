/**
 * Copyright (c) Jinfonet Inc. 2000-2011, All rights reserved.
 * 
 * @File: SliderDataProvider.js
 * @Create: Jul 28, 2012
 * @Author: dong.hu@china.jinfonet.com
 */

$package("com.jinfonet.report.slider");


com.jinfonet.report.slider.SliderDataProvider = function(){

    var CLASS = com.jinfonet.report.slider.SliderDataProvider, 
    thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ;

    CLASS.INTERP_ARRAYINDEX = -1;// Each index
    CLASS.INTERP_NUMBER = 0;     // array[0]+index*delta
    CLASS.INTERP_YEAR = 1;       // Each year
    CLASS.INTERP_HALFYEAR = 20;  // Each half year
    CLASS.INTERP_MONTH = 2;      // Each month
    CLASS.INTERP_HALFMONTH= 21;  // Half month
    CLASS.INTERP_QUATER = 22;    // Each quater
    CLASS.INTERP_BIWEEK = 23;    // Half week
    CLASS.INTERP_WEEK = 24;      // Each week
    CLASS.INTERP_DATE = 5;       // Each day (day of month)
    CLASS.INTERP_HOUR = 10;      // Each hour
    CLASS.INTERP_MINUTE = 12;    // Each minute
    CLASS.INTERP_SECOND = 13;    // Each second

    CLASS.DELTA_INTEGER = 1;
    CLASS.DELTA_DECIMAL = 0.01;

    /**
     * Return amount of records
     */
    thi$.Count = function(){
        
    };
    
    /**
     * Return record meat data, the meta data should includes following
     * information:<p>
     * {
     *     sql:
     *     sqlType:
     *     format:
     *     ...
     * }
     */
    thi$.getMetaData = function(){
    };
    
    /**
     * Return the data with the specified index.
     * 
     * @param index, integer 0<= index < this.getCount()
     */
    thi$.getValueByIndex = function(index){
    };
    
    /**
     * Return the formatted data with the specified index
     * 
     * @param index, integer 0<= index < this.getCount()
     */
    thi$.getDispValueByIndex = function(index){
    };
    
};

/**
 * @param array
 * @param meta:{
 *     sql:
 *     format:
 * 
 *     interp: interpolating function name
 *     delta: 
 * }
 */
com.jinfonet.report.slider.ArrayData = function(a, m, Runtime){

    var CLASS = com.jinfonet.report.slider.ArrayData, 
    thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ = J$VM.MQ, 
    SUPER = com.jinfonet.report.slider.SliderDataProvider,
    tools = Class.forName("com.jinfonet.util.Tools"),
    SQL = Class.forName("js.sql.Types");


    /**
     * Return amount of records
     */
    thi$.Count = function(){
        return this.count;        
    };
    
    /**
     * Return record meat data, the meta data should includes following
     * information:<p>
     * {
     *     sql:
     *     sqlType:
     *     format:
     *     ...
     * }
     */
    thi$.getMetaData = function(){
        return this.meta;
    };
    
    /**
     * Return the data with the specified index.
     * 
     * @param index, integer 0<= index < this.getCount()
     */
    thi$.getValueByIndex = function(index){
        var array = this.array, count = this.count, 
        meta = this.meta, ret;

        if(index < 0 || index >= count) return undefined;

        switch(meta.interp){
        case SUPER.INTERP_ARRAYINDEX:
            ret = index == 0 ? "All" : array[index];
            break;
        case SUPER.INTERP_NUMBER:
            ret = array[0] + meta.delta*index;
            break;
        case SUPER.INTERP_YEAR:
        case SUPER.INTERP_HALFYEAR:
        case SUPER.INTERP_MONTH:
        case SUPER.INTERP_HALFMONTH:
        case SUPER.INTERP_QUATER:
        case SUPER.INTERP_WEEK:
        case SUPER.INTERP_BIWEEK:
        case SUPER.INTERP_DATE:
        case SUPER.INTERP_HOUR:
        case SUPER.INTERP_MINUTE:
        case SUPER.INTERP_SECONDE:
            // TODO: 
            break;
        default:
            throw "Unsupported interpolating function";
        }
        return ret;
    };
    
    /**
     * Return the formatted data with the specified index
     * 
     * @param index, integer 0<= index < this.getCount()
     */
    thi$.getDispValueByIndex = function(index){
        var array = this.array, count = this.count, 
        meta = this.meta, formatter = this.formatter, ret, fv;

        if(index < 0 || index >= count) return undefined;
        
        switch(meta.interp){
        case SUPER.INTERP_ARRAYINDEX:
            ret = array[index];
            fv = ret.$fv;
            if(fv == undefined){
                fv = index == 0 ? ret : 
                    formatter.format(ret);
                ret.$fv = fv;
            }
            ret = fv;
            break;
        case SUPER.INTERP_NUMBER:
            ret = formatter.format(array[0] + meta.delta*index);
            break;
        case SUPER.INTERP_YEAR:
        case SUPER.INTERP_HALFYEAR:
        case SUPER.INTERP_MONTH:
        case SUPER.INTERP_HALFMONTH:
        case SUPER.INTERP_QUATER:
        case SUPER.INTERP_WEEK:
        case SUPER.INTERP_BIWEEK:
        case SUPER.INTERP_DATE:
        case SUPER.INTERP_HOUR:
        case SUPER.INTERP_MINUTE:
        case SUPER.INTERP_SECONDE:
            // TODO: 
            break;
        default:
            throw "Unsupported interpolating function";
        }
        return ret;
    };
    
    var _initialize = function(array, meta){
        var count;
        
        switch(meta.interp){
        case SUPER.INTERP_ARRAYINDEX:
            count = array.length; // The first item keep for "ALL" value
            break;
        case SUPER.INTERP_NUMBER:
            count = (array[array.length-1] - array[0] + meta.delta)/meta.delta;
            break;
        case SUPER.INTERP_YEAR:
        case SUPER.INTERP_HALFYEAR:
        case SUPER.INTERP_MONTH:
        case SUPER.INTERP_HALFMONTH:
        case SUPER.INTERP_QUATER:
        case SUPER.INTERP_WEEK:
        case SUPER.INTERP_BIWEEK:
        case SUPER.INTERP_DATE:
        case SUPER.INTERP_HOUR:
        case SUPER.INTERP_MINUTE:
        case SUPER.INTERP_SECONDE:
            // TODO: 
            break;
        default:
            throw "Unsupported interpolating function";
        }

        this.array = array; 
        this.meta = meta;
        this.formatter = _getFormater.call(this, meta);
        this.count = count;
    };

    var _getFormater = function(meta){
        var formatter;

        switch(tools.sql2string(meta.sql)){
        case tools.SQL_INTEGER:
        case tools.SQL_NUMBER:
        case tools.SQL_CURRENCY:
            formatter = new (Class.forName("js.text.NumberFormat"))(meta.format);
            break;
        case tools.SQL_DATE:
        case tools.SQL_TIME:
        case tools.SQL_DATETIME:
            formatter = new (Class.forName("js.text.SimpleDateFormat"))(meta.format);
            break;
        default:
            formatter = new (Class.forName("js.text.Format"))(meta.format);
        }

        return formatter;
    };

    thi$.destroy = function(){
        delete this.Runtime;

        delete this.array;
        delete this.meta;
        delete this.formatter;

        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this.destroy);

    thi$._init = function(array, meta, Runtime){
        if(array == undefined) return;

        if(!Class.isArray(array) || array.length <1) 
            throw "Request a none empty array";

        this.Runtime = Runtime;

        meta = meta || {};
        meta.sql = Class.isNumber(meta.sql) ? meta.sql : SQL.VARCHAR;
        meta.format = meta.format || "";
        meta.interp = Class.isNumber(meta.interp) ? 
            meta.interp : SUPER.INTERP_ARRAYINDEX;
        meta.delta = Class.isNumber(meta.delta) ? meta.delta : 
            (tools.sql2string(meta.sql) === tools.SQL_INTEGER ? 
             SUPER.DELTA_INTEGER : SUPER.DELTA_DECIMAL );

        _initialize.apply(this, [array, meta]);

    };

    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object).$implements(
    com.jinfonet.report.slider.SliderDataProvider);

