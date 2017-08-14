function status_ajax() {
    let tbody_html = document.getElementsByTagName("tbody")[0].childNodes;
    let length = tbody_html.length;
    for (let i = 1; i < length; ++i) {
        let xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.id = i;
        let runner_id = tbody_html[i].childNodes[0].innerText;
        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log(this.id);
                let response = this.responseText;
                response = response.split(",");
                let target = document.getElementsByTagName("tbody")[0].childNodes[this.id];
                //console.log(target);
                target.childNodes[4].innerText = response[1] + "KB";
                target.childNodes[5].innerText = response[2];
            }
        };
        // console.log(runner_id);
        xmlhttp.open("GET", "status-ajax.php?solution_id=" + runner_id, true);
        xmlhttp.send();
    }
}


let ar = [];
if (window.location.href.match(/status\.php\??[\s\S]{0,60}cid/)) {
    let p = "";
    let xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        console.log("readyState=" + xmlhttp.readyState + ",status=" + xmlhttp.status);
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            p = xmlhttp.responseText;
            let doc = p.match(/<tbody[\s\S]+\/tbody>/);
            //console.log(doc);
            let ll = doc.toString().match(/\?user=[\s\S]{4,20}>[^0-9][\s\S]{0,30}<\/a>/g);
            // console.log(ll);
            let parstr = "";
            for (let i = 0; i < ll.length; i++) {
                if (i % 2 === 1) {
                    if (i === 0) {
                        parstr += "if(p==\"" + ll[i].substring(ll[i].indexOf("=") + 1, ll[i].indexOf(">")) + "\")\n{\n";
                        parstr += "dd[i].innerText=\"" + ll[i].substring(ll[i].indexOf(">") + 1, ll[i].indexOf("/") - 1) + "\"+'--'+dd[i].innerText;\n}\n";
                    }
                    else {
                        parstr += "if(p==\"" + ll[i].substring(ll[i].indexOf("=") + 1, ll[i].indexOf(">")) + "\")\n{\n";
                        parstr += "dd[i].innerText=\"" + ll[i].substring(ll[i].indexOf(">") + 1, ll[i].indexOf("/") - 1) + "\"+'--'+dd[i].innerText;\n}\n";
                    }
                }
            }
            let div = document.createElement("div");
            div.innerHTML = parstr;//利用html的特点转义html转义字符
            parstr = div.innerHTML;
            //console.log(parstr);
            let dd = document.body.querySelectorAll('a');
            for (let i = 0; i < dd.length; i++) {
                let p = dd[i].innerText;
                eval(parstr);
            }
            status_ajax();
        }
    };
    xmlhttp.open("GET", "contestrank.php?" + window.location.href.match(/cid=[0-9]{1,9}/), false);
    xmlhttp.send();
}
else if (window.location.href.match(/status.php/) || window.location.href.match(/problemstatus/)) {
    //console.log('test');
    let p;
    let aa = document.body.querySelectorAll('a');
    let atxt = [];
    let btxt = [];
    let cnt = 0;
    let val = 0;
    let fuv = 0;
    for (let i = 5; i < aa.length; i++) {
        // console.log(aa[i].innerText);
        if (aa[i].href.match(/userinfo/)) {
            let exist = true;
            //console.log(aa[i].innerText);
            //  console.log(aa[i].innerText);
            for (let j = 5; j < i; j++) {
                if (aa[j].innerText === aa[i].innerText && aa[i].href === aa[j].href) {
                    exist = false;
                    //console.log(aa[i].innerText + i);
                    //  console.log(aa[j].innerText + j);
                    break;
                }
            }
            if (exist) {
                let xmlhttp;
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
                    let evstr="";
                    //console.log("readyState="+xmlhttp.readyState+",status="+xmlhttp.status);
                    if (this.readyState === 4 && this.status === 200) {
                        p = this.responseText;
                        // console.log(p);

                        //   btxt[fuv++]=xmlhttp.responseText;
                        let x;
                        try {
                            //console.log(p);
                            x = p.match(/<caption>[\s\S]{1,80}<a/).toString();
                            // evstr+=x.substring(x.indexOf('>')+1,x.indexOf('-'))+" ";
                            evstr += x.substring(x.lastIndexOf('--') + 2, x.lastIndexOf('<'));
                            // console.log(evstr);
                        }
                        catch (e) {
                            console.log(e.message);
                        }
                        let div = document.createElement("div");
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
        let aa = document.body.querySelectorAll('a');
        let innex = ar[n];
        //   console.log(ar);
        for (let i = 0; i < aa.length; i++) {
            if (aa[i].innerText === innex) {
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
