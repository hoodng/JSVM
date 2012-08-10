/**
 * Copyright (c) Jinfonet Inc. 2000-2011, All rights reserved.
 * 
 * @File: Tools.js
 * @Create: Dec 17, 2010
 */

$package("com.jinfonet.util");

com.jinfonet.util.Tools = new function(){
    var REGX_PATH = /(.*[/|\\])(.*)/;

    /**
     * Return file path, exclude file name
     */
    this.getFilePath = function(path){
        if (path == null) return path;
        
        var m = path.match(REGX_PATH);
        return m ? m[1] : "";
    };

    /**
     * Return file name, exclude file path
     */
    this.getFileName = function(path){
        if (path == null) return path;

        var m = path.match(REGX_PATH);
        return m ? m[2] : path;    
    };

    /**
     * Return file name without suffix
     *
     */
    this.getFileNameWithoutSuffix = function(path) {
        var file = this.getFileName(path);
        if (file == null) return file;

        var p = file.lastIndexOf(".");
        if (p == -1) return file;

        return file.substring(0, p);

    };

    /**
     * Return file name's suffix
     * 
     */
    this.getFileSuffix = function(path) {
        if (path == null) return path;

        var p = path.lastIndexOf(".");
        return (p != -1) ? path.substring(p) : "";
    };

    
    this.Unit2Pixel = function (unit) {
        return Math.round(unit * 96 / 5760);
    };

    this.Unit2Point = function (unit) {
        return Math.round(unit / 80);
    };

    this.Pixcel2Unit = function (pixel) {
        return Math.round(pixel * 5760 / 96);
    };

    this.Pixcel2Inches = function (pixel) {
        return pixel / 96;
    };

    this.getFontSize = function (fontSize) {
        if (!fontSize) 
            return "9px";
        
        fontSize *= 1;
        return this.Unit2Pixel(fontSize) + "px";
    };

    var _fontName = {
        "Default" : "Arial", 
        "Dialog" : "Arial", 
        "SansSerif" : "Arial", 
        "Serif" : "'Times New Roman'", 
        "Helvetica" : "sansserif", 
        "TimesRoman" : "serif", 
        "Courier" : "'Courier New'", 
        "DialogInput" : "'Courier New'", 
        "ZapfDingbats" : "WingDings", 
        "Verdana-Bold" : "Verdana", 
        "TimesNewRomanPS-BoldMT" : "Times New Roman", 
        "BookAntiqua-Bold" : "BookAntiqua", 
        "Garamond-Bold" : "Garamond", 
        "Arial-BoldMT" : "Arial", 
        "ArialMT" : "Arial", 
        "Arial-Black" : "Arial Black", 
        "Century" : "Century"
    };

    this.getFontFace = function (fontFace) {
        
        if (fontFace && fontFace.toLowerCase() != "default") {
            return(_fontName[fontFace]) ? _fontName[fontFace] : fontFace;
        } else {
            return "Arial";
        }
        
    };

    this.getColor = function (color) {
        if (color.toLowerCase() != "transparent") 
            return "#" + color.substr(2);
        else 
            return "transparent";
    };

    this.SQL_NULL     = "Null";
    this.SQL_STRING   = "String";
    this.SQL_CURRENCY = "Currency";
    this.SQL_INTEGER  = "Integer";
    this.SQL_NUMBER   = "Number";
    this.SQL_DATE     = "Date";
    this.SQL_TIME     = "Time";
    this.SQL_DATETIME = "DateTime";
    this.SQL_BINARY   = "Binary";
    this.SQL_BOOLEAN  = "Boolean";

    var sqlMap = {
        "0" : "Null",    // NULL
        "1" : "String",  // CHAR
        "2" : "Currency",// NUMERIC
        "3" : "Currency",// DECIAML
        "4" : "Integer", // INTEGER
        "5" : "Integer", // SMALLINT
        "6" : "Number",  // FLOAT
        "7" : "Number",  // REAL
        "8" : "Number",  // DOUBLE
        "12": "String",  // VARCHAR
        "91": "Date",    // DATE
        "92": "Time",    // TIME
        "93": "DateTime",// TIMESTAMP

        "-1": "String",  // LONGVARCHAR
        "-2": "Binary",  // BINARY
        "-3": "Binary",  // VARBINARY
        "-4": "Binary",  // LONGBINARY        
        "-6": "Integer", // TINYINT
        "-5": "Integer", // BIGINT
        "-7": "Boolean"  // BIT
    };

    /**
     * Convert sql type to string
     */
    this.sql2string = function(sql){
        return sqlMap[""+sql];
    };

    this.sameSqlType = function(sql0, sql1){
        return this.sql2string(sql0) === this.sql2string(sql1);
    };

}();

