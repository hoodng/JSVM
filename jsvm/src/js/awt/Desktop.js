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


    var _activateComponent = function(target, uuid){
        if(!target) return;

        if(target.activateComponent){
            target.activateComponent();
        }
    };

    var _notifyLM = function(e){
        if(e){
            var el = e.srcElement, target = e.getEventTarget(),
                uuid = el ? el.uuid : undefined;
            this.LM.cleanLayers(e, this);
            _activateComponent(target, uuid);
        }
        return true;
    };

    var _notifyComps = function(msgid, e){
        var comps = this.getAllComponents(),
            len = comps ? comps.length : 0,
            i, comp, recs = [];

        for(i = 0; i < len; i++){
            comp = comps[i];
            recs.push(comp.uuid());
        }

        if(recs.length > 0){
            MQ.post(msgid, e, recs);
        }
    };

    var bodyW, bodyH;
    var _onresize = function(e){
        System.updateLastAccessTime();

        var bounds = DOM.getBounds(document.body), evt;
        if(bounds.width != bodyW || bounds.height != bodyH){
            evt = new Event(Event.W3C_EVT_RESIZE,
                            {owidth: bodyW, oheight: bodyH,
                             width: bounds.width, height: bounds.height});
            
            _notifyComps.call(this, "js.awt.event.WindowResized", evt);

            this.LM.clearStack(e);

            bodyW = bounds.width;
            bodyH = bounds.height;

            for(var appid in apps){
                this.getApp(appid).fireEvent(e);
            }
        }
    };

    var _onkeyevent = function(e){
        System.updateLastAccessTime();
        MQ.post("js.awt.event.KeyEvent", e);
    };

    var _onmouseevent = function(e){
        var ele = e.srcElement, target = DOM.getEventTarget(ele),
            type = e.getType(), XY;

        System.updateLastAccessTime();
        if(type === Event.W3C_EVT_MOUSE_WHEEL){
            _notifyLM.call(this, e);
        }
        
        if(!target) return true;
        
        switch(type){
            case Event.W3C_EVT_MOUSE_MOVE:
            var cursor = target.getCursor(ele, e.eventXY(), null);
            System.err.println("cursor: "+cursor);
            DOM.setCursor(ele, cursor);
            break;
            case Event.W3C_EVT_MOUSE_OVER:

            break;
            case Event.W3C_EVT_MOUSE_OUT:
            //DOM.setCursor(ele);
            break;
            case Event.W3C_EVT_MOUSE_DOWN:
            target.fireEvent(e, true);
            return e.cancelDefault();
            break;
            case Event.W3C_EVT_MOUSE_UP:
            target.fireEvent(e, true);
            return e.cancelDefault();
            break;
            case Event.W3C_EVT_MOUSE_WHEEL:
            break;
            case Event.W3C_EVT_CONTEXTMENU:
            break;
            default:
            break;
        }
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
        arguments.callee.__super__.call(
            this, b, style || "jsvm_desktop_mask");
        if(b){
            this.setCoverZIndex(_getMaxZIndex.call(this)+1);
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
            link.href = DOM.makeUrlPath(J$VM.j$vm_home, "../style/"+theme+"/"+file);
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
     * @see js.awt.BaseComponent
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

        arguments.callee.__super__.apply(this, arguments);

    }.$override(this.destroy);

    thi$._init = function(Runtime){
        var dom = self.document, body = dom.body,        
            def = {
                classType: "js.awt.Desktop",
                className: body.className,
                id: body.id,
                uuid: "desktop",
                zorder:true,
                stateless: true,            
                zbase:1,
                __contextid__: Runtime.uuid()
            };

        arguments.callee.__super__.apply(this, [def, Runtime, body]);

        // Popup Layer manager
        var LM = this.LM = new js.awt.LayerManager(
            {classType: "js.awt.LayerManager",
             className: body.className,
             id: body.id,
             zorder:true,
             stateless: true,
             zbase: 10000
            }, Runtime, body);

        // Popup dialog manager
        var DM = this.DM = new js.awt.Container(
            {classType: "js.awt.Container",
             className: body.className,
             id: body.id,
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
        
        Event.attachEvent(self, Event.W3C_EVT_RESIZE, 0, this, _onresize);
        Event.attachEvent(self, Event.W3C_EVT_MESSAGE,0, this, _onmessage);

        Event.attachEvent(dom,  Event.W3C_EVT_KEY_DOWN,   0, this, _onkeyevent);
        Event.attachEvent(dom,  Event.W3C_EVT_KEY_UP,     0, this, _onkeyevent);
        
        Event.attachEvent(dom,  Event.W3C_EVT_MOUSE_MOVE, 0, this, _onmouseevent);
        Event.attachEvent(dom,  Event.W3C_EVT_MOUSE_OVER, 0, this, _onmouseevent);
        Event.attachEvent(dom,  Event.W3C_EVT_MOUSE_OUT,  0, this, _onmouseevent);        
        Event.attachEvent(dom,  Event.W3C_EVT_MOUSE_DOWN, 0, this, _onmouseevent);
        Event.attachEvent(dom,  Event.W3C_EVT_MOUSE_UP,   0, this, _onmouseevent);
        Event.attachEvent(dom,  Event.W3C_EVT_MOUSE_WHEEL,0, this, _onmouseevent);
        Event.attachEvent(dom,  Event.W3C_EVT_CONTEXTMENU,0, this, _onmouseevent);
        
        MQ.register("js.awt.event.LayerEvent", this, _notifyLM);

        R = Runtime;

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Container);

