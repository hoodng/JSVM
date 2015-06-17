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
package org.jsvm.util.json;

import java.io.Serializable;
import java.text.ParseException;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import org.jsvm.util.CharArray;

/**
 * @author dong.hu@china.jinfonet.com
 */
public class JSONObject implements Map<String, Object>, Cloneable, Serializable {

    private Map<String, Object> map;

    public interface JSONObjectable {

        Object toJSONObject();
    }

    public static class Null implements Serializable {

        protected Object clone() {
            return this;
        }

        public boolean equals(Object obj) {
            return obj == null || obj == this;
        }

        public String toString() {
            return "null";
        }

        private static final long serialVersionUID = -3829471739369320919L;
    }

    public static final Null NULL = new Null();

    public JSONObject() {
        this(new LinkedHashMap<String, Object>());
    }

    public JSONObject(String json) throws JSONException {
        this((Map<String, Object>) null);
        try {
            this.map = (JSONObject) JSON.MapsParser.parse(new CharArray(json));
        } catch (ParseException e) {
            throw new JSONException(e.getMessage() + " " + e.getErrorOffset());
        }
    }

    public JSONObject(Map<String, Object> map) {
        this.map = map;
    }

    public Iterator<String> keys() {
        return this.keySet().iterator();
    }

    public String toString() {
        CharArray buf = new CharArray();
        JSON.MapsConverter.convert(this, buf);
        return buf.getString();
    }

    public boolean getBoolean(String key) throws JSONException {
        try {
            return JSON.castBoolean(get(key));
        } catch (JSONException e) {
            throw new JSONException("[\"" + key
                                    + "\"] not found or is not a Boolean.", e);
        }
    }

    public int getInt(String key) throws JSONException {
        try {
            return JSON.castInteger(get(key));
        } catch (JSONException e) {
            throw new JSONException("[\"" + key
                                    + "\"] not found or is not a Number.", e);
        }
    }

    public long getLong(String key) throws JSONException {
        try {
            return JSON.castLong(get(key));
        } catch (JSONException e) {
            throw new JSONException("[\"" + key
                                    + "\"] not found or is not a Number.", e);
        }
    }

    public float getFloat(String key) throws JSONException {
        try {
            return JSON.castFloat(get(key));
        } catch (JSONException e) {
            throw new JSONException("[\"" + key
                                    + "\"] not found or is not a Number.", e);
        }
    }

    public double getDouble(String key) throws JSONException {
        try {
            return JSON.castDouble(get(key));
        } catch (JSONException e) {
            throw new JSONException("[\"" + key
                                    + "\"] not found or is not a Number.", e);
        }
    }

    public String getString(String key) {
        return JSON.castString(get(key));
    }

    public JSONObject getJSONObject(String key) throws JSONException {
        try {
            return JSON.castJSONObject(get(key));
        } catch (JSONException e) {
            throw new JSONException("[\"" + key
                                    + "\"] not found or is not a JSONObject.", e);
        }
    }

    public JSONArray getJSONArray(String key) throws JSONException {
        try {
            return JSON.castJSONArray(get(key));
        } catch (JSONException e) {
            throw new JSONException("[\"" + key
                                    + "\"] not found or is not a JSONArray.", e);
        }
    }

    public Object opt(String key) {
        return get(key);
    }

    public boolean optBoolean(String key) {
        return optBoolean(key, false);
    }

    public boolean optBoolean(String key, boolean defaultValue) {
        try {
            return getBoolean(key);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public int optInt(String key) {
        return optInt(key, 0);
    }

    public int optInt(String key, int defaultValue) {
        try {
            return getInt(key);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public long optLong(String key) {
        return optLong(key, 0);
    }

    public long optLong(String key, long defaultValue) {
        try {
            return getLong(key);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public float optFloat(String key) {
        return optFloat(key, 0);
    }

    public float optFloat(String key, float defaultValue) {
        try {
            return getFloat(key);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public double optDouble(String key) {
        return optInt(key, 0);
    }

    public double optDouble(String key, double defaultValue) {
        try {
            return getDouble(key);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public String optString(String key) {
        return optString(key, "");
    }

    public String optString(String key, String defaultValue) {
        String tmp = getString(key);
        return tmp == null ? defaultValue : tmp;

    }

    public JSONObject optJSONObject(String key) {
        Object o = opt(key);
        return o instanceof JSONObject ? (JSONObject) o : null;
    }

    public JSONArray optJSONArray(String key) {
        Object o = opt(key);
        return o instanceof JSONArray ? (JSONArray) o : null;
    }

    public int length() {
        return size();
    }

    @Override
        public void clear() {
        map.clear();
    }

    @Override
        public boolean containsKey(Object key) {
        return map.containsKey(key);
    }

    @Override
        public boolean containsValue(Object value) {
        return map.containsValue(value);
    }

    @Override
        public Set<java.util.Map.Entry<String, Object>> entrySet() {
        return map.entrySet();
    }

    @Override
        public Object get(Object key) {
        Object o = map.get(key);
        return (o instanceof Null) ? null : o;
    }

    @Override
        public boolean isEmpty() {
        return map.isEmpty();
    }

    @Override
        public Set<String> keySet() {
        return map.keySet();
    }

    @Override
        public Object put(String key, Object value) {
        return map.put(key, value);
    }

    @Override
        public void putAll(Map<? extends String, ? extends Object> m) {
        map.putAll(m);
    }

    @Override
        public Object remove(Object key) {
        return map.remove(key);
    }

    @Override
        public int size() {
        return map.size();
    }

    @Override
        public Collection<Object> values() {
        return map.values();
    }

    @Override
        protected Object clone() {
        return new JSONObject(new LinkedHashMap<String, Object>(map));
    }

    private static final long serialVersionUID = 1626861352226414051L;
}
