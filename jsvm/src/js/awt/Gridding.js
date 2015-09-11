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

js.awt.Gridding = function(){
	var CLASS = js.awt.Gridding, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, System = J$VM.System,
        DOM = J$VM.DOM, MQ = J$VM.MQ,
        LINE = ["vline", "hline"],
        MOVING = ["vmoving", "hmoving"],
        EDGE = [["vmove", "hmove"],["vedge", "hedge"]];
    
    thi$.initGridding = function(grid, lineDef){
        var U = this._local, thisObj = this;
        U.gridlineDef = lineDef;

        this._getGrid = function(){
            return grid;
        };

        grid.setPeerComponent(this);
        
        MQ.register("js.awt.GridEx.changed", this, _onGridChanged);
        MQ.register("js.awt.GridEx.lineMoving", this, _onLineMoving);
    };

    thi$.onGridChanged = function(e){
    };

    var _onGridChanged = function(e){
        this.onGridChanged(e);
        _updateLines.call(this);
    };

    var _onLineMoving = function(e){
        var type = e.getType(), target, peer, bounds, dir;
        if("mouseup" === type){
            target = e.getEventTarget();
            peer = target.getMovingPeer();
            bounds = peer.getBounds();
            dir = peer.def.dir;
            this._getGrid().moveDim(
                target.getID(), dir===0 ?
                    target.getX()+bounds.width/2:
                    target.getY()+bounds.height/2, dir);
        }
    };

    var _updateLines = function(){
        var U = this._local, G = this._getGrid(),
            style = U.gridlineDef, lines, ylines, xlines, line;

        if(!G) return;

        lines = System.objectCopy(G.getAllLines(), [], true);
        xlines = lines[0]; ylines = lines[1]; 

        if(!style.close){
            xlines.shift();
            xlines.pop();

            ylines.shift();
            ylines.pop();
        }

        this.drawLines(G, xlines, ylines);
    };

    /**
     * 
     */
    thi$.drawLines = function(G, xlines, ylines){
        var U = this._local, newlines = [],
            cache = U.gridlines = (U.gridlines || {});

        cache.__lastlayout__ = (new Date()).getTime();
        
        adjustLine(G, xlines, cache, newlines);
        adjustLine(G, ylines, cache, newlines);
        _createLines.call(this, newlines, cache);
        this.eraseLines(true);
    };

    thi$.isMoverSpot = function(ele, x, y){
        return (ele === this.view);
    };

    /**
     * 
     */
    thi$.eraseLines = function(onlyDirty){
        var U = this._local, cache = U.gridlines, comp, last;
        if(cache){
            last = cache.__lastlayout__;
            for(var k in cache){
                if(k === "__lastlayout__") continue;
                comp = cache[k];
                if(!onlyDirty || (onlyDirty && comp.lastmodify !== last)){
                    comp.destroy();
                    delete cache[k];
                }
            }
        }
    };

    var adjustLine = function(G, lines, cache, newlines){
        var line, comp, b, w, h, last = cache.__lastlayout__;
        while(lines.length > 0){
            line = lines.shift();
            b = line.bounds;
            comp = cache[line.id];
            if(comp){
                w = b[2]-b[0];
                h = b[3]-b[1];
                comp.setBounds(b[0], b[1], w, h);
                comp.setMoveRange(line.minX, line.minY, line.maxX, line.maxY);
                comp.setLayoutBounds(G.getLayoutBounds());
                comp.lastmodify = last;
            }else{
                newlines.push(line);
            }
        }
    }

    var _createLines = function(lines, cache){
        var U = this._local, style = U.gridlineDef, line, comp,
            def, b, w, h, className, R, parent, G = this._getGrid(),
            last = cache.__lastlayout__;

        R = this.Runtime();
        parent = this.view;

        className = style.className || "jsvm_grid";

        while(lines.length > 0){
            line = lines.shift();
            b = line.bounds;
            w = b[2]-b[0];
            h = b[3]-b[1];
            def = {
                blassName: className,
                className: DOM.combineClassName(className, [
                    LINE[line.dir], EDGE[line.edge][line.dir]
                ]),
                id: line.id,
                stateless: true,
                movable: (line.edge != 1),
                dir: line.dir
            };

            if(def.movable){
                def.mover = style.mover || {};
                def.mover.bound = def.mover.bound || 10;
                def.mover.freedom = line.dir ? 2 : 1; 
            }

            comp =  new Line(def, R);
            comp.setPeerComponent(this);
            comp.setMoveRange(line.minX, line.minY, line.maxX, line.maxY);
            comp.setLayoutBounds(G.getLayoutBounds());
            cache[line.id] = comp;
            comp.appendTo(parent);

            comp.setBounds(b[0], b[1], w, h);
            comp.lastmodify = last;
        }
    };
	
    var Line = function(def, Runtime){
        var CLASS = Line, thi$=CLASS.prototype;
        if(CLASS.__defined__){
            this._init.apply(this, arguments);
            return;
        }
        CLASS.__defined__ = true;

        thi$.setBounds = function(x, y, width, height){
            var bounds = this.getBounds(), dir = this.def.dir;

            if(dir == 1){
                y -= (bounds.height/2);
                height = bounds.height;
            }else{
                x -= (bounds.width/2);
                width = bounds.width;
            }

            $super(
                this, x, y, width, height);

        }.$override(this.setBounds);

        thi$.inside = function(){
            return true;
        };

        thi$.getMoveObject = function(){
            var moveObj = this.moveObj, def = this.def, className;
            if(!moveObj){
                className = [this.className,
                             DOM.combineClassName(
                                 def.blassName, [MOVING[def.dir]])].join(" ");
                moveObj = this.moveObj = new js.awt.Component({
                    className: className,
                    id: this.getID(),
                    stateless: true
                }, this.Runtime(), this.cloneView());
                moveObj.getMovingMsgRecvs = _getMovingMsgRecvs.$bind(this);
                moveObj.getMovingMsgType = _getMovingMsgType.$bind(this);
                moveObj.showMoveCover = _showMoveCover.$bind(this);
                moveObj.getMovingContext = _getMovingContext.$bind(this);
                moveObj.appendTo(this.view.parentNode);
                moveObj.setMovingPeer(this);
            }

            var mb = moveObj.getBounds(), lb = this.layoutbounds;
            if(def.dir === 0){
                moveObj.setBounds(mb.x, lb.y, mb.width, lb.height);
            }else{
                moveObj.setBounds(lb.x, mb.y, lb.width, mb.height);
            }
            return moveObj;
        };

        var _showMoveCover = function(b){
            // Line no need cover
        };

        var _getMovingContext = function(){
            return {
                container:this.getPeerComponent(),
                range: this.moverange
            };
        };

        thi$.spotIndex = function(){
            return this.def.dir === 0 ? 9 : 10;
        }.$override(this.spotIndex);

        thi$.setMoveRange = function(minX, minY, maxX, maxY){
            this.moverange = [minX, minY, maxX, maxY];
        };

        thi$.setLayoutBounds= function(bounds){
            this.layoutbounds = bounds;
        };

        var _getMovingMsgRecvs = function(){
            return [this.getPeerComponent().uuid()];
        };

        var _getMovingMsgType = function(){
            return "js.awt.GridEx.lineMoving";
        };
        
        this._init.apply(this, arguments);

    }.$extend(js.awt.Component);
};

