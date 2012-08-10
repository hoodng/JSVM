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

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.InputStream;
import java.io.LineNumberReader;
import java.util.ArrayList;
import java.util.List;

import org.jsvm.util.CharArray;
import org.jsvm.util.FileUtil;
import org.jsvm.util.IDGenerator;

/**
 * @author dong.hu@china.jinfonet.com
 * 
 */
public final class Packer {

    /**
     * @param args
     *            Package file name
     * @throws Exception
     */
    public static void main(String[] args) throws Exception {
        String packFile = (args.length > 0 && args[0] != null && args[0]
						   .length() > 0) ? args[0] : "pkg.lst";

        LineNumberReader reader = new LineNumberReader(new FileReader(packFile));

        CharArray array = new CharArray(1024);
        int wp = array.tellp();
        int len = 0;
        while ((len = reader.read(array.getChars(), wp, 1024)) != -1) {
            array.seekp(wp + len);
            wp = array.tellp();
            array.expandCapacity(array.size() + 1024);
        }

        JSONObject jPack = (JSONObject) JSON.parse(array);
        JSONArray jtasks = jPack.optJSONArray("list");
        for (int i = 0, jlen = jtasks.length(); i < jlen; i++) {
            String taskName = jtasks.getString(i);
            Task task = new Task(taskName, jPack.optJSONObject(taskName));
            Thread taskTh = new Thread(task);
            taskTh.start();
        }
    }

    static class Task implements Runnable {
        private String name;
        private boolean compress = false;
        private String desPath;
        private String desFile;
        private String srcPath;
        private List<String> srcFiles;

        public Task(String name, JSONObject task) {
            this.name = name;
            this.compress = task.optBoolean("compress", false);
            this.desPath = task.optString("despath");
            this.desFile = task.optString("name");
            this.srcPath = task.optString("srcpath");
            JSONArray ja = task.optJSONArray("files");
            if (ja != null) {
                srcFiles = new ArrayList<String>(ja.length());
                for (int i = 0, len = ja.length(); i < len; i++) {
                    srcFiles.add(ja.optString(i));
                }
            }
        }

        public void run() {
            System.out.println("Pack task " + name + "...");

            FileOutputStream out;
            try {
                out = new FileOutputStream(this.desPath + this.desFile);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
                return;
            }

            for (String file : this.srcFiles) {
                InputStream input = null;
                try {
                    input = new FileInputStream(this.srcPath + file);
					if("js/jsvm.js".equals(file)){
						input = addBuildVersion(input);
					}

                    if (this.compress) {
                        JSMin cmp = new JSMin(input, out);
                        cmp.jsmin();
                    } else {
                        FileUtil.copy(input, out);
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    try {
                        input.close();
                    } catch (Exception e) {
                    }
                }
            }

            try {
                out.close();
            } catch (Exception e) {

            }
        }
    }

	static InputStream addBuildVersion(InputStream in) 
		throws Exception{
		StringBuilder buf = new StringBuilder();
		byte[] bytes = new byte[2048];
		int rb = -1;
		while((rb = in.read(bytes)) != -1){
			buf.append(new String(bytes, 0, rb, "UTF-8"));
		}

		in.close();

		String str = buf.toString();
		str = str.replaceFirst("\\$\\{build\\}", 
							   IDGenerator.getUniqueID().toString());

		return new ByteArrayInputStream(str.getBytes("UTF-8"));
	}
}
