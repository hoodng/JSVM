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

import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * @author dong.hu@china.jinfonet.com
 */
public final class StringUtil {

    public static final char[] charsNull = { 'n', 'u', 'l', 'l' };
    public static final char[] charsTrue = { 't', 'r', 'u', 'e' };
    public static final char[] charsFalse = { 'f', 'a', 'l', 's', 'e' };

    public static final char[] charsIntegerMin = { '-', '2', '1', '4', '7',
            '4', '8', '3', '6', '4', '8' };

    public static final char[] charsLongMin = { '-', '9', '2', '2', '3', '3',
            '7', '2', '0', '3', '6', '8', '5', '4', '7', '7', '5', '8', '0',
            '8' };

    public static final int[] sizeTable = { 9, 99, 999, 9999, 99999, 999999,
            9999999, 99999999, 999999999, Integer.MAX_VALUE };

    public static final char[] DigitTens = { '0', '0', '0', '0', '0', '0', '0',
            '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1',
            '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '3', '3', '3',
            '3', '3', '3', '3', '3', '3', '3', '4', '4', '4', '4', '4', '4',
            '4', '4', '4', '4', '5', '5', '5', '5', '5', '5', '5', '5', '5',
            '5', '6', '6', '6', '6', '6', '6', '6', '6', '6', '6', '7', '7',
            '7', '7', '7', '7', '7', '7', '7', '7', '8', '8', '8', '8', '8',
            '8', '8', '8', '8', '8', '9', '9', '9', '9', '9', '9', '9', '9',
            '9', '9', };

    public static final char[] DigitOnes = { '0', '1', '2', '3', '4', '5', '6',
            '7', '8', '9', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2',
            '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3', '4', '5',
            '6', '7', '8', '9', '0', '1', '2', '3', '4', '5', '6', '7', '8',
            '9', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1',
            '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3', '4',
            '5', '6', '7', '8', '9', '0', '1', '2', '3', '4', '5', '6', '7',
            '8', '9', };

    /**
     * All possible chars for representing a number as a String
     */
    public static final char[] digits = { '0', '1', '2', '3', '4', '5', '6',
            '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
            'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
            'x', 'y', 'z' };

    public static final int[] masks = new int[256];
    public static final int[] json_encodes = new int[256];
    public static final int[] json_decodes = new int[256];
    static {
        for (int c = 0; c < 256; c++) {

            masks[c] = 0x0100;

            json_encodes[c] = -1;
            json_decodes[c] = -1;
            switch (c) {
            case '\\':
            case '"':
            case '/':
                json_encodes[c] = c;
                json_decodes[c] = c;
                break;
            case '\r':
                masks[c] = 0x0080;
                json_encodes[c] = 'r';
                break;
            case 'r':
                json_decodes[c] = '\r';
                break;
            case '\n':
                masks[c] = 0x0080;
                json_encodes[c] = 'n';
                break;
            case 'n':
                json_decodes[c] = '\n';
                break;
            case '\t':
                masks[c] = 0x0080;
                json_encodes[c] = 't';
                break;
            case 't':
                json_decodes[c] = '\t';
                break;
            case '\f':
                masks[c] = 0x0080;
                json_encodes[c] = 'f';
                break;
            case 'f':
                json_decodes[c] = '\f';
                masks[c] = 10 + c - 'a';
                break;
            case '\b':
                masks[c] = 0x0080;
                json_encodes[c] = 'b';
                break;
            case 'b':
                json_decodes[c] = '\b';
                masks[c] = 10 + c - 'a';
                break;
            case 'u':
                json_decodes[c] = -2;
                break;
            case 'x':
            case 'X':
                masks[c] = 0x0010; // HEX
                break;
            case '.':
                masks[c] = 0x0020; // Float
                break;
            case '-':
            case '+':
                masks[c] = 0x0040;
                break;
            case ' ':
                masks[c] = 0x0080;
                break;
            default:
                if (c >= '0' && c <= '9') {
                    masks[c] = c - '0';
                } else if (c >= 'A' && c <= 'F') {
                    masks[c] = 10 + c - 'A';
                } else if (c >= 'a' && c <= 'f') {
                    masks[c] = 10 + c - 'a';
                }

                if (c < ' ' || (c >= '\u0080' && c < '\u00a0')) {
                    json_encodes[c] = 'u';
                }

            }
        }
    }

    // Requires positive x
    public static int stringSize(int x) {
        for (int i = 0;; i++)
            if (x <= sizeTable[i])
                return i + 1;
    }

    // Requires positive x
    public static int stringSize(long x) {
        long p = 10;
        for (int i = 1; i < 19; i++) {
            if (x < p)
                return i;
            p = 10 * p;
        }
        return 19;
    }

    /**
     * Places characters representing the integer i into the character array
     * buf. The characters are placed into the buffer backwards starting with
     * the least significant digit at the specified index (exclusive), and
     * working backwards from there. Will fail if i == Integer.MIN_VALUE
     */
    public static void getChars(int i, int endIndex, char[] buf) {
        int q, r;
        int charPos = endIndex;
        char sign = 0;

        if (i < 0) {
            sign = '-';
            i = -i;
        }

        // Generate two digits per iteration
        while (i >= 65536) {
            q = i / 100;
            // really: r = i - (q * 100);
            r = i - ((q << 6) + (q << 5) + (q << 2));
            i = q;
            buf[--charPos] = DigitOnes[r];
            buf[--charPos] = DigitTens[r];
        }

        // Fall thru to fast mode for smaller numbers
        // assert(i <= 65536, i);
        for (;;) {
            q = (i * 52429) >>> (16 + 3);
            r = i - ((q << 3) + (q << 1)); // r = i-(q*10) ...
            buf[--charPos] = digits[r];
            i = q;
            if (i == 0)
                break;
        }
        if (sign != 0) {
            buf[--charPos] = sign;
        }
    }

    /**
     * Places characters representing the integer i into the character array
     * buf. The characters are placed into the buffer backwards starting with
     * the least significant digit at the specified index (exclusive), and
     * working backwards from there. Will fail if i == Long.MIN_VALUE
     */
    public static void getChars(long i, int endIndex, char[] buf) {
        long q;
        int r;
        int charPos = endIndex;
        char sign = 0;

        if (i < 0) {
            sign = '-';
            i = -i;
        }

        // Get 2 digits/iteration using longs until quotient fits into an int
        while (i > Integer.MAX_VALUE) {
            q = i / 100;
            // really: r = i - (q * 100);
            r = (int) (i - ((q << 6) + (q << 5) + (q << 2)));
            i = q;
            buf[--charPos] = DigitOnes[r];
            buf[--charPos] = DigitTens[r];
        }

        // Get 2 digits/iteration using ints
        int q2;
        int i2 = (int) i;
        while (i2 >= 65536) {
            q2 = i2 / 100;
            // really: r = i2 - (q * 100);
            r = i2 - ((q2 << 6) + (q2 << 5) + (q2 << 2));
            i2 = q2;
            buf[--charPos] = DigitOnes[r];
            buf[--charPos] = DigitTens[r];
        }

        // Fall thru to fast mode for smaller numbers
        // assert(i2 <= 65536, i2);
        for (;;) {
            q2 = (i2 * 52429) >>> (16 + 3);
            r = i2 - ((q2 << 3) + (q2 << 1)); // r = i2-(q2*10) ...
            buf[--charPos] = digits[r];
            i2 = q2;
            if (i2 == 0)
                break;
        }
        if (sign != 0) {
            buf[--charPos] = sign;
        }
    }

    /**
     * @param array
     * @param i
     * @param radixes
     *            radix, width
     */
    public static void toCharArray(CharArray array, int i, int... radixes) {
        int radix = radixes.length > 0 ? radixes[0] : 10;
        int width = radixes.length > 1 ? radixes[1] : 8;

        if (radix < Character.MIN_RADIX || radix > Character.MAX_RADIX) {
            radix = 10;
        }

        int size = 0, wp = array.size();
        if (radix == 10) {
            if (i == Integer.MIN_VALUE) {
                array.expandCapacity(wp + charsIntegerMin.length);
                array.put(charsIntegerMin, 0, charsIntegerMin.length);
            } else {
                size = (i < 0) ? stringSize(-i) + 1 : stringSize(i);
                size = wp + size;
                array.expandCapacity(size);
                getChars(i, size, array.getChars());
                array.seekp(size);
            }
        } else if (radix == 16) {
            toUnsignedCharArray(array, i, 4, width);
        } else {
            char[] buf = array.expandCapacity(wp + 33);
            boolean negative = (i < 0);
            int charPos = wp + 32;

            if (!negative) {
                i = -i;
            }

            while (i <= -radix) {
                buf[charPos--] = digits[-(i % radix)];
                i = i / radix;
            }
            buf[charPos] = digits[-i];

            if (negative) {
                buf[--charPos] = '-';
            }

            int len = wp + 33 - charPos;
            System.arraycopy(buf, charPos, buf, wp, len);
            array.seekp(wp + len);

        }

    }

    /**
     * Convert the integer to an unsigned number.
     */
    public static int toUnsignedCharArray(CharArray array, int i, int shift,
            int width) {
        int wp = array.size();
        char[] buf = array.expandCapacity(wp + 32);

        int charPos = wp + 32;
        int radix = 1 << shift;
        int mask = radix - 1;
        do {
            buf[--charPos] = digits[i & mask];
            i >>>= shift;
        } while (width-- > 1);

        int len = wp + 32 - charPos;
        System.arraycopy(buf, charPos, buf, wp, len);

        int size = wp + len;
        array.seekp(size);
        return size;
    }

    /**
     * @param array
     * @param i
     * @param radixes
     *            radix, width
     */
    public static void toCharArray(CharArray array, long i, int... radixes) {
        int radix = radixes.length > 0 ? radixes[0] : 10;
        int width = radixes.length > 1 ? radixes[1] : 16;

        if (radix < Character.MIN_RADIX || radix > Character.MAX_RADIX) {
            radix = 10;
        }

        int size = 0, wp = array.size();
        if (radix == 10) {
            if (i == Long.MIN_VALUE) {
                array.expandCapacity(wp + charsLongMin.length);
                array.put(charsLongMin, 0, charsLongMin.length);
            } else {
                size = (i < 0) ? stringSize(-i) + 1 : stringSize(i);
                size = wp + size;
                array.expandCapacity(size);
                getChars(i, size, array.getChars());
                array.seekp(size);
            }
        } else if (radix == 16) {
            toUnsignedCharArray(array, i, 4, width);
        } else {
            char[] buf = array.expandCapacity(wp + 65);
            boolean negative = (i < 0);
            int charPos = wp + 64;

            if (!negative) {
                i = -i;
            }

            while (i <= -radix) {
                buf[charPos--] = digits[(int) (-(i % radix))];
                i = i / radix;
            }
            buf[charPos] = digits[(int) (-i)];

            if (negative) {
                buf[--charPos] = '-';
            }

            int len = wp + 65 - charPos;
            System.arraycopy(buf, charPos, buf, wp, len);
            array.seekp(wp + len);
        }
    }

    /**
     * Convert the integer to an unsigned number.
     */
    public static int toUnsignedCharArray(CharArray array, long i, int shift,
            int width) {
        int wp = array.size();
        char[] buf = array.expandCapacity(wp + 64);

        int charPos = wp + 64;
        int radix = 1 << shift;
        int mask = radix - 1;
        do {
            buf[--charPos] = digits[(int) (i & mask)];
            i >>>= shift;
        } while (width-- > 1);

        int len = wp + 64 - charPos;
        System.arraycopy(buf, charPos, buf, wp, len);

        int size = wp + len;
        array.seekp(size);
        return size;
    }

    public static final long MULTMIN_RADIX_TEN = Long.MIN_VALUE / 10;
    public static final long N_MULTMAX_RADIX_TEN = -Long.MAX_VALUE / 10;

    public static Number parseNumber(char[] buf, int start, int len,
            boolean isFloat, int radix) throws NumberFormatException {
        if (isFloat) {
            BigDecimal d = new BigDecimal(buf, start, len);
            if (d.precision() < 8) {
                return d.floatValue();
            } else {
                return d.doubleValue();
            }
        } else {
            if (radix == 10) {
                if ((buf[start] == '-' && len <= 10)
                        || (buf[start] != '-' && len <= 9)) {
                    return parseInt(buf, start, len, 10);
                } else if ((buf[start] == '-' && len <= 19)
                        || (buf[start] != '-' && len <= 18)) {
                    return parseLong(buf, start, len, 10);
                } else {
                    return new BigInteger(new String(buf, start, len), 10);
                }
            } else if (radix == 16) {
                if (len <= 8) {
                    return parseInt(buf, start, len, 16);
                } else if (len <= 16) {
                    return parseLong(buf, start, len, 16);
                } else {
                    return new BigInteger(new String(buf, start, len), 16);
                }
            } else {
                return parseLong(buf, start, len, radix);
            }
        }
    }

    public static int parseInt(char[] buf, int start, int len, int radix)
            throws NumberFormatException {

        int result = 0;
        boolean negative = false;
        int i = start, max = start + len;
        int limit;
        int multmin;
        int digit;

        if (len > 0) {
            if (buf[start] == '-') {
                negative = true;
                limit = Integer.MIN_VALUE;
                i++;
            } else {
                limit = -Integer.MAX_VALUE;
            }

            multmin = limit / radix;

            if (i < max) {
                digit = masks[buf[i++]];
                result -= digit;
            }
            while (i < max) {
                // Accumulating negatively avoids surprises near MAX_VALUE
                digit = masks[buf[i++]];

                if (result < multmin) {
                    throw new NumberFormatException(new String(buf, start, len));
                }

                result *= radix;

                if (result < limit + digit) {
                    throw new NumberFormatException(new String(buf, start, len));
                }

                result -= digit;
            }
        } else {
            throw new NumberFormatException(new String(buf, start, len));
        }
        if (negative) {
            if (i > start + 1) {
                return result;
            } else { /* Only got "-" */
                throw new NumberFormatException(new String(buf, start, len));
            }
        } else {
            return -result;
        }
    }

    public static long parseLong(char[] buf, int start, int len, int radix)
            throws NumberFormatException {
        long result = 0;
        boolean negative = false;
        int i = start, max = start + len;
        long limit;
        long multmin;
        int digit;

        if (len > 0) {
            if (buf[start] == '-') {
                negative = true;
                limit = Long.MIN_VALUE;
                i++;
            } else {
                limit = -Long.MAX_VALUE;
            }

            if (radix == 10) {
                multmin = negative ? MULTMIN_RADIX_TEN : N_MULTMAX_RADIX_TEN;
            } else {
                multmin = limit / radix;
            }

            if (i < max) {
                digit = masks[buf[i++]];
                result -= digit;
            }

            while (i < max) {
                // Accumulating negatively avoids surprises near MAX_VALUE
                digit = masks[buf[i++]];

                if (result < multmin) {
                    throw new NumberFormatException(new String(buf, start, len));
                }

                result *= radix;

                if (result < limit + digit) {
                    throw new NumberFormatException(new String(buf, start, len));
                }

                result -= digit;
            }
        } else {
            throw new NumberFormatException(new String(buf, start, len));
        }

        if (negative) {
            if (i > start + 1) {
                return result;
            } else { /* Only got "-" */
                throw new NumberFormatException(new String(buf, start, len));
            }
        } else {
            return -result;
        }
    }

}
