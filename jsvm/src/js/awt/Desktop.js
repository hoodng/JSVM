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
        var ele, target, drag, last, now, spot, XY;
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
        XY = e.eventXY();
        if(!drag){
            if(target && target !== this){
                target.fireEvent(e, true);
            }
            
        }else{
            if(!this._local.notified){
                MQ.post(Event.SYS_EVT_MOVING, "");
                this._local.notified = true;
            }

            DOM.setDynamicCursor(ele, drag.spot);
            
            if(drag.spot >= 8){
                var hoverObj, parent, fmEle, moveObj, data;

                target = null;
                
                // For moving
                drag.target.processMoving(e);
                
                // For draging
                moveObj = drag.target.getMoveObject(e);
                data = moveObj.getMovingData();
                fmEle = moveObj.view.parentNode;
                parent = (fmEle === this.view) ? this : DOM.getComponent(fmEle);
                hoverObj = parent.elementFromPoint(XY.x, XY.y, [drag.target]);
                if(hoverObj){

                    if(drag.dropObj !== hoverObj){
                        fmEle = drag.dropObj ? drag.dropObj.view : null;

                        // drag leave
                        target = drag.dropObj;
                        if(target){
                            fireDragEvent(e, Event.W3C_EVT_DRAGLEAVE, data,
                                          target, fmEle, hoverObj.view);
                        }
                        
                        // drag enter
                        target = hoverObj;
                        if(target){
                            var dropTarget = target.getDropableTarget(XY.x, XY.y, data);
                            if(dropTarget){
                                fireDragEvent(e, Event.W3C_EVT_DRAGENTER, data,
                                              dropTarget, fmEle, hoverObj.view);
                            }
                        }
                        
                        drag.dropObj = hoverObj;
                    }

                    // drag over
                    target = target || hoverObj;
                    if(target){
                        var dropTarget = target.getDropableTarget(XY.x, XY.y, data);
                        if(dropTarget){
                            fireDragEvent(e, Event.W3C_EVT_DRAGOVER, data,
                                          dropTarget, drag.dropObj.view, hoverObj.view);
                        }
                    }
                }else if(drag.dropObj){
                    // drag leave
                    target = drag.dropObj;
                    if(target){
                        fireDragEvent(e, Event.W3C_EVT_DRAGLEAVE, data,
                                      target, target.view, null);
                    }
                    drag.dropObj = null;
                }
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
            if(target && target !== this){
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
            if(target && target !== this){
                target.fireEvent(e, true);
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
        if(target && target !== this){
            // Ref the old logic before v13.5, just to activate 
            // the current triggered component.
            if(target.activate){
                target.activate(e);
            }
            target.fireEvent(e, true);

            if(e.button === 1 && (target.isMovable() || target.isResizable())){
                spot = target.spotIndex(ele, e.eventXY());
                
                if(spot >= 0 && spot <= 8){
                    var mover = target.getMovingConstraints(),
                        longpress = mover.longpress;
                    longpress = Class.isNumber(longpress) ? longpress :
                        J$VM.env["j$vm_longpress"] || 250;

                    fireDragStart.$delay(this, longpress, e.pointerId, {
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

    var _onmouseup = function(e){
        var ele, target, drag, XY;
        System.updateLastAccessTime();
        fireDragStart.$clearTimer();

        ele = e.srcElement;
        target = e.getEventTarget();
        drag = drags[e.pointerId];
        XY = e.eventXY();
        
        if(!drag){
            if(target && target !== this){
                target.fireEvent(e, true);
            }
        }else{
            MQ.post(Event.SYS_EVT_MOVED, "");
            this._local.notified = false;

            if(drag.spot >= 8){
                var moveObj, data;
                target = drag.dropObj;
                moveObj = drag.target.getMoveObject(e);
                data = moveObj.getMovingData();
                
                drag.target.endMoving(e);
                
                // drag drop
                if(target){
                    var dropTarget = target.getDropableTarget(XY.x, XY.y, data);
                    if(dropTarget){
                        fireDragEvent(e, Event.W3C_EVT_DROP, data, dropTarget,
                                      dropTarget.view, dropTarget.view);
                    }
                }

                // drag end
                target = drag.target;
                fireDragEvent(e, Event.W3C_EVT_DRAGEND, data, target,
                              target.view, target.view);
                
            }else{
                drag.target.endSizing(e, drag.spot);
            }
        }

        drags[e.pointerId] = null;
        
        DOM.cleanDynamicCursor();

        e.cancelBubble();
        return e._default;
    };

    var fireDragStart = function(id, drag){
        var target, moveObj, data, e;

        // Hide mouse capturer;
        DOM.showMouseCapturer();

        drags[id] = drag;
        target = drag.target;
        e = drag.event;
        DOM.setDynamicCursor(drag.srcElement, drag.spot);
        
        if(drag.spot >= 8){
            target.startMoving(e);
            // drag start
            moveObj = target.getMoveObject(e);
            data = moveObj.getMovingData();
            fireDragEvent(e, Event.W3C_EVT_DRAGSTART, data, target,
                          target.view, target.view);
        }else{
            target.startSizing(e, drag.spot);
        }
    };

    var fireDragEvent = function(e, type, data, target, fmEle, toEle){
        var evt;
        evt = e.clone(type, data, target);
        evt.srcElement = evt.toElement = toEle;
        evt.fromElement= fmEle;
        target.fireEvent(evt, true);
    };

    var _onmousewheel = function(e){
        var ele, target;
        System.updateLastAccessTime();        
        this.LM.cleanLayers(e, this);

        ele = e.srcElement;
        target = e.getEventTarget();
        if(target && target !== this){
            target.fireEvent(e, true);
        }
        e.cancelBubble();
        return e._default;
    };

    var _oncontextmenu = function(e){
        var b = e.cancelDefault(),
        ele = e.srcElement,
        target = e.getEventTarget();

        if(target && target !== this){
            target.fireEvent(e, true);
        }

        e.cancelBubble();
        return b;
    };
    
    var _onclick = function(e){
        var ele, target, drag;

        ele = e.srcElement;
        target = e.getEventTarget();
        drag = drags[e.pointerId];
        if(!drag && target && target !== this){
            target.fireEvent(e, true);
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
            if("j$vm_activating" === msg[0]){
                // When user only active in an iframe, the outside 
                // J$VM also needs update last access time.
                System.updateLastAccessTime();
            }else{
                e.message = msg[1];
                MQ.post(msg[0], e, msg[2], null, msg[4]);
            }
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

    thi$.fireHtmlEvent = function(e){
        _onhtmlevent.call(this, e);
    };

    var apps = {}, appItems = [].$getLinkedList();

    thi$.getApps = function(){
        return apps;
    };
    
    thi$.getApp = function(id){
        return apps[id];
    };

    thi$.registerApp = function(id, app){
        if(!apps[id]){
            appItems.push(id);
        }
        apps[id] = app;
    };

    thi$.unregisterApp = function(id){
        appItems.remove(id);
        delete apps[id];
    };

    thi$.elementFromPoint = function(x, y, nothese){
        var i, comp, ret = null;

        ret = this.LM.elementFromPoint(x, y, nothese);
        if(ret) return ret;

        ret = this.DM.elementFromPoint(x, y, nothese);
        if(ret && (ret !== this.DM)) return ret;

        ret = null;
        for(i=appItems.length-1; i>=0; i--){
            comp = this.getApp(appItems[i]);
            ret = comp.elementFromPoint(x, y, nothese);
            if(ret) break;
        }
        return ret;
    }.$override(this.elementFromPoint);
    
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
		if(styleText && styleText.length !== 0){
	        styleText = styleText.replace(IMGSREG, stylePath+"images/");
	        this.applyCSSCode(file, styleText);
		}
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
             zbase: J$VM.DOM.LM_ZBASE
            }, Runtime, body);

        // Popup dialog manager
        var DM = this.DM = new js.awt.Container(
            {classType: "js.awt.Container",
             id: body.id,
             uuid: "dialog-manager",
             zorder:true,
             stateless: true,
             zbase: J$VM.DOM.DM_ZBASE
            }, Runtime, body);

        DM.destroy = function(){
            this.removeAll(true);

        }.$override(DM.destroy);

        var styleText = Class.getResource(
            J$VM.j$vm_home + "../style/jsvm_reset.css", true, {$:Math.uuid()});
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

        // Hide mouse capturer
        this.onmousemove = function(e){
            DOM.showMouseCapturer();
        };
    };

    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

