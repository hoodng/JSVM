/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * @File: AccessPriorityMap.js
 * @Create: 2012/12/26 06:08:49
 * @Author: mucong.zhao@china.jinfonet.com
 */

$package("js.util");

js.util.AccessPriorityMap = function(){
	var CLASS = js.util.AccessPriorityMap, thi$ = CLASS.prototype;
	
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
	
	this.K2V;
	
	this.K2F;
	
	this.F2Ks;
	
    this.sortedFs;
	
    thi$._init = function(){
        this.K2V = new js.util.HashMap();
	    this.K2F = new js.util.HashMap();
	    this.F2Ks = new js.util.HashMap();
	    this.sortedFs = undefined;
    };
    
    /**
     * 
     */
    thi$.put = function(key, value){
        this.sortedFs = undefined;
        /* update K2V */
        this.K2V.put(key, value);
        /* update K2F */
        var oldFreq = this.K2F.get(key);
        this.K2F.put(key, 0);
        var keysInFreq = this.F2Ks.get(oldFreq);
        if (keysInFreq != undefined) {
            keysInFreq.remove(key);
            if (keysInFreq.length == 0) {
                this.F2Ks.remove(oldFreq);
            }
        }
        keysInFreq = this.F2Ks.get(0);
        if (keysInFreq == undefined) {
            keysInFreq = new js.util.LinkedList();
            this.F2Ks.put(0, keysInFreq);
        }
        keysInFreq.push(key);
    };
    
    /**
     * 
     */
    thi$.get = function(key) {
        this.sortedFs = undefined;
        if (!this.contains(key)) {
            return undefined;
        }
        /* update K2F */
        var freq = this.K2F.get(key);
        this.K2F.put(key, freq + 1);
        /* update F2Ks - old info*/
        var keysInFreq = this.F2Ks.get(freq);
        keysInFreq.remove(key);
        if (keysInFreq.length == 0) {
            this.F2Ks.remove(freq);
        }
        /* update F2Ks - new info*/
        keysInFreq = this.F2Ks.get(freq + 1);
        if (keysInFreq == undefined) {
            keysInFreq = new js.util.LinkedList();
            this.F2Ks.put(freq + 1, keysInFreq);
        }
        keysInFreq.push(key);
        return this.K2V.get(key);
    };
    
    /**
     * @param avoidKeys Object, {key : true}, the keys in avoid keys will not be shift from buffer.
     */
    thi$.shiftLow = function(avoidKeys) {
        if (this.F2Ks.size() == 0) {
            return undefined;
        }
        /* get sorted freq */
        if (this.sortedFs == undefined) {
            this.sortedFs = this.F2Ks.keys();
            this.sortedFs.sort();
        }
        /* get pop key */
        var lowF = this.sortedFs[0];
        var keys = this.F2Ks.get(lowF);
        /* the keys in avoid keys will not be shift from buffer. */
        if (avoidKeys && avoidKeys[keys[0]]) {
            return null;
        }
        var shiftKey = keys.shift();
        if (keys.length == 0) {
            this.F2Ks.remove(lowF);
            this.sortedFs.shift();
        }
        /* remove f in K2F */
        this.K2F.remove(shiftKey);
        /* remove v in K2V */
        var rst = this.K2V.remove(shiftKey);
        return rst;
    };
    
    /**
     * 
     */
    thi$.contains = function(key) {
        return this.K2V.contains(key); 
    };
    
    /**
     * 
     */
    thi$.size = function(){
        return this.K2V.size();
    };
    
    /**
     * Clear all contents.
     */
    thi$.clear = function() {
        this._init();
    };
    
	this._init.apply(this, arguments);
};
