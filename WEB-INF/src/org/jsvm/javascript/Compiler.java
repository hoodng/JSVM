/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * File: Compiler.java
 * Create: Jun 17, 2015
 */
package org.jsvm.javascript;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.io.OutputStream;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Map.Entry;
import java.util.zip.GZIPOutputStream;

import org.jsvm.util.CharArray;
import org.jsvm.util.ConsoleApp;
import org.jsvm.util.FileUtil;
import org.jsvm.util.IDGenerator;
import org.jsvm.util.json.JSON;
import org.jsvm.util.json.JSONArray;
import org.jsvm.util.json.JSONObject;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Decompiler;
import org.mozilla.javascript.NativeFunction;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.UintMap;

/**
 * @author hudong
 *
 */
public class Compiler extends ConsoleApp {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println("J$VM javascript compiler 1.0");

		Map<String, String> arguments = parseArgs(args);

		try {
			new Compiler(arguments).work(arguments);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		System.out.println("OK!");
	}

	private static Logger logger;
	private Context ctx;
	private Scriptable scope;
	private UintMap deoptions;

	/**
	 * 
	 */
	public Compiler(Map<String, String> arguments) {

		boolean verbose = arguments.containsKey("-verbose");
		logger = new Logger(verbose);

		int optLevel = 0;
		try {
			optLevel = Integer.parseInt(arguments.get("-O"), 10);
		} catch (Throwable t) {
		}

		ctx = Context.enter();
		ctx.setOptimizationLevel(optLevel);
		scope = ctx.initStandardObjects();

		deoptions = new UintMap(1);
		deoptions.put(Decompiler.INITIAL_INDENT_PROP, 0);
		deoptions.put(Decompiler.INDENT_GAP_PROP, 0);
		deoptions.put(Decompiler.CASE_GAP_PROP, 0);

	}

	private void work(Map<String, String> arguments) throws Exception {
		boolean gzip = arguments.containsKey("-gzip");
		boolean force = arguments.containsKey("-F");
		
		if (arguments.containsKey("-pack")) {
			String pkgLst = arguments.get("-pack");
			pkgLst = pkgLst != null ? pkgLst : "pkg.lst";
			compack(new File(pkgLst).getCanonicalFile());
		}
		
		if (arguments.containsKey("$0")) {
			List<File> files = buildSrcList(arguments);
			if (files.size() == 1) {
				// Single file
				File jsf = files.get(0).getCanonicalFile();
				if (!jsf.exists()) {
					System.err
							.println("Can not found " + jsf.getAbsolutePath());
					Context.exit();
					return;
				}

				String out = arguments.get("-o");
				File osf = (out instanceof String) ? new File(out)
						: newOutFile(jsf.getParentFile(), jsf, ".jz");
				if (force || !osf.exists()
						|| osf.lastModified() < jsf.lastModified()) {
					compile(jsf, osf, gzip);
				}
			} else {
				for (File jsf : files) {
					if (!jsf.exists()) {
						System.err.println("Can not found "
								+ jsf.getAbsolutePath());
						continue;
					}
					jsf = jsf.getCanonicalFile();
					File osf = newOutFile(jsf.getParentFile(), jsf, ".jz");
					if (force || !osf.exists()
							|| osf.lastModified() < jsf.lastModified()) {
						compile(jsf, osf, gzip);
					}
				}
			}
		} else if (arguments.containsKey("-s")) {
			String src = arguments.get("-s");
			String des = arguments.get("-d");
			if (!(src instanceof String)) {
				System.err.println("Must specified source directory.");
				Context.exit();
				return;
			}

			File srcRoot = new File(src).getCanonicalFile();
			if (!srcRoot.exists()) {
				System.err
						.println("Can not found " + srcRoot.getAbsolutePath());
				Context.exit();
				return;
			}
			File desRoot = (des instanceof String) ? new File(des)
					.getCanonicalFile() : srcRoot;
			if (!desRoot.exists()) {
				desRoot.mkdirs();
			}
			int srcRootLen = (int) srcRoot.getAbsolutePath().length();

			List<File> srcFiles = FileUtil.list(srcRoot, jsFilter, true, null);
			for (File jsf : srcFiles) {
				File osf = newOutFile(new File(desRoot, jsf.getAbsolutePath()
						.substring(srcRootLen)).getParentFile(), jsf, ".jz");
				if (force || !osf.exists()
						|| osf.lastModified() < jsf.lastModified()) {
					compile(jsf, osf, gzip);
				}
			}
		}

		if (arguments.containsKey("-pkg")) {
			String pkg = arguments.get("-pkg");
			File pkgRoot = (pkg != null) ? new File(pkg) : new File(".");
			pkgRoot = pkgRoot.getCanonicalFile();
			buildPackage(pkgRoot, gzip);
		}

		Context.exit();
	}

	private List<File> buildSrcList(Map<String, String> arguments) {
		List<File> list = new ArrayList<File>();
		Iterator<Entry<String, String>> it = arguments.entrySet().iterator();
		while (it.hasNext()) {
			Entry<String, String> item = it.next();
			if (item.getKey().startsWith("$")) {
				list.add(new File(item.getValue()));
			}
		}
		return list;
	}

	private File newOutFile(File parent, File src, String ext) {
		return new File(parent,
				FileUtil.getFileNameWithoutSuffix(src.getName()) + ext);
	}

	private void compile(File in, File out, boolean gzip) {
		String fileName = in.getAbsolutePath();
		Reader reader = null;
		InputStream script = null;
		try {
			reader = new InputStreamReader(new FileInputStream(in), "UTF-8");
			script = compile0(reader, fileName);
			compress(script, out, gzip);
		} catch (Exception e) {
			System.err.println(fileName);
			e.printStackTrace();
		} finally {
			try {
				script.close();
			} catch (Exception e) {
			}

			try {
				reader.close();
			} catch (Exception e) {
			}
		}
	}

	private InputStream compile0(Reader reader, String fileName) {
		logger.println("Compile: " + fileName);
		InputStream ret = null;
		try {
			Script script = ctx.compileReader(reader, fileName, 0, null);
			String source = ((NativeFunction) script).getEncodedSource();
			source = Decompiler.decompile(source, 2, deoptions);
			source += "\r\n";
			ret = new ByteArrayInputStream(source.getBytes("UTF-8"));
		} catch (Exception e) {
			System.err.println(fileName);
			e.printStackTrace();
		}
		return ret;
	}

	private void compress(InputStream script, File file, boolean gzip) {
		OutputStream os = null;

		try {
			File folder = file.getParentFile();
			if (!folder.exists())
				folder.mkdirs();

			os = new FileOutputStream(file);
			if (gzip) {
				os = new GZIPOutputStream(os);
			}

			logger.println(">>> " + file.getAbsolutePath());
			FileUtil.copy(script, os);

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				os.close();
			} catch (Exception e) {
			}
		}
	}

	private void compack(File pkgLst) throws Exception {
		Properties lock = new Properties();
		File lockFile = new File(".lock");
		if (lockFile.exists()) {
			lock.load(new FileInputStream(lockFile));
		}

		List<Task> tasks = loadPkgLst(pkgLst);
		for (Task task : tasks) {
			String taskId1 = lock.getProperty(task.name);
			if (taskId1 == null || !task.id.equals(taskId1)
					|| !task.desFile.exists()) {
				lock.setProperty(task.name, task.id);
				task.run();
			}
		}

		lockFile.delete();
		lock.store(new FileOutputStream(lockFile), null);
	}

	private List<Task> loadPkgLst(File pkgLst) throws Exception {
		JSONObject jPack = null;
		LineNumberReader reader = null;
		try {
			reader = new LineNumberReader(new InputStreamReader(
					new FileInputStream(pkgLst), "UTF-8"));
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
		} finally {
			try {
				reader.close();
			} catch (Throwable t) {
			}
		}

		JSONArray jtasks = jPack.optJSONArray("list");
		ArrayList<Task> tasks = new ArrayList<Task>(jtasks.length());
		for (int i = 0, jlen = jtasks.length(); i < jlen; i++) {
			String taskName = jtasks.getString(i);
			JSONObject jtask = jPack.optJSONObject(taskName);
			tasks.add(new Task(taskName, jtask));
		}

		return tasks;
	}

	static class Task {
		String name;
		boolean compress = false;
		File srcRoot;
		File desFile;
		List<File> files;
		String id;

		Task(String name, JSONObject json) throws Exception {
			this.name = name;
			compress = json.optBoolean("compress", true);
			srcRoot = new File(json.optString("srcroot", "."))
					.getCanonicalFile();
			desFile = new File(json.optString("despath", name + ".js"))
					.getCanonicalFile();
			if (!desFile.getParentFile().exists()) {
				desFile.getParentFile().mkdirs();
			}
			files = new ArrayList<File>();
			StringBuilder buf = new StringBuilder(json.toString());
			JSONArray ja = json.optJSONArray("files");
			for (int i = 0, len = ja.length(); i < len; i++) {
				File f = new File(srcRoot, ja.optString(i));
				buf.append(f.lastModified());
				files.add(f);
			}
			id = IDGenerator.getUniqueID(buf.toString()).toString();
		}

		void run() {
			logger.println("Pack: " + this.name + " ");
			FileOutputStream ous = null;
			FileInputStream ins = null;
			try {
				ous = new FileOutputStream(desFile);
				for (File file : files) {
					ins = new FileInputStream(file);
					FileUtil.copy(ins, ous);
					ous.write(new byte[] { 0x0d, 0x0a }); // "\r\n
					ins.close();
					ins = null;
				}
			} catch (Exception ex) {

			} finally {
				try {
					ins.close();
				} catch (Exception ex) {
				}
				try {
					ous.close();
				} catch (Exception ex) {
				}
			}
			logger.println(">>> " + desFile.getAbsolutePath());
		}
	}

	private void buildPackage(File root, boolean gzip) throws Exception {
		logger.println("Package: " + root.getAbsolutePath());

		List<File> jzFiles = FileUtil.list(root, jzFilter, true, null);
		JSONObject packJson = new JSONObject();
		int rootLen = root.getAbsolutePath().length();
		for (File jz : jzFiles) {
			String key = jz.getAbsolutePath().substring(rootLen);
			packJson.put(key, jz.lastModified());
		}
		InputStream ins = null;
		try {
			ins = new ByteArrayInputStream(packJson.toString()
					.getBytes("UTF-8"));

			compress(ins, new File(root, "package.jz"), gzip);
		} catch (Exception e) {

		} finally {
			try {
				ins.close();
			} catch (Exception e) {

			}
		}
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
}
