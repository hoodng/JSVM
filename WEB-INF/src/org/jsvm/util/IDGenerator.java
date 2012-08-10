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

import java.util.Random;
import java.util.zip.CRC32;

public class IDGenerator {

    static final String ID_PREFIX = "s";
    static Random RN = new Random(System.currentTimeMillis());
    static long seed = RN.nextLong();
    static CRC32 crc = new CRC32();

    /**
     * Return a unique <code>ID</code>
     * 
     * @return <code>ID</code>
     */
    public static ID getUniqueID() {
        synchronized (RN) {
            return new NumberID(System.currentTimeMillis() + seed++);
        }
    }
    
    /**
     * Return a unique from a string
     */
    public static ID getUniqueID(String args) {
        if (args == null)
            return parseID("s0");

        StringBuilder buf = new StringBuilder(args);

        long value = 0;
        byte[] b = buf.toString().getBytes();
        synchronized (crc) {
            crc.reset();
            crc.update(b);
            value = crc.getValue();
        }
        value <<= 32;

        b = buf.reverse().toString().getBytes();
        synchronized (crc) {
            crc.reset();
            crc.update(b);
            value |= crc.getValue();
        }

        return new NumberID(value);

    }

    /**
     * Parse a specific string to a <code>ID</code>
     * 
     * @param s
     *            The string which is a <code>ID</code> toString()
     * @return <code>ID</code>
     * @see #getUniqueID()
     * @see #getUniqueID(String)
     */
    public static ID parseID(final String s) {
        if (s == null)
            return new NumberID(0);

        if (s.startsWith(ID_PREFIX)) {
            try {
                return new NumberID(Long.parseLong(s.substring(1), 16));
            } catch (NumberFormatException e) {

            }
        }

        return new StringID(s);
    }




}

final class NumberID implements ID {
    
    private long value;

    public NumberID(long value){
        this.value = Math.abs(value);
    }

    public int hashCode(){
        return (int)(value ^ (value >>> 32));
    }

    public boolean equals(Object obj){
        return (obj instanceof NumberID) ? 
            (value == ((NumberID)obj).value) : false;
    }

    public String toString(){
        StringBuilder buf = new StringBuilder(IDGenerator.ID_PREFIX);
        for (int i = 0; i < 8; i++) {
            byte b = (byte) (value >>> ((7 - (i % 8)) << 3));
            String s = Integer.toHexString((int) (b & 0xff));
            if (s.length() < 2) {
                buf.append("0");
            }
            buf.append(s);
        }
        return buf.toString();
    }


    protected Object clone() throws CloneNotSupportedException {
        return new NumberID(value);
    }

}

final class StringID implements ID {

    private String value;

    public StringID(String value){
        if(value == null)
            throw new NullPointerException();

        this.value = value;
    }

    public int hashCode(){
        return value.hashCode();
    }

    public boolean equals(Object obj){
        return (obj instanceof StringID) ? 
            value.equals(((StringID)obj).value) : false;
    }

    protected Object clone() throws CloneNotSupportedException {
        return new StringID(value);
    }

        
}

