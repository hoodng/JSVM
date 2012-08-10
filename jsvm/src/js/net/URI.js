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
                       "host", "port", "path", "query", "fragment"];
    
    var UrlRegExp = new RegExp(
            "([-+a-zA-Z0-9]+)://"+ // scheme
            "((.[^:]*):?(.*)?@)?"+ // userInfo
            "(.[^:/]*)"+           // host
            ":?([0-9]{1,6})?"+     // port
            "(/.[^?#]*)"+          // path
            "[?]?(.[^#]*)?"+       // query
            "#?(.*)?"              // fragment      
        );
    
    var QueryRegExp = new RegExp("(?:^|&)([^&=]*)=?([^&]*)","g");
    
    thi$._parse = function(query){
        var params = {};
        if(query){
            query.replace(QueryRegExp, 
                          function($0, $1, $2){
                              if($1) params[$1] = $2;
                          });
        }
        return params;
    };

    thi$._init = function(){
        if(arguments.length === 1){
            var res = UrlRegExp.exec(decodeURI(arguments[0]));
            for(var i=0, len=res.length; i<len; i++){
                this[Keys[i]] = res[i];
            }
        }else{
            this.scheme   = arguments[0];
            this.userInfo = arguments[1];
            this.host     = arguments[2];
            this.port     = arguments[3];
            this.path     = arguments[4];
            this.query    = arguments[5];
            this.fragment = arguments[6];
        }

        this.params = this._parse(this.query);
    };

    this._init.apply(this, arguments);

}.$extend(js.lang.Object);

