/**
 * @File CanvasGraphic.js
 * @Create 2013-2-21
 * @author fengbo.wang@china.jinfonet.com
 */
$package("js.awt");

js.awt.CanvasGraphic = function(def, Runtime){
    var CLASS = js.awt.CanvasGraphic, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    var Event = js.awt.Event,System = J$VM.System, MQ = J$VM.MQ;

    thi$.drawRect = function(rect,style){
        if(!rect||rect.x==undefined||rect.y==undefined||rect.w==undefined||rect.h==undefined)return;
        var pen=this.pen,s=style||{},type=s.type|| 0,p=rect,c= s.color||"#fff";
        pen.lineWidth=s.lineWidth||1;
        pen.beginPath();
        var x=fixPoint(p.x),y=fixPoint(p.y);
        if(type){
            pen.rect(x, y, p.w, p.h);
            pen.strokeStyle=c;
            pen.stroke();
        }else{
            pen.rect(x, y, p.w, p.h);
            pen.fillStyle=c;
            pen.fill();
        }
    };

    thi$.drawText = function(text,rect,style,rp){
        if(text==undefined)return;
        var pen=this.pen,s=style||{type:0,color:"#000",ha:0,va:0,rotate:0},
            type=s.type|| 0,rect=rect||{x:0,y:0,w:this.getWidth,h:this.getHeight()},
            p={x:rect.x,y:rect.y,w:rect.w,h:rect.h},v=text, dx=0,dy=0,
            r=s.rotate|| 0,ha=s.ha||0,va=s.va|| 0,to= s.textOverflow||"normal";
        if(s.font)
            pen.font=_getFont(s.font);
        pen.textBaseline = 'top';
        var h=this.getPixelFont(pen.font),w=pen.measureText(v).width,maxw=!r? p.w: p.h;
        if(to=="normal")
            v=cutString.call(this,v, maxw);
        else if(to=="autosize"){

        }
        else
            v=ellipsisString.call(this, v,maxw);
        if(rp==undefined){
            if(r){
                pen.save();
                pen.translate(p.x, p.y);
                pen.rotate(Math.PI*r/180);
                w=pen.measureText(v).width;
                if(p&& p.w&& p.h){
                    if(va){
                        dx= va==0.5 ? (p.h-w)/2:p.h-w;
                    }else{
                    }
                    if(ha==1){
                        dy=p.w-h;
                        if(r>0)dy+=h/5;
                    }else{
                        dy= ha==0.5 ? (p.w-h)/2:0;
                        if(r<0)dy+=-h/5;
                    }
                }
                if(r>0){
                    pen.translate(dx,-h-dy);
                }else{
                    pen.translate(-w-dx,dy);
                }
            }else{
                if(p&& p.w&& p.h){
                    if(ha){
                        dx= ha==0.5 ? (p.w-w)/2: p.w-w-2;
                    }
                    if(va){
                        dy= va==0.5 ? (p.h-h)/2: p.h-h;
                    }
                }
                p.x+=dx>0?dx:0;
                p.y+=(dy>0?dy:0)+(va!=1?-h/5:0);
            }
        }else{
            if(r){
                pen.save();
                pen.translate(rp.x+ p.x, rp.y+ p.y);
                pen.rotate(Math.PI*r/180);
                w=pen.measureText(v).width;
                if(p&& p.w&& p.h){
                    if(va){
                        dx= va==0.5 ? (p.h-w)/2:p.h-w;
                    }else{
                    }
                    if(ha==1){
                        dy=p.w-h;
                    }else{
                        dy= ha==0.5 ? (p.w-h)/2: 0;
                    }
                }
                if(r>0){
                    pen.translate(dx+(rp.x- p.x),-h-dy-(rp.y- p.y));
                }else{
                    pen.translate(-w-dx-(rp.x- p.x),dy+(rp.y- p.y));
                }
            }else{
                dx= pen.measureText(v).width/2-rp.x;
                dy= h/2 -rp.y;
                p.x-=dx;
                p.y-=dy;
            }
        }
        if(type){
            pen.strokeStyle=s.color;
            pen.strokeText(v, p.x, p.y);
        }else{
            pen.fillStyle=s.color;
            if(r){
                if(to=="autosize")
                    pen.fillText(v, 0, 0, maxw);
                else
                    pen.fillText(v, 0, 0);
                pen.restore();
            }else{
                if(to=="autosize")
                    pen.fillText(v, p.x, p.y,maxw);
                else
                    pen.fillText(v, p.x, p.y);
            }
        }
    };

    /*
     mode: 0(continue and unclosed line)
     1(continue and enclosed line)
     2(divergent line)
     3(noncontinuous line);
     4(dashed line)
     style:color and lineWidth and type (0:stroke 1:fill)
     */
    thi$.drawLine = function(points,mode,style){
        if(!points)return;
        var ps=points,pl=ps.length,pen=this.pen,m=mode|| 0,
            s=style||{lineWidth:1,color:"#000000",type:0};
        pen.lineWidth=s.lineWidth||1;
        if(pl){
            pen.beginPath();
            if(mode!=4){
                pen.moveTo(fixPoint(ps[0].x),fixPoint(ps[0].y));
                for(var i=1;i<pl;i++){
                    pen.lineTo(fixPoint(ps[i].x),fixPoint(ps[i].y));
                    if(m==2){
                        pen.moveTo(fixPoint(ps[0].x),fixPoint(ps[0].y));
                    }else if(m==3&&i++<pl-1){
                        pen.moveTo(fixPoint(ps[i].x),fixPoint(ps[i].y));
                    }
                }
            }else{
                var step= 5,broke= 3, st, e,i= 1, x,y;
                if(ps[0].x==ps[1].x){
                    x=fixPoint(ps[0].x);
                    st=fixPoint(Math.min(ps[0].y,ps[1].y));
                    e=fixPoint(Math.max(ps[0].y,ps[1].y));
                    while(st<e){
                        pen.moveTo(x,st);
                        y=st+step;
                        if(y>e)y=e;
                        pen.lineTo(x,y);
                        st=y+broke;
                    }
                }else if(ps[0].y==ps[1].y){
                    y=fixPoint(ps[0].y);
                    st=fixPoint(Math.min(ps[0].x,ps[1].x));
                    e=fixPoint(Math.max(ps[0].x,ps[1].x));
                    while(st<e){
                        pen.moveTo(st,y);
                        x=st+step;
                        if(x>e)x=e;
                        pen.lineTo(x,y);
                        st=x+broke;
                    }
                }
            }
            if(m==1)
                pen.closePath();
            if(!s.type){
                pen.strokeStyle=s.color||"#000";
                pen.stroke();
            }else{
                pen.fillStyle=s.color||"#000";
                pen.fill();
            }
        }
    };

    thi$.drawEllipse = function(ginfo){
        var p=ginfo.points[0],pen=this.pen, x= p.x,y= p.y,a=ginfo.radius[0],b=ginfo.radius[1];
        pen.save();
        var r = (a > b) ? a : b;
        var ratioX = a / r;
        var ratioY = b / r;
        pen.scale(ratioX, ratioY);
        pen.beginPath();
        pen.moveTo((x + a) / ratioX, y / ratioY);
        pen.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI);
        pen.closePath();
        pen.restore();
        if(ginfo.type){
            pen.strokeStyle=ginfo.color;
            pen.stroke();
        }else{
            pen.fillStyle=ginfo.color;
            pen.fill();
        }
    };

    thi$.drawArc = function(point,r,style){
        if(!point||!r)return;
        var p=point,pen=this.pen,s=style.s==undefined?0:style.s*Math.PI/180,
            e=style.arc==undefined?0:style.arc*Math.PI/180;
        if(e==0)return;
        pen.beginPath();
        if(s==0&&e==360*Math.PI/180)
            pen.arc(p.x, p.y,r,s,e);
        else{
            pen.moveTo(p.x, p.y);
            pen.arc(p.x, p.y,r,s,e);
        }
        if(style.type){
            pen.strokeStyle=style.color;
            pen.stroke();
        }else{
            pen.fillStyle=style.color;
            pen.fill();
        }
        pen.closePath();
    };

    thi$.drawImage = function(ginfo){

    };

    thi$.getPixelFont=function(f){
        if(!f)return 12;
        var pi= f.indexOf("px"),t=f.charAt(--pi),fp="";
        while(t&&!isNaN(t)){fp=t+fp;t=f.charAt(--pi);};
        return fp;
    };

    var _getFont=function(f){
        var temp="";
            temp+= f.fontStyle||"normal";
            temp+=" "+(f.fontWeight || "")+"";
            temp+=" "+(f.fontSize || "12px");
            temp+=" "+(f.fontFamily || "sans-serif");
        return temp;
    };

    thi$.setFont=function(f){
        this.pen.font=_getFont(f);
    };

    thi$.getPenFont=function(){
        return this.pen.font;
    };

    var cutString=function(text,width){
        if(!width)return text;
        var pen=this.pen,v=text;
        var w=pen.measureText(text).width;
        while(w> width){
            v= v.substr(0, v.length-1);
            w=pen.measureText(v).width;
        }
        return v;
    };

    var ellipsisString=function(text,width){
        if(!width)return text;
        var pen=this.pen,v=text;
        var w=pen.measureText(text).width,ew=pen.measureText("...").width;
        while(w> width){
            v= v.substr(0, v.length-1);
            w=pen.measureText(v).width+ew;
        }
        if(v!=text)
            v+="...";
        return v;
    };

    var fixPoint=function(x){
        if(x==0)return 0;
        return Math.floor(x)-0.5;
    };

    thi$.getLabelWidth=function(text){
        return this.pen.measureText(text).width;
    };

    thi$.clear = function(){
        this.pen.clearRect(0,0,this.getWidth(),this.getHeight());
    };

    thi$.destroy =function(){
        var can=this.pen.canvas;
        can.parentNode.removeChild(can);
        delete this.pen;
    };

    thi$.canvas=function(){
        return this.pen.canvas;
    };

    thi$.clearArea = function(x,y,w,h){
        this.pen.clearRect(x,y,w,h);
    };

    thi$.getWidth=function(){
        return this.pen.canvas.width;
    };

    thi$.getHeight=function(){
        return this.pen.canvas.height;
    };

    thi$.getSize=function(){
        return {w:this.getWidth(),h:this.getHeight()};
    };

    thi$.setSize=function(w,h){
        var c=this.pen.canvas;
        c.width=w;
        c.height=h;
    };

    thi$.clone=function(){
        if(this.pen){
            var img=new Image();
            var tc=this.pen.canvas;
            img.src=tc.toDataURL();
            var can=tc.cloneNode(true);
            can.getContext("2d").drawImage(img,0,0);
            return can;
        }
        return null;
    };

    //def exp:{dom:(parent element),width:(..),height:(..)[,bgcolor:(..)]}
    thi$._init = function(def, dom){
        var dom=dom||document.body;
        if(dom.tagName.toLowerCase()!="canvas"){
            var can=document.createElement("CANVAS");
            can.width=def.width||500;
            can.height=def.height||500;
            can.style.cssText=def.css||"";
//        can.style.backgroundColor=def.bgcolor||"white";
            can.innerHTML="if you see these message , your browser can not support canvas";
            dom.appendChild(can);
            this.pen = can.getContext('2d');
        }else{
            this.pen = dom.getContext('2d');
        }
//        this.pen.globalCompositeOperation="xor";
    }.$override(this._init);
    this._init.apply(this, arguments);
};
