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

js.lang.String = new function(){

	var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;

	var REGX_HTML_DECODE = /&\w+;|&#(\d+);|<br\/>/g;

	var REGX_TRIM = /(^\s*)|(\s*$)/g;

	var REGX_REGEXP_METACHARS = /[\^\$\.\*\+\?\|\\\(\)\[\]\{\}]/g;

	var REGX_REGEXP_ESCAPEDMETACHARS = /\\([\^\$\.\*\+\?\|\\\(\)\[\]\{\}])/g;

	var HTML_DECODE = {
		"&lt;"	: "<",
		"&gt;"	: ">",
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

	this.encodeHtml = String.prototype.encodeHtml =
		function(s, nobreak, ignoreSpace){
			s = (s != undefined) ? s : this.toString();

			var o;
			return (typeof s != "string") ? s :
				s.replace(REGX_HTML_ENCODE,
						  function($0){
							  var c = $0.charCodeAt(0), r = ["&#"];
							  if(c == 0x0D && nobreak != true){
								  o = c;
								  return "<br/>";
							  }

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


	/**
	 * For using regular expression to eacapse is inefficient, we add another
	 * method here to do it.
	 *
	 */
	this.escapeRxMetaChars = String.prototype.escapeRxMetaChars = function(s, emap){
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

	this.unescapeRxMetaChars = String.prototype.unescapeRxMetaChars = function(s){
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

	this.trim = String.prototype.trim = function(s){
		s = (s != undefined) ? s : this.toString();
		return (typeof s != "string") ? s :
			s.replace(REGX_TRIM, "");
	};

	this.endsWith = String.prototype.endsWith = function(suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};

	this.startsWith = String.prototype.startsWith = function(suffix) {
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
