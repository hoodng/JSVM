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
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.RandomAccess;

import org.jsvm.util.CharArray;

/**
 * @author dong.hu@china.jinfonet.com
 */
public class JSONArray implements List, Cloneable, RandomAccess, Serializable {

    private List list;

    public JSONArray() {
        this(new ArrayList());
    }

    public JSONArray(String json) throws JSONException {
        this((List) null);
        try {
            this.list = (JSONArray) JSON.CollParser.parse(new CharArray(json));
        } catch (ParseException e) {
            throw new JSONException(e.getMessage() + " " + e.getErrorOffset());
        }
    }

    public JSONArray(Collection<?> list) {
        this.list = (list instanceof List) ? (List) list : new ArrayList(list);
    }

    public JSONArray(Object[] array) {
        this((List) null);
        for (Object o : array) {
            add(o);
        }
    }

    public String toString() {
        CharArray buf = new CharArray();
        JSON.CollConverter.convert(this, buf);
        return buf.getString();
    }

    public boolean getBoolean(int key) throws JSONException {
        try {
            return JSON.castBoolean(get(key));
        } catch (JSONException e) {
            throw new JSONException("[\"" + key
                                    + "\"] not found or is not a Boolean.", e);
        }
    }

    public int getInt(int key) throws JSONException {
        try {
            return JSON.castInteger(get(key));
        } catch (JSONException e) {
            throw new JSONException("[\"" + key
                                    + "\"] not found or is not a Number.", e);
        }
    }

    public long getLong(int key) throws JSONException {
        try {
            return JSON.castLong(get(key));
        } catch (JSONException e) {
            throw new JSONException("[\"" + key
                                    + "\"] not found or is not a Number.", e);
        }
    }

    public float getFloat(int key) throws JSONException {
        try {
            return JSON.castFloat(get(key));
        } catch (JSONException e) {
            throw new JSONException("[\"" + key
                                    + "\"] not found or is not a Number.", e);
        }
    }

    public double getDouble(int key) throws JSONException {
        try {
            return JSON.castDouble(get(key));
        } catch (JSONException e) {
            throw new JSONException("[\"" + key
                                    + "\"] not found or is not a Number.", e);
        }
    }

    public String getString(int key) {
        return JSON.castString(get(key));
    }

    public JSONObject getJSONObject(int key) throws JSONException {
        try {
            return JSON.castJSONObject(get(key));
        } catch (JSONException e) {
            throw new JSONException("[\"" + key
                                    + "\"] not found or is not a JSONObject.", e);
        }
    }

    public JSONArray getJSONArray(int key) throws JSONException {
        try {
            return JSON.castJSONArray(get(key));
        } catch (JSONException e) {
            throw new JSONException("[\"" + key
                                    + "\"] not found or is not a JSONArray.", e);
        }
    }

    public Object opt(int key) {
        return get(key);
    }

    public boolean optBoolean(int key) {
        return optBoolean(key, false);
    }

    public boolean optBoolean(int key, boolean defaultValue) {
        try {
            return getBoolean(key);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public int optInt(int key) {
        return optInt(key, 0);
    }

    public int optInt(int key, int defaultValue) {
        try {
            return getInt(key);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public long optLong(int key) {
        return optLong(key, 0);
    }

    public long optLong(int key, long defaultValue) {
        try {
            return getLong(key);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public float optFloat(int key) {
        return optFloat(key, 0);
    }

    public float optFloat(int key, float defaultValue) {
        try {
            return getFloat(key);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public double optDouble(int key) {
        return optInt(key, 0);
    }

    public double optDouble(int key, double defaultValue) {
        try {
            return getDouble(key);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public String optString(int key) {
        return optString(key, "");
    }

    public String optString(int key, String defaultValue) {
        String tmp = getString(key);
        return tmp == null ? defaultValue : tmp;
    }

    public JSONObject optJSONObject(int key) {
        Object o = opt(key);
        return o instanceof JSONObject ? (JSONObject) o : null;
    }

    public JSONArray optJSONArray(int key) {
        Object o = opt(key);
        return o instanceof JSONArray ? (JSONArray) o : null;
    }

    public boolean put(Object e) {
        return add(e);
    }

    public int length() {
        return size();
    }

    @Override
    public boolean add(Object e) {
        return list.add(e);
    }

    @Override
    public void add(int index, Object element) {
        list.add(index, element);
    }

    @Override
    public boolean addAll(Collection c) {
        return list.addAll(c);
    }

    @Override
    public boolean addAll(int index, Collection c) {
        return list.addAll(index, c);
    }

    @Override
    public void clear() {
        list.clear();
    }

    @Override
    public boolean contains(Object o) {
        return list.contains(o);
    }

    @Override
    public boolean containsAll(Collection c) {
        return list.containsAll(c);
    }

    @Override
    public Object get(int index) {
        Object o = list.get(index);
        return (o instanceof JSONObject.Null) ? null : o;
    }

    @Override
    public int indexOf(Object o) {
        return list.indexOf(o);
    }

    @Override
    public boolean isEmpty() {
        return list.isEmpty();
    }

    @Override
    public Iterator iterator() {
        return list.iterator();
    }

    @Override
    public int lastIndexOf(Object o) {
        return list.lastIndexOf(o);
    }

    @Override
    public ListIterator listIterator() {
        return list.listIterator();
    }

    @Override
    public ListIterator listIterator(int index) {
        return list.listIterator(index);
    }

    @Override
    public boolean remove(Object o) {
        return list.remove(o);
    }

    @Override
    public Object remove(int index) {
        return list.remove(index);
    }

    @Override
    public boolean removeAll(Collection c) {
        return list.removeAll(c);
    }

    @Override
    public boolean retainAll(Collection c) {
        return list.retainAll(c);
    }

    @Override
    public Object set(int index, Object element) {
        return list.set(index, element);
    }

    @Override
    public int size() {
        return list.size();
    }

    @Override
    public List<Object> subList(int fromIndex, int toIndex) {
        return list.subList(fromIndex, toIndex);
    }

    @Override
    public Object[] toArray() {
        return list.toArray();
    }

    @Override
    public Object[] toArray(Object[] a) {
        return list.toArray(a);
    }

    @Override
    protected Object clone() {
        return new JSONArray(new ArrayList(list));
    }

    private static final long serialVersionUID = -1591081068651327774L;

}
