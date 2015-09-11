/**

 Copyright 2010-2011, The JSVM Project.
 All rights reserved.

 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

/**
 * The <code>Thread</code> for easily using Web Worker, and for the
 * IE8/9 use a iframe simulate Web Worker
 *
 * Runnable :{
 *     context: xxx,
 *     run : function
 * }
 *
 */
js.lang.Thread = function(Runnable){

    var CLASS = js.lang.Thread, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event,
        System = J$VM.System, MQ = J$VM.MQ;

    var _onmessage = function(e){
        var evt = e.getData(), data;
        if(evt.source == self) return;

        try{
            data = JSON.parse(evt.data);
        } catch (x) {
            data = evt.data;
        }

        if(Class.isArray(data)){
            // [msgId, msgData, [recvs], null, pri]

            switch(data[0]){
            case Event.SYS_MSG_CONSOLEINF:
                System.out.println(data[1]);
                break;
            case Event.SYS_MSG_CONSOLEERR:
                System.err.println(data[1]);
                break;
            case Event.SYS_MSG_CONSOLELOG:
                System.log.println(data[1]);
                break;
            default:
                var fun = "on"+data[0];
                if(typeof this[fun] == "function"){
                    this[fun](data[1]);
                }
            }
        }else{
            if(typeof this.onmessage == "function"){
                this.onmessage(data);
            }
        }
    };

    var _onerror = function(e){
        var evt = e.getData(), data;
        if(evt.source == self) return;
        System.err.println(evt.data);
    };

    /**
     * Submit new task to the thread
     *
     * @param task It should be a <code>Runnable</code> or a
     * <code>context</code> in <code>Runnable</code>
     * @param isRunnable indicates whether the first parameter "task"
     * is a <code>Runnable</code>
     */
    thi$.submitTask = function(task, isRunnable){
        if(task == undefined || task == null) return;
        isRunnable = isRunnable || false;

        var context, run, worker = this._worker;
        if(isRunnable){
            context = task.context;
            run = task.run;
        }else{
            context = task;
            run = this._runnable.run;
        }

        var buf = new js.lang.StringBuffer();
        buf.append("var thi$ = {");
        buf.append("context:").append(JSON.stringify(context));
        buf.append(",run:").append(run);
        buf.append("}");

        var msg = buf.toString();
        //System.err.println("Thread post msg: "+msg);
        if(this._realWorker === true){
            worker.postMessage(msg);
        }else{
            // IE must
            worker.postMessage(msg, "*");
        }

    };

    /**
     * Start the thread
     */
    thi$.start = function(){
        this.submitTask(this._runnable, true);
    };

    /**
     * Stop the thread
     */
    thi$.stop = function(){
        if(this._worker.terminate){
            this._worker.terminate();
        }else{
            // For the iframe worker, what should be we do ?
        }
    };

    thi$._init = function(Runnable){
        this._runnable = Runnable || {
            context:{},

            run:function(){
                J$VM.System.out.println("Web Worker is running");
            }};
              
        var path = J$VM.j$vm_home + "classes/js/util/",
            worker_url = path + "Worker.jz?__="+J$VM.__version__; 
        if(self.Worker){
            try {
                this._worker = new Worker(worker_url);
                this._realWorker = true;
            }catch(ex){
                var code = Class.getResource(worker_url), codeBlob, codeUrl;
                code = code.replace("../../../", J$VM.j$vm_home);
                codeBlob = new Blob([code], {type:"text/javascript"});
                codeUrl  = self.URL.createObjectURL(codeBlob);
                this._worker = new Worker(codeUrl);
                self.URL.revokeObjectURL(codeUrl);
                this._realWorker = true;
            }
        }else{
            // iframe ?
            var iframe = document.createElement("iframe");
            iframe.style.cssText = "visibility:hidden;border:0;width:0;height:0;";
            document.body.appendChild(iframe);
            var text = new js.lang.StringBuffer();
            text = text.append("<!DOCTYPE html>\n<html><head>")
                .append("<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>")
                .append("</head></html>").toString();

            var doc = iframe.contentWindow.document, head, script;
            doc.open();
            doc.write(text);
            doc.close();

            head = doc.getElementsByTagName("head")[0];
            text = Class.getResource(J$VM.j$vm_home+"jsre.js", true);
            script = doc.createElement("script");
            script.type = "text/javascript";
            script.id = "j$vm";
            // Becase we don't use src to load the iframe, but the J$VM will use
            // "src" attribute to indicates j$vm home. So we use a special attribute
            // name "crs" at here. @see also js.lang.System#_buildEnv
            script.setAttribute("crs",J$VM.j$vm_home);
            script.setAttribute("classpath","");
            script.text = text;
            text = Class.getResource(path + "Worker.jz", true);
            script.text += text;
            head.appendChild(script);
            head.removeChild(script);

            this._worker = iframe.contentWindow;
            this._realWorker = false;
        }

        Event.attachEvent(this._worker, Event.W3C_EVT_MESSAGE, 0, this, _onmessage);
        Event.attachEvent(this._worker, Event.W3C_EVT_ERROR, 0, this, _onerror);

    };

    this._init.apply(this, arguments);

}.$extend(js.lang.Object);
