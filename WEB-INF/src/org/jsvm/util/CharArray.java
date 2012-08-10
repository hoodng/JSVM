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
package org.jsvm.util;

/**
 *
 */
public class CharArray {

    protected char[] cbuf;

    protected int size;

    protected int wp;

    protected int rp;

    private final static ThreadLocal<char[]> bufLocal = new ThreadLocal<char[]>();

    public CharArray(int capacity) {
        if (capacity < 0) {
            throw new IllegalArgumentException("Negative initial size: "
                    + capacity);
        }

        cbuf = new char[capacity];
    }

    public CharArray() {
        cbuf = bufLocal.get();
        if (cbuf == null) {
            cbuf = new char[16];
        } else {
            bufLocal.set(null);
        }
    }

    public CharArray(char[] cbuf, int size) {
        this.cbuf = cbuf;
        this.size = size;
        this.wp = this.size;
    }

    public CharArray(String s) {
        this(s.toCharArray(), s.length());
    }

    public final char[] getChars() {
        return cbuf;
    }

    public final char[] expandCapacity(int capacity) {
        if (capacity > cbuf.length) {
            char[] nbuf = new char[Math.max(cbuf.length << 1, capacity)];
            System.arraycopy(cbuf, 0, nbuf, 0, wp);
            cbuf = nbuf;
            // System.err.println("Expand capacity to " + cbuf.length);
        }
        return cbuf;
    }

    public final int size() {
        size = (size < wp) ? wp : size;
        return size;
    }

    public final void setSize(int size) {
        size = size < 0 ? 0 : size;
        if (size < wp) {
            this.wp = size;
        } else if (size > cbuf.length) {
            expandCapacity(size);
        }
        this.size = size;
    }

    public final int tellp() {
        return wp;
    }

    public final void seekp(int wp) {
        wp = wp < 0 ? 0 : wp;
        if (size < wp) {
            this.size = wp;
        }
        this.wp = wp;
    }

    public final CharArray backp() {
        wp -= 1;
        return this;
    }

    public final CharArray put(char c) {
        if (wp + 1 > cbuf.length)
            expandCapacity(wp + 1);

        cbuf[wp++] = c;

        return this;
    }

    public final CharArray put(char[] srcArray, int srcPos, int length) {

        int count = wp + length;

        if (count > cbuf.length)
            expandCapacity(count);

        System.arraycopy(srcArray, srcPos, cbuf, wp, length);
        seekp(count);

        return this;
    }

    public final int tellg() {
        return rp;
    }

    public final void seekg(int rp) {
        rp = rp < 0 ? 0 : rp;
        if (rp > size()) {
            rp = size > 0 ? size - 1 : 0;
        }
        this.rp = rp;
    }

    public final CharArray backg() {
        rp -= 1;
        return this;
    }

    public final int get() {
        return rp < size() ? cbuf[rp++] : -1;
    }

    public final int peek(int index) {
        return (index < 0 || index >= size) ? -1 : cbuf[index];
    }

    public final int peek() {
        return peek(rp);
    }

    /**
     * Skip white space characters and multi-line comments
     */
    public final void skip() {
        if (rp >= size)
            return;

        int[] masks = StringUtil.masks;

        int c = cbuf[rp], b;

        while (c < 128 && masks[c] == 0x0080) {
            rp++;

            if (rp >= size)
                return;

            c = cbuf[rp];
        }

        if (rp + 1 >= size)
            return;

        int sp = rp;
        // Skip multi-line comments
        if ('/' == c && '*' == cbuf[rp + 1]) {
            if (rp + 3 >= size)
                return;

            rp += 2;
            b = cbuf[rp++];
            c = cbuf[rp];
            while ('/' != c || ('/' == c && '*' != b)) {
                rp++;

                if (rp >= size) {
                    rp = sp;
                    return;
                }

                b = c;
                c = cbuf[rp];
            }
            rp++;
        }

        if (rp + 1 >= size)
            return;

        c = cbuf[rp];
        if ((c < 128 && masks[c] == 0x0080)) {
            skip();
        }
    }

    public final String getString() {
        bufLocal.set(cbuf);
        return new String(cbuf, 0, size());
    }

    public final String toString() {
        return new StringBuilder().append("R:[").append(
                (char) (rp < size() ? cbuf[rp] : -1)).append("]@").append(rp)
                .append(" W:[")
                .append((char) (wp < size() ? cbuf[wp - 1] : -1)).append("]@")
                .append(wp - 1).append(" L:").append(size()).toString();
    }
}
