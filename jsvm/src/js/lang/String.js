/**

  Copyright 2010-2011, The JSVM Project.
  All rights reserved.

 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

js.lang.String = function(){

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

    var TAGTEST = {
        script: /<script\b[\s\S]*?>([\s\S]*?)<\/script/i,
        pre: /<pre\b[\s\S]*?>([\s\S]*?)<\/pre/i,
        TEXTAREA: /<TEXTAREA\b[\s\S]*?>([\s\S]*?)<\/TEXTAREA/i
    };

    var REGX_MEATACHARS_ESCAPE = {
        "^" : "\\\^",
        "$" : "\\\$",
        "(" : "\\\(",
        ")" : "\\\)",
        "[" : "\\\[",
        "{" : "\\\{",
        "." : "\\\.",
        "*" : "\\\*",
        "\\": "\\\\",
        "|" : "\\\|",
        "<" : "\\\<",
        ">" : "\\\>",
        "+" : "\\\+",
        "?" : "\\\?"
    };

    var REGX_MEATACHARS_UNESCAPE = {
        "\\\^" : "^",
        "\\\$" : "$",
        "\\\(" : "(",
        "\\\)" : ")",
        "\\\[" : "[",
        "\\\{" : "{",
        "\\\." : ".",
        "\\\*" : "*",
        "\\\\" : "\\",
        "\\\|" : "|",
        "\\\<" : "<",
        "\\\>" : ">",
        "\\\+" : "+",
        "\\\?" : "?"
    };

    this.encodeHtml = String.encodeHtml =
        function(s, nobreak, ignoreSpace){
            s = (s != undefined) ? s : this.toString();

            var o;
            return (typeof s != "string") ? s :
                s.replace(REGX_HTML_ENCODE,
                          function($0){
                              var c = $0.charCodeAt(0), r = ["&#"];
                              // CR ASCII: \r
                              if(c == 0x0D && nobreak != true){
                                  o = c;
                                  return "<br/>";
                              }

                              // LF ASCII: \n
                              if(c == 0x0A && nobreak != true){
                                  return (o == 0x0D) ? "" : "<br/>";
                              }

                              // 0xA0 (160) doesn't belong to the ASCII. 
                              // Only 0x20 (32) is the ASCII of space.
                              // In fact, large than 127 should belong to UNICODE.
                              // So 0xA0 (160) isn't a english space.
                              // 
                              // For html span, the 0xA0 (160) will be converted
                              // as the "&nbsp;" by the browser.
                              if(c == 0x20 || c == 0xA0){
                                  if(ignoreSpace !== true){
                                      // Make the whitespace as "&nbsp;"
                                      c = (c == 0x20) ? 0xA0 : c;
                                  }else{
                                      // Keep the ASCII whitespace to make the
                                      // text string can be word-wrap by word.
                                      c = (c == 0xA0) ? 0x20 : c;
                                      return String.fromCharCode(c);
                                  }
                              }

                              r.push(c); r.push(";");
                              return r.join("");
                          });
        };

    this.decodeHtml = String.decodeHtml =
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
    this.escapeRegExp = String.escapeRegExp =
        function(s){
            s = (s != undefined) ? s : this.toString();
            return (typeof s != "string") ? s :
                s.replace(REGX_REGEXP_METACHARS,
                          function($0){
                              return "\\" + $0;
                          });
        };

    this.unescapeRegExp = String.unescapeRegExp =
        function(s){
            s = (s != undefined) ? s : this.toString();
            return (typeof s != "string") ? s :
                s.replace(REGX_REGEXP_ESCAPEDMETACHARS,
                          function($0, ch){
                              return ch;
                          });

        };


    /**
     * For using regular expression to eacapse is inefficient, we add another
     * method here to do it.
     *
     */
    this.escapeRxMetaChars = String.escapeRxMetaChars =
        function(s, emap){
            if(!s || typeof s != "string"){
                return s;
            }

            var buf = [], ch, ech;
            for(var i = 0; i < s.length; i++){
                ch = s.charAt(i);

                ech = emap ? emap[ch] : null;
                if(typeof ech != "string"){
                    ech = REGX_MEATACHARS_ESCAPE[ch];
                }

                if(ech){
                    buf.push(ech);
                }else{
                    buf.push(ch);
                }
            }

            return buf.join("");
        };

    this.unescapeRxMetaChars = String.unescapeRxMetaChars =
        function(s){
            if(!s || typeof s != "string"
                  || s.indexOf("\\") == -1){
                return s;
            }

            var buf = [], ch, prech;
            for(var i = 0; i < s.length; i++){
                ch = s.charAt(i);
                if(ch !== "\\"){
                    if(prech){
                        ch = prech + ch;
                        ch = REGX_MEATACHARS_UNESCAPE[ch] || ch;

                        prech = null;
                    }

                    buf.push(ch);
                }else{
                    prech = ch;
                }
            }

            return buf.join("");
        };

    this.trim = String.trim = this.trim || function(){
        var s = this.toString();
        return (typeof s != "string") ? s :
            s.replace(REGX_TRIM, "");
    };

    this.endsWith = this.endsWith || function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };

    this.startsWith = this.startsWith || function(suffix) {
        return this.indexOf(suffix) === 0;
    };

    this.fetchJSON = String.prototype.fetchJSON = function(tag, s){
        tag = tag || "pre";
        s = (s != undefined) ? s : this.toString();
        var tester = TAGTEST[tag], ret;
        if(tester.test(s)){
            ret = tester.exec(s);
        }
        return ret ? ret[1].trim(): s;
    };

    this.hashCode = this.hashCode || function(){
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

    return String;

}.call(String.prototype);
