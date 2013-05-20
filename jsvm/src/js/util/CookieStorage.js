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

$package("js.util");

$import("js.util.Cookie");

js.util.CookieStorage = function (){

    var CLASS = js.util.CookieStorage, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this.parseCookies();
        return;
    }
    CLASS.__defined__ = true;
    
    var cookies;

    /**
     * Set a cookie
     * 
     */
    thi$.setCookie = function(name, value, expire, path, domain, secure){
        this.add(new js.util.Cookie(
                     name, value, expire, path, domain, secure));
    };
    
    /**
     * Return a cookie value
     * 
     */
    thi$.getCookie = function(name){
        var cookie = this.get(name);
        return cookie ? cookie.getValue() : undefined;
    };

    /**
     * Delete a cookie
     * 
     */
    thi$.delCookie = function(name){
        var cookie = this.get(name);
        if(cookie){
            this.remove(cookie);
        }
    };

    /**
     * Add a cookie
     * 
     * @param cookie, the <code>js.util.Cookie</code> instance
     * @param uri, preserved
     */
    thi$.add = function(cookie, uri){
        document.cookie = cookie.toString();    
        this.parseCookies();
    };
    
    /**
     * Return a <code>js.util.Cookie</code> with the 
     * specified cookie name 
     */
    thi$.get = function(name){
        return cookies[name];
    };

    /**
     * Remove a cookie
     * 
     * @param cookie,the <code>js.util.Cookie</code> instance
     * @param uri, preserved
     */
    thi$.remove = function(cookie, uri){
        cookie.setMaxAge(-1);
        this.add(cookie, uri);
    };

    thi$.parseCookies = function(){
        cookies = cookies || {};
        for(var p in cookies) delete cookies[p];

        var vs = document.cookie.split(";"), item, n, v;
        for(var i=0, len=vs.length; i<len; i++){
            item = vs[i].split("=");
            n = item[0]; v = unescape(item[1]);
            cookies[n] = new js.util.Cookie(n, v);
        }
    };

    this.parseCookies();

}.$extend(js.lang.Object);

