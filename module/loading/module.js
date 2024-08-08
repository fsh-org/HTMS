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
    0%, 100% {background-color: hsl(0, 100%, 50%)}
    5% {background-color: hsl(18, 100%, 50%)}
    10% {background-color: hsl(36, 100%, 50%)}
    15% {background-color: hsl(54, 100%, 50%)}
    20% {background-color: hsl(72, 100%, 50%)}
    25% {background-color: hsl(90, 100%, 50%)}
    30% {background-color: hsl(108, 100%, 50%)}
    35% {background-color: hsl(126, 100%, 50%)}
    40% {background-color: hsl(144, 100%, 50%)}
    45% {background-color: hsl(162, 100%, 50%)}
    50% {background-color: hsl(180, 100%, 50%)}
    55% {background-color: hsl(198, 100%, 50%)}
    60% {background-color: hsl(216, 100%, 50%)}
    65% {background-color: hsl(234, 100%, 50%)}
    70% {background-color: hsl(252, 100%, 50%)}
    75% {background-color: hsl(270, 100%, 50%)}
    80% {background-color: hsl(288, 100%, 50%)}
    85% {background-color: hsl(306, 100%, 50%)}
    90% {background-color: hsl(324, 100%, 50%)}
    95% {background-color: hsl(342, 100%, 50%)}
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
