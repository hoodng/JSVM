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
 * File: Highlighter.js
 * Create: 2014/01/20 08:07:00
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * An utility to help the component that with the label in to highlight
 * its text contents.
 */
js.awt.Highlighter = function(){
	var CLASS = js.awt.Highlighter,
	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, String = js.lang.String,
	Math = js.lang.Math, StringBuffer = js.lang.StringBuffer,
	System = J$VM.System, DOM = J$VM.DOM,
	
	SKit = Class.forName("js.swt.SearchKit");
	
	thi$.setKeepNative = function(b){
		this.def.keepNative = (b === true);	 
	};
	
	thi$.isKeepNative = function(){
		return (this.def.keepNative === true);	
	};

	thi$.getContent = function(){
		if(!this.label){
			return null;
		}
		
		if(typeof this.getText === "function"){
			return this.getText();
		}
		
		return "";
	};
	
	/*
	 * If <em>label</em> is created, use the given text as its
	 * display text.
	 */
	var _setText = function(text, encode) {
		if(this.label){
			this.label.innerHTML = (encode === false) 
				? text : String.encodeHtml(text);
		}
	};
	
	/**
	 * @param keyword: {String} The keyword of the <em>RegExp</em> object which is 
	 *		  used to matched.
	 * @param options: {Object} Include global, insensitive and whole word setting.
	 * @param highlightClass: {String} The specified style 
	 *		  className for highlight.
	 * 
	 * @return {Array} All highlighted span elements.
	 */
	thi$.highlight = function (keyword, options, highlightClass) {
		if (!this.label || !keyword || !options){
			return null;
		}
		
		var pattern = SKit.buildRegExp(keyword, options);
		return this.highlightByPattern(pattern, highlightClass);
	};
	
	var _getHighlightElements = function(ids){
		var len = Class.isArray(ids) ? ids.length : 0,
		pele = this.view, uuid = this.uuid(), 
		doms = [], id, ele;
		
		for(var i = 0; i < len; i++){
			id = ids[i];
			
			if(pele.querySelector){
				ele = pele.querySelector("#" + id);
			}else{
				ele = document.getElementById(id);
			}
			
			if(ele){
				ele.uuid = uuid;
				doms.push(ele);
			}
		}
		
		return doms;
	};
	
	/**
	 * Highlight all matches with the specified style class
	 * according to the given regular expression.
	 * 
	 * @param pattern: {RegExp} Regular expression to match.
	 * @param highlightClass: {String} The specified style 
	 *		  className for highlight.
	 * 
	 * @return {Array} All highlighted span elements.
	 */
	thi$.highlightByPattern = function(pattern, highlightClass){
		var text = this.getContent(), styleClass, ids = [],
		newText, hid, tmp;
		if(!text || !(pattern instanceof RegExp)){
			return null;
		}
		
		text = String.encodeHtml(text);
		//System.err.println("Text: " + text);
		
		styleClass = highlightClass;
		if(!Class.isString(styleClass) || styleClass.length == 0){
			styleClass = DOM.combineClassName(this.def.className, "highlight");
		}
		
		newText = text.replace(
			pattern,
			function(m){
				hid = Math.uuid();
				ids.push(hid);
				
				return '<span id=\"' + hid + '\" class=\"' + styleClass + '\">' + m + '</span>';
			}
		);
		
		_setText.call(this, newText, false);
		
		hid = null;
		newText = null;
		
		return _getHighlightElements.call(this, ids);
	};
	
	/**
	 * Highlight all matches according to the given match result.
	 * 
	 * @param matches: {Array} Each element in it is a object maintained the
	 *		  match's start index and its length. Its structure is as follow:
	 *		  [
	 *			{start: m, length: x},
	 *			...
	 *			{start: n, length: x}
	 *		  ]
	 * @param highlightClass: {String} The specified style 
	 *		  className for highlight.
	 * 
	 * @return {Array} All highlighted span elements.
	 */
	thi$.highlightByMatches = function (matches, highlightClass) {
		var mCnt = Class.isArray(matches) ? matches.length : 0,
		text = this.getContent(), styleClass, rpSeg, subStr, 
		aMatches, vernier, hid, ids;
		
		if(mCnt == 0 || !Class.isString(text)){
			return null;
		}
		
		styleClass = highlightClass;
		if(!Class.isString(styleClass) || styleClass.length == 0){
			styleClass = DOM.combineClassName(this.def.className, "highlight");
		}
		
		ids = [];
		vernier = 0;
		rpSeg = new StringBuffer();
		
		for(var i = 0; i < mCnt; i++){
			aMatches = matches[i];
			if(aMatches.start > vernier){
				subStr = text.substring(vernier, aMatches.start);
				subStr = String.encodeHtml(subStr);
				rpSeg.append(subStr);
				
				subStr = text.substr(aMatches.start, aMatches.length);
				vernier = aMatches.start + aMatches.length;
				
			}else if(aMatches.start == vernier){
				subStr = text.substr(aMatches.start, aMatches.length);
				vernier = aMatches.start + aMatches.length;
			}else{
				subStr = null;
			}
			
			if(subStr){
				hid = Math.uuid();
				ids.push(hid);
				
				subStr = String.encodeHtml(subStr);
				subStr = '<span id=\"' + hid + '\" class=\"' + styleClass + '\">' + subStr + '</span>';
				rpSeg.append(subStr);
			}
		}
		
		if(vernier <= text.length){
			subStr = text.substr(vernier);
			subStr = String.encodeHtml(subStr);
			rpSeg.append(subStr);
		}
		
		_setText.call(this, rpSeg.toString(), false);
		rpSeg = null;
		
		return _getHighlightElements.call(this, ids);
	};
	
	thi$.clearHighlight = function(highlightClass) {
		if(!this.label){
			return;
		}
		
		_setText.call(this, this.getContent(), !this.isKeepNative());
	};
};
