document.head.insertAdjacentHTML('beforeend', `<style>
  pb {
    background-color: var(--background, #333);
    display: block;
    width: 12vw;
    height: 1.5vw;
    border-radius: var(--radius, 1rem);
    position: relative;
    margin: 10px;
  }
  pb::after {
    content: "";
    background: var(--color, #88f);
    display: block;
    width: max(var(--width), 1.5vw);
    height: 100%;
    border-radius: var(--radius, 1rem);
    animation-name: var(--animation, none);
    animation-duration: 4s;
    animation-iteration-count: infinite;
  }
  pb::before {
    content: attr(data-width);
    display: var(--txt, block);
    width: 100%;
    text-align: var(--txtpos, center);
    color: var(--txtcolor, #fff);
    font-family: var(--txtfont, Arial);
    font-weight: 600;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
  }
    
  @keyframes LMPulse {
    0%, 100% {filter: brightness(1)}
    50% {filter: brightness(0.8)}
  }
  @keyframes LMRainbow {
    0%, 100% {background-color: rgba(255, 0, 0, 1)}
    10% {background-color: rgba(255, 154, 0, 1)}
    20% {background-color: rgba(208, 222, 33, 1)}
    30% {background-color: rgba(79, 220, 74, 1)}
    40% {background-color: rgba(63, 218, 216, 1)}
    50% {background-color: rgba(47, 201, 226, 1)}
    60% {background-color: rgba(28, 127, 238, 1)}
    70% {background-color: rgba(95, 21, 242, 1)}
    80% {background-color: rgba(186, 12, 248, 1)}
    90% {background-color: rgba(251, 7, 217, 1)}
  }

/*.progress-bar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: 
    radial-gradient(closest-side, white 79%, transparent 80% 100%),
    conic-gradient(hotpink 75%, pink 0);    
}*/
</style>`)
let s = document.createElement('script')
s.innerHTML = `/*<script>*/
  function HLM_SetText() {
    Array.from(document.getElementsByTagName('pb')).forEach(pb => {
      pb.setAttribute('data-width', pb.style.getPropertyValue('--width'))
      const HLM_Observer = new MutationObserver(function(){pb.setAttribute('data-width', pb.style.getPropertyValue('--width'))});
      HLM_Observer.observe(pb, { attributes : true, attributeFilter : ['style'] });
    })
  }
  
HLM_SetText()
`//</script>`)
document.head.appendChild(s)
