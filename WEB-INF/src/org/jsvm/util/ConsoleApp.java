/**
 * Copyright (c) J$VM. 2000-2012, All rights reserved.
 * 
 * File: ConsoleApp.java
 * Create: Jun 17, 2015
 */
package org.jsvm.util;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @author hudong
 *
 */
public class ConsoleApp {

	public static Map<String, String> parseArgs(String[] args) {
		return parseArgs0(args, 0, null, 0, new LinkedHashMap<String, String>());
	}

	private static Map<String, String> parseArgs0(String[] args, int index,
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
			return parseArgs0(args, index, key, count, ret);
		}
	}

	public static class Logger {
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

}
