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
 * Source code availability: https://github.com/jsvm/JSVM
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
    
    var Class = js.lang.Class, Math = js.lang.Math;
    
    /**
     * Return hash code of this object
     * @return {Number}
     */
    thi$.hashCode = function(){
        this.__hash__ = this.__hash__ || 
            (new Date().getTime()+Math.gCount());

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
        }

        this.__uuid__ = this.__uuid__ ||
            Math.uuid(this.hashCode());

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
        J$VM.MQ.remove(this.uuid());
        var p, v;
        for(p in this){
            v = this[p];
            delete this[p];
        }
        this.destroied = true;
    };

}.$extend(Object);


