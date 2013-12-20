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
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.util");

js.util.Messenger = function (){
    var Q, running = false;
    
    /**
     * Subscribe a message to the receiver
     * 
     * @param msgId, the id uniquely identified a message type
     * @param recevier, the message receiver
     * @param handler, the handler of the receiver to handle the message 
     * 
     * @see cancel(msgId, receiver, handler)
     */
    this.register = function(msgId, receiver, handler){
        var recvs = this.table[msgId];
        if(recvs === undefined){
            recvs = js.util.LinkedList.newInstance([]);
            this.table[msgId] = recvs;
        }
        
        var recv = new js.util.EventListener(receiver, handler);
        if(!recvs.contains(recv)){
            recvs.push(recv);
        }
    };
    
    /**
     * Cancel a message subscribe
     * 
     * @param msgId, the id uniquely identified a message type
     * @param receiver, the message receiver
     * @param handler, the handler of the receiver to handle the message 
     * 
     * @see register(msgId, receiver, handler)
     */
    this.cancel = function(msgId, receiver, handler){
        var recvs = this.table[msgId];
        if(recvs === undefined) return;
        
        var recv = new js.util.EventListener(receiver, handler);
        var p = recvs.indexOf(recv);
        if(p != -1){
            recvs.remove0(p);
            if(recvs.length === 0){
                delete this.table[msgId];
            }
        }
    };
    
    /**
     * Remove all subscribes of the specified receiver 
     * 
     * @param receiverId, the id that uniquely identified a recevier
     */
    this.remove = function(receiverId){
        
        var indexOf = function(list, id){
            for(var i=0, len=list.length; i<len; i++){
                if(list[i].uuid() === id) return i;
            }
            return -1;
        };

        var table = this.table, recvs, idx, p;
        for(p in table){
            recvs = table[p];
            while((idx = indexOf(recvs, receiverId)) != -1){
                recvs.remove0(idx);
            }
            if(recvs.length == 0){
                delete this.table[p];
            }
        }
    };
    
    /**
     * Post a message to Messenger
     * Call this method, the message will be put in message queue 
     * and return immediately
     * 
     * @param msgId, the message id
     * @param msgData, the message content
     * @param recvs, specify who will receive this message
     * @param device, the id uniquely identified a J$VM
     * @param priority, 0 for urgent and 1 for grneral message
     */
    this.post = function(msgId, msgData, recvs, device, priority){
        // We store the message as [msgId, msgData, recvs, device, priority]
        var msg = [msgId, msgData, 
                   js.lang.Class.typeOf(recvs) === "array" ? recvs : [],
                   device === undefined ? null : device,
                   priority === 0 ? 0 : (priority === 1 ? 1 : 1)];

        Q[msg[4]].push(msg);

        if(!running){
            _schedule();
        }
    };
    
    var _schedule = function(){
        if(Q.isEmpty()){
            running = false;
        }else{
            running = true;
            _dispatch.$delay(this, 0);
        }
    }.$bind(this);
    
    var _dispatch = function(){
        var msg = Q.get();
        if(js.lang.Class.typeOf(msg) != "array"){
            _schedule();
            return;
        }

        var device = msg[3], g, 
            recvs = this.table[msg[0]], recv;
        
        if(device != null){
            // Forward to other device
            msg[3] = null;
            if(J$VM.env.j$vm_isworker){
                device.postMessage(JSON.stringify(msg));
            }else{
                device.postMessage(JSON.stringify(msg), "*");    
            }

        }else if(recvs != undefined && recvs.length > 0){

            for(var i=0, len=msg[2].length; i<len; i++){
                if(g === undefined) g = {};
                g[msg[2][i]] = true;
            }
            
            for(i=0, len=recvs.length; i<len; i++){
                recv = recvs[i];

                if(g != undefined){
                    if(g[recv.uuid()]){
                        recv.handleEvent.$delay(recv, 0, msg[1]);
                    }
                }else{
                    recv.handleEvent.$delay(recv, 0, msg[1]);
                }
            }
            
        }

        _schedule();

    }.$bind(this);
    
    /**
     * Send a message to other subscribers
     * Call this method will be blocked to all reltated subscribers 
     * handle the message.
     * 
     * @see post(msgId, msgData, recvs, device, priority)
     */
    this.send = function(msgId, msgData, rcvs, device, priority){
        priority = priority === 0 ? 0 : (priority === 1 ? 1 : 1),
        device = device === undefined ? null : device,
        rcvs = js.lang.Class.typeOf(rcvs) === "array" ? rcvs : [];
        
        var recvs = this.table[msgId], recv, g;
        
        if(device != null){
            // Forward to other device
            if(J$VM.env.j$vm_isworker){
                device.postMessage(JSON.stringify(
                    [priority, null, rcvs, msgId, msgData]));
            }else{
                device.postMessage(JSON.stringify(
                    [priority, null, rcvs, msgId, msgData]), "*");    
            }

            // There are some issues at here ! Can not send message cross device

        }else if(recvs != undefined && recvs.length > 0){

            for(var i=0, len=rcvs.length; i<len; i++){
                if(g === undefined) g = {};
                g[rcvs[i]] = true;
            }
            
            for(i=0, len=recvs.length; i<len; i++){
                recv = recvs[i];
                
                if(g != undefined){
                    if(g[recv.uuid()]){
                        recv.handleEvent(msgData);    
                    }
                    
                }else{
                    recv.handleEvent(msgData);
                }
            }
        }
    };
    
    var _init = function(){

        // Subscribe infomation
        this.table = {};
        
        // Message queue for post
        Q = [[],[]];
        Q.isEmpty = function(){
            return (this[0].length + this[1].length) == 0;
        };
        Q.get = function(){
            var o = this[0].shift();
            o = (o === undefined) ? this[1].shift() : o;
            return o;
        };

        _schedule();

    }.call(this);

}.$extend(js.lang.Object);
