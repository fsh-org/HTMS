let files = {};
let imports = {};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function SFile(url) {
  return new Promise((resolve, reject) => {
    if (!files[url]) {
      fetch(url).then(async re =>{
        re = await re.text()
        files[url] = re
        resolve(re)
      })
    } else {
      resolve(files[url])
    }
  });
}

function SReplace(Obj,str) {
  if(Obj.outerHTML) {
    Obj.outerHTML= str;
  } else {
    var tmpObj=document.createElement("div");
    tmpObj.innerHTML='<!-- Htms replace -->';
    ObjParent=Obj.parentNode;
     ObjParent.replaceChild(tmpObj,Obj); 
    ObjParent.innerHTML=ObjParent.innerHTML.replace('<div><!-- Htms replace --></div>',str);
  }
}

function SUpdate() {
  document.head.innerHTML += "<style>htms{display:none ! important}</style>"
  
  let SMainElem = Array.from(document.getElementsByTagName('htms'))
  if (SMainElem.length > 1) {
    console.warn('Multiple htms elements provided, only the first one will take effect')
  } else if (SMainElem.length < 1) {
    console.warn('HTMS was included but no config was detected')
    return;
  }
  SMainElem = SMainElem[0]
    
  let SFig = SMainElem.innerHTML.split('\n').filter(e=>{return e.length > 0});
  SFig = SFig.map(e=>{return e.split(' ').filter(d=>{return d.length>0}).join(' ')});
  SFig = SFig.filter(e=>{return e.length > 0});
  SFig = SFig.filter(e=>{return !e.startsWith('//')});

  for (let line in SFig) {
    line = SFig[line]
    let args = line.split(' ')
    let action = args[0]
    if (action == "import") {
      if (args[2] != 'from') {
        throw new Error('Import missing "from"')
        return;
      }

      args[3] = args[3].slice(1, args[3].length-1)

      SFile(args[3]).then(dd=>{
          args[1].split(',').map(ee =>{return ee.slice(1,ee.length-1)}).forEach(t => {
          let reg = new RegExp('<sample .*?name="'+t+'".*?>[^✓]*?</sample>')
          imports[t] = dd.match(reg)[0].replaceAll(/<sample .+?>|<\/sample>/g, '').trim()
        })
      })
    } else if (action == "inject") {
      if (args[2] != 'with') {
        throw new Error('Inject missing "with"')
        return;
      }

      Array.from(document.getElementsByTagName(args[1].slice(1,args[1].length-1))).forEach(async elm => {
        for (let i = 0; i < 5; i++) {
          if (!imports[args[3].slice(1,args[3].length-1)]) {
            await delay(500)
          }
        }
        if (imports[args[3].slice(1,args[3].length-1)]) {
          let ht = imports[args[3].slice(1,args[3].length-1)];
          if ((elm.attributes['var'] || '').value) {
            elm.attributes['var'].value.split(';').filter(e=>e.length).forEach(t=>{
              ht = ht.replaceAll('${'+t.split(':')[0]+'}', t.split(':')[1])
            })
          }
          elm.innerHTML = ht
        } else {
          throw new Error(args[3].slice(1,args[3].length-1)+' was not defined when inject loaded')
        }
      })
    } else if (action == "replace") {
      if (args[2] != 'with') {
        throw new Error('Replace missing "with"')
        return;
      }

      Array.from(document.getElementsByTagName(args[1].slice(1,args[1].length-1))).forEach(async elm => {
        for (let i = 0; i < 5; i++) {
          if (!imports[args[3].slice(1,args[3].length-1)]) {
            await delay(500)
          }
        }
        if (imports[args[3].slice(1,args[3].length-1)]) {
          let ht = imports[args[3].slice(1,args[3].length-1)];
          if ((elm.attributes['var'] || '').value) {
            elm.attributes['var'].value.split(';').filter(e=>e.length).forEach(t=>{
              ht = ht.replaceAll('${'+t.split(':')[0]+'}', t.split(':')[1])
            })
          }
          SReplace(elm, ht)
        } else {
          throw new Error(args[3].slice(1,args[3].length-1)+' was not defined when replace loaded')
        }
      })
    } else if (action == "module") {
      fetch('https://htms.fsh.plus/module/'+args[1].slice(1,args[1].length-1)+'/module.js').then(async h => {
        h = await h.text();
        eval(h);
      })
    } else {
      throw new Error(action+' Is not a valid action')
    }
  }
  var Sload = new Event('SLoad');
  document.dispatchEvent(Sload);
}

function SRemoveCache() {
  files = {};
  imports = {};
}

document.addEventListener("DOMContentLoaded", SUpdate)
window.SUpdate = SUpdate;
window.SRemoveCache = SRemoveCache;