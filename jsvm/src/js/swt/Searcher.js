/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * @File: Searcher.js
 * @Create: 2011-09-27
 * @Author: mingfa.pan@china.jinfonet.com
 */

$package("js.swt");

/**
 * <em>Search</em> is the wrapper of search behavior which can supply the
 * quick search function for a container, list or collection of multiple
 * items.<br />
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
 *	  mode: "global|ignore|wholeword". Detains as below: <br>
 *			<em>global</em>: match all <br>
 *			<em>ignore</em>: case insensitive <br>
 *			<em>wholeword</em>: match the whole word, need wait for 
 *								<Enter> key is pressed <p>
 *	  highlight: <em>true/false</em>, default is true. Indicate whether
 *			 matches highlighted, <p>
 *	  highlightClass: string, optional. Indicate the highlight style 
 *			 class name for the matches, <p>
 * }
 */ 
$import("js.swt.SearchKit");

js.swt.Searcher = function(host, options){
	var CLASS = js.swt.Searcher, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var C = js.lang.Class, L = js.util.LinkedList, System = J$VM.System;
	
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
		}else if(set && C.isArray(set)){
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
		
		var len = items.length, textSet = L.newInstance([]),
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
		var mode = options.mode, hlight = options.highlight, 
			hStyleClass = options.highlightClass,
			mlen = matchedIndexes ? matchedIndexes.length : 0,
			len = items.length, textMatches, item;
		for(var i = 0; i < len; i++){
			item = items[i];
		
			if(mlen > 0 && (_contains.call(this, matchedIndexes, i))){
				item.setVisible(true);
				
				if(hlight && (typeof item.highlight === "function")){
					textMatches = this.matches.get(i);
					item.highlight(keyword, mode, textMatches, hStyleClass);	
				}
			}else{
				item.setVisible(options.keep);
				
				if(typeof item.clearHighlight === "function"){
					item.clearHighlight(hStyleClass);
				}
			}
		}
	};
	
	thi$.restore = function(options){
		var items = this.host.getItems(), 
		options = options || this.getSearchOptions();
		
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
	 *	
	 */	   
	thi$.search = function(keyword, options /* optional */) {
		if(typeof keyword !== "string"){
			return;
		}
		
		this.setSearchOptions(options);
		
		options = this.getSearchOptions();;
		if(keyword.length === 0){
			this.latestItems = this.host.getItems();
			this.restore(options);
			
			return;
		}
		
		// Increasedly match base on latest match
		var items;
		if(this.latestKeyword && (keyword.indexOf(this.latestKeyword) == 0)){
			items = this.latestItems;	 
		} else {
			items = this.latestItems = this.host.getItems();
		}
		
		this.latestKeyword = keyword;
		if(!items)
			return;
		
		var isValid = _isSet.call(this, items);
		if(!isValid){
			throw new Error("Host's getItems method returned "
							+ "an unsupported data type.");
		}
		
		var textSet = _getTextSet.call(this, items);
		var result 
			= js.swt.SearchKit.search(textSet, keyword, options.mode);
		var matches = this.matches = result ? result.matches : undefined;
			
		var matchedIndexes = L.newInstance([]);
		if(matches && matches.size() > 0){
			matchedIndexes = L.newInstance(matches.keys());
		}

		// Highlight the matches if need
		// Hide the non-matches if need
		_digestMatches.call(this, items, keyword, options, matchedIndexes);
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
	keep: false,
	mode: "global|ignore",
	highlight: true
};
