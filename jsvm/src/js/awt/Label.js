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
 * Author: Pan mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * Define Label component:
 * 
 * @param {Object} def Definition of the label.
 *		
 *		  @example
 *		  {
 *			  className: required, 
 *			  css: optional,
 * 
 *			  text: optional,
 * 
 *			  editable:optional 
 *		  }
 */
js.awt.Label = function(def, Runtime) {
	var CLASS = js.awt.Label, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event, 
	DOM = J$VM.DOM,	System = J$VM.System, MQ = J$VM.MQ,

	StringClass = js.lang.String,

	textSps = [
		"font-family", "font-size", "font-style",
		"font-weight", "text-decoration", "text-align",
		"font-weight", "line-height"
	];

	/**
	 * Judge whethe the current label can be wrodwrap.
	 * 
	 * @return {Boolean}
	 */
	thi$.canWordwrap = function(){
		return this.def.wordwrap === true;	
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Component#getPreferredSize
	 */
	thi$.getPreferredSize = function(){
		var M = this.def, prefSize = M.prefSize, styles, args, 
		textSize, d, w, h;

		if(!prefSize){
			d = this.getBounds();

			if(!this.canWordwrap()){
				styles = DOM.getStyles(this.view, textSps);

				args = [M.text, styles];
				textSize = DOM.getStringSize.apply(DOM, args);

				w = textSize.width + d.MBP.BPW;
				h = textSize.height + d.MBP.BPH;
			}else{
				w = d.width;
				h = d.height;
			}
			
			prefSize = {width: w, height: h};
		}

		return prefSize;

	}.$override(this.getPreferredSize);
	
	/**
	 * Return the text contents of current label.
	 * 
	 * @return {String}
	 */
	thi$.getText = function() {
		return this.def.text;
	};

	/**
	 * Sets lable text, only and only if encode == false, the text
	 * won't be encoded for html.
	 * 
	 * @param {String} text Text contents
	 * @param {Boolean} encode
	 */
	thi$.setText = function(text, encode) {
		text = this.def.text = text || "";

		var M = this.def, view = this.view,
		v = (encode == false) ? text
			: StringClass.encodeHtml(text, undefined, this.canWordwrap()),
		tmpEle, oTextNode;

		/*
		 * Ref: http://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx
		 * The innerHTML property is read-only on the col, colGroup, 
		 * frameSet, html, head, style, table, tBody, tFoot, tHead, 
		 * title, and tr objects
		 *
		 * However, in IE9-, if a span is the child of those DOM elements listed
		 * above, it cannot set the value with innerHTML, too.
		 */
		try {
			view.innerHTML = v;
		} catch (e){
			oTextNode = view.childNodes[0];
			tmpEle = document.createElement("SPAN");
			
			oTextNode.replaceNode(tmpEle.childNodes[0]);
		}
	};

	/**
	 * Sets the email string to show with the "mailto" protocol.
	 * 
	 * @param {String} text The email address to set.
	 */
	thi$.setEMail = function(text) {
		text = this.def.text = text || "";
		
		var str = StringClass.encodeHtml(text, undefined, this.canWordwrap()),
		mail = document.createElement("A");
		mail.href = "mailto:" + str;
		this.view.appendChild(mail);
		mail.innerHTML = str;
	};

	/**
	 * Judge whether the current label can be editable.
	 * 
	 * @return {Boolean}
	 */
	thi$.isEditable = function(){
		return this.def.editable || false;
	};

	/**
	 * Enable / disable to edit the current label. If true, editing by
	 * double click will be supported.
	 * 
	 * @param {Boolean} b
	 */
	thi$.setEditable = function(b) {
		b = b || false;

		this.def.editable = b;

		if (b) {
			this.detachEvent("dblclick", 0, this, _onDblClick);
			this.attachEvent("dblclick", 0, this, _onDblClick);
		} else {
			this.detachEvent("dblclick", 0, this, _onDblClick);
		}
	};

	var _onDblClick = function(e){
		if(!this.isEditable()) return;

		e.cancelBubble();
		
		var editor = 
			new (Class.forName("js.awt.LabelEditor"))(this.view, this);

		MQ.register("js.awt.event.LabelEditorEvent", this, _onedit);

		editor.doEdit();
	};
	
	var _onedit = function(e){
		var data = e.getData(); 
		this.setText(data.text, undefined, true);
		e.getEventTarget().destroy();

		MQ.cancel("js.awt.event.LabelEditorEvent", this, _onedit);

		this.notifyContainer(
			"js.awt.event.LabelTextEvent", new Event("changed", {}, this));
		
		this.setChanged();
		this.notifyObservers();
	};

	/**
	 * Highlight all the matched in the current label with the given searching
	 * keyword and control mode.
	 * 
	 * @param {String} keyword The keyword of the <em>RegExp</em> object 
	 *		  which is used to matched.
	 * @param {String} mode "global|insensitive|wholeword".
	 * @param {String} highlightClass The style class for highlighting text.
	 */
	thi$.highlightAll = function(keyword, mode, highlightClass) {
		var text = this.getText(), can = this.canWordwrap(), 
		kit, pattern, className, newText;
		if (!keyword || !mode || !text)
			return;

		text = StringClass.encodeHtml(text, undefined, can);
		keyword = StringClass.encodeHtml(keyword, undefined, can);

		kit = Class.forName("js.swt.SearchKit");
		pattern = kit.buildRegExp(keyword, mode);
		if(!pattern){
			return;
		}
		
		className = highlightClass;
		if (!className) {
			className = DOM.combineClassName(this.className, "highlight");
		}

		this.view.innerHTML = text.replace(
			pattern, 
			function(m) {
				return "<span class=\"" + className + "\">" + m + "</span>";
			});
	};
	
	/**
	 * Highlight all the matches in the current label accordig to the specified
	 * matched result.
	 * 
	 * @param {Array} matches Each element in it is a object maintained each
	 *		  match's start index and its length. 
	 * 
	 *		  @example Its structure is as follow:
	 *		  [
	 *			{start: m, length: x},
	 *			...
	 *			{start: n, length: x}	  
	 *		  ]
	 *
	 * @param {String} highlightClass The style class for highlighting text.
	 */
	thi$.highlightMatches = function(matches, highlightClass) {
		var text = this.getText(), can = this.canWordwrap(), className, 
		rpSeg, subStr, i, mCnt, aMatches, vernier = 0;
		if (!Class.isString(text) || text.length == 0){
			return;
		}

		className = highlightClass 
			|| DOM.combineClassName(this.className, "highlight");

		rpSeg = new js.lang.StringBuffer();
		mCnt = matches ? matches.length : 0;
		vernier = 0;
		
		for(i = 0; i < mCnt; i++){
			aMatches = matches[i];
			if(aMatches.start > vernier){
				subStr = text.substring(vernier, aMatches.start);
				subStr = StringClass.encodeHtml(subStr, undefined, can);
				rpSeg.append(subStr);
				
				subStr = text.substr(aMatches.start, aMatches.length);
				subStr = StringClass.encodeHtml(subStr, undefined, can);
				subStr = "<span class=\"" + className + "\">" + subStr + "</span>";
				rpSeg.append(subStr);
				
				vernier = aMatches.start + aMatches.length;

			}else if(aMatches.start == vernier){
				subStr = text.substr(aMatches.start, aMatches.length);
				subStr = StringClass.encodeHtml(subStr, undefined, can);
				subStr = "<span class=\"" + className + "\">" + subStr + "</span>";
				rpSeg.append(subStr);
				
				vernier = aMatches.start + aMatches.length;
			}else{
				//Error
			}
		}
		
		if(vernier <= text.length){
			subStr = text.substr(vernier);
			subStr = StringClass.encodeHtml(subStr, undefined, can);
			rpSeg.append(subStr);
		}

		this.view.innerHTML = rpSeg.toString();
		rpSeg = null;
	};

	var _hasEnter = function(){
		var text = this.def.text;
		return text && text.length > 0 && text.indexOf("\n") >= 0;
	};

	/**
	 * @method
	 * @inheritdoc js.awt.Component#doLayout
	 */
	thi$.doLayout = function(){
		if($super(this)){
			if(!this.canWordwrap() && !_hasEnter.call(this)){
				this.view.style.lineHeight = DOM.innerHeight(this.view) + "px";
			}

			return true;			
		}

		return false;

	}.$override(this.doLayout);
	
	thi$._init = function(def, Runtime) {
		if(def == undefined) return;

		def.classType = def.classType || "js.awt.Label";
		def.className = def.className || "jsvm_label";
		def.wordwrap = (def.wordwrap === true);

		def.css = (def.css || "") + "margin:0px;" 
			+ (def.wordwrap ? "white-space:normal;" : "white-space:nowrap;");

		def.text = (typeof def.text == "string") ? def.text : "Label";
		def.viewType = "SPAN";

		$super(this);
		
		this.setText(this.def.text, true);
		this.setEditable(this.def.editable);

	}.$override(this._init);
	
	this._init.apply(this, arguments);

}.$extend(js.awt.Component);

