function IP(type) {
  return new Promise((resolve, reject) => {
    fetch('https://api.fsh.plus/ip').then(async e=>{
      e = await e.json();
      if (!type) resolve(e.public);
      if (type == "private") resolve(e.ip);
      if (type == "public") resolve(e.public);
      if (type == "all") resolve({public: e.public, private: e.ip});
      resolve(e.ip)
    })
  });
}

window.IP = IP
