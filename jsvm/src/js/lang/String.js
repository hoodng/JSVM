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
 * @File: String.js 
 * @Create: 2010-11-17 
 * @Author: dong.hu@china.jinfonet.com
 */

js.lang.String = new function(){

    var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;

    var REGX_HTML_DECODE = /&\w+;|&#(\d+);|<br\/>/g;

    var REGX_TRIM = /(^\s*)|(\s*$)/g;
    
    var REGX_REGEXP_METACHARS = /[\^\$\.\*\+\?\|\\\(\)\[\]\{\}]/g;
    
    var REGX_REGEXP_ESCAPEDMETACHARS = /\\([\^\$\.\*\+\?\|\\\(\)\[\]\{\}])/g;
    
    var HTML_DECODE = {
        "&lt;"  : "<", 
        "&gt;"  : ">", 
        "&amp;" : "&", 
        "&nbsp;": " ", 
        "&quot;": "\"", 
        "&copy;": "©",
        "<br/>" : String.fromCharCode(0x0A)
        // Add more
    };

    this.encodeHtml = String.prototype.encodeHtml = 
        function(s, nobreak){
            s = (s != undefined) ? s : this.toString();
            return (typeof s != "string") ? s :
                s.replace(REGX_HTML_ENCODE, 
                          function($0){
                              var c = $0.charCodeAt(0), r = ["&#"];
                              if(c == 0x0D || c == 0x0A){
                                  if(nobreak !== true){
                                      return "<br/>";
                                  }
                              }

                              c = (c == 0x20) ? 0xA0 : c;
                              r.push(c); r.push(";");
                              return r.join("");
                          });
        };

    this.decodeHtml = String.prototype.decodeHtml = 
        function(s, nobreak){
            s = (s != undefined) ? s : this.toString();
            return (typeof s != "string") ? s :
                s.replace(REGX_HTML_DECODE,
                          function($0, $1){
                              var c = HTML_DECODE[$0];
                              if(c == undefined){
                                  // Maybe is Entity Number
                                  if(!isNaN($1)){
                                      c = String.fromCharCode(
                                          ($1 == 160) ? 32 : $1);
                                  }else{
                                      c = $0;
                                  }
                              }
                              return c;
                          });
        };

    /**
     * Escape regular expression's meta-characters as literal characters.
     */
    this.escapeRegExp = String.prototype.escapeRegExp = 
        function(s){
            s = (s != undefined) ? s : this.toString();
            return (typeof s != "string") ? s :
                s.replace(REGX_REGEXP_METACHARS, 
                          function($0){
                              return "\\" + $0;
                          });
        };

    this.unescapeRegExp = String.prototype.unescapeRegExp = 
        function(s){
            s = (s != undefined) ? s : this.toString();
            return (typeof s != "string") ? s :
                s.replace(REGX_REGEXP_ESCAPEDMETACHARS,
                          function($0, ch){
                              return ch;
                          });
            
        };
    
    this.trim = String.prototype.trim = function(s){
        s = (s != undefined) ? s : this.toString();
        return (typeof s != "string") ? s :
            s.replace(REGX_TRIM, "");
    };

    this.matchBrackets = String.prototype.matchBrackets = 
        function(lC, rC, s) {
            lC = lC || "{"; rC = rC || "}";
            s = (s != undefined) ? s : this.toString();

            var stack = [], c0, c, p0 = 0, p1 = 0, end;

            for(var i=0, len=s.length; i<len; i++){
                c = s.charAt(i);

                switch(c) {
                case lC:
                    c0 = i > 0 ? s.charAt(i-1) : null;
                    if(c0 != "\\"){
                        p1 = i;
                        stack.push(p1);
                    }
                    break;
                case rC:
                    c0 = i > 0 ? s.charAt(i-1) : null;
                    if(c0 != "\\"){
                        p1 = i;
                        p0 = stack.pop();
                        if(stack.length == 0) end = true;
                    }
                    break;
                default:
                    break;    
                }
                
                if(end) break;
            }

            return s.substring(p0, p1+1);
        };

    String.prototype.hashCode = function(){
        var hash = this._hash, _char;
        if(hash == undefined || hash == 0){
            hash = 0;
            for (var i = 0, len=this.length; i < len; i++) {
                _char = this.charCodeAt(i);
                hash = 31*hash + _char;
                hash = hash & hash; // Convert to 32bit integer
            }
            hash = hash & 0x7fffffff;
            this._hash = hash;
        }

        return this._hash;  
    };

}();

