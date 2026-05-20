// GSAP Cinematic Animations
function initAnimations(){
gsap.registerPlugin(ScrollTrigger);

// Preloader
const tl=gsap.timeline();
tl.to('#preloader .loader-bar',{scaleX:1,duration:1.5,ease:'power2.inOut'})
.to('#preloader',{yPercent:-100,duration:0.8,ease:'power3.inOut',delay:0.2})
.set('#preloader',{display:'none'});

// Hero reveal
tl.from('#heroCanvas',{opacity:0,scale:1.2,duration:1.5,ease:'power2.out'},'-=0.5')
.from('.hero-badge',{y:40,opacity:0,duration:0.8,ease:'power3.out'},'-=1')
.from('.hero-title span',{y:80,opacity:0,duration:1,stagger:0.15,ease:'power3.out'},'-=0.6')
.from('.hero-sub',{y:30,opacity:0,duration:0.8,ease:'power3.out'},'-=0.5')
.from('.hero-search',{y:40,opacity:0,scale:0.95,duration:0.8,ease:'back.out(1.2)'},'-=0.3')
.from('.hero-stat',{y:30,opacity:0,duration:0.6,stagger:0.1,ease:'power3.out'},'-=0.3');

// Nav scroll
ScrollTrigger.create({trigger:'body',start:'60px top',onEnter:()=>document.getElementById('mainNav').classList.add('scrolled'),onLeaveBack:()=>document.getElementById('mainNav').classList.remove('scrolled')});

// Section headers
gsap.utils.toArray('.section-head').forEach(el=>{
gsap.from(el.children,{y:60,opacity:0,duration:0.8,stagger:0.12,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 80%'}});
});

// Service cards
gsap.utils.toArray('.svc-card').forEach((el,i)=>{
gsap.from(el,{y:80,opacity:0,scale:0.95,duration:0.8,delay:i*0.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%'}});
});

// Stats counter
gsap.utils.toArray('[data-count]').forEach(el=>{
const target=parseInt(el.dataset.count);
ScrollTrigger.create({trigger:el,start:'top 85%',onEnter:()=>{
gsap.to(el,{duration:2,ease:'power2.out',onUpdate:function(){
const v=Math.round(this.progress()*target);
el.textContent=v.toLocaleString('en-US');
}});
}});
});

// Why section
gsap.from('.why-item',{x:-60,opacity:0,duration:0.7,stagger:0.15,ease:'power3.out',scrollTrigger:{trigger:'.why-section',start:'top 70%'}});

// Globe parallax on scroll
gsap.to('#heroCanvas',{y:150,ease:'none',scrollTrigger:{trigger:'.hero-section',start:'top top',end:'bottom top',scrub:true}});

// Partners marquee
gsap.to('.marquee-inner',{xPercent:-50,duration:20,ease:'none',repeat:-1});

// Magnetic buttons
document.querySelectorAll('.magnetic').forEach(btn=>{
btn.addEventListener('mousemove',e=>{
const r=btn.getBoundingClientRect();
const x=e.clientX-r.left-r.width/2;
const y=e.clientY-r.top-r.height/2;
gsap.to(btn,{x:x*0.3,y:y*0.3,duration:0.3,ease:'power2.out'});
});
btn.addEventListener('mouseleave',()=>gsap.to(btn,{x:0,y:0,duration:0.5,ease:'elastic.out(1,0.3)'}));
});

// Text split reveal for footer
gsap.from('.footer-col',{y:50,opacity:0,duration:0.8,stagger:0.12,ease:'power3.out',scrollTrigger:{trigger:'footer',start:'top 85%'}});
}
