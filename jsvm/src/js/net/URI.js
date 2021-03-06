/**

  Copyright 2010-2011, The JSVM Project. 
  All rights reserved.
  
 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
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
        userInfoRegExp = /^(?:([^:@\/?\s]+))(:(?:[^:@\/?\s]+))?@/i,
        hostRegExp = /^((?:[^;:@=\/\?\.\s]+\.)+[A-Za-z0-9\-]{1,}|localhost)/i,

    // For matching cusotm host names mapping ips in OS' hosts file.
    // Such as "http://xx:8888", "xx" mapping "127.0.0.1".
        regNameRegExp = /^([^;:@=\/\?\#\.\s]+)/i,
        noSchemeRegNameRegExp = /^([^;:@=\/\?\#\.\s]+)(?=:\d+)/i,
    
        portRegExp = /^:(\d+)/,
        pathRegExp = /^\.*\/[^?#]*/i,
        queryRegExp = /^\?([^#]*)/i,
        fragmentRegExp = /^#(.+)/i,
    
        QueryRegExp = new RegExp("(?:^|&)([^&=]*)=?([^&]*)","g"),
    
        regExps = [schemeRegExp, userInfoRegExp, hostRegExp, portRegExp, 
                   pathRegExp, queryRegExp, fragmentRegExp],
        REGX_PATH = /(.*[/|\\])(.*)/;
    
    thi$.parseURI = function(uri){
        if(!uri) return;
        
        var curUri = uri, regExp, i=0,
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
            }.$bind(this);

        while(curUri && i < 7){
            regExp = regExps[i];
            curUri = curUri.replace(regExp, parseFun);
            
            if(regExp == hostRegExp && !this.host){
                regExp = this.scheme ? regNameRegExp : noSchemeRegNameRegExp;
                curUri = curUri.replace(regExp, parseFun);
            }
            
            ++i;
        }
        
        // If and only if the rest part of the given uri doesn't contains
        // the "?", "#" and no any query and fragment were parsed, the rest
        // part will be the relative uri path string.
        if(curUri && (curUri.search(/\?#/i) == -1) &&
           this.path == undefined && this.query == undefined &&
           this.fragment == undefined){
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
        var curUri = J$VM.System.getProperty("j$vm_uri") ||
            new (CLASS)(document.URL),
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

    thi$.isSameOrigin = function(s){
        var uri = new (CLASS)(s || document.URL);
        return this.scheme == uri.scheme &&
            this.host == uri.host &&
            this.port == uri.port;
    };
    
    thi$._init = function(){
        if(arguments.length === 1){

            this.scheme = undefined;
            this.userInfo = undefined;
            this.user = undefined;
            this.password = undefined;
            this.host = undefined;
            this.port = undefined;
            this.path = undefined;
            this.query= undefined; 
            this.fragment = undefined;
            
            var A, uri = "";
            try{
                uri = arguments[0];
                while(uri.indexOf("%") > 0){
                    uri = unescape(uri);
                }
                uri = decodeURI(uri);
                if(J$VM.env.j$vm_isworker !== true){
                    A = document.createElement("A");
                    A.href = uri;
                    uri = A.href;
                }
            }catch(ex){
                throw ex;
            }
            this.parseURI(uri);
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

