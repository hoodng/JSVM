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

$package("org.jsvm.map");

/**
 * 
 */
org.jsvm.map.MapMath = new function(){

    var RAD = Math.PI / 180.0, 
        TWICEPI = 2.0 * Math.PI;
    
    /**
     * Mercator project longitude to 0~1
     *
     * @param lng, longitude in degree.
     * @return 0~1 double
     */
    this.mercatorX = function(lng){
        return (180.0 + lng) / 360.0;
    };

    /**
     * Mercator project latitude to 0~1
     *
     * @param lat, latitude in degree.
     * @return 0~1 double
     */
    this.mercatorY = function(lat){
        lat *= RAD;
        return 0.5 - Math.log(Math.tan(lat) + 1.0/Math.cos(lat))/TWICEPI;
    };


    /**
     * Mercator project 0~1 to longitude
     *
     * @param x, a double of 0~1
     * @return longitude in degree
     */
    this.inverseMercatorX = function(x){
        return x * 360.0 - 180.0;
    };

    /**
     * Mercator project 0~1 to latitude
     *
     * @param x, a double of 0~1
     * @return latitude in degree
     */
    this.inverseMercatorY = function(y){
        return Math.atan(Math.sinh((1.0-2.0*y)*Math.PI))/RAD;
    };

    this.lng2pixel = function(lng, size){
        var x = Math.floor(this.mercatorX(lng) * size);
        return x >= size ? size - 1 : x;
    };

    this.pixel2lng = function(x, size){
        return this.inverseMercatorX(x / size);
    };

    this.lat2pixel = function(lat, size){
        var y = Math.floor(this.mercatorY(lat) * size);
        return y >= size ? size - 1 : y;
    };

    this.pixel2lat = function(y, size){
        return this.inverseMercatorY(y / size);
    };

    if(!Math.sinh){
        Math.sinh = function(x){
            return (Math.exp(x) - Math.exp(-x))/2.0;
        };
    }

}();
