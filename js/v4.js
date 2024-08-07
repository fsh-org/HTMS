/*
  HTMS v4
  Maintained by Fsh-org
*/

// Data
let files = {};
let imports = {};
let obs = [];
let events = [];

// Experimental tags
let exp = {
  noDuplicateStyle: false
}

// Utilities
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Get a file
async function SFile(url) {
  return new Promise((resolve, reject) => {
    if (!files[url]) {
      fetch(url).then(async re => {
        re = await re.text();
        files[url] = re;
        resolve(re)
      })
    } else {
      resolve(files[url])
    }
  });
}

// Replace a element
function SReplace(Obj, str) {
  if(Obj.outerHTML) {
    // New browsers
    Obj.outerHTML = str;
  } else {
    // Old browsers
    let tmpObj = document.createElement("div");
    tmpObj.innerHTML = str;
    ObjParent = Obj.parentNode;
    ObjParent.replaceChild(tmpObj, Obj); 
  }
}

// Run config
function SUpdate() {
  // Check experiments
  if (exp.noDuplicateStyle) {
    if (!document.getElementById('HTMS-style')) {
      document.head.innerHTML += '<style id="HTMS-style">htms{display:none ! important}</style>';
    }
  } else {
    document.head.innerHTML += '<style>htms{display:none ! important}</style>';
  }

  // Remove listeners if there are any
  if (obs.length) {
    obs.forEach(df => {
      df.disconnect()
    })
    events.forEach(ef => {
      ef[0].removeEventListener('input', ef[1])
    })
  }

  // Get config
  let SMainElem = document.querySelector('htms');
  if (!SMainElem) {
    console.warn('HTMS was included but no config was detected');
    return;
  }
  if (document.querySelectorAll('htms').length > 1) {
    console.warn('Multiple htms elements provided, only the first one will take effect');
  }

  // Clean up
  let SConfig = SMainElem.innerHTML
    .split('\n')
    .map(e => e.trim())
    .filter(e => e.length > 0 && !e.startsWith('//'));

  // Read & parse
  for (let line of SConfig) {
    let args = line.split(' ');
    switch (args[0]) {
      case 'import':
        if (args[2] != 'from') {
          throw new Error('Import missing "from"')
        }
        SFile(args[3].slice(1,-1)).then(file => {
          args[1]
            .split(',')
            .map(ee => ee.slice(1,-1))
            .forEach(t => {
              let reg = new RegExp('<sample .*?name="'+t+'".*?>[^¬]*?</sample>');
              imports[t] = file.match(reg)[0].replaceAll(/<sample .+?>|<\/sample>/g, '').trim();
            })
        })
        break;
      case 'inject':
        if (args[2] != 'with') {
          throw new Error('Inject missing "with"')
        }
        Array.from(document.getElementsByTagName(args[1].slice(1,-1))).forEach(async elm => {
          for (let i = 0; i < 5; i++) {
            if (!imports[args[3].slice(1,-1)]) {
              await delay(200)
            }
          }
          if (imports[args[3].slice(1,-1)]) {
            let ht = imports[args[3].slice(1,-1)];
            if ((elm.attributes['var'] || '').value) {
              elm.attributes['var'].value.split(';').filter(e=>e.length).forEach(t=>{
                ht = ht.replaceAll('${'+t.split(':')[0]+'}', t.split(':')[1])
              })
            }
            elm.innerHTML = ht
          } else {
            throw new Error(args[3].slice(1,-1)+' was not defined when inject loaded')
          }
        })
        break;
      case 'replace':
        if (args[2] != 'with') {
          throw new Error('Replace missing "with"')
        }
        Array.from(document.getElementsByTagName(args[1].slice(1,-1))).forEach(async elm => {
          for (let i = 0; i < 5; i++) {
            if (!imports[args[3].slice(1,-1)]) {
              await delay(200)
            }
          }
          if (imports[args[3].slice(1,-1)]) {
            let ht = imports[args[3].slice(1,-1)];
            if ((elm.attributes['var'] || '').value) {
              elm.attributes['var'].value.split(';').filter(e=>e.length).forEach(t=>{
                ht = ht.replaceAll('${'+t.split(':')[0]+'}', t.split(':')[1])
              })
            }
            SReplace(elm, ht)
          } else {
            throw new Error(args[3].slice(1,-1)+' was not defined when replace loaded')
          }
        })
        break;
      case 'module':
        SFile('https://htms.fsh.plus/module/'+args[1].slice(1,-1)+'/module.js').then(code => eval(code))
        break;
      case 'exp':
        exp[args[1]] = true;
        break;
      default:
        throw new Error(args[0]+' is not a valid action');
    }
  }

  // Dynamic vars
  const valueElements = ['input', 'textarea', 'select'];
  Array.from(document.querySelectorAll('[htms-out]')).forEach(u => {
    const tagName = u.tagName.toLowerCase();
  
    const upd = () => {
      const newValue = valueElements.includes(tagName) ? u.value : u.innerHTML;
      document.querySelectorAll(`[htms-in="${u.getAttribute('htms-out')}"]`).forEach(r => {
        if (valueElements.includes(r.tagName.toLowerCase())) {
          r.value = newValue;
        } else {
          r.innerHTML = newValue;
        }
      });
    };

    const observer = new MutationObserver(upd);
    observer.observe(u, { attributes: true, childList: true, subtree: true });
    obs.push(observer);

    u.addEventListener('input', upd);
    events.push([u, upd]);
  });

  // Dispatch load event
  document.dispatchEvent(new Event('SLoad', { bubbles: true }));
}

function SRemoveCache() {
  files = {};
  imports = {};
}

document.addEventListener("DOMContentLoaded", SUpdate)
window.htms = {
  version: 4,
  update: SUpdate,
  removeCache: SRemoveCache
}