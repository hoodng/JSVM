/**
 * Copyright (c) Jinfonet Inc. 2000-2013, All rights reserved.
 * 
 * File: CrossWinInteractive.js
 * Create: 2014/09/02 05:17:37
 * Author: mingfa.pan@china.jinfonet.com
 */

$package("com.jinfonet");

$import("com.jinfonet.CrossWinMessage");

/**
 * @fileOverview Define a interface for the application which can support
 * the cross-window interaction.
 */

/**
 * @class com.jinfonet.CrossWinInteractive
 */
com.jinfonet.CrossWinInteractive = function(){
    var CLASS = com.jinfonet.CrossWinInteractive,
    thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, 
    System = J$VM.System, MQ = J$VM.MQ,

    JConstant = Class.forName("com.jinfonet.JConstant"),
    CrossWinMessage = Class.forName("com.jinfonet.CrossWinMessage");

    /**
     * Pure the specified object as the valid, pure cross-document messaging
     * object.
     * 
     * ?? Whether to handle the each element in the array
     */
    thi$.pureCrossDocMsgObj = function(obj){
        // Skip String, Number, Array
        if(!obj || (typeof obj != "object") || Class.isArray(obj)){
            return obj;
        }

        if(Class.isPureObject(obj)){
            for(var p in obj){
                obj[p] = this.pureCrossDocMsgObj(obj[p]);
            }

            return obj;

        }else{ // Function, Class instance
            return obj.toString();
        }
    };

    /**
     * Return the header of the cross-window message which is used to
     * indicate where or who post the message.
     */
    thi$.getMsgHeader = function(){
        // Implements by subclass is need.
        return null;
    };

    /**
     * Construct and return a cross-window message with the specified
     * id and data.
     * 
     * @param {String} msgId Id of the message to create.
     * @param {Object} msgData Data info of the message to create.
     */
    thi$.getCrossWinMsg = function(msgId, msgData){
        var msg = new CrossWinMessage(msgId, msgData),
        header = this.getMsgHeader();

        if(header){
            msg.setMsgHeader(header);
        }

        return msg;
    };

    /**
     * Post the given cross-windwo message to the specified window
     * DOM object. If no window is given, post the msg to self.
     * 
     * @param {Window} win The target window DOM object.
     * @param {Object} msg The cross-window message to post.
     */
    thi$.postCrossWinMsg = function(win, msg){
        win = win || window.self;

        if(!win || !win.postMessage || !msg){
            return;
        }

        // For the cross-domain cases, the "win.location.href" is invalid. And some
        // "Uncaught SecurityError" error may be thrown.
        try{
            System.log.println("CrossWinInteractive.postCrossWinMsg - Post message: \'" 
                               + JSON.stringify(msg) + "\' \nTo: " + win.location.href);
        }catch(e){}

        MQ.post(msg.msgId || JConstant.CROSS_WIN_MSG, msg, [], win, 1);
        
        // var cwmsg = [msg.msgId || JConstant.CROSS_WIN_MSG, msg, [], null, 1];
        // if(J$VM.env.j$vm_isworker){
        //     win.postMessage(JSON.stringify(cwmsg));
        // }else{
        //     win.postMessage(JSON.stringify(cwmsg), "*");
        // }

    };

    /**
     * Post the given data to the specified window DOM object with the
     * given id.
     * 
     * @param {Window} win The target window DOM object.
     * @param {String} msgId Optional, id of the message to post.
     * @param {Object} msgData The data of message to post.
     */
    thi$.postMsgToWin = function(win, msgId, msgData){
        var msg = this.getCrossWinMsg(msgId, msgData);
        this.postCrossWinMsg(win, msg);
    };

    /**
     * Return the target device for the postMessage operation
     * according to the specified target identification. 
     * 
     * @param {String} target The given target identification.
     *        _self   : indicate the current window
     *        _parent : indicate parent of the current window
     *        _top    : indicate the top winodw of the current window
     *        other   : indicate the id or name of the target frame/iframe
     *                  in the parent window
     *       
     * If no any target string given, we will return the parent window
     * object.
     * 
     * @return {Window} The target window DOM object
     */    
    thi$.getTargetDevice = function(target){
        var pwin = window.parent, device;
        if(!Class.isString(target) || target.length == 0){
            return pwin;
        }
        
        switch(target){
        case "_self":
            device = window.self;
            break;
        case "_parent":
            device = window.parent;
            break;
        case "_top":
            device = window.top;
            break;
        default: // id or name of a frame
            pwin = window.parent;
            if(pwin && pwin !== self){
                try{
                    device = pwin.frames[target];
                } catch (x) {}
            }
            device = device || window.self;
            break;
        }
        
        return device;
    };

    /**
     * Post a cross-window message to the device indicated by the
     * given identification string.
     * 
     * @link #getTargetDevice
     * @link #postMsgToWin
     */
    thi$.postMsgByTarget = function(target, msgId, msgData){
        var device = this.getTargetDevice(target);
        this.postMsgToWin(device, msgId, msgData);
    };

    /**
     * Notify to parent window object of the iframe where the page with
     * current application is embedded in.
     * 
     * @link #postMsgToWin
     */
    thi$.postMsgToPwin = function(msgId, msgData){
        var device = window.parent;
        if(!device || device === self){
            return;
        }

        this.postMsgToWin(device, msgId, msgData);
    };

    /**
     * Judge whether the specified message is from the current application.
     */    
    thi$.isMsgFromSelf = function(e){
        var evt = e._event, source;
        if(evt){
            source = evt.source;
        }
        
        return source && (source === self);
    };

    /**
     * To feed back for the received message according to its feedback
     * information. If a published message is received by the current
     * application, we should register the listener to handle it and 
     * then feed back if the message need be fed back.
     * 
     * For example:
     *
     *     @example
     *     MQ.register("SampleFeedbackMsg", this, function(e){
     *                  // 1. Do something according to the message
     *                  // 2. Invoke the feedback function
     *                  var evt = e._event,
     *                  win = evnt ? evt.source : null;
     * 
     *                  this.feedback(win, e.message, {});
     *              });
     * 
     * @param {Window} win The target window DOM object.
     * @param {CrossWinMessage} msg The received message.
     * @param {Object} info The info to feed back.
     */ 
    thi$.feedback = function(device, msg, info){
        if(!msg || msg.needFeedback !== true){
            return;
        }
        
        var feedback = msg.feedback || {};
        device = device || this.getTargetDevice(feedback.target);
        this.postMsgToWin(device, feedback.msgId, info);
    };

};

