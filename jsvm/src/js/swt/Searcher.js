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
 * File: Searcher.js
 * Create: 2011-09-27
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

/**
 * <em>Searcher</em> is the wrapper of search behavior which can supply the
 * quick search function for a container, list or collection of multiple items.
 * <br />
 * Especially, the container/list/collection must implement a method named
 * <em>getItems()</em> to return an array of all items. Each of item must 
 * implement <em>getContent()</em> to return some contents for seaching. 
 * <p>
 * Additionally, if the item need to highlight the matched substring, it 
 * must implement <em>highlight(pattern, textMatches, highlightClass)</em> 
 * and <em>clearHighlight(highlightClass)</em> methods. <p>
 * When a component need to support quick search, it need to instantiate a
 * searcher object and assign searching <em>options</em>. Then it can do the 
 * quick search by invoking the searcher object's <em>search()</em> method 
 * and pass it the <em>keyword</em>.
 *
 * The <em>options</em> of a <em>searcher</em> as below:<p>
 * @param options: {
 *	  keep: <em>true/false</em>, default is false. Indicate whether
 *			mismathed items kept, <p>
 *	  mode: Details as below: <br>
 *			<em>global</em>: match all <br>
 *			<em>insensitive</em>: case insensitive <br>
 *			<em>wholeword</em>: match the whole word, need wait for 
 *								<Enter> key is pressed <p>
 *	  highlight: <em>true/false</em>, default is true. Indicate whether
 *			 matches highlighted, <p>
 *	  highlightClass: string, optional. Indicate the highlight style 
 *			 class name for the matches, <p>
 * }
 */ 

js.swt.Searcher = function(host, options){
	var CLASS = js.swt.Searcher, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var Class = js.lang.Class, LinkedList = js.util.LinkedList, 
	System = J$VM.System,
	
	SKit = Class.forName("js.swt.SearchKit");
	
	thi$.setSearchOptions = function(options){
		if(typeof options == "object"){
			this.searchOptions = 
				System.objectCopy(options, this.searchOptions, true);
		}
	};
	
	thi$.getSearchOptions = function(){
		return this.searchOptions;
	};
	
	var _isSet = function(v) {
		return (typeof v !== "undefined") && (v instanceof Array);
	};
	
	var _contains = function(set, e){
		if(set && (typeof set.contains === "function")){
			return set.contains(e);
		}else if(set && Class.isArray(set)){
			for(var i=0, len=set.length; i<len; i++){
				var _e = set[i];
				if(_e === e){
					return true;
				}
			}
			return false;
		}else{
			return false;
		}
	};
	
	/**
	 * Generate a searchable text collection from given <em>items</em>.
	 * 
	 * @param items: an array maintained all items for quick search.
	 * @param includes: an array, each element of which is a <em>index</em>
	 *				 of item in items. If <em>includes</em> is not a valid
	 *				 value, all items will be use for searching. 
	 */
	var _getTextSet = function(items, includes){
		var isArray = _isSet.call(this, includes);
		if(!isArray){
			includes = null;			
		}
		
		var len = items.length, textSet = LinkedList.$decorate([]),
		item, contents;
		for(var i = 0; i < len; i++){
			item = items[i];
			if(item.getContent && (typeof item.getContent === "function") 
			   && (!includes || _contains.call(this, includes, i))){
				textSet.push(item.getContent());				
			}
		}
		
		return textSet;
	};
	
	var _digestMatches = function(items, keyword, options, matchedIndexes){
		var hlight = options.highlight, 
		hStyleClass = options.highlightClass,
		mlen = matchedIndexes ? matchedIndexes.length : 0,
		len = items.length, rstItems = [], textMatches, item;
		for(var i = 0; i < len; i++){
			item = items[i];
			
			if(mlen > 0 && (_contains.call(this, matchedIndexes, "" + i))){
				rstItems.push(item);
				item.setVisible(true);
				
				if(hlight && (typeof item.highlight === "function")){
					textMatches = this.matches.get(i);
					// item.highlight(keyword, options, hStyleClass); 
					item.highlightByMatches(textMatches, hStyleClass);
				}
			}else{
				if(options.keep){
					rstItems.push(item);
				}
				item.setVisible(options.keep);
				
				if(typeof item.clearHighlight === "function"){
					item.clearHighlight(hStyleClass);
				}
			}
		}

		return rstItems;
	};
	
	thi$.restore = function(options){
		options = options || this.getSearchOptions();

		var items = this.host.getItems();

		(function(options, item){
			 item.setVisible(true);
			 
			 if(options && options.highlight 
				&& typeof item.clearHighlight === "function"){
				 item.clearHighlight(options.highlightClass);
			 }
		 }).$forEach(this, items, options);

		this.latestKeyword = undefined;
	};
	
	/**
	 * Search according to the given keyword and options, and then digest
	 * the matched result.
	 * 
	 * @param {String} keyword The keyword to search.
	 * @param {Object} options The searching options
	 */	   
	thi$.search = function(keyword, options /* optional */) {
		if(typeof keyword !== "string"){
			return;
		}
		
		this.setSearchOptions(options);
		
		options = this.getSearchOptions();
		if(keyword.length === 0){
			this.latestItems = this.host.getItems();
			this.restore(options);
			
			return;
		}
		
		// Increasedly match base on latest match
		var items, textSet, result, matches, matchedIndexes;
		if(this.latestKeyword && (keyword.indexOf(this.latestKeyword) == 0)){
			items = this.latestItems;	 
		} else {
			items = this.latestItems = this.host.getItems();
		}
		
		this.latestKeyword = keyword;
		if(!items)
			return;
		
		if(!_isSet.call(this, items)){
			throw new Error("Host's getItems method returned "
							+ "an unsupported data type.");
		}
		
		textSet = _getTextSet.call(this, items);
		result = SKit.search(textSet, keyword, options);
		matches = this.matches = result ? result.matches : undefined;
		matchedIndexes = LinkedList.$decorate([]);
		if(matches && matches.size() > 0){
			matchedIndexes = LinkedList.$decorate(matches.keys());
		}

		// Highlight the matches if need
		// Hide the non-matches if need
		this.latestItems = _digestMatches
			.call(this, items, keyword, options, matchedIndexes);
	};
	
	thi$.destroy = function(){
		this.host = null;
		this.searchOptions = null;
		
		this.matches = null;
		this.latestItems = null;
	};
	
	thi$._init = function(host, options){
		if(!host || (typeof host.getItems !== "function")){
			throw new Error("The host is not valid.");
		}
		
		this.host = host;
		
		this.searchOptions 
			= System.objectCopy(CLASS.DEFAULTSEARCHOPTIONS, {}, true);
		this.setSearchOptions(options);
	};

	this._init.apply(this, arguments);
};

js.swt.Searcher.DEFAULTSEARCHOPTIONS = {
	global: true,
	insensitive: true,
	wholeword: false,
	
	keep: false,
	highlight: true
};
