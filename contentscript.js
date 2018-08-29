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
function judgeValid() {
    let $script = document.querySelectorAll("script");
    let len = $script.length;
    //let flag = false;
    //console.log($script);
    for(let i = 0;i<len;++i)
    {
        let str = $script[i].getAttribute("src");
        //console.log($script[i]);
        if(str && str.indexOf("auto_refresh") !== -1) {
            return false;
        }
    }
    return true;
}

let ar = [];
(function(){
    if (window.location.href.match(/status\.php\??[\s\S]{0,60}cid/)) {
        if(judgeValid()) {
            return;
        }
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
        if(judgeValid()) {
            return;
        }
        let p;
        let aa = document.body.querySelectorAll('a');
        let atxt = [];
        let btxt = [];
        let cnt = 0;
        let val = 0;
        let fuv = 0;
        for (let i = 5; i < aa.length; i++) {
            if (aa[i].href.match(/userinfo/)) {
                let exist = true;
                for (let j = 5; j < i; j++) {
                    if (aa[j].innerText === aa[i].innerText && aa[i].href === aa[j].href) {
                        exist = false;
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
                        if (this.readyState === 4 && this.status === 200) {
                            p = this.responseText;
                            let x;
                            try {
                                x = p.match(/<caption>[\s\S]{1,80}<a/).toString();
                                evstr += x.substring(x.lastIndexOf('--') + 2, x.lastIndexOf('<'));
                            }
                            catch (e) {
                                console.log(e.message);
                            }
                            let div = document.createElement("div");
                            div.innerHTML = evstr;//利用html的特点转义html转义字符
                            evstr = div.innerHTML;
                            btxt[this.number] = evstr;
                            val++;
                            convert(this.number);
                        }
                    };
                    xmlhttp.open("GET", aa[i].href, true);
                    xmlhttp.send();
                }
            }
        }
        function convert(n) {
            let aa = document.body.querySelectorAll('a');
            let innex = ar[n];
            for (let i = 0; i < aa.length; i++) {
                if (aa[i].innerText === innex) {
                    aa[i].innerText = btxt[n] + "--" + ar[n];
                }
            }
        }
    }
})();
