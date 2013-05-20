/**
 * @File LargeCanvas.js
 * @Create 2013-2-21
 * @author fengbo.wang@china.jinfonet.com
 */
$package("js.awt");

js.awt.LargeCanvas = function(def, Runtime){
    var CLASS = js.awt.LargeCanvas, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    var Class = js.lang.Class,Event = js.awt.Event,System = J$VM.System, MQ = J$VM.MQ,
        canvas=Class.forName("js.awt.CanvasGraphic");

    var _createPens=function(dom,w,h){
        this.pens=[];
        var count=parseInt(h/5000),th=h>=5000?5000: h,pens=this.pens,row=[];
        if(count&&h%5000)count++;
        _createCols(dom,w,th,row,0);
        pens.push(row);
        for(var i=2;i<=count;i++){
            if(i==count){
                th=h%5000;
            }else{
                th=5000;
            }
            row=[];
            _createCols(dom,w,th,row,i-1);
            pens.push(row);
        }
    };

    var _createCanvas=function(dom,w,h,x,y){
        var css="position:absolute;left:"+x+"px;top:"+y+"px";
        var can=new canvas({dom:dom,width:w,height:h,css:css});
        return can;
    }

    thi$.destroy =function(){

    };

    //def exp:{dom:(parent element),width:(..),height:(..)}
    thi$._init = function(def, Runtime){
        var dom=def.dom||document.body;
        var frag=document.createDocumentFragment();
        _createPens(frag,def.width,def.height);
        dom.appendChild(frag);
    }.$override(this._init);
    this._init.apply(this, arguments);
}
