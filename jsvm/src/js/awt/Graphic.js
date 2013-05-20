/**
 * @File Graphic.js
 * @Create 2012-12-10
 * @author fengbo.wang@china.jinfonet.com
 */

$package("js.awt");
/**
 *
 * @param def : DOM,width,height
 * @param Runtime
 * @constructor
 */
js.awt.Graphic = function(def, Runtime){
    var CLASS = js.awt.Graphic, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    thi$.drawPath = function(ginfo){};
    thi$.drawRect = function(ginfo){};
    thi$.drawLabel = function(ginfo){};
    thi$.drawImage = function(ginfo){};
    thi$.drawEllipse = function(ginfo){};
    thi$.drawLine = function(ginfo){};
    thi$.drawCircle = function(ginfo){};
    thi$.drawEllipse3D = function(ginfo){};
    thi$.drawPieArc = function(ginfo){};
    thi$.drawPieRArc = function(ginfo){};
    thi$.drawPieDArc = function(ginfo){};

    thi$._init = function(def, Runtime){
    };
    this._init.apply(this, arguments);
};

js.awt.GraphicInfo = function(def){
    var CLASS = js.awt.GraphicInfo, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    thi$._init = function(def){
        this.imginfo=def.imginfo;//the infomation of image(JSON ex:{path:"",width:"",height:""})
        this.points=def.points|| [{x:0, y:0}];//the array of ponints(Array)
        this.size=def.size;//the width and height of Ellipse or rect(JSON ex:{w:"",h:""[,r:""]};r is radius for rounded corners, default is 0)
        this.v=def.v||"";//the text of element for display(String)
        this.param=def.param;//param of svgelement
        this.isAxis=def.isAxis;//the link is on axis(boolean)
        this.rotate=def.rotate||0;//the rotate of label
        this.tip=def.tip;//the DOM which display tip(DOM)
        this.msg=def.msg;//message infomation(JSON)
        this.lnk=def.lnk;//link infomation(JSON)
        this.menu=def.menu;//menu infomation(JSON)
        this.uuid=def.uuid|| null;//the id of element(String)
        this.tipnode=def.tipnode;//...(Array)
        this.floor=def.floor||0;//the depth of Pie
        this.obj=def.obj;//
        this.tiptext=def.tiptext;//the text of tip(String)
        this.group=def.group;//group infomation(JSON)
        this.tipNode=def.tipNode;//Array
        /*
            use for canvas
         */
        this.type=def.type;//values[0,1] 0=fill 1=stroke
        this.color=def.color;//the color of pen exp:"orange" ,"#FFA500" ,"rgb(255,165,0)","rgba(255,165,0,1)"
        this.lineWidth=def.lineWidth;
        this.isClose=def.isClose;
        this.radius=def.radius;// Array circle need one,ellipse need two (the first one is belong to x_axis)
        this.al=def.al;
        this.va=def.va;
    };
    this._init.apply(this, arguments);
};