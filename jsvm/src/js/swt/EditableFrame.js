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
 * File: EditableFrame.js
 * Create: 2012/07/27 02:26:38
 * Author: Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.swt");

js.swt.EditableFrame = function(def, Runtime){
	var CLASS = js.swt.EditableFrame,
	thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;

	var C = js.lang.Class, E = js.util.Event, 
	DOM = J$VM.DOM, System = J$VM.System,
	divParagraph = J$VM.ie ? "<div></div>" : "<div><br/></div>",
	pParagraph = J$VM.ie ? "<p></p>" : "<p><br/></p>";
	
	/**
	 * Get window object of the page in IFrame.
	 */
	thi$.getWin = function () {
		if (this.win) {
			return this.win;
		}
		
		// In IE, if the iframe is not appended to DOM tree,
		// a "Unspecified error" exception will be thrown.
		try {
			this.win = this.view.contentWindow;
		} catch (e) {
			// Ignore
		}
		
		return this.win;
	};
	
	/**
	 * Get document object of the page in IFrame.
	 */
	thi$.getDoc = function () {
		if (this.doc) {
			return this.doc;
		}
		
		var doc;
		try {
			doc = this.view.contentDocument;
		} catch (e) {
			//Ignore
		}
		
		if (!doc) {
			var win = this.getWin();
			if (win)
				doc = win.document;
		}
		
		this.doc = doc;
		return this.doc;
	};
	
	thi$.getRoot = function () {
		var doc = this.getDoc();
		return doc ? doc.body : undefined;
	};
	
	thi$.getNodes = function(tag){
		var body = this.getRoot();
		if(!body){
			return undefined;
		}
		
		if(tag){
			return body.getElementsByTagName(tag);
		}else{
			return body.childNodes;
		}
	};
	
	thi$.currentEvent = function(e){
		if(e){
			if(!(e instanceof js.awt.Event)){
				e = new js.awt.Event(e);
			}
			
			this._local.currentEvent = e;
		}else{
			if(e == null){
				this._local.currentEvent = null;
			}
		}
		
		return this._local.currentEvent;
	};
	
	thi$.getTarget = function(e){
		e = this.currentEvent(e);
		
		var tar = e.srcElement;
		try {
			if(tar && tar.nodeType == 3){ // TextNode
				return tar.parentNode;
			}else{
				return tar;
			}
		} catch (x) {
			return null;
		}
	};
	
	var _extractNodes = function(el, els, ignoreBr){
		var nodes = el ? el.childNodes : undefined,
		len = nodes ? nodes.length : 0, 
		node, type, v;
		
		els = els || (len > 0 ? [] : undefined);
		
		for(var i = 0; i < len; i++){
			node = (nodes.item(i)).cloneNode(true);
			type = node ? node.nodeType : undefined;
			switch(type){
				case 1:
					if(!this.isElement(node, "br") 
						|| (ignoreBr !== true)){
						els.push(node);
					}
				break;
				
				case 3:
				   if(node.nodeValue){
					els.push(node);
				   }
				break;
			}
		}
		
		return els;
	};
	
	thi$.getSelectedNodes = function(ignoreBr){
		var win = this.getWin(), doc = this.getDoc(),
		sel = this.getSelection(), rng = this.getRange(sel),
		tmp;
		if(!rng){
			return null;
		}
		
		if(rng.cloneContents){//Chrome, Safari, Firefox, IE9+
			tmp = rng.cloneContents();
		}else{
			if(rng.htmlText){
				tmp = doc.createElement("div");
				tmp.innerHTML = rng.htmlText;
			}
		}
		
		var nodes = tmp ? tmp.childNodes : undefined,
		len = nodes ? nodes.length : 0, 
		els = (len > 0 ? [] : undefined),
		others = [], pnodes, node, type;
		for(var i = 0; i < len; i++){
			node = (nodes.item(i)).cloneNode(true);
			type = node ? node.nodeType : undefined;
			
			switch(type){
				case 1:
					if(this.isElement(node, "p") 
						|| this.isElement(node, "div")){
						if(others.length > 0){
							els.push(others);
							others = [];
						}
						
						pnodes = _extractNodes.call(this, node, [node], ignoreBr);
						els.push(pnodes);
					}else{
						if(!this.isElement(node, "br") 
							|| (ignoreBr !== true)){
							others.push(node);
						}
					}
				break;
				
				case 3:
				   if(node.nodeValue){
					others.push(node);
				   }
				break;
			}
		}
		
		if(others.length > 0){
			els.push(others);
		}
		
		return els;
	};
	
	thi$.getSelectedElement = function(){
		var win = this.getWin(), doc = this.getDoc(), 
		currentEvent = this.currentEvent(), 
		sel = null, range = null, 
		elm = null, tar = null;
		
		if(win.event){
			currentEvent = this.currentEvent(win.event);
		}
		
		if(J$VM.ie){
			sel = doc.selection;
			range = sel ? sel.createRange() : null;
			if(range){
				elm = range.item ? range.item(0) : range.parentElement();
				if(elm === doc.body){
					elm = null;
				}
			}
			
			if(currentEvent !== null && currentEvent.keyCode === 0){
				elm = this.getTarget(currentEvent);
			}
		}else{
			sel = this.getSelection();
			range = this.getRange(sel, false);
			if(!sel || !range){
				return null;
			}
			
			if(J$VM.firefox){ //Gecko
				if(range.startContainer){
					if(range.startContainer.nodeType === 3){
						elm = range.startContainer.parentNode;
					}else if(range.startContainer.nodeType === 1){
						elm = range.startContainer;
					}
					
					if(currentEvent){
						tar = this.getTarget(currentEvent);
						if(!this.isElement(tar, "html")){
							if(elm !== tar){
								elm = tar;
							}
						}
					}
				}
			}
			
			if(sel.anchorNode && (sel.anchorNode.nodeType == 3)){
				if(sel.anchorNode.parentNode){
					elm = sel.anchorNode.parentNode;
				}
				
				if(sel.anchorNode.nextSibling != sel.focusNode.nextSibling){
					elm = sel.anchorNode.nextSibling;
				}
			}
			
			if(this.isElement(elm, "br")){
				elm = null;
			}
			
			if(!elm){
				elm = range.commonAncestorContainer;
				if(!range.collapsed){
					if(range.startContainer == range.endContainer){
						if(range.startOffset - range.endOffset < 2){
							if(range.startContainer.hasChildNodes()){
								elm = range.startContainer.childNodes[range.startOffset];
							}
						}
					}
				}
			}
		}
		
		if(currentEvent !== null){
			switch(currentEvent.getType()){
			case "click":
			case "mousedown":
			case "mouseup":
				if(J$VM.chrome || J$VM.safari){ //webkit
					elm = this.getTarget(currentEvent);
				}
				break;
			default:
				break;
			}
		}		 
		
		if(J$VM.chrome || J$VM.safari || J$VM.opera){
			if(currentEvent && !elm){
				elm = this.getTarget(currentEvent);
			}
		}
		
		if(!elm || !elm.tagName){
			elm = doc.body;
		}
		
		if(this.isElement(elm, "html")){
			//Safari sometimes gives us the HTML node
			elm = doc.body;
		}
		
		if(this.isElement(elm, "body")){
			// Make sure that body means this doby not the parent's
			elm = doc.body;
		}
		
		if(elm && !elm.parentNode){
			// Not in document
			elm = doc.body;
		}
		
		if(elm === undefined){
			elm = null;
		}
		
		return elm;
	};
	
	thi$.getDOMPath = function(el, includeBody){
		if(!el){
			el = this.getSelectedElement();
		}
		
		var nodes = [], body = this.getRoot();
		while(el != null){
			if(el.ownerDocument != this.getDoc()){
				el = null;
				break;
			}
			
			if(this.isElement(el, "body")){
				if(includeBody !== false && body){
					nodes[nodes.length] = body;
				}
				
				break;
			}
			
			if(el.nodeName && el.nodeType && (el.nodeType == 1)){
				nodes[nodes.length] = el;
			}
			
			el = el.parentNode;
		}
		
		if(nodes.length == 0 && includeBody !== false && body){
			nodes[0] = body;
		}
		
		return nodes.reverse();
	};

	thi$.getSelectionBoundaryElement = function(isStart) {
		var win = this.getWin(), doc = this.getDoc(), 
		range, sel, container;
		if (doc.selection) {
			range = doc.selection.createRange();
			range.collapse(isStart);
			return range.parentElement();
		} else {
			sel = win.getSelection();
			if (sel.getRangeAt) {
				if (sel.rangeCount > 0) {
					range = sel.getRangeAt(0);
				}
			} else {
				// Old WebKit
				range = doc.createRange();
				range.setStart(sel.anchorNode, sel.anchorOffset);
				range.setEnd(sel.focusNode, sel.focusOffset);

				// Handle the case when the selection was selected backwards 
				// (from the end to the start in the document)
				if (range.collapsed !== sel.isCollapsed) {
					range.setStart(sel.focusNode, sel.focusOffset);
					range.setEnd(sel.anchorNode, sel.anchorOffset);
				}
			}

			if (range) {
				container = range[isStart ? "startContainer" : "endContainer"];

				// Check if the container is a text node and return its parent if so
				return container.nodeType === 3 ? container.parentNode : container;
			} else {
				return undefined;
			}
		}
	};
	
	/**
	 * Fetch all text contexts of current selection.
	 */
	thi$.getSelectedText = function(sel){
		var win = this.getWin(), doc = this.getDoc(),
		text = "", rng;
		
		sel = sel || this.getSelection();
		rng = this.getRange(sel);
		if(win.getSelection){// IE9, W3C
			text = sel + "";
		}else if (doc.selection){ //IE 8, some Opera
			text = C.isString(rng.text) ? rng.text
				: (C.isString(rng.html) ? rng.html : "");
		}
		
		return text;
	};
	
	/**
	 * If set with false, Chrome, Firefox and safari will use tag instead of CSS
	 * to present style. In this case, IE will use <U>, <Strong>, <EM>, and others
	 * use <U>, <B>, <I> to indicate "Underline", "Bold" and "Italic".
	 * However, if set with true, Chrome, Firefox and safari will use a <span> tag
	 * with style attribute to present those styles.
	 */	   
	thi$.setStyleWithCSS = function(b){
		b = b || false;
		this._local.isStyleWithCSS = b;
		
		var doc = this.getDoc();
		try {
			doc.execCommand("styleWithCSS", false, b);
		} catch (x) {
			try{
				// NOTE: This argument is logically backwards.
				// (e.g. use false to use CSS, true to use HTML)
				doc.execCommand("useCSS", false, !b);
			} catch (x) {
				System.err.println("Browser doesn't support this command.");
			}
		}
		
		return b;
	};
	
	thi$.isStyleWithCSS = function(){
		return this._local.isStyleWithCSS;
	};
	
	thi$.getSelection = function () {
		/*
		 * Chrome, Firefox and IE9 (IE 9 Standard Mode) support 
		 * "window.getSelection()". 
		 * Others use "document.selection". 
		 */
		var win = this.getWin(), doc = this.getDoc();
		return (win.getSelection) ? win.getSelection() : doc.selection;
	};
	
	thi$.getRange = function (sel, createIfNotExist) {
		var s = sel || this.getSelection(),
		doc = this.getDoc(), r;
		
		try {
			if(s){
				if(s.getRangeAt){
					r = s.rangeCount > 0 ? s.getRangeAt(0) : undefined;
				}else{
					r = s.createRange ? s.createRange() : undefined;
				}
			} 
		} catch (x){
			// Do nothing			 
		}
		
		if(!r && (createIfNotExist == true)){
			r = doc.createRange 
				? doc.createRange() : doc.body.createTextRange();
		}
		
		return r;
	};
	
	thi$.getIEBookmark = function(){
		var doc = this.getDoc(), rng, bm;
		if(doc.selection){
			// TextRange of IE browser
			rng = doc.selection.createRange();
			if(rng && rng.getBookmark){
				bm = rng.getBookmark();
			}
		}
		
		return bm;
	};
	
	thi$.setIEBookmark = function(bookmark){
		var body = this.getRoot(), rng;
		if(body){
			rng = body.createTextRange();
			rng.moveToBookmark(bookmark);
			rng.select(bookmark);
		}
	};
	
	thi$.select = function(range, bookmark){
		var win = this.getWin(), body = this.getRoot();
		win.focus();
		
		if(J$VM.ie && bookmark){ //IE7, IE8, IE9(All Mode)
			this.setIEBookmark(bookmark);
		}else if(win.getSelection){ //Chrome, Firefox, IE9(IE9 Standard)
			var s = win.getSelection();
			if(s) {
				s.removeAllRanges();
				s.addRange(range);
			}
		}else{
			range.select();
		}
	};
	
	thi$.selectNode = function(node, collapse){
		if(!node) {
			return;
		}
		
		var win = this.getWin(), body = this.getRoot(),
		doc = this.getDoc(), sel, rng;
		
		// Focus
		win.focus();
		
		if(J$VM.ie){
			try {
				// IE freaks out here sometimes..
				rng = body.createTextRange();
				rng.moveToElementText(node);
				rng.select();
			} catch (x) {
				System.err.println("IE failed to select element: " 
					+ node.tagName + ".");
			}
		}else if(J$VM.chrome || J$VM.safari){ //webkit
			sel = this.getSelection();
			
			if(collapse){
				sel.setBaseAndExtent(node, 1, node, node.innerText.length);
			}else{
				sel.setBaseAndExtent(node, 0, node, node.innerText.length);
			}
		}else if(J$VM.opera){
			sel = win.getSelection();
			rng = doc.createRange();
			rng.selectNode(node);
			
			sel.removeAllRanges();
			sel.addRange(rng);
		}else{
			sel = this.getSelection();
			rng = doc.createRange();
			rng.selectNodeContents(node);
			
			sel.removeAllRanges();
			sel.addRange(rng);
		}
	};
	
	thi$.setCaretAfter = function(el) {
		var win = this.getWin(), doc = this.getDoc(),
		body = this.getRoot(), sel, range;
		
		// Focus first
		win.focus();
		
		if (win.getSelection && doc.createRange) {
			range = doc.createRange();
			range.setStartAfter(el);
			range.collapse(true);
			
			sel = win.getSelection(); 
			sel.removeAllRanges();
			sel.addRange(range);
		} else if (body.createTextRange) {
			range = body.createTextRange();
			range.moveToElementText(el);
			range.collapse(false);
			range.select();
		}
	};
	
	thi$.isCollapsed = function (range) {
		var r = range || this.getRange();
		if (!r)
			return true;
			
		var win = this.getWin(), doc = this.getDoc(),
		rst = true;
		if (win.getSelection) { //IE 9, W3C
			rst = r.collapsed;
		} else if (doc.selection){ //IE 8, some Opera
			if(r.htmlText){
				rst = (r.htmlText.length === 0);
			}
		}
		
		return rst;
	};
	
	thi$.clearSelection = function (sel) {
		var selection = sel || this.getSelection(),
		range = this.getRange(selection, false);
		
		// Chrome, safari
		if (selection && selection.empty) {
			selection.empty();
		}
		
		// Firefox
		if (selection && selection.removeAllRanges) {
			selection.removeAllRanges();
		}
		
		if (range && range.detach) {
			range.detach();
		}
		
		selection = undefined;
		range = undefined;
	};
	
	/**
	 * Judge whether there some contents selected. 
	 */
	thi$.hasSelection = function(sel){
		var win = this.getWin(), 
		doc = this.getDoc(),
		sel = sel || this.getSelection(), 
		rng = this.getRange(sel), 
		hasSel = false;
		
		if(!win || !doc || !sel || !rng){
			return hasSel;
		}
		
		if (win.getSelection) { //IE 9, W3C
			sel = sel + "";
			hasSel = sel.length > 0;
			
			// ?? What case?
			// if(sel && (sel.toString() !== "") && (sel !== undefined)){
				// hasSel = true;
			// }
		} else if (doc.selection){ //IE 8, some Opera
			if(rng.text){
				hasSel = true;
			}
			
			if(rng.html){
				hasSel = true;
			}
		}
		
		return hasSel;		  
	};
	
	thi$.focus = function(){
		this.getWin().focus();
	};
	
	/**
	 * Execute a native command at current document or range.
	 *
	 * @param range: {Range/TextRange} required. Specifies the current selection range. 
	 *		  If in IE8, the range is a TextRange and it can execute a native command. 
	 *		  But not for w3c browser.
	 * @param cmd: {String} required. String that specifies a native command which will
	 *		  be executed.
	 *
	 * @param ui: {Boolean} optional. Boolean that specifies whether a user interface 
	 *		  displayed if this command supports one.
	 * @param value: {String/Number} optional. Variant that specifies the string, number,
	 *		  or other value to assign. Possible values depend on sCommand.
	 * @param useCSS: {Boolean} Optional. Indicate whethe this command should execute
	 *		  with style instead tag. That can take effect for non-IE browsers.
	 */
	thi$.execNativeCommand = function (range, cmd, ui, value, useCSS) {
		var doc = this.getDoc(), rst = false, isUseCSS = false, args;
		if (!doc || !cmd){
			return rst;
		}
		
		args = [cmd, ui || false, value];
		try {
			isUseCSS = this.isStyleWithCSS();
			
			// Firefox: Bug 279330 - Midas hilitecolor command only works in CSS mode
			// See: https://bugzilla.mozilla.org/show_bug.cgi?id=279330
			if(J$VM.firefox && (cmd.toLowerCase() === "hilitecolor") && !isUseCSS){
				this.setStyleWithCSS(true);
				rst = doc.execCommand.apply(doc, args);
				this.setStyleWithCSS(isUseCSS);
			}else if(C.isBoolean(useCSS)){
				this.setStyleWithCSS(useCSS);
				rst = doc.execCommand.apply(doc, args);
				this.setStyleWithCSS(isUseCSS);
			}else{
				rst = doc.execCommand.apply(doc, args);
			}
		} catch (e) {}
		
		return rst;
	};
	
	/**
	 * Query whether the given command has been executed on the object.
	 *
	 * @param cmd: {String} required. String that specifies a native command 
	 *		  which has been executed.
	 */
	thi$.queryCommandState = function (cmd, useCSS) {
		var doc = this.getDoc(), isUseCSS = false, rst = false;
		if (!doc || !cmd){
			return rst;
		}
		
		try {
			if(C.isBoolean(useCSS)){
				isUseCSS = this.isStyleWithCSS();
				this.setStyleWithCSS(useCSS);
				rst = doc.queryCommandState(cmd);
				this.setStyleWithCSS(isUseCSS);
			}else{
				rst = doc.queryCommandState(cmd);
			}
		} catch (e) {}
		
		return rst;
	};
	
	/**
	 * Query the current value of the document, range, or current selection 
	 * for the given command.
	 *
	 * @param cmd: {String} required. String that specifies a native command 
	 *		  which has been executed.
	 */
	thi$.queryCommandValue = function (cmd, useCSS) {
		var doc = this.getDoc(), isUseCSS = false, value;
		if (!doc || !cmd){
			return undefined;
		}

		// Cache the old value for restore
		isUseCSS = this.isStyleWithCSS();
		
		try {
			switch(cmd.toLowerCase()){
			case "hilitecolor":
				// Firefox: Bug 279330 - Midas hilitecolor command only works in CSS mode
				// See: https://bugzilla.mozilla.org/show_bug.cgi?id=279330
				if(J$VM.firefox && !isUseCSS){
					this.setStyleWithCSS(true);
					value = doc.queryCommandValue(cmd);
					this.setStyleWithCSS(isUseCSS);
				}else if(J$VM.chrome || J$VM.safari){
					if(C.isBoolean(useCSS)){
						this.setStyleWithCSS(useCSS);
						
						// It's vary odd for that 
						value = doc.queryCommandValue("BackColor");
						if(!value){
							value = doc.queryCommandValue("HiliteColor");
						}
						
						this.setStyleWithCSS(isUseCSS);
					}else{
						// It's vary odd for that 
						value = doc.queryCommandValue("BackColor");
						if(!value){
							value = doc.queryCommandValue("HiliteColor");
						}
					}
				}else{
					if(C.isBoolean(useCSS)){
						this.setStyleWithCSS(useCSS);
						value = doc.queryCommandValue(cmd);
						this.setStyleWithCSS(isUseCSS);
					}else{
						value = doc.queryCommandValue(cmd);
					}
				}
				break;
			default:
				if(C.isBoolean(useCSS)){
					this.setStyleWithCSS(useCSS);
					value = doc.queryCommandValue(cmd);
					this.setStyleWithCSS(isUseCSS);
				}else{
					value = doc.queryCommandValue(cmd);
				}
				break;
			}
		} catch (x){
			System.err.println("Query " + cmd + "'s value:" 
							   + "An unknown exception is thrown.");
			value = undefined;
		}
		
		return value;
	};
	
	/**
	 * Query the state, vlaue or other of the document, range, or current selection
	 * for the given commands.
	 *
	 * @param cmds: {Array} Required array of commands to query.
	 * @param arg: {String} Required string to specify what will be queried.
	 */
	thi$.queryCommands = function (cmds, arg) {
		var doc = this.getDoc(), len = cmds ? cmds.length : 0,
		rst = {}, cmd;
		if (!doc || len == 0){
			return rst;
		}
		
		for (var i = 0; i < len; i++) {
			cmd = cmds[i];
			
			if (!doc.queryCommandSupported(cmd)) {
				continue;
			}
			
			switch (arg) {
			case "state":
				rst[cmd] = this.queryCommandState(cmd);
				break;
				
			case "value":
				rst[cmd] = this.queryCommandValue(cmd);
				break;
				
			default:
				break;
			}
		}
		
		return rst;
	};
	
	/**
	 * IE 9 doesn't support createContextualFragment.
	 */
	thi$.createContextualFragment = function(range, html){
		var doc = this.getDoc(), frag;
		if(range && range.createContextualFragment){
			frag = range.createContextualFragment(html);
		}else{
			frag = doc.createDocumentFragment();
			
			var div = doc.createElement("div");
			if(J$VM.firefox){ //Firefox doesn't support outerHTML
				div.innerHTML = html;
				while(div.firstChild){
					frag.appendChild(div.firstChild);
				}
			}else{
				frag.appendChild(div);
				div.outerHTML = html;
			}
		}
		
		return frag;
	};
	
	/**
	 * Insert the specified node at the current cursor position.
	 */
	thi$.insertNodeAtCursor = function(node){
		var s = this.getSelection(), rng = this.getRange(s, true), 
		html;
		if(!s || !rng || !node){
			return;
		}
		
		if(s.getRangeAt){
			rng.insertNode(node);
		}else{
			html = (node.nodeType == 3) 
				? node.data : node.outerHTML;
			rng.pasteHTML(html);
		}
	};
	
	/**
	 * Insert a paragraph of HTML text at the current cursor position
	 * or replace current selection.
	 * 
	 * @param html: {String} A paragraph of HTML text to insert 
	 */
	thi$.insertHTML = function(html){
		var s = this.getSelection(), rng = this.getRange(s);
		if(!rng || !html){
			return;
		}
		
		if(J$VM.ie){
			rng.pasteHTML(html);
		}else{
			var oFragment = range.createContextualFragment(html),
			oLastNode = oFragment.lastChild;
			range.insertNode(oFragment);
			range.setEndAfter(oLastNode);
			range.setStartAfter(oLastNode);
			
			s.removeAllRanges(); //Clear current selection
			s.addRange(range);
		}
	};
	
	/**
	 * Set the contents of current IFrame's body with the given HTML text.
	 * 
	 * @param contents: {String} HTML text to set.
	 */
	thi$.setContents = function(contents){
		var done = false;
		if(!C.isString(contents) || contents.length == 0){
			return done;
		}
		
		// Cache the contents
		this._local.contents = contents;
		
		var body = this.getRoot();
		if(body && this.isLoaded()){
			DOM.setHTML(body, contents);
			done = true;
		}
		
		return done;
	};
	
	thi$.getContents = function(){
		var body = this.getRoot();
		return body ? body.innerHTML : "";
	};
	
	thi$.setEditable = function(b){
		b = (b !== false);
		
		var M = this.def, doc = this.getDoc();
		if(!doc){
			return;
		}
		
		M.editable = b;
		doc.designMode = b ? "on" : "off";
	};
	
	thi$.isEditable = function(){
		return this.def.editable;
	};
	
	thi$.isLoaded = function(){
		return this._local.loaded;	
	};
	
	/**
	 * Fetch and return all elements specified by tag.
	 * 
	 * @param tag: {String} DOM tag name
	 */
	thi$.getElementsByTag = function(tag){
		var doc = this.getDoc();
		if(!doc || !tag){
			return undefined;
		}
		
		return doc.getElementsByTagName(tag);
	};
	
	thi$.getContentNodes = function(){
		var body = this.getRoot();
		return body ? body.childNodes : undefined;
	};
	
	/**
	 * Find and return all elements specified by tag and the value for the given attribute
	 * of which is the given value. If exclude object is given, the nodes we will returned
	 * should have no any attribute specified by exclude object.
	 *
	 * @param tag: {String} The specified node name of elements to check.
	 * @param attr: {String} The given attribute to check.
	 * @param v: {String/Number/...} Value of the given attribute to check.
	 * @param exclude: {String} Optional attribute that will be excluded.
	 */
	thi$.findElement = function (tag, attr, v, exclude) {
		var es = this.getElementsByTag(tag),
		len = es ? es.length : 0, nodes = [], node;
		for (var i = 0; i < len; i++) {
			node = es.item(i);
			if((!attr || node.getAttribute(attr) == v) 
				&& (!exclude || !DOM.hasAttribute(node, exclude))){
				nodes.push(node);				 
			}
		}
		
		return nodes;
	};

	/**
	 * Init the internal DOM structure of current IFrame and set up.
	 *
	 * Attention:
	 * This method will take effect only when the IFrame is appended to current
	 * DOM tree.
	 */
	thi$.setup = function () {
		var doc = this.getDoc();
		if (doc) {
			doc.open();
			doc.write(this._local.iframeHTML);
			doc.close();
		}

		this.setEditable(this.def.editable);
	};

	thi$.onKeyup = function(e){
		var kc = e.keyCode;

		// 8: Back	46: Del
		if(kc == 8 || kc == 46){
			this.reviseContents();
		}
	};
	
	thi$.isElement = function(el, tag){
		var nodeName = el ? el.nodeName : undefined;
		if(nodeName && tag){
			nodeName = nodeName.toLowerCase();
			tag = tag.toLowerCase();
			
			return nodeName === tag;
		}
		
		return false;
	};
	
	var _getParagraphTag = function(){
		return (this.def.userParagraphByDiv == true) 
			? (!J$VM.firefox ? "DIV" : "BR") 
			: "P";
	};
	
	thi$.getInitialParagraph = function(){
		return (this.def.userParagraphByDiv == true) 
			? (!J$VM.firefox ? divParagraph : "<br/>") 
			: pParagraph;
	};
	
	thi$.reviseContents = function(){
		var nodes = this.getNodes(), pTag = _getParagraphTag.call(this), 
		root, r, el;
		if(!nodes || nodes.length == 0 
			|| (nodes.length == 1 && !this.isElement(nodes[0], pTag))){
			root = this.getRoot();
			DOM.setHTML(root, this.getInitialParagraph());
			
			// Make cursor in the first p
			el = root.firstChild;
			this.selectNode(el, true);
		}
	};
	
	thi$.onload = function(e){
		var win = this.getWin(), doc = this.getDoc(), body = this.getRoot(), 
		v = this._local.contents;
		if(body){
			this._local.loaded = true;
			this.setContents(v);
			
			E.attachEvent(body, "keyup", 0, this, this.onKeyup);
		}
	};
	
	thi$.repaint = function(){
		if(arguments.callee.__super__.apply(this, arguments)){
			if(!this._local.setup){
				this.setup();
				
				this._local.setup = true;
				return true;
			}
			
			return false;
		}
		
		return false;
		
	}.$override(this.repaint);
	
	thi$.destroy = function(){
		var body = this.getRoot();
		if(body && this.isLoaded()){
			E.detachEvent(body, "keyup", 0, this, this.onKeyup);
		}
		
		body.innerHTML = "";
		this.detachEvent("load", 0, this, this.onload);
		
		delete this.win;
		delete this.doc;
		delete this._local.contents;
		delete this._local.iframeHTML;

		arguments.callee.__super__.apply(this, arguments);		  
		
	}.$override(this.destroy);
	
	var _getFrameHTML = function (def) {
		var buf = new js.lang.StringBuffer();
		buf.append("<!DOCTYPE>").append('<html><head xlmns="http://www.w3.org/1999/xhtml">');
		buf.append('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />');
		
		// Add external style
		var stylesheets = def.stylesheets, 
		fCnt = stylesheets ? stylesheets.length : 0;
		for (var i = 0; i < fCnt; i++) {
			buf.append('<link type="text/css" rel="stylesheet" href="')
				.append(stylesheets[i]).append('" />');
		}
		
		buf.append('</head><body style="margin:0;" spellcheck="false">');
		buf.append(this.getInitialParagraph());
		buf.append("</body></html>");
		
		return buf.toString();
	};

	thi$._init = function(def, Runtime){
		if(typeof def !== "object") return;
		
		def.viewType = "iframe";
		def.editable = (def.editable !== false); // Default is editable
		arguments.callee.__super__.apply(this, arguments);

		this._local.loaded = false;
		this._local.contents = undefined;
		this._local.iframeHTML = _getFrameHTML.call(this, def);
		
		this.view.frameBorder = 0; // No border is drawn
		this.view.src = J$VM.ie ? "javascript:false;" : 'javascript:;'; //"about:blank;"
		
		this.attachEvent("load", 0, this, this.onload);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.Component);
