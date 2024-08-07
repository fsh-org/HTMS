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
// Get sample
function SGetSample(args, type) {
  args[3] = args[3].slice(1,-1);
  Array.from(document.getElementsByTagName(args[1].slice(1,-1))).forEach(async elm => {
    for (let i = 0; i < 20; i++) {
      if (!imports[args[3]]) {
        await delay(100)
      }
    }
    let sample = imports[args[3]];
    if (sample) {
      if ((elm.getAttribute('var') || '').value) {
        elm.getAttribute('var').value.split(';').filter(e=>e.length).forEach(t=>{
          t = t.split(':');
          sample = sample.replaceAll(`\${${t[0]}}`, t[1])
        })
      }
      if (type === 'inject') {
        elm.innerHTML = sample;
      } else {
        SReplace(elm, sample);
      }
    } else {
      throw new Error(args[3]+' was not defined when '+type+' loaded')
    }
  })
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
            .map(name => name.slice(1,-1))
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
        SGetSample(args, 'inject')
        break;
      case 'replace':
        if (args[2] != 'with') {
          throw new Error('Replace missing "with"')
        }
        SGetSample(args, 'replace')
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
