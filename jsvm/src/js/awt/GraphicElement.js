/**
 * @File SVGGraphic.js
 * @Create 2013-1-8
 * @author fengbo.wang@china.jinfonet.com
 */
$package("js.awt");

$import("js.awt.Graphic");

js.awt.Graphic = function(def, Runtime){
    var CLASS = js.awt.Graphic, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var svg;

    thi$.setAttributes = function (ginfo) {
        if (svg) {
            this.e.attr(ginfo.param);
        }
    };

    thi$.getAttributes = function () {
        if (svg) {
            return this.e.attr();
        }
    };

    thi$.dispose = function () {
        if (svg) {
            _detachAllEvent();

        }
    };

    var _detachAllEvent = function () {
        var e = this.e;
        e.unmousemove();
        e.unmouseover();
        e.unmouseout();
        e.unmousedown();
        e.unmouseup();
    };

    thi$.clear = function () {
        if (svg) {
            _detachAllEvent();
        }
    };

    thi$._init = function ( def, Runtime) {
        svg = def.type || "";
        this.e = def.ele || undefined;
    };
    this._init.apply(this, arguments);
};