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

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.FileFilter;
import java.util.List;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author dong.hu@china.jinfonet.com
 * 
 */
public final class FileUtil {
	/** For the path "C:\path1\path2\file.ext" or "/path1/path2/file.ext" */
	public static Pattern REGX_PATH = Pattern.compile("(.*[/|\\\\])(.*)");

	/** For the name "file.ext" */
	public static Pattern REGX_FILE = Pattern.compile("(.*)\\.(.*)");

	/**
	 * Return file path, exclude file name
	 * 
	 * @param file
	 *            , could be "C:\\path\\file.txt" or "/path/file.txt"
	 * @return
	 * @see #getFilePath(String)
	 */
	public static String getFilePath(final String path) {
		if (path == null)
			return path;

		Matcher m = REGX_PATH.matcher(path);

		return m.matches() ? m.group(1) : "";
	}

	/**
	 * Return file name, exclude file path.
	 * 
	 * @param path
	 * @return
	 * @see #getFilePath(String)
	 */
	public static String getFileName(final String path) {
		if (path == null)
			return path;

		Matcher m = REGX_PATH.matcher(path);

		return m.matches() ? m.group(2) : path;

	}

	/**
	 * Return file name without suffix
	 * 
	 * @param path
	 * @param patterns
	 * @return
	 */
	public static String getFileNameWithoutSuffix(final String path,
												  Pattern... patterns) {

		String file = getFileName(path);

		if (file == null)
			return file;

		Pattern P = patterns.length > 0 ? patterns[0] : REGX_FILE;
		Matcher m = P.matcher(file);
		if (m.matches()) {
			return m.group(1);
		} else if (P.equals(REGX_FILE)) {
			return file;
		} else {
			return getFileNameWithoutSuffix(path);
		}
	}

	/**
	 * Return file name's suffix
	 * 
	 * @param path
	 * @param patterns
	 * @return
	 */
	public static String getFileSuffix(final String path, Pattern... patterns) {
		String file = getFileName(path);

		if (file == null)
			return file;

		Pattern P = patterns.length > 0 ? patterns[0] : REGX_FILE;
		Matcher m = P.matcher(file);
		if (m.matches()) {
			return m.group(2);
		} else if (P.equals(REGX_FILE)) {
			return "";
		} else {
			return getFileSuffix(path);
		}
	}
	
	/**
	 * List all files in folder dir which accept with the filter.
     *
	 */
	public static List<File> list(File dir, FileFilter filter, 
									   boolean recursion, List<File> list){
		if(list == null){
			list = new ArrayList<File>();
		}

		File[] files = dir.listFiles(filter);
		for(File file : files){
			if(!file.isDirectory()){
				list.add(file);
			}else if(recursion){
				list(file, filter, recursion, list);
			}
		}

		return list;
	}

	/**
	 * Copy src file to dest file
	 * 
	 * @param src
	 * @param dest
	 * @return
	 * @see #copy(File, File)
	 */
	public static long copy(String src, String dest) throws IOException {
		return copy(new File(src), new File(dest));
	}

	/**
	 * Copy src file to dest file
	 * 
	 * @param src
	 * @param dest
	 * @return
	 * @throws IOException
	 * @see #copyFile(String, String)
	 */
	public static long copy(File src, File dest) throws IOException {
		InputStream in = new FileInputStream(src);
		OutputStream out = new FileOutputStream(dest);

		long len = 0;
		try {
			len = copy(in, out);
		} catch (IOException e) {
			throw e;
		} finally {
			try {
				in.close();
			} catch (Exception e) {
			}

			try {
				out.close();
			} catch (Exception e) {
			}
		}

		return len;
	}

	/**
	 * Copy file from <code>InputStream</code> to <code>OutputStream</code>
	 * 
	 * @param ins
	 * @param ous
	 * @return
	 * @throws IOException
	 */
	public static long copy(InputStream ins, OutputStream ous)
		throws IOException {
		long ret = 0;
		byte[] buf = new byte[2048];
		int rb = -1;
		while ((rb = ins.read(buf)) != -1) {
			ous.write(buf, 0, rb);
			ret += rb;
		}
		ous.flush();
		return ret;
	}
	
    /**
     * Delete a <code>File</code>, if the <code>File</code> is a file then
     * delete the file, if the <code>File</code> is a directory then delete the
     * directory.
     * 
     * @param file
     *            <code>File</code>
     * @see java.io.File
     * @see #deletePath(String)
     */
    public static void deleteFile(File file) {
        if (!file.exists())
            return;

        if (file.isFile()) {
            file.delete();
        } else {
            // dir
            File[] files = file.listFiles();
            int len = files.length;
            for (int i = 0; i < len; i++) {
                deleteFile(files[i]);
            }
            file.delete();
        }

    }

}
