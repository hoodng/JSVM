/**
 * Copyright 2010-2011, The JSVM Project.
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification,
 * are permitted provided that the following conditions are met:
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the JSVM nor the names of its contributors may be
 * used to endorse or promote products derived from this software
 * without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 */
package org.jsvm.util;

/**
 * @author dong.hu@china.jinfonet.com
 * 
 */
public final class Base64 {

    public static final String BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@*-";

    static final char[] Base64Chars = new char[65];
    static final int[] Base64Codes = new int[128];
    static {
        for (int i = 0; i < 65; i++) {
            Base64Chars[i] = BASE64.charAt(i);
            Base64Codes[BASE64.codePointAt(i)] = i;
        }
    }

    public static String encode(final String s) {
        if (s == null || s.length() == 0)
            return s;

        byte[] b = null;
        try {
            b = s.getBytes("UTF-8");
        } catch (java.io.UnsupportedEncodingException e) {
            e.printStackTrace();
            return s;
        }

        return encode4bytes(b);
    }

    public static String encode4bytes(final byte[] s) {
        if (s == null)
            return null;

        int len = s.length;
        char[] cbuf = new char[(((len / 3) << 2) + ((len % 3) > 0 ? 4 : 0))];
        int i = 0, wp = 0, b0, b1, b2, b3;
        while (i < len) {
            byte tmp = s[i++];
            b0 = (tmp & 0xfc) >> 2;
            b1 = (tmp & 0x03) << 4;
            if (i < len) {
                tmp = s[i++];
                b1 |= (tmp & 0xf0) >> 4;
                b2 = (tmp & 0x0f) << 2;
                if (i < len) {
                    tmp = s[i++];
                    b2 |= (tmp & 0xc0) >> 6;
                    b3 = tmp & 0x3f;
                } else {
                    b3 = 64; // 1 byte "-" is supplement
                }
            } else {
                b2 = b3 = 64;// 2 bytes "-" are supplement
            }

            cbuf[wp++] = Base64Chars[b0];
            cbuf[wp++] = Base64Chars[b1];
            cbuf[wp++] = Base64Chars[b2];
            cbuf[wp++] = Base64Chars[b3];
        }

        return new String(cbuf, 0, wp);
    }

    public static String decode(final String s) {
        byte[] b = decode2bytes(s);
        if (b == null)
            return null;
        if (b.length == 0)
            return "";

        try {
            return new String(b, "UTF-8");
        } catch (java.io.UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static byte[] decode2bytes(final String s) {
        if (s == null)
            return null;

        int len = s.length();
        if (len == 0)
            return new byte[0];
        if (len % 4 != 0) {
            throw new java.lang.IllegalArgumentException(s);
        }

        byte[] b = new byte[(len / 4) * 3];
        int i = 0, j = 0, e = 0, c, tmp;
        while (i < len) {
            c = Base64Codes[s.charAt(i++)];
            tmp = c << 18;
            c = Base64Codes[s.charAt(i++)];
            tmp |= c << 12;
            c = Base64Codes[s.charAt(i++)];
            if (c < 64) {
                tmp |= c << 6;
                c = Base64Codes[s.charAt(i++)];
                if (c < 64) {
                    tmp |= c;
                } else {
                    e = 1;
                }
            } else {
                e = 2;
                i++;
            }

            b[j + 2] = (byte) (tmp & 0xff);
            tmp >>= 8;
            b[j + 1] = (byte) (tmp & 0xff);
            tmp >>= 8;
            b[j + 0] = (byte) (tmp & 0xff);
            j += 3;
        }

        if (e != 0) {
            len = b.length - e;
            byte[] copy = new byte[len];
            System.arraycopy(b, 0, copy, 0, len);
            return copy;
        }

        return b;

    }
}
