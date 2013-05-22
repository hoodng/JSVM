/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
 Redistribution and use in source and binary forms, with or without modification, 
 are permitted provided that the following conditions are met:
 
 1. Redistributions of source code must retain the above copyright notice, 
 this list of conditions and the following disclaimer.
 
 2. Redistributions in binary form must reproduce the above copyright notice, 
 this list of conditions and the following disclaimer in the 
 documentation and/or other materials provided with the distribution.
 
 3. Neither the name of the JSVM nor the names of its contributors may be 
 used to endorse or promote products derived from this software 
 without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
 INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
 BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
 OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 OF THE POSSIBILITY OF SUCH DAMAGE.

 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.awt");

$import("js.awt.Component");
$import("js.awt.Containable");
$import("js.awt.ZOrderManager");

/**
 * A generic container object is a component that can contain other components.<p>
 * A container has below properties in its model:
 * @param def :{
 *	   zorder : true/false
 *	   layout : {classType, setting, status}, see also 
 *				<code>js.awt.Layout</code>
 *	   items :array of children components ID,
 *	   id : the <em>model</em> of child component.
 * 
 * }
 * @param Runtime, see also js.awt.Component
 * @param view, see also js.awt.Component
 */
js.awt.Container = function (def, Runtime, view){

	var CLASS = js.awt.Container, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM, 
        System = J$VM.System, MQ = J$VM.MQ, List = js.util.LinkedList;

	/**
	 * Add the component to the container
	 * 
	 * @param comp, component
	 */
	thi$.addComponent = function(comp, constraints){
		return this.insertComponent(undefined, comp, constraints);
	};
	
	/**
	 * Insert a component to the container.
	 * 
	 * @param index: {Number} An integer number to indicate the insert position
	 * @param comp: {Component} The component to insert
	 * @constraints: {Object} The constraints of the inserting component
	 */
	thi$.insertComponent = function(index, comp, constraints){
        var items = this.items0(), ref;

		if(!isNaN(index) && index >= 0 && index < items.length){
			ref = this.getElementById(items[index]);
		}

        this.insertChildBefore(comp, ref);

		this._addComp(comp, constraints);		  
		this.zOrderAdjust();

		return comp;
	};
	
	/**
	 * Get the component with the specified component id
	 */
	thi$.getComponent = function(id){
		return this.getElementById(id);
	};
	
	/**
	 * Return all components 
	 */
	thi$.getAllComponents = function(filter){
        return this.getElements(filter);
	};
	
	/**
	 * Remove the component with specified component id
	 * 
	 * @param comp, the component or component id
	 */
	thi$.removeComponent = function(comp){
        comp = this.removeChild(comp);

		if(this.layout){
			this.layout.removeLayoutComponent(comp);
		}
		if(this._local.active === comp){
			this._local.active = undefined;
		}

		this.zOrderAdjust();

		return comp;
	};

    thi$.removeAll = function(gc){
        arguments.callee.__super__.apply(this, arguments);

        if(this.layout){
            this.layout.invalidateLayout();
        }

    }.$override(this.removeAll);
	
	/**
	 * Activate the component with specified component or id
	 */
	thi$.activateComponent = function(e){
		if(e == undefined){
			arguments.callee.__super__.call(this);
			return;
		}

		var id, comp;
		if(e instanceof Event){
			id = arguments[1].id;
		}else if(e instanceof js.awt.Element){
			id = e.id;
		}else{
			id = e;
		}

		comp = this[id];

		if(comp === undefined) return;

		if(this.isZOrder()){
			this.bringCompToFront(comp, 0x07);
		}

		// If this container is activateman == true, then 
		// this function will change current component state 
		// to activated, and other components to un-activated.
		if(this.def.activateman == true){
			comp.setActivated(true);
			this._local.active = comp;
			(function(compid){
				 if(compid != id){
					 this.getComponent(compid).setActivated(false);
				 }
			 }).$forEach(this, this.def.items);
		}

	}.$override(this.activateComponent);
	
	/**
	 * Return current active component;
	 */
	thi$.getActiveComponent = function(){
		return this._local.active;
	};
	
	/**
	 * Set <em>LayoutManager</em> for this container
	 * 
	 * @see js.awt.LayoutManager
	 */
	thi$.setLayoutManager = function(layout){
		if(layout instanceof js.awt.LayoutManager){
			this.layout = layout;
		}
	};
	
	/**
	 * Layout components
	 */
	thi$.layoutComponents = function(force){
		if(this.layout.instanceOf(js.awt.LayoutManager)){
			this.layout.layoutContainer(this, force);
		}
	};
	
	/**
	 * Return the amount of the components
	 */
	thi$.getComponentCount = function(){
		return this.getElementsCount();
	};
	
	/**
	 * Test if contains the component
	 */
	thi$.contains = function(c, containSelf){
		var id;
		switch(Class.typeOf(c)){
		case "string":
			id = c;
			break;
		case "object":
			// Maybe a js.awt.Component instance
			id = c.id;
			break;
		case "null":
		case "undefined":
			return false;
		default:
			// Maybe html element
			return arguments.callee.__super__.call(
				this, c, containSelf);
		}

		return this[id] != undefined;

	}.$override(this.contains);
	
	
	/**
	 * @see js.awt.BaseComponent
	 */
	thi$.getPreferredSize = function(nocache){
		var bounds, d;
		if(nocache === true){
			bounds = this.getBounds();
			d = this.layout.preferredLayoutSize(this, true);
			return {
				width: this.isRigidWidth() ? bounds.width : d.width,
				height:this.isRigidHeight()? bounds.height: d.height
			};
		}else {
			if(!this.def.prefSize){
				bounds = this.getBounds();
				d = this.layout.preferredLayoutSize(this, true);
				this.setPreferredSize(
					this.isRigidWidth() ? bounds.width : d.width,
					this.isRigidHeight()? bounds.height: d.height
				);
			}
			return this.def.prefSize;
		}
	}.$override(this.getPreferredSize);

	/**

	 *		* @see js.awt.BaseComponent
	 */
	thi$.getMinimumSize = function(nocache){
		return nocache === true ? 
			this.layout.minimumLayoutSize(this, nocache) : 
			arguments.callee.__super__.apply(this, arguments);
	}.$override(this.getMinimumSize);

	/**
	 * @see js.awt.BaseComponent
	 */
	thi$.getMaximumSize = function(nocache){
		return nocache === true ? 
			this.layout.maximumLayoutSize(this, nocache) : 
			arguments.callee.__super__.apply(this, arguments);
	}.$override(this.getMaximumSize);
	
	/**
	 * @see js.awt.Component
	 */
	thi$.repaint = function(){
		if(arguments.callee.__super__.apply(this, arguments)){
			var comps = this.items0(), i, len, comp;
			for(i=0, len= comps.length; i<len; i++){
				comp = this[comps[i]];
				comp.repaint();
			}

			return true;
		}

		return false;

	}.$override(this.repaint);
	
	/**
	 * Return whether this container size is auto fit content
	 */
	thi$.isAutoFit = function(){
		return this.def.autofit === true;
	};

	/**
	 * 
	 */
	thi$.autoResize = function(){
		if(!this.isAutoFit()) return;
		
		var bounds = this.getBounds(), 
		prefer = this.getPreferredSize(true/*nocache*/),
		w = bounds.userW, h = bounds.userH;

		w = (prefer.width > w) ? prefer.width : w;
		h = (prefer.height> h) ? prefer.height: h;

		var container = this.getContainer();
		if(container){
			container.doLayout();
		}else{
			this.setSize(w, h);			   
		}
	};

	/**
	 * @see js.awt.Component
	 */
	thi$.doLayout = function(force){
		if(arguments.callee.__super__.apply(this, arguments)){
			this.layoutComponents(force);
			return true;
		}

		return false;
	}.$override(this.doLayout);
	
	thi$._addComp = function(comp, constraints, refComp){
		constraints = constraints || comp.def.constraints;

		if(this.layout){
			this.layout.addLayoutComponent(comp, constraints);
		}
	};
	
	/**
	 * def:{
	 *	   items:[compid],
	 *	   compid:{}
	 * }
	 */
	thi$._addComps = function(def){
		var comps = def.items, R = this.Runtime(),
		oriComps = this._local.items;
		
		List.$decorate(def.items);

		for(var i=0, len=comps.length; i<len; i++){
			var compid = comps[i], compDef = def[compid];
			if(Class.typeOf(compDef) === "object"){
				compDef.id = compDef.id || compid;
				compDef.className = compDef.className || 
					(this.def.className + "_" + compid);

				var comp = new (Class.forName(compDef.classType))(
					compDef, R);
                
                this.appendChild(comp);

				this._addComp(comp, compDef.constraints);

			}
		}
	};
	
	/**
	 * Override the destroy of js.awt.Component
	 */
	thi$.destroy = function(){
		this.removeAll(true);

		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.destroy);

	/**
	 * @see js.awt.Component
	 */
	thi$._init = function(def, Runtime, view){
		if(def == undefined) return;

		def.classType = def.classType || "js.awt.Container";
		def.className = def.className || "jsvm_container";

		arguments.callee.__super__.apply(this, arguments);
		
		def.layout = def.layout || {};
		def.layout.classType = def.layout.classType || "js.awt.LayoutManager";
		this.setLayoutManager(
			new (Class.forName(def.layout.classType))(def.layout));
		def.activateman = Class.isBoolean(def.activateman) ? def.activateman : false;

		// Keep original order
		var oriComps = this._local.items = List.$decorate([]);
		
		// Add children components
		var comps = def.items;
		if(Class.typeOf(comps) === "array"){
			this._addComps(def);
		}else{
			def.items = List.$decorate([]);
		}
		
		this.zOrderAdjust();

	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component).$implements(
    js.awt.Containable, js.awt.ZOrderManager);

