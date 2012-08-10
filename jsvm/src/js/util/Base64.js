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

js.util.Base64 = new function (){

    var base64chars = "ABCDEFGHIJKLMNOP" +
        "QRSTUVWXYZabcdef"+
        "ghijklmnopqrstuv"+
        "wxyz0123456789@*"+
        "-";
    /** 
     * Encodes a utf8 integer array to a ucs2 string.
     * @param s, an integer array
     * @return a string
     */
    var utf8_ucs2 = function(s){
        if(!s) return null;
        var len = s.length;
        if(len == 0) return "";

        var d = [], c = 0, i = 0, tmp = 0;
        while(i < len){
            c = s[i++];
            if((c & 0xe0) == 0xe0){
                // 3 bytes

                tmp = (c & 0x0f) << 12;
                c = s[i++];
                tmp |= ((c & 0x3f) << 6);
                c = s[i++];
                tmp |= (c & 0x3f);
            }else
                if((c & 0xc0) == 0xc0){
                    // 2 bytes

                    tmp = (c & 0x1f) << 6;
                    c = s[i++];
                    tmp |= (c & 0x3f);
                }else{
                    // 1 byte

                    tmp = c;
                }
            
            d.push(String.fromCharCode(tmp));
        }
        
        return d.join("");
    };

    /** 
     * Encodes a ucs2 string to a utf8 integer array. 
     * @param s, a string
     * @return an integer array
     */
    var ucs2_utf8 = function(s){
        if (!s) return null;
        var d = [];
        if (s == "") return d;

        var c = 0, i = 0, j = 0, len = s.length;
        while(i < len){
            c = s.charCodeAt(i++);
            if(c <= 0x7f){
                // 1 byte

                d[j++] = c;
            }else
                if((c >= 0x80) && (c <= 0x7ff)){
                    // 2 bytes

                    d[j++] = ((c >> 6) & 0x1f) | 0xc0;
                    d[j++] = (c & 0x3f) | 0x80;
                }else{
                    // 3 bytes

                    d[j++] = (c >> 12) | 0xe0;
                    d[j++] = ((c >> 6) & 0x3f) | 0x80;
                    d[j++] = (c & 0x3f) | 0x80;
                }
        }
        
        return d;
    };

    /**
     * Encode a string to a Base64 string follow Bse64 regular.
     * @param s, a normal string
     * @return a Base64 string
     */
    this.encode = function(s){
        if(!s || s.length == 0) return s;

        var d = [], b = ucs2_utf8.call(this,s), len = b.length, 
        b0, b1, b2, b3, i = 0, tmp;

        while(i < len){
            tmp = b[i++];
            b0 = (tmp & 0xfc) >> 2;
            b1 = (tmp & 0x03) << 4;
            if(i < len){
                tmp = b[i++];
                b1 |= (tmp & 0xf0) >> 4;
                b2 = (tmp & 0x0f) << 2;
                if(i< len){
                    tmp = b[i++];
                    b2 |= (tmp & 0xc0) >> 6;
                    b3 = tmp & 0x3f;
                }else{
                    b3 = 64; // 1 byte "-" is supplement

                }
            }else{
                b2 = b3 = 64; // 2 bytes "-" are supplement

            }

            d.push(base64chars.charAt(b0));
            d.push(base64chars.charAt(b1));
            d.push(base64chars.charAt(b2));
            d.push(base64chars.charAt(b3));
        }

        return d.join("");        
    };

    /**
     * Decode a Base64 string to a string follow Base64 regular.
     * @param s, a Base64 string
     * @return a normal string
     */
    this.decode = function(s){
        if(!s) return null;

        var len = s.length;
        if(len%4 != 0)
            throw new Error(s+" is not a valid Base64 string.");

        var b = [], i=0, j=0, e=0, c, tmp;
        while(i < len){
            c = base64chars.indexOf(s.charAt(i++));
            tmp = c << 18;
            c = base64chars.indexOf(s.charAt(i++));
            tmp |= c << 12;
            c = base64chars.indexOf(s.charAt(i++));
            if(c < 64){
                tmp |= c << 6;
                c = base64chars.indexOf(s.charAt(i++));
                if(c < 64){
                    tmp |= c;
                }else{
                    e = 1;
                }
            }else{
                e = 2;
                i++;
            }

            b[j+2] = tmp & 0xff;
            tmp >>= 8;
            b[j+1] = tmp & 0xff;
            tmp >>= 8;
            b[j+0] = tmp & 0xff;
            j += 3;
            
        }
        
        b.splice(b.length-e, e);

        return utf8_ucs2.call(this, b);
        
    };

}();