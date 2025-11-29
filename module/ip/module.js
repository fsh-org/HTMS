function IP() {
  return new Promise((resolve, reject) => {
    fetch('https://api.fsh.plus/ip')
      .then(e=>e.json())
      .then(e=>resolve(e.ip))
      .catch(_=>reject());
  });
}

window.IP = IP