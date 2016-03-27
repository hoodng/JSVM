/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.awt");

/**
 * The MoveObject is the entity that drag and drop 
 */
js.awt.MoveObject = function(){

	var CLASS = js.awt.MoveObject, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		return;
	}
	CLASS.__defined__ = true;

	var DOM = J$VM.DOM;
	
	/**
	 * The moving peer is a moving object's ontologing. Generally,
	 * the ontologing just is the moving object itself. But in some
	 * case, for example, when drag a tree node, the moving ontologing
	 * is the tree node, but moving object maybe looks like a shadow
	 * of ontologing.
	 */
	thi$.setMovingPeer = function(peer){
		this.movingPeer = peer;
	};
	
	thi$.getMovingPeer = function(){
		return this.movingPeer;
	};

	/**
	 * The drop target can get infomation from this moving object.
	 * 
	 * Notes: Sub class should implements this function.
	 */
	thi$.getMovingData = function(){
		return this;
	};
	
	/**
	 * The message type is such a string that identify what kind message
	 * will be posted to message receivers. Generally, message receivers
	 * are drop targets.
	 * 
	 * Notes: Sub class should implements this function.
	 */
	thi$.getMovingMsgType = function(){
		return "js.awt.event.MovingEvent";		  
	};
	
	/**
	 * The mover will invoke this method to determine moving message 
	 * should be posted to which receivers.
	 */
	thi$.getMovingMsgRecvs = function(){
		var peer = this.getMovingPeer();
		return (this != peer && peer && peer.getMovingMsgRecvs) ?
			peer.getMovingMsgRecvs() : null;
	};
	
	/**
	 * The drop target use this method to release this moving object.
	 */
	thi$.releaseMoveObject = function(){
		if(this != this.movingPeer){
			this.movingPeer.moveObj = null;
			delete this.movingPeer;			   
			this.destroy();
		}else{
			this.movingPeer = null;
		}
	};

};

/**
 * A <em>Movable</em> is used to support moving a component.<p>
 * This function request a <em>mover</em> definition as below in the model of 
 * the component.<p>
 *	
 * def.mover :{
 *	   longpress: Optinal, default is 145ms
 *	   bl: boundary left size, it's 0.0 to 1.0 of width. Default is 0.0
 *	   bt: boundary top size, it's 0.0 to 1.0 of height. Default is 0.0
 *	   br: boundary right size, it's 0.0 to 1.0 of width. Default is 0.0
 *	   bb: boundary bottom size, it's 0.0 to 1.0 of height. Default is 0.0
 *	   grid: moving on grid, the grid size default is 1px.
 *	   freedom: freedom of moving, possible values are 
 *				1: horizontal, 2: vertical and 3: both
 *	   }
 * def.movable : true|false
 * <p>
 * When the component is moving, the event "onmoving" will be raised. 
 * Other components can attach this event.
 */
js.awt.Movable = function (){

	var CLASS = js.awt.Movable, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		return;
	}
	CLASS.__defined__ = true;

	CLASS.EVT_ELEMENT_MOVE = "elementMoveEvent";

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
		System = J$VM.System, MQ = J$VM.MQ,
		max = Math.max, min = Math.min, 
		ceil = Math.ceil, floor = Math.floor, round = Math.round;
	
	var _fireMoveEvent = function(op, data){
		var container = this.getContainer();
		if(container && Class.isFunction(container.fireEvent)){
			data = data || {};
			data.op = op;

			var evt = new Event(CLASS.EVT_ELEMENT_MOVE, data, this);
			container.fireEvent(evt, false);
		}
	};

	thi$.startMoving = function(e){
		var moveObj = this.getMoveObject(e), 
			ctx = moveObj.getMovingContext(),
			pounds = ctx.container.getBounds(),
            bounds = moveObj.getBounds(),
			mover = this.getMovingConstraints();

		ctx.eventXY = e.eventXY();
		ctx.minX = mover.bl >= 1 ? 0 : -0xFFFF;
		ctx.minY = mover.bt >= 1 ? 0 : -0xFFFF;
		ctx.maxX = mover.br >= 1 ?
            (pounds.innerWidth - bounds.width) : 0xFFFF;
		ctx.maxY = mover.bb >= 1 ?
            (pounds.innerHeight- bounds.height): 0xFFFF;
        
		moveObj.setZ(DOM.getMaxZIndex(document.body)+1);
		moveObj._moveCtx = ctx;		   
		moveObj.showMoveCover(true);
		MQ.register("releaseMoveObject", this, _release);		 
	};

	thi$.processMoving = function(e){
		var moveObj = this.getMoveObject(e), ctx = moveObj._moveCtx,
			bounds = moveObj.getBounds(),
			mover = this.getMovingConstraints(),
			grid = mover.grid, freedom = mover.freedom,
			thip = ctx.container, p = thip.view,
			xy = e.eventXY(), oxy = ctx.eventXY,
			x = p.scrollLeft + bounds.userX + (xy.x - oxy.x),
			y = p.scrollTop + bounds.userY + (xy.y - oxy.y),
			minX = ctx.minX, minY = ctx.minY,
			maxX = ctx.maxX, maxY = ctx.maxY,
			changed;

		x = x < minX ? minX : x > maxX ? maxX : x;
		y = y < minY ? minY : y > maxY ? maxY : y;
		
		if(x != bounds.x || y != bounds.y){
			// Snap to grid
			x = grid*round(x/grid);
			x = (freedom & 0x01) != 0 ? x : undefined;

			y = grid*round(y/grid);
			y = (freedom & 0x02) != 0 ? y : undefined;

			changed = moveObj.setPosition(x, y);
			_fireMoveEvent.call(this, "moving", 
								{x: x, y: y, changed: changed});

			ctx.moved = true;
		}
		
		// Notify all drop targets
		var recvs = moveObj.getMovingMsgRecvs() || [];
		recvs.unshift(moveObj.getMovingPeer().uuid());
		e.setEventTarget(moveObj);
		MQ.post(moveObj.getMovingMsgType(), e, recvs);
	};
	
	thi$.endMoving = function(e){
		var moveObj = this.getMoveObject(e), ctx = moveObj._moveCtx,
			recvs = moveObj.getMovingMsgRecvs() || [], x, y, changed;

		// Notify all drop targets
		recvs.unshift(moveObj.getMovingPeer().uuid());
		e.setEventTarget(moveObj);
		MQ.post(moveObj.getMovingMsgType(), e, recvs);

		// Release MoveObject
		MQ.post("releaseMoveObject", moveObj, [this.uuid()]);

        var z = moveObj._local.userZ;
        if(Class.isNumber(z)){
            moveObj.setZ(z);
        }
        
		moveObj.showMoveCover(false);
		if(ctx.moved){
			x = moveObj.getX(); y = moveObj.getY();
			changed = moveObj.setPosition(x, y, 0x0F);
			_fireMoveEvent.call(this, "moved", 
								{x: x, y: y, changed: changed});
		}
		moveObj._moveCtx = null;
	};

	var _release = function(moveObj){
		moveObj.releaseMoveObject();
		if(this.moveObj){
			this.moveObj = null;
		}
		MQ.cancel("releaseMoveObject", this, _release);
	};

	/**
	 * Test if the element is a hotspot for moving.
	 * 
	 * @param ele, a HTMLElement
	 * @param x, y
	 * 
	 * @return boolean
	 * 
	 * Notes: Sub class should override this method
	 */
	thi$.isMoverSpot = function(ele, x, y){
		return this.isMovable();
	};

	/**
	 * Gets MoveObject from this component. 
	 * 
	 * @see js.awt.MoveObject
	 * 
	 * Notes: If need sub class can override this method
	 */	   
	thi$.getMoveObject = function(e){
		var moveObj = this.moveObj, B;
		if(!moveObj){
			moveObj = this.moveObj = this;
			moveObj.setMovingPeer(this);
			B = this.getBounds();
			moveObj.setBounds(B.x, B.y, B.width, B.height, 0x04);
		}

		return moveObj;
	};
	
	/**
	 * Tests whether this component is movable.
	 */
	thi$.isMovable = function(){
		return this.def.movable || false;
	};
	
	/**
	 * Sets whether this component is movable.
	 * 
	 * @param b, true is movable, false is unable.
	 */
	thi$.setMovable = function(b){
		var M = this.def;
		b = b || false;
		M.movable = b;
		this.getMovingConstraints();
        if(b){
            this.attachEvent(Event.W3C_EVT_MOUSE_MOVE,
                             4, this, _onmousemove);
        }else{
            this.detachEvent(Event.W3C_EVT_MOUSE_MOVE,
                             4, this, _onmousemove);
        }
	};

    var _onmousemove = function(e){
        this.showMoveCapture(e);
        return e.cancelBubble();
    };

    thi$.showMoveCapture = function(e){
        //
    };
};
