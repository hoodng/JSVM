/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
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
            n = item[0].trim(); v = unescape(item[1]);
            cookies[n] = new js.util.Cookie(n, v);
        }
    };

    this.parseCookies();

}.$extend(js.lang.Object);

