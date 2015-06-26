(function(){

    var createXHR = function(){
        var PV = {
            progid: undefined,
            progids:["MSXML2.XMLHTTP.6.0",
                     "MSXML2.XMLHTTP",
                     "Microsoft.XMLHTTP"]
        }, xhr;

        if(self.XMLHttpRequest != undefined){
            xhr = new XMLHttpRequest();
        }else{
            // IE
            if(PV.progid != undefined){
                xhr = new ActiveXObject(PV.progid);
            }else{
                for(var i=0; i<PV.progids.length; i++){
                    PV.progid = PV.progids[i];
                    try{
                        xhr = new ActiveXObject(PV.progid);
                        break;
                    } catch (x) {
                        // Nothing to do
                    }
                }// For
            }// progid
        }
        return xhr;
    };

    var cache = new (function(){
        var local, session;

        this.setItem = function(key, value){
            try{
                local.removeItem(key);
                local.setItem(key, value);
            } catch (e1) {
                try{
                    session.removeItem(key);
                    session.setItem(key, value);
                } catch (e2) {
                }
            }
        };

        this.getItem = function(key){
            var value;

            try{
                value = session.getItem(key);
            } catch (e1) {
            }

            if(!value){
                try{
                    value = local.getItem(key);
                } catch (e2) {
                }
            }

            return value;
        };

        var _init = function(){
            local  = self.localStorage;
            session= self.sessionStorage;
        }();

    })();

    var evalJS = function(text){
        var doc = self.document,
            script = doc.createElement("script"),
            header = doc.getElementsByTagName("head")[0];
        script.type = "text/javascript";
        script.text = text;
        header.appendChild(script);
        header.removeChild(script);
    };
    
    var script = document.getElementById("j$vm");
    if(!script) return;

    var j$vm_home = script.getAttribute("crs") || script.src, 
        p, xhr, packages, srcpath, corefile = "lib/jsre-core.jz";

    if(j$vm_home.indexOf("http") !==0){
        // Not absolute path, we need construct j$vm_home with
        // script.src and script.crs.
        srcpath = script.src;
        p = srcpath.lastIndexOf("/");
        srcpath = srcpath.substring(0, p+1);
        j$vm_home = srcpath + j$vm_home;
    }
    p = j$vm_home.lastIndexOf("/");
    j$vm_home = j$vm_home.substring(0, p+1);
    
    // Use A tag to get a canonical path,
    // here, just for compressing "../" in path. 
    p = document.createElement("A");
    p.href = j$vm_home;
    j$vm_home = p.href;
    
    if(self.JSON == undefined){
        srcpath = j$vm_home+"lib/json2.jz";
        xhr = createXHR();
        xhr.open("GET", srcpath, false);
        xhr.send(null);
        evalJS(xhr.responseText);
    }

    // Load package.jz
    srcpath = j$vm_home + "package.jz";
    xhr = createXHR();
    xhr.open("GET", srcpath+"?__="+new Date().getTime(), false);
    xhr.send(null);
    packages = JSON.parse(xhr.responseText);

    // Load jsre-core
    srcpath = j$vm_home+corefile;
    var cached = cache.getItem(corefile), text;
    if(cached){
        cached = JSON.parse(cached);
        if(cached.build === packages[corefile]){
            text = cached.text;
        }
    }

    if(text == undefined){
        xhr = createXHR();
        xhr.open("GET", srcpath+"?__=0.9."+packages["package.jz"], false);
        xhr.send(null);
        text = xhr.responseText;
        cache.setItem(corefile, JSON.stringify({
            build: packages[corefile],
            text: text
        }));
    }

    self.j$vm_pkgversion = packages;

    evalJS(text);

})();
