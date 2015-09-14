/**

 Copyright 2007-2015, The JSVM Project.
 All rights reserved.

 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
 */

$package("js.awt");

$import("js.awt.Container");

js.awt.Desktop = function (Runtime){

    var CLASS = js.awt.Desktop, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ =J$VM.MQ, R;

    this.onresize = function(e){
        System.updateLastAccessTime();
        $super(this);
        this.LM.clearStack(e);
        for(var appid in apps){
            this.getApp(appid).fireEvent(e);
        }
    }.$override(this.onresize);

    var _onkeyevent = function(e){
        System.updateLastAccessTime();
        MQ.post("js.awt.event.KeyEvent", e);
    };

    var drags = {}, lasts ={};
    
    var _onmousemove = function(e){
        var ele, target, drag, last, now, spot;
        System.updateLastAccessTime();

        last = lasts[e.pointerId] || 0;
        if((e.getTimeStamp().getTime() - last) <=
                System.getProperty("j$vm_threshold", 15)){
            e.cancelBubble();
            return e.cancelDefault();
        }

        ele = e.srcElement;
        target = e.getEventTarget();
        drag = drags[e.pointerId];
        if(!drag){
            if(target && target != this){
                if(target.isMovable() || target.isResizable()){
                    spot = target.spotIndex(ele, e.eventXY());
                    DOM.setDynamicCursor(ele, DOM.getDynamicCursor(spot));
                }else{
                    DOM.setDynamicCursor(ele, null);
                }

                target.fireEvent(e, true);
            }
        }else{
            if(!this._local.notified){
                MQ.post(Event.SYS_EVT_MOVING, "");
                this._local.notified = true;
            }

            DOM.setDynamicCursor(ele, DOM.getDynamicCursor(drag.spot));
            
            if(drag.spot >= 8){
                drag.target.processMoving(e);
            }else{
                drag.target.processSizing(e, drag.spot);
            }
        }

        lasts[e.pointerId] = new Date().getTime();
        e.cancelBubble();
        return e._default;
    };

    var _onmouseover = function(e){
        var ele, target, drag;

        ele = e.srcElement;
        target = e.getEventTarget();
        drag = drags[e.pointerId];
        if(!drag){
            if(target && target != this){
                target.fireEvent(e, true);
            }
        }
        e.cancelBubble();
        return e._default;
    };

    var _onmouseout = function(e){
        var ele, target, drag;

        ele = e.srcElement;
        target = e.getEventTarget();
        drag = drags[e.pointerId];
        if(!drag){
            if(target && target != this){
                target.fireEvent(e, true);
            }

            ele = e.fromElement;
            if(ele){
                DOM.setDynamicCursor(ele, null);
            }
        }
        e.cancelBubble();
        return e._default;
    };

    var _onmousedown = function(e){
        var ele, target, spot;
        System.updateLastAccessTime();        
        this.LM.cleanLayers(e, this);

        ele = e.srcElement;
        target = e.getEventTarget();
        if(target && target != this){
            target.fireEvent(e, true);

            if(e.button === 1 && !e.ctrlKey && !e.shiftKey &&
               (target.isMovable() || target.isResizable())){
                spot = target.spotIndex(ele, e.eventXY());
                if(spot >= 0){
                    var mover = target.getMovingConstraints(),
                        longpress = mover.longpress;
                    longpress = Class.isNumber(longpress) ? longpress :
                        J$VM.env["j$vm_longpress"] || 145;

                    _drag.$delay(this, longpress, e.pointerId, {
                        event: e,
                        absXY: e.eventXY(),
                        srcElement: ele,
                        target: target,
                        spot: spot
                    });
                }
            }
        }

        e.cancelBubble();
        return e._default;
    };

    var _drag = function(id, drag){
        drags[id] = drag;
        if(drag.spot >= 8){
            drag.target.startMoving(drag.event);
        }else{
            drag.target.startSizing(drag.event, drag.spot);
        }
    };

    var _onmouseup = function(e){
        var ele, target, drag;
        System.updateLastAccessTime();
        _drag.$clearTimer();

        ele = e.srcElement;
        target = e.getEventTarget();
        drag = drags[e.pointerId];
        if(!drag){
            if(target && target != this){
                target.fireEvent(e, true);
            }
        }else{
            MQ.post(Event.SYS_EVT_MOVED, "");
            this._local.notified = false;

            if(drag.spot >= 8){
                drag.target.endMoving(e);
            }else{
                drag.target.endSizing(e, drag.spot);
            }
        }

        drags[e.pointerId] = null;
        DOM.setDynamicCursor(ele, null);

        e.cancelBubble();
        return e._default;
    };

    var _onmousewheel = function(e){
        System.updateLastAccessTime();        
        this.LM.cleanLayers(e, this);
    };

    var _oncontextmenu = function(e){
        e.cancelBubble();
        return e.cancelDefault();
    };
    
    var _onclick = function(e){
        var ele, target, drag;

        ele = e.srcElement;
        target = e.getEventTarget();
        drag = drags[e.pointerId];
        if(!drag){
            if(target && target != this){
                target.fireEvent(e, true);
            }
        }
        e.cancelBubble();
        return e._default;
    };
    
    var _onmessage = function(e){
        var _e = e.getData();
        if(_e.source == self) return;

        var msg;
        try{
            msg = JSON.parse(_e.data);
        } catch (x) {
        }

        if(Class.isArray(msg)){
            e.message = msg[1];
            MQ.post(msg[0], e, msg[2], null, msg[4]);
        }
    };

    var _onhtmlevent = function(e){
        var target;
        target = e.getEventTarget();
        if(target){
            target.fireEvent(e, false);
        }
        e.cancelBubble();
        return e._default;
    };

    var apps = {};

    thi$.getApps = function(){
        return apps;
    };
    
    thi$.getApp = function(id){
        return apps[id];
    }

    thi$.registerApp = function(id, app){
        apps[id] = app;
    };

    thi$.unregisterApp = function(id){
        delete apps[id];
    };
    
    thi$.showCover = function(b, style){
        $super(
            this, b, style || "jsvm_desktop_mask");
        if(b){
            // The desktop's cover should be below the first-level dialog.
            // Assume that at most five levels dialogs can be opened.
            //this.setCoverZIndex(_getMaxZIndex.call(this)+1);
            this.setCoverZIndex(this.DM.def.zbase - 5);
        }
    }.$override(this.showCover);

    
    var _getMaxZIndex = function(){
        var children = this.view.children, zIndex = 0, tmp, e;
        for(var i=0, len=children.length; i<len; i++){
            e = children[i];
            tmp = parseInt(DOM.currentStyles(e, true).zIndex);
            tmp = Class.isNumber(tmp) ? tmp : 0;
            zIndex = Math.max(zIndex, tmp);
        }
        return zIndex;
    };

    var styles = ["jsvm.css"];
    /**
     * @param files {Array} Array of style file names
     */
    thi$.registerStyleFiles = function(files){
        if(Class.isArray(files)){
            for(var i=0, len=files.length; i<len; i++){
                styles.push(files[i]);
            }

            this.updateTheme(R.theme());
        }
    };

    thi$.updateTheme = function(theme, old){
        for(var i=0, len=styles.length; i<len; i++){
            this.updateThemeCSS(theme, styles[i]);
        }
        this.applyCSS();
        this.updateThemeImages(theme, old);
    };

    var IMGSREG = /images\//gi;
    
    thi$.updateThemeCSS = function(theme, file){
        var stylePath = DOM.makeUrlPath(J$VM.j$vm_home, "../style/" + theme + "/"),
            styleText = Class.getResource(stylePath + file, true);

        styleText = styleText.replace(IMGSREG, stylePath+"images/");
        this.applyCSSCode(file, styleText);
    };

    thi$.updateThemeLinks = function(theme, old, file){
        var dom = self.document, links, link, src, path, found;
        
        path = DOM.makeUrlPath(J$VM.j$vm_home,
                               "../style/"+ old +"/");

        links = dom.getElementsByTagName("link");
        for(var i=0, len=links.length; i<len; i++){
            link = links[i];
            src = decodeURI(link.href);
            if (src && src.indexOf(path) != -1){
                src = src.replace(old, theme);
                link.href = src;
                found = true;
            }
        }

        if(!found){
            link = dom.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = DOM.makeUrlPath(J$VM.j$vm_home,
                                        "../style/"+theme+"/"+file);
            DOM.insertBefore(link, dom.getElementById("j$vm"));
        }
    };

    thi$.updateThemeImages = function(theme, old){
        var dom = self.document, links, link, src, path;
        
        path = DOM.makeUrlPath(J$VM.j$vm_home,
                               "../style/"+ old +"/images/");
        
        links = dom.getElementsByTagName("img");
        for(var i=0, len=links.length; i<len; i++){
            link = links[i];
            src = decodeURI(link.src);
            if (src && src.indexOf(path) != -1){
                src = src.replace(old, theme);
                link.src = src;
            }
        }
    };

    thi$.cssIds = [];
    thi$.cssCodes = {};
    /**
     * Apply a stylesheet with id and css code
     * 
     * @param id {String} id of the style tag
     * @param css {String} CSS code
     */
    thi$.applyCSSCode = function(id, css){
        var sheets = this.cssIds, set = this.cssCodes;

        if(set[id] === undefined){
            sheets.push(id);
        }
        set[id] = css;
    };

    thi$.applyCSS = function(){
        var styleSheet, sheets=this.cssIds,
            set = this.cssCodes, buf, css;
        
        styleSheet = DOM.getStyleSheetBy("j$vm-css");

        buf = [];
        for(var i=0, len=sheets.length; i<len; i++){
            buf.push(set[sheets[i]]);
        }
        css = buf.join("\r\n");

        styleSheet.applyCSS(css);
    };
    
    /**
     * @see js.awt.Component
     */
    thi$.destroy = function(){
        var id, app;
        for(id in apps){
            app = apps[id];
            app.closeApp();
            app.destroy();
        }
        apps = null;

        this.DM.destroy();
        this.DM = null;

        this.LM.destroy();
        this.LM = null;

        $super(this);

    }.$override(this.destroy);

    thi$._init = function(Runtime){
        var dom = self.document, body = dom.body,        
            def = {
                classType: "js.awt.Desktop",
                id: body.id,
                uuid: "desktop",
                zorder:true,
                stateless: true,            
                zbase:1,
                __contextid__: Runtime.uuid()
            };

        $super(this, def, Runtime, body);

        // Popup Layer manager
        var LM = this.LM = new js.awt.LayerManager(
            {classType: "js.awt.LayerManager",
             id: body.id,
             uuid: "layer-manager", 
             zorder:true,
             stateless: true,
             zbase: 10000
            }, Runtime, body);

        // Popup dialog manager
        var DM = this.DM = new js.awt.Container(
            {classType: "js.awt.Container",
             id: body.id,
             uuid: "dialog-manager",
             zorder:true,
             stateless: true,
             zbase: 1000
            }, Runtime, body);

        DM.destroy = function(){
            this.removeAll(true);

        }.$override(DM.destroy);

        var styleText = Class.getResource(
            J$VM.j$vm_home + "../style/jsvm_reset.css", true);
        this.applyCSSCode("jsvm_reset.css", styleText);

        _bindEvents.call(this);

        R = Runtime;

    }.$override(this._init);

    var _bindEvents = function(){
        var dom = self.document,
            EVENTS = [
                [self, Event.W3C_EVT_RESIZE,        this.onresize],
                [self, Event.W3C_EVT_MESSAGE,       _onmessage],

                [dom,  Event.W3C_EVT_KEY_DOWN,      _onkeyevent],
                [dom,  Event.W3C_EVT_KEY_UP,        _onkeyevent],
            
                [dom,  Event.W3C_EVT_MOUSE_MOVE,    _onmousemove],
                [dom,  Event.W3C_EVT_MOUSE_OVER,    _onmouseover],
                [dom,  Event.W3C_EVT_MOUSE_OUT,     _onmouseout],   
                [dom,  Event.W3C_EVT_MOUSE_DOWN,    _onmousedown],
                [dom,  Event.W3C_EVT_MOUSE_UP,      _onmouseup],
                [dom,  Event.W3C_EVT_MOUSE_CLICK,   _onclick],
                [dom,  Event.W3C_EVT_MOUSE_DBCLICK, _onclick],        
                [dom,  Event.W3C_EVT_MOUSE_WHEEL,   _onmousewheel],
                [dom,  Event.W3C_EVT_CONTEXTMENU,   _oncontextmenu],

                [dom,  Event.SYS_EVT_ELE_APPEND,    _onhtmlevent]
              //[dom,  Event.SYS_EVT_ELE_REMOVED,   _onhtmlevent],
              //[dom,  Event.SYS_EVT_ELE_POSITION,  _onhtmlevent],
              //[dom,  Event.SYS_EVT_ELE_SIZE,      _onhtmlevent],
              //[dom,  Event.SYS_EVT_ELE_ZINDEX,    _onhtmlevent],
              //[dom,  Event.SYS_EVT_ELE_ATTRS,     _onhtmlevent],
              //[dom,  Event.SYS_EVT_ELE_STYLE,     _onhtmlevent]        
            ], item;

        for(var i=0, len=EVENTS.length; i<len; i++){
            item = EVENTS[i];
            Event.attachEvent(item[0], item[1], 0, this, item[2]);
        }
    };

    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

