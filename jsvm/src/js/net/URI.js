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

$package("js.net");

/**
 * 
 * @param url, the url string
 * @param ..., if arguments.length > 1, then regard as constructs a hierarchical 
 * URI from the given components. The arguments are (scheme, userInfo, host, port, 
 * path, query, fragment)
 */
js.net.URI = function (url){

    var CLASS = js.net.URI, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Keys = ["source", "scheme", "userInfo", "user", "password", 
                "host", "port", "path", "query", "fragment"],     
        schemeRegExp = /^(?:([-+a-zA-Z0-9]+):\/\/|\/\/)/i,
        userInfoRegExp = /^(?:([^:@\s]+))(:(?:[^:@\s]+))?@/i,
        hostRegExp = /^((?:[^;:@=\/\?\.\s]+\.)+[A-Za-z0-9\-]{1,}|localhost)/i,

        // For matching cusotm host names mapping ips in OS' hosts file.
        // Such as "http://xx:8888", "xx" mapping "127.0.0.1".
        regNameRegExp = /^([^;:@=\/\?\#\.\s]+)/i,
        noSchemeRegNameRegExp = /^([^;:@=\/\?\#\.\s]+)(?=:\d+)/i,
        
        portRegExp = /^:(\d+)/,
        pathRegExp = /^\/[^?#]*/i,
        queryRegExp = /^\?([^#]*)/i,
        fragmentRegExp = /^#(.+)/i,
        
        QueryRegExp = new RegExp("(?:^|&)([^&=]*)=?([^&]*)","g"),
        
        regExps = [schemeRegExp, userInfoRegExp, hostRegExp, portRegExp, 
                   pathRegExp, queryRegExp, fragmentRegExp],
        REGX_PATH = /(.*[/|\\])(.*)/;
    
    var _parseURI = function(uri){
        if(!uri) return;
        
        var curUri = uri, regExp,
            parseFun = function($0, $1, $2, $3){
                switch(regExp){
                case schemeRegExp:
                    this.scheme = $1;
                    break;
                case userInfoRegExp:
                    this.userInfo = $0;
                    this.user = $1;
                    this.password = $2 ? $2.substring(1) : $2; //$3
                    break;
                case hostRegExp:
                case regNameRegExp:
                case noSchemeRegNameRegExp:
                    this.host = $0;
                    break;
                case portRegExp:
                    this.port = $1;
                    break;
                case pathRegExp:
                    this.path = $0;
                    break;
                case queryRegExp:
                    this.query = $1;
                    break;
                case fragmentRegExp:
                    this.fragment = $1;
                    break;
                default:
                    break;
                }
                
                return "";
            };
        
        var i = 0;
        while(curUri && i < 7){
            regExp = regExps[i];
            curUri = curUri.replace(regExp, parseFun.$bind(this));
            
            if(regExp == hostRegExp && !this.host){
                regExp = this.scheme ? regNameRegExp : noSchemeRegNameRegExp;
                curUri = curUri.replace(regExp, parseFun.$bind(this));
            }
            
            ++i;
        }
        
        // If and only if the rest part of the given uri doesn't contains
        // the "?", "#" and no any query and fragment were parsed, the rest
        // part will be the relative uri path string.
        if(curUri && (curUri.search(/\?#/i) == -1)
           && this.path == undefined && this.query == undefined 
           && this.fragment == undefined){
            this.path = curUri;
        }
        
        this.source =  uri;
    };
    
    thi$.parseParams = function(query){
        var params = {};
        if(query){
            query.replace(QueryRegExp, 
                          function($0, $1, $2){
                              if($1) params[$1] = $2;
                          });
        }
        return params;
    };
    
    
    thi$.toURI = function(){
        var curUri = J$VM.System.getProperty("uri") || new js.net.URI(document.URL),
            uri = "", query = "", hasQF = false, tmp;
        if(this.host){
            uri += (this.scheme || "http") + "://";
            uri += this.userInfo || "";
            uri += this.host;
            
            if(this.port){
                uri += ":" + this.port;
            }

            if(this.path){
                uri += this.path;
                hasQF = true;
            }
        }else{
            if(this.path){
                uri += curUri.scheme + "://" + (curUri.userInfo || "") + curUri.host;
                if(curUri.port){
                    uri += ":" + curUri.port;
                }
                
                if(this.path.indexOf("/") == 0){
                    uri += this.path;
                }else{
                    tmp = (curUri.path || "").match(REGX_PATH);
                    uri += (tmp[1] || "/") + this.path;
                }
                
                hasQF = true;
            }
        }
        
        // Only when the path is existed,  the query and fragment
        // will be significant.  
        if(hasQF){
            for(var key in this.params){
                query += key + "=" + this.params[key] + "&";
            }
            
            if(query){
                query = query.substring(0, query.length - 1);
                uri += "?" + query;
            }
            
            if(this.fragment){
                uri += "#" + this.fragment;
            }
        }
        
        return uri;
    };
    
    thi$._init = function(){
        if(arguments.length === 1){
            this.scheme = this.userInfo = this.user = this.password 
                = this.host = this.port = this.path = this.query 
                = this.fragment = undefined;
            var uri = "";
            try{
                uri = decodeURI(arguments[0]);
            }catch(ex){
                throw ex;
            }
            _parseURI.call(this, uri);
        }else{
            this.scheme   = arguments[0];
            this.userInfo = arguments[1];
            this.host     = arguments[2];
            this.port     = arguments[3];
            this.path     = arguments[4];
            this.query    = arguments[5];
            this.fragment = arguments[6];
        }

        this.params = this.parseParams(this.query);
    };

    this._init.apply(this, arguments);

}.$extend(js.lang.Object);

