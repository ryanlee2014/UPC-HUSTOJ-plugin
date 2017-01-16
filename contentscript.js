var ar = new Array();
if (window.location.href.match(/status\.php\??[\s\S]{0,60}cid/)) {
    var p = new String();
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        console.log("readyState="+xmlhttp.readyState+",status="+xmlhttp.status);
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            p = xmlhttp.responseText;
            var doc = p.match(/<tbody[\s\S]+\/tbody>/);
            //console.log(doc);
            var ll = doc.toString().match(/\?user=[\s\S]{4,20}>[^0-9A-Za-z]{1}[\s\S]{0,30}<\/a>/g);
            //console.log(ll);
            var parstr = new String();
            for (var i = 0; i < ll.length; i++) {
                if (i == 0) {
                    parstr += "if(p==\"" + ll[i].substring(ll[i].indexOf("=") + 1, ll[i].indexOf(">")) + "\")\n{\n";
                    parstr += "dd[i].innerText=\"" + ll[i].substring(ll[i].indexOf(">") + 1, ll[i].indexOf("/") - 1) + "\"+'--'+dd[i].innerText;\n}\n";
                }
                else {
                    parstr += "if(p==\"" + ll[i].substring(ll[i].indexOf("=") + 1, ll[i].indexOf(">")) + "\")\n{\n";
                    parstr += "dd[i].innerText=\"" + ll[i].substring(ll[i].indexOf(">") + 1, ll[i].indexOf("/") - 1) + "\"+'--'+dd[i].innerText;\n}\n";
                }
            }
            var div = document.createElement("div");
            div.innerHTML = parstr;//利用html的特点转义html转义字符
            parstr = div.innerHTML;
            //console.log(parstr);
            var dd = document.body.querySelectorAll('a');
            for (var i = 0; i < dd.length; i++) {
                var p = dd[i].innerText;
                eval(parstr);
            }
        }
    }
    xmlhttp.open("GET", "contestrank.php?" + window.location.href.match(/cid=[0-9]{1,9}/), false);
    xmlhttp.send();
}
else if (window.location.href.match(/status.php/) || window.location.href.match(/problemstatus/)) {
    //console.log('test');
    var p = new String();
    var aa = document.body.querySelectorAll('a');
    var atxt = new Array();
    var btxt = new Array();
    var cnt = 0;
    var val = 0;
    var fuv = 0;
    for (var i = 5; i < aa.length; i++) {
        // console.log(aa[i].innerText);
        if (aa[i].href.match(/userinfo/)) {
            var exist = new Boolean();
            exist = true;
            //console.log(aa[i].innerText);
            //  console.log(aa[i].innerText);
            for (var j = 5; j < i; j++) {
                if (aa[j].innerText == aa[i].innerText&&aa[i].href==aa[j].href) {
                    exist = false;
                    //console.log(aa[i].innerText + i);
                    //  console.log(aa[j].innerText + j);
                    break;
                }
            }
            if (exist) {
                var xmlhttp;
                atxt[cnt] = aa[i].innerText;
                ar[cnt++] = aa[i].innerText;
                if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                    xmlhttp = new XMLHttpRequest();
                }
                else {// code for IE6, IE5
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xmlhttp.number = cnt - 1;
                xmlhttp.onreadystatechange = function () {
                    //console.log("readyState="+xmlhttp.readyState+",status="+xmlhttp.status);
                    if (this.readyState == 4 && this.status == 200) {
                        p = this.responseText;
                        // console.log(p);

                        //   btxt[fuv++]=xmlhttp.responseText;
                        var x;
                        try {
                        	//console.log(p);
                            x = p.match(/<caption>[\s\S]{1,80}<a/).toString();
                            var evstr = new String();
                            // evstr+=x.substring(x.indexOf('>')+1,x.indexOf('-'))+" ";
                            evstr += x.substring(x.lastIndexOf('--') + 2, x.lastIndexOf('<'));
                            // console.log(evstr);
                        }
                        catch (e) {
                            console.log(e.message);
                        }
                        var div = document.createElement("div");
                        div.innerHTML = evstr;//利用html的特点转义html转义字符
                        evstr = div.innerHTML;
                        btxt[this.number] = evstr;
                        val++;
                        // if(cnt==val)
                        // {
                        //console.log(btxt);
                        convert(this.number);
                        // console.log(btxt[this.number]);
                        //  }
                    }
                };
                xmlhttp.open("GET", aa[i].href, true);
                xmlhttp.send();
                //console.log(x);
            }
        }
    }
    function convert(n) {
        var aa = document.body.querySelectorAll('a');
        var innex = new String();
        innex = ar[n];
        //   console.log(ar);
        for (var i = 0; i < aa.length; i++) {
            if (aa[i].innerText == innex) {
                aa[i].innerText = btxt[n] + "--" + ar[n];
                //console.log(ar[n]);
                // console.log(btxt[n]);
            }
        }
        //ar[n].innerText=btxt[n]+"--"+ar[n].innerText;
        /*
         for(var i=0;i<aa.length;i++)
         {
         if(aa[i].href.match(/userinfo/))
         {
         for(var j=0;j<atxt.length;j++)
         {
         if(aa[i].innerText==atxt[j])
         {
         aa[i].innerText=btxt[j]+"--"+aa[i].innerText;
         }
         }
         }
         }*/
    }

    /*for(var i=0;i<aa.length;i++)
     {
     if(aa[i].href.match(/userinfo/))
     {
     var x=p[cnt++].toString().match(/<caption>[\s\S]{1,30}<a/).toString();
     var evstr=new String();
     // evstr+=x.substring(x.indexOf('>')+1,x.indexOf('-'))+" ";
     evstr+=x.substring(x.lastIndexOf('-')+1,x.lastIndexOf('<'));
     console.log(evstr);
     aa[i].innerText=evstr;
     }
     }*/

}
