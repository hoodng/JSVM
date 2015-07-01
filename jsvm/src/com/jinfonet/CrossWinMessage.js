/**
 * Copyright (c) Jinfonet Inc. 2000-2013, All rights reserved.
 * 
 * File: CrossWinMessage.js
 * Create: 2014/02/27 09:35:58
 * Author: mingfa.pan@china.jinfonet.com
 */

$package("com.jinfonet");

/**
 * Defined the format of the cross-window messages for exchanging informations
 * between different windows.
 * 
 * @param msgId: {String} Optional. ID of the cross-window message.
 * @param msgData: {Object} Runtime data of the cross-window message.
 * 
 */
com.jinfonet.CrossWinMessage = function(msgId, msgData){
	var CLASS = com.jinfonet.CrossWinMessage,
	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, System = J$VM.System,
	JConstant = Class.forName("com.jinfonet.JConstant");
	
	thi$.setMsgID = function(msgId){
		this.msgId = (Class.isString(msgId) && msgId.length > 0) 
			? msgId : JConstant.CROSS_WIN_MSG;
	};
	
	thi$.setMsgHeader = function(header){
		this.header = header;
	};

	/**
	 * Set the data as the body of current cross-window msg.
	 */ 
	thi$.setMsgData = function(data){
		this.body = data;  
	};

	/**
	 * Specify whether the current cross-window msg need be fed back.
	 * Default is false.
	 */ 
	thi$.needFeedback = function(b){
		this.needFeedback = (b === true);
	};
	
	thi$.isFeedbackNeed = function(){
		return this.needFeedback;  
	};
	
	/**
	 * Specify the info of the feedback cross-window msg. Ignore it if 
	 * no need be fed back. The complete format of feedback should 
	 * include:
	 *	   msgId : {String} Id of the cross-window msg
	 *	   target: {String} The identification string of the target 
	 *			   device. Include "_self", "_parent", "_top" and
	 *			   other id / name of a frame inf the parent window.
	 * 
	 * @param info: {Object} The info of the feedback msg.
	 */
	thi$.setFeedbackInfo = function(info){
		this.feedback = info;  
	};

	thi$.toString = function(){
		var msg = {
			msgId: this.msgId,
			
			header: this.header,
			body: this.body,
			
			needFeedback: this.needFeedback,
			feedback: this.feedback
		};
		return JSON.stringify(msg);
	};
	
	thi$._init = function(msgId, msgData){
		this.setMsgID(msgId);
		
		if(msgData && Class.isObject(msgData)){
			this.setMsgData(msgData);
		}
	};
	
	this._init.apply(this, arguments);
	
}.$extend(js.lang.Object);

com.jinfonet.CrossWinMessage.newInstance = function(msg){
	if(!msg || (typeof msg !== "object")){
		msg = {};
	}
	
	return com.jinfonet.CrossWinMessage.$decorate(msg);
};
