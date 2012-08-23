/**
 * @File ListView.js
 * @Create 2011-02-14
 * @author shengliang.huang@china.jinfonet.com
 */
$package("js.awt");
/**
 * @param def an object container a set of definitions of a set of buttons,
 * please see the definition of Button class for more details.
 * 
 * for example
 * 
 * 
 */
js.awt.ListView = function(def, runtime) {
    this._items = js.util.LinkedList.newInstance([]);
    this._selectedItem = null;
    
    this._multiSelect = false;
    this._multiItems = new js.util.HashMap();
    
    var CLASS = js.awt.ListItem,
        thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        if (typeof def === "object") {
            this._init(def, runtime);
            J$VM.MQ.register("js.awt.event.ListItemEvent", this, this.doAction);
        }
        return;
    }
    CLASS.__defined__ = true;

    this._init = function(def, runtime) {
        arguments.callee.__super__.apply(this, arguments);
        //this.container = def.container;
        this._multiSelect = def.canMultiSelect || this._multiSelect;

        for ( var i = 0, len = def.items.length; i < len; i++) {
            var _itemDef = def.items[i];
            _itemDef.className = def.className;
            _itemDef.container = this;
            this.addItem(_itemDef);
        }
    }.$override(this._init);
    
    thi$.destroy = function() {
        this._items.clear();
        this._items = null;
        this._selectedItem = null;
        
        this._multiSelect = undefined;
        this._multiItems.clear();
        this._multiItems = null;
        arguments.callee.__super__.apply(this, arguments);
    }.$override(this.destroy);

    thi$.getSelectedItem = function() {
        return this._selectedItem;
    };
    
    thi$.getSelectedItems = function() {
        var ret = null;
        if (!this._multiSelect) {
            ret = this._selectedItem ? [this._selectedItem] : [];
        } else {
            ret = this._multiItems.values();
        }
        
        return ret;
    };
    
    thi$.getMultiItems = function() {
        return this._multiItems.values();
    };
    
    thi$.getAll = function() {
        return this._items;
    };
    
    thi$.getItemMap = function() {
        return this._multiItems;
    };

    thi$.addItem = function(def) {
        var item = new js.awt.ListItem(def, this.Runtime());
        this._items.addLast(item);
        this.addComponent(item);
    };

    thi$.remove = function(obj) {
        if (typeof obj == "object")
            this._items.remove(obj.getItem());
        this.updateUI();
    };
    
    // Add by mingfa.pan, 2011-05-25
    thi$.removeAll = function() {
        this._items.clear();
        
        // Clean selected items
        this._selectedItem = null;
        this._multiItems.clear();
        
        this.clear();
    };
    
    thi$.isMultiSelect = function() {
        return this._multiSelect;
    };
    
    thi$.isAllSelected = function() {
        return this._multiSelect && this._items.length - 1 == this._multiItems.size();
    };
    
    thi$.select = function (curSelect, initial) {
        if(!curSelect) {
            return;
        }
    
        var changed = false;
        if(!this._multiSelect) {
            this.afterSelect(curSelect);
            
            if(    this._selectedItem && this._selectedItem.uuid() !== curSelect.uuid()) {
                this.afterUnselect(this._selectedItem);
                changed = true;
            }
        } 
    
        this._selectedItem = curSelect;
        if (this._multiSelect) {
            if (this._multiItems.contains(this._selectedItem.uuid())) {
                this._multiItems.remove(this._selectedItem.uuid());
                this.afterUnselect(this._selectedItem);
            } else {
                this._multiItems.put(this._selectedItem.uuid(), this._selectedItem);
                this.afterSelect(this._selectedItem);
            }
            
            changed = true;
        }
        if (typeof this.container == "object") {
            J$VM.MQ.post("js.awt.event.ListViewEvent",
                    new js.awt.event.ListViewEvent("click", this), [ this.container.uuid() ]);
        }
        
        // Add by mingfa.pan, 2011-05-24
        if(initial !== true && changed && typeof this.onSelectChanged == "function") {
            this.onSelectChanged();
        }
        
        this.onafterselect(this);
    };
    
    thi$.doAction = function(obj) {
        var curSelect = obj.getItem();
        this.select(curSelect);
    };
    
    // Add by mingfa.pan, 2011-05-20
    thi$.afterSelect = function (listItem) {
        // TODO: your work here
    };
    
    // Add by mingfa.pan, 2011-05-20
    thi$.afterUnselect = function () {
        // TODO: your work here
    };
    
    /**
     * Overwrite this method to meet your special requirement
     */
    thi$.onafterselect = function(obj) {
        //TODO do your work here
    };

    thi$.updateUI = function() {
        this.clear();
        for ( var i = 0, len = this._items.length; i < len; i++) {
            this.addComponent(this._items.get(i));
        }
    };

    thi$.onclick = function(e) {
        e.cancelBubble();
    };

    if (typeof def == "object") {
        this._init(def, runtime);
        J$VM.MQ.register("js.awt.event.ListItemEvent", this, this.doAction);
    }
}.$extend(js.awt.Container);
