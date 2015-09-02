/**
  Copyright 2008-2015, The JSVM Project. 
  All rights reserved.
  
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.awt");

/**
 * @param def:{
 *     
 * }
 */
js.awt.Outline = function(){

    var CLASS = js.awt.Outline, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, DOM = J$VM.DOM,
        LINES = ["top", "right", "bottom", "left",
                 "nw", "w", "sw", "s", "se","e","ne","n"];

    var _createView = function(i, lines, selector){
        var cview = this._coverView || this.view, view, uuid;

        uuid = this.uuid();
        view = DOM.createElement("DIV");
        view.uuid = uuid;
        view.id = [this.getID(), LINES[i]].join("-");
        view.className = selector;
        view.style.position = "absolute";
        view.style.zIndex = this.getZ();
        if(cview === self.document.body){
            cview.appendChild(view);
        }else{
            DOM.insertAfter(view, cview);            
        }
        lines.push(view);
    };

    thi$.showOutline = function(b, className){
        var views = this._outlineView, clazz, ext, selector, bounds;

        if(b){
            if(!views){
                bounds = this.getBounds();
                views = this._outlineView = [];
                clazz = ["jsvm_", className||""].join(" ");
                for(var i=0; i<12; i++){
                    if(i < 4 || this.isResizable(i-4)){
                        ext = ["outline"];
                        if(i < 4){
                            ext.push(["outline", LINES[i]].join("--"));
                        }else{
                            ext.push("outline-resizer",
                                     ["outline-resizer", LINES[i]].join("--"));
                        }
                        selector = DOM.combineClassName(clazz, ext);
                        _createView.call(this, i, views, selector);
                    }
                }
            }
            this.adjustOutline(bounds);
        }else{
            this.removeOutline();
        }
    };

    var SETBOUNDS = {
        top: function(line, lbounds, bounds){
            DOM.setBounds(line, bounds.x, bounds.y,
                          bounds.width, lbounds.height, lbounds);
        },
        right: function(line, lbounds, bounds){
            DOM.setBounds(line, (bounds.x + bounds.width-lbounds.width),
                          bounds.y, lbounds.width, bounds.height, lbounds);
        },
        bottom: function(line, lbounds, bounds){
            DOM.setBounds(line, bounds.x,
                          (bounds.y+bounds.height-lbounds.height),
                          bounds.width, lbounds.height, lbounds);
        },
        left: function(line, lbounds, bounds){
            DOM.setBounds(line, bounds.x, bounds.y, lbounds.width,
                          bounds.height, lbounds);
        },
        nw: function(line, lbounds, bounds){
            DOM.setBounds(line, bounds.x, bounds.y,
                          lbounds.width, lbounds.height, lbounds);
        },
        w: function(line, lbounds, bounds){
            if(bounds.height <= 24){
                line.style.visibility = "hidden";
            }else{
                DOM.setBounds(line, bounds.x,
                              Math.round(bounds.y+(bounds.height/2)-lbounds.height/2),
                              lbounds.width, lbounds.height, lbounds);
                line.style.visibility = "visible";
            }
        },
        sw: function(line, lbounds, bounds){
            DOM.setBounds(line, bounds.x, bounds.y+bounds.height-lbounds.height,
                          lbounds.width, lbounds.height, lbounds);
        },
        s: function(line, lbounds, bounds){
            if(bounds.width <= 24){
                line.style.visibility = "hidden";
            }else{
                DOM.setBounds(line,
                              Math.round(bounds.x + bounds.width/2 - lbounds.width/2),
                              bounds.y+bounds.height-lbounds.height,
                              lbounds.width, lbounds.height, lbounds);
                line.style.visibility = "visible";
            }
        },
        se: function(line, lbounds, bounds){
            DOM.setBounds(line, bounds.x+bounds.width-lbounds.width,
                          bounds.y+bounds.height-lbounds.height,
                          lbounds.width, lbounds.height, lbounds);
        },
        e: function(line, lbounds, bounds){
            if(bounds.height <= 24){
                line.style.visibility = "hidden";
            }else{
                DOM.setBounds(line,
                              bounds.x+bounds.width-lbounds.width,
                              Math.round(bounds.y+(bounds.height/2)-lbounds.height/2),
                              lbounds.width, lbounds.height, lbounds);
                line.style.visibility = "visible";
            }
        },
        ne: function(line, lbounds, bounds){
            DOM.setBounds(line,
                          bounds.x+bounds.width-lbounds.width,
                          bounds.y,
                          lbounds.width, lbounds.height, lbounds);
        },
        n: function(line, lbounds, bounds){
            if(bounds.width <= 24){
                line.style.visibility = "hidden";
            }else{
                DOM.setBounds(line,
                              Math.round(bounds.x + bounds.width/2 - lbounds.width/2),
                              bounds.y,
                              lbounds.width, lbounds.height, lbounds);
                line.style.visibility = "visible";
            }
        }
    };
    
    thi$.adjustOutline = function(bounds){
        var views = this._outlineView, i, len, line, id, lbounds;
        if(!DOM.isDOMElement(this.view) || !views) return;
        bounds = bounds || this.getBounds();
        for(i=0, len=views.length; i<len; i++){
            line = views[i];
            lbounds = DOM.getBounds(line);
            id = line.id.split("-");
            id = id[id.length-1];
            SETBOUNDS[id](line, lbounds, bounds);
        }
    };

    thi$.setOutlineZIndex = function(z){
        var views = this._outlineView;
        if(!views) return;
        for(var i=0, len=views.length; i<len; i++){
            views[i].style.zIndex = z;
        }
    };

    thi$.setOutlineDisplay = function(show){
        var views = this._outlineView;
        if(!views) return;
        for(var i=0, len=views.length; i<len; i++){
            views[i].style.display = show;
        }
    };

    thi$.removeOutline = function(){
        var views = this._outlineView;
        if(!views) return;
        while(views.length > 0){
            DOM.remove(views.shift(), true);
        }
        delete this._outlineView;
    };
};

