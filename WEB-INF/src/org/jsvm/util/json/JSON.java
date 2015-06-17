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

package org.jsvm.util.javascript;

import java.lang.reflect.Array;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.jsvm.util.CharArray;
import org.jsvm.util.Converter;
import org.jsvm.util.Parser;
import org.jsvm.util.StringUtil;
import org.jsvm.util.SymbolTable;
import org.jsvm.util.javascript.JSONObject.JSONObjectable;
import org.jsvm.util.javascript.JSONObject.Null;

/**
 *
 */
public final class JSON {

    private static final class ConverterMap {

        static final int DEFAULT_TABLE_SIZE = 1024;

        private final Entry[] table;

        private final int mask;

        public ConverterMap() {
            table = new Entry[DEFAULT_TABLE_SIZE];
            mask = table.length - 1;
        }

        public final Converter get(Class<?> clazz) {
            final int hash = System.identityHashCode(clazz);
            final int bucket = hash & mask;

            for (Entry entry = table[bucket]; entry != null; entry = entry.next) {
                if (clazz == entry.clazz) {
                    return entry.converter;
                }
            }

            return null;
        }

        public final boolean put(Class<?> clazz, Converter converter) {
            final int hash = System.identityHashCode(clazz);
            final int bucket = hash & mask;

            for (Entry entry = table[bucket]; entry != null; entry = entry.next) {
                if (clazz == entry.clazz) {
                    return true;
                }
            }

            Entry entry = new Entry(clazz, converter, table[bucket]);
            table[bucket] = entry;

            return false;
        }

        static final class Entry {
            final Class<?> clazz;
            final Converter converter;
            final Entry next;

            Entry(Class<?> clazz, Converter converter, Entry next) {
                this.clazz = clazz;
                this.converter = converter;
                this.next = next;
            }
        }
    }

    private static final SymbolTable symbolTable;
    private static final ConverterMap converts;

    public static final Converter getConverter(Class<?> clazz) {

        Converter o = converts.get(clazz);

        if (o == null) {
            if (Map.class.isAssignableFrom(clazz)) {
                converts.put(clazz, MapsConverter);
            } else if (Collection.class.isAssignableFrom(clazz)) {
                converts.put(clazz, CollConverter);
            } else if (JSONObjectable.class.isAssignableFrom(clazz)) {
                converts.put(clazz, JsonConverter);
            } else if (clazz.isArray()) {
                converts.put(clazz, ArryConverter);
            } else {
                converts.put(clazz, ObjsConverter);
            }
            o = converts.get(clazz);
        }

        return o;
    }

    public static final Converter getConverterBy(Object obj) {
        if (obj == null || obj instanceof Null)
            return NullConverter;

        return getConverter(obj.getClass());
    }

    public static final Converter NullConverter = new Converter() {
            public final void convert(Object o, CharArray array) {
                array.put(StringUtil.charsNull, 0, 4);
            }
        };

    public static final Converter BoolConverter = new Converter() {
            public final void convert(Object o, CharArray array) {
                if ((Boolean) o) {
                    array.put(StringUtil.charsTrue, 0, 4);
                } else {
                    array.put(StringUtil.charsFalse, 0, 5);
                }
            }
        };

    public static final Converter CharConverter = new Converter() {
            public final void convert(Object o, CharArray array) {
                array.put((Character) o);
            }
        };

    public static final Converter IntrConverter = new Converter() {
            public void convert(Object o, CharArray array) {
                StringUtil.toCharArray(array, (Integer) o, 10);
            }
        };

    public static final Converter LongConverter = new Converter() {
            public final void convert(Object o, CharArray array) {
                StringUtil.toCharArray(array, (Long) o, 10);
            }
        };

    public static final Converter DoubConverter = new Converter() {
            public final void convert(Object o, CharArray array) {
                Double d = (Double) o;
                if (d.isNaN() || d.isInfinite()) {
                    array.put(StringUtil.charsNull, 0, 4);
                } else {
                    String s = d.toString();
                    int len = s.length();
                    int wp = array.tellp();
                    int size = wp + len;
                    s.getChars(0, len, array.expandCapacity(size), wp);
                    array.seekp(size);
                }
            }
        };

    public static final Converter FlotConverter = new Converter() {
            public final void convert(Object o, CharArray array) {
                Float d = (Float) o;
                if (d.isNaN() || d.isInfinite()) {
                    array.put(StringUtil.charsNull, 0, 4);
                } else {
                    String s = d.toString();
                    int len = s.length();
                    int wp = array.tellp();
                    int size = wp + len;
                    s.getChars(0, len, array.expandCapacity(size), wp);
                    array.seekp(size);
                }
            }
        };

    public static final Converter MapsConverter = new Converter() {
            public final void convert(Object o, CharArray array) {

                Class<?> preClass = null;
                Converter strConverter = StrnConverter;
                Converter preConverter = null;
                SymbolTable smbT = symbolTable;

                array.put('{');

                Map<?, ?> map = (Map<?, ?>) o;

                for (Map.Entry<?, ?> entry : map.entrySet()) {

                    strConverter.convert(smbT.addSymbol(entry.getKey().toString()),
                                         array);

                    array.put(':');

                    Object obj = entry.getValue();
                    if (obj != null && !(obj instanceof JSONObject.Null)) {
                        Class<?> clazz = obj.getClass();
                        if (clazz != preClass) {
                            preClass = clazz;
                            preConverter = getConverter(clazz);
                        }
                        preConverter.convert(obj, array);
                    } else {
                        array.put(StringUtil.charsNull, 0, 4);
                    }

                    array.put(',');
                }

                if (!map.isEmpty())
                    array.backp();

                array.put('}');
            }
        };

    public static final Converter CollConverter = new Converter() {
            public final void convert(Object o, CharArray array) {

                Class<?> preClass = null;
                Converter preConverter = null;

                array.put('[');

                Collection<?> col = (Collection<?>) o;
                for (Object obj : col) {
                    if (obj != null && !(obj instanceof JSONObject.Null)) {
                        Class<?> clazz = obj.getClass();
                        if (clazz != preClass) {
                            preClass = clazz;
                            preConverter = getConverter(clazz);
                        }
                        preConverter.convert(obj, array);
                    } else {
                        array.put(StringUtil.charsNull, 0, 4);
                    }

                    array.put(',');
                }

                if (!col.isEmpty())
                    array.backp();

                array.put(']');
            }
        };

    public static final Converter ArryConverter = new Converter() {
            public final void convert(Object o, CharArray array) {

                Converter preConverter = getConverter(o.getClass()
                                                      .getComponentType());

                array.put('[');

                int len = Array.getLength(o);
                for (int i = 0; i < len; i++) {
                    Object obj = Array.get(o, i);
                    preConverter.convert(obj, array);
                    array.put(',');
                }

                if (len > 0)
                    array.backp();

                array.put(']');
            }
        };

    public static final Converter JsonConverter = new Converter() {
            public final void convert(Object o, CharArray array) {
                Object obj = ((JSONObjectable) o).toJSONObject();

                if (obj instanceof JSONObject) {
                    MapsConverter.convert((JSONObject) obj, array);
                } else if (obj instanceof JSONArray) {
                    CollConverter.convert((JSONArray) obj, array);
                } else {
                    getConverterBy(obj).convert(obj, array);
                }
            }
        };

    public static final Converter ObjsConverter = new Converter() {
            public final void convert(Object o, CharArray array) {
                StrnConverter.convert(o.toString(), array);
            }
        };

    public static final Converter StrnConverter = new Converter() {
            public final void convert(Object o, CharArray array) {
                int[] json_encodes = StringUtil.json_encodes;

                String s = (String) o;
                int len = s.length();

                array.expandCapacity(array.size() + (len << 1) + 2);

                int c, d;

                array.put('"');
                for (int i = 0; i < len; i++) {

                    c = s.charAt(i);

                    d = (c < 256) ? json_encodes[c]
                        : (c >= '\u2000' && c < '\u2100') ? 'u' : -1;

                if (d < 0) {
                    array.put((char) c);
                } else {
                    array.put('\\');
                    array.put((char) d);
                    if (d == 'u') {
                        StringUtil.toCharArray(array, c, 16, 4);
                    }
                }
            }
            array.put('"');

        }
    };

    static {
        symbolTable = new SymbolTable();
        converts = new ConverterMap();

        converts.put(Boolean.class, BoolConverter);
        converts.put(Character.class, CharConverter);
        converts.put(String.class, StrnConverter);
        converts.put(Object.class, ObjsConverter);
        converts.put(Byte.class, IntrConverter);
        converts.put(Short.class, IntrConverter);
        converts.put(Integer.class, IntrConverter);
        converts.put(Long.class, LongConverter);
        converts.put(Float.class, FlotConverter);
        converts.put(Double.class, DoubConverter);
        converts.put(JSONObject.class, MapsConverter);
        converts.put(HashMap.class, MapsConverter);
        converts.put(LinkedHashMap.class, MapsConverter);
        converts.put(Properties.class, MapsConverter);
        converts.put(JSONArray.class, CollConverter);
        converts.put(ArrayList.class, CollConverter);
        converts.put(LinkedList.class, CollConverter);
        converts.put(int[].class, ArryConverter);
        converts.put(long[].class, ArryConverter);
        converts.put(float[].class, ArryConverter);
        converts.put(double[].class, ArryConverter);
        converts.put(String[].class, ArryConverter);
        converts.put(Object[].class, ArryConverter);
    }

    private static final Parser[] parsers = new Parser[128];

    public static final Parser MapsParser = new Parser() {
        public final Object parse(CharArray array) throws ParseException {
            array.skip();
            if ('{' != array.get())
                throw new ParseException("Can not found '{' at ",
                        array.tellg() - 1);

            Parser strParser = StrnParser;
            SymbolTable smbT = symbolTable;

            Map<String, Object> map = new JSONObject();

            for (;;) {
                array.skip();

                CharArray keyChars;

                if ('}' == array.get()) {
                    return map;
                } else {
                    keyChars = (CharArray) strParser.parse(array.backg());
                }

                array.skip();
                if (':' != array.get())
                    throw new ParseException("Can not found ':' at ", (array
                            .tellg() - 1));

                array.skip();
                Parser parser = parsers[array.peek()];
                if (parser == null)
                    throw new ParseException("Unexcept character "
                            + array.peek(array.tellg() - 1), array.tellg() - 1);

                Object obj = parser.parse(array);
                if (obj instanceof CharArray) {
                    obj = ((CharArray) obj).getString();
                }
                map
                        .put(smbT.addSymbol(keyChars.getChars(), 0, keyChars
                                .size()), obj);

                array.skip();
                switch (array.get()) {
                case ',':
                    continue;
                case '}':
                    return map;
                default:
                    throw new ParseException("Can not found ',' or '}' at ",
                            array.tellg() - 1);
                }
            }// For
        }
    };

    public static final Parser CollParser = new Parser() {
        public final Object parse(CharArray array) throws ParseException {
            array.skip();
            if ('[' != array.get())
                throw new ParseException("Can not found '[' at ",
                        array.tellg() - 1);

            List<Object> col = new JSONArray();

            for (;;) {
                array.skip();
                int c = array.peek();
                if (']' == c) {
                    array.seekg(array.tellg() + 1);
                    return col;
                }

                Parser parser = parsers[c];
                if (parser == null)
                    throw new ParseException("Unexcept character "
                            + array.peek(array.tellg() - 1), array.tellg() - 1);

                Object obj = parser.parse(array);
                if (obj instanceof CharArray) {
                    obj = ((CharArray) obj).getString();
                }
                col.add(obj);

                array.skip();
                switch (array.get()) {
                case ',':
                    continue;
                case ']':
                    return col;
                default:
                    throw new ParseException("Can not found ',' or ']' at ",
                            array.tellg() - 1);
                }
            }// For
        }
    };

    public static final Parser StrnParser = new Parser() {
        public final Object parse(CharArray array) throws ParseException {
            int[] json_decodes = StringUtil.json_decodes;
            int[] masks = StringUtil.masks;

            boolean hasQuote = true;
            int quote = array.get();
            if ('"' != quote && '\'' != quote) {
                hasQuote = false;
            }

            int b, c = 0, a = hasQuote ? array.get() : quote;

            CharArray sbuf = new CharArray();
            for (;;) {
                b = c;
                c = a;
                a = array.get();
                if (a == -1)
                    throw new ParseException("Unexcept EOF at ",
                            array.tellg() - 1);

                if ((hasQuote && c == quote && b != '\\')
                        || (!hasQuote && (':' == c || 0x0080 == masks[c]))) {

                    array.seekg(array.tellg() - (hasQuote ? 1 : 2));

                    return sbuf;
                } else {
                    int es = (c == '\\' && a < 256) ? json_decodes[a] : -1;
                    switch (es) {
                    case -1:
                        sbuf.put((char) c);
                        break;
                    case -2:
                        // Decode /uABCD
                        if (array.tellg() + 3 >= array.size())
                            throw new ParseException("Unexcept EOF at ", array
                                    .tellg() + 3);

                        es = StringUtil.parseInt(array.getChars(), array
                                .tellg(), 4, 16);
                        sbuf.put((char) es);
                        array.seekg(array.tellg() + 3);

                        c = array.get();
                        a = array.get();

                        break;
                    default:
                        // Decode
                        sbuf.put((char) es);
                        c = a == '\\' ? 0 : a;
                        a = array.get();
                    }
                }// end if
            }// for
        }
    };

    public static final Parser BoolParser = new Parser() {
        public final Object parse(CharArray array) throws ParseException {
            switch (array.get()) {
            case 't':
                if ('r' == array.get() && 'u' == array.get()
                        && 'e' == array.get()) {

                    return Boolean.TRUE;
                }

                throw new ParseException(
                        "Unexcept character for parsing 'true' at ", array
                                .tellg() - 1);

            case 'f':
                if ('a' == array.get() && 'l' == array.get()
                        && 's' == array.get() && 'e' == array.get()) {

                    return Boolean.FALSE;
                }

                throw new ParseException(
                        "Unexcept character for parsing 'false' at ", array
                                .tellg() - 1);

            case 'n':
                if ('u' == array.get() && 'l' == array.get()
                        && 'l' == array.get()) {

                    return JSONObject.NULL;
                }

                throw new ParseException(
                        "Unexcept character for parsing 'null' at ", array
                                .tellg() - 1);
            default:
                throw new ParseException(
                        "Unexcept character for parsing boolean or null at ",
                        array.tellg() - 1);
            }
        }
    };

    public static final Parser DigtParser = new Parser() {
        public final Object parse(CharArray array) throws ParseException {
            int sp = array.tellg(), c, m;
            boolean isHex = false;
            boolean isFlt = false;

            for (;;) {
                c = array.get();

                if (c == -1)
                    throw new ParseException(
                            "Unexcept character for parsing number at ", array
                                    .tellg() - 1);

                if (c > 128)
                    throw new ParseException(
                            "Unexcept character for parsing number at ", array
                                    .tellg() - 1);

                if ((m = StringUtil.masks[c]) >= 0x0080) {
                    array.seekg(array.tellg() - 1);
                    break;
                } else {
                    isHex |= (m == 0x0010);
                    isFlt |= (m == 0x0020);
                }
            }

            int cn = array.tellg() - sp;
            try {
                if (isHex) {
                    return StringUtil.parseNumber(array.getChars(), sp + 2,
                            cn - 2, false, 16);
                } else if (isFlt) {
                    return StringUtil.parseNumber(array.getChars(), sp, cn,
                            true, 10);
                }

                return StringUtil.parseNumber(array.getChars(), sp, cn, false,
                        10);

            } catch (NumberFormatException e) {
                throw new ParseException("Can not parse number string "
                        + new String(array.getChars(), sp, cn), sp);
            }
        }
    };

    static {
        for (int i = 0; i < 128; i++) {
            switch (i) {
            case '{':
                parsers[i] = MapsParser;
                break;
            case '[':
                parsers[i] = CollParser;
                break;
            case '"':
            case '\'':
                parsers[i] = StrnParser;
                break;
            case 't':
            case 'f':
            case 'n':
                parsers[i] = BoolParser;
                break;
            case '-':
            case '+': // non-standard
            case '.': // non-standard
                parsers[i] = DigtParser;
                break;
            default:
                if (i >= '0' && i <= '9') {
                    parsers[i] = DigtParser;
                }
            }
        }
    }

    public static final Object parse(String s) throws JSONException {
        if (s == null)
            return null;

        return parse(new CharArray(s));

    }

    public static final Object parse(CharArray array) throws JSONException {
        array.skip();
        int c = array.peek();
        try {
            switch (c) {
            case '{':
                return new JSONObject((JSONObject) MapsParser.parse(array));
            case '[':
                return new JSONArray((JSONArray) CollParser.parse(array));
            default:
                Parser parser = parsers[c];
                if (parser == null)
                    throw new ParseException("Unexcept character "
                            + array.peek(array.tellg() - 1), array.tellg() - 1);

                Object obj = parser.parse(array);
                return obj instanceof CharArray ? ((CharArray) obj).getString()
                        : obj;

            }
        } catch (ParseException e) {
            throw new JSONException(e.getMessage() + " " + e.getErrorOffset());
        }

    }

    public static final boolean castBoolean(Object o) throws JSONException {
        if (o instanceof Boolean) {
            return ((Boolean) o).booleanValue();
        } else if (o instanceof String) {
            return Boolean.parseBoolean((String) o);
        }

        throw new JSONException(o == null ? "null" : o.getClass().toString());
    }

    public static final int castInteger(Object o) throws JSONException {
        return o instanceof Number ? ((Number) o).intValue()
                : (int) castDouble(o);
    }

    public static final long castLong(Object o) throws JSONException {
        return o instanceof Number ? ((Number) o).longValue()
                : (long) castDouble(o);
    }

    public static final float castFloat(Object o) throws JSONException {
        try {
            return o instanceof Number ? ((Number) o).floatValue() : Double
                    .valueOf(o.toString()).floatValue();
        } catch (Exception e) {
            throw new JSONException(o == null ? "null" : o.getClass()
                    .toString());
        }
    }

    public static final double castDouble(Object o) throws JSONException {
        try {
            return o instanceof Number ? ((Number) o).doubleValue() : Double
                    .valueOf(o.toString()).doubleValue();
        } catch (Exception e) {
            throw new JSONException(o == null ? "null" : o.getClass()
                    .toString());
        }
    }

    public static final String castString(Object o) {
        return o == null ? null : o.toString();
    }

    public static final JSONObject castJSONObject(Object o)
            throws JSONException {
        if (o instanceof JSONObject) {
            return (JSONObject) o;
        } else if (o instanceof Map) {
            return new JSONObject((Map) o);
        }

        throw new JSONException(o == null ? "null" : o.getClass().toString());
    }

    public static final JSONArray castJSONArray(Object o) throws JSONException {
        if (o instanceof JSONArray) {
            return (JSONArray) o;
        } else if (o instanceof List) {
            return new JSONArray((List) o);
        } else if (o != null && o.getClass().isArray()) {
            return new JSONArray((Object[]) o);
        }

        throw new JSONException(o == null ? "null" : o.getClass().toString());
    }
}
