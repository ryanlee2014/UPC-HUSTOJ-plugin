if (window.location.href.match(/status\.php\?(&)?cid/)) {
    var p = new String();
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
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
else if(window.location.href.match(/status.php/)||window.location.href.match(/problemstatus/))
{
    //console.log('test');
    var p = new String();
    var aa=document.body.querySelectorAll('a');
    var atxt=new Array();
    var btxt=new Array();
    var cnt=0;
    var val=0;
    var fuv=0;
    for(var i=0;i<aa.length;i++)
    {
        //console.log(aa[i].href);
        if(aa[i].href.match(/userinfo/))
        {
            var xmlhttp;
            atxt[cnt++]=aa[i].innerText;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.number=cnt-1;
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    p = this.responseText;
                   // console.log(p);

                 //   btxt[fuv++]=xmlhttp.responseText;
                    var x;
                    try{
                        x=p.match(/<caption>[\s\S]{1,60}<a/).toString();
                        var evstr=new String();
                        // evstr+=x.substring(x.indexOf('>')+1,x.indexOf('-'))+" ";
                        evstr+=x.substring(x.lastIndexOf('-')+1,x.lastIndexOf('<'));
                        // console.log(evstr);
                    }
                    catch(e){
                        console.log(e.message);
                    }
                    var div = document.createElement("div");
                    div.innerHTML = evstr;//利用html的特点转义html转义字符
                    evstr = div.innerHTML;
                    btxt[this.number]=evstr;
                    val++;
                    if(cnt==val)
                    {
                        //console.log(btxt);
                        convert();
                    }
                }
            }
            xmlhttp.open("GET", "http://"+window.location.host+"/userinfo.php?user="+aa[i].innerText, true);
            xmlhttp.send();
            //console.log(x);
        }
    }
    function convert() {
        var aa=document.body.querySelectorAll('a');
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
        }
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