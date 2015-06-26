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

/**
 * @class J$VM
 * Define J$VM name-space and run-time environment
 * @singleton
 */
(function(){
    js.lang.Object.$decorate(this);

    /**
     * @property {String} ie
     * If browser is IE, this property is version of IE.
     */

    /**
     * @property {String} firefox
     * If browser is Firefox, this property is version of Firefox.
     */

    /**
     * @property {String} chrome
     * If browser is Chrome, this property is version of Chrome.
     */

    /**
     * @property {String} safari
     * If browser is Safari, this property is version of Safari.
     */

    /**
     * @property {String} opera
     * If browser is Opera, this property is version of Opera.
     */
    // Check browser type
    // Ref: User Agent (http://msdn.microsoft.com/en-us/library/ie/ms537503(v=vs.85).aspx)
    // Ref: Trident token (http://msdn.microsoft.com/library/ms537503.aspx)
    var ua = navigator.userAgent.toLowerCase(), ieTridents, trident, s, b;
    if("ActiveXObject" in self){
        // ierv: The revision token indicates the version of IE.
        // It can be affected by the current document mode of IE.
        b = (s = ua.match(/msie ([\d.]+)/)) ? this.ierv = s[1] :
            (s = ua.match(/rv:([\d.]+)/)) ? this.ierv = s[1] : 0;

        // ie: Indicate the really version of current IE browser.
        // Up to now, no any other user-defined can affect it.
        ieTridents = {"trident/7.0": 11, "trident/6.0": 10, "trident/5.0": 9, "trident/4.0": 8};
        trident = (s = ua.match(/(trident\/[\d.]+)/)) ? s[1] : undefined;
        this.ie = ieTridents[trident] || this.ierv;
    }else{
        b = (s = ua.match(/firefox\/([\d.]+)/)) ? this.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? this.chrome = s[1] :
            (s = ua.match(/opera.([\d.]+)/)) ? this.opera = s[1] :
            (s = ua.match(/version\/([\d.]+).*safari/)) ? this.safari = s[1] : 0;
    }

    // Support J$VM system properties which are from URL
    var env = this.env, uri = env.uri = new js.net.URI(location.href),
        params = uri.params, value, tmp, p;
    for(p in params){
        if(p.indexOf("j$vm_") == 0){
            value = params[p], tmp = parseInt(value);
            value = isNaN(tmp) ?
                (value === "true" ? true :
                 (value === "false" ? false : value)) : tmp;

            env[p] = value;
        }
    }

    // Initialize global variables
    /**
     * @member J$VM
     * @property {js.lang.System}
     */
    this.System = new js.lang.System(env, this);

    // Global functions for Flash
    /**
     * @member window
     * @method
     * Post message use J$VM message system
     * See also {@link J$VM.MQ#post}
     */
    $postMessage = J$VM.MQ.post;
    /**
     * @member window
     * @method
     * Send message use J$VM message system
     * See also {@link J$VM.MQ#send}
     */
    $sendMessage = J$VM.MQ.send;

    /**
     * @member J$VM
     * @method
     * Attach an event to an object.
     *
     * See also {@link js.util.Event#attachEvent}
     */
    this.$attachEvent = js.util.Event.attachEvent;

    /**
     * @member J$VM
     * @method
     * Detach an event from an object.
     *
     * See also {@link js.util.Event#detachEvent}
     */
    this.$detachEvent = js.util.Event.detachEvent;

    // Defined some speparaters for js code
    this.SPE1 = "RR2kfidRR";
    this.SPE2 = "RR3uiokRR";
    
    // Load the third party library from classpath
    var home = env.j$vm_home, file,
        libs = env.j$vm_classpath ? env.j$vm_classpath.split(";") : [];
    if(self.JSON == undefined){
        this.Class.loadScript(home+"lib/json2.jz");
    }

    (function(file){
        if(file.length === 0) return;
        this.Class.loadClass(home + file);
    }).$forEach(this, libs);

}).call(self.J$VM);

