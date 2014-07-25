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

    var script = document.getElementById("j$vm");
    if(!script) return;

    var j$vm_home = script.src || script.crs, p, xhr, packages, srcpath;
    p = j$vm_home.lastIndexOf("/");
    j$vm_home = j$vm_home.substring(0, p);

    // Load package.jz
    srcpath = j$vm_home + "/package.jz";
    xhr = createXHR();
    xhr.open("GET", srcpath, false);
    xhr.send(null);
    packages = JSON.parse(xhr.responseText);

    // Load jsre-core
    srcpath = j$vm_home+"/jsre-core.jz";
    var cached = cache.getItem("jsre-core.jz"), text;
    if(cached){
        cached = JSON.parse(cached);
        if(cached.build === packages["jsre-core.jz"]){
            text = cached.text;
        }
    }

    if(text == undefined){
        xhr = createXHR();
        xhr.open("GET", srcpath, false);
        xhr.send(null);
        text = xhr.responseText;
        cache.setItem("jsre-core.jz", JSON.stringify({
            build: packages["jsre-core.jz"],
            text: text
        }));
    }

    self.j$vm_pkgversion = packages;

    script = document.createElement("script");
    p = document.getElementsByTagName("head")[0];
    script.type = "text/javascript";
    script.text = text;
    p.appendChild(script);
    p.removeChild(script);

})();