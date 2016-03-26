/**

 Copyright 2010-2015, The JSVM Project. 
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
 * File: Tools.js
 * Create: 2015/10/14 06:29:42
 * Author: mingfa.pan@china.jinfonet.com
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.util");

js.util.Tools = new function(){
	var Class = js.lang.Class,
	REGX_PATH = /(.*[/|\\])(.*)/;

	this.parseBoolean = function(v, defaultValue) {
		if(v === "true"){
			return true;
		}else if(v === "false"){
			return false;
		}else if(Class.isBoolean(v)){
			return v;
		}else{
			return defaultValue || false;
		}
	};
	
	this.parseNumber = function(v, defaultValue) {
		if(Class.isNumber(v)){
			return v;
		}
		
		if(v == undefined || v == null){
			v = Number.NaN;
		}else{
			v = Number(v);
		}
		
		return !isNaN(v) ? v : defaultValue;
	};

	/**
	 * Return file path, exclude file name
	 */
	this.getFilePath = function(path){
		if (path == null) return path;
		
		var m = path.match(REGX_PATH);
		return m ? m[1] : "";
	};

	/**
	 * check path, end with "/"
	 */
	this.checkPath = function(path){
		if (path == null) return path;
		if(path.lastIndexOf("/") + 1 !== path.length)
			path = path + "/";
		return path;	
	};
	
	/**
	 * Return file name, exclude file path.
	 */
	this.getFileName = function(path){
		if (path == null) return path;

		var m = path.match(REGX_PATH);
		return m ? m[2] : path;	   
	};

	/**
	 * Return file name without suffix
	 */
	this.getFileNameWithoutSuffix = function(path) {
		var file = this.getFileName(path);
		if (file == null) return file;

		var p = file.lastIndexOf(".");
		if (p == -1) return file;

		return file.substring(0, p);
	};

	/**
	 * Return file name's suffix
	 */
	this.getFileSuffix = function(path) {
		if (path == null) return path;

		var p = path.lastIndexOf(".");
		return (p != -1) ? path.substring(p) : "";
	};

}();
