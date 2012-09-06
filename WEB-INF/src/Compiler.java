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

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

import org.jsvm.util.CharArray;
import org.jsvm.util.FileUtil;
import org.jsvm.util.IDGenerator;
import org.jsvm.util.javascript.JSON;
import org.jsvm.util.javascript.JSONArray;
import org.jsvm.util.javascript.JSONObject;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Decompiler;
import org.mozilla.javascript.NativeFunction;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.UintMap;

public class Compiler {

    static Logger logger;

    public static void main(String[] args) {
	boolean clean = false;
	boolean compile = false;
	boolean pack = false;
	boolean verbose = false;

	String src = ".";
	String des = ".";

	int optLevel = 0;
	String pkgLst = "pkg.lst";

	for (int i = 0, len = args.length; i < len; i++) {
	    String op = args[i];
	    if ("-s".equals(op)) {
		i++;
		src = args[i];
	    } else if ("-d".equals(op)) {
		i++;
		des = args[i];
	    } else if ("-O".equals(op)) {
		compile = true;
		i++;
		optLevel = Integer.parseInt(args[i], 10);
	    } else if ("-clean".equals(op)) {
		clean = true;
	    } else if ("-pack".equals(op)) {
		pack = true;
		i++;
		pkgLst = args[i];
	    } else if ("-verbose".equals(op)) {
		verbose = true;
	    }
	}

	logger = new Logger(verbose);

	File srcRoot = null, desRoot = null;
	try {
	    srcRoot = new File(new File(src).getCanonicalPath());
	    desRoot = new File(new File(des).getCanonicalPath());
	} catch (Exception e) {
	    e.printStackTrace();
	    System.exit(-1);
	}

	if (!desRoot.exists())
	    desRoot.mkdirs();

	if (clean) {
	    System.out.println("Clean...");
	    List<File> list = FileUtil.list(desRoot, jzFilter, true, null);
	    for (File f : list) {
		logger.println(" remove: " + f.getAbsolutePath());
		f.delete();
	    }
	}

	if (compile) {
	    System.out.println("Compile...");
	    compileFiles(srcRoot, desRoot, optLevel);
	}

	if (pack) {
	    try {
		pack(srcRoot, desRoot, pkgLst);
	    } catch (Exception e) {
		e.printStackTrace();
	    }
	}
    }

    private static void compileFiles(File src, File des, int optLevel) {
	List<File> list = FileUtil.list(src, jsFilter, true, null);
	String srcPath = src.getAbsolutePath();
	String desPath = des.getAbsolutePath();
	int srcPathLen = srcPath.length();

	Context cx = Context.enter();
	try {
	    cx.setOptimizationLevel(optLevel);
	    Scriptable scope = cx.initStandardObjects();
	    for (File f : list) {
		String srcFile = f.getAbsolutePath();
		String desFile = desPath + srcFile.substring(srcPathLen);
		desFile = desFile.replaceAll("\\.js", ".jz");

		File zf = new File(desFile);
		if (!zf.exists() || zf.lastModified() < f.lastModified()) {
		    logger.println(" compile: " + srcFile);
		    try {
			Script script = compile0(f, cx, scope);
			if (script != null) {
			    compress(script, zf);
			}
		    } catch (Exception e) {
			e.printStackTrace();
		    }

		}
	    }
	} finally {
	    Context.exit();
	}
    }

    private static Script compile0(File file, Context cx, Scriptable scope) {
	Script script = null;
	Reader reader = null;
	try {
	    reader = new InputStreamReader(new FileInputStream(file), "UTF-8");
	    String srcName = FileUtil.getFileName(file.getAbsolutePath());
	    script = cx.compileReader(reader, srcName, 0, null);
	} catch (Exception e) {
	    System.err.println(file.getAbsolutePath());
	    e.printStackTrace();
	} finally {
	    try {
		reader.close();
	    } catch (Exception e) {
	    }
	}
	return script;
    }

    private static void compress(Script script, File file) {
	Writer writer = null;

	try {
	    File folder = file.getParentFile();
	    if (!folder.exists())
		folder.mkdirs();

	    writer = new OutputStreamWriter(new FileOutputStream(file), "UTF-8");

	    String encodedSource = ((NativeFunction) script).getEncodedSource();
	    UintMap properties = new UintMap(1);
	    properties.put(Decompiler.INITIAL_INDENT_PROP, 0);
	    properties.put(Decompiler.INDENT_GAP_PROP, 0);
	    properties.put(Decompiler.CASE_GAP_PROP, 0);

	    String source = Decompiler.decompile(encodedSource, 2, properties);
	    
	    writer.write(source);
	} catch (Exception e) {
	    e.printStackTrace();
	} finally {
	    try {
		writer.close();
	    } catch (Exception e) {
	    }
	}
    }

    private static void pack(File src, File des, String packFile)
	    throws Exception {
	String dir = FileUtil.getFilePath(packFile);
	LineNumberReader reader = new LineNumberReader(new InputStreamReader(
		new FileInputStream(packFile), "UTF-8"));

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
	    JSONObject jtask = jPack.optJSONObject(taskName);
	    jtask.put("srcpath", new File(dir + jtask.optString("srcpath"))
		    .getCanonicalPath());
	    jtask.put("despath", new File(dir + jtask.optString("despath"))
		    .getCanonicalPath());
	    jtask.put("srcroot", src.getAbsolutePath());
	    jtask.put("jszroot", des.getAbsolutePath());
	    Task task = new Task(taskName, jtask);
	    task.run();
	}
    }

    private static InputStream addBuildVersion(InputStream in)
	    throws IOException {
	StringBuilder sb = new StringBuilder();

	byte[] buf = new byte[2048];
	int rb = -1;

	while ((rb = in.read(buf)) != -1) {
	    try {
		sb.append(new String(buf, 0, rb, "UTF-8"));
	    } catch (UnsupportedEncodingException e) {
		e.printStackTrace();
	    }
	}

	try {
	    in.close();
	} catch (Exception e) {

	}

	String str = sb.toString();

	str = str.replaceFirst("\\$\\{build\\}", IDGenerator.getUniqueID()
		.toString());

	return new ByteArrayInputStream(str.getBytes("UTF-8"));
    }

    static FileFilter jsFilter = new FileFilter() {

	public boolean accept(File pathname) {
	    String ext = "js";
	    return pathname.isDirectory()
		    || ext.equalsIgnoreCase(FileUtil.getFileSuffix(pathname
			    .getAbsolutePath()));
	}
    };

    static FileFilter jzFilter = new FileFilter() {

	public boolean accept(File pathname) {
	    String ext = "jz";
	    return pathname.isDirectory()
		    || ext.equalsIgnoreCase(FileUtil.getFileSuffix(pathname
			    .getAbsolutePath()));
	}
    };

    static class Logger {
	boolean verbose;

	public Logger(boolean verbose) {
	    this.verbose = verbose;
	};

	public void println(String s) {
	    if (verbose) {
		System.out.println(s);
	    }
	};
    };

    static class Task implements Runnable {
	private String name;
	private boolean compress = false;
	private String desPath;
	private String desFile;
	private String srcPath;
	private String srcRoot;
	private String jszRoot;
	private List<String> srcFiles;
	private int srcRootLen;

	public Task(String name, JSONObject task) {
	    this.name = name;
	    this.compress = task.optBoolean("compress", false);
	    this.desPath = task.optString("despath");
	    this.desFile = task.optString("name");
	    this.srcPath = task.optString("srcpath");
	    this.srcRoot = task.optString("srcroot");
	    this.jszRoot = task.optString("jszroot");
	    this.srcRootLen = srcRoot.length();

	    JSONArray ja = task.optJSONArray("files");
	    if (ja != null) {
		srcFiles = new ArrayList<String>(ja.length());
		for (int i = 0, len = ja.length(); i < len; i++) {
		    srcFiles.add(ja.optString(i));
		}
	    }
	}

	public void run() {
	    System.out.println("Pack " + name + "...");

	    FileOutputStream out;
	    try {
		out = new FileOutputStream(new File(this.desPath, this.desFile));
	    } catch (FileNotFoundException e) {
		e.printStackTrace();
		return;
	    }

	    for (String file : this.srcFiles) {
		InputStream input = null;
		String rfile = new File(this.srcPath, file).getAbsolutePath();
		logger.println(" << " + rfile);
		try {
		    if (this.compress) {
			rfile = this.jszRoot + rfile.substring(srcRootLen);
			rfile = rfile.replaceAll("\\.js", ".jz");
		    }

		    input = new FileInputStream(rfile);
		    if ("js/jsvm.js".equals(file)) {
			input = addBuildVersion(input);
		    }

		    FileUtil.copy(input, out);

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

}
