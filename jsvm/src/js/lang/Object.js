/**

 Copyright 2007-2015, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

/**
 * @class js.lang.Object
 * Define the root object of J$VM objects.
 *
 * @constructor
 * @extends Object
 */
js.lang.Object = function (o){
    
    var CLASS = js.lang.Object, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        // TODO:
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Math = js.lang.Math,
    objectStore = {};
    
    /**
     * Return hash code of this object
     * @return {Number}
     */
    thi$.hashCode = function(){
        this.__hash__ = this.__hash__ || Math.hash();

        return this.__hash__;
    };
    
    /**
     * Test whether this object equals to the specified object.
     * @param {Object} o The test object
     * @return {Boolean}
     */
    thi$.equals = function(o){
        return o === this;
    };

    /**
     * Return the string of this object
     * @return {String}
     */
    thi$.toString = function(){
        return (typeof this) + "@" + this.uuid();
    };
    
    /**
     * Set/Get the unique ID of this object.
     * @param {String} id Set id as unique ID to this object
     * @return {String}
     */
    thi$.uuid = function(id){
        if(Class.isString(id)){
            this.__uuid__ = id;
        }else if(!Class.isString(this.__uuid__)){
            this.__uuid__ = Math.uuid(this.hashCode());
        }
        return this.__uuid__;
    };

    /**
     * Test whether this object is instance of a class
     * @param {Class} clazz The test class
     * @return {Boolean} 
     */
    thi$.instanceOf = function(clazz){
        var imps = this.__imps__;
        if(imps){
            for(var i=0, len=imps.length; i<len; i++){
                if(clazz === imps[i]){
                    return true;
                }
            }
        }

        return this instanceof clazz;
    };
    
    /**
     * Destroy this object
     */
    thi$.destroy = function(){
        var uuid = this.uuid(), obj, p;

        // Clean the cached context attributes
        obj = objectStore[uuid];
        delete objectStore[uuid];
        
        for(p in obj){
            obj[p] = null;
        }

        // Cancel all registered messages
        J$VM.MQ.remove(uuid);

        for(p in this){
            delete this[p];
        }
        this.destroied = true;
    };
    
    /**
     * Setten uuid of the outer context object for current object to help
     * each object build another chain.
     * 
     * @param {String} ouuid The unique id of the outer context.
     */
    thi$.setContextID = function(ouuid){
        var uuid = this.uuid(), obj = objectStore[uuid];
        if(!obj){
            obj = objectStore[uuid] = {"__self__": this};
        }
        
        if(Class.isString(ouuid) && ouuid.length > 0){
            obj["__contextid__"] = ouuid;
        }
    };
    
    thi$.getContextID = function(){
        var obj = objectStore[this.uuid()] || {};
        return obj["__contextid__"];
    };
    
    /**
     * Return the object cached in the global object manager according
     * to the specified unique id.
     * 
     * @param {String} uuid The unique id of an object to fetch.
     */
    thi$.getObject = function(uuid){
        var obj = objectStore[uuid] || {};
        return obj["__self__"];
    };
    
    /**
     * Return the context object for the object specified with the give
     * uuid. If the uuid is not given, return the current object's.
     * 
     * @return {Object} The context properties.
     */
    thi$.getContext = function(uuid){
        return objectStore[uuid || this.uuid()];
    };

    /**
     * Put a pair of context attribute to objectStore to make them
     * be shared by all inner objects.
     * 
     * @param {String} attr Name of the context attribute to put.
     * @param {Object} v Value of the context attribute to put.
     */
    thi$.putContextAttr = function(attr, v){
        if(!Class.isString(attr) || attr.length === 0 
           || !Class.isValid(v)){
            return;
        }
        
        var obj = this.getContext();
        obj[attr] = v;        
    };

    var _getContextAttr = function(uuid, attr, upward){
        var obj = objectStore[uuid], ouuid, v;
        if(!obj){
            return null;
        }
        
        if(obj.hasOwnProperty(attr)){
            return obj[attr];
        }
        
        ouuid = obj["__contextid__"];
        if(ouuid && ouuid !== uuid && upward !== false){
            v = _getContextAttr.call(this, ouuid, attr, upward);
        }
        
        return v;
    };
    
    /**
     * Find and return value of the specified attribute cached in the
     * global objectStore.
     * 
     * @param {String} attr Name of the attribute to fetch.
     * @param {Boolen} upward Optional. Indicate whether to search up. 
     *                 Default is true.
     * @param {String} uuid Optional. The unique id to ref. Default is 
     *                 the uuid of current object.
     */
    thi$.getContextAttr = function(attr, upward, uuid){
        return _getContextAttr.call(this, uuid || this.uuid(), attr, upward);
    };

    /**
     * Find and remove the specified context attribute from the cached
     * context of current object.
     * 
     * @param {String} attr Name of the attribute to remove.
     */    
    thi$.rmContextAttr = function(attr){
        var obj = this.getContext();
        if(!obj || !Class.isString(attr) || attr === "__self__" 
           || attr === "__contextid__"){
            return;
        }

        delete obj[attr];
    };

}.$extend(Object);

