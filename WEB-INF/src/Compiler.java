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

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.GZIPOutputStream;

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
		System.out.println("J$VM compiler 0.9");

		Map<String, String> arguments = parseArgs(args, 0, null, 0,
				new HashMap<String, String>());

		boolean clean = arguments.containsKey("-clean");
		boolean verbose = arguments.containsKey("-verbose");
		boolean gzip = arguments.containsKey("-gzip");

		String src = arguments.containsKey("-s") ? arguments.get("-s")
				: "../src";
		String des = arguments.containsKey("-d") ? arguments.get("-d")
				: "../classes";

		int optLevel = 0;
		try {
			optLevel = Integer.parseInt(arguments.get("-O"), 10);
		} catch (Throwable t) {
		}

		String pkgLst = arguments.get("-pack");
		if (pkgLst == null || pkgLst.trim().isEmpty()) {
			pkgLst = "pkg.lst";
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

		Table table = new Table(srcRoot, desRoot);
		Map<String, Boolean> packClasses = new HashMap<String, Boolean>();
		List<Task> packTasks = makePackTasks(srcRoot, new File(pkgLst), table,
				gzip);
		for (Task task : packTasks) {
			packClasses.putAll(task.getPackClasses());
		}

		// Clean
		if (clean || !(new File(desRoot, "classes.json").exists())) {
			System.out.println("Clean...");
			FileUtil.deleteFile(desRoot);
		}
		
		if (!desRoot.exists()) {
			desRoot.mkdirs();
		}
		
		// Compile
		System.out.println("Compile...");
		JSONObject classJson = new JSONObject();
		Context ctx = Context.enter();
		ctx.setOptimizationLevel(optLevel);
		Scriptable scope = ctx.initStandardObjects();
		for (int i = 0, len = table.size(); i < len; i++) {
			Record rec = table.getRecord(i);
			if (rec.needCompile(packClasses)) {
				rec.script = compile(rec.srcFile, ctx, scope);
				if (rec.needCompress && (rec.script != null)) {
					compress(rec.script, rec.desFile, gzip);
				}
			}
			classJson.put(rec.className, rec.desFile.lastModified());
		}
		Context.exit();

		Writer classesFile = null;
		try {
			classesFile = new OutputStreamWriter(new FileOutputStream(new File(
					desRoot, "classes.json")), "UTF-8");
			classesFile.write(classJson.toString());
		} catch (Throwable t) {
			t.printStackTrace();
		} finally {
			try {
				classesFile.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		// Packing
		while (!packTasks.isEmpty()) {
			Task task = packTasks.remove(0);
			task.run();
		}

	}

	private static Map<String, String> parseArgs(String[] args, int index,
			String key, int count, Map<String, String> ret) {
		if (index == args.length) {
			if (key != null) {
				ret.put(key, "");
			}
			return ret;
		} else {
			String tmp = args[index++];
			if (!tmp.startsWith("-")) {
				if (key == null) {
					key = "$" + count++;
				}
				ret.put(key, tmp);
				key = null;
			} else {
				if (key != null) {
					ret.put(key, "");
				}
				key = tmp;
			}
			return parseArgs(args, index, key, count, ret);
		}
	}

	private static String makeClassName(File file, int rootPathLen) {
		String tmp = file.getAbsolutePath();
		tmp = tmp.substring(rootPathLen + 1, tmp.length() - 3);
		return tmp.replaceAll("[\\\\/]", ".");
	}

	private static String makeFileName(String className, String suffix) {
		String tmp = className.replaceAll("\\.", File.separator);
		return tmp + suffix;
	}

	private static Script compile(File file, Context cx, Scriptable scope) {
		Script script = null;
		Reader reader = null;
		try {
			logger.println("compile: " + file.getAbsolutePath());
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

	private static void compress(Script script, File file, boolean gzip) {
		OutputStream os = null;

		try {
			File folder = file.getParentFile();
			if (!folder.exists())
				folder.mkdirs();

			os = new FileOutputStream(file);
			if (gzip) {
				os = new GZIPOutputStream(os);
			}
			
			logger.println("compress: " + file.getAbsolutePath());
			
			compress0(script, file, os, null);

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				os.close();
			} catch (Exception e) {
			}
		}
	}

	private static void compress0(Script script, File file, OutputStream out1,
			OutputStream out2) throws UnsupportedEncodingException, IOException {
		String source = null;

		if (script != null) {
			String encodedSource = ((NativeFunction) script).getEncodedSource();
			UintMap properties = new UintMap(1);
			properties.put(Decompiler.INITIAL_INDENT_PROP, 0);
			properties.put(Decompiler.INDENT_GAP_PROP, 0);
			properties.put(Decompiler.CASE_GAP_PROP, 0);

			source = Decompiler.decompile(encodedSource, 2, properties);

		} else {
			FileInputStream ins = null;
			try {
				ins = new FileInputStream(file);
				ByteArrayOutputStream ous = new ByteArrayOutputStream();
				FileUtil.copy(ins, ous);
				source = ous.toString("UTF-8");
			} catch (Throwable t) {
				t.printStackTrace();
			} finally {
				try {
					ins.close();
				} catch (Throwable t) {
				}
			}
		}
		
		source += "\r\n";
		
		if (file.getAbsolutePath().endsWith("jsvm.js")) {
			source = source.replaceFirst("\\$\\{build\\}", IDGenerator
					.getUniqueID().toString());
		}

		byte[] data = source.getBytes("UTF-8");
		out1.write(data);
		if (out2 != null) {
			out2.write(data);
		}
	}

	private static List<Task> makePackTasks(File srcRoot, File pkgList,
			Table table, boolean gzip) {
		ArrayList<Task> tasks = new ArrayList<Task>();

		JSONObject jPack = null;
		LineNumberReader reader = null;
		try {
			reader = new LineNumberReader(new InputStreamReader(
					new FileInputStream(pkgList), "UTF-8"));
			CharArray array = new CharArray(1024);
			int wp = array.tellp();
			int len = 0;
			while ((len = reader.read(array.getChars(), wp, 1024)) != -1) {
				array.seekp(wp + len);
				wp = array.tellp();
				array.expandCapacity(array.size() + 1024);
			}
			jPack = (JSONObject) JSON.parse(array);
		} catch (Throwable t) {
			t.printStackTrace();
			return tasks;
		} finally {
			try {
				reader.close();
			} catch (Throwable t) {
			}
		}

		File desRoot = pkgList.getParentFile();
		JSONArray jtasks = jPack.optJSONArray("list");
		for (int i = 0, jlen = jtasks.length(); i < jlen; i++) {
			String taskName = jtasks.getString(i);
			JSONObject jtask = jPack.optJSONObject(taskName);
			tasks.add(new Task(taskName, jtask, srcRoot, desRoot, table, gzip));
		}

		return tasks;
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

	static class Record {
		String className;
		File srcFile;
		File desFile;
		Script script;
		boolean needCompress = false;

		static StringBuilder buf = new StringBuilder();

		public Record(File srcFile, int rootLen) {
			this.srcFile = srcFile;
			this.className = makeClassName(srcFile, rootLen);
		}

		public boolean needCompile(Map<String, Boolean> map) {
			boolean ret = (script == null)
					&& (needCompress || (map.containsKey(className) && map
							.get(className)));

			return ret;
		}
	}

	static class Table {

		List<Record> records;
		Map<String, Integer> indexes;

		public Table(File srcRoot, File desRoot) {
			records = new ArrayList<Record>();
			indexes = new HashMap<String, Integer>();

			List<File> srcFiles = FileUtil.list(srcRoot, jsFilter, true, null);
			int rootLen = srcRoot.getAbsolutePath().length();
			for (File f : srcFiles) {
				Record rec = new Record(f, rootLen);
				rec.desFile = new File(desRoot, makeFileName(rec.className,
						".jz"));
				rec.needCompress = (!rec.desFile.exists() || rec.desFile
						.lastModified() < rec.srcFile.lastModified());
				indexes.put(rec.className, records.size());
				records.add(rec);
			}
		}

		public Record getRecord(String className) {
			int index = indexes.get(className);
			return getRecord(index);
		}

		public Record getRecord(int index) {
			return records.get(index);
		}

		public int size() {
			return records.size();
		}
	}

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
		private File srcRoot;
		private File desRoot;
		private File desFile;
		private LinkedHashMap<String, Boolean> classMap;
		private int srcRootLen;
		private boolean gzip;
		private Table table;

		public Task(String name, JSONObject task, File srcRoot, File desRoot,
				Table table, boolean gzip) {

			this.name = name;
			this.compress = task.optBoolean("compress", false);
			this.srcRoot = srcRoot;
			this.srcRootLen = (int) this.srcRoot.getAbsolutePath().length();
			this.desRoot = new File(desRoot, task.optString("despath"));
			this.desFile = new File(this.desRoot, task.optString("name"));
			this.table = table;
			this.gzip = gzip;

			classMap = new LinkedHashMap<String, Boolean>();
			JSONArray ja = task.optJSONArray("files");
			if (ja != null) {
				for (int i = 0, len = ja.length(); i < len; i++) {
					String className = makeClassName(
							new File(srcRoot, ja.optString(i)), this.srcRootLen);
					classMap.put(className, compress);
				}
			}
		}

		public Map<String, Boolean> getPackClasses() {
			return classMap;
		}

		public void run() {
			System.out.println("Pack " + name + "...");

			FileOutputStream out = null;
			GZIPOutputStream zout = null;

			try {
				out = new FileOutputStream(this.desFile);
				if (gzip) {
					String zipName = this.desFile.getAbsolutePath().replaceAll(
							"\\.js", ".jz");
					zout = new GZIPOutputStream(new FileOutputStream(new File(
							zipName)));
				}
			} catch (Throwable t) {
				t.printStackTrace();
				return;
			}

			Iterator<String> it = classMap.keySet().iterator();
			while (it.hasNext()) {
				String className = it.next();
				Record rec = table.getRecord(className);
				try {
					compress0(this.compress ? rec.script : null, rec.srcFile,
							out, zout);
				} catch (Throwable t) {
					t.printStackTrace();
					break;
				}
			}

			try {
				out.close();
				if (zout != null) {
					zout.close();
				}
			} catch (Throwable t) {

			}
		}
	}

}
