/**

 Copyright 2010-2013, The JSVM Project. 
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
 * File: SearchKit.js
 * Create: 2011-09-30
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

/**
 * <em>SearchKit</em> is an utility class for text searching.
 */

js.swt.SearchKit = function(){
};

/**
 * An useful method to help us build the regular expression with the
 * given <em>keyword</em> and match <em>mode</em>.
 */
js.swt.SearchKit.buildRegExp = function(keyword, mode){
	if(!keyword || keyword.length == 0)
		return null;
	
	// Escape regular expression's meta-characters.
	//J$VM.System.out.println("Before escaping: " + keyword);
	keyword = (js.lang.Class.forName("js.lang.String")).escapeRegExp(keyword);
	//J$VM.System.out.println("After escaping: " + keyword);

	// var unescaped = (js.lang.Class.forName("js.lang.String")).unescapeRegExp(keyword);
	// J$VM.System.out.println("Unescaped: " + unescaped);
	
	if(typeof mode !== "object"){
		mode = {
			global: true,
			insensitive: true,
			wholeword: false
		};
	}
	
	//"wholeword" search mode need wait for <Enter> key is pressed
	if(mode["wholdword"] === true){
		keyword = "\\b" + keyword + "\\b";
	}
	
	//global search mode
	var reopts = "";
	if(mode["global"] !== false){
		reopts += "g";
	}
	
	//case insensitive mode
	if(mode["insensitive"] === true){
		reopts += "i";
	}
	
	var regExp = new RegExp(keyword, reopts);
	return regExp;
};

/**
 * Search and return all text matches in a text collection by the
 * given <em>pattern</em>.
 *
 * @param textSet: a string collection.
 * @param pattern: a <em>RegExp</em> object. If it is not a valid RegExp
 *				   object, an error will be thrown.
 *	
 * @return an object: {
 *	   pattern: a <em>RegExp</em> object which is the current matched 
 *				regular expression,
 *	   matches: a <em>js.util.HashMap</em> object. In it, the key is 
 *				the <em>index</em> of a text with matched string in the 
 *				<em>textSet</em>. Each <em>value</em> is an array of all 
 *				matches' start index and length in the text indicated by 
 *				the <em>key</em>. 
 *	  }
 *	  
 *	  Its structure is as follow:
 *	  {
 *		  pattern: {RegExp},
 *		  matches: {
 *			 0 : [{start: x, lenght: x}, ..., {start: x, length: x}],
 *			 ......
 *			 n : [{start: x, length: x}, ..., {start: x, length: x}] 
 *		  }
 *	  }
 */
js.swt.SearchKit.search = function(textSet, keyword, mode){
	var SKit = js.swt.SearchKit,
	pattern = SKit.buildRegExp(keyword, mode);
	
	return SKit.searchByPattern(textSet, pattern);
};

/**
 * Search and return all text matches in a text collection by the
 * given <em>pattern</em>.
 *
 * @param textSet: a string collection.
 * @param pattern: a <em>RegExp</em> object. If it is not a valid RegExp
 *				   object, an error will be thrown.
 *	
 * @return an object: {
 *	   pattern: a <em>RegExp</em> object which is the current matched 
 *				regular expression,
 *	   matches: a <em>js.util.HashMap</em> object. In it, the key is 
 *				the <em>index</em> of a text with matched string in the 
 *				<em>textSet</em>. Each <em>value</em> is an array of all 
 *				matches' start index and length in the text indicated by 
 *				the <em>key</em>. 
 *	  }
 *	  
 *	  Its structure is as follow:
 *	  {
 *		  pattern: {RegExp},
 *		  matches: {
 *			 0 : [{start: x, lenght: x}, ..., {start: x, length: x}],
 *			 ......
 *			 n : [{start: x, length: x}, ..., {start: x, length: x}] 
 *		  }
 *	  }
 */
js.swt.SearchKit.searchByPattern = function(textSet, pattern){
	var SKit = js.swt.SearchKit,
	len = textSet ? textSet.length : 0,
	matches, text, textMatches;
	
	if(len == 0)
		return null;
	
	matches = new js.util.HashMap();
	for(var i = 0; i < len; i++){
		text = textSet[i];
		textMatches = SKit.searchInTextByPattern(text, pattern);
		
		if(textMatches && textMatches.length > 0){
			matches.put(i, textMatches);
		}
	}
	
	return {pattern: pattern, matches: matches};
};

/**
 * Search all matches and return each match's index and length in 
 * <em>text</em> with the given searching <em>mode</em>.
 *
 * The searching <em>mode</em> as below:<p>
 * @param mode: "global|ignore|wholeword". Detains as below: <br>
 *			<em>global</em>: match all <br>
 *			<em>ignore</em>: case insensitive <br>
 *			<em>wholeword</em>: match the whole word, need wait for 
 *								<Enter> key is pressed <p>
 * 
 * @return <em>Array</em>, each element in it is a object maintained 
 *		   each match's start index and its length. Its structure is as fo
 *		   -llow:
 *		   [
 *			{start: m, length: x},
 *			...
 *			{start: n, length: x}	  
 *		   ]
 */ 
js.swt.SearchKit.searchInText = function(text, keyword, mode){
	var SKit = js.swt.SearchKit,
	pattern = SKit.buildRegExp(keyword, mode);
	
	return SKit.searchInTextByPattern(text, pattern);
};


/**
 * Return all matchces' index and its length of <em>text</em> with the 
 * given <em>pattern</em>.
 * 
 * @param text: a text string.
 * @param pattern: a <em>RegExp</em> object. If it is not a valid RegExp
 *				   object, an error will be thrown.
 * @return <em>Array</em>, each element in it is a object maintained each 
 *		   match's start index and its length. Its structure is as follow:
 *		   [
 *			{start: m, length: x},
 *			...
 *			{start: n, length: x}	  
 *		   ]
 */
js.swt.SearchKit.searchInTextByPattern = function(text, pattern){
	if(!text || (text.length == 0) || !pattern)
		return null;
	
	if(!(pattern instanceof RegExp)){
		throw new Error("The pattern is not a valid RegExp.");	  
	}
	
	/*
	 * Comment by mingfa.pan to void an issue as follow:
	 * In IE/FF/Chrome and so on, if I have following items: 
	 *		"item1", "item2", "item3", "item4", "item5", "item6" 
	 * And a pattern line (/i/ig) or (/e/ig) for all items.
	 * Then when we use the test() method to test each item above,
	 * "item2", "item4", "item6" will make a "false" be returned.
	 * 
	 * P.S. at 2011-10-24 14:00
	 * For this issue, we need to reset the pattern's lastIndex 
	 * property to 0. Because this property returns an integer that 
	 * specifies the character position immediately after the last 
	 * match found by exec( ) or test( ) methods.
	 * 
	 * If someone found in the last match, the lastIndex will be set
	 * to an integer value. It may affect the following match. However,
	 * exec( ) and test( ) will reset lastIndex to 0 if they do not get
	 * a match.
	 */
	// var isMatched = pattern.test(text);
	// if(isMatched){
	var matches = [];
	text.replace(pattern, function(m, i){
					 matches.push({start: i, length: m.length});
				 });
	
	return matches;
	// } else {
	// return null;
	// }
};
