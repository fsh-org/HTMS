function ShtmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.children;
}

function Sreplace(Obj,str) {
  if(Obj.outerHTML) {
    Obj.outerHTML= str;
  } else {
    var tmpObj=document.createElement("div");
    tmpObj.innerHTML='<!-- S-html replace -->';
    ObjParent=Obj.parentNode;
     ObjParent.replaceChild(tmpObj,Obj); 
    ObjParent.innerHTML=ObjParent.innerHTML.replace('<div><!-- S-html replace --></div>',str);
  }
}

function SUpdate() {
  document.head.innerHTML += "<style>s-html{display:none ! important}</style>"
  let config = document.getElementsByTagName("s-html");
  if (config.length > 1) {
    console.warn("Only the first s-html element will be read");
  };
  if (config.length < 1) {
    console.warn("S html was added but not used")
    return;
  }
  
  config = config[0].innerHTML.split("\n")
  config.forEach(e => {
    config[config.indexOf(e)] = e.split("").filter(o => !(o == " ")).join("").replaceAll('\"'," ")
  })
  config = config.filter(o => !o=="")

  let data = {};
  config.forEach(e => {
    let t = e.split(" ");
    t = t.slice(0,t.length-1)
    switch (t[0]) {
      case 'import':
        if (t[t.length-2] != "from") {
          throw new Error("import should be followed by name(s) and then a from");
        };
        let tg = t.slice(1,t.length-2)
        for (let i = 0; i<tg.length; i=i+2) {
          data[tg[i]] = t[t.length-1]
        }
        break;
      case 'inject':
        if (t[2] != "with") {
          throw new Error("inject should be followed by name and then a with");
        }
        if (data[t[3]]) {
          Array.from(document.getElementsByTagName(t[1])).forEach(h => {
            fetch(data[t[3]]).then(async tr => {
              let tt = await tr.text();
              let doc = ShtmlToElement(tt)
              let coun = 0;
              Array.from(doc).forEach(s => {
                if (s.attributes[0].nodeValue == t[3]) {
                  coun += 1;
                  let rh = s.innerHTML;
                  let vars = h.getAttribute("var")
                  if (String(vars) != 'null') {
                    vars.split(';').forEach(fr => {
                      let bal = fr.trim().split(':')
                      bal[0]='${'+bal[0]+'}'
                      if (bal.length > 1) {
                     rh = rh.replaceAll(bal[0],bal[1])
                        }
                      })
                    }
                    Sreplace(h, rh)
                  }
                })
                if (coun == 0) {
                  throw new Error(`${t[3]} not defined in ${data[t[3]]}`)
                }
              })
            })
          } else {
          throw new Error(t[3]+" is not defined in inject");
        }
        break;
      case '':
        break;
      default:
        throw new Error("Unknown action "+t[0]);
    }
  })
}

window.addEventListener('load', SUpdate)  