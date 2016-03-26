/**

 Copyright 2010-2013, The JSVM Project. 
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
 * File: List.js
 * Create: 2012/04/28 01:47:36
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

$import("js.swt.ListItem");

/**
 * Define the List. A <em>List</em> is a item container.
 * 
 * @class js.swt.List
 * @extends js.awt.Container
 * 
 * @constructor Initialize the List.
 * @param {Object} The definition of the List.
 *
 *		  @example 
 *		  def: {
 *			  className: {String} required,
 *			  css: {String} optional
 *			  id: {String} optional,
 *			  container: {js.awt.Component} requied.
 * 
 *			  multiEnable: {Boolean} Default is <em>false</em>, required,
 *			  multiByCheck: {Boolean} Default is false. When <em>multiEnable</em>
 *				  is true, if the <em>multiByCheck</em> is false, the "CTRL" and
 *				  "SHIFT" keys will be validation. Otherwise "CTRL" and "SHIFT" 
 *				  keys will be used and each item cannot be markable. 
 *			  useMarkerToggle: {Boolean} Default is false, optional. Indicate 
 *				  whether only when the marker of item is clicked, the item can
 *				  be selected. Other than selecting it by clicking any part of 
 *				  the item. When <em>multiByCheck</em> is false, it will be ignored.
 * 
 *			  distinct: {Boolean} Default is false, required. Indicate whether item
 *				  of List is distinct. 
 *			  searchEnable: {Boolean} Default is false, required. Indicate whether 
 *				  the List can support quick search. 
 *
 *			  lazy: {Boolean} Default is false, optional. Indicate whether all 
 *				  items should be loaded lazily. That is to say, all items will 
 *				  be added and removed asynchronously.
 *	
 *			  itemDefs: {Array} Definitions of items. If it is specified, the itemModels 
 *				 will be ignored. 
 *			  itemModels: {Array} Models of items, optional. Its structure is as follow:
 *				  [
 *					{dname: xxx, img: xxx (Optional), value},
 *					......
 *					{dname: xxx, img: xxx (Optional), value}	 
 *				  ] 
 *		  }
 * 
 *	Attention: 
 *		only when <em>multiEnable</em> is <em>true</em>, the <em>multiByCheck</em> 
 *		can take effect. Otherwise it will be ignored. In addition, only when <em>
 *		multiByCheck</em> takes effect, the <em>useMarkerToggle</em> can take effect.
 */ 
js.swt.List = function(def, runtime){
	var CLASS = js.swt.List, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	CLASS.EVT_READY = "Ready";
	CLASS.EVT_ACK_ITEMSADDED = "ItemsAdded";
	CLASS.EVT_ACK_ITEMSREMOVED = "ItemsRemoved";
	
	CLASS.EVT_ITEMSELECTED = "ItemSelected";
	CLASS.EVT_ITEMCLICKED = "ItemClicked";
	CLASS.EVT_ITEMMOVED = "ItemMoved";

	var Class = js.lang.Class, Event = js.util.Event, 
	DOM = J$VM.DOM, System = J$VM.System,

	LinkedList = js.util.LinkedList, 
	ListItem = js.swt.ListItem;
	
	thi$.item = function(uuid){
		return this._local.cache[uuid];
	};
	
	/**
	 * Returen true if items can ack their follower's interaction required,
	 * otherwise return false.
	 */
	thi$.isReady = function(){
		return this._isReady;
	};
	
	var _preSelect = function(item){
		if(!item.isSelected()){
			return;
		}
		
		var uuid = item.uuid();
		if(this.multiEnable 
		   || (this._selectedItems.length == 0)){
			this._selectedItems.addLast(uuid);	 
		}else{
			item.setSelected(false);
		}
	};
	
	/**
	 * Add a list item to the list.
	 * 
	 * @param {js.swt.ListItem} item The item to add.
	 * @param {Boolean} ack Indicate whether all items are added to the list 
	 *		  and they can ack their follower's interaction required.
	 * 
	 * @param {Boolean} force Indicate whether the ack need be done however
	 *		  the specified item was/wasn't be added literally.
	 * 
	 */
	thi$.addItem = function(item, ack, force){
		this.insertItem(undefined, item, ack, force);
	};

	/**
	 * Insert the specified item to the list at the specified index position.
	 * 
	 * @param {Number} index The specified index position to insert. If a negative
	 *		  number is given, it is treated as "length + index".
	 * @param {js.swt.ListItem} item The specified item to add.
	 * @param {Boolean} ack Indicate whether all items are added to the list 
	 *		  and they can ack their follower's interaction required.
	 * 
	 * @param {Boolean} force Indicate whether the ack need be done however
	 *		  the specified item was/wasn't be added literally.
	 */
	thi$.insertItem = function(index, item, ack, force){
		if(!item || !(item instanceof ListItem) 
		   || (this.distinct && this.contains(item.def))){
			// Maybe some item has been added before the last one
			if(ack === true && force === true){ 
				_sendAck.call(this, "ACK_ADD", true);
			}	
			
			return;
		}

		var U = this._local, items = this._items, len = items.length, 
		ref, uuid = item.uuid();

		if(Class.isNumber(index)){
			if(index < 0){
				index = len + index;
			}

			if(index > len){
				index = len;
			}

			if(index < 0){
				index = 0;
			}

			ref = U.cache[items[index]];
		}

		item.setPeerComponent(this);
		DOM.insertBefore(item.view, ref ? ref.view : null, this.listView);

		if(ref){
			items.add(index, uuid);
		}else{
			items.addLast(uuid);
		}
		U.cache[uuid] = item;
		
		// Rectify the item's selected state
		_preSelect.call(this, item);
		
		// Check whether the current item searched
		this._canBeSearched = this._canBeSearched && (item.isSearchable());
		
		if(ack === true){
			// Re-calculate the size of list view
			// _invalidateSize.call(this);
			// _setAck.call(this, "ACK_ADD");

			_sendAck.call(this, "ACK_ADD", true);
		}
	};
	
	var _setItems = function(items, append){
		// When there is nothing to set, we will remove all old items
		// and then nofity.
		var len = items ? items.length : 0;
		if(!append){
			this._isReady = false;
			this.wipe();
			
			if(len == 0){
				_sendAck.call(this, "ACK_ADD", true);
			}
		}

		if(len == 0){
			return;
		}
		
		var i, item, isLast = false;
		for(i = 0; i < len; i++){
			item = items[i];
			isLast = (i == len - 1);
			
			if(this.lazy){
				this.addItem.$delay(this, 0, item, isLast, isLast);
			}else{
				this.addItem(item, isLast, isLast);
			}
		}
	};
	
	/**
	 * Replace all old items with the new items.
	 * 
	 * @param {Array} items Objects of js.swt.ListItem to add
	 */
	thi$.setItems = function(items){
		_setItems.call(this, items, false);
	};
	
	/**
	 * Add the specified items to the list.
	 * 
	 * @param {Array} items Objects of js.swt.ListItem to add
	 */
	thi$.addItems = function(items){
		_setItems.call(this, items, true);
	};
	
	// {dname: xxx, value: xxx}
	var _createItemDef = function (model) {
		var itemDef = {
			markable: this.multiByCheck,
			showTips: this.showTips,
			toggle: false,
			model: model
		};

		return itemDef;
	};

	/**
	 * Insert item to the specified position of current list with the given definition.
	 * 
	 * @link #insertItem
	 */
	thi$.insertItemByDef = function(index, itemDef, ack, force){
		if(!itemDef || (this.distinct && this.contains(itemDef))){
			// Maybe some item has been added before the last one
			if(ack === true && force === true){ 
				_sendAck.call(this, "ACK_ADD", true);
			}
			
			return null;
		}
		
		var M = this.def, itemClassName = M.itemClassName;
		if(!itemDef.className){
			if(itemClassName){
				itemDef.className = itemClassName;
			}else{
				itemDef.className = "jsvm_listItem $jsvm_listItem" + " "
					+ DOM.combineClassName(M.className, "item");
			}
		}
		
		// Maybe needn't to set with as 100%
		itemDef.css = "position:relative;overflow:visible;"
			+ "white-space:nowrap;";
		
		if(this.multiEnable){
			itemDef.markable = (this.multiByCheck === true);
			itemDef.hoverForSelected = false;
		}else{
			itemDef.markable = false;
			itemDef.hoverForSelected = (M.hoverForSelected === true);
		}
		
		var item = new ListItem(itemDef, this.Runtime());
		this.insertItem(index, item, ack, force);

		return item;
	};


	/**
	 * Add one item to List with the specified definition.
	 * 
	 * @link #insertItemByDef
	 */
	thi$.addItemByDef = function(itemDef, ack, force){
		return this.insertItemByDef(undefined, itemDef, ack, force);
	};

	/**
	 * Insert item to the specified position of the List with the given model.
	 * 
	 * @link #insertItemByDef
	 */
	thi$.insertItemByModel = function(index, model, ack){
		if(!model){
			return null;
		}

		var itemDef = _createItemDef.call(this, model);
		return this.insertItemByDef(index, itemDef, ack);
	};

	/**
	 * Add one item to List with the specified model.
	 * 
	 * @link #insertItemByModel
	 */
	thi$.addItemByModel = function(model, ack){
		return this.insertItemByModel(undefined, model, ack);
	};

	var _setItemsByModel = function(models, append){
		// When there is nothing to set, we will remove all old items
		// and then nofity.
		var len = models ? models.length : 0;
		if(!append){
			this._isReady = false;
			this.wipe();
			
			if(len == 0){
				_sendAck.call(this, "ACK_ADD", true);
			}
		}
		
		if(len == 0){
			return;			   
		}
		
		var i, model, def, isLast = false;
		for(i = 0; i < len; i++){
			model = models[i];
			isLast = (i == len - 1);
			
			if(!model){
				throw "Unsupport item's model " + String(model);
			}
			
			def = _createItemDef.call(this, model);
			if(this.lazy){
				this.addItemByDef.$delay(this, 0, def, isLast, isLast);
			}else{
				this.addItemByDef(def, isLast, isLast);
			}
		}
	};

	/**
	 * Replaces all old items with new ones by the specified models.
	 * 
	 * @param {Array} models Models of items that will be added.
	 *		  
	 *		  @example
	 *		  [
	 *			  {dname: xxx, img: xxx (Optional), value},
	 *			  ......
	 *			  {dname: xxx, img: xxx (Optional), value}	 
	 *		  ]
	 */
	thi$.setItemsByModel = function(models){
		_setItemsByModel.call(this, models, false, false);
	};

	/**
	 * Add some new items to the List with the specified models
	 * 
	 * @param {Array} models Models of items that will be added.
	 *		  
	 *		  @example
	 *		  [
	 *			  {dname: xxx, img: xxx (Optional), value},
	 *			  ......
	 *			  {dname: xxx, img: xxx (Optional), value}	 
	 *		  ]
	 */
	thi$.addItemsByModel = function(models){
		_setItemsByModel.call(this, models, true, false);
	};

	var _setItemsByDef = function(defs, append){
		// When there is nothing to set, we will remove all old items
		// and then nofity.
		var len = defs ? defs.length : 0;
		if(!append){
			this._isReady = false;
			this.wipe();
			
			if(len == 0){
				_sendAck.call(this, "ACK_ADD", true);
			}
		}

		if(len == 0){
			return;
		}

		var def, isLast = false;
		for(var i = 0; i < len; i++){
			def = defs[i];
			isLast = (i == len - 1);
			
			if(!def){
				throw "Unsupport item's difinition " + String(def);
			}
			
			if(this.lazy){
				this.addItemByDef.$delay(this, 0, def, isLast, isLast);
			}else{
				this.addItemByDef(def, isLast, isLast);
			}
		}
	};
	
	/**
	 * Replace all old items with new ones by the specified definitions.
	 * 
	 * @param {Array} defs Definitions of items that will be added.
	 */
	thi$.setItemsByDef = function(defs){
		_setItemsByDef.call(this, defs, false, false);		
	};
	
	/**
	 * Add some new items to the list with the specified definitions.
	 * 
	 * @param {Array} defs Definitions of items that will be added.
	 */ 
	thi$.addItemsByDef = function(defs){
		_setItemsByDef.call(this, defs, true, false);
	};
	
	/**
	 * Remove a item from the List.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @param {js.swt.ListItem} item A item that will be removed.
	 * @param {Boolean} ack Indicate whether some acked behaviors will be 
	 *		  done after the item is removed.
	 */ 
	thi$.remove = function(item, ack){
		if(item && (typeof item == "object")){
			var uuid = item.uuid();
			this._selectedItems.remove(uuid);
			this._items.remove(uuid);
			
			delete this._local.cache[uuid];
			item.removeFrom(this.listView);
			
			if(typeof this.onItemRemoved == "function"){
				this.onItemRemoved(item);
			}

			// Destroy the removed item
			item.destroy(); 
			item = null;
			
			if(ack === true){
				// Re-calculate the size of list view
				// _invalidateSize.call(this);
				// _setAck.call(this, "ACK_REMOVE");

				_sendAck.call(this, "ACK_REMOVE", true);
			}
		}
	};
	
	/**
	 * Remove some items from the List.
	 * 
	 * @param {Array} items Items that will be removed.
	 * @link js.swt.List#remove
	 */ 
	thi$.removeItems = function(items){
		var len = items ? items.length : 0;
		if(len <= 0){
			return;
		}
		
		(function(len, item, idx){
			 if(this.lazy){
				 this.remove.$delay(this, 0, item, (idx == len - 1));
			 }else{
				 this.remove(item, (idx == len - 1));
			 }
		 }).$forEach(this, items, len);
	};
	
	/**
	 * Remove all items of the List.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */ 
	thi$.removeAll = function(){
		this.wipe();
		
		// Re-calculate the size of list view
		// _invalidateSize.call(this);
		// _setAck.call(this, "ACK_REMOVE");

		_sendAck.call(this, "ACK_REMOVE", true);
	};
	
	var _setAck = function(signal){
		switch(signal){
		case "ACK_ADD":
			var ready = this._isReady;
			this._isReady = true;
			
			this.fireEvent(
				new Event(CLASS.EVT_ACK_ITEMSADDED, undefined, this));
			if(!ready){
				this.fireEvent(new Event(CLASS.EVT_READY, undefined, this));
			}
			
			_layout.call(this);
			break;
			
		case "ACK_REMOVE":
			this.fireEvent(
				new Event(CLASS.EVT_ACK_ITEMSREMOVED, undefined, this));
			_layout.call(this);
			break;
			
		default:
			break;
		};
	};
	
	var _sendAck = function(signal, invalid){
		// Re-caculate the size of list view
		if(invalid === true){
			_invalidateSize.call(this);
		}
		
		_setAck.call(this, signal);
	};

	/**
	 * Return the number of items in the current list.
	 * 
	 * @return {Number}
	 */
	thi$.getItemsCount = function(){
		return this._items.length;
	};

	/**
	 * Return the item specified by the given index position.
	 * 
	 * @param {Number} index The index of the item to return.
	 * 
	 * @return {js.swt.ListItem}
	 */
	thi$.getItemAt = function(index){
		return this._local.cache[this._items[index]];
	};

	/**
	 * Return the current index position of the given item.
	 * 
	 * @param {js.swt.ListItem} item
	 * 
	 * @return {Number}
	 */
	thi$.getItemIndex = function(item){
		return this._items.indexOf(item.uuid());
	};

	/**
	 * Judge whether the specified item is the first one.
	 * 
	 * @param {js.swt.ListItem} item
	 * @return {Boolean}
	 */
	thi$.isFirstItem = function(item){
		var items = this._items;
		return items.indexOf(item.uuid()) === 0;
	};

	/**
	 * Judge whether the specified item is the last one.
	 * 
	 * @param {js.swt.ListItem} item
	 * @return {Boolean}
	 */
	thi$.isLastItem = function(item){
		var items = this._items;
		return items.indexOf(item.uuid()) === (items.length - 1);
	};

	/**
	 * Find and return the previous sibling item of the specified item.
	 * 
	 * @param {js.swt.ListItem} item
	 * 
	 * @return {js.awt.ListItem}
	 */
	thi$.getPreSiblingItem = function(item){
		var idx = this.getItemIndex(item);
		if(idx <= 0){
			return null;
		}

		return this.getItemAt(idx - 1);		   
	};

	/**
	 * Find and return the next sibling item of the the specified item
	 * 
	 * @param {js.swt.ListItem} item
	 * 
	 * @return {js.swt.ListItem}
	 */
	thi$.getNextSiblingItem = function(item){
		var items = this._items, idx = this.getItemIndex(item);
		if(idx < 0 || idx >= items.length - 1){
			return null;
		}
		
		return this.getItemAt(idx + 1);
	};

	/**
	 * Move the specified item from one index to another.
	 *
	 * @param {Number} from Current index of a row to move.
	 * @param {Number} to The target index to move in current view (before move).
	 */
	thi$.moveItem = function(from, to){
		var cache = this._local.cache, items = this._items, 
		len = items.length, fitem, titem;
		if(to > len){
			to = len;
		}

		if(from == to || from === to - 1){
			return;
		}

		fitem = cache[items[from]];
		titem = cache[items[to]];
		if(!fitem){
			return;
		}

		items.remove0(from);
		if(from < to){
			--to;			 
		}

		if(titem){
			items.add(to, fitem.uuid());
			DOM.insertBefore(fitem.view, titem.view, this.listView);
		}else{
			items.addLast(fitem.uuid());
			DOM.appendTo(fitem.view, this.listView);
		}

		// Notify about the item moving
		this.fireEvent(new Event(CLASS.EVT_ITEMMOVED, fitem, fitem));
	};

	/**
	 * Shift the item specified by the given index up.
	 *
	 * @param {Number} index The index of the specified item to shift.
	 * 
	 * @link #moveItem
	 */
	thi$.shiftUpItemAt = function(index){
		if(index > 0){
			this.moveItem(index, index - 1);
		}
	};

	/**
	 * Shift the specified item up.
	 *
	 * @param {js.swt.ListItem} item
	 * 
	 * @link #getItemIndex
	 * @link #moveItem
	 */
	thi$.shiftUpItem = function(item){
		var index = this.getItemIndex(item);
		if(index !== -1){
			this.shiftUpItemAt(index);
		}
	};

	/**
	 * Shift the item specified by the given index down.
	 *
	 * @param {Number} index The index of the specified item to shift.
	 * 
	 * @link #moveItem
	 */
	thi$.shiftDownItemAt = function(index){
		var len = this._items.length;
		if(index < len - 1){
			this.moveItem(index + 1, index);
		}
	};

	/**
	 * Shift the specified item up.
	 *
	 * @param {js.swt.ListItem} item
	 * 
	 * @link #getItemIndex
	 * @link #moveItem
	 */
	thi$.shiftDownItem = function(item){
		var index = this.getItemIndex(item);
		if(index !== -1){
			this.shiftDownItemAt(index);
		}
	};
	
	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */ 
	thi$.getItemsByModel = function(items, model){
		if(!model || (typeof model !== "object"))
			return null;
		
		var finds = [], 
		len = items.length, 
		item;
		for(var i = 0; i < len; i++){
			item = items[i];
			if(item.isMine(model)){
				finds.push(item);
			}
		} 
		
		return finds;	
	};

	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */ 
	thi$.getItemsByDname = function(items, dname){
		if(typeof dname !== "string")
			return null;
		
		var finds = [], 
		len = items.length, 
		item, v;
		for(var i = 0; i < len; i++){
			item = items[i];
			v = item && item.model ? item.model.dname : null;
			if(v && dname === v){
				finds.push(item);
			}
		} 
		
		return finds;
	};

	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */ 
	thi$.getItemsByValue = function(items, value){
		if(value == undefined || value == null)
			return null;
		
		var finds = [], 
		len = items.length, 
		item, v;
		for(var i = 0; i < len; i++){
			item = items[i];
			v = item ? item.getValue() : null;
			if(value === v){
				finds.push(item);
				
				if(this.distinct){
					return finds;
				}
			}
		} 
		
		return finds;
	};

	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @link js.awt.Container#contains
	 */ 
	thi$.contains = function(itemDef){
		var m = itemDef ? itemDef.model : undefined;
		if(!m || (typeof m !== "object")){
			return false;
		}
		
		var len = this._items ? this._items.length : 0,
		item;
		for(var i = 0; i < len; i++){
			item = this.item(this._items[i]);
			if(item.isMine(m)){
				return true;
			}
		}
		
		return false;
	};
	
	// The result doesn't keep the order
	var _getInfoByUUids = function(ids, prop, distinct){
		var len = ids ? ids.length : 0, 
		rst = LinkedList.$decorate([]), item, m, v;
		for(var i = 0; i < len; i++){
			item = this.item(ids[i]);
			
			switch(prop){
			case "def":
				rst.addLast(item.def);
				break;
			case "model":
				m = item ? item.model : undefined;
				if(m && (distinct !== true 
						 || !CLASS.isModelIn(m, rst))){
					rst.addLast(m);
				}
				break;
			case "value":
				m = item ? item.model : undefined;
				v = m ? m.value : undefined;
				if(v && (distinct !== true 
						 || !rst.contains(v))){
					rst.addLast(v);
				}
				break;
			default:
				rst.addLast(item);
				break;
			}
		}
		
		return rst;
	};
	
	// The result keep the order
	var _getInfoByUUids0 = function(ids, prop, distinct){
		if(!Class.isArray(ids) || ids.length == 0){
			return [];
		}
		LinkedList.$decorate(ids);
		
		var len = this._items ? this._items.length : 0,
		rst = LinkedList.$decorate([]), 
		uuid, item, m, v, idx;
		for(var i = 0; i < len; i++){
			uuid = this._items[i];
			if(!ids.contains(uuid)){
				continue;
			}
			
			item = this.item(uuid);
			switch(prop){
			case "def":
				rst.addLast(item.def);
				break;
			case "model":
				m = item ? item.model : undefined;
				if(m && (distinct !== true 
						 || !CLASS.isModelIn(m, rst))){
					rst.addLast(m);
				}
				break;
			case "value":
				m = item ? item.model : undefined;
				v = m ? m.value : undefined;
				if(v && (distinct !== true 
						 || !rst.contains(v))){
					rst.addLast(v);
				}
				break;
			case "index":
				idx = i;
				if(distinct !== true 
				   || !rst.contains(idx)){
					rst.addLast(idx);
				}
				break;
			default:
				rst.addLast(item);
				break;
			}
		}
		
		return rst;
	};
	
	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @return a <em>js.util.LinkedList</em> which contained all
	 *		   items of the List.  
	 */
	thi$.getAll = function(){
		var len = this._items ? this._items.length : 0, 
		rst = [];
		for(var i = 0; i < len; i++){
			rst.push(this.item(this._items[i]));
		}
		
		return rst;
	};	 
	
	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @return {js.util.LinedList} All items of the List.  
	 */
	thi$.getItems = function(){
		return this.getAll();
	};
	
	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @return {js.util.LinedList} All items' definitions of the List.	
	 */
	thi$.getItemDefs = function(){
		return _getInfoByUUids.call(this, this._items, "def");
	};
	
	/**
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @return {js.util.LinkedList} All items' model of the List.  
	 */
	thi$.getItemModels = function(){
		return _getInfoByUUids.call(this, this._items, "model");
	};
	
	/**
	 * @param {Boolean} isOrdered Indicate whether the result should keep the order.
	 * 
	 * @return {js.util.LinkedList} All selected items of the List. 
	 */
	thi$.getSelectedItems = function(isOrdered){
		var rst;
		if(isOrdered === true){
			rst = _getInfoByUUids0.call(this, this._selectedItems);
		}else{
			rst = _getInfoByUUids.call(this, this._selectedItems);
		}
		
		return rst;
	};
	
	/**
	 * @param {Boolean} isOrdered Indicate whether the result should keep the order.
	 * 
	 * @return {js.util.LinkedList} The defs of all selected items in the List.	 
	 */
	thi$.getSelectedDefs = function(isOrdered){
		var rst;
		if(isOrdered === true){
			rst = _getInfoByUUids0.call(this, this._selectedItems, "def");
		}else{
			rst = _getInfoByUUids.call(this, this._selectedItems, "def");
		}
		
		return rst; 
	};
	
	/**
	 * @param {Boolean} isOrdered Indicate whether the result should keep the order.
	 * 
	 * @return {js.util.LinkedList} The models of all selected items in the List.  
	 */
	thi$.getSelectedModels = function(isOrdered){
		var rst;
		if(isOrdered === true){
			rst = _getInfoByUUids0.call(this, this._selectedItems, "model", true);
		}else{
			rst = _getInfoByUUids.call(this, this._selectedItems, "model", true);
		}
		
		return rst;
	};
	
	/**
	 * @return {js.util.LinkedList} The indexes of all selected items in the List.	
	 */
	thi$.getSelectedIndexes = function(){
		return _getInfoByUUids0.call(this, this._selectedItems, "index", true);
	};

	/**
	 * @param {Boolean} isOrdered Indicate whether the result should keep the order.
	 * 
	 * @return {js.util.LinkedList} The values of all selected items in the List.	
	 */	   
	thi$.getSelectedValues = function(isOrdered){
		var rst;
		if(isOrdered === true){
			rst = _getInfoByUUids0.call(this, this._selectedItems, "value", true);
		}else{
			rst = _getInfoByUUids.call(this, this._selectedItems, "value", true);
		}
		
		return rst;
	};

	thi$.wipe = function(){
		if(!this.listView){
			return;
		}
		
		this._local.cache = {};
		this._selectedItems = LinkedList.$decorate([]);
		this._items = LinkedList.$decorate([]);
		this.listView.innerHTML = "";
		
		// All items are new, all sizes need be ajusted.
		delete this._contentSize;

		// The prefSize need be re-computed
		this._local.prefSize = null;		
	};
	
	var _measure = function(){
		var cv = this.listView, w, h;
		cv.style.overflow = "hidden";
		cv.style.width = "0px";
		cv.style.height = "0px";
		DOM.appendTo(cv, document.body);
		
		w = cv.scrollWidth;
		h = cv.scrollHeight;

		//DOM.remove(cv);
		cv.style.overflow = "visible";
		cv.style.width = w + "px";
		cv.style.height = h + "px";
		
		DOM.appendTo(cv, this.view);
		
		this._contentSize = this._contentSize || {};
		this._contentSize.width = w;
		this._contentSize.height = h;
		
		System.log.println("List Size:" + JSON.stringify(this._contentSize));
	};
	
	/*
	 * Attention:
	 * 
	 * This method should be invoked after the list view is appended to the DOM
	 * tree. Otherwise, it will get the inaccurate values.
	 */
	var _measure$ = function(){
		var cv = this.listView, w, h;
		cv.style.overflow = "hidden";
		cv.style.width = "0px";
		cv.style.height = "0px";

		w = cv.scrollWidth;
		h = cv.scrollHeight;

		cv.style.overflow = "visible";
		cv.style.width = w + "px";
		cv.style.height = h + "px";
		
		this._contentSize = this._contentSize || {};
		this._contentSize.width = w;
		this._contentSize.height = h;
	};
	
	/* 
	 * When items are added or removed, the size of the list view 
	 * will be invalidated and must be computed.
	 * If the list is appended to the DOM tree, the preferred size
	 * could be re-calculated if need.
	 */
	var _invalidateSize = function(items){
		this._isLayoutDirty = true;
		
		// Calculate the content size of list view		  
		_measure.call(this);
		
		// Only when the list is appended to DOM tree, 
		// the calcaulation is significative.		 
		if(this.isDOMElement() && !this.def.prefSize){
			this._local.prefSize = null;
			this.getPreferredSize();
		}
	};
	
	var _calPreferredSize = function(){
		if(!this._contentSize){
			_measure.call(this);
		}
		
		var s = this._contentSize, 
		cw = s ? s.width : undefined,
		ch = s ? s.height : undefined, 
		d = this.getBounds(), mbp = d.MBP, 
		w = d.width, h = d.height;
		
		w = !isNaN(cw) ? (cw + mbp.BPW) : w;
		h = !isNaN(ch) ? (ch + mbp.BPH) : h;
		
		// That is no reason to add 2px for the preferred size.
		// However if didn't add these 2px, that will be cause the
		// scroll bar in IE 8.
		//return {width: w, height: h};
		return {width: w + 2, height: h + 2};
	};
	
	thi$.getContentSize = function(){
		if(!this._contentSize){
			_measure.call(this);
		}
		
		return this._contentSize;
	};
	
	thi$.getPreferredSize = function(){
		var M = this.def, U = this._local, 
		prefSize = M.prefSize || U.prefSize;

		if(!prefSize){
			prefSize = U.prefSize 
				= _calPreferredSize.call(this);
		}

		return prefSize;

	};
	
	var _layoutListView = function(w, h, box){
		box = box || this.getBounds();
		
		var mbp = box.MBP, 
		avaiW = w - mbp.BPW,
		avaiH = h - mbp.BPH;
		
		var cvSize = this._contentSize, cw, ch;
		cw = (cvSize.width < avaiW) 
			? "100%" : (cvSize.width + "px");
		ch = (cvSize.height < avaiH) 
			? "100%" : (cvSize.height + "px");
		
		this.listView.style.width = cw;
		this.listView.style.height = ch;
	};
	
	var _layout = function(w, h){ 
		if(!this._isLayoutDirty || !this._isReady 
		   || !this.isDOMElement()){
			return;
		}

		this._isLayoutDirty = false;
		
		var d = this.getBounds(), prefSize = this.getPreferredSize(),
		maxSize = this.isMaximumSizeSet ? this.getMaximumSize() : null, 
		minSize = this.isMinimumSizeSet ? this.getMinimumSize() : null;
		
		w = (!isNaN(w) && w > 0) ? w : (this.hauto ? prefSize.width : d.width);
		h = (!isNaN(h) && h > 0) ? h : (this.vauto ? prefSize.height : d.height);
		
		if(minSize){
			w = (!isNaN(minSize.width) && minSize.width > 0)
				? Math.max(w, minSize.width) : w;
			h = (!isNaN(minSize.height) && minSize.height > 0) 
				? Math.max(h, minSize.height) : h;
		}
		
		if(maxSize){
			w = !isNaN(maxSize.width) ? Math.min(w, maxSize.width) : w;
			h = !isNaN(maxSize.height) ? Math.min(h, maxSize.height) : h;
		}
		
		// Sizing content view
		_layoutListView.call(this, w, h, d);
		
		// Sizing List container
		this.setSize(w, h); 
	};
	
	thi$.onResized = function(){
		this._isLayoutDirty = true;
		$super(this);

	}.$override(this.onResized);
	
	thi$.onGeomChanged = function(){
		this._isLayoutDirty = true;
		$super(this);

	}.$override(this.onGeomChanged);
	
	thi$.doLayout = function(){
		if($super(this)){
			_layout.call(this);
			return true;
		}
		
		return false;
		
	}.$override(this.doLayout);
	
	/**
	 * Dispose the list and its items. If the <em>w/h</em> is/are specified, the
	 * outer size of current component will use those values regardless of the hauto
	 * and vauto. However, the container of items will always be autofit by items.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */
	thi$.dispose = function(w, h){
		this._isLayoutDirty = true;
		_layout.apply(this, arguments);			   
	};

	/**
	 * Theoretically, whether the current list can be searched.
	 */
	thi$.canBeSearched = function(){
		return this._canBeSearched;
	};

	/**
	 * Enable / disable the search function of the list.
	 * 
	 * @param {Boolean} b
	 */ 
	thi$.setSearchEnable = function(b){
		var v = (b === true);
		if(this.searchEnable === v)
			return;
		
		this.searchEnable = v;
		if(this.searchEnable){
			this.searcher = this.searcher 
				|| new (Class.forName("js.swt.Searcher"))(this, this.def.searchOptions);	
		}else{
			if(this.searcher){
				this.searcher.destroy();
			}
			
			this.searcher = null;
		}
	};
	
	thi$.quickSearch = function(keyword, options){
		if(this.searcher && (typeof keyword === "string")){
			this.searcher.search(keyword, options);
		}
	};
	
	thi$.restore = function(){
		if(this.searcher){
			this.searcher.restore();
		}
	};
	
	var _selectItems = function(items){
		var len = items ? items.length : 0;
		if(len == 0)
			return;
		
		var item;
		for(var i = 0; i < len; i++){
			item = items[i];
			this.selectItem(item);
		}
	};
	
	/**
	 * Select the given item.
	 * 
	 * @param {js.swt.ListItem} item The item to select.
	 */
	thi$.selectItem = function(item){
		var uuid = item ? item.uuid() : undefined;
		if(uuid && !this._selectedItems.contains(uuid)){
			item.setSelected(true);
			this._selectedItems.addLast(uuid);
		}
	};
	
	var _onItemSelected = function(arg){
		this.fireEvent(new Event(CLASS.EVT_ITEMSELECTED, arg, this));
		
		// @deprecated
		if(typeof this.onSelected === "function"){
			this.onSelected(arg);
		}
	};

	/**
	 * Select all items indicated by given values.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @param {Array} values The given values to specify items to select. An 
	 *		  item whose value equals with one of values will be selected.
	 * @param {Boolean} callback Optional. Indicate whether need to notify.
	 */
	thi$.setSelectedValues = function(values, callback){
		var len = values ? values.length : 0;
		if(len == 0){
			return;
		}
		
		// Unselect all
		this.unselectAll();
		
		var cnt = this.multiEnable ? len : 1, value, items;
		for(var i = 0; i < cnt; i++){
			value = values[i];
			items = this.getItemsByValue(this.getItems(), value);
			
			_selectItems.call(this, items);
		}
		
		if(callback){
			_onItemSelected.call(this, arguments[2]);
		}
	};

	/**
	 * Select all items indicated by given indexes.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @param {Array} indexes The given indexes to select. Each element indicate
	 *		  an item which need be selected.	 
	 * @param {Boolean} callback Optional. Indicate whether need to notify.
	 */	   
	thi$.setSelectedIndexes = function(indexes, callback){
		var len = indexes ? indexes.length : 0;
		if(len == 0){
			return;
		}
		
		// Unselect all
		this.unselectAll();

		var cnt = this.multiEnable ? len : 1,
		item, items = [];
		for(var i = 0; i < cnt; i++){
			item = this.item(this._items[indexes[i]]);
			items.push(item);
		}
		
		_selectItems.call(this, items);
		
		if(callback){
			_onItemSelected.call(this, arguments[2]);
		}
	};

	/**
	 * Select all given items.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @param {Array} items The given items to select, each of which need be 
	 *		  selected.
	 * @param {Boolean} callback Optional. Indicate whether need to notify.
	 */
	thi$.setSelectedItems = function(items, callback){
		if(!items || items.length == 0)
			return;
		
		// Unselect all
		this.unselectAll();
		
		var temp = this.multiEnable ? items : [items[0]];
		_selectItems.call(this, temp);
		
		if(callback){
			_onItemSelected.call(this, arguments[2]);
		}
	};

	/**
	 * Select all items in the list.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */
	thi$.selectAll = function(callback){
		var len = this._items.length, item;
		for(var i = 0; i < len; i++){
			item = this.item(this._items[i]);
			if(!item.isSelected()){
				this.selectItem(item);
			}
		}
		
		if(callback === true){
			_onItemSelected.call(this);
		}
	};

	var _unselectItem = function(item) {
		if(item){
			item.setSelected(false);
			this._selectedItems.remove(item.uuid());
		}
	};

	/**
	 * Unselecte the given item.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 * 
	 * @param {js.swt.ListItem} item The specified item to select.
	 */
	thi$.unselectItem = function(item){
		if(item){
			_unselectItem.call(this, item);
		}
	};

	/**
	 * Make all items unselected.
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */
	thi$.unselectAll = function(callback){
		var uuid, item;
		while(this._selectedItems.length > 0){
			uuid = this._selectedItems.getLast();
			item = this.item(uuid);
			
			_unselectItem.call(this, item);
		}
		
		if(callback === true){
			_onItemSelected.call(this, arguments[1]);
		}
	};

	/**
	 * Invert all selections:
	 *	  selected --> unselected
	 *	  unselected --> selected
	 * 
	 * Attention: 
	 * If the "lazy" of list definition is true, this method should be invoke
	 * when the "EVT_READY" or "EVT_ACK_ITEMSADDED" is listened/catched.
	 */
	thi$.invertSelection = function(){
		var len = this._items.length, item;
		for(var i = 0; i < len; i++){
			item = this.item(this._items[i]);
			
			if(item.isSelected()){
				this.unselectItem(item);
			}else{
				this.selectItem(item);
			}
		}
	};

	/**
	 * Judge whether all the items in current list is selected.
	 * 
	 * @return {Boolean}
	 */
	thi$.isAllSelected = function(){
		var itemCnt = this._items.length,
		selectedCnt = this._selectedItems.length;
		
		if (!this.multiEnable){
			return false;
		} else if (selectedCnt === itemCnt){
			return true;
		} else if (this.distinct && (selectedCnt !== itemCnt)){
			return false;
		} else {
			var item;
			for(var i = 0; i < itemCnt; i++){
				item = this.item(this._items[i]);
				if(!item.isSelected()){
					return false;
				}
			}
			
			return true;
		}
	};

	thi$.onStateChange = function(){
		if(!this.container){
			return;
		}
		
		if(this.isEnabled()){
			this.showCover(false);
		}else{
			this.showCover(true);
		}
	};

	thi$.destroy = function(){
		delete this._selectedItems;
		delete this._items;
		delete this._local.cache;
		
		if(this.searcher){
			this.searcher.destroy();
			delete this.searcher;
		}
		
		DOM.remove(this.listView, true);
		delete this.listView;
		
		$super(this);
		
	}.$override(this.destroy);

	var _select = function (listItem, ctrlKey, shiftKey){
		if(!listItem){
			return;
		}
		
		if(this.multiEnable && ctrlKey){
			if(listItem.isSelected()){
				this.unselectItem(listItem);
			}else{
				this.selectItem(listItem);
			}
		}else if(this.multiEnable && shiftKey){
			if(this._selectedItems.length == 0){
				this.selectItem(listItem);
			}else{
				var fUUID = this._selectedItems.getLast(),
				from = this._items.indexOf(fUUID),
				to = this._items.indexOf(listItem.uuid()), 
				step = (to - from) / Math.abs(to - from),
				index, item;
				for(var i = 1, cnt = Math.abs(to - from); i <= cnt; i++){
					index = from + step * i;
					
					item = this.item(this._items[index]);
					this.selectItem(item);	  
				}
			}
		}else{
			this.unselectAll();
			this.selectItem(listItem);
		}
	};

	var _selectCheckableItem = function(item){
		if(!item)
			return;
		
		if(this.multiEnable){
			if(item.isSelected()){
				this.unselectItem(item);
			}else{
				this.selectItem(item);
			}
		}else{
			this.unselectAll();
			this.selectItem(item);
		}
	};
	
	thi$.showController = function(b, item){
		if(!this.controller){
			return;
		}
		
		if(b){
			this.controller.setAttribute("itemUUID", item.uuid());
			this.controller.display(true);
			
			var vb = this.getBounds(), ib = item.getBounds(), 
			s = this.controller.getPreferredSize(),
			vOffset = (ib.height - s.height) * 0.5,
			x = this.view.scrollLeft + (vb.clientWidth - s.width),
			y = this.view.scrollTop + (ib.absY - vb.absY + vb.MBP.borderTopWidth) + vOffset;

			this.controller.setBounds(x, y, s.width, s.height, 7);

		}else{
			this.controller.removeAttribute("itemUUID");
			this.controller.display(false); 
		}
	};

	var _onHover = function(e){
		if(typeof this.onHovering == "function"){
			this.onHovering();
		}
		
		var from = e.fromElement, to = e.toElement,
		fid = from ? from.uuid : "", tid = to ? to.uuid :"",
		fitem = this._local.cache[fid], titem = this._local.cache[tid];
		
		if(fitem && fitem.isHover()){
			if(to && this.controller 
			   && this.controller.contains(to, true)){
				return; 
			}
			
			fitem.setHover(false);
			this.showController(false);
		}
		
		if(titem && !titem.isHover()){
			titem.setHover(true);
			
			if(titem.hasController()){
				this.showController(true, titem);
			}
		}
	};

	var _onItemClicked = function(e){
		var src = e.srcElement, uuid = src ? src.uuid : "",
		item = this._local.cache[uuid];
		
		if(!item || !item.isEnabled()){
			return;
		}
		
		if (this.multiByCheck){
			if(!this.useMarkerToggle || src === item.marker){
				_selectCheckableItem.call(this, item);
			}
		} else {
			_select.call(this, item, e.ctrlKey || false, 
						 e.shiftKey || false);
		}
		
		if(item){
			this.fireEvent(new Event(CLASS.EVT_ITEMCLICKED, item, item));
			
			// @deprecated
			if(typeof this.onClicked == "function"){
				this.onClicked(item);
			}
		}
	};

	thi$.onItemEvent = function(e){
		var type = e.getType();
		switch(type){
		case ListItem.OP_REMOVE:
			this.remove(e.getItem());
			break;

		default:
			break;
		}
	};
	
	var _onController = function(e){
		var uuid = this.controller.getAttribute("itemUUID"),
		item = this._local.cache[uuid], evt;
		switch(e.getType()){
		case "click":
			evt = new Event("ClickController", 
							{event: e, item: item}, this.controller);
			this.notifyPeer("js.swt.event.ControllerEvent", evt);
			break;
		case "mouseout":
			if(item && item.isHover()){
				item.setHover(false);
				this.showController(false);
			}
			break;
		default:
			break;
		}
	};

	var _createController = function(def, Runtime){
		var cDef = def.controller, clz, ctrl;
		if(cDef && cDef.classType){
			ctrl = new (Class.forName(cDef.classType))(cDef, Runtime);
			ctrl.applyStyles({position: "absolute", display: "none"});
			
			ctrl.attachEvent("mouseout", 0, this, _onController);
			ctrl.attachEvent("click", 0, this, _onController);
			this.setController(ctrl);
		}
	};
	
	var _createContents = function(){
		var listView = this.listView = DOM.createElement("DIV");
		listView.style.cssText = "position:relative;top:0px;left:0px;"
			+ "border:0px none;padding:0px;margin:0px;overflow:visible;"
			+ "width:100%;height:100%;";
		
		DOM.appendTo(listView, this.view);
	};

	thi$._init = function(def, runtime){
		if(typeof def !== "object") return;

		def = System.objectCopy(def, CLASS.DEFAULTDEF(), true, true);		
		def.className = def.className || "jsvm_list";
		$super(this, def, runtime);

		this._isReady = false;
		this._isLayoutDirty = false;
		this._canBeSearched = true;
		
		this._local.cache = {};
		this._selectedItems = LinkedList.$decorate([]);
		this._items = LinkedList.$decorate([]);

		this.lazy = (def.lazy === true);
		this.hauto = (def.hauto === true);
		this.vauto = (def.vauto === true);

		this.showTips = (def.showTips !== false);
		this.distinct = (def.distinct === true);
		this.multiEnable = (def.multiEnable === true);
		
		// Only when multiEnable is true, the item can be markable
		this.multiByCheck = (this.multiEnable && def.multiByCheck === true);
		// Only when the marker of item is clicked, the item can be marked
		this.useMarkerToggle = (this.multiByCheck && def.useMarkerToggle === true);		   
		
		_createContents.call(this);
		
		if(def.itemDefs && def.itemDefs.length > 0){
			_setItemsByDef.call(this, def.itemDefs, false, true);
		}else if(def.itemModels && def.itemModels.length > 0){
			_setItemsByModel.call(this, def.itemModels, false, true);
		}else{
			//?? When no any items, we also need to trigger the layout.
			_setAck.call(this, "ACK_ADD");
		}
		
		this.setSearchEnable(def.searchEnable);
		
		_createController.call(this, def, runtime);
		
		Event.attachEvent(this.listView, "mouseover", 0, this, _onHover);
		Event.attachEvent(this.listView, "mouseout", 0, this, _onHover);
		Event.attachEvent(this.listView, "click", 0, this, _onItemClicked);
		
		J$VM.MQ.register("js.swt.event.ListItemEvent", this, this.onItemEvent);
		
	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.Component);

js.swt.List.DEFAULTDEF = function(){
	return {
		classTy: "js.swt.List", 
		
		multiEnable: true,
		multiByCheck: false,
		distinct: false,
		
		lazy: false,
		
		hauto: false,
		vauto: false,
		
		itemModels: [],
		itemDefs: [],
		
		align_x: 0.5,
		align_y: 0.0,
		
		rigid_w: false,
		rigid_h: false
	};	
};

/**
 * Judge whether the specified value has been in the given collection.
 * 
 * @param {String / Object /...} value The specified value to check.
 * @param {Array} set {Array} The reference models collection.
 */
js.swt.List.isIn = function(value, set){
	var len = set ? set.length : 0;
	for(var i = 0; i < len; i++){
		if(set[i] === value){
			return true;
		}
	}
	
	return false;
};

/**
 * Judge whether the specified models are same.
 */
js.swt.List.isSameModel = function(m1, m2){
	if (!(m1 && m2))
		return false;
	
	if (m1 === m2)
		return true;
	
	//TODO: maybe this is not enough
	if ((m1.value === m2.value)
		&& ((m1.dname === m2.dname)
			|| (m1.img === m2.img))) {
		return true;
	}
	
	return false;
};

/**
 * Judge whether the specified model has been in the given models collection.
 * 
 * @param {Object} model The specified model to check.
 * @param {Array} set The reference models collection.
 */
js.swt.List.isModelIn = function(model, set){
	var C = js.swt.List, len = set ? set.length : 0;
	for(var i = 0; i < len; i++){
		if(C.isSameModel(model, set[i])){
			return true;
		}
	}
	
	return false;
};
