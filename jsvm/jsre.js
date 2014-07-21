(function(){

    var _createXHR = function(){
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

    var script = document.getElementById("j$vm");
    if(script){
        var srcpath = script.src || script.crs, p, xhr;
        p = srcpath.lastIndexOf("/");
        srcpath = srcpath.substring(0, p);
        srcpath += "/jsre-core.jz?_="+(new Date()).getTime();

        xhr = _createXHR();
        xhr.open("GET", srcpath, false);
        xhr.send(null);

        script = document.createElement("script");
        p = document.getElementsByTagName("head")[0];
        script.type = "text/javascript";
        script.text = xhr.responseText;
        p.appendChild(script);
        p.removeChild(script);
    }

})();